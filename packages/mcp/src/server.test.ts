import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Integration test over the real protocol.
 *
 * tools.test.ts calls the tool functions directly. This file instead spawns
 * the built CLI as a child process and talks to it the way Claude Code would:
 * over stdio, through the client package, with schema validation on the way
 * in and content blocks on the way out. It is the test that catches a tool
 * that works as a function but is registered wrong, has a bad schema, or
 * writes to stdout and corrupts the wire.
 *
 * It depends on dist/cli.js, so the package must be built first. The turbo
 * pipeline guarantees that: test dependsOn ^build and this package's own
 * build runs before its tests.
 */
const here = dirname(fileURLToPath(import.meta.url));
const cliPath = join(here, '..', 'dist', 'cli.js');

interface TextContent {
  readonly type: 'text';
  readonly text: string;
}

function firstText(result: unknown): string {
  const content = (result as { content?: readonly TextContent[] }).content;
  const block = content?.[0];
  if (block === undefined || block.type !== 'text') {
    throw new Error('Expected a text content block, got ' + JSON.stringify(result));
  }
  return block.text;
}

describe('the server over stdio', () => {
  const client = new Client({ name: 'nostalgiaui-test', version: '0.0.0' });
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({ command: process.execPath, args: [cliPath] });
    await client.connect(transport);
  }, 20_000);

  afterAll(async () => {
    await client.close();
  });

  it('registers exactly the five tools the brief specifies', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual(
      [
        'check_contrast',
        'get_component',
        'get_tokens',
        'import_vscode_theme',
        'list_palettes',
        'list_eras',
      ].sort(),
    );
  });

  it('describes every tool, since the description is what the model reads', async () => {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description, tool.name + ' has no description').toBeTruthy();
      expect((tool.description ?? '').length).toBeGreaterThan(40);
    }
  });

  it('answers list_eras', async () => {
    const result = await client.callTool({ name: 'list_eras', arguments: {} });
    const eras = JSON.parse(firstText(result)) as Array<{ id: string }>;
    expect(eras.map((era) => era.id)).toContain('frutiger-aero');
  });

  it('answers get_tokens with scoped css for the demo pairing', async () => {
    const result = await client.callTool({
      name: 'get_tokens',
      arguments: { era: 'frutiger-aero', palette: 'nord', format: 'css' },
    });
    const css = firstText(result);
    expect(css).toContain('[data-palette="nord"][data-era="frutiger-aero"]');
    expect(css).toContain('--nui-era-gloss-top');
  });

  it('answers get_component with source and era css', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { name: 'Button', era: 'frutiger-aero' },
    });
    const answer = JSON.parse(firstText(result)) as { source: string; eraCss: string };
    expect(answer.source).toContain('useRender');
    expect(answer.eraCss).toContain("[data-era='frutiger-aero']");
  });

  it('answers get_component with only the section asked for', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { name: 'Button', era: 'flat-metro', section: 'accessibility' },
    });
    const answer = JSON.parse(firstText(result)) as { section: string; content: unknown };
    expect(Object.keys(answer).sort()).toEqual(['content', 'era', 'name', 'section']);
    expect(Array.isArray(answer.content)).toBe(true);
  });

  it('sends instructions with the rules every component shares', () => {
    const instructions = client.getInstructions() ?? '';
    expect(instructions).toContain('Render inside NostalgiaRoot');
    expect(instructions).toContain('@nostalgiaui/react/styles.css');
  });

  it('answers import_vscode_theme from a JSON string', async () => {
    const theme = JSON.stringify({
      name: 'Wire Test',
      colors: { 'editor.background': '#1b1b1b', 'editor.foreground': '#eeeeee' },
    });
    const result = await client.callTool({
      name: 'import_vscode_theme',
      arguments: { theme },
    });
    const answer = JSON.parse(firstText(result)) as { report: { name: string } };
    expect(answer.report.name).toBe('Wire Test');
  });

  it('answers check_contrast with a passing audit', async () => {
    const result = await client.callTool({
      name: 'check_contrast',
      arguments: { era: 'classic-windows', palette: 'solarized-light' },
    });
    const audit = JSON.parse(firstText(result)) as { passes: boolean; findings: unknown[] };
    expect(audit.passes).toBe(true);
    expect(audit.findings.length).toBeGreaterThanOrEqual(9);
  });

  it('returns a readable error, not a protocol failure, for a bad component name', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { name: 'Carousel', era: 'flat-metro' },
    });
    expect((result as { isError?: boolean }).isError).toBe(true);
    expect(firstText(result)).toContain('Button');
  });

  it('reports an invalid era as a readable error result, not a protocol failure', async () => {
    // The server validates against the zod schema and answers with isError
    // rather than rejecting the call. That is the better behaviour: the model
    // gets a message it can read and correct, instead of a transport-level
    // failure it cannot act on.
    const result = await client.callTool({
      name: 'get_tokens',
      arguments: { era: 'web-2', palette: 'nord', format: 'css' },
    });
    expect((result as { isError?: boolean }).isError).toBe(true);
    expect(firstText(result).toLowerCase()).toContain('era');
  });
});
