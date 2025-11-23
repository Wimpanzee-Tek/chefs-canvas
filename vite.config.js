import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'icon.jpg'],
      manifest: {
        name: 'Chefs Canvas',
        short_name: 'Chefs Canvas',
        description: 'A chameleon recipe book that adapts to your style.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon.jpg',
            sizes: '192x192 512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // Ensure the JPEG is copied to the dist folder
  // (Vite will copy any file referenced in includeAssets)
  // We'll add it to the includeAssets array above.
})
