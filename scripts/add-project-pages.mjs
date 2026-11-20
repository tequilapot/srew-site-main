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

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const files = fs.readdirSync(uploads);
function findUpload(prefix) {
  const hit = files.find((f) => f.startsWith(prefix));
  if (!hit) throw new Error('missing upload ' + prefix);
  return path.join(uploads, hit);
}

const sources = [
  ['mirchi', 'pulvarizer-flour-mill__', 'Hammer mill with cyclone and bag filter, the mirchi pulverizer built by S.R.Engineering Works'],
  ['glass-3q', 'glass-crusher__glass-crusher-front-three-quarter', 'Glass crusher with top hopper, three-quarter view at the works'],
  ['glass-rear', 'glass-crusher__glass-crusher-rear-motor', 'Rear of the glass crusher, motor side'],
  ['glass-angle', 'glass-crusher__glass-crusher-angle', 'Angled view of the glass crusher housing and hopper'],
  ['glass-front', 'glass-crusher__glass-crusher-front_', 'Front view of the glass crusher'],
  ['glass-hopper', 'glass-crusher__glass-crusher-hopper-view', 'Hopper of the glass crusher'],
  ['glass-motor', 'glass-crusher__glass-crusher-motor-side', 'Motor side of the glass crusher'],
  ['gpulv', 'pulverizing-plant__', 'Dual-line pulverizing plant with paired cyclones and filter housings'],
  ['m30a', '30-tph-mobile-crusher__30-tph-mobile-crushing-plant', '30 TPH wheeled mobile crushing plant with jaw crusher, hopper and discharge conveyor'],
  ['m30b', '30-tph-mobile-crusher__30tph-mobile-crushing-unit', '30 TPH mobile crushing unit built by S.R.Engineering Works'],
  ['m60a', '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg_', '60 TPH mobile crusher during manufacture, hopper frame in the works yard'],
  ['m60b', '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-crusher-setup_', 'Crusher setup for the 60 TPH mobile crusher during manufacture'],
  ['m60c', '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-crusher-setup1', 'Another view of the 60 TPH mobile crusher setup during manufacture'],
  ['m60d', '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-side-view', 'Side view of the 60 TPH mobile crusher during manufacture'],
  ['m60e', '60-tph-mobile-crusher__60-tph-mobile-crusher-plant-srew-mfg-side_', 'Side of the 60 TPH mobile crusher during manufacture'],
  ['m60f', '60-tph-mobile-crusher__mobile-crushing-plant-60tph', '60 TPH mobile crushing plant built by S.R.Engineering Works'],
  ['s100', '100-tph-stone-crusher-plant__', '100 TPH stone crusher plant with conveyors, a screen house and aggregate stockpiles'],
  ['p150a', '150-tph-crusher-plant__srew-150-tph-crushing-screening-and-washing', '150 TPH crushing, screening and washing plant with an inclined screen, conveyors and bins'],
  ['p150b', '150-tph-crusher-plant__150-tph-crusher-plant-hsi', 'Impact crusher on a service platform during installation of the 150 TPH plant'],
  ['p150c', '150-tph-crusher-plant__150-tph-stone-crusher-plant-side', 'Side view of the 150 TPH stone crusher plant'],
  ['p150d', '150-tph-crusher-plant__150-tph-stone-crusher-plant-srew-full', 'Full view of the 150 TPH stone crusher plant'],
  ['s200', '200-tph-stone-crusher-plant__', '200 TPH stone crusher plant equipment loaded for transport, with S.R.Engineering Works painted on the machine'],
  ['s250a', '250-tph-stone-crusher-plant__250-tph-stone-crusher-plant-srew_', '250 TPH stone crusher plant with feed bin, ladder and conveyor'],
  ['s250b', '250-tph-stone-crusher-plant__250-tph-stone-crusher-plant-side', 'Side view of the 250 TPH stone crusher plant'],
  ['cd100', '100-tph-cd-recycling-plant__', '100 TPH C&D crushing, screening and processing plant with conveyors and a rotary drum'],
  ['chassis', 'mobile-crusher-chassis__', 'Mobile crusher chassis with a twin axle and four tyres in the fabrication yard'],
  ['shed', 'shed-fabrication__', 'Steel shed with roof trusses, side screen and an access stair over processing equipment'],
];

async function encodeAll() {
  fs.mkdirSync(outRoot, { recursive: true });
  const manifest = {};
  for (const [key, prefix, alt] of sources) {
    const input = findUpload(prefix);
    const meta = await sharp(input).rotate().metadata();
    let pipelineBase = sharp(input).rotate();
    if (key.startsWith('glass') && meta.width && meta.height) {
      const top = Math.round(meta.height * 0.02);
      const height = Math.round(meta.height * 0.78);
      pipelineBase = sharp(input).rotate().extract({ left: 0, top, width: meta.width, height }).sharpen();
    }
    const cropped = await pipelineBase.toBuffer();
    const cmeta = await sharp(cropped).metadata();
    const dir = path.join(outRoot, key);
    fs.mkdirSync(dir, { recursive: true });
    const made = [];
    for (const w of widths) {
      if (cmeta.width && w > cmeta.width) continue;
      const base = path.join(dir, String(w));
      await sharp(cropped).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(base + '.webp');
      await sharp(cropped).resize({ width: w, withoutEnlargement: true }).avif({ quality: 45, effort: 4 }).toFile(base + '.avif');
      made.push(w);
    }
    manifest[key] = { alt, w: cmeta.width, h: cmeta.height, widths: made, dir: key };
    console.log('encoded', key, made.join(','));
  }
  return manifest;
}

function picture(img, { eager = false, sizes }) {
  const src = (ext, w) => `/images/projects/${img.dir}/${w}.${ext}`;
  const set = (ext) => img.widths.map((w) => `${src(ext, w)} ${w}w`).join(', ');
  const fallback = img.widths[Math.min(1, img.widths.length - 1)];
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="${src('webp', fallback)}" width="${img.w}" height="${img.h}" alt="${esc(img.alt)}" class="img-fluid" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

const illustration = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-labelledby="illTitle illDesc" width="800" height="450"><title id="illTitle">Illustration of a 2 TPH mobile crusher</title><desc id="illDesc">Line drawing, not a photograph. No photograph of the 2 TPH mobile crusher is on file.</desc><rect width="800" height="450" fill="#f4f7fb"/><rect x="16" y="16" width="768" height="418" fill="none" stroke="#0056b3" stroke-dasharray="7 6"/><text x="400" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#0056b3">Illustration, not a photograph</text><g fill="none" stroke="#0b1f3a" stroke-width="3"><rect x="230" y="180" width="280" height="80"/><polygon points="280,180 370,120 460,180"/><path d="M150 260 H650"/><circle cx="280" cy="300" r="26"/><circle cx="470" cy="300" r="26"/><path d="M520 220 L680 160"/><rect x="660" y="132" width="70" height="32"/></g><text x="400" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#334155">2 TPH mobile crusher</text><text x="400" y="398" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#64748b">No photograph of this unit is on file</text></svg>`;

const pages = [
  {
    file: 'project-mirchi-pulverizer.html', href: '/project-mirchi-pulverizer', title: 'Mirchi pulverizer',
    description: 'Mirchi (chilli) pulverizer built by S.R.Engineering Works: a hammer mill with a cyclone and a bag filter.',
    keys: ['mirchi'], kicker: 'Chilli pulverizer',
    blurb: 'Hammer mill with a cyclone and a bag filter, built as a mirchi pulverizer.',
    paragraphs: ['The photograph shows a hammer mill with a cyclone and a bag filter, piped together on a fabricated frame. S.R.Engineering Works built it as a mirchi, or chilli, pulverizer.', 'The photograph does not state a throughput, a client or a site.'],
    links: [['/pulverizer-machine', 'Pulverizer machines'], ['/hammer-crusher-manufacturer', 'Hammer crushers'], ['/project-glass-pulverizer', 'Glass pulverizer plant']],
  },
  {
    file: 'project-glass-crusher.html', href: '/project-glass-crusher', title: 'Glass crusher',
    description: 'Glass crusher built by S.R.Engineering Works, photographed at the works.',
    keys: ['glass-3q', 'glass-rear', 'glass-angle', 'glass-front', 'glass-hopper', 'glass-motor'], kicker: 'Glass crusher',
    blurb: 'Glass crusher photographed at the works, shown from the front, rear and side.',
    paragraphs: ['These photographs show a glass crusher at the works. A hopper sits on the housing, and the shaft ends and motor side are visible.', 'Published machine details are on the glass crusher page. This project page does not add a client, a site or a date.'],
    links: [['/glass-crusher-machine', 'Glass crusher machines'], ['/pulverizer-machine', 'Pulverizer machines'], ['/project-glass-pulverizer', 'Glass pulverizer plant']],
  },
  {
    file: 'project-glass-pulverizer.html', href: '/project-glass-pulverizer', title: 'Glass pulverizer plant',
    description: 'Dual-line glass pulverizer plant built by S.R.Engineering Works.',
    keys: ['gpulv'], kicker: 'Glass pulverizer',
    blurb: 'Dual-line pulverizing plant with paired cyclones and filter housings.',
    paragraphs: ['The photograph shows a dual-line pulverizing plant inside a shed, with cyclones and filter housings. S.R.Engineering Works built it as a glass pulverizer plant.', 'The photograph does not state a throughput, a client or a site.'],
    links: [['/pulverizer-machine', 'Pulverizer machines'], ['/glass-crusher-machine', 'Glass crusher machines'], ['/project-mirchi-pulverizer', 'Mirchi pulverizer']],
  },
  {
    file: 'project-2-tph-mobile-crusher.html', href: '/project-2-tph-mobile-crusher', title: '2 TPH mobile crusher',
    description: '2 TPH mobile crusher from S.R.Engineering Works. No photograph is on file; the figure is an illustration.',
    keys: [], illustration: true, kicker: '2 TPH mobile',
    blurb: 'The small end of the published mobile range. No photograph is on file.',
    paragraphs: ['S.R.Engineering Works publishes mini mobile plants from 2 TPH. This page is the 2 TPH mobile crusher.', 'A photograph of this unit is not on file. The drawing is an illustration and is labelled as one. The 30 TPH and 60 TPH mobile plants are different machines and are not shown here.'],
    links: [['/mini-stone-crusher-plant', 'Mini mobile plants, 2–10 TPH'], ['/mobile-stone-crusher-plant', 'Mobile crushing plants'], ['/project-30-tph-mobile-crusher', '30 TPH mobile crushing plant']],
  },
  {
    file: 'project-30-tph-mobile-crusher.html', href: '/project-30-tph-mobile-crusher', title: '30 TPH mobile crushing plant',
    description: '30 TPH mobile crushing plant built by S.R.Engineering Works.',
    keys: ['m30a', 'm30b'], kicker: '30 TPH mobile',
    blurb: 'Wheeled mobile crushing plant photographed in the fabrication shed.',
    paragraphs: ['The photographs show a 30 TPH wheeled mobile crushing plant: a jaw crusher, feed hopper and discharge conveyor on a chassis with tyres.', 'This is not the 2 TPH mobile crusher and not the 60 TPH machine photographed during manufacture.'],
    links: [['/mobile-stone-crusher-plant', 'Mobile crushing plants'], ['/jaw-crusher-manufacturer', 'Jaw crushers'], ['/project-60-tph-mobile-crusher', '60 TPH mobile crusher']],
  },
  {
    file: 'project-60-tph-mobile-crusher.html', href: '/project-60-tph-mobile-crusher', title: '60 TPH mobile crusher',
    description: '60 TPH mobile crusher built by S.R.Engineering Works, photographed during manufacture.',
    keys: ['m60f', 'm60a', 'm60b', 'm60d'], kicker: '60 TPH mobile',
    blurb: 'Photographed while the 60 TPH mobile crusher was being built.',
    paragraphs: ['These photographs show a 60 TPH mobile crusher during manufacture at the works.', 'This is a different machine from the 30 TPH mobile plant and from the published 40 TPH Odisha case study.'],
    links: [['/mobile-stone-crusher-plant', 'Mobile crushing plants'], ['/modular-mobile-crusher', 'Modular mobile crusher'], ['/project-30-tph-mobile-crusher', '30 TPH mobile crushing plant']],
  },
  {
    file: 'project-100-tph-stone-crusher.html', href: '/project-100-tph-stone-crusher', title: '100 TPH stone crusher plant',
    description: '100 TPH stone crusher plant built by S.R.Engineering Works.',
    keys: ['s100'], kicker: '100 TPH stone',
    blurb: 'Stone crusher plant with conveyors, a screen house and aggregate stockpiles.',
    paragraphs: ['The photograph shows a 100 TPH stone crusher plant: conveyor flights, a clad screen house and piles of crushed stone.', 'The photograph does not name a client or a district.'],
    links: [['/stone-crusher-plant', 'Stone crusher plants'], ['/belt-conveyor-manufacturer', 'Belt conveyors'], ['/blogs/100-tph-crusher-plant-cost', '100 TPH crusher plant cost guide']],
  },
  {
    file: 'project-150-tph-crushing-plant.html', href: '/project-150-tph-crushing-plant', title: '150 TPH crushing, screening and washing plant',
    description: '150 TPH crushing, screening and washing plant built by S.R.Engineering Works.',
    keys: ['p150a', 'p150d', 'p150c', 'p150b'], kicker: '150 TPH plant',
    blurb: 'Crushing, screening and washing line, including the impact-crusher installation.',
    paragraphs: ['The photographs show a 150 TPH crushing, screening and washing plant, with an inclined screen, conveyors and bins.', 'A separate photograph shows the impact crusher on its platform during installation. This plant is not the Keesara cone-crusher case study.'],
    links: [['/stone-crusher-plant', 'Stone crusher plants'], ['/hsi-crusher-manufacturer', 'HSI impact crushers'], ['/sand-washing-machine', 'Sand washing machines'], ['/project-keesara', 'Keesara case study, a different 150 TPH plant']],
  },
  {
    file: 'project-200-tph-stone-crusher.html', href: '/project-200-tph-stone-crusher', title: '200 TPH stone crusher plant',
    description: '200 TPH stone crusher plant equipment built by S.R.Engineering Works, photographed loaded for transport.',
    keys: ['s200'], kicker: '200 TPH stone',
    blurb: 'Plant equipment loaded for transport. This is not the West Bengal case study.',
    paragraphs: ['The photograph shows 200 TPH stone crusher plant equipment chained on a trailer. The machine is lettered S.R.Engineering Works.', 'The photograph does not name a destination. It is a different page from the published West Bengal case study.'],
    links: [['/stone-crusher-plant', 'Stone crusher plants'], ['/blogs/200-tph-crusher-plant-cost', '200 TPH crusher plant cost guide'], ['/project-west-bengal', 'West Bengal case study']],
  },
  {
    file: 'project-100-tph-cd-recycling.html', href: '/project-100-tph-cd-recycling', title: '100 TPH C&D recycling plant',
    description: '100 TPH construction and demolition crushing, screening and processing plant built by S.R.Engineering Works.',
    keys: ['cd100'], kicker: '100 TPH C&D',
    blurb: 'C&D crushing, screening and processing line. Separate from the 40–50 TPH Hyderabad case study.',
    paragraphs: ['The photograph shows a 100 TPH C&amp;D crushing, screening and processing line, with covered conveyors and a rotary drum.', 'This is a separate plant from the published Hyderabad case study, which describes a C&amp;D line and sand dryer at 40–50 TPH.'],
    links: [['/cd-recycling-plant', 'C&D recycling plants'], ['/project-hyderabad-recycling', 'Hyderabad C&D and sand dryer, 40–50 TPH'], ['/sand-dryer-manufacturer', 'Sand dryers']],
  },
  {
    file: 'project-mobile-crusher-chassis.html', href: '/project-mobile-crusher-chassis', title: 'Mobile crusher chassis',
    description: 'Mobile crusher chassis fabricated by S.R.Engineering Works.',
    keys: ['chassis'], kicker: 'Mobile chassis',
    blurb: 'Twin-axle chassis fabricated for a mobile crusher.',
    paragraphs: ['The photograph shows a mobile crusher chassis in the fabrication yard: a steel frame on a twin axle with four tyres.', 'The photograph does not show a complete plant and does not state a throughput.'],
    links: [['/mobile-stone-crusher-plant', 'Mobile crushing plants'], ['/tire-mobile-crusher', 'Tyre mobile crusher'], ['/project-30-tph-mobile-crusher', '30 TPH mobile crushing plant']],
  },
  {
    file: 'project-shed-fabrication.html', href: '/project-shed-fabrication', title: 'Shed fabrication',
    description: 'Steel shed fabricated by S.R.Engineering Works over processing equipment.',
    keys: ['shed'], kicker: 'Shed fabrication',
    blurb: 'Steel shed with roof trusses and an access stair.',
    paragraphs: ['The photograph shows a steel shed: roof trusses, side screening and a stair to a platform over the equipment.', 'S.R.Engineering Works fabricates sheds with its other structural work. The photograph does not name the site.'],
    links: [['/ss-fabrication', 'SS fabrication'], ['/projects', 'All projects']],
  },
];

function pageHtml({ header, footer, scripts, page, manifest }) {
  const url = 'https://www.srewprojects.com' + page.href;
  const imgs = page.keys.map((k) => manifest[k]);
  const imageUrls = imgs.map((img) => `https://www.srewprojects.com/images/projects/${img.dir}/${img.widths[Math.min(1, img.widths.length - 1)]}.webp`);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://www.srewprojects.com/#business', name: 'SREW Projects', legalName: 'S.R.Engineering Works', url: 'https://www.srewprojects.com/', geo: { '@type': 'GeoCoordinates', latitude: 17.5403008, longitude: 78.4641043 } },
      { '@type': 'CreativeWork', name: page.title, description: page.description, url, ...(imageUrls.length ? { image: imageUrls } : {}), creator: { '@id': 'https://www.srewprojects.com/#business' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.srewprojects.com/' },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.srewprojects.com/projects' },
        { '@type': 'ListItem', position: 3, name: page.title, item: url },
      ] },
    ],
  };
  const gallery = page.illustration
    ? `<figure class="mb-4">${illustration}<figcaption class="small text-muted mt-2">Illustration only. A photograph of the 2 TPH mobile crusher is not on file.</figcaption></figure>`
    : imgs.map((img, i) => `<figure class="project-image-container mb-4">${picture(img, { eager: i === 0, sizes: '(max-width: 800px) 100vw, 720px' })}<figcaption class="small text-muted mt-2">${esc(img.alt)}</figcaption></figure>`).join('');
  const paras = page.paragraphs.map((p) => `<p>${p}</p>`).join('');
  const links = page.links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');
  const preload = imgs[0] ? `<link rel="preload" as="image" href="/images/projects/${imgs[0].dir}/800.avif" type="image/avif" fetchpriority="high">` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(page.title)} | SREW Projects</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:title" content="${esc(page.title)} | SREW Projects">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imageUrls[0] || 'https://www.srewprojects.com/images/logo.png'}">
${preload}
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/vendor/bootstrap-5.3.3/bootstrap.min.css">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/redesign.css">
<link rel="icon" href="/images/favicon-32x32.png">
<meta name="theme-color" content="#0056b3">
<meta name="geo.region" content="IN-TG">
<meta name="geo.placename" content="Hyderabad, Telangana, India">
<meta name="geo.position" content="17.5403008;78.4641043">
<meta name="ICBM" content="17.5403008, 78.4641043">
</head>
<body>
<a href="#main-content" class="skip-link">Skip to main content</a>
${header}
<main id="main-content">
<section class="subpage-hero" aria-label="Project">
<div class="container">
<p class="text-uppercase small mb-2">Projects</p>
<h1>${esc(page.title)}</h1>
<p class="lead mb-0 text-white-50">${esc(page.description)}</p>
<nav aria-label="Breadcrumb" class="mt-3"><ol class="breadcrumb subpage-breadcrumb mb-0"><li class="breadcrumb-item"><a href="/">Home</a></li><li class="breadcrumb-item"><a href="/projects">Projects</a></li><li class="breadcrumb-item active" aria-current="page">${esc(page.title)}</li></ol></nav>
</div>
</section>
<div class="container py-5"><div class="row g-5"><div class="col-lg-8">${gallery}<div class="bg-white p-4 rounded-4 shadow-sm border">${paras}<p class="mt-4"><a class="btn btn-primary btn-curved" href="/contact?project=${encodeURIComponent(page.href.slice(1))}">Get a Quote</a></p></div></div><aside class="col-lg-4"><h2 class="h5">Related pages</h2><ul>${links}</ul></aside></div></div>
</main>
${footer}
${scripts}
</body>
</html>`;
}

function homeCard(page, manifest) {
  const visual = page.illustration
    ? illustration
    : picture(manifest[page.keys[0]], { sizes: '(max-width: 700px) 100vw, 33vw' });
  return `<div class="col-lg-4 col-md-6 mb-4"><div class="project-card"><div class="project-image">${visual}</div><div class="project-info"><h3>${esc(page.title)}</h3><p>${esc(page.blurb)}</p><a class="btn btn-sm btn-outline-primary btn-curved" href="${page.href}">View ${esc(page.title)}</a></div></div></div>`;
}

async function main() {
  const manifest = await encodeAll();
  fs.writeFileSync(path.join(outRoot, '2tph-illustration.svg'), illustration);
  const sample = fs.readFileSync(path.join(root, 'project-singareni.html'), 'utf8');
  const header = sample.slice(sample.indexOf('<!-- SITE HEADER v2'), sample.indexOf('</header>') + '</header>'.length);
  const footer = sample.slice(sample.indexOf('<footer class="footer footer-v2"'), sample.indexOf('</footer>') + '</footer>'.length);
  const scripts = `<script src="/vendor/bootstrap-5.3.3/bootstrap.bundle.min.js" defer></script>\n<script src="/js/main.js" defer></script>`;
  for (const page of pages) {
    fs.writeFileSync(path.join(root, page.file), pageHtml({ header, footer, scripts, page, manifest }));
    console.log('wrote', page.file);
  }
  const featured = ['/project-singareni', '/project-150-tph-crushing-plant', '/project-100-tph-stone-crusher', '/project-glass-crusher', '/project-mirchi-pulverizer', '/project-60-tph-mobile-crusher', '/project-30-tph-mobile-crusher', '/project-100-tph-cd-recycling'];
  const byHref = Object.fromEntries(pages.map((p) => [p.href, p]));
  byHref['/project-singareni'] = { href: '/project-singareni', title: '250 TPH aggregate plant, Singareni', blurb: 'Published Singareni case study, with photographs of the 250 TPH stone crusher plant.', keys: ['s250a'], illustration: false };
  let index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const cards = featured.map((href) => homeCard(byHref[href], manifest)).join('');
  index = index.replace(/<div class="row">\s*<div class="col-lg-4 col-md-6 mb-4">\s*<div class="project-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="text-center mt-4">/, `<div class="row">${cards}</div>\n<div class="text-center mt-4">`);
  fs.writeFileSync(path.join(root, 'index.html'), index);

  let projects = fs.readFileSync(path.join(root, 'projects.html'), 'utf8');
  const listing = pages.map((p) => {
    const visual = p.illustration ? illustration : picture(manifest[p.keys[0]], { sizes: '(max-width: 700px) 100vw, 40vw' });
    return `<section class="project-section" id="${p.file.replace('.html', '')}"><div class="row align-items-center"><div class="col-md-5 mb-4 mb-md-0"><div class="project-image-container">${visual}</div></div><div class="col-md-7"><h2>${esc(p.title)}</h2><p>${esc(p.blurb)}</p><a class="btn btn-outline-primary btn-curved" href="${p.href}">View ${esc(p.title)}</a></div></div><hr class="my-5"></section>`;
  }).join('');
  projects = projects.replace('<section class="project-section" id="project-west-bengal">', listing + '<section class="project-section" id="project-west-bengal">');
  fs.writeFileSync(path.join(root, 'projects.html'), projects);

  let sing = fs.readFileSync(path.join(root, 'project-singareni.html'), 'utf8');
  const singGallery = ['s250a', 's250b'].map((k, i) => `<figure class="mb-3">${picture(manifest[k], { eager: i === 0, sizes: '(max-width: 800px) 100vw, 360px' })}</figure>`).join('');
  if (!sing.includes('/images/projects/s250a/')) {
    sing = sing.replace(/<div class="card border-0 shadow-sm overflow-hidden mb-4 rounded-4">[\s\S]*?<\/div>/, `<div class="card border-0 shadow-sm overflow-hidden mb-4 rounded-4 p-2">${singGallery}</div>`);
    sing = sing.replace('</p></div></section>\n    </main>', ' · <a href="/stone-crusher-plant">Stone crusher plants</a> · <a href="/project-200-tph-stone-crusher">200 TPH stone crusher plant</a></p></div></section>\n    </main>');
    if (!sing.includes('CreativeWork')) {
      const cw = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: '250 TPH Aggregate Plant, Singareni', url: 'https://www.srewprojects.com/project-singareni', creator: { '@id': 'https://www.srewprojects.com/#business' }, image: [`https://www.srewprojects.com/images/projects/s250a/800.webp`] };
      sing = sing.replace('</head>', `<script type="application/ld+json">${JSON.stringify(cw)}</script>\n</head>`);
    }
  }
  fs.writeFileSync(path.join(root, 'project-singareni.html'), sing);

  const seeAlso = {
    'pulverizer-machine.html': '<a href="/project-mirchi-pulverizer">Mirchi pulverizer</a> · <a href="/project-glass-pulverizer">Glass pulverizer plant</a>',
    'glass-crusher-machine.html': '<a href="/project-glass-crusher">Glass crusher photographs</a>',
    'hammer-crusher-manufacturer.html': '<a href="/project-mirchi-pulverizer">Mirchi pulverizer</a>',
    'mobile-stone-crusher-plant.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a> · <a href="/project-60-tph-mobile-crusher">60 TPH mobile crusher</a> · <a href="/project-2-tph-mobile-crusher">2 TPH mobile crusher</a>',
    'mini-stone-crusher-plant.html': '<a href="/project-2-tph-mobile-crusher">2 TPH mobile crusher</a>',
    'stone-crusher-plant.html': '<a href="/project-100-tph-stone-crusher">100 TPH stone plant</a> · <a href="/project-150-tph-crushing-plant">150 TPH washing plant</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
    'cd-recycling-plant.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant</a> · <a href="/project-hyderabad-recycling">Hyderabad case study, 40–50 TPH</a>',
    'sand-washing-machine.html': '<a href="/project-150-tph-crushing-plant">150 TPH crushing, screening and washing plant</a>',
    'hsi-crusher-manufacturer.html': '<a href="/project-150-tph-crushing-plant">150 TPH plant</a>',
    'ss-fabrication.html': '<a href="/project-shed-fabrication">Shed fabrication</a>',
    'm-sand-plant-price-guide.html': '<a href="/project-150-tph-crushing-plant">150 TPH washing plant</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
    'jaw-crusher-vs-cone-crusher.html': '<a href="/project-singareni">250 TPH Singareni plant</a> · <a href="/project-keesara">Keesara cone plant</a>',
    'vsi-vs-hsi-crusher.html': '<a href="/project-150-tph-crushing-plant">150 TPH plant with an impact crusher</a>',
    'cone-crusher-manufacturer.html': '<a href="/project-keesara">Keesara cone plant</a>',
    'cone-crusher-plant.html': '<a href="/project-keesara">Keesara cone plant</a>',
    'vsi-crusher-m-sand.html': '<a href="/project-singareni">250 TPH Singareni plant</a>',
    'vibrating-screen-manufacturer.html': '<a href="/project-150-tph-crushing-plant">150 TPH screening plant</a>',
    'vibrating-screen-3-deck.html': '<a href="/project-150-tph-crushing-plant">150 TPH screening plant</a>',
    'european-type-jaw-crusher.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a>',
    'grease-jaw-crusher.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a>',
    'products.html': '<a href="/projects">Project photographs</a> · <a href="/project-singareni">250 TPH Singareni plant</a>',
    '50-tph-crusher-plant-cost.html': '<a href="/project-30-tph-mobile-crusher">30 TPH mobile plant</a> · <a href="/project-60-tph-mobile-crusher">60 TPH mobile crusher</a>',
    '120-tph-crusher-plant-cost.html': '<a href="/project-100-tph-stone-crusher">100 TPH stone plant</a> · <a href="/project-150-tph-crushing-plant">150 TPH plant</a>',
    'imported-vs-made-in-india-crushing-plants.html': '<a href="/projects">Plants built by S.R.Engineering Works</a>',
    'crusher-maintenance-reduction-methods.html': '<a href="/project-singareni">250 TPH Singareni plant</a>',
    'project-hyderabad-recycling.html': '<a href="/project-100-tph-cd-recycling">100 TPH C&amp;D plant, a separate line</a>',
  };
  for (const [file, links] of Object.entries(seeAlso)) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) { console.warn('missing', file); continue; }
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes(links.slice(0, 24))) continue;
    const block = `<section class="py-4 seo-see-also" aria-label="See also"><div class="container"><p class="mb-0"><strong>See also:</strong> ${links}</p></div></section>\n`;
    if (html.includes('</main>')) html = html.replace('</main>', block + '</main>');
    else html = html.replace('<footer', block + '<footer');
    fs.writeFileSync(full, html);
  }
  console.log('done pages');
}

main().catch((err) => { console.error(err); process.exit(1); });
