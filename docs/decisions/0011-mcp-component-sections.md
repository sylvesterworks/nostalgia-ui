# 0011: get_component answers from the doc, by section, with shared rules in the instructions

Date: 2026-10-27

Status: accepted

## Context

Decision 0005 had `get_component` return the whole picture for one component
in one era: imports, source, CSS and a list of notes. The notes lived in a
`switch` in the MCP server, separate from everything a person reads, and
every component except NostalgiaRoot carried the same reminder about the root
and the stylesheets. The import line for every component also repeated both
stylesheet imports.

Decisions 0007 and 0010 since gave each component a structured doc and props
tables extracted from its types, both shipped in the react manifest. The
server had not caught up (#39).

## Decision

- **The doc is the only source.** `get_component` returns the component's
  doc and props tables from the manifest. The hardcoded notes and the
  hardcoded list of each family's parts are gone; the import line is built
  from the doc's anatomy.
- **A section parameter.** `section` takes one of the doc's fields: summary,
  anatomy, props, patterns, doAndDont, accessibility, extensibility, eraNotes
  or notes. The answer is then that field alone, with the component name and
  era. `props` returns the extracted tables together with the doc's guidance
  on when to use each prop. With no section, the answer is the whole picture
  plus `props` and `doc`.
- **Era notes follow the era.** `eraNotes` holds only the requested era's
  note, the same way the CSS is filtered to that era.
- **Shared rules go in the instructions.** The server sends instructions at
  initialization, built from the foundations doc rule by rule: render inside
  NostalgiaRoot, import the two stylesheets once, and the rest. No
  per-component answer repeats them, and the import line names the
  component's parts only.

## Consequences

- A change to a doc changes what agents are told, with no server edit.
- An agent can ask for Button accessibility and receive only that. The full
  answer for Dialog shares no doc text with Button, which a test checks.
- An MCP client that ignores server instructions misses the shared rules.
  The tool description says they are there, so an agent that reads it knows
  to look.
- The answer is larger without a section, since it now carries props tables
  and the full doc. Section requests are the way to keep it small.
