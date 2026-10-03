import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const alvo = env.VITE_API_PROXY || 'http://localhost:3000'

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'CuCare — Gestão Clínica',
          short_name: 'CuCare',
          description:
            'Gestão institucional de processos clínicos, relatórios e documentação médica.',
          theme_color: '#0F2A4A',
          background_color: '#F5F7FA',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // O fallback de navegação serve o index.html da SPA para qualquer rota.
          // /api fica excluída para que pedidos de dados nunca sejam servidos do cache.
          navigateFallbackDenylist: [/^\/api/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
        },
      }),
    ],

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: alvo,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: alvo,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})