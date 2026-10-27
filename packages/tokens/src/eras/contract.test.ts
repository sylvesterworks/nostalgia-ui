import { describe, expect, it } from 'vitest';

import { palettes } from '../palettes/index.js';
import { toSemantic } from '../semantic.js';
import { ERA_DERIVED_REQUIRED, defineEra } from '../types.js';
import type { EraExtraKey } from '../types.js';

import { classicWindows } from './classic-windows.js';
import { eras } from './index.js';

/**
 * The era-derived token contract (decision record 0009).
 *
 * An era returns two kinds of derived keys: the required set, which every era
 * provides and which a stylesheet may therefore use anywhere, and extras,
 * which exist only while that era is active and may only be read inside a
 * `[data-era]` rule. This suite pins the required set and checks that every
 * era honors it for every palette, so that a new era cannot ship without the
 * variables the shared stylesheets rely on.
 */
describe('era-derived token contract', () => {
  it('requires exactly the keys the shared stylesheets read outside [data-era] rules', () => {
    // button.css, card.css, dialog.css and base.css in @nostalgiaui/react use
    // these three, and only these three, without an era selector. Widening
    // this list is a decision, not a refactor: every era must then provide
    // the new key, and the decision record must say so.
    expect([...ERA_DERIVED_REQUIRED]).toEqual(['shadow-raised', 'shadow-overlay', 'focus-color']);
  });

  describe.each(eras.map((era) => [era.id, era] as const))('%s', (_id, era) => {
    it.each(palettes.map((palette) => [palette.id, palette] as const))(
      'returns every required key for %s',
      (_paletteId, palette) => {
        const derived = era.derive(toSemantic(palette));
        for (const key of ERA_DERIVED_REQUIRED) {
          expect(typeof derived[key], key + ' is missing').toBe('string');
          expect(derived[key].trim(), key + ' is empty').not.toBe('');
        }
      },
    );
  });

  it('types the extras of a concrete era so a stylesheet author can see them', () => {
    // Compile-time check: EraExtraKey reads the era-specific keys off the
    // inferred type, with the required set removed. If this stops compiling,
    // the tokens page (#53) can no longer mark availability from the types.
    const extra: EraExtraKey<typeof classicWindows> = 'bevel-light';
    // @ts-expect-error a required key is not an extra
    const notExtra: EraExtraKey<typeof classicWindows> = 'shadow-raised';
    // @ts-expect-error another era's key is not this era's extra
    const otherEra: EraExtraKey<typeof classicWindows> = 'gloss-top';
    expect([extra, notExtra, otherEra]).toHaveLength(3);
  });

  it('rejects an era that omits a required key at compile time', () => {
    const incomplete = () =>
      defineEra({
        id: 'incomplete',
        label: 'Incomplete',
        period: 'never',
        shape: classicWindows.shape,
        // @ts-expect-error focus-color is required and missing
        derive: () => ({ 'shadow-raised': 'none', 'shadow-overlay': 'none' }),
      });
    // The runtime helper is an identity function; the test is the annotation
    // above. Calling it keeps the function from being flagged as unused.
    expect(incomplete).toBeTypeOf('function');
  });
});
