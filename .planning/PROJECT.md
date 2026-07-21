# Container Platform

## What This Is

Container Platform is Thaki Cloud's unified surface for managing container and cluster
resources. Today that management is fragmented across four products — Aegis Container,
Metis Container, Metis Run, and Metis ML Studio — each of which puts a different lens on
the same underlying Kubernetes resources (clusters, nodes, namespaces, workloads). Container
Platform consolidates them into one management plane, following the archetypes proven by
Rancher (multi-cluster management plane) and OpenShift (opinionated platform where every
workload — including AI/ML — is a first-class citizen).

This milestone delivers the **MVP: a unified, read-only observability view** — a single
desktop app that lets an operator browse clusters, nodes, and workloads across the
fragmented surfaces from one place, before any deploy/mutate capability is added.

## Core Value

**One place to see every cluster, node, and workload.** If everything else fails, the
operator must be able to open one app and observe the whole container estate that is today
scattered across four products.

## Requirements

### Validated

<!-- Platform infrastructure that already exists and this project builds on. -->

- ✓ Desktop shell with draggable windows and app registry — existing (`src/pages/DesktopPage.tsx`)
- ✓ TDS design system (`@/design-system`: `Table`, `PageShell`, `ListToolbar`, `Pagination`, `TopBar`, `Breadcrumb`) — existing
- ✓ Container/cluster/node/workload mockup screens as reusable patterns — existing (`ContainerNodesPage.tsx`, `container.routes.tsx`, `ContainerSidebar.tsx`)

### Active

<!-- MVP scope. Hypotheses until shipped. -->

- [ ] A "Container Platform" app is registered on the desktop and opens in its own window
- [ ] A unified overview dashboard summarizes cluster / node / workload health across sources
- [ ] Operator can browse a cross-cluster **clusters** list and open a cluster's detail
- [ ] Operator can browse a cross-cluster **nodes** list with status/capacity
- [ ] Operator can browse a cross-cluster **workloads** list (deployments/statefulsets/pods etc.)
- [ ] All screens are TDS-compliant and populated from inline mock data (no backend)

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- App Catalog — a separate product/project, not part of Container Platform's mandate
- Any create / edit / delete / deploy / scale action on workloads or clusters — MVP is read-only observability; mutation is a later milestone
- Real Kubernetes / backend API integration — MVP is mock-first to validate UX and IA
- Auth, RBAC, and multi-tenancy depth — inherited from platform shell; not built here
- Metis Run / ML Studio AI-workload specialization — folded in as workload types in a later milestone, not MVP

## Context

- **Product re-org driver**: leadership wants to collapse fragmented container/cluster
  management (Aegis Container, Metis Container, Metis Run, Metis ML Studio) into one
  "Container Platform". This MVP is the first proof of the unified management plane.
- **Reference archetypes**: Rancher (lightweight multi-cluster management plane, "manage any
  cluster") and OpenShift (opinionated PaaS, "everything is a workload"). MVP leans Rancher —
  a read-only management/observability plane over the estate.
- **Build target**: `planning/taeksoo` (git `tekskim/taeksoo`) — the canonical ThakiCloud
  mockup repo, which is ALSO the TDS source package `@thaki/tds`. Dev server on port 5180.
- **Codebase map (verified)**: register a desktop app in 5 places in `DesktopPage.tsx`
  (AppId union, AppRoutes switch — model the container case, appConfigs, DESKTOP_ICONS_META,
  icon import). New code lives in `src/pages/container-platform/` + `src/routes/container-platform.routes.tsx`.
  Reuse `ContainerNodesPage.tsx` list structure and `containerStatusUtils.ts` for status theming.
- **Mock convention**: this repo does NOT use MSW. Mock data is inline typed TS modules
  (`<feature>MockData.ts` + `<feature>Types.ts`) colocated with pages.

## Constraints

- **Design system**: MUST comply with TDS. Import from `@/design-system` barrel only (NOT
  `@thaki/shared`). Table is the generic `Table<Row>` (NOT `TcTable`). Layout pattern is
  `PageShell → VStack → PageHeader → ListToolbar → Pagination → Table`. Column widths use
  `fixedColumns`/`columnMinWidths` presets — hardcoded widths are forbidden. Mono font = Mona Sans.
- **Delivery form**: rendered as a desktop app inside the macOS-style desktop shell
  (`DesktopPage.tsx`), navigation in-memory via MemoryRouter.
- **Data**: mock-first, no backend. Inline typed TS mock modules.
- **Scope discipline**: read-only observability only. Any mutation or App Catalog work is
  out of scope for this milestone.

## Key Decisions

| Decision                                                   | Rationale                                                                | Outcome   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | --------- |
| MVP = unified read-only observability view (Rancher-style) | Lowest risk, fastest proof of the "one place" value; mutation can follow | — Pending |
| Exclude App Catalog from Container Platform                | Stakeholder: it's a separate product concern                             | — Pending |
| Build in `planning/taeksoo` mockup, not a new thaki-ui MFE | Zero code risk, canonical mockup line, validate UX before productizing   | — Pending |
| Mock-first with inline typed TS (not MSW)                  | Repo convention; no backend dependency for MVP                           | — Pending |
| TDS-compliant desktop app                                  | Non-negotiable design constraint from stakeholder                        | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-07-09 after initialization_
