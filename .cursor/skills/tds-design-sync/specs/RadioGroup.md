# RadioGroup Design Spec

> Extracted from TDS `src/design-system/components/Radio/Radio.tsx` + `RadioGroup.tsx`
> thaki-shared target: `src/components/RadioButton/` + `src/components/RadioGroup/`

## 구조 비교

| 항목                | TDS                                               | thaki-shared                               |
| ------------------- | ------------------------------------------------- | ------------------------------------------ |
| Radio 컴포넌트      | `Radio`                                           | `RadioButton`                              |
| RadioGroup 컴포넌트 | `RadioGroup`                                      | `RadioGroup`                               |
| Radio 구현 방식     | hidden input + custom span (커스텀 원)            | native input with CSS (control-input)      |
| checked 표현        | border-width 변경 (5px border = 파란 원 + 흰 dot) | background-color 변경 + ::after pseudo dot |

## RadioButton (개별 라디오)

### Base Styles

| Property          | TDS Value | TDS Token                                          | shared Value                            | shared Token            | Match  |
| ----------------- | --------- | -------------------------------------------------- | --------------------------------------- | ----------------------- | ------ |
| radio size        | 16px      | `--radio-size`                                     | 16px (`size-4`)                         | `radioInputVariants.md` | exact  |
| radio ↔ label gap | 6px       | `--radio-gap` (→ `--spacing-1-5`)                  | 6px (`gap-1.5`)                         | hardcoded               | exact  |
| label font-size   | 12px      | `--radio-label-size` (→ `--font-size-12`)          | 12px (`text-12`)                        | hardcoded               | exact  |
| label line-height | 16px      | `--radio-label-line-height` (→ `--line-height-16`) | 16px (`leading-16`)                     | hardcoded               | exact  |
| label font-weight | 400       | `font-normal`                                      | 400 (`font-normal`)                     | hardcoded               | exact  |
| label color       | #0f172a   | `--radio-label-color` (→ `--color-text-default`)   | `text-text` (→ `--semantic-color-text`) | semantic token          | likely |
| cursor            | pointer   | explicit                                           | pointer                                 | explicit                | exact  |
| transition        | 150ms     | `--duration-fast`                                  | 150ms (`transition: all 150ms ease`)    | hardcoded               | exact  |

### Unchecked State

| Property      | TDS Value          | TDS Token                                | shared Value                              | shared Token | Match    |
| ------------- | ------------------ | ---------------------------------------- | ----------------------------------------- | ------------ | -------- |
| background    | #ffffff            | `--radio-bg` (→ `--color-white`)         | `--semantic-color-surface` (#fff)         | semantic     | exact    |
| border-width  | 1.5px              | `--radio-border-width`                   | 1px                                       | hardcoded    | **DIFF** |
| border-color  | #cbd5e1 (slate300) | `--radio-border` (→ `--color-slate-300`) | `--semantic-color-borderStrong` (#cbd5e1) | semantic     | exact    |
| border-radius | 50%                | `rounded-full`                           | 50% (`rounded-full`)                      | —            | exact    |

### Hover State

| Property     | TDS Value | TDS Token                                           | shared Value                         | shared Token | Match |
| ------------ | --------- | --------------------------------------------------- | ------------------------------------ | ------------ | ----- |
| border-color | #2563eb   | `--radio-border-hover` (→ `--color-action-primary`) | `--semantic-color-primary` (#2563eb) | semantic     | exact |

### Checked State

| Property      | TDS Value                                | shared Value                                 | Match           |
| ------------- | ---------------------------------------- | -------------------------------------------- | --------------- |
| 구현 방식     | border-width: 5px, border-color: primary | bg: primary, border: none, ::after white dot | **구조 다름**   |
| 시각적 결과   | 파란 원 + 흰 중앙 dot                    | 파란 원 + 흰 중앙 dot                        | **시각적 동일** |
| dot size (md) | implicit (16px - 5px\*2 = 6px dot)       | 6px (::after width/height)                   | exact           |

### Focus State

| Property | TDS Value                      | shared Value                         | Match         |
| -------- | ------------------------------ | ------------------------------------ | ------------- |
| TDS      | focus-visible ring (peer 기반) | box-shadow: `0 0 0 2px primaryLight` | **구현 다름** |

### Disabled State

| Property     | TDS Value          | TDS Token                                            | shared Value              | shared Token                    | Match    |
| ------------ | ------------------ | ---------------------------------------------------- | ------------------------- | ------------------------------- | -------- |
| background   | #e2e8f0 (slate200) | `--radio-disabled-bg`                                | blueGray100               | `--primitive-color-blueGray100` | **DIFF** |
| border-color | (same as bg)       | `--radio-disabled-border`                            | `--semantic-color-border` | semantic                        | **DIFF** |
| label color  | #94a3b8 (slate400) | `--radio-label-disabled` (→ `--color-text-disabled`) | `text-text-light`         | —                               | likely   |
| cursor       | not-allowed        | explicit                                             | not-allowed               | explicit                        | exact    |

### Sizes (shared만 해당 — TDS는 단일 크기)

| Size          | shared radio size    | shared dot size | TDS 대응          |
| ------------- | -------------------- | --------------- | ----------------- |
| xs            | 12px (`size-3`)      | 5px             | 없음              |
| sm            | 14px (`size-[14px]`) | 5px             | 없음              |
| **md** (기본) | **16px** (`size-4`)  | **6px**         | **TDS 기본 = md** |
| lg            | 18px (`size-[18px]`) | 7px             | 없음              |

## RadioGroup

### Layout

| Property              | TDS Value | TDS Token                                             | shared Value              | shared Token | Match    |
| --------------------- | --------- | ----------------------------------------------------- | ------------------------- | ------------ | -------- |
| item gap (vertical)   | **8px**   | `--radio-group-item-gap` (→ `--spacing-2`)            | **12px** (`gap-3`)        | hardcoded    | **DIFF** |
| item gap (horizontal) | 16px      | `--radio-group-item-gap-horizontal` (→ `--spacing-4`) | `--semantic-space-inline` | semantic     | likely   |
| fieldset padding      | 0         | `gap-0`                                               | 0 (`p-0`)                 | hardcoded    | exact    |
| fieldset margin       | 0         | implicit                                              | 0 (`m-0`)                 | explicit     | exact    |
| fieldset border       | none      | implicit                                              | none (`border-none`)      | explicit     | exact    |

### Legend (Label)

| Property            | TDS Value | TDS Token                                   | shared Value                                | shared Token     | Match    |
| ------------------- | --------- | ------------------------------------------- | ------------------------------------------- | ---------------- | -------- |
| font-size           | 13px      | `text-label-lg` (FormField에서)             | 14px (`text-sm`)                            | Tailwind default | **DIFF** |
| line-height         | 18px      | `text-label-lg`                             | 20px (`text-sm`)                            | Tailwind default | **DIFF** |
| font-weight         | 500       | `text-label-lg` (medium)                    | 400 (implicit)                              | —                | **DIFF** |
| color               | #0f172a   | `--color-text-default`                      | `text-text-muted`                           | semantic         | **DIFF** |
| label ↔ options gap | 12px      | `--radio-group-label-gap` (→ `--spacing-3`) | `--semantic-space-inline` (`mb-[var(...)]`) | semantic         | likely   |

### Error Message

| Property           | TDS Value | TDS Token                                  | shared Value                              | shared Token     | Match    |
| ------------------ | --------- | ------------------------------------------ | ----------------------------------------- | ---------------- | -------- |
| font-size          | 11px      | `--radio-error-size` (→ `--font-size-11`)  | 12px (`text-xs`)                          | Tailwind default | **DIFF** |
| line-height        | 16px      | `--radio-error-line-height`                | 16px (Tailwind `text-xs`)                 | —                | exact    |
| color              | #ef4444   | `--radio-error-text` (→ `--color-red-500`) | `text-error` (→ `--semantic-color-error`) | semantic         | likely   |
| gap (from options) | 8px       | `--spacing-2` (mt)                         | `--semantic-space-inline` (mt)            | semantic         | likely   |

### Required Indicator

| Property | TDS Value               | shared Value       | Match         |
| -------- | ----------------------- | ------------------ | ------------- |
| 위치     | FormField 레벨에서 처리 | legend 안 앞쪽 `*` | **구현 다름** |
| color    | `--color-state-danger`  | `text-error`       | likely        |

## 주요 디자인 차이 요약

| #   | 항목                           | TDS                        | shared                | 유형    | 변경 내용                                        |
| --- | ------------------------------ | -------------------------- | --------------------- | ------- | ------------------------------------------------ |
| 1   | RadioGroup item gap (vertical) | **8px**                    | 12px                  | `style` | `gap-3` → `gap-2`                                |
| 2   | Radio border-width (unchecked) | **1.5px**                  | 1px                   | `style` | `border: 1px` → `border: 1.5px`                  |
| 3   | Legend font-size               | **13px** (label-lg)        | 14px (text-sm)        | `style` | `text-sm` → `text-[13px] leading-18 font-medium` |
| 4   | Legend font-weight             | **500** (medium)           | 400                   | `style` | 추가: `font-medium`                              |
| 5   | Legend color                   | **text-default** (#0f172a) | text-muted            | `style` | `text-text-muted` → `text-text`                  |
| 6   | Error font-size                | **11px**                   | 12px (text-xs)        | `style` | `text-xs` → `text-11`                            |
| 7   | Disabled bg                    | slate200 (#e2e8f0)         | blueGray100 (#f1f5f9) | `style` | primitive 토큰 차이                              |

## Token Mapping

| TDS Token                                  | TDS Resolved | shared Token                    | shared Resolved         | Match    |
| ------------------------------------------ | ------------ | ------------------------------- | ----------------------- | -------- |
| `--radio-size`                             | 16px         | `size-4` (hardcoded)            | 16px                    | exact    |
| `--radio-gap` (→ `--spacing-1-5`)          | 6px          | `gap-1.5` (hardcoded)           | 6px                     | exact    |
| `--radio-group-item-gap` (→ `--spacing-2`) | 8px          | `gap-3` (hardcoded)             | 12px                    | **DIFF** |
| `--radio-border-width`                     | 1.5px        | `border: 1px` (CSS)             | 1px                     | **DIFF** |
| `--radio-border` (→ `--color-slate-300`)   | #cbd5e1      | `--semantic-color-borderStrong` | #cbd5e1                 | exact    |
| `--radio-checked-border` (→ primary)       | #2563eb      | `--semantic-color-primary`      | #2563eb                 | exact    |
| `--radio-label-size` (→ 12px)              | 12px         | `text-12`                       | 12px                    | exact    |
| `--radio-label-line-height` (→ 16px)       | 16px         | `leading-16`                    | 16px                    | exact    |
| `--radio-label-color` (→ text-default)     | #0f172a      | `text-text`                     | `--semantic-color-text` | likely   |

## 적용 범위 (Apply 대상)

### RadioGroup.styles.ts

1. `gap-3` → `gap-2` (vertical item gap: 12px → 8px)
2. `radioGroupLegendStyles`: `text-sm text-text-muted` → `text-[13px] leading-18 font-medium text-text`
3. `radioGroupErrorStyles`: `text-xs` → `text-11`

### shared-utilities.css (RadioButton)

4. `.control-input` border: `1px` → `1.5px`
5. `.control-input:disabled` background: 검토 필요 (글로벌 영향)

### 적용 제외 (구조 차이 허용)

- Radio checked 구현 방식 (border vs background+::after) — 시각적 결과 동일
- Focus 구현 방식 — 접근성 충족
- Size variants (xs, sm, lg) — TDS는 단일 크기, shared 유지
- Required indicator 위치 — 구조적 차이
