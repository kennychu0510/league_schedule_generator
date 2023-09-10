import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: '.',
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  },
})