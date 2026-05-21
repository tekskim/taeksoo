import { useRef } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { TabBar, useTabBar, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={`p-3 border-t border-r last:border-r-0 border-[var(--color-border-subtle)] align-top ${className}`}
    >
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
    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden w-full">
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

  const rapidCloseDemo = useTabBar({
    initialTabs: [
      { id: 'rc-1', label: 'Dashboard', closable: true },
      { id: 'rc-2', label: 'Instances', closable: true },
      { id: 'rc-3', label: 'Volumes', closable: true },
      { id: 'rc-4', label: 'Networks', closable: true },
      { id: 'rc-5', label: 'Security', closable: true },
      { id: 'rc-6', label: 'Monitoring', closable: true },
    ],
    initialActiveTab: 'rc-1',
  });

  const focusDemo = useTabBar({
    initialTabs: [
      { id: 'focus-1', label: 'Dashboard', closable: true },
      { id: 'focus-2', label: 'Instances', closable: true },
      { id: 'focus-3', label: 'Volumes', closable: true },
    ],
    initialActiveTab: 'focus-1',
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

  const handleResetRapidClose = () => {
    rapidCloseDemo.setTabs([
      { id: `rc-1-${Date.now()}`, label: 'Dashboard', closable: true },
      { id: `rc-2-${Date.now()}`, label: 'Instances', closable: true },
      { id: `rc-3-${Date.now()}`, label: 'Volumes', closable: true },
      { id: `rc-4-${Date.now()}`, label: 'Networks', closable: true },
      { id: `rc-5-${Date.now()}`, label: 'Security', closable: true },
      { id: `rc-6-${Date.now()}`, label: 'Monitoring', closable: true },
    ]);
  };

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <VStack gap={1}>
          <Label>Interactive Demo (3 tabs)</Label>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            탭 클릭으로 전환, × 클릭으로 닫기, + 클릭으로 새 탭 추가.
          </span>
        </VStack>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
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
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
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

      <VStack gap={3}>
        <VStack gap={1}>
          <Label>Chrome-style Rapid Tab Closing</Label>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            × 버튼을 연속 클릭하여 여러 탭을 빠르게 닫을 수 있다. 닫기 버튼이 같은 위치에 유지되므로
            마우스를 움직이지 않아도 된다. 마우스를 탭 영역 밖으로 이동하면 탭 너비가 부드럽게
            복원된다.
          </span>
        </VStack>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
          <TabBar
            tabs={rapidCloseDemo.tabs}
            activeTab={rapidCloseDemo.activeTab}
            onTabChange={rapidCloseDemo.selectTab}
            onTabClose={rapidCloseDemo.closeTab}
            showAddButton={false}
          />
          <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-body-md gap-2">
            {rapidCloseDemo.tabs.length <= 1 ? (
              <button
                type="button"
                onClick={handleResetRapidClose}
                className="text-[var(--color-action-primary)] hover:underline cursor-pointer"
              >
                탭 초기화
              </button>
            ) : (
              <>× 버튼을 연속으로 클릭해보세요. 마우스를 움직이지 않아도 됩니다.</>
            )}
          </div>
        </div>
      </VStack>

      <VStack gap={3}>
        <VStack gap={1}>
          <Label>Focus State (Keyboard Navigation)</Label>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Tab 키로 탭 간 이동 시 focus ring이 표시된다. 아래 TabBar를 클릭한 뒤 Tab / Shift+Tab
            키로 탭을 이동해보세요. Enter 또는 Space 키로 탭을 활성화할 수 있다.
          </span>
        </VStack>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
          <TabBar
            tabs={focusDemo.tabs}
            activeTab={focusDemo.activeTab}
            onTabChange={focusDemo.selectTab}
            onTabClose={focusDemo.closeTab}
            showAddButton={false}
          />
          <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-body-md">
            Active: {focusDemo.tabs.find((t) => t.id === focusDemo.activeTab)?.label || '—'}
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
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
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
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>height</Td>
              <Td>
                <code className="text-body-sm">--tabbar-height</code>
              </Td>
              <Td>36px</Td>
            </tr>
            <tr>
              <Td>max-width (탭)</Td>
              <Td>
                <code className="text-body-sm">--tabbar-tab-max-width</code>
              </Td>
              <Td>160px</Td>
            </tr>
            <tr>
              <Td>padding-left</Td>
              <Td>
                <code className="text-body-sm">--tabbar-tab-padding-x</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>padding-right</Td>
              <Td>
                <code className="text-body-sm">--tabbar-tab-padding-r</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>gap (label ↔ close)</Td>
              <Td>
                <code className="text-body-sm">--tabbar-tab-gap</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>close button size</Td>
              <Td>
                <code className="text-body-sm">--tabbar-close-size</code>
              </Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>font-size</Td>
              <Td>
                <code className="text-body-sm">--tabbar-font-size</code>
              </Td>
              <Td>12px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

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
            <tr>
              <Td>
                <strong>Opening</strong>
              </Td>
              <Td>새 탭이 추가될 때 width 0 → 160px로 펼쳐지는 애니메이션. 200ms ease-out</Td>
            </tr>
            <tr>
              <Td>
                <strong>Closing</strong>
              </Td>
              <Td>
                탭이 닫힐 때 현재 width → 0으로 수축하는 애니메이션. 200ms ease-in. 애니메이션 완료
                후 DOM에서 제거
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Closing Mode</strong>
              </Td>
              <Td>
                빠른 연속 닫기 중. 탭 너비가 고정되고 모든 닫기 버튼이 표시됨. 마우스가 탭 영역을
                벗어나면 해제
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

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
                + 버튼 클릭 시 새 탭이 추가되며, width 0에서 목표 너비까지{' '}
                <strong>200ms ease-out</strong> 트랜지션으로 펼쳐진다.
              </li>
              <li>
                × 버튼 클릭 시 해당 탭이 현재 너비에서 0까지 <strong>200ms ease-in</strong>{' '}
                트랜지션으로 수축한 뒤 DOM에서 제거된다. opacity는 100ms로 더 빠르게 사라져 텍스트가
                얇아지는 어색함을 방지한다.
              </li>
              <li>활성 탭을 닫으면 인접한 탭이 자동으로 활성화된다.</li>
              <li>애니메이션 중인 탭은 클릭 및 드래그가 비활성화된다.</li>
              <li>
                다음 상황에서는 애니메이션이 생략된다:
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    <strong>초기 로드 / 앱 전환</strong> — 기존 탭이 하나도 남아있지 않은 전체 탭
                    교체 시 (새 앱 진입, 페이지 새로고침 등)
                  </li>
                  <li>
                    <strong>마지막 탭 닫기</strong> — 탭이 1개일 때 닫으면 앱 종료/이동이 발생하므로
                    닫기 애니메이션 없이 즉시 처리
                  </li>
                </ul>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>빠른 연속 닫기 (Chrome-style)</SubSectionTitle>
          <Prose>
            <p>Chrome 브라우저와 동일한 빠른 연속 탭 닫기를 지원한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                탭의 × 버튼을 클릭하면 <strong>Closing Mode</strong>에 진입한다.
              </li>
              <li>
                Closing Mode에서는 각 탭의 너비가 현재 값으로 고정되어 닫기 버튼이 같은 X좌표에
                유지된다.
              </li>
              <li>
                다음 탭이 닫힌 탭 위치로 즉시 슬라이드하므로 마우스를 움직이지 않고 연속 클릭이
                가능하다.
              </li>
              <li>Closing Mode에서는 비활성 탭의 닫기 버튼도 항상 표시된다.</li>
              <li>
                마우스가 탭 영역을 벗어나면 Closing Mode가 해제되며, 탭 너비가 200ms 애니메이션으로
                부드럽게 복원된다.
              </li>
              <li>닫을 수 있는 탭이 1개 이하로 줄어도 자동으로 Closing Mode가 해제된다.</li>
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
              <li>
                말줄임된 레이블에 호버 시 DS Tooltip 스타일의 커스텀 툴팁이 200ms 후 표시된다
                (브라우저 네이티브 title 속성 대비 빠른 응답).
              </li>
              <li>텍스트가 잘리지 않은 탭에서는 툴팁이 표시되지 않는다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

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
        <VStack gap={6}>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">속성</Th>
                <Th className="w-[240px]">토큰</Th>
                <Th>값</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>height</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-height</code>
                </Td>
                <Td>36px</Td>
              </tr>
              <tr>
                <Td>tab max-width</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-tab-max-width</code>
                </Td>
                <Td>160px</Td>
              </tr>
              <tr>
                <Td>tab min-width</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-tab-min-width</code>
                </Td>
                <Td>100px</Td>
              </tr>
              <tr>
                <Td>padding-left</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-tab-padding-x</code>
                </Td>
                <Td>12px</Td>
              </tr>
              <tr>
                <Td>padding-right</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-tab-padding-r</code>
                </Td>
                <Td>8px</Td>
              </tr>
              <tr>
                <Td>gap</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-tab-gap</code>
                </Td>
                <Td>8px</Td>
              </tr>
              <tr>
                <Td>close button size</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-close-size</code>
                </Td>
                <Td>16px</Td>
              </tr>
              <tr>
                <Td>font-size</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-font-size</code>
                </Td>
                <Td>12px</Td>
              </tr>
              <tr>
                <Td>line-height</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-line-height</code>
                </Td>
                <Td>16px</Td>
              </tr>
              <tr>
                <Td>add button size</Td>
                <Td>
                  <code className="text-body-sm">--tabbar-add-size</code>
                </Td>
                <Td>28px</Td>
              </tr>
            </tbody>
          </TableWrapper>

          <SubSectionTitle>Tab Transitions</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">단계</Th>
                <Th className="w-[200px]">transition</Th>
                <Th>동작</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>탭 열기 (enter)</Td>
                <Td>width, padding, opacity 200ms ease-out</Td>
                <Td>width 0 → 160px로 좌→우 펼침. opacity는 150ms로 약간 빠르게 나타남</Td>
              </tr>
              <tr>
                <Td>탭 닫기 (leave)</Td>
                <Td>width, padding 200ms ease-in / opacity 100ms ease-in</Td>
                <Td>
                  현재 width → 0으로 수축. opacity가 먼저 사라진 뒤 너비가 줄어듦. 완료 후 DOM에서
                  제거
                </Td>
              </tr>
              <tr>
                <Td>빠른 닫기 모드 (closing)</Td>
                <Td>없음 (즉시)</Td>
                <Td>탭 너비 고정. 다음 탭이 닫힌 탭 위치로 즉시 이동하여 닫기 버튼 X좌표 유지</Td>
              </tr>
              <tr>
                <Td>마우스 이탈 (unlock)</Td>
                <Td>width 200ms</Td>
                <Td>고정 너비에서 원래 크기(160px 또는 축소 크기)로 부드럽게 복원</Td>
              </tr>
              <tr>
                <Td>평상시</Td>
                <Td>color만</Td>
                <Td>hover 시 배경색 전환 (150ms)</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
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
