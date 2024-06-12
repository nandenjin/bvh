import { BVHNode } from "./bvh_node";
import { Parser } from "./parser";

export class BVH {
  root: BVHNode;
  numFrames: number;
  frameTime: number;
  nodeList: BVHNode[];
  private _nodeIndex: { [id: string]: BVHNode };

  constructor(parser: Parser) {
    function iter(
      node: BVHNode,
      res: { [id: string]: BVHNode }
    ): { [id: string]: BVHNode } {
      if (res[node.id]) {
        throw new Error(`Error: Node ${node.id} already exists`);
      }
      res[node.id] = node;
      for (let i = 0, len = node.children.length; i < len; i++) {
        iter(node.children[i], res);
      }
      return res;
    }

    if (parser.currentNode === null) {
      throw new Error("Error: No root node found");
    }

    this.root = parser.currentNode;
    this.numFrames = parser.numFrames;
    this.frameTime = parser.frameTime;
    this.nodeList = this.root.flatten();
    this._nodeIndex = iter(this.root, {});
  }

  at(nthFrame: number): BVH {
    nthFrame = nthFrame | 0;
    for (let prop in this._nodeIndex) {
      this._nodeIndex[prop].at(nthFrame);
    }
    return this;
  }

  of(id: string): BVHNode | undefined {
    return this._nodeIndex[id];
  }
}
