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
      setInput("");
      setResponse(`📁 Repo path updated to ${repoPath}\n🔄 Context is now active and will be used for all /commands and prompts.`);
      return;
    }

    let userContent = trimmedInput;

    if (config?.defaultRepo) {
      const repoContextPath = path.join(config.defaultRepo, ".repo-context.json");
      try {
        const repoFiles = JSON.parse(fs.readFileSync(repoContextPath, "utf-8"));

        const match = trimmedInput.match(/^\/(gherkin|summarize|review)\s+(.+)/i);
        if (match) {
          const [, command, filename] = match;
          const matchedFile = repoFiles.find((f: any) => f.path.endsWith(filename.trim()));
          if (!matchedFile) {
            setResponse(`❌ File \"${filename}\" not found in repo context. Please provide a valid filename.`);
            setInput("");
            return;
          }
          userContent = `Here is the content of ${matchedFile.path} from the repo:\n\n${matchedFile.content.slice(0, 3000)}\n\nNow: ${command} the code.`;
        }
      } catch (e) {
        console.warn("⚠️ Repo context missing or failed to load:", e.message);
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
            <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/history</Text>, <Text color="red">/recall</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear history</Text></Text>
          </Box>
        </Box>
      )}

      {thinking && (
        <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>
      )}
    </Box>
  );
};




// // File: src/components/codex-chat.tsx

// import React, { useState, useEffect } from "react";
// import { Box, Text } from "ink";
// import TextInput from "ink-text-input";
// import Spinner from "ink-spinner";
// import fs from "fs";
// import path from "path";
// import fetch from "node-fetch";
// import { finalConfig as config } from "../utils/config";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// interface HistoryItem {
//   prompt: string;
//   response: string;
// }

// const historyFilePath = path.join(process.cwd(), ".codex-history.json");

// export const CodexChat: React.FC<any> = ({ initialPrompt, model, predefinedPrompts }) => {
//   const [input, setInput] = useState(initialPrompt || "");
//   const [response, setResponse] = useState("");
//   const [thinking, setThinking] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [tokensUsed, setTokensUsed] = useState<number | null>(null);
//   const [timeTaken, setTimeTaken] = useState<number | null>(null);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [repoFiles, setRepoFiles] = useState<any[]>([]);
//   const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

//   const selectedFile = selectedFileIndex !== null ? repoFiles[selectedFileIndex] : null;

//   useEffect(() => {
//     if (fs.existsSync(historyFilePath)) {
//       try {
//         const data = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
//         setHistory(data);
//       } catch (e) {
//         console.warn("⚠️ Failed to parse history file");
//       }
//     }
//   }, []);

//   const handleSubmit = async () => {
//     const trimmedInput = input.trim();

//     if (trimmedInput === "/clear") {
//       setMessages([]);
//       setResponse("");
//       return;
//     }
//     if (trimmedInput === "/clear history") {
//       setHistory([]);
//       fs.writeFileSync(historyFilePath, JSON.stringify([], null, 2));
//       return;
//     }

//     if (trimmedInput === "/history") {
//       if (history.length === 0) {
//         setResponse("📜 No history found.");
//       } else {
//         const lines = history.map((h, i) => `${i + 1}. ${h.prompt.slice(0, 40)}...`).join("\n");
//         setResponse(`📜 Prompt History (${history.length} items):\n${lines}\nType /load <number> to view full entry.`);
//       }
//       return;
//     }

//     if (trimmedInput.startsWith("/load ")) {
//       const idx = parseInt(trimmedInput.replace("/load ", ""), 10);
//       if (!isNaN(idx) && idx > 0 && idx <= history.length) {
//         const item = history[idx - 1];
//         setResponse(`🔁 History #${idx}:\nPrompt: ${item.prompt}\n\nResponse: ${item.response}`);
//       } else {
//         setResponse("❌ Invalid history item.");
//       }
//       setInput("");
//       return;
//     }

//     if (trimmedInput.startsWith("/repo ")) {
//       const repoPath = trimmedInput.replace("/repo ", "").trim();
//       config.defaultRepo = repoPath;
//       config.defaultPath = repoPath;
//       try {
//         const repoContextPath = path.join(repoPath, ".repo-context.json");
//         const context = JSON.parse(fs.readFileSync(repoContextPath, "utf-8"));
//         setRepoFiles(context);
//         setResponse(`🗂 Repo Files Loaded (${context.length} total):\n` +
//           context.map((f: any, i: number) => `${i + 1}. ${f.path}`).join("\n") +
//           "\nType /use <number> to select a file.");
//       } catch (e) {
//         setResponse("❌ Failed to load repo context.");
//       }
//       setInput("");
//       return;
//     }

//     if (trimmedInput.startsWith("/use ")) {
//       const number = parseInt(trimmedInput.replace("/use ", "").trim(), 10);
//       if (!isNaN(number) && number > 0 && number <= repoFiles.length) {
//         setSelectedFileIndex(number - 1);
//         setResponse(`📄 Selected File: ${repoFiles[number - 1].path}`);
//       } else {
//         setResponse("❌ Invalid file number.");
//       }
//       setInput("");
//       return;
//     }

//     let userContent = trimmedInput;

//     const fallbackCommandMatch = trimmedInput.match(/^\/(gherkin|summarize|review)$/i);
//     const explicitCommandMatch = trimmedInput.match(/^\/(gherkin|summarize|review)\s+(.+)/i);

//     if (config?.defaultRepo) {
//       const repoContextPath = path.join(config.defaultRepo, ".repo-context.json");
//       try {
//         const repoFiles = JSON.parse(fs.readFileSync(repoContextPath, "utf-8"));

//         if (explicitCommandMatch) {
//           const [, command, filename] = explicitCommandMatch;
//           const matchedFile = repoFiles.find((f: any) => f.path.endsWith(filename.trim()));
//           if (!matchedFile) {
//             setResponse(`❌ File \"${filename}\" not found in repo context.`);
//             setInput("");
//             return;
//           }
//           userContent = `Here is the content of ${matchedFile.path} from the repo:\n\n${matchedFile.content.slice(0, 3000)}\n\nNow: ${command} the code.`;
//         } else if (fallbackCommandMatch && selectedFile) {
//           userContent = `Here is the content of ${selectedFile.path} from the repo:\n\n${selectedFile.content.slice(0, 3000)}\n\nNow: ${fallbackCommandMatch[1]} the code.`;
//         } else if (fallbackCommandMatch) {
//           setResponse("❌ No file selected. Use /use <number> to pick one.");
//           setInput("");
//           return;
//         }
//       } catch (e) {
//         console.warn("⚠️ Repo context missing or failed to load:", e.message);
//       }
//     }

//     setThinking(true);
//     setInput("");
//     const start = Date.now();
//     const newMessages = [...messages, { role: "user", content: userContent }];
//     setMessages(newMessages);

//     try {
//       const res = await fetch(`${config.apiBaseUrl}/chat/completions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${config.apiKey}`
//         },
//         body: JSON.stringify({
//           model,
//           messages: newMessages,
//           temperature: 0.2,
//           stream: false
//         })
//       });

//       if (!res.ok) throw new Error(`API Error: ${await res.text()}`);

//       const data = await res.json();
//       const assistantReply = data.choices?.[0]?.message?.content || "No reply.";
//       const tokens = data.usage?.total_tokens || null;
//       const end = Date.now();

//       setThinking(false);
//       setResponse(assistantReply);
//       setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);
//       setTokensUsed(tokens);
//       setTimeTaken(Math.round((end - start) / 1000));

//       const updatedHistory = [...history, { prompt: trimmedInput, response: assistantReply }];
//       setHistory(updatedHistory);
//       fs.writeFileSync(historyFilePath, JSON.stringify(updatedHistory, null, 2));
//     } catch (error) {
//       setThinking(false);
//       console.error("🚨 Error:", error);
//       setResponse("❌ Error: Failed to get response from LMStudio.");
//     }
//   };

//   return (
//     <Box flexDirection="column" padding={1} width="80%">
//       <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
//         <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
//         <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
//         {selectedFile && (
//           <Text color="yellow">📄 Selected File: {selectedFile.path}</Text>
//         )}
//       </Box>

//       <Box marginBottom={1} flexDirection="column" borderStyle="classic" borderColor="yellow" width="80%" padding={1} alignSelf="center">
//         <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
//         <Text>🛠️ Model: {model}</Text>
//         <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
//       </Box>

//       {Array.isArray(predefinedPrompts) && predefinedPrompts.length > 0 && (
//         <Box marginBottom={1} flexDirection="column" borderStyle="classic" borderColor="magenta" width="80%" padding={1} alignSelf="center">
//           <Text color="magentaBright">🧠 Predefined Prompts:</Text>
//           {predefinedPrompts.map((prompt, idx) => (
//             <Text key={idx} color="yellow">- {prompt}</Text>
//           ))}
//         </Box>
//       )}

//       {response && (
//         <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="green" width="80%" paddingX={1} alignSelf="center">
//           <Text color="magentaBright">💬 Assistant Response:</Text>
//           <Text>{response}</Text>
//           {tokensUsed !== null && <Text color="cyan">Tokens: {tokensUsed} | Time: {timeTaken}s</Text>}
//         </Box>
//       )}

//       {!thinking && (
//         <Box flexDirection="column" width="80%" alignSelf="center" marginTop={1}>
//           <Box borderStyle="round" borderColor="blue" paddingX={1}>
//             <TextInput
//               value={input}
//               onChange={setInput}
//               onSubmit={handleSubmit}
//               placeholder="Type your question here"
//               focus
//             />
//           </Box>
//           <Box marginTop={1}>
//             <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/history</Text> or <Text color="red">/clear</Text></Text>
//           </Box>
//         </Box>
//       )}

//       {thinking && (
//         <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>
//       )}
//     </Box>
//   );
// };
