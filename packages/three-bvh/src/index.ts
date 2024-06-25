import type { BVH, BVHNode } from '@nandenjin/bvh-parser'
import {
  AnimationClip,
  KeyframeTrack,
  Bone,
  VectorKeyframeTrack,
  Quaternion,
  Vector3,
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

export const createClip = (bvh: BVH) => {
  const tracks: KeyframeTrack[] = []

  for (const node of bvh.nodeList) {
    if (node.hasEnd) continue

    const times: number[] = []
    const positions: number[] = []
    const rotations: number[] = []
    for (let i = 0; i < bvh.numFrames; i++) {
      times.push(i * bvh.frameTime)

      const position = new Vector3(node.offsetX, node.offsetY, node.offsetZ)
      const rotation = new Quaternion()
      const quat = new Quaternion()

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
            quat.setFromAxisAngle(
              new Vector3(1, 0, 0),
              (node.frames[i][j] * Math.PI) / 180,
            )
            rotation.multiply(quat)
            break
          case 'Yrotation':
            quat.setFromAxisAngle(
              new Vector3(0, 1, 0),
              (node.frames[i][j] * Math.PI) / 180,
            )
            rotation.multiply(quat)
            break
          case 'Zrotation':
            quat.setFromAxisAngle(
              new Vector3(0, 0, 1),
              (node.frames[i][j] * Math.PI) / 180,
            )
            rotation.multiply(quat)
            break
          default:
            throw new Error('Error: Invalid channel')
        }
      }

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
