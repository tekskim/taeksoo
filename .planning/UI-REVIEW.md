# Container Platform Mockup — UI Review

**Audited:** 2026-07-11
**Baseline:** `prerequisite.md` + `TABLE_STYLE_GUIDE.md` (TDS conventions), abstract 6-pillar standards
**Screenshots:** captured (10 rendered views @ 1440×900) + full source read
**Scope:** read-only observability mockup — backend/mutation gaps intentionally NOT flagged

---

## Pillar Scores

| Pillar                      | Score | Key Finding                                                                                          |
| --------------------------- | ----- | ---------------------------------------------------------------------------------------------------- |
| 1. Visual hierarchy         | 4/5   | Clean section labelling; At-risk row reads as "missing cards" due to spacer hack                     |
| 2. Cross-screen consistency | 4/5   | Every list shares one PageShell→Toolbar→Pagination→Table pattern; subtitle/gap treatment drifts      |
| 3. Spacing / layout         | 2/5   | 4 of 8 tables overflow horizontally at 1440px — key columns + the drill-out CTA are off-screen       |
| 4. Typography / color       | 3/5   | Badge palette overloaded: Metis = gray (Source) vs yellow (Owner); zero-count chips still red/yellow |
| 5. States / feedback        | 4/5   | Empty states, not-found states, filter resets, zero-count phrasing all handled                       |
| 6. Accessibility            | 3/5   | Text-labelled badges & aria-hidden spacers are correct; "navigable" rows use non-focusable spans     |

**Overall: 20/30**

---

## Top Priority Fixes (ranked)

1. **BLOCKER — Wide tables overflow the frame at 1440px; the substrate's signature affordance is hidden.**
   On AI Workloads → Inference (11 columns) the `Open in Metis ↗` drill-out button, RPS and p95 Latency are entirely off the right edge (`full-ai.png`); the `GPUs` header is clipped to "GPU". Volumes clips `Access Mode` + `Isolation` (`full-volumes.png`), Events clips `Message` (`full-events.png`), Dev Spaces clips the `/path/to` `Access` value (`full-devspaces.png`). The Table container only scrolls on `overflow-x-auto` with no visible scrollbar, so a reviewer at 1440 never sees that "managed elsewhere" is the whole point of the page.
   _Impact:_ the "substrate vs product" seam — the core narrative — is invisible without horizontal scrolling.
   _Fix:_ trim the Inference column set (move RPS/p95/Replicas into a hover or detail; keep Name/Model/Cluster/Status/Managed-by/GPUs/drill-out), and/or pin the drill-out (`actions`) column right with `position: sticky`. Verify each table's `Σ fixedColumns.width + Σ columnMinWidths ≤ ~1000px` content width per the guide's §2.6 formula. `AIWorkloadsPage.tsx:145-207`, `VolumesPage.tsx:96-191`, `EventsPage.tsx:83-161`.

2. **WARNING — Badge color carries two contradictory meanings, defeating at-a-glance scanning.**
   `Metis` renders **gray** as a cluster _Source_ (`ClustersPage.tsx:94`, `NamespacesPage.tsx:102`, `full-clusters.png`) but **yellow** as an _Owner / Managed-by_ (`VolumesPage.tsx:44`, `WorkloadsPage.tsx:50`, `full-ai.png`). Simultaneously **yellow** already means Warning / Pending / SchedulingDisabled status. So a yellow chip on one screen = "attention needed" and on the next = "owned by Metis" — the same hue, three semantics.
   _Impact:_ status vs attribution can't be distinguished by color; the 60/30/10 discipline breaks down into ambiguous accent noise.
   _Fix:_ pick ONE owner hue per product and keep it out of the status ramp (e.g. Metis owner = a neutral/indigo tone distinct from yellow), OR visually separate attribution badges from status badges (outline vs solid `type`). Unify `MANAGED_BY_THEME` / `OWNER_THEME` and the Source mapping into one exported map.

3. **WARNING — Overview "At risk" row reads as broken, not intentional.**
   The row renders two cards (Unhealthy nodes, Failing workloads) then a large empty gap held open by two `aria-hidden` spacer `<div>`s so the group lines up with the 4-up Estate row (`OverviewPage.tsx:173-176`, `full-overview.png`). Visually it looks like two cards failed to load.
   _Impact:_ the most safety-critical row on the dashboard looks incomplete.
   _Fix:_ drop the spacers and let `MetricCard.Group` hold two full-width-balanced cards, or fill columns 3–4 with real signal (e.g. "Pending workloads", "Critical events (24h)") so the row is intentionally 4-up.

---

## Detailed Findings

### Pillar 1: Visual hierarchy (4/5)

- **Good:** Overview uses a clear title + one-line substrate subtitle, then `text-label-lg` section headers (Estate / At risk / AI workloads / By source) over MetricCard groups — the eye lands on section → metric → badge in order (`OverviewPage.tsx:107-219`, `full-overview.png`). Detail pages lead with `DetailHeader` identity + InfoGrid, then rollup badges, then nodes (`ClusterDetailPage.tsx`, `full-cluster-detail.png`) — textbook progressive disclosure.
- **WARNING:** the At-risk spacer hack (finding #3) undercuts the row's hierarchy.
- **Minor:** MetricCards are tall with a small value glyph and lots of vertical air; acceptable for a dashboard but the KPI numbers (`8`, `34`, `162`) carry less visual weight than their titles.

### Pillar 2: Cross-screen consistency (4/5)

- **Strong:** all seven list pages are structurally identical — `PageShell` + `ContainerPlatformSidebar` (fixed 200px) + `TopBar`/`Breadcrumb` + `PageHeader` + `ListToolbar`/`FilterSearchInput` (fixed `--search-input-width`) + `Pagination` (top-left, `totalItems`) + TDS `Table`. Status theming routes through one `getPlatformStatusTheme()` SSOT (`containerPlatformMockData.ts:1154`). This is the mockup's biggest strength.
- **WARNING:** subtitle treatment is inconsistent — Overview/AI use `VStack gap={1}` under the header; Workloads and Volumes bolt a `<p className="… -mt-2">` with a negative-margin hack (`WorkloadsPage.tsx:185`, `VolumesPage.tsx:209`); Clusters/Nodes/Namespaces/Events have no subtitle at all. Root `VStack gap` also drifts (Overview/detail `gap={4}`, lists `gap={3}`). Pick one subtitle slot + one page gap.
- **Minor:** Name column color encodes navigability (blue `action-primary` on the clickable Clusters/Nodes, `text-default` on the non-clickable Workloads/Volumes/Namespaces/AI) — a defensible convention, but undocumented and easy to break.

### Pillar 3: Spacing / layout (2/5)

- **BLOCKER:** horizontal overflow on Inference / Volumes / Events / Dev Spaces (finding #1). The guide's own §2.6 overflow formula was not applied before choosing column counts.
- **WARNING:** negative-margin subtitle hack (`-mt-2`) and the `aria-hidden` spacer divs are both layout workarounds rather than layout — they'll drift when the design system spacing changes.
- **Good:** within a single row the TDS `fixedColumns` / `columnMinWidths` presets are used correctly everywhere; nothing is hard-coded, and the 8px-scale gaps between sections read cleanly on Clusters/Nodes/Workloads which do fit (`full-clusters.png`, `full-nodes.png`, `full-workloads.png`).

### Pillar 4: Typography / color (3/5)

- **Typography — good:** consistent use of `text-label-lg`, `text-body-sm`, `text-[var(--color-text-muted/subtle/default)]` tokens; no raw px font sizes, no weight sprawl (`font-medium` only for row names).
- **WARNING — color coherence:** the Metis gray-vs-yellow / yellow-overload problem (finding #2).
- **WARNING — zero-count colored chips:** cluster detail shows `0 Pending` (yellow) and `0 Failed` (red) as fully saturated status chips (`ClusterDetailPage.tsx:212-217`, `full-cluster-detail.png`). Red/yellow should not fire when the count is 0 — it draws the eye to non-problems. Gray out or hide zero buckets.
- **Good:** healthy/ready = green, warning/pending = yellow, critical/notready = red is applied identically across every status column via the shared helper.

### Pillar 5: States / feedback (4/5)

- **Good:** every table carries a tailored `emptyMessage` ("No inference services found." etc.); detail routes render a real `EmptyState` with recovery copy on unknown id (`ClusterDetailPage.tsx:90-101`, `NodeDetailPage.tsx:73-84`). Filter/search/segment changes reset page correctly (`AIWorkloadsPage.tsx:392-401`).
- **Good:** zero-count at-risk metrics degrade gracefully to "All Ready" / "None failing" rather than a bare `0` (`OverviewPage.tsx:148-169`).
- **Good:** the drill-out `Tooltip` ("Managed in Maxis (separate app)") explains why the button doesn't navigate — honest handling of the cross-app seam (`AIWorkloadsPage.tsx:135-143`).
- **Minor:** no loading/skeleton states — acceptable for a static mock, not flagged as a defect.

### Pillar 6: Accessibility (3/5)

- **Good:** status is never color-only — every badge pairs hue with a text label (`Running`, `Warning`, `Bound`), so it survives color-blindness and grayscale.
- **Good:** the Overview spacer divs are correctly `aria-hidden`; drill-out has both visible text and a tooltip; progress bars use `showValue` so the % is textual (`ClusterDetailPage.tsx:45-56`).
- **WARNING:** rows on Clusters/Nodes navigate via `onRowClick`, and the name is a blue `<span>` styled to look like a link — but it is not an `<a>`/`<button>`, so keyboard/screen-reader users get no focusable target and cannot drill in. Either wrap the name in a real link or make the row keyboard-activatable.
- **Minor:** the `↗` drill-out and its tooltip only surface on hover and, per finding #1, are off-screen on the inference tab — so the affordance is neither visible nor easily focusable at the default viewport.

---

## Does "substrate vs product" read visually?

Partially. The concept is carried well in prose (Overview subtitle "The multi-cluster container substrate — Aegis, Maxis, Metis…"; Workloads "'Managed by' shows which product owns it") and reinforced by the per-row Managed-by / Owner badges. But the **strongest visual signal — the `Open in {product} ↗` drill-out — is clipped off-screen** on the very tab meant to demonstrate it (finding #1), and the Overview expresses the idea only as text, never as a diagrammatic seam. Fixing the overflow (and disambiguating the owner color) is what turns the narrative from "explained" into "shown".

---

## Files Audited

- `src/pages/container-platform/OverviewPage.tsx`
- `src/pages/container-platform/AIWorkloadsPage.tsx`
- `src/pages/container-platform/WorkloadsPage.tsx`
- `src/pages/container-platform/VolumesPage.tsx`
- `src/pages/container-platform/ClustersPage.tsx`
- `src/pages/container-platform/ClusterDetailPage.tsx`
- `src/pages/container-platform/NodesPage.tsx`
- `src/pages/container-platform/NodeDetailPage.tsx`
- `src/pages/container-platform/NamespacesPage.tsx`
- `src/pages/container-platform/EventsPage.tsx`
- `src/pages/container-platform/ContainerPlatformSidebar.tsx`
- `src/pages/container-platform/containerPlatformMockData.ts` (status theming)
- Screenshots: full-overview, full-ai, full-cluster-detail, full-volumes, full-workloads, full-events, full-devspaces, full-clusters, full-nodes, preview-desktop
