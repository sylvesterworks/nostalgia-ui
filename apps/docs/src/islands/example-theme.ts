import { eras, palettes } from '@nostalgiaui/tokens';
import { useSyncExternalStore } from 'react';

/*
 * The era and palette every example on a component page renders in.
 *
 * Each example is its own island, so the choice lives in a module rather than
 * in React state: the islands on a page share this module, and the one set
 * of pickers drives all of them.
 */

export interface ExampleTheme {
  readonly era: string;
  readonly palette: string;
}

const initial: ExampleTheme = { era: eras[0]?.id ?? '', palette: palettes[0]?.id ?? '' };
let current = initial;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setExampleTheme(next: Partial<ExampleTheme>): void {
  current = { ...current, ...next };
  for (const listener of listeners) listener();
}

export function useExampleTheme(): ExampleTheme {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => initial,
  );
}
