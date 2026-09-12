import type { ModelProfile } from "./types.js";

/**
 * MVP model registry. These profiles mirror configs/models/*.yaml. For the MVP
 * they are hard-coded so the package has no filesystem/YAML dependency and works
 * in the browser; a loader can populate this from YAML at build/runtime later.
 */
const PROFILES: ModelProfile[] = [
  {
    id: "qwen3",
    name: "Qwen3",
    family: "Qwen",
    provider: "ollama",
    tags: ["qwen3:8b", "qwen3:14b", "qwen3:32b"],
    default_tag: "qwen3:8b",
    context_window: 32768,
    license: "Apache-2.0",
    strengths: ["multilingual", "coding", "general chat"],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    family: "DeepSeek",
    provider: "ollama",
    tags: ["deepseek-r1:7b", "deepseek-r1:14b", "deepseek-r1:32b"],
    default_tag: "deepseek-r1:7b",
    context_window: 65536,
    license: "MIT",
    strengths: ["reasoning", "math", "code"],
  },
  {
    id: "glm4",
    name: "GLM-4",
    family: "GLM",
    provider: "ollama",
    tags: ["glm4:9b"],
    default_tag: "glm4:9b",
    context_window: 131072,
    license: "MIT",
    strengths: ["general chat", "tool use", "agents"],
  },
  {
    id: "yi",
    name: "Yi",
    family: "Yi",
    provider: "ollama",
    tags: ["yi:6b", "yi:9b", "yi:34b"],
    default_tag: "yi:9b",
    context_window: 32768,
    license: "Apache-2.0",
    strengths: ["long context", "bilingual", "general chat"],
  },
  {
    id: "internlm2",
    name: "InternLM2",
    family: "InternLM",
    provider: "ollama",
    tags: ["internlm2:7b", "internlm2:20b"],
    default_tag: "internlm2:7b",
    context_window: 32768,
    license: "Apache-2.0",
    strengths: ["reasoning", "research", "general chat"],
  },
  {
    id: "llama3.2",
    name: "Llama 3.2",
    family: "Llama",
    provider: "ollama",
    tags: ["llama3.2:1b", "llama3.2:3b"],
    default_tag: "llama3.2:3b",
    context_window: 131072,
    license: "Llama-Community",
    strengths: ["lightweight", "general chat", "broad ecosystem"],
  },
  {
    id: "mistral",
    name: "Mistral",
    family: "Mistral",
    provider: "ollama",
    tags: ["mistral:7b"],
    default_tag: "mistral:7b",
    context_window: 32768,
    license: "Apache-2.0",
    strengths: ["efficient", "general chat", "coding"],
  },
];

export function listModels(): ModelProfile[] {
  return PROFILES;
}

export function getModelProfile(id: string): ModelProfile | undefined {
  return PROFILES.find((p) => p.id === id || p.tags.includes(id));
}

/** Flat list of every concrete tag, handy for a model selector dropdown. */
export function listModelTags(): { id: string; tag: string; name: string }[] {
  return PROFILES.flatMap((p) =>
    p.tags.map((tag) => ({ id: p.id, tag, name: `${p.name} (${tag})` })),
  );
}
