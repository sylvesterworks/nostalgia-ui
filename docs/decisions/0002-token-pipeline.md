# 0002: Tokens are built by a script, not by Style Dictionary

Date: 2026-10-25

Status: accepted

## Context

The project brief suggested Style Dictionary for the token build. Style
Dictionary is good at taking declared token values and transforming them into
many output formats.

That is not the hard part here. The hard part is that an era's colours do not
exist until a palette is chosen. A Classic Windows bevel highlight is the
surface lightened in OKLCH; a Frutiger Aero gloss band is a set of alpha stops
derived from the same surface. These are functions, not values, and they have
to be evaluated across the cross product of eras and palettes.

## Decision

`packages/tokens` builds its artefacts with a plain TypeScript module compiled
by the same `tsc` invocation as the rest of the package. Eras declare colour
recipes as functions of the semantic colours, and the build evaluates them for
each pairing.

Four artefacts are emitted:

- `palettes.css`, colour only, one block per palette
- `eras.css`, shape only, one block per era
- `pairings.css`, the evaluated recipes, the only file mentioning both axes
- `tokens.dtcg.json` and `tailwind-preset.js` for consumers

## Consequences

The build has no dependency beyond `culori`, and needs no install-script
approval, which matters because pnpm 11 blocks dependency build scripts by
default.

Expressing a derivation means writing a function rather than configuring a
transform, which is more direct for the colour maths and less discoverable for
anyone expecting a standard pipeline.

The DTCG artefact remains the hand-off point. If a transform pipeline is
wanted later, it can consume that file without this package changing.

A consequence worth stating plainly: `pairings.css` names both axes. The
SOURCE files stay independent, since an era declares a recipe and a palette
declares colour, but the generated cross product cannot be independent,
because the whole point of a derived colour is that it depends on both. Adding
a palette regenerates that file and touches no era source.

## Alternative considered

CSS relative colour syntax (`oklch(from var(--surface) calc(l + 0.2) c h)`)
would let the browser derive era colours at runtime, removing `pairings.css`
entirely. It was rejected for now because the derived values would then exist
only in the browser, where the contrast suite, the DTCG export and the
milestone 3 `get_tokens` MCP tool cannot see them. Worth revisiting if those
constraints change.
