import { Hono } from "hono";
import { rag, vault } from "../store.js";

export const notes = new Hono();

notes.get("/", (c) => c.json(vault.list()));

notes.get("/:id", (c) => {
  const note = vault.get(c.req.param("id"));
  return note ? c.json(note) : c.json({ error: "Note not found" }, 404);
});

notes.post("/", async (c) => {
  const body = await c.req.json<{ title?: string; content?: string; tags?: string[] }>();
  if (!body.title) return c.json({ error: "title is required" }, 400);
  const note = vault.add({ title: body.title, content: body.content, tags: body.tags });
  await rag.indexNote(note.id, note.content);
  return c.json(note, 201);
});

notes.put("/:id", async (c) => {
  const body = await c.req.json<{ title?: string; content?: string; tags?: string[] }>();
  const note = vault.update(c.req.param("id"), body);
  if (!note) return c.json({ error: "Note not found" }, 404);
  await rag.indexNote(note.id, note.content);
  return c.json(note);
});

notes.delete("/:id", (c) => {
  const ok = vault.delete(c.req.param("id"));
  return ok ? c.body(null, 204) : c.json({ error: "Note not found" }, 404);
});
