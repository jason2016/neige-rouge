import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Identite de CE build (2026-10-12). Ecrite dans le bundle ET dans version.json : une page restee
// ouverte compare les deux et se recharge quand le deploiement a change (src/components/miseAJour.js).
// L'horodatage rend chaque build unique, meme deux builds du meme commit.
const SHA = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim() } catch { return 'sans-git' } })()
const BUILD_ID = `${SHA}-${Date.now().toString(36)}`

const versionJson = {
  name: 'nr-version-json',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset', fileName: 'version.json',
      source: JSON.stringify({ build: BUILD_ID, sha: SHA, date: new Date().toISOString() }),
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionJson],
  base: '/neige-rouge/',
  define: { 'import.meta.env.VITE_BUILD_ID': JSON.stringify(BUILD_ID) },
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
