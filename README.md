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

Developed and customized by [Ravi Kuruganthy](https://github.com/rkkuruganthy) 🚀\
Guided by OpenAI Codex and LMStudio open ecosystems.

---

This is created as Code Assistant to support multiple languages and most importantly to run 100% local

🚀 CodeAssist CLI – Local Coding Assistant
A world-class local coding assistant built using LMStudio + Qwen2.5 Coder!
Powered by ❤️ open-source LLMs, no API keys needed, fully offline.

📦 Project Structure

Folder/File	Description
/bin/setup.sh	Automates alias setup for CLI (CodeAssist)
/src/cli-lmstudio.tsx	Main entrypoint for running local LLM queries
/src/components/codex-chat.tsx	Interactive UI to chat with the model
/codex-config.json	Default settings (repo paths, models)
🚀 Quick Start for New Developers
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/<your-username>/codex-lmstudio.git
cd codex-lmstudio/codex/codex-cli
2. Install Node Modules
bash
Copy
Edit
npm install
3. Setup CodeAssist Shortcut
Run the provided setup.sh to create an easy CLI alias:

bash
Copy
Edit
bash bin/setup.sh
This will automatically add:

bash
Copy
Edit
alias CodeAssist="/path/to/your/codex-local.sh"
✅ You can now just type CodeAssist anywhere to launch it!

4. Build the Project
bash
Copy
Edit
rm -rf dist
esbuild src/cli-lmstudio.tsx --bundle --platform=node --format=esm --outfile=dist/cli.js --external:react --external:ink --external:dotenv --external:chalk --external:node-fetch --external:commander --external:node:events --external:node:fs --external:node:path --sourcemap
5. Run CodeAssist
bash
Copy
Edit
CodeAssist
✨ Features
🎨 New UI Enhancements: Clean, organized, world-class CLI interface

🧠 Interactive Text Input: Beautiful textbox for queries

🧹 Clear Functionality: /clear command resets the conversation

🔥 Predefined Prompts: Quick access to common actions like unit testing, code review, summarization

🕑 Tokens & Time Display: Shows how many tokens were used and time taken

🌟 Animated Thinking Spinner: Real-time feedback while generating response

🚀 One-Command Startup: Setup and use CodeAssist CLI easily

🛠 Slash Commands Supported

Command	Action
/clear	Clear chat and reset
/help	Show available commands
/summarize	Summarize conversation
/fix-errors	Suggest fixes for code
/review-code	Review the code
/generate-unit-tests	Generate unit tests
/optimize-code	Optimize algorithm
📋 Example Usage
bash
Copy
Edit
User: /generate-unit-tests
Assistant: Sure! Please paste the function you want unit tests for.
⚡ Setup Notes
You need Node.js v18+ installed.

LMStudio must be running locally.

Tested with Qwen2.5 Coder 14B Instruct (GGUF) model.

📜 Future Enhancements (Planned)
 Add session history saving

 Streamed responses for longer answers

 Theme customization (Dark/Light)

👨‍💻 Contributing
Fork this repo

Create your feature branch (git checkout -b feature/my-awesome-feature)

Push your branch (git push origin feature/my-awesome-feature)

Open a Pull Request ✅

💬 Questions?
Feel free to open issues or enhancements!
We are building a truly powerful Local First Coding Assistant 🚀

🧠 Built with the intent to support Modern Engineering Community -  Ravi ❤️

✅ This version is production-ready for any new developer to clone and start in minutes.
