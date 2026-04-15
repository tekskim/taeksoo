# Slider (Range) Design Spec

> Extracted from TDS `src/design-system/components/Slider/Slider.tsx`
> thaki-shared target: `src/components/Range/`

## 구현 방식 차이 (Critical)

| 항목        | TDS (Slider)                                          | thaki-shared (Range)                                        |
| ----------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| 구현        | Custom `<div>` 기반 (thumb, track, fill 각각 div)     | Native `<input type="range">` + pseudo-element 스타일링     |
| 듀얼 모드   | 별도 컴포넌트 (`RangeSlider`)                         | 동일 컴포넌트의 `dual` prop                                 |
| 스타일 방식 | CSS 변수 (`var(--slider-*)`)                          | CVA + Tailwind arbitrary variants (`[&::-webkit-slider-*]`) |
| 값 표시     | `showValue` + `formatValue` props                     | `unit` + `addNumberInput` props                             |
| 너비        | 220px 고정 (`--slider-track-width`), `fullWidth` 옵션 | `width` prop (CSS width), 기본 full width                   |

> 구현 방식이 근본적으로 다르므로, 디자인 싱크는 **시각적 토큰 정렬**에 집중합니다.

## Base Styles — Track

| Property           | TDS Value                          | TDS Token                               | Shared Value                              | Shared Token       | Match                                   |
| ------------------ | ---------------------------------- | --------------------------------------- | ----------------------------------------- | ------------------ | --------------------------------------- |
| height             | 6px                                | `--slider-track-height`                 | 6px                                       | `h-1.5`            | ✅ exact                                |
| border-radius      | 8px                                | `--slider-track-radius` → `--radius-lg` | 9999px                                    | `rounded-full`     | ⚠️ 시각적 동일 (6px 높이에서 차이 없음) |
| background (empty) | `--color-border-subtle` (#f1f5f9)  | `--slider-track-bg`                     | `--semantic-color-borderSubtle` (#f1f5f9) | `bg-border-subtle` | ✅ exact                                |
| background (fill)  | `--color-action-primary` (#2563eb) | `--slider-fill-bg`                      | `--semantic-color-primary` (#2563eb)      | `bg-primary`       | ✅ exact                                |

## Base Styles — Thumb

| Property      | TDS Value                                                     | TDS Token                                          | Shared Value                    | Shared Token                                               | Match              |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------- | ------------------------------- | ---------------------------------------------------------- | ------------------ |
| size          | 16px × 16px                                                   | `--slider-thumb-size`                              | 16px × 16px                     | `w-4 h-4`                                                  | ✅ exact           |
| background    | #ffffff                                                       | `--slider-thumb-bg` → `--color-surface-default`    | #ffffff                         | `bg-surface-elevated` → `--semantic-color-surfaceElevated` | ✅ exact (값 동일) |
| border-width  | 3px                                                           | `--slider-thumb-border-width`                      | 3px                             | `border-[3px]`                                             | ✅ exact           |
| border-color  | #2563eb                                                       | `--slider-thumb-border` → `--color-action-primary` | #2563eb                         | `border-primary` → `--semantic-color-primary`              | ✅ exact           |
| border-radius | 9999px                                                        | `rounded-full`                                     | 9999px                          | `rounded-full`                                             | ✅ exact           |
| shadow        | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` | `--slider-thumb-shadow` → `--shadow-sm`            | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `shadow-sm` → `--semantic-shadow-sm`                       | ❌ DIFF            |

## Interactive States

### Hover (thumb)

| Property | TDS  | Shared                     | Diff               |
| -------- | ---- | -------------------------- | ------------------ |
| shadow   | 없음 | `shadow-md` (0 4px 6px...) | ❌ shared에만 있음 |
| scale    | 없음 | `scale-110`                | ❌ shared에만 있음 |

### Active / Dragging (thumb)

| Property | TDS               | Shared                       | Diff               |
| -------- | ----------------- | ---------------------------- | ------------------ |
| cursor   | `cursor-grabbing` | `cursor-grabbing`            | ✅                 |
| shadow   | 없음              | `shadow-lg` (0 10px 15px...) | ❌ shared에만 있음 |
| scale    | 없음              | `scale-[1.15]`               | ❌ shared에만 있음 |

### Focus

| Property | TDS                                       | Shared                                                                        | Diff                              |
| -------- | ----------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------- |
| 방식     | `focus:ring-2 ring-offset-1` on thumb div | `focus-visible:outline-2 outline-offset-1` on input + `shadow ring` on pseudo | ❌ 구현 다름                      |
| 색상     | `--color-action-primary` (#2563eb)        | `outline-border-focus` → `--semantic-color-borderFocus` (#3b82f6 blue500)     | ⚠️ 색상 차이 (blue600 vs blue500) |
| 추가 링  | 없음                                      | `shadow-[0_0_0_16px_var(--semantic-color-primarySubtle)]`                     | ❌ `primarySubtle` 토큰 미정의!   |

### Disabled

| Property    | TDS                  | Shared                | Match               |
| ----------- | -------------------- | --------------------- | ------------------- |
| opacity     | 0.50                 | 0.50                  | ✅                  |
| cursor      | `cursor-not-allowed` | `cursor-not-allowed`  | ✅                  |
| interaction | —                    | `pointer-events-none` | ⚠️ shared가 더 강력 |

## Value Display

| Feature   | TDS                                       | Shared                                   |
| --------- | ----------------------------------------- | ---------------------------------------- | ------- |
| 값 라벨   | `showValue` → 우측에 formatted value 표시 | 기본 우측에 `value unit` 라벨 표시       |
| 숫자 입력 | 없음 (외부 NumberInput과 조합)            | `addNumberInput` prop → 내장 NumberInput |
| 단위      | 없음 (formatValue로 커스텀)               | `unit` prop                              |
| 라벨 폰트 | 12px medium, `--color-text-default`       | `text-12 font-medium text-text-muted`    |
| 라벨 색상 | `#0f172a` (text-default)                  | `--semantic-color-textMuted` (#475569)   | ❌ DIFF |

## CSS 구현 기법 차이

| 요소          | TDS 기법                                   | thaki-shared 기법                                                  | 차이 영향                        |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------ | -------------------------------- |
| 슬라이더 전체 | Custom div (track + fill + thumb 각각 div) | Native `<input type="range">` + pseudo-elements                    | 구조적으로 동일한 코드 적용 불가 |
| 트랙 fill     | `<div>` with width% inline style           | WebKit: CSS gradient on track pseudo / Moz: `::moz-range-progress` | 동일 CSS property 사용 불가      |
| 썸 위치       | `left: calc(%)` inline style               | 브라우저 네이티브 위치 계산                                        | —                                |
| 포커스 링     | `ring-*` utility on div                    | `outline-*` on input + `box-shadow` on pseudo                      | —                                |

## 주요 디자인 차이 요약

| #   | 항목                | TDS                                | Shared                            | 유형         | 변경 방향                                        |
| --- | ------------------- | ---------------------------------- | --------------------------------- | ------------ | ------------------------------------------------ |
| 1   | Thumb shadow 기본값 | `--shadow-sm` (0.1 opacity, 두 겹) | `shadow-sm` (0.05 opacity, 한 겹) | token-global | 글로벌 shadow 토큰 정렬 시 해결                  |
| 2   | Hover scale/shadow  | 없음                               | scale-110 + shadow-md             | style        | **TDS에 없는 인터랙션 → 제거 or 유지 판단 필요** |
| 3   | Active scale/shadow | 없음                               | scale-1.15 + shadow-lg            | style        | **TDS에 없는 인터랙션 → 제거 or 유지 판단 필요** |
| 4   | Focus ring 색상     | blue600 (#2563eb)                  | blue500 (#3b82f6)                 | style        | shared를 TDS 색상으로 정렬                       |
| 5   | Focus shadow ring   | 없음                               | `primarySubtle` (토큰 미정의!)    | style        | **토큰 미정의 → 제거 또는 정의 필요**            |
| 6   | 값 라벨 색상        | text-default (#0f172a)             | text-muted (#475569)              | style        | shared를 TDS text-default로 정렬                 |
| 7   | Track radius        | 8px (radius-lg)                    | 9999px (rounded-full)             | style        | 시각적 차이 없음 → 유지 가능                     |

## Token Mapping (참조)

| TDS Token                                          | TDS Resolved | thaki-shared Token                                         | shared Resolved | Match                    |
| -------------------------------------------------- | ------------ | ---------------------------------------------------------- | --------------- | ------------------------ |
| `--slider-track-height` (6px)                      | 6px          | `h-1.5`                                                    | 6px             | ✅ exact                 |
| `--slider-track-bg` → `--color-border-subtle`      | #f1f5f9      | `bg-border-subtle` → `--semantic-color-borderSubtle`       | #f1f5f9         | ✅ exact                 |
| `--slider-fill-bg` → `--color-action-primary`      | #2563eb      | `bg-primary` → `--semantic-color-primary`                  | #2563eb         | ✅ exact                 |
| `--slider-thumb-bg` → `--color-surface-default`    | #ffffff      | `bg-surface-elevated` → `--semantic-color-surfaceElevated` | #ffffff         | ✅ exact                 |
| `--slider-thumb-border` → `--color-action-primary` | #2563eb      | `border-primary` → `--semantic-color-primary`              | #2563eb         | ✅ exact                 |
| `--slider-thumb-shadow` → `--shadow-sm`            | 0 1px 3px... | `shadow-sm` → `--semantic-shadow-sm`                       | 0 1px 2px...    | ❌ DIFF (글로벌 토큰)    |
| `--color-text-default`                             | #0f172a      | `text-text-muted` → `--semantic-color-textMuted`           | #475569         | ❌ DIFF (다른 토큰 사용) |
| —                                                  | —            | `--semantic-color-primarySubtle`                           | **미정의**      | ❌ 토큰 없음             |
