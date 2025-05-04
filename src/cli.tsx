//File: src/cli.tsx

import React from "react";
import { render } from "ink";
import { CodexApp } from "./components/codex-app";
import { CodexChat as CodexApp } from "./components/codex-chat";
import { finalConfig } from "./utils/config";

const appState = {
  repoPath: finalConfig.defaultRepo,
  repoFiles: []
};

render(
  <CodexApp
    initialPrompt=""
    model={finalConfig.defaultModel}
    predefinedPrompts={[
      "Generate unit tests",
      "Review my code",
      "Optimize this algorithm",
      "Suggest improvements",
      "Explain this code",
      "Write documentation",
      "Find security vulnerabilities",
      "Summarize the code",
      "/repo /path/to/repo",
      "/dependencies",
      "/gherkin",
      "/clear",
      "/history"
    ]}
    config={finalConfig}
  />
);




// // File: src/cli.tsx

// import React from "react";
// import { render } from "ink";
// import { CodexChat } from "./components/codex-chat";
// import { finalConfig } from "./utils/config";

// const appState = {
//   repoPath: finalConfig.defaultRepo,
//   repoFiles: []
// };

// render(
//   <CodexChat
//     initialPrompt=""
//     model={finalConfig.defaultModel}
//     predefinedPrompts={[
//       "Generate unit tests",
//       "Review my code",
//       "Optimize this algorithm",
//       "Suggest improvements",
//       "Explain this code",
//       "Write documentation",
//       "Find security vulnerabilities",
//       "Summarize the code",
//       "/repo /path/to/repo",
//       "/dependencies",
//       "/gherkin",
//       "/clear",
//       "/history"
//     ]}
//     config={finalConfig}
//   />
// );
