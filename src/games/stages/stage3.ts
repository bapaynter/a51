import type { StageConfig, CommandResult, GameState } from '../../core/types';

export const stage3: StageConfig = {
  id: 3,
  name: "The Cipher",
  description: "Decrypt the files in Archives.",
  terminalText: "✓ CONNECTED TO ARCHIVES\n\n▓▓▓▓▓▓▓▓ ACCESSING FILE SYSTEM ▓▓▓▓▓▓▓▓\n\nFiles found:\n• project_bluebook_init.txt [READABLE]\n• frequency_logs.enc [ENCRYPTED]\n\nARCHIVES>",
  
  onEnter: (state: GameState) => {
    state.unlockedCommands = ['help', 'clear', 'view', 'decrypt', 'list_files', 'disconnect'];
  },

  commands: {
    'list_files': (_args: string[], _state: GameState): CommandResult => {
      return {
        success: true,
        output: "Files in ARCHIVES:\n• project_bluebook_init.txt [READABLE]\n• frequency_logs.enc [ENCRYPTED]"
      };
    },

    'view': (args: string[], _state: GameState): CommandResult => {
      const file = args[0];
      if (file === 'project_bluebook_init.txt') {
        return {
          success: true,
          output: "╔═══════════════════════════════════════════════════════════════╗\n║ FILE: project_bluebook_init.txt                               ║\n║ CLASSIFICATION: TOP SECRET                                    ║\n║ STATUS: DECLASSIFIED/READABLE                                 ║\n╚═══════════════════════════════════════════════════════════════╝\n\nHeader: STANDARD ENCRYPTION PROTOCOL 1947\n\nMemo: The access key for the signal logs has been encoded below using standard field cypher 13.\n\nGur npprff xrl vf: GEHGU_VF_BHG_GURER"
        };
      }
      if (file === 'frequency_logs.enc') {
        return { success: false, output: "WARNING: File is encrypted. Use 'decrypt <filename> <key>'" };
      }
      return { success: false, output: `File '${file}' not found.` };
    },

    'decrypt': (args: string[], _state: GameState): CommandResult => {
      const file = args[0];
      const key = (args[1] || '').toUpperCase();
      
      if (file === 'frequency_logs.enc') {
         if (key === 'TRUTH_IS_OUT_THERE') {
            return {
               success: true,
               output: "✓ DECRYPTION SUCCESSFUL\n\nDecrypted text: 'The key is in the frequency. Check signal logs.'\n\nSignal analysis tool loaded.\n\n> analyze_signal transmission.wav",
               action: 'next_stage'
            };
         } else {
            return { success: false, output: "ERROR: Invalid decryption key." };
         }
      }
      if (file === 'project_bluebook_init.txt') {
         return { success: false, output: "File is already readable." };
      }
      return { success: false, output: "ERROR: File not found or not encrypted." };
    }
  }
};
