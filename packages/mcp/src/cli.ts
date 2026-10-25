#!/usr/bin/env node
/**
 * nostalgiaui-mcp
 *
 * Serves the NostalgiaUI MCP server over stdio.
 *
 * serveStdio rather than a hand-wired StdioServerTransport: it negotiates the
 * protocol revision per client, so one process answers both current clients
 * and ones that still open with the older initialize handshake. Wiring the
 * transport by hand compiles but only serves the older clients.
 *
 * Nothing is written to stdout except protocol traffic. stdout is the wire,
 * so any stray console.log would corrupt a message; diagnostics go to stderr.
 */
import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { createServer } from './server.js';

serveStdio(createServer, {
  onerror: (error) => {
    process.stderr.write('nostalgiaui-mcp: ' + String(error) + '\n');
  },
});
