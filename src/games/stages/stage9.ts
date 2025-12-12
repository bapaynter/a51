import type { StageConfig, CommandResult, GameState } from "../../core/types";
import { useAudio } from "../../composables/useAudio";

let countdownId: number | null = null;
let remaining = 180; // 3 minutes

const stopTimer = () => {
  if (countdownId) {
    clearInterval(countdownId);
    countdownId = null;
  }
};

const startCountdown = (state: GameState) => {
  const { play } = useAudio();
  countdownId = window.setInterval(() => {
    // Safety: Stop if stage changed (e.g. via global command)
    if (state.currentStage !== 9) {
      stopTimer();
      return;
    }

    remaining--;

    // Timeout Check
    if (remaining <= 0) {
      stopTimer();
      if (state.addLine) {
        state.addLine("!!! DEAUTHORIZED !!!", "error");
        state.addLine("SYSTEM LOCKDOWN INITIATED...", "error");
      }

      // Transition back to start after a brief delay
      setTimeout(() => {
        // Only reset if we are still in stage 9 (user didn't solve it in the last second)
        if (state.currentStage === 9 && state.changeStage) {
          state.changeStage(1);
        }
      }, 2000);
      return;
    }

    // Periodic Notifications (every 30s)
    if (remaining % 30 === 0) {
      const mins = Math.floor(remaining / 60)
        .toString()
        .padStart(2, "0");
      const secs = (remaining % 60).toString().padStart(2, "0");
      if (state.addLine) {
        play("alarm");
        state.addLine(`[!] TIME REMAINING: 00:${mins}:${secs}`, "info");
      }
    }
  }, 1000);
};

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

    // Start Timer
    stopTimer();
    remaining = 180;
    // Save start time to persist countdown
    if (!state.stageState) state.stageState = {};
    state.stageState.stage9_startTime = Date.now();

    startCountdown(state);
  },

  onResume: (state: GameState) => {
    // Resume timer if not already running
    if (!countdownId) {
      const { loop } = useAudio();
      loop("alarm", true);

      // Calculate remaining time based on saved start time
      if (state.stageState && state.stageState.stage9_startTime) {
        const elapsed = Math.floor(
          (Date.now() - state.stageState.stage9_startTime) / 1000
        );
        remaining = Math.max(0, 180 - elapsed);
      } else {
        remaining = 180; // Fallback
      }

      startCountdown(state);
    }
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
        stopTimer();

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
