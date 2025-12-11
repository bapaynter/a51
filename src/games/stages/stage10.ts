import type { StageConfig, CommandResult, GameState } from "../../core/types";

export const stage10: StageConfig = {
  id: 10,
  name: "The Final Decryption",
  description:
    "The terminal displays a hex string: '43 4F 4E 46 49 52 4D 20 5B 73 74 61 67 65 34 5D 20 5B 73 74 61 67 65 37 5D 20 5B 73 74 61 67 65 31 5D 20 5B 73 74 61 67 65 38 5D' Convert these ASCII hex codes to text to get a command template with placeholders. Replace [stage4] with the stage 4 answer, [stage7] with the stage 7 answer, [stage1] with the stage 1 answer, and [stage8] with the stage 8 answer. Enter the completed command in uppercase.",
  terminalText:
    "INCOMING TRANSMISSION...\n\n43 4F 4E 46 49 52 4D 20 5B 73 74 61 67 65 34 5D 20 5B 73 74 61 67 65 37 5D 20 5B 73 74 61 67 65 31 5D 20 5B 73 74 61 67 65 38 5D",

  onEnter: (state: GameState) => {
    state.unlockedCommands = ["help", "clear", "confirm"];
  },

  commands: {
    confirm: (args: string[], _state: GameState): CommandResult => {
      const input = args.join(" ").toUpperCase();
      // Expected: CONFIRM [stage4] [stage7] [stage1] [stage8]
      // [stage4] = BLUEBOOK
      // [stage7] = ZETA RETICULI
      // [stage1] = 384
      // [stage8] = 376
      // Full command: CONFIRM BLUEBOOK ZETA RETICULI 384 376
      // Since 'confirm' is the command, the args are the rest.
      const expected = "BLUEBOOK ZETA RETICULI 384 376";

      if (input === expected) {
        return {
          success: true,
          output: "FINAL OVERRIDE ACCEPTED. ACTIVATING ALL SYSTEMS...",
          action: "next_stage",
        };
      }
      return {
        success: false,
        output: "ERROR: DECRYPTION FAILED. INVALID SEQUENCE.",
      };
    },
  },
};
