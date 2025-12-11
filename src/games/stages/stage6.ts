import type { StageConfig, CommandResult, GameState } from '../../core/types';

export const stage6: StageConfig = {
  id: 6,
  name: "Database Query",
  description: "Query the Hangar database.",
  terminalText: "HANGAR DATABASE QUERY INTERFACE\n\nType 'select' for SQL command format\nType 'show_tables' to list available tables\n\nHANGAR_DB>",
  
  onEnter: (state: GameState) => {
    state.unlockedCommands = ['help', 'clear', 'show_tables', 'show_columns', 'select', 'access_hangar'];
  },

  commands: {
    'show_tables': (_args: string[], _state: GameState): CommandResult => {
      return {
        success: true,
        output: "AVAILABLE COMMANDS:\n\n• show_tables: List all database tables\n• show_columns <table_name>: View table schema\n• select ... : Execute standard SQL queries\n• access_hangar <id> <code>: Request entry\n\nDATABASE TABLES:\n├─ black_hangars [CLASSIFIED]\n├─ public_hangars [STANDARD]\n└─ classified_zones [RESTRICTED]"
      };
    },
    
    'show_columns': (args: string[], _state: GameState): CommandResult => {
      const table = args[0];
      if (table === 'black_hangars') {
         return {
           success: true,
           output: "TABLE: black_hangars\nCOLUMNS:\n├─ hangar_number (INTEGER)\n├─ access_code (VARCHAR)\n├─ status (VARCHAR)\n└─ classification_level (INTEGER)\n\nRows: 23 [CLASSIFIED]"
         };
      }
      if (table === 'public_hangars') {
         return {
           success: true,
           output: "TABLE: public_hangars\nCOLUMNS:\n├─ id (INTEGER)\n├─ location (VARCHAR)\n└─ maintenance_log (TEXT)\n\nRows: 154"
         };
      }
      if (table === 'classified_zones') {
         return {
           success: true,
           output: "TABLE: classified_zones\nCOLUMNS:\n├─ zone_id (VARCHAR)\n├─ security_clearance (INTEGER)\n└─ sector_commander (VARCHAR)\n\nRows: [REDACTED]"
         };
      }
      return { success: false, output: `Table '${table}' not found.` };
    },

    'select': (args: string[], _state: GameState): CommandResult => {
       const query = args.join(' ').toLowerCase();
       
       // Handle public_hangars (dummy data)
       if (query.includes('public_hangars')) {
          return {
             success: true,
             output: "RESULTS:\n┌─────┬───────────────┬────────────────────────────┐\n│ ID  │ LOCATION      │ MAINTENANCE_LOG            │\n├─────┼───────────────┼────────────────────────────┤\n│ 16  │ NORTH_WING    │ Routine check OK           │\n│ 17  │ SUPPLY        │ Inventory pending          │\n│ 18  │ [REDACTED]    │ MOVED TO BLACK OPS MANIFEST│\n│ 19  │ EAST_WING     │ Repair scheduled           │\n└─────┴───────────────┴────────────────────────────┘\nReturned 4 of 154 rows."
          };
       }
       
       // Handle classified_zones (dummy data)
       if (query.includes('classified_zones')) {
          return {
             success: false,
             output: "ERROR: INSUFFICIENT PERMISSIONS\nSecurity Clearance Level 9 required for table: classified_zones"
          };
       }

       // Handle correct query logic: Allow looser syntax logic.
       // Requires "select", "black_hangars", and "hangar_number=18".
       // Does NOT enforce "access_code" column specifically, effectively allowing "SELECT *" behavior.
       if (query.includes('black_hangars') && query.includes('hangar_number=18')) {
          return {
            success: true,
            output: "QUERY EXECUTED SUCCESSFULLY\n\nRESULTS:\n┌──────────────────────┐\n│ ACCESS_CODE          │\n├──────────────────────┤\n│ TIC-TAC-2017         │\n└──────────────────────┘\n\n1 row returned"
          };
       }
       
       // Handle general black_hangars query without where clause (too much data)
       if (query.includes('black_hangars')) {
          return { success: false, output: "QUERY REJECTED: Result set too large for standard terminal.\nPlease specify criteria (e.g., WHERE hangar_number=...)\nHint: Check public_hangars for missing assets." };
       }
       
       return { success: false, output: "INVALID QUERY or NO RESULTS.\nExamples of valid SQL:\n  SELECT * FROM public_hangars\n  SELECT access_code FROM black_hangars WHERE hangar_number=10" };
    },
    
    'access_hangar': (args: string[], _state: GameState): CommandResult => {
       const [num, code] = args;
       if (num === '18' && code === 'TIC-TAC-2017') {
          return {
             success: true,
             output: "ACCESSING HANGAR 18...\n\n[████████████████████] 100%\n\n✓ ACCESS CODE VERIFIED\n\n⚠ WARNING: Celestial alignment required for entry\nNavigation system must be calibrated\n\n> search_stars RA=7:4", 
             action: 'next_stage'
          };
       }
       return { success: false, output: "ACCESS DENIED\nInvalid hangar or access code. \n Usage: access_hangar <number> <code>" };
    }
  }
};
