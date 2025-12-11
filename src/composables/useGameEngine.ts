import { ref, reactive } from "vue";
import type { GameState, TerminalLine, CommandResult } from "../core/types";
import { getStage } from "../games/stages";
import { initialFileSystem } from "../core/FileSystem";
import { useAudio } from "./useAudio";

export function useGameEngine() {
  const { play } = useAudio();
  const effectsEnabled = ref(true);

  const lines = ref<TerminalLine[]>([
    {
      id: 0,
      type: "system",
      content: "BOOT SEQUENCE INITIATED...",
      typingEffect: true,
    },
    { id: 1, type: "system", content: "LOADING KERNEL...", typingEffect: true },
    {
      id: 2,
      type: "info",
      content: "PRESS ENTER TO START",
      typingEffect: true,
    },
  ]);

  const state = reactive<GameState>({
    currentStage: 1,
    files: initialFileSystem,
    network: { connectedServer: null, nodes: {} },
    unlockedCommands: ["help", "clear", "mute", "effects"],
    history: [],
    inventory: [],
    username: "UNKNOWN",
    isStarted: false,
    visualMode: "normal",
  });

  const addLine = (content: string, type: TerminalLine["type"] = "output") => {
    lines.value.push({
      id: Date.now(),
      type,
      content,
    });
  };

  const processCommand = (input: string) => {
    // Handle Game Start (Press Enter)
    if (!state.isStarted) {
      state.isStarted = true;
      // Clear boot lines for cleaner start? Or keep them?
      // Keeping them adds to history feeling.
      transitionStage(1);
      return;
    }

    const rawInput = input.trim();
    if (!rawInput) return;

    state.history.push(rawInput);
    addLine(`> ${rawInput}`, "input");
    play("keypress");

    const parts = rawInput.split(" ");
    const command = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    // 1. Global Commands
    if (command === "clear") {
      lines.value = [];
      return;
    }
    if (command === "mute") {
      useAudio().toggleMute();
      const isMuted = useAudio().isMuted.value;
      addLine(
        isMuted ? "AUDIO OUTPUT DISABLED." : "AUDIO OUTPUT RESTORED.",
        "info"
      );
      return;
    }
    if (command === "effects") {
      effectsEnabled.value = !effectsEnabled.value;
      addLine(
        effectsEnabled.value
          ? "VISUAL EFFECTS ENABLED."
          : "VISUAL EFFECTS DISABLED.",
        "info"
      );
      return;
    }
    if (command === "help") {
      addLine(
        "Available commands: " +
          [...state.unlockedCommands, "mute", "effects"].join(", "),
        "info"
      );
      return;
    }

    // 2. Stage Commands
    const stage = getStage(state.currentStage);
    if (stage && stage.commands && stage.commands[command]) {
      const result = stage.commands[command](args, state);
      handleResult(result);
      return;
    }

    // 3. Special Case: Stage 1 handled via config now.

    // Default error
    addLine(`ERROR: Unknown command '${command}'`, "error");
    play("error");
  };

  const handleResult = (result: CommandResult) => {
    if (result.output) {
      addLine(result.output, result.success ? "success" : "error");
    }

    if (result.success) {
      play("success");
    } else {
      play("error");
    }

    if (result.action === "next_stage") {
      transitionStage(state.currentStage + 1);
    }
  };

  const transitionStage = (stageId: number) => {
    state.currentStage = stageId;
    const stage = getStage(stageId);
    if (stage) {
      // Clear screen optionally
      if (stage.terminalText) {
        addLine(stage.terminalText, "info");
      }
      if (stage.onEnter) {
        stage.onEnter(state);
      }
    }
  };

  return {
    lines,
    processCommand,
    state,
    effectsEnabled,
  };
}
