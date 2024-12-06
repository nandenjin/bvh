export class BVHNode {
  /**
   * Name of the node
   * @example 'Hips'
   */
  id: string
  children: BVHNode[]
  parent: BVHNode | null
  /**
   * Raw array of frame values
   * @example ```ts
   * const xPosition: number = node.frames[frameIndex][node.channels.indexOf('Xposition')]
   * ```
   */
  frames: number[][]
  /**
   * List of channels with the order as `frames`
   * @example ['Xposition', 'Yposition', 'Zposition']
   */
  channels: string[] | null
  /**
   * True if the node is at an end sites
   */
  hasEnd: boolean
  /**
   * Statefull property to keep track of the current frame
   * @deprecated
   */
  currentFrame: number

  offsetX: number
  offsetY: number
  offsetZ: number

  endOffsetX: number
  endOffsetY: number
  endOffsetZ: number

  constructor(nodeName: string) {
    this.id = nodeName
    this.children = []
    this.parent = null
    this.frames = []
    this.channels = null
    this.hasEnd = false
    this.currentFrame = 0
  }

  /**
   * Get value of the channel at the current frame
   * @param nthFrame Index of frame
   * @param channel Name of channel
   * @returns Value of the channel
   * @example node.at(0, 'Xposition')
   */
  at(nthFrame: number, channel: string) {
    const index = this.channels.indexOf(channel)
    if (index === -1) {
      throw new Error(`Channel ${channel} not found in node ${this.id}`)
    }
    return this.frames[nthFrame][index]
  }

  /**
   * Set value of the channel at the current frame
   * @param nthFrame Index of frame
   * @param channel Name of channel
   * @param value Value to set
   * @example node.set(0, 'Xposition', 0)
   */
  set(nthFrame: number, channel: string, value: number) {
    const index = this.channels.indexOf(channel)
    if (index === -1) {
      throw new Error(`Channel ${channel} not found in node ${this.id}`)
    }
    this.frames[nthFrame][index] = value
  }

  /**
   * Get flat array of all nodes under this node
   */
  flatten(): BVHNode[] {
    let nodes: BVHNode[] = [this]
    for (const child of this.children) {
      nodes = nodes.concat(child.flatten())
    }
    return nodes
  }

  toString(): string {
    const iter = (node: BVHNode, indent: string): string[] => {
      let tmp: string[] = [indent + '- ' + node.id]
      for (let i = 0, len = node.children.length; i < len; i++) {
        tmp = tmp.concat(iter(node.children[i], indent + '   '))
      }
      return tmp
    }
    return iter(this, '').join('\n')
  }
}
