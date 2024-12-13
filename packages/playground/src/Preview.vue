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
  AnimationMixer,
  Clock,
  GridHelper,
} from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useElementSize } from '@vueuse/core'
import { BVH } from '@nandenjin/bvh-parser'
import { createBones, createClip } from '@nandenjin/three-bvh'

const props = defineProps<{
  bvh?: BVH
}>()

/** Flag to detect if the component is active and should be rendered */
const isActive = ref(false)

const rendererContainerRef = ref<HTMLDivElement | null>(null)
const renderer = new WebGLRenderer({ antialias: true })

const clock = new Clock()

const scene = new Scene()

/** Group for bones. It will be cleared each time new data is beging loaded */
const boneGroup = new Group()
scene.add(boneGroup)

/** Animation mixer for current bone */
let mixer: AnimationMixer | null = null

const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.set(100, 100, 100)

/** Camera controls */
const control = new OrbitControls(camera, renderer.domElement)
control.target.set(0, 75, 0)

scene.add(new GridHelper(1000, 10))

/**
 * Handle loading BVH data
 */
const loadData = () => {
  const parent = boneGroup
  parent.remove(...parent.children)

  if (!props.bvh) return

  /** Bone from BVH file */
  const bone = createBones(props.bvh)

  const skeleton = new SkeletonHelper(bone)
  parent.add(bone)
  parent.add(skeleton)

  mixer = new AnimationMixer(bone)

  /** Animation clip from BVH file */
  const clip = createClip(props.bvh)

  // Play animation
  mixer.clipAction(clip).play()
}
watch(props, loadData)
loadData()

const renderTick = () => {
  if (!isActive.value) return
  requestAnimationFrame(renderTick)

  /** Time from previous frame */
  const dt = clock.getDelta()

  // Update control
  control.update(dt)

  // Update animation
  mixer?.update(dt)

  renderer.render(scene, camera)
}

const { width, height } = useElementSize(rendererContainerRef)

// Handle resizing of the container
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

  // Start renderer loop
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
