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
