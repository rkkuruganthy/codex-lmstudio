// src/components/codex-chat.tsx

import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { getHistoryFilePath, ensureHistoryFileExists } from "../utils/ensureHistoryFileExists";
import { promptCatalog } from "../prompts/promptCatalog";

// --- File Filtering Helpers ---
function isSourceFile(filename: string): boolean {
  const allowed = [
    ".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".go", ".rb", ".cs", ".php", ".feature", ".md"
  ];
  return allowed.some(ext => filename.endsWith(ext));
}

function isBinaryFile(filename: string): boolean {
  const binaryExtensions = [
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".exe", ".dll", ".so", ".zip", ".tar", ".gz", ".pdf"
  ];
  return binaryExtensions.some(ext => filename.endsWith(ext));
}

// --- Repo Context Generation ---
function generateRepoContext(repoPath: string, contextFile: string) {
  const files: { path: string; content: string }[] = [];
  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        !entry.name.startsWith(".") &&
        entry.name !== ".DS_Store" &&
        isSourceFile(entry.name) &&
        !isBinaryFile(entry.name)
      ) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8").slice(0, 5000);
          files.push({ path: fullPath.replace(repoPath + "/", ""), content });
        } catch (e) {
          // Ignore unreadable files
        }
      }
    }
  };
  walk(repoPath);
  fs.writeFileSync(contextFile, JSON.stringify(files, null, 2));
  return files;
}

function isGitHubUrl(str: string) {
  return str.startsWith("http://") || str.startsWith("https://");
}

function cloneRepoIfNeeded(url: string): string {
  const match = url.match(/github\.com[/:](.*?)\/(.*?)(\.git)?$/);
  if (!match) throw new Error("❌ Invalid GitHub URL format");
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  const localPath = path.resolve(".repo-cache", `${owner}__${repo}`);

  if (!fs.existsSync(localPath)) {
    console.log(`📥 Cloning ${url} to ${localPath}...`);
    execSync(`git clone --depth=1 ${url} ${localPath}`, { stdio: "inherit" });
  }

  return localPath;
}

// --- Enhanced Gherkin Highlighting ---
function highlightGherkin(text: string) {
  return text
    .replace(/^Feature:/gm, '\x1b[33mFeature:\x1b[0m')
    .replace(/^Scenario:/gm, '\x1b[33mScenario:\x1b[0m')
    .replace(/^\s*Given/gm, '\x1b[36mGiven\x1b[0m')
    .replace(/^\s*When/gm, '\x1b[36mWhen\x1b[0m')
    .replace(/^\s*Then/gm, '\x1b[36mThen\x1b[0m')
    .replace(/^\s*And/gm, '\x1b[36mAnd\x1b[0m')
    .replace(/^\s*But/gm, '\x1b[36mBut\x1b[0m');
}

interface CodexChatProps {
  initialPrompt: string;
  model: string;
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

export const CodexChat: React.FC<CodexChatProps> = ({ initialPrompt, model, config }) => {
  const [input, setInput] = useState(initialPrompt || "");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful coding assistant." }
  ]);
  const [thinking, setThinking] = useState(false);
  const [response, setResponse] = useState("");
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [repoFiles, setRepoFiles] = useState<string[]>([]);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [currentRepoPath, setCurrentRepoPath] = useState(config.defaultRepo);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(0);
  const [suggestionMode, setSuggestionMode] = useState(false);
  const historyFilePath = getHistoryFilePath();

  // Load repo files for suggestions when repo changes
  useEffect(() => {
    try {
      const contextFile = path.join(currentRepoPath, ".repo-context.json");
      if (fs.existsSync(contextFile)) {
        const contextData = JSON.parse(fs.readFileSync(contextFile, "utf-8"));
        setRepoFiles(contextData.map((f: any) => f.path));
      } else {
        setRepoFiles([]);
      }
    } catch {
      setRepoFiles([]);
    }
  }, [currentRepoPath]);

  useEffect(() => { ensureHistoryFileExists(historyFilePath); }, []);

  // Update suggestions as user types a file argument
  useEffect(() => {
    const parts = input.trim().split(" ");
    if (parts.length >= 2 && Object.keys(promptCatalog).includes(parts[0].replace("/", ""))) {
      const partial = parts.slice(1).join(" ").toLowerCase();
      const filtered = repoFiles.filter(f => f.toLowerCase().includes(partial));
      setSuggestions(filtered.slice(0, 8));
      setSelectedSuggestion(0);
    } else {
      setSuggestions([]);
      setSelectedSuggestion(0);
    }
  }, [input, repoFiles]);

  // Keyboard navigation for suggestions
  useInput((inputKey, key) => {
    if (suggestions.length > 0) {
      setSuggestionMode(true);
      if (key.downArrow) {
        setSelectedSuggestion(prev => (prev + 1) % suggestions.length);
      } else if (key.upArrow) {
        setSelectedSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (key.return || key.tab) {
        // Autocomplete with selected suggestion
        const parts = input.trim().split(" ");
        if (parts.length >= 2) {
          setInput(parts[0] + " " + suggestions[selectedSuggestion]);
          setSuggestions([]);
          setSuggestionMode(false);
        }
      } else if (key.escape) {
        setSuggestions([]);
        setSuggestionMode(false);
      }
    } else {
      setSuggestionMode(false);
    }
  });

  // Clear input and suggestions after LLM response
  useEffect(() => {
    if (!thinking && response) {
      setInput("");
      setSuggestions([]);
      setSelectedSuggestion(0);
      setSuggestionMode(false);
    }
  }, [thinking, response]);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // --- /clear command fix ---
    if (trimmedInput === "/clear") {
      setMessages([{ role: "system", content: "You are a helpful coding assistant." }]);
      setResponse("");
      setInput("");
      setTokensUsed(null);
      setTimeTaken(null);
      setSuggestions([]);
      setSelectedSuggestion(0);
      setSuggestionMode(false);
      return;
    }

    const [rawCommand, ...argParts] = trimmedInput.split(" ");
    const commandKey = rawCommand.replace("/", "");
    const arg = argParts.join(" ").trim();

    if (Object.keys(promptCatalog).includes(commandKey)) {
      if (commandKey === "files") {
        try {
          const contextFile = path.join(currentRepoPath, ".repo-context.json");
          const contextData = JSON.parse(fs.readFileSync(contextFile, "utf-8"));
          const fileList = contextData.map((f: any) => `📄 ${f.path}`).join("\n");
          setResponse(`🗂️ Files in context:\n\n${fileList}`);
        } catch (e) {
          setResponse("❌ Failed to load repo context. Use /repo or /load first.");
        }
        setInput("");
        return;
      }
      if (commandKey === "load") {
        const repoPath = config.defaultRepo;
        const contextFile = path.join(currentRepoPath, ".repo-context.json");
        generateRepoContext(currentRepoPath, contextFile);
        setResponse(`🔄 Repo context reloaded from: ${repoPath}`);
        setInput("");
        return;
      }
      const promptEntry = promptCatalog[commandKey];

      if (commandKey === "repo" && arg) {
        const repoPath = isGitHubUrl(arg) ? cloneRepoIfNeeded(arg) : arg;
        if (!fs.existsSync(repoPath)) {
          setResponse(`❌ Directory not found: ${repoPath}`);
          setInput("");
          return;
        }
        setCurrentRepoPath(repoPath);
        setResponse(`✅ Repo context loaded from: ${repoPath}`);
        setInput("");
        return;
      }

      const contextFile = path.join(currentRepoPath, ".repo-context.json");
      if (!fs.existsSync(contextFile)) {
        generateRepoContext(currentRepoPath, contextFile);
      }
      const contextData = JSON.parse(fs.readFileSync(contextFile, "utf-8"));

      const filteredContext = contextData.filter((f: any) => {
        return (
          !f.path.startsWith(".") &&
          !f.path.includes(".DS_Store") &&
          isSourceFile(f.path) &&
          !isBinaryFile(f.path)
        );
      });

      let fileContent = "";
      const MAX_FILES = 7;
      const MAX_LENGTH = 2000;

      if (commandKey === "businessFlows" || commandKey === "summarize") {
        fileContent = contextData
          .slice(0, MAX_FILES)
          .map((f: any) => `File: ${f.path}\n${f.content.slice(0, MAX_LENGTH)}`)
          .join('\n---\n');
      } else if (!arg) {
        fileContent = filteredContext
          .slice(0, MAX_FILES)
          .map((f: any) => `File: ${f.path}\n\n${f.content.slice(0, MAX_LENGTH)}`)
          .join("\n---\n");
      } else {
        const match = filteredContext.find((f: any) => f.path.toLowerCase().includes(arg.toLowerCase()));
        if (match) {
          fileContent = `File: ${match.path}\n\n${match.content.slice(0, MAX_LENGTH)}`;
        } else {
          setResponse(`❌ File not found for command \\${commandKey}: ${arg}`);
          setInput("");
          return;
        }
      }

      const finalPrompt = promptEntry.template
        .replace("<INSERT_FILE_NAME_AND_CONTENT_HERE>", fileContent)
        .replace("<INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>", fileContent);

      setLastCommand(commandKey);
      const newMessages = [...messages, { role: "user", content: finalPrompt }];
      setMessages(newMessages);
      setThinking(true);
      setInput("");
      const start = Date.now();
      const apiUrl = config.apiBaseUrl || "http://localhost:1234/v1";
      const apiKey = config.apiKey || "sk-local";

      try {
        const payload = {
          model,
          messages: newMessages,
          temperature: 0.2,
          max_tokens: 3000,
          stream: false
        };
        const res = await fetch(`${apiUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify(payload),
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

        if (tokens && tokens > 8000) {
          console.warn("⚠️ High token usage detected:", tokens);
        }
        setTimeTaken(Math.round((end - start) / 1000));

        const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
        history.push({ prompt: trimmedInput, response: assistantReply });
        fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
        return;
      } catch (error) {
        setThinking(false);
        setResponse("❌ Failed to get response from LMStudio. Check if LMStudio is running and reachable.");
        return;
      }
    }

    // Handle special /clear-history, and /history commands (unchanged)
    if (trimmedInput === "/clear-history") {
      try {
        fs.writeFileSync(historyFilePath, JSON.stringify([], null, 2));
        setResponse("🧹 History cleared successfully.");
      } catch (e) {
        setResponse("❌ Failed to clear history.");
      }
      setInput("");
      return;
    }
    if (trimmedInput === "/history") {
      try {
        const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
        const formatted = [
          '| #  | Prompt',
          '|----|--------',
          ...history.map((item: any, idx: number) => `| ${String(idx + 1).padEnd(2)} | ${item.prompt}`)
        ].join("\n");
        setResponse(`🕘 Prompt History:\n\n${formatted}`);
      } catch (e) {
        setResponse("❌ Failed to read history.");
      }
      setInput("");
      return;
    }

    if (trimmedInput.startsWith("/load ")) {
      const idx = parseInt(trimmedInput.replace("/load ", ""), 10);
      if (!isNaN(idx)) {
        try {
          const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
          if (history[idx - 1]) {
            setInput(history[idx - 1].prompt);
            setResponse(history[idx - 1].response);
          } else {
            setResponse(`❌ No history found for index ${idx}`);
          }
        } catch (e) {
          setResponse("❌ Failed to load history.");
        }
      } else {
        setResponse("❌ Invalid number provided for /load");
      }
      return;
    }

    // Treat unknown input as a general prompt
    const newMessages = [...messages, { role: "user", content: trimmedInput }];
    setMessages(newMessages);
    setThinking(true);
    setInput("");
    const start = Date.now();
    const apiUrl = config.apiBaseUrl || "http://localhost:1234/v1";
    const apiKey = config.apiKey || "sk-local";
    try {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages: newMessages,
          temperature: 0.2,
          max_tokens: 3000,
          stream: false,
        }),
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

      const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
      history.push({ prompt: trimmedInput, response: assistantReply });
      fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
      return;
    } catch (error) {
      setThinking(false);
      setResponse("❌ Failed to get response from LMStudio. Check if LMStudio is running and reachable.");
      return;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1} flexDirection="column" borderStyle="single" borderColor="cyan" width={90} alignSelf="center">
        <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
        <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
      </Box>

      {/* Repo Info */}
      <Box marginBottom={1} flexDirection="column" borderStyle="single" borderColor="yellow" width={90} alignSelf="center" padding={1}>
        <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
        <Text color="cyan">📁 Active Repo: {currentRepoPath}</Text>
        <Text>🛠️ Model: {model}</Text>
        <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
      </Box>

      {/* Predefined Prompts */}
      <Box marginBottom={1} flexDirection="column" borderStyle="single" borderColor="magenta" width={90} alignSelf="center" padding={1}>
        <Text color="magentaBright">🧠 Predefined Prompts:</Text>
        {Object.entries(promptCatalog).map(([cmd], idx) => (
          <Text key={idx} color="yellow">- /{cmd}</Text>
        ))}
      </Box>

      {/* Assistant Response */}
      {response && (
        <Box marginBottom={1} flexDirection="column" borderStyle="single" borderColor="green" width={90} alignSelf="center" paddingX={1}>
          <Text color="magentaBright">💬 Assistant Response:</Text>
          {lastCommand === "architecture" && response.includes("graph TD") ? (
            <Text color="white">📊 Mermaid Output Detected (render externally):</Text>
          ) : null}
          <Text>{highlightGherkin(response)}</Text>
          {tokensUsed !== null && <Text color="cyan">Tokens: {tokensUsed} | Time: {timeTaken}s</Text>}
        </Box>
      )}

      {/* Input and Suggestions */}
      {!thinking && (
        <Box flexDirection="column" width={90} alignSelf="center" marginTop={1}>
          <Box borderStyle="single" borderColor="blue" paddingX={1}>
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder="Type your question here"
              focus={!suggestionMode}
            />
          </Box>
          {suggestions.length > 0 && (
            <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" width={90} paddingLeft={2}>
              <Text color="white">Suggestions (use ↑/↓ and Enter/Tab):</Text>
              {suggestions.map((file, idx) => (
                <Text
                  key={file}
                  color={idx === selectedSuggestion ? "black" : "cyan"}
                  backgroundColor={idx === selectedSuggestion ? "cyan" : undefined}
                >
                  {file}
                </Text>
              ))}
            </Box>
          )}
          <Box marginTop={1}>
            <Text>
              Press <Text color="green">Enter</Text> to send | <Text color="red">/repo</Text>, <Text color="red">/history</Text>, <Text color="red">/load</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear-history</Text>
            </Text>
          </Box>
        </Box>
      )}

      {thinking && (
        <Box marginTop={1}>
          <Text color="green"><Spinner type="dots" /> Thinking...</Text>
        </Box>
      )}
    </Box>
  );
};
