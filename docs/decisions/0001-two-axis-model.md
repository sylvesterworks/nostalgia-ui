# 0001: Era and palette are independent axes

Date: 2026-10-24

Status: accepted

## Context

NostalgiaUI renders the same interface in the style of different design eras, colored by palettes taken from VS Code themes. The obvious way to build this is one theme per combination: a Dracula flavored Classic Windows theme, a Nord flavored Frutiger Aero theme, and so on. That approach is simple to start and collapses quickly. With 12 eras and 9 palettes it means 108 hand maintained themes, and every new palette requires revisiting every era.

## Decision

Era and palette are separate, independent axes, and a rendered component is the product of the two.

- **Era** owns shape and feel: radius, border style, bevels, shadows, gradients, textures, typography, spacing density, and motion.
- **Palette** owns color, and only color.

Tokens are layered to support this:

1. **Palette primitives** are raw colors lifted from a VS Code theme, including syntax colors such as keyword, string, function, comment, and error.
2. **Semantic tokens** (`surface`, `surface-raised`, `text`, `text-muted`, `accent`, `success`, `warning`, `danger`, `border`) are mapped from those primitives. The default mapping treats keyword as accent, string as success, error as danger, and comment as muted text.
3. **Era tokens** describe shape recipes and read only from semantic tokens.

Era effects that need colors the semantic layer does not provide, such as the light and dark edges of a 90s bevel, the stops of a Web 2.0 gradient, or the paired shadows of neumorphism, are derived at build time with color math in OKLCH. They are never hand picked for a specific palette.

## Consequences

Adding a palette is a data change and touches no era. Adding an era is a shape change and touches no palette. The combinatorial explosion disappears: 12 eras and 9 palettes cost 21 units of work rather than 108.

The cost is that era authors give up precise control over color. An era cannot specify that a bevel highlight is exactly `#dfdfdf`, only that it is the surface color lightened by a given amount in OKLCH. Era authors have to express intent as a relationship rather than a value, which is a real constraint when chasing the look of a specific historical interface.

It also means contrast cannot be verified by inspection, because the actual colors depend on the pairing. Automated WCAG contrast tests across every era and palette combination are therefore part of the definition of done rather than an optional extra, and OKLCH is chosen over HSL specifically because its perceptual lightness makes derived colors behave predictably across very different palettes.

Any future change that couples the two axes should be treated as a design error and rejected.
