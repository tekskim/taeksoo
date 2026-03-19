# CSS Module Audit for `@thaki/shared`

## Summary Metrics

- 46 component-scoped `.module.css` files plus `src/styles/form.module.css` remain in the package.
- Every module consumes design tokens; 28 lean on `--component-*` control tokens, the rest reference `--semantic-*` and `--primitive-*` fallbacks.
- Five modules ship custom animations (`LoadingSpinner`, `RefreshButton`, `Skeleton`, `ContextMenu`, `TabContainer`), and seven opt into accessibility media queries (`prefers-reduced-motion`, `prefers-contrast`, or responsive breakpoints).

## Token Dependency Highlights

- **Component control tokens**: Buttons, Inputs, Textarea, Layout, Tabs family, Table, Overlay use dedicated `--component-*` surfaces, spacing, and typography. Tailwind needs generated theme entries (e.g. `theme.extend.colors.button.solid.primary`).
- **Semantic colors & spacing**: Status, Badge, Tag, Toast, Tooltip, Pagination, ContextMenu, FilterSearch rely on `--semantic-color-*`, `--semantic-space-*`, and `--semantic-radius-*` variables that must be exposed in Tailwind `colors`, `spacing`, `borderRadius`, and `boxShadow` maps.
- **Primitive fallbacks**: `AppLayout`, `Badge`, `DetailCard`, `Title`, `Pagination` supply literal fallbacks (e.g. `var(--primitive-space-4, 1rem)`). Preserve fallbacks by generating Tailwind values from primitives or keeping fallback literals inside custom utilities.
- **Focus handling**: `Input`, `Textarea`, `Tag`, `FormField`, `Overlay` share outline/box-shadow patterns via `--semantic-control-border-focus-*`. Provide Tailwind utilities (e.g. `focus-visible:ring-semantic-control`) or `@apply` macros to centralise the style.

## Grouped Module Inventory

### Foundations & Layout

- `Typography/Typography.module.css`: Heading/paragraph/detail/label classes select font sizes, weights, and color tokens (`--semantic-font-sizeXxl`, `--semantic-color-textMuted`). Straightforward Tailwind typography scale.
- `Layout/Layout.module.css`: Container, block, stack, grid, divider utilities replicate Tailwind concepts (flex directions, gap sizes, grid spans). Uses `--component-layout-*` tokens for padding, radius, and gaps. Candidate for Tailwind component layer or plugin utilities.
- `AppLayout/AppLayout.module.css` & `AppHeaderTab.module.css`: Shell chrome styles, sticky headers, tab interactions with hover/pressed surface tokens and fallback primitive spacing values.
- `styles/form.module.css`: Legacy form spacing/typography overrides for composed pages; minimal tokens (`--semantic-space-inline`). Should be replaced by Tailwind stack utilities.

### Form Controls

- `Input/Input.module.css` & `Textarea/Textarea.module.css`: Base control shells with state modifiers (error, success, disabled) leveraging `--component-input-color-*` tokens, focus rings, and accessibility media queries.
- `Checkbox/Checkbox.module.css`, `RadioButton/RadioButton.module.css`, `RadioGroup/RadioGroup.module.css`: Custom indicator sizing, surface colors, inline spacing tokens; mimicable via Tailwind `peer` patterns plus generated size tokens.
- `Toggle/Toggle.module.css`: Switch track, thumb animations using primitive timing tokens (`--primitive-duration-200`) and custom CSS vars for dimensions (`--toggle-total-width`). Tailwind requires plugin to map toggled state classes.
- `FormField/FormField.module.css` & `Fieldset/Fieldset.module.css`: Label, hint, error text styling plus responsive column collapse at `max-width: 768px`. Provide Tailwind stack utilities and responsive columns.
- `DatePicker/DatePicker.module.css`, `Range/Range.module.css`: Popover surfaces, slider tracks referencing semantic shadows and radii. Tailwind needs custom gradient/track utilities.

### Data Display & Structure

- `Table/Table.module.css`: Table scaffolding, zebra rows, sticky headers, state colors (`--semantic-color-textMuted`). Convert to Tailwind `table-auto`, `border`, and variant classes.
- `DetailCard/DetailCard.module.css`, `CardList/CardList.module.css`: Card surfaces with border, hover highlight, and typographic hierarchies; use `--semantic-font-size14`, `--semantic-radius-md`.
- `Accordion/Accordion.module.css`, `Disclosure/Disclosure.module.css`: Toggle padding/gaps and open-state indicators keyed off semantic spacing tokens.
- `Tabs/Tabs.module.css`, `TabBar/TabBar.module.css`, `TabItem.module.css`, `TabContainer/TabContainer.module.css`, `TabSelector/TabSelector.module.css`: Complex variant matrices for active, disabled, danger states plus animated underline/fade keyframes and thick border tokens. Migration will require shared Tailwind component utilities.
- `Pagination/Pagination.module.css`: Inline-flex pill buttons with `--semantic-radius-base6` and text color toggles; easy Tailwind mapping.
- `FilterSearch/FilterSearch.module.css`: Combined search input + dropdown surface with shadows and focus outlines.
- `Overlay/Overlay.module.css`: Modal scaffolding with multiple radii/shadow tokens (`--semantic-shadow-modal`) and typographic scale.

### Feedback, Status, and Overlay Elements

- `Badge/Badge.module.css`, `StatusIndicator/StatusIndicator.module.css`, `Tag/Tag.module.css`: Badge/status variants anchored on primitive color swatches and spacing tokens; include opacity, border-width variants.
- `Toast/Toast.module.css`, `Tooltip/Tooltip.module.css`, `ContextMenu/ContextMenu.module.css`: Stacked surfaces with shadow tokens, focus traps, and a context menu entrance animation (`@keyframes contextmenu-enter`).
- `LoadingSpinner/LoadingSpinner.module.css`, `RefreshButton/RefreshButton.module.css`: Spinner keyframes referencing semantic color tokens.
- `Skeleton/Skeleton.module.css`: Gradient shimmer keyframes; will need Tailwind animation config.
- `Dim/Dim.module.css`, `Overlay/Overlay.module.css`: Full-screen scrims, z-index layering, use of `--semantic-color-textMuted`.

### Navigation & Shell

- `Breadcrumb/Breadcrumb.module.css`: Horizontal spacing, muted text tokens.
- `Sidebar/Sidebar.module.css`: Responsive collapse via `@media (max-width: 768px)` plus hover/pressed surface tokens.
- `Title/Title.module.css`: Title/subtitle spacing and color tokens for page headers.
- `FrameControls/FrameControls.module.css`: Window control cluster with spacing tokens and opacity handling.

## Reusable Pattern Candidates for Tailwind

- **Control base + focus ring**: Shared between `Input`, `Textarea`, `FormField`, `Tag`, `Overlay`. Create Tailwind component utility (e.g. `.thaki-control`) applying border, radius, transitions, and focus outlines.
- **Flex gap stacks**: Classes such as `.stack-horizontal`, `.gap-sm`, `.align-center`, `.justify-between` in `Layout` should map directly to Tailwind `flex`, `gap`, `items-*`, `justify-*` utilities; consider alias utilities for layout tokens.
- **Surface blocks**: `Layout.block`, `DetailCard`, `Overlay.section` combine border, radius, shadow tokens. Provide Tailwind component class (`.thaki-surface`) with `@apply` to maintain parity.
- **Variant matrices**: Buttons, Tabs, Badges encode multi-variant tokens; generate Tailwind `variants` via plugin or `clsx` helpers that map component props to Tailwind class strings produced from the token aware theme.
- **Animation presets**: Register Tailwind `animation` entries for `spin`, `skeleton-loading`, `contextmenu-enter`, and `tab-fade-in` referencing existing keyframes.
- **Responsive collapse**: Recreate `max-width: 768px` behaviors (Fieldset, Sidebar) via Tailwind `md:`/`lg:` breakpoints aligning with token breakpoints.

## Notes & Risks

- Tailwind must ingest existing token JSON to avoid manual duplication; keep fallbacks until downstream packages drop reliance on CSS variables.
- Media query coverage (`prefers-reduced-motion`, `prefers-contrast`) requires Tailwind variants or manual CSS layers.
- Downstream code imports compiled `.css` from the package; provide compatibility exports or transitional wrapper classes during migration.
