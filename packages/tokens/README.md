# @nostalgiaui/tokens

Design tokens for NostalgiaUI: eras, palettes, and the OKLCH colour maths that
derives one from the other.

Every rendered component in NostalgiaUI is the product of two independent
choices. An **era** controls shape and feel. A **palette** controls colour,
drawn from a VS Code theme. This package defines both and builds them into CSS
custom properties scoped to `data-era` and `data-palette` attributes.

```css
@import '@nostalgiaui/tokens/tokens.css';
```

```html
<div data-era="frutiger-aero" data-palette="nord">
  <!-- every --nui-* variable resolves in here -->
</div>
```

Also exported: a Tailwind preset (`@nostalgiaui/tokens/tailwind-preset`), W3C
Design Tokens JSON (`@nostalgiaui/tokens/tokens.dtcg.json`), the era and
palette definitions as data, the colour helpers, and `auditContrast` for
checking a pairing against WCAG 2.1 AA.

Each palette records its source theme and licence in `palettes/<name>/SOURCE.md`.

Full documentation at [nostalgiaui.sylvester.works](https://nostalgiaui.sylvester.works).
MIT, copyright Josh Sylvester and Sylvester Works LLC.
