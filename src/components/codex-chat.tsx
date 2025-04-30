// File: src/components/codex-chat.tsx

import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import fetch from "node-fetch";

interface CodexChatProps {
  initialPrompt: string;
  model: string;
  predefinedPrompts: string[];
  config: {
    apiBaseUrl: string;
    apiKey: string;
    defaultRepo: string;
    defaultModel: string;
    defaultPath: string;
  };
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const CodexChat: React.FC<CodexChatProps> = ({
  initialPrompt,
  model,
  predefinedPrompts,
  config,
}) => {
  const [input, setInput] = useState<string>(initialPrompt || "");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful coding assistant." },
  ]);
  const [thinking, setThinking] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (input.trim() === "") return;

    if (input.trim() === "/clear") {
      setMessages([{ role: "system", content: "You are a helpful coding assistant." }]);
      setInput("");
      setResponse("");
      setTokensUsed(null);
      setTimeTaken(null);
      return;
    }

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setThinking(true);
    setInput("");

    const start = Date.now();
    const apiUrl = config?.apiBaseUrl || "http://localhost:1234/v1";
    const apiKey = config?.apiKey || "sk-local";

    try {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: newMessages,
          temperature: 0.2,
          stream: false,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const data = await res.json();
      const assistantReply = data.choices?.[0]?.message?.content || "No reply.";
      const tokens = data.usage?.total_tokens || null;
      const end = Date.now();

      setThinking(false);
      setResponse(assistantReply);
      setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
      setTokensUsed(tokens);
      setTimeTaken(Math.round((end - start) / 1000));
    } catch (error) {
      setThinking(false);
      console.error("🚨 Error:", error);
    }
  };

  return (
    <Box flexDirection="column" padding={1} width="80%">
      {/* Header */}
      <Box
        marginBottom={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="cyan"
        width="80%"
        alignSelf="center"
      >
        <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
        <Text color="green">Built with LMStudio + Qwen2.5</Text>
      </Box>

      {/* Repo + Model Info */}
      <Box
        marginBottom={1}
        flexDirection="column"
        borderStyle="classic"
        borderColor="yellow"
        width="80%"
        padding={1}
        alignSelf="center"
      >
        <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
        <Text>🛠️ Model: {model}</Text>
        <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
      </Box>

      {/* Predefined Prompts */}
      {Array.isArray(predefinedPrompts) && predefinedPrompts.length > 0 && (
        <Box
          marginBottom={1}
          flexDirection="column"
          borderStyle="classic"
          borderColor="magenta"
          width="80%"
          padding={1}
          alignSelf="center"
        >
          <Text color="magentaBright">🧠 Predefined Prompts:</Text>
          {predefinedPrompts.map((prompt, idx) => (
            <Text key={idx} color="yellow">- {prompt}</Text>
          ))}
        </Box>
      )}

      {/* Assistant Response */}
      {response && (
        <Box
          marginBottom={1}
          flexDirection="column"
          borderStyle="round"
          borderColor="green"
          width="80%"
          paddingX={1}
          alignSelf="center"
        >
          <Text color="magentaBright">💬 Assistant Response:</Text>
          <Text>{response}</Text>
          {tokensUsed !== null && (
            <Text color="cyan">Tokens: {tokensUsed} | Time: {timeTaken}s</Text>
          )}
        </Box>
      )}

      {/* Input Field */}
      {!thinking && (
        <Box
          flexDirection="column"
          width="80%"
          alignSelf="center"
          marginTop={1}
        >
          <Box borderStyle="round" borderColor="blue" paddingX={1}>
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder="Type your question here..."
              focus
            />
          </Box>
          <Box marginTop={1}>
            <Text>
              Press <Text color="green">Enter</Text> to send | <Text color="red">/clear</Text> to reset
            </Text>
          </Box>
        </Box>
      )}

      {thinking && (
        <Box marginTop={1}>
          <Text color="green">
            <Spinner type="dots" /> Thinking...
          </Text>
        </Box>
      )}
    </Box>
  );
};
