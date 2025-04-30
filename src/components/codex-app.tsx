// File: src/components/codex-app.tsx

import React from "react";
import { CodexChat } from "./codex-chat";
import { finalConfig } from "../utils/config";

interface CodexAppProps {
  initialPrompt: string;
  model: string;
}

const predefinedPrompts = [
  "Generate unit tests",
  "Review my code",
  "Optimize this algorithm",
  "Suggest improvements",
  "Explain this code",
  "Write documentation",
  "Find security vulnerabilities",
  "Summarize the code",
];

export const CodexApp: React.FC<CodexAppProps> = ({ initialPrompt, model }) => {
  return (
    <CodexChat
      initialPrompt={initialPrompt}
      model={model}
      predefinedPrompts={predefinedPrompts}
      config={finalConfig}
    />
  );
};
