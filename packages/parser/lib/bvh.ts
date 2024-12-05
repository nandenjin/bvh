import { BVHNode } from './bvh_node'
import { Parser } from './parser'

export class BVH {
  /**
   * Root node of the BVH, usually 'Hips'
   */
  root: BVHNode
  /**
   * Number of total frames in the BVH
   */
  numFrames: number
  /**
   * Time for each frame in seconds. `1 / fps`
   */
  frameTime: number
  /**
   * List of all nodes in the BVH
   */
  nodeList: BVHNode[]
  private _nodeIndex: { [id: string]: BVHNode }

  constructor(parser: Parser) {
    function iter(
      node: BVHNode,
      res: { [id: string]: BVHNode },
    ): { [id: string]: BVHNode } {
      if (res[node.id]) {
        throw new Error(`Error: Node ${node.id} already exists`)
      }
      res[node.id] = node
      for (let i = 0, len = node.children.length; i < len; i++) {
        iter(node.children[i], res)
      }
      return res
    }

    if (parser.currentNode === null) {
      throw new Error('Error: No root node found')
    }

    this.root = parser.currentNode
    this.numFrames = parser.numFrames
    this.frameTime = parser.frameTime
    this.nodeList = this.root.flatten()
    this._nodeIndex = iter(this.root, {})
  }

  /**
   * Get a node by its id
   * @param id
   * @returns `BVHNode` or `undefined` if not found
   */
  of(id: string): BVHNode | undefined {
    return this._nodeIndex[id]
  }
}
