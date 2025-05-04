src/components/codex-app.tsx
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import chalk from 'chalk';
import { getDependenciesFromRepo } from '../utils/dependency-mapper';
import { loadRepoContext } from '../utils/repo-loader';
import { generateGherkinFromRepo } from '../utils/gherkin-generator';
import * as lms from 'lmstudio';

interface CodexAppProps {
  initialRepoPath?: string;
}

export function CodexApp({ initialRepoPath = '' }: CodexAppProps) {
  const [repoPath, setRepoPath] = useState(initialRepoPath);
  const [output, setOutput] = useState('Type a slash command to begin...');
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [assistantResponse, setAssistantResponse] = useState('');

  useEffect(() => {
    if (initialRepoPath) {
      setOutput(`📁 Repo loaded: ${initialRepoPath}`);
    }
  }, [initialRepoPath]);

  useInput(async (input, key) => {
    if (key.return) {
      const trimmed = inputValue.trim();
      setHistory(prev => [...prev, trimmed]);
      setInputValue('');

      if (trimmed.startsWith('/repo ')) {
        const path = trimmed.replace('/repo ', '').trim();
        try {
          await loadRepoContext(path);
          setRepoPath(path);
          setOutput(`✅ Repository loaded from: ${path}`);
        } catch (err: any) {
          setOutput(`❌ Error loading repo: ${err.message}`);
        }
      } else if (trimmed === '/dependencies') {
        if (!repoPath) {
          setOutput('⚠️ Please load a repository first with `/repo <path>`');
          return;
        }
        const result = await getDependenciesFromRepo(repoPath);
        const depsText = Object.entries(result)
          .map(([file, deps]) => `📄 ${file} -> [${deps.join(', ')}]`)
          .join('\n');
        setOutput(depsText || 'ℹ️ No dependencies found.');
      } else if (trimmed === '/gherkin') {
        if (!repoPath) {
          setOutput('⚠️ Please load a repository first with `/repo <path>`');
          return;
        }
        const scenarios = await generateGherkinFromRepo(repoPath);
        setOutput(scenarios || 'ℹ️ No Gherkin scenarios generated.');
      } else if (trimmed === '/clear') {
        setHistory([]);
        setOutput('🧹 Cleared conversation.');
        setAssistantResponse('');
      } else {
        try {
          setOutput('🧠 Thinking...');
          const chatResponse = await lms.chat({
            model: 'qwen2.5-coder-14b-instruct',
            messages: [
              { role: 'system', content: 'You are a helpful engineering assistant.' },
              { role: 'user', content: trimmed }
            ]
          });

          setAssistantResponse(chatResponse.choices[0].message.content);
          setOutput('✅ Response received.');
        } catch (err: any) {
          setOutput(`❌ Error: ${err.message}`);
        }
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Gradient name="morning">
          <BigText text="CodeAssist" />
        </Gradient>
      </Box>

      <Text color="gray">Built with ❤️ by Ravi using LMStudio & Qwen2.5!</Text>

      <Box borderStyle="round" borderColor="yellow" padding={1} marginY={1} flexDirection="column">
        <Text>📦 Default Repo: {repoPath || 'N/A'}</Text>
        <Text>🧠 Model: qwen2.5-coder-14b-instruct</Text>
        <Text>📝 Path: {repoPath || 'N/A'}</Text>
      </Box>

      <Box borderStyle="round" borderColor="magenta" padding={1} flexDirection="column">
        <Text color="magentaBright">🧠 Predefined Prompts:</Text>
        <Text dimColor>- /repo /path/to/repo</Text>
        <Text dimColor>- /dependencies</Text>
        <Text dimColor>- /gherkin</Text>
        <Text dimColor>- /clear</Text>
      </Box>

      {assistantResponse && (
        <Box borderStyle="round" borderColor="green" marginTop={1} flexDirection="column">
          <Text color="white">💬 <Text color="cyan">Assistant Response:</Text></Text>
          <Text>{assistantResponse}</Text>
        </Box>
      )}

      <Box marginTop={1}><Text>{output}</Text></Box>

      <Box marginTop={1}>
        <Text color="green">💬 </Text>
        <TextInput value={inputValue} onChange={setInputValue} placeholder="Type your question here..." />
      </Box>

      <Text dimColor>
        Press <Text color="green">Enter</Text> to send | <Text color="red">/clear</Text> to reset
      </Text>
    </Box>
  );
}


// File: src/components/codex-chat.tsx

// import React, { useState, useEffect } from "react";
// import { Box, Text } from "ink";
// import TextInput from "ink-text-input";
// import Spinner from "ink-spinner";
// import fetch from "node-fetch";
// import fs from "fs";
// import path from "path";
// import { getHistoryFilePath, ensureHistoryFileExists } from "../utils/ensureHistoryFileExists";

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
//   const [messages, setMessages] = useState<Message[]>([{
//     role: "system",
//     content: "You are a helpful coding assistant."
//   }]);
//   const [thinking, setThinking] = useState<boolean>(false);
//   const [response, setResponse] = useState<string>("");
//   const [tokensUsed, setTokensUsed] = useState<number | null>(null);
//   const [timeTaken, setTimeTaken] = useState<number | null>(null);

//   const handleSubmit = async () => {
//     const trimmedInput = input.trim();
//     const historyFilePath = getHistoryFilePath();
//     await ensureHistoryFileExists(historyFilePath);

//     if (!trimmedInput) return;

//     if (trimmedInput === "/clear") {
//       setResponse("");
//       setInput("");
//       setTokensUsed(null);
//       setTimeTaken(null);
//       return;
//     }

//     if (trimmedInput === "/clear-history") {
//       fs.writeFileSync(historyFilePath, JSON.stringify([]));
//       setResponse("🧹 Cleared all previous history.");
//       setInput("");
//       return;
//     }

//     if (trimmedInput === "/history") {
//       try {
//         const historyData = fs.readFileSync(historyFilePath, "utf-8");
//         const history = JSON.parse(historyData);
//         const historyOutput = history.length
//           ? `📜 Prompt History (${history.length} items):\n` +
//             history.map((entry: any, i: number) => `${i + 1}. ${entry.prompt} → ${entry.response}`).join("\n")
//           : "No history yet.";
//         setResponse(historyOutput);
//       } catch (e) {
//         setResponse("Failed to load history.");
//       }
//       setInput("");
//       return;
//     }

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setThinking(true);
//     setInput("");

//     const start = Date.now();
//     const apiUrl = config.apiBaseUrl || "http://localhost:1234/v1";
//     const apiKey = config.apiKey || "sk-local";

//     try {
//       const res = await fetch(`${apiUrl}/chat/completions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//           model,
//           messages: newMessages,
//           temperature: 0.2,
//           stream: false,
//         }),
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

//       const history = JSON.parse(fs.readFileSync(historyFilePath, "utf-8"));
//       history.push({ prompt: trimmedInput, response: assistantReply });
//       fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
//     } catch (error) {
//       setThinking(false);
//       setResponse("❌ Error: Failed to get response from LMStudio. Check if LM Studio is running and reachable.");
//     }
//   };

//   return (
//     <Box flexDirection="column" padding={1} width="80%">
//       <Box marginBottom={1} flexDirection="column" borderStyle="round" borderColor="cyan" width="80%" alignSelf="center">
//         <Text color="cyanBright">🚀 CodeAssist CLI (by Ravi)</Text>
//         <Text color="green">Built with ❤️ LMStudio + Qwen2.5</Text>
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
//             <Text>Press <Text color="green">Enter</Text> to send | <Text color="red">/history</Text>, <Text color="red">/clear</Text>, <Text color="red">/clear-history</Text></Text>
//           </Box>
//         </Box>
//       )}

//       {thinking && (
//         <Box marginTop={1}><Text color="green"><Spinner type="dots" /> Thinking...</Text></Box>
//       )}
//     </Box>
//   );
// };
