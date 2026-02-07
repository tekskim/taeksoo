import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageShell } from './PageShell';
import { PageHeader } from '../PageHeader/PageHeader';
import { EmptyState } from '../EmptyState/EmptyState';
import { Table, type TableColumn } from '../Table/Table';
import { ListToolbar } from '../ListToolbar/ListToolbar';
import { Pagination } from '../Pagination/Pagination';
import { Button } from '../Button/Button';
import { SearchInput } from '../Input/SearchInput';
import { Badge } from '../Badge/Badge';
import { StatusIndicator } from '../StatusIndicator/StatusIndicator';
import { Tabs, TabList, Tab } from '../Tabs/Tabs';
import { DetailHeader } from '../DetailHeader/DetailHeader';
import { SectionCard } from '../SectionCard/SectionCard';
import { VStack } from '../../layouts';
import { IconPlus, IconTrash, IconDownload, IconDatabase } from '@tabler/icons-react';

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
TDS 페이지 패턴 가이드. 모든 CRUD 페이지는 아래 패턴 중 하나를 따릅니다.

## 패턴 목록
1. **List Page** — 리소스 목록 (Table + Toolbar + Pagination)
2. **Detail Page** — 리소스 상세 (DetailHeader + SectionCard)
3. **Empty State Page** — 데이터 없음 상태
4. **Dashboard Page** — 메트릭/차트 대시보드
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/* ----------------------------------------
   Mock Sidebar
   ---------------------------------------- */

function MockSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const width = isOpen ? 200 : 0;
  return (
    <div
      className="fixed top-0 bottom-0 left-0 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col pt-4 overflow-hidden"
      style={{ width: `${width}px` }}
    >
      <button
        onClick={onToggle}
        className="px-4 text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
      >
        {isOpen ? '← Close' : '→'}
      </button>
      {isOpen && (
        <nav className="mt-4 w-full px-2 flex flex-col gap-0.5">
          {['Instances', 'Volumes', 'Networks', 'Security Groups', 'DNS Zones'].map((item, i) => (
            <div
              key={item}
              className={`px-3 py-2 text-body-md rounded-[var(--primitive-radius-md)] ${i === 0 ? 'text-[var(--color-text-default)] bg-[var(--color-surface-hover)]' : 'text-[var(--color-text-muted)]'}`}
            >
              {item}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}

function MockTabBar() {
  return (
    <div className="h-8 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center px-4 gap-2">
      <span className="text-body-sm text-[var(--color-text-default)] bg-[var(--color-surface-default)] px-3 py-1 rounded-t-[var(--primitive-radius-md)] border border-b-0 border-[var(--color-border-subtle)]">
        Instances
      </span>
      <span className="text-body-sm text-[var(--color-text-muted)]">Volumes</span>
    </div>
  );
}

function MockTopBar() {
  return (
    <div className="h-10 border-b border-[var(--color-border-default)] flex items-center justify-between px-4">
      <span className="text-body-md text-[var(--color-text-muted)]">Proj-1 / Instances</span>
    </div>
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
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    name: 'db-server-01',
    status: 'active',
    type: 'Large',
    region: 'us-east-1',
    createdAt: 'Nov 9, 2025',
  },
  {
    id: '3',
    name: 'cache-01',
    status: 'building',
    type: 'Small',
    region: 'eu-west-1',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '4',
    name: 'worker-01',
    status: 'error',
    type: 'XLarge',
    region: 'ap-northeast-1',
    createdAt: 'Nov 8, 2025',
  },
  {
    id: '5',
    name: 'api-gateway',
    status: 'active',
    type: 'Medium',
    region: 'us-east-1',
    createdAt: 'Nov 7, 2025',
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
      <span className="font-medium text-[var(--color-action-primary)] hover:underline cursor-pointer">
        {value}
      </span>
    ),
  },
  { key: 'type', label: 'Type', flex: 1, minWidth: 80, sortable: true },
  { key: 'region', label: 'Region', flex: 1, minWidth: 100 },
  { key: 'createdAt', label: 'Created at', flex: 1, minWidth: 100, sortable: true },
];

function ListPageExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<MockSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={<MockTabBar />}
      topBar={<MockTopBar />}
    >
      <VStack gap={3}>
        <PageHeader
          title="Instances"
          titleExtra={
            <Badge variant="muted" size="sm">
              {listData.length}
            </Badge>
          }
          actions={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
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
    </PageShell>
  );
}

export const ListPage: Story = {
  render: () => <ListPageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**List Page 패턴** — 가장 일반적인 CRUD 리스트 페이지.

구성요소:
- \`PageShell\` (레이아웃)
- \`PageHeader\` (제목 + 액션)
- \`ListToolbar\` (검색 + 필터 + 벌크 액션)
- \`Pagination\` (페이지네이션)
- \`Table\` (데이터 테이블)
        `,
      },
    },
  },
};

/* ----------------------------------------
   Pattern 2: Detail Page
   ---------------------------------------- */

function DetailPageExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<MockSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={<MockTabBar />}
      topBar={<MockTopBar />}
    >
      <VStack gap={4}>
        <DetailHeader
          title="web-server-01"
          subtitle="ID: inst-001"
          status={<StatusIndicator status="active" label="Running" />}
          actions={
            <>
              <Button variant="secondary" size="md">
                Edit
              </Button>
              <Button variant="danger" size="md">
                Delete
              </Button>
            </>
          }
        />

        <Tabs value="overview" onChange={() => {}} variant="underline" size="sm">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="network">Network</Tab>
            <Tab value="storage">Storage</Tab>
            <Tab value="monitoring">Monitoring</Tab>
          </TabList>
        </Tabs>

        <SectionCard>
          <SectionCard.Header title="Basic Information" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Name" value="web-server-01" />
            <SectionCard.DataRow label="Image" value="Ubuntu 22.04 LTS" />
            <SectionCard.DataRow label="Flavor" value="Medium (4 vCPU, 8GB RAM)" />
            <SectionCard.DataRow label="Region" value="us-east-1" />
            <SectionCard.DataRow label="Created" value="Nov 10, 2025" />
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="Network" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Fixed IP" value="10.20.30.40" />
            <SectionCard.DataRow label="Floating IP" value="203.0.113.10" />
            <SectionCard.DataRow label="Security Group" value="default, web-sg" />
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}

export const DetailPage: Story = {
  render: () => <DetailPageExample />,
  parameters: {
    docs: {
      description: {
        story: `
**Detail Page 패턴** — 리소스 상세 정보 페이지.

구성요소:
- \`PageShell\` (레이아웃)
- \`DetailHeader\` (제목 + 상태 + 액션)
- \`Tabs\` (섹션 탭)
- \`SectionCard\` (정보 그룹)
- \`SectionCard.DataRow\` (키-값 표시)
        `,
      },
    },
  },
};

/* ----------------------------------------
   Pattern 3: Empty State Page
   ---------------------------------------- */

function EmptyStatePageExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<MockSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={<MockTabBar />}
      topBar={<MockTopBar />}
    >
      <VStack gap={3}>
        <PageHeader
          title="DNS Zones"
          actions={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
              Create Zone
            </Button>
          }
        />

        <EmptyState
          icon={<IconDatabase size={48} stroke={1} />}
          title="No DNS zones found"
          description="Create your first DNS zone to manage domain records."
          action={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
              Create Zone
            </Button>
          }
        />
      </VStack>
    </PageShell>
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
- \`PageShell\` (레이아웃)
- \`PageHeader\` (제목 + 생성 버튼)
- \`EmptyState\` (아이콘 + 제목 + 설명 + 액션)

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<MockSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={<MockTabBar />}
      topBar={<MockTopBar />}
    >
      <VStack gap={4}>
        <PageHeader title="Dashboard" />

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Instances', value: '24', color: 'text-[var(--color-state-info)]' },
            { label: 'Running', value: '18', color: 'text-[var(--color-state-success)]' },
            { label: 'Stopped', value: '4', color: 'text-[var(--color-text-muted)]' },
            { label: 'Errors', value: '2', color: 'text-[var(--color-state-danger)]' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-default)]"
            >
              <div className="text-body-sm text-[var(--color-text-muted)]">{item.label}</div>
              <div className={`text-heading-h3 mt-1 ${item.color}`}>{item.value}</div>
            </div>
          ))}
        </div>

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
      </VStack>
    </PageShell>
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
- \`PageShell\` (레이아웃)
- \`PageHeader\` (제목)
- \`MetricCard\` 또는 커스텀 카드 (메트릭 표시)
- \`SectionCard\` (최근 활동 등)
        `,
      },
    },
  },
};
