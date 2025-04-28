// Location: src/components/codex-chat.tsx

import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import fetch from "node-fetch";

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

interface CodexChatProps {
  initialPrompt: string;
  model: string;
}

export const CodexChat: React.FC<CodexChatProps> = ({ initialPrompt, model }) => {
  const [input, setInput] = useState(initialPrompt || "");
  const [response, setResponse] = useState<string>("");
  const [thinking, setThinking] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    if (value.trim() === "/clear") {
      setResponse("");
      setInput("");
      setTokensUsed(null);
      setTimeTaken(null);
      return;
    }

    setThinking(true);
    const start = Date.now();
    const apiUrl = process.env.OPENAI_API_BASE_URL || "http://localhost:1234/v1";
    const apiKey = process.env.LMSTUDIO_API_KEY || "sk-local";

    try {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "You are a helpful coding assistant." },
            { role: "user", content: value }
          ],
          temperature: 0.2,
          stream: false,
        }),
      });

      const data = await res.json();
      const assistantMessage = data.choices?.[0]?.message?.content || "No response.";
      const tokens = data.usage?.total_tokens || null;
      const end = Date.now();

      setResponse(assistantMessage);
      setTokensUsed(tokens);
      setTimeTaken(Math.round((end - start) / 1000));
    } catch (error) {
      console.error("🚨 Error:", error);
    } finally {
      setThinking(false);
      setInput("");
    }
  };

  return (
    <Box flexDirection="column" padding={1} width="100%">
      
      {/* 🧠 Heading Section */}
      <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
        <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
        <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
      </Box>

      {/* 🎯 Predefined Prompts */}
      <Box marginBottom={1} flexDirection="column" borderStyle="classic" borderColor="magenta" width="80%" padding={1} alignSelf="center">
        <Text>🧠 Predefined Prompts:</Text>
        {predefinedPrompts.map((prompt, idx) => (
          <Text key={idx} color="yellow">- {prompt}</Text>
        ))}
      </Box>

      {/* 📬 Assistant Response */}
      {response && (
        <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="green" width="80%" paddingX={1} alignSelf="center">
          <Text color="magentaBright">💬 Assistant Response:</Text>
          <Text>{response}</Text>
          {tokensUsed !== null && (
            <Text color="cyan">Tokens: {tokensUsed} | Time: {timeTaken}s</Text>
          )}
        </Box>
      )}

      {/* 🧩 Input Area */}
      <Box flexDirection="column" width="80%" alignSelf="center" marginTop={1}>
        <Box borderStyle="round" borderColor="blue" paddingX={1}>
          {thinking ? (
            <Text color="green">
              <Spinner type="dots" /> Thinking...
            </Text>
          ) : (
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder="Type your question here..."
            />
          )}
        </Box>
        <Box marginTop={1}>
          <Text>
            <Text color="blue">Press Enter</Text> to send | <Text color="yellow">/clear</Text> to reset
          </Text>
        </Box>
      </Box>

    </Box>
  );
};
