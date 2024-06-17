<template>
  <div
    class="app-root"
    @dragenter="isDragging = true"
    @dragleave="isDragging = false"
    @dragover.prevent
    @drop.prevent="(isDragging = false), handleDrop($event.dataTransfer?.files)"
  >
    <div class="content">
      <h1>@nandenjin/bvh: Playground</h1>
      <div>
        <a href="https://nandenjin.github.io/bvh/">📖 Documents</a> |
        <a href="https://github.com/nandenjin/bvh">🐙 GitHub</a>
      </div>
      <div>👋 Drag & drop to try with your file</div>

      <Viewer v-if="content && !isDragging" :content="content" />
      <div class="drop-target" :class="{ 'is-dragging': isDragging }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Viewer from './Viewer.vue'

import EXAMPLE_BVH_A from '@nandenjin/bvh-parser/test/fixtures/A_test.bvh?raw'

const isDragging = ref(false)
const content = ref<string>(EXAMPLE_BVH_A)

const handleDrop = (files: FileList) => {
  if (!files) return
  if (files.length === 0) return

  const reader = new FileReader()
  reader.addEventListener('load', () => {
    content.value = reader.result as string
  })
  reader.readAsText(files[0])
}
</script>

<style scoped>
.app-root {
  width: 100%;
  height: 100%;
  margin: 0;
}
.drop-target {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  &.is-dragging {
    background-color: rgb(0, 127, 255, 0.5);
  }
}

.content {
  margin: 10px;
}
</style>
