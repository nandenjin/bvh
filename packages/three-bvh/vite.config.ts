/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { alias } from '../../config'

export default defineConfig(({ mode }) => {
  const isDev = mode == 'development'

  return {
    plugins: [
      dts({
        rollupTypes: true,
        pathsToAliases: false, // Disable paths to aliases in dts
      }),
    ],
    root: __dirname,
    resolve: {
      alias: {
        ...(isDev ? alias : {}), // Only use alias in dev mode
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
  }
})
