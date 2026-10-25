import { converter, formatHex, parse } from 'culori';

const toOklch = converter('oklch');
const toRgb = converter('rgb');

export interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

function requireColor(value: string): Oklch {
  const parsed = parse(value);
  if (parsed === undefined) {
    throw new Error(`Not a parseable CSS colour: ${value}`);
  }
  const oklch = toOklch(parsed);
  return { l: oklch.l ?? 0, c: oklch.c ?? 0, h: oklch.h ?? 0 };
}

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function requireRgb(value: string): Rgb {
  const parsed = parse(value);
  if (parsed === undefined) {
    throw new Error(`Not a parseable CSS colour: ${value}`);
  }
  const rgb = toRgb(parsed);
  if (rgb === undefined) {
    throw new Error(`Could not convert to sRGB: ${value}`);
  }
  return { r: rgb.r, g: rgb.g, b: rgb.b };
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

function fromOklch(value: Oklch): string {
  const hex = formatHex({
    mode: 'oklch',
    l: clamp01(value.l),
    c: Math.max(0, value.c),
    h: value.h,
  });
  if (hex === undefined) {
    throw new Error('Could not format colour back to hex');
  }
  return hex;
}

/** Perceptual lightness, 0 (black) to 1 (white). */
export function lightness(color: string): number {
  return requireColor(color).l;
}

/**
 * Whether a colour reads as light. Used to decide which DIRECTION a derivation
 * should move: on a dark palette a raised surface is lighter than its base, on
 * a light palette it is darker. Without this, every era would need separate
 * light and dark variants.
 */
export function isLight(color: string): boolean {
  return lightness(color) > 0.5;
}

/** Move perceptual lightness by a signed amount, clamped to the 0..1 range. */
export function shiftLightness(color: string, amount: number): string {
  const { l, c, h } = requireColor(color);
  return fromOklch({ l: clamp01(l + amount), c, h });
}

/**
 * Move lightness AWAY from the colour itself, by `amount` as a FRACTION of the
 * headroom that remains in that direction.
 *
 * Two things matter here. The direction is taken from the colour's own
 * lightness, so one era recipe serves both light and dark palettes. And the
 * step is proportional rather than absolute, which is what stops a dark
 * palette from crushing: Dracula's surface sits at L 0.29, so an absolute
 * sink of 0.22 and 0.38 both clamp to black and a 90s bevel loses the
 * distinction between its two dark edges. Proportional steps always land
 * inside the range and stay distinguishable from each other.
 */
/**
 * The smallest headroom a proportional step is allowed to assume.
 *
 * Solarized Light's surface sits at L 0.974, leaving 0.026 of room above it.
 * A purely proportional step there rounds to no visible change at all. This
 * floor means an extreme palette still moves, while remaining small enough
 * that successive steps stay distinguishable rather than crushing.
 */
const MIN_HEADROOM = 0.3;

export function raise(color: string, amount: number): string {
  const l = lightness(color);
  const headroom = Math.max(isLight(color) ? l : 1 - l, MIN_HEADROOM);
  const step = amount * headroom;
  return shiftLightness(color, isLight(color) ? -step : step);
}

/** The mirror of raise: move lightness toward the colour's own end, also
 * proportionally to the headroom in that direction. */
export function sink(color: string, amount: number): string {
  const l = lightness(color);
  const headroom = Math.max(isLight(color) ? 1 - l : l, MIN_HEADROOM);
  const step = amount * headroom;
  return shiftLightness(color, isLight(color) ? step : -step);
}

/** Scale chroma, for muting or saturating a colour without moving its hue. */
export function scaleChroma(color: string, factor: number): string {
  const { l, c, h } = requireColor(color);
  return fromOklch({ l, c: Math.max(0, c * factor), h });
}

/** Mix two colours in OKLCH. `t` of 0 returns `a`, 1 returns `b`. */
export function mix(a: string, b: string, t: number): string {
  const ca = requireColor(a);
  const cb = requireColor(b);
  const amount = clamp01(t);
  // Interpolate hue the short way round the wheel so mixes never swing
  // through unrelated hues.
  let deltaH = cb.h - ca.h;
  if (deltaH > 180) deltaH -= 360;
  if (deltaH < -180) deltaH += 360;
  return fromOklch({
    l: ca.l + (cb.l - ca.l) * amount,
    c: ca.c + (cb.c - ca.c) * amount,
    h: ca.h + deltaH * amount,
  });
}

/** An rgba() string from a colour plus an alpha, for translucent era effects. */
export function withAlpha(color: string, alpha: number): string {
  const rgb = requireRgb(color);
  const to255 = (n: number): number => Math.round(clamp01(n) * 255);
  return `rgba(${to255(rgb.r)}, ${to255(rgb.g)}, ${to255(rgb.b)}, ${clamp01(alpha)})`;
}

/**
 * WCAG 2.1 relative luminance. Implemented here rather than taken from a
 * library because the contrast harness is the one test that can genuinely
 * fail, so its maths should be readable and pinned in this repo.
 */
export function relativeLuminance(color: string): number {
  const rgb = requireRgb(color);
  const channel = (value: number): number => {
    const v = clamp01(value);
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick whichever of two candidates contrasts better against `background`.
 * Used for text that sits on an accent fill, where neither black nor white is
 * right for every palette.
 */
export function bestContrast(background: string, candidates: readonly string[]): string {
  let winner = candidates[0];
  if (winner === undefined) {
    throw new Error('bestContrast needs at least one candidate');
  }
  let best = contrastRatio(background, winner);
  for (const candidate of candidates.slice(1)) {
    const ratio = contrastRatio(background, candidate);
    if (ratio > best) {
      best = ratio;
      winner = candidate;
    }
  }
  return winner;
}

/**
 * Find a legible text colour to sit on `fill`.
 *
 * Picking between a palette's own background and foreground is not enough:
 * Solarized Light's olive accent reaches only 2.97:1 against either of its
 * endpoints, which fails WCAG AA for text. So instead of choosing between two
 * fixed colours, this walks a ramp of lightnesses carrying `tint`'s hue at low
 * chroma, and returns the most contrasting step.
 *
 * The result is effectively a palette-tinted near-black or near-white, which
 * clears AA while staying in the palette's tonal family rather than dropping
 * to pure #000 or #fff.
 */
export function readableOn(fill: string, tint: string): string {
  const { h } = requireColor(tint);
  const candidates: string[] = [];
  for (let step = 0; step <= 20; step += 1) {
    const l = step / 20;
    candidates.push(fromOklch({ l, c: 0.02, h }));
  }
  return bestContrast(fill, candidates);
}

/**
 * Nudge `color` until it meets `target` contrast against `background`,
 * preserving hue and chroma and moving lightness only.
 *
 * This exists because the published VS Code themes are not WCAG compliant in
 * every role once repurposed as UI colours. Measured against their own
 * backgrounds: Nord's comment colour reaches 2.43:1, and Solarized Light's
 * body text 4.13:1, muted text 2.48:1, string 2.93:1 and yellow 2.98:1. Used
 * raw, a light palette would ship failing text.
 *
 * Moving lightness alone is the smallest change that fixes it. The hue is
 * what makes a palette recognisable as Nord or Solarized, so hue and chroma
 * are left alone and only the tone shifts, away from the background.
 *
 * Returns the best achievable colour if the target cannot be met anywhere in
 * the lightness range, so callers always get a usable value and the contrast
 * suite is what reports the shortfall.
 */
export function ensureContrast(color: string, background: string, target: number): string {
  if (contrastRatio(color, background) >= target) {
    return color;
  }

  const { c, h } = requireColor(color);
  // Move away from the background: darken against a light background, lighten
  // against a dark one.
  const towardDark = isLight(background);
  const steps = 100;

  let best = color;
  let bestRatio = contrastRatio(color, background);

  for (let step = 1; step <= steps; step += 1) {
    const l = towardDark ? 1 - step / steps : step / steps;
    const candidate = fromOklch({ l, c, h });
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
    if (ratio >= target) {
      return candidate;
    }
  }

  return best;
}

/**
 * Meet `target` against EVERY listed background.
 *
 * Text does not sit on one surface. It sits on the base, on raised panels and
 * in sunken wells, and a tone that clears 4.5:1 against the base can fail
 * against a raised panel that moved toward it. Applying the adjustment
 * cumulatively works because all surface variants of a palette sit on the
 * same side of the text, so each pass only ever moves further away.
 */
export function ensureContrastAll(
  color: string,
  backgrounds: readonly string[],
  target: number,
): string {
  let result = color;
  for (const background of backgrounds) {
    result = ensureContrast(result, background, target);
  }
  return result;
}

/**
 * Move toward white by `amount` as a fraction of the distance remaining.
 *
 * Unlike `raise`, the direction is ABSOLUTE. Some era effects model a physical
 * light source, and a bevel's highlight edge is lighter than the surface on
 * every palette, not lighter on dark ones and darker on light ones. Using
 * `raise` for bevels inverted them on Solarized Light.
 *
 * Proportional to the remaining distance, so it approaches white without ever
 * clamping and successive steps stay ordered.
 */
export function lighten(color: string, amount: number): string {
  const l = lightness(color);
  return shiftLightness(color, amount * (1 - l));
}

/** Move toward black by `amount` as a fraction of the distance remaining. */
export function darken(color: string, amount: number): string {
  const l = lightness(color);
  return shiftLightness(color, -amount * l);
}

/** Hue angle in degrees. Hue is what makes a palette recognisable, so it is
 * the property the contrast pass must never change. */
export function hue(color: string): number {
  return requireColor(color).h;
}

/**
 * Replace a colour's hue, keeping its lightness and chroma.
 *
 * Used by the importer when a theme publishes no colour for a role. Rotating
 * an existing palette colour to the conventional hue for that role keeps the
 * result in the theme's own tonal family, which is a better guess than a
 * constant red or green that belongs to no palette.
 */
export function setHue(color: string, degrees: number): string {
  const { l, c } = requireColor(color);
  return fromOklch({ l, c, h: ((degrees % 360) + 360) % 360 });
}

/** Chroma, 0 for greys. Used to tell a real colour from a tinted neutral. */
export function chroma(color: string): number {
  return requireColor(color).c;
}
