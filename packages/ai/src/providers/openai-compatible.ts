import type {
  ChatMessage,
  ChatOptions,
  EmbedOptions,
  ModelProvider,
} from "../types.js";

/**
 * Generic client for any OpenAI-compatible API (DeepSeek, Moonshot, vLLM,
 * LM Studio, Ollama's /v1, etc.). Configure via constructor or per-call options.
 */
export class OpenAICompatibleProvider implements ModelProvider {
  private baseUrl: string;
  private apiKey?: string;

  constructor(
    baseUrl: string = (typeof process !== "undefined" &&
      process.env?.OPENAI_COMPATIBLE_BASE_URL) ||
      "http://localhost:11434/v1",
    apiKey: string | undefined = (typeof process !== "undefined" &&
      process.env?.OPENAI_COMPATIBLE_API_KEY) ||
      undefined,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private headers(overrideKey?: string): Record<string, string> {
    const key = overrideKey ?? this.apiKey;
    return {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    };
  }

  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
    const base = (opts.baseUrl ?? this.baseUrl).replace(/\/$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: this.headers(opts.apiKey),
      body: JSON.stringify({
        model: opts.model ?? "gpt-4o-mini",
        messages,
        temperature: opts.temperature ?? 0.2,
        stream: false,
      }),
    });
    if (!res.ok) {
      throw new Error(
        `OpenAI-compatible chat failed: ${res.status} ${await res.text()}`,
      );
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? "";
  }

  async embed(input: string[], opts: EmbedOptions = {}): Promise<number[][]> {
    const base = (opts.baseUrl ?? this.baseUrl).replace(/\/$/, "");
    const res = await fetch(`${base}/embeddings`, {
      method: "POST",
      headers: this.headers(opts.apiKey),
      body: JSON.stringify({
        model: opts.model ?? "text-embedding-3-small",
        input,
      }),
    });
    if (!res.ok) {
      throw new Error(
        `OpenAI-compatible embeddings failed: ${res.status} ${await res.text()}`,
      );
    }
    const data = (await res.json()) as { data?: { embedding: number[] }[] };
    return (data.data ?? []).map((d) => d.embedding);
  }
}
