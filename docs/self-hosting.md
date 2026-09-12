# Self-hosting

Lumen runs entirely on your own hardware. This guide covers Ollama setup, environment
configuration, and running the stack with Docker Compose.

## 1. Install Ollama

Ollama is the default local LLM runtime.

- **macOS / Windows:** download the installer from <https://ollama.com/download>.
- **Linux:**

  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

By default Ollama listens on `http://localhost:11434` and exposes an OpenAI-compatible
API at `http://localhost:11434/v1`.

## 2. Pull models

At minimum you need one chat model and one embedding model:

```bash
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

More options (and hardware guidance) are in [`models.md`](models.md), e.g.:

```bash
ollama pull deepseek-r1:32b
ollama pull glm4:9b
ollama pull llama3.2:3b
```

## 3. Configure environment variables

Copy the example file and edit as needed:

```bash
cp .env.example .env
```

| Variable                     | Default                     | Purpose                                    |
| ---------------------------- | --------------------------- | ------------------------------------------ |
| `OLLAMA_BASE_URL`            | `http://localhost:11434`    | Where Lumen reaches Ollama                 |
| `LUMEN_CHAT_MODEL`           | `qwen3:8b`                  | Default chat model                         |
| `LUMEN_EMBED_MODEL`          | `nomic-embed-text`          | Default embedding model                    |
| `PORT`                       | `8787`                      | API server port                            |
| `OPENAI_COMPATIBLE_BASE_URL` | (unset)                     | Optional hosted OpenAI-compatible endpoint |
| `OPENAI_COMPATIBLE_API_KEY`  | (unset)                     | API key for the hosted endpoint            |
| `DATABASE_URL`               | (unset)                     | Postgres/pgvector connection (future)      |

### Using a hosted provider instead of Ollama

Any OpenAI-compatible API works. For example, DeepSeek's platform:

```bash
OPENAI_COMPATIBLE_BASE_URL=https://api.deepseek.com/v1
OPENAI_COMPATIBLE_API_KEY=sk-your-key
```

Lumen never sends your notes anywhere unless you configure and select a cloud provider.

## 4. Run with Docker Compose

From the repository root:

```bash
docker compose -f configs/docker/docker-compose.yml up --build
```

This starts:

- **`api`** — the Lumen REST server (built from `servers/api`), on `PORT` (default 8787).
- **`db`** — Postgres with the `pgvector` extension, for when you move off in-memory
  storage. A named volume persists data.
- **`ollama`** *(optional profile)* — containerized Ollama. On many setups it is simpler
  and faster to run Ollama **on the host** and let the API reach it via
  `host.docker.internal:11434`. See the comments in the compose file.

### Ollama: host vs container

- **Host Ollama (recommended on macOS/Windows, and for GPU on Linux):** leave the
  `ollama` service out (don't pass its profile) and set
  `OLLAMA_BASE_URL=http://host.docker.internal:11434`.
- **Container Ollama:** start it with the profile and set
  `OLLAMA_BASE_URL=http://ollama:11434`:

  ```bash
  docker compose -f configs/docker/docker-compose.yml --profile ollama up --build
  ```

## 5. Verify

```bash
curl http://localhost:8787/health
curl http://localhost:8787/notes
```

## Backups

Because notes are Markdown files (plus a SQLite index), backup is just copying your
vault directory — or committing it to a private git repo. The Postgres volume (vectors)
can be rebuilt from notes by re-indexing, so it is a cache, not a source of truth.
