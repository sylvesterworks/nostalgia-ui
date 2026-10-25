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

### Publishing uses npm Trusted Publishing, so no token exists

The first design gated publishing on an `NPM_TOKEN` secret. npm's own guidance
when generating such a token says to use Trusted Publishing for CI instead,
and it is right: a long-lived token is a thing to leak and rotate, and this
project had already spent an hour cleaning a leaked credential out of a
transcript once.

Trusted Publishing binds each package on npm to this repository and this
workflow file. The workflow exchanges a GitHub OIDC token for publish rights at
run time, which is why it holds `id-token: write`, and provenance attestations
are generated automatically. There is no secret anywhere.

The one cost is sequencing. Trusted Publishing is configured on a package's
settings page, so the package has to exist first. 0.1.0 was therefore
published once by hand from a logged-in machine, after which each package's
trusted publisher was configured and every later release publishes from CI.
The first CI publish validates the configuration; npm expires an unvalidated
configuration after two days.

pnpm's publish command attaches provenance on its own under trusted
publishing, and `changeset publish` delegates to it when pnpm is detected, so
the release script did not change.

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
