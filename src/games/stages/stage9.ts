import type { StageConfig, CommandResult, GameState } from "../../core/types";
import { useAudio } from "../../composables/useAudio";

// let countdownId: number | null = null;
// let remaining = 180; // 3 minutes

export const stage9: StageConfig = {
  id: 9,
  name: "Real-Time Clock",
  description: "Abort the countdown.",
  terminalText:
    "[!] SECURITY COUNTDOWN ACTIVE [!]\n\nTime remaining: 00:03:00\n\nCurrent UTC time displayed below.\nHex code required to abort.\n\nHANGAR_18>",

  onEnter: (state: GameState) => {
    state.unlockedCommands = ["help", "clear", "time", "abort"];
    const { play, loop } = useAudio();
    play("alarm");
    loop("alarm", true); // Loop alarm
  },

  commands: {
    time: (_args: string[], _state: GameState): CommandResult => {
      const now = new Date();
      const timeStr =
        (now.toISOString().split("T")[1] || "").split(".")[0] + " UTC";
      return {
        success: true,
        output: `Current UTC: ${timeStr}`,
      };
    },

    abort: (args: string[], _state: GameState): CommandResult => {
      const code = (args[0] || "").toLowerCase(); // e.g., '596'

      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const decimal = hours * 100 + minutes; // "Military time" as integer
      const expectedHex = decimal.toString(16).toLowerCase();

      // Allow slight margin of error (previous minute too)
      let prevDecimal = decimal - 1;
      if (minutes === 0) {
        // Wrap around hour logic omitted for simplicity unless needed, assume user is fast.
      }
      const prevHex = prevDecimal.toString(16).toLowerCase();

      if (code === expectedHex || code === prevHex) {
        const { loop } = useAudio();
        loop("alarm", false); // Stop alarm

        return {
          success: true,
          output:
            "[OK] TIME CODE ACCEPTED\n\nCOUNTDOWN ABORTED\n\nTime remaining: 00:00:01\n\n▓▓▓▓▓▓▓▓ TIME SYNCHRONIZED ▓▓▓▓▓▓▓▓\n\nSecurity protocol deactivated.\n\nFINAL SECURITY LAYER: PATTERN RECOGNITION\n\nLoading constellation grid...",
          action: "next_stage",
        };
      }

      return {
        success: false,
        output: `[X] INVALID TIME CODE\n\nCode '${code}' does not match current timestamp.\nRecalculate and try again.`,
      };
    },
  },
};
