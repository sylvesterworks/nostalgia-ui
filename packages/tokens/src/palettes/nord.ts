import type { Palette } from '../types.js';

export const nord: Palette = {
  id: 'nord',
  label: 'Nord',
  source: {
    theme: 'Nord',
    url: 'https://github.com/nordtheme/nord',
    license: 'MIT',
  },
  primitives: {
    background: '#2e3440',
    foreground: '#d8dee9',
    selection: '#434c5e',
    keyword: '#81a1c1',
    string: '#a3be8c',
    function: '#ebcb8b',
    comment: '#616e88',
    error: '#bf616a',
  },
};
