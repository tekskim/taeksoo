import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface MetadataDefinition extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  resourceTypes: string[];
  isPublic: boolean;
  isProtected: boolean;
}

const mockMetadataDefinitions: MetadataDefinition[] = Array.from({ length: 24 }, (_, i) => ({
  id: `metadata-${String(i + 1).padStart(4, '0')}`,
  name: i > 0 ? `metadata${i}` : 'metadata',
  description:
    i % 3 === 0
      ? 'These properties allow modifying the shutdown behavior of the compute service.'
      : i % 5 === 0
        ? 'Resource metadata for image properties'
        : 'Custom metadata definition for resources',
  resourceTypes:
    i % 2 === 0
      ? ['OS::Glance::Image', 'OS::Nova::Instance', 'OS::Cinder::Volume']
      : ['OS::Glance::Image'],
  isPublic: i % 3 !== 1,
  isProtected: i % 4 === 0,
}));

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name...' },
  {
    key: 'description',
    label: 'Description',
    type: 'input',
    placeholder: 'Filter by description...',
  },
  {
    key: 'resourceTypes',
    label: 'Resource type',
    type: 'input',
    placeholder: 'Filter by resource type...',
  },
];

function rowMatchesFilter(row: MetadataDefinition, filter: FilterKeyWithValue): boolean {
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(q);
    case 'description':
      return row.description.toLowerCase().includes(q);
    case 'resourceTypes':
      return row.resourceTypes.some((t) => t.toLowerCase().includes(q));
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'resourceTypes', label: 'Resource Types', visible: true },
  { key: 'isPublic', label: 'Public', visible: true },
  { key: 'isProtected', label: 'Protected', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminMetadataDefinitionsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockMetadataDefinitions;
    return mockMetadataDefinitions.filter((row) =>
      appliedFilters.every((f) => rowMatchesFilter(row, f))
    );
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
      { key: 'resourceTypes', header: 'Resource Types' },
      { key: 'isPublic', header: 'Public', width: 100 },
      { key: 'isProtected', header: 'Protected', width: 100 },
      { key: 'actions', header: 'Action', width: 60, align: 'center', clickable: false },
    ],
    []
  );

  const c = (key: string) => columns.find((col) => col.key === key)!;

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Metadata definitions" />
        <Button variant="primary" size="md">
          Import metadata
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search metadata by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} /> Delete
        </Button>
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
                  aria-label={`Remove ${filter.label}`}
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
        totalCount={filtered.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<MetadataDefinition>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('name')}>
              <Link
                to={`/compute-admin/metadata-definition/${row.id}`}
                className={linkClass}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('description')}>
              <span
                className="text-12 text-text truncate block max-w-[320px]"
                title={row.description}
              >
                {row.description}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('resourceTypes')} isEllipsis={false}>
              {(() => {
                const types = row.resourceTypes;
                if (types.length === 0) return <span>-</span>;
                if (types.length === 1)
                  return <span className="text-12 text-text">{types[0]}</span>;
                return (
                  <span className="inline-flex items-center gap-1 min-w-0">
                    <span className="text-12 text-text truncate min-w-0">{types[0]}</span>
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[320px]">
                          <div className="text-10 leading-14 font-medium text-text-muted mb-2">
                            All Resource Types ({types.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {types.map((t, i) => (
                              <Badge key={i} theme="white" size="sm" type="subtle">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-11 leading-16 font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                        +{types.length - 1}
                      </span>
                    </Popover>
                  </span>
                );
              })()}
            </Table.Td>
            <Table.Td rowData={row} column={c('isPublic')}>
              <span className="text-12 text-text">{row.isPublic ? 'On' : 'Off'}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('isProtected')}>
              <span className="text-12 text-text">{row.isProtected ? 'Yes' : 'No'}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal size={16} stroke={1.5} />
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('edit', row.id)}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('manage contents', row.id)}>
                  Manage contents
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
