# Architecture

Lumen is a TypeScript monorepo. The pieces are deliberately small and connected by
stable interfaces so that MVP backends (in-memory, mock) can be replaced by real ones
(SQLite, Postgres+pgvector) without touching callers.

## High-level diagram

```text
                    ┌─────────────────────────────────────────────┐
                    │                apps/web (React)             │
                    │  note list │ Tiptap editor │ Ask-my-notes   │
                    │            │               │ model selector │
                    └───────┬─────────────┬───────────────┬───────┘
                            │ uses        │ uses          │ HTTP
                   ┌────────▼───────┐ ┌───▼──────────┐    │
                   │ packages/core  │ │ packages/    │    │
                   │ vault / notes  │ │ editor       │    │
                   │ graph / links  │ │ (Tiptap +    │    │
                   └────────┬───────┘ │  Markdown)   │    │
                            │         └──────────────┘    │
                   ┌────────▼───────┐                     │
                   │ packages/ai    │                     │
                   │ RAG / embed /  │                     │
                   │ providers /    │                     │
                   │ model registry │                     │
                   └───┬────────┬───┘                     │
                       │        │                         │
        ┌──────────────▼─┐  ┌───▼───────────────┐  ┌──────▼───────────────┐
        │ Ollama          │  │ OpenAI-compatible │  │ servers/api (Hono)   │
        │ localhost:11434 │  │ endpoint (cloud)  │  │ /notes /search /chat │
        └─────────────────┘  └───────────────────┘  └──────┬───────────────┘
                                                            │
                                             ┌──────────────▼───────────────┐
                                             │ Postgres + pgvector (later)   │
                                             │ SQLite (local, later)         │
                                             └───────────────────────────────┘
```

## Components

### `apps/web` — client
Vite + React + TypeScript. Renders the two-column workspace (note list + editor),
the "Ask my notes" panel, and the model selector. In the MVP it talks to `packages/core`
and `packages/ai` directly (in-browser, mocked) and can optionally call `servers/api`.

### `packages/core` — vault & graph
Pure TypeScript domain layer: `Note` and `Vault` types, wikilink resolution, and graph
construction. Storage is behind an interface; the MVP uses an in-memory store, with
SQLite / OPFS planned.

### `packages/editor` — editing
Tiptap-based Markdown editor with import/export to Markdown strings and an extension
point for `[[wikilink]]` handling.

### `packages/ai` — intelligence
Model **providers** (`ollama`, `openai-compatible`), a **model registry** loaded from
`configs/models/*.yaml`, and a **RAG pipeline** (`chunkText`, `embedChunks`,
`indexNote`, `searchNotes`, `answerQuestion`). MVP vectors live in memory / JSON; the
interface is shaped for pgvector.

### `packages/ui` — design system
Shared React components (`Button`, `Input`, …) so the web app and future surfaces stay
visually consistent.

### `servers/api` — REST server
Hono server exposing `/notes`, `/search`, `/chat`. Uses `packages/core` and
`packages/ai` as libraries. In-memory storage for the MVP, Postgres-ready.

## Data flow: "Ask my notes"

1. User types a question in the web app and picks a model.
2. `packages/ai` embeds the query (via Ollama `/embeddings`).
3. `searchNotes` finds the top-k relevant chunks (MVP: mock/in-memory; later: pgvector).
4. `answerQuestion` sends the question + retrieved chunks to the chat model
   (Ollama `/v1/chat/completions`).
5. The grounded answer is returned to the UI.

## Storage roadmap

| Concern        | MVP                 | Next                         |
| -------------- | ------------------- | ---------------------------- |
| Note bodies    | in-memory / `.md`   | `.md` files + SQLite index   |
| Vectors        | in-memory / JSON    | Postgres + pgvector          |
| Sync           | none                | optional self-hosted sync    |
