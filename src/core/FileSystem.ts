import type { FileSystemNode } from "./types";

// Initial File System
export const initialFileSystem: FileSystemNode[] = [
  {
    name: "logs",
    type: "directory",
    children: [
      {
        name: "boot.log",
        type: "file",
        content: "SYSTEM BOOT: SUCCESS\nKERNEL: v2.47 loaded",
      },
      {
        name: "auth_failures.log",
        type: "file",
        content: "Attempt 1: FAILED\nAttempt 2: FAILED",
      },
    ],
  },
  {
    name: "notes",
    type: "directory",
    children: [
      {
        name: "readme.txt",
        type: "file",
        content: "Remember to clear history after use.",
      },
    ],
  },
];

export class FileSystemManager {
  root: FileSystemNode[];
  currentPath: string[];

  constructor(initialState: FileSystemNode[]) {
    this.root = JSON.parse(JSON.stringify(initialState));
    this.currentPath = []; // Root
  }

  // Get node at path
  resolvePath(_pathStr: string): FileSystemNode | null {
    // Simple implementation for now, traversing from root
    // Only handling relative paths from root or current (mocking single level for now maybe?)
    // Let's stick to a flat-ish system or single simulated directory for simplicity in stages usually
    // But stages imply connecting to different servers which might have different file systems.

    // For this game, "connecting" to a server sets the context.
    // The GameEngine will swap data.state.files when connecting.
    return null;
  }

  static findFile(
    files: FileSystemNode[],
    filename: string,
  ): FileSystemNode | null {
    for (const node of files) {
      if (node.name === filename) return node;
      if (node.children) {
        const found = this.findFile(node.children, filename);
        if (found) return found;
      }
    }
    return null;
  }
}
