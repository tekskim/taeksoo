import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconDownload, IconStar, IconStarFilled, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type AccessType = 'Personal' | 'Project' | 'Public';

interface InstanceTemplate {
  id: string;
  name: string;
  image: string;
  flavor: string;
  vcpu: number;
  ram: string;
  disk: string;
  network: string;
  floatingIp: string;
  access: AccessType;
  favorite: boolean;
}

const mockTemplates: InstanceTemplate[] = [
  {
    id: 'tpl-001',
    name: 'hj-small',
    image: '-',
    flavor: 'Jan 3, 2025',
    vcpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    network: 'in-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: true,
  },
  {
    id: 'tpl-002',
    name: 'web-server-template',
    image: '-',
    flavor: 'Jan 2, 2025',
    vcpu: 16,
    ram: '32GiB',
    disk: '50GiB',
    network: 'public-net',
    floatingIp: 'Auto',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-003',
    name: 'db-template',
    image: '-',
    flavor: 'Dec 28, 2024',
    vcpu: 32,
    ram: '64GiB',
    disk: '200GiB',
    network: 'db-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-004',
    name: 'gpu-ml-template',
    image: '-',
    flavor: 'Dec 25, 2024',
    vcpu: 16,
    ram: '128GiB',
    disk: '500GiB',
    network: 'ml-net',
    floatingIp: 'Auto',
    access: 'Public',
    favorite: true,
  },
  {
    id: 'tpl-005',
    name: 'minimal-template',
    image: '-',
    flavor: 'Dec 20, 2024',
    vcpu: 2,
    ram: '4GiB',
    disk: '10GiB',
    network: 'in-net',
    floatingIp: 'None',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-006',
    name: 'k8s-worker',
    image: '-',
    flavor: 'Dec 18, 2024',
    vcpu: 8,
    ram: '16GiB',
    disk: '100GiB',
    network: 'k8s-net',
    floatingIp: 'None',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-007',
    name: 'k8s-master',
    image: '-',
    flavor: 'Dec 18, 2024',
    vcpu: 4,
    ram: '8GiB',
    disk: '50GiB',
    network: 'k8s-net',
    floatingIp: 'Auto',
    access: 'Project',
    favorite: true,
  },
  {
    id: 'tpl-008',
    name: 'dev-environment',
    image: '-',
    flavor: 'Dec 15, 2024',
    vcpu: 4,
    ram: '8GiB',
    disk: '30GiB',
    network: 'dev-net',
    floatingIp: 'Auto',
    access: 'Personal',
    favorite: false,
  },
  {
    id: 'tpl-009',
    name: 'monitoring-stack',
    image: '-',
    flavor: 'Dec 10, 2024',
    vcpu: 8,
    ram: '16GiB',
    disk: '100GiB',
    network: 'monitor-net',
    floatingIp: 'Auto',
    access: 'Public',
    favorite: true,
  },
  {
    id: 'tpl-010',
    name: 'cache-server',
    image: '-',
    flavor: 'Dec 5, 2024',
    vcpu: 4,
    ram: '32GiB',
    disk: '20GiB',
    network: 'cache-net',
    floatingIp: 'None',
    access: 'Project',
    favorite: false,
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'network', label: 'Network', type: 'input', placeholder: 'Enter network...' },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Personal', label: 'Personal' },
      { value: 'Project', label: 'Project' },
      { value: 'Public', label: 'Public' },
    ],
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function templateMatchesFilter(t: InstanceTemplate, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const field = filter.key as keyof InstanceTemplate;
  const value = String(t[field] ?? '').toLowerCase();
  return value.includes(fv);
}

export function ComputeInstanceTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'favorites';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [templates, setTemplates] = useState(mockTemplates);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    switch (activeTab) {
      case 'favorites':
        filtered = filtered.filter((t) => t.favorite);
        break;
      case 'personal':
        filtered = filtered.filter((t) => t.access === 'Personal');
        break;
      case 'project':
        filtered = filtered.filter((t) => t.access === 'Project');
        break;
      case 'public':
        filtered = filtered.filter((t) => t.access === 'Public');
        break;
      default:
        break;
    }
    if (appliedFilters.length === 0) return filtered;
    return filtered.filter((t) => appliedFilters.every((f) => templateMatchesFilter(t, f)));
  }, [templates, activeTab, appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredTemplates, currentPage, itemsPerPage]
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const toggleFavorite = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t)));
  };

  const handleBulkDelete = () => {
    setTemplates((prev) => prev.filter((t) => !selectedRows.includes(t.id)));
    setSelectedRows([]);
  };

  const handleRowDelete = (row: InstanceTemplate) => {
    setTemplates((prev) => prev.filter((t) => t.id !== row.id));
  };

  const columns: TableColumn[] = [
    { key: 'favorite', header: '', width: 48, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'image', header: 'Description', sortable: true },
    { key: 'flavor', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Instance templates" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/compute/instance-templates/create')}
        >
          Create template
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id)}
        variant="line"
        size="sm"
        fullWidth
        contentClassName="hidden"
      >
        <Tab id="favorites" label="Current tenant">
          <></>
        </Tab>
        <Tab id="personal" label="Public">
          <></>
        </Tab>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search template by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={handleBulkDelete}
          >
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredTemplates.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<InstanceTemplate>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(row.id);
                }}
                className="p-1 rounded hover:bg-surface-muted transition-colors border-none bg-transparent cursor-pointer"
                aria-label={row.favorite ? 'Remove favorite' : 'Add favorite'}
              >
                {row.favorite ? (
                  <IconStarFilled size={14} className="text-[var(--primitive-color-yellow400)]" />
                ) : (
                  <IconStar size={14} stroke={1.5} className="text-text-muted" />
                )}
              </button>
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <Link to={`/compute/instance-templates/${row.id}`} className={linkClass}>
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.image}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.flavor}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
                  action={() => console.log('Create instance from template:', row.id)}
                >
                  Create instance
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Duplicate template:', row.id)}>
                  Duplicate
                </ContextMenu.Item>
                <ContextMenu.Item action={() => handleRowDelete(row)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
