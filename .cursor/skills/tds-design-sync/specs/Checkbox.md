# Checkbox Design Spec

> Extracted from TDS `src/design-system/components/Checkbox/Checkbox.tsx`
> thaki-shared target: `src/components/Checkbox/`

## Base Styles

| Property        | TDS Value | TDS Token                                 | thaki-shared Value    | Match    |
| --------------- | --------- | ----------------------------------------- | --------------------- | -------- |
| size (w × h)    | 16px      | `--checkbox-size` (16px)                  | 16px (`size-4`)       | exact    |
| border-radius   | 4px       | `--checkbox-radius` → `--radius-sm` → 4px | 4px (`rounded-[4px]`) | exact    |
| gap (box↔label) | 6px       | `--checkbox-gap` → `--spacing-1-5` → 6px  | 6px (`gap-[6px]`)     | exact    |
| transition      | 150ms     | `--duration-fast` → 150ms                 | 200ms (`0.2s`)        | **DIFF** |
| cursor          | pointer   | —                                         | pointer               | exact    |

## States — Box Appearance

### Unchecked (default)

| Property     | TDS Value                      | TDS Token                                            | thaki-shared Value                                   | Match    |
| ------------ | ------------------------------ | ---------------------------------------------------- | ---------------------------------------------------- | -------- |
| background   | `#ffffff`                      | `--checkbox-bg` → white                              | `var(--semantic-color-surface)` → white              | exact    |
| border       | 1px solid `#cbd5e1` (slate300) | `--checkbox-border` → `--color-border-strong`        | 2px solid `var(--semantic-color-border)` → `#e2e8f0` | **DIFF** |
| hover border | `#2563eb` (blue600)            | `--checkbox-border-hover` → `--color-action-primary` | (no hover style)                                     | **DIFF** |

### Checked

| Property   | TDS Value           | TDS Token                                          | thaki-shared Value                          | Match    |
| ---------- | ------------------- | -------------------------------------------------- | ------------------------------------------- | -------- |
| background | `#2563eb` (blue600) | `--checkbox-checked-bg` → `--color-action-primary` | `var(--semantic-color-primary)` → `#2563eb` | exact    |
| border     | none                | —                                                  | 2px solid `--semantic-color-primary`        | **DIFF** |
| icon color | white               | `--checkbox-icon-color`                            | white (SVG stroke)                          | exact    |

### Indeterminate

| Property   | TDS Value                               | thaki-shared Value | Match    |
| ---------- | --------------------------------------- | ------------------ | -------- |
| background | same as checked                         | (not supported)    | **DIFF** |
| icon       | IconMinus (Tabler, 12px, strokeWidth=3) | (not supported)    | **DIFF** |

### Disabled (unchecked)

| Property   | TDS Value                                | TDS Token                    | thaki-shared Value | Match    |
| ---------- | ---------------------------------------- | ---------------------------- | ------------------ | -------- |
| background | `--color-surface-muted` (`#f1f5f9`)      | `--checkbox-disabled-bg`     | opacity 0.5        | **DIFF** |
| border     | 1px `--color-border-default` (`#e2e8f0`) | `--checkbox-disabled-border` | opacity 0.5        | **DIFF** |
| cursor     | not-allowed                              | —                            | not-allowed        | exact    |

### Disabled (checked)

| Property   | TDS Value            | TDS Token                        | thaki-shared Value                      | Match    |
| ---------- | -------------------- | -------------------------------- | --------------------------------------- | -------- |
| background | `#e2e8f0` (slate200) | `--checkbox-disabled-checked-bg` | `--semantic-color-border` + opacity 0.5 | **DIFF** |
| icon color | `#94a3b8` (slate400) | `--checkbox-icon-disabled`       | white + opacity 0.5                     | **DIFF** |

### Error (unchecked)

| Property   | TDS Value              | TDS Token                 | thaki-shared Value | Match    |
| ---------- | ---------------------- | ------------------------- | ------------------ | -------- |
| background | white                  | `--checkbox-bg`           | (not supported)    | **DIFF** |
| border     | 2px `#ef4444` (red500) | `--checkbox-error-border` | (not supported)    | **DIFF** |

### Error (checked)

| Property   | TDS Value          | TDS Token             | thaki-shared Value | Match    |
| ---------- | ------------------ | --------------------- | ------------------ | -------- |
| background | `#ef4444` (red500) | `--checkbox-error-bg` | (not supported)    | **DIFF** |

## Label Typography

| Property    | TDS Value            | TDS Token                                           | thaki-shared Value                      | Match    |
| ----------- | -------------------- | --------------------------------------------------- | --------------------------------------- | -------- |
| font-size   | 12px                 | `--checkbox-label-size` → `--font-size-12`          | 12px (`text-[12px]`)                    | exact    |
| line-height | 16px                 | `--checkbox-label-line-height` → `--line-height-16` | 16px (`leading-[16px]`)                 | exact    |
| font-weight | 400 (normal)         | —                                                   | 400 (normal)                            | exact    |
| color       | `#0f172a` (slate900) | `--checkbox-label-color` → `--color-text-default`   | `text-text` (→ `--semantic-color-text`) | exact    |
| disabled    | `#94a3b8` (slate400) | `--checkbox-label-disabled`                         | opacity 0.5 (inherited)                 | **DIFF** |

## Description / Error Text (TDS only)

| Element     | font-size | line-height | color                  |
| ----------- | --------- | ----------- | ---------------------- |
| description | 11px      | 16px        | `--color-text-subtle`  |
| error msg   | 11px      | 16px        | `--color-state-danger` |

> thaki-shared Checkbox에는 description, errorMessage 기능이 없음.

## Sizes

| Size | TDS         | thaki-shared                       | Match    |
| ---- | ----------- | ---------------------------------- | -------- |
| —    | 16px (단일) | xs=12px, sm=14px, md=16px, lg=18px | **DIFF** |

> TDS는 단일 사이즈(16px), thaki-shared는 4개 사이즈 variant 지원.

## Checkmark Icon 비교

| 항목         | TDS                                      | thaki-shared                                                                      |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------------------- |
| 구현 방식    | `IconCheck` (Tabler Icons React)         | CSS `::after` pseudo-element + inline SVG                                         |
| check 아이콘 | Tabler IconCheck, size=12, strokeWidth=3 | SVG path `d='M0.75 2.75L3.25 5.25L7.75 0.75'`, viewBox=`0 0 9 6`, strokeWidth=1.5 |
| minus 아이콘 | Tabler IconMinus, size=12, strokeWidth=3 | (not supported — no indeterminate)                                                |
| 색상         | `currentColor` (white via className)     | white (`#ffffff` via SVG stroke)                                                  |

## 주요 디자인 차이 요약

| #   | 항목                     | TDS (Before → After 기준)               | thaki-shared (현재)                     | 중요도 |
| --- | ------------------------ | --------------------------------------- | --------------------------------------- | ------ |
| 1   | Border width (unchecked) | **1px**                                 | **2px**                                 | HIGH   |
| 2   | Border color (unchecked) | `#cbd5e1` (slate300, border-strong)     | `#e2e8f0` (blueGray200, border-default) | HIGH   |
| 3   | Hover state              | border → `#2563eb` (blue600)            | (없음)                                  | HIGH   |
| 4   | Transition duration      | **150ms**                               | **200ms**                               | LOW    |
| 5   | Disabled 처리            | 개별 색상 토큰 (bg, border, icon color) | **opacity: 0.5** (일괄)                 | HIGH   |
| 6   | Indeterminate 지원       | ✅ IconMinus                            | ❌ 미지원                               | HIGH   |
| 7   | Error 상태               | ✅ 빨간 border/bg + errorMessage 텍스트 | ❌ 미지원                               | MED    |
| 8   | Description 텍스트       | ✅ 라벨 아래 설명                       | ❌ 미지원                               | MED    |
| 9   | Size variants            | 단일 (16px)                             | 4개 (xs/sm/md/lg)                       | LOW    |
| 10  | Checkmark 구현           | Tabler IconCheck (React component)      | CSS ::after + inline SVG data URI       | MED    |
| 11  | onChange 시그니처        | `(e: ChangeEvent) => void` (표준)       | `(checked: boolean) => void`            | MED    |

## Token Mapping (참조)

| TDS Token                        | Resolved  | thaki-shared Token                   | Match    |
| -------------------------------- | --------- | ------------------------------------ | -------- |
| `--checkbox-size`                | 16px      | `size-4` (hardcoded 16px)            | exact    |
| `--checkbox-radius`              | 4px       | `rounded-[4px]` (hardcoded)          | exact    |
| `--checkbox-gap`                 | 6px       | `gap-[6px]` (hardcoded)              | exact    |
| `--checkbox-border`              | `#cbd5e1` | `--semantic-color-border` (#e2e8f0)  | **DIFF** |
| `--checkbox-checked-bg`          | `#2563eb` | `--semantic-color-primary` (#2563eb) | exact    |
| `--checkbox-disabled-bg`         | `#f1f5f9` | opacity 0.5 approach                 | **DIFF** |
| `--checkbox-disabled-checked-bg` | `#e2e8f0` | opacity 0.5 approach                 | **DIFF** |
| `--checkbox-label-size`          | 12px      | `text-[12px]`                        | exact    |
| `--checkbox-label-line-height`   | 16px      | `leading-[16px]`                     | exact    |
