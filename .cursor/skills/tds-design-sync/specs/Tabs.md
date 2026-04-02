# Tabs Design Spec

> Extracted from TDS `src/design-system/components/Tabs/Tabs.tsx`
> thaki-shared target: `src/components/Tabs/`

## 구조 차이

| 항목            | TDS                                        | thaki-shared                          |
| --------------- | ------------------------------------------ | ------------------------------------- |
| 아키텍처        | Compound (Tabs + TabList + Tab + TabPanel) | Monolithic (Tabs + Tab children)      |
| variant 이름    | `underline` / `boxed`                      | `line` / `button`                     |
| size 기본값     | `sm`                                       | `md`                                  |
| Tab 식별자      | `value` prop                               | `id` prop                             |
| Content padding | `pt-6` (24px) via `--tabs-panel-padding`   | `pt-6` (24px)                         |
| 스크롤 기능     | 없음                                       | 있음 (ChevronLeft/Right 버튼)         |
| fullWidth       | 없음                                       | 있음 (`fullWidth` prop)               |
| persistence     | 없음                                       | 있음 (`destroy` / `css` / `activity`) |

> 구조/API 차이는 디자인 싱크 범위 밖. **스타일만 비교**합니다.

## Base Styles

| Property            | TDS                                | thaki-shared    | Match |
| ------------------- | ---------------------------------- | --------------- | ----- |
| Container           | `flex flex-col h-fit`              | `flex flex-col` | ~same |
| Content padding-top | `var(--tabs-panel-padding)` = 24px | `pt-6` = 24px   | exact |

## Underline (line) Variant

### TabList (Header)

| Property      | TDS                                                                | thaki-shared                            | Match             |
| ------------- | ------------------------------------------------------------------ | --------------------------------------- | ----------------- |
| display       | `flex`                                                             | `inline-flex items-start`               | diff              |
| gap           | `var(--tabs-gap)` = 8px                                            | `gap-lg` = 24px                         | **DIFF**          |
| border-bottom | `after:h-px after:bg-[var(--color-border-default)]` (1px, #e2e8f0) | `border-b border-border` (1px, #e2e8f0) | ~same (구현 차이) |

### Tab Button (line)

| Property    | TDS                                                        | thaki-shared                              | Match         |
| ----------- | ---------------------------------------------------------- | ----------------------------------------- | ------------- |
| layout      | `flex flex-col items-center`                               | `flex flex-col items-center`              | exact         |
| padding     | `px-[var(--tabs-padding-x)] py-0` = `px-12px py-0` (label) | `px-3 pt-0 pb-3` = `px-12px pt-0 pb-12px` | **DIFF** (pb) |
| min-width   | `var(--tabs-min-width)` = 80px                             | `min-w-[80px]` = 80px                     | exact         |
| font-weight | `font-medium` (500)                                        | `font-medium` (500)                       | exact         |
| cursor      | `cursor-pointer`                                           | `cursor-pointer`                          | exact         |
| transition  | `duration-[var(--duration-fast)]` = 150ms                  | `duration-normal` = 200ms                 | **DIFF**      |
| disabled    | `cursor-not-allowed opacity-50`                            | `opacity-disabled cursor-not-allowed`     | ~same         |

### Tab Button (line) — 인디케이터

| Property              | TDS                                       | thaki-shared                   | Match            |
| --------------------- | ----------------------------------------- | ------------------------------ | ---------------- |
| 위치                  | 별도 `<span>` 하단 (z-20)                 | `after` pseudo-element         | diff (구현 차이) |
| height                | `var(--tabs-indicator-height)` = 2px      | `after:h-[2px]` = 2px          | exact            |
| active color          | `var(--tabs-indicator-color)` = `#2563eb` | `after:bg-primary` = `#2563eb` | exact            |
| inactive              | `bg-transparent`                          | `after:bg-transparent`         | exact            |
| gap (label↔indicator) | `var(--tabs-indicator-gap)` = 10px        | 없음 (pb-3=12px가 간격 역할)   | **DIFF**         |

### Tab Button (line) — Typography

| Size | Property    | TDS                                 | thaki-shared       | Match    |
| ---- | ----------- | ----------------------------------- | ------------------ | -------- |
| sm   | font-size   | `var(--tabs-font-size-sm)` = 12px   | `text-14` = 14px   | **DIFF** |
| sm   | line-height | `var(--tabs-line-height-sm)` = 16px | `leading-5` = 20px | **DIFF** |
| md   | font-size   | `var(--tabs-font-size-md)` = 14px   | `text-14` = 14px   | exact    |
| md   | line-height | `var(--tabs-line-height-md)` = 20px | `leading-5` = 20px | exact    |

### Tab Button (line) — Colors

| State    | Property | TDS                                                     | thaki-shared                        | Match    |
| -------- | -------- | ------------------------------------------------------- | ----------------------------------- | -------- |
| inactive | text     | `var(--tabs-inactive-color)` = `#64748b` (text-subtle)  | `text-text-subtle` = `#64748b`      | exact    |
| hover    | text     | `var(--tabs-hover-color)` = `#0f172a` (text-default)    | `hover:text-text-muted` = `#475569` | **DIFF** |
| active   | text     | `var(--tabs-active-color)` = `#2563eb` (action-primary) | `text-primary` = `#2563eb`          | exact    |

## Boxed (button) Variant

### TabList (Header) — boxed

| Property      | TDS                                                  | thaki-shared                       | Match                        |
| ------------- | ---------------------------------------------------- | ---------------------------------- | ---------------------------- |
| display       | `inline-flex items-center`                           | `inline-flex items-start`          | diff (align)                 |
| background    | `var(--color-surface-subtle)` = `#f8fafc`            | `bg-surface-subtle` = `#f8fafc`    | exact                        |
| border        | `shadow: inset 0 0 0 1px var(--color-border-subtle)` | `border border-border` (`#e2e8f0`) | **DIFF** (subtle vs default) |
| border-radius | `rounded-lg` = 8px                                   | `rounded-base6` = 6px              | **DIFF**                     |
| padding       | `p-1` = 4px                                          | `p-1` = 4px                        | exact                        |
| gap           | `gap-1` = 4px                                        | `gap-2` = 8px                      | **DIFF**                     |
| height        | `h-10` = 40px                                        | auto (content-based)               | **DIFF**                     |
| width         | `w-fit`                                              | `w-full`                           | **DIFF**                     |

### Tab Button (button) — Base

| Property      | TDS                 | thaki-shared               | Match     |
| ------------- | ------------------- | -------------------------- | --------- |
| min-width     | `80px`              | `80px` (sm) / `100px` (md) | diff (md) |
| border-radius | `rounded-md` = 6px  | `rounded-base6` = 6px      | exact     |
| font-weight   | `font-medium` (500) | `font-medium` (500)        | exact     |

### Tab Button (button) — Size

| Size | Property    | TDS                              | thaki-shared                                  | Match          |
| ---- | ----------- | -------------------------------- | --------------------------------------------- | -------------- |
| sm   | font-size   | 12px (via `--tabs-font-size-sm`) | `text-12` = 12px                              | exact          |
| sm   | line-height | 16px                             | `leading-4` = 16px                            | exact          |
| sm   | padding     | `px-3 h-8` (fixed h=32px)        | `py-[3px] px-2` → height=24px                 | **DIFF**       |
| md   | font-size   | 14px (via `--tabs-font-size-md`) | `text-14` = 14px                              | exact          |
| md   | line-height | 20px                             | `leading-5` = 20px                            | exact          |
| md   | padding     | `px-3 h-8` (fixed h=32px)        | `py-[5px] px-2.5 min-w-[100px]` → height=32px | exact (height) |

### Tab Button (button) — Colors

| State          | Property | TDS                                                                          | thaki-shared                         | Match               |
| -------------- | -------- | ---------------------------------------------------------------------------- | ------------------------------------ | ------------------- |
| inactive       | bg       | `bg-transparent`                                                             | `bg-surface-subtle`                  | **DIFF**            |
| inactive       | text     | `var(--color-text-default)` = `#0f172a`                                      | `text-text` = `#0f172a`              | exact               |
| inactive hover | bg       | `hover:bg-[var(--color-surface-default)]` = `#ffffff`                        | `hover:bg-border-subtle` = `#f1f5f9` | **DIFF**            |
| active         | bg       | `var(--color-surface-default)` = `#ffffff`                                   | `bg-surface` = `#ffffff`             | exact               |
| active         | text     | `var(--color-action-primary)` = `#2563eb`                                    | `text-primary` = `#2563eb`           | exact               |
| active         | border   | `inset 0 0 0 1px var(--color-border-default)` + `0 1px 2px rgba(0,0,0,0.05)` | `border-border`                      | ~same (shadow 차이) |

## 주요 디자인 차이 요약

| #   | 항목                          | TDS 값                           | thaki-shared 값         | 유형         | 우선순위            |
| --- | ----------------------------- | -------------------------------- | ----------------------- | ------------ | ------------------- |
| 1   | line variant gap (탭 간 간격) | 8px                              | 24px (`gap-lg`)         | style        | HIGH                |
| 2   | line sm font-size             | 12px                             | 14px                    | style        | HIGH                |
| 3   | line sm line-height           | 16px                             | 20px                    | style        | HIGH                |
| 4   | line hover text color         | `#0f172a` (text-default)         | `#475569` (text-muted)  | style        | MED                 |
| 5   | line transition duration      | 150ms                            | 200ms                   | style        | LOW                 |
| 6   | line tab padding-bottom       | 0px (label) + indicator gap 10px | pb-3 (12px)             | style        | MED                 |
| 7   | boxed container border-radius | 8px (rounded-lg)                 | 6px (rounded-base6)     | style        | MED                 |
| 8   | boxed container gap           | 4px                              | 8px                     | style        | MED                 |
| 9   | boxed container border color  | border-subtle (#f1f5f9)          | border (#e2e8f0)        | style        | LOW                 |
| 10  | boxed container height        | 40px (h-10)                      | auto                    | style        | MED                 |
| 11  | boxed container width         | w-fit                            | w-full                  | style        | MED                 |
| 12  | boxed sm height               | 32px                             | 24px                    | style        | HIGH                |
| 13  | boxed inactive bg             | transparent                      | surface-subtle          | style        | MED                 |
| 14  | boxed inactive hover bg       | surface-default (#fff)           | border-subtle (#f1f5f9) | style        | MED                 |
| 15  | size 기본값                   | sm                               | md                      | api-required | HIGH                |
| 16  | variant 이름                  | underline/boxed                  | line/button             | api-required | — (alias 이미 존재) |

## Props 기본값 비교

| Prop      | TDS         | thaki-shared | 영향                                                   |
| --------- | ----------- | ------------ | ------------------------------------------------------ |
| size      | `sm`        | `md`         | 기본 상태에서 font-size 차이 (TDS: 12px, shared: 14px) |
| variant   | `underline` | `line`       | 이름만 다름, TDS에 alias 존재                          |
| fullWidth | N/A         | `true`       | 구조 차이, 디자인 싱크 범위 밖                         |

## 아이콘 비교

| 아이콘            | TDS  | thaki-shared       | 비고                                |
| ----------------- | ---- | ------------------ | ----------------------------------- |
| ChevronLeft/Right | 없음 | 스크롤 버튼에 사용 | TDS에 스크롤 기능 없음, 변경 불필요 |

## Token Mapping

| TDS Token                 | Resolved               | thaki-shared 대응           | Match     |
| ------------------------- | ---------------------- | --------------------------- | --------- |
| `--tabs-gap`              | 8px (`--spacing-2`)    | `gap-lg` = 24px             | **DIFF**  |
| `--tabs-padding-x`        | 12px (`--spacing-3`)   | `px-3` = 12px               | exact     |
| `--tabs-indicator-gap`    | 10px (`--spacing-2-5`) | N/A (pb로 대체)             | 구현 차이 |
| `--tabs-indicator-height` | 2px                    | `after:h-[2px]` = 2px       | exact     |
| `--tabs-panel-padding`    | 24px (`--spacing-6`)   | `pt-6` = 24px               | exact     |
| `--tabs-font-size-sm`     | 12px                   | 14px (`text-14`)            | **DIFF**  |
| `--tabs-line-height-sm`   | 16px                   | 20px (`leading-5`)          | **DIFF**  |
| `--tabs-font-size-md`     | 14px                   | 14px (`text-14`)            | exact     |
| `--tabs-line-height-md`   | 20px                   | 20px (`leading-5`)          | exact     |
| `--tabs-active-color`     | #2563eb                | `text-primary`              | exact     |
| `--tabs-inactive-color`   | #64748b                | `text-text-subtle`          | exact     |
| `--tabs-hover-color`      | #0f172a                | `text-text-muted` (#475569) | **DIFF**  |
| `--tabs-indicator-color`  | #2563eb                | `after:bg-primary`          | exact     |
| `--tabs-min-width`        | 80px                   | 80px                        | exact     |
| `--color-border-default`  | #e2e8f0                | `border-border`             | exact     |
| `--color-surface-subtle`  | #f8fafc                | `bg-surface-subtle`         | exact     |
| `--radius-lg`             | 8px                    | N/A (boxed uses base6=6px)  | **DIFF**  |
