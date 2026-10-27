import { NostalgiaRoot } from '@nostalgiaui/react';
import { eras, palettes } from '@nostalgiaui/tokens';
import type { Decorator, Preview } from '@storybook/react-vite';

// The token layer comes from the tokens build: tokens.css is generated from
// TypeScript, so there is no CSS source to alias. A change to an era or a
// palette needs `pnpm --filter @nostalgiaui/tokens build`.
import '@nostalgiaui/tokens/tokens.css';

// The component stylesheets come straight from source, so a CSS edit hot
// reloads. Same order as STYLE_ORDER in packages/react/src/cli.ts, which is
// the order dist/styles.css concatenates them in.
import '../../../packages/react/src/components/NostalgiaRoot/NostalgiaRoot.css';
import '../../../packages/react/src/styles/foundations.css';
import '../../../packages/react/src/components/Button/Button.css';
import '../../../packages/react/src/components/Input/Input.css';
import '../../../packages/react/src/components/Card/Card.css';
import '../../../packages/react/src/components/Tabs/Tabs.css';
import '../../../packages/react/src/components/Dialog/Dialog.css';

import './preview.css';

const firstEra = eras[0]?.id ?? '';
const firstPalette = palettes[0]?.id ?? '';

function pick(value: unknown, fallback: string): string {
  return typeof value === 'string' && value !== '' ? value : fallback;
}

/**
 * Every story renders inside one NostalgiaRoot, set from the toolbar. That is
 * the same contract a consumer has, so a story that looks right here looks
 * right in an application.
 *
 * A story can opt out with `parameters: { nostalgiaRoot: false }`. Only the
 * "don't render outside a root" example does, to show what that looks like.
 */
const withNostalgiaRoot: Decorator = (Story, context) =>
  context.parameters['nostalgiaRoot'] === false ? (
    <Story />
  ) : (
    <NostalgiaRoot
      era={pick(context.globals['era'], firstEra)}
      palette={pick(context.globals['palette'], firstPalette)}
      className="sb-Stage"
    >
      <Story />
    </NostalgiaRoot>
  );

const preview: Preview = {
  decorators: [withNostalgiaRoot],
  globalTypes: {
    era: {
      description: 'Era: shape and feel',
      toolbar: {
        title: 'Era',
        icon: 'component',
        items: eras.map((era) => ({ value: era.id, title: era.label + ' (' + era.period + ')' })),
        dynamicTitle: true,
      },
    },
    palette: {
      description: 'Palette: color only',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: palettes.map((palette) => ({ value: palette.id, title: palette.label })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { era: firstEra, palette: firstPalette },
  parameters: {
    layout: 'fullscreen',
  },
};

export default preview;
