import { Parser } from './parser'
import { BVH } from './bvh'

export type ParseOptions = {
  /** Weather to use character-local coords */
  useLocalCoords?: boolean
}

export function parse(str: string, options: ParseOptions = {}): BVH {
  const { useLocalCoords = false } = options

  const lines = str.replace('\r', '').split('\n')

  const bvh = new BVH(new Parser(lines).parse())

  if (useLocalCoords) {
    const root = bvh.root
    for (let i = 0; i < bvh.numFrames; i++) {
      root.set(i, 'Xposition', 0)
      root.set(i, 'Yposition', 0)
      root.set(i, 'Zposition', 0)
    }
  }

  return bvh
}

export { BVH, Parser }
export { BVHNode } from './bvh_node'
