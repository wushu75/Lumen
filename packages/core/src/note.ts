/** A single note in a Lumen vault. */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  /** Titles this note links to via [[wikilinks]]. */
  links: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface NewNote {
  title: string;
  content?: string;
  tags?: string[];
}

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

/** Extract [[wikilink]] targets from Markdown content. */
export function extractLinks(content: string): string[] {
  const links = new Set<string>();
  for (const match of content.matchAll(WIKILINK_RE)) {
    const target = match[1]?.split("|")[0]?.trim();
    if (target) links.add(target);
  }
  return [...links];
}

let counter = 0;
/** Small, dependency-free id generator (good enough for the MVP). */
export function createId(prefix = "n"): string {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`;
}

/** Build a fully-formed Note from partial input. */
export function makeNote(input: NewNote): Note {
  const now = new Date().toISOString();
  const content = input.content ?? "";
  return {
    id: createId(),
    title: input.title,
    content,
    tags: input.tags ?? [],
    links: extractLinks(content),
    createdAt: now,
    updatedAt: now,
  };
}
