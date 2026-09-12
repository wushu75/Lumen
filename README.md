# Lumen

**Your open, AI-native second brain.**

Lumen is an open-source, **local-first** knowledge base: your notes live as plain
Markdown files on your own disk, backed by a local SQLite index, a link graph, and
semantic search. Nothing leaves your machine unless you decide it should. It is meant
to feel like Obsidian's ownership model with an AI layer built in from day one, not
bolted on.

Lumen is **AI-native**. Retrieval-augmented generation (RAG), semantic search,
summarization, automatic link suggestions, and agent hooks are first-class features.
You can ask questions about your own notes and get grounded answers with citations,
all running against a local model.

Lumen has **first-class support for Chinese open models** — Qwen, DeepSeek, GLM, Yi,
and InternLM — alongside Western models like Llama and Mistral. Everything runs through
[Ollama](https://ollama.com) locally, or against any OpenAI-compatible endpoint if you
prefer a hosted provider. It is MIT-licensed and designed to be easy to self-host.

> **Status:** early MVP scaffold. The pieces are wired together with in-memory /
> mock implementations so the whole app runs end-to-end; storage is designed to be
> swapped for SQLite + Postgres/pgvector without changing the public interfaces.

## Quickstart

Prerequisites: [Node.js](https://nodejs.org) 20+, [pnpm](https://pnpm.io) 9+,
[Ollama](https://ollama.com), and (optionally) Docker.

```bash
# 1. Install Ollama, then pull a chat model and an embedding model
ollama pull qwen3:8b
ollama pull nomic-embed-text

# 2. Clone and install
git clone https://github.com/wushu75/Lumen.git
cd Lumen
pnpm install

# 3. Seed a demo vault (optional)
pnpm seed

# 4. Run the web app (Vite dev server)
pnpm dev
# -> http://localhost:5173

# 5. In another terminal, run the API server
pnpm dev:api
# -> http://localhost:8787
```

Prefer containers? From the repo root:

```bash
cp .env.example .env
docker compose -f configs/docker/docker-compose.yml up
```

This brings up the API, a Postgres+pgvector database, and (optionally) Ollama.

## Documentation

- [`docs/overview.md`](docs/overview.md) — what Lumen is, who it's for, how it compares to Obsidian/Notion
- [`docs/architecture.md`](docs/architecture.md) — client, servers, DB, vector store, Ollama
- [`docs/models.md`](docs/models.md) — Chinese + Western model matrix, hardware tiers, Ollama commands
- [`docs/self-hosting.md`](docs/self-hosting.md) — Docker, Ollama config, environment variables
- [`docs/api.md`](docs/api.md) — notes, search, and chat endpoints

## Monorepo layout

```text
apps/web        Vite + React + TS front end
packages/core   vault, notes, links, graph, search interfaces
packages/editor Tiptap-based Markdown editor
packages/ai     RAG, embeddings, model providers (Ollama, OpenAI-compatible)
packages/ui     shared design-system components
servers/api     Hono REST server (notes, search, chat)
configs/models  per-family model profiles (YAML)
configs/docker  docker-compose + Dockerfile.api
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues and PRs welcome.

## License

[MIT](LICENSE) © Lumen contributors.
