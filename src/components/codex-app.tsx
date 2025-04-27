import React from "react";
import { CodexChat } from "./codex-chat.js";

interface CodexAppProps {
  initialPrompt: string;
  model: string;
}

export const CodexApp: React.FC<CodexAppProps> = ({ initialPrompt, model }) => {
  return (
    <CodexChat model={model} />
  );
};
