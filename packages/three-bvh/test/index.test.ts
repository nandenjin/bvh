import { describe, expect, test } from 'vitest'
import { parse as parseBVH } from '@nandenjin/bvh-parser'
import { createBones, createClip } from '../src'
import { getFrameEnd, processFrame, processNode } from '../src/processors'
import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { Vector3, Quaternion } from 'three'

const assetsDir = resolvePath(__dirname, '../../../assets')

describe('three-bvh', () => {
  const str = readFileSync(resolvePath(assetsDir, './A_test.bvh'), 'utf-8')
  const motion = parseBVH(str)

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
    expect(positions.length).toBe(3)
    expect(rotations.length).toBe(4)
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
