# 🚀 CodeAssist CLI – Local Coding Assistant

A world-class local coding assistant built using **LMStudio** + **Qwen2.5 Coder**  
Powered by ❤️ open-source LLMs – no API keys, no cloud, fully offline!

---

## ✨ What is CodeAssist?

`CodeAssist` is a terminal-based CLI app that provides an AI coding assistant using **local LLMs** through LMStudio. It's built with React Ink and supports multi-turn chat, slash commands, and predefined prompts — all while running 100% locally.

---

## 📦 Project Structure

```
codex-cli/
├── bin/
│   └── setup.sh                 # CLI alias installer
├── src/
│   ├── components/
│   │   ├── codex-app.tsx       # App initializer
│   │   └── codex-chat.tsx      # Chat logic + UI
│   ├── utils/
│   │   └── config.ts           # Reads from config.json
│   └── cli-lmstudio.tsx        # Main CLI entry
├── codex-config.json           # Model + repo config
└── package.json
```

---

## ⚙️ Prerequisites

- **Node.js ≥ 20**
- **npm ≥ 8**
- **LMStudio installed & running**
- **LLM loaded in LMStudio** (e.g., `qwen2.5-coder-14b-instruct`)

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/codex-lmstudio.git
cd codex-lmstudio/codex/codex-cli
```

### 2. Install Dependencies

```bash
npm install
```

Ensure these are included (they already are in `package.json`):

```bash
npm install ink ink-text-input ink-spinner chalk dotenv node-fetch commander uuid
```

### 3. Create CLI Shortcut (Optional)

```bash
bash bin/setup.sh
```

This will add a shortcut so you can just type `CodeAssist` from anywhere!

---

## 🔨 Build the App

```bash
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
```

---

## 🚀 Run CodeAssist

Start LMStudio and load a model (e.g., Qwen2.5).  
Then simply run:

```bash
CodeAssist
```

Or, if alias not configured:

```bash
bash bin/codex-local.sh
```

---

## 🧠 Features

- ✅ Fully local LLM execution (via LMStudio)
- ✅ Clean terminal UI using React Ink
- ✅ One-line prompt or multi-line with `Shift+Enter`
- ✅ Spinner while thinking
- ✅ Token + Time counter after response
- ✅ Predefined prompt suggestions
- ✅ Slash commands for actions

---

## ⚡ Supported Slash Commands

| Command         | Action                          |
|-----------------|----------------------------------|
| `/clear`        | Clears chat history              |
| `/help`         | Displays help and shortcuts      |
| `/summarize`    | Summarizes your conversation     |
| `/fix-errors`   | Suggests fixes for given code    |
| `/review-code`  | Reviews your pasted code         |
| `/generate-unit-tests` | Generates unit tests     |
| `/optimize-code` | Optimizes a given function      |

---

## 💡 Predefined Prompts (UI)

These appear below your prompt box:

- Generate unit tests  
- Review my code  
- Optimize this algorithm  
- Suggest improvements  
- Explain this code  
- Write documentation  
- Find security vulnerabilities  
- Summarize the code  

---

## 📥 Example Usage

```
🧠 CodeAssist CLI (by Ravi)
Built with ❤️ LMStudio + Qwen2.5

📦 Default Repo: https://github.com/rkkuruganthy/codex-local
🛠️ Model: qwen2.5-coder-14b-instruct
📂 Path: /Users/you/projects/

💬 Type your coding question here...
> How do I create a REST API in FastAPI?
```

---

## 🛠 Environment Config

Set via `codex-local.sh`:

```bash
export PROVIDER=lmstudio
export OPENAI_API_BASE_URL=http://localhost:1234/v1
export LMSTUDIO_API_KEY=sk-local
```

No real API key required!

---

## 📜 Roadmap

### ✅ Phase 1 – MVP
- [x] Interactive CLI input
- [x] Spinner
- [x] Config-driven setup
- [x] Slash commands
- [x] Predefined prompts
- [x] Token usage and response time

### 🚧 Phase 2 – Coming Soon
- [ ] Session caching (local JSON)
- [ ] Persist history
- [ ] Dropdown-based prompt completion

---

## 👨‍💻 Author

Created and maintained by **Ravi Kuruganthy**  
Built with ❤️ to support the modern engineering community.

---

## ✅ Production-Ready

Clone → Install → Build → Run in minutes.  
Perfect for **junior engineers**, hackathons, or local GenAI exploration!

---
