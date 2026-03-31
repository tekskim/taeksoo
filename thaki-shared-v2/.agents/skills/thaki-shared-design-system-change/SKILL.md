---
name: thaki-shared-design-system-change
description: Use when directly editing `thaki-shared` components, tokens, styles, providers, shared utilities, or Storybook-facing behavior. Focuses on repo-local design-system changes, related exports/stories, generated token artifacts, and scoped verification.
---

# thaki-shared-design-system-change

Use this skill for direct design-system work inside `thaki-shared`.

## Use When

- Editing components under `src/components`
- Editing providers, hooks, stores, or shared utilities under `src/services`
- Editing token sources under `tokens`
- Editing styling, `*.styles.ts`, or CSS entrypoints
- Updating Storybook-facing behavior or stories

## Do Not Use When

- The task is mainly about public API compatibility or release impact. Use `shared-public-api-review`.
- The task is primarily in a downstream app repo.

## First Pass

Inspect only the files needed for the target surface:

- `AGENTS.md`
- The closest barrel or entrypoint, such as `src/index.ts`, `src/components/index.tsx`, or `src/services/index.ts`
- The target source files
- Matching `*.styles.ts`
- Relevant `*.stories.tsx`
- For theme or token work: `tokens/*.json`, `src/styles/tokens/tokens-*.css`, `tailwind.preset.js`, and the generator scripts in `scripts/`

## Working Rules

- Preserve existing export patterns instead of inventing deep imports.
- Prefer tokens, CVA variants, and `cn()` over ad-hoc class composition.
- If token behavior changes, update token sources first and regenerate outputs through repo scripts.
- Preserve provider contracts documented in this repo.
- Keep downstream consumer notes explicit, but do not edit downstream repos unless requested.

## Outputs

- Changed design-system surface
- Touched local layers: implementation, styles, stories, exports, docs, generated outputs
- Consumer-facing risk
- Verification results as `pass | fail | skip + why`

## Verification

- Run `pnpm lint`
- Run `pnpm build` for any source, token, provider, utility, or export change
- Run `pnpm build-storybook` when Storybook surface or exported UI behavior is affected
