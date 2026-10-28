# 0012: The docs site renders the stories itself, from source, one page per component

Date: 2026-10-27

Status: accepted

## Context

The docs site had one Components page: a list of notes and a collapsed source
dump per component. Decision 0007 gave each component a structured doc and a
stories file, and decision 0010 added props tables to the manifest. #40 asked
for one page per component built from those, with the stories running live,
and without the Storybook runtime in the site.

## Decision

- **One route per component.** `/components/<name>/` is generated from the
  manifest. `/components/` lists the shared rules from the foundations doc and
  one card per component. A sidebar on every component page lists them all.
- **Every word comes from a doc.** The pages render the doc fields, the
  extracted props tables and the component source. The doc's guidance on a
  prop sits beside its extracted row; guidance for props the tables leave out,
  such as React's own `type`, follows the table. The doc's prose subset is
  rendered by a small escaping renderer in the site.
- **Stories are plain modules.** The site loads the stories files with
  `import.meta.glob` and renders a story the way Storybook would: its `render`
  function, or the meta's component, with the meta's args under the story's.
  The stories import Storybook for types only, so nothing from Storybook is in
  the build.
- **Source, for the examples only.** The stories are not in the published
  package, so they and the components they import come from
  `packages/react/src`. The examples import NostalgiaRoot from source too, so
  the root and the story share one copy of its portal context. The rest of the
  site still uses the built package.
- **Which stories appear where.** Patterns and do and don't render the stories
  the doc points at. Live examples render the rest of the stories file, the
  variants, once each.
- **One era and palette per page.** Each example is its own island; a small
  module store holds the page's choice, so one set of pickers drives every
  example.
- **Stories that open a modal on load wait for a click.** In Storybook a story
  has the canvas to itself. On a docs page Dialog's `Open` and
  `DontTitleAfterDescription` opened together, locked scrolling and trapped
  focus. The site lists those two and mounts them behind a button; the stories
  are unchanged. A name on the list that is not a story fails the build.

## Consequences

- A change to a doc, a story or a prop's JSDoc changes the page with no site
  edit.
- The examples run the source, not the published JavaScript. The stylesheet is
  still the built one, so a CSS change needs the react build either way.
- A new story that opens a modal on load has to be added to the site's list,
  or it will take over its page. Nothing detects that yet.
- A story rendered twice on one page renders its markup twice, so a story with
  a fixed `id` duplicates it.
