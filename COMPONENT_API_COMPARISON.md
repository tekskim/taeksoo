# thaki-ui vs TDS 컴포넌트 API 비교 분석

## 개요
thaki-ui와 TDS의 공통 컴포넌트들의 Props 인터페이스를 비교 분석한 문서입니다.

---

## 1. Input / Textarea (thaki-ui) vs Input (tds)

| 항목 | thaki-ui Input | thaki-ui Textarea | tds Input | 호환성 조치 |
|------|----------------|-------------------|-----------|------------|
| **컴포넌트 구조** | 단일 Input 컴포넌트 | 별도 Textarea 컴포넌트 | 단일 Input 컴포넌트 (Textarea 별도 없음) | ⚠️ Textarea 기능 통합 필요 |
| **size** | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm' \| 'md' \| 'lg'` | `'sm' \| 'md'` | ⚠️ `xs`, `lg` 제거됨 |
| **variant** | 없음 | 없음 | `'default' \| 'search' \| 'code'` | ✅ tds에 추가됨 |
| **error** | `boolean` | `boolean` | `string \| boolean` | ✅ tds는 에러 메시지도 지원 |
| **success** | `boolean` | `boolean` | 없음 | ⚠️ 제거됨 |
| **showPasswordToggle** | `boolean` | 없음 | 없음 | ⚠️ 제거됨 |
| **filter** | `RegExp \| ((value: string) => string)` | 없음 | 없음 | ⚠️ 제거됨 |
| **onChange** | `(e, filteredValue: string) => void` | `(e) => void` | 표준 `(e) => void` | ⚠️ filteredValue 파라미터 제거 |
| **defaultValue** | `string \| number` | `string` | 표준 HTML | ✅ 호환 |
| **label** | 없음 | 없음 | `string` | ✅ tds에 추가됨 |
| **helperText** | 없음 | 없음 | `string` | ✅ tds에 추가됨 |
| **fullWidth** | 없음 | 없음 | `boolean` | ✅ tds에 추가됨 |
| **leftElement/rightElement** | 없음 | 없음 | `ReactNode` | ✅ tds에 추가됨 |
| **required** | 없음 | 없음 | `boolean` | ✅ tds에 추가됨 |
| **Textarea 전용** | - | `resize`, `autoResize`, `showCharacterCount` | 없음 | ⚠️ Textarea 컴포넌트 필요 |

**주요 차이점:**
- thaki-ui는 Input과 Textarea가 분리되어 있으나, tds는 Input만 존재
- tds Input은 `variant`, `label`, `helperText` 등 추가 기능 제공
- thaki-ui Input의 `filter`, `showPasswordToggle` 기능이 tds에서 제거됨

---

## 2. Dropdown (thaki-ui) vs Select (tds)

| 항목 | thaki-ui Dropdown | tds Select | 호환성 조치 |
|------|-------------------|------------|------------|
| **컴포넌트 구조** | Compound: `Dropdown.Select`, `Dropdown.ComboBox`, `Dropdown.Option` | 단일 `Select` 컴포넌트 | ⚠️ 구조 변경 |
| **options** | 없음 (children 패턴) | `SelectOption[]` (필수) | ⚠️ API 변경 |
| **value** | 없음 | `string` (controlled) | ✅ 추가됨 |
| **defaultValue** | 없음 | `string` (uncontrolled) | ✅ 추가됨 |
| **onChange** | 없음 | `(value: string) => void` | ✅ 추가됨 |
| **placeholder** | 없음 | `string` | ✅ 추가됨 |
| **label** | 없음 | `string` | ✅ 추가됨 |
| **helperText** | 없음 | `string` | ✅ 추가됨 |
| **error** | 없음 | `string` | ✅ 추가됨 |
| **disabled** | 있음 | `boolean` | ✅ 호환 |
| **fullWidth** | 없음 | `boolean` | ✅ 추가됨 |
| **size** | 있음 | `'sm' \| 'md'` | ✅ 호환 |
| **width** | 없음 | `'sm' \| 'md' \| 'lg' \| number` | ✅ 추가됨 |
| **required** | 없음 | `boolean` | ✅ 추가됨 |
| **clearable** | 없음 | `boolean` | ✅ 추가됨 |
| **clearLabel** | 없음 | `string` | ✅ 추가됨 |

**주요 차이점:**
- thaki-ui는 Compound Component 패턴 (`Dropdown.Select`, `Dropdown.Option`)
- tds는 단일 컴포넌트에 `options` 배열을 props로 전달
- tds는 더 많은 폼 관련 기능 제공 (label, helperText, error, clearable 등)

---

## 3. RadioButton/RadioGroup (thaki-ui) vs Radio (tds)

| 항목 | thaki-ui RadioGroup | thaki-ui RadioButton | tds Radio | 호환성 조치 |
|------|---------------------|----------------------|-----------|------------|
| **컴포넌트 구조** | `RadioGroup` + `RadioButton` | 개별 `RadioButton` | 단일 `Radio` + `RadioGroup` Context | ⚠️ 구조 변경 |
| **name** | `string` (필수) | `string` | Context 또는 props | ✅ 호환 |
| **options** | `Array<{value, label, disabled?}>` | 없음 | 없음 | ⚠️ RadioGroup 없음 |
| **selectedValue** | `string` | 없음 | Context `value` | ⚠️ API 변경 |
| **onChange** | `(value: string) => void` | `(e) => void` | Context `onChange` | ⚠️ API 변경 |
| **legend** | `string` | 없음 | 없음 | ⚠️ 제거됨 |
| **required** | `boolean` | 없음 | 없음 | ⚠️ 제거됨 |
| **direction** | `'vertical' \| 'horizontal'` | 없음 | 없음 | ⚠️ 제거됨 |
| **errorMessage** | `string` | 없음 | 없음 | ⚠️ 제거됨 |
| **renderOption** | `(option, isSelected, onChange) => ReactNode` | 없음 | 없음 | ⚠️ 제거됨 |
| **value** | 없음 | `string` | `string` (필수) | ✅ 호환 |
| **checked** | 없음 | `boolean` | Context 또는 props | ✅ 호환 |
| **label** | 없음 | `string` | `ReactNode` | ✅ 호환 |
| **disabled** | `boolean` | `boolean` | `boolean` | ✅ 호환 |
| **description** | 없음 | 없음 | `ReactNode` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `RadioGroup`이 options 배열을 받아 자동 렌더링
- tds는 개별 `Radio` 컴포넌트를 수동으로 배치하고 Context로 연결
- thaki-ui의 `legend`, `required`, `direction`, `errorMessage` 기능이 tds에서 제거됨

---

## 4. Tooltip

| 항목 | thaki-ui Tooltip | tds Tooltip | 호환성 조치 |
|------|------------------|-------------|------------|
| **content** | `ReactNode` | `ReactNode` | ✅ 호환 |
| **children** | `ReactNode` (trigger) | `ReactNode` (trigger) | ✅ 호환 |
| **direction** | `Direction` (top/bottom/left/right 등) | `'top' \| 'bottom' \| 'left' \| 'right'` | ✅ 호환 |
| **visibile** | `boolean` (외부 제어) | 없음 | ⚠️ 제거됨 |
| **focusable** | `boolean` | 없음 | ⚠️ 제거됨 |
| **delay** | 없음 | `number` (ms, 기본 200) | ✅ tds에 추가됨 |
| **disabled** | 없음 | `boolean` | ✅ tds에 추가됨 |
| **position** | 없음 | `TooltipPosition` (direction과 동일) | ✅ 호환 |

**주요 차이점:**
- thaki-ui는 `visibile` prop으로 외부 제어 가능
- tds는 `delay`, `disabled` 기능 추가
- 기본 동작은 유사하나 API가 단순화됨

---

## 5. Toast

| 항목 | thaki-ui Toast | tds Toast | 호환성 조치 |
|------|----------------|-----------|------------|
| **컴포넌트 구조** | 단일 `Toast` 컴포넌트 | `ToastProvider` + `Toast` + `ToastContainer` | ⚠️ 구조 변경 |
| **type** | `'positive' \| 'negative'` | `'success' \| 'warning' \| 'error' \| 'info'` | ⚠️ 타입 변경 |
| **message** | `string` | `string` | ✅ 호환 |
| **description** | `string` | 없음 | ⚠️ 제거됨 (detail로 대체) |
| **resourceName** | `string \| null` | `project?: string` | ✅ 호환 (이름 변경) |
| **timestamp** | `number` (milliseconds) | `Date` | ⚠️ 타입 변경 |
| **appIcon** | `ReactElement` | 없음 | ⚠️ 제거됨 |
| **onNavigate** | `() => void` | `link?: ToastLink` | ⚠️ 구조 변경 |
| **handleDismiss** | `() => void` (필수) | `onDismiss: (id: string) => void` | ⚠️ API 변경 |
| **title** | 없음 | `string` | ✅ tds에 추가됨 |
| **duration** | 없음 | `number` (ms, 기본 5000) | ✅ tds에 추가됨 |
| **dismissible** | 없음 | `boolean` (기본 true) | ✅ tds에 추가됨 |
| **action** | 없음 | `{label?, icon?, onClick}` | ✅ tds에 추가됨 |
| **detail** | 없음 | `{code?, content}` | ✅ tds에 추가됨 |
| **link** | 없음 | `{label, href?, onClick?}` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 단일 컴포넌트, tds는 Provider 패턴 사용
- thaki-ui는 `positive/negative`, tds는 `success/warning/error/info`
- tds는 더 많은 기능 제공 (title, action, detail, link 등)

---

## 6. Pagination

| 항목 | thaki-ui Pagination | tds Pagination | 호환성 조치 |
|------|---------------------|----------------|------------|
| **totalCount** | `number` | 없음 | ⚠️ 제거됨 |
| **size** | `number` (페이지당 항목 수) | 없음 | ⚠️ 제거됨 |
| **currentAt** | `number` (1부터 시작) | `currentPage: number` (1부터 시작) | ✅ 호환 (이름 변경) |
| **onPageChange** | `(page, info?) => void` | `(page: number) => void` | ⚠️ info 파라미터 제거 |
| **disabled** | `boolean` | `boolean` | ✅ 호환 |
| **totalPages** | 없음 | `number` (필수) | ⚠️ tds는 totalPages 직접 계산 필요 |
| **siblingCount** | 없음 | `number` (기본 1) | ✅ tds에 추가됨 |
| **showFirstLast** | 없음 | `boolean` | ✅ tds에 추가됨 |
| **showSettings** | 없음 | `boolean` | ✅ tds에 추가됨 |
| **onSettingsClick** | `onSettingClick?: () => void` | `onSettingsClick?: () => void` | ✅ 호환 |
| **totalItems** | `totalCountLabel?: string` | `totalItems?: number` | ⚠️ 구조 변경 |
| **selectedCount** | 없음 | `number` | ✅ tds에 추가됨 |
| **prevIcon/nextIcon** | `ReactElement` | 없음 (내장 아이콘) | ⚠️ 커스터마이징 제한 |
| **settingIcon** | `ReactElement` | 없음 (내장 아이콘) | ⚠️ 커스터마이징 제한 |

**주요 차이점:**
- thaki-ui는 `totalCount`와 `size`로 자동 계산, tds는 `totalPages` 직접 제공
- thaki-ui는 `onPageChange`에 추가 정보 제공, tds는 단순화
- tds는 `siblingCount`, `showFirstLast`, `selectedCount` 등 추가 기능

---

## 7. Breadcrumb

| 항목 | thaki-ui Breadcrumb | tds Breadcrumb | 호환성 조치 |
|------|---------------------|----------------|------------|
| **items** | `BreadcrumbItem[]` | `BreadcrumbItem[]` | ✅ 호환 |
| **BreadcrumbItem.label** | `string` | `string` | ✅ 호환 |
| **BreadcrumbItem.path** | `string?` | `href?: string` | ✅ 호환 (이름 변경) |
| **BreadcrumbItem.onClick** | `() => void?` | `() => void?` | ✅ 호환 |
| **BreadcrumbItem.isLoading** | `boolean?` | 없음 | ⚠️ 제거됨 |
| **BreadcrumbItem.icon** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |
| **separator** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |
| **maxItems** | 없음 | `number` (기본 0) | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `path`, tds는 `href` 사용
- thaki-ui의 `isLoading` 기능이 tds에서 제거됨
- tds는 `icon`, `separator`, `maxItems` 기능 추가

---

## 8. ProgressBar

| 항목 | thaki-ui ProgressBar | tds ProgressBar | 호환성 조치 |
|------|----------------------|-----------------|------------|
| **value** | `number` | `number` | ✅ 호환 |
| **max** | `number` (기본 100) | `number?` (undefined = 무한대) | ⚠️ 타입 변경 |
| **pendingValue** | `number` (기본 0) | `newValue?: number` | ✅ 호환 (이름 변경) |
| **label** | `string?` | `string?` | ✅ 호환 |
| **showValue** | `'percentage' \| 'absolute' \| false` | `boolean?` | ⚠️ 타입 변경 |
| **variant** | `'success' \| 'error' \| 'warning'` | `'default' \| 'quota'` | ⚠️ 완전히 다른 개념 |
| **color** | `string?` | 없음 | ⚠️ 제거됨 |
| **pendingColor** | `string?` | 없음 | ⚠️ 제거됨 |
| **status** | 없음 | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | ✅ tds에 추가됨 |
| **error** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **errorMessage** | 없음 | `string?` | ✅ tds에 추가됨 |
| **statusText** | 없음 | `string?` | ✅ tds에 추가됨 |
| **size** | 없음 | `'sm' \| 'md'` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `variant`로 색상 제어, tds는 `status`로 상태 제어
- thaki-ui는 `showValue`로 표시 형식 제어, tds는 단순 boolean
- tds는 `error`, `errorMessage`, `statusText` 등 추가 기능

---

## 9. StatusIndicator

| 항목 | thaki-ui StatusIndicator | tds StatusIndicator | 호환성 조치 |
|------|--------------------------|---------------------|------------|
| **variant** | `StatusVariant` (16개 타입) | `StatusType` (19개 타입) | ⚠️ 타입 확장 |
| **colorScheme** | `StatusColorScheme` | 없음 | ⚠️ 제거됨 |
| **customIcon** | `ReactNode?` | 없음 | ⚠️ 제거됨 |
| **label** | `string?` | `string?` | ✅ 호환 |
| **layout** | `'leftIcon' \| 'iconOnly'` | `'icon-only' \| 'default' \| 'badge'` | ⚠️ 타입 변경 |
| **tooltip** | `string?` | 없음 | ⚠️ 제거됨 |
| **size** | 없음 | `'sm' \| 'md' \| 'lg'` (icon-only만) | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `variant` + `colorScheme` + `customIcon` 조합 가능
- tds는 `variant`만 사용하고 더 많은 상태 타입 제공
- tds는 `badge` 레이아웃 추가

---

## 10. Toggle

| 항목 | thaki-ui Toggle | tds Toggle | 호환성 조치 |
|------|----------------|------------|------------|
| **checked** | `boolean?` | `boolean?` | ✅ 호환 |
| **defaultChecked** | `boolean` (기본 false) | `boolean?` | ✅ 호환 |
| **disabled** | `boolean` (기본 false) | `boolean` (기본 false) | ✅ 호환 |
| **name** | `string?` | 없음 | ⚠️ 제거됨 |
| **checkedLabel** | `string?` | 없음 | ⚠️ 제거됨 |
| **uncheckedLabel** | `string?` | 없음 | ⚠️ 제거됨 |
| **onChange** | `(e: ChangeEvent) => void` | `(e: ChangeEvent) => void` | ✅ 호환 |
| **label** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |
| **description** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `checkedLabel/uncheckedLabel`로 상태별 라벨 제공
- tds는 단일 `label`과 `description` 제공
- 기본 기능은 유사하나 라벨링 방식이 다름

---

## 11. Disclosure

| 항목 | thaki-ui Disclosure | tds Disclosure | 호환성 조치 |
|------|---------------------|----------------|------------|
| **컴포넌트 구조** | 단일 컴포넌트 | Compound: `Disclosure` + `Disclosure.Trigger` + `Disclosure.Panel` | ⚠️ 구조 변경 |
| **label** | `string?` | 없음 (Trigger children) | ⚠️ 구조 변경 |
| **children** | `ReactNode` (content) | `ReactNode` (Trigger + Panel) | ⚠️ 구조 변경 |
| **expanded** | `boolean?` (controlled) | `open?: boolean` | ✅ 호환 (이름 변경) |
| **onExpandChange** | `(expanded: boolean) => void` | `onChange?: (open: boolean) => void` | ✅ 호환 (이름 변경) |
| **disabled** | `boolean` (기본 false) | 없음 | ⚠️ 제거됨 |
| **keepMounted** | `boolean` (기본 false) | 없음 (항상 keepMounted) | ⚠️ 제거됨 |
| **onClick** | `() => void?` | 없음 | ⚠️ 제거됨 |
| **width** | `CSSProperties['width']?` | 없음 | ⚠️ 제거됨 |
| **defaultOpen** | 없음 | `boolean` (기본 false) | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 단일 컴포넌트, tds는 Compound Component 패턴
- thaki-ui의 `disabled`, `keepMounted`, `onClick`, `width` 기능이 tds에서 제거됨
- tds는 더 유연한 구조이지만 사용법이 다름

---

## 12. FormField

| 항목 | thaki-ui FormField | tds FormField | 호환성 조치 |
|------|-------------------|---------------|------------|
| **컴포넌트 구조** | 단일 컴포넌트 (children에 props 주입) | Compound: `FormField` + `FormField.Label` + `FormField.Control` + `FormField.HelperText` + `FormField.ErrorMessage` | ⚠️ 구조 변경 |
| **label** | `string` (필수) | 없음 (FormField.Label 사용) | ⚠️ 구조 변경 |
| **required** | `boolean` | `boolean?` | ✅ 호환 |
| **hint** | `string?` | 없음 (FormField.HelperText 사용) | ⚠️ 구조 변경 |
| **error** | `string?` | `boolean?` | ⚠️ 타입 변경 |
| **success** | `string?` | 없음 | ⚠️ 제거됨 |
| **description** | `ReactNode?` | 없음 | ⚠️ 제거됨 |
| **disabled** | `boolean?` | `boolean?` | ✅ 호환 |
| **children** | `ReactElement` (단일 컨트롤) | `ReactNode` (Label, Control, HelperText 등) | ⚠️ 구조 변경 |
| **id** | 없음 | `string?` | ✅ tds에 추가됨 |
| **FormField.Label.size** | 없음 | `'sm' \| 'md'` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 단일 컴포넌트가 children에 props 자동 주입
- tds는 Compound Component 패턴으로 더 명시적 구조
- thaki-ui의 `success`, `description` 기능이 tds에서 제거됨

---

## 13. ContextMenu

| 항목 | thaki-ui ContextMenu | tds ContextMenu | 호환성 조치 |
|------|---------------------|-----------------|------------|
| **items** | 없음 (Compound 패턴) | `ContextMenuItem[]` | ⚠️ 구조 변경 |
| **children** | 없음 | `ReactElement` (trigger) | ✅ 추가됨 |
| **trigger** | 없음 | `'click' \| 'contextmenu'` | ✅ 추가됨 |
| **disabled** | 없음 | `boolean` | ✅ 추가됨 |
| **minTop** | 없음 | `number?` | ✅ 추가됨 |
| **align** | 없음 | `'left' \| 'right'` | ✅ 추가됨 |
| **ContextMenuItem.id** | 없음 | `string` (필수) | ✅ 추가됨 |
| **ContextMenuItem.label** | 없음 | `string` | ✅ 추가됨 |
| **ContextMenuItem.status** | 없음 | `'default' \| 'danger'` | ✅ 추가됨 |
| **ContextMenuItem.submenu** | 없음 | `ContextMenuItem[]?` | ✅ 추가됨 |
| **ContextMenuItem.onClick** | 없음 | `() => void?` | ✅ 추가됨 |
| **ContextMenuItem.disabled** | 없음 | `boolean?` | ✅ 추가됨 |
| **ContextMenuItem.divider** | 없음 | `boolean?` | ✅ 추가됨 |
| **ContextMenuItem.tooltip** | 없음 | `string?` | ✅ 추가됨 |
| **ContextMenuItem.icon** | 없음 | `ReactNode?` | ✅ 추가됨 |

**주요 차이점:**
- thaki-ui는 Compound Component 패턴 (`ContextMenu.Root`, `ContextMenu.Item` 등)
- tds는 단일 컴포넌트에 `items` 배열 전달
- tds는 더 많은 기능 제공 (submenu, tooltip, icon 등)

---

## 14. DatePicker

| 항목 | thaki-ui DatePicker | tds DatePicker | 호환성 조치 |
|------|---------------------|----------------|------------|
| **mode** | `'single' \| 'range'` (기본 'range') | `'single' \| 'range'` (기본 'single') | ⚠️ 기본값 변경 |
| **value** | 없음 | `Date \| null` (single mode) | ✅ 추가됨 |
| **rangeValue** | 없음 | `{start: Date \| null, end: Date \| null}` (range mode) | ✅ 추가됨 |
| **onChange** | `(value: DatePickerValue) => void` | `(date: Date \| null) => void` (single) | ⚠️ API 변경 |
| **onRangeChange** | 없음 | `(range: {start, end}) => void` (range) | ✅ 추가됨 |
| **onApply** | `(value: DatePickerValue) => void?` | 없음 | ⚠️ 제거됨 |
| **onCancel** | `() => void?` | 없음 | ⚠️ 제거됨 |
| **numberOfMonths** | `number` (기본 1) | 없음 | ⚠️ 제거됨 |
| **isLoading** | `boolean` | 없음 | ⚠️ 제거됨 |
| **minDate** | `Date?` | `Date?` | ✅ 호환 |
| **maxDate** | `Date?` | `Date?` | ✅ 호환 |
| **eventDates** | 없음 | `Date[]?` | ✅ tds에 추가됨 |
| **firstDayOfWeek** | 없음 | `0 \| 1` (기본 0) | ✅ tds에 추가됨 |
| **disabled** | 없음 | `boolean` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `onApply`/`onCancel` 패턴, tds는 즉시 `onChange`/`onRangeChange`
- thaki-ui는 `numberOfMonths`, `isLoading` 지원
- tds는 `eventDates`, `firstDayOfWeek`, `disabled` 추가

---

## 15. FloatingCard

| 항목 | thaki-ui FloatingCard | tds FloatingCard | 호환성 조치 |
|------|----------------------|-----------------|------------|
| **summaryTitle** | `string` (기본 'Summary') | `title: string` (필수) | ✅ 호환 (이름 변경) |
| **sections** | `FloatingCardSection[]?` | `FloatingCardSection[]?` | ✅ 호환 |
| **quotaTitle** | `string` (기본 'Quota') | 없음 | ⚠️ 제거됨 |
| **quotas** | `FloatingCardQuotaItem[]?` | `QuotaItem[]?` | ✅ 호환 (이름 변경) |
| **collapsibleSections** | `boolean` (기본 false) | 없음 | ⚠️ 제거됨 |
| **sectionOpenMode** | `'single' \| 'multiple'` | 없음 | ⚠️ 제거됨 |
| **defaultExpandedSectionIds** | `string[]?` | 없음 | ⚠️ 제거됨 |
| **expandedSectionIds** | `string[]?` | 없음 | ⚠️ 제거됨 |
| **onExpandedSectionIdsChange** | `(ids: string[]) => void?` | 없음 | ⚠️ 제거됨 |
| **instanceCount** | 없음 | `number?` | ✅ tds에 추가됨 |
| **onInstanceCountChange** | 없음 | `(count: number) => void?` | ✅ tds에 추가됨 |
| **cancelLabel** | 없음 | `string?` | ✅ tds에 추가됨 |
| **actionLabel** | 없음 | `string?` | ✅ tds에 추가됨 |
| **actionEnabled** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **onCancel** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **onAction** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **position** | 없음 | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | ✅ tds에 추가됨 |
| **showCloseButton** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **onClose** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **isOpen** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **portal** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **width** | 없음 | `string?` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 섹션 접기/펼치기 제어 기능 제공
- tds는 액션 버튼, 포털, 위치 제어 등 추가 기능
- 완전히 다른 사용 사례를 위한 컴포넌트로 보임

---

## 16. InlineMessage

| 항목 | thaki-ui InlineMessage | tds InlineMessage | 호환성 조치 |
|------|----------------------|-------------------|------------|
| **type** | `'success' \| 'info' \| 'warning' \| 'error'` (기본 'info') | `variant: 'success' \| 'warning' \| 'error' \| 'info'` (기본 'info') | ✅ 호환 (이름 변경) |
| **message** | `ReactNode` | `children: ReactNode` | ✅ 호환 (이름 변경) |
| **closable** | `boolean` (기본 false) | 없음 | ⚠️ 제거됨 |
| **onClose** | `() => void?` | 없음 | ⚠️ 제거됨 |
| **expandable** | `boolean` (기본 false) | 없음 | ⚠️ 제거됨 |
| **hideIcon** | 없음 | `boolean?` | ✅ tds에 추가됨 |
| **icon** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 `closable`, `expandable` 기능 제공
- tds는 단순화되어 아이콘 커스터마이징만 가능
- 기본 메시지 표시 기능은 유사

---

## 17. MonitoringToolbar

| 항목 | thaki-ui MonitoringToolbar | tds MonitoringToolbar | 호환성 조치 |
|------|---------------------------|----------------------|------------|
| **timeRange** | `string` | `TimeRangeValue?` | ✅ 호환 (타입 명시) |
| **onTimeRangeChange** | `(value: string) => void` | `(value: TimeRangeValue) => void?` | ✅ 호환 |
| **timeOptions** | `TimeOption[]?` | `TimeRangeOption[]?` | ✅ 호환 (이름 변경) |
| **customPeriod** | `CustomPeriod \| null` | `CustomPeriod \| null?` | ✅ 호환 |
| **onCustomPeriodChange** | `(period: CustomPeriod \| null) => void` | `(period: CustomPeriod \| null) => void?` | ✅ 호환 |
| **onRefresh** | `() => void?` | `() => void?` | ✅ 호환 |
| **showRefreshButton** | `boolean` (기본 true) | `showRefresh: boolean?` | ✅ 호환 (이름 변경) |
| **minDate** | `Date?` | `Date?` | ✅ 호환 |
| **maxDate** | `Date?` | `Date?` | ✅ 호환 |
| **defaultTimeRange** | `string` (기본 '1h') | `TimeRangeValue?` (기본 '30m') | ⚠️ 기본값 변경 |
| **defaultCustomPeriod** | 없음 | `CustomPeriod \| null?` | ✅ tds에 추가됨 |
| **timeRangeOptions** | 없음 | `TimeRangeOption[]?` | ✅ tds에 추가됨 (이름 변경) |

**주요 차이점:**
- API는 거의 동일하나 타입이 더 명시적으로 정의됨
- 기본값이 다름 (thaki-ui: '1h', tds: '30m')
- tds는 uncontrolled 모드 지원 추가

---

## 18. TabBar

| 항목 | thaki-ui TabBar | tds TabBar | 호환성 조치 |
|------|----------------|------------|------------|
| **tabs** | `TabItem[]` | `TabBarItem[]` | ✅ 호환 (이름 변경) |
| **activeTab** | `string` | `string` | ✅ 호환 |
| **onTabClick** | `(tabId: string) => void` | `onTabChange: (tabId: string) => void` | ✅ 호환 (이름 변경) |
| **onTabClose** | `(tabId: string) => void` | `(tabId: string) => void?` | ✅ 호환 |
| **onAddTab** | `() => void` | `onTabAdd?: () => void` | ✅ 호환 (이름 변경) |
| **onTabReorder** | `(fromIndex, toIndex) => void?` | `(fromIndex, toIndex) => void?` | ✅ 호환 |
| **onTabDragStart** | `(tabId, e) => void?` | 없음 | ⚠️ 제거됨 |
| **enableWindowDragPassthrough** | `boolean` (기본 false) | 없음 | ⚠️ 제거됨 |
| **showAddButton** | 없음 | `boolean?` (기본 true) | ✅ tds에 추가됨 |
| **showWindowControls** | 없음 | `boolean?` (기본 true) | ✅ tds에 추가됨 |
| **showBottomBorder** | 없음 | `boolean?` (기본 true) | ✅ tds에 추가됨 |
| **onMinimize** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **onMaximize** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **onWindowClose** | 없음 | `() => void?` | ✅ tds에 추가됨 |
| **TabItem.title** | `string` | `TabBarItem.label: string` | ⚠️ 이름 변경 |
| **TabItem.draggable** | `boolean?` | 없음 | ⚠️ 제거됨 |
| **TabItem.fixed** | `boolean?` | 없음 | ⚠️ 제거됨 |
| **TabItem.icon** | 없음 | `ReactNode?` | ✅ tds에 추가됨 |
| **TabItem.closable** | 없음 | `boolean?` | ✅ tds에 추가됨 |

**주요 차이점:**
- thaki-ui는 드래그 관련 고급 기능 제공
- tds는 윈도우 컨트롤 기능 추가
- 기본 탭 기능은 유사하나 고급 기능이 다름

---

## 요약 및 권장사항

### 호환성 조치 필요도

#### 🔴 높은 우선순위 (Breaking Changes)
1. **Input/Textarea**: Textarea 컴포넌트 추가 필요
2. **Dropdown → Select**: Compound 패턴에서 배열 기반으로 변경
3. **RadioGroup**: options 배열 패턴 제거, 개별 Radio 사용 필요
4. **Toast**: Provider 패턴 도입 필요
5. **Disclosure**: Compound Component 패턴으로 변경
6. **FormField**: Compound Component 패턴으로 변경
7. **ContextMenu**: Compound 패턴에서 배열 기반으로 변경

#### 🟡 중간 우선순위 (API 변경)
1. **Pagination**: totalPages 직접 계산 필요
2. **ProgressBar**: variant 개념 변경
3. **StatusIndicator**: customIcon, colorScheme 제거
4. **DatePicker**: onApply/onCancel 패턴 제거

#### 🟢 낮은 우선순위 (기능 추가/제거)
1. **Tooltip**: delay, disabled 추가
2. **Breadcrumb**: icon, separator, maxItems 추가
3. **Toggle**: label, description 추가
4. **InlineMessage**: closable, expandable 제거

### 마이그레이션 가이드 권장사항

1. **공통 패턴 변경**:
   - Compound Component → 배열 기반: Dropdown, ContextMenu
   - 단일 컴포넌트 → Compound Component: Disclosure, FormField

2. **타입 변경**:
   - `positive/negative` → `success/warning/error/info`: Toast
   - `currentAt` → `currentPage`: Pagination
   - `path` → `href`: Breadcrumb

3. **기능 제거 대응**:
   - Input의 `filter`, `showPasswordToggle` → 별도 유틸리티 함수로 구현
   - RadioGroup의 `legend`, `required` → FormField로 래핑
   - ProgressBar의 `color`, `pendingColor` → CSS 변수로 대체

4. **새로운 기능 활용**:
   - Input의 `variant`, `label`, `helperText` 활용
   - Select의 `clearable`, `width` 활용
   - Toast의 `title`, `action`, `detail` 활용
