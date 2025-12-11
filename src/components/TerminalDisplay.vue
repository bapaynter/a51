<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import type { PropType } from 'vue';
import type { TerminalLine } from '../core/types';

const props = defineProps({
  lines: {
    type: Array as PropType<TerminalLine[]>,
    required: true
  }
});

const container = ref<HTMLElement | null>(null);

onUpdated(() => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight;
  }
});

</script>

<template>
  <div class="terminal-display" ref="container">
    <div v-for="line in lines" :key="line.id" :class="['line', line.type]">
      <span v-if="line.type === 'input'" class="prompt">&gt; </span>
      <span class="content white-space-pre">{{ line.content }}</span>
    </div>
  </div>
</template>

<style scoped>
.terminal-display {
  flex: 1;
  min-height: 0; /* Crucial for scrolling inside flex */
  overflow-y: hidden; /* Prevent manual scrolling back up */
  padding-bottom: 20px;
}

.line {
  margin-bottom: 4px;
  word-wrap: break-word;
}

.white-space-pre {
  white-space: pre-wrap;
}

.input { color: #fff; }
.error { color: #ff3333; }
.success { color: #33ff00; }
.info { color: #33ccff; }
.system { color: #ffff00; }
</style>
