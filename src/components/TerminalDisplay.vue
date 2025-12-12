<script setup lang="ts">
import { onUpdated, onBeforeUpdate, ref } from "vue";
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
const shouldAutoScroll = ref(true);

onBeforeUpdate(() => {
  if (container.value) {
    const { scrollTop, scrollHeight, clientHeight } = container.value;
    // Check if we are near the bottom (within 50px)
    shouldAutoScroll.value = scrollHeight - (scrollTop + clientHeight) < 50;
  }
});

onUpdated(() => {
  if (container.value && shouldAutoScroll.value) {
    container.value.scrollTop = container.value.scrollHeight;
  }
});

const scrollPage = (direction: number) => {
  if (!container.value) return;
  const { clientHeight } = container.value;
  // Scroll by 80% of page height
  container.value.scrollBy({ top: direction * clientHeight * 0.8, behavior: 'smooth' });
};

const scrollByPixels = (pixels: number) => {
  if (!container.value) return;
  container.value.scrollTop += pixels;
};

defineExpose({ scrollPage, scrollByPixels });
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
  flex: 1 1 0; /* Grow, shrink, basis 0 - robust flex sizing */
  min-height: 0; /* Crucial for scrolling inside flex */
  overflow-y: auto; /* Allow scrolling */
  padding-bottom: 20px;
  user-select: text; /* Allow text selection */
  
  /* Custom Scrollbar Styling for WebKit */
}

.terminal-display::-webkit-scrollbar {
  width: 12px;
}

.terminal-display::-webkit-scrollbar-track {
  background: #001100;
}

.terminal-display::-webkit-scrollbar-thumb {
  background-color: #33ff00;
  border: 3px solid #001100;
  border-radius: 6px;
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
