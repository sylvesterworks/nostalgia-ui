import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buttonDoc } from '../components/Button/Button.docs.js';
import type * as ButtonStories from '../components/Button/Button.stories.js';
import type { ButtonProps } from '../components/Button/Button.js';
import { cardDoc } from '../components/Card/Card.docs.js';
import type * as CardStories from '../components/Card/Card.stories.js';
import { dialogDoc } from '../components/Dialog/Dialog.docs.js';
import type * as DialogStories from '../components/Dialog/Dialog.stories.js';
import { inputDoc } from '../components/Input/Input.docs.js';
import type * as InputStories from '../components/Input/Input.stories.js';
import { nostalgiaRootDoc } from '../components/NostalgiaRoot/NostalgiaRoot.docs.js';
import type * as NostalgiaRootStories from '../components/NostalgiaRoot/NostalgiaRoot.stories.js';
import { tabsDoc } from '../components/Tabs/Tabs.docs.js';
import type * as TabsStories from '../components/Tabs/Tabs.stories.js';
import * as pkg from '../index.js';

import { findColors } from './color-rules.js';
import { foundationsDoc } from './foundations.docs.js';
import type { ComponentDoc } from './schema.js';

/**
 * The guardrails for component documentation (decision 0007, issue #37).
 * Documentation only holds if the build fails when it is wrong, so each rule
 * the schema's types cannot express is a test here.
 */

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'components');

interface StoryRefs {
  readonly patterns: readonly { readonly story: string }[];
  readonly doAndDont: readonly {
    readonly do: { readonly story: string };
    readonly dont: { readonly story: string };
  }[];
}

const docs = [nostalgiaRootDoc, buttonDoc, inputDoc, cardDoc, tabsDoc, dialogDoc] as const;

/** Each family's name, as a pattern that matches its parts too. */
const FAMILY_PATTERNS: Readonly<Record<string, RegExp>> = {
  NostalgiaRoot: /\bNostalgiaRoot\b/,
  Button: /\bButton\b/,
  Input: /\bInput\b/,
  Card: /\bCard\w*/,
  Tabs: /\bTab\w*/,
  Dialog: /\bDialog\w*/,
};

function storyRefs(doc: StoryRefs): string[] {
  return [
    ...doc.patterns.map((pattern) => pattern.story),
    ...doc.doAndDont.flatMap((pair) => [pair.do.story, pair.dont.story]),
  ];
}

/** Every string anywhere inside a value, for the color check. */
function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

// --- Typecheck-time guardrails --------------------------------------------
//
// These run under `tsc` (pnpm run typecheck), not under Vitest. A story name
// a doc points at that is not exported by that component's stories file
// fails the typecheck, so renaming or deleting a story breaks the build in
// the doc that mentions it.

type StoryNames<Module> = Exclude<keyof Module, 'default'>;
type DocStoryRefs<Doc extends StoryRefs> =
  | Doc['patterns'][number]['story']
  | Doc['doAndDont'][number]['do']['story']
  | Doc['doAndDont'][number]['dont']['story'];
type RefsExist<Doc extends StoryRefs, Module> = [DocStoryRefs<Doc>] extends [StoryNames<Module>]
  ? true
  : false;

const storyReferencesTypecheck: readonly true[] = [
  true satisfies RefsExist<typeof nostalgiaRootDoc, typeof NostalgiaRootStories>,
  true satisfies RefsExist<typeof buttonDoc, typeof ButtonStories>,
  true satisfies RefsExist<typeof inputDoc, typeof InputStories>,
  true satisfies RefsExist<typeof cardDoc, typeof CardStories>,
  true satisfies RefsExist<typeof tabsDoc, typeof TabsStories>,
  true satisfies RefsExist<typeof dialogDoc, typeof DialogStories>,
];

describe('the typecheck-time guardrails', () => {
  it('are in place for every doc', () => {
    expect(storyReferencesTypecheck).toHaveLength(docs.length);
  });

  it('reject a story name the stories file does not export', () => {
    interface Wrong {
      readonly patterns: readonly [{ readonly story: 'NoSuchStory' }];
      readonly doAndDont: readonly [];
    }
    // @ts-expect-error NoSuchStory is not exported by Button.stories.tsx
    const check: true = true satisfies RefsExist<Wrong, typeof ButtonStories>;
    expect(check).toBe(true);
  });

  it('reject a prop the component does not have', () => {
    const doc = {
      name: 'Button',
      summary: '',
      anatomy: [],
      props: {
        // @ts-expect-error Button has no prop named size
        size: { description: '' },
      },
      patterns: [],
      doAndDont: [],
      accessibility: [],
      extensibility: { render: '', className: '', cssVariables: [], extendVsOverride: '' },
      eraNotes: {},
      notes: [],
    } as const satisfies ComponentDoc<ButtonProps>;
    expect(doc.name).toBe('Button');
  });
});

// --- Run-time guardrails --------------------------------------------------

describe('component documentation', () => {
  it('exists for every component folder, named after it', async () => {
    const folders = (await readdir(componentsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(docs.map((doc) => doc.name).sort()).toEqual(folders);
  });

  it('documents every exported part in exactly one anatomy', () => {
    // Hooks are exported too, but they are not parts with a class name.
    const parts = Object.keys(pkg).filter((name) => !name.startsWith('use'));
    const documented = docs.flatMap((doc) => doc.anatomy.map((part) => part.name));
    expect(documented.slice().sort()).toEqual(parts.slice().sort());
    expect(new Set(documented).size, 'a part is documented twice').toBe(documented.length);
  });

  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s has a note that names it and no other component',
    (name, doc) => {
      const own = FAMILY_PATTERNS[name];
      const others = Object.entries(FAMILY_PATTERNS)
        .filter(([family]) => family !== name)
        .map(([, pattern]) => pattern);
      expect(own, 'no family pattern for ' + name).toBeDefined();
      const distinctive = doc.notes.filter(
        (note) =>
          own !== undefined && own.test(note) && others.every((pattern) => !pattern.test(note)),
      );
      expect(distinctive.length, name + ' lacks a note of its own').toBeGreaterThan(0);
    },
  );

  it.each([
    ...docs.map((doc) => [doc.name, doc] as const),
    ['foundations', foundationsDoc] as const,
  ])('%s names no color', (name, doc) => {
    const found = allStrings(doc).flatMap(findColors);
    expect(found, name + ' names colors: ' + found.join(', ')).toHaveLength(0);
  });

  it('no longer repeats the NostalgiaRoot requirement on each component', () => {
    // It is stated once, in foundations.docs.ts.
    const rule = foundationsDoc.rules.find((r) => r.title === 'Render inside NostalgiaRoot');
    expect(rule).toBeDefined();
    for (const doc of docs) {
      for (const note of doc.notes) {
        expect(note, doc.name + ' repeats the root rule').not.toMatch(/must render inside/i);
      }
    }
  });
});

describe('story references', () => {
  const stories = {
    NostalgiaRoot: () => import('../components/NostalgiaRoot/NostalgiaRoot.stories.js'),
    Button: () => import('../components/Button/Button.stories.js'),
    Input: () => import('../components/Input/Input.stories.js'),
    Card: () => import('../components/Card/Card.stories.js'),
    Tabs: () => import('../components/Tabs/Tabs.stories.js'),
    Dialog: () => import('../components/Dialog/Dialog.stories.js'),
  } as const;

  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s points only at stories that exist',
    async (name, doc) => {
      const load = stories[name];
      const module: Record<string, unknown> = await load();
      for (const ref of storyRefs(doc)) {
        expect(Object.keys(module), name + ' doc points at missing story ' + ref).toContain(ref);
      }
    },
  );
});
