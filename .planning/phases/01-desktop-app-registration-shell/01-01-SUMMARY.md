---
phase: 01-desktop-app-registration-shell
plan: 01
subsystem: ui
tags: [react, react-router, module-federation-desktop, tds, walking-skeleton]

# Dependency graph
requires: []
provides:
  - container-platform desktop app registered in the desktop shell (icon + window opener)
  - containerPlatformRoutes lazy route fragment (Overview / Clusters / Nodes / Workloads)
  - ContainerPlatformSidebar (persistent 4-item nav with active-route highlighting)
  - 4 TDS PageShell placeholder pages on /container-platform/*
affects: [phase-02, phase-03, phase-04, phase-05, phase-06, phase-07, phase-08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Dedicated per-app route fragment (container-platform.routes.tsx) wired into the DesktopPage AppRoutes switch'
    - 'Standalone sidebar (no ContainerMode context) exporting its own fixed width constant for PageShell'

key-files:
  created:
    - src/routes/container-platform.routes.tsx
    - src/pages/container-platform/ContainerPlatformSidebar.tsx
    - src/pages/container-platform/OverviewPage.tsx
    - src/pages/container-platform/ClustersPage.tsx
    - src/pages/container-platform/NodesPage.tsx
    - src/pages/container-platform/WorkloadsPage.tsx
  modified:
    - src/pages/DesktopPage.tsx

key-decisions:
  - 'Kept the AppRoutes case minimal (no ContainerMode/AppCatalog providers) — modeled on the iam case, not the container case'
  - 'Reused the existing imgContainer (container.webp) binding for both the desktop icon and appConfigs; no new asset authored'
  - 'Sidebar exports CONTAINER_PLATFORM_SIDEBAR_WIDTH (200) so each page passes a correct sidebarWidth to PageShell'

patterns-established:
  - 'New desktop app = 1 route fragment + 1 sidebar + N pages + 5-place DesktopPage registration'
  - 'Placeholder body text rendered as a token-styled <span> inside VStack (no Typography export in TDS)'

requirements-completed: [PLAT-01, PLAT-02, PLAT-03, TDS-01]

# Metrics
duration: 20min
completed: 2026-07-09
---

# Phase 1 Plan 01: Desktop App Registration & Shell Summary

**A new "Container Platform" desktop app boots inside the macOS-style shell, opens on /container-platform/overview, and navigates an empty 4-section TDS sidebar (Overview / Clusters / Nodes / Workloads) — all chrome via @/design-system.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 2 of 2 completed
- **Files created:** 6
- **Files modified:** 1

## Accomplishments

- Built the Container Platform Walking Skeleton: a lazy route fragment, a persistent 4-item sidebar with active-route highlighting, and 4 TDS `PageShell` placeholder pages.
- Registered the app in `DesktopPage.tsx` across all 5 points (AppId union, AppRoutes case, appConfigs, DESKTOP_ICONS_META) plus the route import — reusing the existing `imgContainer` icon.
- Kept the app free of ContainerMode/AppCatalog coupling so it stands alone as a clean product surface for Phases 2-8.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the Container Platform shell (routes + sidebar + 4 placeholder pages)** - `6f24a43b0` (feat)
2. **Task 2: Register container-platform in DesktopPage (5 places + route import)** - `3c19b0196` (feat)

## Files Created/Modified

- `src/routes/container-platform.routes.tsx` - Lazy `<Route>` fragment `containerPlatformRoutes`: 4 section routes + `/container-platform/*` catch-all redirecting to overview.
- `src/pages/container-platform/ContainerPlatformSidebar.tsx` - Persistent 200px sidebar (MenuSection + 4 MenuItems), `isActive()` via `useLocation`, exports `CONTAINER_PLATFORM_SIDEBAR_WIDTH`.
- `src/pages/container-platform/OverviewPage.tsx` - Overview placeholder (PageShell + TopBar/Breadcrumb + PageHeader + placeholder span).
- `src/pages/container-platform/ClustersPage.tsx` - Clusters placeholder page.
- `src/pages/container-platform/NodesPage.tsx` - Nodes placeholder page.
- `src/pages/container-platform/WorkloadsPage.tsx` - Workloads placeholder page.
- `src/pages/DesktopPage.tsx` - 5-place registration + route import wiring the app into the desktop grid, window opener, and router.

## Decisions Made

- **Minimal AppRoutes case:** modeled on `case 'iam': return <Routes>{iamRoutes}</Routes>;` rather than the `container` case, since this app needs no ContainerMode/AppCatalog providers.
- **Icon reuse:** `imgContainer` (container.webp) reused for both the desktop grid icon and appConfigs; a dedicated icon is deferred (per CONTEXT LOCKED decision).
- **Sidebar width constant:** exported `CONTAINER_PLATFORM_SIDEBAR_WIDTH` so pages pass a correct `sidebarWidth` to `PageShell` (a required prop).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Both task grep gates, `eslint`, and `tsc --noEmit` (filtered for the new/modified files) passed clean. lint-staged (eslint --fix + prettier) ran on each commit without changes beyond formatting.

## User Setup Required

None.

## TDS Compliance

- All new files import ONLY from `@/design-system` (`PageShell`, `PageHeader`, `TopBar`, `Breadcrumb`, `VStack`, `MenuItem`, `MenuSection`). No `@thaki/shared` imports (verified via grep).
- No raw `<table>`/`<input>`/`<select>`. Placeholder body text is a token-styled `<span>` inside `VStack` (TDS has no `Typography` export).

## Known Stubs

The 4 pages render an intentional "Coming in a later phase" placeholder body. This is the Walking Skeleton by design — real data/list UI lands in Phases 2-8. Not a blocking stub for this plan's goal (prove registration + windowed navigation).

## Self-Check: PASSED

- FOUND: src/routes/container-platform.routes.tsx
- FOUND: src/pages/container-platform/ContainerPlatformSidebar.tsx
- FOUND: src/pages/container-platform/OverviewPage.tsx
- FOUND: src/pages/container-platform/ClustersPage.tsx
- FOUND: src/pages/container-platform/NodesPage.tsx
- FOUND: src/pages/container-platform/WorkloadsPage.tsx
- FOUND commit: 6f24a43b0 (Task 1)
- FOUND commit: 3c19b0196 (Task 2)
