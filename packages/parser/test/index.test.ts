import * as bvh from '../lib'
import { BVH } from '../lib/bvh'
import { BVHNode } from '../lib/bvh_node'
// import { Parser } from "../lib/parser";
import { readFileSync } from 'fs'
import { describe, expect, test } from 'vitest'
import { resolve as resolvePath } from 'path'

const assetsDir = resolvePath(__dirname, '../../../assets')

describe('BVH', function () {
  const str = readFileSync(resolvePath(assetsDir, './A_test.bvh'), 'utf-8')
  const motion = bvh.parse(str)

  test('should be instance of BVH', function () {
    expect(motion).toBeInstanceOf(BVH)
  })

  describe('node', function () {
    const head = motion.of('Head')

    test('should be instance of BVHNode', function () {
      expect(head).toBeInstanceOf(BVHNode)
    })
  })
})
