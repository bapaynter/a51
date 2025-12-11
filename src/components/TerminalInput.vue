<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAudio } from '../composables/useAudio';

const props = defineProps({
  history: {
    type: Array as () => string[],
    default: () => []
  }
});

const emit = defineEmits(['submit']);

const input = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const historyIndex = ref(-1);
const { play } = useAudio();

const handleKey = (e: KeyboardEvent) => {
  play('keypress');
  
  if (e.key === 'Enter') {
    emit('submit', input.value);
    input.value = '';
    historyIndex.value = -1; // Reset index
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (props.history.length > 0) {
       if (historyIndex.value < props.history.length - 1) {
          historyIndex.value++;
       }
       // Access history from end (most recent is last in array)
       const index = props.history.length - 1 - historyIndex.value;
       if (props.history[index]) {
          input.value = props.history[index];
       }
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex.value > -1) {
       historyIndex.value--;
       if (historyIndex.value === -1) {
          input.value = '';
       } else {
          const index = props.history.length - 1 - historyIndex.value;
          if (props.history[index]) {
             input.value = props.history[index];
          }
       }
    }
  }
};

onMounted(() => {
  inputRef.value?.focus();
});

// Always keep focus
const focusInput = () => {
  inputRef.value?.focus();
};

defineExpose({ focusInput });

</script>

<template>
  <div class="input-line" @click="focusInput">
    <span class="prompt">&gt;</span>
    <input 
      ref="inputRef"
      v-model="input"
      type="text"
      class="hidden-input"
      @keydown="handleKey"
      autocomplete="off"
      spellcheck="false"
    />
    <span class="input-mirror">{{ input }}<span class="cursor">█</span></span>
  </div>
</template>

<style scoped>
.input-line {
  display: flex;
  align-items: center;
  cursor: text;
}

.prompt {
  margin-right: 8px;
  color: #33ff00;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  top: -1000px;
}

.input-mirror {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
}

.cursor {
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: #33ff00;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
