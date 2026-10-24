# Contributing

Thanks for looking. NostalgiaUI is early, and the shape of the project is still settling, so the most useful contributions right now are issues and discussion rather than large pull requests.

## Getting set up

```bash
pnpm install
pnpm check
```

`pnpm check` runs lint, typecheck, tests, and build, which is the same set CI runs.

## The one rule that matters most

Era controls shape. Palette controls color. They stay independent.

A change that makes an era depend on a specific palette, or a palette depend on a specific era, is the wrong change. If an era needs a color that the semantic tokens do not provide, derive it with OKLCH color math from the tokens that exist. Never hand pick a color per palette, and never put a raw color value in a component.

## Other expectations

- Accessibility is a constraint, not a nice to have. Keyboard behavior comes from Base UI, and contrast is tested for every era and palette pairing.
- Keep commits small and describe them properly.
- Meaningful architectural choices get a short note in `docs/decisions/`.
- Adding a palette means recording the source theme's license in `packages/tokens/palettes/<name>/SOURCE.md`, with a link to the original repo.
- Scripts stay cross platform. Development happens on Windows as well as macOS and Linux.

## Commit and PR style

Describe what changed and why. A reader should be able to follow the history without opening the diff.

## License

By contributing you agree that your contributions are licensed under the MIT license that covers this project. NostalgiaUI is copyright 2026 Josh Sylvester and Sylvester Works LLC.
