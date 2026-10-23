#!/usr/bin/env python3
"""Apply one inner-page band and strip clutter that does not belong on the site."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}
TOKEN = re.compile(r"<(/?)([a-zA-Z][\w:-]*)([^>]*)>", re.S)
H1 = re.compile(r"<h1\b[^>]*>[\s\S]*?</h1>", re.I)
LEAD = re.compile(r"\s*<p\b[^>]*class=\"[^\"]*\blead\b[^\"]*\"[^>]*>[\s\S]*?</p>", re.I)
CRUMB = re.compile(r"<nav\b[^>]*aria-label=\"[Bb]readcrumb\"[^>]*>[\s\S]*?</nav>", re.I)

def class_list(attrs):
    m = re.search(r"class\s*=\s*\"([^\"]*)\"", attrs) or re.search(r"class\s*=\s*'([^']*)'", attrs)
    return m.group(1).split() if m else []

def remove_classed(html, names):
    out = []
    i = 0
    n = len(html)
    while i < n:
        m = TOKEN.search(html, i)
        if not m:
            out.append(html[i:])
            break
        closing, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)
        hit = (not closing) and any(c in class_list(attrs) for c in names)
        self_close = attrs.rstrip().endswith("/") or tag in VOID
        if hit and not self_close:
            out.append(html[i:m.start()])
            depth = 1
            j = m.end()
            while j < n and depth:
                m2 = TOKEN.search(html, j)
                if not m2:
                    j = n
                    break
                c2, t2, a2 = m2.group(1), m2.group(2).lower(), m2.group(3)
                if t2 == tag:
                    if c2:
                        depth -= 1
                    elif not a2.rstrip().endswith("/"):
                        depth += 1
                j = m2.end()
                if depth == 0:
                    break
            i = j
            continue
        if hit and self_close:
            out.append(html[i:m.start()])
            i = m.end()
            continue
        out.append(html[i:m.end()])
        i = m.end()
    return "".join(out)

def eyebrow_for(stem):
    resources = (
        "blogs", "vibrating-screen-issues", "vibrating-screen-for-crusher-plant",
        "vsi-vs-hsi-crusher", "jaw-crusher-vs-cone-crusher", "mobile-crusher-vs-fixed-crusher",
        "conveyor-failures", "reasons-crusher-output-drops", "crusher-maintenance-reduction-methods",
        "factors-to-compare-before-buying-a-crusher-plant", "imported-vs-made-in-india-crushing-plants",
        "m-sand-plant-price-guide", "stone-crusher-plant-investment-guide",
        "cd-waste-recycling-plant-cost",
    )
    if stem == "about":
        return "Company"
    if stem in ("contact", "thankyou"):
        return "Contact"
    if stem == "industries" or stem.startswith("industry-"):
        return "Industries"
    if stem == "projects" or stem.startswith("project-"):
        return "Projects"
    if stem == "videos":
        return "Videos"
    if stem == "spare-parts":
        return "Spare parts"
    if stem == "ss-fabrication":
        return "Fabrication"
    if stem in ("privacy-policy", "terms-and-conditions", "cookies", "shipping-policy", "returns-warranty", "404"):
        return "Legal"
    if stem in resources or stem.endswith("-cost") or stem.endswith("-guide") or "-vs-" in stem:
        return "Resources"
    return "Products"

def add_marker(html, marker):
    pat = re.compile(r'class="([^"]*\b%s\b[^"]*)"' % re.escape(marker))
    def repl(m):
        cls = m.group(1)
        if "el-band" in cls.split():
            return m.group(0)
        return 'class="%s el-band"' % cls
    return pat.sub(repl, html, count=1)

def mark_article(html):
    pat = re.compile(r'<section\s+class="(py-5 text-white[^"]*)"')
    def repl(m):
        cls = m.group(1)
        if "el-band" in cls.split():
            return m.group(0)
        return m.group(0).replace('class="%s"' % cls, 'class="%s el-band"' % cls, 1)
    return pat.sub(repl, html, count=1)

def inject_eyebrow(html, label):
    if "el-eyebrow" in html:
        return html
    return re.sub(r"<h1\b", '<p class="el-eyebrow">%s</p>\n<h1' % label, html, count=1)

def clean_h1(tag):
    tag = re.sub(r'\sstyle="[^"]*"', "", tag)
    tag = tag.replace("text-gradient", "").replace("fw-bold", "").replace("display-4", "")
    tag = re.sub(r'\sclass="\s*"', "", tag)
    tag = re.sub(r"\s{2,}", " ", tag)
    return tag

def lift_band(html, label):
    main = re.search(r"<main\b[^>]*>", html, re.I)
    if not main:
        return html, False
    h1 = H1.search(html, main.end())
    if not h1:
        return html, False
    region = html[main.end():h1.start()]
    crumb_m = CRUMB.search(region)
    crumb = crumb_m.group(0) if crumb_m else ""
    lead_m = LEAD.match(html, h1.end())
    lead = lead_m.group(0).strip() if lead_m else ""
    # remove from the end so indexes stay valid
    spans = []
    if lead_m:
        spans.append((lead_m.start(), lead_m.end()))
    spans.append((h1.start(), h1.end()))
    if crumb_m:
        spans.append((main.end() + crumb_m.start(), main.end() + crumb_m.end()))
    for a, b in sorted(spans, reverse=True):
        html = html[:a] + html[b:]
    band = (
        '<section class="el-band" aria-label="Page header"><div class="container">'
        '<p class="el-eyebrow">%s</p>%s%s%s</div></section>'
        % (label, clean_h1(h1.group(0)), ("\n" + lead) if lead else "", ("\n" + crumb) if crumb else "")
    )
    main = re.search(r"<main\b[^>]*>", html, re.I)
    html = html[:main.end()] + "\n" + band + html[main.end():]
    return html, True

def declutter(html):
    html = re.sub(r'[ \t]*<link rel="preconnect" href="https://fonts\.googleapis\.com"[^>]*>\s*', "", html)
    html = re.sub(r'[ \t]*<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\s*', "", html)
    html = re.sub(r'[ \t]*<noscript>\s*<link rel="stylesheet" href="https://fonts\.googleapis\.com/[^"]+"[^>]*>\s*</noscript>\s*', "", html)
    html = re.sub(r'[ \t]*<link rel="stylesheet" href="https://fonts\.googleapis\.com/[^"]+"[^>]*>\s*', "", html)
    html = html.replace('name="theme-color" content="#0056b3"', 'name="theme-color" content="#14202E"')
    html = html.replace('style="margin-top:90px"', "")
    html = html.replace("✕", "Close")
    html = remove_classed(html, {"whatsapp-float", "sticky-mobile-cta", "brochure-overlay", "brochure-modal-card", "bg-warning"})
    html = re.sub(
        r"https://(?:i\.ytimg\.com|img\.youtube\.com)/vi/([A-Za-z0-9_-]{11})/(?:hqdefault|mqdefault|sddefault|maxresdefault)\.jpg",
        r"/images/video-thumbs/\1.webp",
        html,
    )
    html = re.sub(
        r'("thumbnailUrl"\s*:\s*\[)\s*"(/images/video-thumbs/[^"]+)"',
        r'\1"https://www.srewprojects.com\2"',
        html,
    )
    html = re.sub(
        r'("thumbnailUrl"\s*:\s*)"(/images/video-thumbs/[^"]+)"',
        r'\1"https://www.srewprojects.com\2"',
        html,
    )
    return html

def make_404():
    src = open("cookies.html", encoding="utf-8").read()
    src = src.replace("Cookie Policy | SREW Projects", "Page not found | SREW Projects")
    src = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="The page you requested is not on this site.">', src, count=1)
    src = re.sub(r'<link rel="canonical" href="[^"]*">\s*', "", src, count=1)
    src = src.replace("index, follow, max-image-preview:large", "noindex, nofollow")
    src = src.replace(">Cookie Policy<", ">Page not found<")
    src = re.sub(r"<main\b[^>]*>[\s\S]*?</main>", """<main id="main-content" role="main">
      <section class="py-5"><div class="container" style="max-width:40rem;padding-top:24px;padding-bottom:64px">
        <p class="lead">That page is not available. Use the menu to open a product, a plant capacity, or the contact page.</p>
        <a class="btn btn-primary" href="/">Back to home</a>
      </div></section>
    </main>""", src, count=1)
    open("404.html", "w", encoding="utf-8").write(src)

def main():
    if not os.path.exists("404.html"):
        make_404()
    report = []
    for name in sorted(os.listdir(".")):
        if not name.endswith(".html") or name.startswith("google"):
            continue
        path = name
        html = open(path, encoding="utf-8").read()
        original = html
        html = declutter(html)
        stem = name[:-5]
        hero = bool(re.search(r'class="[^"]*\b(?:page-header|product-hero|subpage-hero)\b', html)) or bool(re.search(r'<section\s+class="py-5 text-white', html))
        if stem == "index":
            pass
        elif hero:
            for marker in ("page-header", "product-hero", "subpage-hero"):
                if re.search(r'class="[^"]*\b%s\b' % marker, html):
                    html = add_marker(html, marker)
            if re.search(r'<section\s+class="py-5 text-white', html):
                html = mark_article(html)
            html = inject_eyebrow(html, eyebrow_for(stem))
        elif "el-band" not in html:
            html = re.sub(r'\s*<p class="el-eyebrow">[^<]*</p>\s*', "\n", html, count=1)
            html, ok = lift_band(html, eyebrow_for(stem))
            if not ok:
                report.append("NO-H1 " + name)
        kind = "home" if stem == "index" else ("band" if "el-band" in html else "MISSING")
        if kind == "MISSING":
            report.append("MISSING " + name)
        if html != original:
            open(path, "w", encoding="utf-8").write(html)
            report.append("updated " + name + " " + kind)
        else:
            report.append("unchanged " + name + " " + kind)
    print("\n".join(report))

if __name__ == "__main__":
    main()
