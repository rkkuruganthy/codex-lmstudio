// File: src/components/codex-chat.tsx

import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import {
  getHistoryFilePath,
  ensureHistoryFileExists,
  loadHistoryCache
} from "../utils/ensureHistoryFileExists";
import { updateContextFromRepo } from "../utils/repo-loader";

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
  predefinedPrompts = [],
  config
}) => {
  const [input, setInput] = useState<string>(initialPrompt || "");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful coding assistant."
    }
  ]);
  const [thinking, setThinking] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const history = loadHistoryCache();
    setHistory(history);
  }, []);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const historyFilePath = getHistoryFilePath();
    await ensureHistoryFileExists(historyFilePath);

    if (trimmedInput === "/clear") {
      setResponse("");
      setInput("");
      return;
    }

    if (trimmedInput === "/clear history") {
      fs.writeFileSync(historyFilePath, JSON.stringify([]));
      setHistory([]);
      setResponse("🧹 History cleared.");
      setInput("");
      return;
    }

    if (trimmedInput === "/history") {
      const history = loadHistoryCache();
      const historyOutput = history.length
        ? `🕓 ${history.length} items in history:\n` +
          history.map((entry, i) => `${i + 1}. ${entry.prompt}`).join("\n") +
          "\n\nType `/recall <number>` to view that entry."
        : "No history yet.";
      setResponse(historyOutput);
      setInput("");
      return;
    }

    if (/^\/recall\s+\d+/.test(trimmedInput)) {
      const index = parseInt(trimmedInput.replace("/recall", "").trim(), 10) - 1;
      if (isNaN(index) || index < 0 || index >= history.length) {
        setResponse("❌ Invalid history item number.");
        setInput("");
        return;
      }
      const entry = history[index];
      setResponse(`🧠 Recalled Prompt:\n${entry.prompt}\n\n💬 Response:\n${entry.response}`);
      setInput("");
      return;
    }

    if (trimmedInput.startsWith("/repo ")) {
      const repoPath = trimmedInput.replace("/repo ", "").trim();
      updateContextFromRepo(repoPath);
      config.defaultRepo = repoPath;
      config.defaultPath = repoPath;

      const repoContextPath = path.join(repoPath, ".repo-context.json");
      try {
        const loadedFiles = JSON.parse(fs.readFileSync(repoContextPath, "utf-8"));
        setRepoFiles(loadedFiles);
        setResponse(`📁 Repo path updated to ${repoPath}\n🔄 Context is now active and will be used for all /commands and prompts.\n\n🗂 Repo Files:\n` +
          loadedFiles.map((f: any, i: number) => `${i + 1}. ${f.path}`).join("\n") +
          "\n\nUse `/use <number>` to select a file for commands.");
      } catch (e) {
        console.warn("⚠️ Repo context load failed:", e.message);
        setResponse("❌ Failed to load repo context.");
      }
      setInput("");
      return;
    }

    if (/^\/use\s+\d+/.test(trimmedInput)) {
      const index = parseInt(trimmedInput.replace("/use", "").trim(), 10) - 1;
      if (isNaN(index) || index < 0 || index >= repoFiles.length) {
        setResponse("❌ Invalid file number. Use /repo to refresh file list.");
        setInput("");
        return;
      }
      setSelectedFile(repoFiles[index].path);
      setResponse(`✅ Selected file set to: ${repoFiles[index].path}`);
      setInput("");
      return;
    }

    let userContent = trimmedInput;

    if (selectedFile && config?.defaultRepo) {
      const matchedFile = repoFiles.find((f: any) => f.path === selectedFile);
      if (matchedFile) {
        userContent = `Here is the content of ${matchedFile.path} from the repo:\n\n${matchedFile.content.slice(0, 3000)}\n\nNow: ${trimmedInput}`;
      }
    }

    setThinking(true);
    setInput("");
    const start = Date.now();
    const newMessages = [...messages, { role: "user", content: userContent }];
    setMessages(newMessages);

    try {
      const res = await fetch(`${config.apiBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: newMessages,
          temperature: 0.2,
          stream: false
        })
      });

      if (!res.ok) throw new Error(`API Error: ${await res.text()}`);

      const data = await res.json();
      const assistantReply = data.choices?.[0]?.message?.content || "No reply.";
      const tokens = data.usage?.total_tokens || null;
      const end = Date.now();

      setThinking(false);
      setResponse(assistantReply);
      setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
      setTokensUsed(tokens);
      setTimeTaken(Math.round((end - start) / 1000));

      const updatedHistory = [...history, { prompt: trimmedInput, response: assistantReply }];
      setHistory(updatedHistory);
      fs.writeFileSync(historyFilePath, JSON.stringify(updatedHistory, null, 2));
    } catch (error) {
      setThinking(false);
      console.error("🚨 Error:", error);
      setResponse("❌ Error: Failed to get response from LMStudio. Check if LM Studio is running and reachable.");
    }
  };

  return (
    <Box flexDirection="column" padding={1} width="80%">
      <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
        <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
        <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="yellow" width="80%" padding={1} alignSelf="center">
        <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
        <Text>🛠️ Model: {model || config?.defaultModel || "N/A"}</Text>
        <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
        {selectedFile && <Text color="green">📄 Selected File: {selectedFile}</Text>}
        <Text color="cyanBright">📎 Context will be used for all /commands and prompts this session</Text>
      </Box>

      {Array.isArray(predefinedPrompts) && predefinedPrompts.length > 0 && (
        <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="magenta" width="80%" padding={1} alignSelf="center">
          <Text color="magentaBright">🧠 Predefined Prompts:</Text>
          {predefinedPrompts.map((prompt, idx) => (
            <Text key={idx} color="yellow">- {prompt}</Text>
          ))}
        </Box>
      )}

      {response && (
        <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="green" width="80%" paddingX={1} alignSelf="center">
          <Text color="magentaBright">💬 Assistant Response:</Text>
          <Text>{response}</Text>
          {tokensUsed !== null && <Text color="cyan">Tokens: {tokensUsed} | Time: {timeTaken}s</Text>}
        </Box>
      )}

      {!thinking && (
        <Box flexDirection="column" width="80%" alignSelf="center" marginTop={1}>
          <Box borderStyle="round" borderColor="blue" paddingX={1}>
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder="Type your question here"
              focus
            />
          </Box>
          <Box marginTop={1}>
            <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/history</Text>, <Text color="red">/recall</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear history</Text>, <Text color="red">/use</Text></Text>
          </Box>
        </Box>
      )}

      {thinking && (
        <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>
      )}
    </Box>
  );
};
