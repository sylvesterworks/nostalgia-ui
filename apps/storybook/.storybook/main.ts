import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const repo = (path: string): string => fileURLToPath(new URL('../../../' + path, import.meta.url));

/**
 * Storybook is the local development surface (decision 0007).
 *
 * Stories live next to the components in packages/react, not in this app, so
 * a component, its stylesheet, its stories and later its doc sit in one
 * folder.
 *
 * The aliases are the reason this app exists. The workspace packages export
 * from dist, so without them an edit to a component is invisible until
 * `tsc -b` runs. Pointing the bare package names at source gives hot reload
 * on every component edit. The patterns are anchored so that subpath imports
 * such as `@nostalgiaui/tokens/tokens.css` still resolve through the package.
 */
const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../../../packages/react/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: [
          { find: /^@nostalgiaui\/react$/, replacement: repo('packages/react/src/index.ts') },
          { find: /^@nostalgiaui\/tokens$/, replacement: repo('packages/tokens/src/index.ts') },
        ],
      },
    }),
};

export default config;
