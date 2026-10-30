import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WEB3_KEY = 'ddd31534-f1b6-47fb-84a9-7d998299513e';

const HERO = `<section class="el-hero" aria-label="Company introduction">
        <div class="el-hero-media">
          <svg class="hero-graphic" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Graphic of a crushing and screening line. Not a photograph of a completed installation.">
            <rect width="1440" height="800" fill="#0c0c0c"/>
            <g stroke="#242424" stroke-width="1">
              <path d="M0 100H1440M0 200H1440M0 300H1440M0 400H1440M0 500H1440M0 600H1440M0 700H1440"/>
              <path d="M120 0V800M240 0V800M360 0V800M480 0V800M600 0V800M720 0V800M840 0V800M960 0V800M1080 0V800M1200 0V800M1320 0V800"/>
            </g>
            <g fill="none" stroke="#f4f4f4" stroke-width="2">
              <path d="M760 520h160l70-150h90l36 150"/>
              <rect x="820" y="340" width="130" height="120"/>
              <path d="M950 340l80-70h150v70"/>
              <path d="M1100 390h180"/>
              <rect x="1180" y="300" width="160" height="110"/>
              <path d="M1180 410h160M1180 450h160"/>
            </g>
            <g fill="none" stroke="#66dba4" stroke-width="3">
              <circle cx="860" cy="560" r="22"/><circle cx="940" cy="560" r="22"/><path d="M838 560h124"/>
            </g>
            <rect x="780" y="250" width="36" height="4" fill="#66dba4"/>
            <text x="780" y="278" fill="#a7a7a7" font-family="Roboto Mono, ui-monospace, monospace" font-size="14">EQUIPMENT GRAPHIC</text>
            <text x="780" y="640" fill="#66dba4" font-family="Roboto Mono, ui-monospace, monospace" font-size="14">NOT A PHOTOGRAPH OF AN INSTALLATION</text>
          </svg>
          <div class="el-hero-shade" aria-hidden="true"></div>
        </div>
        <div class="el-hero-copy">
          <p class="el-eyebrow">ISO 9001:2015 Certified · Hyderabad, India</p>
          <h1>Complete crushing, screening and M-Sand plants</h1>
          <p class="hero-audience">For quarry, aggregate and recycling businesses in India.</p>
          <p class="el-sub">Design, manufacturing, installation and commissioning of industrial crushing and screening plants. Capacity stays between 2 and 250 TPH.</p>
          <div class="hero-actions" role="group" aria-label="Enquire">
            <a class="btn btn-quote" href="#quote-section">Get a Quote</a>
            <a class="btn btn-quote" href="tel:+918790759460">Call +91 8790759460</a>
            <a class="btn btn-quote" href="tel:+916281665454">Call +91 6281665454</a>
            <a class="btn btn-quote" href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <p class="hero-note">Equipment graphic. Not a photograph of a completed installation.</p>
        </div>
        <div class="el-stats" aria-label="Why buyers choose SREW Projects">
          <div class="el-stat"><strong>2–250 TPH</strong><span>plant range</span></div>
          <div class="el-stat"><strong>120+</strong><span>projects delivered</span></div>
          <div class="el-stat"><strong>10+ years</strong><span>of experience</span></div>
          <div class="el-stat"><strong>6–30 days</strong><span>dispatch from order</span></div>
        </div>
        <a class="el-scroll" href="#el-statement">Scroll down</a>
      </section>
`;

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
}
function encode(s) {
  return s.replace(/&/g, '&amp;');
}
function shortenTitle(raw) {
  let t = decode(raw).replace(/\s+/g, ' ').trim();
  if (t.length <= 60) return raw;
  t = t.replace(/\s*\|\s*SREW Projects(?: Hyderabad)?$/i, '').trim();
  const brand = ' | SREW';
  if ((t + brand).length <= 60) return encode(t + brand);
  let cut = t.slice(0, 60 - brand.length);
  cut = cut.replace(/\s+\S*$/, '').replace(/[|:,–—-]\s*$/, '').trim();
  return encode(cut + brand);
}
function shortenDesc(raw) {
  let t = decode(raw).replace(/\s+/g, ' ').trim();
  if (t.length <= 155) return raw;
  let cut = t.slice(0, 152).replace(/\s+\S*$/, '').replace(/[|:,–—-]\s*$/, '').trim();
  if (!/[.!?…]$/.test(cut)) cut += '…';
  return encode(cut);
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function navItems(file) {
  const stem = file.replace(/\.html$/, '');
  const links = [
    ['/crusher-plant-capacity', 'Plants'],
    ['/projects', 'Projects'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ];
  return links.map(([href, label]) => {
    let on = false;
    if (href === '/crusher-plant-capacity' && (stem === 'crusher-plant-capacity' || /^\d+-tph-/.test(stem))) on = true;
    if (href === '/projects' && (stem === 'projects' || stem.startsWith('project-'))) on = true;
    if (href === '/about' && stem === 'about') on = true;
    if (href === '/contact' && stem === 'contact') on = true;
    const cls = on ? 'nav-link active' : 'nav-link';
    const aria = on ? ' aria-current="page"' : '';
    return `<li class="nav-item"><a class="${cls}"${aria} href="${href}">${label}</a></li>`;
  }).join('\n              ');
}

const navRe = /<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/industries">Industries<\/a><\/li>\s*<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/projects">Projects<\/a><\/li>\s*<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/spare-parts">Spare Parts<\/a><\/li>\s*<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/ss-fabrication">SS Fabrication<\/a><\/li>\s*<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/about">About<\/a><\/li>\s*<li class="nav-item"><a class="nav-link[^"]*"(?: aria-current="page")? href="\/contact">Contact<\/a><\/li>/;

function needsProductForm(file, html) {
  if (html.includes('id="leadQuoteForm"') || html.includes('id="product-quote"')) return false;
  if (['products.html', 'spare-parts.html', 'hsi-crusher-manufacturer.html', 'grizzly-feeder-manufacturer.html'].includes(file)) return true;
  return html.includes('product-hero') || html.includes('pd-keyspecs');
}

function formHtml(productName) {
  const safe = escapeHtml(productName || 'this equipment');
  return `
<section id="product-quote" aria-label="Get a quote for this equipment">
  <div class="container">
    <div class="quote-form-card">
      <p class="el-eyebrow">Enquire</p>
      <h2>Get a Quote</h2>
      <p class="quote-form-desc">Share capacity, material and site for ${safe}. This sends to the same enquiry inbox as the contact form. Prices on this page are unchanged and are ex-works Hyderabad + GST.</p>
      <form id="leadQuoteForm" action="https://api.web3forms.com/submit" method="POST" novalidate>
        <input type="hidden" name="access_key" value="${WEB3_KEY}">
        <input type="hidden" name="from_name" value="SREW Quote Form">
        <input type="hidden" name="subject" value="Quote: ${safe}">
        <div class="row">
          <div class="col-md-6 form-group-premium">
            <label for="quoteName" class="form-label-premium">Full name <span class="text-danger">*</span></label>
            <input type="text" id="quoteName" class="form-control-premium" name="name" required autocomplete="name" placeholder="Full name">
          </div>
          <div class="col-md-6 form-group-premium">
            <label for="quoteEmail" class="form-label-premium">Email <span class="text-danger">*</span></label>
            <input type="email" id="quoteEmail" class="form-control-premium" name="email" required autocomplete="email" placeholder="name@company.com">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group-premium">
            <label for="quotePhone" class="form-label-premium">Phone <span class="text-danger">*</span></label>
            <input type="tel" id="quotePhone" class="form-control-premium" name="phone" required autocomplete="tel" inputmode="numeric" placeholder="10-digit mobile number">
          </div>
          <div class="col-md-6 form-group-premium">
            <label for="quoteLocation" class="form-label-premium">Location <span class="text-danger">*</span></label>
            <input type="text" id="quoteLocation" class="form-control-premium" name="location" required placeholder="City, state">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group-premium">
            <label for="quoteCapacity" class="form-label-premium">Capacity <span class="text-danger">*</span></label>
            <select id="quoteCapacity" class="form-control-premium" name="capacity" required>
              <option value="" disabled selected>Select capacity range</option>
              <option value="2-20 TPH">2 - 20 TPH</option>
              <option value="20-50 TPH">20 - 50 TPH</option>
              <option value="50-100 TPH">50 - 100 TPH</option>
              <option value="100-150 TPH">100 - 150 TPH</option>
              <option value="150-250 TPH">150 - 250 TPH</option>
              <option value="Other / custom">Other / custom</option>
              <option value="Individual Equipment Spares">Individual equipment / spares</option>
            </select>
          </div>
          <div class="col-md-6 form-group-premium">
            <label for="quoteMaterial" class="form-label-premium">Material <span class="text-danger">*</span></label>
            <select id="quoteMaterial" class="form-control-premium" name="material" required>
              <option value="" disabled selected>Select material</option>
              <option value="Granite">Granite</option>
              <option value="Limestone">Limestone</option>
              <option value="Basalt">Basalt</option>
              <option value="Iron Ore">Iron Ore</option>
              <option value="River Sand / MSand">River sand / M-Sand</option>
              <option value="C&amp;D Recycling Waste">C&amp;D waste</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div class="form-group-premium">
          <label for="quoteMessage" class="form-label-premium">Requirements</label>
          <textarea id="quoteMessage" class="form-control-premium" name="message" rows="3">Enquiry for ${safe}</textarea>
        </div>
        <button type="submit" class="btn btn-quote">Get a Quote</button>
      </form>
    </div>
  </div>
</section>
`;
}

function actions(href) {
  return `<p class="hero-audience">For quarry, aggregate and recycling businesses in India.</p>
<div class="hero-actions" role="group" aria-label="Enquire">
  <a class="btn btn-quote" href="${href}">Get a Quote</a>
  <a class="btn btn-quote" href="tel:+918790759460">Call +91 8790759460</a>
  <a class="btn btn-quote" href="tel:+916281665454">Call +91 6281665454</a>
  <a class="btn btn-quote" href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer">WhatsApp</a>
</div>`;
}

function addStyles(html) {
  if (html.includes('/css/air.css') || html.includes('css/air.css')) return html;
  const links = '\n    <link rel="stylesheet" href="/css/tokens.css">\n    <link rel="stylesheet" href="/css/air.css">';
  if (html.includes('<link rel="stylesheet" href="/css/elevate.css">')) {
    return html.replace('<link rel="stylesheet" href="/css/elevate.css">', '<link rel="stylesheet" href="/css/elevate.css">' + links);
  }
  if (html.includes('<link rel="stylesheet" href="css/elevate.css">')) {
    return html.replace('<link rel="stylesheet" href="css/elevate.css">', '<link rel="stylesheet" href="css/elevate.css">' + links);
  }
  if (html.includes('<link rel="stylesheet" href="css/elevate.css" />')) {
    return html.replace('<link rel="stylesheet" href="css/elevate.css" />', '<link rel="stylesheet" href="css/elevate.css" />' + links);
  }
  return html;
}

function fixAlts(html) {
  return html.replace(/alt="([^"]*)"/g, (full, alt) => {
    if (!/built by SREW Projects/i.test(alt)) return full;
    let next = alt.replace(/,?\s*built by SREW Projects/gi, '').replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, '');
    next += '. Equipment graphic, not a photograph of a completed installation.';
    return `alt="${next}"`;
  });
}

function retitle(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) return html;
  const oldTitle = titleMatch[1];
  const newTitle = shortenTitle(oldTitle);
  if (newTitle !== oldTitle) {
    html = html.replace(`<title>${oldTitle}</title>`, `<title>${newTitle}</title>`);
    html = html.split(`content="${oldTitle}"`).join(`content="${newTitle}"`);
  }
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (descMatch) {
    const oldDesc = descMatch[1];
    const newDesc = shortenDesc(oldDesc);
    if (newDesc !== oldDesc) {
      html = html.split(`content="${oldDesc}"`).join(`content="${newDesc}"`);
    }
  }
  return html;
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !f.startsWith('google'));
const report = { navMiss: [], styleMiss: [], forms: [], titles: [] };

for (const file of files) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const before = html;
  html = addStyles(html);
  if (!html.includes('/css/air.css')) report.styleMiss.push(file);

  if (navRe.test(html)) {
    html = html.replace(navRe, navItems(file));
  } else if (html.includes('id="megaProductsItem"')) {
    report.navMiss.push(file);
  }

  html = html.replace('class="d-none d-xl-inline">+91 8790759460</span>', 'class="nav-phone-label"><span class="nav-phone-short">Call</span><span class="nav-phone-full">+91 8790759460</span></span>');
  html = html.replace('class="btn btn-quote d-none d-lg-inline-flex">Contact us</a>', 'class="btn btn-quote">Get a Quote</a>');
  html = html.replaceAll('>Inquire Now<', '>Get a Quote<');
  html = html.replaceAll('Get started', 'Get a Quote');
  html = html.replaceAll('src="/images/seo/150-tph-stone-crusher-plant-full-view.webp"', 'src="/images/graphics/plant-layout.svg"');
  html = html.replaceAll('alt="150 TPH stone crusher plant built by SREW Projects"', 'alt="Graphic of a crushing plant layout. Not a photograph of a completed installation."');
  html = html.replaceAll('content="#14202E"', 'content="#0c0c0c"');
  html = fixAlts(html);

  const addForm = needsProductForm(file, html);
  let quoteHref = '/contact';
  if (file === 'contact.html') quoteHref = '#contactForm';
  else if (file === 'index.html') quoteHref = '#quote-section';
  else if (html.includes('id="leadQuoteForm"')) quoteHref = '#leadQuoteForm';
  else if (addForm) quoteHref = '#product-quote';

  if (file === 'index.html') {
    const start = html.indexOf('<section class="el-hero"');
    const end = html.indexOf('<section class="el-statement"');
    if (start >= 0 && end > start) html = html.slice(0, start) + HERO + '\n      ' + html.slice(end);
    html = html.replace(/\s*<link rel="preload" as="image" href="\/videos\/hero-poster\.jpg"[^>]*>/g, '');
    html = html.replace(/\s*<link rel="preload" as="image" href="\/images\/hero\/srew-mobile-crushing-unit-1400\.webp"[^>]*>/g, '');
    html = html.replace(/src="\/images\/real\/mobile-stone-crusher-plant-srew-projects\.webp"/g, 'src="/images/graphics/mobile-plant.svg"');
    html = html.replace(/\s*srcset="\/images\/real\/[^"]*"/g, '');
    html = html.replace('alt="Mobile stone crusher plant with jaw crusher and screen by SREW Projects"', 'alt="Graphic of a tracked mobile crushing plant. Not a photograph of a completed installation."');
    html = html.replace(/src="images\/Projects\/project[123]\.webp"/g, 'src="/images/graphics/project-mark.svg"');
    html = html.replace('alt="200 TPH Crushing & Screening Plant at West Bengal"', 'alt="Graphic marker for the West Bengal project. Not a photograph of the installation."');
    html = html.replace('alt="250 TPH Aggregate Plant at Singareni"', 'alt="Graphic marker for the Singareni project. Not a photograph of the installation."');
    html = html.replace('alt="40 TPH Mobile Crushing Unit in Odisha"', 'alt="Graphic marker for the Odisha project. Not a photograph of the installation."');
    html = html.replace(/src="\/images\/video-thumbs\/[^"]+\.webp"/g, 'src="/images/graphics/video-poster.svg"');
    html = html.replace(/alt="([^"]*SREW Projects video)"/g, 'alt="Illustrated poster for $1. Not a site photograph."');
    const swaps = {
      '/images/seo/ss-chemical-storage-tank-12000l.webp': '/images/graphics/ss-tank.svg',
      '/images/ss/ss-steam-cooking-range.webp': '/images/graphics/ss-kitchen.svg',
      '/images/ss/ss-service-counter.webp': '/images/graphics/ss-counter.svg',
      '/images/seo/sheet-plate-rolling-machine.webp': '/images/graphics/ss-fab.svg',
      'images/Products/vibrating-screen.webp': '/images/graphics/screen.svg',
      'images/Products/srew-sand-dryer.webp': '/images/graphics/dryer.svg',
      'images/Products/srew-cd-recycling.webp': '/images/graphics/recycle.svg',
      'images/spare-parts/jaw crusher plate.webp': '/images/graphics/parts.svg',
      '/images/cards/spare-parts.webp': '/images/graphics/parts.svg',
      '/images/cards/ss-fabrication.webp': '/images/graphics/ss-fab.svg',
    };
    for (const [from, to] of Object.entries(swaps)) html = html.split(from).join(to);
    html = html.replace(
      'SREW Projects is a premier manufacturer dedicated to heavy-duty industrial fabrication and precision engineering. We specialize in the end-to-end design, proprietary manufacturing, and turnkey installation of high-capacity crushing, screening, sand processing, and material handling plants.',
      'SREW Projects manufactures crushing, screening, sand processing and C&amp;D recycling plants from 2–250 TPH in Hyderabad, then installs and commissions them.'
    );
  }

  if (file === 'about.html') {
    html = html.replace('alt="Mr. Ranga Reddy J. - Founder & Head of Operations"', 'alt="SREW Projects manufacturing operations"');
    html = html.replace(
      '<h2 class="mb-3 reveal text-gradient" style="font-size: 2.5rem; font-weight: 800; color: var(--c-dark); transition-delay: 0.1s;">Mr. Ranga Reddy J.</h2>\n                            <h5 class="text-muted mb-4 reveal" style="font-weight: 600; transition-delay: 0.2s;">Founder & Head of Operations</h5>',
      '<h2 class="mb-3 reveal text-gradient" style="font-size: 2.5rem; font-weight: 800; color: var(--c-dark); transition-delay: 0.1s;">Founder &amp; Head of Operations</h2>'
    );
    html = html.replace(
      'With over 30 years of field-tested expertise, Ranga Reddy leads SREW Projects with a focus on reliability and execution quality. His extensive career includes serving as Operations Head for major projects in Kenya and key roles at Srisailam and Singareni Collieries.',
      'With over 30 years of field-tested expertise, SREW Projects is led with a focus on reliability and execution quality. That work includes operations leadership for major projects in Kenya and key roles at Srisailam and Singareni Collieries.'
    );
    html = html.replace(
      'Having managed industrial operations across India, Africa, and beyond, he bridges local conditions with international standards to deliver practical, robust engineering solutions. A recipient of the <strong>\'Best Engineer Award\'</strong> by Balaji Industries, his hands-on leadership at SREW Projects ensures every project is built for durability and long-term performance.',
      'Work across India, Africa, and beyond connects local conditions with international standards to deliver practical engineering. A <strong>Best Engineer Award</strong> from Balaji Industries sits with that record. Hands-on leadership at SREW Projects keeps each plant built for durability.'
    );
    html = html.replace(
      'Mr. Ranga Reddy J., Founder & Head of Operations, brings over 30 years of hands-on expertise from major global industrial projects.',
      'The founder and head of operations brings over 30 years of hands-on expertise from major industrial projects.'
    );
  }

  if (file === 'contact.html') {
    html = html.replace(
      '<form id="contactForm" action="#" novalidate>',
      `<form id="contactForm" action="https://api.web3forms.com/submit" method="POST" novalidate>\n                        <input type="hidden" name="access_key" value="${WEB3_KEY}">\n                        <input type="hidden" name="from_name" value="SREW Contact Form">`
    );
  }

  if (addForm) {
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const block = formHtml(h1);
    if (html.includes('</main>')) html = html.replace('</main>', block + '\n</main>');
    else html = html.replace('<footer', block + '\n<footer');
    if (!html.includes('forms.js')) {
      html = html.replace('<script src="js/main.js"></script>', '<script src="js/main.js"></script>\n    <script src="js/forms.js"></script>');
    }
    html = html.replace(/href="(?:contact\.html|\/contact)\?product=[^"]*"/g, 'href="#product-quote"');
    report.forms.push(file);
  }

  if (file !== 'index.html' && !html.includes('class="hero-audience"') && html.includes('</h1>')) {
    html = html.replace('</h1>', '</h1>\n' + actions(quoteHref));
  }

  if (!html.includes('class="sticky-mobile-cta"') && html.includes('<!-- Sticky Mobile Bottom CTA Bar -->')) {
    const bar = `
    <nav class="sticky-mobile-cta" aria-label="Call, WhatsApp, or get a quote">
      <a class="sticky-cta-btn call" href="tel:+918790759460">Call</a>
      <a class="sticky-cta-btn whatsapp" href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a class="sticky-cta-btn quote" href="${quoteHref}">Get a Quote</a>
    </nav>`;
    html = html.replace('<!-- Sticky Mobile Bottom CTA Bar -->', '<!-- Sticky Mobile Bottom CTA Bar -->' + bar);
  }

  const oldTitle = (before.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  html = retitle(html);
  const newTitle = (html.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  if (oldTitle !== newTitle) report.titles.push({ file, from: oldTitle, to: newTitle, len: decode(newTitle).length });

  if (html !== before) fs.writeFileSync(path.join(root, file), html);
}

const titles = new Map();
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const t = decode((html.match(/<title>([^<]*)<\/title>/) || [, ''])[1]);
  if (!titles.has(t)) titles.set(t, []);
  titles.get(t).push(file);
}
const dupes = [...titles.entries()].filter(([, list]) => list.length > 1);
fs.mkdirSync(path.join(root, 'public/css'), { recursive: true });
fs.copyFileSync(path.join(root, 'css/tokens.css'), path.join(root, 'public/css/tokens.css'));
fs.copyFileSync(path.join(root, 'css/air.css'), path.join(root, 'public/css/air.css'));
fs.copyFileSync(path.join(root, 'js/forms.js'), path.join(root, 'public/js/forms.js'));
console.log(JSON.stringify({
  files: files.length,
  navMiss: report.navMiss,
  styleMiss: report.styleMiss,
  forms: report.forms.length,
  titles: report.titles.length,
  dupes,
}, null, 2));
