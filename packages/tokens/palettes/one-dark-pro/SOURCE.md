# One Dark Pro

NostalgiaUI's `one-dark-pro` palette is inspired by One Dark Pro.

- Source: https://github.com/Binaryify/OneDark-Pro
- Licence: MIT
- Licence file: https://github.com/Binaryify/OneDark-Pro/blob/master/LICENSE.txt

Produced by running `nostalgiaui-import` on the theme's own
`themes/OneDark-Pro.json`. Every value was an exact hit, which made it the
first real-world test of the importer.

It also found an importer gap. The theme styles `invalid.illegal` as white
text, because in the editor it sits on a red fill; read as a palette colour,
white would have become the danger role. The workbench carries the real red
under `editorError.foreground`, which the importer now prefers.

## Primitives taken

| NostalgiaUI primitive | Value     | Source                     |
| --------------------- | --------- | -------------------------- |
| background            | `#282c34` | editor.background          |
| foreground            | `#abb2bf` | editor.foreground          |
| selection             | `#677696` | editor.selectionBackground |
| keyword               | `#c678dd` | scope keyword.control      |
| string                | `#98c379` | scope string               |
| function              | `#61afef` | scope entity.name.function |
| comment               | `#7f848e` | scope comment              |
| error                 | `#c24038` | editorError.foreground     |
