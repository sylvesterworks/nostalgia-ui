# @nostalgiaui/mcp

An MCP server that gives AI coding agents NostalgiaUI's eras, palettes,
component source and contrast checks, so an agent asked for a settings page in
Frutiger Aero with the Nord palette can get the real tokens rather than guess.

Tools: `list_eras`, `list_palettes`, `get_tokens`, `get_component`,
`import_vscode_theme`, `check_contrast`.

## Claude Code

```bash
claude mcp add --transport stdio nostalgiaui -- npx -y @nostalgiaui/mcp
```

## Claude Desktop

In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nostalgiaui": {
      "command": "npx",
      "args": ["-y", "@nostalgiaui/mcp"]
    }
  }
}
```

`get_component` returns more than source: the import line, the era-specific
CSS, a props table for each part extracted from the TypeScript types, and the
component's structured doc. The doc covers anatomy, patterns, do and don't
pairs, accessibility, extensibility, notes for the requested era, and notes
naming what is easy to get wrong. Pass `section`, for example
`accessibility`, to receive only that part. The rules every component shares,
such as rendering inside `NostalgiaRoot`, are sent once as the server's
instructions rather than repeated in each answer.

Full documentation at [nostalgiaui.sylvester.works](https://nostalgiaui.sylvester.works).
MIT, copyright Josh Sylvester and Sylvester Works LLC.

## MCP Registry

Listed as `io.github.sylvesterworks/nostalgiaui`. The listing is
`server.json` in this package and is published by the release workflow after
each npm publish, authenticated through GitHub OIDC; nothing is done by hand.
