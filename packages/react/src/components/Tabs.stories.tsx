import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tab, TabIndicator, TabList, TabPanel, Tabs } from './Tabs.js';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** TabIndicator goes inside TabList, which is what publishes the active tab's geometry. */
export const WithIndicator: Story = {
  render: () => (
    <Tabs defaultValue="eras">
      <TabList>
        <Tab value="eras">Eras</Tab>
        <Tab value="palettes">Palettes</Tab>
        <Tab value="rules">Rules</Tab>
        <TabIndicator />
      </TabList>
      <TabPanel value="eras">Era controls shape and feel.</TabPanel>
      <TabPanel value="palettes">Palette controls color, and nothing else.</TabPanel>
      <TabPanel value="rules">Any palette must work in any era.</TabPanel>
    </Tabs>
  ),
};

/** Tab accepts render, so each tab can be a link. */
export const LinkTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview" render={<a href="#overview" />}>
          Overview
        </Tab>
        <Tab value="settings" render={<a href="#settings" />}>
          Settings
        </Tab>
        <TabIndicator />
      </TabList>
    </Tabs>
  ),
};
