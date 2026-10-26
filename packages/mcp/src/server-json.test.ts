import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The registry verifies a listing against the npm package it points at, and
 * rejects a mismatch at publish time, which is the worst moment to find out.
 * These checks move that failure to CI.
 */
const here = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(here, '..');

interface ServerJson {
  readonly $schema: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly repository: { readonly url: string; readonly source: string };
  readonly packages: ReadonlyArray<{
    readonly registryType: string;
    readonly identifier: string;
    readonly version: string;
    readonly transport: { readonly type: string };
  }>;
}

interface PackageJson {
  readonly name: string;
  readonly version: string;
  readonly mcpName?: string;
  readonly repository?: { readonly url: string };
}

async function load(): Promise<{ server: ServerJson; pkg: PackageJson }> {
  const server = JSON.parse(await readFile(join(pkgDir, 'server.json'), 'utf8')) as ServerJson;
  const pkg = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8')) as PackageJson;
  return { server, pkg };
}

describe('server.json', () => {
  it('names the server exactly as package.json claims ownership of it', async () => {
    const { server, pkg } = await load();
    expect(pkg.mcpName).toBeDefined();
    expect(server.name).toBe(pkg.mcpName);
  });

  it('uses the GitHub namespace for the account that will authenticate', async () => {
    const { server } = await load();
    // GitHub-based publishing requires io.github.<account>/, and the account
    // is sylvesterworks, never the personal one.
    expect(server.name.startsWith('io.github.sylvesterworks/')).toBe(true);
  });

  it('points at this npm package at this exact version', async () => {
    const { server, pkg } = await load();
    expect(server.version).toBe(pkg.version);
    const entry = server.packages.find((p) => p.identifier === pkg.name);
    expect(entry, 'no packages entry for ' + pkg.name).toBeDefined();
    expect(entry?.version).toBe(pkg.version);
    expect(entry?.registryType).toBe('npm');
    expect(entry?.transport.type).toBe('stdio');
  });

  it('carries the fields the schema requires', async () => {
    const { server } = await load();
    expect(server.$schema).toContain('server.schema.json');
    expect(server.description.length).toBeGreaterThan(20);
    // The registry rejects a description over 100 characters with a 422.
    expect(server.description.length).toBeLessThanOrEqual(100);
    expect(server.repository.source).toBe('github');
    expect(server.repository.url).toBe('https://github.com/sylvesterworks/nostalgia-ui');
  });
});
