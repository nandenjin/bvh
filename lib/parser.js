import BVHNode from "./bvh_node.js";

export default class Parser {
  constructor(lines) {
    this._lines = lines;
    this._lineNumber = -1;
    this.currentNode = null;
    this.next();
  }

  parse() {
    this.expect("HIERARCHY").root().motion();
    if (this.get())
      throw new Error("Parse error: Invalid token " + this.get() + ".");
    return this;
  }

  root() {
    let node;
    this.expect("ROOT", (line) => {
      const nodeName = line.split(/\s+/)[1];
      node = new BVHNode(nodeName);
      this.currentNode = node;
    })
      .expect("{")
      .offset()
      .channels();
    while (this.accept("JOINT")) {
      this.joint();
      this.currentNode = node;
    }
    if (this.accept("End")) this.end();
    this.expect("}");
    return this;
  }

  joint() {
    let node;
    this.expect("JOINT", (line) => {
      const nodeName = line.split(/\s+/)[1];
      node = new BVHNode(nodeName);
      node.parent = this.currentNode;
      this.currentNode.children.push(node);
      this.currentNode = node;
    })
      .expect("{")
      .offset()
      .channels();
    while (this.accept("JOINT")) {
      this.joint();
      this.currentNode = node;
    }
    if (this.accept("End")) this.end();
    this.expect("}");
    return this;
  }

  end() {
    if (this.get(0) !== "End Site")
      throw new Error(
        "Parse error: End Site expected, but " + this.get() + "."
      );
    this.next().expect("{").endOffset().expect("}");
    return this;
  }

  offset() {
    const offsets = this.get().split(/\s+/).slice(1);
    if (offsets.length !== 3)
      throw new Error("Parse error: Invalid offset number.");
    this.currentNode.offsetX = +offsets[0];
    this.currentNode.offsetY = +offsets[1];
    this.currentNode.offsetZ = +offsets[2];
    return this.next();
  }

  endOffset() {
    const offsets = this.get().split(/\s+/).slice(1);
    if (offsets.length !== 3)
      throw new Error("Parse error: Invalid offset number.");
    this.currentNode.hasEnd = true;
    this.currentNode.endOffsetX = +offsets[0];
    this.currentNode.endOffsetY = +offsets[1];
    this.currentNode.endOffsetZ = +offsets[2];
    return this.next();
  }

  channels() {
    const pieces = this.get(0).split(/\s+/);
    const n = parseInt(pieces[1], 10);
    const channels = pieces.slice(2);
    if (n !== channels.length)
      throw new Error(
        "Parse error: " +
          n +
          " expected for number of channels, but " +
          channels.length +
          "."
      );
    this.currentNode.channels = channels;
    return this.next();
  }

  motion() {
    this._nodeList = this.currentNode.flatten();
    this.expect("MOTION").frames().frameTime();
    for (let i = 0, len = this.numFrames; i < len; i++) {
      this.frameValues();
    }
    return this;
  }

  frames() {
    const match = /^Frames:\s+(\d+)\s*$/.exec(this.get());
    if (match !== null) {
      this.numFrames = +match[1];
    } else {
      throw new Error("Parse error: Cannot find valid number of frames");
    }
    return this.next();
  }

  frameTime() {
    const match = /^Frame Time:\s+([0-9.]+)$/.exec(this.get());
    if (match !== null) {
      this.frameTime = +match[1];
    } else {
      throw new Error("Parse error: Cannot find valid frametime");
    }
    return this.next();
  }

  frameValues() {
    const values = this.get().split(/\s+/);
    this._nodeList.forEach((node) => {
      if (values.length < node.channels.length)
        throw new Error("Parse error: Too short motion values per frame");
      node.frames.push(
        values.splice(0, node.channels.length).map((str) => +str)
      );
    });
    if (values.length > 0)
      throw new Error("Parse error: Too much motion values per frame");
    return this.next();
  }

  expect(state, callback) {
    if (this.accept(state)) {
      if (callback) callback(this.get());
      return this.next();
    } else {
      throw new Error(
        "Parse error: Unexpected token " + this.get() + " for " + state
      );
    }
  }

  accept(state) {
    const line = this.get();
    if (line === undefined) return false;
    return line.split(/\s+/)[0] == state;
  }

  next() {
    do {
      this._lineNumber++;
    } while (this.get() === "");
    return this;
  }

  get() {
    if (typeof this._lines[this._lineNumber] === "undefined") {
      return undefined;
    } else {
      return this._lines[this._lineNumber].replace(/(^\s+)|(\s+$)/g, "");
    }
  }
}
