// File: src/utils/ensureHistoryFileExists.ts

import fs from "fs";
import path from "path";
import os from "os";

const historyDir = path.join(os.homedir(), ".codex", "history");
const historyFilePath = path.join(historyDir, "session-history.json");

export function getHistoryFilePath(): string {
  return historyFilePath;
}

export function ensureHistoryFileExists(): void {
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  if (!fs.existsSync(historyFilePath)) {
    fs.writeFileSync(historyFilePath, "[]", "utf-8");
  }
}
