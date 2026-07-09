# Roadmap: Container Platform

## Overview

The journey starts with the thinnest end-to-end slice — registering a "Container Platform"
desktop app whose icon opens a windowed shell with a working sidebar — then builds a shared
typed mock estate that every screen reads from. From there each observability surface lands as
its own vertical slice: an Overview dashboard that rolls up estate health, a searchable Clusters
list with drill-down detail, a Nodes list with status theming, and a Workloads list with
kind/cluster filtering. By the end, an operator opens one app and observes the whole container
estate that is today scattered across four products — read-only, TDS-compliant, mock-first.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Desktop App Registration & Shell** - Register the Container Platform app + windowed shell with sidebar navigation
- [ ] **Phase 2: Cross-Cluster Mock Data Foundation** - Typed inline mock estate (clusters/nodes/workloads) every screen reads from
- [ ] **Phase 3: Overview Dashboard** - Estate health rollup with summary tiles, per-source breakdown, and at-risk signal
- [ ] **Phase 4: Clusters List** - Searchable, paginated cross-cluster list via TDS ListToolbar/Table
- [ ] **Phase 5: Cluster Detail** - Drill-down cluster view with node/workload summary
- [ ] **Phase 6: Nodes List** - Cross-cluster nodes list with status theming and capacity
- [ ] **Phase 7: Workloads List** - Cross-cluster workloads list (kind/name/namespace/cluster/status/replicas)
- [ ] **Phase 8: Workloads Filtering** - Filter workloads by kind and cluster on top of the list

## Phase Details

### Phase 1: Desktop App Registration & Shell

**Goal**: Operator can open a Container Platform app from the desktop and navigate its sections.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01, PLAT-02, PLAT-03, TDS-01
**Success Criteria** (what must be TRUE):

1. A "Container Platform" icon appears on the desktop grid.
2. Clicking the icon opens Container Platform in its own draggable desktop window.
3. A persistent left sidebar lists Overview / Clusters / Nodes / Workloads, and clicking each navigates to that route (placeholder content acceptable).
4. All shell chrome renders via `@/design-system` components — no raw HTML layout.
   **Plans**: TBD
   **UI hint**: yes

### Phase 2: Cross-Cluster Mock Data Foundation

**Goal**: A single typed mock estate provides clusters, nodes, and workloads spanning multiple source surfaces for every screen to read.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: TDS-03
**Success Criteria** (what must be TRUE):

1. Importing the estate mock module returns typed clusters, nodes, and workloads.
2. Mock data spans multiple source surfaces (Aegis/Metis) and multiple clusters, with nodes and workloads linked to their owning cluster.
3. No network/fetch/MSW usage — all data is inline typed TS modules.
   **Plans**: TBD

### Phase 3: Overview Dashboard

**Goal**: Operator sees a rolled-up health summary of the whole estate on landing.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: OVW-01, OVW-02, OVW-03
**Success Criteria** (what must be TRUE):

1. Dashboard shows summary tiles for total clusters, nodes, and workloads with a health rollup.
2. Dashboard shows a per-source breakdown revealing which surface each cluster comes from.
3. Dashboard surfaces an at-risk signal (count of unhealthy nodes / failing workloads).
   **Plans**: TBD
   **UI hint**: yes

### Phase 4: Clusters List

**Goal**: Operator can browse and search the cross-cluster clusters list.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: CLU-01, CLU-02, TDS-02
**Success Criteria** (what must be TRUE):

1. Clusters list shows name, source, status, node count, and version.
2. List supports search/filter and pagination via TDS ListToolbar/Pagination.
3. Table column widths use `fixedColumns`/`columnMinWidths` presets — no hardcoded widths.
   **Plans**: TBD
   **UI hint**: yes

### Phase 5: Cluster Detail

**Goal**: Operator can drill into a cluster to inspect its node/workload summary.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: CLU-03
**Success Criteria** (what must be TRUE):

1. Clicking a cluster row opens that cluster's detail view.
2. The detail view shows the selected cluster's node and workload summary.
3. Breadcrumb/navigation returns to the clusters list without leaving the app window.
   **Plans**: TBD
   **UI hint**: yes

### Phase 6: Nodes List

**Goal**: Operator can browse the cross-cluster nodes list with status and capacity.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: NODE-01, NODE-02, NODE-03
**Success Criteria** (what must be TRUE):

1. Nodes list shows status, roles, capacity (cpu/mem), and owning cluster.
2. Node status uses TDS status theming (`containerStatusUtils`).
3. List supports search/filter and pagination.
   **Plans**: TBD
   **UI hint**: yes

### Phase 7: Workloads List

**Goal**: Operator can browse the cross-cluster workloads list.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: WKL-01, WKL-03
**Success Criteria** (what must be TRUE):

1. Workloads list shows kind, name, namespace, cluster, status, and replicas.
2. List supports search and pagination.
   **Plans**: TBD
   **UI hint**: yes

### Phase 8: Workloads Filtering

**Goal**: Operator can narrow the workloads list by kind and cluster.
**Mode:** mvp
**Depends on**: Phase 7
**Requirements**: WKL-02
**Success Criteria** (what must be TRUE):

1. Operator can filter workloads by kind (Deployment/StatefulSet/DaemonSet/Job/Pod).
2. Operator can filter workloads by owning cluster.
3. Filters combine correctly with search and pagination.
   **Plans**: TBD
   **UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase                                 | Plans Complete | Status      | Completed |
| ------------------------------------- | -------------- | ----------- | --------- |
| 1. Desktop App Registration & Shell   | 0/TBD          | Not started | -         |
| 2. Cross-Cluster Mock Data Foundation | 0/TBD          | Not started | -         |
| 3. Overview Dashboard                 | 0/TBD          | Not started | -         |
| 4. Clusters List                      | 0/TBD          | Not started | -         |
| 5. Cluster Detail                     | 0/TBD          | Not started | -         |
| 6. Nodes List                         | 0/TBD          | Not started | -         |
| 7. Workloads List                     | 0/TBD          | Not started | -         |
| 8. Workloads Filtering                | 0/TBD          | Not started | -         |
