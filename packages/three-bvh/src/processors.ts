import { BVH, BVHNode } from '@nandenjin/bvh-parser'
import {
  Euler,
  EulerOrder,
  KeyframeTrack,
  Quaternion,
  QuaternionKeyframeTrack,
  Vector3,
  VectorKeyframeTrack,
} from 'three'

/**
 * Convert degrees to radians.
 */
const degToRad = (deg: number) => (deg * Math.PI) / 180

/**
 * Get the rotation order of a BVH node.
 * @returns EulerOrder for three.js, e.g. `XYZ`
 */
const getRotationOrder = (node: BVHNode): EulerOrder =>
  node.channels
    .filter((c) => c.match(/^[xyz]rotation$/i))
    .map((c) => c[0].toUpperCase())
    .join('') as EulerOrder

/**
 * Returns the end frame of the BVH animation.
 *
 * @param bvh - The BVH object containing the animation data.
 * @param frameEnd - The specified end frame. If -1, the total number of frames in the BVH is returned.
 * @returns - The end frame of the BVH animation.
 */
export const getFrameEnd = (bvh: BVH, frameEnd: number): number => {
  return frameEnd === -1 ? bvh.numFrames : frameEnd
}

type ProcessFrameResult = {
  time: number
  position?: Vector3
  rotation?: Quaternion
}

/**
 * Processes a single frame of the BVH animation.
 *
 * @param node - The BVH node containing the frame data.
 */
export const processFrame = (
  node: BVHNode,
  frameIndex: number,
  frameTime: number,
) => {
  const time = frameIndex * frameTime

  const result: ProcessFrameResult = {
    time,
  }

  const position = new Vector3(node.offsetX, node.offsetY, node.offsetZ)
  const rotation = new Quaternion()

  try {
    const xPosition = node.at(frameIndex, 'Xposition')
    const yPosition = node.at(frameIndex, 'Yposition')
    const zPosition = node.at(frameIndex, 'Zposition')
    position.add(new Vector3(xPosition, yPosition, zPosition))
    result.position = position
  } catch (e) {}

  try {
    const xRotation = node.at(frameIndex, 'Xrotation')
    const yRotation = node.at(frameIndex, 'Yrotation')
    const zRotation = node.at(frameIndex, 'Zrotation')
    rotation.setFromEuler(
      new Euler(
        degToRad(xRotation),
        degToRad(yRotation),
        degToRad(zRotation),
        getRotationOrder(node),
      ),
    )
    result.rotation = rotation
  } catch (e) {}

  return result
}

type ProcessNodeResult = KeyframeTrack[]

/**
 * Processes a BVH node to generate animation tracks.
 *
 * @param node - The BVH node to process.
 * @param frameStart - The starting frame index.
 * @param frameEnd - The ending frame index.
 * @param frameTime - The time duration of each frame.
 * @returns - An array of keyframe tracks for the node.
 */
export const processNode = (
  node: BVHNode,
  frameStart: number,
  frameEnd: number,
  frameTime: number,
): ProcessNodeResult => {
  if (node.hasEnd) return []

  const times: number[] = []
  const positions: number[] = []
  const rotations: number[] = []

  for (let i = frameStart; i < Math.min(node.frames.length, frameEnd); i++) {
    const {
      time: t,
      position: p,
      rotation: r,
    } = processFrame(node, i, frameTime)
    times.push(t)
    if (p) positions.push(p.x, p.y, p.z)
    if (r) rotations.push(r.x, r.y, r.z, r.w)
  }

  const result: ProcessNodeResult = []

  if (positions.length > 0) {
    result.push(
      new VectorKeyframeTrack(node.id + '.position', times, positions),
    )
  }

  if (rotations.length > 0) {
    result.push(
      new QuaternionKeyframeTrack(node.id + '.quaternion', times, rotations),
    )
  }

  return result
}
