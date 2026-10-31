#!/usr/bin/env python3
"""Replace every product photo with the approved 20-image set.

Cutouts are written to public/images/products/. Scene photos are framed
visuals for plant and project pages, never full-bleed backgrounds.
"""
import os, re, shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/workspace")
SRC = Path("/tmp/new-products/new_products")
OUT = ROOT / "public/images/products"

# source file, slug, alt, scene?
JOBS = [
    ("01.jpg", "pulverizer", "Pulverizer with cyclone and bag filter, built by SREW Projects", False),
    ("03.jpg", "vsi", "Vertical shaft impactor built by SREW Projects", False),
    ("04.jpg", "plate-rolling", "Plate rolling machine at the SREW Projects fabrication works", False),
    ("05.jpg", "feed-conveyor", "Portable inclined feed conveyor built by SREW Projects", False),
    ("06.jpg", "glass-crusher", "Glass crusher built by SREW Projects", False),
    ("07.jpg", "tyre-hydraulic", "Tyre-mounted hydraulic machine built by SREW Projects", False),
    ("08.jpg", "mobile-plant", "Mobile crushing plant built by SREW Projects", False),
    ("09.jpg", "hopper", "Feed hopper for a crushing plant, built by SREW Projects", False),
    ("10.jpg", "control-panel", "Electrical control panel for a crushing plant, built by SREW Projects", False),
    ("11.jpg", "silos", "Cement storage silos fabricated by SREW Projects", False),
    ("12.jpg", "screen-structure", "Vibrating screen on a plant structure built by SREW Projects", False),
    ("13.jpg", "roller-crusher", "Double roll crusher built by SREW Projects", False),
    ("14.jpg", "rotary-drum", "Rotary drum built by SREW Projects", False),
    ("15.jpg", "cd-plant", "Construction and demolition waste recycling plant built by SREW Projects", True),
    ("17.png", "belt-conveyor", "Belt conveyor for a crushing plant, built by SREW Projects", False),
    ("18.png", "plant-render", "Stone crusher plant with conveyors and screens, built by SREW Projects", True),
    ("19.png", "screen-3deck", "Inclined 3-deck vibrating screen built by SREW Projects", False),
    ("20.png", "jaw-crusher", "Heavy-duty jaw crusher with drive, built by SREW Projects", False),
]

# Longest stem first. These old product filenames become the new slug.
STEM = [
    ("pulverizer-cyclone-bag-filter-system", "pulverizer"),
    ("portable-inclined-feed-conveyor", "feed-conveyor"),
    ("hydraulic-tyre-mounted-machine", "tyre-hydraulic"),
    ("mobile-jaw-crushing-plant-tyre", "mobile-plant"),
    ("mobile-impact-crushing-plant", "mobile-plant"),
    ("inclined-vibrating-screen-3-deck", "screen-3deck"),
    ("vibrating-screen-3-deck-pedestal", "screen-3deck"),
    ("vibrating-screen-on-structure-site", "screen-structure"),
    ("sheet-plate-rolling-machine", "plate-rolling"),
    ("plate-rolling-machine", "plate-rolling"),
    ("electrical-control-panel", "control-panel"),
    ("vsi-sand-making-machine", "vsi"),
    ("vsi-crusher-twin-motor", "vsi"),
    ("double-roll-crusher", "roller-crusher"),
    ("jaw-crusher-with-drive", "jaw-crusher"),
    ("jaw-crusher-heavy", "jaw-crusher"),
    ("jaw-crusher", "jaw-crusher"),
    ("glass-crusher", "glass-crusher"),
    ("cement-silos", "silos"),
    ("feed-hopper", "hopper"),
    ("belt-conveyor", "belt-conveyor"),
    ("rotary-drum", "rotary-drum"),
    ("srew-jaw-crusher", "jaw-crusher"),
    ("srew-vertical-shaft-crusher", "vsi"),
    ("product-jaw-crusher", "jaw-crusher"),
    ("product-VSI-crusher", "vsi"),
    ("project5", "cd-plant"),
]
STEM.sort(key=lambda x: len(x[0]), reverse=True)

# Old product photos that must not be reused. Cards lose them.
# Page-level (not a card) uses of the two scenes are rewritten, not deleted.
SCENE_STEMS = {
    "stone-crusher-plant-layout": "plant-render",
    "cnd-waste-recycling-plant": "cd-plant",
}

DROP_STEMS = {
    "small-roll-crusher",
    "wood-chipper",
    "project1", "project2", "project3", "project4",
    "hammer-crusher", "impact-crusher-hsi",
    "cone-crusher-single-cylinder", "hydraulic-cone-crusher-multi-cylinder",
    "mobile-cone-screening-plant", "modular-jaw-crushing-plant",
    "bucket-wheel-sand-washer", "screw-sand-washer",
    "dewatering-screen-hydrocyclone",
    "horizontal-vibrating-screen",
}

PRODUCT_PREFIXES = (
    "/images/catalog/", "/images/cards/", "/images/seo/", "/images/real/",
    "/images/spare-parts/", "/images/hero/", "/images/hero-background",
    "/images/thumbs/", "/images/ss/", "/images/og/",
    "/images/Products/", "/images/products/",
    "images/catalog/", "images/cards/", "images/seo/", "images/real/",
    "images/spare-parts/", "images/hero/", "images/hero-background",
    "images/thumbs/", "images/Products/", "images/Projects/",
    "images/product-", "/images/product-",
)

KEEP_BITS = (
    "/images/products/", "images/products/",
    "/images/Products/material/", "images/Products/material/",
    "/images/logo", "/images/favicon", "/images/apple-touch", "/images/android-chrome",
    "/images/clients/", "/images/icons/", "/images/footer/", "/images/video-thumbs/",
    "images/clients/", "images/icons/", "images/footer/", "images/video-thumbs/",
    "images/logo", "site.webmanifest",
)

IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
ATTR_RE = re.compile(r'(\w[\w:-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')')


def knockout(im):
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    white = (mx >= 240) & ((mx - mn) <= 26)
    black = mx <= 26
    h, w = white.shape
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    white_n = int((white & border).sum())
    black_n = int((black & border).sum())
    if max(white_n, black_n) < max(20, (2 * (h + w)) // 20):
        return Image.fromarray(arr)
    mask = white if white_n >= black_n else black
    acc = mask & border
    cur = acc.copy()
    for _ in range(max(h, w)):
        dil = cur.copy()
        dil[1:] |= cur[:-1]
        dil[:-1] |= cur[1:]
        dil[:, 1:] |= cur[:, :-1]
        dil[:, :-1] |= cur[:, 1:]
        new = dil & mask & ~acc
        if not new.any():
            break
        acc |= new
        cur = new
    arr[:, :, 3] = np.where(acc, 0, arr[:, :, 3])
    return Image.fromarray(arr)


def trim(im, pad=0.03):
    arr = np.array(im)
    if arr.shape[2] < 4:
        return im
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        return im
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    ph = int((y1 - y0) * pad) + 8
    pw = int((x1 - x0) * pad) + 8
    y0 = max(0, y0 - ph)
    x0 = max(0, x0 - pw)
    y1 = min(arr.shape[0] - 1, y1 + ph)
    x1 = min(arr.shape[1] - 1, x1 + pw)
    return im.crop((x0, y0, x1 + 1, y1 + 1))


def fit(im, max_edge):
    w, h = im.size
    scale = min(1.0, max_edge / max(w, h))
    if scale < 1:
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    return im


def save_variants(im, slug):
    im = fit(im, 1600)
    w, h = im.size
    meta = {"w": w, "h": h}
    full_w = OUT / f"{slug}.webp"
    full_a = OUT / f"{slug}.avif"
    im.save(full_w, "WEBP", quality=78, method=4)
    im.save(full_a, "AVIF", quality=45, speed=6)
    for edge, suffix in ((800, "-800"), (480, "-480")):
        small = fit(im, edge)
        small.save(OUT / f"{slug}{suffix}.webp", "WEBP", quality=76, method=4)
        small.save(OUT / f"{slug}{suffix}.avif", "AVIF", quality=42, speed=6)
    return meta


META = {}


def build_images():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    for fname, slug, _alt, scene in JOBS:
        im = Image.open(SRC / fname)
        im = fit(im, 1800)
        if not scene:
            im = trim(knockout(im))
        else:
            im = im.convert("RGB")
        META[slug] = save_variants(im, slug)
        print(f"built {slug} {META[slug]['w']}x{META[slug]['h']} scene={scene}")


def picture(slug, alt, lazy=True, cls="catalog-photo", sizes="(max-width: 576px) 92vw, 320px"):
    m = META[slug]
    webp = (
        f"/images/products/{slug}-480.webp 480w, "
        f"/images/products/{slug}-800.webp 800w, "
        f"/images/products/{slug}.webp {m['w']}w"
    )
    avif = (
        f"/images/products/{slug}-480.avif 480w, "
        f"/images/products/{slug}-800.avif 800w, "
        f"/images/products/{slug}.avif {m['w']}w"
    )
    extra = 'loading="lazy" decoding="async"' if lazy else 'fetchpriority="high" decoding="async"'
    return (
        f'<picture><source type="image/avif" srcset="{avif}" sizes="{sizes}">'
        f'<img src="/images/products/{slug}-800.webp" srcset="{webp}" sizes="{sizes}" '
        f'alt="{alt}" class="{cls}" width="{m["w"]}" height="{m["h"]}" {extra}></picture>'
    )


def attrs(tag):
    out = {}
    for m in ATTR_RE.finditer(tag):
        out[m.group(1).lower()] = m.group(2) if m.group(2) is not None else m.group(3)
    return out


def stem_of(url):
    base = url.split("?")[0].split("/")[-1]
    name = os.path.splitext(base)[0]
    name = re.sub(r"-(800|480|1400|1600)$", "", name)
    return name


def match_stem(stem):
    for key, slug in STEM:
        if stem == key or stem.startswith(key):
            return slug
    for key, slug in SCENE_STEMS.items():
        if stem == key or stem.startswith(key):
            return ("scene", slug)
    if stem in DROP_STEMS or any(stem.startswith(k) for k in DROP_STEMS):
        return "drop"
    return None


def is_product_url(url):
    if any(bit in url for bit in KEEP_BITS):
        return False
    return any(url.startswith(p) or (("src=\"" + p) in url) or p in url for p in PRODUCT_PREFIXES)


def is_card(html, pos):
    window = html[max(0, pos - 700):pos]
    return any(tok in window for tok in ("rp-card", "cat-tile", "mega-feature", "col-xl-3", "col-6 col-lg-3"))


def rewrite_html(text, name=""):
    def repl(m):
        tag = m.group(0)
        a = attrs(tag)
        src = a.get("src", "")
        if not src:
            return tag
        if any(bit in src for bit in ("/images/products/", "images/products/", "/images/Products/material/", "images/Products/material/", "video-thumbs", "/images/logo", "/images/icons/", "/images/clients/", "/images/footer/")):
            return tag
        stem = stem_of(src)
        hit = match_stem(stem)
        alt = a.get("alt", "")
        lazy = "fetchpriority" not in a
        cls = a.get("class", "catalog-photo")
        if hit == "drop":
            return ""
        if isinstance(hit, tuple) and hit[0] == "scene":
            if is_card(text, m.start()):
                return ""
            scene_cls = (cls + " cat-scene").strip()
            return picture(hit[1], alt or META_ALT[hit[1]], lazy=lazy, cls=scene_cls, sizes="(min-width: 992px) min(800px, 70vw), 100vw")
        if hit == "hopper" and "grizzly" in name:
            return ""
        if hit == "vsi" and name.startswith("m-sand"):
            return ""
        if hit:
            return picture(hit, alt or META_ALT[hit], lazy=lazy, cls=cls)
        if is_product_url(src):
            return ""
        return tag

    text = IMG_RE.sub(repl, text)
    # Meta and schema URLs that still point at retired product files.
    def url_sub(m):
        url = m.group(0)
        stem = stem_of(url)
        hit = match_stem(stem)
        if hit == "drop" or (isinstance(hit, tuple)):
            return "https://www.srewprojects.com/images/logo.png"
        if isinstance(hit, str):
            return f"https://www.srewprojects.com/images/products/{hit}.webp"
        if any(p.strip("/") in url for p in ("/images/catalog/", "/images/cards/", "/images/seo/", "/images/hero", "/images/real/", "/images/spare-parts/", "/images/Products/")) and "material" not in url and "/images/products/" not in url:
            return "https://www.srewprojects.com/images/logo.png"
        return url

    text = re.sub(r"https://www\.srewprojects\.com/images/[A-Za-z0-9_./%-]+", url_sub, text)
    text = text.replace(
        'href="/images/catalog/jaw-crusher-heavy-800.webp"',
        'href="/images/products/jaw-crusher-800.webp"',
    )
    text = text.replace(
        "/images/catalog/jaw-crusher-heavy-800.webp",
        "/images/products/jaw-crusher-800.webp",
    )
    return text


META_ALT = {slug: alt for _f, slug, alt, _s in JOBS}


def delete_old_assets():
    dirs = [
        "public/images/catalog", "public/images/cards", "public/images/seo",
        "public/images/real", "public/images/spare-parts", "public/images/hero",
        "public/images/thumbs", "public/images/ss", "public/images/og",
        "images/catalog", "images/cards", "images/seo", "images/real",
        "images/spare-parts", "images/hero", "images/thumbs", "images/Products",
        "images/Projects",
    ]
    for d in dirs:
        p = ROOT / d
        if p.exists():
            shutil.rmtree(p)
            print("removed", d)
    # Machine files sitting loose in public/images, keeping brand files and material chips.
    pub = ROOT / "public/images"
    for p in pub.iterdir():
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".avif"}:
            if p.name.startswith(("logo", "favicon", "apple-touch", "android-chrome")):
                continue
            if p.name in {"site.webmanifest"}:
                continue
            p.unlink()
            print("removed file", p.name)
    products = pub / "Products"
    if products.exists():
        for dirpath, dirnames, filenames in os.walk(products, topdown=False):
            if "material" in Path(dirpath).parts:
                continue
            for fn in filenames:
                Path(dirpath, fn).unlink()
        # drop empty dirs except material
        for dirpath, dirnames, filenames in os.walk(products, topdown=False):
            path = Path(dirpath)
            if "material" in path.parts:
                continue
            if path != products and not any(path.iterdir()):
                path.rmdir()


def main():
    build_images()
    for html in sorted(ROOT.glob("*.html")):
        original = html.read_text(encoding="utf-8")
        updated = rewrite_html(original, html.name)
        if updated != original:
            html.write_text(updated, encoding="utf-8")
            print("rewrote", html.name)
    delete_old_assets()
    # manifest
    lines = ["slug,width,height,scene"]
    for _f, slug, _a, scene in JOBS:
        m = META[slug]
        lines.append(f"{slug},{m['w']},{m['h']},{int(scene)}")
    (OUT / "manifest.csv").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("done", len(list(OUT.iterdir())), "files")


if __name__ == "__main__":
    main()
