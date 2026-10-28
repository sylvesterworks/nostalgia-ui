# @nostalgiaui/mcp

## 0.2.0

### Minor Changes

- 03ffc24: `get_component` now answers from each component's structured documentation. The full answer adds `props`, a table per part extracted from the TypeScript types, and `doc`, with `eraNotes` narrowed to the requested era. A new optional `section` parameter returns one doc field alone, such as `accessibility` or `props`. The rules every component shares, rendering inside `NostalgiaRoot` and importing the two stylesheets once among them, are now sent once as the server's instructions; per-component answers no longer repeat them, `notes` moved into `doc.notes`, and `imports` holds only the component import line. The package also exports `COMPONENT_SECTIONS`, `serverInstructions` and the `ComponentSection` and `ComponentSectionAnswer` types.

### Patch Changes

- Updated dependencies [89c073f]
- Updated dependencies [01eec6a]
- Updated dependencies [fcca3e0]
- Updated dependencies [f74912a]
  - @nostalgiaui/react@0.2.0
  - @nostalgiaui/tokens@0.2.0
  - @nostalgiaui/importer@0.1.3

## 0.1.3

### Patch Changes

- Updated dependencies [51a1654]
  - @nostalgiaui/react@0.1.3

## 0.1.2

### Patch Changes

- 1e16014: `get_component` notes are now specific to each component. NostalgiaRoot carries the full guidance that applies everywhere; every other component gets a one line reminder plus notes that could apply to nothing else, including how to put an era-styled Button into DialogTrigger, DialogClose and Tab with the `render` prop.
- bfcf4dc: `get_component` now keeps comments that sit inside a CSS rule, drops only the section-divider comments outside rules, and leaves no blank lines behind. The tool description says the CSS is a filtered view of the stylesheet.
- 9087d95: Add a `danger` Button variant for destructive actions. It reads the palette's own error colour and a new `text-on-danger` semantic token, and each era gives it the same treatment it gives a solid button: Frutiger Aero gloss, Classic Windows bevel, Flat / Metro hover and active fills, Neubrutalism hard shadow. The contrast audit, and therefore `check_contrast`, now covers text on the danger fill in every pairing.
- Updated dependencies [9087d95]
  - @nostalgiaui/react@0.1.2
  - @nostalgiaui/tokens@0.1.2
  - @nostalgiaui/importer@0.1.2

## 0.1.1

### Patch Changes

- 992a870: Add install and usage commands to each package README, now that the packages are on npm. This is also the first release published from CI through npm Trusted Publishing, with provenance and no stored token.
- Updated dependencies [992a870]
  - @nostalgiaui/tokens@0.1.1
  - @nostalgiaui/react@0.1.1
  - @nostalgiaui/importer@0.1.1

## 0.1.0

### Minor Changes

- a616b48: First release. Six tools for MCP clients: list_eras, list_palettes, get_tokens, get_component, import_vscode_theme and check_contrast. Served over stdio with protocol negotiation.

### Patch Changes

- Updated dependencies [a616b48]
- Updated dependencies [a616b48]
- Updated dependencies [a616b48]
  - @nostalgiaui/importer@0.1.0
  - @nostalgiaui/react@0.1.0
  - @nostalgiaui/tokens@0.1.0
