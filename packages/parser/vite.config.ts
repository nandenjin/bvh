/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'bvh',
      fileName: 'bvh',
    },
  },

  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['json'],
      exclude: ['playground'],
    },
  },
})
