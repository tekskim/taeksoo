# Tooltip Design Spec

> Extracted from TDS `src/design-system/components/Tooltip/Tooltip.tsx`
> thaki-shared target: `src/components/Tooltip/` (매핑: component-map **1:1**)

## 매핑 관계

| TDS        | thaki-shared                                       | 비고                                                 |
| ---------- | -------------------------------------------------- | ---------------------------------------------------- |
| `Tooltip`  | `Tooltip`                                          | CVA 없음 / 단일 시각 스타일                          |
| `position` | `direction`                                        | API 이름만 다름 (값은 top/bottom/left/right 등 유사) |
| `delay`    | (없음)                                             | TDS만 표시 지연                                      |
| `disabled` | (없음)                                             | TDS만 비활성                                         |
| —          | `focusable`, `visibile`, `triggerRef`, `className` | shared 전용 props                                    |

## Base Styles (툴팁 박스)

| Property                | TDS Value                                                                | TDS Token                                    | thaki-shared Value                                                                   | thaki-shared Token / Class                                            | Match                                                           |
| ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| background (light)      | `#0f172a`                                                                | `--tooltip-bg` → `--color-slate-900`         | `#171717`                                                                            | `[background-color:var(--semantic-color-text)]`                       | token-global (slate900 vs trueGray900)                          |
| text color (light)      | `#ffffff`                                                                | `--tooltip-text` → `--color-white`           | `#ffffff`                                                                            | `[color:var(--semantic-color-surface)]`                               | exact                                                           |
| background (dark theme) | `#f1f5f9`                                                                | `--tooltip-bg` → `--color-surface-muted`     | (shared 토큰 파일 기준 동일 패턴 미확인 — tooltip은 `semantic-color-text` 배경 고정) | `semantic-color-text`                                                 | **DIFF** (TDS는 다크에서 역전; shared는 별도 tooltip 토큰 없음) |
| text (dark theme)       | `#0f172a`                                                                | `--tooltip-text` → `--color-text-default`    | —                                                                                    | —                                                                     | **DIFF**                                                        |
| border-radius           | `4px`                                                                    | `--tooltip-radius` → `--radius-sm`           | `4px` (일반적)                                                                       | `rounded-base` → `--semantic-radius-base` → `--primitive-radius-base` | exact                                                           |
| padding-x               | `6px`                                                                    | `--tooltip-padding-x` → `--spacing-1-5`      | `8px`                                                                                | `px-2` → `--primitive-space-2`                                        | **DIFF**                                                        |
| padding-y               | `4px`                                                                    | `--tooltip-padding-y` → `--spacing-1`        | `4px`                                                                                | `py-1` → `--primitive-space-1`                                        | exact                                                           |
| font-size               | `11px`                                                                   | `--tooltip-font-size` → `--font-size-11`     | `11px`                                                                               | `text-11` → `--semantic-font-size11`                                  | exact                                                           |
| line-height             | `16px`                                                                   | `--tooltip-line-height` → `--line-height-16` | `16px`                                                                               | `leading-16` → `--semantic-font-lineHeight16`                         | exact                                                           |
| font-weight             | 상속 (기본 400)                                                          | (명시 없음)                                  | `400`                                                                                | `font-normal`                                                         | exact                                                           |
| min-width               | `60px`                                                                   | `--tooltip-min-width`                        | 없음                                                                                 | —                                                                     | **DIFF**                                                        |
| max-width               | `240px`                                                                  | `--tooltip-max-width`                        | `300px`                                                                              | `max-w-[300px]`                                                       | **DIFF**                                                        |
| width                   | `w-max`                                                                  | Tailwind                                     | `w-max`                                                                              | `w-max`                                                               | exact                                                           |
| text-align              | center                                                                   | `text-center`                                | center                                                                               | `text-center`                                                         | exact                                                           |
| word break              | 기본 (명시 없음)                                                         | —                                            | 줄바꿈 허용                                                                          | `break-words whitespace-normal`                                       | style (shared가 명시적)                                         |
| 트리거 래퍼             | `inline-flex`                                                            | className                                    | `block`                                                                              | `tooltipContainerStyles`                                              | **DIFF**                                                        |
| 오버레이 pointer-events | `pointer-events-none`                                                    | portal 루트                                  | (Portal 구현에 따름)                                                                 | —                                                                     | style                                                           |
| 표시 전환               | `opacity` + `transition-opacity duration-[var(--duration-fast)]` (150ms) | —                                            | 정적 `opacity-100`                                                                   | —                                                                     | **DIFF**                                                        |
| z-index                 | `1400`                                                                   | `--z-tooltip`                                | Popover/anchor 기반 top-layer 등                                                     | —                                                                     | style (스택 모델 상이)                                          |

## 트리거 ↔ 툴팁 간격

|              | TDS                                      | thaki-shared             |
| ------------ | ---------------------------------------- | ------------------------ |
| gap (고정값) | `6px` (`Tooltip.tsx` 내 `const gap = 6`) | `8px` (`TOOLTIP_GAP_PX`) |

## 화살표 (Arrow)

|                | TDS                                                                                | thaki-shared                                         |
| -------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 구현           | CSS border 삼각형 (별도 `div`, `border-[length:var(--tooltip-arrow-size)]`, `4px`) | `.tooltip-arrow::after` (`shared-utilities.css`)     |
| 색             | `var(--tooltip-bg)` (박스와 동일)                                                  | `var(--semantic-color-text)` (박스 배경과 동일 역할) |
| 형태           | 정삼각형에 가깝게 4px 변                                                           | 상·하: 좌우 `3.5px`, 상하 `4px` — **비대칭**         |
| 뷰포트 밀림 시 | 트리거 중심 맞춤 `arrowOffset` 계산                                                | Portal/anchor + CSS fallbacks                        |

## Variants / Sizes

- TDS·shared 모두 **variant·size 분기 없음** (단일 스타일).

## Interactive States (동적)

| State          | 조건                | TDS                             | thaki-shared                         | Match                      |
| -------------- | ------------------- | ------------------------------- | ------------------------------------ | -------------------------- |
| 비활성         | `disabled === true` | 표시 안 함                      | prop 없음                            | N/A                        |
| 표시 지연      | 마우스/포커스 진입  | `setTimeout` 기본 `delay=200ms` | 지연 없음                            | **DIFF**                   |
| 위치 보정      | 뷰포트 밖           | `clamp` + 화살표 오프셋         | Portal + `Direction` + flip / anchor | style                      |
| 외부 제어 표시 | —                   | 없음                            | `visibile` (오타) optional           | api-required (shared 전용) |

## 접근성·트리거 래퍼

|                         | TDS                           | thaki-shared                           |
| ----------------------- | ----------------------------- | -------------------------------------- |
| 트리거 `tabIndex`       | 없음 (래퍼는 포커스 불가 div) | 기본 `focusable=true` → `tabIndex={0}` |
| `aria-describedby`      | 미설정                        | 표시 시 `aria-describedby={tooltipId}` |
| 툴팁 `id` / `aria-live` | 없음                          | `id={tooltipId}`, `aria-live="polite"` |

## 아이콘 비교

| 아이콘 | TDS                            | thaki-shared |
| ------ | ------------------------------ | ------------ |
| (내장) | 없음 — `content`만 `ReactNode` | 없음         |

## Props 기본값 비교 (체크리스트 A)

| Prop             | TDS 기본값        | thaki-shared 기본값   |
| ---------------- | ----------------- | --------------------- |
| 위치             | `position: 'top'` | `direction: 'top'`    |
| 지연             | `delay: 200`      | (없음 → 즉시)         |
| 비활성           | `disabled: false` | (prop 없음)           |
| 포커스 가능 래퍼 | (미지원)          | `focusable: true`     |
| 외부 표시 제어   | (없음)            | `visibile: undefined` |

## 주요 디자인 차이 요약

| #   | 항목                                   | TDS                                       | thaki-shared                                        | 변경 유형                | 영향 범위                        | 마이그레이션                                                              |
| --- | -------------------------------------- | ----------------------------------------- | --------------------------------------------------- | ------------------------ | -------------------------------- | ------------------------------------------------------------------------- |
| 1   | 가로 패딩                              | 6px                                       | 8px                                                 | `style`                  | —                                | —                                                                         |
| 2   | max-width                              | 240px                                     | 300px                                               | `style`                  | 긴 문구 줄바꿈 폭                | —                                                                         |
| 3   | min-width                              | 60px                                      | 없음                                                | `style`                  | 짧은 라벨 폭                     | —                                                                         |
| 4   | 트리거 간격                            | 6px                                       | 8px                                                 | `style`                  | —                                | —                                                                         |
| 5   | 표시 지연                              | 200ms                                     | 없음                                                | `api-required`           | 호버 즉시 표시 vs 약간 늦게 표시 | TDS 맞춤: `delay={0}` 도입 또는 shared에 delay prop 추가                  |
| 6   | 페이드 인                              | 150ms opacity                             | 없음                                                | `style`                  | —                                | —                                                                         |
| 7   | 트리거 display                         | `inline-flex`                             | `block`                                             | `style`                  | 인라인 배치 시 레이아웃          | —                                                                         |
| 8   | 화살표 형태                            | 4px 균등 border                           | 3.5px / 4px 혼합                                    | `style`                  | —                                | —                                                                         |
| 9   | 다크 테마 툴팁                         | 밝은 배경 + 어두운 글자로 토큰 오버라이드 | tooltip 전용 역전 없음 (`semantic-color-text` 기반) | `token-global` + `style` | 다크 UI에서 대비 불일치 가능     | shared에 `--tooltip-*` 또는 테마별 tooltip 토큰 정렬                      |
| 10  | 배경색 (라이트)                        | `#0f172a`                                 | `#171717`                                           | `token-global`           | —                                | token-map `semantic.color.text` 값 조정 시 해결                           |
| 11  | `disabled`                             | 지원                                      | 미지원                                              | `api-required`           | TDS만 툴팁 끄기 가능             | shared: 조건부 렌더링 또는 래퍼에서 이벤트 차단                           |
| 12  | 트리거 `tabIndex` / `aria-describedby` | 미설정                                    | 기본 포커스 가능 + 연결                             | `api-required`           | 키보드·SR 동작 차이              | shared `focusable={false}`로 TDS에 가깝게 조정 가능하나 a11y 트레이드오프 |
| 13  | API 이름                               | `position`                                | `direction`                                         | `api-required`           | 타입·이름만 상이                 | import 시 prop 이름 변경                                                  |

## Token Mapping (참조)

| TDS Token                                    | Resolved (light) | thaki-shared Token                            | Match                |
| -------------------------------------------- | ---------------- | --------------------------------------------- | -------------------- |
| `--tooltip-padding-x` → `--spacing-1-5`      | `6px`            | `px-2` → `--primitive-space-2` (`8px`)        | manual               |
| `--tooltip-padding-y` → `--spacing-1`        | `4px`            | `py-1` → `--primitive-space-1`                | exact                |
| `--tooltip-radius` → `--radius-sm`           | `4px`            | `rounded-base` → `--semantic-radius-base`     | exact (값 동일 전제) |
| `--tooltip-font-size` → `--font-size-11`     | `11px`           | `text-11` → `--semantic-font-size11`          | exact                |
| `--tooltip-line-height` → `--line-height-16` | `16px`           | `leading-16` → `--semantic-font-lineHeight16` | exact                |
| `--tooltip-bg` → `--color-slate-900`         | `#0f172a`        | `--semantic-color-text`                       | manual (token-map)   |
| `--tooltip-text` → `--color-white`           | `#ffffff`        | `--semantic-color-surface`                    | exact                |
| `--tooltip-min-width`                        | `60px`           | (없음)                                        | manual               |
| `--tooltip-max-width`                        | `240px`          | `max-w-[300px]` 하드코드                      | manual               |
| `--tooltip-arrow-size`                       | `4px`            | CSS `3.5px` / `4px` 혼합                      | manual               |
| `--duration-fast`                            | `150ms`          | (툴팁 전환 미사용)                            | —                    |
| `--z-tooltip`                                | `1400`           | (top-layer / Portal)                          | —                    |
