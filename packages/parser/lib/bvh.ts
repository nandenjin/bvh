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
    if (parser.currentNode === null) {
      throw new Error('No root node found')
    }

    this.root = parser.currentNode
    this.numFrames = parser.numFrames
    this.frameTime = parser.frameTime
    this.nodeList = this.root.flatten()

    for (const node of this.nodeList) {
      if (node.id === undefined) {
        throw new Error('Node id is undefined')
      } else if (this._nodeIndex[node.id] !== undefined) {
        throw new Error(`Duplicate node id: ${node.id}`)
      }
      this._nodeIndex[node.id] = node
    }
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
