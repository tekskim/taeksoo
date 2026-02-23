import { useRef } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { TabBar, useTabBar, VStack } from '@/design-system';

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
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design tokens</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 36px</code> · <code>max-width: 160px</code> · <code>padding-x: 12px</code> ·{' '}
          <code>font: 12px</code>
        </div>
      </VStack>

      {/* Features */}
      <VStack gap={3}>
        <Label>Features</Label>
        <ul className="list-disc list-outside pl-4 space-y-1 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          <li>탭 최대 너비 160px, 긴 타이틀은 truncate 처리</li>
          <li>탭이 많아지면 비율적으로 너비가 줄어듦 (스크롤 없음)</li>
          <li>탭 추가/닫기 기능</li>
          <li>윈도우 컨트롤 (최소화/최대화/닫기)</li>
        </ul>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive Demo (3 tabs)</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={handleAddTab}
          />
          <div className="h-[120px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-[length:var(--font-size-12)]">
            Content for: {tabs.find((t) => t.id === activeTab)?.label || 'No tab selected'}
          </div>
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click tabs to switch, click × to close, click + to add new tabs
        </p>
      </VStack>

      {/* Many Tabs Demo */}
      <VStack gap={3}>
        <Label>Many Tabs Demo (8 tabs - 비율 축소)</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={manyTabsDemo.tabs}
            activeTab={manyTabsDemo.activeTab}
            onTabChange={manyTabsDemo.selectTab}
            onTabClose={manyTabsDemo.closeTab}
            onTabAdd={handleAddManyTab}
            showAddButton={true}
          />
          <div className="h-[80px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-[length:var(--font-size-12)]">
            탭이 많아지면 모든 탭이 화면에 보이도록 너비가 비율적으로 줄어듭니다.
          </div>
        </div>
      </VStack>
    </VStack>
  );
}

export function TabBarPage() {
  return (
    <ComponentPageTemplate
      title="TabBar"
      description="Browser-style tabs with responsive width (max 160px, auto-shrink when overflow)"
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar', description: 'Application header' },
        { label: 'Tabs', path: '/design/components/tabs', description: 'Content tabs' },
        { label: 'PageShell', path: '/design/patterns/layout', description: 'Page layout' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  브라우저 스타일의 탭으로 여러 페이지/리소스를 동시에 열어 작업할 수 있습니다.
                </li>
                <li>
                  <strong>탭 너비</strong>: 최대 160px, 탭 수 증가 시 자동으로 축소됩니다.
                </li>
                <li>
                  <strong>탭 추가</strong>: + 버튼으로 새 탭 추가. 기본 탭(Home 등)은 닫을 수
                  없습니다 (<code>closable: false</code>).
                </li>
                <li>
                  <strong>탭 정렬</strong>: 드래그 앤 드롭으로 탭 순서를 변경할 수 있습니다.
                </li>
                <li>
                  <strong>탭 이름</strong>: 페이지 타이틀 또는 리소스 이름을 표시합니다. 긴 이름은
                  말줄임 처리.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>

        {/* Demo */}
        <TabBarDemo />
      </VStack>
    </ComponentPageTemplate>
  );
}
