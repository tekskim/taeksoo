# TDS 접근성 (Accessibility) 가이드

TDS 컴포넌트의 접근성 구현 현황, 필수 패턴, 키보드 내비게이션, 시각적 접근성 규칙을 정리합니다.

---

## 컴포넌트별 접근성 매트릭스

### Form Controls

| 컴포넌트              | Role                              | ARIA 속성                                                                                                                        | 키보드 지원                              | 포커스 관리                                       | a11y 테스트 |
| --------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------- | ----------- |
| **Input**             | native `<input>`                  | `aria-invalid`, `aria-describedby` (error/helper)                                                                                | Native                                   | —                                                 | ✅          |
| **Textarea**          | native `<textarea>`               | `aria-invalid`, `aria-describedby` (error/helper)                                                                                | Native                                   | —                                                 | ✅          |
| **NumberInput**       | native `<input type="number">`    | `aria-invalid`, `aria-describedby`, stepper `aria-label`                                                                         | ArrowUp/Down                             | Stepper `tabIndex={-1}`                           | ✅          |
| **SearchInput**       | native `<input type="search">`    | `aria-label="Search"` (기본값)                                                                                                   | Native                                   | Clear 버튼 `tabIndex={-1}`                        | —           |
| **FilterSearchInput** | —                                 | —                                                                                                                                | Enter, Escape, Backspace                 | —                                                 | —           |
| **Select**            | `combobox` / `listbox` / `option` | `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`, `aria-invalid`, `aria-selected`, `aria-disabled`, `aria-labelledby` | Arrow Up/Down, Enter, Space, Escape, Tab | 열림 시 listbox focus, 닫힘 시 trigger focus 복원 | ✅          |
| **Checkbox**          | native `<input type="checkbox">`  | `aria-invalid`, `aria-describedby` (description + error)                                                                         | Native (Space)                           | `sr-only` 숨김 input                              | ✅          |
| **CheckboxGroup**     | `<fieldset>`                      | `aria-labelledby`, `aria-describedby`, `aria-invalid`, error `role="alert"`                                                      | Native                                   | —                                                 | —           |
| **Radio**             | native `<input type="radio">`     | `aria-describedby`                                                                                                               | Native                                   | —                                                 | ✅          |
| **RadioGroup**        | `radiogroup`                      | `aria-labelledby`, `aria-describedby`, `aria-invalid`, error `role="alert"`                                                      | Native                                   | —                                                 | —           |
| **Toggle**            | `switch`                          | `aria-checked`, `aria-describedby`                                                                                               | Native (Space)                           | `sr-only` 숨김 input                              | ✅          |
| **Slider**            | `slider`                          | `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-disabled`                                                 | ArrowLeft/Right, ArrowUp/Down, Home, End | Thumb `tabIndex={0}`                              | ✅          |
| **RangeSlider**       | `slider` (×2)                     | `aria-label` (min/max), `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-disabled`                                       | Arrow keys, Home, End (per thumb)        | 양쪽 Thumb `tabIndex={0}`                         | —           |
| **DatePicker**        | —                                 | `aria-pressed`, `aria-label` (nav/date)                                                                                          | ⚠️ 미지원                                | —                                                 | ✅          |

### Data Display

| 컴포넌트            | Role             | ARIA 속성                                                             | 키보드 지원   | 포커스 관리 | a11y 테스트 |
| ------------------- | ---------------- | --------------------------------------------------------------------- | ------------- | ----------- | ----------- |
| **Table**           | native `<table>` | 체크박스 `aria-label="Select all/row"`                                | —             | —           | ✅          |
| **Pagination**      | `<nav>`          | `aria-label="Pagination"`, `aria-current="page"`, 버튼별 `aria-label` | Native button | —           | ✅          |
| **Badge**           | —                | —                                                                     | —             | —           | ✅          |
| **Chip**            | —                | Remove 버튼 `aria-label`                                              | —             | —           | ✅          |
| **StatusIndicator** | `status`         | `aria-label`                                                          | — (표시 전용) | —           | ✅          |
| **ProgressBar**     | —                | —                                                                     | —             | —           | ✅          |
| **Tooltip**         | —                | —                                                                     | —             | —           | ✅          |

### Overlays

| 컴포넌트        | Role     | ARIA 속성                                                                        | 키보드 지원          | 포커스 관리                | a11y 테스트 |
| --------------- | -------- | -------------------------------------------------------------------------------- | -------------------- | -------------------------- | ----------- |
| **Modal**       | —        | ⚠️ `role="dialog"` 없음                                                          | Escape 닫기          | ⚠️ 포커스 트랩 없음        | ✅          |
| **Drawer**      | `dialog` | `aria-modal="true"`, `aria-labelledby`, 닫기 `aria-label`                        | Escape 닫기          | ⚠️ 포커스 트랩 없음        | ✅          |
| **Popover**     | `dialog` | `aria-expanded`, `aria-haspopup="dialog"`, `aria-controls`, `aria-modal` (click) | Enter, Space, Escape | 닫힘 시 trigger focus 복원 | ✅          |
| **ContextMenu** | —        | ⚠️ 없음                                                                          | Escape 닫기          | ⚠️ 메뉴 키보드 탐색 없음   | ✅          |

### Navigation

| 컴포넌트       | Role                           | ARIA 속성                                       | 키보드 지원        | 포커스 관리 | a11y 테스트 |
| -------------- | ------------------------------ | ----------------------------------------------- | ------------------ | ----------- | ----------- |
| **Tabs**       | `tablist` / `tab` / `tabpanel` | `aria-selected`, `aria-disabled`, `aria-hidden` | ⚠️ Arrow 탐색 없음 | —           | ✅          |
| **Breadcrumb** | `<nav aria-label>`             | `aria-current="page"`, separator `aria-hidden`  | Native link        | —           | ✅          |

### Feedback

| 컴포넌트       | Role     | ARIA 속성                                                         | 키보드 지원                  | 포커스 관리 | a11y 테스트 |
| -------------- | -------- | ----------------------------------------------------------------- | ---------------------------- | ----------- | ----------- |
| **Toast**      | `alert`  | Container `aria-live="polite"`, `aria-label`, 버튼별 `aria-label` | Native button                | —           | ✅          |
| **Loading**    | —        | ⚠️ 없음                                                           | —                            | —           | ✅          |
| **Skeleton**   | —        | ⚠️ 없음                                                           | —                            | —           | —           |
| **Disclosure** | `region` | `aria-expanded`, `aria-controls`, `aria-labelledby`               | Enter, Space (native button) | —           | ✅          |
| **Accordion**  | `region` | `aria-expanded`, `aria-controls`, `aria-labelledby`               | Enter, Space (native button) | —           | —           |

### Layout

| 컴포넌트      | Role              | ARIA 속성                                                                      | 키보드 지원 | 포커스 관리                   | a11y 테스트 |
| ------------- | ----------------- | ------------------------------------------------------------------------------ | ----------- | ----------------------------- | ----------- |
| **Button**    | native `<button>` | `aria-label` (icon-only), `aria-disabled`, `aria-busy` (loading)               | Native      | Loading spinner `aria-hidden` | ✅          |
| **FormField** | —                 | label `htmlFor`↔input `id`, error `role="alert"`, description/helper `id` 연결 | —           | —                             | —           |

### 알려진 Gap (개선 필요)

| 컴포넌트             | Gap                                               | 우선순위 |
| -------------------- | ------------------------------------------------- | -------- |
| **Modal**            | `role="dialog"`, `aria-modal`, 포커스 트랩 미구현 | 높음     |
| **DatePicker**       | 키보드 내비게이션 없음 (Arrow, Home/End)          | 높음     |
| **Tabs**             | Arrow 키 탐색 없음 (WAI-ARIA Tabs 패턴)           | 중간     |
| **ContextMenu**      | 메뉴 내 키보드 탐색 없음, ARIA role 없음          | 중간     |
| **Loading/Skeleton** | `aria-busy`, `aria-live` 없음                     | 낮음     |

---

## 폼 컨트롤 접근성 필수 패턴

### 1. Label ↔ Input 연결

모든 폼 컨트롤은 반드시 `FormField`로 감싸서 label과 input을 연결해야 합니다.

```tsx
// ✅ 올바른 패턴 — FormField가 자동으로 id/htmlFor 연결
<FormField label="Instance Name" required>
  <Input placeholder="Enter name" fullWidth />
</FormField>

// ✅ Compound API — 동일하게 자동 연결
<FormField required>
  <FormField.Label>Instance Name</FormField.Label>
  <FormField.Control>
    <Input placeholder="Enter name" fullWidth />
  </FormField.Control>
</FormField>

// ❌ 금지 — label 없이 Input 단독 사용
<Input placeholder="Enter name" />
```

**동작 원리:**

- `FormField`가 `useId()`로 고유 ID 생성
- `FormField.Label`에 `htmlFor={id}` 자동 적용
- `FormField.Control` 내 child에 `id` 자동 주입 (`cloneElement`)

### 2. Error 연결 (aria-invalid + aria-describedby)

에러 상태에서 스크린리더가 에러 메시지를 읽을 수 있도록 연결합니다.

```tsx
// FormField에 error 전달 → 자동으로 child에 전파
<FormField label="Password" error={!!passwordError} required>
  <Input type="password" fullWidth />
  {passwordError && <FormField.ErrorMessage>{passwordError}</FormField.ErrorMessage>}
</FormField>
```

**동작 원리:**

- `FormField`의 `error` prop → `cloneElement`로 child Input에 `error` 전달
- Input이 `aria-invalid={!!error}` 설정
- Input이 `aria-describedby={id}-error` 설정 (에러 시)
- `FormField.ErrorMessage`가 `role="alert"`, `id={id}-error` 로 렌더링

### 3. Helper Text 연결

에러가 없을 때 helper text와 input을 연결합니다.

```tsx
<FormField label="Name" helperText="2-64 characters">
  <Input fullWidth />
</FormField>
```

**동작 원리:**

- 에러 없을 때: `aria-describedby={id}-helper`
- 에러 있을 때: `aria-describedby={id}-error` (helper 대신 error 연결)

### 4. 필수 필드 표시

```tsx
// FormField required → 시각적 * 표시 자동
<FormField label="Name" required>
  <Input fullWidth />
</FormField>

// 수동으로 추가할 때
<span className="text-[var(--color-state-danger)]">*</span>
```

> 현재 TDS는 `aria-required`를 자동 설정하지 않습니다. HTML5 `required` 속성은 native validation을 트리거하므로, 커스텀 validation 사용 시 시각적 `*` 표시만 제공합니다.

### 5. 비활성 상태

```tsx
// FormField disabled → child에 자동 전파
<FormField label="Read-only Field" disabled>
  <Input fullWidth />
</FormField>
```

**동작 원리:**

- `FormField`의 `disabled` → `cloneElement`로 child에 전달
- Button: `aria-disabled={true}` (click handler 유지하되 시각적으로 비활성)
- Input/Select: native `disabled` 속성

### 6. Error 메시지 라이브 리전

`FormField.ErrorMessage`는 `role="alert"`로 렌더링되어 스크린리더가 즉시 읽습니다.

```tsx
// role="alert"가 자동 적용됨
<FormField.ErrorMessage>
  Volume name is required
</FormField.ErrorMessage>

// CheckboxGroup, RadioGroup도 동일
<CheckboxGroup error errorMessage="Please select at least one option">
  ...
</CheckboxGroup>
```

---

## 키보드 내비게이션 가이드

### Select / Dropdown

| 키                            | 동작                           |
| ----------------------------- | ------------------------------ |
| `Enter`, `Space`, `ArrowDown` | 닫힘 → 열기                    |
| `ArrowUp`                     | 닫힘 → 열기                    |
| `ArrowDown`                   | 열림 → 다음 옵션               |
| `ArrowUp`                     | 열림 → 이전 옵션               |
| `Enter`, `Space`              | 열림 → 현재 옵션 선택 & 닫기   |
| `Escape`                      | 열림 → 닫기                    |
| `Tab`                         | 열림 → 닫기 & 다음 요소로 이동 |

**포커스 흐름:** trigger → listbox (열림) → trigger (닫힘)

### NumberInput

| 키          | 동작           |
| ----------- | -------------- |
| `ArrowUp`   | 값 증가 (step) |
| `ArrowDown` | 값 감소 (step) |

Stepper 버튼은 `tabIndex={-1}` (키보드 순서에서 제외).

### Slider / RangeSlider

| 키                       | 동작            |
| ------------------------ | --------------- |
| `ArrowRight`, `ArrowUp`  | 값 증가 (step)  |
| `ArrowLeft`, `ArrowDown` | 값 감소 (step)  |
| `Home`                   | 최솟값으로 이동 |
| `End`                    | 최댓값으로 이동 |

RangeSlider는 각 thumb이 독립적으로 동일한 키보드 지원.

### Modal / Drawer

| 키       | 동작 |
| -------- | ---- |
| `Escape` | 닫기 |

> ⚠️ **Gap**: 포커스 트랩이 구현되어 있지 않습니다. Tab 키로 모달/드로어 뒤의 요소에 접근할 수 있습니다.

### Popover

| 키               | 동작                         |
| ---------------- | ---------------------------- |
| `Enter`, `Space` | click trigger 시 토글        |
| `Escape`         | 닫기 & trigger로 포커스 복원 |

### Disclosure / Accordion

| 키               | 동작                 |
| ---------------- | -------------------- |
| `Enter`, `Space` | 토글 (native button) |

### Tabs (현재 구현)

| 키    | 동작                   |
| ----- | ---------------------- |
| `Tab` | 탭 목록 → 탭 패널 이동 |

> ⚠️ **Gap**: WAI-ARIA Tabs 패턴(Arrow Left/Right로 탭 간 이동)이 구현되어 있지 않습니다.

### FilterSearchInput

| 키                    | 동작                  |
| --------------------- | --------------------- |
| `Enter`               | 현재 필터/검색어 적용 |
| `Escape`              | 드롭다운 닫기         |
| `Backspace` (빈 입력) | 필터 목록으로 복귀    |

---

## 컬러 대비 및 시각적 접근성

### WCAG AA 대비비 기준

| 요소                                | 최소 대비비 | 기준        |
| ----------------------------------- | ----------- | ----------- |
| 일반 텍스트 (< 18px)                | 4.5:1       | WCAG 2.1 AA |
| 큰 텍스트 (≥ 18px bold 또는 ≥ 24px) | 3:1         | WCAG 2.1 AA |
| UI 컴포넌트 (border, icon)          | 3:1         | WCAG 2.1 AA |

### TDS 토큰 기반 대비비 (Light Mode)

| 토큰 조합                    | 전경      | 배경      | 대비비 | 통과          |
| ---------------------------- | --------- | --------- | ------ | ------------- |
| `text` on `surface`          | `#0f172a` | `#ffffff` | 17.5:1 | ✅ AA         |
| `text-muted` on `surface`    | `#475569` | `#ffffff` | 6.2:1  | ✅ AA         |
| `text-subtle` on `surface`   | `#64748b` | `#ffffff` | 4.6:1  | ✅ AA         |
| `text-disabled` on `surface` | `#94a3b8` | `#ffffff` | 2.8:1  | ⚠️ (의도적)   |
| `on-primary` on `primary`    | `#ffffff` | `#2563eb` | 4.6:1  | ✅ AA         |
| `state-danger` on `surface`  | `#dc2626` | `#ffffff` | 4.6:1  | ✅ AA         |
| `state-success` on `surface` | `#16a34a` | `#ffffff` | 4.6:1  | ✅ AA         |
| `state-warning` on `surface` | `#ea580c` | `#ffffff` | 3.7:1  | ✅ Large text |

> `text-disabled`는 WCAG AA를 충족하지 않지만, 비활성 요소는 대비비 요구사항에서 제외됩니다 (WCAG 1.4.3 예외).

### 포커스 링 규칙

모든 인터랙티브 요소에 포커스 시 시각적 표시가 필요합니다.

```css
/* TDS 포커스 토큰 */
--semantic-color-border-focus: #3b82f6; /* blue500 */
```

```tsx
// Tailwind 기본 포커스 스타일 (대부분의 컴포넌트에서 사용)
className =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]';

// Input 포커스 — border 색상 변경
className = 'focus:border-[var(--color-border-focus)]';
```

**규칙:**

- `focus-visible` 사용 (마우스 클릭 시 포커스 링 숨김, 키보드 탐색 시 표시)
- 포커스 링 색상: `--color-border-focus` (blue500, `#3b82f6`)
- 포커스 링 너비: 최소 2px

### 아이콘 전용 버튼의 aria-label

아이콘만 있는 버튼에는 반드시 `aria-label`을 제공해야 합니다.

```tsx
// ✅ 올바른 패턴
<Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />

// ✅ TopBarAction
<TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />

// ❌ 금지 — aria-label 없는 아이콘 버튼
<Button variant="ghost" size="sm" icon={<IconTrash size={12} />} />
```

### 정보 아이콘과 Tooltip

정보 아이콘(`IconInfoCircle`)은 반드시 `Tooltip`으로 감싸야 합니다.

```tsx
// ✅ 올바른 패턴
<Tooltip content="Option A에 대한 설명">
  <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
</Tooltip>

// ❌ 금지 — Tooltip 없는 정보 아이콘
<IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
```

### 색상만으로 정보 전달 금지

색상 외에 텍스트, 아이콘, 패턴 등 추가 수단을 함께 사용합니다.

```tsx
// ✅ 올바른 패턴 — 색상 + 텍스트
<StatusIndicator status="active" label="Active" />
<Badge variant="danger">Error</Badge>

// ⚠️ 주의 — 색상만으로 구분
<div className="w-2 h-2 rounded-full bg-green-500" /> // 텍스트 없이 색상만 사용
```
