# @nostalgiaui/react

## 0.2.0

### Minor Changes

- 34edf2a: Add Checkbox and CheckboxIndicator, thin wrappers over Base UI's Checkbox parts, styled in every era with ticked, unticked, mixed and disabled states (#22). The unticked edge uses the muted text color so the box boundary clears 3:1; the mark uses the text color paired with the accent fill. `get_component` now answers for Checkbox.
- 01eec6a: Component docs gain a `variants` field: the stories that show a variant as it is, with no pattern or do and don't pair of their own. It appears on each manifest entry's `doc`. Every story is now a pattern, half of a do and don't pair, or a variant, and tests enforce that along with the other documentation rules (#41).
- 3141dc5: Add the Early Mac era (1984 to 1991), between Terminal / CRT and Classic Windows (#12). It draws every component in two tones, the palette's own text and surface, with a 50% dither and title-bar pinstripes derived from those two. There is no accent: text-bearing states invert the two tones, fills with no text use the dither, and danger is shown by a heavier edge. Muted text keeps its semantic color. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `early-mac`.
- 3c7a914: Add Menu and its parts (MenuTrigger, MenuPortal, MenuPositioner, MenuPopup, MenuItem, MenuSeparator), thin wrappers over Base UI's Menu styled in every era (#25). MenuPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item is drawn as Select's is, on the accent fill with a ring in the body text color, and the contrast audit's `item-highlighted` check covers both. `get_component` now answers for Menu.
- f74912a: `@nostalgiaui/react/manifest` now carries each component's documentation and props. Every entry gains `doc`, the component's structured doc, and `props`, a table per part with each prop's name, type, whether it is required, its default and its description, extracted from the TypeScript types. Props come from this package and from Base UI; inherited React and DOM attributes are left out. A new `foundations` export holds the rules every component shares. The public React API is unchanged, and the build-only `cli.js` is no longer published.
- 9f31c96: Add Select and its parts (SelectLabel, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectPositioner, SelectPopup, SelectList, SelectItem, SelectItemText, SelectItemIndicator), thin wrappers over Base UI's Select styled in every era (#23). SelectPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item uses the accent fill with the text color paired with it, and the contrast audit gains a named `item-highlighted` check, which `check_contrast` now reports. `get_component` now answers for Select.
- 3b614b6: Add Slider and its parts (SliderLabel, SliderValue, SliderControl, SliderTrack, SliderIndicator, SliderThumb), thin wrappers over Base UI's Slider styled in every era (#24). The thumb is drawn in the body text color and larger than the track, so its outline sits on the page surface; the track keeps a muted edge and the range is the accent. The contrast audit gains `slider-thumb-on-surface` and `slider-range-on-track`, which `check_contrast` now reports. `get_component` now answers for Slider.
- c09d3a4: Add Switch and SwitchThumb, thin wrappers over Base UI's Switch parts, styled in every era with on, off and disabled states (#21). The off edge and off thumb use the muted text color and the on thumb uses the text color paired with the accent, so the thumb clears 3:1 against its track. The contrast audit gains two named checks, `switch-thumb-on-track` and `switch-thumb-on-accent`, which `check_contrast` now reports. `get_component` now answers for Switch.
- a2557fe: Add Tooltip and its parts (TooltipProvider, TooltipTrigger, TooltipPortal, TooltipPositioner, TooltipPopup, TooltipArrow), thin wrappers over Base UI's Tooltip styled in every era (#26). TooltipPortal renders into the nearest NostalgiaRoot, as DialogPortal does. Classic Windows derives a warm `tooltip-fill` from the raised surface and the warning color, corrected so body text clears 4.5:1. Eras gain `bodyTextFills`, fills the contrast audit checks for body text only, and `check_contrast` now reports `text-on-tooltip-fill`. `get_component` now answers for Tooltip.
- dcdcced: Add the Web 1.0 era (late 1990s), between Classic Windows and Frutiger Aero (#13). Its bevels are CSS's own `outset` and `inset` border styles, shaded by the browser from one border color, which keeps it apart from Classic Windows. It derives a `link` color, the accent corrected to 4.5:1 on every surface, used for plain links inside NostalgiaRoot, outline and ghost buttons and tabs, and a `tile` tone for a tiled page background, which the audit checks as a text fill. The body font is Times New Roman. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `web-1`.

### Patch Changes

- f54be33: In Frutiger Aero, the card's gloss band now covers only the top padding, above the title, so no text sits under it, and the dialog's glass is painted over the surface rather than over the dimmed page, so its description keeps 4.5:1 (#69).
- 89c073f: Organize the source into one folder per component, holding its source, stylesheet, stories, documentation and an `index.ts`. Public exports and the rules in `styles.css` are unchanged. The `stylesheet` field in `@nostalgiaui/react/manifest` now names the component's own file (for example `Button.css`, `NostalgiaRoot.css`) instead of the old lowercase names, and the NostalgiaRoot entry's CSS includes the shared foundation rules that used to live in `base.css`.
- dcdcced: Fix the selected tab's styling in every era. The stylesheet matched `[data-selected]`, but Base UI 1.9 marks the selected tab with `data-active`, so no era's selected-tab rule applied, and the eras that hide the indicator showed no selection at all. A test now checks the attribute.
- Updated dependencies [3141dc5]
- Updated dependencies [fcca3e0]
- Updated dependencies [f54be33]
- Updated dependencies [9f31c96]
- Updated dependencies [3b614b6]
- Updated dependencies [c09d3a4]
- Updated dependencies [a2557fe]
- Updated dependencies [dcdcced]
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
