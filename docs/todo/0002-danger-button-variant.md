# 0002: Add a danger Button variant

Date: 2026-10-25

Status: open

Source: first end-to-end run of the published packages (0.1.1), building a settings page with a danger-zone card.

## Gap

Button offers solid, outline and ghost. There is no destructive variant, yet a "Delete account" button is the first thing a settings page needs, and the semantic token layer already has `--nui-color-danger`. The agent worked around it with a one-off class in the consuming app:

```css
.nui-Button--danger { border-color: var(--nui-color-danger); color: var(--nui-color-danger); }
```

That is exactly the kind of palette-coupled, era-ignorant styling the two-axis model is meant to make unnecessary. Every consumer will reinvent it, and none of them will get the era treatment right (Frutiger Aero gloss, Classic Windows bevel, Neubrutalism hard shadow).

## What to do

1. In `packages/react/src/components/Button.tsx`, widen `ButtonVariant` to include `'danger'`. Keep it a variant, not a separate `tone` prop, so the existing class naming (`nui-Button--danger`) and the `render` contract stay unchanged.
2. In `packages/react/src/styles/button.css`, add a base rule for `.nui-Button--danger` that reads only semantic tokens: `--nui-color-danger` for the fill and border, and a text colour that passes AA on it. The pairing layer in `packages/tokens` may need a derived `--nui-era-danger-vivid` (and gloss stops) for eras that tint the accent, so follow the same OKLCH derivation that produces `--nui-era-accent-vivid`. No hand-picked colours per palette.
3. Add the era overrides in the same file for each era that treats solid buttons specially, so a danger button gets the same gloss, bevel or shadow recipe as a solid one.
4. Extend `check_contrast` in `packages/mcp/src/tools.ts` (and the tokens contrast audit it wraps) with a `text-on-danger` pairing, since the danger fill is now a text background.
5. Add `danger` to the Button entry in `packages/react/src/manifest` output so `get_component` lists it, and cover it in `packages/react/src/styles.test.ts`.
6. Mention the variant in the docs site Button page.

## Done when

`<Button variant="danger">Delete account</Button>` renders a destructive button that looks era-correct in all six eras and passes the contrast audit in all five palettes, and `get_component` for Button names it.
