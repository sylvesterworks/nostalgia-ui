---
'@nostalgiaui/react': minor
'@nostalgiaui/mcp': patch
---

Add Menu and its parts (MenuTrigger, MenuPortal, MenuPositioner, MenuPopup, MenuItem, MenuSeparator), thin wrappers over Base UI's Menu styled in every era (#25). MenuPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item is drawn as Select's is, on the accent fill with a ring in the body text color, and the contrast audit's `item-highlighted` check covers both. `get_component` now answers for Menu.
