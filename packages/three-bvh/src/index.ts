import type { BVH, BVHNode } from '@nandenjin/bvh-parser'
import { KeyframeTrack, Bone, AnimationClip } from 'three'
import { getFrameEnd, processNode } from './processors'

export const createBones = (bvh: BVH) => {
  const createByNode = (node: BVHNode) => {
    const bone = new Bone()
    bone.name = node.id
    bone.position.set(node.offsetX, node.offsetY, node.offsetZ)

    for (const child of node.children) {
      const childBone = createByNode(child)
      bone.add(childBone)
    }

    return bone
  }

  return createByNode(bvh.root)
}

export const createClip = (bvh: BVH, frameStart = 0, frameEnd = -1) => {
  const tracks: KeyframeTrack[] = []

  frameEnd = getFrameEnd(bvh, frameEnd)

  for (const node of bvh.nodeList) {
    const nodeTracks = processNode(node, frameStart, frameEnd, bvh.frameTime)
    tracks.push(...nodeTracks)
  }

  return new AnimationClip(undefined, bvh.duration, tracks)
}
