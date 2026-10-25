import { NostalgiaRoot } from '@nostalgiaui/react';
import { eras, palettes } from '@nostalgiaui/tokens';
import { useState } from 'react';
import type * as React from 'react';

import { SettingsPage } from './SettingsPage.js';

/**
 * Hold one axis fixed and walk the other.
 *
 * `by="era"` renders the settings page once per era with a shared palette
 * picker; `by="palette"` renders it once per palette with a shared era
 * picker. Same page, same markup, every time.
 */
export function Gallery(props: { readonly by: 'era' | 'palette' }): React.ReactElement {
  const [fixedEra, setFixedEra] = useState<string>(eras[0]?.id ?? '');
  const [fixedPalette, setFixedPalette] = useState<string>(palettes[0]?.id ?? '');

  if (props.by === 'era') {
    return (
      <>
        <div
          className="demo-controls"
          style={{ borderRadius: 8, border: '1px solid var(--site-border)' }}
        >
          <label>
            <span>Palette for every era</span>
            <select value={fixedPalette} onChange={(event) => setFixedPalette(event.target.value)}>
              {palettes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {eras.map((era) => (
          <section key={era.id}>
            <h2 id={era.id}>
              {era.label} <span className="meta">({era.period})</span>
            </h2>
            <div className="demo-frame">
              <NostalgiaRoot era={era.id} palette={fixedPalette} className="demo-stage">
                <SettingsPage />
              </NostalgiaRoot>
            </div>
          </section>
        ))}
      </>
    );
  }

  return (
    <>
      <div
        className="demo-controls"
        style={{ borderRadius: 8, border: '1px solid var(--site-border)' }}
      >
        <label>
          <span>Era for every palette</span>
          <select value={fixedEra} onChange={(event) => setFixedEra(event.target.value)}>
            {eras.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {palettes.map((palette) => (
        <section key={palette.id}>
          <h2 id={palette.id}>
            {palette.label}{' '}
            <span className="meta">
              inspired by{' '}
              <a href={palette.source.url} rel="noreferrer">
                {palette.source.theme}
              </a>
              , {palette.source.license}
            </span>
          </h2>
          <div className="demo-frame">
            <NostalgiaRoot era={fixedEra} palette={palette.id} className="demo-stage">
              <SettingsPage />
            </NostalgiaRoot>
          </div>
        </section>
      ))}
    </>
  );
}
