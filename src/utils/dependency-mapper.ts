// src/utils/dependency-mapper.ts
import fs from 'fs';
import path from 'path';

export async function getDependenciesFromRepo(repoPath: string): Promise<Record<string, string[]>> {
  const dependencies: Record<string, string[]> = {};
  const jsFiles = getAllJsTsFiles(repoPath);

  for (const filePath of jsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [...content.matchAll(/(?:import|require)\(['"]([^'"]+)['"]\)/g)];
    const deps = matches.map(m => m[1]).filter(Boolean);
    dependencies[path.relative(repoPath, filePath)] = deps;
  }

  return dependencies;
}

function getAllJsTsFiles(dir: string, fileList: string[] = []): string[] {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsTsFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}
