import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  PageHeader,
  Button,
  Table,
  TableColumn,
  Pagination,
  Badge,
  StatusIndicator,
  SearchInput,
  ContextMenu,
} from '../components/shims';
import { IconPlus, IconChevronDown } from '@tabler/icons-react';

interface Instance {
  id: string;
  name: string;
  status: 'active' | 'error' | 'muted' | 'building';
  flavor: string;
  ip: string;
  az: string;
  createdAt: string;
}

const MOCK_DATA: Instance[] = [
  {
    id: 'i-001',
    name: 'web-server-01',
    status: 'active',
    flavor: 'm1.medium',
    ip: '10.0.0.1',
    az: 'kr-1a',
    createdAt: '2026-03-15',
  },
  {
    id: 'i-002',
    name: 'db-primary',
    status: 'active',
    flavor: 'm1.large',
    ip: '10.0.0.2',
    az: 'kr-1b',
    createdAt: '2026-03-10',
  },
  {
    id: 'i-003',
    name: 'cache-redis',
    status: 'building',
    flavor: 'm1.small',
    ip: '10.0.0.3',
    az: 'kr-1a',
    createdAt: '2026-04-01',
  },
  {
    id: 'i-004',
    name: 'worker-01',
    status: 'muted',
    flavor: 'm1.small',
    ip: '10.0.0.4',
    az: 'kr-1b',
    createdAt: '2026-02-20',
  },
  {
    id: 'i-005',
    name: 'api-gateway',
    status: 'active',
    flavor: 'm1.medium',
    ip: '10.0.0.5',
    az: 'kr-1a',
    createdAt: '2026-03-22',
  },
  {
    id: 'i-006',
    name: 'batch-runner',
    status: 'error',
    flavor: 'm1.small',
    ip: '10.0.0.6',
    az: 'kr-1c',
    createdAt: '2026-03-28',
  },
];

const createMenuItems = [
  { id: 'create-blank', label: 'Create from blank', onClick: () => alert('Create from blank') },
  {
    id: 'create-snapshot',
    label: 'Create from snapshot',
    onClick: () => alert('Create from snapshot'),
  },
  { id: 'create-image', label: 'Create from image', onClick: () => alert('Create from image') },
];

export function InstancesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const filtered = MOCK_DATA.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const columns: TableColumn<Instance>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <button
          className="text-[var(--color-action-primary)] hover:underline text-xs"
          onClick={() => navigate(`/instances/${row.id}`)}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusIndicator status={row.status} />,
    },
    { key: 'flavor', header: 'Flavor' },
    { key: 'ip', header: 'IP Address' },
    {
      key: 'az',
      header: 'AZ',
      render: (row) => (
        <Badge variant="info" size="sm">
          {row.az}
        </Badge>
      ),
    },
    { key: 'createdAt', header: 'Created at', align: 'right' },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <ContextMenu
          trigger="click"
          items={[
            { id: 'start', label: 'Start', onClick: () => alert(`Start ${row.name}`) },
            { id: 'stop', label: 'Stop', onClick: () => alert(`Stop ${row.name}`) },
            {
              id: 'delete',
              label: 'Delete',
              status: 'danger',
              divider: true,
              onClick: () => alert(`Delete ${row.name}`),
            },
          ]}
        >
          <Button variant="ghost" size="sm">
            •••
          </Button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <PageHeader
        title="Instances"
        actions={
          <ContextMenu items={createMenuItems} trigger="click" align="right">
            <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} />}>
              <IconPlus size={12} />
              Create Instance
            </Button>
          </ContextMenu>
        }
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search instances..."
          size="sm"
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        selectedCount={selectedKeys.length}
      />

      <Table
        columns={columns}
        data={paged}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyMessage="No instances found."
      />
    </VStack>
  );
}
