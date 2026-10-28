# Storybook

The local development surface for `@nostalgiaui/react`, replacing the
milestone 1 playground. See decision 0007.

```bash
pnpm dev
```

Opens on http://localhost:6006. Era and palette are toolbar controls; every
story renders inside one `NostalgiaRoot` set from them.

## What reloads without a build

- Component source in `packages/react/src`: yes. The Vite config aliases
  `@nostalgiaui/react` and `@nostalgiaui/tokens` to their source.
- Component stylesheets, in each component's folder and in
  `packages/react/src/styles/foundations.css`: yes. The preview imports them
  from source.
- `@nostalgiaui/tokens/tokens.css`: no. It is generated from TypeScript by the
  tokens build, so an era or palette change needs
  `pnpm --filter @nostalgiaui/tokens build`.

## Published

The static build is published with the docs site, at
https://nostalgiaui.sylvester.works/storybook/. `pnpm run build` builds it,
and `pnpm run assemble:site` copies it into the docs output under
`storybook/` and checks every docs link into it against `index.json`. The
deploy workflow runs both; CI runs both too, so a dead story link fails
before merge. The sidebar brand links back to the docs site's components.

## Where stories live

In the component's folder, as
`packages/react/src/components/<Name>/<Name>.stories.tsx`.
The react package excludes them from its build, so they never ship.

## Versions

Recorded when this app was added, 2026-10-26:

| Package                 | Version |
| ----------------------- | ------- |
| `storybook`             | 10.6.3  |
| `@storybook/react-vite` | 10.6.3  |
| `@storybook/addon-a11y` | 10.6.3  |
| `react`, `react-dom`    | 19.3.1  |
| `typescript`            | 6.0.3   |
| `vite`                  | 8.3.5   |
| Node                    | 22.23.2 |

10.6.4 existed on npm at the time but was published the same day, inside
pnpm's minimum release age, so 10.6.3 was pinned rather than exempting the
newer release from that check.
