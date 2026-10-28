// Put the static Storybook under /storybook in the docs site's output (#42).
//
// GitHub Pages deploys one artifact, apps/docs/dist, so Storybook's build is
// copied into it rather than deployed on its own. Run after `pnpm run build`,
// in the deploy workflow and locally before previewing the combined site.
//
// Every link the docs pages make into Storybook names a story id. The ids are
// checked here against Storybook's own index.json, so a renamed story or a
// changed title fails before deploying a dead link.
import { cp, readdir, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const docsDist = 'apps/docs/dist';
const storybookDist = 'apps/storybook/dist';
const target = join(docsDist, 'storybook');

function fail(message) {
  process.stderr.write(message + '\n');
  process.exit(1);
}

for (const [dir, name] of [
  [docsDist, 'docs'],
  [storybookDist, 'Storybook'],
]) {
  if (!existsSync(join(dir, 'index.html'))) {
    fail('No ' + name + ' build in ' + dir + '. Run `pnpm run build` first.');
  }
}

const index = JSON.parse(await readFile(join(storybookDist, 'index.json'), 'utf8'));
const ids = new Set(Object.keys(index.entries));

/** Every HTML file under a directory, Storybook's own copy excluded. */
async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && path !== target) files.push(...(await htmlFiles(path)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

const dead = [];
let links = 0;
for (const file of await htmlFiles(docsDist)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="\/storybook\/\?path=\/story\/([^"&]+)"/g)) {
    links += 1;
    if (!ids.has(match[1])) dead.push(file + ': ' + match[1]);
  }
}
if (dead.length > 0) {
  fail('Links to stories Storybook does not have:\n  ' + dead.join('\n  '));
}

await rm(target, { recursive: true, force: true });
await cp(storybookDist, target, { recursive: true });
process.stdout.write(
  'Copied Storybook to ' + target + '; ' + String(links) + ' story links checked.\n',
);
