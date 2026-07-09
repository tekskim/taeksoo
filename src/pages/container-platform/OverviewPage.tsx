import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  Badge,
  Table,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import { getEstateSummary, getPlatformStatusTheme } from './containerPlatformMockData';
import type { ClusterSource, HealthStatus } from './containerPlatformTypes';

/* ----------------------------------------
   Overview dashboard (Phase 3)

   Read-only estate rollup aggregated from the previously fragmented Aegis /
   Metis surfaces. All numbers come from getEstateSummary() — no backend.
   ---------------------------------------- */

/** A single KPI tile. `emphasis` highlights at-risk signals (OVW-03). */
function Tile({
  label,
  value,
  hint,
  emphasis = 'default',
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  emphasis?: 'default' | 'warning' | 'critical';
}) {
  // No semantic danger/warning border tokens exist in TDS — at-risk tiles are
  // differentiated by their colored hint Badge; emphasis just thickens the border.
  const emphasisRing =
    emphasis === 'default'
      ? 'border-[var(--color-border-default)]'
      : 'border-[var(--color-border-strong)]';

  return (
    <div
      className={`flex-1 min-w-0 bg-[var(--color-surface-default)] border ${emphasisRing} rounded-lg px-4 py-3`}
    >
      <VStack gap={1}>
        <span className="text-body-sm text-[var(--color-text-muted)] truncate">{label}</span>
        <span className="text-heading-h3 text-[var(--color-text-default)]">{value}</span>
        {hint && <div className="mt-1">{hint}</div>}
      </VStack>
    </div>
  );
}

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
        <PageHeader title="Overview" />

        {/* OVW-01: estate totals + cluster health rollup */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Estate</span>
          <HStack gap={3} align="stretch" className="w-full">
            <Tile label="Clusters" value={summary.clusterCount} />
            <Tile label="Nodes" value={summary.nodeCount} />
            <Tile label="Workloads" value={summary.workloadCount} />
            <Tile
              label="Cluster health"
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
          </HStack>
        </VStack>

        {/* OVW-03: at-risk signals, visually emphasized */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">At risk</span>
          <HStack gap={3} align="stretch" className="w-full">
            <Tile
              label="Unhealthy nodes"
              value={summary.unhealthyNodeCount}
              emphasis={summary.unhealthyNodeCount > 0 ? 'warning' : 'default'}
              hint={
                <Badge
                  theme={summary.unhealthyNodeCount > 0 ? 'yellow' : 'green'}
                  type="subtle"
                  size="sm"
                >
                  {summary.unhealthyNodeCount > 0 ? 'Needs attention' : 'All Ready'}
                </Badge>
              }
            />
            <Tile
              label="Failing workloads"
              value={summary.failingWorkloadCount}
              emphasis={summary.failingWorkloadCount > 0 ? 'critical' : 'default'}
              hint={
                <Badge
                  theme={summary.failingWorkloadCount > 0 ? 'red' : 'green'}
                  type="subtle"
                  size="sm"
                >
                  {summary.failingWorkloadCount > 0 ? 'Failed' : 'None failing'}
                </Badge>
              }
            />
            {/* Spacers keep the at-risk tiles aligned with the 4-up estate row. */}
            <div className="flex-1 min-w-0" aria-hidden />
            <div className="flex-1 min-w-0" aria-hidden />
          </HStack>
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
