# InlineMessage Design Spec

> Extracted from TDS `src/design-system/components/InlineMessage/InlineMessage.tsx`
> thaki-shared target: `src/components/InlineMessage/`

## Base Styles

| Property      | TDS Value        | TDS Token                                           | thaki-shared Value | thaki-shared Token        | Match    |
| ------------- | ---------------- | --------------------------------------------------- | ------------------ | ------------------------- | -------- |
| padding       | 12px             | `--inline-message-padding` → `--spacing-3`          | 12px               | `p-3`                     | exact    |
| gap           | 8px              | `--inline-message-gap` → `--spacing-2`              | 8px                | `gap-2`                   | exact    |
| border-radius | 6px              | `--inline-message-radius` → `--radius-md`           | 8px                | `rounded-base8` → 0.5rem  | **diff** |
| font-size     | 12px             | `--inline-message-font-size` → `--font-size-12`     | 11px               | `text-11` → 0.6875rem     | **diff** |
| line-height   | 16px             | `--inline-message-line-height` → `--line-height-16` | 16px               | `leading-16`              | exact    |
| font-weight   | 400              | regular (implicit)                                  | 400                | `font-normal`             | exact    |
| text-color    | #0f172a          | `--inline-message-text` → `--color-text-default`    | #171717            | `text-text` → trueGray900 | **diff** |
| layout        | flex items-start | —                                                   | flex items-start   | —                         | exact    |

## Variants (Background)

| Variant | TDS BG  | TDS Token           | thaki-shared BG | thaki-shared Token                     | Match |
| ------- | ------- | ------------------- | --------------- | -------------------------------------- | ----- |
| success | #f0fdf4 | `--color-green-50`  | #f0fdf4         | `bg-success-bg` → successBg            | exact |
| info    | #eff6ff | `--color-blue-50`   | #eff6ff         | `bg-info-weak-bg` → infoWeakBg         | exact |
| warning | #fff7ed | `--color-orange-50` | #fff7ed         | `bg-[var(--primitive-color-orange50)]` | exact |
| error   | #fef2f2 | `--color-red-50`    | #fef2f2         | `bg-danger-bg` → dangerBg              | exact |

## Icon Mapping

| Variant | TDS Icon          | TDS Tabler                  | thaki-shared Icon | shared Tabler               | Match       |
| ------- | ----------------- | --------------------------- | ----------------- | --------------------------- | ----------- |
| success | IconCircleCheck   | `@tabler/IconCircleCheck`   | CheckCircleIcon   | `@tabler/IconCircleCheck`   | exact       |
| info    | IconInfoCircle    | `@tabler/IconInfoCircle`    | InfoIcon          | `@tabler/IconInfoCircle`    | exact       |
| warning | IconAlertCircle   | `@tabler/IconAlertCircle`   | AlertIcon         | `@tabler/IconAlertTriangle` | **SWAPPED** |
| error   | IconAlertTriangle | `@tabler/IconAlertTriangle` | AlertCircleIcon   | `@tabler/IconAlertCircle`   | **SWAPPED** |

> **Critical**: TDS와 thaki-shared에서 warning/error 아이콘이 서로 바뀌어 있음.
>
> - TDS: warning=원형(AlertCircle), error=삼각형(AlertTriangle)
> - shared: warning=삼각형(AlertTriangle), error=원형(AlertCircle)

## Icon Styles

| Property    | TDS                                      | thaki-shared | Match    |
| ----------- | ---------------------------------------- | ------------ | -------- |
| size        | 16                                       | 16           | exact    |
| strokeWidth | 1.5 (explicit)                           | default (2)  | **diff** |
| color apply | className `text-[var(...)]`              | `color` prop | **diff** |
| shrink-0    | `<span className="shrink-0">` wraps icon | no wrapper   | **diff** |

## Icon Colors

| Variant | TDS Color | TDS Token            | thaki-shared Color | shared Token               | Match                  |
| ------- | --------- | -------------------- | ------------------ | -------------------------- | ---------------------- |
| success | #16a34a   | `--color-green-600`  | #4ade80            | `--semantic-color-success` | **diff** (600 vs 400)  |
| info    | #2563eb   | `--color-blue-600`   | #0284c7            | `--semantic-color-info`    | **diff** (blue vs sky) |
| warning | #ea580c   | `--color-orange-600` | #fb923c            | `--semantic-color-warning` | **diff** (600 vs 400)  |
| error   | #dc2626   | `--color-red-600`    | #dc2626            | `--semantic-color-error`   | exact                  |

## Interactive States (동적)

없음 — InlineMessage는 정적 표시 컴포넌트 (hover/focus 상태 없음)

> thaki-shared는 `closable`, `expandable`, `timestamp` 기능이 있으나 이는 동작/로직이므로 디자인 싱크 대상 아님.

## 주요 디자인 차이 (Apply 대상)

| #   | 항목                   | Before (thaki-shared)               | After (TDS 기준)                                             | 변경 위치                                                                   | 비고             |
| --- | ---------------------- | ----------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------- |
| 1   | border-radius          | 8px (`rounded-base8`)               | 6px (`rounded-md` or `rounded-[var(--primitive-radius-md)]`) | `InlineMessage.styles.ts` CVA base                                          | radius 변경      |
| 2   | font-size              | 11px (`text-11`)                    | 12px (`text-12`)                                             | `InlineMessage.styles.ts` `.text`                                           | 1px 증가         |
| 3   | text-color             | #171717 (`text-text`)               | #0f172a                                                      | 글로벌 토큰 차이 — InlineMessage에서 변경 불필요 (토큰값 정렬 시 자동 반영) |                  |
| 4   | warning icon           | IconAlertTriangle (`AlertIcon`)     | IconAlertCircle (`AlertCircleIcon`)                          | `InlineMessage.tsx` getIcon()                                               | 아이콘 교체      |
| 5   | error icon             | IconAlertCircle (`AlertCircleIcon`) | IconAlertTriangle (`AlertIcon`)                              | `InlineMessage.tsx` getIcon()                                               | 아이콘 교체      |
| 6   | icon strokeWidth       | default (2)                         | 1.5                                                          | `InlineMessage.tsx` getIcon() 호출 시                                       | 아이콘 prop 추가 |
| 7   | icon color (success)   | #4ade80 (green400)                  | #16a34a (green600)                                           | 글로벌 토큰 차이 — 또는 InlineMessage 전용 토큰으로 오버라이드              |                  |
| 8   | icon color (info)      | #0284c7 (sky600)                    | #2563eb (blue600)                                            | 글로벌 토큰 차이                                                            |                  |
| 9   | icon color (warning)   | #fb923c (orange400)                 | #ea580c (orange600)                                          | 글로벌 토큰 차이                                                            |                  |
| 10  | icon color application | `color` prop                        | `className` with CSS var                                     | 구조 차이 — shared 방식 유지 가능 (시각적 결과가 같으면)                    |                  |

## Token Mapping (참조)

| TDS Token                      | Resolved | thaki-shared Token        | Resolved | Match             |
| ------------------------------ | -------- | ------------------------- | -------- | ----------------- |
| `--inline-message-padding`     | 12px     | p-3 (12px)                | 12px     | exact             |
| `--inline-message-gap`         | 8px      | gap-2 (8px)               | 8px      | exact             |
| `--inline-message-radius`      | 6px      | `--semantic-radius-base8` | 8px      | **diff**          |
| `--inline-message-font-size`   | 12px     | `--semantic-font-size11`  | 11px     | **diff**          |
| `--inline-message-line-height` | 16px     | leading-16 (16px)         | 16px     | exact             |
| `--inline-message-text`        | #0f172a  | `--semantic-color-text`   | #171717  | **diff** (global) |
