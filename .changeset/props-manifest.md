---
'@nostalgiaui/react': minor
---

`@nostalgiaui/react/manifest` now carries each component's documentation and props. Every entry gains `doc`, the component's structured doc, and `props`, a table per part with each prop's name, type, whether it is required, its default and its description, extracted from the TypeScript types. Props come from this package and from Base UI; inherited React and DOM attributes are left out. A new `foundations` export holds the rules every component shares. The public React API is unchanged, and the build-only `cli.js` is no longer published.
