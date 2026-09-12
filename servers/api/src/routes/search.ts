import { Hono } from "hono";
import { getModelProfile } from "@lumen/ai";
import { rag } from "../store.js";

export const search = new Hono();

search.post("/", async (c) => {
  const body = await c.req.json<{ query?: string; topK?: number; model?: string }>();
  if (!body.query) return c.json({ error: "query is required" }, 400);
  const profile = body.model ? getModelProfile(body.model) : undefined;
  const results = await rag.searchNotes(body.query, body.topK ?? 5, profile);
  return c.json({ results });
});
