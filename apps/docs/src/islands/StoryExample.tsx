import { useState } from 'react';
import type * as React from 'react';

// From source, like the stories: see stories.ts.
import { NostalgiaRoot } from '../../../../packages/react/src/components/NostalgiaRoot/NostalgiaRoot.js';

import { useExampleTheme } from './example-theme.js';
import { loadStory } from './stories.js';

/**
 * One story from a component's stories file, live, in the page's era and
 * palette. A story that opens a modal on load waits behind a button.
 */
export function StoryExample(props: {
  readonly component: string;
  readonly story: string;
}): React.ReactElement {
  const { era, palette } = useExampleTheme();
  const { withRoot, opensOnLoad, element } = loadStory(props.component, props.story);
  const [mounted, setMounted] = useState(!opensOnLoad);

  const content = mounted ? (
    element
  ) : (
    <button type="button" className="example-mount" onClick={() => setMounted(true)}>
      Show example
    </button>
  );

  return withRoot ? (
    <NostalgiaRoot era={era} palette={palette} className="example-stage">
      {content}
    </NostalgiaRoot>
  ) : (
    <div className="example-stage">{content}</div>
  );
}
