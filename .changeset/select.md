---
'@nostalgiaui/react': minor
'@nostalgiaui/tokens': minor
'@nostalgiaui/mcp': patch
---

Add Select and its parts (SelectLabel, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectPositioner, SelectPopup, SelectList, SelectItem, SelectItemText, SelectItemIndicator), thin wrappers over Base UI's Select styled in every era (#23). SelectPortal renders into the nearest NostalgiaRoot, as DialogPortal does. The highlighted item uses the accent fill with the text color paired with it, and the contrast audit gains a named `item-highlighted` check, which `check_contrast` now reports. `get_component` now answers for Select.
