import { useEffect, useMemo, useState } from "react";
import { Vault, type Note } from "@lumen/core";
import { Button, Input } from "@lumen/ui";
import { ModelSelector } from "./components/ModelSelector.js";
import { ask, reindex } from "./lib/rag-client.js";

const vault = new Vault();

// Seed one note so the UI isn't empty on first load.
vault.add({
  title: "Welcome to Lumen",
  content:
    "# Welcome to Lumen\n\nThis is your open, AI-native second brain.\n\n" +
    "Try linking to [[Chinese LLMs]] and asking a question on the right.",
  tags: ["intro"],
});

export function App() {
  const [notes, setNotes] = useState<Note[]>(vault.list());
  const [selectedId, setSelectedId] = useState<string | null>(
    notes[0]?.id ?? null,
  );
  const [model, setModel] = useState("qwen3");

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  function refresh() {
    setNotes(vault.list());
  }

  // Keep the RAG index in sync with the selected note's content.
  useEffect(() => {
    if (selected) void reindex(selected.id, selected.content);
  }, [selected?.id, selected?.content]);

  function newNote() {
    const n = vault.add({ title: "Untitled", content: "" });
    refresh();
    setSelectedId(n.id);
  }

  function updateSelected(patch: Partial<Note>) {
    if (!selected) return;
    vault.update(selected.id, patch);
    refresh();
  }

  function deleteSelected() {
    if (!selected) return;
    vault.delete(selected.id);
    const rest = vault.list();
    refresh();
    setSelectedId(rest[0]?.id ?? null);
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo}>✦ Lumen</div>
        <span style={styles.tagline}>Your open, AI-native second brain.</span>
        <div style={{ marginLeft: "auto" }}>
          <ModelSelector value={model} onChange={setModel} />
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <Button onClick={newNote} style={{ width: "100%" }}>
            + New note
          </Button>
          <ul style={styles.noteList}>
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setSelectedId(n.id)}
                  style={{
                    ...styles.noteItem,
                    ...(n.id === selectedId ? styles.noteItemActive : {}),
                  }}
                >
                  {n.title || "Untitled"}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main style={styles.main}>
          {selected ? (
            <>
              <Input
                value={selected.title}
                onChange={(e) => updateSelected({ title: e.target.value })}
                style={{ fontSize: 20, fontWeight: 600 }}
              />
              <textarea
                value={selected.content}
                onChange={(e) => updateSelected({ content: e.target.value })}
                style={styles.editor}
                placeholder="Write Markdown here. Use [[wikilinks]] to connect notes."
              />
              <div>
                <Button variant="ghost" onClick={deleteSelected}>
                  Delete note
                </Button>
              </div>
            </>
          ) : (
            <p style={{ color: "#888" }}>No note selected. Create one to begin.</p>
          )}
        </main>

        <AskPanel model={model} />
      </div>
    </div>
  );
}

function AskPanel({ model }: { model: string }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const { answer } = await ask(q, model);
      setAnswer(answer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={styles.ask}>
      <h3 style={{ margin: "0 0 8px" }}>Ask my notes</h3>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. Which local model is best for math?"
        onKeyDown={(e) => e.key === "Enter" && run()}
      />
      <Button onClick={run} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Thinking…" : "Ask"}
      </Button>
      {answer && <div style={styles.answer}>{answer}</div>}
      <p style={styles.hint}>
        Answers use a local model via Ollama. Start Ollama and pull a model (see
        docs/models.md) for real responses.
      </p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: { fontFamily: "system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", color: "#1a1a22" },
  header: { display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #eee" },
  logo: { fontWeight: 700, fontSize: 18, color: "#6d5efc" },
  tagline: { color: "#888", fontSize: 13 },
  body: { flex: 1, display: "grid", gridTemplateColumns: "220px 1fr 320px", overflow: "hidden" },
  sidebar: { borderRight: "1px solid #eee", padding: 12, overflowY: "auto" },
  noteList: { listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: 4 },
  noteItem: { width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 14 },
  noteItemActive: { background: "#efeefe", color: "#6d5efc", fontWeight: 600 },
  main: { padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" },
  editor: { flex: 1, minHeight: 260, resize: "vertical", padding: 12, borderRadius: 8, border: "1px solid #d0d0d8", fontFamily: "ui-monospace, monospace", fontSize: 14, lineHeight: 1.6 },
  ask: { borderLeft: "1px solid #eee", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column" },
  answer: { marginTop: 12, padding: 12, borderRadius: 8, background: "#f6f6fb", fontSize: 14, whiteSpace: "pre-wrap" },
  hint: { marginTop: 12, fontSize: 12, color: "#999" },
};
