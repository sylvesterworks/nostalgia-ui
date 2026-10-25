# 0003: Era and palette switch by attribute, not by a theme object

Date: 2026-10-25

Status: accepted

## Context

A React design system would normally carry a theme in a context object and
pass values to components as props or styled-component interpolations.

## Decision

Tokens are CSS custom properties scoped to attribute selectors.
`[data-palette="nord"]` sets colour variables only. `[data-era="classic-windows"]`
sets shape variables only. Switching means changing two attributes on one
wrapper element.

Components carry class names and never receive colour or shape as props.

## Consequences

The independence rule is enforced by where values live rather than by
discipline. A palette file physically cannot contain a border radius, because
it is generated from the semantic colours and nothing else. An era file
physically cannot contain a colour, because `EraShape` has no field that could
hold one.

Switching costs no re-render. The timeline slider planned for milestone 4 can
animate an attribute rather than re-rendering a tree on every step.

Tokens are serialisable text, which is what makes the milestone 3 MCP tool
`get_tokens(era, palette, format)` a file read rather than a runtime
evaluation.

The cost is that consumers who want to read a token value in JavaScript have
to go through `getComputedStyle`, which is less convenient than reading a
theme object.

## The portal problem, found by running it

Base UI portals Dialog, Popover, Menu and Tooltip into `document.body` by
default. Because the tokens are scoped to a wrapper, anything portalled to the
body escapes them: the dialog first rendered with no surface, no border and no
title bar, since neither the variables nor the `[data-era]` selectors reached
it.

Putting the attributes on `<html>` would fix it, but would make the whole
document a single era and rule out showing two eras side by side, which the
milestone 4 timeline demo needs.

So `NostalgiaRoot` holds the attributes and publishes its own element through
context, and `DialogPortal` defaults its `container` to that element. An
explicit `container` prop still wins.

Every future portalling component must do the same. That is a real tax this
decision imposes, and it is the reason this section exists rather than being
left as a fixed bug.
