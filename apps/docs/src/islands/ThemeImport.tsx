import { importVsCodeTheme } from '@nostalgiaui/importer';
import type { ImportReport, Provenance } from '@nostalgiaui/importer';
import { NostalgiaRoot, useNostalgiaContainer } from '@nostalgiaui/react';
import { eras, getEra, pairingVars, palettes, semanticVars } from '@nostalgiaui/tokens';
import type { Palette } from '@nostalgiaui/tokens';
import { useCallback, useEffect, useState } from 'react';
import type * as React from 'react';

import { SettingsPage } from './SettingsPage.js';

/**
 * Drop a VS Code theme file and preview it in any era.
 *
 * Moved here from the milestone 1 playground when Storybook replaced it
 * (#36). Everything runs in the browser: the theme is parsed by
 * @nostalgiaui/importer and never leaves the page.
 */

interface ImportedTheme {
  readonly palette: Palette;
  readonly report: ImportReport;
}

/**
 * Turn an imported palette into the same variables the build would have
 * emitted, so a dropped theme behaves exactly like a shipped one.
 *
 * The build writes CSS files for the palettes in the package. A theme dropped
 * in the browser never goes through that path, so the variables are computed
 * at runtime and set inline. Inline styles outrank the stylesheet, so the
 * imported palette wins over whatever data-palette is set to.
 */
function applyImportedTheme(
  element: HTMLElement | null,
  imported: ImportedTheme | null,
  eraId: string,
): void {
  if (element === null) {
    return;
  }

  // Clear any previous import before applying, or a theme that lacks a
  // variable would inherit it from the theme dropped before it.
  for (const name of Array.from(element.style)) {
    if (name.startsWith('--nui-')) {
      element.style.removeProperty(name);
    }
  }

  if (imported === null) {
    return;
  }

  const vars = {
    ...semanticVars(imported.palette),
    ...pairingVars(getEra(eraId), imported.palette),
  };
  for (const [name, value] of Object.entries(vars)) {
    element.style.setProperty(name, value);
  }
}

/**
 * Applies an imported palette to the enclosing NostalgiaRoot. Rendered as a
 * child because NostalgiaRoot already publishes its element through context
 * for the Dialog portal, and reusing that channel avoids a second one.
 */
function ImportedThemeVars(props: {
  readonly imported: ImportedTheme | null;
  readonly eraId: string;
}): null {
  const container = useNostalgiaContainer();
  useEffect(() => {
    applyImportedTheme(container, props.imported, props.eraId);
  }, [container, props.imported, props.eraId]);
  return null;
}

const PROVENANCE_LABEL: Record<Provenance, string> = {
  exact: 'from the theme',
  inherited: 'related scope',
  derived: 'computed',
  fallback: 'defaulted',
};

export function ThemeImport(): React.ReactElement {
  const [imported, setImported] = useState<ImportedTheme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [era, setEra] = useState<string>(eras[0]?.id ?? '');

  const handleFile = useCallback(async (file: File): Promise<void> => {
    setError(null);
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const { primitives, report } = importVsCodeTheme(parsed);
      setImported({
        palette: {
          id: 'imported',
          label: report.name ?? file.name,
          source: { theme: report.name ?? file.name, url: '', license: '' },
          primitives,
        },
        report,
      });
    } catch (caught) {
      setError((caught as Error).message);
      setImported(null);
    }
  }, []);

  return (
    <div className="demo-frame">
      <div className="demo-controls">
        <label>
          <span>VS Code theme file</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file !== undefined) {
                void handleFile(file);
              }
            }}
          />
        </label>
        <label>
          <span>Era</span>
          <select value={era} onChange={(event) => setEra(event.target.value)}>
            {eras.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {imported !== null && (
          <button type="button" className="import-clear" onClick={() => setImported(null)}>
            Clear
          </button>
        )}
      </div>

      <div className="import-report">
        {error !== null && <p className="import-error">Could not read that file: {error}</p>}

        {imported === null && error === null && (
          <p className="meta">
            Choose a theme&apos;s JSON file, for example from an extension&apos;s{' '}
            <code>themes</code> folder. It is read in your browser and not uploaded anywhere.
          </p>
        )}

        {imported !== null && (
          <>
            <p>
              {imported.report.name ?? 'Unnamed theme'} reads as {imported.report.appearance}.{' '}
              {imported.report.guessedCount === 0
                ? 'Every value came straight from the theme.'
                : String(imported.report.guessedCount) +
                  ' of ' +
                  String(imported.report.primitives.length) +
                  ' values were not exact.'}
            </p>

            <table className="import-table">
              <thead>
                <tr>
                  <th>Primitive</th>
                  <th>Value</th>
                  <th>Provenance</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {imported.report.primitives.map((entry) => (
                  <tr key={entry.primitive} data-provenance={entry.provenance}>
                    <td>{entry.primitive}</td>
                    <td>
                      <span className="import-swatch" style={{ background: entry.value }} />
                      {entry.value}
                    </td>
                    <td>{PROVENANCE_LABEL[entry.provenance]}</td>
                    <td>{entry.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {imported.report.warnings.map((warning) => (
              <p className="import-warning" key={warning}>
                {warning}
              </p>
            ))}
          </>
        )}
      </div>

      {imported !== null && (
        <NostalgiaRoot era={era} palette={palettes[0]?.id ?? ''} className="demo-stage">
          <ImportedThemeVars imported={imported} eraId={era} />
          <SettingsPage />
        </NostalgiaRoot>
      )}
    </div>
  );
}
