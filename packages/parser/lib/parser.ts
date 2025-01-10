import { BVHNode } from './bvh_node'

export class Parser {
  private _lines: string[]
  private _lineNumber: number
  currentNode: BVHNode | null
  numFrames: number
  frameTime: number

  constructor(lines: string[]) {
    this._lines = lines
    this._lineNumber = -1
    this.currentNode = null
    this.next()
  }

  parse(): Parser {
    this.expect('HIERARCHY').expectRoot().expectMotion()
    if (this.get()) {
      throw new Error('Parse error: Invalid token ' + this.get() + '.')
    }
    return this
  }

  private expectRoot(): Parser {
    let node: BVHNode
    this.expect('ROOT', (line: string) => {
      const nodeName = line.split(/\s+/)[1]
      node = new BVHNode(nodeName)
      this.currentNode = node
    })
      .expect('{')
      .offset()
      .expectChannels()
    while (this.accept('JOINT')) {
      this.expectJoint()
      this.currentNode = node!
    }
    if (this.accept('End')) this.end()
    this.expect('}')
    return this
  }

  private expectJoint(): Parser {
    let node: BVHNode
    this.expect('JOINT', (line: string) => {
      const nodeName = line.split(/\s+/)[1]
      node = new BVHNode(nodeName)
      node.parent = this.currentNode
      if (this.currentNode) {
        this.currentNode.children.push(node)
      }
      this.currentNode = node
    })
      .expect('{')
      .offset()
      .expectChannels()
    while (this.accept('JOINT')) {
      this.expectJoint()
      this.currentNode = node!
    }
    if (this.accept('End')) this.end()
    this.expect('}')
    return this
  }

  private end(): Parser {
    if (this.get() !== 'End Site') {
      throw new Error('Parse error: End Site expected, but ' + this.get() + '.')
    }
    this.next().expect('{').endOffset().expect('}')
    return this
  }

  private offset(): Parser {
    const offsets = this.get().split(/\s+/).slice(1)
    if (offsets.length !== 3)
      throw new Error('Parse error: Invalid offset number.')
    if (this.currentNode) {
      this.currentNode.offsetX = +offsets[0]
      this.currentNode.offsetY = +offsets[1]
      this.currentNode.offsetZ = +offsets[2]
    }
    return this.next()
  }

  private endOffset(): Parser {
    const offsets = this.get().split(/\s+/).slice(1)
    if (offsets.length !== 3)
      throw new Error('Parse error: Invalid offset number.')
    if (this.currentNode) {
      this.currentNode.hasEnd = true
      this.currentNode.endOffsetX = +offsets[0]
      this.currentNode.endOffsetY = +offsets[1]
      this.currentNode.endOffsetZ = +offsets[2]
    }
    return this.next()
  }

  private expectChannels(): Parser {
    const pieces = this.get().split(/\s+/)
    const n = parseInt(pieces[1], 10)
    const channels = pieces.slice(2)
    if (n !== channels.length)
      throw new Error(
        'Parse error: ' +
          n +
          ' expected for number of channels, but ' +
          channels.length +
          '.',
      )
    if (this.currentNode) {
      this.currentNode.channels = channels
    }
    return this.next()
  }

  private expectMotion() {
    const _nodeList = this.currentNode ? this.currentNode.flatten() : []
    this.expect('MOTION').expectNumFrames().expectFrameTime()
    for (let i = 0, len = this.numFrames; i < len; i++) {
      this.expectFrameValues(_nodeList)
    }
  }

  private expectNumFrames(): Parser {
    const match = /^Frames:\s+(\d+)\s*$/.exec(this.get())
    if (match !== null) {
      this.numFrames = +match[1]
    } else {
      throw new Error('Parse error: Cannot find valid number of frames')
    }
    return this.next()
  }

  private expectFrameTime(): Parser {
    const match = /^Frame Time:\s+([0-9.]+)$/.exec(this.get())
    if (match !== null) {
      this.frameTime = +match[1]
    } else {
      throw new Error('Parse error: Cannot find valid frametime')
    }
    return this.next()
  }

  private expectFrameValues(nodes: BVHNode[]) {
    const values = this.get().split(/\s+/)
    nodes.forEach((node) => {
      if (values.length < (node.channels?.length ?? 0))
        throw new Error('Parse error: Too short motion values per frame')
      node.frames.push(
        values.splice(0, node.channels?.length ?? 0).map((str) => +str),
      )
    })
    if (values.length > 0)
      throw new Error('Parse error: Too much motion values per frame')
    this.next()
  }

  private expect(state: string, callback?: (line: string) => void): Parser {
    if (this.accept(state)) {
      if (callback) callback(this.get())
      return this.next()
    } else {
      throw new Error(
        'Parse error: Unexpected token ' + this.get() + ' for ' + state,
      )
    }
  }

  private accept(state: string): boolean {
    const line = this.get()
    if (line === '') return false
    return line.split(/\s+/)[0] == state
  }

  private next(): Parser {
    do {
      this._lineNumber++
    } while (this.get() === '' && this._lines.length > this._lineNumber)
    return this
  }

  private get(): string {
    return this._lines[this._lineNumber]?.trim() || ''
  }
}
