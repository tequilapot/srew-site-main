export default function handler(_req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ enabled: Boolean(clientId), clientId: clientId || null });
}
