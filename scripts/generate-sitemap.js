import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteOrigin = 'https://www.srewprojects.com';
const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function readAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function readExistingLastmod() {
  try {
    const xml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
    const dates = new Map();
    for (const urlBlock of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = urlBlock[1].match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
      const lastmod = urlBlock[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim();
      if (loc && lastmod) dates.set(decodeHtml(loc), lastmod);
    }
    return dates;
  } catch {
    return new Map();
  }
}

function lastModifiedDate(page, existingDates, canonical) {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cs', '--', page], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  } catch {
    // Git history may not be available in the build environment.
  }
  return existingDates.get(canonical) || '';
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const existingDates = readExistingLastmod();
const pages = readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const canonicalPages = new Map();

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const tags = [...html.matchAll(/<(link|meta)\b[^>]*>/gi)];
  const canonicals = [];
  let noindex = false;

  for (const tag of tags) {
    const tagName = tag[1];
    const rawTag = tag[0];
    const attributes = readAttributes(rawTag);
    if (tagName.toLowerCase() === 'link' && attributes.rel?.toLowerCase().split(/\s+/).includes('canonical')) {
      canonicals.push(attributes.href || '');
    }
    if (
      tagName.toLowerCase() === 'meta' &&
      ['robots', 'googlebot'].includes(attributes.name?.toLowerCase()) &&
      attributes.content?.toLowerCase().split(/[\s,]+/).includes('noindex')
    ) {
      noindex = true;
    }
  }

  if (!canonicals.length || noindex) continue;
  const canonical = canonicals[0];
  if (canonicals.some((value) => value !== canonical)) {
    throw new Error(`Conflicting canonical URLs in ${page}`);
  }

  const url = new URL(canonical);
  if (
    url.origin !== siteOrigin ||
    url.search ||
    url.hash ||
    (url.pathname !== '/' && url.pathname.endsWith('.html'))
  ) {
    throw new Error(`Non-canonical sitemap URL in ${page}: ${canonical}`);
  }
  if (canonicalPages.has(canonical)) {
    throw new Error(`Duplicate canonical URL in ${page}: ${canonical}`);
  }

  canonicalPages.set(canonical, {
    page,
    lastmod: lastModifiedDate(page, existingDates, canonical),
  });
}

const urls = [...canonicalPages.keys()].sort((a, b) => {
  if (a === `${siteOrigin}/`) return -1;
  if (b === `${siteOrigin}/`) return 1;
  return a.localeCompare(b);
});

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<urlset xmlns="${sitemapNamespace}">`,
];
for (const url of urls) {
  lines.push('  <url>', `    <loc>${xmlEscape(url)}</loc>`);
  const { lastmod } = canonicalPages.get(url);
  if (lastmod) lines.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
  lines.push('  </url>');
}
lines.push('</urlset>', '');

const sitemap = lines.join('\n');
writeFileSync(join(root, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated sitemap with ${urls.length} canonical, indexable pages.`);
