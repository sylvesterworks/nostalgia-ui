---
'@nostalgiaui/tokens': minor
'@nostalgiaui/mcp': patch
---

Muted text now meets WCAG AA for body text (4.5:1) on every surface in every palette; it was raised only to 3:1, so card bodies, dialog descriptions, inactive tabs and placeholders failed (#69). Eras gain an optional `textFills` list naming the derived fills text sits on, and the contrast audit, and with it `check_contrast`, now checks muted text on all three surfaces and body and muted text on each era's text fills. Flat / Metro's `surface-hover` and Frutiger Aero's `glass-fill` now stay between the base and raised surfaces, so text contrast holds on them. A new `composite` helper paints a translucent fill over a backdrop for measuring.
