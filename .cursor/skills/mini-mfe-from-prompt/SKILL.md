---
name: mini-mfe-from-prompt
description: Create a simplified thaki-ui remote MFE from non-developer prompts, including sidebar and toolbar structure compatible with Platform desktop frame loading. Use when users ask to scaffold or standardize small prompt-driven apps with package, port, manifest, and host registration.
---

# mini-mfe-from-prompt

## Use when

- A user wants to make a new small MFE app from natural-language requirements.
- The app must run in Platform Desktop frame (`AppList` -> window -> remote mount).
- The app should follow existing app shell patterns (sidebar, toolbar/header, tab/app frame compatibility).
- The user is non-developer friendly and wants a structured, guided flow.

## Do not use when

- The task only edits an existing screen in a current package (use `thaki-ui-mfe-edit`).
- The task is API-contract heavy (use `api-contract-diff`).
- The task is backend implementation or infra-only deployment.

## Required inputs (must collect first)

1. `appIdSuffix` (example: `billing`)
2. `displayName` (example: `Billing`)
3. `port` (unique dev port)
4. `sidebarItems` (3-7 items)
5. `mainViews` (at least list/detail or dashboard/settings)
6. `needsAdminApp` (`yes` or `no`)

If any required input is missing, ask follow-up questions before code generation.

## Output contract

Return all of the following:

1. Scaffolding summary (`packages/<app>` and created files)
2. Port and run commands
3. Platform registration points edited
4. Manifest/remoteEntry mapping added
5. Verification results (`pass|fail|skip + reason`)
6. Remaining `[unknown]` items

## Build pattern (thaki-ui standard)

### 0) Mandatory reference baseline (IAM-first)

Use `packages/iam` as the primary structural reference for app shell composition.

- Reference files:
  - `packages/iam/src/App.tsx`
  - `packages/iam/src/ui/layouts/IamLayout.tsx`
  - `packages/iam/src/ui/widgets/IamSidebar.tsx`
  - `packages/iam/src/ui/widgets/IamAppHeaderTab.tsx`
  - `packages/iam/src/routes/registry.ts`
  - `packages/iam/src/routes/loaders.ts`
- Requirement:
  - Sidebar + toolbar/header composition must follow the same structural pattern as IAM.
  - Toolbar/header actions must follow existing unified app-shell behavior used by IAM/Compute.
  - Do not request or introduce per-app custom toolbar action sets by default.
  - Prefer matching IAM directory layering (`ui/layouts`, `ui/widgets`, `routes`) and wiring order.
  - Do not invent a different shell architecture unless user explicitly asks for divergence.

### 1) Package scaffold

Create `packages/<app>/` with:

- `package.json`
- `tsconfig.json`
- `rspack.config.mjs`
- `index.html`
- `postcss.config.cjs`
- `tailwind.config.js`
- `src/App.tsx`
- `src/RemoteApp.tsx`
- `src/main.tsx`
- `src/ui/layouts/<AppName>Layout.tsx`
- `src/ui/widgets/<AppName>Sidebar.tsx`
- `src/ui/widgets/<AppName>AppHeaderTab.tsx`
- `src/routes/registry.ts`
- `src/routes/loaders.ts`

### 2) Layout requirements (sidebar + toolbar)

In `App.tsx` and layout:

- Import `@thaki/shared/core.css` and app-local styles.
- Wrap app tree with `QueryClientProvider` (create package-local `QueryClient`).
- Keep app root with `data-portal-root`.
- Use `AppLayout` from `@thaki/shared`.
- Mirror IAM composition style: `AppLayout config` + `SidebarComponent` + `AppHeaderTab` + tab manager hook wiring.
- Keep top toolbar/header behavior aligned with IAM/Compute shared conventions (uniform structure).
- Do not add app-specific toolbar actions unless explicitly requested by user.
- Provide both:
  - `SidebarComponent` (left navigation)
  - `AppHeaderTab` (top toolbar area in content header)
- Use `useFrame()` values (`frameId`, `dragHandleClassName`) to stay compatible with desktop window frame behavior.

### 3) Remote exposure requirements

In `rspack.config.mjs`:

- `role: 'remote'`
- `uniqueName: 'suite_<app>'`
- `port: <input port>`
- `mf.exposes` includes `./App: './src/RemoteApp.tsx'`
- Optional `./AdminApp` only if `needsAdminApp=yes`

In `RemoteApp.tsx`:

- Export `mount` and `unmount`.
- Mount React root into provided host element.

### 4) Platform desktop registration

Update host integration points:

- `packages/platform/src/features/desktop/services/stores/appStore.ts`
  - add app seed (`id: suite_<app>`, `entryPoint: './App'`)
- `packages/platform/src/features/desktop/services/utils/moduleFederationManifest.ts`
  - map `suite_<app>` to manifest remote key candidates
- `packages/platform/public/mf-manifest.json` (dev mapping)
  - add remote entry `http://localhost:<port>/remoteEntry.js`
- optional icon mapping in desktop consts if needed
- root `package.json` scripts
  - `<app>` and `build:<app>`

### 5) Route/content initialization

- Add minimal views from `mainViews` input.
- Sidebar item click should route to matching view.
- Empty values render `'-'`.
- Text keys must follow i18n policy (except proper nouns).

## Verification checklist

Run in order:

1. `pnpm i --no-frozen-lockfile` (if new package/deps were added)
2. `pnpm lint:rules`
3. `pnpm --filter @thaki/<app> build`
4. `pnpm <app>` and `pnpm platform` (restart `platform` if already running)
5. Confirm desktop app icon appears in `AppList` and launching opens frame with loaded remote.
6. If icon does not appear, verify all of:
   - `suite_<app>` exists in `REMOTE_APP_SEEDS` (`appStore.ts`)
   - `suite_<app>` mapping exists in `APP_MANIFEST_REMOTE_KEY_CANDIDATES`
   - `<app>` remote exists in `packages/platform/public/mf-manifest.json`
   - app id ordering/icon mapping in desktop consts (`DESKTOP_APP_ORDER`, icon map)
7. If runtime errors occur, check and fix first:
   - `No QueryClient set` -> missing `QueryClientProvider`
   - `No PostCSS config found` -> missing `postcss.config.cjs` / `tailwind.config.js`
   - `EADDRINUSE` -> port already occupied, kill existing process then restart

Report each command as:

- `pass`: success
- `fail`: with first actionable error
- `skip`: with reason

## Prompt template for non-developers

Use this fill-in form:

```text
미니 앱 하나 만들어줘.
- 앱 이름: <Billing>
- 기술 이름(id): <billing>
- 포트: <20022>
- 사이드바 메뉴: <대시보드, 고객, 청구서, 설정>
- 화면: <목록 1개, 상세 1개>
- 관리자 전용 앱 필요: <아니오>
```

## Guardrails

- Do not modify unrelated packages.
- Do not invent backend endpoints; mark unknown server details as `[unknown]`.
- Keep changes minimal and predictable; no broad refactors.
