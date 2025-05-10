import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path';
// https://vitejs.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    fs: {
      allow: [
        // Allow serving files from the project root
        path.resolve(__dirname, '..'),
        // Allow serving files from node_modules
        path.resolve(__dirname, 'node_modules')
      ]
    }
  }
})
