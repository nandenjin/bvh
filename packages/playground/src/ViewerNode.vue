<template>
  <div class="viewer-node">
    <h3 class="id">{{ node.id }}</h3>
    <div>Channels: {{ node.channels?.join(', ') }}</div>
    <div>hasEnd: {{ node.hasEnd }}</div>
    <div>
      offset: {{ node.offsetX }}, {{ node.offsetY }}, {{ node.offsetZ }}
    </div>
    <div v-if="node.hasEnd">
      offsetEnd: {{ node.endOffsetX }}, {{ node.endOffsetY }},
      {{ node.endOffsetZ }}
    </div>
    <div style="margin-left: 10px">
      <ViewerNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BVHNode } from '@nandenjin/bvh-parser/lib'

const { node } = defineProps<{
  node: BVHNode
}>()
</script>

<style scoped>
.viewer-node {
  display: flex;
  flex-direction: column;
  border: 1px solid #888;
  padding: 5px;
  margin: 5px;
  background-color: rgb(0, 127, 255, 0.05);

  & {
    margin-top: 15px;
  }
}

.id {
  font-size: 1em;
  font-weight: bold;
  margin: 0.2em 0;
}
</style>
