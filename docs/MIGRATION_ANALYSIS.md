# TDS → Production Migration Analysis

> 생성일: 2026-01-30
> 브랜치: feature/production-alignment
> 태그: v1.0.0-before-migration

## 목표

디자이너/기획자가 tds에서 만든 페이지를 프론트엔드 개발자가 프로덕션(thaki-ui)에 쉽게 반영할 수 있도록 환경을 맞추기

---

## Phase 1: 컴포넌트 API 비교 분석

### Badge

| 항목 | thaki-ui | tds | 조치 |
|------|----------|-----|------|
| **theme 값** | `'blu'`, `'red'`, `'gry'`, `'gre'`, `'ylw'` | `'blue'`, `'red'`, `'gray'`, `'green'`, `'yellow'` | tds에 약어 alias 추가 |
| **type 기본값** | `'subtle'` | `'solid'` | 기본값 변경 검토 |
| **layout prop** | `'text-only'`, `'left-icon'`, `'right-icon'` | `leftIcon`, `rightIcon` (별도 prop) | 호환 레이어 추가 |
| **dot prop** | ❌ | ✅ | 유지 (추가 기능) |

**thaki-ui Badge API:**
```typescript
interface BadgeProps {
  theme?: 'blu' | 'red' | 'gry' | 'gre' | 'ylw';
  type?: 'subtle' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'text-only' | 'left-icon' | 'right-icon';
  icon?: ReactElement;
}
```

**tds Badge API:**
```typescript
interface BadgeProps {
  theme?: 'blue' | 'red' | 'gray' | 'green' | 'yellow';
  type?: 'solid' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  dot?: boolean;
}
```

---

### Button

| 항목 | thaki-ui | tds | 조치 |
|------|----------|-----|------|
| **variant** | `primary`, `secondary`, `tertiary`, `success`, `error`, `warning`, `muted` | `primary`, `secondary`, `outline`, `ghost`, `muted`, `danger`, `warning`, `link` | 매핑 필요 |
| **appearance** | `'solid'`, `'outline'`, `'ghost'` | ❌ (variant에 통합) | 호환 레이어 추가 |
| **size** | `xs`, `sm`, `md`, `lg` | `sm`, `md`, `lg` | xs 추가 |
| **as (polymorphic)** | ❌ | ✅ | 유지 (추가 기능) |

**variant 매핑:**
| thaki-ui | tds |
|----------|-----|
| `primary` + `solid` | `primary` |
| `primary` + `outline` | `outline` |
| `primary` + `ghost` | `ghost` |
| `error` | `danger` |
| `tertiary` | `secondary` or `ghost` |

---

### Checkbox

| 항목 | thaki-ui | tds | 조치 |
|------|----------|-----|------|
| **onChange** | `(checked: boolean) => void` | `(e: ChangeEvent) => void` | 호환 레이어 추가 |
| **indeterminate** | ❌ | ✅ | 유지 (추가 기능) |
| **error/errorMessage** | ❌ | ✅ | 유지 (추가 기능) |
| **description** | ❌ | ✅ | 유지 (추가 기능) |

---

### Table

| 항목 | thaki-ui | tds | 조치 |
|------|----------|-----|------|
| **데이터 prop** | `rows` | `data` | alias 추가 |
| **컬럼 헤더** | `header` | `label` | alias 추가 |
| **컬럼 리사이징** | ✅ | ❌ | 프로덕션 기능 (무시) |
| **stickyLastColumn** | ✅ | ❌ | 프로덕션 기능 (무시) |
| **selectable** | ❌ | ✅ | 유지 (추가 기능) |

**TableColumn 매핑:**
| thaki-ui | tds |
|----------|-----|
| `header` | `label` |
| `isEllipsis` | - (기본 적용) |
| `clickable` | - |

---

### Tabs

| 항목 | thaki-ui | tds | 조치 |
|------|----------|-----|------|
| **구조** | 단일 `<Tab>` | Compound (`TabList`, `Tab`, `TabPanel`) | ⚠️ 큰 차이 |
| **variant** | `'line'`, `'button'` | `'underline'`, `'boxed'` | 이름 매핑 |
| **활성 탭** | `activeTabId` | `value` | alias 추가 |

**thaki-ui 구조:**
```tsx
<Tabs activeTabId="tab1">
  <Tab id="tab1" label="Tab 1">Content 1</Tab>
  <Tab id="tab2" label="Tab 2">Content 2</Tab>
</Tabs>
```

**tds 구조:**
```tsx
<Tabs value="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel value="tab1">Content 1</TabPanel>
  <TabPanel value="tab2">Content 2</TabPanel>
</Tabs>
```

---

### Modal

| 항목 | thaki-ui (ActionModal) | tds (Modal) | 조치 |
|------|------------------------|-------------|------|
| **설정 방식** | `actionConfig` 객체 | 개별 props | 호환 레이어 추가 |
| **기반** | `Overlay.Template` | 독립 | 구조 유지 |
| **ConfirmModal** | ❌ | ✅ | 유지 (추가 기능) |

---

## Phase 2: 하위 호환 추가 계획

### 우선순위 1: 이름만 다른 것 (쉬움)

1. **Badge theme alias**
   - `'blu'` → `'blue'`, `'gry'` → `'gray'`, `'gre'` → `'green'`, `'ylw'` → `'yellow'`

2. **Table prop alias**
   - `rows` → `data`
   - `header` → `label` (TableColumn)

3. **Tabs variant alias**
   - `'line'` → `'underline'`
   - `'button'` → `'boxed'`

### 우선순위 2: 구조가 다른 것 (중간)

1. **Button appearance 호환**
   - `variant` + `appearance` 조합 지원

2. **Badge layout 호환**
   - `layout` prop 추가 (내부에서 leftIcon/rightIcon로 변환)

3. **Checkbox onChange 호환**
   - `(checked: boolean)` 시그니처 추가 지원

### 우선순위 3: 완전히 다른 것 (어려움)

1. **Tabs 구조**
   - thaki-ui 스타일 API를 별도 컴포넌트로 제공하거나
   - 문서에 변환 가이드 제공

2. **Modal vs ActionModal**
   - `actionConfig` prop 추가 지원하거나
   - 문서에 변환 가이드 제공

---

## Phase 3: Import 경로

### 현재 상태
- tds: `import { Button } from '@/design-system'`
- thaki-ui: `import { Button } from '@thaki/shared'`

### 권장 방안
1. tds에서 `@/design-system` 유지
2. 프로덕션 반영 시 경로만 치환 (IDE find/replace)

```bash
# 변환 스크립트 예시
sed -i '' "s/@\/design-system/@thaki\/shared/g" *.tsx
```

---

## Phase 4: 페이지 템플릿 컨벤션

### 표준 페이지 구조

```tsx
// ===== IMPORTS =====
import { ... } from '@/design-system';  // → @thaki/shared

// ===== TYPES =====
interface PageProps { ... }

// ===== MOCK DATA (개발자가 삭제) =====
const mockData = [...];

// ===== PAGE COMPONENT =====
export function ExamplePage() {
  // ----- API 연동 (개발자가 채워넣기) -----
  // const { data } = useQuery(...);
  
  // ----- 상태 관리 -----
  const [state, setState] = useState(...);
  
  // ----- 핸들러 -----
  const handleAction = () => { ... };
  
  // ----- UI -----
  return (
    <PageLayout>
      {/* 디자이너 작업 영역 */}
    </PageLayout>
  );
}
```

---

## 체크리스트

### Phase 2 작업 목록

- [ ] Badge: theme alias 추가 (`blu` → `blue` 등)
- [ ] Badge: layout prop 추가
- [ ] Button: appearance prop 추가
- [ ] Button: size='xs' 추가
- [ ] Checkbox: onChange(checked) 오버로드 추가
- [ ] Table: rows prop alias 추가
- [ ] Table: header → label alias 추가
- [ ] Tabs: variant alias 추가 (`line` → `underline`)
- [ ] Tabs: activeTabId prop alias 추가
- [ ] Modal: actionConfig prop 추가 (선택)

### 검증

- [ ] 기존 페이지 빌드 성공
- [ ] 스토리북 빌드 성공
- [ ] 주요 페이지 시각적 검토

---

## 롤백

```bash
# 문제 발생 시
git checkout v1.0.0-before-migration
```

---

## 전체 컴포넌트 분석

### 컴포넌트 분류

#### 공통 컴포넌트 (21개) - API 비교 필요
| 컴포넌트 | API 호환성 | 조치 |
|----------|-----------|------|
| Badge | ⚠️ theme 약어 | alias 추가 |
| Button | ⚠️ appearance 분리 | 호환 레이어 |
| Checkbox | ⚠️ onChange 시그니처 | 오버로드 |
| Table | ⚠️ rows→data, header→label | alias 추가 |
| Tabs | ❌ 구조 다름 | 변환 가이드 |
| Modal | ⚠️ actionConfig vs props | 호환 레이어 |
| Input | ⚠️ filter 제거, variant 추가 | 호환 레이어 |
| Tooltip | ✅ 유사 | 거의 호환 |
| Toast | ⚠️ Provider 패턴 | 구조 다름 |
| Pagination | ⚠️ totalCount→totalPages | 호환 레이어 |
| Breadcrumb | ✅ 유사 | 거의 호환 |
| ProgressBar | ⚠️ variant 변경 | 호환 레이어 |
| StatusIndicator | ✅ 유사 | 거의 호환 |
| Toggle | ✅ 유사 | 거의 호환 |
| Disclosure | ⚠️ Compound 패턴 | 구조 다름 |
| FormField | ⚠️ Compound 패턴 | 구조 다름 |
| ContextMenu | ✅ 유사 | 거의 호환 |
| DatePicker | 확인 필요 | - |
| FloatingCard | ⚠️ 사용 사례 다름 | 확인 필요 |
| InlineMessage | ✅ 유사 | 거의 호환 |
| MonitoringToolbar | ✅ 유사 | 거의 호환 |

#### thaki-ui에만 있는 컴포넌트 (26개)
| 컴포넌트 | tds 추가 필요 | 비고 |
|----------|---------------|------|
| **Dropdown** | 🔴 필수 | Portal, 키보드 네비게이션 |
| **Skeleton** | 🟡 권장 | 로딩 상태 UI |
| **Typography/Title** | ⚪ 불필요 | tds는 유틸리티 클래스 사용 |
| **Accordion** | 🟡 권장 | 다중 열림 모드 |
| **Password** | 🟡 권장 | 비밀번호 전용 |
| **Tag** | 🟡 권장 | Chip과 차별화 |
| **CopyButton** | 🟡 권장 | 클립보드 유틸리티 |
| **ErrorBoundary/Error** | 🟡 권장 | 에러 처리 |
| **Fieldset** | 🟡 권장 | 폼 그룹화 |
| **Portal** | 🟡 권장 | 스크롤/리사이즈 대응 |
| **Overlay/Dim** | ⚪ 불필요 | Modal/Drawer에 통합 |
| **AppLayout/Layout/CreateLayout** | ⚪ 불필요 | 도메인 특화 |
| **Sidebar/ToolBar** | ⚪ 불필요 | 도메인 특화 |
| **Icon** | ⚪ 불필요 | Tabler Icons 사용 |
| **FilterSearch** | ⚪ 불필요 | FilterSearchInput 있음 |
| **InfoContainer** | ⚪ 불필요 | SectionCard로 대체 |
| **Editor/Terminal** | ⚪ 불필요 | 도메인 특화 |
| **TabContainer/TabSelector** | ⚪ 불필요 | Tabs에 통합 |
| **NavigationControls/FrameControls** | ⚪ 불필요 | TopBar에 통합 |
| **LangButton** | ⚪ 불필요 | 도메인 특화 |
| **MultiItemDisplay** | ⚪ 불필요 | 도메인 특화 |
| **RefreshButton** | ⚪ 불필요 | Button으로 구현 |
| **TableSettingDrawer** | ⚪ 불필요 | 도메인 특화 |
| **DeleteResourceModal/ActionModal/ResourceActionModal** | ⚪ 불필요 | ConfirmModal로 대체 |

#### tds에만 있는 컴포넌트 (19개) - 프로덕션에 추가 검토
| 컴포넌트 | thaki-ui 유사 | 프로덕션 추가 |
|----------|---------------|---------------|
| **Drawer** | Sheet/SidePanel | 🟡 권장 |
| **Modal/ConfirmModal** | Dialog | 🟡 권장 (ConfirmModal) |
| **Select** | Dropdown | ✅ 매핑 가능 |
| **Slider/RangeSlider** | Range | 🟡 권장 |
| **ListToolbar** | Toolbar | 🟡 권장 (Compound) |
| **SectionCard** | Card/Section | 🟡 권장 (Compound) |
| **DetailHeader** | PageHeader | 🟡 권장 (Compound) |
| **Chip** | Tag/Badge | 🟡 권장 |
| **NotificationCenter** | Notification | 🟡 권장 |
| **Wizard** | Stepper | 🟡 권장 |
| **SNBMenuItem** | NavItem | 🟡 권장 |
| **TopBar** | Header | 🟡 권장 |
| **SelectionIndicator** | - | 🟡 권장 |
| **CardTitle** | - | ⚪ tds 특화 |
| **Menu (compound)** | Menu | ⚪ 구조 다름 |
| **Loading** | Spinner | ⚪ 기능 다름 |
| **WindowControl** | - | ⚪ 데스크톱 전용 |
| **Icons (custom)** | - | ⚪ tds 전용 |

---

## 수정된 Phase 2 계획

### 우선순위 1: 빠른 호환 (이름 변경만)
- Badge theme alias
- Table props alias
- Tabs variant alias
- Button size='xs' 추가

### 우선순위 2: 호환 레이어 추가
- Button appearance prop
- Badge layout prop  
- Checkbox onChange 오버로드
- Input 호환 props
- Pagination totalCount 지원

### 우선순위 3: tds에 추가할 컴포넌트
- Dropdown (thaki-ui 방식)
- Skeleton
- Password
- Tag
- Accordion

### 우선순위 4: 문서화
- Tabs 구조 변환 가이드
- Toast Provider 패턴 가이드
- Compound Component 사용 가이드

---

## 결론

### 호환성 수준
- **완전 호환**: 7개 (Tooltip, Breadcrumb, StatusIndicator, Toggle, ContextMenu, InlineMessage, MonitoringToolbar)
- **alias 추가 필요**: 5개 (Badge, Table, Tabs variant, Button size, Pagination)
- **호환 레이어 필요**: 6개 (Button, Checkbox, Input, ProgressBar, FormField, Disclosure)
- **구조적 차이**: 3개 (Tabs, Toast, Modal)

### 예상 작업량
- 우선순위 1: 2-3시간
- 우선순위 2: 4-6시간
- 우선순위 3: 1-2일
- 우선순위 4: 0.5일
