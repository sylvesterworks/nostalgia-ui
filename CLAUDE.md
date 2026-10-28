# NostalgiaUI

An open-source design system that lets any interface be rendered in the style of a past design era, using color palettes drawn from popular VS Code themes. Built on **Base UI** (the headless, unstyled React component library) and shipped with an **MCP server** so AI coding agents can use it directly.

Owner: Josh Sylvester. License: MIT. Planned home: `nostalgiaui.sylvester.works` (subdomain of a domain Josh owns).

## Why this project exists

1. It's fun.
2. A public GitHub project with Josh's name on it.
3. Hands-on depth with agentic AI tooling: building and publishing an MCP server, and documenting it well.

Because of goals 2 and 3, quality of the README, docs, commit history, and release notes matters as much as the code. Keep commits small and well described, and write a short decision note (in `docs/decisions/`) whenever a meaningful architectural choice is made.

## Core concept: two independent axes

Every rendered component is the product of two choices:

- **Era** controls _shape and feel_: border radius, border style, bevels, shadows, gradients, textures, typography, spacing density, motion.
- **Palette** controls _color only_, sourced from a VS Code theme.

The axes must stay independent. Any palette must work in any era (Dracula in Classic Windows, Solarized in Frutiger Aero). If a change couples them, it's the wrong change.

### Token layers

1. **Palette primitives**: raw colors pulled from a VS Code theme (background, foreground, selection, and syntax colors such as keyword, string, function, comment, error).
2. **Semantic tokens**: `surface`, `surface-raised`, `text`, `text-muted`, `accent`, `success`, `warning`, `danger`, `border`, and so on. Default mapping from syntax colors: keyword → accent, string → success, error → danger, comment → text-muted. Every era reads only from semantic tokens.
3. **Era tokens**: radius, border, shadow, gradient, font, motion recipes.

Era effects that need extra colors (90s bevel highlight and shadow edges, Web 2.0 gradient stops, neumorphic light and dark shadows) must be **derived with color math in OKLCH** from the semantic tokens, never hand-picked per palette. Otherwise palettes × eras becomes unmaintainable.

## Era catalog

Initial milestone uses only the first three marked ★. The rest come later.

| Era                    | Period         | Signature traits                                                                            |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| ★ Classic Windows      | 1990s          | Gray chrome, 2px inset/outset bevels, zero radius, pixel-style system fonts, no transitions |
| ★ Frutiger Aero / Aqua | 2000s          | Gloss with highlight band, translucency, bubbles, generous rounding, soft shadows           |
| ★ Flat / Metro         | early 2010s    | Solid fills, bold type, tiles, no shadows or gradients                                      |
| Terminal / CRT         | 1970s–80s      | Monospace, phosphor glow, scanlines                                                         |
| Early Mac              | 1984–91        | 1-bit, dithered patterns, pixel fonts                                                       |
| Web 1.0                | late 1990s     | Tiled backgrounds, blue underlined links, table-like layout                                 |
| Web 2.0                | mid–late 2000s | Gradients, reflections, rounded badges                                                      |
| Skeuomorphism          | ~2007–2012     | Textures, stitching, embossed text                                                          |
| Material               | mid 2010s      | Elevation layers, ripples, purposeful motion                                                |
| Neumorphism            | ~2020          | Soft extruded shadows (stress test for contrast)                                            |
| Glassmorphism          | 2020s          | Frosted blur panels                                                                         |
| Neubrutalism           | 2020s          | Thick black borders, hard offset shadows                                                    |

## Palettes

Initial milestone: **Dracula**, **Nord**, **Solarized Light** (include at least one light palette from day one so light/dark assumptions don't creep in).

Later candidates: Gruvbox, Catppuccin, Tokyo Night, One Dark, Monokai.

Before adding any palette, check the source theme's license and record it in `packages/tokens/palettes/<name>/SOURCE.md` with a link to the original repo. Prefer "inspired by <theme>" wording if the theme has its own branding.

## Repo layout (pnpm monorepo)

```
packages/tokens      era + palette definitions; builds to CSS variables, Tailwind config, W3C design tokens JSON
packages/react       Base UI components styled via tokens; each component has <Name>.docs.ts and <Name>.stories.tsx beside it (decision 0007)
packages/importer    VS Code theme JSON → NostalgiaUI palette
packages/mcp         MCP server
apps/storybook       Storybook on @storybook/react-vite, the local development surface (`pnpm dev`); replaced apps/playground in #36; published under /storybook on the docs site (#42)
apps/docs            docs site for nostalgiaui.sylvester.works (later)
docs/decisions       short architecture decision notes
```

npm scope: `@nostalgiaui/*` (confirm availability and create the npm org before first publish).

## Suggested tooling

Verify current versions and package names before installing; don't trust these from memory.

- pnpm workspaces + Turborepo, TypeScript strict
- Base UI for React: `@base-ui/react`, pinned exact at 1.9.0 (the package was renamed from `@base-ui-components/react`, which is deprecated)
- Tokens built by a small TypeScript script in `packages/tokens` (not Style Dictionary, see decision 0002), emitting CSS variables, a Tailwind preset, and W3C Design Tokens (DTCG) JSON
- OKLCH color math with `culori` (or similar)
- Vitest for unit tests, including automated WCAG contrast checks for every era × palette pair
- `@modelcontextprotocol/server` and `@modelcontextprotocol/client` (TypeScript) for the MCP server; the older `@modelcontextprotocol/sdk` is still on npm but its hand-wired stdio transport only serves 2025-era clients
- GitHub Actions CI: lint, typecheck, test, build

Dev machine is Windows; keep scripts cross-platform (no bash-only scripts in package.json).

## Order of operations

### Milestone 0: Scaffold (done)

- pnpm + Turborepo monorepo with the layout above (empty packages are fine)
- TypeScript, ESLint, Prettier, Vitest wired up
- MIT LICENSE, README with the project pitch and two-axis concept, CONTRIBUTING stub
- GitHub Actions CI
- First decision note: the two-axis model

### Milestone 1: Prove the two axes (done)

- `packages/tokens`: 3 eras × 3 palettes (★ items above), semantic layer, derived colors via OKLCH
- `packages/react`: Button, Input, Card, Tabs, Dialog on Base UI, styled only through tokens
- `apps/playground`: the five components on one page, with era and palette dropdowns that switch live
- Contrast tests pass for all 9 combinations
- Done when: any era/palette pairing looks intentional, and adding a 4th palette requires zero era changes

### Milestone 2: VS Code theme importer (done)

- `packages/importer`: read a VS Code theme JSON (`colors` + `tokenColors`), map to palette primitives (the semantic layer then derives the rest), report the provenance of every value
- CLI: `npx @nostalgiaui/importer ./my-theme.json`
- Playground: drop in a theme file and preview it

### Milestone 3: MCP server (done; the in-Claude-Code demo was verified against the published 0.1.1 server)

Tools:

- `list_eras`, `list_palettes`
- `get_tokens(era, palette, format)` with formats `css`, `tailwind`, `dtcg`
- `get_component(name, era, section?)` returns the styled component source, props tables and structured doc, or one doc section (decision 0011)
- `import_vscode_theme(json)` returns a new palette
- `check_contrast(era, palette)` flags accessibility problems

Demo target: in Claude Code, "build me a settings page in Frutiger Aero with the Nord palette" works end to end. Document setup for Claude Code and Claude Desktop in the README.

### Milestone 4: Docs, more eras, publish (done)

- `apps/docs` deployed to `nostalgiaui.sylvester.works`
- Timeline slider demo: scrub through eras and watch the same UI morph
- Expand the era catalog and palette list
- Publish `@nostalgiaui/*` packages to npm and list the MCP server in the MCP registry

## Working agreements

- Avoid em-dashes in docs and READMEs (owner preference).
- One milestone at a time; propose a short plan before starting each one.
- Never style a component with raw color values; semantic tokens only.
- Accessibility is a constraint, not a nice-to-have: keyboard behavior comes from Base UI, contrast is tested.
- Keep the README current as milestones land.

## Work items

- Outstanding work lives in GitHub Issues, not in markdown files in the repo. `docs/decisions/` is for permanent decision records only.
- Every issue carries one type label (`bug`, `enhancement`, `documentation`, `accessibility`) and one priority label (`P1` do next, `P2` do soon, `P3` when convenient). Items raised from inside the project, including anything Claude finds while testing, also carry `internal`.
- When testing or a demo run turns up a gap, open an issue for it with `gh issue create` rather than noting it in a report or a doc. Each issue says what is wrong, what to do, and what done looks like.
- "Fix #N" means: read it with `gh issue view N`, branch from main as `issue-N-short-slug`, do the work, and open a PR whose body contains `Closes #N` so the issue closes on merge.
