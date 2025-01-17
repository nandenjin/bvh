# bvh-parser

BVH Parser written in TypeScript

![Version](https://img.shields.io/github/package-json/v/nandenjin/bvh?filename=packages%2Fparser%2Fpackage.json&style=flat-square)
[![Coverage by Codecov](https://img.shields.io/codecov/c/github/nandenjin/bvh?style=flat-square&logo=codecov)](https://app.codecov.io/gh/nandenjin/bvh/)
[![License](https://img.shields.io/npm/l/%40nandenjin%2Fbvh-parser?style=flat-square)](/LICENSE)

This is a forked version maintained by [`@nandenjin`](https://github.com/nandenjin). Originally written by [`@hitsujiwool`](https://github.com/hitsujiwool).

[🐙 **GitHub**](https://github.com/nandenjin/bvh) | [📒 **Docs**](https://nandenjin.github.io/bvh/modules/_nandenjin_bvh-parser.html) | [⚒️ **Playground**](https://nandenjin.github.io/bvh/playground/)

## Usage

```javascript
import { parse as parseBVH } from '@nandenjin/bvh-parser'

fetch('path/to/your.bvh')
  .then(response => response.text())
  .then(bvhData => {
    const motion = parseBVH(bvhData)

    // basic information about motion data
    console.log(motion.frameTime)
    console.log(motion.numFrames)

    // get lists of nodes
    console.log(motion.nodeList)

    // get a node by id
    const node = motion.of('Head')

    // change node's internal state to n-th frame
    console.log(node.at(4, 'Xposition'))

    // you can exchange the order of method "at" and "of"
    const state = motion
    console.log(state.of('Head').at(4, 'Xposition'))

    // node properties
    console.log(node.offsetX)
    console.log(node.offsetY)
    console.log(node.offsetZ)

    // node adjacent to "End Site" has properties about endOffset
    if (node.hasEnd) {
      console.log(node.endOffsetX)
      console.log(node.endOffsetY)
      console.log(node.endOffsetZ)
    }
  })
  .catch(error => console.error('Error fetching BVH data:', error))
```

## License

See [`LICENSE`](./LICENSE).
