import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  Badge,
  MetricCard,
  Table,
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
  getEstateSummary,
  getPlatformStatusTheme,
  getAISummary,
  getGpuSummary,
} from './containerPlatformMockData';
import type { ClusterSource, HealthStatus } from './containerPlatformTypes';

/* ----------------------------------------
   Overview dashboard (Phase 3)

   Read-only estate rollup aggregated from the previously fragmented Aegis /
   Metis surfaces. All numbers come from getEstateSummary() — no backend.
   ---------------------------------------- */

interface SourceRow {
  id: ClusterSource;
  source: ClusterSource;
  clusters: number;
  nodes: number;
  workloads: number;
}

const HEALTH_ORDER: HealthStatus[] = ['Healthy', 'Warning', 'Critical'];

export default function OverviewPage() {
  const navigate = useNavigate();
  const summary = getEstateSummary();
  const ai = getAISummary();
  const gpu = getGpuSummary();

  const sourceRows: SourceRow[] = (['Aegis', 'Metis'] as ClusterSource[]).map((src) => ({
    id: src,
    source: src,
    clusters: summary.bySource[src].clusters,
    nodes: summary.bySource[src].nodes,
    workloads: summary.bySource[src].workloads,
  }));

  const sourceColumns: TableColumn<SourceRow>[] = [
    {
      key: 'source',
      label: 'Source',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: ClusterSource) => (
        <Badge theme={value === 'Aegis' ? 'blue' : 'gray'} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'clusters',
      label: 'Clusters',
      flex: 1,
      minWidth: columnMinWidths.name,
    },
    {
      key: 'nodes',
      label: 'Nodes',
      flex: 1,
      minWidth: columnMinWidths.name,
    },
    {
      key: 'workloads',
      label: 'Workloads',
      flex: 1,
      minWidth: columnMinWidths.name,
    },
  ];

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Overview' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={4}>
        <VStack gap={1}>
          <PageHeader title="Overview" />
          <span className="text-body-sm text-[var(--color-text-muted)]">
            One read-only plane across Aegis Container, Metis Container, Metis Run, and ML Studio.
          </span>
        </VStack>

        {/* OVW-01: estate totals + cluster health rollup */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Estate</span>
          <MetricCard.Group>
            <MetricCard title="Clusters" value={summary.clusterCount} />
            <MetricCard title="Nodes" value={summary.nodeCount} />
            <MetricCard title="Workloads" value={summary.workloadCount} />
            <MetricCard
              title="Cluster health"
              value={
                <HStack gap={1.5} align="center">
                  {HEALTH_ORDER.map((h) => (
                    <Badge key={h} theme={getPlatformStatusTheme(h)} type="subtle" size="sm">
                      {summary.clustersByHealth[h]} {h}
                    </Badge>
                  ))}
                </HStack>
              }
            />
          </MetricCard.Group>
        </VStack>

        {/* OVW-03: at-risk signals, emphasized via the MetricCard error accent */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">At risk</span>
          <MetricCard.Group>
            <MetricCard
              title="Unhealthy nodes"
              accent={summary.unhealthyNodeCount > 0 ? 'error' : undefined}
              value={
                <HStack gap={2} align="center">
                  <span>{summary.unhealthyNodeCount}</span>
                  <Badge
                    theme={summary.unhealthyNodeCount > 0 ? 'yellow' : 'green'}
                    type="subtle"
                    size="sm"
                  >
                    {summary.unhealthyNodeCount > 0 ? 'Needs attention' : 'All Ready'}
                  </Badge>
                </HStack>
              }
            />
            <MetricCard
              title="Failing workloads"
              accent={summary.failingWorkloadCount > 0 ? 'error' : undefined}
              value={
                <HStack gap={2} align="center">
                  <span>{summary.failingWorkloadCount}</span>
                  <Badge
                    theme={summary.failingWorkloadCount > 0 ? 'red' : 'green'}
                    type="subtle"
                    size="sm"
                  >
                    {summary.failingWorkloadCount > 0 ? 'Failed' : 'None failing'}
                  </Badge>
                </HStack>
              }
            />
            {/* Spacers keep the at-risk cards aligned with the 4-up estate row. */}
            <div className="flex-1 min-w-0" aria-hidden />
            <div className="flex-1 min-w-0" aria-hidden />
          </MetricCard.Group>
        </VStack>

        {/* AI workloads: Metis Run (serving) + ML Studio (training/notebooks) rollup */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">AI workloads</span>
          <MetricCard.Group>
            <MetricCard title="Inference services" value={ai.inferenceServiceCount} />
            <MetricCard title="Training jobs" value={ai.trainingJobCount} />
            <MetricCard title="Notebooks" value={ai.notebookCount} />
            <MetricCard
              title="GPUs (used / total)"
              value={
                <HStack gap={2} align="center">
                  <span>{`${gpu.usedGpus} / ${gpu.totalGpus}`}</span>
                  <Badge
                    theme={gpu.usedGpus >= gpu.totalGpus ? 'yellow' : 'blue'}
                    type="subtle"
                    size="sm"
                  >
                    {gpu.totalGpus > 0
                      ? `${Math.round((gpu.usedGpus / gpu.totalGpus) * 100)}% allocated`
                      : 'No GPUs'}
                  </Badge>
                </HStack>
              }
            />
          </MetricCard.Group>
        </VStack>

        {/* OVW-02: per-source (Aegis vs Metis) fragmentation breakdown */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">By source</span>
          <Table<SourceRow>
            columns={sourceColumns}
            data={sourceRows}
            rowKey="id"
            resizable={false}
            emptyMessage="No source data."
          />
        </VStack>
      </VStack>
    </PageShell>
  );
}
