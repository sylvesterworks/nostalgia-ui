# NostalgiaUI

An open source design system that renders any interface in the style of a past design era, using color palettes drawn from popular VS Code themes. Built on [Base UI](https://base-ui.com) and shipped with an MCP server so AI coding agents can use it directly.

> Status: milestone 0. The repo is scaffolded, the design is settled, and the first tokens and components land in milestone 1.

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

## Development

Requires Node 22 or newer and pnpm 11.

```bash
pnpm install
pnpm check      # lint, typecheck, test, build
```

Individual tasks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Roadmap

| Milestone | Goal                                                         |
| --------- | ------------------------------------------------------------ |
| 0         | Scaffold, tooling, CI                                        |
| 1         | Prove the two axes with 3 eras x 3 palettes and 5 components |
| 2         | VS Code theme importer                                       |
| 3         | MCP server                                                   |
| 4         | Docs site, more eras, publish to npm                         |

## License

MIT. See [LICENSE](LICENSE).
