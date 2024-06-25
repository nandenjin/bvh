import type { BVH, BVHNode } from '@nandenjin/bvh-parser'
import { Bone } from 'three'

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
