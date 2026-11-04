---
'@nostalgiaui/tokens': minor
'@nostalgiaui/react': minor
'@nostalgiaui/mcp': patch
---

Add the Web 1.0 era (late 1990s), between Classic Windows and Frutiger Aero (#13). Its bevels are CSS's own `outset` and `inset` border styles, shaded by the browser from one border color, which keeps it apart from Classic Windows. It derives a `link` color, the accent corrected to 4.5:1 on every surface, used for plain links inside NostalgiaRoot, outline and ghost buttons and tabs, and a `tile` tone for a tiled page background, which the audit checks as a text fill. The body font is Times New Roman. `list_eras`, `get_tokens`, `get_component` and `check_contrast` now answer for `web-1`.
