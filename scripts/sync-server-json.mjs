// Keep packages/mcp/server.json in step with packages/mcp/package.json.
//
// Changesets bumps package.json but knows nothing about server.json, and the
// registry refuses a server.json whose version does not exist on npm. This
// runs as part of version-packages so the two can never drift. A test in
// packages/mcp asserts the same thing, so a manual bump cannot slip past CI.
import { readFile, writeFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('packages/mcp/package.json', 'utf8'));
const path = 'packages/mcp/server.json';
const server = JSON.parse(await readFile(path, 'utf8'));

server.version = pkg.version;
for (const entry of server.packages ?? []) {
  if (entry.identifier === pkg.name) {
    entry.version = pkg.version;
  }
}

await writeFile(path, JSON.stringify(server, null, 2) + '\n', 'utf8');
process.stdout.write('server.json -> ' + pkg.version + '\n');
