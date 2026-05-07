# ProgressBar — TDS Design Spec

> 추출 소스: TDS `ProgressBar.tsx`, `ProgressBarComponentPage.tsx`, `UsageChartPage.tsx`, `index.css`
> 대상: thaki-shared `ProgressBar` 컴포넌트 (+ GaugeBarChart 영향)

## 1. TDS 디자인 토큰 (Source of Truth)

### Bar (Track + Fill)

| 항목           | TDS 값               | CSS Variable                                |
| -------------- | -------------------- | ------------------------------------------- |
| Height         | 3px                  | `--progress-bar-height: 3px`                |
| Radius         | pill (9999px)        | `--progress-bar-radius: var(--radius-pill)` |
| Track color    | `#f1f5f9` (slate100) | `var(--color-border-subtle)`                |
| Fill min-width | 4px (when > 0%)      | inline style                                |

### Fill Colors (by status)

| Status              | Color     | TDS Variable                  |
| ------------------- | --------- | ----------------------------- |
| success             | `#22c55e` | `var(--color-state-success)`  |
| warning             | `#f97316` | `var(--color-state-warning)`  |
| danger              | `#ef4444` | `var(--color-state-danger)`   |
| info                | `#2563eb` | `var(--color-state-info)`     |
| neutral             | `#e2e8f0` | `var(--color-border-default)` |
| default (no status) | `#2563eb` | `var(--color-action-primary)` |

### Pending/Estimate Segment

| 항목    | TDS 값                                                          |
| ------- | --------------------------------------------------------------- |
| Opacity | 0.3                                                             |
| Radius  | pill right side only (`rounded-r-[var(--progress-bar-radius)]`) |
| Color   | same as fill status color                                       |

### Container / Layout

| 항목                   | TDS 값          |
| ---------------------- | --------------- |
| Root gap (label ↔ bar) | 6px (`gap-1.5`) |
| Root direction         | `flex flex-col` |
| Root width             | `w-full`        |

### Typography — Default Variant

| 요소        | TDS Class                                       | Size/Weight/LineHeight |
| ----------- | ----------------------------------------------- | ---------------------- |
| Label       | `text-body-md text-[var(--color-text-default)]` | 12px / 18px / 400      |
| Status text | `text-body-sm text-[var(--color-text-subtle)]`  | 11px / 16px / 400      |

### Typography — Quota Variant

| 요소  | TDS Class                                        | Size/Weight/LineHeight |
| ----- | ------------------------------------------------ | ---------------------- |
| Label | `text-label-sm text-[var(--color-text-default)]` | 11px / 16px / 500      |
| Value | `text-body-sm text-[var(--color-text-default)]`  | 11px / 16px / 400      |

## 2. thaki-shared 현재 상태

### Bar

| 항목        | 현재 값                                   | 비고                                |
| ----------- | ----------------------------------------- | ----------------------------------- |
| Height      | `h-1` (4px)                               | 1px 차이                            |
| Radius      | `rounded-lg` (8px)                        | pill이 아님                         |
| Track color | `var(--semantic-color-borderMuted)`       | **미정의 토큰** — 토큰 파일에 없음! |
| Fill        | Native `<progress>` + CSS pseudo-elements | TDS는 div 기반                      |

### Pending Overlay

| 항목    | 현재 값              |
| ------- | -------------------- |
| Opacity | `opacity-40` (0.4)   |
| Radius  | `rounded-r-lg` (8px) |

### Container / Layout

| 항목     | 현재 값                                      |
| -------- | -------------------------------------------- |
| Root gap | `gap-xs` → `--component-layout-gap-xs` = 4px |

### Typography

| 요소  | 현재 값                                   | Size/Weight/LH    |
| ----- | ----------------------------------------- | ----------------- |
| Label | `text-text text-14 font-medium leading-5` | 14px / 20px / 500 |
| Value | `text-text text-12 font-normal leading-4` | 12px / 16px / 400 |

## 3. 주요 디자인 차이 (12건)

### Critical — 시각적 차이

| #   | 항목              | TDS                            | thaki-shared                      | 변경 방침           |
| --- | ----------------- | ------------------------------ | --------------------------------- | ------------------- |
| 1   | Bar height        | 3px                            | 4px (`h-1`)                       | `h-[3px]`           |
| 2   | Bar radius        | pill (9999px)                  | 8px (`rounded-lg`)                | `rounded-full`      |
| 3   | Track color CSS   | `borderSubtle`                 | `borderMuted` (undefined!)        | `borderSubtle`      |
| 4   | Pending opacity   | 0.3                            | 0.4 (`opacity-40`)                | `opacity-30`        |
| 5   | Pending radius    | pill-right                     | 8px-right (`rounded-r-lg`)        | `rounded-r-full`    |
| 6   | Label font-size   | 12px                           | 14px (`text-14`)                  | `text-12`           |
| 7   | Label font-weight | 400 (regular)                  | 500 (medium)                      | `font-normal`       |
| 8   | Label line-height | 18px                           | 20px (`leading-5`)                | `leading-18`        |
| 9   | Value font-size   | 11px                           | 12px (`text-12`)                  | `text-11`           |
| 10  | Value line-height | 16px                           | 16px (`leading-4`)                | — (already matches) |
| 11  | Container gap     | 6px                            | 4px (`gap-xs`)                    | `gap-1.5`           |
| 12  | Fill radius (CSS) | pill (`rounded-lg` = semantic) | `rounded-lg` (semantic-radius-lg) | `rounded-full`      |

### Architecture difference (NOT changing)

- TDS uses div-based bar rendering
- thaki-shared uses native `<progress>` + CSS pseudo-elements
- **Decision**: Keep native `<progress>` approach — only update CSS values

## 4. GaugeBarChart Impact

GaugeBarChart renders `<ProgressBar>` with:

- `className="[&>div]:h-[3px]"` — height override (becomes redundant after fix #1)
- `showValue={false}` — no header (typography changes don't affect)
- `color`/`pendingColor` — custom colors via `progress-custom` CSS class

After sync:

- Bar height: GaugeBarChart's `h-[3px]` override becomes no-op (base is now 3px) ✓
- Bar radius: pill radius from ProgressBar base ✓ (matches TDS usage chart)
- Track color: fixed from broken borderMuted → borderSubtle ✓
- Pending opacity: 0.4 → 0.3 ✓ (matches TDS estimate segment)
