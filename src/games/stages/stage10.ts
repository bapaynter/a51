import type { StageConfig, CommandResult, GameState } from "../../core/types";

export const stage10: StageConfig = {
  id: 10,
  name: "The Final Decryption",
  description:
    "The terminal displays a hex string: '43 4F 4E 46 49 52 4D 20 5B 50 52 4F 4A 45 43 54 5F 43 4F 44 45 4E 41 4D 45 5D 20 5B 41 43 43 45 53 53 5F 43 4F 44 45 5D 20 5B 53 49 47 4E 41 4C 5F 4F 52 49 47 49 4E 5D' Convert these ASCII hex codes to text to get a command template with placeholders.  Enter the completed command in uppercase.",
  terminalText:
    "INCOMING TRANSMISSION...\n\n43 4F 4E 46 49 52 4D 20 5B 50 52 4F 4A 45 43 54 5F 43 4F 44 45 4E 41 4D 45 5D 20 5B 41 43 43 45 53 53 5F 43 4F 44 45 5D 20 5B 53 49 47 4E 41 4C 5F 4F 52 49 47 49 4E 5D",

  onEnter: (state: GameState) => {
    state.unlockedCommands = ["help", "clear", "confirm"];
  },

  commands: {
    confirm: (args: string[], _state: GameState): CommandResult => {
      const input = args.join(" ").toUpperCase();
      // Expected: CONFIRM [project_name] [access_code] [signal_origin]
      // [project_name] = bluebook
      // [access_code] = 384
      // [signal_origin] = zeta reticuli
      // Full command: CONFIRM BLUEBOOK 384 ZETA RETICULI
      const expected = "BLUEBOOK 384 ZETA RETICULI";

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
