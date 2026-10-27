# 0009: Era-derived tokens are a required set plus era-specific extras

Date: 2026-10-26

Status: accepted

## Context

Every era has a `derive` function that turns the semantic colors into the
extra colors that era needs: bevel edges in Classic Windows, gloss bands in
Frutiger Aero, phosphor glow in Terminal / CRT. The build evaluates it per
era and palette pairing and emits the result as `--nui-era-<key>` variables
inside a `[data-palette][data-era]` rule.

Until now the function returned `Record<string, string>`. Nothing said which
keys a stylesheet could count on. Across the six eras only three keys were
returned by all of them: `shadow-raised`, `shadow-overlay` and `focus-color`.
Every other key belonged to one era.

The library's own stylesheets happened to get this right. They read those
three keys in plain component rules and read every other `--nui-era-*` key
only inside a `[data-era='<id>']` rule. But that was a habit, not a rule. A
custom component written against `--nui-era-bevel-light` would render its
bevel in Classic Windows and silently lose it in the other five eras, with no
error at build time, in a test, or in the browser.

## Decision

The derivation result is split into two typed parts.

**The required set.** `ERA_DERIVED_REQUIRED` in `packages/tokens/src/types.ts`
lists the keys every era must return. It is `shadow-raised`, `shadow-overlay`
and `focus-color`. These are the only `--nui-era-*` variables that may be read
outside a `[data-era]` rule, because they are the only ones guaranteed to
exist whatever era is active. The list is a runtime value as well as a type,
so documentation and tests read it instead of restating it.

**Era-specific extras.** Everything else an era returns is an extra. Each era
is built with `defineEra`, which infers the extra keys from the era's own
object literal, so the keys are known at compile time and `EraExtraKey<typeof
classicWindows>` names exactly them. An extra may only be read inside a
`[data-era='<id>']` rule for the era that defines it. That is how the library's
stylesheets already work, and it is now the rule for anyone building on the
tokens.

Nothing else was promoted. The issue that raised this left open whether any
other current key was universal enough to join the required set. None is: the
next most shared keys each exist in a single era.

Emitted variable names are unchanged. This is a change to types, tests and
documentation.

### What enforces it

- A missing required key is a compile error in the era file, because
  `defineEra` constrains the derivation's return type.
- `packages/tokens/src/eras/contract.test.ts` checks every era against every
  palette for every required key, and pins the required list to the three
  names the shared stylesheets rely on. Widening the list means changing that
  test and this record on purpose.
- The same test holds a compile-time case that `EraExtraKey` rejects a
  required key and another era's key.

### The rule for custom components

A stylesheet built on NostalgiaUI may use, anywhere:

- semantic color tokens (`--nui-color-*`)
- shape tokens (`--nui-radius-*`, `--nui-border-*`, `--nui-font-*`,
  `--nui-motion-*`, `--nui-focus-*`, `--nui-spacing-unit`,
  `--nui-density-scale`)
- the three required era-derived tokens (`--nui-era-shadow-raised`,
  `--nui-era-shadow-overlay`, `--nui-era-focus-color`)

It may use any other `--nui-era-*` token only inside a rule scoped to the era
that defines it, exactly as `packages/react/src/styles` does:

```css
.my-Panel {
  box-shadow: var(--nui-era-shadow-raised);
}

[data-era='classic-windows'] .my-Panel {
  border-color: var(--nui-era-bevel-lighter) var(--nui-era-bevel-darker) var(--nui-era-bevel-darker)
    var(--nui-era-bevel-lighter);
}
```

## Consequences

The tokens reference page can mark each era-derived token as required or as
belonging to a named era by reading the types, rather than by counting which
eras happen to return it.

Adding an era now has a checklist the compiler enforces: provide the three
required keys or the file does not build. Adding a key to the required set is
a deliberate change to every era and to this record.

`Era` is now generic in its derived keys, with a default that matches the old
shape, so code that handles eras without knowing which one (the build, the
MCP server, the docs site) compiles unchanged.
