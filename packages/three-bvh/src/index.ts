import type { BVH, BVHNode } from '@nandenjin/bvh-parser'
import {
  AnimationClip,
  KeyframeTrack,
  Bone,
  VectorKeyframeTrack,
  Quaternion,
  Vector3,
  Euler,
} from 'three'

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

  // frameEnd = -1 means the last frame
  frameEnd = frameEnd === -1 ? bvh.numFrames : frameEnd

  for (const node of bvh.nodeList) {
    if (node.hasEnd) continue

    const times: number[] = []
    const positions: number[] = []
    const rotations: number[] = []
    for (let i = frameStart; i < Math.min(bvh.numFrames, frameEnd); i++) {
      times.push(i * bvh.frameTime)

      const position = new Vector3(node.offsetX, node.offsetY, node.offsetZ)
      const rotation = new Quaternion()
      const euler = new Euler()

      for (let j = 0; j < node.channels.length; j++) {
        switch (node.channels[j]) {
          case 'Xposition':
            position.x += node.frames[i][j]
            break
          case 'Yposition':
            position.y += node.frames[i][j]
            break
          case 'Zposition':
            position.z += node.frames[i][j]
            break
          case 'Xrotation':
            euler.x = (node.frames[i][j] * Math.PI) / 180
            break
          case 'Yrotation':
            euler.y = (node.frames[i][j] * Math.PI) / 180
            break
          case 'Zrotation':
            euler.z = (node.frames[i][j] * Math.PI) / 180
            break
          default:
            throw new Error('Error: Invalid channel')
        }
      }

      rotation.setFromEuler(euler)

      positions.push(position.x, position.y, position.z)
      rotations.push(rotation.x, rotation.y, rotation.z, rotation.w)
    }

    const positionTrack = new VectorKeyframeTrack(
      node.id + '.position',
      times,
      positions,
    )
    const rotationTrack = new VectorKeyframeTrack(
      node.id + '.quaternion',
      times,
      rotations,
    )

    tracks.push(positionTrack, rotationTrack)
  }

  return new AnimationClip(undefined, bvh.numFrames * bvh.frameTime, tracks)
}

export const getRotation = (node: BVHNode, frame: number): Quaternion => {
  const euler = new Euler()
  for (let j = 0; j < node.channels.length; j++) {
    switch (node.channels[j]) {
      case 'Xrotation':
        euler.x = (node.frames[frame][j] * Math.PI) / 180
        break
      case 'Yrotation':
        euler.y = (node.frames[frame][j] * Math.PI) / 180
        break
      case 'Zrotation':
        euler.z = (node.frames[frame][j] * Math.PI) / 180
        break
      default:
        break
    }
  }
  return new Quaternion().setFromEuler(euler)
}
