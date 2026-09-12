import type {
  ChatMessage,
  ChatOptions,
  EmbedOptions,
  ModelProvider,
} from "../types.js";

const DEFAULT_BASE_URL =
  (typeof process !== "undefined" && process.env?.OLLAMA_BASE_URL) ||
  "http://localhost:11434";

/**
 * Ollama provider. Ollama exposes an OpenAI-compatible surface at `/v1`, which we
 * use for chat, plus the native `/api/embeddings` for embeddings.
 */
export class OllamaProvider implements ModelProvider {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
    const model = opts.model ?? "qwen3:8b";
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.2,
        stream: false,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ollama chat failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? "";
  }

  async embed(input: string[], opts: EmbedOptions = {}): Promise<number[][]> {
    const model = opts.model ?? "nomic-embed-text";
    const out: number[][] = [];
    // Ollama's native embeddings endpoint takes one prompt at a time.
    for (const prompt of input) {
      const res = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt }),
      });
      if (!res.ok) {
        throw new Error(
          `Ollama embeddings failed: ${res.status} ${await res.text()}`,
        );
      }
      const data = (await res.json()) as { embedding?: number[] };
      out.push(data.embedding ?? []);
    }
    return out;
  }
}
