# NostalgiaUI

An open source design system that renders any interface in the style of a past design era, using color palettes drawn from popular VS Code themes. Built on [Base UI](https://base-ui.com) and shipped with an MCP server so AI coding agents can use it directly.

> Status: milestone 1 complete. Three eras, three palettes, five components and a live playground. The VS Code theme importer is milestone 2.

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
