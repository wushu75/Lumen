# Models

Lumen is model-agnostic. It ships with profiles for popular **Chinese** and **Western**
open models and runs them locally through [Ollama](https://ollama.com), or against any
OpenAI-compatible API.

> ⚠️ **Tags change.** Model families release new sizes and quantizations frequently, and
> exact Ollama tags (e.g. `qwen3:8b`) are updated over time. Always confirm the current
> tag on <https://ollama.com/library> before pulling. The tags below reflect common
> naming at the time of writing and are used as defaults in `configs/models/*.yaml`.

## Chinese open models

| Family    | Notable for                              | License        | Ollama family |
| --------- | ---------------------------------------- | -------------- | ------------- |
| **Qwen**  | Strong multilingual (esp. CN/EN), coding | Apache-2.0     | `qwen3`       |
| **DeepSeek** | Reasoning, math, code (R1 line)       | MIT            | `deepseek-r1` |
| **GLM**   | Balanced chat, tool use, agents          | MIT / open     | `glm4`        |
| **Yi**    | Long-context, bilingual                   | Apache-2.0     | `yi`          |
| **InternLM** | Research-friendly, solid reasoning     | Apache-2.0     | `internlm2`   |

## Western open models

| Family      | Notable for                     | License        | Ollama family |
| ----------- | ------------------------------- | -------------- | ------------- |
| **Llama**   | Broad ecosystem, small sizes    | Llama Community | `llama3.2`   |
| **Mistral** | Efficient, strong 7B baseline   | Apache-2.0     | `mistral`     |

## Hardware-based recommendations

Rough guidance. VRAM (or unified memory on Apple Silicon) matters more than system RAM
for GPU inference; the RAM figures below assume CPU/laptop-class or Apple Silicon.

| Your machine                 | Chat model suggestion          | Embeddings          |
| ---------------------------- | ------------------------------ | ------------------- |
| ~8 GB RAM / low-end          | `qwen3:8b` (quantized) or `llama3.2:3b` | `nomic-embed-text` |
| 16 GB RAM                    | `qwen3:14b`, `deepseek-r1:14b` | `nomic-embed-text`  |
| 24 GB+ RAM / good GPU        | `qwen3:32b`, `deepseek-r1:32b`, `glm4:9b` | `nomic-embed-text` / `bge-m3` |
| Tiny / testing only          | `llama3.2:1b`, `qwen3:1.7b`    | `all-minilm`        |

Reasoning-heavy Q&A benefits from the DeepSeek-R1 line; general note chat and
multilingual work are a sweet spot for Qwen3.

## Exact Ollama commands

```bash
# Embeddings (pick one; nomic-embed-text is a good default)
ollama pull nomic-embed-text
ollama pull bge-m3

# Chinese models
ollama pull qwen3:8b
ollama pull qwen3:14b
ollama pull qwen3:32b
ollama pull deepseek-r1:7b
ollama pull deepseek-r1:14b
ollama pull deepseek-r1:32b
ollama pull glm4:9b
ollama pull yi:9b
ollama pull internlm2:7b

# Western models
ollama pull llama3.2:3b
ollama pull mistral:7b
```

Verify a model responds:

```bash
ollama run qwen3:8b "Say hello in Chinese and English."
```

## How Lumen selects a model

- The web app's **model selector** lists profiles from `packages/ai` (backed by
  `configs/models/*.yaml`).
- `packages/ai/src/models.ts` exposes `listModels()` and `getModelProfile(id)`.
- Defaults come from environment variables (`LUMEN_CHAT_MODEL`, `LUMEN_EMBED_MODEL`)
  — see `.env.example`.

## Licenses at a glance

- **Apache-2.0:** Qwen, Yi, InternLM, Mistral — permissive, commercial use allowed.
- **MIT:** DeepSeek-R1, GLM (model weights license varies by release — check the card).
- **Llama Community License:** Llama family — permissive but with its own terms; review
  before commercial use.

Always check the specific model card on Ollama / Hugging Face for the authoritative
license of the exact weights you pull.
