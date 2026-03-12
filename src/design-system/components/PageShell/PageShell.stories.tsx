import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './PageShell';
import { TabBar } from '../TabBar';
import { TopBar } from '../TopBar';
import { Breadcrumb } from '../Breadcrumb';
import { SNBMenuItem } from '../SNBMenuItem';
import { PageHeader } from '../PageHeader';
import { VStack } from '../../layouts/Stack';
import { Button } from '../Button';
import { Table } from '../Table';
import { Badge } from '../Badge';
import { StatusIndicator } from '../StatusIndicator';
import {
  IconPlus,
  IconBox,
  IconRocket,
  IconNetwork,
  IconShield,
  IconDatabase,
  IconSettings,
  IconDownload,
} from '@tabler/icons-react';

const meta: Meta<typeof PageShell> = {
  title: 'Layout/PageShell',
  component: PageShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## PageShell 컴포넌트

페이지 셸 레이아웃 컴포넌트. **Sidebar + TabBar + TopBar + Content** 영역을 래핑합니다.

모든 페이지에서 반복되는 \`fixed inset-0\` + Sidebar + main 구조를 추상화합니다.
사이드바 상태는 페이지에서 관리하고, \`sidebarWidth\`를 계산하여 전달합니다.

### 구성 요소
- **Sidebar**: SNBMenuItem 기반의 좁은 사이드 네비게이션 (40px icon / 240px expanded)
- **TabBar**: 브라우저 스타일 탭바 (탭 추가/닫기/드래그)
- **TopBar**: 사이드바 토글 + 네비게이션 + Breadcrumb + Actions
- **Content**: 페이지 본문 영역

### 사용 예시
\`\`\`tsx
const [sidebarOpen, setSidebarOpen] = useState(true);
const sidebarWidth = sidebarOpen ? 240 : 40;

<PageShell
  sidebar={<ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
  sidebarWidth={sidebarWidth}
  tabBar={<TabBar tabs={tabs} activeTab={activeTabId} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={addNewTab} onTabReorder={moveTab} />}
  topBar={<TopBar showSidebarToggle={!sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} breadcrumb={<Breadcrumb items={[...]} />} actions={<>...</>} />}
>
  <VStack gap={3}>
    <PageHeader title="Pods" actions={...} />
    <Table ... />
  </VStack>
</PageShell>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageShell>;

/* ----------------------------------------
   Mock Sidebar (SNBMenuItem 기반)
   ---------------------------------------- */

function MockSidebar({
  isOpen,
  onToggle,
  selectedMenu,
  onSelectMenu,
}: {
  isOpen: boolean;
  onToggle: () => void;
  selectedMenu: string;
  onSelectMenu: (menu: string) => void;
}) {
  const menuItems = [
    { id: 'pods', icon: <IconBox size={22} stroke={1.5} />, label: 'Pods' },
    { id: 'deployments', icon: <IconRocket size={22} stroke={1.5} />, label: 'Deployments' },
    { id: 'services', icon: <IconNetwork size={22} stroke={1.5} />, label: 'Services' },
    { id: 'security', icon: <IconShield size={22} stroke={1.5} />, label: 'Security' },
    { id: 'storage', icon: <IconDatabase size={22} stroke={1.5} />, label: 'Storage' },
    { id: 'settings', icon: <IconSettings size={22} stroke={1.5} />, label: 'Settings' },
  ];

  return (
    <div
      className="fixed top-0 bottom-0 left-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col z-10"
      style={{ width: isOpen ? 240 : 40 }}
    >
      {/* Icon sidebar (always visible, 40px) */}
      <div className="w-[40px] flex flex-col items-center pt-[var(--primitive-spacing-2)] gap-[var(--primitive-spacing-1)] shrink-0">
        {menuItems.map((item) => (
          <SNBMenuItem
            key={item.id}
            icon={item.icon}
            isSelected={selectedMenu === item.id}
            onClick={() => onSelectMenu(item.id)}
          />
        ))}
      </div>

      {/* Expanded menu (visible when open) */}
      {isOpen && (
        <div className="absolute left-[40px] top-0 bottom-0 w-[200px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] pt-[var(--primitive-spacing-4)] px-[var(--primitive-spacing-2)]">
          <p className="text-heading-h7 text-[var(--color-text-muted)] uppercase px-[var(--primitive-spacing-2)] mb-[var(--primitive-spacing-2)]">
            Workloads
          </p>
          <nav className="flex flex-col gap-[var(--primitive-spacing-0-5)]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={`text-left px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md rounded-[var(--primitive-radius-md)] transition-colors ${
                  selectedMenu === item.id
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-default)] font-medium'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPods = [
  {
    id: '1',
    name: 'nginx-deployment-7fb96',
    namespace: 'default',
    status: 'active' as const,
    restarts: 0,
    age: '2d 14h',
  },
  {
    id: '2',
    name: 'redis-master-0',
    namespace: 'default',
    status: 'active' as const,
    restarts: 1,
    age: '5d 3h',
  },
  {
    id: '3',
    name: 'api-server-6b8c4',
    namespace: 'production',
    status: 'building' as const,
    restarts: 0,
    age: '1h 23m',
  },
  {
    id: '4',
    name: 'worker-job-x9k2l',
    namespace: 'batch',
    status: 'error' as const,
    restarts: 5,
    age: '12h',
  },
  {
    id: '5',
    name: 'frontend-app-3d9f1',
    namespace: 'production',
    status: 'active' as const,
    restarts: 0,
    age: '3d 8h',
  },
];

const podColumns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'namespace', header: 'Namespace', sortable: true },
  {
    key: 'status',
    header: 'Status',
    align: 'center' as const,
    render: (row: (typeof mockPods)[0]) => (
      <StatusIndicator
        status={row.status}
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      />
    ),
  },
  { key: 'restarts', header: 'Restarts', align: 'right' as const },
  { key: 'age', header: 'Age', align: 'right' as const },
];

/* ----------------------------------------
   Default Story: 전체 레이아웃
   ---------------------------------------- */

function DefaultExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('pods');
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const [tabs, setTabs] = useState([
    { id: 'pods', label: 'Pods', closable: false },
    { id: 'nginx', label: 'nginx-deployment-7fb96', closable: true },
  ]);
  const [activeTab, setActiveTab] = useState('pods');

  const handleTabClose = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTab === tabId) setActiveTab(tabs[0].id);
  };

  const handleTabAdd = () => {
    const id = `tab-${Date.now()}`;
    setTabs((prev) => [...prev, { id, label: 'New Tab', closable: true }]);
    setActiveTab(id);
  };

  return (
    <PageShell
      sidebar={
        <MockSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onTabClose={handleTabClose}
          onTabAdd={handleTabAdd}
          showWindowControls={false}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb items={[{ label: 'default-cluster', href: '#' }, { label: 'Pods' }]} />
          }
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon={<IconDownload size={14} stroke={1.5} />}
              aria-label="Download"
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Pods"
          titleExtra={
            <Badge variant="info" size="sm">
              {mockPods.length}
            </Badge>
          }
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Pod
            </Button>
          }
        />

        <Table columns={podColumns} data={mockPods} rowKey="id" selectable />
      </VStack>
    </PageShell>
  );
}

export const Default: Story = {
  render: () => <DefaultExample />,
};

/* ----------------------------------------
   Collapsed Sidebar Story
   ---------------------------------------- */

function CollapsedSidebarExample() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('pods');
  const sidebarWidth = sidebarOpen ? 240 : 40;

  return (
    <PageShell
      sidebar={
        <MockSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={[{ id: 'pods', label: 'Pods', closable: false }]}
          activeTab="pods"
          onTabChange={() => {}}
          showWindowControls={false}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb items={[{ label: 'default-cluster', href: '#' }, { label: 'Pods' }]} />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Pods"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Pod
            </Button>
          }
        />

        <Table columns={podColumns} data={mockPods} rowKey="id" selectable />
      </VStack>
    </PageShell>
  );
}

export const CollapsedSidebar: Story = {
  render: () => <CollapsedSidebarExample />,
  parameters: {
    docs: {
      description: {
        story: '사이드바가 접힌 상태 (40px). TopBar의 사이드바 토글 버튼이 표시됩니다.',
      },
    },
  },
};

/* ----------------------------------------
   Without TabBar Story
   ---------------------------------------- */

function WithoutTabBarExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('pods');
  const sidebarWidth = sidebarOpen ? 240 : 40;

  return (
    <PageShell
      sidebar={
        <MockSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
        />
      }
      sidebarWidth={sidebarWidth}
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => {}}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb items={[{ label: 'default-cluster', href: '#' }, { label: 'Services' }]} />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Services"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Service
            </Button>
          }
        />
        <p className="text-body-md text-[var(--color-text-muted)]">
          TabBar 없이 TopBar와 콘텐츠만 표시하는 레이아웃입니다.
        </p>
      </VStack>
    </PageShell>
  );
}

export const WithoutTabBar: Story = {
  render: () => <WithoutTabBarExample />,
  parameters: {
    docs: {
      description: {
        story: 'TabBar를 사용하지 않는 경우. TopBar + Content만 표시됩니다.',
      },
    },
  },
};
