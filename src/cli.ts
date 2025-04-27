// Location: src/cli.ts

import { render } from "ink";
import React from "react";
import { CodexApp } from "./components/codex-app.js";
import { Command } from "commander";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// CLI setup
const program = new Command();

program
  .name("codex")
  .description("Codex CLI with LMStudio backend")
  .option("-p, --prompt <prompt>", "Prompt to send to LMStudio")
  .option("-m, --model <model>", "Model to use", "qwen2.5-coder-14b-instruct")
  .parse(process.argv);

const options = program.opts();

if (!options.prompt) {
  console.error("❗ Please provide a prompt with -p or --prompt option.");
  process.exit(1);
}

// Render the CodexApp React UI
render(
  <CodexApp
    initialPrompt={options.prompt}
    model={options.model}
  />
);
