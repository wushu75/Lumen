import type { Note } from "./note.js";

export interface GraphNode {
  id: string;
  title: string;
}

export interface Graph {
  nodes: GraphNode[];
  /** adjacency: note id -> list of resolved note ids it links to */
  edges: Record<string, string[]>;
}

/**
 * Build a simple adjacency-list graph from a set of notes. Wikilinks are matched
 * to notes by (case-insensitive) title; unresolved links are ignored.
 */
export function buildGraph(notes: Note[]): Graph {
  const byTitle = new Map<string, string>();
  for (const n of notes) byTitle.set(n.title.trim().toLowerCase(), n.id);

  const edges: Record<string, string[]> = {};
  for (const n of notes) {
    const targets: string[] = [];
    for (const link of n.links) {
      const id = byTitle.get(link.trim().toLowerCase());
      if (id && id !== n.id) targets.push(id);
    }
    edges[n.id] = [...new Set(targets)];
  }

  return {
    nodes: notes.map((n) => ({ id: n.id, title: n.title })),
    edges,
  };
}

/** Notes that link *to* the given note id (inbound links / backlinks). */
export function backlinks(graph: Graph, id: string): string[] {
  return Object.entries(graph.edges)
    .filter(([, targets]) => targets.includes(id))
    .map(([source]) => source);
}
