/**
 * Thin wrapper around Tiptap for a Markdown-flavored editor.
 *
 * Tiptap works on an HTML/ProseMirror document model, so we provide lightweight
 * Markdown <-> HTML conversion at the boundary. This is intentionally minimal for
 * the MVP: it covers headings, bold/italic, and [[wikilinks]] (rendered as spans).
 * Swap in a full Markdown extension (e.g. tiptap-markdown) later.
 */
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export interface CreateEditorOptions {
  element: HTMLElement;
  content?: string; // Markdown
  onUpdate?: (markdown: string) => void;
}

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

/** Very small Markdown -> HTML shim for the MVP. */
export function markdownToHtml(md: string): string {
  const withLinks = md.replace(
    WIKILINK_RE,
    (_m, target: string) =>
      `<span class="wikilink" data-target="${target.trim()}">[[${target}]]</span>`,
  );
  return withLinks
    .split(/\n{2,}/)
    .map((block) => {
      const h = block.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = h[1].length;
        return `<h${level}>${inline(h[2])}</h${level}>`;
      }
      return `<p>${inline(block).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/** Very small HTML -> Markdown shim for the MVP. */
export function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h([1-6])>(.*?)<\/h\1>/g, (_m, lvl, t) => `${"#".repeat(+lvl)} ${t}\n\n`)
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "*$1*")
    .replace(/<span class="wikilink"[^>]*>\[\[(.*?)\]\]<\/span>/g, "[[$1]]")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/p>\s*<p>/g, "\n\n")
    .replace(/<\/?p>/g, "")
    .trim();
}

/** Create a Tiptap editor instance bound to an element. */
export function createLumenEditor(opts: CreateEditorOptions): Editor {
  const editor = new Editor({
    element: opts.element,
    extensions: [StarterKit],
    content: markdownToHtml(opts.content ?? ""),
    onUpdate: ({ editor }) => {
      opts.onUpdate?.(htmlToMarkdown(editor.getHTML()));
    },
  });
  return editor;
}
