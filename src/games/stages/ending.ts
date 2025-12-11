import type { StageConfig, GameState } from "../../core/types";

const victoryText = `
ACCESS GRANTED

CONTAINMENT PROTOCOLS DISABLED

TERMINAL LOG: You have successfully bypassed all security measures.

Unfortunately, your actions have deactivated the extraterrestrial holding cells.

The entities have been released.

Project Blue Book Status: COMPROMISED

Estimated time until global contact: 47 minutes

Thank you for your service.

[END TRANSMISSION]
`;

export const endingStage: StageConfig = {
  id: 11,
  name: "Ending",
  description: "The end.",
  commands: {},
  onEnter: (state: GameState) => {
    // 1. "CONTAINMENT BREACH DETECTED" in flashing red text.
    state.visualMode = "red-alert";
    state.visualContent = "CONTAINMENT BREACH DETECTED";

    // 2. Terminal fills with ASCII static (random characters flashing).
    setTimeout(() => {
      state.visualMode = "static";
      state.visualContent = "";
    }, 3000);

    // 3. Static clears to show ASCII art of a Grey alien face.
    setTimeout(() => {
      state.visualMode = "alien";
      state.visualContent = "";
    }, 6000);

    // 4. Terminal returns to static for 3 seconds.
    setTimeout(() => {
      state.visualMode = "static";
      state.visualContent = "";
    }, 9000);

    // 5. Static fades to reveal victory screen with apocalyptic message.
    setTimeout(() => {
      state.visualMode = "victory";
      state.visualContent = victoryText;
    }, 12000);
  },
};
