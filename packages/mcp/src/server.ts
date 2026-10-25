import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';

import {
  checkContrast,
  getComponent,
  getTokens,
  importTheme,
  listEras,
  listPalettes,
  TOKEN_FORMATS,
  ToolError,
} from './tools.js';

export const SERVER_NAME = 'nostalgiaui';
export const SERVER_VERSION = '0.0.0';

type ToolResult = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

function text(value: unknown): ToolResult {
  return {
    content: [
      { type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) },
    ],
  };
}

/**
 * Run a tool and turn a ToolError into a result the model can read and act
 * on, rather than a protocol-level failure. An unknown era name is something
 * the model should correct, so it gets the list of valid names back.
 */
function guarded(run: () => unknown): ToolResult {
  try {
    return text(run());
  } catch (error) {
    if (error instanceof ToolError) {
      return { content: [{ type: 'text', text: error.message }], isError: true };
    }
    throw error;
  }
}

const eraIds = listEras().map((era) => era.id);
const paletteIds = listPalettes().map((palette) => palette.id);

/**
 * Build a server. serveStdio calls this whenever it needs an instance, so it
 * must return a fresh McpServer on every call rather than a shared one.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    'list_eras',
    {
      description:
        'List the design eras NostalgiaUI can render. An era controls shape and feel: radius, borders, bevels, shadows, typography, density and motion. It never controls colour.',
      inputSchema: z.object({}),
    },
    () => guarded(() => listEras()),
  );

  server.registerTool(
    'list_palettes',
    {
      description:
        'List the colour palettes, each drawn from a VS Code theme, with its light or dark appearance and source licence. A palette controls colour only and works in every era.',
      inputSchema: z.object({}),
    },
    () => guarded(() => listPalettes()),
  );

  server.registerTool(
    'get_tokens',
    {
      description:
        'Design tokens for one era and palette pairing. css returns the CSS custom properties scoped to data-era and data-palette attributes. tailwind returns a preset mapping utilities onto those variables. dtcg returns W3C Design Tokens JSON.',
      inputSchema: z.object({
        era: z.enum(eraIds as [string, ...string[]]).describe('Era id, from list_eras'),
        palette: z
          .enum(paletteIds as [string, ...string[]])
          .describe('Palette id, from list_palettes'),
        format: z.enum(TOKEN_FORMATS as [string, ...string[]]).describe('css, tailwind or dtcg'),
      }),
    },
    ({ era, palette, format }) =>
      guarded(() => getTokens(era, palette, format as 'css' | 'tailwind' | 'dtcg')),
  );

  server.registerTool(
    'get_component',
    {
      description:
        'Source for one component styled for one era: the import lines, the TSX wrapper, the stylesheet rules that apply everywhere, the rules scoped to that era, and notes on what is easy to get wrong. Components must render inside NostalgiaRoot.',
      inputSchema: z.object({
        name: z
          .string()
          .describe('Component name: NostalgiaRoot, Button, Input, Card, Tabs or Dialog'),
        era: z.enum(eraIds as [string, ...string[]]).describe('Era id, from list_eras'),
      }),
    },
    ({ name, era }) => guarded(() => getComponent(name, era)),
  );

  server.registerTool(
    'import_vscode_theme',
    {
      description:
        'Turn a VS Code colour theme JSON into a NostalgiaUI palette. Returns the palette primitives, a provenance report saying which values came straight from the theme and which had to be inferred, and the resulting CSS variables.',
      inputSchema: z.object({
        theme: z
          .union([z.string(), z.record(z.string(), z.unknown())])
          .describe('The theme JSON, either as an object or as a JSON string'),
      }),
    },
    ({ theme }) =>
      guarded(() => {
        const parsed: unknown = typeof theme === 'string' ? JSON.parse(theme) : theme;
        return importTheme(parsed);
      }),
  );

  server.registerTool(
    'check_contrast',
    {
      description:
        'Audit WCAG 2.1 contrast for one era and palette pairing. Returns every checked pairing with its ratio and the threshold it must meet, and lists any failures. Colours are derived per pairing, so contrast cannot be known from either axis alone.',
      inputSchema: z.object({
        era: z.enum(eraIds as [string, ...string[]]).describe('Era id, from list_eras'),
        palette: z
          .enum(paletteIds as [string, ...string[]])
          .describe('Palette id, from list_palettes'),
      }),
    },
    ({ era, palette }) => guarded(() => checkContrast(era, palette)),
  );

  return server;
}
