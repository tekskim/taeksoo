# FloatingCard Design Spec

> Extracted from TDS `src/design-system/components/FloatingCard/FloatingCard.tsx`  
> thaki-shared target: `src/components/FloatingCard/` (매핑: **1:1**, `component-map.md`)

## 구조 차이 (참고)

TDS FloatingCard는 **완전한 floating panel** (portal, position, close button, action buttons, NumberInput)을 구현하지만, thaki-shared는 **summary+quota card** (collapsible sections, expandedSectionIds)로 API가 완전히 다릅니다. 디자인 싱크는 **공통 시각 영역(typography, spacing, colors)만** 대상으로 합니다.

## Summary Section

### Summary Card Container

| Property      | TDS                                        | thaki-shared           |
| ------------- | ------------------------------------------ | ---------------------- |
| background    | `var(--color-surface-subtle)`              | `bg-surface-subtle`    |
| border        | `1px solid var(--color-border-default)`    | `border border-border` |
| border-radius | `rounded-md` (6px)                         | `rounded-base8` (8px)  |
| padding       | `16px` (inline style) + `m-4` outer margin | `px-4 py-4 pr-1`       |
| min-height    | `160px`                                    | `min-h-[160px]`        |

### Summary Title

| Property    | TDS                         | thaki-shared       |
| ----------- | --------------------------- | ------------------ |
| font-size   | `text-label-lg` → 13px      | `text-16` → 16px   |
| line-height | 18px (label-lg)             | `leading-6` → 24px |
| font-weight | 500 (medium, label)         | 600 (semibold)     |
| color       | `var(--color-text-default)` | `text-text`        |

### Section Group Title

| Property    | TDS                         | thaki-shared        |
| ----------- | --------------------------- | ------------------- |
| font-size   | `text-label-md` → 12px      | `text-14` → 14px    |
| line-height | 18px (label-md)             | `leading-20` → 20px |
| font-weight | 500 (medium)                | 500 (medium)        |
| color       | `var(--color-text-default)` | `text-text`         |

### Section Item Label

| Property    | TDS                        | thaki-shared        |
| ----------- | -------------------------- | ------------------- |
| font-size   | `text-body-sm` → 11px      | `text-12` → 12px    |
| line-height | 16px (body-sm)             | `leading-20` → 20px |
| font-weight | 400 (regular)              | 400 (normal)        |
| color       | `var(--color-text-subtle)` | `text-text`         |

### Section Item Hover

| Property     | TDS                                                | thaki-shared |
| ------------ | -------------------------------------------------- | ------------ |
| hover        | `hover:bg-[var(--color-surface-muted)]` on buttons | 없음         |
| item padding | `px-2 -mx-2 py-1`                                  | `px-2 py-1`  |

## Quota Section

### Quota Card Container

| Property      | TDS                                     | thaki-shared           |
| ------------- | --------------------------------------- | ---------------------- |
| background    | `var(--color-surface-default)`          | `bg-surface`           |
| border        | `1px solid var(--color-border-default)` | `border border-border` |
| border-radius | `rounded-md` (6px)                      | `rounded-base8` (8px)  |
| padding       | `16px` (inline style)                   | `p-4`                  |

### Quota Title

| Property    | TDS                    | thaki-shared       |
| ----------- | ---------------------- | ------------------ |
| font-size   | `text-label-md` → 12px | `text-16` → 16px   |
| line-height | 18px                   | `leading-6` → 24px |
| font-weight | 500 (medium)           | 600 (semibold)     |

### Quota Label

| Property    | TDS                   | thaki-shared        |
| ----------- | --------------------- | ------------------- |
| font-size   | `text-body-md` → 12px | `text-14` → 14px    |
| line-height | 18px                  | `leading-20` → 20px |
| font-weight | 400 (regular)         | 500 (medium)        |

### Quota Value

| Property    | TDS                       | thaki-shared           |
| ----------- | ------------------------- | ---------------------- |
| font-size   | `text-body-md` → 12px     | `text-12` → 12px       |
| line-height | 18px                      | `leading-16` → 16px    |
| font-weight | 400 (regular)             | 400 (normal)           |
| color       | `var(--color-text-muted)` | (inherits from parent) |

## Status Icons

| Status     | TDS                                               | thaki-shared                |
| ---------- | ------------------------------------------------- | --------------------------- |
| success    | 16px circle, green bg, white IconCheck 10px       | `CheckCircleIcon size="md"` |
| warning    | 16px circle, red bg, white IconAlertTriangle 10px | `AlertIcon size="md"`       |
| processing | IconProgress 20px, text-muted                     | `ProgressIcon size="md"`    |
| default    | IconCircleDashed 20px, border-default color       | (no default icon)           |

## 주요 디자인 차이

| 항목                       | 변경 유형      | 요약                                                       |
| -------------------------- | -------------- | ---------------------------------------------------------- |
| Summary title font-size    | `style`        | TDS 13px/18px/medium vs shared **16px/24px/semibold**      |
| Group title font-size      | `style`        | TDS 12px/18px vs shared **14px/20px**                      |
| Item label font-size       | `style`        | TDS 11px/16px vs shared **12px/20px**                      |
| Item label color           | `style`        | TDS `text-subtle` vs shared `text-text`                    |
| Quota title font-size      | `style`        | TDS 12px/18px/medium vs shared **16px/24px/semibold**      |
| Quota label font-size      | `style`        | TDS 12px/18px/regular vs shared **14px/20px/medium**       |
| Quota value line-height    | `style`        | TDS 18px vs shared **16px**                                |
| Summary card border-radius | `style`        | TDS 6px (`rounded-md`) vs shared **8px** (`rounded-base8`) |
| Quota card border-radius   | `style`        | TDS 6px vs shared **8px**                                  |
| Summary card padding-right | `style`        | TDS `16px` symmetric vs shared `pr-1`                      |
| Status icons               | `api-required` | TDS Tabler icons vs shared Icon system (구조 차이)         |
| Portal/Position/Actions    | `api-required` | TDS 고유 기능 — shared에 없음                              |
| Collapsible sections API   | `api-required` | shared 고유 (expandedSectionIds, sectionOpenMode)          |

---

_Generated with tds-design-extract — FloatingCard_
