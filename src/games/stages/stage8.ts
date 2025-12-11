import type { StageConfig, CommandResult, GameState } from '../../core/types';

export const stage8: StageConfig = {
  id: 8,
  name: "Temperature Anomaly",
  description: "Identify the pattern in thermal logs.",
  terminalText: "THERMAL MONITORING ACTIVE\n\nReal-time temperature stream:\n\nHANGAR_18>",
  
  onEnter: (state: GameState) => {
    state.unlockedCommands = ['help', 'clear', 'monitor_temperatures', 'analyze_pattern', 'predict'];
  },

  commands: {
    'monitor_temperatures': (_args: string[], _state: GameState): CommandResult => {
      return {
        success: true,
        output: "INITIATING THERMAL SCAN...\n\nTEMPERATURE STREAM [Live]:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n00:00.000 │ 98.6°F  ████████████████████░░░░░\n00:00.047 │ 98.6°F  ████████████████████░░░░░\n00:00.094 │ 62.8°F  ████░░░░░░░░░░░░░░░░░░░░░ ⚠ ANOMALY +47\n00:00.188 │ 98.6°F  ████████████████████░░░░░\n00:00.235 │ 62.8°F  ████░░░░░░░░░░░░░░░░░░░░░ ⚠ ANOMALY +94\n00:00.282 │ 62.8°F  ████░░░░░░░░░░░░░░░░░░░░░\n00:00.423 │ 98.6°F  ████████████████████░░░░░\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠ PATTERN DETECTED IN ANOMALY INTERVALS\n\nUse command: analyze_pattern"
      };
    },

    'analyze_pattern': (_args: string[], _state: GameState): CommandResult => {
      // Sequence: 47, 47, 94, 141, 235...
      return {
        success: true,
        output: "ANALYZING TEMPERATURE SPIKE INTERVALS...\n\nDELTA LOGS (ms):\n1. 47\n2. 47\n3. 94\n4. 141\n5. 235\n\nNEXT PREDICTED DELTA?\n\nCalculate next outlier interval.\nCommand: predict <value>"
      };
    },

    'predict': (args: string[], _state: GameState): CommandResult => {
       const val = args[0];
       // Next = 141 + 235 = 376
       if (val === '376') {
         return {
           success: true,
           output: "✓ PATTERN CONFIRMED\n\nNext interval: 376 ms ✓\n\n⚠⚠⚠ ALERT ⚠⚠⚠\n\nBIOLOGICAL ENTITY DETECTED\nNon-human thermal signature identified\n\nSECURITY PROTOCOL: COUNTDOWN INITIATED",
           action: 'next_stage'
         };
       }
       return { success: false, output: "INCORRECT PREDICTION\nReview the addition sequence in the deltas." };
    }
  }
};
