// File: src/utils/ensureHistoryFileExists.ts

import fs from "fs";
import path from "path";

const historyFileName = "history-cache.json";

export function getHistoryFilePath(): string {
  const historyPath = path.resolve(process.cwd(), historyFileName);
  return historyPath;
}

export function ensureHistoryFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

export function loadHistoryCache(): string[] {
  const historyFile = getHistoryFilePath();
  try {
    if (!fs.existsSync(historyFile)) {
      fs.writeFileSync(historyFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(historyFile, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read history cache:", err);
    return [];
  }
}
