# @nostalgiaui/react

Button, Input, Card, Tabs and Dialog on [Base UI](https://base-ui.com), styled
only through NostalgiaUI tokens. Keyboard behaviour, focus management and
dismissal come from Base UI; this package adds class names and nothing else.

```tsx
import { Button, NostalgiaRoot } from '@nostalgiaui/react';
import '@nostalgiaui/tokens/tokens.css';
import '@nostalgiaui/react/styles.css';

<NostalgiaRoot era="classic-windows" palette="dracula">
  <Button variant="solid">OK</Button>
</NostalgiaRoot>;
```

Changing `era` or `palette` changes one attribute. Nothing re-renders
differently; the browser resolves a different set of custom properties.

Every component must sit inside `NostalgiaRoot`, or inside an element carrying
`data-era` and `data-palette`. `DialogPortal` renders into the nearest
`NostalgiaRoot` rather than `document.body`, so dialogs keep their era.

Requires React 19.

Full documentation at [nostalgiaui.sylvester.works](https://nostalgiaui.sylvester.works).
MIT, copyright Josh Sylvester and Sylvester Works LLC.
