import { BVH, BVHNode } from '@nandenjin/bvh-parser'
import {
  KeyframeTrack,
  Quaternion,
  QuaternionKeyframeTrack,
  Vector3,
  VectorKeyframeTrack,
} from 'three'

export const getFrameEnd = (bvh: BVH, frameEnd: number): number => {
  return frameEnd === -1 ? bvh.numFrames : frameEnd
}

export const processFrame = (
  node: BVHNode,
  frameIndex: number,
  frameTime: number,
): { times: number[]; positions: number[]; rotations: number[] } => {
  const times: number[] = []
  const positions: number[] = []
  const rotations: number[] = []

  times.push(frameIndex * frameTime)

  const position = new Vector3(node.offsetX, node.offsetY, node.offsetZ)
  const rotation = new Quaternion()
  const quat = new Quaternion()

  for (let j = 0; j < node.channels.length; j++) {
    switch (node.channels[j]) {
      case 'Xposition':
        position.x += node.frames[frameIndex][j]
        break
      case 'Yposition':
        position.y += node.frames[frameIndex][j]
        break
      case 'Zposition':
        position.z += node.frames[frameIndex][j]
        break
      case 'Xrotation':
        quat.setFromAxisAngle(
          new Vector3(1, 0, 0),
          (node.frames[frameIndex][j] * Math.PI) / 180,
        )
        rotation.multiply(quat)
        break
      case 'Yrotation':
        quat.setFromAxisAngle(
          new Vector3(0, 1, 0),
          (node.frames[frameIndex][j] * Math.PI) / 180,
        )
        rotation.multiply(quat)
        break
      case 'Zrotation':
        quat.setFromAxisAngle(
          new Vector3(0, 0, 1),
          (node.frames[frameIndex][j] * Math.PI) / 180,
        )
        rotation.multiply(quat)
        break
    }
  }

  positions.push(position.x, position.y, position.z)
  rotations.push(rotation.x, rotation.y, rotation.z, rotation.w)

  return { times, positions, rotations }
}

export const processNode = (
  node: BVHNode,
  frameStart: number,
  frameEnd: number,
  frameTime: number,
): KeyframeTrack[] => {
  const tracks: KeyframeTrack[] = []

  if (node.hasEnd) return tracks

  for (let i = frameStart; i < Math.min(node.frames.length, frameEnd); i++) {
    const { times, positions, rotations } = processFrame(node, i, frameTime)
    tracks.push(
      new VectorKeyframeTrack(`${node.id}.position`, times, positions),
    )
    tracks.push(
      new QuaternionKeyframeTrack(`${node.id}.quaternion`, times, rotations),
    )
  }

  return tracks
}
