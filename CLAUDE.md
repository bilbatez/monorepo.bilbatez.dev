# monorepo.bilbatez.dev

## Stack

- **Runtime/package manager**: Bun
- **Build tool**: Vite 6
- **Framework**: React 19 (SPA via react-router-dom v7)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`, CSS-side config)
- **Testing**: Playwright (e2e, no unit tests)
- **Linting/formatting**: ESLint 9 (flat config), Prettier, commitlint (conventional commits)
- **Git hooks**: Husky + lint-staged (format + lint on commit)

## Workspaces

```
monorepo.bilbatez.dev/
├── bilbatez.dev/          # Personal portfolio site, port 3001
│   ├── index.html         # Vite entry HTML
│   ├── src/main.tsx       # React entry — BrowserRouter + Routes
│   ├── app/               # Page components + content.ts loader
│   │   ├── content.ts     # Typed loader: parses ?raw markdown imports via js-yaml + marked
│   │   └── ...            # Home, Experience, Projects, Layout, NotFound, ExternalRedirect
│   ├── content/en/        # Editable content files (i18n-ready: one subfolder per locale)
│   │   ├── home.md        # Bio prose (markdown body → dangerouslySetInnerHTML)
│   │   ├── experience.md  # Work history (YAML frontmatter only)
│   │   ├── projects.md    # Projects list (YAML frontmatter: intro + projects array)
│   │   └── ui.json        # UI strings: h1 title, nav labels, footer heading + socials
│   ├── public/            # Static assets (favicon, manifest.webmanifest, fonts, social icons)
│   └── vite.config.ts
├── kprfordummies/         # KPR (mortgage) calculator app, port 3002
│   ├── index.html
│   ├── src/main.tsx
│   ├── app/
│   │   ├── components/    # UI components (form, table, pdf, nav)
│   │   ├── _utils/        # Helpers: formula, currency, date
│   │   ├── _constants/    # Interest rates, error messages
│   │   └── globals.css    # Tailwind v4 entry + custom CSS
│   ├── public/
│   └── vite.config.ts
├── algo-compendium/       # Algorithm visualizer SPA, port 3003
│   ├── _algorithms/       # Pure TS: 63 algorithms across 8 categories
│   ├── _visualizers/      # React visualizer components (per visualizer type)
│   └── _components/       # Shared UI: controls, metadata, pseudocode
├── again/                 # Platformer game, port 3004
│   ├── _game/             # Phaser 3 scene/factory/sprites/config
│   ├── _engine/           # Pure TS: constants, types, proximity triggers
│   ├── _levels/           # Tiled JSON parse/validate/manifest
│   ├── _progress/         # Cookie-based level progress
│   └── public/levels/     # Tiled JSON map files (level-01…level-10.json)
├── tests/
│   ├── bilbatez.dev/      # Playwright e2e for portfolio
│   └── kprfordummies/     # Playwright e2e for KPR app
└── playwright.config.ts   # Root Playwright config (5 browsers)
```

## Commands

```bash
# Dev servers (run from workspace or root)
bun run --filter "bilbatez.dev" dev      # http://localhost:3001
bun run --filter "kprfordummies" dev     # http://localhost:3002
bun run --filter "algo-compendium" dev   # http://localhost:3003
bun run --filter "again" dev             # http://localhost:3004

# Build (per workspace)
bun run --filter "bilbatez.dev" build
bun run --filter "kprfordummies" build
bun run --filter "algo-compendium" build
bun run --filter "again" build

# Tests (from root — Playwright auto-starts dev servers)
bun test                   # all e2e tests
bun test:ui                # Playwright UI mode
bun run --filter "bilbatez.dev" test     # portfolio tests only
bun run --filter "kprfordummies" test    # KPR tests only
bun run --filter "again" test            # again e2e tests only
bun run --filter "again" test:unit       # again vitest (pure engine modules)

# Maintenance
bun clean                  # remove node_modules + dist
bun refresh                # clean + reinstall
bun format                 # Prettier across all workspaces
```

## Conventions

- **Commits MUST follow Conventional Commits** (enforced by commitlint). Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `build`, `ci`, `revert`. Optional scope in parens. Subject ≤ 50 chars, imperative mood, no trailing period. Example: `feat(kpr): add annuity interest calculator`. Body wraps at 72 chars when needed.
- `_` prefix = private/internal (e.g. `_utils/`, `_constants/`)
- `bilbatez.dev` and `kprfordummies`: Playwright e2e only (no unit tests). `algo-compendium` and `again`: Vitest unit tests for pure logic + Playwright e2e.
- Playwright retries: 2 local, 3 CI; workers: unlimited local, 4 CI; browsers: all 5 local, Chrome-only CI
- All workspaces share root `node_modules` via Bun workspaces
- React Router v7 in declarative SPA mode (no framework features, no SSR/SSG)
- External link "shortcuts" (`/github`, `/linkedin`, `/bofa`, `/shopee`, `/blibli`, `/bilbatez.dev`) are handled by `<ExternalRedirect to=…>` route components that call `window.location.replace`.

## Gotchas

- `bilbatez.dev` content deps: `js-yaml` (browser-safe YAML) + `marked` (markdown→HTML). **Do NOT use `gray-matter`** — it requires `Buffer` (Node.js global), which is undefined in WebKit/Safari and causes the entire React app to silently fail to render. `js-yaml` v4 has no such dependency.
- `bilbatez.dev/content/en/` files are loaded via Vite `?raw` imports (build-time bundle, no runtime fetch). `content.ts` parses YAML frontmatter with a manual `---` regex split + `js-yaml.load()`. To add a new locale: create `content/<locale>/` with the same four files and update `content.ts` to import them.
- `@playwright/test` is **pinned to `1.56.1`** (not `^1.56.1`). Newer Chromium ships V8 with updated CLDR data that drops the `,00` cents from `Intl.NumberFormat('id-ID', { currency: 'IDR' })`, breaking kpr currency assertions. Bumping requires also fixing `kprfordummies/app/_utils/currency.tsx` to force `minimumFractionDigits: 2`.
- Tailwind v4 reads config from CSS via `@import 'tailwindcss'` + `@theme { … }` blocks. There is no `tailwind.config.ts`.
- `bilbatez.dev/public/contents/` is untracked (gitignored / drafts).
- `kprfordummies` uses plain CSS only — do not reintroduce SCSS unless you also switch to a PostCSS-based Tailwind pipeline (`@tailwindcss/vite` cannot reprocess post-sass output, leaving `@apply` literal in the bundle).
- `again` uses **Phaser 3** (`phaser@^3.90.0`) in `again/package.json` only. Levels are **Tiled JSON** maps in `again/public/levels/` — object-layer-only, no tileset image. Moving bodies must use `setVelocity` (NOT tweens) for Arcade auto-carry to work. Sprite swap seam: `again/_game/sprites.ts:textureFor()`.
