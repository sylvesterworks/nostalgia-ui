import type { EraId } from '@nostalgiaui/tokens';

/**
 * The shape of component documentation (decision 0007).
 *
 * One `<Name>.docs.ts` per component folder exports a `ComponentDoc`, and
 * `foundations.docs.ts` holds what is true of every component. Three readers
 * consume these: Storybook, the docs site and the MCP server. None of them
 * parses anything; they import the objects.
 *
 * The rules this file cannot express in types are enforced by
 * docs/docs.test.ts: every exported part is documented once, every doc has a
 * note of its own, no doc names a color, and every story a doc points at
 * exists.
 */

/**
 * Prose in a small Markdown subset: paragraphs separated by a blank line,
 * inline code in backticks, and [links](https://example.com). Nothing else.
 */
export type Prose = string;

/**
 * The export name of a story in the component's own `<Name>.stories.tsx`.
 *
 * A plain string rather than a type derived from the stories module: a doc
 * that imported its stories, even as a type, would pull the stories file into
 * the package build and ship it. docs.test.ts checks every reference against
 * the real exports at typecheck time and at run time instead.
 */
export type StoryRef = string;

/** One part of a component and the class name its stylesheet targets. */
export interface AnatomyPart {
  /** The export name, for example `CardTitle`. */
  readonly name: string;
  /** The class the part always carries, for example `nui-CardTitle`. */
  readonly className: string;
  readonly description: Prose;
}

/** What the types alone do not say about one prop. */
export interface PropDoc {
  readonly description: Prose;
  /** When to reach for it, if that is not obvious from the description. */
  readonly whenToUse?: Prose;
}

export interface Pattern {
  readonly title: string;
  readonly description: Prose;
  readonly story: StoryRef;
}

export interface Example {
  readonly story: StoryRef;
  readonly description: Prose;
}

/** A pair of examples, each a real story, and one sentence of why. */
export interface DoAndDont {
  readonly do: Example;
  readonly dont: Example;
  readonly why: Prose;
}

export interface CssVariableDoc {
  /** The full custom property name, for example `--nui-color-accent`. */
  readonly name: string;
  readonly description: Prose;
}

export interface Extensibility {
  /** What the `render` prop does on this component, or why there is none. */
  readonly render: Prose;
  /** How `className` combines with the component's own classes. */
  readonly className: Prose;
  /** Custom properties that are safe to override on this component. */
  readonly cssVariables: readonly CssVariableDoc[];
  /** When to wrap or extend the component, and when to override its styles. */
  readonly extendVsOverride: Prose;
}

/**
 * Documentation for one component family.
 *
 * `Props` is the component's own props type. `props` is keyed by it, so
 * documenting a prop that does not exist, or that was renamed, is a type
 * error. Types and defaults are not written here: they are extracted from the
 * TypeScript types at build time (#38).
 */
export interface ComponentDoc<Props> {
  /** The component family, matching its folder name. */
  readonly name: string;
  /** What it is and when to reach for it. */
  readonly summary: Prose;
  /** Every exported part of the family, each exactly once. */
  readonly anatomy: readonly AnatomyPart[];
  readonly props: { readonly [K in Extract<keyof Props, string>]?: PropDoc };
  /** How it is meant to be composed, each shown by a story. */
  readonly patterns: readonly Pattern[];
  readonly doAndDont: readonly DoAndDont[];
  /** Keyboard behavior, labelling requirements and contrast notes. */
  readonly accessibility: readonly Prose[];
  readonly extensibility: Extensibility;
  /** Behavior specific to an era, keyed by era id. */
  readonly eraNotes: { readonly [E in EraId]?: Prose };
  /** Short gotchas. At least one must name this component and no other. */
  readonly notes: readonly Prose[];
}

/**
 * One row of a part's props table, extracted from the TypeScript types at
 * build time by src/extract/props.ts (#38, decision 0010). Never written by
 * hand.
 */
export interface PropRow {
  readonly name: string;
  /** The type as the compiler prints it, without the `| undefined` of an optional prop. */
  readonly type: string;
  readonly required: boolean;
  /** The JSDoc `@default` text, when there is one. */
  readonly default?: string;
  /** The JSDoc description. */
  readonly description: string;
  /** Where the prop is declared: in this package, or by Base UI. */
  readonly origin: 'nostalgiaui' | 'base-ui';
}

/**
 * Props tables keyed by part export name, for example `Tab` or `DialogPopup`.
 * React and DOM attributes are left out: they are the same on every element
 * and documented by React.
 */
export type PropsTable = Readonly<Record<string, readonly PropRow[]>>;

/**
 * A doc whose props type is not known to the reader, as in the published
 * manifest, where every component's doc sits in one array.
 */
export type AnyComponentDoc = ComponentDoc<Readonly<Record<string, unknown>>>;

/** The rules that apply to every component, stated once. */
export interface FoundationsDoc {
  readonly summary: Prose;
  readonly rules: readonly { readonly title: string; readonly description: Prose }[];
}

/*
 * How a doc file uses this schema:
 *
 *   export const buttonDoc = { ... } as const satisfies ComponentDoc<ButtonProps>;
 *
 * `satisfies` checks the object against the schema, including excess
 * properties, so an unknown prop name is an error. `as const` keeps every
 * story name as its literal, which is what lets docs.test.ts check story
 * references against the stories file at typecheck time.
 */
