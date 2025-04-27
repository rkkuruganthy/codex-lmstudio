// Location: src/utils/session.ts

import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SessionOptions {
  model?: string;
}

export interface Session {
  id: string;
  model: string;
  history: Message[];
  send: (input: string) => Promise<string>;
}

export function createSession(options: SessionOptions = {}): Session {
  const id = uuidv4();
  const model = options.model || "qwen2.5-coder-14b-instruct";

  async function send(input: string): Promise<string> {
    const apiUrl = process.env.OPENAI_API_BASE_URL || "http://localhost:1234/v1";
    const apiKey = process.env.LMSTUDIO_API_KEY || "sk-local";

    const history = session.history;
    const messages = [
      ...history,
      { role: "user", content: input }
    ];

    console.log("📩 Sending to LMStudio:", {
      apiUrl,
      model,
      messages
    });

    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.2,
          stream: false,
        }),
      });

      console.log("📥 LMStudio Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❗ LMStudio Error Response Text:", errorText);
        throw new Error(`LMStudio Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ LMStudio Response JSON received");

      const assistantReply = data.choices?.[0]?.message?.content;

      if (!assistantReply) {
        throw new Error("❗ Assistant reply missing in LMStudio response!");
      }

      session.history.push({ role: "user", content: input });
      session.history.push({ role: "assistant", content: assistantReply });

      return assistantReply;

    } catch (err: any) {
      console.error("🚨 Fetch from LMStudio failed:", err.message);
      throw err;
    }
  }

  const session: Session = {
    id,
    model,
    history: [
      { role: "system", content: "You are a helpful coding assistant." }
    ],
    send,
  };

  return session;
}
