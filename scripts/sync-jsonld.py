#!/usr/bin/env python3
"""Rewrite schema.org JSON-LD so it matches visible page content.

Visible HTML is not modified. Facts are taken from the page copy already
in each file: FAQ text, breadcrumbs, prices, project statements, and the
published business identity.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.srewprojects.com"
PHONES = ["+91-8790759460", "+91-6281665454"]
ORG_ID = f"{SITE}/#organization"
BIZ_ID = f"{SITE}/#business"
PARENT_ID = f"{SITE}/#legal-entity"
LOGO_URL = f"{SITE}/images/logo.png"
BUSINESS_PAGES = {"index.html", "about.html", "contact.html"}
PROJECT_PAGES = {
    "project-singareni.html",
    "project-west-bengal.html",
    "project-odisha-mobile.html",
    "project-keesara.html",
    "project-hyderabad-recycling.html",
}
HOMEPAGE_WEBPAGE_NAME = "SREW Projects - Crushing, Screening & Washing Plant Solutions"
BUSINESS_DESCRIPTION = (
    "SREW Projects is a unit of S.R.Engineering Works. "
    "ISO 9001:2015 Certified Manufacturer of Crushing, Screening & Sand Processing Plants "
    "| 2–250 TPH | Hyderabad, India."
)

SCRIPT_RE = re.compile(
    r"<script\b[^>]*type=[\"']application/ld\+json[\"'][^>]*>[\s\S]*?</script>",
    re.I,
)
TAG_RE = re.compile(r"<[^>]+>")

ADDRESS = {
    "@type": "PostalAddress",
    "streetAddress": "Sy.No.155/A, Ayyappa Temple Road, Dullapally, Medchal-Malkajgiri",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "postalCode": "500100",
    "addressCountry": "IN",
}
LOGO = {
    "@type": "ImageObject",
    "@id": f"{SITE}/#logo",
    "url": LOGO_URL,
    "contentUrl": LOGO_URL,
    "width": 299,
    "height": 117,
}
CREDENTIAL = {
    "@type": "EducationalOccupationalCredential",
    "name": "ISO 9001:2015",
    "credentialCategory": "certification",
    "description": "ISO 9001:2015 Certified",
}
SAME_AS = [
    "https://www.facebook.com/profile.php?id=100070029793724",
    "https://www.linkedin.com/company/thesrew",
    "https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw",
    "https://www.instagram.com/srenggworks/",
    "https://www.indiamart.com/srengineeringworks-266746886/",
]
HOURS = [
    {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        "opens": "09:00",
        "closes": "18:00",
    }
]


def clean(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    value = (
        value.replace("&nbsp;", " ")
        .replace("\xa0", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
        .replace("&rsquo;", "’")
        .replace("&ldquo;", "“")
        .replace("&rdquo;", "”")
        .replace("&ndash;", "–")
        .replace("&mdash;", "—")
    )
    value = re.sub(r"&#(\d+);", lambda m: chr(int(m.group(1))), value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def types_of(node) -> list:
    if not isinstance(node, dict):
        return []
    raw = node.get("@type")
    if raw is None:
        return []
    return raw if isinstance(raw, list) else [raw]


def is_type(node, name: str) -> bool:
    return isinstance(node, dict) and name in types_of(node)


def dumps(data) -> str:
    return (
        '<script type="application/ld+json">'
        + json.dumps(data, ensure_ascii=False, separators=(", ", ": "))
        + "</script>"
    )


def strip_embedded(html: str) -> str:
    html = re.sub(r"<script\b[\s\S]*?</script>", " ", html, flags=re.I)
    html = re.sub(r"<style\b[\s\S]*?</style>", " ", html, flags=re.I)
    return html


def canonical_of(html: str, filename: str) -> str:
    match = re.search(r"<link\b[^>]*rel=[\"']canonical[\"'][^>]*>", html, re.I)
    if match:
        content = re.search(r"href=[\"']([^\"']+)[\"']", match.group(0), re.I)
        if content:
            return content.group(1).split("?")[0]
    slug = "index" if filename == "index.html" else filename[: -len(".html")]
    if slug == "index":
        return f"{SITE}/"
    return f"{SITE}/{slug}"


def meta_name(html: str, name: str) -> str:
    for match in re.finditer(r"<meta\b[^>]*>", html, re.I):
        tag = match.group(0)
        if re.search(rf"\bname=[\"']{name}[\"']", tag, re.I) or re.search(
            rf"\bproperty=[\"']{name}[\"']", tag, re.I
        ):
            content = re.search(r"\bcontent=[\"']([^\"']*)[\"']", tag, re.I)
            if content:
                return clean(content.group(1))
    return ""


def page_title(html: str) -> str:
    match = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    return clean(match.group(1)) if match else ""


def abs_url(href: str) -> str:
    href = href.strip().split("?")[0]
    if href.startswith("http://") or href.startswith("https://"):
        return href
    if href.startswith("/"):
        path = href
    else:
        path = "/" + href
    path = path.split("#")[0]
    if path.endswith(".html"):
        path = path[: -len(".html")]
    if path in ("", "/index"):
        return f"{SITE}/"
    return SITE + path


def visible_faqs(html: str) -> list[tuple[str, str]]:
    region = strip_embedded(html)
    items: list[tuple[str, str]] = []
    for match in re.finditer(
        r'<div class="faq-item">(.*?)(?=<div class="faq-item">|</section>)',
        region,
        re.I | re.S,
    ):
        block = match.group(1)
        question = re.search(r"<h[2-4][^>]*>(.*?)</h[2-4]>", block, re.I | re.S)
        answers = re.findall(r"<p[^>]*>(.*?)</p>", block, re.I | re.S)
        if question and answers:
            text = clean(" ".join(answers))
            if text:
                items.append((clean(question.group(1)), text))
    if items:
        return items
    accordion: list[tuple[str, str]] = []
    for match in re.finditer(
        r'<button[^>]*class="[^"]*accordion-button[^"]*"[^>]*>(.*?)</button>.*?'
        r'<div[^>]*class="[^"]*accordion-body[^"]*"[^>]*>(.*?)</div>',
        region,
        re.I | re.S,
    ):
        question = clean(match.group(1))
        answer = clean(match.group(2))
        if question and answer:
            accordion.append((question, answer))
    return accordion


def parse_ol(inner: str) -> list[tuple[str, str | None]]:
    items = []
    for li in re.finditer(r"<li\b[^>]*>(.*?)</li>", inner, re.I | re.S):
        block = li.group(1)
        link = re.search(
            r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", block, re.I | re.S
        )
        if link:
            items.append((clean(link.group(2)), abs_url(link.group(1))))
        else:
            text = clean(block)
            if text:
                items.append((text, None))
    return items


def parse_premium(inner: str) -> list[tuple[str, str | None]]:
    parts = re.split(r"&rsaquo;|›", inner, flags=re.I)
    items = []
    for part in parts:
        link = re.search(
            r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", part, re.I | re.S
        )
        if link:
            items.append((clean(link.group(2)), abs_url(link.group(1))))
            continue
        span = re.search(r"<span\b[^>]*>(.*?)</span>", part, re.I | re.S)
        text = clean(span.group(1) if span else part)
        if text:
            items.append((text, None))
    return items


def parse_inline_nav(inner: str) -> list[tuple[str, str | None]]:
    items = []
    for match in re.finditer(
        r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>|<span\b[^>]*>(.*?)</span>",
        inner,
        re.I | re.S,
    ):
        if match.group(1):
            items.append((clean(match.group(2)), abs_url(match.group(1))))
        else:
            text = clean(match.group(3))
            if text:
                items.append((text, None))
    return items


def visible_breadcrumbs(html: str, canonical: str) -> list[tuple[str, str | None]]:
    region = strip_embedded(html)
    body = re.search(r"<body\b[\s\S]*", region, re.I)
    region = body.group(0) if body else region
    found: list[tuple[int, list[tuple[str, str | None]]]] = []
    for match in re.finditer(
        r'<div class="breadcrumb-premium"[^>]*>(.*?)</div>', region, re.I | re.S
    ):
        found.append((match.start(), parse_premium(match.group(1))))
    for match in re.finditer(
        r'<nav\b[^>]*aria-label=["\'][^"\']*breadcrumb[^"\']*["\'][^>]*>(.*?)</nav>',
        region,
        re.I | re.S,
    ):
        inner = match.group(1)
        ol = re.search(
            r'<ol\b[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</ol>', inner, re.I | re.S
        )
        items = parse_ol(ol.group(1)) if ol else parse_inline_nav(inner)
        found.append((match.start(), items))
    for match in re.finditer(
        r'<ol\b[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</ol>', region, re.I | re.S
    ):
        found.append((match.start(), parse_ol(match.group(1))))
    found = [(pos, items) for pos, items in found if items]
    if not found:
        return []
    found.sort(key=lambda item: item[0])
    items = found[0][1]
    if items and items[-1][1] is None:
        items[-1] = (items[-1][0], canonical)
    return items


def breadcrumb_node(items: list[tuple[str, str | None]], context: bool = False) -> dict:
    node = {
        "@type": "BreadcrumbList",
        "itemListElement": [],
    }
    if context:
        node = {"@context": "https://schema.org", **node}
    for index, (name, url) in enumerate(items, start=1):
        entry = {"@type": "ListItem", "position": index, "name": name}
        if url:
            entry["item"] = url
        node["itemListElement"].append(entry)
    return node


def faq_node(pairs: list[tuple[str, str]], context: bool = False) -> dict:
    node = {
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in pairs
        ],
    }
    if context:
        node = {"@context": "https://schema.org", **node}
    return node


def own_region(html: str) -> str:
    """Page body without chrome or related-product prices."""
    region = strip_embedded(html)
    region = re.sub(r"<header\b[\s\S]*?</header>", " ", region, flags=re.I)
    region = re.sub(r"<footer\b[\s\S]*?</footer>", " ", region, flags=re.I)
    region = re.sub(
        r'<section\b[^>]*(?:id=["\']related["\']|class=["\'][^"\']*related-products)[^>]*>[\s\S]*?</section>',
        " ",
        region,
        flags=re.I,
    )
    return region


def parse_amount(raw: str):
    raw = raw.replace(",", "").strip()
    if not raw:
        return None
    value = float(raw)
    if value <= 0:
        return None
    if abs(value - round(value)) < 1e-9:
        return int(round(value))
    return round(value, 2)


def visible_amounts(html: str) -> set:
    region = own_region(html)
    amounts = set()
    for match in re.finditer(r"₹\s*([0-9][0-9,]*(?:\.[0-9]+)?)", region):
        amount = parse_amount(match.group(1))
        if amount is not None:
            amounts.add(amount)
            if isinstance(amount, float):
                amounts.add(int(round(amount)))
    for match in re.finditer(
        r"₹\s*([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lakhs|L\b)", region, re.I
    ):
        amounts.add(int(round(float(match.group(1)) * 100000)))
    for match in re.finditer(
        r"₹\s*([0-9]+(?:\.[0-9]+)?)\s*crore", region, re.I
    ):
        amounts.add(int(round(float(match.group(1)) * 10000000)))
    return amounts


def page_shows_gst(html: str) -> bool:
    region = own_region(html)
    region = re.sub(r"GSTIN\s*[A-Z0-9]+", " ", region, flags=re.I)
    return bool(re.search(r"GST\s*18\s*%|\+\s*GST\b", region, re.I))


def listed_offers(html: str, canonical: str) -> list[dict]:
    """Offers taken only from prices this page itself prints, excluding related products."""
    region = own_region(html)
    found = []
    seen = set()

    def add(name: str, cell: str):
        match = re.search(
            r"₹\s*([0-9][0-9,]*(?:\.[0-9]+)?)[^₹]{0,40}?\+\s*GST",
            cell,
            re.I,
        )
        if not match:
            return
        price = parse_amount(match.group(1))
        if price is None:
            return
        label = re.sub(r"\s+", " ", name).strip(" :-")
        if not label or label.lower() in {"item", "model", "plant", "service", "price"}:
            return
        key = (label.lower(), price)
        if key in seen:
            return
        seen.add(key)
        offer = {
            "@type": "Offer",
            "name": label,
            "price": price,
            "priceCurrency": "INR",
            "url": canonical,
            "description": "+ GST 18%",
            "seller": {
                "@type": "Organization",
                "@id": BIZ_ID,
                "name": "SREW Projects",
            },
            "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": price,
                "priceCurrency": "INR",
                "valueAddedTaxIncluded": False,
                "description": "+ GST 18%",
            },
        }
        unit = cell.lower()
        if "per piece" in unit:
            offer["priceSpecification"]["unitText"] = "piece"
        elif "per sq ft" in unit or "per sq. ft" in unit:
            offer["priceSpecification"]["unitText"] = "sq ft"
        elif "per metre" in unit or "per meter" in unit:
            offer["priceSpecification"]["unitText"] = "metre"
        elif "per set" in unit:
            offer["priceSpecification"]["unitText"] = "set"
        found.append(offer)

    for row in re.finditer(r"<tr\b[^>]*>([\s\S]*?)</tr>", region, re.I):
        cells = [
            clean(cell)
            for cell in re.findall(r"<t[dh]\b[^>]*>(.*?)</t[dh]>", row.group(1), re.I | re.S)
        ]
        priced = next((cell for cell in cells if "₹" in cell and "+ GST" in cell.upper()), None)
        if priced and cells:
            add(cells[0], priced)
    plain = clean(region)
    for match in re.finditer(
        r"([^:·|]{3,90}?):\s*(₹\s*[0-9][0-9,]*(?:\.[0-9]+)?\s*\+\s*GST\b[^·|]*)",
        plain,
        re.I,
    ):
        add(match.group(1), match.group(2))
    if not found:
        heading = re.search(r"<h1\b[^>]*>(.*?)</h1>", region, re.I | re.S)
        spec = re.search(
            r'class="ks-value"[^>]*>\s*(?:From\s+)?(₹\s*[0-9][^<]{0,60}?\+\s*GST)',
            region,
            re.I,
        )
        if heading and spec:
            add(clean(heading.group(1)), clean(spec.group(1)))
    return found


def as_int(price) -> int | None:
    try:
        if isinstance(price, str):
            price = price.replace(",", "").strip()
        return int(round(float(price)))
    except (TypeError, ValueError):
        return None


def ground_price(price, visible: set[int]) -> tuple[int, bool] | None:
    """Return (price, valueAddedTaxIncluded) using only amounts printed on the page."""
    gross = as_int(price)
    if gross is None:
        return None
    raw = gross / 1.18
    ex_hits = []
    for candidate in (int(round(raw)), int(raw), int(raw) + 1):
        if candidate != gross and candidate in visible and candidate not in ex_hits:
            ex_hits.append(candidate)
    if gross in visible and ex_hits:
        return ex_hits[0], False
    if gross not in visible and ex_hits:
        return ex_hits[0], False
    if gross in visible:
        return gross, False
    return None


def ensure_gst(description: str) -> str:
    if re.search(r"GST\s*18\s*%", description):
        return description
    if re.search(r"\+\s*GST\b", description):
        return re.sub(r"\+\s*GST\b", "+ GST 18%", description, count=1)
    description = description.rstrip()
    if description.endswith("."):
        return description[:-1] + " + GST 18%."
    return description + " + GST 18%."


def provider_node(existing=None) -> dict:
    node = {
        "@type": "Organization",
        "@id": BIZ_ID,
        "name": "SREW Projects",
        "legalName": "S.R.Engineering Works",
        "url": SITE,
    }
    if isinstance(existing, dict):
        merged = dict(existing)
        for key, value in node.items():
            if key not in merged or merged[key] in (None, ""):
                merged[key] = value
        merged["@id"] = BIZ_ID
        merged["name"] = "SREW Projects"
        merged.setdefault("legalName", "S.R.Engineering Works")
        merged.setdefault("url", SITE)
        return merged
    return node


def good_image(src: str) -> bool:
    lowered = src.lower()
    if any(
        token in lowered
        for token in (
            "/icons/",
            "sprite",
            "favicon",
            "indiamart",
            "/clients/",
            "material/",
            "logo",
            "iso-9001",
            "facebook.com",
            "badge",
            "ui-sprite",
        )
    ):
        return False
    return bool(re.search(r"\.(?:webp|jpe?g|png|avif)(?:\?|$)", lowered))


def abs_img(src: str) -> str:
    if src.startswith("http://") or src.startswith("https://"):
        return src
    if src.startswith("/"):
        return SITE + src
    return f"{SITE}/{src}"


def hero_image(html: str) -> str | None:
    main = re.search(r"<main\b[^>]*>([\s\S]*?)</main>", html, re.I)
    region = main.group(1) if main else ""
    cut = re.search(r'id=["\']related["\']|class=["\'][^"\']*related-products', region, re.I)
    if cut:
        region = region[: cut.start()]
    wrapped = re.search(
        r'class="[^"]*hero-image-wrapper[^"]*"[\s\S]{0,900}?<img\b[^>]*src=["\']([^"\']+)["\']',
        region,
        re.I,
    )
    if wrapped and good_image(wrapped.group(1)) and "video-thumbs" not in wrapped.group(1):
        return abs_img(wrapped.group(1))
    og = meta_name(html, "og:image")
    if og and good_image(og) and "logo" not in og.lower():
        return og if og.startswith("http") else abs_img(og)
    return None


def logo_only(image) -> bool:
    urls = []
    if isinstance(image, str):
        urls = [image]
    elif isinstance(image, list):
        for item in image:
            if isinstance(item, str):
                urls.append(item)
            elif isinstance(item, dict) and isinstance(item.get("url"), str):
                urls.append(item["url"])
    elif isinstance(image, dict) and isinstance(image.get("url"), str):
        urls = [image["url"]]
    return not urls or all("logo" in url.lower() for url in urls)


def fix_offer(offer: dict, visible: set[int], changes: list) -> dict | None:
    if not isinstance(offer, dict) or "Offer" not in types_of(offer):
        return offer
    price = offer.get("price")
    spec = offer.get("priceSpecification")
    if price is None and isinstance(spec, dict):
        price = spec.get("price")
    if price is None:
        return offer
    grounded = ground_price(price, visible)
    if grounded is None:
        changes.append(f"drop offer {offer.get('name', '')} price {price}")
        return None
    new_price, included = grounded
    if as_int(price) != new_price:
        changes.append(f"price {price} -> {new_price} ({offer.get('name', '')})")
    offer["price"] = new_price
    offer["priceCurrency"] = "INR"
    if not isinstance(spec, dict):
        spec = {"@type": "UnitPriceSpecification"}
    spec["@type"] = spec.get("@type") or "UnitPriceSpecification"
    spec["price"] = new_price
    spec["priceCurrency"] = "INR"
    spec["valueAddedTaxIncluded"] = included
    offer["priceSpecification"] = spec
    offer.pop("aggregateRating", None)
    offer.pop("review", None)
    return offer


def fix_offers_field(offers, visible: set[int], changes: list):
    if isinstance(offers, dict):
        return fix_offer(offers, visible, changes)
    if isinstance(offers, list):
        kept = []
        for offer in offers:
            if isinstance(offer, dict) and "Offer" in types_of(offer):
                fixed = fix_offer(offer, visible, changes)
                if fixed is not None:
                    kept.append(fixed)
            else:
                kept.append(offer)
        return kept
    return offers


def walk_products(node, visible, page_gst, hero, canonical, changes, root=False):
    if isinstance(node, list):
        return [
            walk_products(item, visible, page_gst, hero, canonical, changes, False)
            for item in node
        ]
    if not isinstance(node, dict):
        return node
    for key, value in list(node.items()):
        if key == "offers":
            continue
        node[key] = walk_products(
            value, visible, page_gst, hero, canonical, changes, False
        )
    if "Product" in types_of(node) or "Service" in types_of(node):
        if "offers" in node:
            fixed = fix_offers_field(node["offers"], visible, changes)
            if fixed in (None, [], {}):
                node.pop("offers", None)
            else:
                node["offers"] = fixed
        if page_gst and node.get("description") and (node.get("offers") or root):
            node["description"] = ensure_gst(node["description"])
        node.pop("aggregateRating", None)
        node.pop("review", None)
        if "Service" in types_of(node):
            node["provider"] = provider_node(node.get("provider"))
            if not node.get("name"):
                node["name"] = node.get("serviceType") or page_title_fallback(node)
            if root and not node.get("url"):
                node["url"] = canonical
        if "Product" in types_of(node):
            node["manufacturer"] = provider_node(node.get("manufacturer"))
            if isinstance(node.get("brand"), dict):
                node["brand"]["name"] = node["brand"].get("name") or "SREW Projects"
            if root and not node.get("url"):
                node["url"] = canonical
            if root and hero and logo_only(node.get("image")):
                node["image"] = hero
                changes.append(f"image -> {hero}")
    return node


def page_title_fallback(node) -> str:
    return "SREW Projects"


def sanitize(node):
    if isinstance(node, list):
        return [sanitize(item) for item in node]
    if not isinstance(node, dict):
        return node
    for key in ("aggregateRating", "review", "founder", "numberOfEmployees"):
        node.pop(key, None)
    node.pop("availableLanguage", None)
    if "WebSite" in types_of(node):
        action = node.get("potentialAction")
        if isinstance(action, dict) and action.get("@type") == "SearchAction":
            node.pop("potentialAction", None)
    if "telephone" in node:
        node["telephone"] = PHONES
    if is_type(node, "WebPage") and node.get("name") == HOMEPAGE_WEBPAGE_NAME:
        node.pop("speakable", None)
    for key, value in list(node.items()):
        node[key] = sanitize(value)
    return node


def fix_copied_webpage(node, title: str, canonical: str, description: str):
    if isinstance(node, list):
        for item in node:
            fix_copied_webpage(item, title, canonical, description)
        return
    if not isinstance(node, dict):
        return
    if is_type(node, "WebPage") and node.get("name") == HOMEPAGE_WEBPAGE_NAME:
        node["name"] = title
        node["url"] = canonical
        if description:
            node["description"] = description
        node.pop("speakable", None)
        node.pop("dateModified", None)
    for value in node.values():
        fix_copied_webpage(value, title, canonical, description)


def strip_speakable_without_faq(node, html: str):
    if 'id="faq-section"' in html or "id='faq-section'" in html:
        return
    if isinstance(node, list):
        for item in node:
            strip_speakable_without_faq(item, html)
        return
    if not isinstance(node, dict):
        return
    speakable = node.get("speakable")
    if isinstance(speakable, dict):
        selectors = speakable.get("cssSelector") or []
        if isinstance(selectors, str):
            selectors = [selectors]
        if any("faq" in selector for selector in selectors):
            node.pop("speakable", None)
    for value in node.values():
        strip_speakable_without_faq(value, html)


def replace_type(node, type_name: str, replacement: dict) -> int:
    count = 0
    if isinstance(node, list):
        for item in node:
            count += replace_type(item, type_name, replacement)
        return count
    if not isinstance(node, dict):
        return 0
    if is_type(node, type_name) and "@graph" not in node:
        context = node.get("@context")
        node.clear()
        node.update(replacement)
        if context and "@context" not in node:
            node["@context"] = context
        return 1
    for value in node.values():
        count += replace_type(value, type_name, replacement)
    return count


def remove_type(node, type_name: str) -> bool:
    """Remove nodes of type_name. Return True if the whole node should be deleted."""
    if isinstance(node, list):
        kept = []
        for item in node:
            if remove_type(item, type_name):
                continue
            kept.append(item)
        node[:] = kept
        return False
    if not isinstance(node, dict):
        return False
    if is_type(node, type_name) and "@graph" not in node:
        return True
    if isinstance(node.get("@graph"), list):
        node["@graph"] = [
            item for item in node["@graph"] if not remove_type(item, type_name)
        ]
        if not node["@graph"]:
            return True
    for key, value in list(node.items()):
        if key == "@graph":
            continue
        if isinstance(value, list):
            value[:] = [item for item in value if not remove_type(item, type_name)]
        elif isinstance(value, dict) and remove_type(value, type_name):
            node.pop(key, None)
    return False


def has_type(node, type_name: str) -> bool:
    if isinstance(node, list):
        return any(has_type(item, type_name) for item in node)
    if not isinstance(node, dict):
        return False
    if is_type(node, type_name):
        return True
    return any(has_type(value, type_name) for value in node.values())


def business_graph() -> dict:
    parent = {
        "@type": "Organization",
        "@id": PARENT_ID,
        "name": "S.R.Engineering Works",
        "legalName": "S.R.Engineering Works",
    }
    shared = {
        "name": "SREW Projects",
        "legalName": "S.R.Engineering Works",
        "url": SITE,
        "image": LOGO_URL,
        "description": BUSINESS_DESCRIPTION,
        "email": "srenggworks2016@gmail.com",
        "telephone": PHONES,
        "taxID": "36BEIPR4767N1ZL",
        "vatID": "36BEIPR4767N1ZL",
        "address": ADDRESS,
        "parentOrganization": {"@id": PARENT_ID},
        "award": "ISO 9001:2015 Certified",
        "hasCredential": CREDENTIAL,
        "sameAs": SAME_AS,
        "areaServed": {"@type": "Country", "name": "India"},
    }
    business = {
        "@type": ["Organization", "LocalBusiness"],
        "@id": BIZ_ID,
        "logo": LOGO,
        "openingHours": "Mo-Sa 09:00-18:00",
        "openingHoursSpecification": HOURS,
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 17.5403008,
            "longitude": 78.4641043,
        },
        "hasMap": "https://www.google.com/maps/dir/?api=1&destination=17.5403008,78.4641043",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": phone,
                "contactType": "customer service",
                "areaServed": "IN",
            }
            for phone in PHONES
        ],
        **shared,
    }
    return {
        "@context": "https://schema.org",
        "@graph": [parent, business],
    }


def top_business_entity(data) -> bool:
    return is_type(data, "Organization") or is_type(data, "LocalBusiness")


def retarget_about(data):
    if is_type(data, "AboutPage") and isinstance(data.get("mainEntity"), dict):
        if "Organization" in types_of(data["mainEntity"]):
            data["mainEntity"] = {"@id": BIZ_ID}


def project_creative_work(html: str, canonical: str) -> dict:
    region = strip_embedded(html)
    heading = re.search(r"<h1[^>]*>(.*?)</h1>", region, re.I | re.S)
    lead = re.search(r'<p class="lead[^"]*"[^>]*>(.*?)</p>', region, re.I | re.S)
    paragraph = re.search(r'<p class="fs-5[^"]*"[^>]*>(.*?)</p>', region, re.I | re.S)
    outcome = re.search(
        r"Project Performance[\s\S]{0,500}?<p[^>]*>(.*?)</p>", region, re.I
    )
    specs = re.findall(
        r'class="specs-label">(.*?)</div>\s*<div class="specs-value">(.*?)</div>',
        region,
        re.I | re.S,
    )
    parts = []
    meta = meta_name(html, "description")
    if meta:
        parts.append(meta)
    if lead:
        lead_text = clean(lead.group(1))
        if lead_text and lead_text not in " ".join(parts):
            parts.append(lead_text)
    if paragraph:
        para = clean(paragraph.group(1))
        if para:
            parts.append(para)
    if outcome:
        outcome_text = clean(outcome.group(1))
        if outcome_text:
            parts.append(outcome_text)
    for label, value in specs:
        parts.append(f"{clean(label)}: {clean(value)}.")
    description = " ".join(parts)
    node = {
        "@type": "CreativeWork",
        "@id": canonical + "#project",
        "name": clean(heading.group(1)) if heading else page_title(html),
        "url": canonical,
        "description": description,
        "creator": {
            "@type": "Organization",
            "name": "SREW Projects",
            "url": SITE,
        },
        "publisher": {
            "@type": "Organization",
            "name": "SREW Projects",
            "url": SITE,
            "logo": {"@type": "ImageObject", "url": LOGO_URL},
        },
    }
    image = hero_image(html)
    if image:
        node["image"] = image
    if lead:
        location = clean(lead.group(1)).split("|")[0].strip()
        if location:
            node["contentLocation"] = {"@type": "Place", "name": location}
        year = re.search(r"Year of Delivery:\s*(\d{4})", clean(lead.group(1)))
        if year:
            node["dateCreated"] = year.group(1)
    return {"@context": "https://schema.org", **node}


def load_scripts(html: str):
    blocks = []
    for match in SCRIPT_RE.finditer(html):
        raw = match.group(0)
        body = re.search(r">([\s\S]*)</script>\s*$", raw, re.I)
        text = body.group(1).strip() if body else ""
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            data = None
        blocks.append({"raw": raw, "data": data, "delete": False})
    return blocks


def iter_nodes(node, acc):
    if isinstance(node, dict):
        acc.append(node)
        for value in node.values():
            iter_nodes(value, acc)
    elif isinstance(node, list):
        for item in node:
            iter_nodes(item, acc)


def has_priced_offer(node) -> bool:
    offers = node.get("offers")
    if isinstance(offers, dict):
        offers = [offers]
    if not isinstance(offers, list):
        return False
    return any(isinstance(offer, dict) and offer.get("price") is not None for offer in offers)


def convert_product_to_service(node):
    kind = node.get("@type")
    if kind == "Product":
        node["@type"] = "Service"
    elif isinstance(kind, list):
        node["@type"] = ["Service" if item == "Product" else item for item in kind]
    node.pop("offers", None)
    node.pop("manufacturer", None)
    if not node.get("provider"):
        node["provider"] = provider_node(node.get("manufacturer"))
    if not node.get("serviceType") and node.get("name"):
        node["serviceType"] = node["name"]


def finalize_products(blocks, html, canonical, description, changes):
    """Keep Product and Offer only for prices printed on this page."""
    offers = listed_offers(html, canonical)
    nodes = []
    for block in blocks:
        if block.get("delete") or not block.get("data"):
            continue
        iter_nodes(block["data"], nodes)
    products = [node for node in nodes if "Product" in types_of(node)]
    if not offers:
        for product in products:
            changes.append(f"no page price -> Service {str(product.get('name') or '')[:50]}")
            convert_product_to_service(product)
        return
    canonical_key = canonical.rstrip("/")
    mains = [
        node
        for node in products
        if str(node.get("url") or "").split("?")[0].rstrip("/") == canonical_key
    ]
    target = mains[0] if mains else (products[0] if products else None)
    if target is None:
        blocks.append(
            {
                "raw": "",
                "data": {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": page_title(html),
                    "url": canonical,
                    "description": ensure_gst(description or page_title(html)),
                    "offers": offers,
                    "manufacturer": provider_node(),
                },
                "delete": False,
            }
        )
        changes.append(f"added product with {len(offers)} listed offers")
        return
    target["@type"] = "Product"
    target["offers"] = offers
    target["url"] = target.get("url") or canonical
    if not target.get("description"):
        target["description"] = description or page_title(html)
    if target.get("description"):
        target["description"] = ensure_gst(target["description"])
    if not target.get("manufacturer"):
        target["manufacturer"] = provider_node()
    changes.append(f"{len(offers)} listed offers")
    for product in products:
        if product is target or has_priced_offer(product):
            continue
        changes.append(f"unpriced -> Service {str(product.get('name') or '')[:50]}")
        convert_product_to_service(product)


def process(filename: str, html: str) -> tuple[str, dict]:
    report = {
        "file": filename,
        "faq": "",
        "breadcrumb": "",
        "prices": [],
        "business": False,
        "project": False,
    }
    blocks = load_scripts(html)
    canonical = canonical_of(html, filename)
    title = page_title(html)
    description = meta_name(html, "description")
    faqs = visible_faqs(html)
    crumbs = visible_breadcrumbs(html, canonical)
    visible = visible_amounts(html)
    gst = page_shows_gst(html)
    hero = hero_image(html)

    for block in blocks:
        if block["data"] is None:
            continue
        sanitize(block["data"])
        fix_copied_webpage(block["data"], title, canonical, description)
        strip_speakable_without_faq(block["data"], html)
        retarget_about(block["data"])
        if isinstance(block["data"], dict) and isinstance(block["data"].get("@graph"), list):
            block["data"]["@graph"] = [
                walk_products(
                    node,
                    visible,
                    gst,
                    hero,
                    canonical,
                    report["prices"],
                    is_type(node, "Product") or is_type(node, "Service"),
                )
                for node in block["data"]["@graph"]
            ]
        else:
            block["data"] = walk_products(
                block["data"],
                visible,
                gst,
                hero,
                canonical,
                report["prices"],
                is_type(block["data"], "Product") or is_type(block["data"], "Service"),
            )

    finalize_products(blocks, html, canonical, description, report["prices"])

    # FAQ
    if faqs:
        node = faq_node(faqs)
        replaced = 0
        for block in blocks:
            if block["data"] is None:
                continue
            replaced += replace_type(block["data"], "FAQPage", node)
        if replaced == 0:
            blocks.append({"raw": "", "data": faq_node(faqs, context=True), "delete": False})
            report["faq"] = f"added {len(faqs)}"
        else:
            report["faq"] = f"updated {len(faqs)}"
        # collapse extra FAQ scripts that are now duplicates: keep all, they match
    else:
        removed = 0
        for block in blocks:
            if block["data"] is None:
                continue
            if is_type(block["data"], "FAQPage"):
                block["delete"] = True
                removed += 1
            elif remove_type(block["data"], "FAQPage"):
                block["delete"] = True
                removed += 1
            elif not has_type(block["data"], "FAQPage") and removed:
                pass
            if isinstance(block["data"], dict) and block["data"].get("@graph") == []:
                block["delete"] = True
        if removed:
            report["faq"] = f"removed {removed} (no visible FAQ)"

    # Breadcrumbs
    if crumbs:
        node = breadcrumb_node(crumbs)
        replaced = 0
        for block in blocks:
            if block["delete"] or block["data"] is None:
                continue
            replaced += replace_type(block["data"], "BreadcrumbList", node)
        if replaced == 0:
            blocks.append(
                {"raw": "", "data": breadcrumb_node(crumbs, context=True), "delete": False}
            )
            report["breadcrumb"] = f"added {len(crumbs)}"
        else:
            report["breadcrumb"] = f"updated {len(crumbs)}"

    # Business identity on home, about, contact
    if filename in BUSINESS_PAGES:
        replaced = False
        for block in blocks:
            if block["delete"] or block["data"] is None:
                continue
            if top_business_entity(block["data"]):
                if not replaced:
                    block["data"] = business_graph()
                    replaced = True
                else:
                    block["delete"] = True
        if not replaced:
            blocks.append({"raw": "", "data": business_graph(), "delete": False})
        report["business"] = True

    if filename in PROJECT_PAGES and not any(
        block["data"] and has_type(block["data"], "CreativeWork") and not block["delete"]
        for block in blocks
    ):
        blocks.append(
            {"raw": "", "data": project_creative_work(html, canonical), "delete": False}
        )
        report["project"] = True

    rendered = []
    for block in blocks:
        if block["delete"]:
            rendered.append(None)
        elif block["data"] is None:
            rendered.append(block["raw"])
        else:
            rendered.append(dumps(block["data"]))

    pieces = []
    last = 0
    index = 0
    for match in SCRIPT_RE.finditer(html):
        pieces.append(html[last : match.start()])
        if rendered[index] is not None:
            pieces.append(rendered[index])
        last = match.end()
        index += 1
    pieces.append(html[last:])
    updated = "".join(pieces)
    extras = [item for item in rendered[index:] if item]
    if extras:
        insert = "\n    " + "\n    ".join(extras) + "\n"
        updated = re.sub(r"</head>", insert + "</head>", updated, count=1, flags=re.I)
    return updated, report


def main() -> int:
    dry = "--dry-run" in sys.argv
    reports = []
    for path in sorted(ROOT.glob("*.html")):
        if path.name.startswith("google"):
            continue
        original = path.read_text(encoding="utf-8")
        updated, report = process(path.name, original)
        reports.append((report, original != updated))
        if not dry and original != updated:
            path.write_text(updated, encoding="utf-8")
    changed = [report["file"] for report, did in reports if did or dry]
    print(f"pages considered: {len(reports)}")
    for report, did in reports:
        if not did and not any(
            [report["faq"], report["breadcrumb"], report["prices"], report["business"], report["project"]]
        ):
            continue
        prices = "; ".join(report["prices"][:8])
        print(
            f"{report['file']}: faq={report['faq'] or '-'} crumb={report['breadcrumb'] or '-'} "
            f"biz={report['business']} project={report['project']} prices={prices}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
