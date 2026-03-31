# CopyButton Design Spec

> Extracted from TDS `src/design-system/components/CopyButton/CopyButton.tsx`
> thaki-shared target: `src/components/CopyButton/`
> Mapping: 1:1 대응 (구조 차이 큼)

## 구조 차이

| 항목        | TDS                                      | thaki-shared                     |
| ----------- | ---------------------------------------- | -------------------------------- |
| 스타일 파일 | 인라인 (variantStyles, sizeStyles)       | 인라인 (copyButtonStyles 문자열) |
| .styles.ts  | 없음                                     | 없음                             |
| variant     | 3종 (default, ghost, outline)            | 없음 (ghost 유사 단일)           |
| size        | 3종 (sm/md/lg)                           | 없음 (12x12 고정)                |
| props       | value, variant, size, label, iconOnly 등 | text, children                   |
| icon        | Tabler (IconCopy, IconCheck)             | 인라인 SVG (12x12)               |
| Copyable    | 별도 컴포넌트 export                     | 없음                             |

## TDS CopyButton 디자인

### Base Styles

| Property      | Value                                   | Token                  |
| ------------- | --------------------------------------- | ---------------------- |
| display       | inline-flex items-center justify-center | —                      |
| border        | 1px solid (variant별 색상)              | —                      |
| border-radius | 4px                                     | --radius-sm            |
| font-weight   | 500 (medium)                            | font-medium            |
| transition    | colors 150ms                            | --duration-fast        |
| focus ring    | ring-2 #2563eb                          | --color-action-primary |
| disabled      | opacity-50, cursor-not-allowed          | —                      |

### Variant: ghost (shared 대응 variant)

| State   | Background                       | Text                            | Border      |
| ------- | -------------------------------- | ------------------------------- | ----------- |
| default | transparent                      | #0f172a (--color-text-default)  | transparent |
| hover   | #f8fafc (--color-surface-subtle) | #0f172a                         | transparent |
| copied  | —                                | #22c55e (--color-state-success) | —           |

### Variant: default

| State   | Background                       | Text    | Border      |
| ------- | -------------------------------- | ------- | ----------- |
| default | #f1f5f9 (--color-surface-muted)  | #0f172a | transparent |
| hover   | #f8fafc (--color-surface-subtle) | #0f172a | transparent |

### Variant: outline

| State   | Background                       | Text    | Border                           |
| ------- | -------------------------------- | ------- | -------------------------------- |
| default | transparent                      | #0f172a | #e2e8f0 (--color-border-default) |
| hover   | #f8fafc (--color-surface-subtle) | #0f172a | #e2e8f0                          |

### Sizes

| Size | Height     | Padding X     | Font                | Icon Size | Gap |
| ---- | ---------- | ------------- | ------------------- | --------- | --- |
| sm   | 24px (h-6) | 6px (px-1.5)  | text-body-sm (11px) | 12px      | 4px |
| md   | 32px (h-8) | 8px (px-2)    | text-body-md (12px) | 14px      | 6px |
| lg   | 36px (h-9) | 10px (px-2.5) | text-body-md (12px) | 16px      | 8px |

## thaki-shared 현재 디자인

| Property      | 현재 값                           | 비고                    |
| ------------- | --------------------------------- | ----------------------- |
| size          | 12x12px (size-3)                  | 아이콘 크기 = 버튼 크기 |
| padding       | 0                                 | 패딩 없음               |
| background    | transparent                       | —                       |
| text          | text-muted (#475569)              | —                       |
| hover bg      | surface-hover (#f1f5f9)           | —                       |
| hover text    | text (#0f172a)                    | —                       |
| active text   | text-strong                       | —                       |
| border-radius | rounded-sm (2px)                  | TDS: 4px                |
| focus         | outline 2px border-focus offset-2 | TDS: ring-2             |
| transition    | duration-control                  | TDS: 150ms              |
| icon          | 인라인 SVG 12x12                  | TDS: Tabler Icons       |

## 주요 디자인 차이

1. **크기**: shared 12x12 (icon-only) vs TDS 24px+ (패딩 포함)
2. **기본 텍스트색**: shared text-muted(#475569) vs TDS text-default(#0f172a)
3. **border-radius**: shared rounded-sm(2px) vs TDS 4px (--radius-sm)
4. **hover bg**: shared surface-hover(#f1f5f9) vs TDS surface-subtle(#f8fafc)
5. **focus 스타일**: shared outline-based vs TDS ring-based
