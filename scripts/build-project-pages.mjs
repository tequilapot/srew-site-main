/**
 * One-shot generator for photographed project pages, image variants,
 * the projects gallery, footer, and contextual links.
 * Image encodes use sharp (NODE_PATH=/tmp/imgtools/node_modules).
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire('/tmp/imgtools/package.json');
const sharp = require('sharp');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploads = '/home/ubuntu/.cursor/projects/agent-repos-srew-site-main/uploads';
const outRoot = path.join(root, 'public/images/projects');
const widths = [480, 800, 1280];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const sources = {
  'mirchi': { file: 'pulvarizer-flour-mill__pulvarizer-flour-mill_bfc3.jpg', alt: 'Hammer mill with cyclone and bag filter, the mirchi pulverizer built by SREW Projects' },
  'glass-3q': { file: 'glass-crusher__glass-crusher-front-three-quarter_8099.jpg', alt: 'Glass crusher with top hopper and shaft ends, three-quarter view in the works' },
  'glass-rear': { file: 'glass-crusher__glass-crusher-rear-motor_501d.jpg', alt: 'Rear of the glass crusher, motor side' },
  'glass-angle': { file: 'glass-crusher__glass-crusher-angle_528a.jpg', alt: 'Angled view of the glass crusher housing and hopper' },
  'glass-front': { file: 'glass-crusher__glass-crusher-front_aaff.jpg', alt: 'Front view of the glass crusher' },
  'glass-hopper': { file: 'glass-crusher__glass-crusher-hopper-view_18b8.jpg', alt: 'Hopper view of the glass crusher' },
  'glass-motor': { file: 'glass-crusher__glass-crusher-motor-side_b312.jpg', alt: 'Motor side of the glass crusher' },
  'gpulv': { file: 'pulverizing-plant__pulverizing-plant_a5ed.jpg', alt: 'Dual-line pulverizing plant with paired cyclones and filter housings inside a shed' },
  'm30a': { file: '30-tph-mobile-crusher__30-tph-mobile-crushing-plant-srew_f310.jpg', alt: '30 TPH wheeled mobile crushing plant with jaw crusher, hopper and discharge conveyor in the fabrication shed' },
  'm30b': { file: '30-tph-mobile-crusher__30tph-mobile-crushing-unit-srew_ab57.png', alt: '30 TPH mobile crushing unit built by SREW Projects' },
  'm60a': { file: '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg_eb81.jpg', alt: '60 TPH mobile crusher during manufacture, hopper frame in the works yard' },
  'm60b': { file: '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-crusher-setup_85d0.jpg', alt: 'Crusher setup for the 60 TPH mobile crusher during manufacture' },
  'm60c': { file: '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-crusher-setup1_f385.jpg', alt: 'Another view of the 60 TPH mobile crusher setup during manufacture' },
  'm60d': { file: '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-side-view_4ea9.jpg', alt: 'Side view of the 60 TPH mobile crusher during manufacture' },
  'm60e': { file: '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-side_9e7f.jpg', alt: 'Side of the 60 TPH mobile crusher during manufacture' },
  'm60f': { file: '60-tph-mobile-crusher__mobile-crushing-plant-60tph-srew_820c.jpg', alt: '60 TPH mobile crushing plant built by SREW Projects' },
  's100': { file: '100-tph-stone-crusher-plant__srew-100tph-stone-crusher-plant_3b8c.jpg', alt: '100 TPH stone crusher plant with blue conveyors, screen house and aggregate stockpiles' },
  'p150a': { file: '150-tph-crusher-plant__srew-150-tph-crushing-screening-and-washing-plant_99af.jpg', alt: '150 TPH crushing, screening and washing plant with inclined screen, conveyors and bins' },
  'p150b': { file: '150-tph-crusher-plant__150-tph-crusher-plant-hsi-installation_fdcb.jpg', alt: 'Impact crusher on a service platform during installation of the 150 TPH plant' },
  'p150c': { file: '150-tph-crusher-plant__150-tph-stone-crusher-plant-side-srew_5751.jpg', alt: 'Side view of the 150 TPH stone crusher plant' },
  'p150d': { file: '150-tph-crusher-plant__150-tph-stone-crusher-plant-srew-full-view_b1b9.jpg', alt: 'Full view of the 150 TPH stone crusher plant' },
  's200': { file: '200-tph-stone-crusher-plant__200-tph-stone-crusher-plant-load_a11d.jpg', alt: '200 TPH stone crusher plant equipment loaded for transport, with S.R.Engineering Works painted on the machine' },
  's250a': { file: '250-tph-stone-crusher-plant__250-tph-stone-crusher-plant-srew_118f.jpg', alt: '250 TPH stone crusher plant with feed bin, ladder and conveyor' },
  's250b': { file: '250-tph-stone-crusher-plant__250-tph-stone-crusher-plant-side-srew_6368.jpg', alt: 'Side view of the 250 TPH stone crusher plant' },
  'cd100': { file: '100-tph-cd-recycling-plant__100-tph-candd-crushing-screening-and-processing_71d1.jpg', alt: '100 TPH C&D crushing, screening and processing plant with conveyors and a rotary drum' },
  'chassis': { file: 'mobile-crusher-chassis__mobile-crusher-chassis-srew_248f.jpg', alt: 'Blue mobile crusher chassis with twin axles and four tyres in the fabrication yard' },
  'shed': { file: 'shed-fabrication__shed-fabrication-srew_568b.jpg', alt: 'Steel shed with roof trusses, side screen and access stairs over processing equipment' },
};

async function encodeAll() {
  fs.mkdirSync(outRoot, { recursive: true });
  const manifest = {};
  for (const [key, src] of Object.entries(sources)) {
    const input = path.join(uploads, src.file);
    const meta = await sharp(input).metadata();
    const dir = path.join(outRoot, key);
    fs.mkdirSync(dir, { recursive: true });
    const made = [];
    for (const w of widths) {
      if (meta.width && w > meta.width) continue;
      const base = path.join(dir, String(w));
      const pipeline = () => sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
      await pipeline().webp({ quality: 72 }).toFile(base + '.webp');
      await pipeline().avif({ quality: 45, effort: 4 }).toFile(base + '.avif');
      made.push(w);
    }
    if (!made.length) {
      const w = meta.width;
      const base = path.join(dir, String(w));
      await sharp(input).rotate().webp({ quality: 72 }).toFile(base + '.webp');
      await sharp(input).rotate().avif({ quality: 45, effort: 4 }).toFile(base + '.avif');
      made.push(w);
    }
    manifest[key] = { alt: src.alt, w: meta.width, h: meta.height, widths: made, dir: key };
    console.log('encoded', key, made.join(','));
  }
  return manifest;
}

function picture(img, { eager = false, sizes }) {
  if (!img) return '';
  const src = (ext, w) => `/images/projects/${img.dir}/${w}.${ext}`;
  const set = (ext) => img.widths.map((w) => `${src(ext, w)} ${w}w`).join(', ');
  const fallback = img.widths[Math.min(1, img.widths.length - 1)];
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="${src('webp', fallback)}" width="${img.w}" height="${img.h}" alt="${esc(img.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

const illustration = `<svg class="work-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="illTitle illDesc" width="800" height="600"><title id="illTitle">Illustration of a 2 TPH mobile crusher</title><desc id="illDesc">Line illustration, not a photograph. A photograph of the 2 TPH mobile crusher is not on file.</desc><rect width="800" height="600" fill="#f4f1ea"/><rect x="24" y="24" width="752" height="552" fill="none" stroke="#1e3957" stroke-dasharray="8 6"/><text x="400" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#1e3957">Illustration, not a photograph</text><g fill="none" stroke="#1e3957" stroke-width="3"><rect x="250" y="250" width="300" height="90"/><polygon points="300,250 400,180 500,250"/><rect x="470" y="275" width="40" height="28"/><path d="M180 340 H620"/><circle cx="300" cy="360" r="28"/><circle cx="500" cy="360" r="28"/><path d="M560 300 L700 230"/><rect x="680" y="200" width="70" height="36"/></g><text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#5c564c">2 TPH mobile crusher</text><text x="400" y="508" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#5c564c">No photograph of this unit is on file</text></svg>`;

function footerHtml() {
  return `<footer class="site-footer" role="contentinfo">
  <div class="container site-footer-grid">
    <div>
      <p class="site-footer-name">SREW Projects</p>
      <p>A unit of S.R.Engineering Works. Crushing, screening and pulverizing plants from 2–250 TPH, made in Hyderabad.</p>
      <p>ISO 9001:2015 · GSTIN 36BEIPR4767N1ZL</p>
      <div class="site-footer-social">
        <a href="https://www.facebook.com/profile.php?id=100070029793724" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.linkedin.com/company/thesrew" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://www.instagram.com/srenggworks/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
    <nav aria-label="Footer products">
      <h2>Products</h2>
      <ul>
        <li><a href="/stone-crusher-plant">Stone crusher plants</a></li>
        <li><a href="/mobile-stone-crusher-plant">Mobile crushers</a></li>
        <li><a href="/pulverizer-machine">Pulverizers</a></li>
        <li><a href="/glass-crusher-machine">Glass crushers</a></li>
        <li><a href="/cd-recycling-plant">C&amp;D recycling plants</a></li>
        <li><a href="/sand-washing-machine">Sand washing</a></li>
        <li><a href="/ss-fabrication">SS fabrication</a></li>
        <li><a href="/products">All products</a></li>
      </ul>
    </nav>
    <nav aria-label="Footer company">
      <h2>Company</h2>
      <ul>
        <li><a href="/about">About the works</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/industries">Industries</a></li>
        <li><a href="/videos">Videos</a></li>
        <li><a href="/blogs">Blogs</a></li>
        <li><a href="/spare-parts">Spare parts</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <div>
      <h2>Contact</h2>
      <address>Sy.No.155/A, Ayyappa Temple Road, Dullapally, Hyderabad, Medchal-Malkajgiri, Telangana 500100</address>
      <p><a href="tel:+918790759460">Call +91 8790759460</a></p>
      <p><a href="tel:+916281665454">Call +91 6281665454</a></p>
      <p><a href="mailto:srenggworks2016@gmail.com">Email the works</a></p>
      <p><a href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer">WhatsApp the works</a></p>
      <p><a href="/contact">Send a project enquiry</a></p>
    </div>
  </div>
  <div class="container site-footer-legal">
    <p>© <span id="currentYear">2026</span> SREW Projects. All rights reserved.</p>
    <nav aria-label="Legal">
      <a href="/privacy-policy">Privacy</a>
      <a href="/terms-and-conditions">Terms</a>
      <a href="/cookies">Cookies</a>
      <a href="/returns-warranty">Returns and warranty</a>
      <a href="/shipping-policy">Shipping</a>
      <a href="https://www.indiamart.com/srengineeringworks-266746886/" target="_blank" rel="noopener noreferrer">IndiaMART profile</a>
    </nav>
  </div>
</footer>`;
}

function card(item, manifest) {
  let visual;
  if (item.illustration) visual = illustration;
  else if (item.imageKey) visual = picture(manifest[item.imageKey], { sizes: '(max-width: 700px) 100vw, 33vw' });
  else visual = `<img src="${item.legacySrc}" width="${item.legacyW}" height="${item.legacyH}" alt="${esc(item.legacyAlt)}" loading="lazy" decoding="async">`;
  return `<a class="work-card" href="${item.href}"><span class="work-visual">${visual}</span><span class="work-card-body"><span class="work-kicker">${esc(item.kicker)}</span><span class="work-title">${esc(item.title)}</span><span class="work-text">${esc(item.blurb)}</span><span class="work-link">${esc(item.link)}</span></span></a>`;
}

function pageHtml({ header, item, manifest }) {
  const url = `https://www.srewprojects.com${item.href}`;
  const imgs = (item.imageKeys || []).map((k) => manifest[k]);
  const imageUrls = imgs.map((img) => `https://www.srewprojects.com/images/projects/${img.dir}/${img.widths[Math.min(1, img.widths.length - 1)]}.webp`);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.srewprojects.com/#business',
        name: 'SREW Projects',
        legalName: 'S.R.Engineering Works',
        url: 'https://www.srewprojects.com/',
        geo: { '@type': 'GeoCoordinates', latitude: 17.5403008, longitude: 78.4641043 },
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: item.title,
        headline: item.title,
        description: item.description,
        url,
        image: item.illustration ? [`${url}#illustration`] : imageUrls,
        creator: { '@id': 'https://www.srewprojects.com/#business' },
        publisher: { '@id': 'https://www.srewprojects.com/#business' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.srewprojects.com/' },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.srewprojects.com/projects' },
          { '@type': 'ListItem', position: 3, name: item.title, item: url },
        ],
      },
    ],
  };
  if (item.illustration) delete graph['@graph'][1].image;

  const figures = item.illustration
    ? `<figure class="proj-note">${illustration}<figcaption>Illustration only. A photograph of the 2 TPH mobile crusher is not on file. The 30 TPH and 60 TPH mobile plants are different machines and are not shown here.</figcaption></figure>`
    : imgs.map((img, i) => `<figure>${picture(img, { eager: i === 0, sizes: '(max-width: 800px) 100vw, 720px' })}<figcaption>${esc(img.alt)}</figcaption></figure>`).join('');

  const links = item.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('');
  const paras = item.paragraphs.map((p) => `<p>${p}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(item.title)} | SREW Projects</title>
<meta name="description" content="${esc(item.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SREW Projects">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(item.title)} | SREW Projects">
<meta property="og:description" content="${esc(item.description)}">
<meta property="og:image" content="${imageUrls[0] || 'https://www.srewprojects.com/images/logo.png'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(item.title)} | SREW Projects">
<meta name="twitter:description" content="${esc(item.description)}">
<meta name="twitter:image" content="${imageUrls[0] || 'https://www.srewprojects.com/images/logo.png'}">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<link rel="stylesheet" href="/vendor/bootstrap-5.3.3/bootstrap.min.css">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/redesign.css">
<link rel="stylesheet" href="/css/elevate.css">
<link rel="stylesheet" href="/css/catalogue.css?v=20261120a">
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
<meta name="theme-color" content="#091518">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4EPFCS97B8"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4EPFCS97B8');</script>
</head>
<body class="el-site project-page">
<a href="#main-content" class="skip-link">Skip to main content</a>
${header}
<main id="main-content">
<section class="el-band" aria-label="Page header"><div class="container"><p class="el-eyebrow">Projects</p><h1>${esc(item.title)}</h1><p class="lead">${esc(item.description)}</p><nav aria-label="Breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="/">Home</a></li><li class="breadcrumb-item"><a href="/projects">Projects</a></li><li class="breadcrumb-item active" aria-current="page">${esc(item.title)}</li></ol></nav></div></section>
<section class="py-5"><div class="container proj-layout"><div class="proj-gallery">${figures}<div class="proj-copy">${paras}<p class="proj-cta"><a class="btn btn-primary" href="${item.ctaHref}">${esc(item.cta)}</a></p></div></div><aside><h2 class="h5">Related pages</h2><ul class="proj-links">${links}</ul></aside></div></section>
</main>
${footerHtml()}
<script src="/vendor/bootstrap-5.3.3/bootstrap.bundle.min.js" defer></script>
<script src="/js/main.js?v=20261120a" defer></script>
</body>
</html>`;
}

function catalog(manifest) {
  const P = (partial) => partial;
  return [
    P({ href: '/project-singareni', title: '250 TPH aggregate plant, Singareni', kicker: '250 TPH · Singareni', blurb: 'Published case study for Singareni Collieries, with photographs of the 250 TPH stone crusher plant.', link: 'Open the Singareni plant', imageKey: 's250a', group: 'crushing', featured: true, existing: true }),
    P({ href: '/project-150-tph-crushing-plant', title: '150 TPH crushing, screening and washing plant', kicker: '150 TPH', blurb: 'Photographs of the crushing, screening and washing line, including the impact-crusher installation.', link: 'Open the 150 TPH plant', imageKey: 'p150a', group: 'crushing', featured: true }),
    P({ href: '/project-100-tph-stone-crusher', title: '100 TPH stone crusher plant', kicker: '100 TPH', blurb: 'A stone crusher plant with conveyors, a screen house and aggregate stockpiles.', link: 'Open the 100 TPH stone plant', imageKey: 's100', group: 'crushing', featured: true }),
    P({ href: '/project-200-tph-stone-crusher', title: '200 TPH stone crusher plant', kicker: '200 TPH', blurb: 'Plant equipment loaded for transport. The works name is painted on the machine. This is not the West Bengal case study.', link: 'Open the 200 TPH load', imageKey: 's200', group: 'crushing', featured: false }),
    P({ href: '/project-west-bengal', title: '200 TPH crushing and screening plant, West Bengal', kicker: '200 TPH · West Bengal', blurb: 'Published case study of the West Bengal crushing and screening plant.', link: 'Open the West Bengal case study', legacySrc: '/images/Projects/project-1.webp', legacyW: 1672, legacyH: 940, legacyAlt: 'Crushing and screening plant serving a large aggregate stockpile', group: 'crushing', existing: true }),
    P({ href: '/project-keesara', title: '150 TPH cone crusher plant, Keesara', kicker: '150 TPH · Keesara', blurb: 'Published case study of the Keesara cone-crusher plant. Separate from the photographed washing plant.', link: 'Open the Keesara case study', legacySrc: '/images/Projects/project-4.webp', legacyW: 1536, legacyH: 1024, legacyAlt: 'Crusher and screening machinery assembled at an industrial site', group: 'crushing', existing: true }),
    P({ href: '/project-60-tph-mobile-crusher', title: '60 TPH mobile crusher', kicker: '60 TPH · in manufacture', blurb: 'The 60 TPH mobile crusher photographed while it was being built.', link: 'Open the 60 TPH mobile crusher', imageKey: 'm60a', group: 'mobile', featured: true }),
    P({ href: '/project-30-tph-mobile-crusher', title: '30 TPH mobile crushing plant', kicker: '30 TPH', blurb: 'Wheeled mobile crushing plant photographed in the fabrication shed.', link: 'Open the 30 TPH mobile plant', imageKey: 'm30a', group: 'mobile', featured: true }),
    P({ href: '/project-2-tph-mobile-crusher', title: '2 TPH mobile crusher', kicker: '2 TPH · illustration', blurb: 'The smallest mobile crusher in the published 2–250 TPH range. No photograph is on file.', link: 'Open the 2 TPH mobile crusher', illustration: true, group: 'mobile', featured: true }),
    P({ href: '/project-odisha-mobile', title: '40 TPH mobile crushing unit, Odisha', kicker: '40 TPH · Odisha', blurb: 'Published case study of the Odisha mobile unit. Not the 30 TPH or 60 TPH machines.', link: 'Open the Odisha case study', legacySrc: '/images/Projects/project-3.webp', legacyW: 1536, legacyH: 1024, legacyAlt: 'Material handling conveyors and screening equipment at an aggregate plant', group: 'mobile', existing: true }),
    P({ href: '/project-mobile-crusher-chassis', title: 'Mobile crusher chassis', kicker: 'Chassis', blurb: 'Twin-axle chassis fabricated for a mobile crusher.', link: 'Open the chassis', imageKey: 'chassis', group: 'mobile' }),
    P({ href: '/project-100-tph-cd-recycling', title: '100 TPH C&D recycling plant', kicker: '100 TPH · C&D', blurb: 'Crushing, screening and processing line for construction and demolition material. Separate from the 40–50 TPH Hyderabad plant.', link: 'Open the 100 TPH C&D plant', imageKey: 'cd100', group: 'recycling', featured: true }),
    P({ href: '/project-hyderabad-recycling', title: 'C&D recycling and sand dryer, Hyderabad', kicker: '40–50 TPH · Hyderabad', blurb: 'Published Hyderabad case study for C&D recycling and a sand dryer. Not the 100 TPH plant.', link: 'Open the Hyderabad case study', legacySrc: '/images/Projects/project-5.webp', legacyW: 1448, legacyH: 1086, legacyAlt: 'Sand dryer and material handling conveyors at an industrial processing plant', group: 'recycling', existing: true }),
    P({ href: '/project-mirchi-pulverizer', title: 'Mirchi pulverizer', kicker: 'Chilli · hammer mill', blurb: 'Hammer mill with cyclone and bag filter, built as a mirchi pulverizer.', link: 'Open the mirchi pulverizer', imageKey: 'mirchi', group: 'pulverizing', featured: true }),
    P({ href: '/project-glass-crusher', title: 'Glass crusher', kicker: 'Glass', blurb: 'Glass crusher photographed at the works, hopper and housing in three-quarter, rear and angled views.', link: 'Open the glass crusher', imageKey: 'glass-3q', group: 'pulverizing', featured: true }),
    P({ href: '/project-glass-pulverizer', title: 'Glass pulverizer plant', kicker: 'Dual line', blurb: 'Dual-line pulverizing plant with paired cyclones and filter housings.', link: 'Open the glass pulverizer plant', imageKey: 'gpulv', group: 'pulverizing', featured: true }),
    P({ href: '/project-shed-fabrication', title: 'Shed fabrication', kicker: 'Fabrication', blurb: 'Steel shed fabricated over processing equipment, with roof trusses and an access stair.', link: 'Open the shed fabrication', imageKey: 'shed', group: 'fabrication' }),
  ];
}

const pages = {
  '/project-mirchi-pulverizer': {
    file: 'project-mirchi-pulverizer.html',
    imageKeys: ['mirchi'],
    description: 'Mirchi (chilli) pulverizer built by SREW Projects: a hammer mill with a cyclone and a bag filter.',
    paragraphs: [
      'The machine in the photograph is a hammer mill with a cyclone and a bag filter, piped together on a fabricated frame. SREW Projects built it as a mirchi, or chilli, pulverizer.',
      'The photograph does not state a throughput, a client or a site. SREW Projects builds crushing and pulverizing equipment across the published range of 2–250 TPH at its Hyderabad works.',
    ],
    cta: 'Ask about a mirchi pulverizer',
    ctaHref: '/contact?project=mirchi-pulverizer',
    links: [
      { href: '/pulverizer-machine', label: 'Pulverizer machines' },
      { href: '/hammer-crusher-manufacturer', label: 'Hammer crushers' },
      { href: '/project-glass-pulverizer', label: 'Glass pulverizer plant' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-glass-crusher': {
    file: 'project-glass-crusher.html',
    imageKeys: ['glass-3q', 'glass-rear', 'glass-angle', 'glass-front', 'glass-hopper', 'glass-motor'],
    description: 'Glass crusher built by SREW Projects, photographed at the works: hopper, housing, shaft ends and motor side.',
    paragraphs: [
      'These photographs show a glass crusher at the works. The housing is painted, a hopper sits on top, and the shaft ends and motor side are visible from the front, rear and angled views.',
      'Model throughput is published on the glass crusher machine page. This project page does not add a client, a site or a date, because the photographs do not state them.',
    ],
    cta: 'Ask about a glass crusher',
    ctaHref: '/contact?project=glass-crusher',
    links: [
      { href: '/glass-crusher-machine', label: 'Glass crusher machines and published specifications' },
      { href: '/pulverizer-machine', label: 'Pulverizer machines' },
      { href: '/project-glass-pulverizer', label: 'Glass pulverizer plant' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-glass-pulverizer': {
    file: 'project-glass-pulverizer.html',
    imageKeys: ['gpulv'],
    description: 'Dual-line glass pulverizer plant built by SREW Projects, with paired cyclones and filter housings inside a shed.',
    paragraphs: [
      'The photograph shows a dual-line pulverizing plant inside a shed: two process lines, cyclones and tall filter housings. SREW Projects built it as a glass pulverizer plant.',
      'The photograph does not state a throughput, a client or a site. For pulverizer machines and the published plant range, use the pulverizer machine page.',
    ],
    cta: 'Ask about a glass pulverizer plant',
    ctaHref: '/contact?project=glass-pulverizer',
    links: [
      { href: '/pulverizer-machine', label: 'Pulverizer machines' },
      { href: '/glass-crusher-machine', label: 'Glass crusher machines' },
      { href: '/project-mirchi-pulverizer', label: 'Mirchi pulverizer' },
      { href: '/project-glass-crusher', label: 'Glass crusher' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-2-tph-mobile-crusher': {
    file: 'project-2-tph-mobile-crusher.html',
    illustration: true,
    imageKeys: [],
    description: '2 TPH mobile crusher from SREW Projects. No photograph is on file; the figure on this page is an illustration.',
    paragraphs: [
      'SREW Projects publishes mobile and mini crushing plants from 2 TPH. This page is the 2 TPH mobile crusher.',
      'A photograph of this unit is not on file. The drawing is an illustration so the page is not left blank, and it is labelled as an illustration. Photographs of the 30 TPH and 60 TPH mobile plants are different machines and are not used here.',
    ],
    cta: 'Ask about a 2 TPH mobile crusher',
    ctaHref: '/contact?project=2-tph-mobile-crusher',
    links: [
      { href: '/mini-stone-crusher-plant', label: 'Mini stone crusher plant, 2–10 TPH' },
      { href: '/mobile-stone-crusher-plant', label: 'Mobile stone crusher plants' },
      { href: '/project-30-tph-mobile-crusher', label: '30 TPH mobile crushing plant' },
      { href: '/project-60-tph-mobile-crusher', label: '60 TPH mobile crusher' },
      { href: '/mobile-crusher-vs-fixed-crusher', label: 'Mobile crusher compared with a fixed crusher' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-30-tph-mobile-crusher': {
    file: 'project-30-tph-mobile-crusher.html',
    imageKeys: ['m30a', 'm30b'],
    description: '30 TPH mobile crushing plant built by SREW Projects, photographed in the fabrication shed.',
    paragraphs: [
      'The photographs show a 30 TPH wheeled mobile crushing plant. A jaw crusher, feed hopper and discharge conveyor sit on a chassis with tyres, inside the fabrication shed.',
      'This is not the 2 TPH mobile crusher, the 40 TPH Odisha unit, or the 60 TPH machine photographed during manufacture.',
    ],
    cta: 'Ask about a 30 TPH mobile plant',
    ctaHref: '/contact?project=30-tph-mobile-crusher',
    links: [
      { href: '/mobile-stone-crusher-plant', label: 'Mobile stone crusher plants' },
      { href: '/jaw-crusher-manufacturer', label: 'Jaw crushers' },
      { href: '/project-60-tph-mobile-crusher', label: '60 TPH mobile crusher' },
      { href: '/project-mobile-crusher-chassis', label: 'Mobile crusher chassis' },
      { href: '/mobile-crusher-vs-fixed-crusher', label: 'Mobile crusher compared with a fixed crusher' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-60-tph-mobile-crusher': {
    file: 'project-60-tph-mobile-crusher.html',
    imageKeys: ['m60f', 'm60a', 'm60b', 'm60c', 'm60d', 'm60e'],
    description: '60 TPH mobile crusher built by SREW Projects, photographed during manufacture.',
    paragraphs: [
      'These photographs show a 60 TPH mobile crusher while it was being manufactured. Frames, the crusher setup and side views were taken in the works yard.',
      'This is a different machine from the 30 TPH mobile plant and from the published 40 TPH Odisha case study.',
    ],
    cta: 'Ask about a 60 TPH mobile crusher',
    ctaHref: '/contact?project=60-tph-mobile-crusher',
    links: [
      { href: '/mobile-stone-crusher-plant', label: 'Mobile stone crusher plants' },
      { href: '/modular-mobile-crusher', label: 'Modular mobile crusher' },
      { href: '/tire-mobile-crusher', label: 'Tyre mobile crusher' },
      { href: '/project-30-tph-mobile-crusher', label: '30 TPH mobile crushing plant' },
      { href: '/project-mobile-crusher-chassis', label: 'Mobile crusher chassis' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-100-tph-stone-crusher': {
    file: 'project-100-tph-stone-crusher.html',
    imageKeys: ['s100'],
    description: '100 TPH stone crusher plant built by SREW Projects, with conveyors, a screen house and aggregate stockpiles.',
    paragraphs: [
      'The photograph shows a 100 TPH stone crusher plant: blue conveyor flights, a clad screen house and piles of crushed stone.',
      'The photograph does not name a client or a district. Capacity is taken from the plant photograph supplied for this project.',
    ],
    cta: 'Ask about a 100 TPH stone plant',
    ctaHref: '/contact?project=100-tph-stone-crusher',
    links: [
      { href: '/stone-crusher-plant', label: 'Stone crusher plants' },
      { href: '/belt-conveyor-manufacturer', label: 'Belt conveyors' },
      { href: '/vibrating-screen-manufacturer', label: 'Vibrating screens' },
      { href: '/100-tph-crusher-plant-cost', label: '100 TPH crusher plant cost guide' },
      { href: '/project-singareni', label: '250 TPH aggregate plant, Singareni' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-150-tph-crushing-plant': {
    file: 'project-150-tph-crushing-plant.html',
    imageKeys: ['p150a', 'p150d', 'p150c', 'p150b'],
    description: '150 TPH crushing, screening and washing plant built by SREW Projects, including the impact-crusher installation.',
    paragraphs: [
      'The photographs show a 150 TPH crushing, screening and washing plant: an inclined screen, conveyors and bins, plus the wider plant and a side view.',
      'A separate photograph shows the impact crusher on its service platform during installation, with feed and discharge conveyors. This plant is not the published Keesara cone-crusher case study.',
    ],
    cta: 'Ask about a 150 TPH washing plant',
    ctaHref: '/contact?project=150-tph-crushing-plant',
    links: [
      { href: '/stone-crusher-plant', label: 'Stone crusher plants' },
      { href: '/hsi-crusher-manufacturer', label: 'HSI impact crushers' },
      { href: '/vibrating-screen-manufacturer', label: 'Vibrating screens' },
      { href: '/sand-washing-machine', label: 'Sand washing machines' },
      { href: '/project-keesara', label: 'Keesara cone crusher case study, a different 150 TPH plant' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-200-tph-stone-crusher': {
    file: 'project-200-tph-stone-crusher.html',
    imageKeys: ['s200'],
    description: '200 TPH stone crusher plant equipment built by S.R.Engineering Works, photographed loaded for transport.',
    paragraphs: [
      'The photograph shows 200 TPH stone crusher plant equipment chained on a trailer at night. The crusher body is lettered S.R.Engineering Works, and blue fabricated frames are stacked with it.',
      'The photograph does not name a destination or a client. It is a different page from the published West Bengal 200 TPH case study.',
    ],
    cta: 'Ask about a 200 TPH stone plant',
    ctaHref: '/contact?project=200-tph-stone-crusher',
    links: [
      { href: '/stone-crusher-plant', label: 'Stone crusher plants' },
      { href: '/jaw-crusher-manufacturer', label: 'Jaw crushers' },
      { href: '/200-tph-crusher-plant-cost', label: '200 TPH crusher plant cost guide' },
      { href: '/project-west-bengal', label: 'West Bengal 200 TPH case study' },
      { href: '/project-singareni', label: '250 TPH aggregate plant, Singareni' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-100-tph-cd-recycling': {
    file: 'project-100-tph-cd-recycling.html',
    imageKeys: ['cd100'],
    description: '100 TPH construction and demolition crushing, screening and processing plant built by SREW Projects.',
    paragraphs: [
      'The photograph shows a 100 TPH C&amp;D crushing, screening and processing line: covered conveyors running over stockpiles, with a rotary drum at the head of the plant.',
      'This is a separate plant from the published Hyderabad case study, which describes a C&amp;D line and sand dryer at 40–50 TPH.',
    ],
    cta: 'Ask about a 100 TPH C&D plant',
    ctaHref: '/contact?project=100-tph-cd-recycling',
    links: [
      { href: '/cd-recycling-plant', label: 'C&D recycling plants' },
      { href: '/construction-waste-recycling-plant', label: 'Construction waste recycling plant' },
      { href: '/concrete-recycling-plant', label: 'Concrete recycling plant' },
      { href: '/cd-waste-recycling-plant-cost', label: 'C&D recycling plant cost guide' },
      { href: '/project-hyderabad-recycling', label: 'Hyderabad C&D and sand dryer, 40–50 TPH' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-mobile-crusher-chassis': {
    file: 'project-mobile-crusher-chassis.html',
    imageKeys: ['chassis'],
    description: 'Mobile crusher chassis fabricated by SREW Projects, with a twin axle and four tyres.',
    paragraphs: [
      'The photograph shows a mobile crusher chassis in the fabrication yard: a blue steel frame on a twin axle with four tyres, beside other fabricated frames.',
      'The chassis is the wheeled base of a mobile crusher. The photograph does not show a complete plant and does not state a throughput.',
    ],
    cta: 'Ask about a mobile crusher chassis',
    ctaHref: '/contact?project=mobile-crusher-chassis',
    links: [
      { href: '/mobile-stone-crusher-plant', label: 'Mobile stone crusher plants' },
      { href: '/tire-mobile-crusher', label: 'Tyre mobile crusher' },
      { href: '/project-30-tph-mobile-crusher', label: '30 TPH mobile crushing plant' },
      { href: '/project-60-tph-mobile-crusher', label: '60 TPH mobile crusher' },
      { href: '/projects', label: 'All projects' },
    ],
  },
  '/project-shed-fabrication': {
    file: 'project-shed-fabrication.html',
    imageKeys: ['shed'],
    description: 'Steel shed fabricated by SREW Projects over processing equipment, with roof trusses and an access stair.',
    paragraphs: [
      'The photograph shows a steel shed: roof trusses, side screening and a stair up to a platform over the equipment below.',
      'SREW Projects fabricates sheds with its other structural work. The photograph does not name the site.',
    ],
    cta: 'Ask about shed fabrication',
    ctaHref: '/contact?project=shed-fabrication',
    links: [
      { href: '/ss-fabrication', label: 'SS fabrication, tanks and sheds' },
      { href: '/products#ss-fabrication-tanks-and-sheds', label: 'Fabrication products' },
      { href: '/projects', label: 'All projects' },
    ],
  },
};

function galleryHtml(items, manifest) {
  const groups = [
    ['crushing', 'Crushing and screening plants'],
    ['mobile', 'Mobile crushers'],
    ['recycling', 'Recycling plants'],
    ['pulverizing', 'Pulverizers and glass'],
    ['fabrication', 'Fabrication'],
  ];
  return groups.map(([id, label]) => {
    const cards = items.filter((i) => i.group === id).map((i) => card(i, manifest)).join('');
    return `<section class="work-group" id="${id}-projects"><h2>${label}</h2><div class="work-grid">${cards}</div></section>`;
  }).join('');
}

function patchGallery(items, manifest) {
  const file = path.join(root, 'projects.html');
  let html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('<div class="container py-5">');
  const end = html.indexOf('<section class="cta-section');
  if (start < 0 || end < 0) throw new Error('projects gallery markers missing');
  const block = `<div class="container py-5"><p class="mb-4">Photographs of plants and machines built by SREW Projects, plus the case studies already published for Singareni, Hyderabad, West Bengal, Keesara and Odisha. Where a photograph does not name a client or a place, the page does not invent one.</p>${galleryHtml(items, manifest)}</div>\n        <section class="cta-section py-5 bg-primary text-white" aria-label="Call to action"><div class="container"><div class="row align-items-center"><div class="col-lg-8"><h2>Discuss a plant with the Hyderabad works</h2><p class="mb-0">Send the material, the duty and the site. The works replies with a quotation.</p></div><div class="col-lg-4 text-lg-end"><a class="btn btn-light" href="/contact?topic=projects">Send a plant enquiry</a></div></div></div></section>\n`;
  // Keep from cta-section's following content: we replace through the old cta section.
  const afterCta = html.indexOf('</section>', end);
  html = html.slice(0, start) + block + html.slice(afterCta + '</section>'.length);
  html = html.replace(
    'Case studies: 250 TPH Singareni aggregate plant, 200 TPH West Bengal plant, 150 TPH Keesara cone plant, 40 TPH Odisha mobile unit &amp; C&amp;D recycling.',
    'Photographs and case studies of SREW Projects plants: crushing, screening, washing, C&amp;D recycling, mobile crushers, pulverizers and fabrication, 2–250 TPH.',
  );
  const list = items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'CreativeWork', name: item.title, url: `https://www.srewprojects.com${item.href}` },
  }));
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SREW Projects plants and machines',
    url: 'https://www.srewprojects.com/projects',
    description: 'Photographs and published case studies of crushing, screening, washing, recycling, mobile, pulverizing and fabrication work.',
    mainEntity: { '@type': 'ItemList', itemListElement: list },
  };
  html = html.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org","@type":"CollectionPage"[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(collection)}</script>`);
  fs.writeFileSync(file, html);
}

function patchHome(items, manifest) {
  const file = path.join(root, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('<!-- PROJECTS SECTION -->');
  const end = html.indexOf('<!-- ABOUT SECTION -->');
  if (start < 0 || end < 0) throw new Error('home project markers missing');
  const featured = items.filter((i) => i.featured);
  const block = `<!-- PROJECTS SECTION -->
      <section id="projects" class="projects-section py-5 bg-light" aria-label="Featured projects">
        <div class="container">
          <div class="clients-kicker"><span class="clients-num">04</span><span class="clients-rule" aria-hidden="true"></span><span class="clients-label">Projects</span></div>
          <h2 class="clients-headline">Plants and machines from the works.</h2>
          <p class="mb-4">A selection of photographed plants. The full set, including the published case studies, is on the projects page.</p>
          <div class="work-grid">${featured.map((i) => card(i, manifest)).join('')}</div>
          <p class="mt-4"><a class="btn btn-primary" href="/projects">Browse every project</a></p>
        </div>
      </section>\n\n      `;
  html = html.slice(0, start) + block + html.slice(end);
  if (!html.includes('"latitude": 17.5403008') && !html.includes('"latitude":17.5403008')) {
    html = html.replace(
      '"@id": "https://www.srewprojects.com/#business"',
      '"geo": {"@type": "GeoCoordinates", "latitude": 17.5403008, "longitude": 78.4641043},\n        "@id": "https://www.srewprojects.com/#business"',
    );
  }
  fs.writeFileSync(file, html);
}

function patchSingareni(manifest) {
  const file = path.join(root, 'project-singareni.html');
  let html = fs.readFileSync(file, 'utf8');
  const figs = ['s250a', 's250b'].map((k, i) => `<figure>${picture(manifest[k], { eager: i === 0, sizes: '(max-width: 800px) 100vw, 800px' })}<figcaption>${esc(manifest[k].alt)}</figcaption></figure>`).join('');
  const block = `<section class="py-4" aria-label="250 TPH plant photographs"><div class="container proj-gallery">${figs}<p>Photographs of the 250 TPH stone crusher plant. The Singareni case study below is the published account of this capacity.</p></div></section>\n`;
  if (!html.includes('250 TPH plant photographs')) {
    html = html.replace('<!-- MAIN PROJECT CONTENT -->', block + '<!-- MAIN PROJECT CONTENT -->');
  }
  if (!html.includes('/project-200-tph-stone-crusher')) {
    html = html.replace(
      '<a href="/stone-crusher-plant-telangana">Stone crusher plants in Telangana</a>',
      '<a href="/stone-crusher-plant-telangana">Stone crusher plants in Telangana</a> · <a href="/stone-crusher-plant">Stone crusher plants</a> · <a href="/jaw-crusher-manufacturer">Jaw crushers</a> · <a href="/hsi-crusher-manufacturer">HSI impact crushers</a> · <a href="/vibrating-screen-manufacturer">Vibrating screens</a> · <a href="/project-200-tph-stone-crusher">200 TPH stone crusher plant, a separate machine</a>',
    );
  }
  fs.writeFileSync(file, html);
}

function patchHyderabad() {
  const file = path.join(root, 'project-hyderabad-recycling.html');
  let html = fs.readFileSync(file, 'utf8');
  const needle = '<a href="/cd-waste-recycling-plant-cost">C&amp;D recycling plant cost guide</a>';
  if (!html.includes('/project-100-tph-cd-recycling') && html.includes(needle)) {
    html = html.replace(
      needle,
      `${needle} · <a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant, a separate line</a> · <a href="/cd-recycling-plant">C&amp;D recycling plants</a> · <a href="/sand-dryer-manufacturer">Sand dryers</a>`,
    );
  }
  fs.writeFileSync(file, html);
}

function addSeeAlso(rel, linksHtml) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.warn('missing', rel);
    return;
  }
  let html = fs.readFileSync(file, 'utf8');
  const hrefs = [...linksHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  if (hrefs.every((h) => html.includes(`href="${h}"`) || html.includes(`href="${h.replace(/^\//, '')}"`))) return;
  const snippet = `<section class="py-4 seo-see-also" aria-label="See also"><div class="container"><p class="mb-0"><strong>See also:</strong> ${linksHtml}</p></div></section>\n`;
  if (html.includes('class="py-4 seo-see-also"')) {
    html = html.replace(/(<section class="py-4 seo-see-also"[\s\S]*?)(<\/p>)/, `$1 · ${linksHtml}$2`);
  } else if (html.includes('</main>')) {
    html = html.replace('</main>', `${snippet}</main>`);
  } else {
    html = html.replace('<footer', `${snippet}<footer`);
  }
  fs.writeFileSync(file, html);
}

function replaceFooters() {
  const footer = footerHtml();
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith('.html')) continue;
    const file = path.join(root, name);
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('<footer')) continue;
    const next = html.replace(/<footer\b[\s\S]*?<\/footer>/, footer);
    if (next !== html) fs.writeFileSync(file, next);
  }
}

function uniquifyCtas() {
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith('.html')) continue;
    const file = path.join(root, name);
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('<!-- cta-pass-20261120 -->')) continue;
    html = html.replace('href="#quote-section">Get a Quote</a>', 'href="#quote-section">Jump to the quotation form</a>');
    html = html.replaceAll('>Get a Quote</a>', '>Enquiry form</a>');
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const short = h1.split(/[|–—]/)[0].trim().slice(0, 48);
    let n = 0;
    html = html.replaceAll('>Get a Quotation</a>', () => {
      n += 1;
      if (n === 1 && short) return `>Quote: ${esc(short)}</a>`;
      return '>Send capacity, material and site</a>';
    });
    html = html.replace(
      /(<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>)(\s*)(<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*href="\2"[^>]*>[\s\S]*?<\/a>)/g,
      '$1',
    );
    html = html.replace('<head>', '<head>\n<!-- cta-pass-20261120 -->');
    html = html.replaceAll('catalogue.css?v=20261102j', 'catalogue.css?v=20261120a');
    fs.writeFileSync(file, html);
  }
}

function patchProductGalleries(manifest) {
  const glass = path.join(root, 'glass-crusher-machine.html');
  let html = fs.readFileSync(glass, 'utf8');
  const hero = picture(manifest['glass-3q'], { eager: true, sizes: '(max-width: 992px) 100vw, 480px' });
  html = html.replace(
    /<div class="col-lg-6"><img src="\/images\/Products\/srew-glass-crusher-machine\.webp"[\s\S]*?<\/div>/,
    `<div class="col-lg-6">${hero}<p class="small mt-2"><a href="/project-glass-crusher">More photographs of this glass crusher</a></p></div>`,
  );
  const extra = ['glass-rear', 'glass-angle', 'glass-front'].map((k) => `<div class="col-6 col-lg-4">${picture(manifest[k], { sizes: '(max-width: 700px) 50vw, 320px' })}<p class="small text-muted mt-2">${esc(manifest[k].alt)}</p></div>`).join('');
  if (!html.includes('/project-glass-crusher')) {
    html = html.replace('<div class="row g-3 product-image-gallery">', `<div class="row g-3 product-image-gallery">${extra}`);
  }
  if (!html.includes('>Glass crusher project</a>')) {
    html = html.replace('<a href="/pulverizer-machine">Pulverizer Machine</a>', '<a href="/project-glass-crusher">Glass crusher project</a></li><li class="list-inline-item me-3"><a href="/pulverizer-machine">Pulverizer Machine</a>');
  }
  fs.writeFileSync(glass, html);

  const pulv = path.join(root, 'pulverizer-machine.html');
  let phtml = fs.readFileSync(pulv, 'utf8');
  const cols = ['mirchi', 'gpulv'].map((k) => `<div class="col-12 col-md-6">${picture(manifest[k], { sizes: '(max-width: 700px) 100vw, 50vw' })}<p class="small text-muted mt-2"><a href="${k === 'mirchi' ? '/project-mirchi-pulverizer' : '/project-glass-pulverizer'}">${esc(manifest[k].alt)}</a></p></div>`).join('');
  phtml = phtml.replace(
    '<h2 class="h3 fw-bold mt-5 mb-3">Pulverizer Machine gallery</h2><div class="row g-3"><div class="col-6 col-md-4"></div></div>',
    `<h2 class="h3 fw-bold mt-5 mb-3">Pulverizer Machine gallery</h2><div class="row g-3">${cols}</div>`,
  );
  fs.writeFileSync(pulv, phtml);
}

function patchSitemaps(hrefs) {
  const block = hrefs.map((href) => `  <url>\n    <loc>https://www.srewprojects.com${href}</loc>\n    <lastmod>2026-11-20</lastmod>\n    <priority>0.7</priority>\n  </url>`).join('\n');
  for (const rel of ['sitemap.xml', 'public/sitemap.xml']) {
    const file = path.join(root, rel);
    let xml = fs.readFileSync(file, 'utf8');
    const missing = hrefs.filter((href) => !xml.includes(`https://www.srewprojects.com${href}<`));
    if (!missing.length) continue;
    const add = missing.map((href) => `  <url>\n    <loc>https://www.srewprojects.com${href}</loc>\n    <lastmod>2026-11-20</lastmod>\n    <priority>0.7</priority>\n  </url>`).join('\n');
    xml = xml.replace('</urlset>', `${add}\n</urlset>`);
    fs.writeFileSync(file, xml);
  }
  return block;
}

const seeAlso = {
  'pulverizer-machine.html': '<a href="/project-mirchi-pulverizer">Mirchi pulverizer</a> · <a href="/project-glass-pulverizer">Glass pulverizer plant</a>',
  'glass-crusher-machine.html': '<a href="/project-glass-crusher">Glass crusher photographs</a> · <a href="/project-glass-pulverizer">Glass pulverizer plant</a>',
  'hammer-crusher-manufacturer.html': '<a href="/project-mirchi-pulverizer">Mirchi pulverizer, hammer mill with cyclone and bag filter</a>',
  'mobile-stone-crusher-plant.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a> · <a href="/project-60-tph-mobile-crusher">60 TPH mobile crusher</a> · <a href="/project-2-tph-mobile-crusher">2 TPH mobile crusher</a> · <a href="/project-mobile-crusher-chassis">Mobile crusher chassis</a>',
  'modular-mobile-crusher.html': '<a href="/project-60-tph-mobile-crusher">60 TPH mobile crusher in manufacture</a> · <a href="/project-mobile-crusher-chassis">Mobile crusher chassis</a>',
  'tire-mobile-crusher.html': '<a href="/project-30-tph-mobile-crusher">30 TPH wheeled mobile plant</a> · <a href="/project-mobile-crusher-chassis">Mobile crusher chassis</a>',
  'mini-stone-crusher-plant.html': '<a href="/project-2-tph-mobile-crusher">2 TPH mobile crusher</a>',
  'stone-crusher-plant.html': '<a href="/project-100-tph-stone-crusher">100 TPH stone plant</a> · <a href="/project-150-tph-crushing-plant">150 TPH crushing, screening and washing plant</a> · <a href="/project-200-tph-stone-crusher">200 TPH stone plant</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
  'cd-recycling-plant.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a> · <a href="/project-hyderabad-recycling">Hyderabad C&amp;D and sand dryer, 40–50 TPH</a>',
  'construction-waste-recycling-plant.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a> · <a href="/project-hyderabad-recycling">Hyderabad case study, 40–50 TPH</a>',
  'concrete-recycling-plant.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a>',
  'cd-waste-recycling-plant-cost.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a> · <a href="/project-hyderabad-recycling">Hyderabad C&amp;D and sand dryer</a>',
  'sand-washing-machine.html': '<a href="/project-150-tph-crushing-plant">150 TPH crushing, screening and washing plant</a>',
  'sand-dryer-manufacturer.html': '<a href="/project-hyderabad-recycling">Hyderabad C&amp;D plant and sand dryer</a>',
  'hsi-crusher-manufacturer.html': '<a href="/project-150-tph-crushing-plant">150 TPH plant, impact crusher installation</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
  'ss-fabrication.html': '<a href="/project-shed-fabrication">Shed fabrication</a>',
  'mobile-crusher-vs-fixed-crusher.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a> · <a href="/project-60-tph-mobile-crusher">60 TPH mobile crusher</a> · <a href="/project-2-tph-mobile-crusher">2 TPH mobile crusher</a>',
  'stone-crusher-plant-investment-guide.html': '<a href="/project-100-tph-stone-crusher">100 TPH stone plant</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
  'factors-to-compare-before-buying-a-crusher-plant.html': '<a href="/projects">Project photographs</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
  'vibrating-screen-for-crusher-plant.html': '<a href="/project-150-tph-crushing-plant">150 TPH screening and washing plant</a>',
  'industry-recycling.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a> · <a href="/project-hyderabad-recycling">Hyderabad case study</a>',
  '100-tph-crusher-plant-cost.html': '<a href="/project-100-tph-stone-crusher">100 TPH stone crusher plant</a>',
  '200-tph-crusher-plant-cost.html': '<a href="/project-200-tph-stone-crusher">200 TPH stone crusher plant</a> · <a href="/project-west-bengal">West Bengal 200 TPH case study</a>',
  'jaw-crusher-manufacturer.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant with jaw crusher</a>',
  'belt-conveyor-manufacturer.html': '<a href="/project-100-tph-stone-crusher">100 TPH plant conveyors</a>',
};

async function main() {
  const manifest = await encodeAll();
  fs.writeFileSync(path.join(outRoot, 'illustration-2-tph.svg'), illustration);
  const projectsHtml = fs.readFileSync(path.join(root, 'projects.html'), 'utf8');
  const headerStart = projectsHtml.indexOf('<!-- SITE HEADER v2 (shared) -->');
  const headerEnd = projectsHtml.indexOf('</header>', headerStart);
  const header = projectsHtml.slice(headerStart, headerEnd + '</header>'.length);
  const items = catalog(manifest);
  for (const item of items) {
    if (item.existing) continue;
    const spec = pages[item.href];
    const html = pageHtml({ header, item: { ...item, ...spec }, manifest });
    fs.writeFileSync(path.join(root, spec.file), html);
    console.log('wrote', spec.file);
  }
  patchGallery(items, manifest);
  patchHome(items, manifest);
  patchSingareni(manifest);
  patchHyderabad();
  patchProductGalleries(manifest);
  for (const [file, links] of Object.entries(seeAlso)) addSeeAlso(file, links);
  replaceFooters();
  uniquifyCtas();
  patchSitemaps(Object.keys(pages));
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
