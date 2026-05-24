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
      inputs[name] = path.resolve(__dirname, file)
    }
  })
  return inputs
}

export default defineConfig({
  plugins: [react()],
  server: {
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];
        if (url.startsWith('/blog/')) {
          const slug = url.split('/blog/')[1];
          const cleanSlug = slug.endsWith('.html') ? slug.slice(0, -5) : slug;
          req.url = `/${cleanSlug}.html`;
        } else if (url === '/blogs') {
          req.url = '/blogs.html';
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
