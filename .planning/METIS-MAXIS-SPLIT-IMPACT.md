# Metis/Maxis split — impact on Container Platform MVP

**Source:** Notion "[분리] Maxis와 Metis 분리..?" (P0, id 74) — Metis/Maxis 담당자 협의.
**Date reconciled:** 2026-07-09.

## What the memo actually decides

| App                 | Change                                                                                                         | Container Platform impact          |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Metis Hub**       | Deleted → new **Hub** app (model/dataset/package). Registry/Compare → Maxis.                                   | none (product-layer)               |
| **Metis Run**       | **Deleted.** Its **Workloads + Volume → Container Platform** (_택수 검토중_). Template TBD.                    | **CP absorbs Workloads + Volume**  |
| **Metis ML Studio** | **→ Maxis** (AI Training Platform); gains Registry/Compare. **Devspace → Container Platform** (_택수 검토중_). | **only Devspace may fold into CP** |
| **Metis Serve**     | **→ Metis** (serving, 고도화).                                                                                 | product-layer (runs on CP)         |
| **Metis Fabric**    | Split into Maxis/Metis admin? monitoring, **Kueue**, metering→billing.                                         | shared infra components            |

## Corrected concept (this changes my earlier MVP)

My earlier MVP made Container Platform **own** AI _product_ surfaces (Inference / Training / Notebooks
with model/framework/RPS/epoch semantics). That was **over-absorption.** Per the memo:

- **Container Platform = the multi-cluster container/compute SUBSTRATE.** It owns Clusters, Nodes,
  Namespaces, **Workloads**, **Volumes** (new, from Metis Run), Events.
- **The AI products run ON it, not inside it:** **Maxis** (training ← ML Studio) and **Metis** (serving
  ← Metis Serve) are separate products that deploy workloads onto the substrate. Aegis apps + Hub too.
- Container Platform's job is to show _everything running on the substrate uniformly, attributed to its
  managing product_, and let you drill OUT to that product to manage it (the Model A seam, already decided).

## MVP redesign deltas

1. **ADD `Volumes`** section — Metis Run's Volume absorbed. Cross-cluster PV/PVC with an explicit
   **owner + isolation boundary** (so Metis/Maxis can still get isolated volumes — see Issue 4).
2. **RE-SCOPE `AI Workloads`** — drop the CP-owned product framing. Instead add a **"Managed by"**
   dimension to Workloads (Aegis · Metis(serve) · Maxis(train) · Metis Run(legacy) · Devspace), and a
   saved filter "AI workloads" = workloads managed by Maxis/Metis whose rows **drill OUT** to that
   product. CP does not own model/framework/epoch semantics — those live in Maxis/Metis.
3. **(Under review) ADD `Devspace`** — dev environments as a workload type CP hosts. If adopted, CP owns
   the **/path/to pod-access routing ONCE as a substrate capability** so Metis Run pods AND Devspace
   reuse one implementation (avoids the double-dev issue).
4. Keep Overview/Clusters/Nodes/Namespaces/Events/Search; Overview "AI" rollup reframes to
   "workloads by managing product" (+ links out).

## Decisions on the table (택수 검토중 + memo issues) — with my recommendation

- **D1. Metis Run Workloads → CP?** → **Yes.** They are just workloads; the substrate already models them.
- **D2. Metis Run Volume → CP?** → **Yes, with an ownership/isolation model:** CP owns the volume _plane_,
  each volume carries `owner` (Metis/Maxis/Aegis) + isolation scope, so products keep isolated volumes.
  (Resolves "Container가 volume 가져가면 Metis/Maxis 격리 volume 불가" issue.)
- **D3. ML Studio Devspace → CP?** → **Yes, IF** CP owns the `/path/to` pod-access routing as a shared
  substrate capability (one impl for Metis Run pods + Devspace). Otherwise keep Devspace in Maxis.
- **D4. Multi-cluster component — CP self-build vs TKAI/Fabric?** → **Shared component (TKAI/Fabric).**
  Do not duplicate multi-cluster machinery inside CP.
- **D5. `partition = namespace` tenancy?** → **Adopt namespace as CP's partition boundary** (align with
  Metis Run's model) so pods stay isolated per partition.
- **D6. Project concept across Metis/Maxis/Container?** → **CP namespace/project is the shared substrate
  primitive; product "projects" MAP onto CP namespaces** rather than each app minting separate projects —
  avoids the cross-app usability degradation the memo flags (Maxis using Metis features across project
  boundaries).

## Net effect on the current mockup

- Current `AIWorkloadsPage` (inference/training/notebooks) is **conceptually mislabeled** — it should
  become a "Workloads managed by AI products" _view_ that attributes + links out, not a CP-owned product.
- **New `Volumes` section** is the one clean new absorption to add.
- Everything else (substrate lenses) stays and is already correct.

## Implemented in the mockup (2026-07-09)

- **Data model:** `Workload.managedBy` (Aegis/Maxis/Metis/Metis Run/Devspace); `Volume` (owner + isolation); `Devspace` (/path/to access). Selectors `getVolumes`/`getVolumesByCluster`/`getDevspaces`.
- **New `Volumes` section** (sidebar, after Namespaces): PV/PVC cross-cluster with **Owner** badge + isolation — shows CP owns the plane while products keep isolated volumes (D2).
- **`Workloads`** gains a "Managed by" column + filter — "everything runs here, product X owns it."
- **`AI Workloads` reframed** to observe-not-manage: subtitle + "Managed by" column + "Open in Maxis/Metis ↗" drill-out (Model A seam), plus a **Dev Spaces** tab (CP-hosted, /path/to access — the shared substrate routing per D3).
- **Overview** subtitle corrected to substrate framing (ML Studio → Maxis, NOT absorbed) + AI note.
- **Verification:** Playwright E2E 20/20 PASS, 0 page errors. eslint/tsc clean, no `@thaki/shared`, no hardcoded widths.

**Still decisions, not built:** D3 (Devspace) shown as _conditional-yes_ affordance; D4/D5/D6 (multi-cluster owner, partition=namespace, shared project) are architecture policy — reflected in the data model's attribution/isolation but not enforced (no backend).

---

_Recorded 2026-07-09. Local mockup only; no backend/deploy/MFE. Model A (Rancher-style) seam still holds._
