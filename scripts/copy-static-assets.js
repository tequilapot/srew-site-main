import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceCss = path.join(projectRoot, 'css');
const publicCss = path.join(projectRoot, 'public', 'css');

if (!fs.existsSync(sourceCss)) {
  throw new Error(`CSS source directory was not found: ${sourceCss}`);
}

fs.mkdirSync(publicCss, { recursive: true });
fs.cpSync(sourceCss, publicCss, { recursive: true, force: true });

console.log('Copied site stylesheets into the Vite public output.');

// Keep the served form and application scripts aligned with their source files.
fs.cpSync(path.join(projectRoot, 'js'), path.join(projectRoot, 'public', 'js'), { recursive: true, force: true });
