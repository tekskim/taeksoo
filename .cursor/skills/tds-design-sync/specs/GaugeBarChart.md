# GaugeBarChart Design Spec

> Extracted from TDS `src/design-system/components/ProgressBar/ProgressBar.tsx` (variant="quota")  
> and `src/pages/design/charts/UsageChartPage.tsx`  
> thaki-shared target: `src/components/GaugeBarChart/`

## Component Mapping

| 항목        | TDS                                             | thaki-shared                                                  |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------- |
| 매핑        | `ProgressBar` (variant="quota")                 | `GaugeBarChart`                                               |
| 스타일 정의 | 인라인 Tailwind 클래스                          | 상수 문자열 (`ROOT_STYLES`, `LABEL_STYLES` 등)                |
| 구조        | `ProgressBar` 단일 컴포넌트 + `variant="quota"` | 별도 `GaugeBarChart` 래퍼 (내부 `ProgressBar` + `Badge` 조합) |

## Base Styles (Card Container)

| Property           | TDS (resolved)                            | thaki-shared                            |
| ------------------ | ----------------------------------------- | --------------------------------------- |
| Container          | 없음 (ProgressBar 자체는 wrapper 없음)    | `rounded-[12px] border-border p-[17px]` |
| Gap (header ↔ bar) | 6px (`gap-1.5`)                           | 4.5px (`gap-[4.5px]`)                   |
| Items gap          | 개별 ProgressBar를 부모 레이아웃에서 제어 | `gap-4` (16px) — `itemGap` prop         |

## Typography

| 항목  | TDS                                                         | thaki-shared                                             |
| ----- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Label | `text-label-sm` = 11px/16px, font-weight 500                | `text-11 font-medium leading-16` = 11px/16px, weight 500 |
| Value | `text-body-sm text-[var(--color-text-default)]` = 11px/16px | `text-11 font-normal leading-16 text-text-muted`         |

**Key diff**: TDS value uses `--color-text-default` (dark), thaki-shared uses `text-text-muted` (lighter).

## Bar Dimensions

| 항목        | TDS                                 | thaki-shared                                    |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| Height      | `var(--progress-bar-height)` = 4px  | 3px (`[&>div]:h-[3px]`)                         |
| Radius      | `var(--progress-bar-radius)` = pill | pill (via ProgressBar)                          |
| Track color | `var(--color-border-subtle)`        | `USAGE_CHART_TRACK_COLOR` (via usageChartUtils) |

## Status Colors

| Status           | TDS                                  | thaki-shared                          |
| ---------------- | ------------------------------------ | ------------------------------------- |
| Safe (0–69%)     | `var(--color-state-success)` #22c55e | `getUsageStatusColor` — green500      |
| Warning (70–89%) | `var(--color-state-warning)` #f97316 | orange500                             |
| Danger (90%+)    | `var(--color-state-danger)` #ef4444  | red500                                |
| Thresholds       | `{ warning: 70, danger: 90 }`        | `{ warning: 70, danger: 90 }` default |

Status colors and thresholds are functionally identical.

## Badge (Percent)

| 항목         | TDS                          | thaki-shared                                                          |
| ------------ | ---------------------------- | --------------------------------------------------------------------- |
| Badge        | 없음 (percent in value text) | `showBadge` prop, `Badge size="sm"` with custom colors                |
| Badge colors | —                            | `!text-[primitive-color-green500] !bg-[primitive-color-green50]` etc. |

TDS does not have a separate percentage badge. thaki-shared has one via `showBadge` prop.

## Estimate Segment

| 항목           | TDS                               | thaki-shared                                   |
| -------------- | --------------------------------- | ---------------------------------------------- |
| Estimate       | `newValue` prop, opacity 0.3      | `showEstimate` + `estimate` prop               |
| Estimate color | Same as status color, opacity 30% | Same as status color via `getUsageStatusColor` |

## Tooltip

| 항목            | TDS                                              | thaki-shared                                  |
| --------------- | ------------------------------------------------ | --------------------------------------------- |
| Tooltip         | Built-in tooltip in ProgressBar (shows Used/New) | `ChartTooltip` component wrapped in `Tooltip` |
| Tooltip styling | `--tooltip-bg`, `--tooltip-text`, `--shadow-md`  | Custom `ChartTooltip` component               |

## 주요 디자인 차이 요약

| #   | 항목                  | Before (thaki-shared)                             | After (TDS)                                             | 유형         |
| --- | --------------------- | ------------------------------------------------- | ------------------------------------------------------- | ------------ |
| 1   | Bar height            | 3px (`[&>div]:h-[3px]`)                           | 4px (`--progress-bar-height`)                           | style        |
| 2   | Header-bar gap        | 4.5px (`gap-[4.5px]`)                             | 6px (`gap-1.5`)                                         | style        |
| 3   | Value text color      | `text-text-muted` (lighter)                       | `text-[var(--color-text-default)]` (dark)               | style        |
| 4   | Container radius      | 12px (`rounded-[12px]`)                           | 8px (`rounded-lg`)                                      | style        |
| 5   | Container padding     | 17px (`p-[17px]`)                                 | 16px (`p-4`)                                            | style        |
| 6   | Badge colors (subtle) | `green50`/`orange50`/`red50` bg, `500`-level text | Badge 자체 없음 (TDS에서는 percent를 value text에 포함) | api-required |
