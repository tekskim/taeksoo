import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  StatusIndicator,
  Pagination,
  HStack,
  VStack,
  type TableColumn,
  type StatusType,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import {
  IconPlus,
  IconFilter,
  IconDotsVertical,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconCpu,
  IconServer,
  IconRefresh,
  IconLock,
  IconArrowUp,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type InstanceStatus = 'running' | 'stopped' | 'pending' | 'error' | 'building';

interface Instance {
  id: string;
  name: string;
  type: string;
  status: InstanceStatus;
  cpu: number;
  memory: number;
  storage: number;
  ip: string;
  region: string;
  locked?: boolean;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstances: Instance[] = [
  {
    id: 'i-001',
    name: 'production-api-1',
    type: 'c5.xlarge',
    status: 'running',
    cpu: 4,
    memory: 8,
    storage: 100,
    ip: '10.0.1.101',
    region: 'us-east-1',
    locked: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'i-002',
    name: 'production-api-2',
    type: 'c5.xlarge',
    status: 'running',
    cpu: 4,
    memory: 8,
    storage: 100,
    ip: '10.0.1.102',
    region: 'us-east-1',
    createdAt: '2024-01-15',
  },
  {
    id: 'i-003',
    name: 'staging-web',
    type: 't3.medium',
    status: 'stopped',
    cpu: 2,
    memory: 4,
    storage: 50,
    ip: '10.0.2.50',
    region: 'us-west-2',
    createdAt: '2024-02-20',
  },
  {
    id: 'i-004',
    name: 'dev-database',
    type: 'r5.large',
    status: 'running',
    cpu: 2,
    memory: 16,
    storage: 500,
    ip: '10.0.3.10',
    region: 'eu-west-1',
    locked: true,
    createdAt: '2024-03-01',
  },
  {
    id: 'i-005',
    name: 'analytics-worker',
    type: 'm5.2xlarge',
    status: 'pending',
    cpu: 8,
    memory: 32,
    storage: 200,
    ip: '—',
    region: 'ap-northeast-1',
    createdAt: '2024-03-10',
  },
  {
    id: 'i-006',
    name: 'backup-server',
    type: 't3.small',
    status: 'error',
    cpu: 2,
    memory: 2,
    storage: 1000,
    ip: '10.0.4.5',
    region: 'us-east-1',
    createdAt: '2024-01-05',
  },
  {
    id: 'i-007',
    name: 'ml-worker',
    type: 'p3.2xlarge',
    status: 'building',
    cpu: 8,
    memory: 64,
    storage: 500,
    ip: '—',
    region: 'us-west-2',
    createdAt: '2024-03-12',
  },
];

/* ----------------------------------------
   Status Config - Map to StatusIndicator types
   ---------------------------------------- */

const statusMap: Record<InstanceStatus, StatusType> = {
  running: 'active',
  stopped: 'shutoff',
  pending: 'paused',
  error: 'error',
  building: 'building',
};

/* ----------------------------------------
   Instances List Page
   ---------------------------------------- */

export function InstanceListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pageSize = 10;

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredInstances = useMemo(() => 
    mockInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instance.id.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const totalPages = Math.ceil(filteredInstances.length / pageSize);

  const runningCount = mockInstances.filter((i) => i.status === 'running').length;
  const stoppedCount = mockInstances.filter((i) => i.status === 'stopped').length;

  // Table columns definition
  const columns: TableColumn<Instance>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      sortable: true,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      sortable: true,
      render: (_, row) => (
        <VStack gap={0} align="start">
          <span className="font-medium text-[var(--color-text-default)]">{row.name}</span>
          <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">{row.id}</span>
        </VStack>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: '80px',
      align: 'center',
      render: (_, row) => row.locked ? (
        <IconLock size={14} className="text-[var(--color-text-subtle)]" />
      ) : null,
    },
    {
      key: 'ip',
      label: 'Fixed IP',
      width: '120px',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'type',
      label: 'Flavor',
      width: '110px',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'cpu',
      label: 'vCPU',
      width: '70px',
      align: 'center',
      sortable: true,
      render: (value) => (
        <HStack gap={1} justify="center">
          <IconCpu size={14} className="text-[var(--color-text-subtle)]" />
          <span>{value}</span>
        </HStack>
      ),
    },
    {
      key: 'memory',
      label: 'RAM',
      width: '80px',
      align: 'center',
      sortable: true,
      render: (value) => `${value}GB`,
    },
    {
      key: 'storage',
      label: 'Disk',
      width: '80px',
      align: 'center',
      sortable: true,
      render: (value) => value >= 1000 ? `${value / 1000}TB` : `${value}GB`,
    },
    {
      key: 'region',
      label: 'Region',
      width: '130px',
      sortable: true,
    },
    {
      key: 'actions',
      label: '',
      width: '48px',
      align: 'center',
      render: () => (
        <button className="p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
          <IconDotsVertical size={16} className="text-[var(--color-text-subtle)]" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[200px] min-h-screen">
        {/* Tab Bar */}
        <TabBar
          tabs={[
            { id: 'instances', label: 'Instances List', active: true },
          ]}
        />

        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: 'Proj-1', href: '/project' },
            { label: 'Instances List', active: true },
          ]}
          hasNotification={true}
        />

        {/* Page Content */}
        <div className="p-6">
          <VStack gap={6} className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Instances List
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Instance
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Instances" value={mockInstances.length} />
              <StatCard label="Running" value={runningCount} variant="success" />
              <StatCard label="Stopped" value={stoppedCount} variant="neutral" />
              <StatCard label="Regions" value={4} variant="info" />
            </div>

            {/* Filters & Actions Bar */}
              <div className="flex items-center justify-between gap-4">
                <HStack gap={3} className="flex-1">
                  <div className="w-80">
                  <SearchInput
                      placeholder="Search instances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    fullWidth
                    />
                  </div>
                  <Button variant="outline" size="md" leftIcon={<IconFilter size={16} />}>
                    Filters
                  </Button>
                </HStack>
                <HStack gap={2}>
                  <Button variant="ghost" size="md" leftIcon={<IconRefresh size={16} />}>
                    Refresh
                  </Button>
                  {selectedInstances.length > 0 && (
                    <>
                      <Button variant="outline" size="md" leftIcon={<IconPlayerPlay size={16} />}>
                        Start
                      </Button>
                      <Button variant="outline" size="md" leftIcon={<IconPlayerStop size={16} />}>
                        Stop
                      </Button>
                      <Button variant="danger" size="md" leftIcon={<IconTrash size={16} />}>
                        Delete
                      </Button>
                    </>
                  )}
                </HStack>
            </div>

            {/* Instance Table */}
            <Table<Instance>
              columns={columns}
              data={filteredInstances}
              rowKey="id"
              selectable
              selectedKeys={selectedInstances}
              onSelectionChange={setSelectedInstances}
              emptyMessage="No instances found"
            />

              {/* Empty State */}
              {filteredInstances.length === 0 && (
                <div className="py-16 text-center">
                <IconServer size={48} className="mx-auto text-[var(--color-text-disabled)] mb-4" />
                <h3 className="text-[length:var(--font-size-16)] font-medium text-[var(--color-text-default)] mb-1">
                  No instances found
                </h3>
                <p className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)] mb-4">
                    {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first instance'}
                  </p>
                  {!searchQuery && (
                    <Button leftIcon={<IconPlus size={16} />}>Create Instance</Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {filteredInstances.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                    Showing {filteredInstances.length} of {mockInstances.length} instances
                  </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
                </div>
              )}
          </VStack>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <IconArrowUp size={20} stroke={2} />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */

function StatCard({
  label,
  value,
  variant = 'primary',
}: {
  label: string;
  value: number;
  variant?: 'primary' | 'success' | 'neutral' | 'info';
}) {
  const colors = {
    primary: 'text-[var(--color-action-primary)]',
    success: 'text-[var(--color-state-success)]',
    neutral: 'text-[var(--color-text-muted)]',
    info: 'text-[var(--color-state-info)]',
  };

  return (
    <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4">
      <VStack gap={1} align="start">
        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">{label}</span>
        <span className={`text-[length:var(--font-size-24)] font-semibold ${colors[variant]}`}>{value}</span>
      </VStack>
    </div>
  );
}

export default InstanceListPage;
