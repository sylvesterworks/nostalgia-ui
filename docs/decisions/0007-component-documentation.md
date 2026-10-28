# 0007: Component documentation is a typed source with three readers

Date: 2026-10-26

Status: accepted

## Context

A component library is only as good as its documentation, and documentation
is only as good as the rules that enforce it.

Today the documentation for each component lives in four places, none of
which knows about the others:

- The Components page on the docs site is one long page with six sections.
  Each has an imports block, a short "Worth knowing" list and a collapsed dump
  of the source.
- The guidance an agent receives from the MCP server's `get_component` tool is
  hardcoded in a `switch` statement in `packages/mcp/src/tools.ts`.
- Props are described in JSDoc comments that nothing reads.
- Examples exist only as markup inside the playground and the docs site.

"Must render inside NostalgiaRoot" is repeated on every component. A tested
rule in the MCP suite requires each component to carry a note unique to it,
but that rule lives next to the MCP server rather than next to the component.
At six components this is untidy. At forty it does not hold together.

There is also a development cost. The docs app and the playground import
`@nostalgiaui/react` through package exports that point at `dist`, so an edit
to a component or its stylesheet is invisible until `tsc -b` rebuilds the
package. There is no watch script.

## Decision

Component documentation is a typed, structured source in the react package.
It has one schema and three readers: Storybook for development, the Astro
docs site for people, and the MCP server for agents.

### One doc file per component

Each component has a `<Component>.docs.ts` file next to its source. It exports
a `ComponentDoc` object typed against `packages/react/src/docs/schema.ts`.

- No database, no CMS and no Markdown files. A doc is edited in a code editor
  on a branch and lands through a PR, like any other source.
- Prop names in a doc are typed against the component's own props, so a
  misspelled or removed prop is a type error.
- Prop types and defaults are not written in the doc. They are extracted from
  the TypeScript types at build time, so they cannot disagree with the code.

The sections of the schema (summary, anatomy, props, patterns, do and don't,
accessibility, extensibility, era notes, notes) are defined when the schema
is written, under issue #37.

#41 added a `variants` section: the stories that show a variant with no
pattern or do and don't pair of their own, so that every story is listed by
exactly one section. The guardrail tests in `docs.test.ts` enforce it.

### Rules that apply to everything are stated once

`foundations.docs.ts` holds what is true of every component: render inside
`NostalgiaRoot`, import the two stylesheets once at the root, and the
class-name contract. Per-component docs do not repeat it.

### Examples are stories

Examples are Storybook stories in `<Component>.stories.tsx`, next to the
component. A doc refers to a story by its export name and never embeds
example code as a string. Every pattern, every "do" and every "don't" is
therefore a real story that renders and can be checked, not a code sample that
can rot.

### Prose is a small Markdown subset

Prose fields are strings that allow paragraphs, inline code and links, and
nothing else. The docs site renders them. The MCP server passes them through
unchanged.

### One built artifact

The react build script already writes `dist/manifest.js` with each
component's source and CSS. It will also carry each doc and a props table
extracted from the TypeScript types. That manifest is the one artifact all
three readers consume.

### Storybook replaces the playground

Storybook on `@storybook/react-vite` replaces `apps/playground` as the local
development surface. Its Vite config aliases the workspace packages to their
source, so component and stylesheet edits show without a rebuild. A
decorator wraps every story in `NostalgiaRoot`, with era and palette as
toolbar controls.

## Why TypeScript objects rather than Markdown

- The schema is enforced by `tsc`, with no separate validator to maintain.
- Prop names and story references are typed against the real interfaces and
  exports, so renaming a prop or a story breaks the build in the doc that
  mentions it.
- All three readers import the doc directly. None of them needs a parser.

## Alternatives considered

**Markdown or MDX files per component.** Familiar, and pleasant to write
prose in. Rejected because nothing would check that a prop named in the text
exists, or that an example still compiles, without building the validator
that TypeScript already is.

**A CMS or a database.** Rejected because documentation would then change
outside the review process that the code goes through. A doc that disagrees
with its component should fail in the same PR that caused the disagreement.

**JSDoc as the only source.** It already exists and costs nothing. Rejected
because JSDoc has no structure for do and don't pairs, patterns or era
notes, and because nothing currently reads it.

**`@storybook-astro/framework`.** Rejected because it renders `.astro`
components, and the components here are React.

## Consequences

The work lands in order: Storybook (#36), the schema and the first docs
(#37), props extraction (#38), the MCP server reading the docs (#39), one
docs page per component (#40), guardrail tests (#41), and a static Storybook
published under `/storybook` (#42).

Until #39 lands, the notes exist in two places: in the new doc files and in
the MCP server's `switch`. The `switch` is deleted by #39, not before, so the
MCP server keeps answering correctly in between.

Documentation becomes enforceable. The tests in #37 and #41 fail the build
when a component has no doc, when a doc references a story that does not
exist, when a doc names a color, or when a section is empty without an
explicit reason.

The playground also hosts the VS Code theme import preview from milestone 2.
Retiring the playground means that preview needs a home, which #36 decides.

The cost is ceremony. Adding a component now means writing its doc and its
stories as well as its source and stylesheet. That cost is the point of this
decision.
