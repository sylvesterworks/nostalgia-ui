import { NostalgiaRoot } from '@nostalgiaui/react';
import { eras, palettes } from '@nostalgiaui/tokens';
import { useEffect, useState } from 'react';
import type * as React from 'react';

import { SettingsPage } from './SettingsPage.js';

/**
 * Scrub through design history.
 *
 * The slider's only output is an index into the era list, and the only thing
 * that changes on screen is the era attribute on NostalgiaRoot. The settings
 * page underneath is not re-rendered differently; the browser re-resolves a
 * different set of custom properties. If the morph looks like a page being
 * rebuilt, something has gone wrong with the design.
 */
export function Timeline(): React.ReactElement {
  const [index, setIndex] = useState(0);
  const [palette, setPalette] = useState<string>(palettes[0]?.id ?? '');
  const [playing, setPlaying] = useState(false);

  const era = eras[index] ?? eras[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % eras.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [playing]);

  if (era === undefined) {
    return <p>No eras are defined.</p>;
  }

  return (
    <div className="demo-frame">
      <div className="demo-controls">
        <label>
          <span>Era</span>
          <input
            type="range"
            min={0}
            max={eras.length - 1}
            step={1}
            value={index}
            onChange={(event) => {
              setPlaying(false);
              setIndex(Number(event.target.value));
            }}
            aria-valuetext={era.label + ', ' + era.period}
          />
        </label>
        <button type="button" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <label>
          <span>Palette</span>
          <select value={palette} onChange={(event) => setPalette(event.target.value)}>
            {palettes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <code className="demo-readout">
          {era.label} ({era.period})
        </code>
      </div>
      <div className="demo-controls" style={{ paddingTop: 0 }}>
        <div className="era-ticks" aria-hidden="true">
          {eras.map((tick) => (
            <span key={tick.id}>{tick.period}</span>
          ))}
        </div>
      </div>

      <NostalgiaRoot era={era.id} palette={palette} className="demo-stage">
        <SettingsPage />
      </NostalgiaRoot>
    </div>
  );
}
