# Fieldset Design Spec

> **component-map**: thaki-shared `Fieldset` ↔ TDS `SectionCard` (역할 유사, **1:1 매핑 아님** — partial / 토큰 정렬)
> Extracted from TDS `src/design-system/components/SectionCard/SectionCard.tsx`
> thaki-shared target: `src/components/Fieldset/`

## Architecture Difference

| Aspect          | TDS (SectionCard)                           | thaki-shared (Fieldset)                    |
| --------------- | ------------------------------------------- | ------------------------------------------ |
| Root element    | `<div>`                                     | `<fieldset>` + `<legend>` (접근성/폼 그룹) |
| Visual variants | 단일 카드 스타일 (border + surface)         | `default` / `bordered` / `elevated`        |
| Active state    | `isActive` → primary 2px border + 패딩 보정 | 없음                                       |
| Group error     | 내장 없음 (하위 폼 패턴에서 별도)           | `error` prop + `role="alert"`              |
| Disabled        | 컨테이너 레벨 없음                          | `disabled` + opacity / pointer-events      |
| 레이아웃        | Header / Content compound                   | `direction` vertical / horizontal          |
| 하위 연동       | —                                           | `FieldsetContext` → FormField              |

## Base Styles (TDS SectionCard — 카드 컨테이너)

| Property               | Value (resolved)              | TDS Token / class                |
| ---------------------- | ----------------------------- | -------------------------------- |
| border-radius          | 6px                           | `--radius-md`                    |
| background             | #ffffff                       | `--color-surface-default`        |
| border (normal)        | 1px #e2e8f0                   | `--color-border-default`         |
| border (active)        | 2px #2563eb                   | `--color-action-primary`         |
| flex direction         | column                        | `flex flex-col`                  |
| gap (header ↔ content) | 16px                          | `gap-4` → `--spacing-4`          |
| padding (normal)       | 16px top, 12px bottom, 16px x | `pt-4 pb-3 px-4`                 |
| padding (`isActive`)   | 14px top, 11px bottom, 15px x | 보정 (2px border)                |
| transition             | —                             | SectionCard에 duration 유틸 없음 |

## Variants (thaki-shared Fieldset — CVA)

### variant="default"

| State   | Background  | Border                             | Radius                        | Padding                              |
| ------- | ----------- | ---------------------------------- | ----------------------------- | ------------------------------------ |
| default | transparent | 1px transparent                    | `rounded-md` (6px)            | `p-md` (16px, `--semantic-space-md`) |
| error   | (동일)      | 1px `--semantic-color-stateDanger` | compound: 명시적 `rounded-md` | (동일)                               |

### variant="bordered"

| State   | Background  | Border                                                    |
| ------- | ----------- | --------------------------------------------------------- |
| default | transparent | 1px `border-border` → `--semantic-color-border` (#e2e8f0) |

### variant="elevated"

| State   | Background                                        | Border     | Shadow                               |
| ------- | ------------------------------------------------- | ---------- | ------------------------------------ |
| default | `--component-layout-surface-default-bg` (#ffffff) | 1px border | `shadow-sm` → `--semantic-shadow-sm` |

**대응 관계 (시각적)**:

- TDS 기본 SectionCard는 **항상** `bordered` + 흰 배경에 가깝다. shared `default`(투명 테두리)와는 **다름**.
- shared `bordered`가 TDS 비-active 카드에 가장 근접.
- `elevated`의 그림자는 TDS SectionCard **단일 패턴에 없음**.

## Sizes & Typography

### TDS SectionCard.Header (섹션 타이틀 역할)

| Role        | Class             | Font size               | Line height | Weight         |
| ----------- | ----------------- | ----------------------- | ----------- | -------------- |
| Title       | `text-heading-h5` | 16px (`--font-size-16`) | 24px        | 600 (semibold) |
| Description | `text-body-sm`    | 11px                    | 16px        | 400            |

### thaki-shared Fieldset

| Role        | Classes / token                              | Font size | Weight | Notes                                |
| ----------- | -------------------------------------------- | --------- | ------ | ------------------------------------ |
| Legend      | `text-16 font-medium`, `semantic-color-text` | 16px      | 500    | `leading-tight` (TDS 24px lh와 다름) |
| Description | `semantic-font-sizeXs` (0.75rem)             | 12px      | 400    | TDS description은 11px body-sm       |
| Content     | `flex gap-md`                                | —         | —      | 16px gap (`--semantic-space-md`)     |
| Error       | `semantic-font-sizeXs` + `stateDanger`       | 12px      | 500    | `⚠` 유니코드 `::before`              |

## Interactive States (동적)

| State          | 조건 (TDS)          | 스타일                              |
| -------------- | ------------------- | ----------------------------------- |
| Active section | `isActive === true` | `border-2` primary, 패딩 15/14/11px |

| State                  | 조건 (shared Fieldset) | 스타일                                               |
| ---------------------- | ---------------------- | ---------------------------------------------------- |
| Error                  | `error` truthy         | fieldset `border` danger; legend 색 danger           |
| Disabled               | `disabled`             | `opacity-60 pointer-events-none`; legend `textMuted` |
| variant×error compound | `default` + error      | danger border 유지 + radius 명시                     |

TDS SectionCard: **disabled / 그룹 error / variant** 없음.

## 아이콘 비교

| 위치      | TDS (SectionCard) | thaki-shared (Fieldset)                                         |
| --------- | ----------------- | --------------------------------------------------------------- |
| 그룹 에러 | 내장 아이콘 없음  | 유니코드 `⚠` + `before:text-14` (Tabler `IconAlertCircle` 아님) |

| 항목           | TDS                                   | shared                                                    |
| -------------- | ------------------------------------- | --------------------------------------------------------- |
| viewBox / path | 해당 없음                             | 유니코드 글리프 (SVG path 비교 불가)                      |
| 정책 정렬      | InlineMessage 등에서 Tabler 사용 권장 | 에러 시 TDS와 맞추려면 `IconAlertCircle` 등으로 교체 검토 |

## Props 기본값 비교

| Prop              | TDS SectionCard     | thaki-shared Fieldset          |
| ----------------- | ------------------- | ------------------------------ |
| 시각 variant      | (없음, 단일 스타일) | `variant="default"`            |
| active            | `isActive=false`    | (해당 없음)                    |
| direction         | (없음)              | `direction="vertical"`         |
| requiredIndicator | (없음)              | `requiredIndicator="asterisk"` |

## Token Mapping (참조)

| TDS Token                  | TDS Resolved | thaki-shared Token                      | shared Resolved | Match                              |
| -------------------------- | ------------ | --------------------------------------- | --------------- | ---------------------------------- |
| `--color-border-default`   | #e2e8f0      | `--semantic-color-border`               | #e2e8f0         | exact                              |
| `--color-surface-default`  | #ffffff      | `--component-layout-surface-default-bg` | #ffffff         | exact                              |
| `--radius-md`              | 6px          | `--semantic-radius-md` / `rounded-md`   | 6px             | exact                              |
| `--spacing-4`              | 16px         | `--semantic-space-md` (1rem)            | 16px            | exact                              |
| `--color-action-primary`   | #2563eb      | `--semantic-color-primary`              | #2563eb         | exact                              |
| `--color-state-danger`     | #ef4444      | `--semantic-color-stateDanger`          | #ef4444         | exact (현행 tokens-light)          |
| `--color-text-subtle`      | #64748b      | `--semantic-color-textSubtle`           | (blueGray500)   | likely — token-map 참조            |
| `--font-size-11` (body-sm) | 11px         | description은 `font-sizeXs` 12px        | 12px            | ❌ DIFF (역할 유사, 크기 다름)     |
| —                          | —            | `--semantic-shadow-sm`                  | (preset)        | TDS SectionCard는 동일 그림자 없음 |

## 주요 디자인 차이

| #   | 항목          | TDS (SectionCard)                   | thaki-shared (Fieldset)                | 유형           | 영향 / 마이그레이션                                                                         |
| --- | ------------- | ----------------------------------- | -------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| 1   | 기본 크롬     | 항상 흰 배경 + 기본 테두리 카드     | `default`는 투명 배경·투명 테두리      | `style`        | 싱크 시 `bordered` 또는 토큰으로 TDS 카드 룩 정렬 검토                                      |
| 2   | 그림자 카드   | 없음                                | `elevated` + `shadow-sm`               | `style`        | TDS에 대응 variant 없음; 유지 또는 제거는 제품 결정                                         |
| 3   | Active 섹션   | `isActive` primary 2px + 패딩 보정  | 없음                                   | `api-required` | 위자드 활성 단계: shared에 `isActive` 류 prop 없음. 기존 동작 유지 시 별도 래퍼/클래스 필요 |
| 4   | Legend 타이틀 | `text-heading-h5` (16/24, semibold) | `text-16 font-medium`, `leading-tight` | `style`        | 600 + 24px lh로 맞추면 TDS 헤더와 정렬                                                      |
| 5   | 설명 텍스트   | `text-body-sm` (11/16)              | `semantic-font-sizeXs` (12px)          | `style`        | 11/16으로 내리거나 TDS 토큰에 맞춤                                                          |
| 6   | 바깥 패딩     | 비대칭 `pt-4 pb-3 px-4`             | 대칭 `p-md` (16)                       | `style`        | 하단 12px 등 SectionCard 토큰과 맞출지 결정                                                 |
| 7   | 그룹 에러 UI  | SectionCard 미제공                  | 유니코드 경고 + danger 텍스트          | `style`        | DS 정책상 Tabler 경고 아이콘 + `InlineMessage` 패턴과 정렬 권장                             |
| 8   | Disabled 래퍼 | 없음                                | opacity + pointer-events               | `api-required` | 필드 단위 disabled는 유지; 카드 전체 dim은 TDS 패턴에 없어 선택 적용                        |

---

**검증 메모**: `token-map.md`의 "exact"는 이름 매핑일 수 있음. Fieldset은 주로 border/surface/spacing/typography를 쓰므로 `tokens-light.css`와 TDS `index.css`의 실제 hex를 싱크 PR에서 재확인할 것.
