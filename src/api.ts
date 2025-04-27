import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const API_URL = process.env.OPENAI_API_BASE_URL || "http://localhost:1234/v1";

export async function generateCode(messages: Message[], model: string = "qwen2.5-coder-14b-instruct"): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LMSTUDIO_API_KEY || "sk-local"}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.2,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
      throw new Error(`Failed to call LM Studio API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating code:", error);
    throw error;
  }
}
