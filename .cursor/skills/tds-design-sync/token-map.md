# Token Map: TDS ↔ thaki-shared

> 이 파일은 TDS 토큰명과 thaki-shared 토큰명의 매핑 테이블입니다.
> **규칙**: thaki-shared 토큰 이름(key)은 변경 금지. 값(value)만 조정 가능.
> **Match**: `exact` (값+역할 일치) | `likely` (역할 일치, 값 확인 필요) | `manual` (불일치, 수동 매핑 필요)

## 1. Action / Primary Colors

| TDS                             | 값        | thaki-shared CSS var            | JSON path                                                 | Match                    |
| ------------------------------- | --------- | ------------------------------- | --------------------------------------------------------- | ------------------------ |
| `--color-action-primary`        | `#2563eb` | `--semantic-color-primary`      | `semantic.color.primary` → `primitive.color.blue600`      | exact                    |
| `--color-action-primary-hover`  | `#1d4ed8` | `--semantic-color-primaryHover` | `semantic.color.primaryHover` → `primitive.color.blue700` | exact                    |
| `--color-action-primary-active` | `#1e40af` | `--semantic-color-primaryFocus` | `semantic.color.primaryFocus` → `primitive.color.blue800` | likely (active vs focus) |
| `--color-action-primary-subtle` | `#eff6ff` | `--semantic-color-infoWeakBg`   | `semantic.color.infoWeakBg` → `primitive.color.blue50`    | exact                    |

## 2. Text Colors

| TDS                       | 값        | thaki-shared CSS var            | JSON path                                                     | Match                                                     |
| ------------------------- | --------- | ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| `--color-text-default`    | `#0f172a` | `--semantic-color-text`         | `semantic.color.text` → `primitive.color.trueGray900`         | manual (JSON: trueGray900=#171717, TDS: slate900=#0f172a) |
| `--color-text-muted`      | `#475569` | `--semantic-color-textMuted`    | `semantic.color.textMuted` → `primitive.color.blueGray600`    | exact                                                     |
| `--color-text-subtle`     | `#64748b` | `--semantic-color-textSubtle`   | `semantic.color.textSubtle` → `primitive.color.blueGray500`   | exact                                                     |
| `--color-text-disabled`   | `#94a3b8` | `--semantic-color-textDisabled` | `semantic.color.textDisabled` → `primitive.color.blueGray400` | exact                                                     |
| `--color-text-on-primary` | `#ffffff` | `--semantic-color-onPrimary`    | `semantic.color.onPrimary` → `primitive.color.white`          | exact                                                     |
| `--color-text-inverse`    | `#ffffff` | `--semantic-color-textInverse`  | `semantic.color.textInverse`                                  | exact                                                     |

## 3. Surface Colors

| TDS                       | 값        | thaki-shared CSS var             | JSON path                                                     | Match |
| ------------------------- | --------- | -------------------------------- | ------------------------------------------------------------- | ----- |
| `--color-surface-default` | `#ffffff` | `--semantic-color-surface`       | `semantic.color.surface` → `primitive.color.white`            | exact |
| `--color-surface-subtle`  | `#f8fafc` | `--semantic-color-surfaceSubtle` | `semantic.color.surfaceSubtle` → `primitive.color.slate50`    | exact |
| `--color-surface-muted`   | `#f1f5f9` | `--semantic-color-surfaceMuted`  | `semantic.color.surfaceMuted` → `primitive.color.blueGray100` | exact |
| `--color-surface-hover`   | `#f1f5f9` | `--semantic-color-surfaceHover`  | `semantic.color.surfaceHover` → `primitive.color.blueGray100` | exact |

## 4. Border Colors

| TDS                      | 값        | thaki-shared CSS var            | JSON path                                                     | Match |
| ------------------------ | --------- | ------------------------------- | ------------------------------------------------------------- | ----- |
| `--color-border-default` | `#e2e8f0` | `--semantic-color-border`       | `semantic.color.border` → `primitive.color.blueGray200`       | exact |
| `--color-border-subtle`  | `#f1f5f9` | `--semantic-color-borderSubtle` | `semantic.color.borderSubtle` → `primitive.color.blueGray100` | exact |
| `--color-border-strong`  | `#cbd5e1` | `--semantic-color-borderStrong` | `semantic.color.borderStrong` → `primitive.color.blueGray300` | exact |
| `--color-border-focus`   | `#3b82f6` | `--semantic-color-focus`        | `semantic.color.focus` → `primitive.color.blue500`            | exact |

## 5. State Colors

| TDS                        | 값        | thaki-shared CSS var                | JSON path                                              | Match                                      |
| -------------------------- | --------- | ----------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `--color-state-info`       | `#2563eb` | `--semantic-color-state-info`       | `semantic.color.info` → `primitive.color.sky600`       | manual (TDS: blue600, shared: sky600)      |
| `--color-state-info-bg`    | `#eff6ff` | `--semantic-color-state-info-bg`    | `primitive.color.blue50`                               | exact                                      |
| `--color-state-success`    | `#22c55e` | `--semantic-color-state-success`    | `semantic.color.success` → `primitive.color.green400`  | manual (TDS: green500, shared: green400)   |
| `--color-state-success-bg` | `#f0fdf4` | `--semantic-color-state-success-bg` | `semantic.color.successBg` → `primitive.color.green50` | exact                                      |
| `--color-state-warning`    | `#f97316` | `--semantic-color-state-warning`    | `semantic.color.warning` → `primitive.color.orange400` | manual (TDS: orange500, shared: orange400) |
| `--color-state-warning-bg` | `#fff7ed` | `--semantic-color-state-warning-bg` | `primitive.color.orange50`                             | manual (JSON warningLight → orange200)     |
| `--color-state-danger`     | `#ef4444` | `--semantic-color-state-danger`     | `semantic.color.danger` → `primitive.color.red400`     | manual (TDS: red500, shared: red400)       |
| `--color-state-danger-bg`  | `#fef2f2` | `--semantic-color-state-danger-bg`  | `semantic.color.dangerBg` → `primitive.color.red50`    | exact                                      |

## 6. Spacing

| TDS             | 값     | thaki-shared CSS var    | JSON path             | Match |
| --------------- | ------ | ----------------------- | --------------------- | ----- |
| `--spacing-0`   | `0`    | `--primitive-space-0`   | `primitive.space.0`   | exact |
| `--spacing-0-5` | `2px`  | `--primitive-space-0-5` | `primitive.space.0-5` | exact |
| `--spacing-1`   | `4px`  | `--primitive-space-1`   | `primitive.space.1`   | exact |
| `--spacing-1-5` | `6px`  | `--primitive-space-1-5` | `primitive.space.1-5` | exact |
| `--spacing-2`   | `8px`  | `--primitive-space-2`   | `primitive.space.2`   | exact |
| `--spacing-2-5` | `10px` | `--primitive-space-2-5` | `primitive.space.2-5` | exact |
| `--spacing-3`   | `12px` | `--primitive-space-3`   | `primitive.space.3`   | exact |
| `--spacing-4`   | `16px` | `--primitive-space-4`   | `primitive.space.4`   | exact |
| `--spacing-5`   | `20px` | `--primitive-space-5`   | `primitive.space.5`   | exact |
| `--spacing-6`   | `24px` | `--primitive-space-6`   | `primitive.space.6`   | exact |
| `--spacing-8`   | `32px` | `--primitive-space-8`   | `primitive.space.8`   | exact |
| `--spacing-10`  | `40px` | `--primitive-space-10`  | `primitive.space.10`  | exact |
| `--spacing-12`  | `48px` | `--primitive-space-12`  | `primitive.space.12`  | exact |
| `--spacing-16`  | `64px` | `--primitive-space-16`  | `primitive.space.16`  | exact |

## 7. Typography

| TDS                      | 값           | thaki-shared CSS var               | JSON path                       | Match               |
| ------------------------ | ------------ | ---------------------------------- | ------------------------------- | ------------------- |
| `--font-size-10`         | `10px`       | `--primitive-font-size-10`         | `primitive.font.size10`         | exact               |
| `--font-size-11`         | `11px`       | `--primitive-font-size-11`         | `primitive.font.size11`         | exact               |
| `--font-size-12`         | `12px`       | `--primitive-font-size-12`         | `primitive.font.size12`         | exact               |
| `--font-size-13`         | `13px`       | `--primitive-font-size-13`         | `primitive.font.size13`         | exact               |
| `--font-size-14`         | `14px`       | `--primitive-font-size-14`         | `primitive.font.size14`         | exact               |
| `--font-size-16`         | `16px`       | `--primitive-font-size-16`         | `primitive.font.size16`         | exact               |
| `--font-weight-regular`  | `400`        | `--primitive-font-weight-regular`  | `primitive.font.weightRegular`  | exact               |
| `--font-weight-medium`   | `500`        | `--primitive-font-weight-medium`   | `primitive.font.weightMedium`   | exact               |
| `--font-weight-semibold` | `600`        | `--primitive-font-weight-semibold` | `primitive.font.weightSemibold` | exact               |
| `--font-sans`            | Mona Sans... | `--semantic-font-family`           | `semantic.font.family`          | likely (stack 차이) |

## 8. Border Radius

| TDS             | 값       | thaki-shared CSS var      | JSON path                             | Match                                    |
| --------------- | -------- | ------------------------- | ------------------------------------- | ---------------------------------------- |
| `--radius-none` | `0`      | `--primitive-radius-none` | `primitive.radius.none`               | exact                                    |
| `--radius-sm`   | `4px`    | `--primitive-radius-base` | `primitive.radius.base` (0.25rem=4px) | manual (이름 차이: TDS sm = shared base) |
| `--radius-md`   | `6px`    | `--primitive-radius-md`   | `primitive.radius.md` (0.375rem)      | exact                                    |
| `--radius-lg`   | `8px`    | `--primitive-radius-lg`   | `primitive.radius.lg` (0.5rem)        | exact                                    |
| `--radius-xl`   | `16px`   | `--primitive-radius-2xl`  | `primitive.radius.2xl` (1rem)         | manual (이름 차이: TDS xl = shared 2xl)  |
| `--radius-full` | `9999px` | `--primitive-radius-full` | `primitive.radius.full`               | exact                                    |

## 9. Duration / Transition

| TDS                 | 값      | thaki-shared CSS var       | JSON path                | Match |
| ------------------- | ------- | -------------------------- | ------------------------ | ----- |
| `--duration-fast`   | `150ms` | `--primitive-duration-150` | `primitive.duration.150` | exact |
| `--duration-normal` | `200ms` | `--primitive-duration-200` | `primitive.duration.200` | exact |
| `--duration-slow`   | `300ms` | `--primitive-duration-300` | `primitive.duration.300` | exact |

## 10. Component: Button

| TDS                                           | 값        | thaki-shared CSS var                       | JSON path                                | Match              |
| --------------------------------------------- | --------- | ------------------------------------------ | ---------------------------------------- | ------------------ |
| `--button-height-sm`                          | `28px`    | `--semantic-control-height-sm`             | `semantic.control.height.sm`             | exact              |
| `--button-height-md`                          | `32px`    | `--semantic-control-height-md`             | `semantic.control.height.md`             | exact              |
| `--button-height-lg`                          | `36px`    | `--semantic-control-height-lg`             | `semantic.control.height.lg`             | exact              |
| `--button-radius`                             | `6px`     | `--semantic-control-radius`                | `semantic.control.radius`                | likely (확인 필요) |
| `--color-action-primary` (button bg)          | `#2563eb` | `--component-button-solid-primary-bg`      | `component.button.solid.primary.bg`      | exact              |
| `--color-action-primary-hover` (button hover) | `#1d4ed8` | `--component-button-solid-primary-bgHover` | `component.button.solid.primary.bgHover` | exact              |
| `--color-text-on-primary` (button text)       | `#ffffff` | `--component-button-solid-primary-text`    | `component.button.solid.primary.text`    | exact              |

## 11. Component: Input

| TDS                 | 값     | thaki-shared CSS var           | JSON path                           | Match                            |
| ------------------- | ------ | ------------------------------ | ----------------------------------- | -------------------------------- |
| `--input-height-sm` | `28px` | `--semantic-control-height-sm` | `semantic.control.height.sm`        | exact                            |
| `--input-height-md` | `32px` | `--semantic-control-height-md` | `semantic.control.height.md`        | exact                            |
| `--input-height-lg` | `40px` | `--semantic-control-height-lg` | `semantic.control.height.lg` (36px) | manual (TDS: 40px, shared: 36px) |
| `--input-radius`    | `6px`  | `--semantic-control-radius`    | `semantic.control.radius`           | likely                           |

## 주의사항: manual 항목

아래 항목들은 thaki-shared 토큰 **값**을 TDS에 맞춰 조정해야 합니다 (이름은 유지):

### 색상 값 불일치

- `semantic.color.text`: trueGray900(`#171717`) → blueGray900(`#0f172a`)로 값 변경 필요
- `semantic.color.info`: sky600(`#0284c7`) → blue600(`#2563eb`)로 값 변경 필요
- `semantic.color.success`: green400 → green500(`#22c55e`)로 값 변경 필요
- `semantic.color.warning`: orange400 → orange500(`#f97316`)로 값 변경 필요
- `semantic.color.danger`: red400 → red500(`#ef4444`)로 값 변경 필요

### Radius 이름 불일치 (값으로 매핑)

- TDS `--radius-sm`(4px) = shared `primitive.radius.base`(4px) — 이름 다르나 값 동일
- TDS `--radius-xl`(16px) = shared `primitive.radius.2xl`(16px) — 이름 다르나 값 동일
- shared `primitive.radius.sm`(2px)은 TDS에 대응 없음

### 컴포넌트 크기 불일치

- Input height lg: TDS 40px vs shared 36px → `semantic.control.height.lg` 값 변경 시 Button lg에도 영향 (캐스케이드)
