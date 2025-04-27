// Location: src/components/codex-chat.tsx

import React, { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { createSession, Session } from "../utils/session.js";

interface CodexChatProps {
  model: string;
  initialPrompt?: string;
}

export const CodexChat: React.FC<CodexChatProps> = ({ model, initialPrompt }) => {
  const { exit } = useApp();
  const [input, setInput] = useState("");
  const [session] = useState<Session>(() => createSession({ model }));
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle LMStudio response fetching in background
  useEffect(() => {
    if (pendingQueue.length > 0 && !thinking) {
      const nextPrompt = pendingQueue[0];
      const run = async () => {
        try {
          setThinking(true);
          const assistantReply = await session.send(nextPrompt);
          setMessages(prev => [
            ...prev,
            { role: "user", content: nextPrompt },
            { role: "assistant", content: assistantReply }
          ]);
        } catch (err: any) {
          console.error("🚨 Error during fetch:", err);
          setError(err.message || "Unknown error occurred.");
        } finally {
          setThinking(false);
          setPendingQueue(prev => prev.slice(1));
        }
      };
      run();
    }
  }, [pendingQueue, thinking, session]);

  // On initial load, send the initial prompt if provided
  useEffect(() => {
    if (initialPrompt) {
      setPendingQueue(prev => [...prev, initialPrompt]);
    }
  }, [initialPrompt]);

  useInput((inputKey, key) => {
    if (key.return) {
      if (!thinking && input.trim()) {
        setPendingQueue(prev => [...prev, input.trim()]);
        setInput("");
      }
    } else if (key.ctrl && inputKey === "c") {
      exit();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Session ID */}
      <Box marginBottom={1}>
        <Text color="cyan">Session ID: {session.id}</Text>
      </Box>

      {/* Chat history */}
      {messages.map((msg, idx) => (
        <Box key={idx} flexDirection="column" marginBottom={1}>
          <Text color={msg.role === "user" ? "green" : "yellow"}>
            {msg.role === "user" ? "You:" : "Assistant:"}
          </Text>
          <Text wrap="wrap">{msg.content}</Text>
        </Box>
      ))}

      {/* Spinner during thinking */}
      {thinking && (
        <Box marginBottom={1}>
          <Text color="magenta">
            <Spinner type="dots" /> Thinking...
          </Text>
        </Box>
      )}

      {/* Error if any */}
      {error && (
        <Box marginBottom={1}>
          <Text color="red">❗ {error}</Text>
        </Box>
      )}

      {/* Input box when not thinking */}
      {!thinking && (
        <Box>
          <TextInput
            placeholder="Type your next question and press Enter..."
            value={input}
            onChange={setInput}
          />
        </Box>
      )}

      {/* Footer instructions */}
      <Box marginTop={1}>
        <Text dimColor>
          Press Enter to send | Ctrl+C to exit
        </Text>
      </Box>
    </Box>
  );
};
