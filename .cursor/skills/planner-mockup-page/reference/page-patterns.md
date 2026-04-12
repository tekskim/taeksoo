# 페이지 패턴 레퍼런스

기획자 요구사항을 7가지 유즈케이스 패턴으로 분류하고, 각 패턴의 컴포넌트 조합과 목업 스캐폴딩 코드를 제공합니다.
IAM(`packages/iam/`)과 Compute(`packages/compute/`)의 실제 페이지를 참조했습니다.

---

## 패턴 1: 리스트 페이지

데이터를 테이블로 나열하고 필터/검색/페이지네이션으로 탐색하는 페이지.

### 참조 파일

- `packages/iam/src/ui/pages/UsersListPage.tsx`
- `packages/iam/src/ui/pages/PoliciesListPage.tsx`
- `packages/compute/src/features/compute/ui/pages/InstanceListPage.tsx`

### 컴포넌트 조합

```
┌─────────────────────────────────────┐
│ Title                               │
├─────────────────────────────────────┤
│ HStack: [FilterSearchInput] [Button]│
│ FilterSearchResults                 │
├─────────────────────────────────────┤
│ TcTable                             │
│  ├ Header row (컬럼명)              │
│  ├ Body rows                        │
│  │  ├ StatusIndicator (상태 컬럼)   │
│  │  ├ Badge (유형 컬럼)             │
│  │  └ ContextMenu (행 액션)         │
│  └ EmptyUI (데이터 없을 때)         │
├─────────────────────────────────────┤
│ Pagination                          │
└─────────────────────────────────────┘
```

### 커스터마이즈 포인트

- `columns`: 컬럼 정의 (이름, 너비, 정렬 가능 여부)
- `FILTER_KEYS`: 필터 항목 (키 이름, 입력 타입, 선택지)
- `DUMMY_DATA`: 테이블에 표시할 더미 데이터
- `actions`: 상단 버튼 (생성, 삭제 등)
- `rowActions`: 행 컨텍스트 메뉴 항목

### 스캐폴딩 코드

```tsx
import {
  Title,
  Layout,
  Button,
  TcTable,
  Pagination,
  StatusIndicator,
  Badge,
  ContextMenu,
  EmptyUI,
  FilterSearchInput,
  FilterSearchResults,
  useFilterSearch,
} from '@thaki/shared';
import type { FilterKey } from '@thaki/shared';
import { useState } from 'react';

// --- 커스터마이즈: 필터 키 정의 ---
const FILTER_KEYS: FilterKey[] = [
  { id: 'name', label: '이름', type: 'input' },
  {
    id: 'status',
    label: '상태',
    type: 'select',
    options: [
      { label: '활성', value: 'active' },
      { label: '비활성', value: 'inactive' },
    ],
  },
];

// --- 커스터마이즈: 컬럼 정의 ---
const columns = [
  { id: 'name', label: '이름', width: 'w-[200px]' },
  { id: 'status', label: '상태', width: 'w-[120px]' },
  { id: 'type', label: '유형', width: 'w-[120px]' },
  { id: 'createdAt', label: '생성일', width: 'w-[160px]' },
  { id: 'actions', label: '', width: 'w-[60px]' },
];

// --- 커스터마이즈: 더미 데이터 ---
const DUMMY_DATA = [
  { id: '1', name: '항목 A', status: 'active', type: '기본', createdAt: '2025-01-15' },
  { id: '2', name: '항목 B', status: 'inactive', type: '관리자', createdAt: '2025-02-20' },
  { id: '3', name: '항목 C', status: 'active', type: '기본', createdAt: '2025-03-10' },
];

const MockListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const filterSearch = useFilterSearch({ filterKeys: FILTER_KEYS });

  return (
    <Layout.VStack gap="md">
      <Layout.HStack justify="between" align="center">
        <Title title="리소스 목록" />
        <Button variant="primary">새로 만들기</Button>
      </Layout.HStack>

      <Layout.VStack gap="sm">
        <FilterSearchInput {...filterSearch.inputProps} />
        <FilterSearchResults {...filterSearch.resultsProps} />
      </Layout.VStack>

      {DUMMY_DATA.length === 0 ? (
        <EmptyUI content={{ title: '데이터가 없습니다', description: '새 항목을 추가해 보세요.' }}>
          <Button variant="primary">새로 만들기</Button>
        </EmptyUI>
      ) : (
        <TcTable.Body columns={columns}>
          {DUMMY_DATA.map((item) => (
            <TcTable.Tr key={item.id}>
              <TcTable.Td className="w-[200px]">{item.name}</TcTable.Td>
              <TcTable.Td className="w-[120px]">
                <StatusIndicator
                  variant={item.status === 'active' ? 'active' : 'suspended'}
                  label={item.status === 'active' ? '활성' : '비활성'}
                />
              </TcTable.Td>
              <TcTable.Td className="w-[120px]">
                <Badge theme={item.type === '관리자' ? 'blu' : 'gry'} size="sm">
                  {item.type}
                </Badge>
              </TcTable.Td>
              <TcTable.Td className="w-[160px]">{item.createdAt}</TcTable.Td>
              <TcTable.Td className="w-[60px]">
                <ContextMenu.Root
                  trigger={({ onToggle }) => (
                    <Button variant="ghost" size="icon-only" onClick={onToggle}>
                      ⋮
                    </Button>
                  )}
                >
                  <ContextMenu.Item label="수정" onClick={() => {}} />
                  <ContextMenu.Item label="삭제" onClick={() => {}} />
                </ContextMenu.Root>
              </TcTable.Td>
            </TcTable.Tr>
          ))}
        </TcTable.Body>
      )}

      <Pagination
        totalCount={DUMMY_DATA.length}
        size={10}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
      />
    </Layout.VStack>
  );
};

export default MockListPage;
```

---

## 패턴 2: 상세 페이지 (탭 포함)

리소스 하나의 상세 정보를 헤더 + 탭으로 구성하는 페이지.

### 참조 파일

- `packages/iam/src/ui/pages/UserDetailPage.tsx` — 탭: 그룹, 역할, 보안, 세션
- `packages/iam/src/ui/pages/RoleDetailPage.tsx` — 중첩 탭 (외부 line + 내부 button)
- `packages/compute/src/features/compute/ui/pages/InstanceDetailPage.tsx` — 탭: 상세, 볼륨, 인터페이스, 모니터링 등

### 컴포넌트 조합

```
┌──────────────────────────────────────┐
│ DetailPageHeader                     │
│  ├ title + StatusIndicator           │
│  ├ infoFields (키/값 요약)           │
│  └ actions (Button들)                │
├──────────────────────────────────────┤
│ Tabs                                 │
│  ├ Tab "개요"                        │
│  │  └ DetailCard (여러 개)           │
│  ├ Tab "하위 리소스"                 │
│  │  └ TcTable + Pagination           │
│  └ Tab "설정"                        │
│     └ FormField + Button             │
└──────────────────────────────────────┘
```

### 탭 콘텐츠 유형

- **상세정보 탭**: `DetailCard` 여러 개로 속성 표시 (참조: `VolumeDetailPage`)
- **테이블 탭**: `TcTable` + `Pagination` (참조: `UserDetailPage`의 그룹/역할/세션 탭)
- **혼합 탭**: `DetailCard` + `TcTable` 조합
- **중첩 탭**: 외부 `variant="line"` + 내부 `variant="button"` (참조: `RoleDetailPage`)

### 커스터마이즈 포인트

- `headerInfoFields`: 헤더에 표시할 키/값 쌍
- `tabs`: 탭 ID, 라벨, 콘텐츠 유형
- `detailFields`: DetailCard 필드 정의
- `tableColumns`: 테이블 탭의 컬럼 정의

### 스캐폴딩 코드

```tsx
import {
  DetailPageHeader,
  Tabs,
  Tab,
  DetailCard,
  TcTable,
  Pagination,
  StatusIndicator,
  Button,
  Layout,
} from '@thaki/shared';
import { useState } from 'react';

// --- 커스터마이즈: 리소스 더미 데이터 ---
const RESOURCE = {
  name: '리소스 A',
  status: 'active',
  id: 'res-001',
  createdAt: '2025-01-15',
  description: '샘플 리소스입니다.',
};

// --- 커스터마이즈: 상세 카드 필드 ---
const detailFields = [
  { label: 'ID', value: RESOURCE.id },
  { label: '이름', value: RESOURCE.name },
  { label: '설명', value: RESOURCE.description },
  { label: '생성일', value: RESOURCE.createdAt },
];

// --- 커스터마이즈: 하위 리소스 더미 데이터 ---
const SUB_RESOURCES = [
  { id: '1', name: '하위 항목 A', role: '관리자' },
  { id: '2', name: '하위 항목 B', role: '뷰어' },
];

const MockDetailPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [subPage, setSubPage] = useState(1);

  return (
    <Layout.VStack gap="md">
      <DetailPageHeader
        title={RESOURCE.name}
        infoFields={[
          {
            label: '상태',
            value: <StatusIndicator variant="active" label="활성" />,
          },
          { label: 'ID', value: RESOURCE.id },
        ]}
        actions={
          <Layout.HStack gap="sm">
            <Button variant="outline">수정</Button>
            <Button variant="danger">삭제</Button>
          </Layout.HStack>
        }
      />

      <Tabs activeTabId={activeTab} onChange={setActiveTab}>
        <Tab id="details" label="개요">
          <Layout.VStack gap="md" style={{ paddingTop: 16 }}>
            <DetailCard title="기본 정보" fields={detailFields} />
          </Layout.VStack>
        </Tab>

        <Tab id="subResources" label="하위 리소스">
          <Layout.VStack gap="md" style={{ paddingTop: 16 }}>
            <TcTable.Body
              columns={[
                { id: 'name', label: '이름' },
                { id: 'role', label: '역할' },
              ]}
            >
              {SUB_RESOURCES.map((item) => (
                <TcTable.Tr key={item.id}>
                  <TcTable.Td>{item.name}</TcTable.Td>
                  <TcTable.Td>{item.role}</TcTable.Td>
                </TcTable.Tr>
              ))}
            </TcTable.Body>
            <Pagination
              totalCount={SUB_RESOURCES.length}
              size={10}
              currentAt={subPage}
              onPageChange={setSubPage}
            />
          </Layout.VStack>
        </Tab>
      </Tabs>
    </Layout.VStack>
  );
};

export default MockDetailPage;
```

---

## 패턴 3: 생성/편집 페이지 (Stepper 위저드)

리소스 생성을 단계별로 안내하는 위저드 페이지.

### 참조 파일

- `packages/iam/src/ui/pages/UserCreatePage.tsx` — Stepper + DetailCard 요약

### 컴포넌트 조합

```
┌──────────────────────────┬──────────────┐
│ CreateLayout (main)      │ sidebar      │
│  ├ Stepper               │ FloatingCard │
│  │  ├ Step 1: 기본 정보  │  ├ 요약 섹션 │
│  │  │  └ FormField+Input │  └ 선택 요약 │
│  │  ├ Step 2: 설정       │              │
│  │  │  └ FormField+Toggle│              │
│  │  └ Step 3: 확인       │              │
│  │     └ DetailCard 요약 │              │
│  └ 하단 버튼             │              │
└──────────────────────────┴──────────────┘
```

### 커스터마이즈 포인트

- `steps`: 단계 ID와 라벨
- 각 단계의 폼 필드 구성
- `FloatingCard sections`: 사이드바 요약 항목
- 최종 확인 단계의 `DetailCard` 필드

### 스캐폴딩 코드

```tsx
import {
  CreateLayout,
  Stepper,
  FormField,
  Input,
  Toggle,
  DetailCard,
  FloatingCard,
  Button,
  Layout,
  Typography,
} from '@thaki/shared';
import { useState } from 'react';

// --- 커스터마이즈: 단계 정의 ---
const STEP_IDS = ['basicInfo', 'settings', 'review'] as const;

const MockCreatePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    enabled: true,
  });

  const updateField = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CreateLayout
      title="새 리소스 만들기"
      sidebar={
        <FloatingCard
          summaryTitle="요약"
          sections={[
            {
              title: '기본 정보',
              items: [
                { label: '이름', value: formData.name || '-' },
                { label: '설명', value: formData.description || '-' },
              ],
            },
          ]}
        />
      }
    >
      <Stepper stepIds={[...STEP_IDS]}>
        {/* Step 1: 기본 정보 */}
        <Layout.VStack gap="md">
          <Typography.Title level={3}>기본 정보</Typography.Title>
          <FormField label="이름" required>
            <Input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="리소스 이름 입력"
            />
          </FormField>
          <FormField label="설명">
            <Input
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="설명 입력 (선택)"
            />
          </FormField>
        </Layout.VStack>

        {/* Step 2: 설정 */}
        <Layout.VStack gap="md">
          <Typography.Title level={3}>설정</Typography.Title>
          <FormField label="활성화">
            <Toggle
              checked={formData.enabled}
              onChange={(checked) => updateField('enabled', checked)}
            />
          </FormField>
        </Layout.VStack>

        {/* Step 3: 확인 */}
        <Layout.VStack gap="md">
          <Typography.Title level={3}>확인</Typography.Title>
          <DetailCard
            title="입력 정보 확인"
            fields={[
              { label: '이름', value: formData.name || '-' },
              { label: '설명', value: formData.description || '-' },
              { label: '활성화', value: formData.enabled ? '예' : '아니오' },
            ]}
          />
        </Layout.VStack>
      </Stepper>

      <Layout.HStack gap="sm" justify="end" style={{ marginTop: 24 }}>
        <Button variant="outline">취소</Button>
        <Button variant="primary">생성</Button>
      </Layout.HStack>
    </CreateLayout>
  );
};

export default MockCreatePage;
```

---

## 패턴 4: 설정 페이지

탭으로 구분된 설정 항목을 폼으로 편집하는 페이지.

### 참조 파일

- `packages/iam/src/ui/pages/TokenPoliciesSettingsPage.tsx`
- `packages/iam/src/ui/pages/SessionPoliciesSettingsPage.tsx`

### 컴포넌트 조합

```
┌─────────────────────────────────────┐
│ Title                               │
├─────────────────────────────────────┤
│ Tabs                                │
│  ├ Tab "일반 설정"                  │
│  │  ├ FormField + Input             │
│  │  ├ FormField + NumberInput       │
│  │  ├ FormField + Toggle            │
│  │  └ HStack: [ResetButton] [Save]  │
│  └ Tab "고급 설정"                  │
│     ├ FormField + Range             │
│     └ HStack: [ResetButton] [Save]  │
└─────────────────────────────────────┘
```

### 커스터마이즈 포인트

- `tabs`: 설정 카테고리 탭
- 각 탭의 폼 필드 구성 (Input/NumberInput/Toggle/Range/Dropdown)
- 저장/리셋 동작

### 스캐폴딩 코드

```tsx
import {
  Title,
  Tabs,
  Tab,
  FormField,
  Input,
  NumberInput,
  Toggle,
  Button,
  Layout,
} from '@thaki/shared';
import { useState } from 'react';

// --- 커스터마이즈: 설정 값 ---
const DEFAULT_SETTINGS = {
  maxRetries: 3,
  timeout: 30,
  enableNotifications: true,
  webhookUrl: '',
};

const MockSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setSettings(DEFAULT_SETTINGS);

  return (
    <Layout.VStack gap="md">
      <Title title="설정" />

      <Tabs activeTabId={activeTab} onChange={setActiveTab}>
        <Tab id="general" label="일반">
          <Layout.VStack gap="md" style={{ paddingTop: 16, maxWidth: 480 }}>
            <FormField label="최대 재시도 횟수">
              <NumberInput
                value={settings.maxRetries}
                onChange={(v) => updateSetting('maxRetries', v)}
                min={0}
                max={10}
              />
            </FormField>
            <FormField label="타임아웃 (초)">
              <NumberInput
                value={settings.timeout}
                onChange={(v) => updateSetting('timeout', v)}
                min={1}
                max={300}
              />
            </FormField>
            <FormField label="알림 활성화">
              <Toggle
                checked={settings.enableNotifications}
                onChange={(v) => updateSetting('enableNotifications', v)}
              />
            </FormField>

            <Layout.HStack gap="sm" justify="end">
              <Button variant="ghost" onClick={handleReset}>
                초기화
              </Button>
              <Button variant="primary">저장</Button>
            </Layout.HStack>
          </Layout.VStack>
        </Tab>

        <Tab id="advanced" label="고급">
          <Layout.VStack gap="md" style={{ paddingTop: 16, maxWidth: 480 }}>
            <FormField label="Webhook URL">
              <Input
                value={settings.webhookUrl}
                onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                placeholder="https://..."
              />
            </FormField>

            <Layout.HStack gap="sm" justify="end">
              <Button variant="ghost" onClick={handleReset}>
                초기화
              </Button>
              <Button variant="primary">저장</Button>
            </Layout.HStack>
          </Layout.VStack>
        </Tab>
      </Tabs>
    </Layout.VStack>
  );
};

export default MockSettingsPage;
```

---

## 패턴 5: 확인/삭제 모달

사용자에게 확인을 구하는 모달. 3가지 컴포넌트 중 상황에 맞게 선택.

### 참조 파일

- `packages/iam/src/ui/pages/UserCreatePage.tsx` — ActionModal (미저장 이탈)
- `packages/iam/src/ui/pages/UsersListPage.tsx` — ResourceActionModal (사용자 삭제)
- `packages/compute/src/features/network/ui/widgets/NetworkDeleteModal.tsx` — DeleteResourceModal

### 선택 기준

```
단순 확인만 필요? ──yes──> ActionModal
                  │
                  no
                  │
리소스 정보를 보여줘야? ──yes──> ResourceActionModal
                  │
                  no (삭제 전용)
                  │
                  └──> DeleteResourceModal
```

### 스캐폴딩 코드: ActionModal (단순 확인)

```tsx
import { ActionModal } from '@thaki/shared';

// --- 커스터마이즈: 모달 설정 ---
const MockConfirmModal = ({
  appeared,
  onConfirm,
  onCancel,
}: {
  appeared: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <ActionModal
    appeared={appeared}
    actionConfig={{
      title: '변경 사항을 저장하지 않고 나가시겠습니까?',
      subtitle: '저장되지 않은 변경 사항은 사라집니다.',
      primaryText: '나가기',
      secondaryText: '취소',
      primaryVariant: 'danger',
    }}
    onAction={onConfirm}
    onCancel={onCancel}
  />
);
```

### 스캐폴딩 코드: ResourceActionModal (리소스 정보 + 확인)

```tsx
import { ResourceActionModal } from '@thaki/shared';

// --- 커스터마이즈: 대상 리소스, 액션 설정 ---
const MockResourceModal = ({
  appeared,
  onAction,
  onCancel,
}: {
  appeared: boolean;
  onAction: () => void;
  onCancel: () => void;
}) => (
  <ResourceActionModal
    appeared={appeared}
    actionConfig={{
      title: '리소스를 삭제하시겠습니까?',
      subtitle: '이 작업은 되돌릴 수 없습니다.',
      primaryText: '삭제',
      secondaryText: '취소',
      primaryVariant: 'danger',
    }}
    infoItems={[
      { label: '이름', values: ['리소스 A'] },
      { label: '상태', values: ['활성'] },
    ]}
    content={{ message: '연결된 하위 리소스도 함께 삭제됩니다.', type: 'warning' }}
    onAction={onAction}
    onCancel={onCancel}
  />
);
```

---

## 패턴 6: 편집 드로어

화면 오른쪽에서 슬라이드되는 패널. 리소스 편집이나 할당에 사용.

### 참조 파일

- `packages/iam/src/ui/widgets/UserEditDrawer.tsx` — 단순 폼 드로어
- `packages/iam/src/ui/widgets/UserRolesDrawer.tsx` — 선택 테이블 드로어
- `packages/compute/src/features/storage/ui/widgets/overlays/ExtendVolumeDrawer.tsx` — 복합 폼 드로어

### 3가지 변형

**A) 단순 폼 드로어** — 몇 개의 입력 필드로 리소스 속성 편집
**B) 선택 테이블 드로어** — 필터 + 테이블로 항목 선택/할당
**C) 복합 폼 드로어** — InfoContainer + FormField + Range 등 복합 입력

### 컴포넌트 조합 (공통)

```
┌─────────────────────────────────────┐
│ Overlay.Template                    │
│  type="drawer-horizontal"           │
│  ├ title                            │
│  ├ description (선택)               │
│  ├─────────────────────────────────│
│  │ 본문 (변형에 따라 다름)          │
│  │  A) FormField + Input/Toggle     │
│  │  B) FilterSearch + TcTable       │
│  │  C) InfoContainer + FormField    │
│  ├─────────────────────────────────│
│  └ confirmUI / cancelUI            │
└─────────────────────────────────────┘
```

### 스캐폴딩 코드: A) 단순 폼 드로어

```tsx
import { Overlay, FormField, Input, Toggle, Layout, Typography } from '@thaki/shared';
import type { OverlayProps } from '@thaki/shared';
import { useState } from 'react';

// --- 커스터마이즈: 폼 필드, 초기값 ---
const MockEditDrawer = ({ appeared, onConfirm, onCancel }: OverlayProps) => {
  const [name, setName] = useState('리소스 A');
  const [enabled, setEnabled] = useState(true);

  return (
    <Overlay.Template
      type="drawer-horizontal"
      appeared={appeared}
      title="리소스 수정"
      confirmUI="저장"
      cancelUI="취소"
      onConfirm={() => onConfirm?.()}
      onCancel={() => onCancel?.()}
    >
      <Layout.VStack gap="md" className="w-[400px] p-4">
        <FormField label="이름" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="활성화">
          <Toggle checked={enabled} onChange={setEnabled} />
        </FormField>
      </Layout.VStack>
    </Overlay.Template>
  );
};
```

### 스캐폴딩 코드: B) 선택 테이블 드로어

```tsx
import {
  Overlay,
  FilterSearchInput,
  FilterSearchResults,
  useFilterSearch,
  TcTable,
  Checkbox,
  Layout,
  Typography,
} from '@thaki/shared';
import type { OverlayProps, FilterKey } from '@thaki/shared';
import { useState } from 'react';

const FILTER_KEYS: FilterKey[] = [{ id: 'name', label: '이름', type: 'input' }];

// --- 커스터마이즈: 선택 가능한 항목 ---
const AVAILABLE_ITEMS = [
  { id: '1', name: '역할 A', description: '관리자 역할' },
  { id: '2', name: '역할 B', description: '읽기 전용' },
  { id: '3', name: '역할 C', description: '편집자' },
];

const MockSelectionDrawer = ({ appeared, onConfirm, onCancel }: OverlayProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const filterSearch = useFilterSearch({ filterKeys: FILTER_KEYS });

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Overlay.Template
      type="drawer-horizontal"
      appeared={appeared}
      title="역할 할당"
      description="할당할 역할을 선택하세요."
      confirmUI={`할당 (${selected.size})`}
      cancelUI="취소"
      onConfirm={() => onConfirm?.()}
      onCancel={() => onCancel?.()}
    >
      <Layout.VStack gap="md" className="w-[600px] p-4">
        <FilterSearchInput {...filterSearch.inputProps} />
        <FilterSearchResults {...filterSearch.resultsProps} />

        <TcTable.Body
          columns={[
            { id: 'select', label: '', width: 'w-[40px]' },
            { id: 'name', label: '이름' },
            { id: 'description', label: '설명' },
          ]}
        >
          {AVAILABLE_ITEMS.map((item) => (
            <TcTable.Tr key={item.id}>
              <TcTable.Td className="w-[40px]">
                <Checkbox checked={selected.has(item.id)} onChange={() => toggleItem(item.id)} />
              </TcTable.Td>
              <TcTable.Td>{item.name}</TcTable.Td>
              <TcTable.Td>{item.description}</TcTable.Td>
            </TcTable.Tr>
          ))}
        </TcTable.Body>
      </Layout.VStack>
    </Overlay.Template>
  );
};
```

---

## 패턴 7: 대시보드/카드 페이지

카드와 차트로 구성된 요약/모니터링 페이지.

### 참조 파일

- `packages/storage/src/features/dashboard/` (Storage 대시보드 위젯)

### 컴포넌트 조합

```
┌─────────────────────────────────────┐
│ Title                               │
├──────────┬──────────┬───────────────┤
│ Card 1   │ Card 2   │ Card 3       │
│ ProgressBar         │ Badge        │
├──────────┴──────────┴───────────────┤
│ CardList (또는 Layout.Grid)         │
│  ├ 카드 위젯 A                      │
│  ├ 카드 위젯 B                      │
│  └ 카드 위젯 C                      │
└─────────────────────────────────────┘
```

### 스캐폴딩 코드

```tsx
import { Title, Layout, Typography, ProgressBar, Badge, StatusIndicator } from '@thaki/shared';

// --- 커스터마이즈: 대시보드 데이터 ---
const SUMMARY_CARDS = [
  { title: '전체 리소스', value: '128', status: 'active' as const },
  { title: '사용 중', value: '96', status: 'active' as const },
  { title: '오류', value: '3', status: 'error' as const },
];

const USAGE_ITEMS = [
  { label: 'CPU', value: 72, max: 100 },
  { label: '메모리', value: 58, max: 100 },
  { label: '스토리지', value: 340, max: 500 },
];

const MockDashboardPage = () => {
  return (
    <Layout.VStack gap="lg">
      <Title title="대시보드" />

      {/* 요약 카드 */}
      <Layout.HStack gap="md">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.title} className="flex-1 rounded-lg border border-slate-200 p-4">
            <Typography.Text variant="caption" color="secondary">
              {card.title}
            </Typography.Text>
            <Layout.HStack align="center" gap="sm">
              <Typography.Title level={2}>{card.value}</Typography.Title>
              <StatusIndicator variant={card.status} />
            </Layout.HStack>
          </div>
        ))}
      </Layout.HStack>

      {/* 사용량 */}
      <Layout.VStack gap="md">
        <Typography.Title level={3}>리소스 사용량</Typography.Title>
        {USAGE_ITEMS.map((item) => (
          <div key={item.label}>
            <Layout.HStack justify="between" style={{ marginBottom: 4 }}>
              <Typography.Text>{item.label}</Typography.Text>
              <Typography.Text variant="detail" color="secondary">
                {item.value} / {item.max}
              </Typography.Text>
            </Layout.HStack>
            <ProgressBar
              value={item.value}
              max={item.max}
              variant={item.value / item.max > 0.8 ? 'error' : 'success'}
              showValue="percentage"
            />
          </div>
        ))}
      </Layout.VStack>
    </Layout.VStack>
  );
};

export default MockDashboardPage;
```
