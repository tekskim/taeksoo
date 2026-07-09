# Phase 1: Desktop App Registration & Shell - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Source:** Orchestrator-authored (codebase map verified; discuss-phase skipped — mechanical scaffolding phase)

<domain>
## Phase Boundary

Deliver the **Walking Skeleton**: a "Container Platform" app that boots inside the existing
macOS-style desktop shell and lets the operator navigate an empty 4-section shell
(Overview / Clusters / Nodes / Workloads). This proves the app registers, opens in a window,
and routes between sections. NO real data, NO dashboard tiles, NO list columns — those are
Phases 2-8. Each section renders a TDS `PageShell` with a `PageHeader` and a lightweight
placeholder (e.g. an empty-state line "Coming in a later phase").

Requirements covered: PLAT-01 (desktop icon), PLAT-02 (opens in own window),
PLAT-03 (persistent sidebar navigates 4 sections), TDS-01 (only `@/design-system` components).
</domain>

<decisions>
## Implementation Decisions (LOCKED)

### App identity

- `AppId` literal: `'container-platform'`
- Display name: `Container Platform`
- Desktop icon: **reuse the existing `container.webp` asset** already imported in
  `DesktopPage.tsx` (do NOT author a new image asset in this phase — a dedicated icon is
  deferred). If a distinct icon is trivially available under `src/assets/appIcon/`, it may be
  used, but reusing `container.webp` is the accepted default.
- `initialPath` (MemoryRouter virtual entry): `/container-platform/overview`

### Desktop registration — edit `src/pages/DesktopPage.tsx` in these 5 places

1. `AppId` union type (~line 1149-1172): add `'container-platform'`.
2. `AppRoutes` switch (~line 1230-1388): add `case 'container-platform':` returning
   `<Routes>{containerPlatformRoutes}</Routes>`. Model the existing container case
   (~1261-1274) but this app needs NO ContainerMode/AppCatalogMode providers — keep it minimal.
3. `appConfigs` record (~line 2252-2292): add
   `'container-platform': { name: 'Container Platform', icon: imgContainer, initialPath: '/container-platform/overview' }`.
4. `DESKTOP_ICONS_META` (~line 151-171): add
   `{ id: 'container-platform', icon: imgContainer, label: 'Container Platform' }`.
5. Icon import (~line 95-117): reuse the already-imported `container.webp` binding
   (e.g. `imgContainer`); do not add a new import if one already exists for that asset.

### Routing — new file `src/routes/container-platform.routes.tsx`

- Copy the structure of `src/routes/container.routes.tsx` (lazy-loaded `<Route>` fragment).
- Routes: `/container-platform/overview`, `/container-platform/clusters`,
  `/container-platform/nodes`, `/container-platform/workloads`.
- Export a JSX fragment (e.g. `containerPlatformRoutes`) imported by the DesktopPage switch.

### Shell + placeholder pages — new dir `src/pages/container-platform/`

- New sidebar component `ContainerPlatformSidebar.tsx`: copy `src/components/ContainerSidebar.tsx`
  nav structure but with exactly 4 items (Overview, Clusters, Nodes, Workloads) linking to the
  routes above; highlight the active route.
- 4 placeholder page components: `OverviewPage.tsx`, `ClustersPage.tsx`, `NodesPage.tsx`,
  `WorkloadsPage.tsx`. Each renders `PageShell` with `sidebar={<ContainerPlatformSidebar/>}`,
  a `TopBar`/`Breadcrumb` as the existing container pages do, a `PageHeader title="…"`, and a
  placeholder body. Reuse the layout skeleton of `src/pages/ContainerNodesPage.tsx` (the
  canonical page structure) minus the table/data.

### TDS compliance (TDS-01)

- Import ONLY from `@/design-system` (NOT `@thaki/shared`). Use `PageShell`, `PageHeader`,
  `TopBar`, `Breadcrumb`, `VStack`. No raw HTML layout containers where a TDS primitive exists.
  </decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Desktop shell / registration

- `src/pages/DesktopPage.tsx` — the 5 registration points above (AppId ~1149, AppRoutes switch ~1230, container case ~1261-1274, appConfigs ~2252, DESKTOP_ICONS_META ~151, icon imports ~95-117)

### Routing analog

- `src/routes/container.routes.tsx` — lazy route fragment pattern to copy

### Shell / page / sidebar analogs

- `src/components/ContainerSidebar.tsx` — sidebar nav structure to copy (4 items only)
- `src/pages/ContainerNodesPage.tsx` — canonical page layout (PageShell → VStack → PageHeader …)

### Design system + conventions

- `src/design-system/index.ts` — barrel of TDS components (import source)
- `prerequisite.md` (repo root) — TDS usage rules, layout pattern, forbidden hardcoded widths
  </canonical_refs>

<specifics>
## Specific Ideas

- Keep the AppRoutes switch case minimal — no context providers needed for this app (unlike
  the container case which wraps ContainerModeContext/AppCatalogModeContext).
- Placeholder body can be a single `Typography`/text line via `@/design-system`; do not build
  empty-state art. Real content lands in later phases.
- Run/verify: `pnpm dev` (rspack, port 5180) → open `http://localhost:5180/desktop` → click the
  Container Platform icon → window opens on `/container-platform/overview` → sidebar switches
  between the 4 sections. No console errors.
  </specifics>

<deferred>
## Deferred Ideas (later phases — do NOT build here)

- Cross-cluster mock data foundation → Phase 2
- Overview dashboard tiles / health rollup → Phase 3
- Clusters list + detail → Phases 4-5
- Nodes list (status theming, capacity) → Phase 6
- Workloads list + filtering → Phases 7-8
- Dedicated Container Platform app icon asset → later polish
  </deferred>

---

_Phase: 01-desktop-app-registration-shell_
_Context gathered: 2026-07-09 (orchestrator-authored)_
