# Chip (Tag) Design Spec

> Extracted from TDS `src/design-system/components/Chip/Chip.tsx`
> thaki-shared target: `src/components/Tag/` (Storybook title: `Data Display/Chip`)

## 매핑 관계

| TDS                  | thaki-shared            | 비고                                                                        |
| -------------------- | ----------------------- | --------------------------------------------------------------------------- |
| Chip                 | Tag                     | component-map에서 "미대응 — TDS 고유"였으나, thaki-shared Tag가 실질적 대응 |
| `variant="default"`  | `variant="filter"`      | 동일 역할 (필터 태그)                                                       |
| `variant="selected"` | `variant="multiSelect"` | **시각적으로 완전히 다름**                                                  |

## Base Styles

| Property                   | TDS Value | TDS Token                                 | thaki-shared Value | thaki-shared Token                             | Match    |
| -------------------------- | --------- | ----------------------------------------- | ------------------ | ---------------------------------------------- | -------- |
| border-radius              | 6px       | `--chip-radius` → `--radius-md`           | 6px                | `rounded-base6` → `--semantic-radius-base6`    | exact    |
| font-size                  | 11px      | `--chip-font-size` → `--font-size-11`     | 11px               | `text-11` → `--semantic-font-size11`           | exact    |
| line-height                | 16px      | `--chip-line-height` → `--line-height-16` | 16px               | `leading-16` → `--semantic-font-lineHeight16`  | exact    |
| font-weight                | 500       | `font-medium`                             | 500                | `font-medium` → `--semantic-font-weightMedium` | exact    |
| gap                        | 6px       | `--chip-gap` → `--spacing-1-5`            | 6px                | `gap-1.5` → `--primitive-space-1-5`            | exact    |
| padding-y                  | 4px       | `--chip-padding-y` → `--spacing-1`        | 4px                | `py-1` → `--primitive-space-1`                 | exact    |
| padding-left               | 8px       | `--chip-padding-left` → `--spacing-2`     | 8px                | `ps-2` → `--primitive-space-2`                 | exact    |
| padding-right (with close) | 6px       | `--chip-padding-right` → `--spacing-1-5`  | 6px                | `pe-1.5` → `--primitive-space-1-5`             | exact    |
| padding-right (no close)   | **8px**   | `--chip-padding-left` → `--spacing-2`     | **6px**            | `pe-1.5` (always)                              | **DIFF** |
| separator gap (inner)      | 4px       | `gap-1`                                   | 4px                | `gap-1` → `--primitive-space-1`                | exact    |
| whitespace                 | default   | —                                         | `nowrap`           | `whitespace-nowrap`                            | **DIFF** |

## Variants

### variant="default" ↔ variant="filter"

| Property   | TDS                                  | thaki-shared              | Match          |
| ---------- | ------------------------------------ | ------------------------- | -------------- |
| background | `#ffffff` (`--chip-bg`)              | `#ffffff` (`bg-surface`)  | exact          |
| border     | `#e2e8f0` via `box-shadow inset 1px` | `#e2e8f0` via `border`    | exact (visual) |
| text       | `#0f172a` (`--color-text-default`)   | `#171717` (`text-text`)   | token-global   |
| separator  | `#e2e8f0` (`--chip-separator-color`) | `#e2e8f0` (`text-border`) | exact          |

### variant="selected" ↔ variant="multiSelect"

| Property   | TDS `selected`                       | thaki-shared `multiSelect`         | Match          |
| ---------- | ------------------------------------ | ---------------------------------- | -------------- |
| background | `#ffffff` (same as default)          | `#2563eb` (`bg-primary`)           | **MAJOR DIFF** |
| border     | `#2563eb` (`--chip-border-selected`) | `#2563eb` (`border-primary`)       | exact          |
| text       | `#0f172a` (same as default)          | `#ffffff` (`text-text-inverse`)    | **MAJOR DIFF** |
| separator  | `#e2e8f0` (same)                     | `opacity-[0.64] text-text-inverse` | **DIFF**       |

## Close Button 비교

| Property      | TDS                                                         | thaki-shared                                       | Match    |
| ------------- | ----------------------------------------------------------- | -------------------------------------------------- | -------- |
| icon          | `IconX` (Tabler) size=12 stroke=2                           | `CloseSmallIcon` (wrapped `IconX`) size=12         | exact    |
| padding       | `p-0.5` (2px)                                               | `p-0`                                              | **DIFF** |
| margin        | `-mr-0.5` (-2px)                                            | none                                               | **DIFF** |
| border-radius | `rounded-sm` (2px)                                          | `rounded-full` (9999px)                            | **DIFF** |
| hover         | `hover:text-[var(--color-text-muted)]` (#475569)            | `hover:opacity-[0.64]`                             | **DIFF** |
| transition    | `transition-colors duration-[var(--duration-fast)]` (150ms) | `transition-opacity duration-200 ease-out`         | **DIFF** |
| focus         | `focus:ring-1 ring-[var(--color-border-focus)]`             | `focus-visible:ring-1 ring-blue-500 ring-offset-1` | **DIFF** |

## Interactive States

| State               | 조건                | TDS 스타일                         | thaki-shared 스타일           | Match   |
| ------------------- | ------------------- | ---------------------------------- | ----------------------------- | ------- |
| disabled            | `disabled === true` | `opacity-50 cursor-not-allowed`    | (없음 — disabled prop 미지원) | **N/A** |
| maxWidth truncation | `maxWidth` prop     | `max-w-full truncate` + title attr | (없음 — maxWidth 미지원)      | **N/A** |
| icon                | `icon` prop         | left icon slot                     | (없음 — icon 미지원)          | **N/A** |

## 아이콘 비교

| 아이콘    | TDS 구현         | size | stroke          | thaki-shared 구현                  | Match |
| --------- | ---------------- | ---- | --------------- | ---------------------------------- | ----- |
| close (X) | `IconX` (Tabler) | 12   | 2 (strokeWidth) | `CloseSmallIcon` (wrapped `IconX`) | exact |

## 주요 디자인 차이 요약

| #   | 항목                     | TDS                        | thaki-shared                         | 변경 유형      | 영향 범위                    | 마이그레이션            |
| --- | ------------------------ | -------------------------- | ------------------------------------ | -------------- | ---------------------------- | ----------------------- |
| 1   | Close button hover       | `text-muted` 색상 변화     | `opacity-[0.64]`                     | `style`        | —                            | —                       |
| 2   | Close button radius      | `rounded-sm` (2px)         | `rounded-full`                       | `style`        | —                            | —                       |
| 3   | Close button padding     | `p-0.5 -mr-0.5`            | `p-0`                                | `style`        | —                            | —                       |
| 4   | Close button transition  | `transition-colors 150ms`  | `transition-opacity 200ms`           | `style`        | —                            | —                       |
| 5   | Close button focus       | `focus:ring-1` (no offset) | `focus-visible:ring-1 ring-offset-1` | `style`        | —                            | —                       |
| 6   | Padding-right (no close) | `8px` (symmetric)          | `6px` (asymmetric)                   | `style`        | —                            | —                       |
| 7   | `selected` variant       | white bg + blue border     | blue bg + white text                 | `api-required` | multiSelect 사용처 시각 변화 | 별도 API 추가/변경 필요 |
| 8   | Text color               | `#0f172a` (slate900)       | `#171717` (trueGray900)              | `token-global` | —                            | —                       |
| 9   | whitespace               | default (wrap)             | `nowrap`                             | `style`        | —                            | —                       |

## Token Mapping (참조)

| TDS Token                                           | Resolved  | thaki-shared Token                             | Match |
| --------------------------------------------------- | --------- | ---------------------------------------------- | ----- |
| `--chip-bg` → `--color-surface-default`             | `#ffffff` | `bg-surface` → `--semantic-color-surface`      | exact |
| `--chip-border` → `--color-border-default`          | `#e2e8f0` | `border-border` → `--semantic-color-border`    | exact |
| `--chip-separator-color` → `--color-border-default` | `#e2e8f0` | `text-border` → `--semantic-color-border`      | exact |
| `--chip-border-selected` → `--color-action-primary` | `#2563eb` | `border-primary` → `--semantic-color-primary`  | exact |
| `--chip-radius` → `--radius-md`                     | `6px`     | `rounded-base6` → `--semantic-radius-base6`    | exact |
| `--chip-gap` → `--spacing-1-5`                      | `6px`     | `gap-1.5` → `--primitive-space-1-5`            | exact |
| `--chip-padding-y` → `--spacing-1`                  | `4px`     | `py-1` → `--primitive-space-1`                 | exact |
| `--chip-padding-left` → `--spacing-2`               | `8px`     | `ps-2` → `--primitive-space-2`                 | exact |
| `--chip-padding-right` → `--spacing-1-5`            | `6px`     | `pe-1.5` → `--primitive-space-1-5`             | exact |
| `--chip-font-size` → `--font-size-11`               | `11px`    | `text-11` → `--semantic-font-size11`           | exact |
| `--chip-line-height` → `--line-height-16`           | `16px`    | `leading-16` → `--semantic-font-lineHeight16`  | exact |
| `--color-text-muted`                                | `#475569` | `text-muted` → `--semantic-color-textMuted`    | exact |
| `--duration-fast`                                   | `150ms`   | `duration-fast` → `--semantic-transition-fast` | exact |
