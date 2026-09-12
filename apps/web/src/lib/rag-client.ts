/**
 * Browser-side glue to the AI package. For the MVP this runs the mock/in-memory
 * RAG index directly in the browser. Point these at servers/api later for a real
 * backend by swapping the implementations.
 */
import {
  RagIndex,
  answerQuestion,
  getModelProfile,
  listModels,
  type ModelProfile,
} from "@lumen/ai";

const index = new RagIndex();

export function models(): ModelProfile[] {
  return listModels();
}

export async function reindex(noteId: string, content: string): Promise<void> {
  await index.indexNote(noteId, content);
}

export async function ask(
  question: string,
  modelId: string,
): Promise<{ answer: string; sources: string[] }> {
  const profile = getModelProfile(modelId);
  const results = await index.searchNotes(question, 5, profile);
  const chunks = results.map((r) => r.chunk);
  const answer = await answerQuestion(question, chunks, profile);
  return { answer, sources: chunks };
}
