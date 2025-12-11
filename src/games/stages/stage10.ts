import type { StageConfig, CommandResult, GameState } from '../../core/types';
import { useAudio } from '../../composables/useAudio';

export const stage10: StageConfig = {
  id: 10,
  name: "Pattern Recognition",
  description: "Connect the final dots.",
  terminalText: "FINAL SECURITY LAYER\n\nPATTERN RECOGNITION SYSTEM\n\nInitializing grid...\n\nHANGAR_18>",
  
  onEnter: (state: GameState) => {
    state.unlockedCommands = ['help', 'clear', 'show_grid', 'connect'];
  },

  commands: {
    'show_grid': (_args: string[], _state: GameState): CommandResult => {
      return {
        success: true,
        output: "╔═══════════════════════════════════════════════════════════════╗\n║              PATTERN RECOGNITION GRID                         ║\n║                                                               ║\n║         1   2   3   4   5   6   7   8   9                     ║\n║       ┌───────────────────────────────────┐                   ║\n║     1 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     2 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     3 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     4 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     5 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     6 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     7 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     8 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║     9 │ ·   ·   ·   ·   ·   ·   ·   ·   · │                   ║\n║       └───────────────────────────────────┘                   ║\n║                                                               ║\n║  Previous clues contain the pattern.                          ║\n║  Format: x,y x,y x,y ... (space-separated coordinates)        ║\n╚═══════════════════════════════════════════════════════════════╝"
      };
    },
    
    'connect': (args: string[], _state: GameState): CommandResult => {
       const input = args.join(' ');
       if (input.includes('1,4') && input.includes('2,5') && input.includes('3,6')) {
          const { play } = useAudio();
          play('static'); 
          
          return {
             success: true,
             output: "✓ PATTERN MATCH CONFIRMED\n\nSecurity template: MATCHED ✓\nHistorical data: VERIFIED ✓\nAccess level: DIRECTOR ✓\n\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n\nWELCOME, DIRECTOR\n\nFULL SYSTEM ACCESS GRANTED\n\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n\n[Initiating final sequence...]",
             action: 'next_stage'
          };
       }
       
       return { success: false, output: "[X] PATTERN MISMATCH\n\nSequence does not match security template.\nReview previous puzzle clues:\n• Morse code pattern\n• Celestial coordinates" };
    }
  }
};

import { endingSequenceText } from './ending';

export const endingStage: StageConfig = {
  id: 11,
  name: "Ending",
  description: "The end.",
  terminalText: endingSequenceText,
  onEnter: (_state: GameState) => {
     // No inputs.
  },
  commands: {},
};
