import { extractLinks, makeNote, type NewNote, type Note } from "./note.js";

/**
 * Storage-agnostic vault. The MVP keeps notes in memory; the interface is shaped
 * so a SQLite / OPFS-backed store can replace the internal Map without changing
 * callers.
 */
export class Vault {
  readonly rootPath: string;
  private store = new Map<string, Note>();

  constructor(rootPath = ".vault") {
    this.rootPath = rootPath;
  }

  list(): Note[] {
    return [...this.store.values()].sort(
      (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  get(id: string): Note | undefined {
    return this.store.get(id);
  }

  add(input: NewNote): Note {
    const note = makeNote(input);
    this.store.set(note.id, note);
    return note;
  }

  /** Insert a pre-built note (e.g. when loading from disk). */
  upsert(note: Note): Note {
    this.store.set(note.id, note);
    return note;
  }

  update(id: string, patch: Partial<NewNote>): Note | undefined {
    const existing = this.store.get(id);
    if (!existing) return undefined;
    const content = patch.content ?? existing.content;
    const updated: Note = {
      ...existing,
      title: patch.title ?? existing.title,
      content,
      tags: patch.tags ?? existing.tags,
      links: extractLinks(content),
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  /** Resolve a [[wikilink]] title to a note, if one with that title exists. */
  resolveLink(title: string): Note | undefined {
    const target = title.trim().toLowerCase();
    return this.list().find((n) => n.title.trim().toLowerCase() === target);
  }
}
