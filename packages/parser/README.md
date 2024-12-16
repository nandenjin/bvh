# bvh-parser

BVH Parser written in TypeScript

![Version](https://img.shields.io/github/package-json/v/nandenjin/bvh?filename=packages%2Fparser%2Fpackage.json&style=flat-square)
[![Coverage by Codecov](https://img.shields.io/codecov/c/github/nandenjin/bvh?style=flat-square&logo=codecov)](https://app.codecov.io/gh/nandenjin/bvh/)
[![License](https://img.shields.io/npm/l/%40nandenjin%2Fbvh-parser?style=flat-square)](/LICENSE)

This is a forked version maintained by [`@nandenjin`](https://github.com/nandenjin). Originally written by [`@hitsujiwool`](https://github.com/hitsujiwool).

[🐙 **GitHub**](https://github.com/nandenjin/bvh) | [📒 **Docs**](https://nandenjin.github.io/bvh/modules/_nandenjin_bvh-parser.html) | [⚒️ **Playground**](https://nandenjin.github.io/bvh/playground/)

## Usage

```javascript
import { read as readBVH } from '@nandenjin/bvh'

readBVH(urlForBVHFile, function (motion) {
  // basic infomation about motion data
  motion.frameTime
  motion.numFrames

  // get lists of nodes
  motion.nodeList

  // get a node by id
  var node = motion.of('Head')

  // change node's internal state to n-th frame
  node.at(4)

  // you can exchange the order of method "at" and "of"
  var state = motion.at(4)
  node = state.of('Head')

  // node properties
  node.offsetX
  node.offsetY
  node.offsetZ
  node.rotationX
  node.rotationY
  node.rotationZ

  // node adjacent to "End Site" has properties about endOffset
  if (node.hasEnd) {
    node.endOffsetX
    node.endOffsetY
    node.endOffsetZ
  }
})
```

## License

See [`LICENSE`](./LICENSE).
