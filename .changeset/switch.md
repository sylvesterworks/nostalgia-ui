---
'@nostalgiaui/react': minor
'@nostalgiaui/tokens': minor
'@nostalgiaui/mcp': patch
---

Add Switch and SwitchThumb, thin wrappers over Base UI's Switch parts, styled in every era with on, off and disabled states (#21). The off edge and off thumb use the muted text color and the on thumb uses the text color paired with the accent, so the thumb clears 3:1 against its track. The contrast audit gains two named checks, `switch-thumb-on-track` and `switch-thumb-on-accent`, which `check_contrast` now reports. `get_component` now answers for Switch.
