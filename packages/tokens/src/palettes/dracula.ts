import type { Palette } from '../types.js';

export const dracula: Palette = {
  id: 'dracula',
  label: 'Dracula',
  source: {
    theme: 'Dracula',
    url: 'https://github.com/dracula/dracula-theme',
    license: 'MIT',
  },
  primitives: {
    background: '#282a36',
    foreground: '#f8f8f2',
    selection: '#44475a',
    keyword: '#ff79c6',
    string: '#50fa7b',
    function: '#f1fa8c',
    comment: '#6272a4',
    error: '#ff5555',
  },
};
