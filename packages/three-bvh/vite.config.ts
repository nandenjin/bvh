import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { alias } from '../../config'

export default defineConfig({
  plugins: [dts()],
  root: __dirname,
  resolve: {
    alias: {
      ...alias,
    },
  },
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE',
        },
      },
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
