// build.cjs
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/cli-lmstudio.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs", // ✅ MUST be "cjs"
    outfile: "dist/cli.js",
    sourcemap: true,
    external: [
      "react",
      "ink",
      "chalk",
      "dotenv",
      "gradient-string",
      "node-fetch",
      "commander",
      "node:events",
      "node:fs",
      "node:path",
    ],
  })
  .then(() => console.log("✅ Build successful"))
  .catch(err => {
    console.error("❌ Build failed", err);
    process.exit(1);
  });
