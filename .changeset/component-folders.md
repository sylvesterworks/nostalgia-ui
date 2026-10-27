---
'@nostalgiaui/react': patch
---

Organize the source into one folder per component, holding its source, stylesheet, stories, documentation and an `index.ts`. Public exports and the rules in `styles.css` are unchanged. The `stylesheet` field in `@nostalgiaui/react/manifest` now names the component's own file (for example `Button.css`, `NostalgiaRoot.css`) instead of the old lowercase names, and the NostalgiaRoot entry's CSS includes the shared foundation rules that used to live in `base.css`.
