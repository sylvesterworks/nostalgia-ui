/**
 * NostalgiaUI has exactly two axes, and these types are where that rule is
 * enforced. A palette may only describe colour. An era may only describe
 * shape. Neither type has a field that would let it express the other.
 */

/**
 * Raw colours lifted from a VS Code theme, before any NostalgiaUI meaning is
 * attached to them. Every value is a CSS colour string as the source theme
 * wrote it.
 */
export type PalettePrimitives = {
  /** Editor background. */
  readonly background: string;
  /** Default editor foreground. */
  readonly foreground: string;
  /** Selection background. */
  readonly selection: string;
  /** Syntax: keywords and control flow. */
  readonly keyword: string;
  /** Syntax: string literals. */
  readonly string: string;
  /** Syntax: function and method names. */
  readonly function: string;
  /** Syntax: comments. */
  readonly comment: string;
  /** Syntax: errors and invalid tokens. */
  readonly error: string;
};

export interface Palette {
  readonly id: string;
  readonly label: string;
  /** The VS Code theme these primitives came from. */
  readonly source: {
    readonly theme: string;
    readonly url: string;
    readonly license: string;
  };
  readonly primitives: PalettePrimitives;
}

/**
 * The only colour vocabulary an era is allowed to read. Eras never see
 * palette primitives, so an era cannot depend on a palette having a
 * particular syntax colour.
 */
/**
 * Declared as a type alias rather than an interface on purpose. TypeScript
 * gives implicit index signatures to type aliases but not to interfaces, and
 * the build iterates these with Object.entries. As an interface the entries
 * widen to `any`, which the lint rules correctly reject.
 */
export type SemanticColors = {
  readonly surface: string;
  readonly surfaceRaised: string;
  readonly surfaceSunken: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textOnAccent: string;
  readonly textOnDanger: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly border: string;
  readonly selection: string;
};

/** Shape vocabulary. No field here may hold a colour. A type alias for the
 * same Object.entries reason as SemanticColors above. */
export type EraShape = {
  readonly radiusNone: string;
  readonly radiusSm: string;
  readonly radiusMd: string;
  readonly radiusLg: string;
  readonly radiusPill: string;
  readonly borderWidth: string;
  readonly borderStyle: string;
  readonly spacingUnit: string;
  readonly densityScale: string;
  readonly fontSans: string;
  readonly fontMono: string;
  readonly fontWeightNormal: string;
  readonly fontWeightBold: string;
  readonly letterSpacing: string;
  readonly textTransform: string;
  readonly motionDuration: string;
  readonly motionEasing: string;
  readonly focusWidth: string;
  readonly focusOffset: string;
};

/**
 * Colours an era needs that the semantic layer does not provide: bevel edges,
 * gradient stops, extruded shadow pairs. These are expressed as a FUNCTION of
 * the semantic colours rather than as values, which is what keeps an era
 * independent of any particular palette. The build evaluates them per pairing.
 */
export type EraDerivation<Derived extends EraDerivedRequired = EraDerived> = (
  semantic: SemanticColors,
) => Derived;

/**
 * The derived keys every era must return, and therefore the only `--nui-era-*`
 * variables a stylesheet may read outside a `[data-era]` rule. Everything
 * else an era derives is specific to that era and only exists when that era
 * is active. See docs/decisions/0009-era-token-contract.md.
 *
 * Listed as a runtime tuple as well as a type so that documentation and tests
 * can read the contract rather than restate it.
 */
export const ERA_DERIVED_REQUIRED = ['shadow-raised', 'shadow-overlay', 'focus-color'] as const;
export type EraDerivedRequiredKey = (typeof ERA_DERIVED_REQUIRED)[number];

/** The part of a derivation's result that is the same shape in every era. */
export type EraDerivedRequired = Readonly<Record<EraDerivedRequiredKey, string>>;

/**
 * What a derivation returns when the era is not known at compile time: the
 * required keys, plus whatever extras that era happens to define.
 */
export type EraDerived = EraDerivedRequired & Readonly<Record<string, string>>;

export interface Era<Derived extends EraDerivedRequired = EraDerived> {
  readonly id: string;
  readonly label: string;
  readonly period: string;
  readonly shape: EraShape;
  /** Derived colour recipes. Receives semantic colours, returns CSS values. */
  readonly derive: EraDerivation<Derived>;
}

/**
 * Builds an era whose derived keys are known to the type system. The extras
 * are inferred from the object literal, so an era file names each key once,
 * and leaving out a required key is a compile error in that file rather than
 * a missing variable at runtime.
 */
export function defineEra<Derived extends EraDerivedRequired>(era: Era<Derived>): Era<Derived> {
  return era;
}

/** The era-specific keys of one era, with the required set removed. */
export type EraExtraKey<E extends Era<EraDerivedRequired>> = Exclude<
  keyof ReturnType<E['derive']>,
  EraDerivedRequiredKey
>;
