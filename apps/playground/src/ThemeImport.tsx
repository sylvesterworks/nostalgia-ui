import { importVsCodeTheme } from '@nostalgiaui/importer';
import type { ImportReport, Provenance } from '@nostalgiaui/importer';
import { getEra, pairingVars, semanticVars } from '@nostalgiaui/tokens';
import type { Palette } from '@nostalgiaui/tokens';
import { useNostalgiaContainer } from '@nostalgiaui/react';
import { useCallback, useEffect, useState } from 'react';

export interface ImportedTheme {
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
export function applyImportedTheme(
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

const PROVENANCE_LABEL: Record<Provenance, string> = {
  exact: 'from the theme',
  inherited: 'related scope',
  derived: 'computed',
  fallback: 'defaulted',
};

export interface ThemeImportProps {
  readonly imported: ImportedTheme | null;
  readonly onImport: (imported: ImportedTheme | null) => void;
}

export function ThemeImport(props: ThemeImportProps): React.ReactElement {
  const { imported, onImport } = props;
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File): Promise<void> => {
      setError(null);
      try {
        const text = await file.text();
        const parsed: unknown = JSON.parse(text);
        const { primitives, report } = importVsCodeTheme(parsed);
        onImport({
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
        onImport(null);
      }
    },
    [onImport],
  );

  return (
    <aside className="pg-Import">
      <div className="pg-ImportHead">
        <strong>Import a VS Code theme</strong>
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
        {imported !== null && (
          <button type="button" onClick={() => onImport(null)}>
            Clear
          </button>
        )}
      </div>

      {error !== null && <p className="pg-ImportError">Could not read that file: {error}</p>}

      {imported !== null && (
        <>
          <p className="pg-ImportSummary">
            {imported.report.name ?? 'Unnamed theme'} reads as {imported.report.appearance}.{' '}
            {imported.report.guessedCount === 0
              ? 'Every value came straight from the theme.'
              : imported.report.guessedCount +
                ' of ' +
                imported.report.primitives.length +
                ' values were not exact.'}
          </p>

          <table className="pg-ImportTable">
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
                    <span className="pg-Swatch" style={{ background: entry.value }} />
                    {entry.value}
                  </td>
                  <td>{PROVENANCE_LABEL[entry.provenance]}</td>
                  <td>{entry.source}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {imported.report.warnings.map((warning) => (
            <p className="pg-ImportWarning" key={warning}>
              {warning}
            </p>
          ))}
        </>
      )}
    </aside>
  );
}

/**
 * Applies an imported palette to the enclosing NostalgiaRoot.
 *
 * Rendered as a child rather than taking a ref, because NostalgiaRoot already
 * publishes its own element through context for the portal fix. Reusing that
 * channel avoids giving the component a second way to hand out its element.
 */
export function ImportedThemeVars(props: {
  readonly imported: ImportedTheme | null;
  readonly eraId: string;
}): null {
  const container = useNostalgiaContainer();
  useEffect(() => {
    applyImportedTheme(container, props.imported, props.eraId);
  }, [container, props.imported, props.eraId]);
  return null;
}
