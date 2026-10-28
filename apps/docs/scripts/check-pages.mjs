// Fails the docs build when a component in the manifest has no page (#41).
//
// The pages come from getStaticPaths over the manifest, so today a missing
// page means that route broke or was removed. Run after `astro build`; takes
// the dist directory as its only argument.

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { argv, exit, stderr, stdout } from 'node:process';

import { manifest } from '@nostalgiaui/react/manifest';

const dist = resolve(argv[2] ?? 'dist');
const pages = ['components/index.html'].concat(
  manifest.map((entry) => join('components', entry.name.toLowerCase(), 'index.html')),
);
const missing = pages.filter((page) => !existsSync(join(dist, page)));

if (missing.length > 0) {
  stderr.write('Missing component pages in ' + dist + ':\n  ' + missing.join('\n  ') + '\n');
  exit(1);
}
stdout.write('All ' + String(pages.length) + ' component pages built.\n');
