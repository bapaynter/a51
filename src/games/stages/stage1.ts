import type { StageConfig } from "../../core/types";

export const stage1: StageConfig = {
  id: 1,
  name: "The Backdoor",
  description: "Find the override code in the source.",
  terminalText:
    "ACCESS DENIED\n\nUNAUTHORIZED ACCESS ATTEMPT DETECTED\n\nThis terminal is for AUTHORIZED PERSONNEL ONLY\n\nTo proceed, you must authenticate.\n\nHint: Security credentials are often embedded where users can't see them--but browsers can.\n\nEnter override code: █",
  commands: {
    "384": (_args, _state) => {
      // This logic will be handled better, but usually commands take arguments.
      // Here '384' is the command if the user types just the code.
      return {
        success: true,
        output: "OVERRIDE ACCEPTED",
        action: "next_stage",
      };
    },
  },
};
