# 0005: The MCP server answers with everything needed to render, not just data

Date: 2026-10-25

Status: accepted

## Context

The brief for the MCP server lists five tools and a demo target: an agent
asked to build a settings page in Frutiger Aero with the Nord palette should
succeed end to end. The failure mode to design against is an agent that gets
back correct-looking data, writes plausible code, and produces a page that
renders unstyled.

That failure mode is not hypothetical. Milestone 1's dialog rendered with no
surface, border or title bar because Base UI portals it outside the element
carrying the token attributes. The markup was right and the result was
invisible. An agent fed only a component's TSX would reproduce that bug every
time.

## Decisions

### `get_component` returns the whole picture

For one component in one era, the tool returns the import lines including both
stylesheets, the TSX source, the stylesheet rules that apply in every era, the
rules scoped to the requested era, and a list of notes about what is easy to
get wrong. Other eras' rules are dropped, since an agent working in Frutiger
Aero gains nothing from reading the Classic Windows bevel rules.

The notes are the part that encodes experience: every component must sit
inside `NostalgiaRoot`, `DialogPortal` renders into that root rather than
`document.body`, `TabIndicator` goes inside `TabList`. Each note corresponds to
a bug that was actually hit while building the library.

### `get_tokens` returns one pairing, not the generated files

An agent building in one era and one palette needs exactly those variables.
The generated `pairings.css` carries every pairing, and handing it over would
bury the twenty lines that matter inside two hundred that do not. The `css`
format returns three scoped blocks: the palette, the era, and the derived
pairing. `dtcg` is filtered the same way. `tailwind` is the same preset for
every pairing, since it maps utilities onto variables rather than values.

### Component source is embedded at build time

`get_component` answers from a manifest generated when `packages/react`
builds, holding each component's source and stylesheet. Reading from `src` at
runtime would break once the package is published, because `src` may not
ship and relative paths do not survive. The cost is a rebuild to refresh the
manifest, which is the lesser problem.

### Contrast rules became an API

`check_contrast` needs the same rules the test suite applies. Those rules lived
only inside `contrast.test.ts`, and two implementations of one rule set drift.
`auditContrast` in `packages/tokens` is now the single implementation; the
test asserts that it passes and the tool returns its findings. The test suite
shrank from 131 cases to 69 as a result, with identical coverage, and a guard
on the number of findings catches a rule being dropped.

### Errors are results, not rejections

An unknown era or component name comes back as a tool result with `isError`
and a message listing the valid names, not as a protocol-level failure. The
model can read the former and correct itself. The server package applies the
same policy to schema violations, which an integration test confirms.

### `serveStdio`, not a hand-wired transport

The documentation is explicit that constructing `StdioServerTransport` by hand
still compiles but only serves 2025-era clients. `serveStdio` negotiates the
protocol revision per client. It calls the server factory whenever it needs an
instance, including for a discovery probe that is discarded if the client
falls back, so `createServer` must return a fresh server on every call.

## A package name worth recording

The project brief suggested `@modelcontextprotocol/sdk`. The current
documentation uses `@modelcontextprotocol/server` with a matching
`@modelcontextprotocol/client`. Both the old and new packages are live on npm
and neither is marked deprecated, so nothing would have flagged the older one.
It would simply have produced a server that only talks to older clients. This
is the second time in this project that verifying a package name against
current docs rather than memory changed the outcome; Base UI's rename was the
first.

## Consequences

Every tool's logic is a plain function in `tools.ts`, tested directly. The
server file is reduced to schema declarations and a thin adapter. A second
transport, if ever wanted, would reuse `tools.ts` unchanged.

The integration test spawns the built CLI and drives it through the client
package over stdio. It is the test that catches a tool that works as a
function but is registered wrong, has a bad schema, or writes to stdout and
corrupts the wire. It depends on `dist/cli.js` existing, which the turbo
pipeline guarantees by building before testing.

What is not verified here: the end-to-end experience inside Claude Code
itself. The server is verified to answer correctly over the protocol, and the
returned CSS and source are verified to render in the playground. Whether a
model, given these tools, builds a good settings page is a question only a
real session answers.
