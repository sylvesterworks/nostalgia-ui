# 0013: Muted text meets the body text bar, and era fills stay where text contrast holds

Date: 2026-11-02

Status: accepted

## Context

Card body text failed WCAG AA in Classic Windows with Solarized Light at
3.11:1 (#69). Measuring every palette showed the cause was not one pairing:

- The semantic layer raised muted text only to 3:1 against its surfaces, the
  large-text bar, and the audit held it to that bar on the base surface only.
  Every palette's muted text fell below 4.5:1 on every surface, while card
  bodies, dialog descriptions, inactive tabs and placeholders all use it at
  body size.
- Eras paint fills of their own behind text: the Classic Windows face, the
  Flat / Metro tile and the Frutiger Aero glass. The audit never saw them.
  Flat / Metro's fill went past the raised surface and took Solarized Light's
  body text to 4.45:1; the Aero glass took muted text to about 3.6:1; and the
  Aero gloss band over a card's title took body text to about 2.4:1 at its
  strongest.

Fitting the semantic layer to particular eras' fills would couple the two
axes, which decision 0001 rules out.

## Decision

- **Muted text is body text.** The semantic layer corrects muted text to
  4.5:1 on all three surfaces, and the audit checks it there.
- **Text contrast holds between the surfaces.** The semantic layer guarantees
  text and muted text only on `surface`, `surfaceRaised` and `surfaceSunken`.
  An era fill that text sits on must paint, over the base surface, within that
  range. Eras list those fills in `textFills`; the audit composites each over
  the base surface and checks body and muted text on it at 4.5:1.
- **Recipes come back inside the range.** Flat / Metro's `surface-hover` is
  now a mix of the base and raised surfaces, and Frutiger Aero's `glass-fill`
  is the raised surface at the same alpha. The blur and gloss carry the glass
  look.
- **Gloss stays off text.** The Aero card's gloss band covers the top padding
  only, above the title.
- **Overlays paint over the surface.** The Aero dialog sits on a dimmed
  backdrop, not on the base surface, so its glass is layered over an opaque
  surface. It then paints the color the audit measures.
- **Stylesheets cannot escape the audit.** A react test fails when a
  stylesheet paints a neutral era fill as a background that its era does not
  list in `textFills`. Accent and danger fills, which carry their own text
  color, are listed separately.

## Consequences

- Muted text moves closer to body text. In Dracula, Nord, Catppuccin Mocha
  and One Dark Pro it is still the quieter of the two. In Solarized Light,
  whose body text only just clears 4.5:1, the two now have the same contrast
  on the surface (5.31:1 and 5.29:1) and differ only in hue.
- Flat / Metro's plain card fill is now quieter than its elevated fill, rather
  than brighter.
- Aero's glass is more subtle, and its card gloss is a thin band.
- A new era that paints its own fill behind text lists it in `textFills` or
  the react test fails; once listed, the audit holds it to 4.5:1.
- A fill that only body text sits on, such as Classic Windows' tooltip
  (#26), is listed in `bodyTextFills` instead. The audit then holds body
  text to 4.5:1 on it and does not check muted text, so it may be tinted
  away from the surfaces; the react test fails if the rule that paints it
  also sets muted text.
- Aero's Button and selected Tab still lay their gloss over text (#73), and
  Terminal / CRT uses the accent color as text in places (#72). Neither is
  covered here.
