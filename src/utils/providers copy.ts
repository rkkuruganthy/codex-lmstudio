export const providers: Record<
  string,
  { name: string; baseURL: string; envKey: string }
> = {
  openai: {
    name: "OpenAI",
    baseURL: process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
    envKey: "OPENAI_API_KEY",
  },
  lmstudio: {
    name: "LM Studio",
    baseURL: process.env.LMSTUDIO_API_BASE_URL || "http://localhost:1234/v1",
    envKey: "LMSTUDIO_API_KEY", // You don't really need an API key for LM Studio, dummy value is fine
  },
  openrouter: {
    name: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1",
    envKey: "OPENROUTER_API_KEY",
  },
  gemini: {
    name: "Gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    envKey: "GEMINI_API_KEY",
  },
  ollama: {
    name: "Ollama",
    baseURL: "http://localhost:11434/v1",
    envKey: "OLLAMA_API_KEY",
  },
  mistral: {
    name: "Mistral",
    baseURL: "https://api.mistral.ai/v1",
    envKey: "MISTRAL_API_KEY",
  },
  deepseek: {
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com",
    envKey: "DEEPSEEK_API_KEY",
  },
  xai: {
    name: "xAI",
    baseURL: "https://api.x.ai/v1",
    envKey: "XAI_API_KEY",
  },
  groq: {
    name: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    envKey: "GROQ_API_KEY",
  },
};
