import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/neige-rouge/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kitchen: resolve(__dirname, 'kitchen.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
