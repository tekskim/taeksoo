# ResourceSelector Design Spec

> Extracted from TDS `src/components/ProjectSelector.tsx` + `src/pages/design/components/ProjectSelectorPage.tsx`
> thaki-shared target: `src/components/ResourceSelector/`

## Component Architecture Comparison

| Aspect             | TDS (ProjectSelector)                               | thaki-shared (ResourceSelector)                               |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------- |
| API pattern        | Props-based (projects array, selectedId, callbacks) | Compound component (ResourceSelector + ResourceSelector.Item) |
| Dropdown mechanism | createPortal to body + manual positioning           | Portal component with direction prop                          |
| Scroll             | OverlayScrollbarsComponent                          | Native overflow-y-auto                                        |
| Keyboard nav       | Escape only                                         | Full (↑↓ Enter Escape)                                        |
| Custom trigger     | variant prop (`default`, `compact`, `sidebar-icon`) | customTriggerUI render prop                                   |
| Loading state      | Not supported                                       | isLoading with Skeleton                                       |
| Search filter      | name + id                                           | resourceName + description                                    |
| Styles location    | Inline Tailwind in TSX                              | Separate .styles.ts with CVA                                  |

> **Note**: The component APIs are fundamentally different. This sync focuses on **visual design tokens** (colors, spacing, typography, radius, shadows) only. Logic/API structure changes are out of scope.

## Trigger Button

### variant="default"

| Property      | TDS Value                                         | thaki-shared Value                                   | Match                             |
| ------------- | ------------------------------------------------- | ---------------------------------------------------- | --------------------------------- |
| Width         | `w-full`                                          | `w-[200px]`                                          | ❌ DIFF                           |
| Height        | auto (py-1.5 = 6px each)                          | `h-[25px]`                                           | ❌ DIFF                           |
| Padding       | `px-2.5 py-1.5` (10px 6px)                        | `px-[7.5px] py-[4.5px]`                              | ❌ DIFF                           |
| Background    | `bg-[var(--color-surface-subtle)]` (#f8fafc)      | `bg-surface-subtle` (#f8fafc)                        | ✅ exact                          |
| Hover BG      | `hover:bg-[var(--color-surface-muted)]` (#f1f5f9) | (none)                                               | ❌ DIFF                           |
| Radius        | `rounded-md` (6px)                                | `rounded-base6` (6px)                                | ✅ exact                          |
| Transition    | `transition-colors`                               | `transition-colors`                                  | ✅ exact                          |
| Label font    | `text-label-sm` (11px/16px, medium)               | `text-11 font-medium leading-16` (11px/16px, medium) | ✅ exact                          |
| Label color   | `text-[var(--color-text-default)]` (#0f172a)      | `text-text` (#0f172a)                                | ✅ exact                          |
| Icon          | ArrowRightLeft (lucide, 12px, strokeWidth 1.5)    | OrderIcon (12px, -rotate-90)                         | ❌ DIFF (icon type)               |
| Icon color    | `text-[var(--color-text-default)]` (#0f172a)      | `var(--primitive-color-slate400)` (#94a3b8)          | ❌ DIFF                           |
| Focus visible | none                                              | `focus-visible:ring-1 ring-primary ring-offset-1`    | ❌ DIFF (shared has, TDS doesn't) |
| Disabled      | none                                              | `disabled:cursor-not-allowed disabled:opacity-50`    | ❌ DIFF (shared has, TDS doesn't) |

### variant="sidebar-icon"

| Property   | TDS Value                                         | thaki-shared Value    | Match |
| ---------- | ------------------------------------------------- | --------------------- | ----- |
| Size       | `size-[38px]` (38×38)                             | N/A (customTriggerUI) | N/A   |
| Background | `bg-[var(--color-surface-default)]` (#ffffff)     | N/A                   | N/A   |
| Hover BG   | `hover:bg-[var(--color-surface-muted)]` (#f1f5f9) | N/A                   | N/A   |
| Radius     | `rounded-lg` (8px)                                | N/A                   | N/A   |
| Icon       | IconFolder (Tabler, 20px, stroke 1.5, text-muted) | N/A                   | N/A   |
| Tooltip    | position="right", content = project name          | N/A                   | N/A   |

> **Note**: `sidebar-icon` variant is TDS-only. thaki-shared uses `customTriggerUI` instead. This is an API difference — skip for design sync.

### variant="compact" (TDS only, not in docs)

| Property  | TDS Value                              |
| --------- | -------------------------------------- |
| Height    | `h-[var(--topbar-button-size)]` (28px) |
| Padding   | `px-2.5 py-1`                          |
| Font      | `text-label-md` (12px/18px)            |
| Icon size | 14px                                   |

> **Note**: `compact` exists in TDS code but not in PropsTable docs. Skip for sync.

## Dropdown Panel

| Property             | TDS Value                                            | thaki-shared Value                                                           | Match                |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------- |
| Width (default)      | `Math.max(trigger.width, 280)`                       | `w-[280px]` fixed                                                            | ❌ DIFF              |
| Width (sidebar-icon) | `320px`                                              | N/A                                                                          | N/A                  |
| Max height           | `400px`                                              | N/A (scroll max-h-[360px])                                                   | ❌ DIFF              |
| Scroll max height    | `300px` (OverlayScrollbars)                          | `360px` (overflow-y-auto)                                                    | ❌ DIFF              |
| Padding              | `p-2` (8px)                                          | `px-2 py-2` (8px)                                                            | ✅ exact             |
| Gap                  | `gap-2` (8px)                                        | `mt-2` (search → list gap)                                                   | ≈ similar            |
| Background           | `bg-[var(--color-surface-default)]` (#ffffff)        | `bg-surface` (#ffffff)                                                       | ✅ exact             |
| Border               | `1px border-[var(--color-border-default)]` (#e2e8f0) | `1px border-border-subtle` (#f1f5f9)                                         | ❌ DIFF              |
| Radius               | `rounded-2xl` (16px)                                 | `rounded-[12px]` (12px)                                                      | ❌ DIFF              |
| Shadow               | `shadow-lg`                                          | `shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]` | ≈ similar (both ~lg) |
| Z-index              | `z-[100]` (fixed)                                    | Portal-managed                                                               | ≈ similar            |
| Offset               | `4px` gap from trigger                               | `gap={8}` (8px from trigger)                                                 | ❌ DIFF              |
| Search placeholder   | "Search tenants"                                     | "Search tenants" (default)                                                   | ✅ exact             |
| Search autoFocus     | `autoFocus`                                          | Not in base (depends on SearchInput)                                         | ❌ DIFF              |
| Empty message        | "No tenants found"                                   | "No Data" / "No Result"                                                      | ❌ DIFF (text)       |

## Tenant Cell (Item Row)

| Property                 | TDS Value                                                    | thaki-shared Value                                   | Match                               |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------- |
| Padding                  | `pl-3 pr-2 py-2` (12px 8px 8px 8px)                          | `px-3 py-2` (12px 12px 8px 8px)                      | ❌ DIFF (pr: 8px vs 12px)           |
| Border (default)         | `1px border-[var(--color-border-default)]` (#e2e8f0)         | `1px border-border-subtle` (#f1f5f9)                 | ❌ DIFF                             |
| Border (selected)        | `border-[var(--color-action-primary)]` (#2563eb)             | `border-primary` (#2563eb)                           | ✅ exact                            |
| Background (default)     | transparent (hover: surface-subtle)                          | `bg-surface` (#ffffff)                               | ❌ DIFF                             |
| Background (selected)    | `bg-[var(--color-surface-subtle)]` (#f8fafc)                 | `bg-surface-subtle` (#f8fafc)                        | ✅ exact                            |
| Radius                   | `rounded-lg` (8px)                                           | `rounded-base8` (8px)                                | ✅ exact                            |
| Internal gap             | `gap-2` (8px)                                                | `gap-2` (8px)                                        | ✅ exact                            |
| Gap between cells        | `gap-2` (8px)                                                | `gap-2` (8px)                                        | ✅ exact                            |
| Row layout               | `flex flex-col gap-2`                                        | `flex flex-col gap-2` (via dl)                       | ✅ exact                            |
| Name font                | `text-label-md` (12px/18px, medium 500)                      | `text-12 font-medium leading-16` (12px/16px, medium) | ❌ DIFF (line-height: 18px vs 16px) |
| Description font         | `text-body-sm` (11px/16px, regular)                          | `text-11 font-normal leading-16` (11px/16px)         | ✅ exact                            |
| Description color        | `text-[var(--color-text-default)]` (#0f172a)                 | `text-text` (#0f172a)                                | ✅ exact                            |
| Description lines        | no clamp                                                     | `line-clamp-2` + `min-h-[32px]`                      | ❌ DIFF (shared clamps)             |
| Meta/ID font             | `text-[11px] leading-4` (11px/16px)                          | `text-11 font-normal leading-16` (11px/16px)         | ✅ exact                            |
| Meta/ID color            | `text-[var(--color-text-muted)]` (#475569)                   | `text-text-subtle` (#64748b)                         | ❌ DIFF                             |
| 3-dot icon               | IconDotsVertical (14px, stroke 1.5)                          | MoreIcon (14px)                                      | ≈ similar                           |
| 3-dot button size        | `size-5` (20px)                                              | `h-5 w-5` (20px)                                     | ✅ exact                            |
| 3-dot color              | `text-[var(--color-text-muted)]` (#475569)                   | `var(--primitive-color-slate400)` (#94a3b8)          | ❌ DIFF                             |
| 3-dot hover              | `hover:bg-[var(--color-surface-muted)]` + hover text-default | `hover:bg-surface-subtle`                            | ≈ similar                           |
| 3-dot (primary/disabled) | `text-[var(--color-text-disabled)]` (#94a3b8)                | N/A (via actionButtonUI slot)                        | N/A                                 |
| Primary badge            | `Badge theme="white" size="sm"`                              | N/A (via actionButtonUI slot)                        | N/A                                 |
| Disabled                 | `opacity-50 cursor-not-allowed`, no 3-dot                    | `opacity-50` via CVA                                 | ≈ similar                           |

## 주요 디자인 차이 (Design Sync 대상)

| #   | 항목                         | Before (thaki-shared)                       | After (TDS 기준)                   | 유형  | 비고                  |
| --- | ---------------------------- | ------------------------------------------- | ---------------------------------- | ----- | --------------------- |
| 1   | Trigger padding              | `px-[7.5px] py-[4.5px]`                     | `px-2.5 py-1.5` (10px 6px)         | style |                       |
| 2   | Trigger height               | `h-[25px]` fixed                            | auto (content-driven)              | style |                       |
| 3   | Trigger icon color           | `var(--primitive-color-slate400)` (#94a3b8) | `text-text` (#0f172a)              | style |                       |
| 4   | Dropdown border color        | `border-border-subtle` (#f1f5f9)            | `border-border` (#e2e8f0)          | style | border-default        |
| 5   | Dropdown radius              | `rounded-[12px]` (12px)                     | `rounded-2xl` (16px)               | style |                       |
| 6   | Dropdown offset from trigger | `gap={8}` (8px)                             | `4px`                              | style |                       |
| 7   | Item default border color    | `border-border-subtle` (#f1f5f9)            | `border-border` (#e2e8f0)          | style |                       |
| 8   | Item right padding           | `px-3` (12px both sides)                    | `pl-3 pr-2` (12px left, 8px right) | style |                       |
| 9   | Item default background      | `bg-surface` (#ffffff)                      | transparent                        | style | hover: surface-subtle |
| 10  | Item name line-height        | `leading-16` (16px)                         | `text-label-md` → 18px line-height | style |                       |
| 11  | Item meta/ID color           | `text-text-subtle` (#64748b)                | `text-text-muted` (#475569)        | style |                       |
| 12  | Scroll max height            | `max-h-[360px]`                             | `300px` (with OverlayScrollbars)   | style | Total max 400px       |
| 13  | 3-dot icon color             | `var(--primitive-color-slate400)` (#94a3b8) | `text-text-muted` (#475569)        | style |                       |
| 14  | Description line clamp       | `line-clamp-2 min-h-[32px]`                 | no clamp                           | style | Keep shared behavior  |

## CSS 구현 기법 차이

| 요소              | 시각 효과      | TDS 기법                                | thaki-shared 기법                 | 차이 영향                                |
| ----------------- | -------------- | --------------------------------------- | --------------------------------- | ---------------------------------------- |
| Dropdown position | Portal overlay | createPortal + manual fixed positioning | Portal component + direction prop | 위치 계산 방식 차이, 로직 변경 필요 없음 |
| Scroll container  | Smooth scroll  | OverlayScrollbarsComponent              | native overflow-y-auto            | 시각적 차이 미미                         |

> **결론**: CSS 구현 기법 차이는 시각에 큰 영향 없음. Portal/Scroll 메커니즘은 로직 영역이므로 디자인 싱크에서 변경하지 않음.

## CVA Base 상속 분석

싱크 대상: `resourceSelectorItemStyles` CVA

| base 클래스                       | 싱크 후 필요 여부         | 리셋 필요 | 리셋 방법                       |
| --------------------------------- | ------------------------- | --------- | ------------------------------- |
| `rounded-base8`                   | ✅ (8px = TDS rounded-lg) | —         | —                               |
| `border`                          | ✅ (1px border)           | —         | —                               |
| `px-3 py-2`                       | ❌ (TDS: pl-3 pr-2 py-2)  | ✅        | Change base to `pl-3 pr-2 py-2` |
| `gap-3`                           | ❌ (TDS: gap-2)           | ✅        | Change to `gap-2`               |
| `bg-surface` (in default variant) | ❌ (TDS: transparent)     | ✅        | Remove from default variant     |

## 아이콘 비교

| 아이콘                | TDS 구현                  | size | stroke | thaki-shared 구현      | 차이                                     |
| --------------------- | ------------------------- | ---- | ------ | ---------------------- | ---------------------------------------- |
| Trigger swap icon     | ArrowRightLeft (lucide)   | 12   | 1.5    | OrderIcon (-rotate-90) | Different icon library, keep shared icon |
| 3-dot menu            | IconDotsVertical (Tabler) | 14   | 1.5    | MoreIcon               | Similar visual, keep shared icon         |
| Folder (sidebar-icon) | IconFolder (Tabler)       | 20   | 1.5    | N/A                    | N/A                                      |

> **결론**: 아이콘 라이브러리 차이는 API 영역. 디자인 싱크에서는 아이콘 **색상/크기**만 맞추고, 아이콘 컴포넌트 자체는 변경하지 않음.

## Token Mapping (참조)

| TDS Token               | TDS Resolved | thaki-shared Token   | shared Resolved | Match    |
| ----------------------- | ------------ | -------------------- | --------------- | -------- |
| --color-surface-subtle  | #f8fafc      | bg-surface-subtle    | #f8fafc         | ✅ exact |
| --color-surface-muted   | #f1f5f9      | bg-surface-muted     | #f1f5f9         | ✅ exact |
| --color-surface-default | #ffffff      | bg-surface           | #ffffff         | ✅ exact |
| --color-border-default  | #e2e8f0      | border-border        | #e2e8f0         | ✅ exact |
| --color-border-subtle   | #f1f5f9      | border-border-subtle | #f1f5f9         | ✅ exact |
| --color-text-default    | #0f172a      | text-text            | #0f172a         | ✅ exact |
| --color-text-muted      | #475569      | text-text-muted      | #475569         | ✅ exact |
| --color-text-subtle     | #64748b      | text-text-subtle     | #64748b         | ✅ exact |
| --color-text-disabled   | #94a3b8      | text-text-disabled   | #94a3b8         | ✅ exact |
| --color-action-primary  | #2563eb      | border-primary       | #2563eb         | ✅ exact |

> All semantic color tokens match between TDS and thaki-shared. The design differences are about **which token is used where**, not token value mismatches.
