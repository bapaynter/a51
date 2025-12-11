import type { StageConfig, CommandResult, GameState } from '../../core/types';

let intervalId: number | null = null;
let noiseIntervalId: number | null = null;

const SYSTEM_NOISE = [
    "[SYS] MONITORING: KERNEL_TASK_482",
    "[SYS] MONITORING: NETWORK_IO_STREAM",
    "[SYS] MEMORY: GC_ALLOCATE 0x84f29",
    "[SYS] DISK: READ_BLOCK_22",
    "[NET] PACKET: 192.168.0.1 -> PROXY",
    "[SEC] AUTH_CHECK: VALIDATED",
    "[SEC] SCAN: PORT 22 OPEN",
    "[SYS] PROCESS: BACKGROUND_WORKER_01",
    "[err] TIMEOUT: CONNECTION_RESET",
    "[wrn] CPU: USAGE_SPIKE 12%"
];

export const startWitnessLogs = () => {
    if (intervalId) clearInterval(intervalId);
    if (noiseIntervalId) clearInterval(noiseIntervalId);
    
    // High frequency noise generator (every 100ms)
    noiseIntervalId = window.setInterval(() => {
        const noise = SYSTEM_NOISE[Math.floor(Math.random() * SYSTEM_NOISE.length)];
        const timePart = new Date().toISOString().split('T')[1];
        const timestamp = (timePart || '').replace('Z', '');
        console.log(`%c${timestamp} ${noise}`, 'color: #555; font-family: monospace;');
    }, 250) as unknown as number;

    // The Signal (every 5 seconds, buried in the noise)
    intervalId = window.setInterval(() => {
       const timePart = new Date().toISOString().split('T')[1];
       const timestamp = (timePart || '').replace('Z', '');
       console.log(`%c${timestamp} [SEC] WITNESS_ID: BENNEWITZ [CLASS_7_ONLY]`, 'color: #555; font-family: monospace;');
       
       // Add immediate noise after to bury it if they aren't paying attention
       setTimeout(() => {
           console.log(`%c${timestamp} [SYS] FLUSHING BUFFERS...`, 'color: #555; font-family: monospace;');
       }, 50);
    }, 5000) as unknown as number;
};

export const stage5: StageConfig = {
  id: 5,
  name: "The Console Witness",
  description: "Find the witness name in the browser console.",
  terminalText: "WITNESS DATABASE ONLINE\n\nCase #47-R: Roswell Incident\nRequires witness verification for access.\n\n⚠ Hint: Check system monitoring logs\n\nSystem is outputting high-volume telemetry.\nSignal-to-noise ratio is low.\n\nEnter command: verify_witness <name>",
  
  onEnter: (state: GameState) => {
    state.unlockedCommands = ['help', 'clear', 'verify_witness', 'check_logs'];
    // Logs start globally in App.vue calling startWitnessLogs()
  },

  commands: {
    'verify_witness': (args: string[], _state: GameState): CommandResult => {
       const name = (args[0] || '').toUpperCase();
       
       if (name === 'BENNEWITZ') {
         if (intervalId) clearInterval(intervalId);
         if (noiseIntervalId) clearInterval(noiseIntervalId);
         
         return {
           success: true,
           output: "✓ WITNESS VERIFIED: BENNEWITZ\n\nSecurity Clearance: 7 ✓\nCase #47-R Access: GRANTED\n\n▓▓▓▓▓▓▓▓ ACCESSING HANGAR DATABASE ▓▓▓▓▓▓▓▓\n\nHangar query interface loaded.\n\n> query_hangars",
           action: 'next_stage'
         };
       }
       
       return { success: false, output: `ACCESS DENIED\n\nWitness '${name}' not found in Case #47-R records\nor insufficient security clearance.` };
    },
    
    'check_logs': (_args: string[], _state: GameState): CommandResult => {
       return { success: false, output: "ERROR: Terminal logs restricted.\nUse native system monitoring (DevTools Console)." };
    }
  }
};
