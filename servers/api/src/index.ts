import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { chat } from "./routes/chat.js";
import { notes } from "./routes/notes.js";
import { search } from "./routes/search.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/notes", notes);
app.route("/search", search);
app.route("/chat", chat);

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Lumen API listening on http://localhost:${info.port}`);
});

export { app };
