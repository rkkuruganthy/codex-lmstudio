// build.mjs
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = 'dist';

if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}

esbuild.build({
  entryPoints: ['src/cli.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  tsconfig: 'tsconfig.json',
  outfile: `${OUT_DIR}/cli.mjs`,  // 👈 Output .mjs instead of .js
  sourcemap: true,
  external: [
    'react', 'ink', 'chalk', 'gradient-string', 'dotenv',
    'node:fs', 'node:path', 'node:events'
  ],
  inject: ['./require-shim.js'],
}).then(() => {
  console.log('✅ Build successful');
}).catch(() => process.exit(1));
