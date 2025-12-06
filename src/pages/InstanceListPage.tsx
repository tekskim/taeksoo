import { useState } from 'react';
import { Button, Input, Badge, HStack, VStack } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconCpu,
  IconServer,
  IconRefresh,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type InstanceStatus = 'running' | 'stopped' | 'pending' | 'error';

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
];

/* ----------------------------------------
   Status Badge Config
   ---------------------------------------- */

const statusConfig: Record<InstanceStatus, { variant: 'success' | 'default' | 'warning' | 'error'; label: string }> = {
  running: { variant: 'success', label: 'Running' },
  stopped: { variant: 'default', label: 'Stopped' },
  pending: { variant: 'warning', label: 'Pending' },
  error: { variant: 'error', label: 'Error' },
};

/* ----------------------------------------
   Instance List Page
   ---------------------------------------- */

export function InstanceListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);

  const filteredInstances = mockInstances.filter((instance) =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instance.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedInstances.length === filteredInstances.length) {
      setSelectedInstances([]);
    } else {
      setSelectedInstances(filteredInstances.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedInstances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const runningCount = mockInstances.filter((i) => i.status === 'running').length;
  const stoppedCount = mockInstances.filter((i) => i.status === 'stopped').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[200px] min-h-screen">
        {/* Tab Bar */}
        <TabBar
          tabs={[
            { id: 'instances', label: 'Instances', active: true },
          ]}
        />

        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: 'Proj-1', href: '/project' },
            { label: 'Instances', active: true },
          ]}
          hasNotification={true}
        />

        {/* Page Content */}
        <div className="p-6">
          <VStack gap={6} className="max-w-[1320px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-neutral-900">Instances</h1>
              <Button>Create Instance</Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Instances" value={mockInstances.length} />
              <StatCard label="Running" value={runningCount} variant="success" />
              <StatCard label="Stopped" value={stoppedCount} variant="neutral" />
              <StatCard label="Regions" value={4} variant="info" />
            </div>

            {/* Filters & Actions Bar */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <HStack gap={3} className="flex-1">
                  <div className="w-80">
                    <Input
                      placeholder="Search instances..."
                      leftElement={<IconSearch size={16} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>

            {/* Instance Table */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedInstances.length === filteredInstances.length && filteredInstances.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Specs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="w-12 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredInstances.map((instance) => (
                    <tr
                      key={instance.id}
                      className={`hover:bg-neutral-50 transition-colors ${
                        selectedInstances.includes(instance.id) ? 'bg-primary-50' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInstances.includes(instance.id)}
                          onChange={() => toggleSelect(instance.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <VStack gap={0} align="start">
                          <span className="font-medium text-neutral-900">{instance.name}</span>
                          <span className="text-xs text-neutral-500">{instance.id}</span>
                        </VStack>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusConfig[instance.status].variant} dot>
                          {statusConfig[instance.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-700 font-mono">{instance.type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <HStack gap={3}>
                          <HStack gap={1}>
                            <IconCpu size={14} className="text-neutral-400" />
                            <span className="text-sm text-neutral-600">{instance.cpu} vCPU</span>
                          </HStack>
                          <span className="text-neutral-300">•</span>
                          <span className="text-sm text-neutral-600">{instance.memory} GB</span>
                        </HStack>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-700 font-mono">{instance.ip}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-600">{instance.region}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1 rounded hover:bg-neutral-100 transition-colors">
                          <IconDotsVertical size={16} className="text-neutral-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredInstances.length === 0 && (
                <div className="py-16 text-center">
                  <IconServer size={48} className="mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No instances found</h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first instance'}
                  </p>
                  {!searchQuery && (
                    <Button leftIcon={<IconPlus size={16} />}>Create Instance</Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {filteredInstances.length > 0 && (
                <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    Showing {filteredInstances.length} of {mockInstances.length} instances
                  </span>
                  <HStack gap={2}>
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  </HStack>
                </div>
              )}
            </div>
          </VStack>
        </div>
      </main>
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
    primary: 'text-primary-600',
    success: 'text-success-500',
    neutral: 'text-neutral-600',
    info: 'text-info-500',
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <VStack gap={1} align="start">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className={`text-2xl font-semibold ${colors[variant]}`}>{value}</span>
      </VStack>
    </div>
  );
}

export default InstanceListPage;

