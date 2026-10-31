#!/usr/bin/env python3
"""Attach the catalogue design system to every static page without touching copy,
except the GST label the brief requires and the proprietor block it forbids."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CSS = '<link rel="stylesheet" href="/css/catalogue.css">'
JS = '<script src="/js/catalogue.js" defer></script>'
SCRIPT_RE = re.compile(r"(<script\b[^>]*>.*?</script>)", re.I | re.S)
PRELOAD_FONT = re.compile(r"\s*<link rel=\"preload\" as=\"font\"[^>]*roboto[^>]*>", re.I)
PRELOAD_HERO = re.compile(
    r"\s*<link rel=\"preload\" as=\"image\" href=\"/(?:videos/hero-poster\.jpg|images/hero/srew-mobile-crushing-unit-1400\.webp)\"[^>]*>",
    re.I,
)
LEADERSHIP = re.compile(
    r"\s*<!-- LEADERSHIP SECTION -->\s*<section\b[^>]*aria-label=\"Leadership\"[^>]*>.*?</section>",
    re.S,
)
FOUNDER_FAQ = re.compile(
    r"\s*<div class=\"faq-item\">\s*<h3>Who is the SREW Projects founder\?</h3>.*?</div>",
    re.S,
)
CTA = 'class="btn btn-quote d-none d-lg-inline-flex">Contact us</a>'
CTA_NEW = 'class="btn btn-quote d-none d-lg-inline-flex">Enquire</a>'

def gst_outside_scripts(html):
    parts = SCRIPT_RE.split(html)
    out = []
    for part in parts:
        if part.lower().startswith("<script"):
            out.append(part)
        else:
            out.append(part.replace("+ GST", "+ GST 18%"))
    return "".join(out)

def main():
    n = 0
    for name in sorted(os.listdir(".")):
        if not name.endswith(".html") or name.startswith("google"):
            continue
        with open(name, encoding="utf-8") as f:
            html = f.read()
        original = html
        html = PRELOAD_FONT.sub("", html)
        html = PRELOAD_HERO.sub("", html)
        if CSS not in html:
            html = html.replace("</head>", "    " + CSS + "\n</head>", 1)
        if JS not in html:
            html = html.replace("</body>", "    " + JS + "\n</body>", 1)
        html = html.replace(CTA, CTA_NEW)
        if name == "about.html":
            html = LEADERSHIP.sub("\n", html, count=1)
            html = FOUNDER_FAQ.sub("\n", html, count=1)
        html = gst_outside_scripts(html)
        if html != original:
            with open(name, "w", encoding="utf-8") as f:
                f.write(html)
            n += 1
    print("updated", n)

if __name__ == "__main__":
    main()
