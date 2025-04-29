import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,xml,json,gif}'],
      maximumFileSizeToCacheInBytes: 30000000,
    },
    manifest: {
      name: "Sheru's App Library",
      short_name: 'Sheru',
      description: "Sheru's App Library is a collection of web-based tools showcasing my capabilities.",
      theme_color: '#611A37',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    }
  })],
  resolve: {
    alias: {
      'next/navigation': path.resolve(__dirname, 'src/empty.js'),
      'next/navigation.js': path.resolve(__dirname, 'src/empty.js')
    }
  },
  optimizeDeps: {
    exclude: ['@vercel/speed-insights']
  },
  build: {
    rollupOptions: {
      external: ['@vercel/speed-insights']
    }
  }
})
