---
'@nostalgiaui/mcp': minor
---

`get_component` now answers from each component's structured documentation. The full answer adds `props`, a table per part extracted from the TypeScript types, and `doc`, with `eraNotes` narrowed to the requested era. A new optional `section` parameter returns one doc field alone, such as `accessibility` or `props`. The rules every component shares, rendering inside `NostalgiaRoot` and importing the two stylesheets once among them, are now sent once as the server's instructions; per-component answers no longer repeat them, `notes` moved into `doc.notes`, and `imports` holds only the component import line. The package also exports `COMPONENT_SECTIONS`, `serverInstructions` and the `ComponentSection` and `ComponentSectionAnswer` types.
