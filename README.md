# 💻 CodeAssist CLI

> Powered by LMStudio + Qwen2.5 | Built by Ravi Kuruganthy

---

## 📦 Overview
CodeAssist CLI is a local, intelligent coding assistant that:
- Runs completely offline using LMStudio
- Loads and understands full Git repositories
- Generates tests, documentation, Gherkin specs, and more
- Offers autocomplete for files based on repo context

---

## 🛠️ Setup

```bash
npm install
npm run build
node dist/cli.mjs
```

Make sure LMStudio is running and serving an LLM like `Qwen2.5-Coder-GGUF`.

---

## 🚀 Phase 3: Intelligent Repo-Aware Commands

### 📁 `/repo <path|url>`
- Load a local folder or GitHub repo (`.git`-cloned or via URL).
- Automatically scans the entire codebase and builds a context.
- File names are cached for suggestion and retrieval.
- Context is stored in `.repo-context.json` and `.repo-cache.json`.

```bash
/repo ./my-local-repo
/repo https://github.com/user/project
```

---

### 🤖 Context-Aware Commands

Commands like `/summarize`, `/generate`, `/gherkin`, and `/review` support:

| Feature                         | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| ✅ Optional filename            | `/generate unit tests auth.service.ts`                                     |
| ✅ Fallback to full-repo       | `/summarize` (summarizes the whole repo if no file is given)               |
| ✅ Live autocomplete           | As you type filenames, suggestions appear (up to 5 matches)                |
| ✅ Auto context injection       | Injects matched content into the prompt before calling the LLM             |

---

### 🧠 Session Memory & Prompt History

| Command            | Description                            |
|--------------------|----------------------------------------|
| `/history`         | View past prompts with index numbers   |
| `/load 3`          | Reload the 3rd prompt/response pair     |
| `/clear`           | Clear the current assistant response    |
| `/clear-history`   | Clear all historical interactions       |

---

## 🎥 Demo Suggestions (GIFs)

Embed demo `.gif` or `.webm` showing:

#### 🔹 1. Loading a repo
```bash
/repo https://github.com/user/microservice-demo
```

#### 🔹 2. Using smart autocomplete
```bash
/generate unit tests auth
# shows suggestions like:
# - authService.ts
# - authController.ts
```

#### 🔹 3. Summarizing full repo
```bash
/summarize
```

#### 🔹 4. History & recall
```bash
/history
/load 2
```

**Embed Example**:
```markdown
![CodeAssist CLI Demo](docs/demo-repo-context.gif)
```

---

## 📌 Coming Soon
- 🧠 Token budgeting & chunked summarization
- 🧪 Linting + static analysis commands
- 🗂️ Multi-repo memory slots
- 📈 CLI metrics panel (speed + token count)

---

## 👨‍💻 Author
**Ravi Kuruganthy** — Executive Director, JPMorgan Chase | 6x GenAI Patents | Platform Engineering Lead