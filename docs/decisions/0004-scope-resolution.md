# 0004: Importing a theme reports its own uncertainty

Date: 2026-10-25

Status: accepted

## Context

A VS Code theme and a NostalgiaUI palette do not describe the same thing. A
theme colours an editor; a palette has to colour an interface. The eight
primitives the token layer needs are not a subset of what a theme publishes,
and the gap varies enormously between themes.

Themes also vary structurally in ways the format permits:

- `tokenColors` may be an inline array of rules, or a path to a `.tmTheme` file
- `scope` may be absent, a single selector, a comma separated list, or an array
- a theme may extend another file through `include`
- the `colors` block may be missing entirely
- colour values may carry an alpha suffix
- a theme may declare `type: dark` while actually being light

An importer that silently produced eight colours from any of these would be
giving the same confident answer to a complete theme and to an empty object.

## Decision

The importer returns primitives **and a provenance record for each one**:

| Provenance  | Meaning                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| `exact`     | Taken straight from the theme, by colour key or by an exactly matching scope |
| `inherited` | A related scope matched, but not one of the selectors asked for              |
| `derived`   | Nothing matched, so the value was computed from another value in this theme  |
| `fallback`  | Nothing in the theme could inform it                                         |

Structural problems become warnings that name the specific cause, so a theme
whose `tokenColors` points at a file says so rather than appearing to have no
syntax colours.

### Scope resolution

Each role has a ranked list of target selectors, for example
`keyword.control` then `keyword` then `storage.type`. Resolution runs in two
passes:

1. Look for an exact scope match across every target, in order.
2. Only then fall back to the rule sharing the longest dotted prefix with the
   most preferred target that matches anything.

The two passes matter. With a single pass, asking for `comment.line` in a
theme that styles plain `comment` reports an inherited match, even though the
very next target would have hit exactly. That would mark a complete theme as
having been guessed at.

A consequence worth stating: matching a _less preferred_ target exactly is
still `exact`, not `inherited`. A theme that styles `keyword` rather than
`keyword.control` has explicitly coloured keywords, and calling that a guess
would make the report cry wolf.

### Derivation, when nothing matches

Missing roles are computed from what the theme does contain, rather than from
constants. Comments become the background mixed toward the foreground. Other
syntax roles rotate the keyword colour to the conventional hue for that role in
OKLCH, keeping lightness and chroma. The result stays in the theme's own tonal
family, which is a better guess than a stock red or green belonging to no
palette. It is still a guess, and it is reported as one.

### What the importer does not do

It does not correct contrast. The semantic layer already enforces WCAG AA for
every palette it is given, so an imported palette arrives at the same
guarantees as a hand written one without the importer duplicating that logic.
The test suite asserts this directly for every fixture.

It does not write into `packages/tokens`. `--out` scaffolds a palette module
and a `SOURCE.md` stub with the licence line deliberately left blank, because
recording a theme's licence is a judgement a person has to make.

## Consequences

`--strict` makes the provenance record actionable: CI can refuse an import
that guessed at anything.

The ranked selector lists are a maintenance surface. A theme using an unusual
scope convention will resolve by inheritance where a better list would have hit
exactly, and the fix is to extend the list rather than to change the algorithm.

Test fixtures are synthesised in-repo rather than copied from published themes.
Real theme files carry licence obligations and considerable bulk, and none of
that buys test value: what needs exercising is the shape of the format, not any
particular author's colour choices.

## Addendum, 2026-10-25: the error role, learned from a real theme

The first run on a published theme, One Dark Pro, resolved all eight
primitives exactly and still produced a wrong palette: `error` came back
`#ffffff`. The theme styles `invalid.illegal` as white text because in the
editor it sits on a red fill, and the importer read only foregrounds.

Two changes follow. The workbench's `editorError.foreground` (and
`errorForeground`) are consulted before any `invalid.*` scope, since they are
the colour a person would call the theme's red. And an `invalid.*` foreground
with almost no chroma is treated as no match rather than as a colour, so the
role derives from the keyword hue instead of becoming white or grey.

The general lesson: an exact scope match is evidence that the theme styled
that scope, not evidence that the styled value is a colour of the kind the
role needs.
