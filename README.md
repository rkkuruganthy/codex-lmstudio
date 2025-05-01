# 🚀 CodeAssist – Local Coding Assistant CLI

**CodeAssist** is a powerful, fully local coding assistant built with ❤️ using **LMStudio** and open-source models like **Qwen2.5 Coder**. Designed for speed, privacy, and flexibility, it requires no external APIs, making it ideal for enterprise and offline development environments.

> 🎯 **Mission**: Deliver a world-class, locally executable AI assistant that boosts developer productivity while maintaining full control over code and data.

---

## ✨ Highlights

### ✅ Built-in Phase 1 Capabilities

- ⚡ **100% Local**: All interactions run against locally hosted LLMs in LMStudio (no OpenAI API needed)
- 🧠 **Intelligent Assistant**: Responds to natural language queries with full multi-turn chat support
- 🗂️ **Contextual Awareness**: Reads default repo/model/path from a local `codex-config.json`
- 📌 **Predefined Prompts**:
  - Generate unit tests
  - Review my code
  - Optimize this algorithm
  - Suggest improvements
  - Explain this code
  - Write documentation
  - Find security vulnerabilities
  - Summarize the code
- ⏱️ **Feedback Metrics**: Displays token usage and response time
- 🧹 **Slash Commands**:
  - `/clear` – Reset the conversation
  - `/history` – View prior prompt/responses
- ⌨️ **Keyboard Shortcuts**:
  - `Enter` to send
  - `Shift+Enter` to add a new line (for multi-line prompts)

---

### ✅ Phase 2: Productivity & Persistence Features

- 💾 **Session Caching**: Logs each prompt + response to `history/session-history.json`
- 🧭 **/history View**: Lets users recall past interactions in structured format
- 🧹 **/clear Resets All**: Clears input and history in a clean, error-free manner
- 🔽 **Command Dropdown (WIP)**: Navigate predefined actions via arrow keys or mouse (coming soon)
- 💡 **Improved Text Input**: Respects placeholder and newlines without breaking layout
- 🧱 **Modular Utilities**:
  - `ensureHistoryFileExists.ts`
  - `getHistoryFilePath.ts`

---

## 📦 Folder Structure

codex-cli/ ├── bin/ │ └── codex-local.sh # CLI launcher script ├── src/ │ ├── components/ │ │ ├── codex-app.tsx # Top-level app container │ │ └── codex-chat.tsx # Core CLI interaction logic │ ├── utils/ │ │ ├── config.ts # Loads dynamic config │ │ ├── ensureHistoryFileExists.ts # History file bootstrap │ │ └── getHistoryFilePath.ts # Path resolution for history file │ └── cli-lmstudio.tsx # Main CLI entrypoint ├── history/ │ └── session-history.json # JSON log of user and assistant messages ├── codex-config.json # App-level defaults ├── package.json └── README.md

yaml
Copy
Edit

---

## ⚙️ Prerequisites

- ✅ Node.js ≥ 20.x
- ✅ `esbuild` (globally installed): `npm install -g esbuild`
- ✅ LMStudio running locally at `http://localhost:1234`
- ✅ Local model downloaded (e.g., Qwen2.5 Coder GGUF)

---

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rkkuruganthy/codex-lmstudio.git
cd codex-lmstudio
npm install
2. Build the CLI
bash
Copy
Edit
rm -rf dist
esbuild src/cli-lmstudio.tsx \
  --bundle \
  --platform=node \
  --format=esm \
  --outfile=dist/cli.js \
  --external:react \
  --external:ink \
  --external:dotenv \
  --external:chalk \
  --external:node-fetch \
  --external:commander \
  --external:node:events \
  --external:node:fs \
  --external:node:path \
  --sourcemap
3. Create CLI Shortcut
bash
Copy
Edit
bash bin/setup.sh
source ~/.zshrc   # or ~/.bashrc based on your shell
Now just type:

bash
Copy
Edit
CodeAssist
💬 How to Use
Type your coding query or predefined command

Use Shift+Enter to compose multi-line prompts

Use /clear to reset the assistant

Use /history to view previous prompts and answers

Example:

bash
Copy
Edit
> /generate-unit-tests

> def is_prime(n): ...
🔧 codex-config.json
Customize default context here:

json
Copy
Edit
{
  "defaultRepo": "https://github.com/rkkuruganthy/codex-lmstudio",
  "defaultModel": "qwen2.5-coder-14b-instruct",
  "defaultPath": "/Users/ravikuruganthy/myApps"
}
📜 Sample Commands
Slash Command	Description
/clear	Clears current input + history
/history	View logged prompt/response entries
/summarize	Summarize current conversation
/generate-unit-tests	Trigger unit test generation

🧠 Built For
Local-first AI development

Engineers working in secure environments

AI productivity without vendor lock-in

👨‍💻 Author
Developed by Ravi Kuruganthy
Built with a vision to empower modern developers with world-class local GenAI to