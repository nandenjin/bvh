export class BVHNode {
  id: string;
  children: BVHNode[];
  parent: BVHNode | null;
  frames: number[][];
  channels: string[] | null;
  hasEnd: boolean;
  currentFrame: number;

  offsetX: number;
  offsetY: number;
  offsetZ: number;

  endOffsetX: number;
  endOffsetY: number;
  endOffsetZ: number;

  constructor(nodeName: string) {
    this.id = nodeName;
    this.children = [];
    this.parent = null;
    this.frames = [];
    this.channels = null;
    this.hasEnd = false;
    this.currentFrame = 0;
  }

  at(nthFrame: number): BVHNode {
    const that = this;
    nthFrame = nthFrame | 0;
    this.currentFrame = nthFrame;
    const frame = this.frames[nthFrame - 1];
    this.channels?.forEach(function (channel, i) {
      const prop = channel.slice(1) + channel.slice(0, 1).toUpperCase();
      that[prop] = frame[i];
    });
    return this;
  }

  flatten(): BVHNode[] {
    const iter = (node: BVHNode): BVHNode[] => {
      let tmp: BVHNode[] = [node];
      for (let i = 0, len = node.children.length; i < len; i++) {
        tmp = tmp.concat(iter(node.children[i]));
      }
      return tmp;
    };
    return iter(this);
  }

  toString(): string {
    const iter = (node: BVHNode, indent: string): string[] => {
      let tmp: string[] = [indent + "- " + node.id];
      for (let i = 0, len = node.children.length; i < len; i++) {
        tmp = tmp.concat(iter(node.children[i], indent + "   "));
      }
      return tmp;
    };
    return iter(this, "").join("\n");
  }
}
