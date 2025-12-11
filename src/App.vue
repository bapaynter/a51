<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGameEngine } from "./composables/useGameEngine";
import { useAudio } from "./composables/useAudio";
import TerminalDisplay from "./components/TerminalDisplay.vue";
import TerminalInput from "./components/TerminalInput.vue";
import { startWitnessLogs } from "./games/stages/stage5";
import alienImage from "./assets/images/aliens.jpg";

const { lines, processCommand, effectsEnabled, state } = useGameEngine();
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

    <div v-if="state.visualMode === 'static'" class="static-overlay"></div>

    <main
      class="terminal-layout"
      :class="{
        glow: effectsEnabled,
        flicker: effectsEnabled,
        'red-alert': state.visualMode === 'red-alert',
      }"
    >
      <div
        v-if="state.visualMode === 'normal' || state.visualMode === 'red-alert'"
        class="content"
      >
        <TerminalDisplay
          :lines="lines"
          :visual-mode="state.visualMode"
          :visual-content="state.visualContent"
        />
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
      <div
        v-else-if="state.visualMode === 'alien'"
        class="fullscreen-art alien"
      >
        <img :src="alienImage" alt="Alien" class="alien-image" />
      </div>
      <div
        v-else-if="state.visualMode === 'victory'"
        class="fullscreen-art victory"
      >
        <pre>{{ state.visualContent }}</pre>
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
  position: relative;
  z-index: 1;
}

.terminal-layout.red-alert {
  animation: red-flash 0.5s infinite alternate;
}

@keyframes red-flash {
  from {
    box-shadow: inset 0 0 50px rgba(255, 0, 0, 0.2);
  }
  to {
    box-shadow: inset 0 0 100px rgba(255, 0, 0, 0.6);
  }
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1; /* Take remaining space */
  min-height: 0; /* Allow shrinking */
  overflow: hidden; /* Prevent outer scroll */
}

.static-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-radial-gradient(#000 0 0.0001%, #fff 0 0.0002%) 50% 0/2500px
      2500px,
    repeating-conic-gradient(#000 0 0.0001%, #fff 0 0.0002%) 60% 60%/2500px
      2500px;
  background-blend-mode: difference;
  animation: b 0.2s infinite alternate;
  z-index: 100;
  opacity: 0.8;
  pointer-events: none;
}

@keyframes b {
  100% {
    background-position: 50% 0, 60% 50%;
  }
}

.fullscreen-art {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-family: monospace;
  white-space: pre;
  text-align: center;
}

.fullscreen-art.alien {
  background: black;
}

.alien-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%) contrast(1.2) brightness(0.8);
}

.fullscreen-art.victory {
  color: #ff3333;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #ff3333;
  animation: fade-in 2s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
