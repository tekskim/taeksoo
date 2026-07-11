import { useState, useMemo } from 'react';
import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  Badge,
  Button,
  Tooltip,
  Table,
  Tabs,
  TabList,
  Tab,
  Pagination,
  ListToolbar,
  FilterSearchInput,
  type AppliedFilter,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { useNavigate } from 'react-router-dom';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import {
  inferenceServices,
  trainingJobs,
  notebooks,
  getDevspaces,
  getPlatformStatusTheme,
  getManagedByTheme,
} from './containerPlatformMockData';
import type {
  InferenceService,
  TrainingJob,
  Notebook,
  NotebookState,
  WorkloadStatus,
  Devspace,
  DevspaceState,
  ManagedBy,
} from './containerPlatformTypes';

/* ----------------------------------------
   AI Workloads (observed, not managed — the substrate seam)

   Container Platform is the substrate: these AI workloads RUN on it, but the
   owning products MANAGE them (training -> Maxis, serving -> Metis). This page
   is therefore attribution + drill-out only:
     - each row carries a "Managed by" badge (same theme map as WorkloadsPage)
     - an "Open in {product} ↗" affordance signals "manage elsewhere" (Model A
       seam) — Maxis/Metis are separate apps, so it never navigates a broken route
   Dev Spaces are the exception: they are hosted BY Container Platform and use the
   shared /path/to pod-access routing, so they have no drill-out.

   Each tab is a read-only TDS Table with name search + cluster/state filters and
   client-side pagination (mirrors ClustersPage mechanics). Tab change resets
   search, filters, and page.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

type Segment = 'inference' | 'training' | 'notebooks' | 'devspaces';

const WORKLOAD_STATUS_OPTIONS: { value: WorkloadStatus; label: string }[] = [
  { value: 'Running', label: 'Running' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Failed', label: 'Failed' },
  { value: 'Succeeded', label: 'Succeeded' },
];

const NOTEBOOK_STATE_OPTIONS: { value: NotebookState; label: string }[] = [
  { value: 'Running', label: 'Running' },
  { value: 'Idle', label: 'Idle' },
  { value: 'Stopped', label: 'Stopped' },
];

const DEVSPACE_STATE_OPTIONS: { value: DevspaceState; label: string }[] = [
  { value: 'Running', label: 'Running' },
  { value: 'Idle', label: 'Idle' },
  { value: 'Stopped', label: 'Stopped' },
];

const devspaces = getDevspaces();

/** Cluster filter options derived from the rows actually present in a segment. */
function clusterOptionsFrom(items: { clusterId: string; clusterName: string }[]) {
  const seen = new Map<string, string>();
  items.forEach((i) => seen.set(i.clusterId, i.clusterName));
  return Array.from(seen, ([value, label]) => ({ value, label }));
}

const INFERENCE_CLUSTER_OPTIONS = clusterOptionsFrom(inferenceServices);
const TRAINING_CLUSTER_OPTIONS = clusterOptionsFrom(trainingJobs);
const NOTEBOOK_CLUSTER_OPTIONS = clusterOptionsFrom(notebooks);
const DEVSPACE_CLUSTER_OPTIONS = clusterOptionsFrom(devspaces);

const NameCell = (value: string) => (
  <span className="text-[var(--color-text-default)] font-medium truncate block" title={value}>
    {value}
  </span>
);

const TruncCell = (value: string) => (
  <span className="truncate block" title={value}>
    {value}
  </span>
);

/** Attribution badge — constant per tab (CP just hosts these). Solid so it reads
 * as attribution, distinct from the subtle status badges. */
const managedByCell = (product: ManagedBy) => (
  <Badge theme={getManagedByTheme(product)} type="solid" size="sm">
    {product}
  </Badge>
);

/**
 * Drill-out affordance (Model A seam). Maxis/Metis are separate apps not present
 * in this mockup, so this is a visual "manage elsewhere" signal — it never
 * navigates a broken route. Hover surfaces where the workload is actually managed.
 */
function DrillOutButton({ product }: { product: 'Maxis' | 'Metis' }) {
  return (
    <Tooltip content={`Managed in ${product} (separate app)`} position="left">
      <Button type="button" variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
        {`Open in ${product} ↗`}
      </Button>
    </Tooltip>
  );
}

const inferenceColumns: TableColumn<InferenceService>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    sortable: true,
    render: NameCell,
  },
  { key: 'model', label: 'Model', flex: 1, minWidth: columnMinWidths.model, render: TruncCell },
  { key: 'framework', label: 'Framework', flex: 1, minWidth: columnMinWidths.type },
  {
    key: 'clusterName',
    label: 'Cluster',
    flex: 1,
    minWidth: columnMinWidths.node,
    render: TruncCell,
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: (value: WorkloadStatus) => (
      <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
        {value}
      </Badge>
    ),
  },
  { key: 'gpuCount', label: 'GPUs', flex: 1, minWidth: columnMinWidths.gpu, sortable: true },
  {
    key: 'managedBy',
    label: 'Managed by',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: () => managedByCell('Metis'),
  },
  {
    key: 'actions',
    label: '',
    width: fixedColumns.actions,
    align: 'right',
    resizable: false,
    render: () => <DrillOutButton product="Metis" />,
  },
];

const trainingColumns: TableColumn<TrainingJob>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    sortable: true,
    render: NameCell,
  },
  {
    key: 'clusterName',
    label: 'Cluster',
    flex: 1,
    minWidth: columnMinWidths.node,
    render: TruncCell,
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: (value: WorkloadStatus) => (
      <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
        {value}
      </Badge>
    ),
  },
  { key: 'gpuCount', label: 'GPUs', flex: 1, minWidth: columnMinWidths.gpu, sortable: true },
  {
    key: 'progressPct',
    label: 'Progress',
    flex: 1,
    minWidth: columnMinWidths.usage,
    sortable: true,
    render: (value: number) => `${value}%`,
  },
  { key: 'owner', label: 'Owner', flex: 1, minWidth: columnMinWidths.owner, render: TruncCell },
  {
    key: 'managedBy',
    label: 'Managed by',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: () => managedByCell('Maxis'),
  },
  {
    key: 'actions',
    label: '',
    width: fixedColumns.actions,
    align: 'right',
    resizable: false,
    render: () => <DrillOutButton product="Maxis" />,
  },
];

const notebookColumns: TableColumn<Notebook>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    sortable: true,
    render: NameCell,
  },
  { key: 'owner', label: 'Owner', flex: 1, minWidth: columnMinWidths.owner, render: TruncCell },
  {
    key: 'clusterName',
    label: 'Cluster',
    flex: 1,
    minWidth: columnMinWidths.node,
    render: TruncCell,
  },
  {
    key: 'state',
    label: 'State',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: (value: NotebookState) => (
      <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
        {value}
      </Badge>
    ),
  },
  { key: 'gpuCount', label: 'GPUs', flex: 1, minWidth: columnMinWidths.gpu, sortable: true },
  {
    key: 'managedBy',
    label: 'Managed by',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: () => managedByCell('Maxis'),
  },
  {
    key: 'actions',
    label: '',
    width: fixedColumns.actions,
    align: 'right',
    resizable: false,
    render: () => <DrillOutButton product="Maxis" />,
  },
];

const devspaceColumns: TableColumn<Devspace>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    sortable: true,
    render: NameCell,
  },
  { key: 'owner', label: 'Owner', flex: 1, minWidth: columnMinWidths.owner, render: TruncCell },
  {
    key: 'clusterName',
    label: 'Cluster',
    flex: 1,
    minWidth: columnMinWidths.node,
    render: TruncCell,
  },
  {
    key: 'state',
    label: 'State',
    width: fixedColumns.statusLabel,
    align: 'center',
    resizable: false,
    render: (value: DevspaceState) => (
      <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
        {value}
      </Badge>
    ),
  },
  { key: 'gpuCount', label: 'GPUs', flex: 1, minWidth: columnMinWidths.gpu, sortable: true },
  {
    key: 'accessUrl',
    label: 'Access',
    flex: 1,
    minWidth: columnMinWidths.path,
    // Substrate pod-access route (/path/to...), not an external link — render as a
    // token-styled code string so it reads as an internal routing handle.
    render: (value: string) => (
      <code
        className="font-mono text-body-sm text-[var(--color-text-muted)] truncate block"
        title={value}
      >
        {value}
      </code>
    ),
  },
];

export default function AIWorkloadsPage() {
  const navigate = useNavigate();

  const [segment, setSegment] = useState<Segment>('inference');
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const resetView = () => {
    setPage(1);
    setSearchValue('');
    setAppliedFilters([]);
  };

  const handleSegmentChange = (value: string) => {
    setSegment(value as Segment);
    resetView();
  };

  const clusterFilters = appliedFilters.filter((f) => f.fieldId === 'cluster').map((f) => f.value);
  const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);
  const term = searchValue.trim().toLowerCase();

  const inferenceRows = useMemo(
    () =>
      inferenceServices.filter((s) => {
        if (term && !s.name.toLowerCase().includes(term)) return false;
        if (clusterFilters.length > 0 && !clusterFilters.includes(s.clusterId)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(s.status)) return false;
        return true;
      }),
    [term, clusterFilters, statusFilters]
  );

  const trainingRows = useMemo(
    () =>
      trainingJobs.filter((j) => {
        if (term && !j.name.toLowerCase().includes(term)) return false;
        if (clusterFilters.length > 0 && !clusterFilters.includes(j.clusterId)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(j.status)) return false;
        return true;
      }),
    [term, clusterFilters, statusFilters]
  );

  const notebookRows = useMemo(
    () =>
      notebooks.filter((n) => {
        if (term && !n.name.toLowerCase().includes(term)) return false;
        if (clusterFilters.length > 0 && !clusterFilters.includes(n.clusterId)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(n.state)) return false;
        return true;
      }),
    [term, clusterFilters, statusFilters]
  );

  const devspaceRows = useMemo(
    () =>
      devspaces.filter((d) => {
        if (term && !d.name.toLowerCase().includes(term)) return false;
        if (clusterFilters.length > 0 && !clusterFilters.includes(d.clusterId)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(d.state)) return false;
        return true;
      }),
    [term, clusterFilters, statusFilters]
  );

  const config = {
    inference: {
      total: inferenceRows.length,
      searchPlaceholder: 'Search inference services by name',
      clusterOptions: INFERENCE_CLUSTER_OPTIONS,
      statusFilter: {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: WORKLOAD_STATUS_OPTIONS,
      },
      emptyMessage: 'No inference services found.',
    },
    training: {
      total: trainingRows.length,
      searchPlaceholder: 'Search training jobs by name',
      clusterOptions: TRAINING_CLUSTER_OPTIONS,
      statusFilter: {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: WORKLOAD_STATUS_OPTIONS,
      },
      emptyMessage: 'No training jobs found.',
    },
    notebooks: {
      total: notebookRows.length,
      searchPlaceholder: 'Search notebooks by name',
      clusterOptions: NOTEBOOK_CLUSTER_OPTIONS,
      statusFilter: {
        id: 'status',
        label: 'State',
        type: 'select' as const,
        options: NOTEBOOK_STATE_OPTIONS,
      },
      emptyMessage: 'No notebooks found.',
    },
    devspaces: {
      total: devspaceRows.length,
      searchPlaceholder: 'Search dev spaces by name',
      clusterOptions: DEVSPACE_CLUSTER_OPTIONS,
      statusFilter: {
        id: 'status',
        label: 'State',
        type: 'select' as const,
        options: DEVSPACE_STATE_OPTIONS,
      },
      emptyMessage: 'No dev spaces found.',
    },
  }[segment];

  const totalPages = Math.max(1, Math.ceil(config.total / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const sliceStart = (safePage - 1) * ROWS_PER_PAGE;

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'AI Workloads' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <VStack gap={1}>
          <PageHeader title="AI Workloads" />
          <span className="text-body-sm text-[var(--color-text-muted)]">
            These AI workloads run on the Container Platform substrate. Training is managed in
            Maxis, serving in Metis &mdash; Open &#8599; drills out to the managing product.
          </span>
        </VStack>

        <Tabs value={segment} onChange={handleSegmentChange} variant="boxed">
          <TabList>
            <Tab value="inference">Inference Services</Tab>
            <Tab value="training">Training Jobs</Tab>
            <Tab value="notebooks">Notebooks</Tab>
            <Tab value="devspaces">Dev Spaces</Tab>
          </TabList>
        </Tabs>

        {segment === 'devspaces' && (
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Dev Spaces are hosted by Container Platform; pod access uses the shared /path/to
            routing.
          </span>
        )}

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder={config.searchPlaceholder}
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  {
                    id: 'cluster',
                    label: 'Cluster',
                    type: 'select',
                    options: config.clusterOptions,
                  },
                  config.statusFilter,
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={(next) => {
                  setAppliedFilters(next);
                  setPage(1);
                }}
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={config.total}
        />

        {segment === 'inference' && (
          <Table<InferenceService>
            columns={inferenceColumns}
            data={inferenceRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE)}
            rowKey="id"
            resizable={false}
            emptyMessage={config.emptyMessage}
          />
        )}
        {segment === 'training' && (
          <Table<TrainingJob>
            columns={trainingColumns}
            data={trainingRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE)}
            rowKey="id"
            resizable={false}
            emptyMessage={config.emptyMessage}
          />
        )}
        {segment === 'notebooks' && (
          <Table<Notebook>
            columns={notebookColumns}
            data={notebookRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE)}
            rowKey="id"
            resizable={false}
            emptyMessage={config.emptyMessage}
          />
        )}
        {segment === 'devspaces' && (
          <Table<Devspace>
            columns={devspaceColumns}
            data={devspaceRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE)}
            rowKey="id"
            resizable={false}
            emptyMessage={config.emptyMessage}
          />
        )}
      </VStack>
    </PageShell>
  );
}
