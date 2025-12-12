import type { StageConfig, CommandResult, GameState } from "../../core/types";
import { useAudio } from "../../composables/useAudio";

export const stage4: StageConfig = {
  id: 4,
  name: "Signal Analysis",
  description: "Analyze the audio signal.",
  terminalText:
    "✓ DECRYPTION SUCCESSFUL\n\nSignal analysis tool loaded.\n\n> analyze_signal transmission.wav",

  onEnter: (state: GameState) => {
    state.unlockedCommands = ["help", "clear", "analyze_signal"];
  },

  commands: {
    analyze_signal: (args: string[], _state: GameState): CommandResult => {
      const file = args[0];
      if (file !== "transmission.wav") {
        return { success: false, output: "ERROR: File not found." };
      }

      const { play } = useAudio();
      play("transmission");

      // We simulate the analysis progress
      return {
        success: true,
        output:
          "ANALYZING TRANSMISSION...\n\n[████████████████████] 100%\n\n[AUDIO FILE PLAYING: transmission.wav]\n\nProject name from 1947 incident\n\nEnter project designation code:",
      };
    },

    // The user needs to enter "BLUEBOOK"
    // Spec: "User Action: ... enter the project name 'BLUEBOOK' (from Project Blue Book)"
    // Spec: "Success Message: PROJECT BLUE BOOK ACCESS GRANTED"

    bluebook: (_args: string[], _state: GameState): CommandResult => {
      return {
        success: true,
        output:
          "PROJECT BLUE BOOK ACCESS GRANTED\nLoading case files...\nCase #47 requires witness verification.\n> query_witness_database",
        action: "next_stage",
      };
    },
    blue: (_args: string[], _state: GameState): CommandResult => {
      if (_args[0] === "book") {
        return {
          success: true,
          output:
            "PROJECT BLUE BOOK ACCESS GRANTED\nLoading case files...\nCase #47 requires witness verification.\n> query_witness_database",
          action: "next_stage",
        };
      }
      return {
        success: false,
        output: "Access denied. Project name incorrect.",
      };
    },
  },
};
