---
'@nostalgiaui/react': patch
---

Fix the selected tab's styling in every era. The stylesheet matched `[data-selected]`, but Base UI 1.9 marks the selected tab with `data-active`, so no era's selected-tab rule applied, and the eras that hide the indicator showed no selection at all. A test now checks the attribute.
