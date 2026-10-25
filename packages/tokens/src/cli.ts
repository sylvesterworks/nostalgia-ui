/**
 * Write the token artefacts next to the compiled output.
 *
 * This is a plain compiled script rather than a Style Dictionary config. The
 * hard part of this package is deriving each era's extra colours from a
 * palette's semantic colours in OKLCH, which is logic, not token
 * transformation. The DTCG artefact is the hand-off point if a transform
 * pipeline is wanted later.
 *
 * Being compiled by the same tsc invocation as the rest of src means the build
 * needs no extra dependency and no install-script approval.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  emitDtcg,
  emitErasCss,
  emitPairingsCss,
  emitPalettesCss,
  emitTailwindPreset,
} from './emit.js';

const outDir = dirname(fileURLToPath(import.meta.url));

const artefacts: ReadonlyArray<readonly [string, string]> = [
  ['palettes.css', emitPalettesCss()],
  ['eras.css', emitErasCss()],
  ['pairings.css', emitPairingsCss()],
  ['tokens.dtcg.json', emitDtcg()],
  ['tailwind-preset.js', emitTailwindPreset()],
  [
    'tokens.css',
    [
      '/* NostalgiaUI tokens. Generated. Import this one file. */',
      "@import './palettes.css';",
      "@import './eras.css';",
      "@import './pairings.css';",
      '',
    ].join('\n'),
  ],
];

await mkdir(outDir, { recursive: true });

for (const [name, contents] of artefacts) {
  await writeFile(join(outDir, name), contents, 'utf8');
  process.stdout.write('wrote ' + name + ' (' + String(contents.length) + ' bytes)\n');
}
