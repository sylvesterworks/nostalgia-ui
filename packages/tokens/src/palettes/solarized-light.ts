import type { Palette } from '../types.js';

export const solarizedLight: Palette = {
  id: 'solarized-light',
  label: 'Solarized Light',
  source: {
    theme: 'Solarized Light',
    url: 'https://github.com/altercation/solarized',
    license: 'MIT',
  },
  primitives: {
    background: '#fdf6e3',
    foreground: '#657b83',
    selection: '#eee8d5',
    keyword: '#859900',
    string: '#2aa198',
    function: '#b58900',
    comment: '#93a1a1',
    error: '#dc322f',
  },
};
