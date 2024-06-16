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
import { onMounted, ref, watch } from 'vue'
import { type BVH, parse } from '../../lib'
import ViewerNode from './ViewerNode.vue'
const props = defineProps<{
  content: string
}>()
const bvh = ref<BVH>()

const readContent = (content: string) => {
  bvh.value = parse(content)
  console.info(bvh.value)
}

watch(
  () => props.content,
  (content) => {
    readContent(content)
  },
)

onMounted(() => {
  readContent(props.content)
})
</script>

<style scoped>
.viewer {
  margin: 10px auto;
}
</style>
