# TDS → Figma 마이그레이션 가이드

HTML to Design 플러그인으로 캡처한 요소를 Figma 컴포넌트로 변환할 때의 네이밍, 프로퍼티, 구조 규칙을 정리합니다.

---

## 1. Figma 파일 구조

### Page 구성

| Figma Page     | 설명                                          | 캡처 소스                  |
| -------------- | --------------------------------------------- | -------------------------- |
| **Foundation** | 색상 팔레트, 타이포그래피, 간격, 반경, 그림자 | `/figma/foundation`        |
| **Components** | 전체 UI 컴포넌트 (variant × size × state)     | `/figma/components`        |
| **Overlays**   | Modal, Drawer, Tooltip, Popover 정적 렌더링   | `/figma/overlays`          |
| **Patterns**   | List/Detail/Wizard/Form 페이지 패턴           | `/figma/patterns`          |
| **Icons**      | Tabler 아이콘 컴포넌트화                      | `/figma/foundation` (하단) |

### Section 네이밍

각 페이지 안에서 컴포넌트 카테고리별로 프레임을 분리합니다:

```
Page: Components
  ├── Frame: Button
  ├── Frame: Input
  ├── Frame: Select
  ├── Frame: Checkbox
  ...
```

---

## 2. 컴포넌트 네이밍 규칙

### 형식

```
TDS/{Category}/{ComponentName}
```

### 매핑 테이블

| TDS 코드 컴포넌트 | Figma 컴포넌트명             | 카테고리     |
| ----------------- | ---------------------------- | ------------ |
| `Button`          | `TDS/Form/Button`            | Form         |
| `Input`           | `TDS/Form/Input`             | Form         |
| `NumberInput`     | `TDS/Form/NumberInput`       | Form         |
| `SearchInput`     | `TDS/Form/SearchInput`       | Form         |
| `Textarea`        | `TDS/Form/Textarea`          | Form         |
| `Select`          | `TDS/Form/Select`            | Form         |
| `Checkbox`        | `TDS/Form/Checkbox`          | Form         |
| `Radio`           | `TDS/Form/Radio`             | Form         |
| `Toggle`          | `TDS/Form/Toggle`            | Form         |
| `Slider`          | `TDS/Form/Slider`            | Form         |
| `DatePicker`      | `TDS/Form/DatePicker`        | Form         |
| `FormField`       | `TDS/Form/FormField`         | Form         |
| `Badge`           | `TDS/Data/Badge`             | Data Display |
| `Chip`            | `TDS/Data/Chip`              | Data Display |
| `StatusIndicator` | `TDS/Data/StatusIndicator`   | Data Display |
| `Table`           | `TDS/Data/Table`             | Data Display |
| `Pagination`      | `TDS/Data/Pagination`        | Data Display |
| `ProgressBar`     | `TDS/Data/ProgressBar`       | Data Display |
| `InfoBox`         | `TDS/Data/InfoBox`           | Data Display |
| `MetricCard`      | `TDS/Data/MetricCard`        | Data Display |
| `Tooltip`         | `TDS/Overlay/Tooltip`        | Overlay      |
| `Popover`         | `TDS/Overlay/Popover`        | Overlay      |
| `Modal`           | `TDS/Overlay/Modal`          | Overlay      |
| `ConfirmModal`    | `TDS/Overlay/ConfirmModal`   | Overlay      |
| `Drawer`          | `TDS/Overlay/Drawer`         | Overlay      |
| `ContextMenu`     | `TDS/Overlay/ContextMenu`    | Overlay      |
| `Tabs`            | `TDS/Navigation/Tabs`        | Navigation   |
| `TabBar`          | `TDS/Navigation/TabBar`      | Navigation   |
| `Breadcrumb`      | `TDS/Navigation/Breadcrumb`  | Navigation   |
| `TopBar`          | `TDS/Navigation/TopBar`      | Navigation   |
| `InlineMessage`   | `TDS/Feedback/InlineMessage` | Feedback     |
| `Loading`         | `TDS/Feedback/Loading`       | Feedback     |
| `EmptyState`      | `TDS/Feedback/EmptyState`    | Feedback     |
| `ErrorState`      | `TDS/Feedback/ErrorState`    | Feedback     |
| `PageShell`       | `TDS/Layout/PageShell`       | Layout       |
| `PageHeader`      | `TDS/Layout/PageHeader`      | Layout       |
| `DetailHeader`    | `TDS/Layout/DetailHeader`    | Layout       |
| `SectionCard`     | `TDS/Layout/SectionCard`     | Layout       |
| `ListToolbar`     | `TDS/Layout/ListToolbar`     | Layout       |

---

## 3. Component Property 매핑

### TDS Props → Figma Property Types

| TDS Prop 타입              | Figma Property 타입    | 사용 예시                               |
| -------------------------- | ---------------------- | --------------------------------------- |
| `variant` (string union)   | **Variant**            | Button: primary / secondary / ghost / … |
| `size` (string union)      | **Variant**            | sm / md / lg                            |
| `state` (시뮬레이션)       | **Variant**            | default / hover / active / disabled     |
| `disabled` (boolean)       | **Boolean**            | true / false                            |
| `loading` (boolean)        | **Boolean**            | true / false                            |
| `error` (boolean)          | **Boolean**            | true / false                            |
| `checked` (boolean)        | **Boolean**            | true / false                            |
| `label` / `title` (string) | **Text**               | 편집 가능한 텍스트                      |
| `placeholder` (string)     | **Text**               | 편집 가능한 placeholder                 |
| `leftIcon` (ReactNode)     | **Instance swap**      | 아이콘 슬롯                             |
| `rightIcon` (ReactNode)    | **Instance swap**      | 아이콘 슬롯                             |
| `children` (ReactNode)     | **Text** 또는 **Slot** | 컨텐츠 영역                             |

---

## 4. 컴포넌트별 Property 설정표

### Button

| Property | Type     | Values                                                                    |
| -------- | -------- | ------------------------------------------------------------------------- |
| Variant  | Variant  | `primary` `secondary` `muted` `ghost` `outline` `danger` `warning` `link` |
| Size     | Variant  | `sm` `md` `lg`                                                            |
| State    | Variant  | `default` `hover` `active` `disabled` `loading`                           |
| Icon     | Variant  | `none` `left` `right` `icon-only`                                         |
| Label    | Text     | "Button"                                                                  |
| LeftIcon | Instance | Icon component swap slot                                                  |

**Auto Layout:**

| Size | Direction  | Gap | Padding (Y / X) | Height |
| ---- | ---------- | --- | --------------- | ------ |
| sm   | Horizontal | 6px | 6px / 10px      | 28px   |
| md   | Horizontal | 6px | 8px / 12px      | 32px   |
| lg   | Horizontal | 8px | 10px / 16px     | 36px   |

**Radius:** 6px (`--primitive-radius-md`)

### Input

| Property     | Type    | Values                               |
| ------------ | ------- | ------------------------------------ |
| Size         | Variant | `sm` `md` `lg`                       |
| State        | Variant | `default` `focus` `error` `disabled` |
| Placeholder  | Text    | "Enter value..."                     |
| Value        | Text    | (editable)                           |
| LeftElement  | Boolean | true / false                         |
| RightElement | Boolean | true / false                         |

**Auto Layout:**

| Size | Padding X | Height |
| ---- | --------- | ------ |
| sm   | 10px      | 28px   |
| md   | 10px      | 32px   |
| lg   | 10px      | 40px   |

**Radius:** 6px (`--primitive-radius-md`)

### Select

| Property    | Type    | Values                              |
| ----------- | ------- | ----------------------------------- |
| Size        | Variant | `sm` `md`                           |
| State       | Variant | `default` `open` `error` `disabled` |
| Placeholder | Text    | "Select..."                         |
| Value       | Text    | (선택된 옵션 텍스트)                |

### Checkbox

| Property | Type    | Values                                |
| -------- | ------- | ------------------------------------- |
| State    | Variant | `unchecked` `checked` `indeterminate` |
| Disabled | Boolean | true / false                          |
| Label    | Text    | "Option"                              |

**크기:** 16px × 16px, Radius 4px, Gap(label) 6px

### Radio

| Property | Type    | Values                  |
| -------- | ------- | ----------------------- |
| State    | Variant | `unselected` `selected` |
| Disabled | Boolean | true / false            |
| Label    | Text    | "Option"                |

### Toggle

| Property | Type    | Values       |
| -------- | ------- | ------------ |
| State    | Variant | `off` `on`   |
| Disabled | Boolean | true / false |
| Label    | Text    | "Feature"    |

### Badge

| Property | Type    | Values                                       |
| -------- | ------- | -------------------------------------------- |
| Theme    | Variant | `blue` `red` `green` `yellow` `gray` `white` |
| Type     | Variant | `solid` `subtle`                             |
| Size     | Variant | `sm` `md` `lg`                               |
| Dot      | Boolean | true / false                                 |
| Label    | Text    | "Badge"                                      |

**Auto Layout:**

| Size | Padding (Y / X) | Font Size | Line Height | Radius |
| ---- | --------------- | --------- | ----------- | ------ |
| sm   | 2px / 6px       | 11px      | 16px        | 4px    |
| md   | 4px / 8px       | 12px      | 16px        | 4px    |
| lg   | 4px / 12px      | 14px      | 20px        | 4px    |

### Chip

| Property  | Type    | Values                          |
| --------- | ------- | ------------------------------- |
| State     | Variant | `default` `selected` `disabled` |
| Removable | Boolean | true / false                    |
| Label     | Text    | "Label"                         |

### StatusIndicator

| Property | Type    | Values                                                                                                                                                             |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status   | Variant | `active` `error` `building` `deleting` `pending` `shutoff` `paused` `suspended` `shelved` `mounted` `in-use` `maintenance` `degraded` `down` `draft` `deactivated` |
| Layout   | Variant | `icon-only` `dot-label`                                                                                                                                            |

### InlineMessage

| Property | Type    | Values                             |
| -------- | ------- | ---------------------------------- |
| Variant  | Variant | `info` `success` `warning` `error` |
| Message  | Text    | "Message content"                  |

### Modal

| Property    | Type    | Values         |
| ----------- | ------- | -------------- |
| Size        | Variant | `sm` `md` `lg` |
| Title       | Text    | "Modal Title"  |
| Description | Text    | (optional)     |

**Radius:** 16px, Padding: 24px, Gap: 16px

### Drawer

| Property | Type    | Values             |
| -------- | ------- | ------------------ |
| Width    | Variant | `360` `696` `1032` |
| Title    | Text    | "Drawer Title"     |

### Tooltip

| Property | Type    | Values                        |
| -------- | ------- | ----------------------------- |
| Position | Variant | `top` `bottom` `left` `right` |
| Content  | Text    | "Tooltip text"                |

**Padding:** 4px / 6px, Radius: 4px, Font: 11px

### SectionCard

| Property  | Type    | Values                    |
| --------- | ------- | ------------------------- |
| State     | Variant | `default` `active` `done` |
| Title     | Text    | "Section Title"           |
| HasAction | Boolean | true / false              |

### DetailHeader

| Property  | Type    | Values              |
| --------- | ------- | ------------------- |
| Title     | Text    | "Resource Name"     |
| CardCount | Variant | `4` `5` `6` `7` `8` |

**InfoGrid 레이아웃 규칙:**

| Cards | Layout  |
| ----- | ------- |
| 1–4   | 단일 행 |
| 5     | 3 / 2   |
| 6     | 4 / 2   |
| 7     | 4 / 3   |
| 8     | 4 / 4   |

### PageHeader

| Property   | Type    | Values                    |
| ---------- | ------- | ------------------------- |
| Title      | Text    | "Title"                   |
| TitleExtra | Boolean | true / false (Badge 슬롯) |
| HasActions | Boolean | true / false              |

---

## 5. 상태 관리 (Variant 조합)

각 컴포넌트에서 지원하는 전체 Variant 조합 예시:

```
Button:
  Variant: primary | secondary | outline | ghost | muted | danger | warning | link
  Size: sm | md | lg
  State: default | hover | active | disabled | loading
  Icon: none | left | right | icon-only

Input:
  Size: sm | md | lg
  State: default | focus | error | disabled
  LeftElement: true | false
  RightElement: true | false

Badge:
  Theme: blue | red | green | yellow | gray | white
  Type: solid | subtle
  Size: sm | md | lg
  Dot: true | false

StatusIndicator:
  Status: active | error | building | pending | shutoff | ...
  Layout: icon-only | dot-label
```

**Hover 상태 구현:** 코드에서는 CSS `:hover`를 사용하지만, Figma에서는 별도 Variant로 추가합니다. 캡처 페이지에서 `className` override로 hover 스타일이 적용된 상태를 캡처할 수 있습니다.

---

## 6. Auto Layout 가이드

### 주요 컴포넌트 레이아웃 설정

| 컴포넌트           | Direction  | Gap  | Padding (Y / X) |
| ------------------ | ---------- | ---- | --------------- |
| Button SM          | Horizontal | 6px  | 6px / 10px      |
| Button MD          | Horizontal | 6px  | 8px / 12px      |
| Button LG          | Horizontal | 8px  | 10px / 16px     |
| Input MD           | Horizontal | —    | 0 / 10px        |
| Badge SM           | Horizontal | 4px  | 2px / 6px       |
| Badge MD           | Horizontal | 4px  | 4px / 8px       |
| Checkbox           | Horizontal | 6px  | 0               |
| Card (SectionCard) | Vertical   | 16px | 16px            |
| Modal SM           | Vertical   | 16px | 24px            |
| Modal MD           | Vertical   | 16px | 24px            |
| Drawer 360         | Vertical   | 24px | 24px            |
| FormField          | Vertical   | 8px  | 0               |
| Tooltip            | Horizontal | —    | 4px / 6px       |
| StatusIndicator    | Horizontal | 4px  | 4px / 6px       |
| InlineMessage      | Horizontal | 8px  | 12px            |
| PageHeader         | Horizontal | —    | 0               |
| ListToolbar        | Horizontal | 8px  | 0               |
| InfoBox.Group      | Horizontal | 0    | 0 (grid)        |
| MetricCard.Group   | Horizontal | 0    | 0 (grid)        |

### 반응형 규칙

Figma에서는 `Fill container` + `Hug contents`로 반응형을 구현합니다:

- **Container width** → `Fill container`
- **Component height** → `Hug contents` (대부분), 고정 높이 (`Fixed`) 일부
- **Text wrapping** → `Auto width` 또는 `Fill container` (fullWidth 시)

---

## 7. 토큰 → Figma 스타일 매핑

### 색상 스타일

| TDS Token (CSS Variable)            | Figma Style 이름       |
| ----------------------------------- | ---------------------- |
| `--semantic-color-primary`          | `TDS/Primary`          |
| `--semantic-color-primary-hover`    | `TDS/Primary/Hover`    |
| `--semantic-color-on-primary`       | `TDS/On Primary`       |
| `--semantic-color-secondary`        | `TDS/Secondary`        |
| `--semantic-color-tertiary`         | `TDS/Tertiary`         |
| `--semantic-color-surface`          | `TDS/Surface/Default`  |
| `--semantic-color-surface-muted`    | `TDS/Surface/Muted`    |
| `--semantic-color-text`             | `TDS/Text/Default`     |
| `--semantic-color-text-muted`       | `TDS/Text/Muted`       |
| `--semantic-color-text-subtle`      | `TDS/Text/Subtle`      |
| `--semantic-color-text-disabled`    | `TDS/Text/Disabled`    |
| `--semantic-color-border`           | `TDS/Border/Default`   |
| `--semantic-color-border-strong`    | `TDS/Border/Strong`    |
| `--semantic-color-state-info`       | `TDS/State/Info`       |
| `--semantic-color-state-info-bg`    | `TDS/State/Info BG`    |
| `--semantic-color-state-success`    | `TDS/State/Success`    |
| `--semantic-color-state-success-bg` | `TDS/State/Success BG` |
| `--semantic-color-state-warning`    | `TDS/State/Warning`    |
| `--semantic-color-state-warning-bg` | `TDS/State/Warning BG` |
| `--semantic-color-state-danger`     | `TDS/State/Danger`     |
| `--semantic-color-state-danger-bg`  | `TDS/State/Danger BG`  |

### 텍스트 스타일

| TDS 유틸리티 클래스 | Figma Text Style 이름 | Font / Size / LH / Weight     |
| ------------------- | --------------------- | ----------------------------- |
| `text-heading-h1`   | `TDS/Heading/H1`      | Mona Sans / 40px / 48px / 600 |
| `text-heading-h2`   | `TDS/Heading/H2`      | Mona Sans / 32px / 40px / 600 |
| `text-heading-h3`   | `TDS/Heading/H3`      | Mona Sans / 24px / 32px / 600 |
| `text-heading-h4`   | `TDS/Heading/H4`      | Mona Sans / 18px / 28px / 600 |
| `text-heading-h5`   | `TDS/Heading/H5`      | Mona Sans / 16px / 24px / 600 |
| `text-heading-h6`   | `TDS/Heading/H6`      | Mona Sans / 14px / 20px / 600 |
| `text-heading-h7`   | `TDS/Heading/H7`      | Mona Sans / 12px / 18px / 600 |
| `text-body-lg`      | `TDS/Body/LG`         | Mona Sans / 14px / 20px / 400 |
| `text-body-md`      | `TDS/Body/MD`         | Mona Sans / 12px / 18px / 400 |
| `text-body-sm`      | `TDS/Body/SM`         | Mona Sans / 11px / 16px / 400 |
| `text-body-xs`      | `TDS/Body/XS`         | Mona Sans / 10px / 14px / 400 |
| `text-label-lg`     | `TDS/Label/LG`        | Mona Sans / 13px / 18px / 500 |
| `text-label-md`     | `TDS/Label/MD`        | Mona Sans / 12px / 18px / 500 |
| `text-label-sm`     | `TDS/Label/SM`        | Mona Sans / 11px / 16px / 500 |

### Effect 스타일

| TDS Token     | Figma Effect Style 이름 | 값                                                         |
| ------------- | ----------------------- | ---------------------------------------------------------- |
| `--shadow-xs` | `TDS/Shadow/XS`         | Drop shadow: Y=1, Blur=2, Opacity=5%                       |
| `--shadow-sm` | `TDS/Shadow/SM`         | Drop shadow: Y=1, Blur=3, Opacity=10% + Y=1, Blur=2, O=10% |
| `--shadow-md` | `TDS/Shadow/MD`         | Drop shadow: Y=4, Blur=6, Opacity=10%                      |
| `--shadow-lg` | `TDS/Shadow/LG`         | Drop shadow: Y=10, Blur=15, Opacity=10%                    |
| `--shadow-xl` | `TDS/Shadow/XL`         | Drop shadow: Y=20, Blur=25, Opacity=10%                    |

---

## 8. 캡처 워크플로우

### Step 1: 로컬 서버 실행

```bash
npx pnpm dev
```

### Step 2: 캡처 페이지 접속

| 페이지     | URL                                      |
| ---------- | ---------------------------------------- |
| Foundation | `http://localhost:5173/figma/foundation` |
| Components | `http://localhost:5173/figma/components` |
| Overlays   | `http://localhost:5173/figma/overlays`   |
| Patterns   | `http://localhost:5173/figma/patterns`   |

### Step 3: HTML to Design 플러그인 실행

1. Figma에서 `Plugins → HTML to Design` 실행
2. 각 캡처 페이지 URL을 입력하여 캡처
3. 캡처된 프레임을 Figma Page별로 정리

### Step 4: 컴포넌트화

1. 각 UI 요소를 선택 → `Create component` (Ctrl/Cmd + Alt + K)
2. 위 네이밍 규칙에 따라 이름 설정 (`TDS/Category/Name`)
3. Variant 조합이 필요한 경우 `Combine as variants`
4. Component Properties 패널에서 Property 추가 (위 설정표 참고)
5. Auto Layout 설정 확인 및 조정

### Step 5: 스타일 등록

1. 색상 스타일: 각 Semantic 색상을 선택 → `+` 버튼으로 Color Style 생성
2. 텍스트 스타일: 각 타이포그래피 레벨을 선택 → Text Style 생성
3. Effect 스타일: Shadow가 적용된 요소를 선택 → Effect Style 생성

### Step 6: 검증

- 모든 컴포넌트가 올바른 네이밍을 갖고 있는지 확인
- Variant 조합이 빠짐없이 등록되었는지 확인
- Auto Layout이 올바르게 설정되었는지 확인
- 텍스트/색상 스타일이 올바르게 연결되었는지 확인

---

## 9. 주의사항

### 캡처 시 주의

- **오버레이 컴포넌트**: Modal, Drawer, Tooltip, Popover는 코드에서 `createPortal`을 사용하지만, 캡처 페이지에서는 portal 없이 인라인으로 렌더링합니다.
- **Hover 상태**: CSS `:hover`는 캡처되지 않으므로, `className` override로 hover 스타일을 적용한 정적 버전이 포함되어 있습니다.
- **애니메이션**: Loading spinner 등 애니메이션은 정적 상태로 캡처됩니다.
- **다크 모드**: 캡처 페이지는 라이트 모드 기준입니다. 다크 모드가 필요한 경우 `data-theme="dark"` 속성을 추가하여 별도 캡처합니다.

### Figma 변환 시 주의

- **Instance swap**: 아이콘 슬롯은 `Instance swap` property로 설정하여 아이콘을 쉽게 교체할 수 있게 합니다.
- **텍스트 오버라이드**: label, placeholder 등 편집 가능한 텍스트는 반드시 `Text` property로 노출합니다.
- **Constraint**: 반응형이 필요한 컴포넌트는 `Fill container` + `Hug contents` 조합을 사용합니다.
- **Spacing 일관성**: TDS 토큰에 정의된 spacing 값 (4px, 8px, 12px, 16px, 24px 등)만 사용합니다. 임의의 간격을 사용하지 않습니다.

---

## 10. 체크리스트

### Foundation

- [ ] Primitive 색상 팔레트 (Blue, Red, Green, Orange, Yellow, BlueGray)
- [ ] Semantic 색상 스타일 등록
- [ ] 타이포그래피 스타일 등록 (Heading H1-H7, Body LG/MD/SM/XS, Label LG/MD/SM)
- [ ] Spacing 스케일 정리
- [ ] Border Radius 정리
- [ ] Shadow Effect 스타일 등록
- [ ] 주요 아이콘 컴포넌트화

### Components

- [ ] Button (8 variant × 3 size × 5 state × icon 조합)
- [ ] Input (3 size × 4 state)
- [ ] NumberInput / SearchInput / Textarea
- [ ] Select (2 size × 4 state)
- [ ] Checkbox (3 state × disabled)
- [ ] Radio (2 state × disabled)
- [ ] Toggle (on/off × disabled)
- [ ] Slider (default/disabled + with NumberInput)
- [ ] Badge (6 theme × 2 type × 3 size + dot)
- [ ] Chip (default/selected/disabled + removable)
- [ ] StatusIndicator (16 status × 2 layout)
- [ ] Table (selectable + sortable)
- [ ] Pagination
- [ ] ProgressBar
- [ ] Tabs (underline/boxed)
- [ ] Breadcrumb
- [ ] InlineMessage (4 variant)
- [ ] Loading (3 size)
- [ ] EmptyState (card/inline)
- [ ] ErrorState
- [ ] FormField (simple/compound/error)
- [ ] SectionCard (default/active + DataRow)
- [ ] DetailHeader (Title + Actions + InfoGrid)
- [ ] PageHeader (title + actions + titleExtra)
- [ ] InfoBox / MetricCard
- [ ] ListToolbar
- [ ] ContextMenu

### Overlays

- [ ] Modal (SM/MD/LG)
- [ ] ConfirmModal (danger)
- [ ] Drawer (360px/696px)
- [ ] Tooltip (4 position)
- [ ] Popover (top/bottom)

### Patterns

- [ ] List Page 패턴
- [ ] Detail Page 패턴
- [ ] Form Drawer 패턴
- [ ] Confirmation Modal 패턴
- [ ] Wizard (Create Page) 패턴
