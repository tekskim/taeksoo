import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  Pagination,
  Chip,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
  Modal,
  InlineMessage,
  Radio,
  RadioGroup,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { useContainerMode } from '@/contexts/ContainerModeContext';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Cluster {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  cpu: string;
  memory: string;
  pods: string;
  createdAt: string;
  /** Container Platform 모드 전용(D-27): created = CP에서 생성/삭제, registered = 등록으로 편입. */
  type?: 'created' | 'registered';
  /** Container Platform 전용(D-29): 생성 시 선택한 기반. */
  foundation?: 'VM' | 'Bare metal';
  /** Container Platform 전용(D-30): 생성 후 사용자가 선택하는 용도. 미지정이면 undefined. */
  usage?: 'General' | 'Metis' | 'Maxis';
}

type ClusterUsage = NonNullable<Cluster['usage']>;

const USAGE_THEME: Record<ClusterUsage, 'blue' | 'green' | 'yellow'> = {
  General: 'blue',
  // managed-by 배지(containerManagedBy.tsx)와 같은 색: Maxis=green, Metis=yellow
  Maxis: 'green',
  Metis: 'yellow',
};

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusters: Cluster[] = [
  {
    id: 'cluster-001',
    name: 'production-kubernetes-high-availability-cluster',
    status: 'Provisioned',
    kubernetesVersion: 'v1.34',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    createdAt: 'Nov 11, 2026 08:30:18',
    foundation: 'VM',
    usage: 'General',
  },
  {
    id: 'cluster-002',
    name: 'staging-development-testing-environment-cluster',
    status: 'Failed',
    kubernetesVersion: 'v1.33.4',
    cpu: '4 cores',
    memory: '8 GiB',
    pods: '23/110',
    createdAt: 'Oct 6, 2026 21:25:53',
    foundation: 'VM',
    usage: 'General',
  },
  {
    id: 'cluster-003',
    name: 'production-microservices-platform-cluster',
    status: 'Provisioning',
    kubernetesVersion: 'v1.32.2',
    cpu: '16 cores',
    memory: '32 GiB',
    pods: '89/110',
    createdAt: 'Sep 15, 2026 12:22:26',
    // 방금 생성한 클러스터 — 용도 미지정(D-30: 용도는 생성 후 선택)
    foundation: 'Bare metal',
  },
  {
    id: 'cluster-004',
    name: 'staging-integration-testing-environment-cluster',
    status: 'Deleting',
    kubernetesVersion: 'v1.33.1',
    cpu: '4 cores',
    memory: '8 GiB',
    pods: '12/110',
    createdAt: 'Aug 20, 2026 23:27:51',
    foundation: 'VM',
    usage: 'General',
  },
  {
    id: 'cluster-005',
    name: 'development-sandbox-experimental-cluster',
    status: 'Unknown',
    kubernetesVersion: 'v1.31.0',
    cpu: '2 cores',
    memory: '4 GiB',
    pods: '5/110',
    createdAt: 'Jul 10, 2026 01:17:01',
    foundation: 'VM',
  },
  {
    id: 'cluster-006',
    name: 'analytics-data-processing-pipeline-cluster',
    status: 'Updating',
    kubernetesVersion: 'v1.33.4',
    cpu: '12 cores',
    memory: '24 GiB',
    pods: '67/110',
    createdAt: 'Jun 5, 2026 15:42:33',
    foundation: 'Bare metal',
    usage: 'General',
  },
];

// Container Platform에서만 보이는 Metis/Maxis 전용 클러스터.
// D-30(소륜님 미팅): 전용 클러스터도 CP가 직접 프로비저닝하고, 용도는 생성 후 선택한다.
// 등록(registered)으로 편입된 행도 존치 — 외부 클러스터 등록 절차(D-27)의 존치 여부는 미결(GAP).
const registeredClusters: Cluster[] = [
  {
    id: 'cluster-reg-001',
    name: 'metis-train-a100',
    status: 'Provisioned',
    kubernetesVersion: 'v1.28.9',
    cpu: '256 cores',
    memory: '2048 GiB',
    pods: '24/110',
    createdAt: 'May 2, 2026 10:12:44',
    foundation: 'Bare metal',
    usage: 'Maxis',
  },
  {
    id: 'cluster-reg-002',
    name: 'metis-serving',
    status: 'Provisioned',
    kubernetesVersion: 'v1.28.9',
    cpu: '128 cores',
    memory: '1024 GiB',
    pods: '15/110',
    createdAt: 'Apr 18, 2026 16:40:02',
    foundation: 'Bare metal',
    usage: 'Metis',
  },
  {
    id: 'cluster-reg-003',
    name: 'metis-dev',
    status: 'Unknown',
    kubernetesVersion: 'v1.30.1',
    cpu: '48 cores',
    memory: '256 GiB',
    pods: '9/110',
    createdAt: 'Jun 30, 2026 09:05:19',
    type: 'registered',
    foundation: 'VM',
    usage: 'Maxis',
  },
];

const AGENT_INSTALL_COMMAND =
  'curl -sfL https://cp.thakicloud.io/agent/install.sh | sh -s -- --token <registration-token>';

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ClusterManagementPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const { isMetis, isPlatform } = useContainerMode();
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const [registerOpen, setRegisterOpen] = useState(false);
  // 용도 지정(D-30): 생성 후 선택. 목업에서는 지정 결과를 로컬 상태로 반영한다.
  const [usageOverrides, setUsageOverrides] = useState<Record<string, ClusterUsage>>({});
  const [assignTarget, setAssignTarget] = useState<Cluster | null>(null);
  const [assignChoice, setAssignChoice] = useState<ClusterUsage>('General');

  // Update tab label to match the page title
  useEffect(() => {
    updateActiveTabLabel('Clusters');
  }, [updateActiveTabLabel]);

  // Container Platform은 CP 프로비저닝 + 등록 편입이 한 목록; 다른 모드는 기존 그대로.
  const allClusters = (isPlatform ? [...mockClusters, ...registeredClusters] : mockClusters).map(
    (c) => (usageOverrides[c.id] ? { ...c, usage: usageOverrides[c.id] } : c)
  );

  // Pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(allClusters.length / rowsPerPage);
  const paginatedClusters = allClusters.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sidebar width calculation: 40px icon sidebar + 200px menu sidebar when open
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Table columns
  const allColumns: TableColumn<Cluster>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (status) => (
        <Tooltip content={status}>
          <Badge
            theme={getContainerStatusTheme(status)}
            type="subtle"
            size="sm"
            className="max-w-[80px]"
          >
            <span className="truncate">{status}</span>
          </Badge>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value, row) => (
        <Link
          to={`/container/cluster-management/${row.id}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          title={value as string}
          onClick={(e) => e.stopPropagation()}
        >
          {value as string}
        </Link>
      ),
    },
    // Container Platform 전용: 용도(D-30)·기반(D-29) 구분
    ...(isPlatform
      ? ([
          {
            key: 'usage',
            label: 'Type',
            width: fixedColumns.statusLabel,
            sortable: false,
            // 표기는 용도 기준(D-28 유지): General = 범용, Metis/Maxis = 전용.
            // 용도는 생성 후 선택하므로(D-30) 지정 전에는 Unassigned.
            render: (value: Cluster['usage']) => (
              <Tooltip
                content={
                  value === undefined
                    ? 'Usage not assigned yet — choose General, Metis, or Maxis after creation'
                    : value === 'General'
                      ? 'General-purpose cluster, managed in Container Platform'
                      : `Dedicated to ${value} workloads — required packages are installed by the in-cluster agent`
                }
              >
                <Badge
                  theme={value === undefined ? 'gray' : USAGE_THEME[value]}
                  type="subtle"
                  size="sm"
                >
                  {value ?? 'Unassigned'}
                </Badge>
              </Tooltip>
            ),
          },
          {
            key: 'foundation',
            label: 'Foundation',
            width: fixedColumns.statusLabel,
            sortable: false,
            // D-29: 생성 시 VM/BM 중 선택 — 인터페이스는 동일, 백그라운드만 다름.
            render: (value: Cluster['foundation']) => (
              <span className="text-body-sm text-[var(--color-text-default)]">{value ?? '—'}</span>
            ),
          },
        ] as TableColumn<Cluster>[])
      : []),
    {
      key: 'kubernetesVersion',
      label: 'Kubernetes version',
      flex: 1,
      minWidth: columnMinWidths.kubernetesVersion,
      sortable: true,
    },
    { key: 'cpu', label: 'CPU', flex: 1, minWidth: columnMinWidths.cpu, sortable: true },
    { key: 'memory', label: 'Memory', flex: 1, minWidth: columnMinWidths.memory, sortable: true },
    { key: 'pods', label: 'Pods', flex: 1, minWidth: columnMinWidths.pods, sortable: true },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'kubectl-shell',
            label: 'Kubectl Shell',
            onClick: () => console.log('Kubectl Shell for', row.name),
          },
          {
            id: 'download-kubeconfig',
            label: 'Download KubeConfig',
            onClick: () => console.log('Download KubeConfig for', row.name),
          },
          {
            id: 'copy-kubeconfig',
            label: 'Copy KubeConfig to Clipboard',
            onClick: () => console.log('Copy KubeConfig for', row.name),
          },
          {
            id: 'view-yaml',
            label: 'View YAML',
            onClick: () => console.log('View YAML for', row.name),
          },
          {
            id: 'download-yaml',
            label: 'Download YAML',
            onClick: () => console.log('Download YAML for', row.name),
          },
          // 용도 지정(D-30): 생성 후 선택 — 미지정 클러스터에만 노출. 지정 후 변경 가능 여부는 미결(GAP).
          ...(isPlatform && row.usage === undefined
            ? [
                {
                  id: 'assign-usage',
                  label: 'Assign usage',
                  onClick: () => {
                    setAssignChoice('General');
                    setAssignTarget(row);
                  },
                },
              ]
            : []),
          {
            id: 'customize-appearance',
            label: 'Customize appearance',
            divider: true,
            onClick: () =>
              setTimeout(() =>
                window.dispatchEvent(new CustomEvent('open-cluster-appearance', { detail: row.id }))
              ),
          },
          // 등록형은 삭제 대신 등록 해제(D-27) — 클러스터 자체는 CP 밖에서 만들고 지운다.
          row.type === 'registered'
            ? {
                id: 'deregister',
                label: 'Deregister',
                status: 'danger' as const,
                onClick: () => console.log('Deregister', row.name),
              }
            : {
                id: 'delete',
                label: 'Delete',
                status: 'danger' as const,
                onClick: () => console.log('Delete', row.name),
              },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                aria-label="Row actions"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  const columns = isMetis ? allColumns.filter((c) => c.key !== 'actions') : allColumns;

  // Create menu items
  const createMenuItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create as form',
      onClick: () => navigate('/container/cluster-management/create'),
    },
  ];

  // Metis Container has no Cluster Management page — block direct access.
  if (isMetis) {
    return <Navigate to="/container" replace />;
  }

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Cluster management', href: '/container/cluster-management' },
                { label: 'Clusters' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Clusters"
          actions={
            !isMetis ? (
              <>
                {isPlatform && (
                  <Button variant="secondary" size="md" onClick={() => setRegisterOpen(true)}>
                    Register cluster
                  </Button>
                )}
                <ContextMenu items={createMenuItems} trigger="click" align="right">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<IconChevronDown size={14} stroke={1.5} />}
                  >
                    Create cluster
                  </Button>
                </ContextMenu>
              </>
            ) : undefined
          }
        />

        {/* Toolbar */}
        <div className="flex flex-col gap-2">
          {/* Action Bar */}
          <HStack gap={2} align="center" className="w-full min-h-7">
            {/* Search */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search clusters with attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Download"
                className="!p-0 !w-7 !h-7 !min-w-7"
              >
                <IconDownload size={12} stroke={1.5} />
              </Button>
            </HStack>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--color-border-default)]" />

            {/* Actions */}
            <HStack gap={1} align="center">
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedClusters.length === 0}
              >
                Download KubeConfig
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconDownload size={12} stroke={1.5} />}
                disabled={selectedClusters.length === 0}
              >
                Download YAML
              </Button>
              {!isMetis && (
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} stroke={1.5} />}
                  disabled={selectedClusters.length === 0}
                >
                  Delete
                </Button>
              )}
            </HStack>
          </HStack>

          {/* Filter Bar */}
          {filters.length > 0 && (
            <HStack
              gap={2}
              justify="between"
              align="center"
              className="w-full pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]"
            >
              <HStack gap={1} align="center">
                {filters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter.key}
                    value={filter.value}
                    onRemove={() => handleRemoveFilter(index)}
                  />
                ))}
              </HStack>
              <button
                onClick={handleClearFilters}
                className="text-[11px] text-label-md text-[var(--color-action-primary)] hover:underline"
              >
                Clear filters
              </button>
            </HStack>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={allClusters.length}
          selectedCount={selectedClusters.length}
        />

        {/* Table */}
        <Table<Cluster>
          columns={columns}
          data={paginatedClusters}
          rowKey="id"
          selectable={!isMetis}
          selectedKeys={isMetis ? [] : selectedClusters}
          onSelectionChange={isMetis ? undefined : setSelectedClusters}
        />
      </VStack>

      {/* Register cluster — 등록형 편입 진입점 (Container Platform 전용, D-27) */}
      {isPlatform && (
        <Modal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          title="Register cluster"
          description="Bring an existing cluster under Container Platform management. Registered clusters join the list alongside clusters provisioned here."
        >
          <VStack gap={3} className="w-[520px] max-w-full">
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Manual</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">
                Run the agent install command on the target cluster. The agent reports facts
                (version, nodes, capacity); you only declare intent metadata.
              </span>
              <code className="text-body-sm font-mono bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-md px-3 py-2 break-all">
                {AGENT_INSTALL_COMMAND}
              </code>
            </VStack>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Automated</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">
                Provisioning pipelines can register clusters automatically with the same agent, no
                manual step required.
              </span>
            </VStack>
            <InlineMessage variant="info">
              The Metis/Maxis agent stack deploys into tkai-* namespaces and appears in workload
              lists like any other resource.
            </InlineMessage>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setRegisterOpen(false)}>
                Close
              </Button>
            </div>
          </VStack>
        </Modal>
      )}

      {/* Assign usage — 용도는 생성 후 선택(D-30, Container Platform 전용) */}
      {isPlatform && (
        <Modal
          isOpen={assignTarget !== null}
          onClose={() => setAssignTarget(null)}
          title="Assign usage"
          description={`Choose how ${assignTarget?.name ?? ''} will be used. Usage is assigned after the cluster is created.`}
        >
          <VStack gap={3} className="w-[520px] max-w-full">
            <RadioGroup
              value={assignChoice}
              onChange={(value) => setAssignChoice(value as ClusterUsage)}
            >
              <Radio value="General" label="General — use it freely for any workload" />
              <Radio
                value="Metis"
                label="Metis — dedicated to Metis (inference serving) workloads"
              />
              <Radio value="Maxis" label="Maxis — dedicated to Maxis (training) workloads" />
            </RadioGroup>
            <InlineMessage variant="info">
              {assignChoice === 'General'
                ? 'No additional packages are required for a general-purpose cluster.'
                : `The in-cluster agent pulls and installs the packages ${assignChoice} needs, and the deployed components are registered. The agent stack runs in tkai-* namespaces.`}
            </InlineMessage>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setAssignTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (assignTarget) {
                    setUsageOverrides((prev) => ({ ...prev, [assignTarget.id]: assignChoice }));
                  }
                  setAssignTarget(null);
                }}
              >
                Assign
              </Button>
            </div>
          </VStack>
        </Modal>
      )}
    </PageShell>
  );
}

export default ClusterManagementPage;
