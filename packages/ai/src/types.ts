export type Provider = "ollama" | "openai-compatible";

export interface HardwareTier {
  tag: string;
  vram_gb: number;
  note: string;
}

/** A model family profile, mirroring configs/models/*.yaml. */
export interface ModelProfile {
  id: string;
  name: string;
  family: string;
  provider: Provider;
  tags: string[];
  default_tag: string;
  context_window: number;
  license: string;
  strengths: string[];
  hardware_tiers?: Record<string, HardwareTier>;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  /** Concrete model tag, e.g. "qwen3:8b". Falls back to the profile default. */
  model?: string;
  temperature?: number;
  baseUrl?: string;
  apiKey?: string;
}

export interface EmbedOptions {
  model?: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface SearchResult {
  noteId: string;
  chunk: string;
  score: number;
}

export interface ModelProvider {
  chat(messages: ChatMessage[], opts?: ChatOptions): Promise<string>;
  embed(input: string[], opts?: EmbedOptions): Promise<number[][]>;
}
