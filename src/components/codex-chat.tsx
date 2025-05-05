// // File: src/components/codex-chat.tsx

// import React, { useState, useEffect } from "react";
// import { Box, Text } from "ink";
// import TextInput from "ink-text-input";
// import Spinner from "ink-spinner";
// import fs from "fs";
// import path from "path";
// import fetch from "node-fetch";
// import {
//   getHistoryFilePath,
//   ensureHistoryFileExists,
//   loadHistoryCache
// } from "../utils/ensureHistoryFileExists";
// import { updateContextFromRepo } from "../utils/repo-loader";

// interface CodexChatProps {
//   initialPrompt: string;
//   model: string;
//   predefinedPrompts: string[];
//   config: {
//     apiBaseUrl: string;
//     apiKey: string;
//     defaultRepo: string;
//     defaultModel: string;
//     defaultPath: string;
//   };
// }

// interface Message {
//   role: "system" | "user" | "assistant";
//   content: string;
// }

// export const CodexChat: React.FC<CodexChatProps> = ({
//   initialPrompt,
//   model,
//   predefinedPrompts = [],
//   config
// }) => {
//   const [input, setInput] = useState<string>(initialPrompt || "");
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "system",
//       content: "You are a helpful coding assistant."
//     }
//   ]);
//   const [thinking, setThinking] = useState<boolean>(false);
//   const [response, setResponse] = useState<string>("");
//   const [tokensUsed, setTokensUsed] = useState<number | null>(null);
//   const [timeTaken, setTimeTaken] = useState<number | null>(null);
//   const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);

//   useEffect(() => {
//     const history = loadHistoryCache();
//     setHistory(history);
//   }, []);

//   const handleSubmit = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput) return;

//     const historyFilePath = getHistoryFilePath();
//     await ensureHistoryFileExists(historyFilePath);

//     if (trimmedInput === "/clear") {
//       setResponse("");
//       setInput("");
//       return;
//     }

//     if (trimmedInput === "/clear history") {
//       fs.writeFileSync(historyFilePath, JSON.stringify([]));
//       setHistory([]);
//       setResponse("🧹 History cleared.");
//       setInput("");
//       return;
//     }

//     if (trimmedInput === "/history") {
//       const history = loadHistoryCache();
//       const historyOutput = history.length
//         ? `🕓 ${history.length} items in history:\n` +
//           history.map((entry, i) => `${i + 1}. ${entry.prompt}`).join("\n") +
//           "\n\nType `/recall <number>` to view that entry."
//         : "No history yet.";
//       setResponse(historyOutput);
//       setInput("");
//       return;
//     }

//     if (/^\/recall\s+\d+/.test(trimmedInput)) {
//       const index = parseInt(trimmedInput.replace("/recall", "").trim(), 10) - 1;
//       if (isNaN(index) || index < 0 || index >= history.length) {
//         setResponse("❌ Invalid history item number.");
//         setInput("");
//         return;
//       }
//       const entry = history[index];
//       setResponse(`🧠 Recalled Prompt:\n${entry.prompt}\n\n💬 Response:\n${entry.response}`);
//       setInput("");
//       return;
//     }

//     if (trimmedInput.startsWith("/repo ")) {
//       const repoPath = trimmedInput.replace("/repo ", "").trim();
//       updateContextFromRepo(repoPath);
//       config.defaultRepo = repoPath;
//       config.defaultPath = repoPath;
//       setInput("");
//       setResponse(`📁 Repo path updated to ${repoPath}\n🔄 Context is now active and will be used for all /commands and prompts.`);
//       return;
//     }

//     let userContent = trimmedInput;

//     if (config?.defaultRepo) {
//       const repoContextPath = path.join(config.defaultRepo, ".repo-context.json");
//       try {
//         const repoFiles = JSON.parse(fs.readFileSync(repoContextPath, "utf-8"));

//         const match = trimmedInput.match(/^\/(gherkin|summarize|review)\s+(.+)/i);
//         if (match) {
//           const [, command, filename] = match;
//           const matchedFile = repoFiles.find((f: any) => f.path.endsWith(filename.trim()));
//           if (!matchedFile) {
//             setResponse(`❌ File \"${filename}\" not found in repo context. Please provide a valid filename.`);
//             setInput("");
//             return;
//           }
//           userContent = `Here is the content of ${matchedFile.path} from the repo:\n\n${matchedFile.content.slice(0, 3000)}\n\nNow: ${command} the code.`;
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
//       setResponse("❌ Error: Failed to get response from LMStudio. Check if LM Studio is running and reachable.");
//     }
//   };

//   return (
//     <Box flexDirection="column" padding={1} width="80%">
//       <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
//         <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
//         <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
//       </Box>

//       <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="yellow" width="80%" padding={1} alignSelf="center">
//         <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
//         <Text>🛠️ Model: {model || config?.defaultModel || "N/A"}</Text>
//         <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
//         <Text color="cyanBright">📎 Context will be used for all /commands and prompts this session</Text>
//       </Box>

//       {Array.isArray(predefinedPrompts) && predefinedPrompts.length > 0 && (
//         <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="magenta" width="80%" padding={1} alignSelf="center">
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
//             <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/history</Text>, <Text color="red">/recall</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear history</Text></Text>
//           </Box>
//         </Box>
//       )}

//       {thinking && (
//         <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>
//       )}
//     </Box>
//   );
// };




// File: src/components/codex-chat.tsx

import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { getHistoryFilePath, ensureHistoryFileExists } from "../utils/ensureHistoryFileExists";

function generateRepoContext(repoPath: string, contextFile: string) {
  const files: { path: string; content: string }[] = [];
  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath, "utf-8").slice(0, 5000);
        files.push({ path: fullPath.replace(repoPath + "/", ""), content });
      }
    }
  };
  walk(repoPath);
  fs.writeFileSync(contextFile, JSON.stringify(files, null, 2));
  return files;
}

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

export const CodexChat: React.FC<CodexChatProps> = ({ initialPrompt, model, predefinedPrompts = [], config }) => {
  const [input, setInput] = useState(initialPrompt || "");
  const [messages, setMessages] = useState<Message[]>([{ role: "system", content: "You are a helpful coding assistant." }]);
  const [thinking, setThinking] = useState(false);
  const [response, setResponse] = useState("");
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [repoFiles, setRepoFiles] = useState<string[]>(() => {
    try {
      const cached = fs.readFileSync(".repo-cache.json", "utf-8");
      const { paths } = JSON.parse(cached);
      return paths || [];
    } catch {
      return [];
    }
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const historyFilePath = getHistoryFilePath();

  useEffect(() => { ensureHistoryFileExists(historyFilePath); }, []);
  useEffect(() => {
    const parts = input.trim().split(" ");
    if (parts.length >= 2 && ["/summarize", "/generate", "/gherkin", "/review"].includes(parts[0])) {
      const partial = parts.slice(1).join(" ").toLowerCase();
      const filtered = repoFiles.filter(f => f.toLowerCase().includes(partial));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [input, repoFiles]);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (trimmedInput === "/clear") {
      setResponse("");
      setInput("");
      return;
    }
    if (trimmedInput === "/clear-history") {
      fs.writeFileSync(historyFilePath, JSON.stringify([]));
      setInput("");
      return;
    }
    if (trimmedInput === "/history") {
      try {
        const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
        const output = history.length
          ? `📜 Prompt History (${history.length} items):\n` +
            history.map((h: any, i: number) => `${i + 1}. ${h.prompt}`).join("\n") +
            "\n\n🔢 Type `/load <number>` to reload that entry."
          : "No history yet.";
        setResponse(output);
      } catch (e) {
        setResponse("Failed to load history.");
      }
      setInput("");
      return;
    }
    if (trimmedInput.startsWith("/load ")) {
      const index = parseInt(trimmedInput.split(" ")[1]);
      const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
      const entry = history[index - 1];
      if (entry) {
        setResponse(`🧠 Recalled Prompt:\n${entry.prompt}\n\n💬 Response:\n${entry.response}`);
      } else {
        setResponse("❌ Invalid history entry.");
      }
      setInput("");
      return;
    }
    if (trimmedInput.startsWith("/repo ")) {
      const repoPathInput = trimmedInput.replace("/repo ", "").trim();
      let repoPath = repoPathInput;
      try {
        if (repoPathInput.startsWith("http")) {
          const tmpPath = `/tmp/codeassist-repo-${Date.now()}`;
          execSync(`git clone ${repoPathInput} ${tmpPath}`);
          repoPath = tmpPath;
        } else if (!fs.existsSync(repoPathInput)) {
          throw new Error("Local path does not exist.");
        }
        const contextFile = path.join(repoPath, ".repo-context.json");
        const fileData = generateRepoContext(repoPath, contextFile);
        const paths = fileData.map(f => f.path);
        setRepoFiles(paths);
        fs.writeFileSync(".repo-cache.json", JSON.stringify({ paths }, null, 2));
        config.defaultRepo = repoPath;
        config.defaultPath = repoPath;
        setResponse(`📁 Repo path updated to ${repoPath}\n📎 Context loaded with ${fileData.length} files.\n✅ You can now use commands like /gherkin, /summarize, /generate etc., and they will use this repo context.`);
        setInput("");
        return;
      } catch (err: any) {
        setResponse(`❌ Failed to set repo context: ${err.message}`);
        setInput("");
        return;
      }
    }

    let newMessages: Message[];
    if (["/summarize", "/gherkin", "/review", "/generate"].some(cmd => trimmedInput.startsWith(cmd))) {
      const command = trimmedInput.split(" ")[0];
      const fileArg = trimmedInput.replace(command, "").trim();
      const contextFile = path.join(config.defaultRepo, ".repo-context.json");
      const contextData = JSON.parse(fs.readFileSync(contextFile, "utf-8"));

      if (!fileArg) {
        const joinedContent = contextData.map((f: any) => `File: ${f.path}\n\n${f.content}`).join("\n\n");
        newMessages = [...messages, {
          role: "user",
          content: `Please ${command.slice(1)} the entire repository including all components and interactions.\n\n${joinedContent}`,
        }];
      } else {
        const match = contextData.find((f: any) => f.path.toLowerCase().includes(fileArg.toLowerCase()));
        if (match) {
          newMessages = [...messages, {
            role: "user",
            content: `Please ${command.slice(1)} the following file: ${match.path}\n\n${match.content}`,
          }];
        } else {
          setResponse(`❌ File not found for ${command.slice(1)}: ${fileArg}`);
          setInput("");
          return;
        }
      }
    } else {
      newMessages = [...messages, { role: "user", content: input }];
    }

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
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: newMessages,
          temperature: 0.2,
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
    } catch (error) {
      setThinking(false);
      console.error("🚨 Error:", error);
      setResponse("❌ Failed to get response from LMStudio. Check if LMStudio is running and reachable.");
    }
  };

  return (
    <Box flexDirection="column" padding={1} width="80%">
      <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
        <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
        <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
      </Box>
      <Box marginBottom={1} flexDirection="column" borderStyle="classic" borderColor="yellow" width="80%" padding={1} alignSelf="center">
        <Text>📦 Default Repo: {config?.defaultRepo || "N/A"}</Text>
        <Text>🛠️ Model: {model}</Text>
        <Text>📂 Path: {config?.defaultPath || "N/A"}</Text>
      </Box>
      {Array.isArray(predefinedPrompts) && predefinedPrompts.length > 0 && (
        <Box marginBottom={1} flexDirection="column" borderStyle="classic" borderColor="magenta" width="80%" padding={1} alignSelf="center">
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
            <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} placeholder="Type your question here" focus />
          </Box>
          {suggestions.length > 0 && (
            <Box flexDirection="column" paddingLeft={2}>
              <Text color="gray">Suggestions:</Text>
              {suggestions.map((file, i) => (
                <Text key={i} color="blue">{file}</Text>
              ))}
            </Box>
          )}
          <Box marginTop={1}>
            <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/repo</Text>, <Text color="red">/history</Text>, <Text color="red">/load</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear-history</Text></Text>
          </Box>
        </Box>
      )}
      {thinking && <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>}
    </Box>
  );
};

