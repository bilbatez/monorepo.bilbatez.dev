# algo-compendium

Algorithm compendium SPA — complete reference and interactive visualizer for 63 algorithms across 8 categories.

## Stack

- **Runtime/package manager**: Bun (workspace member of monorepo root)
- **Build tool**: Vite 6 (`@vitejs/plugin-react` + `@tailwindcss/vite`)
- **Framework**: React 19 SPA via react-router-dom v7 (BrowserRouter, declarative)
- **Language**: TypeScript 5, strict mode
- **Styling**: Tailwind CSS v4 — CSS-only config via `@theme {}` in `app/globals.css`, no `tailwind.config.ts`
- **Unit tests**: Vitest 3 (colocated `.test.ts` files, `environment: node`)
- **E2E tests**: Playwright (shared root config, POM pattern, tests live in `../tests/algo-compendium/`)
- **Dev port**: 3003

## Directory Structure

```
algo-compendium/
├── src/main.tsx              # Entry: BrowserRouter + all routes + algorithm registrations
├── app/
│   ├── globals.css           # @import 'tailwindcss' + @theme turquoise vars
│   ├── Layout.tsx            # Full-screen layout: collapsible left sidebar + <Outlet />
│   ├── Home.tsx              # 8 category cards
│   ├── CategoryList.tsx      # Generic algorithm grid for a category
│   ├── AlgorithmDetail.tsx   # Two-panel page: MetadataPanel + visualizer + pseudocode
│   └── NotFound.tsx
├── _algorithms/              # Pure algorithm logic (no React)
│   ├── _shared/types.ts      # AlgorithmMeta<C,S>, VisualizerType, AlgorithmCategory
│   ├── registry.ts           # registerAlgorithm(), getAlgorithm(), getAlgorithmsByCategory()
│   ├── sorting/              # 13 algorithms + commands.ts + index.ts
│   ├── searching/            # 7 algorithms + commands.ts + index.ts
│   ├── graph/                # 10 algorithms + types.ts + commands.ts + index.ts
│   ├── tree/                 # 8 algorithms + types.ts + commands.ts + index.ts
│   ├── dynamic-programming/  # 8 algorithms + commands.ts + index.ts
│   ├── backtracking/         # 5 algorithms + commands.ts + index.ts
│   ├── string-matching/      # 5 algorithms + commands.ts + index.ts
│   └── math/                 # 7 algorithms + commands.ts + index.ts
├── _visualizers/             # React visualizer components (one per visualizer type)
│   ├── ArrayVisualizer.tsx   # Sorting + Searching (bar chart)
│   ├── TreeVisualizer.tsx    # Tree algorithms (SVG)
│   ├── GraphVisualizer.tsx   # Graph algorithms (SVG)
│   ├── GridVisualizer.tsx    # DP + Backtracking (HTML table)
│   ├── StringVisualizer.tsx  # String Matching (character rows)
│   └── MathVisualizer.tsx    # Math algorithms (adaptive display)
└── _components/
    ├── hooks/useAlgorithmPlayer.ts  # Generic playback hook (index, play/pause, speed)
    ├── Controls.tsx          # Universal play/pause/step/speed/input controls
    ├── MetadataPanel.tsx     # Complexity table + stable/in-place badges
    ├── Pseudocode.tsx        # Collapsible monospace code block
    ├── CategoryIcon.tsx      # Inline SVG icon per category
    └── AlgorithmIcon.tsx     # Inline SVG icon per algorithm
```

## Commands

```bash
bun run dev          # dev server at http://localhost:3003
bun run build        # tsc + vite build → dist/
bun run preview      # serve dist/ at port 3003
bun run prod         # build + preview
bun run test         # Playwright e2e (from monorepo root)
bun run test:unit    # Vitest unit tests (run once)
bun run test:unit:watch  # Vitest watch mode
```

## Architecture: Command Pattern

Every algorithm is a **pure function** → `Command[]`. The visualizer is a **pure reducer** `(state, cmd) => state`. Nothing in `_algorithms/` imports React.

```
Algorithm file: export function bubbleSortCommands(arr): SortCommand[]
Registration:   registerAlgorithm({ name, slug, category, run, reduce, ... })
Visualizer:     useAlgorithmPlayer(initialState, commands, reduce) → { currentState, play, ... }
```

- `run(input: S): C[]` — produces command sequence
- `reduce(state: S, cmd: C): S` — pure reducer (no mutation)
- `defaultInput: S` — initial state shown on page load
- Step-back/forward: re-reduce commands `0..index` from `initialState`

## Conventions

- `_` prefix = private/internal (`_algorithms/`, `_components/`, `_visualizers/`)
- Algorithm slugs: kebab-case, match URL segment (`bubble-sort`, `binary-search`)
- Each algorithm file exports its pure function AND calls `registerAlgorithm()` as a side effect
- `index.ts` per category imports all algorithm files to trigger registration
- All algorithm imports happen in `src/main.tsx`
- Commits follow Conventional Commits (enforced by commitlint at monorepo root)

## Turquoise Theme

```css
--color-turquoise: #2ec4b6;
--color-turquoise-dark: #1a9e91;
--color-turquoise-light: #7ee4dc;
```

Use as: `bg-[var(--color-turquoise)]`, `text-[var(--color-turquoise-dark)]`

Visualizer bar/node color states: gray (default) → yellow (comparing) → orange (swapping/active) → turquoise (sorted/visited/found) → purple (pivot/special)

## Gotchas

- Tailwind v4: no `tailwind.config.ts`. Custom colors go in `@theme {}` in `globals.css`.
- `SortState.sorted` is `number[]` not `Set<number>` — `Set` breaks `useMemo` referential equality.
- `useAlgorithmPlayer` resets index to `-1` when `commands` array reference changes (new input).
- Algorithm registrations are side effects — missing import in `src/main.tsx` means the category shows 0 algorithms.
- Vitest uses `environment: node` (not jsdom) — algorithm tests are pure TS with no DOM.
- E2E tests in `../tests/algo-compendium/` use `@/algo-compendium/*` path alias (resolves via root `tests/tsconfig.json`).
