# 0006: Releases are driven by changesets, and publishing is a separate act

Date: 2026-10-25

Status: accepted

## Context

The brief weights release notes as highly as the code: this is a public
project whose history is meant to be read. Four packages ship from one repo
with internal dependencies between them, so a release has to bump versions
consistently, rewrite dependency ranges, and produce a changelog a reader can
follow, every time.

## Decisions

### Changesets, with the default changelog formatter

Each change that should appear in a release note gets a small markdown file
naming the packages it touches and the bump. The release workflow turns
pending changesets into a "Version Packages" pull request; merging it applies
the bumps and changelogs. Nothing is versioned by hand.

The GitHub changelog formatter was tried first and rejected. It links each
entry to its pull request, which sounds worth having, but it needs a GitHub
token merely to version, and it failed the first release run for that reason.
Commits on this project land directly on main, so there are no pull request
numbers to link anyway. The default formatter needs nothing and loses nothing
here. A changeset summary therefore has to carry its own context: it is the
whole entry a reader sees.

### Independent versions

The four packages are not held to one version. `@nostalgiaui/tokens` will
change far more often than `@nostalgiaui/mcp`, and a fixed version would force
empty releases of the latter to track the former. Internal dependency ranges
are updated on patch bumps so a consumer installing one package gets the
matching others.

### Publishing is gated on a secret, and the workflow degrades rather than fails

Publishing to npm needs a token that only the repository owner can add. Until
it exists the release workflow still opens the version pull request, so
changelogs and bumps accrue, and simply does not publish. That keeps the
release history honest from the first commit rather than from the first time
someone had a token to hand.

### A dry run in CI

Every CI run packs each public package exactly as a publish would and
validates the result, without uploading. A broken `files` list, a
`workspace:` range that failed to resolve, or a missing bin fails on an
ordinary push rather than on release day.

### What ships

Each package ships `dist`, its README, and a copy of the MIT licence, because
npm only includes a licence file that sits in the package folder. The tokens
package also ships `palettes/**/SOURCE.md`, since a palette's provenance is
part of what a consumer is licensing.

### The MCP registry listing is data in the repo, published after npm

`packages/mcp/server.json` is the registry listing. It is committed rather than
generated on the publisher's machine, so it is reviewed like any other change.
Its `name` is `io.github.sylvesterworks/nostalgiaui`, which is the namespace
GitHub authentication grants to the sylvesterworks account, and `package.json`
carries the same value under `mcpName` so the registry can verify ownership
against the npm package.

The registry refuses a listing whose version does not exist on npm, so the
listing can only be published after the package is. `version-packages` keeps
`server.json` in step with `package.json`, and a test fails CI if they drift.

## Consequences

The npm organisation `@nostalgiaui` has to be created by the owner before the
first publish; the scope is free as of this note. The first release is
0.1.0 for every package.

The licence copies in each package are duplicates of the root file. A change
to the licence has to touch five files, which is a cost accepted for the
sake of shipping it correctly.
