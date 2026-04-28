import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: "3000",
    proxy: {
      '/studentapi': {
        target: 'http://localhost:2910',
        changeOrigin: true
      },
      '/teacherapi': {
        target: 'http://localhost:2910',
        changeOrigin: true
      },
      '/adminapi': {
        target: 'http://localhost:2910',
        changeOrigin: true
      }
    }
  }
})
