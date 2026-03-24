import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

interface PolicyItem {
  id: string;
  name: string;
  type: string;
  resources: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface ManagePoliciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleName?: string;
  initialSelectedIds?: string[];
}

const POLICY_NAMES = [
  'ReadCompute',
  'WriteCompute',
  'ReadIAM',
  'WriteIAM',
  'ReadStorage',
  'AdminFull',
  'NetworkViewer',
  'NetworkAdmin',
  'AuditRead',
  'KeyManager',
  'VolumeOps',
  'SnapshotPolicy',
  'LoadBalancerRead',
  'LoadBalancerWrite',
  'DNSRead',
  'DNSWrite',
  'MetricsRead',
  'LogRead',
  'BillingRead',
  'SupportRead',
  'TaggingPolicy',
  'EncryptionPolicy',
  'BackupPolicy',
  'ComplianceRead',
  'CustomAPI',
];

const TYPES = ['Built-in', 'Custom', 'Built-in'];
const RESOURCE_SAMPLES = [
  'Compute (+3)',
  'IAM (+1)',
  'Storage (+2)',
  'All resources',
  'Compute, Network (+4)',
  'IAM, Audit (+2)',
];

const defaultPolicies: PolicyItem[] = Array.from({ length: 25 }, (_, i) => {
  const type = TYPES[i % TYPES.length];
  return {
    id: `policy-${i + 1}`,
    name: POLICY_NAMES[i] ?? `policy-${i + 1}`,
    type,
    resources: RESOURCE_SAMPLES[i % RESOURCE_SAMPLES.length],
    createdAt: `Mar ${String((i % 28) + 1).padStart(2, '0')}, 2025 ${10 + (i % 10)}:${String(i % 60).padStart(2, '0')}:00`,
  };
});

const ITEMS_PER_PAGE = 5;

export function ManagePoliciesDrawer({
  isOpen,
  onClose,
  roleName = 'viewer',
  initialSelectedIds = [],
}: ManagePoliciesDrawerProps) {
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

  const filteredPolicies = useMemo(
    () =>
      defaultPolicies.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.resources.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const paginatedPolicies = filteredPolicies.slice(
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

  const selectedItems = defaultPolicies.filter((p) => selectedRows.includes(p.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'resources', header: 'Resources' },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage policies"
      description="Manages policies assigned to this role. Policies define what API actions and resources the role can access."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Role name" values={[roleName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Policies</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">
              Select policies to assign to this role. Changes apply after you save.
            </p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies by attributes"
              size="sm"
            />
          </div>

          <Pagination
            totalCount={filteredPolicies.length}
            size={ITEMS_PER_PAGE}
            currentAt={currentPage}
            onPageChange={setCurrentPage}
            totalCountLabel="items"
          />

          <div className="flex flex-col gap-2 w-full">
            <SelectableTable<PolicyItem>
              columns={columns}
              rows={paginatedPolicies}
              selectionType="checkbox"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paginatedPolicies.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <span className="text-primary font-medium">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.type}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.resources}
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
                Please select at least one policy.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
