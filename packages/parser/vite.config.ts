/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: 'index',
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
