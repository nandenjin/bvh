export class BVHNode {
  id: string
  children: BVHNode[]
  parent: BVHNode | null
  frames: number[][]
  channels: string[] | null
  hasEnd: boolean
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
    const index = this.channels!.indexOf(channel)
    if (index === -1) {
      throw new Error(`Channel ${channel} not found in node ${this.id}`)
    }
    return this.frames[nthFrame][index]
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
