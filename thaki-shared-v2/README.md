# @ThakiCloud/shared

Standalone design-system and shared-utilities package for THAKI Cloud apps.

## Install

This package is published to GitHub Packages as `@ThakiCloud/shared` and is
typically consumed through the alias `@thaki/shared`.

```bash
pnpm add @thaki/shared@npm:@ThakiCloud/shared
```

Consumer environments that install from GitHub Packages need npm auth for
`https://npm.pkg.github.com`. Release automation injects publish auth at runtime;
do not commit auth tokens to this repository.

## Style Entry Points

```tsx
import '@thaki/shared/index.css';
import '@thaki/shared/core.css';
import '@thaki/shared/tokens-only.css';
```

- `index.css`: full styles
- `core.css`: core styles only
- `tokens-only.css`: token variables only

## Public Entry Points

```tsx
import { Button, Overlay, Typography } from '@thaki/shared';
import { ChartToggle, ChartTooltip, chartTooltipHtml } from '@thaki/shared/charts';
```

## Release Flow

- Pull requests run `pnpm lint`, `pnpm build`, and commitlint.
- Pushes to `main` can publish through `semantic-release`.
- Storybook deploys from the checked-in GitHub Actions workflow.

For package-facing changes, run `pnpm build` and `pnpm verify:package` before
release.
