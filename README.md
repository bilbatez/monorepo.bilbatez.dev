# Bilbatez Personal Monorepo

![Code Lint](https://github.com/bilbatez/monorepo.bilbatez.dev/actions/workflows/lint.yml/badge.svg)
![Tests](https://github.com/bilbatez/monorepo.bilbatez.dev/actions/workflows/playwright.yml/badge.svg)

A collection of applications I feel like making.

- Bilbatez.dev: My personal page.
- KPR for Dummies: A KPR (mortgage) calculator. KPR is Indonesia's acronym for mortgage.
- Algorithm Compendium: Interactive visualizer for 63 algorithms across 8 categories.
- Again: A browser platformer game with Tiled-JSON level authoring and proximity triggers.

## Contributing

### Local Environment Setup

Make sure your local development environment has [`NodeJS`](https://nodejs.org) and [`Bun`](https://bun.sh/) installed.

### Node Dependencies Installation

```shell
bun install
```

### Code Linting

```shell
bun eslint
```

### Running Applications Locally

Change the `*` wildcard to package name to run certain application

```shell
bun --filter "*" dev
```

Or run a specific app by name:

```bash
bun run --filter "bilbatez.dev" dev     # http://localhost:3001
bun run --filter "kprfordummies" dev    # http://localhost:3002
bun run --filter "algo-compendium" dev  # http://localhost:3003
bun run --filter "again" dev            # http://localhost:3004
```

### Running Playwright Tests

- From the terminal

```shell
bun run test
```

- Tests can also be ran by using VSCode plugins

### Commiting

Commit message convention is based on : [conventionalcommits.org](https://conventionalcommits.org)
