// File: src/utils/session.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const SESSION_DIR = join(homedir(), ".codeassist-sessions");
const SESSION_FILE = join(SESSION_DIR, "history.json");

export interface SessionEntry {
  timestamp: string;
  prompt: string;
  response: string;
}

// Ensure the folder exists
function ensureSessionDir(): void {
  if (!existsSync(SESSION_DIR)) {
    mkdirSync(SESSION_DIR, { recursive: true });
  }
}

export function saveToSession(prompt: string, response: string): void {
  ensureSessionDir();
  const entry: SessionEntry = {
    timestamp: new Date().toISOString(),
    prompt,
    response,
  };

  const existing: SessionEntry[] = loadSessionHistory();
  existing.push(entry);
  writeFileSync(SESSION_FILE, JSON.stringify(existing, null, 2), "utf-8");
}

export function loadSessionHistory(): SessionEntry[] {
  if (!existsSync(SESSION_FILE)) return [];
  try {
    const data = readFileSync(SESSION_FILE, "utf-8");
    return JSON.parse(data) as SessionEntry[];
  } catch {
    return [];
  }
}
