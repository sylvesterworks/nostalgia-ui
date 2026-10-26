# 0003: Comment stripping in get_component leaves blank lines and drops useful context

Date: 2026-10-25

Status: open

Source: `get_component` for Tabs during the first end-to-end run of `@nostalgiaui/mcp` 0.1.1.

## Gap

The `baseCss` returned for Tabs has an empty line inside the `.nui-TabIndicator` block, between `background` and `translate`. The source file `packages/react/src/styles/tabs.css` is clean. The line is an artefact of `splitCssByEra` in `packages/mcp/src/tools.ts` (line 181), which deletes every `/* ... */` comment with a regex and leaves the indentation and newline that surrounded it.

Two consequences:

1. Cosmetic. The server hands this CSS to agents as reference source, and a blank line mid-rule reads like an accidental deletion.
2. Lost information. The comment that was stripped said the `--active-tab-left` and `--active-tab-width` variables are geometry published by Base UI's Indicator part. That is exactly the kind of explanation an agent needs, and it is the kind of thing the section-divider comments in each stylesheet (`/* ---- Frutiger Aero ... */`) also carry. The splitter throws all of it away.

## What to do

1. In `splitCssByEra`, decide what to do with comments rather than deleting them blindly. Suggested rule: drop the section-divider comments that only name an era (they are redundant once rules are grouped by era), keep comments that sit inside a rule block, since those explain a declaration.
2. Whichever rule is chosen, collapse whitespace-only lines left behind by removed comments so no rule contains a blank line. A simple post-pass that removes lines matching `^\s*$` inside `{...}` is enough.
3. Add a test in `packages/mcp/src/tools.test.ts` that feeds a rule containing an inline comment through the splitter and asserts both that no blank line remains and that the inline comment survives.
4. Note the behaviour in the tool description for `get_component` so agents know the CSS is a filtered view of the stylesheet, not a verbatim copy.

## Done when

`get_component` for Tabs returns a `.nui-TabIndicator` block with no blank lines and with the Base UI geometry comment intact, and the splitter test covers both.
