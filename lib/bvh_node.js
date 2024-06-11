export default class BVHNode {
  constructor(nodeName) {
    this.id = nodeName;
    this.children = [];
    this.parent = null;
    this.frames = [];
    this.channels = null;
    this.hasEnd = false;
  }

  at(nthFrame) {
    const that = this;
    nthFrame = nthFrame | 0;
    this.currentFrame = nthFrame;
    const frame = this.frames[nthFrame - 1];
    this.channels.forEach(function (channel, i) {
      const prop = channel.slice(1) + channel.slice(0, 1).toUpperCase();
      that[prop] = frame[i];
    });
    return this;
  }

  flatten() {
    const iter = (node) => {
      let tmp = [node];
      for (let i = 0, len = node.children.length; i < len; i++) {
        tmp = tmp.concat(iter(node.children[i]));
      }
      return tmp;
    };
    return iter(this);
  }

  toString() {
    const iter = (node, indent) => {
      let tmp = [indent + "- " + node.id];
      for (let i = 0, len = node.children.length; i < len; i++) {
        tmp = tmp.concat(iter(node.children[i], indent + "   "));
      }
      return tmp;
    };
    return iter(this, "").join("\n");
  }
}
