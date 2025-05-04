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


---

### ✅ Phase 2: Productivity & Persistence Features

- 💾 **Session Caching**: Logs each prompt + response to `history/session-history.json`
- 🧭 **/history View**: Lets users recall past interactions in structured format
- 🧹 **/clear Resets All**: Clears input and history in a clean, error-free manner
- 💡 **Improved Text Input**: Respects placeholder and newlines without breaking layout
- 🧱 **Modular Utilities**:
  - `ensureHistoryFileExists.ts`
  - `getHistoryFilePath.ts`
### ✅ Phase 3: Repo Context + Advanced Commands

- 📂 **/repo <path>**: Loads a local or remote Git repo and extracts file context
- 🔍 **/use <number>**: Select a specific file for focus from loaded context
- 🧹 **/clear-history**: Clears only history, preserving context
- ✨ **UI Restored**: Matches original design with fixed border rendering
---

## ⚙️ Prerequisites

- ✅ Node.js ≥ 20.x
- ✅ `esbuild` (globally installed): `npm install -g esbuild`
- ✅ LMStudio running locally at `http://localhost:1234`
- ✅ Local model downloaded (e.g., Qwen2.5 Coder GGUF)

---

## 🚀 Quick Setup

### LinkedIn Content Analyzer

The LinkedIn Content Analyzer is a Streamlit-based application that allows you to:

1. Scrape LinkedIn posts for any user
2. Store posts locally
3. Ask questions about the stored content using LLM

#### Setup Instructions

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Streamlit app:
```bash
streamlit run src/app.py
```

#### Features

- Scrape LinkedIn posts for any user
- Store posts locally with timestamps
- Ask questions about the stored content
- Semantic search using vector embeddings
- Clean web interface with Streamlit

#### Usage

TBD
## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rkkuruganthy/codex-lmstudio.git
cd codex-lmstudio
npm install
2. Build the CLI

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

bash bin/setup.sh
source ~/.zshrc   # or ~/.bashrc based on your shell
Now just type:
CodeAssist
💬 How to Use
Type your coding query or predefined command

Use /clear to reset the assistant

Use /history to view previous prompts and answers

Example:

> /generate-unit-tests

> def is_prime(n): ...
🔧 codex-config.json
Customize default context here:

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