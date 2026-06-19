import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' để bản build chạy được cả khi mở bằng file:// lẫn deploy tĩnh (Netlify/Vercel/GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    allowedHosts: true
  }
})
