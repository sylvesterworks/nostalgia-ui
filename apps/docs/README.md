# Docs site

Documentation site for nostalgiaui.sylvester.works. Built in milestone 4.

Each component has a page at `/components/<name>/` (decision 0012). The
static Storybook is served beside it at `/storybook/`: to preview the
combined site locally, run `pnpm run build`, then `pnpm run assemble:site`,
then `pnpm --filter @nostalgiaui/docs preview`.
