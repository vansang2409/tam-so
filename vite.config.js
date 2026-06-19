import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' (tương đối) để bản build chạy cả khi mở file:// lẫn GitHub Pages (/tam-so/).
// Trên Vercel (chạy ở gốc tên miền, có SPA rewrite) phải dùng '/' tuyệt đối — nếu để './'
// thì asset ở route con (vd /con-giap) sẽ phân giải sai. Vercel tự đặt env VERCEL=1 khi build.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : './',
  server: {
    allowedHosts: true
  }
})
