/**
 * Apply public/images/catalog to every product and header photo.
 *
 * Adding a later batch:
 * 1. Drop <name>.webp and <name>-800.webp into public/images/catalog/.
 * 2. Add an alt line to ALTS_TEXT below, and point a slug or FILE_RULES entry at <name>.
 * 3. Run `npm run images`.
 *
 * wood-chipper and hydraulic-tyre-mounted-machine stay in the folder but are
 * never assigned (no page clearly matches them).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalogDir = path.join(root, 'public/images/catalog');
const SITE = 'https://www.srewprojects.com';

const BLOCKED = new Set(['wood-chipper', 'hydraulic-tyre-mounted-machine']);
const PORTRAIT = new Set([
  'cement-silos',
  'electrical-control-panel',
  'glass-crusher',
  'pulverizer-cyclone-bag-filter-system',
  'small-roll-crusher',
]);

const ALTS_TEXT = {
  'belt-conveyor': 'Belt conveyor for a crushing plant, built by SREW Projects',
  'bucket-wheel-sand-washer': 'Bucket wheel sand washer built by SREW Projects',
  'cement-silos': 'Cement storage silos fabricated by SREW Projects',
  'cnd-waste-recycling-plant': 'Construction and demolition waste recycling plant built by SREW Projects',
  'cone-crusher-single-cylinder': 'Single cylinder hydraulic cone crusher built by SREW Projects',
  'dewatering-screen-hydrocyclone': 'Dewatering screen with hydrocyclone for sand recovery, built by SREW Projects',
  'double-roll-crusher': 'Double roll crusher built by SREW Projects',
  'electrical-control-panel': 'Electrical control panel for a crushing plant, built by SREW Projects',
  'feed-hopper': 'Feed hopper for a crushing plant, built by SREW Projects',
  'glass-crusher': 'Glass crusher built by SREW Projects',
  'hammer-crusher': 'Hammer crusher built by SREW Projects',
  'horizontal-vibrating-screen': 'Horizontal vibrating screen built by SREW Projects',
  'hydraulic-cone-crusher-multi-cylinder': 'Multi-cylinder hydraulic cone crusher built by SREW Projects',
  'impact-crusher-hsi': 'Horizontal shaft impact crusher built by SREW Projects',
  'inclined-vibrating-screen-3-deck': 'Inclined 3-deck vibrating screen built by SREW Projects',
  'jaw-crusher': 'Jaw crusher built by SREW Projects',
  'jaw-crusher-heavy': 'Heavy-duty jaw crusher with drive, built by SREW Projects',
  'jaw-crusher-with-drive': 'Jaw crusher with motor and drive base, built by SREW Projects',
  'mobile-cone-screening-plant': 'Mobile cone crushing and screening plant built by SREW Projects',
  'mobile-impact-crushing-plant': 'Mobile impact crushing plant built by SREW Projects',
  'mobile-jaw-crushing-plant-tyre': 'Tyre-mounted mobile jaw crushing plant built by SREW Projects',
  'modular-jaw-crushing-plant': 'Modular jaw crushing plant built by SREW Projects',
  'plate-rolling-machine': 'Plate rolling machine at the SREW Projects fabrication works',
  'portable-inclined-feed-conveyor': 'Portable inclined feed conveyor built by SREW Projects',
  'pulverizer-cyclone-bag-filter-system': 'Pulverizer with cyclone and bag filter, built by SREW Projects',
  'rotary-drum': 'Rotary drum dryer built by SREW Projects',
  'screw-sand-washer': 'Screw sand washer built by SREW Projects',
  'small-roll-crusher': 'Small roll crusher built by SREW Projects',
  'stone-crusher-plant-layout': 'Stone crusher plant with conveyors and screens, built by SREW Projects',
  'vibrating-screen-3-deck-pedestal': '3-deck vibrating screen on a pedestal, built by SREW Projects',
  'vibrating-screen-on-structure-site': 'Vibrating screen on a plant structure at a SREW Projects site',
  'vsi-crusher-twin-motor': 'Twin-motor VSI crusher built by SREW Projects',
  'vsi-sand-making-machine': 'VSI sand making machine built by SREW Projects',
};

/** Page or card slug → catalog key. null = no matching photo (pastel gap). */
const SLUG = {
  'jaw-crusher-manufacturer': 'jaw-crusher-heavy',
  'european-type-jaw-crusher': 'jaw-crusher-with-drive',
  'grease-jaw-crusher': 'jaw-crusher',
  'cone-crusher-manufacturer': 'hydraulic-cone-crusher-multi-cylinder',
  'cone-crusher-plant': 'mobile-cone-screening-plant',
  'single-cylinder-cone-crusher': 'cone-crusher-single-cylinder',
  'multi-cylinder-hydraulic-cone-crusher': 'hydraulic-cone-crusher-multi-cylinder',
  'hsi-crusher-manufacturer': 'impact-crusher-hsi',
  'hydraulic-impact-crusher': 'impact-crusher-hsi',
  'vsi-crusher-m-sand': 'vsi-sand-making-machine',
  'roller-crusher-manufacturer': 'double-roll-crusher',
  'hammer-crusher-manufacturer': 'hammer-crusher',
  'pulverizer-machine': 'pulverizer-cyclone-bag-filter-system',
  'glass-crusher-machine': 'glass-crusher',
  'vibrating-screen-manufacturer': 'inclined-vibrating-screen-3-deck',
  'vibrating-screen-3-deck': 'vibrating-screen-3-deck-pedestal',
  'damping-vibrating-screen': 'horizontal-vibrating-screen',
  'triple-shaft-vibrating-screen': 'horizontal-vibrating-screen',
  'grizzly-feeder-manufacturer': 'feed-hopper',
  'loading-hopper-manufacturer': 'feed-hopper',
  'silo-storage-systems': 'cement-silos',
  'belt-conveyor-manufacturer': 'belt-conveyor',
  'control-panel-automation': 'electrical-control-panel',
  'sand-washing-machine': 'bucket-wheel-sand-washer',
  'series-sand-washer': 'screw-sand-washer',
  'dewatering-screen': 'dewatering-screen-hydrocyclone',
  'fine-sand-recycling-machine': 'dewatering-screen-hydrocyclone',
  'sand-dryer-manufacturer': 'rotary-drum',
  'stone-crusher-plant': 'stone-crusher-plant-layout',
  'crusher-plant-capacity': 'stone-crusher-plant-layout',
  'mobile-stone-crusher-plant': 'mobile-jaw-crushing-plant-tyre',
  'modular-mobile-crusher': 'modular-jaw-crushing-plant',
  'tire-mobile-crusher': 'mobile-jaw-crushing-plant-tyre',
  'cd-recycling-plant': 'cnd-waste-recycling-plant',
  'mini-stone-crusher-plant': 'modular-jaw-crushing-plant',
  'm-sand-plant-manufacturer': 'vsi-sand-making-machine',
  'spare-parts': null,
  'ss-fabrication': null,
  products: 'stone-crusher-plant-layout',
  'products#stone-crusher-plants-and-mobile-plants': 'stone-crusher-plant-layout',
  'products#crushers': 'jaw-crusher-heavy',
  'products#screens-feeders-hoppers-and-silos': 'inclined-vibrating-screen-3-deck',
  'products#conveyors': 'belt-conveyor',
  'products#sand-washing-and-drying': 'bucket-wheel-sand-washer',
  'products#pulverizers-and-glass-crushers': 'pulverizer-cyclone-bag-filter-system',
  'products#spare-parts-and-control-panels': null,
  'products#ss-fabrication-tanks-and-sheds': null,
  'project-west-bengal': 'stone-crusher-plant-layout',
  'project-singareni': 'vibrating-screen-on-structure-site',
  'project-odisha-mobile': 'mobile-jaw-crushing-plant-tyre',
  'project-keesara': 'mobile-cone-screening-plant',
  'project-hyderabad-recycling': 'cnd-waste-recycling-plant',
};

const PAGE_EXTRA = {
  index: 'stone-crusher-plant-layout',
  about: 'stone-crusher-plant-layout',
  contact: 'stone-crusher-plant-layout',
  industries: 'stone-crusher-plant-layout',
  'industry-mining': 'stone-crusher-plant-layout',
  'industry-construction': 'mobile-impact-crushing-plant',
  'industry-recycling': 'cnd-waste-recycling-plant',
  'industry-sand': 'bucket-wheel-sand-washer',
  projects: 'stone-crusher-plant-layout',
  videos: 'stone-crusher-plant-layout',
  blogs: 'stone-crusher-plant-layout',
  'vsi-vs-hsi-crusher': 'vsi-sand-making-machine',
  'vibrating-screen-for-crusher-plant': 'vibrating-screen-on-structure-site',
  'vibrating-screen-issues': 'inclined-vibrating-screen-3-deck',
  'stone-crusher-plant-investment-guide': 'stone-crusher-plant-layout',
  'stone-crusher-plant-andhra-pradesh': 'stone-crusher-plant-layout',
  'stone-crusher-plant-telangana': 'vibrating-screen-on-structure-site',
  'reasons-crusher-output-drops': 'jaw-crusher-heavy',
  'crusher-maintenance-reduction-methods': 'jaw-crusher-with-drive',
  'crusher-manufacturer-india': 'stone-crusher-plant-layout',
  '100-tph-crusher-plant-cost': 'stone-crusher-plant-layout',
  '120-tph-crusher-plant-cost': 'stone-crusher-plant-layout',
  '200-tph-crusher-plant-cost': 'stone-crusher-plant-layout',
  '50-tph-crusher-plant-cost': 'modular-jaw-crushing-plant',
  'm-sand-plant-price-guide': 'vsi-sand-making-machine',
  'mobile-crusher-vs-fixed-crusher': 'mobile-jaw-crushing-plant-tyre',
  'conveyor-failures': 'belt-conveyor',
  'factors-to-compare-before-buying-a-crusher-plant': 'stone-crusher-plant-layout',
  'imported-vs-made-in-india-crushing-plants': 'stone-crusher-plant-layout',
  'jaw-crusher-vs-cone-crusher': 'jaw-crusher-heavy',
  'cd-waste-recycling-plant-cost': 'cnd-waste-recycling-plant',
  'concrete-recycling-plant': 'cnd-waste-recycling-plant',
  'construction-waste-recycling-plant': 'cnd-waste-recycling-plant',
};

const GALLERY = {
  'jaw-crusher-manufacturer': ['jaw-crusher-heavy', 'jaw-crusher', 'jaw-crusher-with-drive'],
  'european-type-jaw-crusher': ['jaw-crusher-with-drive', 'jaw-crusher-heavy', 'jaw-crusher'],
  'grease-jaw-crusher': ['jaw-crusher', 'jaw-crusher-heavy', 'jaw-crusher-with-drive'],
  'cone-crusher-manufacturer': ['hydraulic-cone-crusher-multi-cylinder', 'cone-crusher-single-cylinder', 'mobile-cone-screening-plant'],
  'cone-crusher-plant': ['mobile-cone-screening-plant', 'hydraulic-cone-crusher-multi-cylinder', 'cone-crusher-single-cylinder', 'stone-crusher-plant-layout'],
  'single-cylinder-cone-crusher': ['cone-crusher-single-cylinder', 'hydraulic-cone-crusher-multi-cylinder'],
  'multi-cylinder-hydraulic-cone-crusher': ['hydraulic-cone-crusher-multi-cylinder', 'cone-crusher-single-cylinder'],
  'hsi-crusher-manufacturer': ['impact-crusher-hsi', 'mobile-impact-crushing-plant'],
  'hydraulic-impact-crusher': ['impact-crusher-hsi', 'mobile-impact-crushing-plant'],
  'vsi-crusher-m-sand': ['vsi-sand-making-machine', 'vsi-crusher-twin-motor'],
  'roller-crusher-manufacturer': ['double-roll-crusher', 'small-roll-crusher'],
  'vibrating-screen-manufacturer': ['inclined-vibrating-screen-3-deck', 'vibrating-screen-3-deck-pedestal', 'horizontal-vibrating-screen', 'vibrating-screen-on-structure-site'],
  'vibrating-screen-3-deck': ['vibrating-screen-3-deck-pedestal', 'inclined-vibrating-screen-3-deck', 'horizontal-vibrating-screen'],
  'damping-vibrating-screen': ['horizontal-vibrating-screen', 'inclined-vibrating-screen-3-deck'],
  'triple-shaft-vibrating-screen': ['horizontal-vibrating-screen', 'vibrating-screen-3-deck-pedestal'],
  'belt-conveyor-manufacturer': ['belt-conveyor', 'portable-inclined-feed-conveyor'],
  'sand-washing-machine': ['bucket-wheel-sand-washer', 'screw-sand-washer'],
  'series-sand-washer': ['screw-sand-washer', 'bucket-wheel-sand-washer'],
  'fine-sand-recycling-machine': ['dewatering-screen-hydrocyclone', 'screw-sand-washer'],
  'stone-crusher-plant': ['stone-crusher-plant-layout', 'vibrating-screen-on-structure-site', 'belt-conveyor', 'feed-hopper', 'modular-jaw-crushing-plant'],
  'crusher-plant-capacity': ['stone-crusher-plant-layout', 'modular-jaw-crushing-plant', 'mobile-jaw-crushing-plant-tyre'],
  'mobile-stone-crusher-plant': ['mobile-jaw-crushing-plant-tyre', 'mobile-impact-crushing-plant', 'modular-jaw-crushing-plant', 'mobile-cone-screening-plant'],
  'modular-mobile-crusher': ['modular-jaw-crushing-plant', 'mobile-jaw-crushing-plant-tyre'],
  'tire-mobile-crusher': ['mobile-jaw-crushing-plant-tyre', 'mobile-impact-crushing-plant'],
  'cd-recycling-plant': ['cnd-waste-recycling-plant', 'mobile-impact-crushing-plant'],
  'mini-stone-crusher-plant': ['modular-jaw-crushing-plant', 'mobile-jaw-crushing-plant-tyre'],
  'm-sand-plant-manufacturer': ['vsi-sand-making-machine', 'vsi-crusher-twin-motor', 'stone-crusher-plant-layout', 'dewatering-screen-hydrocyclone'],
  index: ['stone-crusher-plant-layout', 'cnd-waste-recycling-plant', 'mobile-jaw-crushing-plant-tyre', 'mobile-impact-crushing-plant', 'mobile-cone-screening-plant', 'vibrating-screen-on-structure-site', 'modular-jaw-crushing-plant'],
  'vsi-vs-hsi-crusher': ['vsi-sand-making-machine', 'impact-crusher-hsi', 'vsi-crusher-twin-motor'],
  'jaw-crusher-vs-cone-crusher': ['jaw-crusher-heavy', 'hydraulic-cone-crusher-multi-cylinder', 'cone-crusher-single-cylinder'],
  'mobile-crusher-vs-fixed-crusher': ['mobile-jaw-crushing-plant-tyre', 'stone-crusher-plant-layout', 'modular-jaw-crushing-plant'],
};

/** First match wins. */
const FILE_RULES = [
  [/plate-rolling|sheet-plate-rolling/, 'plate-rolling-machine'],
  [/\/material\/|srew-granite|srew-basalt|srew-limestone|srew-gravel/, 'drop'],
  [/\/images\/ss\/|images\/ss\/|ss-chemical|ss-steam|ss-service|ss-burner|ss-dosa|ss-idli|ss-sink|ss-tank/, 'drop'],
  [/spare-parts|jaw-plate|blow-bar|wire-mesh|screen-mesh|grizzly-bar|cheek-plate|conveyor-roller|crusher-mantle|toggle-plate/, 'gap'],
  [/ss-fabrication/, 'gap'],
  [/grease-jaw/, 'jaw-crusher'],
  [/european-type-jaw|jaw-crusher-with-drive/, 'jaw-crusher-with-drive'],
  [/jaw-crusher-heavy|double-toggle|primary-jaw|srew-jaw|jaw-crusher/, 'jaw-crusher-heavy'],
  [/single-cylinder/, 'cone-crusher-single-cylinder'],
  [/multi-cylinder|hydraulic-cone/, 'hydraulic-cone-crusher-multi-cylinder'],
  [/mobile-cone|cone-crusher-plant/, 'mobile-cone-screening-plant'],
  [/cone-crusher/, 'hydraulic-cone-crusher-multi-cylinder'],
  [/vsi-crusher-twin|twin-motor/, 'vsi-crusher-twin-motor'],
  [/vsi|vertical-shaft/, 'vsi-sand-making-machine'],
  [/hsi|impact-crusher|hydraulic-impact/, 'impact-crusher-hsi'],
  [/small-roll/, 'small-roll-crusher'],
  [/roller-crusher|double-roll|roll-crusher|srew-roller/, 'double-roll-crusher'],
  [/glass-crusher|glass/, 'glass-crusher'],
  [/hammer-crusher/, 'hammer-crusher'],
  [/pulverizer/, 'pulverizer-cyclone-bag-filter-system'],
  [/dewatering|fine-sand/, 'dewatering-screen-hydrocyclone'],
  [/series-sand|spiral-sand|screw-sand/, 'screw-sand-washer'],
  [/sand-wash|bucket-wheel|srew-sand-washer/, 'bucket-wheel-sand-washer'],
  [/sand-dryer|rotary-drum|srew-sand-dryer/, 'rotary-drum'],
  [/vibrating-screen-on-structure|screen-on-structure/, 'vibrating-screen-on-structure-site'],
  [/horizontal-vibrat|damping|triple-shaft/, 'horizontal-vibrating-screen'],
  [/3-deck-pedestal|vibrating-screen-3-deck|screen-3-deck/, 'vibrating-screen-3-deck-pedestal'],
  [/vibrating-screen|srew-triple-shaft/, 'inclined-vibrating-screen-3-deck'],
  [/grizzly|vibrating-feeder|feed-hopper|loading-hopper|srew-hopper|feeder/, 'feed-hopper'],
  [/panel-board|control-panel|electrical-control/, 'electrical-control-panel'],
  [/silo/, 'cement-silos'],
  [/portable-inclined|inclined-feed/, 'portable-inclined-feed-conveyor'],
  [/belt-conveyor|srew-belt|conveyor/, 'belt-conveyor'],
  [/cd-recycling|cnd|srew-cd|recycling-plant|construction-waste|concrete-recycling/, 'cnd-waste-recycling-plant'],
  [/modular/, 'modular-jaw-crushing-plant'],
  [/mobile-impact/, 'mobile-impact-crushing-plant'],
  [/mobile-jaw|tire-mobile|tyre-mobile|mobile-crush|mobile-stone|crawler/, 'mobile-jaw-crushing-plant-tyre'],
  [/mini-stone/, 'modular-jaw-crushing-plant'],
  [/project2|singareni/, 'vibrating-screen-on-structure-site'],
  [/project3|odisha/, 'mobile-jaw-crushing-plant-tyre'],
  [/project4|keesara/, 'mobile-cone-screening-plant'],
  [/project5|hyderabad-recycling/, 'cnd-waste-recycling-plant'],
  [/project1|west-bengal|project-west/, 'stone-crusher-plant-layout'],
  [/industries\/mining|mining\.jpg|\/mining/, 'stone-crusher-plant-layout'],
  [/industries\/construction|construction\.jpg/, 'mobile-impact-crushing-plant'],
  [/industries\/sand|sand\.jpg/, 'bucket-wheel-sand-washer'],
  [/industries\/recycling|recycling\.jpg/, 'cnd-waste-recycling-plant'],
  [/hero-background|hero\/|about-company|stone-crusher|crusher-plant|150-tph|200-tph|100-tph|120-tph|50-tph/, 'stone-crusher-plant-layout'],
];

function webpSize(file) {
  const data = fs.readFileSync(file);
  if (data.subarray(0, 4).toString() !== 'RIFF' || data.subarray(8, 12).toString() !== 'WEBP') return null;
  let i = 12;
  while (i + 8 <= data.length) {
    const chunk = data.subarray(i, i + 4).toString();
    const size = data.readUInt32LE(i + 4);
    const payload = data.subarray(i + 8, i + 8 + size);
    if (chunk === 'VP8X' && payload.length >= 10) {
      return { width: 1 + payload.readUIntLE(4, 3), height: 1 + payload.readUIntLE(7, 3) };
    }
    if (chunk === 'VP8 ' && payload.length >= 10) {
      const sig = payload.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
      if (sig !== -1 && sig + 7 <= payload.length) {
        return { width: payload.readUInt16LE(sig + 3) & 0x3fff, height: payload.readUInt16LE(sig + 5) & 0x3fff };
      }
    }
    if (chunk === 'VP8L' && payload.length >= 5) {
      const b0 = payload[1];
      const b1 = payload[2];
      const b2 = payload[3];
      const b3 = payload[4];
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
    i += 8 + size + (size & 1);
  }
  return null;
}

function loadCatalog() {
  const catalog = {};
  for (const name of fs.readdirSync(catalogDir)) {
    if (!name.endsWith('.webp') || name.endsWith('-800.webp')) continue;
    const key = name.slice(0, -5);
    const full = path.join(catalogDir, name);
    const dim = webpSize(full);
    const file800 = `${key}-800.webp`;
    const p800 = path.join(catalogDir, file800);
    const dim800 = fs.existsSync(p800) ? webpSize(p800) : null;
    catalog[key] = {
      key,
      file: name,
      file800: dim800 ? file800 : null,
      width: dim.width,
      height: dim.height,
      width800: dim800 ? dim800.width : null,
      height800: dim800 ? dim800.height : null,
      bytes: fs.statSync(full).size,
      bytes800: dim800 ? fs.statSync(p800).size : 0,
      alt: ALTS_TEXT[key] || key,
      blocked: BLOCKED.has(key),
      portrait: PORTRAIT.has(key) || (dim && dim.height > dim.width * 1.05),
      native: dim && dim.width < 700,
    };
  }
  return catalog;
}

const catalog = loadCatalog();

function pagePrimary(base) {
  if (Object.prototype.hasOwnProperty.call(SLUG, base)) return SLUG[base];
  if (Object.prototype.hasOwnProperty.call(PAGE_EXTRA, base)) return PAGE_EXTRA[base];
  return 'stone-crusher-plant-layout';
}

function hrefKey(href) {
  if (!href) return undefined;
  let h = href.replace(/\.html(?=$|#)/, '').replace(/^https?:\/\/[^/]+/i, '');
  const hash = (h.split('#')[1] || '').split('?')[0];
  let pathname = h.split('#')[0].split('?')[0];
  pathname = pathname.replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
  if ((pathname === 'products' || pathname === '') && hash) {
    const id = `products#${hash}`;
    if (Object.prototype.hasOwnProperty.call(SLUG, id)) return SLUG[id];
  }
  if (Object.prototype.hasOwnProperty.call(SLUG, pathname)) return SLUG[pathname];
  return undefined;
}

function fileKey(src) {
  const s = src.toLowerCase();
  if (s.includes('/images/catalog/')) {
    const base = path.basename(s).replace(/-800\.webp$/, '').replace(/\.webp$/, '');
    if (catalog[base] && !catalog[base].blocked) return base;
  }
  for (const [re, key] of FILE_RULES) {
    if (re.test(s)) return key;
  }
  return undefined;
}

function isKeeper(src) {
  const s = src.toLowerCase();
  if (!s || s.startsWith('data:') || s.startsWith('blob:')) return true;
  if (s.includes('ytimg.com') || s.includes('youtube.com') || s.includes('facebook.com/tr') || s.includes('googletagmanager') || s.includes('google-analytics')) return true;
  if (/\/icons\/|\/clients\/|\/footer\/|favicon|apple-touch|android-chrome|webmanifest/.test(s)) return true;
  if (/logo\.(png|svg|webp|jpe?g)/.test(s)) return true;
  if (/founder\.(png|webp|jpe?g)/.test(s)) return true;
  return false;
}

function isLocalPhoto(src) {
  return /(?:^|\/)images\/.+\.(?:webp|jpe?g|png|avif)(?:$|\?)/i.test(src) || /^images\/.+\.(?:webp|jpe?g|png|avif)/i.test(src);
}

function attr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const m = tag.match(re);
  if (!m) return null;
  return m[2] ?? m[3] ?? '';
}

function wrappingHref(html, index) {
  const before = html.slice(Math.max(0, index - 5000), index);
  const start = Math.max(before.lastIndexOf('<a '), before.lastIndexOf('<a\n'), before.lastIndexOf('<a\r'));
  const close = before.lastIndexOf('</a>');
  if (start === -1 || close > start) return null;
  const tag = before.slice(start, Math.min(before.length, start + 700));
  return attr(tag, 'href');
}

function followingHref(html, end) {
  const next = html.slice(end, end + 1800);
  const cut = next.search(/<img\b/i);
  const region = cut === -1 ? next : next.slice(0, cut);
  const m = region.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)')/i);
  return m ? (m[2] ?? m[3] ?? null) : null;
}

function absUrl(key) {
  return `${SITE}/images/catalog/${catalog[key].file}`;
}

function buildImg(key, { alt, eager, role, prevClass, prevStyle }) {
  const meta = catalog[key];
  const src = `/images/catalog/${meta.file}`;
  const classes = new Set((prevClass || '').split(/\s+/).filter(Boolean));
  classes.add('catalog-photo');
  if (meta.portrait) classes.add('catalog-portrait');
  if (meta.native) classes.add('catalog-native');
  let srcset = '';
  let sizes = '';
  const distinct800 = meta.file800 && meta.width800 && meta.width800 < meta.width;
  if (distinct800 && !meta.native) {
    srcset = `/images/catalog/${meta.file800} ${meta.width800}w, ${src} ${meta.width}w`;
    if (role === 'hero-home') sizes = '(min-width:1024px) min(1152px, calc(100vw - 128px)), 100vw';
    else if (role === 'hero') sizes = '(max-width: 992px) 100vw, 700px';
    else if (role === 'card') sizes = '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 320px';
    else sizes = '(max-width: 768px) 100vw, 480px';
  }
  const parts = [`src="${src}"`];
  if (srcset) {
    parts.push(`srcset="${srcset}"`);
    parts.push(`sizes="${sizes}"`);
  }
  parts.push(`alt="${(alt || meta.alt).replace(/"/g, '&quot;')}"`);
  parts.push(`class="${[...classes].join(' ')}"`);
  parts.push(`width="${meta.width}"`);
  parts.push(`height="${meta.height}"`);
  if (eager) parts.push('fetchpriority="high"');
  else parts.push('loading="lazy"');
  parts.push('decoding="async"');
  if (prevStyle) parts.push(`style="${prevStyle.replace(/"/g, '&quot;')}"`);
  return `<img ${parts.join(' ')}>`;
}

function chooseContent(base, hinted, used, isHero) {
  const primary = pagePrimary(base);
  let key = null;
  if (isHero && primary && !used.has(primary)) key = primary;
  else if (hinted && hinted !== 'gap' && hinted !== 'drop' && !used.has(hinted)) key = hinted;
  if (!key) {
    const alts = GALLERY[base] || (primary ? [primary] : []);
    key = alts.find((k) => catalog[k] && !catalog[k].blocked && !used.has(k)) || null;
  }
  if (key && (!catalog[key] || catalog[key].blocked)) key = null;
  if (key) used.add(key);
  return key;
}

function heroish(tag, src, html, index) {
  if (/fetchpriority\s*=\s*["']high["']/i.test(tag)) return true;
  if (/\/images\/hero\//i.test(src)) return true;
  const before = html.slice(Math.max(0, index - 220), index);
  return /hero-image-wrapper|hv4-media/.test(before);
}

function processHtml(file, html) {
  const base = path.basename(file, '.html');
  const used = new Set();
  const placed = [];
  const contentKeys = [];
  let heroTaken = false;
  const report = { file: base, images: [], gaps: 0, dropped: 0 };

  html = html.replace(/<img\b[^>]*>/gi, (tag, offset) => {
    const src = attr(tag, 'src') || '';
    if (!src || isKeeper(src)) return tag;
    if (!isLocalPhoto(src) && !src.includes('/images/catalog/')) return tag;

    const fromFile = fileKey(src);
    if (fromFile === 'drop') {
      const before = html.slice(Math.max(0, offset - 450), offset);
      if (/card-img-top-wrapper|cat-tile|rp-card|product-card/.test(before)) {
        report.gaps += 1;
        report.images.push({ src, action: 'gap' });
        return '<div class="catalog-gap" aria-hidden="true"></div>';
      }
      report.dropped += 1;
      report.images.push({ src, action: 'drop' });
      return '';
    }

    const wrap = hrefKey(wrappingHref(html, offset));
    const follow = wrap === undefined ? hrefKey(followingHref(html, offset + tag.length)) : undefined;
    const fromHref = wrap !== undefined ? wrap : follow;

    let key = null;
    let role = 'content';
    const isCard = fromHref !== undefined && fromFile !== 'plate-rolling-machine';

    if (fromFile === 'plate-rolling-machine') {
      key = 'plate-rolling-machine';
      role = 'content';
    } else if (fromFile === 'gap' && (fromHref === undefined || fromHref === null)) {
      key = null;
      role = 'gap';
    } else if (isCard) {
      if (fromHref === null || fromFile === 'gap') {
        role = 'gap';
      } else {
        key = fromHref;
        role = 'card';
      }
    } else if (fromFile === 'gap') {
      role = 'gap';
    } else {
      const isHero = !heroTaken && heroish(tag, src, html, offset);
      if (isHero) {
        heroTaken = true;
        role = base === 'index' ? 'hero-home' : 'hero';
      }
      key = chooseContent(base, fromFile, used, isHero);
      if (!key) {
        report.dropped += 1;
        report.images.push({ src, action: 'dedupe' });
        return '';
      }
    }

    if (role === 'gap' || !key) {
      report.gaps += 1;
      report.images.push({ src, action: 'gap', href: fromHref });
      return '<div class="catalog-gap" aria-hidden="true"></div>';
    }

    if (!placed.includes(key)) placed.push(key);
    if ((role === 'hero' || role === 'hero-home' || role === 'content') && !contentKeys.includes(key)) contentKeys.push(key);
    const keepAlt = role === 'card' && attr(tag, 'alt');
    const eager = role === 'hero' || role === 'hero-home';
    report.images.push({ src, action: key, role });
    return buildImg(key, {
      alt: keepAlt || catalog[key].alt,
      eager,
      role,
      prevClass: attr(tag, 'class'),
      prevStyle: attr(tag, 'style'),
    });
  });

  html = html.replace(/<div class="col-md-6 col-lg-4">\s*<\/div>\s*/g, '');
  html = html.replace(/<div class="col-6 col-md-4">\s*<\/div>\s*/g, '');
  html = html.replace(/<div class="col-6 col-md-3">\s*<\/div>\s*/g, '');
  html = html.replace(/<div class="col-6 col-md-3">\s*<p\b[^>]*>[\s\S]*?<\/p>\s*<\/div>\s*/g, '');

  const primary = pagePrimary(base);
  const urls = [];
  const pushUrl = (key) => {
    if (!key || !catalog[key] || catalog[key].blocked) return;
    const u = absUrl(key);
    if (!urls.includes(u)) urls.push(u);
  };
  // Schema and social images follow the page subject, not the shared menu
  // or related-product cards.
  if (primary) pushUrl(primary);
  contentKeys.forEach(pushUrl);

  html = html.replace(/<link\b[^>]*rel=["']preload["'][^>]*>/gi, (tag) => {
    if (!/as=["']image["']/i.test(tag) || !primary) return tag;
    const meta = catalog[primary];
    const src = `/images/catalog/${meta.file}`;
    let next = tag.replace(/\bhref=["'][^"']*["']/, `href="${src}"`);
    if (meta.file800 && meta.width800 < meta.width) {
      const set = `/images/catalog/${meta.file800} ${meta.width800}w, ${src} ${meta.width}w`;
      if (/\bimagesrcset=/.test(next)) next = next.replace(/\bimagesrcset=["'][^"']*["']/, `imagesrcset="${set}"`);
      else next = next.replace(/>$/, ` imagesrcset="${set}">`);
    }
    return next;
  });

  html = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (!/\b(?:property|name)=["'](?:og:image|twitter:image)["']/i.test(tag)) return tag;
    const content = attr(tag, 'content') || '';
    if (!isLocalPhoto(content) || isKeeper(content)) return tag;
    const url = urls[0] || `${SITE}/images/logo.png`;
    if (/\bcontent=/.test(tag)) return tag.replace(/\bcontent=["'][^"']*["']/, `content="${url}"`);
    return tag;
  });

  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (full, body) => {
    let data;
    try {
      data = JSON.parse(body.trim());
    } catch {
      return full.replace(/https?:\/\/www\.srewprojects\.com\/images\/[^"'\\\s]+/g, (url) => rewriteLooseUrl(url, urls, primary));
    }
    const next = rewriteLd(data, urls, false);
    return `<script type="application/ld+json">${JSON.stringify(next)}</script>`;
  });

  html = html.replace(/(["'(])((?:https?:\/\/www\.srewprojects\.com)?\/?images\/[^"'()\s]+\.(?:webp|jpe?g|png|avif))/gi, (m, q, url) => {
    if (url.includes('/images/catalog/') || isKeeper(url)) return m;
    if (!isLocalPhoto(url) && !/images\//i.test(url)) return m;
    const replaced = rewriteLooseUrl(url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? '' : '/'}${url.replace(/^\//, '')}`, urls, primary);
    if (replaced === url || replaced.endsWith(url)) return `${q}${publicPath(replaced)}${q}`;
    return `${q}${publicPath(replaced)}${q}`;
  });

  return { html, report, urls };
}

function publicPath(abs) {
  if (abs.startsWith(SITE)) return abs.slice(SITE.length);
  return abs;
}

function rewriteLooseUrl(url, urls, primary) {
  if (isKeeper(url)) return url;
  const hinted = fileKey(url);
  if (hinted && hinted !== 'gap' && hinted !== 'drop' && catalog[hinted] && !catalog[hinted].blocked) return absUrl(hinted);
  if (primary && catalog[primary]) return absUrl(primary);
  if (urls[0]) return urls[0];
  return `${SITE}/images/logo.png`;
}

function containsPhoto(v) {
  if (typeof v === 'string') return isPhotoUrl(v);
  if (Array.isArray(v)) return v.some(containsPhoto);
  if (v && typeof v === 'object') return containsPhoto(v.url);
  return false;
}

function rewriteLd(node, urls, nested) {
  if (Array.isArray(node)) return node.map((n) => rewriteLd(n, urls, nested));
  if (!node || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === 'logo' || k === 'thumbnailUrl') {
      out[k] = v;
      continue;
    }
    if (k === 'image') {
      if (nested && containsPhoto(v)) continue;
      const replaced = replaceImageValue(v, urls);
      if (replaced !== undefined) out[k] = replaced;
      continue;
    }
    const childNested = nested || k === 'hasOfferCatalog' || k === 'itemListElement' || k === 'itemOffered';
    out[k] = rewriteLd(v, urls, childNested);
  }
  return out;
}

function replaceImageValue(v, urls) {
  if (typeof v === 'string') {
    if (!isPhotoUrl(v)) return v;
    return urls[0] || undefined;
  }
  if (Array.isArray(v)) {
    const hasPhoto = v.some((item) => (typeof item === 'string' ? isPhotoUrl(item) : item && item.url && isPhotoUrl(item.url)));
    if (!hasPhoto) return v.map((item) => (item && typeof item === 'object' ? rewriteLd(item, urls) : item));
    if (!urls.length) return undefined;
    return urls;
  }
  if (v && typeof v === 'object') {
    if (typeof v.url === 'string' && isPhotoUrl(v.url)) {
      if (!urls[0]) return undefined;
      return { ...v, url: urls[0] };
    }
    return rewriteLd(v, urls);
  }
  return v;
}

function isPhotoUrl(url) {
  if (typeof url !== 'string') return false;
  if (isKeeper(url)) return false;
  return /\/images\/.+\.(webp|jpe?g|png|avif)(\?|$)/i.test(url);
}

function resolveLocal(src) {
  const clean = src.split('?')[0].replace(/^https?:\/\/www\.srewprojects\.com/i, '');
  const candidates = [];
  if (clean.startsWith('/')) {
    candidates.push(path.join(root, 'public', clean.slice(1)));
    candidates.push(path.join(root, clean.slice(1)));
  } else if (!clean.startsWith('http')) {
    candidates.push(path.join(root, clean));
    candidates.push(path.join(root, 'public', clean));
  }
  return candidates.find((p) => fs.existsSync(p)) || null;
}

function homepageBytes(html) {
  const srcs = [...html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
  let bytes = 0;
  let mobile = 0;
  let count = 0;
  const seen = new Set();
  for (const src of srcs) {
    if (isKeeper(src) || src.startsWith('http')) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    const file = resolveLocal(src);
    if (!file) continue;
    const size = fs.statSync(file).size;
    bytes += size;
    count += 1;
    const srcset = (html.match(new RegExp(`<img\\b[^>]*src=["']${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i')) || [''])[0];
    const m800 = srcset.match(/srcset=["']([^"']+)["']/i);
    if (m800) {
      const first = m800[1].split(',')[0].trim().split(/\s+/)[0];
      const f800 = resolveLocal(first);
      mobile += f800 ? fs.statSync(f800).size : size;
    } else mobile += size;
  }
  return { count, bytes, mobile };
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else acc.push(p);
  }
  return acc;
}

function processSourceText(text) {
  return text.replace(/(["'`])([^"'`\n]+\.(?:webp|jpe?g|png|avif))(\1)/gi, (m, q, url) => {
    if (isKeeper(url) || url.includes('/images/catalog/')) return m;
    if (!/images\//i.test(url)) return m;
    const hinted = fileKey(url);
    if (hinted === 'gap' || hinted === 'drop') return `${q}${q}`;
    if (hinted && catalog[hinted] && !catalog[hinted].blocked) {
      return `${q}/images/catalog/${catalog[hinted].file}${q}`;
    }
    return m;
  });
}

function purgeOld(corpus) {
  const prefixes = [
    'images/seo/',
    'images/real/',
    'images/cards/',
    'images/hero/',
    'images/og/',
    'images/Products/',
    'images/spare-parts/',
    'images/ss/',
    'images/Projects/',
    'images/Industries/',
    'images/thumbs/',
  ];
  const loose = [
    'images/hero-background.jpg',
    'images/hero-background.webp',
    'images/about-company.jpg',
    'images/about-company.webp',
    'images/mining.jpg',
    'images/construction.jpg',
    'images/sand.jpg',
    'images/recycling.jpg',
    'images/product-jaw-crusher.jpg',
    'images/product-cone-crusher.jpg',
    'images/product-VSI-crusher.jpg',
    'images/project-singareni.jpg',
    'images/project-singareni.webp',
    'images/project-odisha-mobile.jpg',
    'images/project-west-bengal.jpg',
    'images/C&D.jpg',
  ];
  const removed = [];
  const kept = [];
  const consider = (abs, rel) => {
    const norm = rel.replace(/^public\//, '');
    if (corpus.includes(norm) || corpus.includes(`/${norm}`)) {
      kept.push(norm);
      return;
    }
    fs.rmSync(abs, { force: true, recursive: true });
    removed.push(norm);
  };
  for (const base of ['public', '']) {
    for (const prefix of prefixes) {
      const dir = path.join(root, base, prefix);
      if (!fs.existsSync(dir)) continue;
      for (const file of walkFiles(dir)) {
        const rel = path.relative(path.join(root, base), file).split(path.sep).join('/');
        consider(file, base ? `${base}/${rel}` : rel);
      }
      if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    }
    for (const rel of loose) {
      const abs = path.join(root, base, rel);
      if (fs.existsSync(abs)) consider(abs, base ? `${base}/${rel}` : rel);
    }
  }
  return { removed, kept };
}

function writeCatalogJson(usedKeys) {
  const images = {};
  for (const [key, meta] of Object.entries(catalog)) {
    images[key] = {
      file: meta.file,
      file800: meta.file800,
      width: meta.width,
      height: meta.height,
      width800: meta.width800,
      height800: meta.height800,
      alt: meta.alt,
      use: !meta.blocked,
      holdReason: meta.blocked
        ? 'Held back: no page clearly matches this photo. Do not assign it until a page does.'
        : undefined,
    };
  }
  const doc = {
    note: 'New batches: add <name>.webp and <name>-800.webp here, describe the image in scripts/apply-catalog.mjs (ALTS_TEXT plus a SLUG or FILE_RULES entry), then run npm run images.',
    origin: 'map.csv lists the original upload filenames for this batch.',
    images,
    usedOnThisRun: [...usedKeys].sort(),
  };
  fs.writeFileSync(path.join(catalogDir, 'catalog.json'), `${JSON.stringify(doc, null, 2)}\n`);
}

function main() {
  const indexPath = path.join(root, 'index.html');
  const before = homepageBytes(fs.readFileSync(indexPath, 'utf8'));

  const reports = [];
  const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !f.startsWith('google'));
  for (const f of htmlFiles) {
    const abs = path.join(root, f);
    const { html, report } = processHtml(abs, fs.readFileSync(abs, 'utf8'));
    fs.writeFileSync(abs, html);
    reports.push(report);
  }

  const srcFiles = walkFiles(path.join(root, 'src')).filter((p) => /\.(js|jsx)$/.test(p));
  for (const abs of srcFiles) {
    const next = processSourceText(fs.readFileSync(abs, 'utf8'));
    fs.writeFileSync(abs, next);
  }

  const afterHtml = fs.readFileSync(indexPath, 'utf8');
  const after = homepageBytes(afterHtml);

  const textExt = new Set(['.html', '.js', '.jsx', '.css', '.json', '.xml', '.svg', '.md', '.txt']);
  let corpus = '';
  for (const file of walkFiles(root)) {
    if (!textExt.has(path.extname(file).toLowerCase())) continue;
    if (file.includes(`${path.sep}catalog${path.sep}`)) continue;
    corpus += `\n${fs.readFileSync(file, 'utf8')}`;
  }
  const purged = purgeOld(corpus);

  const usedKeys = new Set();
  const keyRe = /\/images\/catalog\/([a-z0-9-]+?)(?:-800)?\.webp/g;
  let m;
  while ((m = keyRe.exec(corpus))) usedKeys.add(m[1]);
  writeCatalogJson(usedKeys);

  const unused = Object.keys(catalog).filter((k) => !usedKeys.has(k));
  const summary = {
    homepageBefore: before,
    homepageAfter: after,
    pages: reports.map((r) => ({
      file: r.file,
      assigned: [...new Set(r.images.filter((i) => i.action && !['gap', 'drop', 'dedupe'].includes(i.action)).map((i) => i.action))],
      gaps: r.gaps,
      dropped: r.dropped,
    })),
    unused,
    purgedCount: purged.removed.length,
    keptOld: purged.kept.slice(0, 40),
  };
  fs.writeFileSync(path.join(root, 'scripts/image-report.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({ homepageBefore: before, homepageAfter: after, unused, purged: purged.removed.length, keptOld: purged.kept.length }, null, 2));
}

main();
