/**
 * Seed a demo vault with a few notes about AI, Chinese LLMs, and Obsidian
 * alternatives. Run with:  pnpm seed
 */
import { Vault, buildGraph } from "@lumen/core";

const vault = new Vault();

vault.add({
  title: "Chinese LLMs",
  tags: ["ai", "models"],
  content:
    "# Chinese LLMs\n\n" +
    "Strong open models from China include [[Qwen]], [[DeepSeek]], GLM, Yi, and InternLM. " +
    "Qwen is known for multilingual and coding ability; DeepSeek-R1 excels at reasoning and math. " +
    "Most ship under permissive licenses (Apache-2.0 or MIT).",
});

vault.add({
  title: "Qwen",
  tags: ["ai", "models"],
  content:
    "# Qwen\n\n" +
    "Qwen3 is a multilingual model family, Apache-2.0 licensed. " +
    "Good tags for local use: qwen3:8b (low RAM), qwen3:32b (24GB+). " +
    "See [[Chinese LLMs]] for the wider landscape.",
});

vault.add({
  title: "DeepSeek",
  tags: ["ai", "models", "reasoning"],
  content:
    "# DeepSeek\n\n" +
    "DeepSeek-R1 is a reasoning-focused model (MIT). Try deepseek-r1:7b/14b/32b. " +
    "Great for math and step-by-step problems. Related: [[Chinese LLMs]].",
});

vault.add({
  title: "Obsidian alternatives",
  tags: ["pkm", "tools"],
  content:
    "# Obsidian alternatives\n\n" +
    "[[Lumen]] keeps Obsidian's local Markdown philosophy but adds built-in, local AI: " +
    "RAG over your notes, semantic search, and link suggestions. Others: Logseq, Anytype.",
});

vault.add({
  title: "Lumen",
  tags: ["pkm", "ai"],
  content:
    "# Lumen\n\n" +
    "An open, AI-native second brain. Local-first Markdown vault + graph + semantic search + agents. " +
    "First-class support for Chinese and Western open models via Ollama.",
});

const notes = vault.list();
const graph = buildGraph(notes);

console.log(`Seeded ${notes.length} demo notes:`);
for (const n of notes) console.log(`  - ${n.title} (links: ${n.links.join(", ") || "none"})`);
console.log("\nGraph edges (resolved):");
for (const [id, targets] of Object.entries(graph.edges)) {
  const title = notes.find((n) => n.id === id)?.title;
  const targetTitles = targets.map((t) => notes.find((n) => n.id === t)?.title);
  console.log(`  ${title} -> ${targetTitles.join(", ") || "(none)"}`);
}
