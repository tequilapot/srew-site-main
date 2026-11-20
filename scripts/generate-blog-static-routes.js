import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const articleMeta = /<meta[^>]+property=["']og:type["'][^>]+content=["']article["']/i;
const publicBlogDirectory = join(root, 'public', 'blogs');
const articles = readdirSync(root)
  .filter((name) => name.endsWith('.html') && articleMeta.test(readFileSync(join(root, name), 'utf8')))
  .sort();

mkdirSync(publicBlogDirectory, { recursive: true });

for (const article of articles) {
  const slug = article.slice(0, -'.html'.length);
  const html = readFileSync(join(root, article), 'utf8');
  const canonical = `https://www.srewprojects.com/blogs/${slug}`;
  if (!html.includes(`rel="canonical" href="${canonical}"`)) {
    throw new Error(`Missing expected blog canonical in ${article}`);
  }
  writeFileSync(join(publicBlogDirectory, `${slug}.html`), html, 'utf8');
}

console.log(`Generated ${articles.length} static blog article routes.`);
