/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
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
