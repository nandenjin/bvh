export default class BVH {
  constructor(parser) {
    function iter(node, res) {
      if (res[node.id])
        throw new Error("Error: Node " + node.id + " already exists");
      res[node.id] = node;
      for (let i = 0, len = node.children.length; i < len; i++) {
        iter(node.children[i], res);
      }
      return res;
    }
    this.root = parser.currentNode;
    this.numFrames = parser.numFrames;
    this.frameTime = parser.frameTime;
    this.nodeList = this.root.flatten();
    this._nodeIndex = iter(this.root, {});
  }

  at(nthFrame) {
    nthFrame = nthFrame | 0;
    for (let prop in this._nodeIndex) {
      this._nodeIndex[prop].at(nthFrame);
    }
    return this;
  }

  of(id) {
    return this._nodeIndex[id];
  }
}
