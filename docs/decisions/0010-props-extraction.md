# 0010: Props tables are extracted from the types, React attributes left out

Date: 2026-10-26

Status: accepted

## Context

Decision 0007 split component documentation in two. A `<Name>.docs.ts` holds
what only a person can say: when to use a prop, patterns, do and don't pairs.
What the compiler already knows, a prop's name, type and whether it is
required, was left to be extracted at build time so the two could never
disagree (#38).

Three questions had to be settled to do that.

1. **Which props.** Every part accepts between 275 and 304 props, because each
   one extends a React element's attributes. Only 7 are declared in this
   package. Tabs and Dialog parts declare none of their own; their useful
   props, such as `orientation`, `modal` and `keepMounted`, come from Base UI.
2. **Where defaults come from.** Base UI states defaults in JSDoc `@default`
   tags. This package stated them only in the component's own destructuring,
   such as `variant = 'solid'`, where no type-level tool can read them.
3. **How a type is printed.** The compiler prints `variant` as
   `ButtonVariant | undefined`. A reader of the manifest, such as an agent,
   cannot look up `ButtonVariant`, and `| undefined` repeats what the
   `required` column already says.

## Decision

`packages/react/src/extract/props.ts` builds a TypeScript program over
`src/index.ts` and, for every exported part except hooks, reads the props
parameter of its call signature.

- **Props declared in this package or by Base UI are kept.** Props declared
  in `@types/react` are left out: they are the same on every element and
  documented by React. A prop declared anywhere else fails the build, so a
  new source of props is noticed rather than silently dropped.
- **The description and default come from JSDoc.** Every prop this package
  declares carries a description, and an `@default` tag when it has a
  default. A test checks each `@default` against the default in the code.
- **Types are printed for a reader.** `| undefined` is dropped from optional
  props, and a union of string or number literals is spelled out, so
  `variant` reads as `"solid" | "outline" | "ghost" | "danger"`.
- **Soft line breaks are joined.** JSDoc wraps at the source's width; the
  extracted description keeps only blank-line paragraph breaks, matching the
  `Prose` format of the docs.

The build writes the result into `dist/manifest.js`. Each entry gains `doc`,
the component's doc object, and `props`, the tables of the family's parts in
anatomy order. A top-level `foundations` export carries the rules every
component shares, so a reader can state the NostalgiaRoot requirement once
(#39).

A doc may still describe an inherited React prop when it has something to
say, as Button's doc does for `type`. That prop has no row in the table; the
doc entry is its only description.

The extractor imports `typescript`, a dev dependency, so it and `cli.js` are
left out of the published package. The compiled `*.docs.js` modules are left
out too: the manifest embeds every doc, and only `docs/schema.d.ts` ships, for
the manifest's types.

## Consequences

- Renaming a prop, changing its type or editing its JSDoc changes the
  manifest with no doc edit. A snapshot per part makes each such change a
  deliberate update, including changes that arrive with a new Base UI
  version.
- Base UI's own descriptions ship in the manifest as written. They are not
  checked against this package's prose rules, such as the color rule, because
  they cannot be edited here.
- Base UI types describe what Base UI accepts. Where a wrapper narrows that,
  the table shows the wider type: `className` lists a function form that the
  Input, Tabs and Dialog wrappers currently drop (#62).
- The build creates a second TypeScript program after `tsc -b`, which adds a
  few seconds to the react build.
