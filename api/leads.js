import { createHash, randomBytes } from "node:crypto";

const requestsByClient = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const MAX_BODY_BYTES = 16 * 1024;

function send(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function clean(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function requestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}

function checkOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;
  try {
    return new URL(origin).host.toLowerCase() === String(host).toLowerCase();
  } catch {
    return false;
  }
}

function checkRateLimit(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const address = forwarded || String(req.socket?.remoteAddress || "unknown");
  const key = createHash("sha256").update(address).digest("hex").slice(0, 24);
  const now = Date.now();
  const prior = requestsByClient.get(key);
  if (!prior || now - prior.startedAt > RATE_LIMIT_WINDOW_MS) {
    requestsByClient.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (prior.count >= RATE_LIMIT_MAX) return false;
  prior.count += 1;
  return true;
}

function textContext(context) {
  if (!context || typeof context !== "object") return "";
  const fields = [
    ["Current page", clean(context.currentPage, 240)],
    ["First page", clean(context.landingPage, 240)],
    ["Referrer", clean(context.referrer, 240)],
    ["UTM source", clean(context.utmSource, 120)],
    ["UTM medium", clean(context.utmMedium, 120)],
    ["UTM campaign", clean(context.utmCampaign, 160)],
    ["UTM term", clean(context.utmTerm, 160)],
    ["UTM content", clean(context.utmContent, 160)],
    ["Google click ID", clean(context.googleClickId, 240)],
    ["Google account ID", clean(context.googleSubject, 200)],
  ].filter(([, value]) => value);
  return fields.map(([label, value]) => `${label}: ${value}`).join("\n");
}

async function verifyGoogleIdentity(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Google sign-in is not configured");

  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("id_token", idToken);
  const response = await fetch(url, { method: "GET", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Google identity could not be verified");
  const claims = await response.json();
  if (
    claims.aud !== clientId ||
    !["accounts.google.com", "https://accounts.google.com"].includes(claims.iss) ||
    Number(claims.exp) * 1000 <= Date.now() ||
    String(claims.email_verified) !== "true" ||
    !claims.sub
  ) {
    throw new Error("Google identity could not be verified");
  }
  return {
    subject: clean(claims.sub, 200),
    email: clean(claims.email, 200),
    name: clean(claims.name, 120),
  };
}

async function postToSheet(endpoint, fields) {
  if (!endpoint) throw new Error("Lead sheet endpoint is not configured");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams(fields),
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
  });
  const body = (await response.text()).trim();
  if (!response.ok || /accounts\.google\.com/i.test(response.url)) {
    throw new Error("Lead sheet did not accept the request");
  }
  if (body.startsWith("{")) {
    try {
      const result = JSON.parse(body);
      if (result.success === false || result.ok === false || result.status === "error") {
        throw new Error("Lead sheet did not accept the request");
      }
    } catch (error) {
      if (error.message === "Lead sheet did not accept the request") throw error;
    }
  } else if (/^(error|exception|unauthorized)\b/i.test(body)) {
    throw new Error("Lead sheet did not accept the request");
  }
}

class DeliveryError extends Error {
  constructor(channel, code, status = null) {
    super(`${channel}: ${code}`);
    this.channel = channel;
    this.code = code;
    this.status = status;
  }
}

async function notifySales(fields) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) throw new DeliveryError("email", "not_configured");
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response;
    try {
      response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: accessKey, ...fields }),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // Delivery is ambiguous after a transport timeout; do not risk sending twice.
      throw new DeliveryError("email", "transport_error");
    }
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.success === true) return;
    // Retry a rate-limit rejection once, respecting a short Retry-After only.
    const retryAfter = response.headers.get("retry-after");
    const delay = retryAfter == null ? 500 : Number(retryAfter) * 1000;
    if (response.status === 429 && attempt === 0 && Number.isFinite(delay) && delay >= 0 && delay <= 1500) {
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    // Never log provider response bodies: they can contain submitted personal data.
    throw new DeliveryError("email", response.ok ? "provider_rejected" : "http_error", response.status);
  }
}

function deliveryFailure(result, channel) {
  if (result.status === "fulfilled") return null;
  const error = result.reason;
  return {
    channel,
    code: error instanceof DeliveryError ? error.code : "delivery_failed",
    status: error instanceof DeliveryError ? error.status : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed" });
  }
  const bodySize = Number(req.headers["content-length"] || 0);
  if (bodySize > MAX_BODY_BYTES) return send(res, 413, { ok: false, error: "Request is too large" });
  if (!checkOrigin(req)) return send(res, 403, { ok: false, error: "Request origin is not allowed" });
  if (!checkRateLimit(req)) return send(res, 429, { ok: false, error: "Please wait a few minutes before trying again" });

  const body = requestBody(req);
  if (!body || typeof body !== "object") return send(res, 400, { ok: false, error: "Invalid request" });

  // A filled honeypot is silently accepted to avoid teaching simple bots how to evade it.
  if (clean(body.website, 200)) return send(res, 200, { ok: true, leadId: "" });

  const formType = clean(body.formType, 30).toLowerCase();
  if (!["quote", "contact", "brochure", "industry"].includes(formType)) {
    return send(res, 400, { ok: false, error: "Invalid enquiry type" });
  }

  let googleIdentity = null;
  const idToken = clean(body.googleIdToken, 6000);
  if (idToken) {
    try {
      googleIdentity = await verifyGoogleIdentity(idToken);
    } catch {
      return send(res, 400, { ok: false, error: "Google sign-in could not be verified. Please enter your details manually." });
    }
  }

  const lead = {
    name: clean(body.name, 120) || googleIdentity?.name || "",
    email: clean(body.email, 200) || googleIdentity?.email || "",
    phone: clean(body.phone, 60),
    company: clean(body.company, 160),
    location: clean(body.location, 160),
    capacity: clean(body.capacity, 100),
    material: clean(body.material, 160),
    interest: clean(body.interest, 180),
    timeline: clean(body.timeline, 100),
    requirement: clean(body.requirement, 1200),
    subject: clean(body.subject, 180),
    message: clean(body.message, 2400),
  };
  if (!lead.name || (formType !== "brochure" && !lead.email) || (formType !== "contact" && !lead.phone)) {
    return send(res, 400, { ok: false, error: "Please provide your name, email and phone number" });
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
    return send(res, 400, { ok: false, error: "Please enter a valid email address" });
  }

  const leadId = `SREW-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(3).toString("hex").toUpperCase()}`;
  const context = { ...(body.pageContext || {}), googleSubject: googleIdentity?.subject || "" };
  const attribution = textContext(context);
  const requirement = [lead.interest, lead.capacity, lead.material, lead.location, lead.company, lead.timeline, lead.requirement]
    .filter(Boolean)
    .join(" | ")
    .slice(0, 1200);
  const message = [lead.message, attribution].filter(Boolean).join("\n\n").slice(0, 3600);
  const subject = `[${leadId}] ${lead.subject || lead.interest || formType} enquiry`;
  const sheetEndpoint = formType === "brochure"
    ? process.env.GOOGLE_SHEETS_CONTACT_URL
    : process.env.GOOGLE_SHEETS_GENERAL_URL;
  const sheetFields = formType === "brochure"
    ? {
        name: lead.name,
        email: "",
        phone: lead.phone,
        subject,
        message,
        requirement,
        source: formType,
      }
    : {
        name: lead.name,
        email: lead.phone,
        phone: lead.email,
        subject,
        message,
        requirement,
        source: formType,
      };
  const emailFields = {
    name: lead.name,
    email: lead.email,
    replyto: lead.email,
    phone: lead.phone,
    subject,
    from_name: "SREW Projects Website",
    message: [
      `Lead reference: ${leadId}`,
      `Type: ${formType}`,
      `Name: ${lead.name}`,
      lead.company && `Company: ${lead.company}`,
      lead.email && `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      lead.interest && `Machine / interest: ${lead.interest}`,
      lead.capacity && `Capacity: ${lead.capacity}`,
      lead.material && `Material: ${lead.material}`,
      lead.location && `Location: ${lead.location}`,
      lead.timeline && `Timeline: ${lead.timeline}`,
      lead.requirement && `Requirement: ${lead.requirement}`,
      lead.message && `Message: ${lead.message}`,
      attribution,
    ].filter(Boolean).join("\n"),
  };

  const results = await Promise.allSettled([
    postToSheet(sheetEndpoint, sheetFields),
    notifySales(emailFields),
  ]);
  const sheetSaved = results[0].status === "fulfilled";
  const emailSent = results[1].status === "fulfilled";
  if (!sheetSaved || !emailSent) {
    console.error("Lead delivery degraded", {
      leadId, formType, sheetSaved, emailSent,
      failures: results.map((result, index) => deliveryFailure(result, index === 0 ? "sheet" : "email")).filter(Boolean),
    });
  }
  if (!sheetSaved && !emailSent) {
    return send(res, 502, { ok: false, error: "We could not save your enquiry just now. Please try again or contact us by phone or WhatsApp." });
  }
  return send(res, 200, { ok: true, leadId, delivery: { sheetSaved, emailSent } });
}

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };
