# @nostalgiaui/react

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
