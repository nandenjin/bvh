import { BVH, BVHNode } from '@nandenjin/bvh-parser'
import {
  Euler,
  KeyframeTrack,
  Quaternion,
  QuaternionKeyframeTrack,
  Vector3,
  VectorKeyframeTrack,
} from 'three'

/**
 * Returns the end frame of the BVH animation.
 *
 * @param {BVH} bvh - The BVH object containing the animation data.
 * @param {number} frameEnd - The specified end frame. If -1, the total number of frames in the BVH is returned.
 * @returns {number} - The end frame of the BVH animation.
 */
export const getFrameEnd = (bvh: BVH, frameEnd: number): number => {
  return frameEnd === -1 ? bvh.numFrames : frameEnd
}

/**
 * Processes a single frame of the BVH animation.
 *
 * @param {BVHNode} node - The BVH node containing the frame data.
 * @param {number} frameIndex - The index of the frame to process.
 * @param {number} frameTime - The time duration of each frame.
 * @returns {{ times: number[]; positions: number[]; rotations: number[] }} - An object containing arrays of times, positions, and rotations for the frame.
 */
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

  const xPosition = node.at(frameIndex, 'Xposition')
  const yPosition = node.at(frameIndex, 'Yposition')
  const zPosition = node.at(frameIndex, 'Zposition')
  position.add(new Vector3(xPosition, yPosition, zPosition))

  const xRotation = node.at(frameIndex, 'Xrotation')
  const yRotation = node.at(frameIndex, 'Yrotation')
  const zRotation = node.at(frameIndex, 'Zrotation')
  rotation.setFromEuler(new Euler(xRotation, yRotation, zRotation, 'XYZ'))

  positions.push(position.x, position.y, position.z)
  rotations.push(rotation.x, rotation.y, rotation.z, rotation.w)

  return { times, positions, rotations }
}

/**
 * Processes a BVH node to generate animation tracks.
 *
 * @param {BVHNode} node - The BVH node to process.
 * @param {number} frameStart - The starting frame index.
 * @param {number} frameEnd - The ending frame index.
 * @param {number} frameTime - The time duration of each frame.
 * @returns {KeyframeTrack[]} - An array of keyframe tracks for the node.
 */
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
