# Walking Skeleton — Container Platform

**Phase:** 1
**Generated:** 2026-07-09

## Capability Proven End-to-End

An operator opens the "Container Platform" app from the desktop grid; it renders in its own
draggable desktop window on `/container-platform/overview` and its persistent left sidebar
navigates four placeholder sections (Overview / Clusters / Nodes / Workloads) — all rendered
with TDS (`@/design-system`) chrome, running via `pnpm dev` on port 5180 with no console errors.

## Architectural Decisions

| Decision         | Choice                                                                                                  | Rationale                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host / shell     | Existing macOS-style DesktopPage window manager (planning/taeksoo mockup)                               | The desktop shell, window manager, and per-app IsolatedRouter already exist; the Container Platform app plugs in as one more registered app rather than a new host.                       |
| App registration | `AppId: 'container-platform'` wired at 5 DesktopPage points + a route import                            | Matches the established per-app registration convention (see the `container`/`iam` cases).                                                                                                |
| Routing          | Per-app `MemoryRouter` (IsolatedRouter) + a lazy `containerPlatformRoutes` fragment                     | Each desktop app owns an isolated router; `initialPath` `/container-platform/overview` is the window entry point. No provider wrappers (unlike the container case) — this app needs none. |
| Data layer       | NONE in Phase 1 — inline typed TS mocks arrive in Phase 2                                               | Mock-first product; the skeleton proves navigation, not data. No backend, DB, network, or MSW.                                                                                            |
| Auth             | Inherited from the platform shell; not built here                                                       | Out of scope per REQUIREMENTS.md.                                                                                                                                                         |
| UI system        | TDS only — `@/design-system` (PageShell, PageHeader, TopBar, Breadcrumb, VStack, MenuSection/MenuItem)  | TDS-01 mandates no raw HTML layout and no `@thaki/shared` imports.                                                                                                                        |
| Directory layout | Shell pages under `src/pages/container-platform/`; routes in `src/routes/container-platform.routes.tsx` | Mirrors the existing `container` app's file organization for consistency.                                                                                                                 |
| Run / deploy     | `pnpm dev` (rspack) on port 5180 → `/desktop`                                                           | No deployment target; local full-stack (frontend-only) dev run is the environment.                                                                                                        |

## Stack Touched in Phase 1

- [x] Project scaffold — reuses the existing rspack/React/TDS mockup (no new scaffold)
- [x] Routing — 4 real routes under `/container-platform/*` via `containerPlatformRoutes`
- [ ] Database — intentionally NONE (mock data lands in Phase 2)
- [x] UI — interactive sidebar navigation wired to the router (4 sections, active highlighting)
- [x] Deployment — documented local run: `pnpm dev` → http://localhost:5180/desktop

## Out of Scope (Deferred to Later Slices)

- Cross-cluster typed mock estate (clusters/nodes/workloads) — Phase 2
- Overview dashboard tiles / health rollup / at-risk signal — Phase 3
- Clusters list (search, pagination, columns) + cluster detail — Phases 4-5
- Nodes list with status theming and capacity — Phase 6
- Workloads list + kind/cluster filtering — Phases 7-8
- A dedicated Container Platform app icon asset (reusing `container.webp` for now) — later polish
- Any create/edit/delete/scale mutation, real Kubernetes API, auth/RBAC depth

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering the
registration/routing/shell architecture above:

- Phase 2: A single typed inline mock estate module every screen reads from
- Phase 3: Overview dashboard rolls up estate health from the mock estate
- Phase 4: Searchable, paginated cross-cluster Clusters list (TDS ListToolbar/Table)
- Phase 5: Cluster detail drill-down (node/workload summary)
- Phase 6: Cross-cluster Nodes list with status theming and capacity
- Phase 7: Cross-cluster Workloads list
- Phase 8: Workloads filtering by kind and cluster
