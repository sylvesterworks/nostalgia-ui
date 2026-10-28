import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

/**
 * The sidebar brand links back to the docs site's components, the other half
 * of the links from each component page into this Storybook (#42). The
 * theme is otherwise Storybook's own.
 */
addons.setConfig({
  theme: {
    ...themes.normal,
    brandTitle: 'NostalgiaUI',
    brandUrl: 'https://nostalgiaui.sylvester.works/components/',
    brandTarget: '_self',
  },
});
