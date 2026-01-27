import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar, useTabBar } from './TabBar';
import { IconHome, IconSettings, IconFile, IconFolder } from '@tabler/icons-react';

const meta: Meta<typeof TabBar> = {
  title: 'Components/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## TabBar 컴포넌트

브라우저 스타일의 탭 바 컴포넌트입니다.

### 특징
- 다중 탭 관리
- 탭 추가/닫기 기능
- 드래그 앤 드롭으로 탭 순서 변경
- 윈도우 컨트롤 (최소화, 최대화, 닫기)

### useTabBar 훅
탭 상태 관리를 위한 훅을 제공합니다.

\`\`\`tsx
const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
  initialTabs: [{ id: '1', label: 'Home' }],
  initialActiveTab: '1',
});
\`\`\`

### 사용 시기
- IDE/에디터 스타일의 탭 인터페이스
- 다중 문서/페이지 관리
- 브라우저 탭 시뮬레이션
        `,
      },
    },
  },
  argTypes: {
    showAddButton: {
      control: 'boolean',
      description: '탭 추가 버튼 표시',
      table: { defaultValue: { summary: 'true' } },
    },
    showWindowControls: {
      control: 'boolean',
      description: '윈도우 컨트롤 버튼 표시',
      table: { defaultValue: { summary: 'true' } },
    },
    showBottomBorder: {
      control: 'boolean',
      description: '하단 테두리 표시',
      table: { defaultValue: { summary: 'true' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabBar>;

// Default
export const Default: Story = {
  render: () => {
    const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
      initialTabs: [
        { id: '1', label: 'Overview', closable: false },
        { id: '2', label: 'Settings' },
        { id: '3', label: 'Documents' },
      ],
      initialActiveTab: '1',
    });

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={() => addTab()}
      />
    );
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => {
    const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
      initialTabs: [
        { id: '1', label: 'Home', icon: <IconHome size={14} />, closable: false },
        { id: '2', label: 'Settings', icon: <IconSettings size={14} /> },
        { id: '3', label: 'Files', icon: <IconFolder size={14} /> },
      ],
      initialActiveTab: '1',
    });

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={() =>
          addTab({ id: `new-${Date.now()}`, label: 'New Tab', icon: <IconFile size={14} /> })
        }
      />
    );
  },
};

// Without Window Controls
export const WithoutWindowControls: Story = {
  render: () => {
    const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
      initialTabs: [
        { id: '1', label: 'Tab 1' },
        { id: '2', label: 'Tab 2' },
      ],
      initialActiveTab: '1',
    });

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={() => addTab()}
        showWindowControls={false}
      />
    );
  },
};

// Without Add Button
export const WithoutAddButton: Story = {
  render: () => {
    const { tabs, activeTab, closeTab, selectTab } = useTabBar({
      initialTabs: [
        { id: '1', label: 'Fixed Tab 1', closable: false },
        { id: '2', label: 'Fixed Tab 2', closable: false },
        { id: '3', label: 'Fixed Tab 3', closable: false },
      ],
      initialActiveTab: '1',
    });

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        showAddButton={false}
        showWindowControls={false}
      />
    );
  },
};

// Single Tab
export const SingleTab: Story = {
  render: () => (
    <TabBar
      tabs={[{ id: '1', label: 'Main', closable: false }]}
      activeTab="1"
      onTabChange={() => {}}
      showAddButton={false}
    />
  ),
};

// Many Tabs
export const ManyTabs: Story = {
  render: () => {
    const { tabs, activeTab, closeTab, selectTab } = useTabBar({
      initialTabs: Array.from({ length: 8 }, (_, i) => ({
        id: String(i + 1),
        label: `Tab ${i + 1}`,
        closable: i > 0,
      })),
      initialActiveTab: '1',
    });

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={selectTab}
        onTabClose={closeTab}
        showAddButton={false}
      />
    );
  },
};
