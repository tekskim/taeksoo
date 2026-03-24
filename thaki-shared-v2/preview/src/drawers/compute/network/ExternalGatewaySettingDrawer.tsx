import { useState, useEffect, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface ExternalNetRow {
  id: string;
  name: string;
  type: string;
  subnets: string;
  status: 'active' | 'error' | 'pending';
  [key: string]: unknown;
}

export interface ExternalGatewaySettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName?: string;
}

const mockExternalNetworks: ExternalNetRow[] = [
  { id: 'ext-1', name: 'public-pool-a', type: 'Flat', subnets: '2', status: 'active' },
  { id: 'ext-2', name: 'ext-gw-dmz', type: 'VLAN', subnets: '1', status: 'active' },
  { id: 'ext-3', name: 'nat-shared-01', type: 'Flat', subnets: '3', status: 'active' },
  { id: 'ext-4', name: 'legacy-uplink', type: 'Flat', subnets: '1', status: 'error' },
  { id: 'ext-5', name: 'staging-edge', type: 'VXLAN', subnets: '2', status: 'pending' },
];

export function ExternalGatewaySettingDrawer({
  isOpen,
  onClose,
  routerName = 'my-router',
}: ExternalGatewaySettingDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [enabled, setEnabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const itemsPerPage = 10;
  const pageRows = mockExternalNetworks;

  useEffect(() => {
    if (isOpen) {
      setEnabled(true);
      setSelectedRows([]);
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (enabled && selectedRows.length === 0) return;
    onClose();
  };

  const selected = mockExternalNetworks.find((n) => selectedRows.includes(n.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'subnets', header: 'Subnets', align: 'right' },
    { key: 'status', header: 'Status', align: 'center' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="External gateway setting"
      description="Configure the external gateway for this router."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Router name" values={[routerName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Enable external gateway</span>
            <span className="text-12 text-text-muted">
              Attach the router to an external network for north-south traffic.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span className="text-12 text-text">{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        {enabled && (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-[3px]">
                <span className="text-13 font-medium text-text leading-5">External network</span>
                <span className="text-13 font-medium text-danger leading-5">*</span>
              </div>
              <p className="text-12 text-text-muted">Select one external network.</p>
            </div>

            <Pagination
              totalCount={pageRows.length}
              size={itemsPerPage}
              currentAt={currentPage}
              onPageChange={setCurrentPage}
              totalCountLabel="items"
            />

            <div className="flex flex-col gap-2 w-full">
              <SelectableTable<ExternalNetRow>
                columns={columns}
                rows={pageRows}
                selectionType="radio"
                selectedRows={selectedRows}
                onRowSelectionChange={setSelectedRows}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
              >
                {pageRows.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={columns[0]}>
                      {row.name}
                    </Table.Td>
                    <Table.Td rowData={row} column={columns[1]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={columns[2]}>
                      {row.subnets}
                    </Table.Td>
                    <Table.Td rowData={row} column={columns[3]}>
                      <StatusIndicator
                        variant={
                          row.status === 'active'
                            ? 'active'
                            : row.status === 'error'
                              ? 'error'
                              : 'pending'
                        }
                        label={
                          row.status === 'active'
                            ? 'Active'
                            : row.status === 'error'
                              ? 'Error'
                              : 'Pending'
                        }
                      />
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
                  <span className="text-11 text-text-muted">No external network selected</span>
                ) : (
                  <Tag
                    label={selected.name}
                    variant="multiSelect"
                    onClose={() => setSelectedRows([])}
                  />
                )}
              </div>
              {hasAttemptedSubmit && selectedRows.length === 0 && (
                <p className="text-11 text-danger" role="alert">
                  Please select an external network.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Overlay.Template>
  );
}
