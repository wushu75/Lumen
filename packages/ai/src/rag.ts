import { chunkText, cosineSimilarity, embedChunks } from "./embeddings.js";
import { OllamaProvider } from "./providers/ollama.js";
import type {
  ChatMessage,
  ModelProfile,
  ModelProvider,
  SearchResult,
} from "./types.js";

interface IndexedChunk {
  noteId: string;
  chunk: string;
  vector: number[];
}

/**
 * In-memory vector index. The public methods are the seam where a Postgres +
 * pgvector store will slot in later; callers do not need to change.
 */
export class RagIndex {
  private chunks: IndexedChunk[] = [];
  private provider: ModelProvider;
  private embedModel: string;

  constructor(
    provider: ModelProvider = new OllamaProvider(),
    embedModel = "nomic-embed-text",
  ) {
    this.provider = provider;
    this.embedModel = embedModel;
  }

  /** Index a note: chunk -> embed -> store. */
  async indexNote(
    noteId: string,
    content: string,
    _modelProfile?: ModelProfile,
  ): Promise<void> {
    const parts = chunkText(content);
    if (parts.length === 0) return;
    let vectors: number[][];
    try {
      vectors = await embedChunks(
        parts,
        _modelProfile,
        this.provider,
        this.embedModel,
      );
    } catch {
      // MVP fallback: if no embedding backend is reachable, store zero vectors so
      // the pipeline still runs end-to-end (search will just be uninformative).
      vectors = parts.map(() => []);
    }
    // Drop any previous chunks for this note (re-index semantics).
    this.chunks = this.chunks.filter((c) => c.noteId !== noteId);
    parts.forEach((chunk, i) => {
      this.chunks.push({ noteId, chunk, vector: vectors[i] ?? [] });
    });
  }

  /** Semantic search. Falls back to naive substring scoring without embeddings. */
  async searchNotes(
    query: string,
    topK = 5,
    _modelProfile?: ModelProfile,
  ): Promise<SearchResult[]> {
    if (this.chunks.length === 0) {
      return mockResults(query, topK);
    }
    let queryVec: number[] = [];
    try {
      [queryVec] = await this.provider.embed([query], {
        model: this.embedModel,
      });
    } catch {
      queryVec = [];
    }

    const scored = this.chunks.map((c) => {
      const score =
        queryVec.length && c.vector.length
          ? cosineSimilarity(queryVec, c.vector)
          : keywordScore(query, c.chunk);
      return { noteId: c.noteId, chunk: c.chunk, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

function keywordScore(query: string, chunk: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;
  const hay = chunk.toLowerCase();
  const hits = terms.filter((t) => hay.includes(t)).length;
  return hits / terms.length;
}

function mockResults(query: string, topK: number): SearchResult[] {
  return [
    {
      noteId: "demo",
      chunk: `No notes indexed yet. Once you add notes, results for "${query}" will appear here.`,
      score: 0,
    },
  ].slice(0, topK);
}

/**
 * Ask the chat model a question grounded in retrieved context chunks.
 */
export async function answerQuestion(
  question: string,
  contextChunks: string[],
  modelProfile?: ModelProfile,
  provider: ModelProvider = new OllamaProvider(),
): Promise<string> {
  const model = modelProfile?.default_tag ?? "qwen3:8b";
  const context = contextChunks.length
    ? contextChunks.map((c, i) => `[Source ${i + 1}]\n${c}`).join("\n\n")
    : "(no relevant notes found)";

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are Lumen, a helpful assistant answering questions using ONLY the " +
        "provided note excerpts. If the answer is not in the notes, say so. " +
        "Cite sources as [Source N].",
    },
    {
      role: "user",
      content: `Notes:\n${context}\n\nQuestion: ${question}`,
    },
  ];

  try {
    return await provider.chat(messages, { model });
  } catch (err) {
    return (
      `Could not reach the model (${model}). Is Ollama running at ` +
      `localhost:11434? Error: ${(err as Error).message}`
    );
  }
}
