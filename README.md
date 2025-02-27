# Bilbatez Personal Monorepo

![Code Lint](https://github.com/bilbatez/monorepo.bilbatez.dev/actions/workflows/lint.yml/badge.svg)
![Tests](https://github.com/bilbatez/monorepo.bilbatez.dev/actions/workflows/playwright.yml/badge.svg)

A collection of applications I feel like making.

- Bilbatez.dev: A simple personal page.
- KPR for Dummies: KPR calculator. KPR is Indonesia's acronym for Mortgage. It's basically a mortgage calculator.

## Contributing

### Local Environment Setup

Make sure your local development environment have [`NodeJS`](https://nodejs.org) and [`Bun`](https://bun.sh/) installed

### Node Dependencies Installation

```shell
bun install
```

### Code Linting

```shell
bun --filter="*" lint
```

### Running Applications Locally

Change the `*` wildcard to package name to run certain application

```shell
bun --filter "*" dev
```

### Running Playwright Tests

- From the terminal

```shell
bun test
```

- Tests can also be ran by using VSCode plugins

### Commiting

Commit message convention are based on : [conventionalcommits.org](https://conventionalcommits.org)
