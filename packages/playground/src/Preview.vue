<template>
  <div ref="rendererContainerRef" class="preview-root"></div>
</template>

<script setup lang="ts">
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Group,
  SkeletonHelper,
  Box3,
  Vector3,
} from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useElementSize } from '@vueuse/core'
import { BVH } from '@nandenjin/bvh-parser'
import { createBones } from '@nandenjin/three-bvh/src'

const props = defineProps<{
  bvh?: BVH
}>()
const boneGroup = new Group()

const updateBones = () => {
  const parent = boneGroup
  parent.remove(...parent.children)

  console.log(props.bvh)

  if (!props.bvh) return

  const bone = createBones(props.bvh)
  const skeleton = new SkeletonHelper(bone)
  parent.add(bone)
  parent.add(skeleton)
}

watch(props, updateBones)
updateBones()

const isActive = ref(false)
const rendererContainerRef = ref<HTMLDivElement | null>(null)
const renderer = new WebGLRenderer({ antialias: true })

const scene = new Scene()
scene.add(boneGroup)

const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.set(100, 100, 100)
camera.lookAt(0, 0, 0)

const control = new OrbitControls(camera, renderer.domElement)

const renderTick = () => {
  if (!isActive.value) return
  requestAnimationFrame(renderTick)
  control.update()
  renderer.render(scene, camera)
}

const { width, height } = useElementSize(rendererContainerRef)
watch([width, height], () => {
  if (!width.value || !height.value) return
  renderer.setSize(width.value, height.value)
  camera.aspect = width.value / height.value
  camera.updateProjectionMatrix()
})

onMounted(() => {
  if (!rendererContainerRef.value) return
  rendererContainerRef.value.appendChild(renderer.domElement)

  isActive.value = true
  renderTick()
})

onUnmounted(() => {
  isActive.value = false
})
</script>

<style scoped>
.preview-root {
  width: 100%;
  height: 100%;
  max-height: 100dvh;
}
</style>
