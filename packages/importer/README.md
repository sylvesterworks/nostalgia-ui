# @nostalgiaui/importer

Turn a VS Code colour theme into a NostalgiaUI palette, and say how sure it is.

```bash
npx @nostalgiaui/importer ./my-theme.json
```

A theme and a palette do not describe the same thing, so the importer reports
the provenance of every value it produces:

```
   background  #0f1b24    exact      colors[editor.background]
 ~ keyword     #7fd4ff    inherited  tokenColors scope keyword.operator.logical
 ? string      #9eda9f    derived    keyword colour rotated to 145 degrees
```

`exact` came straight from the theme, `inherited` matched a related scope,
`derived` was computed from another value in the same theme, and `fallback`
means nothing in the theme could inform it.

- `--strict` exits non-zero if anything was guessed, so CI can gate an import.
- `--out <dir>` scaffolds a palette module and a `SOURCE.md` stub with the
  licence line left blank, because recording a theme's licence is a judgement a
  person has to make.

Also usable as a library: `importVsCodeTheme(json)` returns the primitives and
the report.

Full documentation at [nostalgiaui.sylvester.works](https://nostalgiaui.sylvester.works).
MIT, copyright Josh Sylvester and Sylvester Works LLC.
