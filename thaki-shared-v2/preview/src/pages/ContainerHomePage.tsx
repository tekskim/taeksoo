import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@shared/components/Table';
import { Button } from '@shared/components/Button';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconDotsCircleHorizontal, IconSettings, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ClusterRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  createdAt: string;
  cpu: string;
  memory: string;
  pods: string;
  manage: string;
  actions: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const clustersData: ClusterRow[] = [
  {
    id: '1',
    name: 'ClusterName',
    status: 'OK',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '2',
    name: 'ClusterName',
    status: 'OK',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
];

const clusterFilterKeys: FilterKey[] = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'kubernetesVersion', label: 'Kubernetes Version' },
  { key: 'cpu', label: 'CPU' },
  { key: 'memory', label: 'Memory' },
];

/* ----------------------------------------
   Container Home Page
   ---------------------------------------- */

export function ContainerHomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const navigate = useNavigate();

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((index: number) => {
    setAppliedFilters((prev) => prev.filter((_, i) => i !== index));
    setCurrentPage(1);
  }, []);

  const filteredClusters = useMemo(() => {
    if (appliedFilters.length === 0) return clustersData;
    return clustersData.filter((row) =>
      appliedFilters.every((f) => {
        const val = String(row[f.key] ?? '').toLowerCase();
        return val.includes(f.value.toLowerCase());
      })
    );
  }, [appliedFilters]);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: '120px' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'kubernetesVersion', header: 'Kubernetes Version', sortable: true },
    { key: 'cpu', header: 'CPU', sortable: true },
    { key: 'memory', header: 'Memory', sortable: true },
    { key: 'pods', header: 'Pods', sortable: true },
    { key: 'createdAt', header: 'Created At', sortable: true },
    { key: 'manage', header: 'Manage', width: '120px' },
    { key: 'actions', header: 'Action', width: '72px', align: 'center' },
  ];

  const col = (key: string) => columns.find((c) => c.key === key)!;

  return (
    <div className="flex flex-col gap-6 min-w-[1176px]">
      <div className="p-4 rounded-lg border border-border bg-surface-subtle">
        <div className="flex flex-col gap-2">
          <h1 className="text-18 font-semibold text-text">Welcome to Thaki Cloud Container</h1>
          <p className="text-14 leading-20 text-text-muted">
            Manage effortlessly, scale and optimize your Kubernetes clusters, workloads, and
            resources from a single platform.
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 p-4 rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-14 font-semibold leading-20 m-0">Clusters</h6>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <FilterSearchInput
                filterKeys={clusterFilterKeys}
                onFilterAdd={handleFilterAdd}
                placeholder="Search clusters by attributes"
                size="sm"
              />
            </div>
            {appliedFilters.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {appliedFilters.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded bg-surface-muted text-11 leading-4 text-text"
                  >
                    <span className="text-text-subtle">{f.label}:</span>
                    <span>{f.value}</span>
                    <button
                      type="button"
                      onClick={() => handleFilterRemove(i)}
                      className="inline-flex items-center justify-center p-0 border-none bg-transparent cursor-pointer text-text-subtle hover:text-text"
                    >
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFilters([]);
                    setCurrentPage(1);
                  }}
                  className="text-11 leading-4 text-primary hover:underline cursor-pointer border-none bg-transparent px-1"
                >
                  Clear Filters
                </button>
              </div>
            )}
            <Pagination
              totalCount={filteredClusters.length}
              size={10}
              currentAt={currentPage}
              onPageChange={setCurrentPage}
              totalCountLabel="items"
            />
            <Table columns={columns} rows={filteredClusters}>
              {filteredClusters.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={col('status')} preventClickPropagation>
                    <div className="min-w-0 flex">
                      <Tooltip content={row.status}>
                        <Badge theme="white" size="sm" className="max-w-[80px]">
                          <span className="truncate">{row.status}</span>
                        </Badge>
                      </Tooltip>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={col('name')}>
                    <div className="min-w-0">
                      <span
                        className="text-primary font-medium cursor-pointer hover:underline truncate block"
                        title={row.name}
                        onClick={() => navigate('/container/dashboard')}
                      >
                        {row.name}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={col('kubernetesVersion')}>
                    {row.kubernetesVersion}
                  </Table.Td>
                  <Table.Td rowData={row} column={col('cpu')}>
                    {row.cpu}
                  </Table.Td>
                  <Table.Td rowData={row} column={col('memory')}>
                    {row.memory}
                  </Table.Td>
                  <Table.Td rowData={row} column={col('pods')}>
                    {row.pods}
                  </Table.Td>
                  <Table.Td rowData={row} column={col('createdAt')}>
                    {row.createdAt}
                  </Table.Td>
                  <Table.Td rowData={row} column={col('manage')} preventClickPropagation>
                    <div className="flex justify-center">
                      <Button
                        appearance="outline"
                        variant="muted"
                        size="sm"
                        onClick={() => navigate(`/container/clusters/${row.id}`)}
                      >
                        <IconSettings size={12} />
                        Manage
                      </Button>
                    </div>
                  </Table.Td>
                  <Table.Td rowData={row} column={col('actions')} preventClickPropagation>
                    <div className="flex items-center justify-center">
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            onClick={toggle}
                            className="p-1.5 rounded hover:bg-surface-hover transition-colors border-none bg-transparent cursor-pointer"
                            aria-label="Row actions"
                          >
                            <IconDotsCircleHorizontal
                              size={16}
                              className="text-text-muted"
                              stroke={1.5}
                            />
                          </button>
                        )}
                      >
                        <ContextMenu.Item action={() => {}}>Kubectl Shell</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Download KubeConfig</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>
                          Copy KubeConfig to Clipboard
                        </ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>View YAML</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Download YAML</ContextMenu.Item>
                        <ContextMenu.Item danger action={() => {}}>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </div>

        <div className="w-[320px] shrink-0 p-4 rounded-lg border border-border bg-surface">
          <div className="flex flex-col gap-4">
            <h3 className="text-16 font-semibold leading-6 text-text m-0">Create a cluster</h3>
            <p className="text-12 leading-18 text-text-muted leading-relaxed m-0">
              Create a Kubernetes cluster to start running and managing your containerized
              workloads.
            </p>
            <div className="w-full flex justify-end">
              <Button variant="primary" size="md">
                Create cluster
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
