// Location: src/components/codex-app.tsx

import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface CodexAppProps {
  initialPrompt: string;
  model: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const CodexApp: React.FC<CodexAppProps> = ({ initialPrompt, model }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful coding assistant." }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    async function fetchCompletion() {
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
            model: model || "qwen2.5-coder-14b-instruct",
            messages: [
              ...messages,
              { role: "user", content: initialPrompt }
            ],
            temperature: 0.2,
            stream: false,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`LMStudio API Error: ${errorText}`);
        }

        const data = await res.json();
        const assistantMessage = data.choices[0].message.content;

        setMessages(prev => [
          ...prev,
          { role: "user", content: initialPrompt },
          { role: "assistant", content: assistantMessage },
        ]);

        setResponse(assistantMessage);
        setLoading(false);
      } catch (error) {
        console.error("🚨 Error fetching from LMStudio:", error);
        setLoading(false);
      }
    }

    fetchCompletion();
  }, [initialPrompt, model]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text color="cyanBright">User Prompt:</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>{initialPrompt}</Text>
      </Box>
      <Box marginBottom={1}>
        {loading ? (
          <Text color="green">
            <Spinner type="dots" /> Generating response...
          </Text>
        ) : (
          <>
            <Box marginBottom={1}>
              <Text color="yellowBright">Assistant Response:</Text>
            </Box>
            <Box>
              <Text>{response}</Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
