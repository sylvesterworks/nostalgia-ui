import { eras, palettes } from '@nostalgiaui/tokens';
import type * as React from 'react';

import { setExampleTheme, useExampleTheme } from './example-theme.js';

/** The era and palette pickers for every example on a component page. */
export function ExampleControls(): React.ReactElement {
  const { era, palette } = useExampleTheme();
  return (
    <div className="demo-controls example-controls">
      <label>
        <span>Era</span>
        <select value={era} onChange={(event) => setExampleTheme({ era: event.target.value })}>
          {eras.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Palette</span>
        <select
          value={palette}
          onChange={(event) => setExampleTheme({ palette: event.target.value })}
        >
          {palettes.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
