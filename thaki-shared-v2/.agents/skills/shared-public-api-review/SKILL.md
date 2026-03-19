---
name: shared-public-api-review
description: Use when reviewing or changing the public package surface of `thaki-shared`, including `package.json` exports, barrel exports, public props or types, CSS entrypoints, consumer-facing shared utilities, and release-facing compatibility.
---

# shared-public-api-review

Use this skill for release-facing or compatibility-sensitive work in `thaki-shared`.

## Use When

- Changing `package.json` exports
- Changing barrel exports such as `src/index.ts`, `src/components/index.tsx`, or `src/services/index.ts`
- Changing component or provider props that consumers rely on
- Changing CSS entrypoints or shared utility behavior used by consumers
- Reviewing release impact, snapshot impact, or Storybook/export coverage

## Do Not Use When

- The task is only an internal implementation or styling change with no meaningful public-surface impact. Use `thaki-shared-design-system-change`.

## First Pass

Inspect the public surface before drawing conclusions:

- `AGENTS.md`
- `package.json`
- `src/index.ts`
- Relevant barrel files such as `src/components/index.tsx`, `src/services/index.ts`, `src/features/index.ts`, `src/types/index.ts`, and `src/styles/common/index.ts`
- `AI_GUIDE.md` when provider or usage guidance is part of the surface
- `.releaserc.json`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `.github/workflows/snapshot.yml`
- `.github/workflows/storybook.yml`

## Working Rules

- Distinguish confirmed local export changes from inferred downstream app impact.
- Treat `package.json` `exports` and barrel files as the package contract.
- Call out semver risk explicitly when props, exports, CSS entrypoints, or utility behavior change.
- If Storybook-visible behavior changes, check story coverage and call out gaps.
- Keep any downstream `thaki-ui` impact as consumer risk, not verified fact, unless proven locally.

## Outputs

- Public API map of changed exports, props/types, CSS entrypoints, or utilities
- Semver risk: patch, minor, major, or `[unknown]`
- Storybook/docs coverage notes
- Downstream consumer risk
- Verification results as `pass | fail | skip + why`

## Verification

- Run `pnpm lint`
- Run `pnpm build`
- Run `pnpm build-storybook` when exported UI behavior or CSS entrypoints are affected
