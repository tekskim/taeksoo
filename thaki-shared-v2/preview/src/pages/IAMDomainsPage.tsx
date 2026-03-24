import { useState, useMemo } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload } from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { CreateDomainDrawer } from '../drawers/iam/CreateDomainDrawer';
import { EditDomainDrawer } from '../drawers/iam/EditDomainDrawer';
import { SetDefaultDomainDrawer } from '../drawers/iam/SetDefaultDomainDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

interface Domain {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  [key: string]: unknown;
}

const statusMap: Record<string, StatusVariant> = {
  active: 'active',
  inactive: 'shutoff',
  pending: 'building',
};

const mockDomains: Domain[] = [
  {
    id: 'domain-001',
    name: 'domain',
    description: '-',
    status: 'active',
    createdAt: 'Sep 12, 2025 08:22:15',
  },
  {
    id: 'domain-002',
    name: 'production',
    description: 'Production environment',
    status: 'active',
    createdAt: 'Aug 15, 2025 10:45:33',
  },
  {
    id: 'domain-003',
    name: 'staging',
    description: 'Staging environment',
    status: 'active',
    createdAt: 'Jul 20, 2025 14:18:42',
  },
  {
    id: 'domain-004',
    name: 'development',
    description: 'Development environment',
    status: 'active',
    createdAt: 'Jun 10, 2025 09:32:28',
  },
  {
    id: 'domain-005',
    name: 'testing',
    description: 'Testing domain',
    status: 'inactive',
    createdAt: 'Sep 1, 2025 16:52:07',
  },
  {
    id: 'domain-006',
    name: 'qa-domain',
    description: 'QA testing',
    status: 'active',
    createdAt: 'Aug 25, 2025 11:15:44',
  },
  {
    id: 'domain-007',
    name: 'sandbox',
    description: 'Sandbox environment',
    status: 'pending',
    createdAt: 'Sep 10, 2025 13:38:21',
  },
  {
    id: 'domain-008',
    name: 'demo',
    description: 'Demo environment',
    status: 'active',
    createdAt: 'Jul 5, 2025 10:22:55',
  },
  {
    id: 'domain-009',
    name: 'internal',
    description: 'Internal domain',
    status: 'active',
    createdAt: 'Jun 1, 2025 15:48:12',
  },
  {
    id: 'domain-010',
    name: 'external',
    description: 'External access domain',
    status: 'active',
    createdAt: 'May 15, 2025 08:35:39',
  },
];

const filterKeys: FilterKey[] = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function IAMDomainsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [createDomainOpen, setCreateDomainOpen] = useState(false);
  const [editDomainOpen, setEditDomainOpen] = useState(false);
  const [editDomainId, setEditDomainId] = useState('');
  const [editDomainData, setEditDomainData] = useState<
    { name: string; description: string; enabled: boolean } | undefined
  >();
  const [setDefaultOpen, setSetDefaultOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const handleFilterAdd = (filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => {
      const exists = prev.findIndex((f) => f.id === filter.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = filter;
        return next;
      }
      return [...prev, filter];
    });
    setCurrentPage(1);
  };

  const filteredDomains = useMemo(() => {
    if (appliedFilters.length === 0) return mockDomains;
    return mockDomains.filter((d) =>
      appliedFilters.every((f) => {
        if (f.id === 'name') return d.name.toLowerCase().includes(String(f.value).toLowerCase());
        if (f.id === 'status') return d.status === f.value;
        return true;
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isLastDomain = mockDomains.length === 1;

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 80, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Domains" />
        <Button variant="primary" size="md" onClick={() => setCreateDomainOpen(true)}>
          Create domain
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <FilterSearchInput
          filterKeys={filterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search domains by attributes"
          defaultFilterKey="name"
        />
        <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
          <IconDownload size={12} />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setSetDefaultOpen(true)}>
          Set default
        </Button>
      </div>

      <Pagination
        totalCount={filteredDomains.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
      />

      <Table<Domain> columns={columns} rows={paginatedDomains} stickyLastColumn>
        {paginatedDomains.map((domain) => (
          <Table.Tr key={domain.id} rowData={domain}>
            <Table.Td rowData={domain} column={columns[0]}>
              <StatusIndicator variant={statusMap[domain.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={domain} column={columns[1]}>
              <span className="text-12 leading-18">{domain.name}</span>
            </Table.Td>
            <Table.Td rowData={domain} column={columns[2]}>
              {domain.description}
            </Table.Td>
            <Table.Td rowData={domain} column={columns[3]}>
              {domain.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={domain} column={columns[4]} preventClickPropagation>
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-surface-muted transition-colors"
                  title="Open console"
                >
                  <ArrowRightLeft size={16} strokeWidth={1.5} className="text-text" />
                </button>
                <ContextMenu.Root
                  direction="bottom-end"
                  gap={4}
                  trigger={({ toggle }) => (
                    <button
                      type="button"
                      onClick={toggle}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                >
                  <ContextMenu.Item
                    action={() => {
                      setEditDomainId(domain.id);
                      setEditDomainData({
                        name: domain.name,
                        description: domain.description,
                        enabled: domain.status === 'active',
                      });
                      setEditDomainOpen(true);
                    }}
                  >
                    Edit
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => {}} danger disabled={isLastDomain}>
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Root>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
      <CreateDomainDrawer isOpen={createDomainOpen} onClose={() => setCreateDomainOpen(false)} />
      <EditDomainDrawer
        isOpen={editDomainOpen}
        onClose={() => setEditDomainOpen(false)}
        domainId={editDomainId}
        initialData={editDomainData}
      />
      <SetDefaultDomainDrawer isOpen={setDefaultOpen} onClose={() => setSetDefaultOpen(false)} />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
