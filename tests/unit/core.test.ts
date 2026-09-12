import { describe, expect, it } from "vitest";
import { Vault, buildGraph, extractLinks } from "@lumen/core";

describe("core: notes & links", () => {
  it("extracts wikilinks", () => {
    expect(extractLinks("see [[Alpha]] and [[Beta|b]]")).toEqual(["Alpha", "Beta"]);
  });

  it("adds, updates, and deletes notes in a vault", () => {
    const v = new Vault();
    const n = v.add({ title: "A", content: "hello [[B]]" });
    expect(v.list()).toHaveLength(1);
    expect(n.links).toEqual(["B"]);

    const updated = v.update(n.id, { content: "now links [[C]]" });
    expect(updated?.links).toEqual(["C"]);

    expect(v.delete(n.id)).toBe(true);
    expect(v.list()).toHaveLength(0);
  });

  it("resolves links case-insensitively", () => {
    const v = new Vault();
    v.add({ title: "Target Note", content: "x" });
    expect(v.resolveLink("target note")?.title).toBe("Target Note");
  });
});

describe("core: graph", () => {
  it("builds an adjacency list from resolved links", () => {
    const v = new Vault();
    const a = v.add({ title: "A", content: "link [[B]]" });
    const b = v.add({ title: "B", content: "no links" });
    const graph = buildGraph(v.list());
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges[a.id]).toEqual([b.id]);
    expect(graph.edges[b.id]).toEqual([]);
  });
});
