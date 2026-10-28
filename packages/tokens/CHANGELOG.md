# @nostalgiaui/tokens

## 0.2.0

### Minor Changes

- fcca3e0: Type the era-derived token contract. `ERA_DERIVED_REQUIRED` names the three keys every era must return (`shadow-raised`, `shadow-overlay`, `focus-color`), `Era` and `EraDerivation` are generic in their derived keys with a default matching the old shape, `defineEra` infers an era's extra keys from its object literal, and `EraExtraKey` reads them back. A test checks every era against every palette for the required set. Emitted CSS variable names are unchanged. Decision record 0009 states the rule: era-specific keys only inside `[data-era]` rules.

## 0.1.2

### Patch Changes

- 9087d95: Add a `danger` Button variant for destructive actions. It reads the palette's own error colour and a new `text-on-danger` semantic token, and each era gives it the same treatment it gives a solid button: Frutiger Aero gloss, Classic Windows bevel, Flat / Metro hover and active fills, Neubrutalism hard shadow. The contrast audit, and therefore `check_contrast`, now covers text on the danger fill in every pairing.

## 0.1.1

### Patch Changes

- 992a870: Add install and usage commands to each package README, now that the packages are on npm. This is also the first release published from CI through npm Trusted Publishing, with provenance and no stored token.

## 0.1.0

### Minor Changes

- a616b48: First release. Three eras to start with grew to six: Terminal / CRT, Classic Windows, Frutiger Aero, Flat / Metro, Neumorphism and Neubrutalism. Five palettes: Dracula, Nord, Solarized Light, Catppuccin Mocha and One Dark Pro, each with its source licence recorded. Colours an era needs beyond the semantic vocabulary are derived in OKLCH per pairing, and every pairing is audited for WCAG 2.1 AA contrast.
