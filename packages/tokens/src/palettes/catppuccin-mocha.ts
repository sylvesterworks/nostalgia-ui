import type { Palette } from '../types.js';

/**
 * Mapped from Catppuccin's published palette.json rather than imported from a
 * VS Code theme file, because the Catppuccin VS Code port generates its theme
 * JSON at build time and commits none. palette.json is the canonical source
 * the port itself is built from, so this is upstream of it, not a guess.
 */
export const catppuccinMocha: Palette = {
  id: 'catppuccin-mocha',
  label: 'Catppuccin Mocha',
  source: {
    theme: 'Catppuccin (Mocha)',
    url: 'https://github.com/catppuccin/palette',
    license: 'MIT',
  },
  primitives: {
    background: '#1e1e2e', // base
    foreground: '#cdd6f4', // text
    selection: '#45475a', // surface1
    keyword: '#cba6f7', // mauve
    string: '#a6e3a1', // green
    function: '#89b4fa', // blue
    comment: '#6c7086', // overlay0
    error: '#f38ba8', // red
  },
};
