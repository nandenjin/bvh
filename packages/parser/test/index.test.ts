import * as bvh from '../lib'
import { BVH } from '../lib/bvh'
import { BVHNode } from '../lib/bvh_node'
import express from 'express'
import { readFileSync } from 'fs'
import { describe, expect, test } from 'vitest'
import { Quaternion } from 'three'

const app = express()
app.use(express.static(__dirname))
app.listen(8383)

describe('bvh.js', function () {
  test('should read remote bvh file using xhr', function (done) {
    bvh.read('http://127.0.0.1:8383/fixtures/A_test.bvh', function (motion) {
      expect(motion).toBeInstanceOf(BVH)
      done()
    })
  })
})

describe('BVH', function () {
  const str = readFileSync(__dirname + '/fixtures/A_test.bvh', 'utf-8')
  const motion = bvh.parse(str)

  test('should be instance of BVH', function () {
    expect(motion).toBeInstanceOf(BVH)
  })

  describe('node', function () {
    const head = motion.of('Head')

    test('should be instance of BVHNode', function () {
      expect(head).toBeInstanceOf(BVHNode)
    })

    test('should correctly compute rotation quaternion', function () {
      const frame = 0
      const rotation = head.getRotation(frame)
      expect(rotation).toBeInstanceOf(Quaternion)
    })
  })
})

describe('Noise in parsed animations', function () {
  const str = readFileSync(__dirname + '/fixtures/A_test.bvh', 'utf-8')
  const motion = bvh.parse(str)

  test('should not contain noise in parsed animations', function () {
    const head = motion.of('Head')
    const frame = 0
    const rotation = head.getRotation(frame)
    expect(rotation).toBeInstanceOf(Quaternion)
    expect(rotation.x).toBeCloseTo(0, 5)
    expect(rotation.y).toBeCloseTo(0, 5)
    expect(rotation.z).toBeCloseTo(0, 5)
  })
})
