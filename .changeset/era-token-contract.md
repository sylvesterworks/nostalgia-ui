---
'@nostalgiaui/tokens': minor
---

Type the era-derived token contract. `ERA_DERIVED_REQUIRED` names the three keys every era must return (`shadow-raised`, `shadow-overlay`, `focus-color`), `Era` and `EraDerivation` are generic in their derived keys with a default matching the old shape, `defineEra` infers an era's extra keys from its object literal, and `EraExtraKey` reads them back. A test checks every era against every palette for the required set. Emitted CSS variable names are unchanged. Decision record 0009 states the rule: era-specific keys only inside `[data-era]` rules.
