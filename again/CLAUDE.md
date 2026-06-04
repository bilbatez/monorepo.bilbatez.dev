# again

Browser platformer game with Tiled-JSON level authoring — left/right/jump controls, proximity triggers, and 10 built-in levels.

## Stack

- **Runtime/package manager**: Bun (workspace member of monorepo root)
- **Build tool**: Vite 6 (`@vitejs/plugin-react` + `@tailwindcss/vite`)
- **Framework**: React 19 SPA via react-router-dom v7 (BrowserRouter, declarative)
- **Language**: TypeScript 5, strict mode
- **Game engine**: Phaser 3 (`phaser@^3.90.0`) — Arcade Physics, Scale Manager, Tweens, Camera FX
- **Styling**: Tailwind CSS v4 — CSS-only config via `@theme {}` in `app/globals.css`
- **Unit tests**: Vitest 3 (pure engine modules only; `_engine`, `_levels`, `_progress`)
- **E2E tests**: Playwright (shared root config, POM pattern, tests live in `../tests/again/`)
- **Dev port**: 3004

## Directory Structure

```
again/
├── src/main.tsx              # Entry: BrowserRouter + routes (/, /levels, /play/:id, *)
├── app/
│   ├── globals.css           # @import 'tailwindcss' + @theme dark game vars
│   ├── Home.tsx              # Title screen: Play/Continue + Level Select (after level 1)
│   ├── LevelSelect.tsx       # Grid of unlocked levels from cookie progress
│   ├── Game.tsx              # Mounts Phaser.Game; listens for win/death events; overlays
│   ├── NotFound.tsx
│   └── _components/
│       ├── WinPopup.tsx      # Congrats overlay — Next Level or Return Home
│       ├── SmallScreenOverlay.tsx  # Shown when window < MIN_SCREEN_PX (1024px)
│       └── Hud.tsx           # Level name + Back to Home button
├── _game/                    # Phaser layer — no React (exercised via e2e + manual)
│   ├── config.ts             # createGameConfig(): 1920×1080, Arcade, Scale.FIT
│   ├── events.ts             # Typed event names: WIN | DEATH | READY
│   ├── sprites.ts            # SWAP SEAM: textureFor() colored rects → real sprites later
│   ├── factory.ts            # buildScene(): LevelEntity[] → Arcade bodies/groups
│   └── PlatformerScene.ts    # init/preload/create/update: input, triggers, camera FX
├── _engine/                  # Pure TS, no Phaser/React — unit-tested
│   ├── constants.ts          # TILE, WIDTH, HEIGHT, GRAVITY, JUMP_VELOCITY, MOVE_SPEED, etc.
│   ├── types.ts              # EntityType, LevelEntity, LevelManifestEntry, TiledObject
│   └── triggers.ts           # Proximity math: getActivatedEntities(entities, px, py)
├── _levels/
│   ├── parse.ts              # parseTiledObjects(): Tiled JSON objects → LevelEntity[]
│   ├── validate.ts           # validateEntities(): checks one start + one exit + bounds
│   └── manifest.ts           # LEVELS[]: 10 ordered { id, key, name, url } entries
├── _progress/
│   └── cookie.ts             # getProgress() / setPassed(id) / unlockedLevels() via cookie
└── public/
    ├── favicon.svg
    └── levels/               # Tiled JSON maps loaded at runtime by Phaser loader
        └── level-01.json … level-10.json
```

## Level Format (Tiled JSON)

Levels are **Tiled JSON maps** in `public/levels/`. Loaded via Phaser's `load.tilemapTiledJSON` → `make.tilemap` → `getObjectLayer('entities')`. No tileset image needed — all objects are rectangle objects on a single `entities` layer.

**Map dimensions**: `width: 32, height: 18, tilewidth: 60, tileheight: 60` → 1920×1080 px canvas. Coordinates are pixels, origin top-left.

### EntityType values (Tiled object `type` / class field)

| type           | description                                     | custom properties                                       |
| -------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `solid`        | Static block, no physics passthrough            | —                                                       |
| `start`        | Player spawn point (one per level)              | —                                                       |
| `exit`         | Level exit, green (one per level)               | —                                                       |
| `disappearing` | Vanishes permanently when player enters radius  | `radius: int` (px)                                      |
| `mover`        | Slides once to target when player enters radius | `toX: int`, `toY: int`, `radius: int`, `rideable: bool` |
| `platform`     | Continuous patrol, always rideable              | `toX: int`, `toY: int`, `speed: int` (px/s)             |
| `hazard`       | Kills on touch, static                          | `hazardKind: "spike" \| "lava"`                         |
| `movingHazard` | Kills on touch, patrols                         | `toX: int`, `toY: int`, `speed: int`                    |
| `decoration`   | Visual only, no collision                       | `color: string` (optional)                              |

### How to add a level

1. Author the map in [Tiled editor](https://www.mapeditor.org/) at 32×18 tiles, 60px each — OR hand-write the JSON.
2. Place all objects on an object layer named **`entities`**.
3. Export as JSON to `again/public/levels/level-NN.json`.
4. Register in `again/_levels/manifest.ts` — append to the `LEVELS` array.
5. Stay within physics reach limits (from `_engine/constants.ts`):
   - `MAX_JUMP_HEIGHT` ≈ 225 px (~3.7 tiles vertical)
   - `MAX_GAP` ≈ 300 px (~5 tiles horizontal at full speed)
6. Ensure exactly one `start` and one `exit` entity (validated by `_levels/validate.ts`).

## Sprite-swap seam

**`again/_game/sprites.ts`** — `textureFor(scene, type, w, h)` is the single seam between colored shapes and real sprites.

- **Now**: generates a solid-color `generateTexture` per `type` (e.g. solid=slate, exit=green, hazard=red).
- **Later**: replace the body of `textureFor` with `scene.textures.get(key)` after adding `load.image/atlas` calls in `PlatformerScene.preload()` — keyed by the same `type` strings. No factory, scene-logic, or level data changes.

## Commands

```bash
bun run dev          # dev server at http://localhost:3004
bun run build        # tsc + vite build → dist/
bun run preview      # serve dist/ at port 3004
bun run prod         # build + preview
bun run test         # Playwright e2e (from monorepo root)
bun run test:unit    # Vitest unit tests (run once)
bun run test:unit:watch  # Vitest watch mode
```

## Gotchas

- **Moving bodies must use `setVelocity`, NOT tweens.** Phaser Arcade's auto-carry (player riding a platform) only works when the platform is `setImmovable(true)` and driven by `setVelocity`. Tweening breaks the carry.
- **World bounds bottom is intentionally open.** `physics.world.setBoundsCollision(true, true, true, false)` — falling off the bottom kills the player; left/right/top are solid walls.
- **Object layers need no tileset image.** Only tile layers require `addTilesetImage`. Calling it for object-only maps throws an error.
- **`scene.restart` is used for respawn.** On death the scene restarts (re-runs `preload` → `create`), which resets all entity state. This guarantees levels are never unwinnable after dying.
- **`clearTextureCache()`** should be called before re-creating the Phaser game instance to avoid stale texture keys across React remounts.
- **Cookie not localStorage.** Progress is stored in `document.cookie` (user's choice). See `_progress/cookie.ts`.
- **Phaser 3, not 4.** Phaser 4.1 exists (released Apr 2026) but 3.90 was chosen for stability and wider AI/documentation coverage. Upgrading is a one-line dep change — same API.
