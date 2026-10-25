import type { Palette } from '../types.js';

/**
 * Produced by running nostalgiaui-import on the theme's own OneDark-Pro.json.
 * Every value was an exact hit. The error colour is the workbench's
 * editorError.foreground rather than the invalid.illegal token rule, which
 * the theme styles as white text meant for a red fill.
 */
export const oneDarkPro: Palette = {
  id: 'one-dark-pro',
  label: 'One Dark Pro',
  source: {
    theme: 'One Dark Pro',
    url: 'https://github.com/Binaryify/OneDark-Pro',
    license: 'MIT',
  },
  primitives: {
    background: '#282c34',
    foreground: '#abb2bf',
    selection: '#677696',
    keyword: '#c678dd',
    string: '#98c379',
    function: '#61afef',
    comment: '#7f848e',
    error: '#c24038',
  },
};
