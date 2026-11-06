import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getHtmlInputs = () => {
  const inputs = {}
  const files = fs.readdirSync(__dirname)
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'google9e25cf69d05e18e5.html') {
      const name = path.parse(file).name
      const input = path.resolve(__dirname, file)
      inputs[name] = input
      const html = fs.readFileSync(input, 'utf8')
      if (/<meta[^>]+property=["']og:type["'][^>]+content=["']article["']/i.test(html)) {
        inputs[`blogs/${name}`] = input
      }
    }
  })
  return inputs
}

export default defineConfig({
  plugins: [react()],
  server: {
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = new URL(req.url, 'http://localhost');
        const articleMatch = requestUrl.pathname.match(/^\/(?:blogs|blog)\/([^/]+)\/?$/);
        if (articleMatch) {
          const slug = decodeURIComponent(articleMatch[1]);
          const cleanSlug = slug.endsWith('.html') ? slug.slice(0, -5) : slug;
          req.url = `/${cleanSlug}.html${requestUrl.search}`;
        } else if (requestUrl.pathname === '/blogs' || requestUrl.pathname === '/blogs/') {
          req.url = `/blogs.html${requestUrl.search}`;
        }
        next();
      });
    }
  },
  build: {
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
})
