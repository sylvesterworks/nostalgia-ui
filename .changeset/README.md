# Changesets

Every change that should appear in a release note gets a changeset: a small
markdown file here naming the packages it touches and the bump (major, minor
or patch). Run `pnpm changeset` to write one; it asks the questions.

`pnpm version-packages` applies all pending changesets: bumps versions,
rewrites changelogs, and removes the changeset files. `pnpm release` builds
and publishes whatever is newer than the registry. Both are normally run by
the release workflow rather than by hand.

Release notes are a deliverable of this project, not a by-product, so write
the changeset summary for a reader who was not there.
