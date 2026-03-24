import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { Tabs, Tab } from '@shared/components/Tabs';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface FlavorItem {
  id: string;
  name: string;
  vcpus: string;
  ram: string;
  disk: string;
  category: 'general' | 'gpu';
  [key: string]: unknown;
}

export interface ResizeInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockFlavors: FlavorItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `flv-${i + 1}`,
  name:
    i < 6
      ? `m${i + 1}.${['large', 'xlarge', '2xlarge', '4xlarge', '8xlarge', '12xlarge'][i % 6]}`
      : `g${i - 5}.2xlarge`,
  vcpus: String(2 + i * 2),
  ram: `${4 + i * 4} GiB`,
  disk: `${20 + i * 10} GiB`,
  category: i < 6 ? 'general' : 'gpu',
}));

const columns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'vcpus', header: 'vCPUs', sortable: true },
  { key: 'ram', header: 'RAM', sortable: true },
  { key: 'disk', header: 'Disk', sortable: true },
];

export function ResizeInstanceDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: ResizeInstanceDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [flavorTab, setFlavorTab] = useState<'general' | 'gpu'>('general');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFlavorTab('general');
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const tabFlavors = useMemo(
    () => mockFlavors.filter((f) => f.category === flavorTab),
    [flavorTab]
  );

  const filtered = useMemo(
    () =>
      tabFlavors.filter((f) =>
        [f.name, f.vcpus, f.ram, f.disk].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [tabFlavors, searchQuery]
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (selectedRows.length === 0) return;
    onClose();
  };

  const selected = mockFlavors.find((f) => selectedRows.includes(f.id));

  const renderFlavorBody = () => (
    <div className="flex flex-col gap-3 w-full pt-4 pb-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-[3px]">
          <span className="text-13 font-medium text-text leading-5">Flavor</span>
          <span className="text-13 font-medium text-danger leading-5">*</span>
        </div>
        <p className="text-12 text-text-muted">Select a flavor for this instance.</p>
      </div>

      <div className="w-[280px]">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search flavors"
          size="sm"
        />
      </div>

      <Pagination
        totalCount={filtered.length}
        size={ITEMS_PER_PAGE}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
      />

      <div className="flex flex-col gap-2 w-full">
        <SelectableTable<FlavorItem>
          columns={columns}
          rows={paginated}
          selectionType="radio"
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
        >
          {paginated.map((row) => (
            <Table.Tr key={row.id} rowData={row}>
              <Table.Td rowData={row} column={columns[0]}>
                {row.name}
              </Table.Td>
              <Table.Td rowData={row} column={columns[1]}>
                {row.vcpus}
              </Table.Td>
              <Table.Td rowData={row} column={columns[2]}>
                {row.ram}
              </Table.Td>
              <Table.Td rowData={row} column={columns[3]}>
                {row.disk}
              </Table.Td>
            </Table.Tr>
          ))}
        </SelectableTable>

        <div
          className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
            hasAttemptedSubmit && selectedRows.length === 0
              ? 'border-danger bg-danger-light'
              : 'border-border bg-surface-muted'
          }`}
        >
          {!selected ? (
            <span className="text-11 text-text-muted">No flavor selected</span>
          ) : (
            <Tag label={selected.name} variant="multiSelect" onClose={() => setSelectedRows([])} />
          )}
        </div>
        {hasAttemptedSubmit && selectedRows.length === 0 && (
          <p className="text-11 text-danger" role="alert">
            Please select a flavor.
          </p>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Resize Instance"
      description="Select a new flavor to resize this instance."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Resize"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <Tabs
          activeTabId={flavorTab}
          onChange={(id) => {
            setFlavorTab(id as 'general' | 'gpu');
            setCurrentPage(1);
            setSelectedRows([]);
            setSearchQuery('');
          }}
          size="sm"
          variant="line"
        >
          <Tab id="general" label="General">
            {renderFlavorBody()}
          </Tab>
          <Tab id="gpu" label="GPU">
            {renderFlavorBody()}
          </Tab>
        </Tabs>
      </div>
    </Overlay.Template>
  );
}
