export interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'info';
  content: string;
  typingEffect?: boolean;
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string; // For files
  children?: FileSystemNode[]; // For directories
  encrypted?: boolean;
  locked?: boolean;
}

export interface GameState {
  currentStage: number;
  files: FileSystemNode[];
  network: NetworkState;
  unlockedCommands: string[];
  history: string[]; // Command history
  inventory: string[]; // Collected items/knowledge
  username: string; // 'UNKNOWN' -> 'DIRECTOR'
  isStarted?: boolean;
}

export interface NetworkState {
  connectedServer: string | null; // null = local terminal
  nodes: {
    [key: string]: {
      name: string;
      connected: boolean;
      unlocked: boolean;
      type: 'server' | 'node';
    }
  };
}

export type CommandHandler = (args: string[], state: GameState) => CommandResult;

export interface CommandResult {
  output: string;
  success: boolean;
  newLines?: TerminalLine[]; // Advanced output (ASCII art)
  action?: 'next_stage' | 'clear' | 'none';
}

export interface StageConfig {
  id: number;
  name: string;
  description: string;
  onEnter?: (state: GameState) => void;
  commands: { [key: string]: CommandHandler };
  puzzleChk?: (state: GameState) => boolean; // Automatic check logic
  terminalText?: string;
}
