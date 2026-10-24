import { describe, expect, it } from 'vitest';

import { ERAS, PALETTES } from './index.js';

describe('the two axes', () => {
  it('ships the three milestone 1 eras', () => {
    expect(ERAS).toHaveLength(3);
  });

  it('ships at least one light palette so light mode is never an afterthought', () => {
    expect(PALETTES).toContain('solarized-light');
  });
});
