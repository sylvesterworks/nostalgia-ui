# @nostalgiaui/react

## 0.2.0

### Minor Changes

- 01eec6a: Component docs gain a `variants` field: the stories that show a variant as it is, with no pattern or do and don't pair of their own. It appears on each manifest entry's `doc`. Every story is now a pattern, half of a do and don't pair, or a variant, and tests enforce that along with the other documentation rules (#41).
- f74912a: `@nostalgiaui/react/manifest` now carries each component's documentation and props. Every entry gains `doc`, the component's structured doc, and `props`, a table per part with each prop's name, type, whether it is required, its default and its description, extracted from the TypeScript types. Props come from this package and from Base UI; inherited React and DOM attributes are left out. A new `foundations` export holds the rules every component shares. The public React API is unchanged, and the build-only `cli.js` is no longer published.

### Patch Changes

- 89c073f: Organize the source into one folder per component, holding its source, stylesheet, stories, documentation and an `index.ts`. Public exports and the rules in `styles.css` are unchanged. The `stylesheet` field in `@nostalgiaui/react/manifest` now names the component's own file (for example `Button.css`, `NostalgiaRoot.css`) instead of the old lowercase names, and the NostalgiaRoot entry's CSS includes the shared foundation rules that used to live in `base.css`.
- Updated dependencies [fcca3e0]
  - @nostalgiaui/tokens@0.2.0

## 0.1.3

### Patch Changes

- 51a1654: Compose class names with clsx instead of a hand-rolled array filter and join. Rendered class names are unchanged.

## 0.1.2

### Patch Changes

- 9087d95: Add a `danger` Button variant for destructive actions. It reads the palette's own error colour and a new `text-on-danger` semantic token, and each era gives it the same treatment it gives a solid button: Frutiger Aero gloss, Classic Windows bevel, Flat / Metro hover and active fills, Neubrutalism hard shadow. The contrast audit, and therefore `check_contrast`, now covers text on the danger fill in every pairing.
- Updated dependencies [9087d95]
  - @nostalgiaui/tokens@0.1.2

## 0.1.1

### Patch Changes

- 992a870: Add install and usage commands to each package README, now that the packages are on npm. This is also the first release published from CI through npm Trusted Publishing, with provenance and no stored token.
- Updated dependencies [992a870]
  - @nostalgiaui/tokens@0.1.1

## 0.1.0

### Minor Changes

- a616b48: First release. Button, Input, Card, Tabs and Dialog on Base UI 1.9, styled only through tokens, plus NostalgiaRoot, which carries the era and palette attributes and is what portalled parts render into.

### Patch Changes

- Updated dependencies [a616b48]
  - @nostalgiaui/tokens@0.1.0
