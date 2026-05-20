# CreateInstance Design Spec

> TDS Source: `src/pages/CreateInstancePage.tsx`
> thaki-ui Target: `packages/compute/src/features/compute/ui/pages/InstanceCreatePage.tsx`

## 1. 전체 레이아웃

- 컨텐츠 영역 padding: `pt-4 px-8 pb-20` (PageShell contentClassName)
- 메인 wrapper: `VStack gap={3}` + `min-w-[1176px]`
- 2컬럼 구조: `HStack gap={6} align="start" className="w-full"`
  - 좌: 폼 영역 `VStack gap={4} className="flex-1"`
  - 우: 사이드바 `w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start`

## 2. 헤더

- 타이틀 행: `div className="flex items-center justify-between h-8"`
- 타이틀 텍스트: `h1 className="text-heading-h5"`

## 3. 섹션 구조

- 7개 섹션 (Templates, Basic Info, Source, Flavor, Network, Authentication, Advanced)
- 섹션 컴포넌트: `SectionCard` 기반
- 섹션 간 gap: `VStack gap={4}` (폼 컬럼)

### 섹션 상태별 렌더링:

| 상태              | 컴포넌트                    | padding          | 특징                         |
| ----------------- | --------------------------- | ---------------- | ---------------------------- |
| pre (미진입)      | `PreSection`                | `px-4 py-3`      | 타이틀만 표시, `h-8` 높이    |
| writing (작성 중) | `WritingSection`            | `px-4 py-3`      | 타이틀 + "Writing..."        |
| active (편집)     | `SectionCard isActive`      | SectionCard 기본 | 활성 테두리                  |
| done (완료)       | `DoneSection` (SectionCard) | SectionCard 기본 | Edit 버튼                    |
| skipped           | `SkippedSection`            | `px-4 py-3`      | "Not configured" + Edit 버튼 |

### SectionCard 활성 섹션 내부:

- `SectionCard.Header`: title + actions (Cancel/Done 버튼)
- `SectionCard.Content showDividers={false}`
- 내부: `VStack gap={0}` (FormField를 divider로 구분)
- FormField 영역: `div className="py-6"` (각 필드 그룹)
- Next 버튼 행: `HStack justify="end" className="pt-3"`

### SectionCard Header 버튼:

- Edit 모드 actions: `HStack gap={2}` > Cancel (`variant="secondary" size="sm"`) + Done (`variant="primary" size="sm"`)
- DoneSection Edit: `Button variant="secondary" size="sm"`
- SkippedSection Edit: `Button variant="outline" size="sm"`

### Next 버튼:

- `Button variant="primary"` (size 미지정 = 기본값)

## 4. 폼 필드 배치

- 기본: `div className="py-6"` 래퍼 안에 FormField
- 필드 간 구분: `div className="w-full h-px bg-[var(--color-border-subtle)]"` (divider)
- Source 섹션 Start source: `VStack gap={3} className="py-6"` > `VStack gap={1}` (label) + 콘텐츠
- Source V2 블록: `VStack gap={6}` (Image/Snapshot/Volume 블록 간)
- 각 블록 내부: `VStack gap={2}`

## 5. 사이드바

### 구조:

```
div (w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start)
  div (bg-surface border rounded-lg p-4 flex flex-col gap-4)
    WizardSummary
    Quota Card (bg-surface border rounded-lg p-4)
      VStack gap={3}
        h5 "Quota" (text-heading-h5)
        VStack gap={3}
          ProgressBar items...
    FormField (Number of instances)
      NumberInput
    HStack gap={2} (Action Buttons)
      Button Cancel (variant="secondary" size="md")
      Button Create (variant="primary" className="flex-1")
```

### 버튼 상세:

- Cancel: `variant="secondary" size="md"`
- Create: `variant="primary" className="flex-1"` (size 미지정 = 기본값, 하지만 md와 동일 맥락)
- 버튼 행: `HStack gap={2}`

## 6. thaki-ui 현재 상태 요약

### 레이아웃:

- `CreateLayout` 컴포넌트 사용 (title, sidebar, sidebarWidth="md", minWidth="lg")
- CreateLayout 내부 스타일:
  - Container: `w-full min-h-full`
  - Inner: `bg-surface min-h-full min-w-[1176px]`
  - Header: `shrink-0 py-3` + `flex items-center justify-between`
  - Content: `flex gap-6 items-start w-full`
  - Main: `relative z-0 flex-1 min-w-0`
  - Sidebar: `relative z-20 shrink-0 sticky top-4 self-start h-fit w-[312px]`
  - Sidebar inner: `flex flex-col gap-3 bg-surface border border-border rounded-base8 p-4`

### 섹션:

- `Accordion.Group type="multiple"` 기반 (SectionCard가 아닌 Accordion)
- 아코디언 아이템 스타일 (computeCreateStyles):
  - 기본: `border border-[var(--semantic-color-border)] rounded-[var(--semantic-radius-md)] overflow-hidden mb-[var(--semantic-space-md)]`
  - 활성: `border-2 border-[var(--semantic-color-primary)]`
- 카드 콘텐츠: `p-4 bg-[var(--semantic-color-surface)]`

### 사이드바 버튼:

- Cancel: `variant="secondary" appearance="outline" size="sm" className="min-w-[80px]"`
- Create: `variant="primary" appearance="solid" size="sm" className="min-w-[80px] flex-1"`
- 버튼 행: `Layout.HStack gap="sm" className="pt-3 justify-end w-full"`
