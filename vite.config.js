
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'pwa.svg',
        'apple-touch-icon.png'
      ],

      manifest: {
        id: '/',
        name: 'My Tasks PWA',
        short_name: 'My Tasks',
        description: 'An offline task manager',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,ico,woff2}'
        ],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true
      }
    })
  ]
})
