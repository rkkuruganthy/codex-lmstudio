// File: src/utils/repo-loader.ts

import fs from "fs";
import path from "path";
import { finalConfig } from "./config";

interface RepoFile {
  path: string;
  content: string;
}

export async function loadRepoFiles(basePath: string): Promise<RepoFile[]> {
  const files: RepoFile[] = [];

  function readDirRecursive(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        readDirRecursive(fullPath);
      } else {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          files.push({ path: path.relative(basePath, fullPath), content });
        } catch (err) {
          console.warn(`Failed to read ${fullPath}:`, err);
        }
      }
    }
  }

  readDirRecursive(basePath);
  return files;
}

export function updateContextFromRepo(repoPath: string) {
  try {
    const absolutePath = path.resolve(repoPath);
    finalConfig.defaultRepo = path.basename(absolutePath);
    finalConfig.defaultPath = absolutePath;
    console.log(`📁 Repo context updated: ${finalConfig.defaultRepo} (${finalConfig.defaultPath})`);
  } catch (err) {
    console.error("Failed to update repo context:", err);
  }
}
