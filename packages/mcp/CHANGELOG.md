# @nostalgiaui/mcp

## 0.2.0

### Minor Changes

- 03ffc24: `get_component` now answers from each component's structured documentation. The full answer adds `props`, a table per part extracted from the TypeScript types, and `doc`, with `eraNotes` narrowed to the requested era. A new optional `section` parameter returns one doc field alone, such as `accessibility` or `props`. The rules every component shares, rendering inside `NostalgiaRoot` and importing the two stylesheets once among them, are now sent once as the server's instructions; per-component answers no longer repeat them, `notes` moved into `doc.notes`, and `imports` holds only the component import line. The package also exports `COMPONENT_SECTIONS`, `serverInstructions` and the `ComponentSection` and `ComponentSectionAnswer` types.

### Patch Changes

- 34edf2a: Add Checkbox and CheckboxIndicator, thin wrappers over Base UI's Checkbox parts, styled in every era with ticked, unticked, mixed and disabled states (#22). The unticked edge uses the muted text color so the box boundary clears 3:1; the mark uses the text color paired with the accent fill. `get_component` now answers for Checkbox.
- 3141dc5: Add the Early Mac era (1984 to 1991), between Terminal / CRT and Classic Windows (#12). It draws every component in two tones, the palette's own text and surface, with a 50% dither and title-bar pinstripes derived from those two. There is no accent: text-bearing states invert the two tones, fills with no text use the dither, and danger is shown by a heavier edge. Muted text keeps its semantic color. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `early-mac`.
- 3c7a914: Add Menu and its parts (MenuTrigger, MenuPortal, MenuPositioner, MenuPopup, MenuItem, MenuSeparator), thin wrappers over Base UI's Menu styled in every era (#25). MenuPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item is drawn as Select's is, on the accent fill with a ring in the body text color, and the contrast audit's `item-highlighted` check covers both. `get_component` now answers for Menu.
- f54be33: Muted text now meets WCAG AA for body text (4.5:1) on every surface in every palette; it was raised only to 3:1, so card bodies, dialog descriptions, inactive tabs and placeholders failed (#69). Eras gain an optional `textFills` list naming the derived fills text sits on, and the contrast audit, and with it `check_contrast`, now checks muted text on all three surfaces and body and muted text on each era's text fills. Flat / Metro's `surface-hover` and Frutiger Aero's `glass-fill` now stay between the base and raised surfaces, so text contrast holds on them. A new `composite` helper paints a translucent fill over a backdrop for measuring.
- 9f31c96: Add Select and its parts (SelectLabel, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectPositioner, SelectPopup, SelectList, SelectItem, SelectItemText, SelectItemIndicator), thin wrappers over Base UI's Select styled in every era (#23). SelectPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item uses the accent fill with the text color paired with it, and the contrast audit gains a named `item-highlighted` check, which `check_contrast` now reports. `get_component` now answers for Select.
- 3b614b6: Add Slider and its parts (SliderLabel, SliderValue, SliderControl, SliderTrack, SliderIndicator, SliderThumb), thin wrappers over Base UI's Slider styled in every era (#24). The thumb is drawn in the body text color and larger than the track, so its outline sits on the page surface; the track keeps a muted edge and the range is the accent. The contrast audit gains `slider-thumb-on-surface` and `slider-range-on-track`, which `check_contrast` now reports. `get_component` now answers for Slider.
- c09d3a4: Add Switch and SwitchThumb, thin wrappers over Base UI's Switch parts, styled in every era with on, off and disabled states (#21). The off edge and off thumb use the muted text color and the on thumb uses the text color paired with the accent, so the thumb clears 3:1 against its track. The contrast audit gains two named checks, `switch-thumb-on-track` and `switch-thumb-on-accent`, which `check_contrast` now reports. `get_component` now answers for Switch.
- a2557fe: Add Tooltip and its parts (TooltipProvider, TooltipTrigger, TooltipPortal, TooltipPositioner, TooltipPopup, TooltipArrow), thin wrappers over Base UI's Tooltip styled in every era (#26). TooltipPortal renders into the nearest NostalgiaRoot, as DialogPortal does. Classic Windows derives a warm `tooltip-fill` from the raised surface and the warning color, corrected so body text clears 4.5:1. Eras gain `bodyTextFills`, fills the contrast audit checks for body text only, and `check_contrast` now reports `text-on-tooltip-fill`. `get_component` now answers for Tooltip.
- dcdcced: Add the Web 1.0 era (late 1990s), between Classic Windows and Frutiger Aero (#13). Its bevels are CSS's own `outset` and `inset` border styles, shaded by the browser from one border color, which keeps it apart from Classic Windows. It derives a `link` color, the accent corrected to 4.5:1 on every surface, used for plain links inside NostalgiaRoot, outline and ghost buttons and tabs, and a `tile` tone for a tiled page background, which the audit checks as a text fill. The body font is Times New Roman. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `web-1`.
- Updated dependencies [f54be33]
- Updated dependencies [34edf2a]
- Updated dependencies [89c073f]
- Updated dependencies [01eec6a]
- Updated dependencies [3141dc5]
- Updated dependencies [fcca3e0]
- Updated dependencies [3c7a914]
- Updated dependencies [f54be33]
- Updated dependencies [f74912a]
- Updated dependencies [9f31c96]
- Updated dependencies [3b614b6]
- Updated dependencies [c09d3a4]
- Updated dependencies [dcdcced]
- Updated dependencies [a2557fe]
- Updated dependencies [dcdcced]
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
