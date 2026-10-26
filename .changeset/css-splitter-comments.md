---
'@nostalgiaui/mcp': patch
---

`get_component` now keeps comments that sit inside a CSS rule, drops only the section-divider comments outside rules, and leaves no blank lines behind. The tool description says the CSS is a filtered view of the stylesheet.
