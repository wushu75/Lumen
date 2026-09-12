import { describe, expect, it } from "vitest";
import {
  RagIndex,
  chunkText,
  cosineSimilarity,
  getModelProfile,
  listModels,
} from "@lumen/ai";

describe("ai: chunking", () => {
  it("returns a single chunk for short text", () => {
    expect(chunkText("short")).toEqual(["short"]);
  });

  it("splits long text into overlapping chunks", () => {
    const text = "a".repeat(2000);
    const chunks = chunkText(text, 800, 120);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].length).toBe(800);
  });
});

describe("ai: model registry", () => {
  it("lists models and looks them up by id or tag", () => {
    expect(listModels().length).toBeGreaterThan(0);
    expect(getModelProfile("qwen3")?.name).toBe("Qwen3");
    expect(getModelProfile("deepseek-r1:32b")?.family).toBe("DeepSeek");
  });
});

describe("ai: mock RAG flow", () => {
  it("cosine similarity of identical vectors is 1", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });

  it("indexes a note and searches it (keyword fallback, no Ollama)", async () => {
    const rag = new RagIndex();
    await rag.indexNote("n1", "DeepSeek-R1 is strong at reasoning and math.");
    const results = await rag.searchNotes("reasoning math", 3);
    expect(results[0]?.noteId).toBe("n1");
    expect(results[0]?.score).toBeGreaterThan(0);
  });
});
