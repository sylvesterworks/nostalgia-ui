---
'@nostalgiaui/react': minor
'@nostalgiaui/tokens': minor
'@nostalgiaui/mcp': patch
---

Add Tooltip and its parts (TooltipProvider, TooltipTrigger, TooltipPortal, TooltipPositioner, TooltipPopup, TooltipArrow), thin wrappers over Base UI's Tooltip styled in every era (#26). TooltipPortal renders into the nearest NostalgiaRoot, as DialogPortal does. Classic Windows derives a warm `tooltip-fill` from the raised surface and the warning color, corrected so body text clears 4.5:1. Eras gain `bodyTextFills`, fills the contrast audit checks for body text only, and `check_contrast` now reports `text-on-tooltip-fill`. `get_component` now answers for Tooltip.
