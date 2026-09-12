import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@lumen/core": r("./packages/core/src/index.ts"),
      "@lumen/ai": r("./packages/ai/src/index.ts"),
      "@lumen/editor": r("./packages/editor/src/index.ts"),
      "@lumen/ui": r("./packages/ui/src/index.ts"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts", "packages/**/*.test.ts"],
    environment: "node",
  },
});
