# Overview

## What is Lumen?

Lumen is an open-source, local-first, AI-native knowledge base. Concretely:

- **Local-first.** Your notes are plain `.md` files in a folder you own (a *vault*),
  indexed by a local SQLite database. There is no required cloud account and no
  lock-in. You can edit the files with any other tool, back them up with git, or sync
  them with your own tooling.
- **Markdown + graph.** Notes are Markdown with `[[wikilinks]]` and tags. Lumen builds
  a link graph so you can navigate and visualize how ideas connect.
- **AI-native.** Semantic search, RAG-based Q&A over your own notes, summarization, and
  link suggestions are built in — not a paid add-on.
- **Model-flexible.** Runs against local models via Ollama, with first-class support
  for Chinese open models (Qwen, DeepSeek, GLM, Yi, InternLM) as well as Western ones
  (Llama, Mistral). Any OpenAI-compatible endpoint also works.

## Who is it for?

- People who love Obsidian's *"it's just Markdown files"* philosophy but want AI
  features that run locally.
- Researchers, students, and engineers who want to **ask their notes questions** and
  get grounded, cited answers without shipping their data to a third party.
- Self-hosters and privacy-conscious users who want full control of both data and model.
- Users in and beyond the Chinese-speaking world who want strong multilingual local
  models as first-class citizens.

## How does it compare?

| Capability                | Lumen                     | Obsidian                    | Notion                    |
| ------------------------- | ------------------------- | --------------------------- | ------------------------- |
| Storage                   | Local `.md` + SQLite      | Local `.md`                 | Cloud (proprietary)       |
| Data ownership            | Full, plain files         | Full, plain files           | Vendor-controlled         |
| Built-in local AI / RAG   | Yes (Ollama)              | Via community plugins       | Cloud AI (paid)           |
| Chinese open models       | First-class               | Depends on plugin           | No                        |
| Self-hosting              | Yes (Docker)              | N/A (desktop app)           | No                        |
| License                   | MIT                       | Proprietary (free tier)     | Proprietary               |
| Graph view                | Yes                       | Yes                         | Limited                   |

Lumen's bet: the *data model* (owned Markdown + graph) should be as open as Obsidian's,
while the *intelligence layer* (RAG, agents, semantic search) should be built in,
local by default, and model-agnostic.

## Non-goals (for the MVP)

- Real-time multi-user collaboration.
- A hosted SaaS offering. (Self-hosting is the supported path.)
- A plugin marketplace. Extension points exist; a marketplace is future work.
