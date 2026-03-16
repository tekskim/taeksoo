# TDS Pattern Documentation Audit Report

Audit date: 2026-03-16  
Scope: Pattern documentation pages vs actual implementations

---

## 1. List Page Pattern

**Files:** `src/pages/design/patterns/ListPagePatternPage.tsx` vs `src/pages/InstanceListPage.tsx`

| #   | Doc says                                                                    | Code does                                                                                                       | Severity                  |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1.1 | Create button: `variant="primary"` with `leftIcon={<IconPlus size={12} />}` | InstanceListPage: `<Button size="md">` — no `variant="primary"`, no `leftIcon`                                  | **Critical**              |
| 1.2 | Pattern structure: PageHeader → ListToolbar → Pagination → Table            | InstanceListPage: PageHeader → **Tabs** → ListToolbar → Pagination → Table. Tabs sit between header and toolbar | **Minor**                 |
| 1.3 | Pattern doc code snippet shows `IconPlus` in Create button                  | ListPagePatternPage preview component: Create button has no icon                                                | **Minor**                 |
| 1.4 | Pattern wrapped in `VStack gap={3}` only                                    | InstanceListPage wrapped in `PageShell` + `VStack gap={3}` (expected for full page)                             | N/A (doc is pattern-only) |

---

## 2. Detail Page Pattern

**Files:** `src/pages/design/patterns/DetailPagePatternPage.tsx` vs `src/pages/InstanceDetailPage.tsx`

| #   | Doc says                                                            | Code does                                                                                                                                  | Severity                               |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 2.1 | TabPanel: `className="pt-0"` with `VStack gap={4} className="pt-4"` | InstanceDetailPage: Same structure — matches                                                                                               | OK                                     |
| 2.2 | DetailHeader.Actions: ContextMenu wrapping "More Actions"           | InstanceDetailPage: Same — matches                                                                                                         | OK                                     |
| 2.3 | SectionCard with Header + Content + DataRow                         | InstanceDetailPage: Same — matches                                                                                                         | OK                                     |
| 2.4 | Pattern shows 3 tabs (Details, Volumes, Network)                    | InstanceDetailPage: 10 tabs (Details, Volumes, Interfaces, Floating IPs, Security, Snapshots, Monitoring, Resource map, Logs, Action logs) | **Minor** (pattern is minimal example) |

---

## 3. Form Field Pattern

**Files:** `src/pages/design/patterns/FormFieldPatternPage.tsx` vs `src/design-system/components/FormField/FormField.tsx`

| #   | Doc says                                                                               | Code does                                                                                                                                           | Severity  |
| --- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 3.1 | "Constraint text와 Validation Message는 동일한 위치에서 상태에 따라 교체되어 표시된다" | FormField: When `error`, shows `FormField.ErrorMessage`; when not error, shows `FormField.HelperText`. Mutually exclusive — matches                 | OK        |
| 3.2 | Label ↔ Input: 8px, Input ↔ HelperText: 8px                                            | FormField: Control uses `mt-[var(--primitive-spacing-2)]` (8px); HelperText uses `mt-[var(--primitive-spacing-2)]` (8px) — matches                  | OK        |
| 3.3 | Doc uses "Constraint text" / "Validation message"                                      | FormField uses `helperText` / `errorMessage` — naming differs but behavior matches                                                                  | **Minor** |
| 3.4 | Doc: "Full form" = Label, Description, Input, Constraint text                          | FormField: Label, Description (optional), Control, ErrorMessage (conditional), HelperText — order differs: ErrorMessage before HelperText in markup | **Minor** |

---

## 4. Drawer

**Files:** `src/pages/design/components/DrawerSectionPage.tsx` vs `src/design-system/components/Drawer/Drawer.tsx`

| #   | Doc says                                                                | Code does                                                               | Severity  |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------- |
| 4.1 | Tokens: `padding-x: 24px`, `padding-y: 16px`                            | Drawer: `px-6 pt-4 pb-8` → px=24px ✓, pt=16px ✓, **pb=32px** (not 16px) | **Minor** |
| 4.2 | "width: 320px (default)"                                                | Drawer: `width = 320` default — matches                                 | OK        |
| 4.3 | "Form: 360px (4col)", "padding-x: 24px"                                 | Drawer content: `px-6` (24px) — matches                                 | OK        |
| 4.4 | "scrollbar: 6px overlay"                                                | Drawer uses `drawer-scroll` class; global scrollbar is 6px — matches    | OK        |
| 4.5 | "Close 버튼과 border-bottom은 제거됨"                                   | Drawer has no close button, no header border — matches                  | OK        |
| 4.6 | Title ↔ description: 4px (`mt-1`), description ↔ content: 16px (`mb-4`) | Drawer: `mt-1` for description, `mb-4` when no description — matches    | OK        |

---

## 5. Modal

**Files:** `src/pages/design/components/ModalPage.tsx` vs `src/design-system/components/Modal/Modal.tsx`

| #   | Doc says                                                             | Code does                                                                            | Severity     |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------ |
| 5.1 | Tokens: `padding: 24px`                                              | Modal: `p-4` (16px) — **does not use** `--modal-padding` (24px)                      | **Critical** |
| 5.2 | Tokens: `radius: 16px`                                               | Modal: `rounded-[var(--radius-lg)]` (8px) — **does not use** `--radius-modal` (16px) | **Critical** |
| 5.3 | Tokens: `gap: 16px`                                                  | Modal: `gap-4` (16px) — matches                                                      | OK           |
| 5.4 | Tokens: `width: 344px`                                               | Modal: `w-[344px]` — matches                                                         | OK           |
| 5.5 | index.css defines `--modal-padding`, `--modal-radius`, `--modal-gap` | Modal component ignores these and uses hardcoded Tailwind classes                    | **Critical** |

---

## 6. Table

**Files:** `src/pages/design/components/TablePage.tsx` vs `src/design-system/components/Table/Table.tsx` and `src/design-system/presets/columnWidths.ts`

| #   | Doc says                                                        | Code does                                                                              | Severity     |
| --- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------ |
| 6.1 | ListPagePatternPage preview: Status column `width: '60px'`      | `fixedColumns.status` = `'64px'` — preset differs from pattern example                 | **Minor**    |
| 6.2 | TDS rules: Status/actions center, text left, numeric/date right | Table supports `align: 'left' \| 'center' \| 'right'` — matches                        | OK           |
| 6.3 | fixedColumns: status, actions, locked, etc.                     | Table uses `fixedColumns.status`, `fixedColumns.actions` — matches                     | OK           |
| 6.4 | InstanceListPage uses `fixedColumns.actionsDouble`              | **`actionsDouble` is not defined** in `fixedColumns` — would be `undefined` at runtime | **Critical** |
| 6.5 | columnMinWidths presets for name, createdAt, etc.               | Table and InstanceListPage use columnMinWidths — matches                               | OK           |

---

## 7. Select

**Files:** `src/pages/design/components/SelectPage.tsx` vs `src/design-system/components/Select/Select.tsx`

| #   | Doc says                                                         | Code does                                                                               | Severity     |
| --- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------ |
| 7.1 | Width variants: LG = 320px                                       | Select: `lg: 'w-[360px]'` — **360px, not 320px**                                        | **Critical** |
| 7.2 | Design tokens: "Padding (Trigger) 10×8px", "Item Padding 10×6px" | Select uses `--select-padding-x`, `--select-item-padding-x/y` — need to verify CSS vars | **Minor**    |
| 7.3 | Doc: "폼에서 사용 시 반드시 FormField로 감싸 label을 연결한다"   | Select has deprecated `label` and `helperText` props; FormField is recommended          | OK           |
| 7.4 | Doc: "옵션이 3개 이하 고정인 경우 Select를 사용하지 않는다"      | DosDonts matches — no code change                                                       | OK           |

---

## Summary by Severity

### Critical (4)

1. **List Page:** InstanceListPage Create button missing `variant="primary"` and `leftIcon`
2. **Modal:** Padding 16px vs documented 24px; radius 8px vs documented 16px; does not use CSS variables
3. **Table:** `fixedColumns.actionsDouble` undefined — used in InstanceListPage
4. **Select:** LG width 360px vs documented 320px

### Minor (8)

1. List Page: Tabs placement; code snippet vs preview mismatch
2. Detail Page: Tab count (pattern vs real)
3. Form Field: Terminology (Constraint text vs helperText)
4. Form Field: ErrorMessage/HelperText order in markup
5. Drawer: Bottom padding 32px vs documented 16px
6. Table: Status column 60px vs 64px in pattern example
7. Select: Verify padding tokens match CSS

---

## Recommendations

1. **Modal:** Use `--modal-padding`, `--modal-radius` from index.css instead of hardcoded `p-4` and `rounded-[var(--radius-lg)]`.
2. **Table:** Add `actionsDouble` to `fixedColumns` (e.g. `'96px'` or `'112px'` for double icon buttons) or change InstanceListPage to use `fixedColumns.actionWide`.
3. **Select:** Align LG width with docs (320px) or update docs to 360px.
4. **InstanceListPage:** Add `variant="primary"` and `leftIcon={<IconPlus size={12} />}` to Create button per pattern.
5. **List Page Pattern:** Update preview component to match code snippet (add IconPlus to Create button).
