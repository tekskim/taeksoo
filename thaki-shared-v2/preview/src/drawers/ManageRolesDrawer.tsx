import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../hooks/useDrawerAnimation';

interface RoleItem {
  id: string;
  name: string;
  type: string;
  policies: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface ManageRolesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialSelectedIds?: string[];
}

const defaultRoles: RoleItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `role-${i + 1}`,
  name: 'viewer',
  type: 'Built-in',
  policies: 'ReadCompute (+2)',
  createdAt: 'Sep 12, 2025 15:43:35',
}));

const ITEMS_PER_PAGE = 5;

export function ManageRolesDrawer({
  isOpen,
  onClose,
  userName = 'thaki.kim',
  initialSelectedIds = [],
}: ManageRolesDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const filteredRoles = useMemo(
    () =>
      defaultRoles.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.policies.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);
  const paginatedRoles = filteredRoles.slice(
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

  const selectedItems = defaultRoles.filter((r) => selectedRows.includes(r.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'policies', header: 'Policies' },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage roles"
      description="Manages roles directly assigned to the user. The user receives permissions from both direct assignments and roles inherited from groups."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="User" values={[userName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Roles</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">
              Select roles to assign to this user. If a role's permissions change, the user's
              permissions are updated automatically.
            </p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles by attributes"
              size="sm"
            />
          </div>

          <Pagination
            totalCount={filteredRoles.length}
            size={ITEMS_PER_PAGE}
            currentAt={currentPage}
            onPageChange={setCurrentPage}
            totalCountLabel="items"
          />

          <div className="flex flex-col gap-2 w-full">
            <SelectableTable<RoleItem>
              columns={columns}
              rows={paginatedRoles}
              selectionType="checkbox"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paginatedRoles.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <span className="text-primary font-medium">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.type}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.policies}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
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
                <span className="text-11 text-text-muted">No items selected</span>
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
                Please select at least one role.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
