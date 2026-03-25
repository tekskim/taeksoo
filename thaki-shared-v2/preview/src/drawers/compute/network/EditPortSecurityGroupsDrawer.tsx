import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface SecurityGroupRow {
  id: string;
  name: string;
  description: string;
  rulesCount: number;
  [key: string]: unknown;
}

export interface EditPortSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portName?: string;
  initialSelectedIds?: string[];
}

const ITEMS_PER_PAGE = 5;

const mockSecurityGroups: SecurityGroupRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `psg-${i + 1}`,
  name: `sg-${['default', 'web', 'api', 'db', 'bastion'][i % 5]}-${i + 1}`,
  description:
    i % 2 === 0 ? 'Ingress from application tier only.' : 'Egress allowed to metadata service.',
  rulesCount: 3 + (i % 6),
}));

export function EditPortSecurityGroupsDrawer({
  isOpen,
  onClose,
  portName = 'my-port',
  initialSelectedIds = [],
}: EditPortSecurityGroupsDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [portSecurityEnabled, setPortSecurityEnabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPortSecurityEnabled(true);
      setSelectedRows([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, initialSelectedIds.join(',')]);

  const filtered = useMemo(
    () =>
      mockSecurityGroups.filter((sg) =>
        [sg.name, sg.description, String(sg.rulesCount)].some((field) =>
          String(field).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [searchQuery]
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

  const handleRemove = (id: string | number) => {
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  const selectedItems = mockSecurityGroups.filter((sg) => selectedRows.includes(sg.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'rulesCount', header: 'Rules count', sortable: true, align: 'right' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage security groups"
      description="When disabled, no security groups will be applied, and anti-spoofing checks are turned off."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Port name" values={[portName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Port security enabled</span>
            <span className="text-12 text-text-muted">
              When enabled, security group rules apply to this port.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              checked={portSecurityEnabled}
              onChange={(e) => setPortSecurityEnabled(e.target.checked)}
            />
            <span className="text-12 text-text">{portSecurityEnabled ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Security groups</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select one or more security groups.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search security groups"
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
            <SelectableTable<SecurityGroupRow>
              columns={columns}
              rows={paginated}
              selectionType="checkbox"
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
                    <span className="line-clamp-2">{row.description}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.rulesCount}
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
              {selectedItems.length === 0 ? (
                <span className="text-11 text-text-muted">No security groups selected</span>
              ) : (
                selectedItems.map((item) => (
                  <Tag
                    key={item.id}
                    label={item.name}
                    variant="multiSelect"
                    onClose={() => handleRemove(item.id)}
                  />
                ))
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select at least one security group.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
