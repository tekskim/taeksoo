# Pagination Design Spec

> Extracted from TDS `src/design-system/components/Pagination/Pagination.tsx`  
> thaki-shared target: `src/components/Pagination/`  
> component-map: **1:1** (Pagination ↔ Pagination)

## Base Styles

| Property                | Value (resolved)   | TDS Token / source                                  |
| ----------------------- | ------------------ | --------------------------------------------------- |
| Item box size           | 24×24px            | `--pagination-item-size`                            |
| Gap (between controls)  | 8px                | `--pagination-gap` → `--spacing-2`                  |
| Border radius (cells)   | 4px                | `--pagination-radius` → `--radius-sm`               |
| Font size (page #, nav) | 12px               | `--pagination-font-size` → `--font-size-12`         |
| Line height             | 16px               | `--pagination-line-height` → `--line-height-16`     |
| Font weight             | 500                | `font-medium`                                       |
| Transition              | color 150ms        | `transition-colors duration-[var(--duration-fast)]` |
| Focus visible           | ring 2px `#3b82f6` | `ring-2` + `--color-border-focus`                   |
| Cursor (page)           | pointer            | `cursor-pointer` on page buttons                    |

## Variants (visual roles)

TDS does not use CVA; roles are composed classes.

### Inactive page button

| State    | Background                                                | Text                                                           | Border |
| -------- | --------------------------------------------------------- | -------------------------------------------------------------- | ------ |
| default  | transparent                                               | `#475569` (`--pagination-text` → `--color-text-muted`)         | —      |
| hover    | `#f1f5f9` (`--pagination-hover-bg` → `--color-slate-100`) | `#0f172a` (`--pagination-text-hover` → `--color-text-default`) | —      |
| disabled | —                                                         | inherits disabled from parent `disabled` on buttons            | —      |

### Active page button

| State   | Background               | Text                      | Border |
| ------- | ------------------------ | ------------------------- | ------ |
| default | `#2563eb`                | `#ffffff`                 | —      |
|         | `--color-action-primary` | `--color-text-on-primary` |        |

### Prev / Next (icon) buttons

Same hover/text stack as inactive page; when disabled:

| State    | Background                  | Text                                |
| -------- | --------------------------- | ----------------------------------- |
| disabled | transparent (hover cleared) | `#94a3b8` (`--color-text-disabled`) |

### Dots (ellipsis)

| State   | Background | Text                                    |
| ------- | ---------- | --------------------------------------- |
| default | —          | `#475569` (same as `--pagination-text`) |

### Footer (total / selected)

| Element    | Style                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Divider    | `h-4` (16px), `w-px`, `#e2e8f0` (`--color-border-default`)                                                                                                           |
| Count text | `text-body-sm` → 11px/16px, `--color-text-subtle` default; selected line uses `--color-text-default` + `font-medium` for count, `--color-text-muted` for `/ N items` |

## Sizes

| Role       | Box  | Font | Line height | Icon (chevron) | Icon (settings) |
| ---------- | ---- | ---- | ----------- | -------------- | --------------- |
| Page / nav | 24px | 12px | 16px        | 14px, stroke 1 | 16px, stroke 1  |

## Interactive States (동적)

| State           | Condition                               | Applied style                                          | Notes         |
| --------------- | --------------------------------------- | ------------------------------------------------------ | ------------- |
| Active page     | `page === currentPage`                  | `activePageClass`                                      | Primary fill  |
| Empty total     | `totalPages <= 0`                       | Single disabled button showing `1` with active styling | Edge UI       |
| Selected footer | `selectedCount > 0` && `totalItems` set | Emphasized selected count + muted total                | Optional prop |
| (기타)          | —                                       | —                                                      | 없음          |

## 아이콘 비교

| 아이콘   | TDS 구현                    | size | stroke | thaki-shared 구현                     | Resolved size     | Stroke (default)       |
| -------- | --------------------------- | ---- | ------ | ------------------------------------- | ----------------- | ---------------------- |
| Prev     | `IconChevronLeft` (Tabler)  | 14   | 1      | `ChevronLeftIcon` (Tabler via `Icon`) | 16 (`size={16}`)  | 1.5 (`weight` regular) |
| Next     | `IconChevronRight` (Tabler) | 14   | 1      | `ChevronRightIcon`                    | 16                | 1.5                    |
| Settings | `IconSettings` (Tabler)     | 16   | 1      | `SettingIcon` (commented UI)          | 16 (default prop) | 1.5                    |

Both codebases ultimately use **Tabler** paths via `@tabler/icons-react` (shared wraps through `Icon`). Visual delta is **pixel size and stroke weight**, not SVG source.

## Token Mapping (참조)

| TDS Token                 | Resolved  | thaki-shared analogue (Pagination.styles)                              | Match  |
| ------------------------- | --------- | ---------------------------------------------------------------------- | ------ |
| `--pagination-item-size`  | 24px      | `min-w-6 h-6` (24px)                                                   | exact  |
| `--pagination-gap`        | 8px       | `gap-2` on list                                                        | exact  |
| `--pagination-radius`     | 4px       | `var(--semantic-radius-base6)` (typically 6px)                         | manual |
| `--pagination-font-size`  | 12px      | `semantic-font-size11` (11px)                                          | manual |
| `--pagination-hover-bg`   | `#f1f5f9` | `hover:enabled:bg-surface-hover` → aligns if token = slate/blueGray100 | likely |
| `--pagination-text`       | `#475569` | page: `semantic-color-textMuted`                                       | exact  |
| `--color-action-primary`  | `#2563eb` | `semantic-color-primary` (see token-map)                               | exact  |
| `--color-text-on-primary` | `#ffffff` | `semantic-color-onPrimary`                                             | exact  |
| `--color-border-focus`    | `#3b82f6` | `semantic-color-focus`                                                 | exact  |
| `--duration-fast`         | 150ms     | `duration-200` (200ms)                                                 | manual |

## Props 기본값 비교 (체크리스트 A)

| Prop / area       | TDS default                                                    | thaki-shared default                                                 | Risk                                                                     |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `siblingCount`    | `1`                                                            | N/A (fixed 7-page window algorithm)                                  | Different page list for same totals                                      |
| `disabled`        | `false`                                                        | `false`                                                              | OK                                                                       |
| `showSettings`    | `false`                                                        | Settings UI **not rendered** (TODO commented)                        | Feature gap                                                              |
| `selectedCount`   | `0`                                                            | N/A                                                                  | TDS-only summary row                                                     |
| Pagination inputs | `currentPage`/`totalPages` required unless `totalCount`+`size` | `totalCount`, `size`, `currentAt` required API                       | Alias supported on TDS (`currentAt`, `totalCount`, `size`)               |
| Demo defaults     | none (0 pages → empty branch)                                  | `totalCount=100`, `size=5`, `currentAt=1`, `totalCountLabel="items"` | shared shows count strip by default; TDS hides until `totalItems` passed |

## 주요 디자인 차이

| 항목               | TDS                                     | thaki-shared                       | 변경 유형      | 영향 / 마이그레이션                                                                                                               |
| ------------------ | --------------------------------------- | ---------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 페이지 숫자 타이포 | 12px/16px medium                        | 11px/16px medium                   | `style`        | Apply: match `--pagination-font-size` / `text-body-md` equivalent                                                                 |
| 셀 모서리          | 4px radius                              | ~6px (`base6`)                     | `style`        | Align to `--radius-sm` or document token                                                                                          |
| 이전/다음 아이콘   | 14px, stroke 1                          | 16px, stroke 1.5                   | `style`        | Match TDS chevron scale for table toolbars                                                                                        |
| 포커스 링          | `ring-2` focus color                    | `outline-2` primary + offset       | `style`        | A11y parity — pick one pattern                                                                                                    |
| 비활성 화살표 색   | `--color-text-disabled`                 | `disabled:color-border-strong`     | `style`        | Strong visual difference — align to semantic disabled text                                                                        |
| 말줄임 문자/색     | `···`, muted                            | `∙∙∙`, `textLight`                 | `style`        | Unify glyph + color token                                                                                                         |
| 전환 시간          | 150ms                                   | 200ms                              | `style`        | `--duration-fast` vs `duration-200`                                                                                               |
| 설정 버튼          | `showSettings` + `onSettingsClick` live | 구현 주석 처리                     | `api-required` | **영향**: shared에서 페이지 크기 UI 연동 불가. **마이그레이션**: TDS API 노출 후 shared에서 TODO 블록 제거 또는 동일 props로 구현 |
| 0건/0페이지        | 네비게이션 유지, `1` 활성 비활성 표시   | `totalCount > 0`일 때만 마운트     | `api-required` | **영향**: 빈 테이블에서 레이아웃/스크린리더 동작 다름. **마이그레이션**: 조건부 렌더 규칙 통일                                    |
| 선택 수 요약       | `totalItems` + `selectedCount`          | 없음                               | `api-required` | **영향**: 벌크 선택 문구는 TDS만. **마이그레이션**: 동일 optional props 추가 또는 리스트 툴바에서 분리                            |
| 페이지 윈도우      | `siblingCount` 기반 범용                | 7페이지 미만 전부 / 이상 고정 패턴 | `api-required` | **영향**: 같은 `currentPage`에서 노출 페이지 수가 다름. **마이그레이션**: 알고리즘 포팅 또는 `siblingCount` 도입                  |

## thaki-shared 구조 메모

- 마크업: `nav` > `ul` > `li` + DS `Button` (`variant="ghost"`, `size="icon-only"`).
- TDS: plain `button` 요소 + 유틸 클래스 (Button 컴포넌트 미사용).

---

_Extract skill: `tds-design-extract` — Pagination_
