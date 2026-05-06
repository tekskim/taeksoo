# CopyButton Design Spec

> Extracted from TDS `src/design-system/components/CopyButton/CopyButton.tsx`
> thaki-shared target: `src/components/CopyButton/`

## Base Styles

| Property      | TDS Value                             | TDS Token       |
| ------------- | ------------------------------------- | --------------- |
| display       | inline-flex                           | —               |
| align         | items-center justify-center           | —               |
| border        | 1px (always present)                  | border          |
| border-radius | 4px                                   | --radius-sm     |
| font-weight   | 500                                   | font-medium     |
| transition    | colors 150ms                          | --duration-fast |
| focus-visible | ring-2, ring-[--color-action-primary] | ring-2          |
| disabled      | opacity-50, cursor-not-allowed        | —               |

## Variants

### variant="default"

| State   | Background                       | Text                           | Border      |
| ------- | -------------------------------- | ------------------------------ | ----------- |
| default | --color-surface-muted (#f1f5f9)  | --color-text-default (#0f172a) | transparent |
| hover   | --color-surface-subtle (#f8fafc) | --color-text-default           | transparent |

### variant="ghost" (default)

| State   | Background                       | Text                           | Border      |
| ------- | -------------------------------- | ------------------------------ | ----------- |
| default | transparent                      | --color-text-default (#0f172a) | transparent |
| hover   | --color-surface-subtle (#f8fafc) | --color-text-default           | transparent |

### variant="outline"

| State   | Background                       | Text                           | Border                           |
| ------- | -------------------------------- | ------------------------------ | -------------------------------- |
| default | transparent                      | --color-text-default (#0f172a) | --color-border-default (#e2e8f0) |
| hover   | --color-surface-subtle (#f8fafc) | --color-text-default           | --color-border-default           |

## Sizes

| Size | Height | Padding X | Typography               | Gap | Icon Size |
| ---- | ------ | --------- | ------------------------ | --- | --------- |
| sm   | 24px   | 6px       | text-body-sm (11px/16px) | 4px | 12px      |
| md   | 32px   | 8px       | text-body-md (12px/18px) | 6px | 14px      |
| lg   | 36px   | 10px      | text-body-md (12px/18px) | 8px | 16px      |

Icon-only: extra `px-1.5` (6px horizontal padding).

## Interactive States (동적)

| State          | 조건              | 적용 스타일                          | 색상    |
| -------------- | ----------------- | ------------------------------------ | ------- |
| copied         | `copied === true` | text-[var(--color-state-success)]    | #10b981 |
| default labels | —                 | label='Copy', successLabel='Copied!' | —       |
| duration       | —                 | successDuration=2000ms               | —       |

## 아이콘 비교

| 아이콘 | TDS 구현           | size    | stroke | thaki-shared 구현 | viewBox | strokeWidth |
| ------ | ------------------ | ------- | ------ | ----------------- | ------- | ----------- |
| copy   | IconCopy (Tabler)  | dynamic | 1.5    | inline SVG        | 12x12   | 1           |
| check  | IconCheck (Tabler) | dynamic | 2      | inline SVG        | 12x12   | 1.5         |

## 주요 디자인 차이

| #   | 항목                 | TDS                            | thaki-shared                  | 유형  |
| --- | -------------------- | ------------------------------ | ----------------------------- | ----- |
| 1   | Variants             | 3개 (default, ghost, outline)  | 1개 (ghost-like only)         | style |
| 2   | Sizes                | 3개 (sm/md/lg) with stepped    | Fixed 12×12px                 | style |
| 3   | Border radius        | 4px (--radius-sm)              | 2px (--semantic-radius-sm)    | style |
| 4   | Default text color   | text-default (#0f172a)         | text-muted (#475569)          | style |
| 5   | Hover bg             | surface-subtle (#f8fafc)       | surface-muted (#f1f5f9)       | style |
| 6   | Border               | 1px always (transparent/token) | border-none                   | style |
| 7   | Success/copied color | Entire button green (#10b981)  | No success color applied      | style |
| 8   | Icon stroke          | copy: 1.5, check: 2            | copy: 1, check: 1.5           | style |
| 9   | Font weight          | font-medium (500)              | inherited                     | style |
| 10  | Focus style          | ring-2 primary                 | outline 2px + 2px offset      | style |
| 11  | Disabled             | opacity-50, cursor-not-allowed | Not implemented               | style |
| 12  | Typography           | text-body-sm / text-body-md    | None                          | style |
| 13  | Label support        | Yes (Copy / Copied!)           | children only                 | style |
| 14  | Transition           | duration-fast (150ms)          | duration-control (undefined?) | style |
