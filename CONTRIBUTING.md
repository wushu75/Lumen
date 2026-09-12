# Contributing to Lumen

Thanks for your interest in improving Lumen! This guide covers the basics.

## Development setup

```bash
git clone https://github.com/wushu75/Lumen.git
cd Lumen
pnpm install
```

Lumen is a pnpm workspace monorepo. Common commands from the repo root:

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `pnpm dev`        | Run the web app (Vite dev server)             |
| `pnpm dev:api`    | Run the API server                            |
| `pnpm build`      | Build every package/app                       |
| `pnpm test`       | Run all unit tests (Vitest)                   |
| `pnpm typecheck`  | Type-check every package                      |
| `pnpm lint`       | Lint every package                            |
| `pnpm seed`       | Populate a demo vault                         |

To work on a single package, use a filter, e.g. `pnpm --filter @lumen/core test`.

## Project conventions

- **Language:** TypeScript everywhere, `strict` mode on.
- **Packages** are named `@lumen/<name>` and export a single `src/index.ts` barrel.
- **Local-first:** never introduce a hard dependency on a network service for core
  note-taking. AI features degrade gracefully when no model is reachable.
- **Interfaces before storage:** MVP uses in-memory / mock backends. Keep public
  interfaces stable so SQLite / Postgres+pgvector can be dropped in later.
- Favor clarity and convention over cleverness.

## Running tests

```bash
pnpm test                       # everything
pnpm --filter @lumen/core test  # one package
```

Add unit tests under a package's own `src/**/*.test.ts` or in `tests/unit/`.

## Opening a pull request

1. Fork and create a feature branch: `git checkout -b feat/my-thing`.
2. Make your change with tests and a clear description.
3. Run `pnpm typecheck && pnpm test` before pushing.
4. Open a PR against `main`. Reference any related issue.
5. Keep PRs focused; smaller is easier to review.

## Reporting bugs / requesting features

Open a GitHub issue with steps to reproduce (for bugs) or a short motivation and
proposed behavior (for features). Please search existing issues first.

By contributing you agree that your contributions are licensed under the MIT License.
