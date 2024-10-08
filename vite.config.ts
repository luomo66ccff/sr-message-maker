import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { buildTime } from 'star-rail-vue/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    DEFAULT_TEXT: JSON.stringify('愿此行，终抵群星'),
    DEFAULT_AVATAR: JSON.stringify('星•毁灭')
  },
  plugins: [
    buildTime(),
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue']
    }),
    VueDevTools(),
    VitePWA({
      mode: 'production',
      injectRegister: 'auto',
      registerType: 'prompt',
      manifest: {
        id: '/',
        name: '崩坏:星穹铁道 - 短信',
        short_name: '星铁短信',
        description: '崩坏:星穹铁道短信生成器',
        display: 'fullscreen',
        orientation: 'landscape',
        theme_color: '#000',
        background_color: '#000',
        lang: 'zh-cn',
        icons: [
          {
            src: 'icon.webp',
            type: 'image/webp',
            sizes: '256x256'
          }
        ],
        screenshots: [
          {
            src: 'preview.webp',
            sizes: '1018x500'
          },
          {
            src: 'preview.webp',
            sizes: '1018x500',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        // skipWaiting: true,
        disableDevLogs: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps|ico|webp)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache'
            }
          },
          {
            urlPattern: /(.*?)\.(woff2)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache'
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          sr: ['star-rail-vue']
        }
      }
    },
    assetsInlineLimit: 1024 * 200,
    chunkSizeWarningLimit: 1024
  }
})
