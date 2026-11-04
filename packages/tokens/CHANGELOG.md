# @nostalgiaui/tokens

## 0.2.0

### Minor Changes

- 3141dc5: Add the Early Mac era (1984 to 1991), between Terminal / CRT and Classic Windows (#12). It draws every component in two tones, the palette's own text and surface, with a 50% dither and title-bar pinstripes derived from those two. There is no accent: text-bearing states invert the two tones, fills with no text use the dither, and danger is shown by a heavier edge. Muted text keeps its semantic color. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `early-mac`.
- fcca3e0: Type the era-derived token contract. `ERA_DERIVED_REQUIRED` names the three keys every era must return (`shadow-raised`, `shadow-overlay`, `focus-color`), `Era` and `EraDerivation` are generic in their derived keys with a default matching the old shape, `defineEra` infers an era's extra keys from its object literal, and `EraExtraKey` reads them back. A test checks every era against every palette for the required set. Emitted CSS variable names are unchanged. Decision record 0009 states the rule: era-specific keys only inside `[data-era]` rules.
- f54be33: Muted text now meets WCAG AA for body text (4.5:1) on every surface in every palette; it was raised only to 3:1, so card bodies, dialog descriptions, inactive tabs and placeholders failed (#69). Eras gain an optional `textFills` list naming the derived fills text sits on, and the contrast audit, and with it `check_contrast`, now checks muted text on all three surfaces and body and muted text on each era's text fills. Flat / Metro's `surface-hover` and Frutiger Aero's `glass-fill` now stay between the base and raised surfaces, so text contrast holds on them. A new `composite` helper paints a translucent fill over a backdrop for measuring.
- 9f31c96: Add Select and its parts (SelectLabel, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectPositioner, SelectPopup, SelectList, SelectItem, SelectItemText, SelectItemIndicator), thin wrappers over Base UI's Select styled in every era (#23). SelectPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item uses the accent fill with the text color paired with it, and the contrast audit gains a named `item-highlighted` check, which `check_contrast` now reports. `get_component` now answers for Select.
- 3b614b6: Add Slider and its parts (SliderLabel, SliderValue, SliderControl, SliderTrack, SliderIndicator, SliderThumb), thin wrappers over Base UI's Slider styled in every era (#24). The thumb is drawn in the body text color and larger than the track, so its outline sits on the page surface; the track keeps a muted edge and the range is the accent. The contrast audit gains `slider-thumb-on-surface` and `slider-range-on-track`, which `check_contrast` now reports. `get_component` now answers for Slider.
- c09d3a4: Add Switch and SwitchThumb, thin wrappers over Base UI's Switch parts, styled in every era with on, off and disabled states (#21). The off edge and off thumb use the muted text color and the on thumb uses the text color paired with the accent, so the thumb clears 3:1 against its track. The contrast audit gains two named checks, `switch-thumb-on-track` and `switch-thumb-on-accent`, which `check_contrast` now reports. `get_component` now answers for Switch.
- a2557fe: Add Tooltip and its parts (TooltipProvider, TooltipTrigger, TooltipPortal, TooltipPositioner, TooltipPopup, TooltipArrow), thin wrappers over Base UI's Tooltip styled in every era (#26). TooltipPortal renders into the nearest NostalgiaRoot, as DialogPortal does. Classic Windows derives a warm `tooltip-fill` from the raised surface and the warning color, corrected so body text clears 4.5:1. Eras gain `bodyTextFills`, fills the contrast audit checks for body text only, and `check_contrast` now reports `text-on-tooltip-fill`. `get_component` now answers for Tooltip.
- dcdcced: Add the Web 1.0 era (late 1990s), between Classic Windows and Frutiger Aero (#13). Its bevels are CSS's own `outset` and `inset` border styles, shaded by the browser from one border color, which keeps it apart from Classic Windows. It derives a `link` color, the accent corrected to 4.5:1 on every surface, used for plain links inside NostalgiaRoot, outline and ghost buttons and tabs, and a `tile` tone for a tiled page background, which the audit checks as a text fill. The body font is Times New Roman. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `web-1`.

## 0.1.2

### Patch Changes

- 9087d95: Add a `danger` Button variant for destructive actions. It reads the palette's own error colour and a new `text-on-danger` semantic token, and each era gives it the same treatment it gives a solid button: Frutiger Aero gloss, Classic Windows bevel, Flat / Metro hover and active fills, Neubrutalism hard shadow. The contrast audit, and therefore `check_contrast`, now covers text on the danger fill in every pairing.

## 0.1.1

### Patch Changes

- 992a870: Add install and usage commands to each package README, now that the packages are on npm. This is also the first release published from CI through npm Trusted Publishing, with provenance and no stored token.

## 0.1.0

### Minor Changes

- a616b48: First release. Three eras to start with grew to six: Terminal / CRT, Classic Windows, Frutiger Aero, Flat / Metro, Neumorphism and Neubrutalism. Five palettes: Dracula, Nord, Solarized Light, Catppuccin Mocha and One Dark Pro, each with its source licence recorded. Colours an era needs beyond the semantic vocabulary are derived in OKLCH per pairing, and every pairing is audited for WCAG 2.1 AA contrast.
