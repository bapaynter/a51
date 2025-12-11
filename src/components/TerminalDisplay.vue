<script setup lang="ts">
import { onUpdated, ref } from "vue";
import type { PropType } from "vue";
import type { TerminalLine } from "../core/types";

const props = defineProps({
  lines: {
    type: Array as PropType<TerminalLine[]>,
    required: true,
  },
  visualMode: {
    type: String,
    default: "normal",
  },
  visualContent: {
    type: String,
    default: "",
  },
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

.input {
  color: #fff;
}
.error {
  color: #ff3333;
}
.success {
  color: #33ff00;
}
.info {
  color: #33ccff;
}
.system {
  color: #ffff00;
}

.red-alert-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 10;
}

.alert-text {
  color: red;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 10px red;
  animation: blink 0.5s infinite alternate;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border: 2px solid red;
}

@keyframes blink {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.3;
  }
}
</style>
