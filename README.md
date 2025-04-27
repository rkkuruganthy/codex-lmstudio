# CodeAssist
Building an opensource project to integrate codex plugin to connect and run via LMStuido with the available models
# CodeAssist

> A local, lightweight Codex-like Terminal app powered by [LM Studio](https://lmstudio.ai/) and custom LLM models such as **Qwen2.5-Coder-14B-Instruct**.\
> 100% local execution. No OpenAI, no external API keys required!

---

## ✨ Features

- Local execution against LMStudio models
- Spinner shows while model thinks
- Assistant and User conversations displayed cleanly
- Full multi-turn chat supported
- Session ID generated per run
- Works with any LMStudio-supported LLM (Qwen, Mistral, Yi, Llama, etc.)
- Lightweight, fast, easy to extend

---

## 🛠 Architecture (Flow)

```plaintext
User Input ➔ Codex Terminal UI (React Ink) ➔ LMStudio Local Server ➔ Model Prediction ➔ Assistant Output
```

- CLI takes prompt
- Spinner shows while fetching
- Response displayed from assistant
- Input resets for next message

---

## 📋 Prerequisites

- Node.js ≥ 20
- npm ≥ 8 (or yarn / pnpm)
- LMStudio installed and running locally (e.g., on [http://localhost:1234](http://localhost:1234))
- A loaded model inside LMStudio (e.g., `qwen2.5-coder-14b-instruct`)

---

## ⚡ Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/codex-lmstudio.git
cd codex-lmstudio/codex/codex-cli
```

Install the required packages:

```bash
npm install
```

**Extra packages required** (already listed in package.json):

```bash
npm install ink-text-input ink-spinner uuid
```

---

## 🚀 Usage

Start LMStudio locally and load a model (e.g., Qwen2.5).\
Then run:

```bash
./codex-local.sh --prompt "Create a FastAPI app with two endpoints"
```

✅ You will see:

- Session ID printed
- "You:" your prompt
- Spinner "Thinking..."
- "Assistant:" reply after generation
- Input box to type your next question

Press `Ctrl+C` anytime to exit.

---

## 🌍 Environment Variables

Set up via `codex-local.sh` (already configured):

```bash
export PROVIDER=lmstudio
export OPENAI_API_BASE_URL=http://localhost:1234/v1
export LMSTUDIO_API_KEY=sk-local
```

- No real API key required. LMStudio uses dummy `sk-local`.

---

## 📁 Folder Structure

```plaintext
codex-cli/
├── bin/
│   └── codex-local.sh        # Script to run CLI
├── src/
│   ├── components/
│   │   ├── codex-app.tsx      # App container
│   │   └── codex-chat.tsx     # Chat UI logic
│   ├── utils/
│   │   └── session.ts         # Session ID and LMStudio connector
│   └── cli-lmstudio.tsx       # Main CLI entry point (NEW!)
├── package.json
└── README.md
```

---

## ⚧️ Future Enhancements (Optional)

- Cache previous prompts to speed up re-asking
- Save full chat sessions into timestamped `.txt` files
- Support multiple LMStudio models via dropdown
- Stream assistant tokens if LMStudio supports token streaming
- Add colorful themes (dark mode CLI!)

---

## 👨‍💻 Credits

Developed and customized by [@Ravi](https://github.com/rkkuruganthy) 🚀\
Guided by OpenAI Codex and LMStudio open ecosystems.

---

A Coding Assistant to support multiple languages and most importantly to run 100% local

 
