import { readdir, readFile } from 'node:fs/promises';
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
import type { AnyComponentDoc, ComponentDoc } from './schema.js';

/**
 * The guardrails for component documentation (decision 0007, issue #37).
 * Documentation only holds if the build fails when it is wrong, so each rule
 * the schema's types cannot express is a test here.
 */

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'components');

interface StoryRefs {
  readonly patterns: readonly { readonly story: string }[];
  readonly variants: readonly string[];
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
    ...doc.variants,
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
  | Doc['variants'][number]
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
      readonly variants: readonly [];
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
      variants: [],
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

// --- Guardrails added in #41 ----------------------------------------------
//
// Each rule is a small function returning the problems it finds, so the same
// function runs over the real docs and over a broken fixture that proves it
// can fail.

const stories = {
  NostalgiaRoot: () => import('../components/NostalgiaRoot/NostalgiaRoot.stories.js'),
  Button: () => import('../components/Button/Button.stories.js'),
  Input: () => import('../components/Input/Input.stories.js'),
  Card: () => import('../components/Card/Card.stories.js'),
  Tabs: () => import('../components/Tabs/Tabs.stories.js'),
  Dialog: () => import('../components/Dialog/Dialog.stories.js'),
} as const;

async function storyNames(name: keyof typeof stories): Promise<string[]> {
  const module: Record<string, unknown> = await stories[name]();
  return Object.keys(module).filter((key) => key !== 'default');
}

/**
 * Every component folder holds its doc and its stories, named after it, and
 * no doc or stories file lives anywhere else.
 */
function fileProblems(folder: string, files: readonly string[]): string[] {
  const problems: string[] = [];
  for (const required of [folder + '.docs.ts', folder + '.stories.tsx']) {
    if (!files.includes(required)) problems.push(folder + ' has no ' + required);
  }
  for (const file of files) {
    const orphan = /\.(docs\.ts|stories\.tsx)$/.test(file) && !file.startsWith(folder + '.');
    if (orphan) problems.push(folder + '/' + file + ' is not named after its folder');
  }
  return problems;
}

/**
 * Every story is a pattern, half of a do and don't pair, or a variant, and a
 * variant is not also shown in one of the other sections.
 */
function storyUsageProblems(
  doc: StoryRefs & { readonly name: string },
  exported: readonly string[],
): string[] {
  const shown = new Set([
    ...doc.patterns.map((pattern) => pattern.story),
    ...doc.doAndDont.flatMap((pair) => [pair.do.story, pair.dont.story]),
  ]);
  const used = new Set([...shown, ...doc.variants]);
  return [
    ...exported
      .filter((story) => !used.has(story))
      .map((story) => doc.name + '.' + story + ' is used by no section and is not a variant'),
    ...doc.variants
      .filter((story) => shown.has(story))
      .map((story) => doc.name + '.' + story + ' is a variant and also shown elsewhere'),
  ];
}

/** Both sides and the reason say something, and the two sides differ. */
function doAndDontProblems(doc: Pick<AnyComponentDoc, 'name' | 'doAndDont'>): string[] {
  return doc.doAndDont.flatMap((pair, index) => {
    const where = doc.name + " do and don't " + String(index + 1);
    const problems: string[] = [];
    for (const [side, example] of [
      ['do', pair.do],
      ['dont', pair.dont],
    ] as const) {
      if (example.story.trim() === '') problems.push(where + ': ' + side + ' has no story');
      if (example.description.trim() === '') {
        problems.push(where + ': ' + side + ' has no description');
      }
    }
    if (pair.why.trim() === '') problems.push(where + ': no reason');
    if (pair.do.story === pair.dont.story) {
      problems.push(where + ': both sides show ' + pair.do.story);
    }
    return problems;
  });
}

/** Every top-level section of a doc, in schema order. */
const SECTIONS = [
  'name',
  'summary',
  'anatomy',
  'props',
  'patterns',
  'variants',
  'doAndDont',
  'accessibility',
  'extensibility',
  'eraNotes',
  'notes',
] as const satisfies readonly (keyof AnyComponentDoc)[];

const EXTENSIBILITY = [
  'render',
  'className',
  'cssVariables',
  'extendVsOverride',
] as const satisfies readonly (keyof AnyComponentDoc['extensibility'])[];

/**
 * Sections a component may leave empty, and why. An entry for a section that
 * is not empty fails too, so this list cannot go stale.
 */
const ALLOWED_EMPTY: Readonly<Record<string, readonly string[]>> = {
  // NostalgiaRoot sets the era; it has no look of its own to vary by era.
  // Its two stories are a pattern and a do and don't pair.
  NostalgiaRoot: ['eraNotes', 'variants'],
  // Every Tabs and Dialog story is a pattern or half of a do and don't pair.
  Tabs: ['variants'],
  Dialog: ['variants'],
};

function isEmpty(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (value !== null && typeof value === 'object') return Object.keys(value).length === 0;
  return value === undefined;
}

/** Sections missing from a doc, and the empty ones, by name. */
function sectionProblems(doc: object): { readonly missing: string[]; readonly empty: string[] } {
  const record = doc as Readonly<Record<string, unknown>>;
  const missing = SECTIONS.filter((section) => !(section in record));
  const empty: string[] = SECTIONS.filter(
    (section) => section in record && isEmpty(record[section]),
  );
  const extensibility = record['extensibility'];
  if (extensibility !== null && typeof extensibility === 'object') {
    const fields = extensibility as Readonly<Record<string, unknown>>;
    for (const field of EXTENSIBILITY) {
      if (isEmpty(fields[field])) empty.push('extensibility.' + field);
    }
  }
  return { missing, empty: empty.sort() };
}

describe('component files', () => {
  it('pair a doc and a stories file in every folder, with none elsewhere', async () => {
    const entries = await readdir(componentsDir, { withFileTypes: true });
    const problems = entries
      .filter((entry) => entry.isFile() && /\.(docs\.ts|stories\.tsx)$/.test(entry.name))
      .map((entry) => entry.name + ' is outside a component folder');
    for (const folder of entries.filter((entry) => entry.isDirectory())) {
      problems.push(...fileProblems(folder.name, await readdir(join(componentsDir, folder.name))));
    }
    expect(problems).toEqual([]);
  });

  it('reject a folder without stories and a stray doc', () => {
    expect(fileProblems('Card', ['Card.tsx', 'Card.docs.ts', 'Panel.docs.ts'])).toEqual([
      'Card has no Card.stories.tsx',
      'Card/Panel.docs.ts is not named after its folder',
    ]);
  });
});

describe('story references', () => {
  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s points only at stories that exist',
    async (name, doc) => {
      const exported = await storyNames(name);
      for (const ref of storyRefs(doc)) {
        expect(exported, name + ' doc points at missing story ' + ref).toContain(ref);
      }
    },
  );

  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s uses every story it has',
    async (name, doc) => {
      expect(storyUsageProblems(doc, await storyNames(name))).toEqual([]);
    },
  );

  it('reject a story no section uses, and a variant shown twice', () => {
    const doc = {
      name: 'Button',
      patterns: [{ story: 'Solid' }],
      variants: ['Solid'],
      doAndDont: [],
    };
    expect(storyUsageProblems(doc, ['Solid', 'Ghost'])).toEqual([
      'Button.Ghost is used by no section and is not a variant',
      'Button.Solid is a variant and also shown elsewhere',
    ]);
  });

  it.each(Object.keys(stories))('%s.stories.tsx names no color', async (name) => {
    const source = await readFile(join(componentsDir, name, name + '.stories.tsx'), 'utf8');
    expect(findColors(source)).toEqual([]);
  });

  it('reject a story that names a color', () => {
    expect(findColors("args: { style: { background: 'red' } }")).toEqual(['red']);
  });
});

describe("do and don't pairs", () => {
  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s has both sides and a reason for every pair',
    (_name, doc) => {
      expect(doAndDontProblems(doc)).toEqual([]);
    },
  );

  it('reject a pair with an empty side, no reason, or one story on both sides', () => {
    const doc = {
      name: 'Button',
      doAndDont: [
        {
          do: { story: 'AsLink', description: '' },
          dont: { story: 'AsLink', description: 'Navigate from a click handler.' },
          why: ' ',
        },
      ],
    };
    expect(doAndDontProblems(doc)).toEqual([
      "Button do and don't 1: do has no description",
      "Button do and don't 1: no reason",
      "Button do and don't 1: both sides show AsLink",
    ]);
  });
});

describe('doc sections', () => {
  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s fills every section the allow-list does not exempt',
    (name, doc) => {
      const { missing, empty } = sectionProblems(doc);
      expect(missing, name + ' is missing sections').toEqual([]);
      expect(empty, name + ': empty sections differ from ALLOWED_EMPTY').toEqual(
        [...(ALLOWED_EMPTY[name] ?? [])].sort(),
      );
    },
  );

  it('exempt no component the docs do not have', () => {
    const names = docs.map((doc): string => doc.name);
    expect(Object.keys(ALLOWED_EMPTY).filter((name) => !names.includes(name))).toEqual([]);
  });

  it('reject a missing section and an empty one', () => {
    const broken: Record<string, unknown> = {
      ...buttonDoc,
      accessibility: [],
      extensibility: { ...buttonDoc.extensibility, render: '' },
    };
    delete broken['notes'];
    expect(sectionProblems(broken)).toEqual({
      missing: ['notes'],
      empty: ['accessibility', 'extensibility.render'],
    });
  });
});
