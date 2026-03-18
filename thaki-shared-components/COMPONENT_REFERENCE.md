# ThakiCloud/thaki-shared Component Reference

Fetched from ThakiCloud/thaki-shared (main branch). Props interfaces and brief descriptions.

---

## 1. Accordion

**Props (AccordionRoot / Accordion.Group):**

- type?: 'single' | 'multiple'
- defaultValue?: string | string[]
- value?: string | string[]
- onChange?: (value: string | string[]) => void
- collapsible?: boolean
- disabled?: boolean
- className?: string
- children: React.ReactNode

**Props (AccordionItem):**

- id: string, header: React.ReactNode, children: React.ReactNode
- className?, style?, aria-label?, keepMounted?
- isOpen?, onToggle?, disabled? (injected)

**Description:** Collapsible accordion group. Supports single/multiple open panels, controlled/uncontrolled, and optional collapsible behavior.

---

## 2. ActionModal

**Props:**

- actionConfig: ActionConfig { title, subtitle?, actionButtonText, actionButtonVariant: 'error'|'primary'|'secondary', cancelButtonText? }
- onAction?: () => void | Promise<void>
- focusActionButtonOnOpen?: boolean
- isLoading?, loadingText?, confirmDisabled?
- children?: React.ReactNode
- Extends OverlayProps

**Description:** Generic action modal built on Overlay.Template with confirm/cancel buttons and configurable layout.

---

## 3. Badge

**Props:**

- children: ReactNode
- theme?: 'blu'|'red'|'gry'|'gre'|'ylw'
- size?: 'sm'|'md'|'lg'
- type?: 'subtle'|'solid'
- layout?: 'text-only'|'left-icon'|'right-icon'
- icon?: ReactElement
- className?: string

**Description:** Badge for status, category, or label display. Supports themes, sizes, and optional icon.

---

## 4. Breadcrumb

**Props:**

- items: BreadcrumbItem[] { label, path?, onClick?, isLoading? }
- className?: string

**Description:** Breadcrumb navigation. Items can be links, buttons, or current page text; supports loading skeletons.

---

## 5. Button

**Props (extends React.ButtonHTMLAttributes):**

- variant?: 'primary'|'secondary'|'tertiary'|'success'|'error'|'warning'|'muted'
- appearance?: 'solid'|'outline'|'ghost'
- size?: 'xs'|'sm'|'md'|'lg'
- isLoading?, loadingElement?, fullWidth?
- children: React.ReactNode

**Description:** CVA-based button with variant x appearance x size. Supports loading, icon-only detection, and full width.

---

## 6. CardList

**Props:**

- className?, list: T[] | null | undefined
- isLoading?, numbersOfSkeleton?, skeletonUI?, emptyUI?, errorCardUI?
- children: (item: T, index: number) => ReactNode

**Description:** Renders loading skeletons, empty state, or a list of cards. Each card wrapped in ErrorBoundary.

---

## 7. Checkbox

**Props:**

- name?, label?, value?: string | number
- checked?, defaultChecked?, disabled?, size?
- onChange?: (checked: boolean) => void
- children?: React.ReactNode

**Description:** Checkbox with optional label. Supports controlled/uncontrolled, sizes, and form attributes.

---

## 8. ContextMenu

**Structure:** ContextMenu = { Root, SubItems, Item }

**ContextMenu.Root Props:**

- trigger: (props: { isOpen, open, close, toggle }) => ReactElement
- children: React.ReactNode
- className?, disabled?, direction?, gap?
- subContextMenuDirection?, contentClassName?, position?
- closeOnMouseLeave?, closeDelayMs?, onScrollEnd?

**ContextMenu.Item Props:**

- children: React.ReactNode, action: () => void | Promise<void>
- disabled?: boolean | { reason: string; direction?: Direction }
- danger?, preventCloseAfterAction?, className?

**Description:** Click-triggered context menu with Portal, keyboard navigation, and submenus.

---

## 9. CopyButton

**Props:**

- text: string
- className?, children?: ReactNode

**Description:** Button that copies text to clipboard. Shows copy/check icon and optional label.

---

## 10. CreateLayout

**Props (discriminated union):**

- With custom header: header: ReactNode, title?: never, headerActions?: never
- With default header: header?: never, title?: ReactNode, headerActions?: ReactNode
- Common: children, sidebar?, sidebarWidth?, minWidth?, contentGap?

**Description:** Layout for create pages: main content left, sticky FloatingCard right. Supports custom or default header.

---

## 11. DatePicker

**Props:**

- mode?: 'single'|'range'
- value?: Date | DateRange
- onChange?, onApply?, onCancel?
- className?, numberOfMonths?, isLoading?
- minDate?, maxDate?, preventFutureSet?

**Description:** Calendar for single date or date range. Supports Apply/Cancel, min/max, and future-date restriction.

---

## 12. DeleteResourceModal

**Props:**

- targets: DeleteResourceTarget[] { id, name? }
- forceBulk?, infoItems?, content?, confirmDisabled?, isLoading?, errorMessage?
- labels?: DeleteResourceModalLabels
- children?, onAction?

**Description:** Delete confirmation modal for single or bulk resources. Uses ResourceActionModal with configurable labels.

---

## 13. DetailCard

**Props:**

- title?: string
- fields: DetailCardField[] { label, value, type?: 'text'|'component', component? }
- actions?: React.ReactNode
- visible?, isLoading?

**Description:** Card for detail/create pages with label-value pairs. Supports text, custom components, and loading skeleton.

---

## 14. DetailPageHeader

**Props:**

- title: string
- actions?: React.ReactNode
- infoFields?: DetailPageHeaderInfoField[] { label, value, showCopyButton?, copyText?, width?, accessory? }
- maxWidth?: number
- isLoading?: boolean

**Description:** Header for detail pages with title, actions, and info cards. Info fields support copy button and accessory.

---

## 15. Disclosure

**Props:**

- className?, width?
- label?, children?
- expanded?, onExpandChange?
- disabled?, keepMounted?, onClick?

**Description:** Expandable/collapsible section with label. Supports controlled/uncontrolled and optional "(optional)" suffix.

---

## 16. Dropdown

**Structure:** Dropdown = { Select, ComboBox, Option }

**Dropdown.Select Props:**

- value?, defaultValue? (OptionValue = string | number | boolean)
- placeholder?, disabled?, isLoading?, size?, noData?
- numbersOfOptionsInView?, onChange?, onSelect?
- closeWhenScrolled?, onScrollEnd?, scrollEndThreshold?
- children: React.ReactElement[]

**Dropdown.Option Props:**

- value: OptionValue, label: string, disabled?, onClick?

**Description:** Portal-based select dropdown with keyboard navigation. Supports controlled/uncontrolled and scroll-end callback.

---

## 17. EmptyUI

**Props:**

- content: EmptyUIContent { title, description? }
- className?, children?: ReactNode

**Description:** Empty state for tables/lists. Shows title, optional description, and optional actions.

---

## 18. Fieldset

**Props:**

- legend: string
- description?, error?
- disabled?, variant?, direction?
- requiredIndicator?: 'asterisk'|'text'|'none'
- children: ReactNode

**Description:** Form field group with legend, description, error, and layout. Provides FieldsetContext for child FormFields.

---

## 19. FilterSearchInput

**Props:**

- filterKeys: FilterKey[] { key, label, type: 'select'|'input'|'number'|'date'|'dateRange', options?, placeholder?, minDate?, maxDate?, preventFutureSet? }
- placeholder?, className?
- onFilterAdd: (filter: FilterKeyWithValue) => void
- defaultFilterKey?, selectedFilters?

**Description:** Filter search input: choose filter key, enter/select value, add filter. Supports input, select, number, date range.

---

## 20. FloatingCard

**Props:**

- summaryTitle?, sections?, quotaTitle?, quotas?
- className?
- collapsibleSections?, sectionOpenMode?
- defaultExpandedSectionIds?, expandedSectionIds?, onExpandedSectionIdsChange?

**Description:** Sticky summary and quota card for create pages. Shows section status and quota bars with tooltips.

---

## 21. FormField

**Props:**

- label: string (required)
- required?, hint?, error?, success?
- description?: ReactNode
- children: ReactElement (single form control)
- className?, style?, disabled?

**Description:** Form field wrapper with label, description, control, and error/success/hint. Handles ARIA and FieldsetContext.

---

## Summary Table

| Component           | Key Props                                                        |
| ------------------- | ---------------------------------------------------------------- |
| Accordion           | type, value/defaultValue, onChange, collapsible, disabled        |
| ActionModal         | actionConfig, onAction, isLoading, confirmDisabled               |
| Badge               | theme, size, type, layout, icon                                  |
| Breadcrumb          | items (label, path, onClick, isLoading)                          |
| Button              | variant, appearance, size, isLoading, fullWidth                  |
| CardList            | list, isLoading, children render prop, emptyUI, errorCardUI      |
| Checkbox            | checked, onChange, size, disabled, label/children                |
| ContextMenu         | Root: trigger, children; Item: action, disabled, danger          |
| CopyButton          | text, children                                                   |
| CreateLayout        | header OR title+headerActions, sidebar, sidebarWidth             |
| DatePicker          | mode, value, onChange, onApply, minDate, maxDate                 |
| DeleteResourceModal | targets, labels, onAction, isLoading                             |
| DetailCard          | title, fields, actions, isLoading                                |
| DetailPageHeader    | title, actions, infoFields, maxWidth, isLoading                  |
| Disclosure          | label, expanded, onExpandChange, keepMounted                     |
| Dropdown            | Select: value, onChange, placeholder, size; Option: value, label |
| EmptyUI             | content (title, description), children                           |
| Fieldset            | legend, description, error, variant, direction                   |
| FilterSearchInput   | filterKeys, onFilterAdd, defaultFilterKey, selectedFilters       |
| FloatingCard        | sections, quotas, collapsibleSections, sectionOpenMode           |
| FormField           | label, required, hint, error, children                           |

---

## Icon

**Props (IconProps):**

- children: React.ReactElement (required - Tabler icon or custom SVG)
- variant?: IconVariant ('primary'|'secondary'|'success'|'warning'|'error'|'info'|'muted'|'brand'|'inverse'|'compute'|'container'|'mlops')
- size?: IconSize ('xs'|'sm'|'md'|'lg'|'xl' | number)
- weight?: IconWeight ('thin'|'light'|'regular'|'bold'|'fill'|'duotone')
- color?: string
- duotone?: DuotoneColors { primary, secondary }
- mirrored?: boolean
- withStroke?: boolean
- className?, style?, 'aria-label'?, 'aria-hidden'?, onClick?

**Description:** Design system icon wrapper for Tabler icons and custom SVGs. Applies variant, size, and weight system with RTL support.

---

## InfoContainer

**Props:**

- label: string
- values: string[]
- maxVisibleItems?: number (default: 3)
- showBullets?: boolean (default: false)
- className?: string

**Description:** Read-only container for label and value list. Used in modals/drawers for resource info display. Supports scroll when items exceed maxVisibleItems.

---

## InlineMessage

**Props:**

- type?: 'success'|'info'|'warning'|'error' (default: 'info')
- message: ReactNode
- closable?: boolean (default: false)
- onClose?: () => void
- expandable?: boolean (default: false)
- timestamp?: ReactNode
- className?: string

**Description:** Inline message for success, info, warning, or error. Supports closable button and expandable accordion for long text.

---

## Input

**Props (extends Omit<InputHTMLAttributes, 'size'|'defaultValue'|'onChange'>):**

- error?: boolean
- success?: boolean
- size?: ComponentSize ('xs'|'sm'|'md'|'lg')
- showPasswordToggle?: boolean
- filter?: RegExp | ((value: string) => string)
- onChange?: (e: ChangeEvent, filteredValue: string) => void
- defaultValue?: string | number (uncontrolled)

**Description:** Text input with error/success states, sizes, password toggle, and optional input filter (e.g., numbers only).

---

## FormInput

**Props (extends InputProps, omits value|onChange|defaultValue):**

- control: Control<T> (react-hook-form)
- name: Path<T>
- ...inputProps

**Description:** Input integrated with react-hook-form via Controller. Avoids controlled/uncontrolled conflicts when using register.

---

## LangButton

**Props:**

- onLanguageChange: (lang: 'en'|'ko') => void
- variant?: IconVariant (default: 'secondary')
- className?: string

**Description:** Language selector button. Shows EN/KO ContextMenu on click; dispatches locale-change and persists to localStorage.

---

## Layout

**Props (Container):** maxWidth?: 'sm'|'md'|'lg'|'xl', padding?: 'sm'|'md'|'lg', className?, ...HTMLAttributes
**Props (Block):** title, subtitle?, icon?, children
**Props (VStack/HStack):** gap?, align?, justify?, className?, children
**Props (Grid.Container):** columns, gap?, children
**Props (Grid.Item):** colSpan?, children
**Props (Divider):** spacing?

**Description:** Layout primitives: Container, Block, VStack, HStack, Grid, Divider for page and section layout.

---

## LoadingSpinner

**Props:**

- size?: ComponentSize ('xs'|'sm'|'md'|'lg') (default: 'md')
- color?: 'primary'|'secondary'|'inverse' (default: 'primary')
- className?: string

**Description:** Loading spinner for async states. Supports size and color variants; used inside buttons for loading state.

---

## MonitoringToolbar

**Props:**

- timeRange: string
- onTimeRangeChange: (value: string) => void
- timeOptions?: TimeOption[] (default: 30m, 1h, 6h, 12h, 24h)
- customPeriod: CustomPeriod | null
- onCustomPeriodChange: (period: CustomPeriod | null) => void
- onRefresh?: () => void
- showRefreshButton?: boolean (default: true)
- minDate?, maxDate?, defaultTimeRange?, periodLabel?

**Description:** Toolbar for graph data time range. Relative time segments, custom period picker, and refresh button.

---

## MultiItemDisplay

**Props:**

- items: string[] | Record<string, string>
- emptyText?: string (default: '-')

**Description:** Displays multiple items as first item + (+N). Hover on (+N) shows full list in tooltip. Supports array or key-value object.

---

## NavigationControls

**Props:**

- canGoBack: boolean
- canGoForward: boolean
- onGoBack: () => void
- onGoForward: () => void
- className?: string

**Description:** Back/forward navigation buttons for tab history. Behaves like browser navigation controls.

---

## Overlay

**Props (Overlay.Template - OverlayOptions):**

- type: 'modal'|'drawer-horizontal'|'drawer-vertical'
- title, description?, children
- appeared: boolean
- onConfirm: (result?: unknown) => void
- onCancel: () => void
- confirmUI?, cancelUI?, isLoading?, confirmDisabled?
- size?, drawerType?, portalScope?

**Description:** Modal and drawer overlay template. Composed with Overlay.Container for portal rendering and animation.

---

## Pagination

**Props:**

- totalCount: number
- size: number (items per page)
- currentAt: number (1-based)
- onPageChange: (page, data?) => void
- disabled?: boolean
- prevIcon?, nextIcon?
- onSettingClick?, settingIcon?, settingAriaLabel?, settingTooltip?
- totalCountLabel?: string (e.g., "items")
- className?: string

**Description:** Pagination with prev/next, page list (ellipsis for 7+ pages), optional settings button, and total count label.

---

## Password

**Props:** Same as PasswordInput (extends Input with password-specific behavior)

**Description:** Password input wrapper. Re-exports PasswordInput for password fields with validation and visibility toggle.

---

## ProgressBar

**Props:**

- value: number
- pendingValue?: number (default: 0)
- max?: number (default: 100)
- label?: string | ReactNode
- showValue?: 'percentage'|'absolute'|false (default: 'percentage')
- variant?: 'primary'|'success'|'warning'|'danger' (default: 'success')
- color?, pendingColor?
- className?

**Description:** Progress bar with optional pending segment. Supports label, percentage/absolute value display, and color variants.

---

## RadioButton

**Props:**

- value: string | number
- checked?: boolean (default: false)
- disabled?: boolean
- size?: 'sm'|'md'|'lg' (default: 'md')
- label?: string
- name?: string
- onChange?: (value: string | number) => void

**Description:** Single radio button. Use with RadioGroup for multi-option selection.

---

## RadioGroup

**Props:**

- name: string
- options: { value, label, disabled? }[]
- selectedValue: string | number
- onChange: (value: string | number) => void
- legend?: string
- required?: boolean
- disabled?: boolean (default: false)
- direction?: 'vertical'|'horizontal' (default: 'vertical')
- errorMessage?: string
- renderOption?: custom render function

**Description:** Radio button group with legend, required indicator, and optional error message. Supports vertical/horizontal layout.

---

## Range

**Props (Single):** value?: number, defaultValue?: number, onChange?: (value: number) => void, onChangeEnd?: (value: number) => void
**Props (Dual):** dual: true, value?: [number, number], defaultValue?: [number, number], onChange?: ([min, max]) => void, onChangeEnd?
**Common:** className?, width?, min?, max?, disabled?

**Description:** Slider for single or dual (range) value selection. Controlled/uncontrolled, with onChangeEnd for drag end.

---

## RefreshButton

**Props (extends ButtonProps, omits children|variant|size):**

- onRefresh: () => void
- duration?: number (default: 10000) - countdown ms
- size?: 'sm'|'md'|'lg' (default: 'md')
- refreshUI?: ReactNode (custom icon)
- appearance?: 'ghost'|'outline' (default: 'ghost')
- isLoading?, disabled?, onClick?, className?

**Description:** Refresh button with rotating icon animation and optional countdown. Triggers onRefresh on click.

---

## ResourceActionModal

**Props (extends ActionModalProps):**

- actionConfig, onAction
- content?: ContentConfig | null { type?: InlineMessageType, message }
- infoItems?: InfoItem[] { label, values, variant?, showBullets? }
- children?: ReactNode
- showSeparator?: boolean (default: false)

**Description:** Action modal for resource operations. Displays InfoContainer list and optional InlineMessage. Built on ActionModal.

---

## Sidebar

**Props:**

- isCollapsed?: boolean (default: false)
- children: ReactNode (menu content)
- logo?: { src, alt }

**Description:** Sidebar skeleton with header and menu area. Children render menu items; collapsed hides menu content.

---

## Skeleton

**Props:**

- borderRadius?: string
- className?: string

**Description:** Placeholder for loading content. Uses animate-skeleton; borderRadius defaults to inherit.

---

## StatusIndicator

**Props:**

- variant?: StatusVariant ('active'|'pending'|'error'|'draft'|'suspended'|'shelved'|'mounted'|'shutoff'|'down'|'paused'|'building'|'deleting'|'inUse'|'degraded'|'offline'|'noMonitor')
- colorScheme?: StatusColorScheme ('success'|'danger'|'warning'|'muted'|'info')
- customIcon?: ReactNode
- label?: string
- layout?: 'leftIcon'|'iconOnly'
- tooltip?: string
- className?: string

**Description:** Status badge with predefined icon+color or custom icon. Supports tooltip and leftIcon/iconOnly layout.

---

## Stepper

**Props:**

- stepIds: readonly StepId[]
- defaultOpenedId?: StepId
- onAllStepsCompleted?: () => void
- onStepChange?: ({ prev, current }) => void
- localeText?: StepperLocaleText
- children: StepperStepConfig[] { id, label, editUI, doneUI, autoFilled?, onComplete?, onCancel?, dependsOn?, editable?, skippable? }

**Description:** Multi-step wizard with accordion sections. Supports completion guards, dependencies, skip, and auto-filled steps.

---

## TabBar

**Props:**

- tabs: TabItem[] { id, title, closable?, draggable?, fixed? }
- activeTab: string
- onTabClick: (tabId: string) => void
- onTabClose: (tabId: string) => void
- onAddTab: () => void
- onTabReorder?: (fromIndex, toIndex) => void
- onTabDragStart?: (tabId, e) => void
- enableWindowDragPassthrough?: boolean (default: false)
- className?: string

**Description:** Browser-style tab bar with add/close, drag reorder, and scroll. Used in AppLayout header.

---

## TabContainer

**Props (config):**

- routes: RouteRegistry
- componentLoaders: Record<ComponentName, () => Promise<{ default: Component }>>

**Description:** Tab content container with route-based lazy loading. Handles 403/404/500 errors and overlay cleanup per tab.

---

## TabSelector

**Props:**

- options: TabSelectorOption[] { id, label, disabled? }
- value?: string (controlled)
- defaultValue?: string (uncontrolled)
- onChange?: (id: string) => void
- variant?: 'small'|'medium'|'pill' (default: 'medium')
- layout?: 'horizontal'|'vertical' (default: 'horizontal')
- className?, ariaLabel?, ariaLabelledBy?

**Description:** Segment control for option selection. Small/medium/pill variants; horizontal or vertical layout.

---

## Table

**Props:**

- rows: TData[]
- columns: TableColumn[] { key, header?, width?, clickable?, align?, sortable?, isEllipsis? }
- className?, minWidth?, maxWidth?
- isLoading?, loadingRowCount?, loadingUI?, emptyUI?
- onClickRow?: (row, e) => void
- renderHeaderCell?, onColumnResize?, columnWidths?
- sort?, order?, onSortChange?
- stickyLastColumn?, tableLayout?: 'fixed'|'auto'

**Description:** Data table with sorting, column resize, loading/empty states. ExpandableTable extends with expandedRowRender, selection.

---

## Tabs

**Props:**

- activeTabId?: string (controlled)
- defaultActiveTabId?: string (uncontrolled)
- onChange?: (id: string) => void
- size?: 'sm'|'md' (default: 'md')
- variant?: 'line'|'button' (default: 'line')
- destroyOnHidden?: boolean
- fullWidth?: boolean (default: true)
- contentClassName?
- children: Tab[] { id, label, disabled?, children }

**Description:** Tab navigation with line or button variant. Supports controlled/uncontrolled, destroyOnHidden, and scroll buttons.

---

## Tag

**Props:**

- label: string
- value?: string (after separator)
- onClose?: () => void
- variant?: 'filter'|'multiSelect' (default: 'filter')
- className?, ariaLabel?

**Description:** Tag for filters or multi-select. Label|value format; optional close button.

---

## TagInput

**Props:**

- tags: Tag[] { key, value }
- onTagsChange: (tags: Tag[]) => void
- validate?: (tags) => TagValidationResult
- onValidationChange?: (result) => void
- handleRef?: Ref<TagInputHandle>
- maxTags?: number (default: 50)
- onMaxReached?: () => void
- disabled?, readOnly?
- labels?: TagInputLabels
- children: ReactNode (TagInput.List, TagInput.AddButton)

**Description:** Key-value tag input with validation. Compound component; supports add/remove, max tags, and touchAll for validation.

---

## TcTable

**Props:** Compound table with TcTable.Tr, TcTable.Td, TcTable.Header, TcTable.Body, TcTable.Footer. Supports selection, expansion, column resizing, sticky last column.

**Description:** Advanced table component with selectable rows, expandable rows, and column resizing. Uses RowContext for click/disabled state.

---

## Terminal

**Props:**

- title?: string (default: 'Terminal')
- wsUrl?: string | buildWsUrl?: () => string
- wsMessageFormat?: 'json'|'raw' (default: 'json')
- authToken?: string
- theme?: TerminalTheme
- fontSize?, fontFamily?, cursorBlink?
- onConnectionChange?, onError?, onClose?
- onOpenInNewWindow?
- debug?, mockMode?
- clearSignal?, autoReconnect?, maxReconnectAttempts?, reconnectDelay?
- welcomeMessages?, prompt?
- formatConnectedMessage?, formatMockCommandMessage?
- renderIcon?, hideHeader?, autoFocus?, focusSignal?
- dragHandleClassName?, isNewWindow?, fullWidth?, className?

**Description:** WebSocket-based remote terminal using xterm.js. Supports reconnection, mock mode, and new-window mode.

---

## Textarea

**Props (extends TextareaHTMLAttributes, omits size|children):**

- error?: boolean
- success?: boolean
- size?: 'sm'|'md'|'lg' (default: 'md')
- resize?: 'none'|'vertical'|'horizontal'|'both' (default: 'vertical')
- autoResize?: boolean (default: false)
- showCharacterCount?: boolean (default: false)
- onChange?
- rows?, maxLength?, disabled?, value?, defaultValue?

**Description:** Multi-line text input. Supports error/success, resize options, auto-resize, and character count.

---

## Title

**Props:**

- title: string
- size?: 'small'|'medium'|'large' (default: 'large')
- className?: string

**Description:** Page or section title. Renders h2 with size variants.

---

## Toast

**Props (extends ToastType):**

- type?: 'positive'|'negative' (default: 'negative')
- message: string
- description?: string
- resourceName?: string | null
- handleDismiss: () => void (required)
- timestamp?: number
- appIcon?: ReactElement
- onNavigate?: () => void

**Description:** Toast notification for status messages. Used with sonner toast.custom(); handleDismiss required for close.

---

## Toggle

**Props:**

- checked?: boolean (controlled)
- defaultChecked?: boolean (uncontrolled, default: false)
- disabled?: boolean
- name?: string
- checkedLabel?, uncheckedLabel?
- onChange?: (e: ChangeEvent) => void
- className?: string

**Description:** On/off switch. Supports controlled/uncontrolled and optional labels for each state.

---

## ToolBar

**Props:**

- breadcrumbItems: BreadcrumbItem[]
- navigation: NavigationConfig { canGoBack, canGoForward, onGoBack, onGoForward }
- isSidebarOpen: boolean
- onToggleSidebar: () => void
- langButton: ReactNode
- rightActions?: ReactNode
- className?, fullWidth? (default: true)

**Description:** App top toolbar with sidebar toggle, navigation controls, breadcrumb, language button, and right actions.

---

## Tooltip

**Props:**

- children: ReactNode (trigger)
- content: ReactNode
- direction?: Direction (default: 'top')
- visibile?: boolean (external control)
- className?
- focusable?: boolean (default: true)

**Description:** Tooltip on hover/focus. Uses Portal with CSS Anchor Positioning for optimal placement. Content can be string or ReactNode.

---

## Typography

**Props (Title):** as?, level?: 1|2|3|4, color?, className?, children
**Props (Text):** as?, variant?: 'paragraph'|'caption', color?, className?, children
**Props (Label):** as?, color?, className?, children, htmlFor?

**Description:** Typography primitives: Title (h1-h4), Text (paragraph/caption), Label. Supports polymorphic 'as' and color variants.

---

## FrameControls

**Props:**

- frameState?: 'normal'|'maximized'
- onMinimize?, onMaximize?, onRestore?, onClose?
- onSnap?: (mode: SnapMode) => void
- className?
- size?: 'sm'|'md'|'lg'

**Description:** Window control buttons: minimize, maximize, restore, close, and snap (top/bottom/left/right half). For frameless app windows.

---

## AppLayout

**Props (config):**

- appName: string
- frameId: string
- routes: RouteRegistry
- componentLoaders: Record<ComponentName, loader>
- AppHeaderTab?, SidebarComponent?, LangButton?
- LogoComponent?, AppIcon?
- showIconWhenCollapsed?, wideSidebar?, showSidebarToggle?
- useBreadcrumbItems: () => BreadcrumbItem[]
- useTabManager: () => { tabs, activeTabId, canGoBack, canGoForward, goBack, goForward, switchTabToPath, ... }

**Description:** Full app layout: sidebar, header with TabBar, ToolBar, main content. Route-based tab loading and overlay per tab.

---

## AppHeaderTab

**Props:**

- useTabManager: () => TabManagerHook
- defaultNewTabRoute: { path, component, title, domain }
- appId: string (for drag payload)
- className?

**Description:** Tab bar for AppLayout header. Integrates with TabProvider; supports tab add/close/reorder and cross-frame drag.

---

## AppIcon

**Props:**

- name: AppIconName ('iam'|'compute'|'storage'|'container'|'ai'|'agent'|'settings'|'compute-admin'|'storage-admin'|'cloud-builder')
- size?: number (default: 24)
- className?: string

**Description:** Branded app icons for sidebar header. createAppIcon(name) returns component for AppLayoutConfig.AppIcon.

---

## PromptEditor

**Props (extends EditorProps):**

- className?
- size?: ComponentSize (default: 'md')
- isDarkMode?: boolean (default: true)
- defaultValue?
- readOnly?: boolean (default: false)
- fontSize?: number (default: 14)
- lineHeight?: number (default: 1.5)
- focusOnMount?: boolean (default: false)
- options?: Monaco options
- onFocus?, onBlur?
- ref?: RefObject<PromptEditorRef> (getValue, setValue)

**Description:** Monaco-based prompt editor for LLM prompts. YAML default; supports dark/light theme, readOnly, and imperative ref.
