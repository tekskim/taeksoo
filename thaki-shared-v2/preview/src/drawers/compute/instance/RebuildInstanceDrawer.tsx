import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Tabs, Tab } from '@shared/components/Tabs';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface ImageItem {
  id: string;
  name: string;
  os: string;
  size: string;
  status: string;
  createdAt: string;
  visibility: 'public' | 'private' | 'shared';
  [key: string]: unknown;
}

export interface RebuildInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockImages: ImageItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: `ubuntu-22.04-${i + 1}`,
  os: i % 2 === 0 ? 'Ubuntu 22.04' : 'Rocky Linux 9',
  size: `${2 + i} GiB`,
  status: i % 5 === 0 ? 'building' : 'active',
  createdAt: `Mar ${String((i % 28) + 1).padStart(2, '0')}, 2025`,
  visibility: (['public', 'private', 'shared'] as const)[i % 3],
}));

const columns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'os', header: 'OS', sortable: true },
  { key: 'size', header: 'Size', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'createdAt', header: 'Created at', sortable: true },
];

export function RebuildInstanceDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: RebuildInstanceDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [imageTab, setImageTab] = useState<'public' | 'private' | 'shared'>('public');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageTab('public');
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const tabImages = useMemo(
    () => mockImages.filter((img) => img.visibility === imageTab),
    [imageTab]
  );

  const filtered = useMemo(
    () =>
      tabImages.filter((img) =>
        [img.name, img.os, img.size, img.status, img.createdAt].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [tabImages, searchQuery]
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

  const selected = mockImages.find((img) => selectedRows.includes(img.id));

  const renderImageBody = () => (
    <div className="flex flex-col gap-3 w-full pt-4 pb-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-[3px]">
          <span className="text-13 font-medium text-text leading-5">Image</span>
          <span className="text-13 font-medium text-danger leading-5">*</span>
        </div>
        <p className="text-12 text-text-muted">Select an image to rebuild from.</p>
      </div>

      <div className="w-[280px]">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images"
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
        <SelectableTable<ImageItem>
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
                <span className="text-primary font-medium">{row.name}</span>
              </Table.Td>
              <Table.Td rowData={row} column={columns[1]}>
                {row.os}
              </Table.Td>
              <Table.Td rowData={row} column={columns[2]}>
                {row.size}
              </Table.Td>
              <Table.Td rowData={row} column={columns[3]}>
                <StatusIndicator
                  variant={row.status === 'active' ? 'active' : 'building'}
                  label={row.status === 'active' ? 'Active' : 'Building'}
                />
              </Table.Td>
              <Table.Td rowData={row} column={columns[4]}>
                {row.createdAt}
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
            <span className="text-11 text-text-muted">No image selected</span>
          ) : (
            <Tag label={selected.name} variant="multiSelect" onClose={() => setSelectedRows([])} />
          )}
        </div>
        {hasAttemptedSubmit && selectedRows.length === 0 && (
          <p className="text-11 text-danger" role="alert">
            Please select an image.
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
      title="Rebuild Instance"
      description="Rebuild this instance from a new image. All data on the instance will be lost."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      footer={
        <div className="flex items-center justify-center gap-2 py-4 px-6 w-full border-t border-border-subtle">
          <Button
            type="button"
            className="min-w-[80px] w-[152px] py-2 px-3 rounded-[var(--primitive-radius-base6)] text-12 font-medium leading-16"
            variant="muted"
            appearance="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="min-w-[80px] w-[152px] py-2 px-3 rounded-[var(--primitive-radius-base6)] text-12 font-medium leading-16"
            variant="error"
            onClick={handleSubmit}
          >
            Rebuild
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <Tabs
          activeTabId={imageTab}
          onChange={(id) => {
            setImageTab(id as 'public' | 'private' | 'shared');
            setCurrentPage(1);
            setSelectedRows([]);
            setSearchQuery('');
          }}
          size="sm"
          variant="line"
        >
          <Tab id="public" label="Public">
            {renderImageBody()}
          </Tab>
          <Tab id="private" label="Private">
            {renderImageBody()}
          </Tab>
          <Tab id="shared" label="Shared">
            {renderImageBody()}
          </Tab>
        </Tabs>
      </div>
    </Overlay.Template>
  );
}
