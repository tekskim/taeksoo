# Requirements: Container Platform

**Defined:** 2026-07-09
**Core Value:** One place to see every cluster, node, and workload across the fragmented surfaces.

## User Stories

- As a **cluster operator**, I want to open one app and see every cluster, node, and workload
  across Aegis/Metis surfaces, so I stop context-switching between four products.
- As an **operator**, I want an overview dashboard that rolls up health, so I can spot trouble
  at a glance before drilling in.
- As an **operator**, I want to drill from the estate into a specific cluster, node, or
  workload, so I can inspect details without leaving the unified plane.

## v1 Requirements

Requirements for the MVP (unified read-only observability). Each maps to a roadmap phase.

### Platform Integration

- [ ] **PLAT-01**: A "Container Platform" app icon appears on the desktop grid
- [ ] **PLAT-02**: Clicking the icon opens Container Platform in its own desktop window
- [ ] **PLAT-03**: The app has a persistent left sidebar to navigate Overview / Clusters / Nodes / Workloads

### Overview Dashboard

- [ ] **OVW-01**: Dashboard shows summary tiles for total clusters, nodes, and workloads with a health rollup
- [ ] **OVW-02**: Dashboard shows a per-source breakdown (which surface each cluster comes from) so fragmentation is visible in one place
- [ ] **OVW-03**: Dashboard surfaces an at-risk signal (count of unhealthy nodes / failing workloads)

### Clusters

- [ ] **CLU-01**: Operator can view a cross-cluster list with name, source, status, node count, and version
- [ ] **CLU-02**: Clusters list supports search/filter and pagination via TDS ListToolbar/Pagination
- [ ] **CLU-03**: Operator can open a cluster detail view showing that cluster's node/workload summary

### Nodes

- [ ] **NODE-01**: Operator can view a cross-cluster nodes list with status, roles, capacity (cpu/mem), and owning cluster
- [ ] **NODE-02**: Node status uses TDS status theming (`containerStatusUtils`)
- [ ] **NODE-03**: Nodes list supports search/filter and pagination

### Workloads

- [ ] **WKL-01**: Operator can view a cross-cluster workloads list (kind, name, namespace, cluster, status, replicas)
- [ ] **WKL-02**: Operator can filter workloads by kind (Deployment/StatefulSet/DaemonSet/Job/Pod) and by cluster
- [ ] **WKL-03**: Workloads list supports search and pagination

### Design & Data Compliance

- [ ] **TDS-01**: All screens use `@/design-system` components only (PageShell/Table/ListToolbar/Pagination/TopBar/Breadcrumb) — no raw HTML tables
- [ ] **TDS-02**: Table column widths use `fixedColumns`/`columnMinWidths` presets — no hardcoded widths
- [ ] **TDS-03**: All data comes from inline typed TS mock modules — no network/MSW

## Definition of Done

- The Container Platform app opens from the desktop and renders Overview + Clusters + Nodes + Workloads.
- Every list is TDS-compliant, searchable, paginated, and populated from inline mock data.
- `pnpm dev` serves it on port 5180 with no console errors on the app's screens.
- Plan Check and Verifier pass for each phase; no hardcoded table widths; no `@thaki/shared` imports.

## v2 Requirements

Deferred to a future milestone. Tracked, not in this roadmap.

### Mutation & Lifecycle

- **MUT-01**: Operator can create/scale/delete workloads
- **MUT-02**: Operator can create/import/delete clusters

### Real Data & AI Workloads

- **DATA-01**: Replace inline mocks with real Kubernetes API integration
- **AIWL-01**: First-class AI/ML workload types (fold in Metis Run / ML Studio)

## Out of Scope

| Feature                                          | Reason                                                        |
| ------------------------------------------------ | ------------------------------------------------------------- |
| App Catalog                                      | Separate product/project, not Container Platform's mandate    |
| Create/edit/delete/deploy/scale actions          | MVP is read-only observability; mutation is a later milestone |
| Real backend / Kubernetes API                    | Mock-first to validate UX and IA cheaply                      |
| Auth / RBAC / multi-tenancy depth                | Inherited from platform shell; not built here                 |
| Metis Run / ML Studio AI-workload specialization | Folded in as workload types in a later milestone              |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase                                        | Status  |
| ----------- | -------------------------------------------- | ------- |
| PLAT-01     | Phase 1 (Desktop App Registration & Shell)   | Pending |
| PLAT-02     | Phase 1 (Desktop App Registration & Shell)   | Pending |
| PLAT-03     | Phase 1 (Desktop App Registration & Shell)   | Pending |
| TDS-01      | Phase 1 (Desktop App Registration & Shell)   | Pending |
| TDS-03      | Phase 2 (Cross-Cluster Mock Data Foundation) | Pending |
| OVW-01      | Phase 3 (Overview Dashboard)                 | Pending |
| OVW-02      | Phase 3 (Overview Dashboard)                 | Pending |
| OVW-03      | Phase 3 (Overview Dashboard)                 | Pending |
| CLU-01      | Phase 4 (Clusters List)                      | Pending |
| CLU-02      | Phase 4 (Clusters List)                      | Pending |
| TDS-02      | Phase 4 (Clusters List)                      | Pending |
| CLU-03      | Phase 5 (Cluster Detail)                     | Pending |
| NODE-01     | Phase 6 (Nodes List)                         | Pending |
| NODE-02     | Phase 6 (Nodes List)                         | Pending |
| NODE-03     | Phase 6 (Nodes List)                         | Pending |
| WKL-01      | Phase 7 (Workloads List)                     | Pending |
| WKL-03      | Phase 7 (Workloads List)                     | Pending |
| WKL-02      | Phase 8 (Workloads Filtering)                | Pending |

**Coverage:**

- v1 requirements: 18 total (source doc previously stated 17 — miscount corrected; 6 categories × 3 REQ-IDs)
- Mapped to phases: 18/18 ✓
- Unmapped: 0

---

_Requirements defined: 2026-07-09_
_Last updated: 2026-07-09 after roadmap creation (traceability populated)_
