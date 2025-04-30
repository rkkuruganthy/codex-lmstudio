// File: src/cli-lmstudio.tsx

import React from "react";
import { render } from "ink";
import { CodexApp } from "./components/codex-app.js";
import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Load codex-config.json if available
const configPath = path.resolve(process.cwd(), "codex-config.json");
let config: any = {};

try {
  const configFile = fs.readFileSync(configPath, "utf-8");
  config = JSON.parse(configFile);
} catch (error) {
  console.error("⚠️ Warning: codex-config.json not found. Using defaults.");
}

// CLI setup
const program = new Command();

program
  .name(config.shortcut_command || "CodeAssist")
  .description("CodeAssist CLI powered by LMStudio and Qwen")
  .option("-m, --model <model>", "Model to use", config.default_model || "qwen2.5-coder-14b-instruct")
  .parse(process.argv);

const options = program.opts();

// Render the Ink app without the top banner (🧼 cleaned)
render(
  <CodexApp
    initialPrompt=""
    model={options.model}
  />
);
