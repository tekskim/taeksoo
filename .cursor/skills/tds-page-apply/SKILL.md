# TDS Page Apply

스펙 파일을 기반으로 TDS 컴포넌트를 사용하여 실제 페이지 코드를 구현하는 스킬입니다.

## 트리거

- "페이지 적용", "page apply", "화면 만들어줘", "페이지 구현"
- 오케스트레이터(`tds-page-sync`)에서 Phase 3으로 자동 호출

## 입력

- **스펙 파일**: `.cursor/skills/tds-page-sync/specs/pages/{PageName}-spec.md`
- **plan 파일** (선택): `.cursor/skills/tds-page-sync/specs/pages/{PageName}-plan.md`

## 출력

- **페이지 파일**: `src/pages/ai-platform/{PageName}Page.tsx` (신규 생성 또는 수정)
- **라우트 등록**: `src/App.tsx` 업데이트 (신규 페이지인 경우)

## 필수 참조 파일

코드 생성 전에 반드시 다음 파일들을 읽어야 합니다:

1. **TDS 규칙**: `.cursor/rules/tds-design-system.mdc` — 컴포넌트 사용법, 토큰, 패턴
2. **기존 페이지 예시**: `src/pages/ai-platform/WorkloadsPage.tsx` — PageShell 패턴 참조
3. **사이드바**: `src/components/AIPlatformSidebar.tsx` — 사이드바 import 경로
4. **디자인 시스템 배럴**: `src/design-system/index.ts` — 사용 가능한 컴포넌트 확인
5. **라우트**: `src/App.tsx` — 기존 라우트 구조 확인

## 동작 절차

### Step 1: 스펙 파일 읽기 및 분석

`specs/pages/{PageName}-spec.md`를 읽고 구현 범위를 파악합니다.

확인 사항:

- 페이지 타입 (List / Detail / Create / Main)
- 사용할 TDS 컴포넌트 목록
- 레이아웃 구조
- 테이블 컬럼 (있는 경우)
- 상태별 화면

### Step 2: 기존 동일 유형 페이지 비교 참조 (필수)

**새 페이지를 구현하기 전에, 동일 도메인·동일 유형의 기존 페이지를 반드시 읽고 패턴을 추출해야 합니다.** 이 단계를 건너뛰면 contentClassName, TopBar actions, Button props 등이 기존 페이지와 불일치하여 일관성이 깨집니다.

#### 2-1. 비교 대상 선정

동일 도메인 내 **이미 구현된 페이지** 중 같은 유형(List/Detail/Create)의 페이지를 2~3개 선택합니다.

```bash
# 예: AI Platform 도메인에서 List 페이지를 만들 경우
# → WorkloadsPage.tsx, ModelsPage.tsx, DatasetsPage.tsx 를 비교 대상으로 선정
```

#### 2-2. 비교 항목 체크리스트

선택한 비교 대상 페이지에서 다음 항목의 **실제 코드**를 확인합니다:

| #   | 비교 항목                           | 확인할 실제 코드                                                          |
| --- | ----------------------------------- | ------------------------------------------------------------------------- |
| 1   | `contentClassName`                  | 배경색 유무, padding 값 (`pt-4 px-8 pb-20` vs `pt-3 px-8 pb-20 bg-[...]`) |
| 2   | `TopBar.actions`                    | 어떤 아이콘 버튼이 있는지 (Bell만? Search+Bell?)                          |
| 3   | `PageHeader.actions`                | Button의 `variant`, `size`, `leftIcon` 유무, `gap` 값                     |
| 4   | `Breadcrumb.items`                  | 단계 수, `href`/`onClick` 패턴                                            |
| 5   | `Table` 스타일                      | `selectable`, `fixedColumns`, `columnMinWidths` 사용 여부                 |
| 6   | `Pagination` props                  | `showSettings`, `totalItems`, `selectedCount` 유무                        |
| 7   | `SearchInput` / `FilterSearchInput` | 어느 것을 사용하는지, placeholder 패턴                                    |
| 8   | Toolbar 구조                        | `ListToolbar` 사용 여부 vs `HStack` 직접 배치                             |

#### 2-3. 패턴 결정 규칙

- **기존 페이지 2개 이상이 동일한 패턴** → 그 패턴을 따름
- **기존 페이지마다 다른 패턴** → Figma 스펙을 우선하되, 가장 최근 구현된 페이지를 참조
- **Figma에 명시적 지시가 있는 경우** → Figma 우선 (단, 기존 패턴과 다르면 사용자에게 확인)

> **핵심 원칙**: Figma 디자인에 아이콘이 있다고 해서 무조건 넣지 않는다. 기존 동일 유형 페이지에 아이콘이 없으면 넣지 않는다. 디자인 일관성이 Figma 개별 프레임의 정확한 재현보다 우선한다.

### Step 3: 기존 파일 확인

대상 파일이 이미 존재하는지 확인합니다.

- **기존 파일 있음**: 파일을 읽고, 스펙과 비교하여 수정 범위 결정
- **기존 파일 없음**: 템플릿으로 신규 생성

### Step 4: 페이지 코드 생성

페이지 타입별 표준 템플릿을 따라 코드를 생성합니다.

#### 4-1. 공통 Shell 구조

모든 AI Platform 페이지는 동일한 Shell 구조를 공유합니다. **아래 템플릿의 `contentClassName`, `TopBar.actions`, `PageHeader.actions`는 Step 2에서 확인한 기존 페이지 패턴을 따릅니다.**

```tsx
import { useState, useEffect } from 'react';
import {
  VStack, HStack, PageShell, TabBar, TopBar, Breadcrumb, PageHeader,
  // ...스펙에 명시된 컴포넌트들
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';

export function {PageName}Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  useEffect(() => {
    updateActiveTabLabel('{PageTitle}');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={<Breadcrumb items={[/* 스펙의 breadcrumb */]} />}
          actions={
            /* Step 2에서 확인한 기존 패턴을 따름. 대부분의 AI Platform 페이지는 Bell 아이콘 단독 */
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName={/* Step 2에서 확인한 기존 패턴을 따름. 기본값: "pt-4 px-8 pb-20" */}
    >
      {/* Page Content — 타입별 패턴 */}
    </PageShell>
  );
}
```

> **주의**: `contentClassName`에 `bg-[var(--color-surface-subtle)]`을 넣지 마세요. 기존 AI Platform List 페이지들(Workloads, Models, Datasets)은 배경색 없이 `"pt-4 px-8 pb-20"`을 사용합니다. 배경색이 필요한 경우는 Step 2에서 기존 동일 유형 페이지가 실제로 배경색을 사용하고 있는 경우에만 적용합니다.

> **주의**: `PageHeader.actions`의 Button에 `leftIcon`을 넣지 마세요. 기존 AI Platform 페이지들은 텍스트만 있는 Button을 사용합니다. Figma에 아이콘이 보이더라도 기존 패턴과 일치시키는 것이 우선입니다.

#### 4-2. List Page 패턴

```tsx
// 상태
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

// 필터
const filterFields: FilterField[] = [/* 스펙에서 추출 */];

// 컬럼
const columns = [/* 스펙에서 추출 */];

// 목 데이터
const mockData: {PageName}Item[] = [/* 15~20개 */];

// 렌더링
<VStack gap={3}>
  <PageHeader title="{Title}" actions={/* 스펙 */} />
  <ListToolbar
    primaryActions={
      <ListToolbar.Actions>
        <FilterSearchInput
          filters={filterFields}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Search..."
          size="sm"
          className="w-[var(--search-input-width)]"
          hideAppliedFilters
        />
      </ListToolbar.Actions>
    }
    bulkActions={/* 스펙 */}
  />
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    showSettings
    totalItems={filteredData.length}
    selectedCount={selectedItems.length}
  />
  <Table
    columns={columns}
    data={paginatedData}
    rowKey="id"
    selectable
    selectedKeys={selectedItems}
    onSelectionChange={setSelectedItems}
  />
</VStack>
```

#### 4-3. Detail Page 패턴

```tsx
const [activeTab, setActiveTab] = useState('details');

<VStack gap={4}>
  <DetailHeader>
    <DetailHeader.Title>{resourceName}</DetailHeader.Title>
    <DetailHeader.Actions>{/* 스펙 */}</DetailHeader.Actions>
    <DetailHeader.InfoGrid>{/* 스펙의 InfoCard들 */}</DetailHeader.InfoGrid>
  </DetailHeader>

  <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
    <TabList>{/* 스펙의 탭들 */}</TabList>
    <TabPanel value="details" className="pt-0">
      <VStack gap={4} className="pt-4">
        <SectionCard>
          <SectionCard.Header title="Basic Information" actions={/* 스펙 */} />
          <SectionCard.Content>{/* 스펙의 DataRow들 */}</SectionCard.Content>
        </SectionCard>
      </VStack>
    </TabPanel>
  </Tabs>
</VStack>;
```

#### 4-4. Create Page (Wizard) 패턴

```tsx
const [sectionStatus, setSectionStatus] = useState<Record<string, WizardSectionState>>({
  'basic-info': 'active',
  configuration: 'pre',
});

<VStack gap={4}>
  <PageHeader title="Create {Resource}" />
  {/* 스펙의 섹션들 — SectionCard with isActive */}
  <HStack justify="end" gap={2}>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary" disabled={!canCreate}>
      Create
    </Button>
  </HStack>
</VStack>;
```

#### 4-5. Dashboard 패턴

```tsx
<VStack gap={4}>
  <PageHeader title="{Dashboard Title}" />
  <MetricCard.Group>{/* 스펙의 메트릭 카드들 */}</MetricCard.Group>
  <SectionCard>{/* 차트, 테이블 등 */}</SectionCard>
</VStack>
```

### Step 5: 목 데이터 생성

스펙의 Mock Data Shape를 기반으로 현실적인 테스트 데이터를 생성합니다.

**규칙**:

- List 페이지: 15~20개 행
- 상태 필드: 다양한 값 분포 (active 60%, building 15%, error 15%, muted 10%)
- ID: 현실적인 형식 (예: `wl-001`, `model-abc123`)
- 이름: 현실적인 리소스 이름 (예: `llama-3.1-70b-finetune`, `gpt-training-job-01`)
- 날짜: 최근 날짜 (2024~2026)

### Step 6: 라우트 등록 (신규 페이지)

`src/App.tsx`에 라우트가 없는 경우 등록합니다.

**확인 절차**:

1. `App.tsx`에서 해당 경로의 라우트가 이미 있는지 확인
2. 없으면 AI Platform 라우트 블록에 추가
3. import 문 추가

```tsx
// App.tsx에 추가
import { NewFeaturePage } from './pages/ai-platform/NewFeaturePage';

// Route 추가
<Route path="/ai-platform/new-feature" element={<NewFeaturePage />} />;
```

### Step 7: 빌드 검증

코드 작성 후 기본 검증을 수행합니다.

1. **TypeScript 체크**: `ReadLints`로 타입 에러 확인
2. **Import 확인**: 사용된 모든 컴포넌트가 `@/design-system`에서 import 가능한지 확인
3. **필수 import 누락 확인**: useState, useEffect, 아이콘 등

에러가 있으면 즉시 수정합니다.

### Step 8: 완료 보고

```markdown
## Page Applied: {PageName}

- **File**: src/pages/ai-platform/{PageName}Page.tsx
- **Status**: {created|modified}
- **Route**: /ai-platform/{route} ({new|existing})
- **Components used**: {컴포넌트 목록}
- **Mock data**: {N}개 행
- **Build**: {pass|fail} (에러 있으면 상세)
```

## TDS 규칙 체크리스트

코드 생성 시 반드시 확인해야 하는 TDS 규칙:

| #   | 규칙                                                           | 확인 |
| --- | -------------------------------------------------------------- | ---- |
| 1   | 모든 import는 `@/design-system`에서                            | ☐    |
| 2   | 색상은 CSS 변수 사용 (하드코딩 금지)                           | ☐    |
| 3   | 타이포그래피 유틸리티 클래스 사용                              | ☐    |
| 4   | 버튼 사이즈/variant 위치별 규칙 준수                           | ☐    |
| 5   | 테이블 컬럼 정렬 규칙 (텍스트=left, 숫자=right, 상태=center)   | ☐    |
| 6   | EmptyState는 DS 컴포넌트 사용                                  | ☐    |
| 7   | FormField로 폼 컨트롤 래핑                                     | ☐    |
| 8   | icon-only 버튼에 aria-label                                    | ☐    |
| 9   | 배열 데이터는 BadgeList 사용                                   | ☐    |
| 10  | spacing/radius는 TDS 토큰 사용                                 | ☐    |
| 11  | ContextMenu items에 id 필드 필수                               | ☐    |
| 12  | PageShell 사용 (수동 레이아웃 금지)                            | ☐    |
| 13  | fallback 색상 금지 (var(--color-xxx, #fff) → var(--color-xxx)) | ☐    |

## 필수: TDS 컴포넌트 사전 매핑 (KNOWN_ISSUES #2 대응)

**경고/에러/정보 배너를 직접 div로 구현하면 안 됩니다.** 구현 전에 `@/design-system` export 목록에서 사용 가능한 컴포넌트를 먼저 확인합니다.

| UI 요소             | 직접 구현 금지                                     | TDS 컴포넌트 사용                     |
| ------------------- | -------------------------------------------------- | ------------------------------------- |
| 경고/에러/정보 배너 | `<div className="flex bg-red-50 ...">`             | `<InlineMessage variant="error">`     |
| 상태 도트+텍스트    | `<div className="flex gap-1 ...">`                 | `<StatusIndicator status="active">`   |
| 빈 화면             | `<div className="flex flex-col items-center ...">` | `<EmptyState icon={...} title={...}>` |
| 에러 화면           | 커스텀 div                                         | `<ErrorState>`                        |
| 툴팁                | title 속성                                         | `<Tooltip content={...}>`             |

## 필수: Figma 수치 그대로 적용 (KNOWN_ISSUES #3 대응)

스펙에 기록된 px 수치를 임의로 변경하지 않습니다.

```tsx
// ❌ 금지: 스펙에 rounded-[16px]인데 rounded-md로 대체
<div className="rounded-md p-3">

// ✅ 필수: 스펙 수치 그대로
<div className="rounded-[16px] p-[16px]">
```

## 필수: 아이콘 stroke 명시 (KNOWN_ISSUES #4 대응)

스펙에 기록된 stroke 값을 반드시 prop으로 전달합니다. Tabler 기본 stroke(2)를 사용하지 않습니다.

```tsx
// ❌ 금지: stroke 생략 (기본값 2로 렌더링됨)
<IconCopy size={16} />

// ✅ 필수: 스펙의 stroke 값 명시
<IconCopy size={16} stroke={1} />
```

## 필수: 모든 케이스 한 번에 구현 (KNOWN_ISSUES #5 대응)

스펙에 기록된 모든 케이스(empty, basic, readonly, error 등)를 **한 번에** 구현합니다. 기본 케이스만 먼저 구현하고 나머지를 나중에 추가하면 반복 수정이 발생합니다.

```tsx
type CaseId = 'empty' | 'basic' | 'readonly' | 'error' | 'full';

function getCaseData(caseId: CaseId) {
  switch (caseId) {
    case 'empty':
      return [];
    case 'basic':
      return [basicMessage];
    case 'readonly':
      return [readonlyMessage];
    // ... 모든 케이스
  }
}
```

## 서브에이전트 병렬 구현 전략

### 개요

`tds-page-sync` 파이프라인에서 여러 페이지를 동시에 구현할 때, 메인 에이전트가 서브에이전트를 병렬로 실행하여 구현 속도를 높입니다.

### 메인 에이전트 역할

1. **Phase 1-A 결과 정리**: `explore` 서브에이전트가 추출한 기존 페이지 패턴을 정리
2. **서브에이전트 디스패치**: 각 페이지별로 `generalPurpose` 서브에이전트 실행
3. **공통 파일 수정**: App.tsx 라우트 일괄 등록, DS 컴포넌트 수정 (서브에이전트 금지)
4. **결과 검증**: 서브에이전트 결과 수집 후 전체 빌드 검증

### 서브에이전트 역할 (generalPurpose)

1. **단일 페이지만 구현**: 각 서브에이전트는 1개 페이지만 담당
2. **패턴 컨텍스트 적용**: 메인이 전달한 기존 패턴 필수 준수
3. **독립 파일만 수정**: 담당 페이지 `.tsx` 파일만 생성/수정
4. **빌드 검증**: ReadLints로 자체 검증

### 서브에이전트 프롬프트 필수 포함 사항

메인 에이전트가 서브에이전트를 실행할 때, 프롬프트에 반드시 다음 정보를 포함합니다:

```markdown
## 구현 대상

- 스펙 파일: {경로}
- 출력 파일: {경로}
- 페이지 타입: {List / Detail / Create / Main}

## 기존 페이지 패턴 (반드시 준수)

- contentClassName: "pt-4 px-8 pb-20" (배경색 없음)
- TopBar actions: IconBell만 (IconSearch 없음)
- PageHeader Button: variant="primary", size="md", leftIcon 없음
- PageHeader HStack gap: gap={1}
- Breadcrumb: [{label}, {label}, ...]

## 금지 사항

- App.tsx 수정 금지 (메인 에이전트가 일괄 처리)
- src/design-system/ 하위 파일 수정 금지
- 공유 컴포넌트 (Sidebar 등) 수정 금지

## 참조 파일

- TDS 규칙: .cursor/rules/tds-design-system.mdc
- 기존 페이지 예시: src/pages/ai-platform/{ExistingPage}.tsx
```

### 병렬 제약 조건

| 항목                   | 제약                        |
| ---------------------- | --------------------------- |
| 최대 동시 서브에이전트 | 4개                         |
| App.tsx 수정           | 메인 에이전트만             |
| DS 컴포넌트 수정       | 메인 에이전트만             |
| 공유 유틸리티 수정     | 메인 에이전트만             |
| 단일 페이지            | 서브에이전트 없이 직접 구현 |

### 서브에이전트로 호출될 때 (서브에이전트 모드)

이 스킬이 `generalPurpose` 서브에이전트 내에서 실행되는 경우:

1. **Step 2 (기존 페이지 비교)는 건너뜀** — 메인이 이미 패턴을 전달함
2. 프롬프트에 포함된 "기존 페이지 패턴"을 그대로 적용
3. **Step 6 (라우트 등록)은 건너뜀** — 메인이 일괄 처리
4. 나머지 Step은 동일하게 수행

## 주의사항

- 기존 파일 수정 시 불필요한 변경 최소화 (기존 로직 보존)
- 목 데이터는 현실적이어야 함 (placeholder 텍스트 금지)
- 아이콘은 반드시 `@tabler/icons-react`에서 import
- `useTabs`, `AIPlatformSidebar` import 경로는 기존 패턴을 따름
- dev 서버가 실행 중이면 HMR로 즉시 확인 가능
- 코드에 불필요한 주석 추가 금지 (TDS 규칙)
