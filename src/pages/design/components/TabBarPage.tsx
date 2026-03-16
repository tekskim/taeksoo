import { useRef } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { TabBar, useTabBar, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function TabBarPreview() {
  const { tabs, activeTab, selectTab, closeTab, addTab } = useTabBar({
    initialTabs: [
      { id: 'tab-1', label: 'Entry page', closable: true },
      { id: 'tab-2', label: 'Settings', closable: true },
      { id: 'tab-3', label: 'Profile', closable: true },
    ],
    initialActiveTab: 'tab-1',
  });

  return (
    <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden w-full">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={addTab}
        showWindowControls={false}
      />
      <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-body-md">
        Content for: {tabs.find((t) => t.id === activeTab)?.label || 'No tab selected'}
      </div>
    </div>
  );
}

function TabBarDemo() {
  const tabCounterRef = useRef(4);

  const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
    initialTabs: [
      { id: 'tab-1', label: 'Entry page', closable: true },
      { id: 'tab-2', label: 'Settings', closable: true },
      { id: 'tab-3', label: 'Profile', closable: true },
    ],
    initialActiveTab: 'tab-1',
  });

  const manyTabsDemo = useTabBar({
    initialTabs: [
      { id: 'many-1', label: 'Dashboard', closable: true },
      { id: 'many-2', label: 'Instance templates', closable: true },
      { id: 'many-3', label: 'Virtual machines', closable: true },
      { id: 'many-4', label: 'Storage volumes', closable: true },
      { id: 'many-5', label: 'Network settings', closable: true },
      { id: 'many-6', label: 'Security groups', closable: true },
      { id: 'many-7', label: 'Load balancers', closable: true },
      { id: 'many-8', label: 'Monitoring', closable: true },
    ],
    initialActiveTab: 'many-1',
  });

  const handleAddTab = () => {
    const counter = tabCounterRef.current;
    addTab({
      id: `tab-${counter}-${Date.now()}`,
      label: `New tab ${counter}`,
      closable: true,
    });
    tabCounterRef.current++;
  };

  const handleAddManyTab = () => {
    const counter = manyTabsDemo.tabs.length + 1;
    manyTabsDemo.addTab({
      id: `many-${counter}-${Date.now()}`,
      label: `New tab ${counter}`,
      closable: true,
    });
  };

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <VStack gap={1}>
          <Label>Interactive Demo (3 tabs)</Label>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            탭 클릭으로 전환, × 클릭으로 닫기, + 클릭으로 새 탭 추가. 기본 탭(Entry page)은 닫을 수
            없음.
          </span>
        </VStack>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={handleAddTab}
          />
          <div className="h-[120px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-body-md">
            Content for: {tabs.find((t) => t.id === activeTab)?.label || 'No tab selected'}
          </div>
        </div>
      </VStack>

      <VStack gap={3}>
        <VStack gap={1}>
          <Label>Many Tabs (8 tabs — 비율 축소)</Label>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            탭 수가 증가하면 모든 탭이 화면에 표시될 수 있도록 너비가 비율적으로 축소된다. 가로
            스크롤은 발생하지 않는다.
          </span>
        </VStack>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
          <TabBar
            tabs={manyTabsDemo.tabs}
            activeTab={manyTabsDemo.activeTab}
            onTabChange={manyTabsDemo.selectTab}
            onTabClose={manyTabsDemo.closeTab}
            onTabAdd={handleAddManyTab}
            showAddButton={true}
          />
          <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-body-md">
            탭이 많아지면 모든 탭이 화면에 보이도록 너비가 비율적으로 줄어듭니다.
          </div>
        </div>
      </VStack>
    </VStack>
  );
}

function TabBarGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[탭 영역 (a)] ···  [+ 버튼 (b)]   [— □ × (c)]`}</pre>
        </div>

        <SubSectionTitle>1. 탭 (Tab Item)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 탭 레이블</Td>
              <Td>페이지 타이틀 또는 리소스 이름 표시. 너비 초과 시 말줄임(truncate) 처리</Td>
            </tr>
            <tr>
              <Td>b. 닫기 버튼 (×)</Td>
              <Td>탭 닫기.</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. 탭 추가 버튼 (+)</SubSectionTitle>
        <Prose>
          <p>탭 목록 우측에 위치. 클릭 시 새 탭 추가.</p>
        </Prose>

        <SubSectionTitle>3. 윈도우 컨트롤 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>최소화 (—)</Td>
              <Td>현재 윈도우 최소화</Td>
            </tr>
            <tr>
              <Td>최대화 (□)</Td>
              <Td>현재 윈도우 최대화</Td>
            </tr>
            <tr>
              <Td>닫기 (×)</Td>
              <Td>현재 윈도우 닫기</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <span className="font-mono">height</span>
              </Td>
              <Td>36px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">max-width</span> (탭)
              </Td>
              <Td>160px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">padding-x</span>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">font-size</span>
              </Td>
              <Td>12px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>비활성 탭. 배경색 미강조</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active / Selected</strong>
              </Td>
              <Td>현재 선택된 탭. 하단 강조선 또는 배경 강조로 구분</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스 오버 시 시각적 피드백 제공</Td>
            </tr>
            <tr>
              <Td>
                <strong>Focus</strong>
              </Td>
              <Td>키보드 포커스 상태. 접근성 대응을 위한 포커스 링 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Dragging</strong>
              </Td>
              <Td>드래그 앤 드롭으로 탭 순서 변경 중인 상태</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>탭 너비 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>탭의 최대 너비는 160px이다.</li>
              <li>
                탭 수가 증가하면 모든 탭이 화면에 표시될 수 있도록 탭 너비가 비율적으로 축소된다.
              </li>
              <li>탭이 축소되더라도 가로 스크롤은 발생하지 않는다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>탭 추가 / 닫기</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-mono">+</span> 버튼 클릭 시 새 탭이 추가된다.
              </li>
              <li>
                <span className="font-mono">×</span> 버튼 클릭 시 해당 탭이 닫힌다.
              </li>
              <li>활성 탭을 닫으면 인접한 탭이 자동으로 활성화된다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>탭 순서 변경</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>드래그 앤 드롭으로 탭 순서를 변경할 수 있다.</li>
              <li>드래그 중인 탭은 시각적으로 구분되어 표시된다 (Dragging 상태).</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>탭 레이블 처리</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>탭 레이블이 현재 탭 너비를 초과하면 말줄임(…) 처리한다.</li>
              <li>말줄임된 레이블은 hover 시 툴팁으로 전체 이름을 표시한다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '탭 레이블은 해당 페이지 또는 리소스의 이름을 그대로 사용한다.',
            '항상 활성(selected) 탭이 하나 이상 존재하도록 한다.',
            '기본 탭(닫을 수 없는 탭)은 항상 첫 번째 위치에 고정한다.',
          ]}
          dontItems={[
            '탭 레이블에 "페이지", "탭" 등 불필요한 단어를 포함하지 않는다.',
            '탭 바를 콘텐츠 영역 내 뷰 전환 용도(Tabs 컴포넌트의 역할)로 혼용하지 않는다.',
            '탭이 한 개인 경우에도 탭 바를 숨기거나 제거하지 않는다. 일관된 레이아웃을 유지한다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>탭 레이블은 페이지 타이틀 또는 리소스 이름을 그대로 사용한다.</li>
            <li>
              레이블은 가능한 간결하게 작성하되, 사용자가 탭의 내용을 즉시 식별할 수 있어야 한다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function TabBarPage() {
  return (
    <ComponentPageTemplate
      title="Tab Bar"
      description="브라우저 스타일의 탭바로, 여러 페이지 또는 리소스를 동시에 열어 작업할 수 있는 멀티 탭 인터페이스다."
      whenToUse={[
        '사용자가 여러 페이지 또는 리소스를 동시에 열어두고 전환해야 할 때',
        '브라우저와 유사한 멀티 탭 탐색 경험이 필요한 앱 내 환경을 구현할 때',
      ]}
      whenNotToUse={['단일 콘텐츠 영역 내에서 뷰를 전환하는 용도라면 Tabs 컴포넌트를 사용한다.']}
      preview={
        <ComponentPreview
          code={`const { tabs, activeTab, selectTab, closeTab, addTab } = useTabBar({
  initialTabs: [{ id: '1', label: 'Entry page', closable: true }, ...],
  initialActiveTab: '1',
});
<TabBar tabs={tabs} activeTab={activeTab} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={addTab} />`}
        >
          <TabBarPreview />
        </ComponentPreview>
      }
      examples={<TabBarDemo />}
      guidelines={<TabBarGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <span className="font-mono">height</span>
              </Td>
              <Td>36px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">max-width</span> (탭)
              </Td>
              <Td>160px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">padding-x</span>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">font-size</span>
              </Td>
              <Td>12px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      relatedLinks={[
        {
          label: 'Top Navigation Bar',
          path: '/design/components/topbar',
          description: '상단 네비게이션 바',
        },
        {
          label: 'Tabs',
          path: '/design/components/tabs',
          description: '콘텐츠 영역 내 뷰 전환용 탭',
        },
        {
          label: 'Page Shell',
          path: '/design/patterns/layout',
          description: '페이지 레이아웃 구조',
        },
      ]}
    />
  );
}
