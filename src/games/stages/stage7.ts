import type { StageConfig, CommandResult, GameState } from "../../core/types";

export const stage7: StageConfig = {
  id: 7,
  name: "Celestial Navigation",
  description: "Align star map.",
  terminalText: `HANGAR 18 ACCESS GRANTED
  
Initializing navigation system...

   .       +           .        .      +
       .       .        *   .
  .   +    .      .   .      .
     +      .   +        .  +
  .     .      .     ? (ORIGIN UNKNOWN)
      .      +    .       .
  +      .        .    .      +
  
⚠ CRITICAL WARNING:
Stellar Navigation Database CORRUPTED.
Unable to identify transmission origin.

TELEMTRY DATA LOCKED:
Right Ascension: 03h 17m 44s
Declination: -62° 34′ 31″

> SEARCHING DATABASE...
> COORDINATE MATCH FOUND:

> OPENING FILE: PROJECT_BLUE_BOOK
> REF: CASE_4492 (HILL_INCIDENT)
> ARTIFACT: "THE STAR MAP"
> ANALYSIS: FISH INTERPRETATION
>
> SUBJECT ORIGIN MATCH: [REDACTED]

MANUAL TARGETING REQUIRED.
Identify the origin star system to align the craft.

> align <STAR_NAME>`,

  onEnter: (state: GameState) => {
    state.unlockedCommands = ["help", "clear", "search_stars", "align"];
  },

  commands: {
    search_stars: (_args: string[], _state: GameState): CommandResult => {
      return {
        success: false,
        output:
          "ERROR: Internal Catalog Offline.\n\nEXTERNAL REFERENCE REQUIRED.\nConsult standard star charts relative to Earth (Epoch J2000).",
      };
    },

    align: (args: string[], _state: GameState): CommandResult => {
      const star = args.join(" ").toUpperCase();

      if (
        star.includes("ZETA") &&
        (star.includes("RETIC") || star.includes("RETICULI"))
      ) {
        return {
          success: true,
          output:
            "✓ ALIGNMENT CONFIRMED\n\nOrigin: ZETA RETICULI system\nDistance: 39.3 light-years\nClassification: G2V binary\n\n▓▓▓▓▓▓▓▓ SYSTEMS ONLINE ▓▓▓▓▓▓▓▓\n\nThermal monitoring activated.\nStarting anomaly detection...\n\n> monitor_temperatures",
          action: "next_stage",
        };
      }

      return {
        success: false,
        output: `ALIGNMENT FAILED\nCalculated vector for '${star}' does not match locked coordinates (RA 03h 17m | DEC -62° 34').\n\nHint: Verify J2000 coordinates.`,
      };
    },
  },
};
