# InlineMessage Design Spec

> Extracted from TDS `src/design-system/components/InlineMessage/InlineMessage.tsx`

## Component Mapping

| 항목         | TDS                                                           | thaki-shared                                                                    |
| ------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 매핑         | `InlineMessage`                                               | `InlineMessage`                                                                 |
| 스타일       | 컴포넌트 내 `variantStyles` + CSS 변수 (`--inline-message-*`) | `InlineMessage.styles.ts` (`inlineMessageVariants` cva + `inlineMessageStyles`) |
| Variant 이름 | `variant` (`success` \| `warning` \| `error` \| `info`)       | `type` (동일 4종)                                                               |

## Base Styles

| Property                | Value (TDS resolved) | TDS Token / class                                   |
| ----------------------- | -------------------- | --------------------------------------------------- |
| Layout                  | `flex items-start`   | —                                                   |
| Gap (아이콘–본문)       | 8px                  | `--inline-message-gap` → `--spacing-2`              |
| Padding                 | 12px (전방향)        | `--inline-message-padding` → `--spacing-3`          |
| Border radius           | 6px                  | `--inline-message-radius` → `--radius-md`           |
| 본문 font-size          | 12px                 | `--inline-message-font-size` → `--font-size-12`     |
| 본문 line-height        | 16px                 | `--inline-message-line-height` → `--line-height-16` |
| 본문 text color         | `#0f172a`            | `--inline-message-text` → `--color-text-default`    |
| Transition / focus ring | 없음 (정적 블록)     | —                                                   |
| 래퍼 시맨틱             | `role="status"`      | —                                                   |

**thaki-shared base (CVA 공통):** `flex items-start gap-2 p-3 rounded-base8` — gap **8px**, padding **12px**, radius **`--semantic-radius-base8`** = **0.5rem (8px)**.

**본문 (shared):** `text-11` → `--semantic-font-size11` = **0.6875rem (11px)**, `leading-16` → **16px** 줄간격.

## Variants

배경·아이콘 색은 TDS가 전용 토큰으로 primitive 팔레트를 참조한다.

### variant="success" / type="success"

| 구분       | TDS (resolved)                                                    | thaki-shared                                               |
| ---------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Background | `#f0fdf4` (`--inline-message-success-bg` → `--color-green-50`)    | `bg-success-bg` → `--semantic-color-successBg` **#f0fdf4** |
| Icon color | `#16a34a` (`--inline-message-success-icon` → `--color-green-600`) | `var(--semantic-color-success)` **#22c55e**                |
| Icon       | `IconCircleCheck` (Tabler), size 16, stroke 1.5                   | `CheckCircleIcon` (wrapped), size 16                       |

### variant="info" / type="info"

| 구분       | TDS (resolved)                                                | thaki-shared                                                  |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Background | `#eff6ff` (`--inline-message-info-bg` → `--color-blue-50`)    | `bg-info-weak-bg` → `--semantic-color-infoWeakBg` **#eff6ff** |
| Icon color | `#2563eb` (`--inline-message-info-icon` → `--color-blue-600`) | `var(--semantic-color-info)` **#0284c7** (sky)                |
| Icon       | `IconInfoCircle`, size 16, stroke 1.5                         | `InfoIcon`, size 16                                           |

### variant="warning" / type="warning"

| 구분       | TDS (resolved)                                                     | thaki-shared                                       |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| Background | `#fff7ed` (`--inline-message-warning-bg` → `--color-orange-50`)    | `bg-[var(--primitive-color-orange50)]` — 동일 계열 |
| Icon color | `#ea580c` (`--inline-message-warning-icon` → `--color-orange-600`) | `var(--semantic-color-warning)` **#f97316**        |
| Icon       | **`IconAlertCircle`**                                              | **`AlertIcon`**                                    |

### variant="error" / type="error"

| 구분       | TDS (resolved)                                                | thaki-shared                                             |
| ---------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| Background | `#fef2f2` (`--inline-message-error-bg` → `--color-red-50`)    | `bg-danger-bg` → `--semantic-color-dangerBg` **#fef2f2** |
| Icon color | `#dc2626` (`--inline-message-error-icon` → `--color-red-600`) | `var(--semantic-color-error)` **#ef4444**                |
| Icon       | **`IconAlertTriangle`**                                       | **`AlertCircleIcon`**                                    |

## Sizes

TDS는 단일 밀도만 사용 (size prop 없음).

| 항목        | TDS                        | thaki-shared  |
| ----------- | -------------------------- | ------------- |
| Padding     | 12px                       | `p-3` → 12px  |
| Gap         | 8px                        | `gap-2` → 8px |
| 아이콘 박스 | 16×16 (Tabler `size={16}`) | 16×16         |
| 본문        | 12px / 16px                | 11px / 16px   |

## Interactive States (동적)

| State                 | TDS                                                   | thaki-shared                                                      |
| --------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| variant별 정적 스타일 | `variantStyles[variant]`만 적용                       | CVA `type` 분기                                                   |
| expandable            | `expandable` prop **미구현** (dev에서 `console.warn`) | `expandable` 시 버튼 + chevron 회전, `textCollapsed`로 1줄 말줄임 |
| closable              | `closable` / `onClose` **미구현** (warn)              | 닫기 버튼 + `CloseSmallIcon`                                      |
| timestamp             | 없음                                                  | `timestamp` 노드 별도 표시                                        |

## 아이콘 비교

| Variant | TDS (Tabler)        | size | stroke | thaki-shared      | 비고                    |
| ------- | ------------------- | ---- | ------ | ----------------- | ----------------------- |
| success | `IconCircleCheck`   | 16   | 1.5    | `CheckCircleIcon` | 라이브러리 다름         |
| info    | `IconInfoCircle`    | 16   | 1.5    | `InfoIcon`        | 정보 아이콘 계열        |
| warning | `IconAlertCircle`   | 16   | 1.5    | `AlertIcon`       | **실루엣 다름**         |
| error   | `IconAlertTriangle` | 16   | 1.5    | `AlertCircleIcon` | **삼각형 vs 원형 경고** |

색은 시맨틱/프리미티브 혼합으로 위 Variants 표 참고.

## Props 기본값 비교

| Prop           | TDS default                          | thaki-shared default | 영향                   |
| -------------- | ------------------------------------ | -------------------- | ---------------------- |
| variant / type | `info` (`variant ?? type ?? 'info'`) | `info`               | 동일                   |
| 콘텐츠         | `children` (별칭 `message`)          | **`message` 필수**   | API 표기 방식 차이     |
| `hideIcon`     | `false`                              | (없음, 항상 아이콘)  | TDS만 아이콘 숨김 가능 |
| `closable`     | deprecated, 동작 없음                | `false`              | shared만 실제 닫기 UI  |
| `expandable`   | deprecated, 동작 없음                | `false`              | shared만 아코디언      |

## Token Mapping (참조)

| TDS Token                          | TDS Resolved | thaki-shared                      | Shared Resolved         | Match                                            |
| ---------------------------------- | ------------ | --------------------------------- | ----------------------- | ------------------------------------------------ |
| `--inline-message-padding`         | 12px         | `p-3`                             | 12px                    | exact                                            |
| `--inline-message-gap`             | 8px          | `gap-2`                           | 8px                     | exact                                            |
| `--inline-message-radius`          | 6px          | `rounded-base8`                   | 8px                     | ❌ DIFF                                          |
| `--inline-message-font-size`       | 12px         | `text-11`                         | 11px (0.6875rem)        | ❌ DIFF                                          |
| `--inline-message-line-height`     | 16px         | `leading-16`                      | 16px                    | exact                                            |
| `--inline-message-text`            | `#0f172a`    | `text-text`                       | `--semantic-color-text` | manual (token-map: text #171717 vs TDS slate900) |
| `--inline-message-success-bg`      | `#f0fdf4`    | `bg-success-bg`                   | `#f0fdf4`               | exact                                            |
| `--inline-message-info-bg`         | `#eff6ff`    | `bg-info-weak-bg`                 | `#eff6ff`               | exact                                            |
| `--inline-message-error-bg`        | `#fef2f2`    | `bg-danger-bg`                    | `#fef2f2`               | exact                                            |
| `--inline-message-success-icon`    | `#16a34a`    | icon → `--semantic-color-success` | `#22c55e`               | ❌ DIFF (600 vs 500)                             |
| `--inline-message-info-icon`       | `#2563eb`    | `--semantic-color-info`           | `#0284c7`               | ❌ DIFF (blue600 vs sky600)                      |
| `--inline-message-warning-icon`    | `#ea580c`    | `--semantic-color-warning`        | `#f97316`               | ❌ DIFF (600 vs 500)                             |
| `--inline-message-error-icon`      | `#dc2626`    | `--semantic-color-error`          | `#ef4444`               | ❌ DIFF (600 vs 500)                             |
| `--color-state-info` (문서 시맨틱) | `#2563eb`    | `--semantic-color-info`           | sky                     | token-global 참고                                |

## 주요 디자인 차이 요약

| #   | 항목                                    | Before (thaki-shared)                          | After (TDS)                                        | 유형                                                                                                       |
| --- | --------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | 본문 글자 크기                          | 11px (`text-11`)                               | 12px (`--font-size-12`)                            | style                                                                                                      |
| 2   | 모서리 반경                             | 8px (`rounded-base8`)                          | 6px (`--radius-md`)                                | style                                                                                                      |
| 3   | Info 아이콘 색                          | `#0284c7` (sky, `--semantic-color-info`)       | `#2563eb` (blue600)                                | style                                                                                                      |
| 4   | Success / Warning / Error 아이콘 색     | 시맨틱 500대 (`#22c55e`, `#f97316`, `#ef4444`) | primitive 600대 (`#16a34a`, `#ea580c`, `#dc2626`)  | style                                                                                                      |
| 5   | Warning / Error 아이콘 형태             | `AlertIcon` / `AlertCircleIcon`                | `IconAlertCircle` / `IconAlertTriangle`            | style                                                                                                      |
| 6   | `expandable` / `closable` / `timestamp` | 구현됨 (UI·동작)                               | prop만 호환, **미구현** (경고 로그)                | api-required — 기존 동작 유지: 상위에서 닫기·접기·타임스탬프 레이아웃 처리 또는 TDS 확장 시 기능 이관 검토 |
| 7   | API 표면                                | `type` + 필수 `message`                        | 권장 `variant` + `children` (`message` deprecated) | api-required — 마이그레이션: `message` → `children`, `type` → `variant`                                    |
| 8   | 아이콘 숨김                             | 없음                                           | `hideIcon`                                         | api-required — 기존에 항상 아이콘 표준이면 영향 없음; 숨김 필요 시 TDS API 사용                            |
