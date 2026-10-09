import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localizedSeo } from './scripts/seo-html.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), localizedSeo()],
})
