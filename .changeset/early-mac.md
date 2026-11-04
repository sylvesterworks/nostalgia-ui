---
'@nostalgiaui/tokens': minor
'@nostalgiaui/react': minor
'@nostalgiaui/mcp': patch
---

Add the Early Mac era (1984 to 1991), between Terminal / CRT and Classic Windows (#12). It draws every component in two tones, the palette's own text and surface, with a 50% dither and title-bar pinstripes derived from those two. There is no accent: text-bearing states invert the two tones, fills with no text use the dither, and danger is shown by a heavier edge. Muted text keeps its semantic color. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `early-mac`.
