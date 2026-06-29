import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' (tuong doi) de ban build chay ca khi mo file:// lan GitHub Pages (/tam-so/).
// Tren Vercel (chay o goc ten mien, co SPA rewrite) phai dung '/' tuyet doi - neu de './'
// thi asset o route con (vd /con-giap) se phan giai sai. Vercel tu dat env VERCEL=1 khi build.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : './',
  build: {
    rollupOptions: {
      output: {
        // Tach vendor (react + router + framer-motion) thanh chunk rieng -> cache lau,
        // doi code app khong lam invalidate vendor. Cac trang code-split tu dong tach chunk.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
        }
      }
    }
  },
  server: {
    allowedHosts: true
  }
})
