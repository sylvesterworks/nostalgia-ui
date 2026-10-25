import { contrastRatio } from './color.js';
import { toSemantic } from './semantic.js';
import type { Era, Palette, SemanticColors } from './types.js';

/**
 * Contrast auditing as a real API rather than assertions buried in a test.
 *
 * The contrast rules were originally written only inside contrast.test.ts. The
 * MCP server needs to answer check_contrast with the same rules, and two
 * implementations of the same rules drift. So the rules live here, the test
 * asserts against this function, and the tool calls it.
 */

/** WCAG 2.1 thresholds. */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;
export const AA_NON_TEXT = 3;

export type ContrastLevel =
  /** Body text: 4.5:1. */
  | 'AA'
  /** Large text and status colours: 3:1. */
  | 'AA-large'
  /** A boundary that only has to be perceivable, not read. */
  | 'ui';

export interface ContrastFinding {
  readonly id: string;
  /** What this pairing is, in words, for a report a person will read. */
  readonly label: string;
  readonly foreground: string;
  readonly background: string;
  readonly ratio: number;
  readonly required: number;
  readonly level: ContrastLevel;
  readonly passes: boolean;
}

export interface ContrastAudit {
  readonly era: string;
  readonly palette: string;
  readonly findings: readonly ContrastFinding[];
  readonly failures: readonly ContrastFinding[];
  readonly passes: boolean;
}

interface Check {
  readonly id: string;
  readonly label: string;
  readonly foreground: keyof SemanticColors;
  readonly background: keyof SemanticColors;
  readonly required: number;
  readonly level: ContrastLevel;
}

/**
 * Text is checked against every surface variant rather than only the base.
 * Solarized Light clears 4.5:1 on its base surface and only 3.58:1 on a raised
 * panel, so checking the base alone would pass a palette that fails in use.
 */
const CHECKS: readonly Check[] = [
  {
    id: 'text-on-surface',
    label: 'Body text on the base surface',
    foreground: 'text',
    background: 'surface',
    required: AA_TEXT,
    level: 'AA',
  },
  {
    id: 'text-on-surface-raised',
    label: 'Body text on a raised surface',
    foreground: 'text',
    background: 'surfaceRaised',
    required: AA_TEXT,
    level: 'AA',
  },
  {
    id: 'text-on-surface-sunken',
    label: 'Body text in a sunken well',
    foreground: 'text',
    background: 'surfaceSunken',
    required: AA_TEXT,
    level: 'AA',
  },
  {
    id: 'text-muted-on-surface',
    label: 'Muted text on the base surface',
    foreground: 'textMuted',
    background: 'surface',
    required: AA_LARGE,
    level: 'AA-large',
  },
  {
    id: 'text-on-accent',
    label: 'Text on an accent fill',
    foreground: 'textOnAccent',
    background: 'accent',
    required: AA_TEXT,
    level: 'AA',
  },
  {
    id: 'success-on-surface',
    label: 'Success colour against the surface',
    foreground: 'success',
    background: 'surface',
    required: AA_NON_TEXT,
    level: 'AA-large',
  },
  {
    id: 'warning-on-surface',
    label: 'Warning colour against the surface',
    foreground: 'warning',
    background: 'surface',
    required: AA_NON_TEXT,
    level: 'AA-large',
  },
  {
    id: 'danger-on-surface',
    label: 'Danger colour against the surface',
    foreground: 'danger',
    background: 'surface',
    required: AA_NON_TEXT,
    level: 'AA-large',
  },
  {
    id: 'border-on-surface',
    label: 'Border against the surface it sits on',
    foreground: 'border',
    background: 'surface',
    // A border only has to be perceivable as a boundary, not readable, so WCAG
    // text thresholds would be the wrong bar here.
    required: 1.3,
    level: 'ui',
  },
];

/**
 * Audit one era and palette pairing.
 *
 * The era is part of the signature even though every current check reads only
 * semantic colours, because an era can derive colours of its own and a future
 * check may need them. Taking the pairing keeps the API honest about what a
 * contrast result actually depends on: a derived colour does not exist until
 * both axes are chosen.
 */
export function auditContrast(era: Era, palette: Palette): ContrastAudit {
  const semantic = toSemantic(palette);

  const findings = CHECKS.map((check): ContrastFinding => {
    const foreground = semantic[check.foreground];
    const background = semantic[check.background];
    const ratio = contrastRatio(foreground, background);
    return {
      id: check.id,
      label: check.label,
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      required: check.required,
      level: check.level,
      passes: ratio >= check.required,
    };
  });

  const failures = findings.filter((finding) => !finding.passes);

  return {
    era: era.id,
    palette: palette.id,
    findings,
    failures,
    passes: failures.length === 0,
  };
}
