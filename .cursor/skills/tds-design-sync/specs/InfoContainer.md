# InfoContainer Design Spec

> Extracted from TDS `src/design-system/components/InfoBox/InfoBox.tsx`  
> thaki-shared target: `src/components/InfoContainer/`  
> Mapping: **partial** (component-map #11 — 이름·API 차이, 토큰 정렬 위주)

## Architecture Difference

| Aspect    | TDS (InfoBox)                                                   | thaki-shared (InfoContainer)                 |
| --------- | --------------------------------------------------------------- | -------------------------------------------- |
| 값 모델   | 단일 `value` 또는 `children`                                    | `values: string[]`                           |
| 부가 기능 | `tooltip`, `copyable`, `status` (StatusIndicator), `CopyButton` | 없음                                         |
| 다중 값   | `children`로 자유 배치                                          | 세로 스택 + `maxVisibleItems` 초과 시 스크롤 |
| 리스트    | 없음                                                            | `showBullets`로 `<ul>`                       |
| 그룹      | `InfoBox.Group` (`flex-col gap-[12px]`)                         | 없음 (소비 측에서 나열)                      |

**싱크 전략 (component-map)**: shared 컴포넌트 유지, **디자인 토큰·타이포·간격·배경·radius**만 TDS에 맞춤. API 확장은 별도 결정.

---

## Base Styles (TDS InfoBox)

| Property                    | Resolved value       | TDS token / class                                             |
| --------------------------- | -------------------- | ------------------------------------------------------------- |
| border-radius               | 8px                  | `--primitive-radius-lg` (`src/styles/tokens/index.css`)       |
| background                  | `#f8fafc`            | `--color-surface-subtle` → `--color-slate-50` (light `:root`) |
| padding                     | 16px ×, 12px y       | `px-4` / `py-3` → `--spacing-4` / `--spacing-3`               |
| label ↔ value gap           | 6px                  | `gap-[6px]` (≈ `--spacing-1-5`)                               |
| label row: label ↔ icon gap | 4px                  | `gap-[4px]` (`--spacing-1`)                                   |
| width                       | `w-full`, `min-w-0`  | —                                                             |
| transition / focus ring     | 없음 (컨테이너 자체) | —                                                             |
| font-weight (label)         | 500                  | `text-label-sm` → `--font-weight-medium`                      |
| font-weight (value)         | 400                  | `text-body-md` → `--font-weight-regular`                      |

---

## Variants / Sizes

InfoBox는 **CVA variant 없음** — 단일 시각 스타일만 존재. Size prop 없음.

---

## Typography

| 역할  | TDS 클래스                                          | Resolved                                        |
| ----- | --------------------------------------------------- | ----------------------------------------------- |
| Label | `text-label-sm` + `text-[var(--color-text-subtle)]` | 11px / 16px line-height, medium, `#64748b`      |
| Value | `text-body-md` + `text-[var(--color-text-default)]` | 12px / **18px** line-height, regular, `#0f172a` |

---

## Interactive States (동적)

| State            | 조건                       | 스타일                                                                                                  |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| Status 우측 여백 | `status` 지정              | 값 영역 `pr-6` (24px), `StatusIndicator` `absolute right-3`                                             |
| Tooltip 아이콘   | `tooltip` 지정             | `IconInfoCircle` 14px, `text-[var(--color-text-subtle)]`, `<Tooltip>` 필수                              |
| 복사             | `copyable && string value` | 값 옆 `CopyButton` `size="sm"` `iconOnly` — 성공 시 CopyButton 쪽 success 색 (상위 박스 자체 변화 없음) |

해당 없음: expanded, error, selected 등.

---

## thaki-shared InfoContainer (현재 구현)

`InfoContainer.styles.ts` 요약:

| Property      | Class / token                                                         | Resolved (light, `tokens-light.css` + preset)                         |
| ------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| border-radius | `rounded-base8` → `--semantic-radius-base8`                           | `0.5rem` → **8px** (root 16px 기준)                                   |
| background    | `bg-[var(--primitive-color-gray50)]`                                  | **`#f9fafb`** (primitive gray50)                                      |
| padding       | `py-3 px-4`                                                           | 12px y, 16px x                                                        |
| root gap      | `gap-1.5`                                                             | 6px                                                                   |
| label         | `text-11 font-medium leading-16 text-text-muted`                      | 11px / 16px / 500, color `--semantic-color-textMuted` → **`#737373`** |
| values stack  | `flex-col gap-2`                                                      | 8px between rows                                                      |
| value         | `text-12 font-normal leading-16 text-text`                            | 12px / **16px**, `#0f172a`                                            |
| scroll        | `max-h-[calc(var(--primitive-space-4)*3+var(--primitive-space-1)*2)]` | 약 **56px** (3×16px + 2×4px)                                          |

---

## 아이콘 비교

| 아이콘         | TDS (InfoBox)                                                        | thaki-shared (InfoContainer) |
| -------------- | -------------------------------------------------------------------- | ---------------------------- |
| Info (tooltip) | `IconInfoCircle` Tabler, size 14, stroke 기본 2, `currentColor` 계열 | 없음                         |
| Copy           | `CopyButton` → Tabler `IconCopy` / `IconCheck` (별 컴포넌트)         | 없음                         |
| Status         | `StatusIndicator`                                                    | 없음                         |

---

## Token Mapping (참조)

| TDS token                               | TDS resolved (light) | thaki-shared 관련                                           | shared resolved (`tokens-light.css`) | Match                                       |
| --------------------------------------- | -------------------- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------------------- |
| `--primitive-radius-lg`                 | 8px                  | `--semantic-radius-base8`                                   | 8px                                  | exact                                       |
| `--color-surface-subtle`                | `#f8fafc`            | (컴포넌트가 primitive 직접 참조) `--primitive-color-gray50` | `#f9fafb`                            | **❌ DIFF**                                 |
| `--color-text-subtle` (label 의도)      | `#64748b`            | `text-text-muted` → `--semantic-color-textMuted`            | `#737373`                            | **❌ DIFF** (역할도 subtle vs muted 불일치) |
| `--color-text-default` (value)          | `#0f172a`            | `text-text` → `--semantic-color-text`                       | `#0f172a`                            | exact                                       |
| `--spacing-3` / `--spacing-4` (padding) | 12px / 16px          | `py-3` / `px-4`                                             | 동일 Tailwind 스케일                 | exact                                       |

> `token-map.md`의 textMuted “exact”는 이름 매핑 기준이며, 실제 `tokens-light.css`에서 `#737373`이면 TDS slate 계열과 **시각적으로 다를 수 있음** — 스킬 C-1 참고.

---

## Props 기본값 비교

| Prop              | TDS InfoBox | thaki InfoContainer |
| ----------------- | ----------- | ------------------- |
| `copyable`        | `false`     | 해당 없음           |
| `tooltip`         | 없음        | 해당 없음           |
| `maxVisibleItems` | 해당 없음   | `3`                 |
| `showBullets`     | 해당 없음   | `false`             |

단일 문자열을 보여주는 사용처에서는 기본값 충돌이 거의 없음. 다중 값·스크롤 UX는 InfoContainer 전용.

---

## 주요 디자인 차이

| #   | 항목                    | TDS (InfoBox)                      | thaki-shared (InfoContainer)         | 유형           | 비고                                                                                                                                             |
| --- | ----------------------- | ---------------------------------- | ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 컨테이너 배경           | `--color-surface-subtle` `#f8fafc` | `--primitive-color-gray50` `#f9fafb` | `style`        | semantic surfaceSubtle 정렬 또는 토큰 교체 권장                                                                                                  |
| 2   | 라벨 색                 | `text-subtle` `#64748b`            | `text-muted` `#737373`               | `style`        | 라벨은 TDS와 동일하게 **subtle** 톤 권장; 전역 토큰 수정 시 영향 범위 확인                                                                       |
| 3   | 값 본문 줄 높이         | 18px (`text-body-md`)              | 16px (`leading-16`)                  | `style`        | `leading-18` / semantic lineHeight18 정렬                                                                                                        |
| 4   | 다중 값 행 간격         | (단일 슬롯; children 자유)         | `gap-2` 8px                          | `style`        | 동일 패턴으로 쌓을 때 간격 명시적 정렬 여부는 콘텐츠 정책에 따름                                                                                 |
| 5   | 스크롤 영역             | 없음                               | max-height + `overflow-y-auto`       | —              | 구조 차이; 디자인 싱크 범위 외 기록                                                                                                              |
| 6   | tooltip / copy / status | 지원                               | 미지원                               | `api-required` | **TDS 패리티가 목표일 때만** API 추가·소비 코드 변경 필요. 영향: 모달/드로어 메타 표시 UX. 마이그레이션: 옵션 props 추가 후 사용처에서 점진 적용 |
| 7   | 라벨↔값 gap             | 6px                                | 6px (`gap-1.5`)                      | match          | —                                                                                                                                                |
| 8   | padding                 | 16×12px                            | 16×12px                              | match          | —                                                                                                                                                |
| 9   | radius                  | 8px                                | 8px                                  | match          | —                                                                                                                                                |

---

## 적용 시 권장 스타일 변경 요약

1. **root 배경**: `primitive gray50` → `bg-[var(--semantic-color-surfaceSubtle)]` 또는 TDS와 동일한 slate50 계열 semantic 토큰으로 통일 (`#f8fafc`).
2. **label 색상 클래스**: `text-text-muted` → `text-text-subtle` (또는 토큰 값이 TDS `text-subtle`과 일치하도록 글로벌 토큰 조정).
3. **value 타이포**: `leading-16` → `leading-18` (또는 `text-12`에 lineHeight 18px 부여하는 preset 정렬).

---

## 필수 체크리스트 (Extract 검증)

- [x] A. Props 기본값 비교
- [x] B. TDS 전용 기능(tooltip/copy/status) — 기본 플로우 비참여 → 스펙 기록 및 `api-required`로 분리 표기
- [x] C. 배경: shared는 **primitive 직접 참조** → 컴포넌트 레벨 Apply 대상
- [x] C-1. textMuted / textSubtle 실제 hex 비교 (`#737373` vs TDS subtle `#64748b`)
- [x] D. deprecated 사용처 grep — InfoBox 전용 variant 없음, 해당 없음
- [x] E. 주요 디자인 차이에 **유형** 컬럼 반영
