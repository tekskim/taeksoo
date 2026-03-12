import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './PageShell';
import { PageHeader } from '../PageHeader/PageHeader';
import { EmptyState } from '../EmptyState/EmptyState';
import { Table, type TableColumn } from '../Table/Table';
import { ListToolbar } from '../ListToolbar/ListToolbar';
import { Pagination } from '../Pagination/Pagination';
import { Button } from '../Button/Button';
import { SearchInput } from '../Input/SearchInput';
import { StatusIndicator } from '../StatusIndicator/StatusIndicator';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { DetailHeader } from '../DetailHeader/DetailHeader';
import { SectionCard } from '../SectionCard/SectionCard';
import { MetricCard } from '../MetricCard/MetricCard';
import { VStack } from '../../layouts';
import { TabBar } from '../TabBar';
import { TopBar } from '../TopBar';
import { Breadcrumb } from '../Breadcrumb';
import { SNBMenuItem } from '../SNBMenuItem';
import { ContextMenu } from '../ContextMenu';
import {
  IconPlus,
  IconTrash,
  IconDownload,
  IconDatabase,
  IconBox,
  IconNetwork,
  IconShield,
  IconSettings,
  IconServer,
  IconEdit,
  IconPlayerPlay,
  IconPlayerStop,
  IconChevronDown,
  IconTerminal2,
} from '@tabler/icons-react';

/* ===========================
   Page Pattern Stories
   ===========================

   TDS 페이지 패턴의 표준 구현 예시.
   새로운 페이지를 생성할 때 이 패턴을 참고하세요.
*/

const meta: Meta = {
  title: 'Patterns/Page Patterns',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## TDS 페이지 패턴 가이드

모든 CRUD 페이지는 아래 패턴 중 하나를 따릅니다.

### 패턴 목록
1. **List Page** — 리소스 목록 (Table + Toolbar + Pagination)
2. **Detail Page** — 리소스 상세 (DetailHeader + SectionCard)
3. **Empty State Page** — 데이터 없음 상태
4. **Dashboard Page** — 메트릭/차트 대시보드

### 공통 레이아웃 구성
- **PageShell**: 전체 레이아웃 래퍼
- **SNBMenuItem**: 좁은 사이드바 네비게이션
- **TabBar**: 브라우저 스타일 탭바
- **TopBar** + **Breadcrumb**: 상단 네비게이션
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/* ----------------------------------------
   Shared: Mock Sidebar (SNBMenuItem 기반)
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
    { id: 'instances', icon: <IconServer size={22} stroke={1.5} />, label: 'Instances' },
    { id: 'volumes', icon: <IconDatabase size={22} stroke={1.5} />, label: 'Volumes' },
    { id: 'networks', icon: <IconNetwork size={22} stroke={1.5} />, label: 'Networks' },
    { id: 'security', icon: <IconShield size={22} stroke={1.5} />, label: 'Security Groups' },
    { id: 'dns', icon: <IconBox size={22} stroke={1.5} />, label: 'DNS Zones' },
    { id: 'settings', icon: <IconSettings size={22} stroke={1.5} />, label: 'Settings' },
  ];

  return (
    <div
      className="fixed top-0 bottom-0 left-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col z-10"
      style={{ width: isOpen ? 240 : 40 }}
    >
      {/* Icon sidebar (always 40px) */}
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

      {/* Expanded menu */}
      {isOpen && (
        <div className="absolute left-[40px] top-0 bottom-0 w-[200px] border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] pt-[var(--primitive-spacing-4)] px-[var(--primitive-spacing-2)]">
          <p className="text-heading-h7 text-[var(--color-text-muted)] uppercase px-[var(--primitive-spacing-2)] mb-[var(--primitive-spacing-2)]">
            Resources
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
   Shared: Shell wrapper with real components
   ---------------------------------------- */

function ShellWrapper({
  children,
  breadcrumbItems,
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onTabAdd,
}: {
  children: React.ReactNode;
  breadcrumbItems: { label: string; href?: string }[];
  tabs?: { id: string; label: string; closable: boolean }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
  onTabAdd?: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(
    breadcrumbItems[breadcrumbItems.length - 1]?.label.toLowerCase().replace(/\s+/g, '') ||
      'instances'
  );
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const defaultTabs = tabs || [
    {
      id: 'main',
      label: breadcrumbItems[breadcrumbItems.length - 1]?.label || 'Tab',
      closable: false,
    },
  ];
  const defaultActiveTab = activeTab || defaultTabs[0].id;

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
          tabs={defaultTabs}
          activeTab={defaultActiveTab}
          onTabChange={onTabChange || (() => {})}
          onTabClose={onTabClose}
          onTabAdd={onTabAdd}
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
    >
      {children}
    </PageShell>
  );
}

/* ----------------------------------------
   Pattern 1: List Page
   ---------------------------------------- */

interface ListItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  type: string;
  region: string;
  createdAt: string;
}

const listData: ListItem[] = [
  {
    id: '1',
    name: 'web-server-01',
    status: 'active',
    type: 'Medium',
    region: 'us-east-1',
    createdAt: 'Jan 10, 2026 01:17:01',
  },
  {
    id: '2',
    name: 'db-server-01',
    status: 'active',
    type: 'Large',
    region: 'us-east-1',
    createdAt: 'Jan 9, 2026 18:04:44',
  },
  {
    id: '3',
    name: 'cache-01',
    status: 'building',
    type: 'Small',
    region: 'eu-west-1',
    createdAt: 'Jan 10, 2026 01:17:01',
  },
  {
    id: '4',
    name: 'worker-01',
    status: 'error',
    type: 'XLarge',
    region: 'ap-northeast-1',
    createdAt: 'Jan 8, 2026 11:51:27',
  },
  {
    id: '5',
    name: 'api-gateway',
    status: 'active',
    type: 'Medium',
    region: 'us-east-1',
    createdAt: 'Jan 7, 2026 04:38:10',
  },
];

const listColumns: TableColumn<ListItem>[] = [
  {
    key: 'status',
    label: 'Status',
    width: 60,
    align: 'center' as const,
    render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 2,
    minWidth: 120,
    sortable: true,
    render: (value: string) => (
      <span className="text-label-lg text-[var(--color-action-primary)] hover:underline cursor-pointer">
        {value}
      </span>
    ),
  },
  { key: 'type', label: 'Type', flex: 1, minWidth: 80, sortable: true },
  { key: 'region', label: 'Region', flex: 1, minWidth: 100 },
  {
    key: 'createdAt',
    label: 'Created at',
    flex: 1,
    minWidth: 100,
    align: 'right' as const,
    sortable: true,
    render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
  },
];

function ListPageExample() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  return (
    <ShellWrapper breadcrumbItems={[{ label: 'Proj-1', href: '#' }, { label: 'Instances' }]}>
      <VStack gap={3}>
        <PageHeader
          title="Instances"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Instance
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput placeholder="Search by name" size="sm" className="w-[240px]" />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Start
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerStop size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Stop
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          totalItems={listData.length}
          selectedCount={selectedRows.length}
        />

        <Table<ListItem>
          columns={listColumns}
          data={listData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No instances found"
        />
      </VStack>
    </ShellWrapper>
  );
}

export const ListPage: Story = {
  render: () => <ListPageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**List Page 패턴** — 가장 일반적인 CRUD 리스트 페이지.

구성요소 순서:
1. \`PageHeader\` — 제목 + Create 버튼
2. \`ListToolbar\` — 검색 + 필터 + 벌크 액션
3. \`Pagination\` — 페이지네이션 + 설정
4. \`Table\` — 데이터 테이블 (선택 가능)
        `,
      },
    },
  },
};

/* ----------------------------------------
   Pattern 2: Detail Page
   ---------------------------------------- */

function DetailPageExample() {
  const [activeTab, setActiveTab] = useState('overview');

  const moreActions = [
    { id: 'edit', label: 'Edit', onClick: () => {} },
    { id: 'resize', label: 'Resize', onClick: () => {} },
    { id: 'snapshot', label: 'Create Snapshot', onClick: () => {}, divider: true },
    { id: 'delete', label: 'Delete', status: 'danger' as const, onClick: () => {} },
  ];

  return (
    <ShellWrapper
      breadcrumbItems={[
        { label: 'Proj-1', href: '#' },
        { label: 'Instances', href: '#' },
        { label: 'web-server-01' },
      ]}
      tabs={[
        { id: 'instances', label: 'Instances', closable: false },
        { id: 'web-server', label: 'web-server-01', closable: true },
      ]}
      activeTab="web-server"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>web-server-01</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTerminal2 size={12} stroke={1.5} />}
            >
              Console
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
            >
              Start
            </Button>
            <ContextMenu items={moreActions} trigger="click">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" status="active" value="" />
            <DetailHeader.InfoCard label="ID" value="inst-a1b2c3d4" copyable />
            <DetailHeader.InfoCard label="Flavor" value="Medium (4 vCPU, 8GB)" />
            <DetailHeader.InfoCard label="Created at" value="Jan 10, 2026 14:30" />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="network">Network</Tab>
            <Tab value="storage">Storage</Tab>
            <Tab value="monitoring">Monitoring</Tab>
          </TabList>

          <TabPanel value="overview" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard>
                <SectionCard.Header
                  title="Basic Information"
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} stroke={1.5} />}
                    >
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value="web-server-01" />
                  <SectionCard.DataRow label="Image" value="Ubuntu 22.04 LTS" />
                  <SectionCard.DataRow label="Flavor" value="Medium (4 vCPU, 8GB RAM)" />
                  <SectionCard.DataRow label="Region" value="us-east-1" />
                  <SectionCard.DataRow label="Key Pair" value="my-keypair" />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Network" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Fixed IP" value="10.20.30.40" />
                  <SectionCard.DataRow label="Floating IP" value="203.0.113.10" />
                  <SectionCard.DataRow label="Security Group" value="default" isLink linkHref="#" />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="network" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Network Interfaces" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Network"
                    value="default-network"
                    isLink
                    linkHref="#"
                  />
                  <SectionCard.DataRow label="Subnet" value="10.20.30.0/24" />
                  <SectionCard.DataRow label="MAC Address" value="fa:16:3e:aa:bb:cc" />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </ShellWrapper>
  );
}

export const DetailPage: Story = {
  render: () => <DetailPageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**Detail Page 패턴** — 리소스 상세 정보 페이지.

구성요소 순서:
1. \`DetailHeader\` — 제목 + 액션 버튼 + InfoGrid
2. \`Tabs\` (underline) — 섹션별 탭 네비게이션
3. \`SectionCard\` — 정보 그룹 (Header + DataRow)
        `,
      },
    },
  },
};

/* ----------------------------------------
   Pattern 3: Empty State Page
   ---------------------------------------- */

function EmptyStatePageExample() {
  return (
    <ShellWrapper breadcrumbItems={[{ label: 'Proj-1', href: '#' }, { label: 'DNS Zones' }]}>
      <VStack gap={3}>
        <PageHeader
          title="DNS Zones"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Zone
            </Button>
          }
        />

        <EmptyState
          icon={<IconDatabase size={48} stroke={1} />}
          title="No DNS zones found"
          description="Create your first DNS zone to manage domain records."
          action={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
              Create Zone
            </Button>
          }
        />
      </VStack>
    </ShellWrapper>
  );
}

export const EmptyStatePage: Story = {
  render: () => <EmptyStatePageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**Empty State 패턴** — 데이터가 없을 때의 페이지.

구성요소:
1. \`PageHeader\` — 제목 + Create 버튼
2. \`EmptyState\` — 아이콘 + 제목 + 설명 + 액션 버튼

\`EmptyState\`의 \`variant\`는 \`card\`(기본값)와 \`inline\` 중 선택 가능.
        `,
      },
    },
  },
};

/* ----------------------------------------
   Pattern 4: Dashboard Page
   ---------------------------------------- */

function DashboardPageExample() {
  return (
    <ShellWrapper breadcrumbItems={[{ label: 'Proj-1', href: '#' }, { label: 'Dashboard' }]}>
      <VStack gap={4}>
        <PageHeader title="Dashboard" />

        <MetricCard.Group>
          <MetricCard
            title="Total Instances"
            value={24}
            tooltip="Total number of compute instances."
          />
          <MetricCard title="Running" value={18} tooltip="Currently running instances." />
          <MetricCard title="Stopped" value={4} tooltip="Stopped instances." />
          <MetricCard title="Errors" value={2} tooltip="Instances with errors." />
        </MetricCard.Group>

        <SectionCard>
          <SectionCard.Header
            title="Recent Activity"
            actions={
              <Button variant="ghost" size="sm">
                View All
              </Button>
            }
          />
          <SectionCard.Content>
            <SectionCard.DataRow
              label="web-server-01"
              value={<StatusIndicator status="active" label="Started" />}
            />
            <SectionCard.DataRow
              label="db-server-02"
              value={<StatusIndicator status="error" label="Failed" />}
            />
            <SectionCard.DataRow
              label="worker-03"
              value={<StatusIndicator status="building" label="Building" />}
            />
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Resource Usage" />
          <SectionCard.Content>
            <SectionCard.DataRow label="vCPUs Used" value="48 / 128" />
            <SectionCard.DataRow label="Memory Used" value="96 GB / 256 GB" />
            <SectionCard.DataRow label="Storage Used" value="1.2 TB / 5 TB" />
            <SectionCard.DataRow label="Floating IPs" value="6 / 20" />
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </ShellWrapper>
  );
}

export const DashboardPage: Story = {
  render: () => <DashboardPageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**Dashboard 패턴** — 개요/대시보드 페이지.

구성요소:
1. \`PageHeader\` — 제목
2. \`MetricCard.Group\` — 주요 메트릭 카드
3. \`SectionCard\` — 최근 활동, 리소스 사용량 등
        `,
      },
    },
  },
};
