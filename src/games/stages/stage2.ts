import type { StageConfig, CommandResult, GameState } from "../../core/types";

interface NodeConfig {
  name: string;
  connections: string[];
  type: "server" | "terminal" | "storage";
  firewall: boolean;
}

const NETWORK_MAP: Record<string, NodeConfig> = {
  MAINFRAME: {
    name: "MAINFRAME",
    connections: ["PROXY_A", "PROXY_B", "LOGS"],
    type: "server",
    firewall: false,
  },
  LOGS: {
    name: "LOGS",
    connections: ["MAINFRAME"],
    type: "storage",
    firewall: false,
  },
  PROXY_A: {
    name: "PROXY_A",
    connections: ["MAINFRAME", "ROUTING"],
    type: "server",
    firewall: false,
  },
  PROXY_B: {
    name: "PROXY_B",
    connections: ["MAINFRAME", "BACKUP"],
    type: "server",
    firewall: false,
  },
  BACKUP: {
    name: "BACKUP",
    connections: ["PROXY_B"],
    type: "storage",
    firewall: false,
  },
  ROUTING: {
    name: "ROUTING",
    connections: ["PROXY_A", "FIREWALL_EXT"],
    type: "server",
    firewall: false,
  },
  FIREWALL_EXT: {
    name: "FIREWALL_EXT",
    connections: ["ROUTING", "SECURE_HUB"],
    type: "server",
    firewall: true,
  },
  SECURE_HUB: {
    name: "SECURE_HUB",
    connections: ["FIREWALL_EXT", "RESEARCH", "PERSONNEL"],
    type: "server",
    firewall: false,
  },
  PERSONNEL: {
    name: "PERSONNEL",
    connections: ["SECURE_HUB"],
    type: "storage",
    firewall: false,
  },
  RESEARCH: {
    name: "RESEARCH",
    connections: ["SECURE_HUB", "ARCHIVES"],
    type: "server",
    firewall: false,
  },
  ARCHIVES: {
    name: "ARCHIVES",
    connections: ["RESEARCH"],
    type: "storage",
    firewall: true,
  },
};

export const stage2: StageConfig = {
  id: 2,
  name: "Network Mapping",
  description: "Navigate the deep network.",
  terminalText:
    "SECONDARY PROTOCOLS ACTIVE\n\nNETWORK CONNECTION ESTABLISHED: MAINFRAME\n\nUse 'show_connections' to scan local nodes.\nUse 'connect <node>' to jump.\n\n>",

  onEnter: (state: GameState) => {
    state.network = {
      connectedServer: "MAINFRAME",
      nodes: {}, // Not strictly used with new static map logic, but good for typed state if we need persistence
    };
    state.unlockedCommands = ["help", "clear", "show_connections", "connect"];
  },

  commands: {
    show_connections: (_args: string[], state: GameState): CommandResult => {
      const current = state.network.connectedServer || "MAINFRAME";
      const node = NETWORK_MAP[current];

      if (!node) return { success: false, output: "ERROR: CONNECTION LOST." };

      const connectionsList = (node?.connections || [])
        .map((targetId) => {
          const target = NETWORK_MAP[targetId];
          return `→ ${targetId} [${target?.type.toUpperCase()}]${target?.firewall ? " ⚠ SECURE" : ""}`;
        })
        .join("\n");

      return {
        success: true,
        output: `CURRENT NODE: ${current}\n\nDETECTED CONNECTIONS:\n${connectionsList}`,
      };
    },

    connect: (args: string[], state: GameState): CommandResult => {
      const target = (args[0] || "").toUpperCase();
      const current = state.network.connectedServer || "MAINFRAME";
      const currentNode = NETWORK_MAP[current];

      if (!currentNode || !currentNode.connections.includes(target)) {
        return {
          success: false,
          output: `ERROR: No direct connection to '${target}' from current node.`,
        };
      }

      // Success logic
      state.network.connectedServer = target;

      if (target === "ARCHIVES") {
        return {
          success: true,
          output:
            "ESTABLISHING SECURE CONNECTION...\n\n[████████████████████] 100%\n\nACCESS GRANTED: ARCHIVES\n\nInitializing file system...",
          action: "next_stage",
        };
      }

      return {
        success: true,
        output: `JUMPING TO ${target}...\n\nCONNECTED.`,
      };
    },

    scan_network: (_args: string[], _state: GameState): CommandResult => {
      return {
        success: false,
        output:
          "ERROR: Network scan modules disabled. Local connection scanning only.",
      };
    },
  },
};
