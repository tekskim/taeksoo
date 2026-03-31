import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Pagination } from '@shared/components/Pagination';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconTrash, IconX } from '@tabler/icons-react';

interface MetadataDefinitionDetail {
  id: string;
  name: string;
  namespace: string;
  resourceType: string;
  description: string;
  createdAt: string;
}

interface PropertyRow extends Record<string, unknown> {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

const mockDefinitions: Record<string, MetadataDefinitionDetail> = {
  'mdef-001': {
    id: 'mdef-001',
    name: 'hw:cpu_model',
    namespace: 'OS::Compute::Instance',
    resourceType: 'Instance',
    description: 'Optional CPU model hint for scheduling bare-metal capable flavors.',
    createdAt: 'Jan 15, 2026 13:22:08',
  },
  'mdef-002': {
    id: 'mdef-002',
    name: 'capabilities:boot_option',
    namespace: 'OS::BareMetal::Node',
    resourceType: 'Bare metal node',
    description: 'Boot interface preference for ironic nodes.',
    createdAt: 'Feb 4, 2026 10:05:51',
  },
};

const defaultDefinition: MetadataDefinitionDetail = {
  id: 'unknown',
  name: 'unknown',
  namespace: '-',
  resourceType: '-',
  description: '-',
  createdAt: '-',
};

const propertiesById: Record<string, PropertyRow[]> = {
  'mdef-001': [
    {
      name: 'value',
      type: 'string',
      description: 'Vendor-specific CPU model identifier.',
      required: false,
    },
    {
      name: 'strict',
      type: 'boolean',
      description: 'If true, scheduler rejects hosts that cannot satisfy the model.',
      required: true,
    },
  ],
  'mdef-002': [
    {
      name: 'option',
      type: 'enum(local,pxe,iscsi)',
      description: 'Ordered boot methods attempted during provisioning.',
      required: true,
    },
    {
      name: 'persistent',
      type: 'boolean',
      description: 'Persist boot device after successful deploy.',
      required: false,
    },
  ],
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input' },
  { key: 'type', label: 'Type', type: 'input' },
];

function propMatches(row: PropertyRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof PropertyRow;
  if (key === 'required') return String(row.required).toLowerCase().includes(fv);
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ComputeAdminMetadataDefinitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const defn = useMemo(
    () => (id && mockDefinitions[id] ? mockDefinitions[id] : defaultDefinition),
    [id]
  );
  const dataKey = id && mockDefinitions[id] ? id : 'mdef-001';
  const properties = propertiesById[dataKey] ?? [];

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setPage(1);
  }, []);

  const filteredProps = useMemo(() => {
    if (appliedFilters.length === 0) return properties;
    return properties.filter((row) => appliedFilters.every((f) => propMatches(row, f)));
  }, [properties, appliedFilters]);

  const paginated = filteredProps.slice((page - 1) * pageSize, page * pageSize);

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'required', header: 'Required', width: 88, align: 'center' },
  ];

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: defn.name },
    { label: 'Namespace', value: defn.namespace },
    { label: 'Resource type', value: defn.resourceType },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={defn.name}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => {}}>Clone definition</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Export JSON schema</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>View usage in API</ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Overview" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={defn.name} />
                  <SectionCard.DataRow label="Namespace" value={defn.namespace} />
                  <SectionCard.DataRow label="Resource type" value={defn.resourceType} />
                  <SectionCard.DataRow label="Description" value={defn.description} />
                  <SectionCard.DataRow label="Created at" value={defn.createdAt} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Properties" />
                <SectionCard.Content showDividers={false} className="gap-4">
                  <div className="flex flex-col gap-2">
                    <FilterSearchInput
                      filterKeys={filterKeys}
                      onFilterAdd={handleFilterAdd}
                      selectedFilters={appliedFilters}
                      placeholder="Search properties by attributes"
                      defaultFilterKey="name"
                      className="w-full max-w-[320px]"
                    />
                    {appliedFilters.length > 0 && (
                      <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                        <div className="flex items-center gap-1 flex-wrap">
                          {appliedFilters.map((filter) => (
                            <span
                              key={filter.id}
                              className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                            >
                              <span className="flex items-center gap-1">
                                <span>{filter.label}</span>
                                <span className="text-border">|</span>
                                <span>{filter.displayValue ?? filter.value}</span>
                              </span>
                              <button
                                type="button"
                                className="shrink-0 p-0.5 cursor-pointer bg-transparent border-none"
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
                          className="text-11 font-medium text-primary cursor-pointer bg-transparent border-none ml-4"
                          onClick={() => {
                            setAppliedFilters([]);
                            setPage(1);
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                  <Pagination
                    totalCount={filteredProps.length}
                    size={pageSize}
                    currentAt={page}
                    onPageChange={setPage}
                    totalCountLabel="properties"
                  />
                  <Table<PropertyRow>
                    columns={columns}
                    rows={paginated}
                    sort={sort}
                    order={order}
                    onSortChange={(k, o) => {
                      setSort(k ?? '');
                      setOrder(o);
                    }}
                  >
                    {paginated.map((row) => (
                      <Table.Tr key={row.name} rowData={row}>
                        <Table.Td rowData={row} column={columns[0]}>
                          {row.name}
                        </Table.Td>
                        <Table.Td rowData={row} column={columns[1]}>
                          {row.type}
                        </Table.Td>
                        <Table.Td rowData={row} column={columns[2]}>
                          {row.description}
                        </Table.Td>
                        <Table.Td rowData={row} column={columns[3]}>
                          {row.required ? 'Yes' : 'No'}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
