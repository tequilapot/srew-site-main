#!/usr/bin/env python3
"""One-shot mapper: each catalog photo on one product. Leaves headers, heroes,
projects, spare parts and SS fabrication on their pre-catalog images.

Do not run again on the current HTML. The replacements are not idempotent.
The maps below are the record of which photo went where.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "public/images/catalog/catalog.json").read_text())["images"]
SCENE = {
    "stone-crusher-plant-layout",
    "cnd-waste-recycling-plant",
    "vibrating-screen-on-structure-site",
}
NATIVE = {"plate-rolling-machine": 578, "wood-chipper": 250}

# Product page (and its cards) -> one catalog key.
PAGES = {
    "jaw-crusher-manufacturer": "jaw-crusher-heavy",
    "european-type-jaw-crusher": "jaw-crusher-with-drive",
    "grease-jaw-crusher": "jaw-crusher",
    "multi-cylinder-hydraulic-cone-crusher": "hydraulic-cone-crusher-multi-cylinder",
    "single-cylinder-cone-crusher": "cone-crusher-single-cylinder",
    "hsi-crusher-manufacturer": "impact-crusher-hsi",
    "vsi-crusher-m-sand": "vsi-sand-making-machine",
    "m-sand-plant-manufacturer": "vsi-crusher-twin-motor",
    "roller-crusher-manufacturer": "double-roll-crusher",
    "hammer-crusher-manufacturer": "hammer-crusher",
    "pulverizer-machine": "pulverizer-cyclone-bag-filter-system",
    "glass-crusher-machine": "glass-crusher",
    "vibrating-screen-manufacturer": "inclined-vibrating-screen-3-deck",
    "vibrating-screen-3-deck": "vibrating-screen-3-deck-pedestal",
    "damping-vibrating-screen": "horizontal-vibrating-screen",
    "loading-hopper-manufacturer": "feed-hopper",
    "silo-storage-systems": "cement-silos",
    "belt-conveyor-manufacturer": "belt-conveyor",
    "control-panel-automation": "electrical-control-panel",
    "sand-washing-machine": "bucket-wheel-sand-washer",
    "series-sand-washer": "screw-sand-washer",
    "dewatering-screen": "dewatering-screen-hydrocyclone",
    "sand-dryer-manufacturer": "rotary-drum",
    "stone-crusher-plant": "stone-crusher-plant-layout",
    "mobile-stone-crusher-plant": "mobile-impact-crushing-plant",
    "modular-mobile-crusher": "modular-jaw-crushing-plant",
    "tire-mobile-crusher": "mobile-jaw-crushing-plant-tyre",
    "cd-recycling-plant": "cnd-waste-recycling-plant",
    "mini-stone-crusher-plant": "small-roll-crusher",
    "cone-crusher-plant": "mobile-cone-screening-plant",
}
SLUG = dict(PAGES)
SLUG["crusher-plant-capacity"] = "small-roll-crusher"

TILES = {
    "/products#stone-crusher-plants-and-mobile-plants": "stone-crusher-plant-layout",
    "/products#crushers": "jaw-crusher-heavy",
    "/products#screens-feeders-hoppers-and-silos": "inclined-vibrating-screen-3-deck",
    "/products#sand-washing-and-drying": "bucket-wheel-sand-washer",
    "/products#conveyors": "belt-conveyor",
    "/products#pulverizers-and-glass-crushers": "pulverizer-cyclone-bag-filter-system",
}

TPH = [
    ("2-tph", "small-roll-crusher"),
    ("5-tph", "jaw-crusher"),
    ("10-tph", "jaw-crusher-with-drive"),
    ("20-tph", "jaw-crusher-heavy"),
    ("30-tph", "modular-jaw-crushing-plant"),
    ("50-tph", "mobile-jaw-crushing-plant-tyre"),
    ("75-tph", "mobile-impact-crushing-plant"),
    ("100-tph", "mobile-cone-screening-plant"),
    ("150-tph", "vibrating-screen-on-structure-site"),
    ("200-tph", "hydraulic-cone-crusher-multi-cylinder"),
    ("250-tph", "stone-crusher-plant-layout"),
]


def esc(text):
    return (text or "").replace("&", "&amp;").replace('"', "&quot;")


def tag(key, kind):
    meta = CATALOG[key]
    width, height = meta["width"], meta["height"]
    width800 = meta.get("width800") or width
    src = f"/images/catalog/{meta['file']}"
    src800 = f"/images/catalog/{meta['file800']}"
    classes = ["catalog-photo"]
    if key in SCENE:
        classes.append("catalog-scene")
    if kind == "capacity":
        classes.append("catalog-capacity")
    if kind == "gallery":
        classes.append("catalog-gallery")
    if key in NATIVE:
        classes.append("catalog-native")
    style = f' style="--native-max:{NATIVE[key]}px"' if key in NATIVE else ""
    if kind == "hero":
        sizes = "(min-width: 992px) min(800px, 70vw), 100vw"
        extra = 'fetchpriority="high" decoding="async"'
    elif kind == "card":
        sizes = "(max-width: 576px) 92vw, 320px"
        extra = 'loading="lazy" decoding="async"'
    else:
        sizes = "(min-width: 992px) min(960px, 90vw), 100vw"
        extra = 'loading="lazy" decoding="async"'
    srcset = ""
    if width800 != width:
        srcset = f' srcset="{src800} {width800}w, {src} {width}w" sizes="{sizes}"'
    return (
        f'<img src="{src}"{srcset} alt="{esc(meta["alt"])}" class="{" ".join(classes)}"'
        f' width="{width}" height="{height}" {extra}{style}>'
    )


def abs_url(key):
    return f"https://www.srewprojects.com/images/catalog/{CATALOG[key]['file']}"


def split_main(html):
    start = html.find("<main")
    end = html.find("</main>")
    if start < 0 or end < 0:
        return None
    return html[:start], html[start:end], html[end:]


def replace_hero(main, key):
    hero = tag(key, "hero")
    match = re.search(r'(<div class="hero-image-wrapper">\s*)<img\b[^>]*>', main)
    if match:
        return main[: match.start()] + match.group(1) + hero + main[match.end() :]
    pattern = re.compile(
        r'<img\b[^>]*src="[^"]*(?:/images/(?:real|seo|cards|og)|images/Products/)[^"]*"[^>]*>'
    )
    for match in pattern.finditer(main):
        snippet = match.group(0)
        if any(skip in snippet for skip in ("material", "/icons/", "logo", "ytimg")):
            continue
        return main[: match.start()] + hero + main[match.end() :]
    return main


def matching_div_end(html, start):
    depth = 0
    for match in re.finditer(r"<div\b|</div>", html[start:]):
        token = match.group(0)
        depth += 1 if token.startswith("<div") else -1
        if depth == 0:
            return start + match.end()
    return None


def collapse_gallery(main, key):
    photo = tag(key, "gallery")
    start = main.find('id="gallery"')
    if start != -1:
        row = main.find('<div class="row', start)
        if row != -1 and row < start + 800:
            end = matching_div_end(main, row)
            if end:
                main = (
                    main[:row]
                    + f'<div class="row g-4"><div class="col-12 col-lg-8">{photo}</div></div>'
                    + main[end:]
                )
    row_pat = re.compile(
        r'<div class="row g-3">(?:\s*<div class="col-6 col-md-4">\s*<img\b[^>]*(?:/images/(?:seo|real|cards))[^>]*>\s*</div>){2,}\s*</div>'
    )
    main, _ = row_pat.subn(
        f'<div class="row g-3"><div class="col-12 col-lg-8">{photo}</div></div>',
        main,
        count=1,
    )
    return main


def key_for_href(href):
    path = href.split("?")[0]
    if path in TILES or href in TILES:
        return TILES.get(path) or TILES.get(href)
    slug = path.strip("/").split("#")[0]
    return SLUG.get(slug)


def replace_linked_blocks(main):
    def sub(match):
        block = match.group(0)
        found = re.search(r'href="([^"]+)"', block)
        if not found:
            return block
        key = key_for_href(found.group(1))
        if not key:
            return block
        updated, count = re.subn(r"<img\b[^>]*>", tag(key, "card"), block, count=1)
        return updated if count else block

    main = re.sub(
        r'<a\b[^>]*class="[^"]*\b(?:cat-tile|rp-card)\b[^"]*"[^>]*>[\s\S]*?</a>',
        sub,
        main,
    )
    main = re.sub(
        r'<a\b[^>]*href="[^"]+"[^>]*class="[^"]*\bcard h-100\b[^"]*"[^>]*>[\s\S]*?</a>',
        sub,
        main,
    )
    main = re.sub(
        r'<div class="card h-100 border-0 product-card"[\s\S]*?</div>\s*</div>\s*</div>',
        sub,
        main,
    )
    return main


def meta_images(html, key):
    url = abs_url(key)
    html = re.sub(
        r'(<meta property="og:image" content=")[^"]+(")',
        rf"\1{url}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta name="twitter:image" content=")[^"]+(")',
        rf"\1{url}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'"image"\s*:\s*"(https://www\.srewprojects\.com/images/(?!catalog/)[^"]+)"',
        f'"image": "{url}"',
        html,
        count=2,
    )
    html = re.sub(
        r'"image"\s*:\s*\[\s*"(https://www\.srewprojects\.com/images/(?!catalog/)[^"]+)"\s*\]',
        f'"image": ["{url}"]',
        html,
        count=1,
    )
    return html


def card(key, title, note, href):
    photo = tag(key, "card")
    return f'''<div class="col-xl-3 col-lg-4 col-md-6">
                <div class="card h-100 border-0 product-card" style="overflow: hidden; background: transparent;">
                    <div class="card-img-top-wrapper" style="height: 320px; overflow: hidden; display: flex; align-items: center; justify-content: center; background:#f4f6f9;">
                        {photo}
                    </div>
                    <div class="card-body p-4 d-flex flex-column text-center">
                        <h4 class="card-title fw-bold text-dark mb-1" style="font-size: 1.15rem;">{title}</h4>
                        <p class="small text-muted mb-3">{note}</p>
                        <div class="mt-auto">
                            <a href="{href}" class="btn btn-outline-dark btn-sm w-100 rounded-pill fw-bold">Ask for a quote <i class="fas fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
            </div>
'''


def insert_products(html):
    portable = card(
        "portable-inclined-feed-conveyor",
        "Portable inclined feed conveyor",
        "Inclined feed conveyor for plant loading",
        "/contact?product=Portable%20inclined%20feed%20conveyor",
    )
    marker = '<div class="col-12 mt-5" id="sand-washing-and-drying">'
    if "portable-inclined-feed-conveyor" not in html and marker in html:
        html = html.replace(marker, portable + marker, 1)
    special = (
        '<div class="col-12 mt-5" id="special-purpose-machines"><h2 class="h3 fw-bold text-dark border-bottom pb-2 mb-0" style="font-family: var(--ff-display);">Special purpose machines</h2><p class="text-secondary mt-2 mb-0">Shown at the size of the photograph.</p></div>\n'
        + card(
            "plate-rolling-machine",
            "Plate rolling machine",
            "In-house plate rolling for shells and drums",
            "/contact?product=Plate%20rolling%20machine",
        )
        + card(
            "wood-chipper",
            "Wood chipper",
            "Agricultural and special-duty chipper",
            "/contact?product=Wood%20chipper",
        )
        + card(
            "hydraulic-tyre-mounted-machine",
            "Tyre-mounted hydraulic machine",
            "Tyre-mounted hydraulic unit",
            "/contact?product=Tyre-mounted%20hydraulic%20machine",
        )
    )
    spare = '<div class="col-12 mt-5" id="spare-parts-and-control-panels">'
    if "special-purpose-machines" not in html and spare in html:
        html = html.replace(spare, special + spare, 1)
    chip = '<li><a href="#special-purpose-machines">Special purpose machines</a></li>'
    needle = '<li><a href="#spare-parts-and-control-panels">'
    if chip not in html and needle in html:
        html = html.replace(needle, chip + needle, 1)
    return html


def apply_capacity(html):
    for section_id, key in TPH:
        photo = tag(key, "capacity")
        html, count = re.subn(
            rf'(<section id="{section_id}"[\s\S]*?</h2>\s*)<img\b[^>]*>',
            rf"\1{photo}",
            html,
            count=1,
        )
        if count != 1:
            raise SystemExit(f"capacity section {section_id} not updated ({count})")
    urls = ", ".join(f'"{abs_url(key)}"' for _, key in TPH)
    html = re.sub(
        r'"image"\s*:\s*\[\s*"https://www\.srewprojects\.com/images/(?!catalog/)[^"]+"\s*\]',
        f'"image": [{urls}]',
        html,
        count=1,
    )
    layout = abs_url("stone-crusher-plant-layout")
    html = re.sub(
        r'(<meta property="og:image" content=")[^"]+(")',
        rf"\1{layout}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta name="twitter:image" content=")[^"]+(")',
        rf"\1{layout}\2",
        html,
        count=1,
    )
    return html


def apply_index(html):
    old_preload = re.search(r'<link rel="preload" as="image"[^>]*>', html)
    if not old_preload:
        raise SystemExit("homepage preload missing")
    preload = (
        '<link rel="preload" as="image" href="/videos/hero-poster.jpg" fetchpriority="high" media="(prefers-reduced-motion: no-preference)">\n'
        '    <link rel="preload" as="image" href="/images/hero/srew-mobile-crushing-unit-1400.webp" imagesrcset="/images/hero/srew-mobile-crushing-unit-800.webp 800w, /images/hero/srew-mobile-crushing-unit-1400.webp 1400w" imagesizes="(min-width:1024px) min(1152px, calc(100vw - 128px)), 100vw" fetchpriority="high" media="(prefers-reduced-motion: reduce)">'
    )
    html = html[: old_preload.start()] + preload + html[old_preload.end() :]
    old_media = '''<div class="hv4-media">
              <img src="/images/hero/srew-mobile-crushing-unit-1400.webp" srcset="/images/hero/srew-mobile-crushing-unit-800.webp 800w, /images/hero/srew-mobile-crushing-unit-1400.webp 1400w" sizes="(min-width:1024px) min(1152px, calc(100vw - 128px)), 100vw" alt="Mobile crushing unit with feed hopper, jaw crusher and vibrating screen built by SREW Projects" width="1400" height="787" fetchpriority="high" decoding="async">
            </div>'''
    new_media = '''<div class="hv4-media">
              <img id="hv4-fallback" class="hv4-fallback" alt="Mobile crushing unit with feed hopper, jaw crusher and vibrating screen built by SREW Projects" width="1400" height="787" decoding="async" hidden data-src="/images/hero/srew-mobile-crushing-unit-1400.webp" data-srcset="/images/hero/srew-mobile-crushing-unit-800.webp 800w, /images/hero/srew-mobile-crushing-unit-1400.webp 1400w" data-sizes="(min-width:1024px) min(1152px, calc(100vw - 128px)), 100vw">
              <video id="hv4-video" class="hv4-video" autoplay muted loop playsinline poster="/videos/hero-poster.jpg" preload="none" width="1280" height="720" aria-hidden="true">
                <source src="/videos/hero.webm" type="video/webm">
                <source src="/videos/hero.mp4" type="video/mp4">
              </video>
            </div>
            <script>
            (function () {
              var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              var img = document.getElementById("hv4-fallback");
              var video = document.getElementById("hv4-video");
              function showStill() {
                if (!img || img.getAttribute("src")) return;
                img.src = img.getAttribute("data-src");
                if (img.getAttribute("data-srcset")) img.srcset = img.getAttribute("data-srcset");
                if (img.getAttribute("data-sizes")) img.sizes = img.getAttribute("data-sizes");
                img.hidden = false;
                img.setAttribute("fetchpriority", "high");
                if (video) {
                  try { video.pause(); } catch (e) {}
                  video.hidden = true;
                  video.removeAttribute("autoplay");
                }
              }
              if (reduce) showStill();
              else if (video) video.addEventListener("error", showStill);
            })();
            </script>'''
    if old_media not in html:
        raise SystemExit("homepage hero media block not found")
    html = html.replace(old_media, new_media, 1)
    old_proof = '''<ul class="hv4-proof" aria-label="Why buyers choose SREW Projects">
              <li><strong>ISO 9001:2015</strong> <span>Certified</span></li>
              <li><strong>2–250 TPH</strong> <span>plant range</span></li>
              <li><strong>120+</strong> <span>projects delivered</span></li>
              <li><strong>10+ years</strong> <span>of experience</span></li>
              <li><strong>6–12 months</strong> <span>warranty, by product</span></li>
              <li><strong>6–30 days</strong> <span>dispatch from order</span></li>
            </ul>'''
    new_proof = '''<ul class="hv4-proof" aria-label="Why buyers choose SREW Projects">
              <li><strong>ISO 9001:2015</strong> <span>Certified</span></li>
              <li><strong><span data-counter="2">2</span>–<span data-counter="250">250</span> TPH</strong> <span>plant range</span></li>
              <li><strong><span data-counter="120">120</span>+</strong> <span>projects delivered</span></li>
              <li><strong><span data-counter="10">10</span>+ years</strong> <span>of experience</span></li>
              <li><strong><span data-counter="6">6</span>–<span data-counter="12">12</span> months</strong> <span>warranty, by product</span></li>
              <li><strong><span data-counter="6">6</span>–<span data-counter="30">30</span> days</strong> <span>dispatch from order</span></li>
            </ul>'''
    if old_proof not in html:
        raise SystemExit("homepage proof strip not found")
    return html.replace(old_proof, new_proof, 1)


def main():
    for path in sorted(ROOT.glob("*.html")):
        if path.name.startswith("google"):
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        slug = path.stem
        if slug in PAGES:
            html = meta_images(html, PAGES[slug])
        parts = split_main(html)
        if not parts:
            path.write_text(html, encoding="utf-8")
            continue
        head, body, tail = parts
        if slug in PAGES:
            body = replace_hero(body, PAGES[slug])
            body = collapse_gallery(body, PAGES[slug])
        if slug == "crusher-plant-capacity":
            # capacity sections live in main; meta is in head
            body = body  # replaced on full html below
        body = replace_linked_blocks(body)
        html = head + body + tail
        if slug == "crusher-plant-capacity":
            html = apply_capacity(html)
        if slug == "products":
            html = insert_products(html)
        if slug == "index":
            html = apply_index(html)
        path.write_text(html, encoding="utf-8")
        print("updated", path.name)

    used = set(PAGES.values()) | set(SLUG.values()) | set(TILES.values()) | {k for _, k in TPH}
    used |= {"portable-inclined-feed-conveyor", "plate-rolling-machine", "wood-chipper", "hydraulic-tyre-mounted-machine"}
    missing = sorted(set(CATALOG) - used)
    print("unused", missing or "none")


if __name__ == "__main__":
    main()
