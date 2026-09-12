import { OllamaProvider } from "./providers/ollama.js";
import type { ModelProfile, ModelProvider } from "./types.js";

/**
 * Split text into overlapping character-based chunks. Simple and deterministic —
 * good enough for the MVP; swap for a token-aware splitter later.
 */
export function chunkText(
  text: string,
  chunkSize = 800,
  overlap = 120,
): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (clean.length <= chunkSize) return clean ? [clean] : [];
  const step = Math.max(1, chunkSize - overlap);
  const chunks: string[] = [];
  for (let start = 0; start < clean.length; start += step) {
    chunks.push(clean.slice(start, start + chunkSize));
    if (start + chunkSize >= clean.length) break;
  }
  return chunks;
}

/** Embed chunks using the given profile's provider (Ollama by default). */
export async function embedChunks(
  chunks: string[],
  _modelProfile?: ModelProfile,
  provider: ModelProvider = new OllamaProvider(),
  embedModel = "nomic-embed-text",
): Promise<number[][]> {
  if (chunks.length === 0) return [];
  return provider.embed(chunks, { model: embedModel });
}

/** Cosine similarity between two equal-length vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
