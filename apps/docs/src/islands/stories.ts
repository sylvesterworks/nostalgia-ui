import { createElement } from 'react';
import type * as React from 'react';

/*
 * The component stories, loaded as plain modules (decision 0012).
 *
 * The stories files import Storybook for types only, which compiles away, so
 * nothing from the Storybook runtime reaches this site. A story is either
 * `args` for the meta's component or a `render` function, and both are
 * rendered here the way Storybook would, minus the toolbar decorator: the
 * caller wraps the result in its own NostalgiaRoot.
 *
 * The stories are not in the published package, so they are read from
 * packages/react/src. Their components come from source too, which is why the
 * examples island imports NostalgiaRoot from source rather than from the
 * package: one copy of its portal context for the root and the story alike.
 */

type Args = Readonly<Record<string, unknown>>;

interface Story {
  readonly args?: Args;
  readonly parameters?: Readonly<Record<string, unknown>>;
  readonly render?: (args: Args) => React.ReactNode;
}

interface Meta {
  readonly component?: React.ElementType;
  readonly args?: Args;
}

const modules = import.meta.glob('../../../../packages/react/src/components/*/*.stories.tsx', {
  eager: true,
});

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null;
}

function isStory(value: unknown): value is Story {
  return (
    isRecord(value) &&
    (value['render'] === undefined || typeof value['render'] === 'function') &&
    (value['args'] === undefined || isRecord(value['args']))
  );
}

interface StoriesFile {
  readonly meta: Meta;
  readonly stories: Readonly<Record<string, Story>>;
}

const files = new Map<string, StoriesFile>();

for (const [path, module] of Object.entries(modules)) {
  const component = /\/components\/([^/]+)\/\1\.stories\.tsx$/.exec(path)?.[1];
  if (component === undefined || !isRecord(module) || !isRecord(module['default'])) {
    throw new Error(`Not a stories module: ${path}`);
  }
  const stories: Record<string, Story> = {};
  for (const [name, value] of Object.entries(module)) {
    if (name === 'default') continue;
    if (!isStory(value)) throw new Error(`${component}.stories.tsx: ${name} is not a story`);
    stories[name] = value;
  }
  files.set(component, { meta: module['default'], stories });
}

/**
 * Stories that open a modal Dialog on load. In Storybook each story has the
 * canvas to itself; on a docs page they would all open at once, lock scrolling
 * and trap focus, so these wait for a click. The stories themselves stay as
 * they are, which is why the list lives here.
 */
const OPENS_ON_LOAD: ReadonlySet<string> = new Set([
  'Dialog.Open',
  'Dialog.DontTitleAfterDescription',
]);

// A renamed or deleted story must not leave a stale entry behind.
for (const id of OPENS_ON_LOAD) {
  const [component = '', name = ''] = id.split('.');
  if (files.get(component)?.stories[name] === undefined) {
    throw new Error(`OPENS_ON_LOAD names ${id}, which is not a story`);
  }
}

function storiesFile(component: string): StoriesFile {
  const file = files.get(component);
  if (file === undefined) throw new Error(`No stories file for ${component}`);
  return file;
}

export interface LoadedStory {
  /** False for a story that opts out of the root, as DontOutsideRoot does. */
  readonly withRoot: boolean;
  /** True for a story that opens a modal on load, which mounts on a click. */
  readonly opensOnLoad: boolean;
  readonly element: React.ReactElement;
}

/** One story as an element, with the meta's args under the story's own. */
export function loadStory(component: string, name: string): LoadedStory {
  const { meta, stories } = storiesFile(component);
  const story = stories[name];
  if (story === undefined) throw new Error(`${component}.stories.tsx has no story ${name}`);

  const args: Args = { ...meta.args, ...story.args };
  const { render } = story;
  let element: React.ReactElement;
  if (render !== undefined) {
    // Rendered as a component of its own, so a render function may use hooks.
    const Render = (): React.ReactNode => render(args);
    Render.displayName = `${component}.${name}`;
    element = createElement(Render);
  } else if (meta.component !== undefined) {
    element = createElement(meta.component, args);
  } else {
    throw new Error(`${component}.${name} has no render function and the meta has no component`);
  }
  return {
    withRoot: story.parameters?.['nostalgiaRoot'] !== false,
    opensOnLoad: OPENS_ON_LOAD.has(`${component}.${name}`),
    element,
  };
}
