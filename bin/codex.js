// Location: bin/codex.ts

import { Command } from "commander";
import dotenv from "dotenv";
import { render } from "ink";
import React from "react";
import { CodexApp } from "../src/components/codex-app.js";

// Load environment variables
dotenv.config();

// CLI setup
const program = new Command();

program
  .name("codex")
  .description("Local LMStudio Codex CLI with Terminal UI")
  .option("-p, --prompt <prompt>", "Initial prompt to send to the model")
  .option("-m, --model <model>", "Model to use (default: qwen2.5-coder-14b-instruct)", "qwen2.5-coder-14b-instruct")
  .parse(process.argv);

const options = program.opts();

// Main CLI execution
async function main() {
  const prompt = options.prompt;
  const model = options.model;

  if (!prompt) {
    console.error("❗ Please provide a prompt using --prompt option.");
    process.exit(1);
  }

  try {
    render(
      <CodexApp initialPrompt={prompt} model={model} />
    );
  } catch (err) {
    console.error("🚨 Error rendering CodexApp:", err);
    process.exit(1);
  }
}

main();
