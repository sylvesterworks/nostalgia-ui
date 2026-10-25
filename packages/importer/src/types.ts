import type { PalettePrimitives } from '@nostalgiaui/tokens';

/** How confident the importer is about a primitive it produced. */
export type Provenance =
  /** A direct hit: the exact colour key, or a rule whose scope matched exactly. */
  | 'exact'
  /** A rule matched, but at a different specificity than asked for. */
  | 'inherited'
  /** Nothing matched, so the value was computed from another primitive. */
  | 'derived'
  /** Nothing matched and nothing could be computed, so a default was used. */
  | 'fallback';

export interface PrimitiveReport {
  readonly primitive: keyof PalettePrimitives;
  readonly value: string;
  readonly provenance: Provenance;
  /** The colour key, the scope selector, or a description of the derivation. */
  readonly source: string;
}

export interface ImportReport {
  readonly name: string | undefined;
  /** Computed from the background's lightness, which is authoritative. */
  readonly appearance: 'dark' | 'light';
  /** What the theme CLAIMED, when it declared a type. Kept separate because
   * themes are occasionally wrong about their own polarity. */
  readonly declaredType: string | undefined;
  readonly primitives: readonly PrimitiveReport[];
  /** Structural problems: an unresolvable include, tokenColors as a file path,
   * a missing colors block. Each one costs accuracy, so each is surfaced. */
  readonly warnings: readonly string[];
  /** How many primitives were anything other than an exact hit. */
  readonly guessedCount: number;
}

export interface ImportResult {
  readonly primitives: PalettePrimitives;
  readonly report: ImportReport;
}
