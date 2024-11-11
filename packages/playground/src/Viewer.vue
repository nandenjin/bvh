<template>
  <div class="viewer">
    <div v-if="bvh">
      <div>frameTime: {{ bvh.frameTime }}</div>
      <div>numFrames: {{ bvh.numFrames }}</div>
      <ViewerNode :node="bvh.root" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type BVH } from '@nandenjin/bvh-parser'
import ViewerNode from './ViewerNode.vue'
const { bvh } = defineProps<{
  bvh?: BVH
}>()
</script>

<style scoped>
.viewer {
  margin: 10px auto;
}
</style>
