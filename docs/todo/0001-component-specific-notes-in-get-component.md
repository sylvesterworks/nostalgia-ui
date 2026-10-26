# 0001: Make get_component notes specific to each component

Date: 2026-10-25

Status: open

Source: first end-to-end run of the published `@nostalgiaui/mcp` 0.1.1 server from Claude Code, building a Frutiger Aero x Nord settings page in a fresh Vite app. See `docs/decisions/0005-mcp-server.md` for the server's purpose.

## Gap

`get_component` returns the same two generic notes for every component (render inside NostalgiaRoot; import the stylesheets once at the root). Only Tabs and Dialog add a note of their own. Button and Input return nothing specific to them, and Card returns nothing specific either.

The gap that actually cost the agent time: there is no guidance on composing Button with the Dialog parts. The settings page needed a styled trigger and two styled close buttons. The agent found the Base UI `render` prop by reading the returned source and used `<DialogTrigger render={<Button variant="outline" />}>` and `<DialogClose render={<Button variant="ghost" />}>`. That worked, but it was inferred, not told. The point of the notes is to make the easy-to-get-wrong parts explicit so the agent never has to guess.

This groups two observations from the run: the composition guidance is missing, and the per-component notes are mostly boilerplate.

## What to do

All of this lives in `packages/mcp/src/tools.ts`, in the block that builds the `notes` array for `get_component` (around line 212).

1. Add a Dialog note on composition: DialogTrigger and DialogClose render a plain `<button>` and carry only the `nui-DialogTrigger` or `nui-DialogClose` class, so to get an era-styled button pass `render={<Button variant="..." />}`. Mention that the same `render` prop works on Tab.
2. Add a Button note: the three variants (solid, outline, ghost) are the whole set, `type` defaults to `button`, and `render` swaps the element for links or Base UI triggers.
3. Add an Input note: `invalid` is the only extra prop, it sets both the class and `data-invalid`, and the component is a bare `<input>` with no label, so the caller supplies a `<label htmlFor>`.
4. Add a Card note: Card has no header slot. CardTitle and CardBody are siblings placed by the caller, and anything after CardBody (a form, a button row) needs its own spacing.
5. Keep the two generic notes, but consider moving them to the NostalgiaRoot response and a short "always" line on the others, so the component-specific notes are not buried under boilerplate.
6. Extend `packages/mcp/src/tools.test.ts` so every component asserts at least one note that names that component.

## Done when

`get_component` for each of the six components returns at least one note that could not apply to any other component, and an agent reading the Dialog response knows how to put a styled Button in the trigger and close slots without opening the source.
