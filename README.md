# CodeAssist CLI

A world-class **local coding assistant** powered by **LMStudio** and **open-source LLMs** like Qwen2.5. No cloud. No API keys. 100% local execution.

---

## ✨ Features

- 🧠 **Interactive Text UI** using React Ink
- 🛠 Works with any LMStudio-supported model (Qwen, LLaMA, Mistral, Yi, etc.)
- 🔁 Multi-turn chat with full assistant memory
- ⚡ Slash Commands (`/clear`, `/summarize`, `/fix-errors`, etc.)
- 💡 Predefined prompts (unit test generation, code review...)
- 🎛 Configurable defaults (model, repo, path) via `codex-config.json`
- 💬 Token usage and time display for every response
- 🚫 No OpenAI, no network calls — Fully local

---

## 🖥 Prerequisites

- Node.js ≥ 20
- npm ≥ 8
- LMStudio installed and running at `http://localhost:1234`
- A supported model (e.g., `qwen2.5-coder-14b-instruct`) loaded into LMStudio

---

## 📦 Folder Structure

```bash
codex-cli/
├── bin/
│   └── setup.sh              # One-time CLI setup script
├── src/
│   ├── cli-lmstudio.tsx      # Main entrypoint
│   ├── components/
│   │   ├── codex-app.tsx     # App wrapper
│   │   └── codex-chat.tsx    # Terminal UI logic
│   └── utils/
│       └── config.ts         # Config loader
├── codex-config.json         # Local defaults for model, path, repo
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/rkkuruganthy/codex-lmstudio.git
cd codex-lmstudio/codex/codex-cli
npm install
```

### 2. One-time Setup

```bash
bash bin/setup.sh
```

✅ This sets up a CLI alias `CodeAssist` available from any terminal window.

---

## 🧠 Usage

Make sure LMStudio is running and a model is loaded.

Then run:

```bash
CodeAssist
```

You’ll see:
- Predefined prompts section
- Input field to type your question
- Slash command help

---

## 🎯 Supported Slash Commands

```
/clear         -> Clears conversation
/help          -> Displays help menu
/summarize     -> Summarizes the session
/fix-errors    -> Suggests code fixes
/review-code   -> Code review summary
/generate-unit-tests -> Create unit tests
```

---

## 🔁 Example Flow

```bash
User: /generate-unit-tests
Assistant: Sure! Paste the function you'd like tests for.
```

---

## 🛠 Configuration (Optional)

Edit the `codex-config.json` to set default repo, model, and path:

```json
{
  "defaultRepo": "https://github.com/rkkuruganthy/codex-lmstudio",
  "defaultModel": "qwen2.5-coder-14b-instruct",
  "defaultPath": "/Users/ravikuruganthy/myApps"
}
```

---

## 📈 Future Enhancements

- Session history saving
- Streamed responses
- Dark/light CLI themes
- Dynamic model switching

---

## 🙌 Credits

Created by **Ravi Kuruganthy** ❤️

Inspired by the vision of building a developer-first, local-first, privacy-first coding assistant that works in any enterprise or air-gapped setup.

---

## ✅ Status

This version is **production-ready** and tested across multiple M1/M2/M3 Macs.

New engineers can get started in under 2 minutes.

---

Happy coding! 🚀
