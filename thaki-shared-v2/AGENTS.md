# @ThakiCloud/shared

Standalone design-system and shared-utilities repository. This repo is published as `@ThakiCloud/shared` and is typically consumed by apps through the alias `@thaki/shared`.

## Scope

- Work inside this repo as a standalone package, not as an app package inside `thaki-ui`.
- Treat downstream apps such as `thaki-ui` as consumers. If a task requires consumer changes, call that out as separate follow-up work.
- Use repo-relative paths only in notes, prompts, and docs.

## Source Of Truth

- Public package surface is defined by `package.json` `exports` and the barrel entrypoints they expose, especially `src/index.ts`, `src/components/index.tsx`, `src/services/index.ts`, `src/features/index.ts`, `src/types/index.ts`, and `src/styles/common/index.ts`.
- Do not introduce undocumented deep-import guidance.
- Style entrypoints are distinct:
  - `@thaki/shared/index.css`: full styles
  - `@thaki/shared/core.css`: core styles only
  - `@thaki/shared/tokens-only.css`: token variables only

## Durable Repo Rules

- Keep package naming correct. Do not use `@thakicloud/shared`.
- Preserve React + TypeScript component patterns and explicit public props.
- Prefer `*.styles.ts`, `class-variance-authority`, and `cn()` over ad-hoc styling.
- Prefer existing tokens before adding raw hex colors or arbitrary spacing values.
- Treat `tokens/*.json`, `src/styles/tokens/tokens-*.css`, and `tailwind.preset.js` as a generation pipeline. Edit token sources and generator scripts, not generated outputs, unless the task is specifically about generated artifacts.
- Preserve documented provider contracts:
  - `ToastProvider` requires `Toaster`
  - `LocaleProvider` requires `changeLocale`
  - `OverlayProvider` requires `overlayStore`
  - tab providers are created through `createTabProvider(...)`
- Use `toast` from `sonner`, not from this package.

## Validation And Release

- Prefer `pnpm lint`, `pnpm build`, `pnpm verify:package`, and `pnpm build-storybook` for verification.
- Use checked-in workflows as the CI and release truth:
  - pull requests run lint + build + commitlint
  - pushes to `main` can trigger semantic-release
  - Storybook deploy is gated by source changes under `src/**`, `tokens/**`, `.storybook/**`, or `package.json`
- There is no repo-level `test` script in `package.json`; automated test expectations beyond lint/build/storybook are `[unknown]`.

## Skill Routing

- Use `thaki-shared-design-system-change` for direct edits to components, tokens, styles, providers, shared utilities, and Storybook-facing behavior.
- Use `shared-public-api-review` for export changes, public prop changes, CSS entrypoint changes, and release-facing compatibility review.
