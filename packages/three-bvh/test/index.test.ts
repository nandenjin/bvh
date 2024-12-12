import { describe, expect, test } from 'vitest'
import { createBones, createClip } from '../src'
import { getFrameEnd, processFrame, processNode } from '../src/processors'
import { BVH, BVHNode } from '@nandenjin/bvh-parser'

const createTestBVH = () => {
  const node = new BVHNode('Hips')
  node.offsetX = 0
  node.offsetY = 0
  node.offsetZ = 0
  node.channels = [
    'Xposition',
    'Yposition',
    'Zposition',
    'Xrotation',
    'Yrotation',
    'Zrotation',
  ]
  node.frames = Array(100).fill([0, 0, 0, 0, 0, 0])
  node.hasEnd = false

  const bvh = new BVH()
  bvh.numFrames = 100
  bvh.frameTime = 0.033
  bvh.nodeList = [node]
  bvh.root = node
  return bvh
}

describe('three-bvh', () => {
  const motion = createTestBVH()

  test('createBones should create bones from BVH', () => {
    const bones = createBones(motion)
    expect(bones).toBeDefined()
    expect(bones.name).toBe('Hips')
  })

  test('createClip should create animation clip from BVH', () => {
    const clip = createClip(motion)
    expect(clip).toBeDefined()
    expect(clip.tracks.length).toBeGreaterThan(0)
  })

  test('getFrameEnd should return correct frame end', () => {
    expect(getFrameEnd(motion, -1)).toBe(motion.numFrames)
    expect(getFrameEnd(motion, 10)).toBe(10)
  })

  test('processFrame should process a frame correctly', () => {
    const node = motion.nodeList[0]
    const frameIndex = 0
    const frameTime = motion.frameTime
    const { times, positions, rotations } = processFrame(
      node,
      frameIndex,
      frameTime,
    )

    expect(times).toEqual([frameIndex * frameTime])
    expect(positions).toEqual([0, 0, 0])
    expect(rotations).toEqual([0, 0, 0, 1])
  })

  test('processNode should process a node correctly', () => {
    const node = motion.nodeList[0]
    const frameStart = 0
    const frameEnd = 10
    const frameTime = motion.frameTime
    const tracks = processNode(node, frameStart, frameEnd, frameTime)

    expect(tracks).toBeDefined()
    expect(tracks.length).toBeGreaterThan(0)
  })
})
