<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGameEngine } from "./composables/useGameEngine";
import { useAudio } from "./composables/useAudio";
import TerminalDisplay from "./components/TerminalDisplay.vue";
import TerminalInput from "./components/TerminalInput.vue";
import { startWitnessLogs } from "./games/stages/stage5";

const { lines, processCommand, effectsEnabled } = useGameEngine();
const terminalInput = ref<InstanceType<typeof TerminalInput> | null>(null);
const { initAudio, loop } = useAudio();

const handleGlobalClick = () => {
  terminalInput.value?.focusInput();
  initAudio(); // Ensure audio is ready on interaction
  loop("hum", true); // Start ambient hum
};

onMounted(() => {
  startWitnessLogs();
  initAudio(); // Preload sounds
});
</script>

<template>
  <div class="crt-container" @click="handleGlobalClick">
    <div v-if="effectsEnabled" class="scanlines"></div>
    <div v-if="effectsEnabled" class="vignette"></div>
    <div v-if="effectsEnabled" class="flicker"></div>

    <main
      class="terminal-layout"
      :class="{
        glow: effectsEnabled,
        flicker: effectsEnabled,
      }"
    >
      <div class="content">
        <TerminalDisplay :lines="lines" />
        <TerminalInput
          ref="terminalInput"
          :history="
            lines
              .map((l) =>
                l.content.startsWith('> ') ? l.content.substring(2) : ''
              )
              .filter(Boolean)
          "
          @submit="processCommand"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.terminal-layout {
  padding: 2rem;
  height: 100vh; /* Force full viewport height */
  box-sizing: border-box;
  overflow: hidden;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex; /* Flex container */
  flex-direction: column;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1; /* Take remaining space */
  min-height: 0; /* Allow shrinking */
  overflow: hidden; /* Prevent outer scroll */
}
</style>
