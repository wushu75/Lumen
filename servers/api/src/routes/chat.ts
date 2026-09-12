import { Hono } from "hono";
import { answerQuestion, getModelProfile } from "@lumen/ai";
import { rag } from "../store.js";

export const chat = new Hono();

chat.post("/", async (c) => {
  const body = await c.req.json<{ question?: string; topK?: number; model?: string }>();
  if (!body.question) return c.json({ error: "question is required" }, 400);
  const profile = body.model ? getModelProfile(body.model) : undefined;
  const results = await rag.searchNotes(body.question, body.topK ?? 5, profile);
  const answer = await answerQuestion(
    body.question,
    results.map((r) => r.chunk),
    profile,
  );
  return c.json({ answer, sources: results });
});
