# ContextMenu Design Spec

> Extracted from TDS `src/design-system/components/ContextMenu/ContextMenu.tsx`
> thaki-shared target: `src/components/ContextMenu/`

## 구조 차이

| 항목        | TDS                                         | thaki-shared                              |
| ----------- | ------------------------------------------- | ----------------------------------------- |
| 구조        | 단일 컴포넌트 (items prop, data-driven)     | Compound (Root + Item + SubItems)         |
| 스타일 방식 | Tailwind inline classes + CSS 변수          | CVA + Tailwind preset 토큰                |
| 포지셔닝    | Portal (createPortal) + 직접 계산           | Portal 컴포넌트 + direction prop          |
| 포커스 관리 | ArrowUp/Down + Home/End 키보드              | focusedIndex 상태 기반                    |
| 메뉴 요소   | `div[role="menu"]` > `div[role="menuitem"]` | `ul[role="menu"]` > `li[role="menuitem"]` |

## Base Styles — Container (메뉴 패널)

| Property      | TDS Value                                                        | TDS Token                               |
| ------------- | ---------------------------------------------------------------- | --------------------------------------- |
| background    | #ffffff                                                          | `--color-surface-default`               |
| border        | 1px solid #cbd5e1                                                | `--color-border-strong`                 |
| border-radius | 6px                                                              | `--context-menu-radius` → `--radius-md` |
| box-shadow    | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | `--shadow-md`                           |
| z-index       | 5000                                                             | `--z-context-menu`                      |
| overflow      | hidden                                                           | —                                       |
| transition    | opacity 150ms                                                    | `--duration-fast`                       |

## Base Styles — MenuItem (아이템)

| Property    | TDS Value                           | TDS Token                                    |
| ----------- | ----------------------------------- | -------------------------------------------- |
| display     | flex, items-center, justify-between | —                                            |
| min-width   | 80px                                | `--context-menu-min-width`                   |
| padding-x   | 12px                                | `--context-menu-padding-x` → `--spacing-3`   |
| padding-y   | 6px                                 | `--context-menu-padding-y` → `--spacing-1-5` |
| font-size   | 11px                                | `text-body-sm`                               |
| line-height | 16px                                | `text-body-sm`                               |
| font-weight | 400 (regular)                       | `text-body-sm` (regular)                     |
| white-space | nowrap                              | —                                            |
| cursor      | pointer                             | —                                            |
| transition  | colors 150ms                        | `--duration-fast`                            |

## Variants

### status="default"

| State         | Background                          | Text                             | Border |
| ------------- | ----------------------------------- | -------------------------------- | ------ |
| default       | transparent                         | #0f172a (`--color-text-default`) | —      |
| hover         | #f1f5f9 (`--context-menu-hover-bg`) | #0f172a                          | —      |
| focus-visible | #f1f5f9 (`--context-menu-hover-bg`) | #0f172a                          | —      |
| disabled      | transparent                         | #0f172a + opacity 50%            | —      |

### status="danger"

| State         | Background                          | Text                             | Border |
| ------------- | ----------------------------------- | -------------------------------- | ------ |
| default       | transparent                         | #ef4444 (`--color-state-danger`) | —      |
| hover         | #fef2f2 (`--color-state-danger-bg`) | #ef4444                          | —      |
| focus-visible | #fef2f2 (`--color-state-danger-bg`) | #ef4444                          | —      |
| disabled      | transparent                         | #ef4444 + opacity 50%            | —      |

### 아이콘 (icon prop)

| Property       | Value                           |
| -------------- | ------------------------------- |
| icon wrapper   | `shrink-0`, `flex items-center` |
| icon color     | #475569 (`--color-text-muted`)  |
| icon-label gap | 8px (`gap-2`)                   |

### Divider

| Property  | Value                                               |
| --------- | --------------------------------------------------- |
| 적용 조건 | `divider: true` prop 있을 때만                      |
| border    | `border-b border-[--color-border-subtle]` (#f1f5f9) |

### Submenu Arrow (ChevronRight)

| Property    | TDS Value                   |
| ----------- | --------------------------- |
| icon        | `IconChevronRight` (Tabler) |
| size        | 12                          |
| stroke      | 1                           |
| margin-left | 24px (`ml-6`)               |
| shrink      | 0                           |

## Interactive States (동적)

| State       | 조건                   | 적용 스타일                         | 효과                                     |
| ----------- | ---------------------- | ----------------------------------- | ---------------------------------------- |
| showSubmenu | `showSubmenu === true` | `bg-[var(--context-menu-hover-bg)]` | 서브메뉴 열림 시 부모 항목 hover bg 유지 |

## Submenu Container

| Property        | TDS Value            | TDS Token                       |
| --------------- | -------------------- | ------------------------------- |
| background      | #ffffff              | `--color-surface-default`       |
| border          | 1px solid #cbd5e1    | `--color-border-strong`         |
| border-radius   | 6px                  | `--context-menu-radius`         |
| box-shadow      | shadow-md            | `--shadow-md`                   |
| z-index         | 5001                 | `calc(var(--z-context-menu)+1)` |
| max-height      | `calc(100vh - 16px)` | —                               |
| overflow-y      | auto                 | —                               |
| gap from parent | 4px                  | —                               |

## 아이콘 비교

| 아이콘        | TDS 구현                    | size | stroke | thaki-shared 구현                   | viewBox        | strokeWidth |
| ------------- | --------------------------- | ---- | ------ | ----------------------------------- | -------------- | ----------- |
| chevron-right | `IconChevronRight` (Tabler) | 12   | 1      | `ChevronRightIcon` (wrapped Tabler) | Tabler default | 2 (default) |

## Token Mapping (참조)

| TDS Token                                         | Resolved  | thaki-shared Token                                             | Match                           |
| ------------------------------------------------- | --------- | -------------------------------------------------------------- | ------------------------------- |
| `--context-menu-radius` (→ `--radius-md`)         | 6px       | `rounded-base6` → `--semantic-radius-base6` (0.375rem)         | exact                           |
| `--context-menu-padding-x` (→ `--spacing-3`)      | 12px      | `px-sm` → `--semantic-space-sm` (0.5rem=8px)                   | **manual (12 vs 8)**            |
| `--context-menu-padding-y` (→ `--spacing-1-5`)    | 6px       | `py-1.5` → `--primitive-space-1-5` (6px)                       | exact                           |
| `--context-menu-hover-bg` (→ `--color-slate-100`) | #f1f5f9   | `bg-surface-muted` → `--semantic-color-surfaceMuted` (#f8fafc) | **manual (#f1f5f9 vs #f8fafc)** |
| `--shadow-md`                                     | md shadow | `shadow-lg` → `--semantic-shadow-lg`                           | **manual (md vs lg)**           |
| `--color-border-strong`                           | #cbd5e1   | `border-border` → `--semantic-color-border` (#e2e8f0)          | **manual (strong vs default)**  |
| `--color-text-default`                            | #0f172a   | `text-text` → `--semantic-color-text` (#171717)                | manual (token-global)           |
| `--color-state-danger`                            | #ef4444   | `text-error` → `--semantic-color-error` (#dc2626)              | manual (token-global)           |
| `--color-state-danger-bg`                         | #fef2f2   | `bg-danger-bg` → `--semantic-color-dangerBg` (#fef2f2)         | exact                           |
| `--duration-fast`                                 | 150ms     | `duration-fast` → `--semantic-transition-fast` (150ms)         | exact                           |

## 주요 디자인 차이

| #   | Property             | TDS                               | thaki-shared                                          | 변경 유형    | 영향 범위                        | 마이그레이션       |
| --- | -------------------- | --------------------------------- | ----------------------------------------------------- | ------------ | -------------------------------- | ------------------ |
| 1   | **Container border** | `--color-border-strong` (#cbd5e1) | `border-border` → `--semantic-color-border` (#e2e8f0) | style        | —                                | —                  |
| 2   | **Container shadow** | `shadow-md`                       | `shadow-lg`                                           | style        | —                                | —                  |
| 3   | **Item padding-x**   | 12px (`--spacing-3`)              | 8px (`px-sm`)                                         | style        | —                                | —                  |
| 4   | **Item font-size**   | 11px (`text-body-sm`)             | 12px (`text-12`)                                      | style        | —                                | —                  |
| 5   | **Item line-height** | 16px (`text-body-sm`)             | 20px (`leading-20`)                                   | style        | —                                | —                  |
| 6   | **Item font-weight** | 400 (regular)                     | 500 (medium)                                          | style        | —                                | —                  |
| 7   | **Item hover bg**    | #f1f5f9 (`surface-hover`)         | #f8fafc (`surface-muted`)                             | style        | —                                | —                  |
| 8   | **Item divider**     | `divider: true` prop 일 때만      | 모든 아이템 `border-b` (except `:last`)               | style        | —                                | —                  |
| 9   | **Danger hover bg**  | #fef2f2 (`danger-bg`)             | #f8fafc (`surface-muted`)                             | style        | —                                | —                  |
| 10  | **Chevron stroke**   | 1                                 | 2 (Tabler default)                                    | style        | —                                | —                  |
| 11  | **Focused state**    | 없음 (hover/focus-visible만)      | `bg-info-weak-bg text-primary`                        | style        | 제거하면 키보드 포커스 시각 변경 | 유지 권장 (접근성) |
| 12  | Default text color   | #0f172a                           | #171717                                               | token-global | —                                | —                  |
| 13  | Danger text color    | #ef4444                           | #dc2626                                               | token-global | —                                | —                  |

## Apply 대상 요약

**style 변경 (10건)** — `.styles.ts` 수정:

1. `contentStyles`: `border-border` → `border-border-strong`
2. `contentStyles`: `shadow-lg` → `shadow-md`
3. `menuItemStyles` base: `px-sm` → `px-3` (12px)
4. `menuItemStyles` base: `text-12` → `text-11` (11px)
5. `menuItemStyles` base: `leading-20` → `leading-16` (16px)
6. `menuItemStyles` base: `font-medium` → `font-regular` (또는 `font-normal`)
7. `menuItemStyles` base: `hover:bg-surface-muted` → `hover:bg-surface-hover`
8. `menuItemStyles` base: 모든 아이템 `border-b` 제거 (divider는 개별 아이템에서 prop으로 관리)
9. `menuItemStyles` danger variant: `hover:bg-surface-muted` → `hover:bg-danger-bg`
10. `ContextMenu.SubItems.tsx`: `ChevronRightIcon` 의 stroke를 1로 설정

**token-global (2건)** — 미적용:

- text color (#0f172a vs #171717) — 글로벌 토큰 정렬 시 해결
- danger color (#ef4444 vs #dc2626) — 글로벌 토큰 정렬 시 해결

**Focused state** — 유지 권장:

- shared 고유 focused state (키보드 네비게이션 시 파란색 하이라이트)는 접근성 목적이므로 제거하지 않음
- TDS에도 `focus-visible` 시 hover-bg를 적용하므로, 시각적 차이는 있지만 기능적으로 유사
