# API

The Lumen API server (`servers/api`) is a small [Hono](https://hono.dev) app. All
request/response bodies are JSON. Base URL defaults to `http://localhost:8787`.

> MVP note: storage is in-memory and search/chat use the mock RAG pipeline in
> `packages/ai`. Shapes are stable; back ends will change underneath.

## Health

### `GET /health`
Returns `{ "status": "ok" }`.

## Notes

### `GET /notes`
List all notes.

**200**
```json
[
  {
    "id": "n_abc123",
    "title": "Welcome to Lumen",
    "content": "# Welcome...",
    "tags": ["intro"],
    "links": ["Chinese LLMs"],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `GET /notes/:id`
Fetch one note. **404** if not found.

### `POST /notes`
Create a note.

**Request**
```json
{ "title": "My note", "content": "Body with [[wikilinks]]", "tags": ["idea"] }
```
**201** returns the created `Note`.

### `PUT /notes/:id`
Update a note. Body is a partial `Note` (`title`, `content`, `tags`). Returns the
updated `Note`; **404** if not found.

### `DELETE /notes/:id`
Delete a note. **204** on success; **404** if not found.

## Search

### `POST /search`
Semantic search over indexed notes.

**Request**
```json
{ "query": "how do Chinese LLMs compare", "topK": 5, "model": "qwen3:8b" }
```
**200**
```json
{
  "results": [
    {
      "noteId": "n_abc123",
      "chunk": "DeepSeek-R1 is strong at reasoning...",
      "score": 0.82
    }
  ]
}
```

## Chat (RAG Q&A)

### `POST /chat`
Ask a question; the server retrieves relevant chunks and asks the selected model.

**Request**
```json
{
  "question": "Which local model is best for math?",
  "topK": 5,
  "model": "deepseek-r1:32b"
}
```
**200**
```json
{
  "answer": "For math-heavy reasoning, DeepSeek-R1 ...",
  "sources": [
    { "noteId": "n_abc123", "chunk": "DeepSeek-R1 is strong at reasoning...", "score": 0.82 }
  ]
}
```

## Errors

Errors use conventional HTTP status codes with a JSON body:

```json
{ "error": "Note not found" }
```

## Data types

```ts
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

interface SearchResult {
  noteId: string;
  chunk: string;
  score: number;
}
```
