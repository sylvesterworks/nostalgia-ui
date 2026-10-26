# @nostalgiaui/tokens

## 0.1.2

### Patch Changes

- 9087d95: Add a `danger` Button variant for destructive actions. It reads the palette's own error colour and a new `text-on-danger` semantic token, and each era gives it the same treatment it gives a solid button: Frutiger Aero gloss, Classic Windows bevel, Flat / Metro hover and active fills, Neubrutalism hard shadow. The contrast audit, and therefore `check_contrast`, now covers text on the danger fill in every pairing.

## 0.1.1

### Patch Changes

- 992a870: Add install and usage commands to each package README, now that the packages are on npm. This is also the first release published from CI through npm Trusted Publishing, with provenance and no stored token.

## 0.1.0

### Minor Changes

- a616b48: First release. Three eras to start with grew to six: Terminal / CRT, Classic Windows, Frutiger Aero, Flat / Metro, Neumorphism and Neubrutalism. Five palettes: Dracula, Nord, Solarized Light, Catppuccin Mocha and One Dark Pro, each with its source licence recorded. Colours an era needs beyond the semantic vocabulary are derived in OKLCH per pairing, and every pairing is audited for WCAG 2.1 AA contrast.
