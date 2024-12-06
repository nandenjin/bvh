import { Parser } from './parser'
import { BVH } from './bvh'

export async function read(
  url: string,
  callback: (bvh: BVH) => void,
): Promise<void> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const text = await response.text()
    callback(parse(text))
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

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
