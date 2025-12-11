import { ref } from "vue";

// Map of sound names to filenames
const SOUNDS = {
  keypress: "terminal-keypress.wav",
  static: "static-noise.wav",
  hum: "ambient-hum.wav",
  success: "success-beep.wav",
  error: "error-buzz.wav",
  alarm: "alarm-countdown.wav",
  transmission: "transmission.wav",
} as const;

type SoundName = keyof typeof SOUNDS;

const audioCache = new Map<SoundName, HTMLAudioElement>();
const isMuted = ref(false);
let isInitialized = false;

export function useAudio() {
  // Preload all sounds
  const initAudio = () => {
    if (isInitialized) return;
    
    Object.entries(SOUNDS).forEach(([key, filename]) => {
      const audio = new Audio(`/src/assets/sounds/${filename}`);
      audioCache.set(key as SoundName, audio);

      // Configure specific sounds
      if (key === "hum") {
        audio.loop = true;
        audio.volume = 0.2;
      } else if (key === "static") {
        audio.volume = 0.5;
      } else if (key === "keypress") {
        audio.volume = 0.2;
      }
    });
    
    isInitialized = true;
  };

  const play = (name: SoundName) => {
    if (isMuted.value) return;

    if (!isInitialized) {
        console.warn("Audio not initialized. Attempting lazy init.");
        initAudio();
    }

    const audio = audioCache.get(name);
    if (audio) {
      if (audio.paused) {
        audio.play().catch((e) => console.warn("Audio play failed:", e));
      } else {
        // For sounds like keypress, we want overlapping or restart
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = audio.volume;
        clone.play().catch(() => {});
      }
    }
  };

  const loop = (name: SoundName, state: boolean) => {
    const audio = audioCache.get(name);
    if (!audio) return;

    if (state) {
      if (isMuted.value) {
        // If muted, we still "play" but volume 0? Or just wait to unmute.
        // For now, simpler handling:
        audio.play().catch(() => {});
      } else {
        audio.play().catch(() => {});
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const stop = (name: SoundName) => {
    const audio = audioCache.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    audioCache.forEach((audio) => {
      audio.muted = isMuted.value;
    });
  };

  return {
    initAudio,
    play,
    loop,
    stop,
    toggleMute,
    isMuted,
  };
}
