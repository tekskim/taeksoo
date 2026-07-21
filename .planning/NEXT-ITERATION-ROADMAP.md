# Container Platform — Next Iteration (Mockup v0.2)

**Scope guard (locked):** Local mockup only. NO real backend / K8s API, NO deployment, NO MFE
productization. Goal is to _see the design_ evolve in `planning/taeksoo` (port 5180).

**Lead requirement:** **Absorb AI workloads** — Metis Run (model serving / inference) and
Metis ML Studio (notebooks + training) must become first-class citizens inside Container
Platform, not a separate surface. This is the whole point of the consolidation, so it leads.

Reference archetypes for AI-on-Kubernetes observability: OpenShift AI, Kubeflow, Run:ai
(inference endpoints, notebook servers, training jobs, GPU allocation as a first-class resource).

---

## Product model — DECIDED: Model A (Rancher-style), 2026-07-09

Container Platform is a **cross-cluster observation + navigation plane**, NOT a re-implementation
of the full Kubernetes management console. The deep per-resource management already built in
Aegis/Metis Container is **reused**, not rebuilt.

**Container Platform owns** (estate-wide, read-only): Overview · Clusters (fleet) · Nodes ·
Namespaces · Workloads overview · **AI Workloads** (the one genuinely new consolidation, absorbing
Metis Run + ML Studio) · Events · global Search. Job: "see everything across clusters, spot
problems, find things, then go manage."

**Aegis/Metis Container keep** (per-cluster, full CRUD): the workload/service/storage/network
resource management, YAML editors, console, and cluster lifecycle — Deployments/StatefulSets/
DaemonSets/Jobs/CronJobs/Pods, Services, Ingresses, PV/PVC/StorageClass/ConfigMaps/Secrets,
HPA/LimitRanges/ResourceQuotas/NetworkPolicies/PDB, cluster create/import.

**The seam:** from a Container Platform cluster (or resource row) the operator drills in via an
**"Open in cluster management"** hand-off that opens the existing Aegis/Metis Container app scoped
to that cluster. Container Platform never re-implements CRUD. App Catalog stays out (separate project).

**Not chosen:** Model B (CP absorbs everything, retire Aegis/Metis) — too large, discards existing
investment. Model C (phased pull-up) remains available later if specific management surfaces prove
worth hoisting into CP.

**Implication (deferred build):** add the drill-in / "Open in cluster management" affordance from CP
cluster detail; do NOT add CRUD/YAML to CP. (Decision recorded; implementation later.)

---

## Phase A — AI Workload Absorption (lead, must)

**A1. Extend the estate data model**

- Add **GPU** as a first-class node resource (Metis GPU clusters get A100 counts; `gpuTotal`/`gpuUsed`).
- Introduce an AI workload dimension. Option (recommended): a `workloadCategory` on workloads —
  `Standard | InferenceService | TrainingJob | Notebook` — plus AI-specific fields:
  - InferenceService (← Metis Run): model name, framework (Triton/vLLM/TF-Serving), gpu count, replicas, mock RPS/latency.
  - TrainingJob (← ML Studio): status, gpu count, progress (epoch %), duration, owner.
  - Notebook (← ML Studio): owner, gpu, state (Running/Idle/Stopped).
- Keep it deterministic inline mock (same convention).

**A2. "AI Workloads" section** (new sidebar item — reflects Metis Run + ML Studio absorbed)

- Segmented list: Inference Services · Training Jobs · Notebooks (tabs or a type filter).
- AI-specific columns (model/framework/gpu/replicas for serving; progress/gpu/duration for training; owner/gpu/state for notebooks).
- Filters by type / cluster / status; TDS Table + pagination like the other lists.

**A3. Overview — AI + GPU rollup**

- Add an "AI workloads" summary (inference services / training jobs / notebooks counts).
- Add a **GPU utilization** rollup tile (allocated vs total GPUs across the estate).

**A4. Cluster detail — AI + GPU**

- For GPU clusters, show GPU capacity and the cluster's AI workloads alongside the existing node/workload summary.

---

## Phase B — Design depth & polish (mockup design QA)

- **B1.** Replace hand-rolled Overview `Tile` with TDS **MetricCard** / `MetricCardGroup` (`accent: success|error`) — proper TDS metric styling, removes the token workaround.
- **B2.** Dedicated **Container Platform app icon** (replace the reused `container.webp`).
- **B3.** Design QA against TDS wireframes/patterns — column parity, empty/loading states, list-page spacing, breadcrumbs.
- **B4.** (optional refactor) Extract a shared `useListFilterPagination` hook + `ContainerPlatformPageShell` wrapper + `nameColumn`/`statusBadgeColumn` factories — the 3 list pages currently duplicate this (from code review). AI Workloads (A2) would reuse it.

---

## Phase C — Observability breadth (still mockup, optional)

- **C1.** Namespaces & Events views (Rancher-style).
- **C2.** Node detail drill-down (from Nodes list).
- **C3.** Global cross-surface search / estate filter (by source, cluster, health).

---

## Open decisions

1. **AI Workloads presentation** — dedicated sidebar section (recommended, reflects the absorption) vs. a `type` filter inside the existing Workloads list.
2. **Old "Container" desktop icon** — Phase 1 _replaced_ the generic `Container` desktop icon with `Container Platform` (and swapped the dock entry to `aegis-container`). Keep the replacement (consolidation intent) or restore `Container` and keep Container Platform as an additional icon?

---

## Status (2026-07-09)

- **Phase A — DONE** (AI absorption: Metis Run → Inference Services, ML Studio → Training Jobs + Notebooks, GPU first-class; dedicated AI Workloads section + Overview/Cluster rollups).
- **Phase B — DONE.** B1 Overview → TDS `MetricCard`; B3 concept subtitle naming the 4 absorbed products; B2 dedicated app icon (`container-platform.svg`).
- **Phase C — DONE.** C1 Namespaces + Events; C2 Node detail drill-down (Nodes rows clickable); C3 global "Search estate" (sidebar → grouped results).
- **B4 refactor — DEFERRED on purpose:** internal cleanup, no visible design change, would risk regressing 8 working screens.

**Decisions resolved:** AI Workloads = dedicated section. Container icon = replacement kept + dedicated icon added.

**Verification:** Playwright E2E 16/16 PASS, 0 page errors, 10 screens. eslint/tsc clean, `rspack build` exit 0, no `@thaki/shared`, no hardcoded widths.

Sidebar now: Overview · Clusters · Nodes · Namespaces · Workloads · AI Workloads · Events + global search.

---

_Drafted 2026-07-09. Mockup-only; supersedes the earlier v2 note's backend/deploy/MFE items (dropped per stakeholder)._
