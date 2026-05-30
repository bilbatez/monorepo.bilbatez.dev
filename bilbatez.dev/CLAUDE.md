# bilbatez.dev

Personal portfolio SPA. Part of monorepo — see root `CLAUDE.md` for monorepo-wide conventions.

## Stack

- **Runtime**: Bun | **Build**: Vite 6 | **Framework**: React 19 + react-router-dom v7
- **Language**: TypeScript 5 (strict) | **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`)
- **Content**: `js-yaml` (YAML frontmatter) + `marked` (markdown→HTML)
- **Testing**: Playwright e2e only (no unit tests) — tests live in `../tests/bilbatez.dev/`

## Directory Structure

```
bilbatez.dev/
├── index.html              # Vite entry; <title> hardcoded here (not from content/)
├── src/main.tsx            # BrowserRouter + Routes (9 routes)
├── app/
│   ├── content.ts          # Typed content loader — imports ?raw markdown, parses with js-yaml+marked
│   ├── Layout.tsx          # Shell: TitleComponent, NavComponent, FooterComponent (reads ui.json)
│   ├── Home.tsx            # dangerouslySetInnerHTML from home.md
│   ├── Experience.tsx      # Renders experience data from experience.md frontmatter
│   ├── Projects.tsx        # Renders projects data from projects.md frontmatter
│   ├── ExternalRedirect.tsx # window.location.replace for /github, /linkedin, /bofa, etc.
│   ├── NotFound.tsx        # 404 page
│   └── globals.css         # Tailwind entry + @font-face + prose link/spacing rules
├── content/
│   └── en/                 # English locale (add more locale folders here for i18n)
│       ├── home.md         # Bio prose — 5 paragraphs, markdown body only
│       ├── experience.md   # YAML frontmatter: experiences[] array
│       ├── projects.md     # YAML frontmatter: intro string + projects[] array
│       └── ui.json         # Nav labels, footer heading, social links, h1 title
└── public/                 # favicon, apple-icon, manifest, fonts/, assets/
```

## Commands

```bash
# From monorepo root:
bun run --filter "bilbatez.dev" dev      # dev server → http://127.0.0.1:3001
bun run --filter "bilbatez.dev" build    # tsc -b && vite build
bun run --filter "bilbatez.dev" test     # Playwright e2e (auto-starts dev server)

# From this directory:
bun run dev / build / test
```

## Content Editing

Edit files in `content/en/` — no code changes needed:

- **home.md** — markdown prose; links use `[\[text\]](url)` to preserve bracket display
- **experience.md** — YAML only (no markdown body); add companies/positions as YAML
- **projects.md** — YAML only; `intro:` string + `projects:` array
- **ui.json** — nav names/links, footer heading/socials, h1 title string

## Gotchas

- **Never use `gray-matter` here.** It requires Node.js `Buffer`, which is undefined in WebKit/Safari and silently prevents the whole React app from rendering. Use `js-yaml` + the `parseFrontmatter()` helper in `content.ts`.
- `content.ts` runs at module load time (synchronous, build-time bundled). No async/loading states.
- `Home.tsx` uses `dangerouslySetInnerHTML` — safe because content is in-repo markdown we control.
- `marked` is configured with a custom link renderer (in `content.ts`) to add `target="_blank" rel="noopener noreferrer"` to all links rendered from markdown.
- Playwright tests check exact counts: 5 `<p>` in `#intro`, 50 `<li>` in `#experience`, 3 `<li>` in projects article. Preserve these when editing content.
- `index.html` `<title>` is hardcoded — not from `ui.json`. The h1 in the page IS from `ui.json`.
