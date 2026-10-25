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

`get_component` returns more than source: the import lines, the era-specific
CSS, and notes naming what is easy to get wrong, such as rendering outside
`NostalgiaRoot`. Those notes correspond to bugs that were actually hit while
building the library.

Full documentation at [nostalgiaui.sylvester.works](https://nostalgiaui.sylvester.works).
MIT, copyright Josh Sylvester and Sylvester Works LLC.
