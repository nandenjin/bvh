import { resolve } from 'path'

/**
 * Alias for the packages in the monorepo.
 */
const alias = {
  '@nandenjin/bvh-parser': resolve(__dirname, 'packages/parser/lib'),
  '@nandenjin/three-bvh': resolve(__dirname, 'packages/three-bvh/src'),
}

export { alias }
