# NostalgiaUI

An open source design system that renders any interface in the style of a past design era, using color palettes drawn from popular VS Code themes. Built on [Base UI](https://base-ui.com) and shipped with an MCP server so AI coding agents can use it directly.

> Status: milestone 3 complete. Three eras, three palettes, five components, a live playground, a VS Code theme importer, and an MCP server. Docs site, more eras and npm publishing are milestone 4.

## The two axes

Every rendered component is the product of two independent choices.

**Era** controls shape and feel: border radius, border style, bevels, shadows, gradients, textures, typography, spacing density, and motion.

**Palette** controls color, and nothing else. Palettes come from VS Code themes.

Because the axes are independent, any palette works in any era. Dracula in Classic Windows. Solarized Light in Frutiger Aero. The same settings page can be dragged across twenty years of design history without rewriting a single component.

```
Era  (shape)  x  Palette (color)  =  rendered component
```

Keeping the axes apart is the central constraint of the project. Era effects that need extra colors, such as a 90s bevel highlight or a Web 2.0 gradient stop, are derived from the semantic tokens with OKLCH color math rather than hand picked per palette. Otherwise every new palette would mean touching every era.

### Token layers

| Layer              | What it holds                                                           |
| ------------------ | ----------------------------------------------------------------------- |
| Palette primitives | Raw colors from a VS Code theme, including syntax colors                |
| Semantic tokens    | `surface`, `text`, `accent`, `success`, `danger`, `border`, and friends |
| Era tokens         | Radius, border, shadow, gradient, font, and motion recipes              |

Eras read only from semantic tokens. No component ever uses a raw color value.

## Planned eras

Milestone 1 ships Classic Windows, Frutiger Aero, and Flat / Metro. Terminal / CRT, Early Mac, Web 1.0, Web 2.0, Skeuomorphism, Material, Neumorphism, Glassmorphism, and Neubrutalism follow.

## Planned palettes

Milestone 1 ships Dracula, Nord, and Solarized Light. One light palette is included from day one so that light mode never becomes an afterthought.

## Repo layout

```
packages/tokens      era and palette definitions, built to CSS variables, Tailwind config, DTCG JSON
packages/react       Base UI components styled via tokens
packages/importer    VS Code theme JSON to NostalgiaUI palette
packages/mcp         MCP server
apps/playground      era and palette switchers (milestone 1)
apps/docs            docs site for nostalgiaui.sylvester.works (milestone 4)
docs/decisions       architecture decision notes
```

## Usage

```tsx
import { Button, NostalgiaRoot } from '@nostalgiaui/react';
import '@nostalgiaui/tokens/tokens.css';
import '@nostalgiaui/react/styles.css';

<NostalgiaRoot era="frutiger-aero" palette="nord">
  <Button variant="solid">Click me</Button>
</NostalgiaRoot>;
```

Changing either prop changes one attribute. Nothing re-renders differently and
no markup changes: the whole visual difference is CSS resolving a different set
of custom properties.

`NostalgiaRoot` is also what portalled parts render into. Base UI sends Dialog
to `document.body` by default, which would escape the token scope entirely.

## Development

Requires Node 22 or newer and pnpm 11.

```bash
pnpm install
pnpm check      # lint, typecheck, test, build
pnpm --filter @nostalgiaui/playground dev
```

Individual tasks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Importing a VS Code theme

```bash
npx @nostalgiaui/importer ./my-theme.json
```

It prints the palette together with the provenance of every value, because a
theme and a palette do not describe the same thing and the gap varies by theme:

```
   background  #0f1b24    exact      colors[editor.background]
 ~ keyword     #7fd4ff    inherited  tokenColors scope keyword.operator.logical
 ? string      #9eda9f    derived    keyword colour rotated to 145 degrees
```

`exact` came straight from the theme, `inherited` matched a related scope,
`derived` was computed from another value in the same theme, and `fallback`
means nothing in the theme could inform it. `--strict` exits non-zero if
anything was guessed, and `--out <dir>` scaffolds a palette module plus a
`SOURCE.md` stub with the licence line left blank for you to complete.

The playground accepts a dropped theme file and previews it live against every
era, with the same provenance table shown beside it.

## Using it from an AI coding agent

The MCP server exposes NostalgiaUI to any MCP client. Five tools:

| Tool                  | What it answers                                                        |
| --------------------- | ---------------------------------------------------------------------- |
| `list_eras`           | the eras, with period and label                                        |
| `list_palettes`       | the palettes, with light or dark appearance and source licence         |
| `get_tokens`          | CSS variables, a Tailwind preset, or DTCG JSON for one era and palette |
| `get_component`       | a component's imports, source, era-specific CSS and the traps to avoid |
| `import_vscode_theme` | a palette from a VS Code theme, with a provenance report               |
| `check_contrast`      | a WCAG audit of one era and palette pairing                            |

The packages are not on npm yet (that is milestone 4), so for now build the
repo and point your client at the built server.

```bash
pnpm install && pnpm build
```

### Claude Code

From the repo root, the included `.mcp.json` registers the server at project
scope automatically; Claude Code asks for approval the first time. To add it
from anywhere else:

```bash
claude mcp add --transport stdio nostalgiaui -- node /absolute/path/to/nostalgia-ui/packages/mcp/dist/cli.js
```

Add `--scope user` to make it available in every project.

### Claude Desktop

Add the server under `mcpServers` in `claude_desktop_config.json`. The file
lives at `~/Library/Application Support/Claude/` on macOS,
`%AppData%\Claude\` on Windows, and `~/.config/Claude/` on Linux.

```json
{
  "mcpServers": {
    "nostalgiaui": {
      "command": "node",
      "args": ["/absolute/path/to/nostalgia-ui/packages/mcp/dist/cli.js"]
    }
  }
}
```

Then ask for something like: build me a settings page in Frutiger Aero with
the Nord palette. The agent should call `get_tokens` and `get_component`, and
the returned notes tell it the things that are easy to get wrong, such as
wrapping everything in `NostalgiaRoot`.

## Accessibility

Contrast is tested across every era and palette pairing, because derived
colours only exist once both axes are chosen and so cannot be checked from
either axis alone.

The published VS Code themes are not WCAG compliant in every role once used as
UI colours. Measured against their own backgrounds, Nord's comment colour
reaches 2.43:1 and Solarized Light's body text 4.13:1, muted text 2.48:1,
string 2.93:1 and yellow 2.98:1. The semantic layer corrects tone to meet AA
while preserving hue and chroma, since hue is what makes a palette
recognisable.

A test also fails the build if any component stylesheet contains a hex value,
a colour function or a named CSS colour.

## Roadmap

| Milestone | Goal                                                         |
| --------- | ------------------------------------------------------------ |
| 0         | Scaffold, tooling, CI                                        |
| 1         | Prove the two axes with 3 eras x 3 palettes and 5 components |
| 2         | VS Code theme importer                                       |
| 3         | MCP server                                                   |
| 4         | Docs site, more eras, publish to npm                         |

## License

MIT. Copyright 2026 Josh Sylvester and Sylvester Works LLC. See [LICENSE](LICENSE).
