import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { alias } from '../../config'

export default defineConfig({
  root: resolve(__dirname),
  base: process.env.PLAYGROUND_BASE_PATH,
  plugins: [
    vue({
      script: {
        propsDestructure: true,
      },
    }),
  ],
  resolve: {
    alias: {
      ...alias,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
