import { useMemo } from 'react';
import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
  VStack,
  Badge,
  Table,
  EmptyState,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import { ContainerPlatformTabBar } from './ContainerPlatformTabBar';
import {
  clusters,
  nodes,
  workloads,
  inferenceServices,
  trainingJobs,
  notebooks,
  getNamespaces,
} from './containerPlatformMockData';

/* ----------------------------------------
   Global estate search (Phase C3)

   Case-insensitive name match across every estate resource, grouped into
   sections. Reads the query from ?q=. Cluster and Node results link to their
   detail routes. Read-only; all data from the mock estate selectors.
   ---------------------------------------- */

interface ResultRow {
  id: string;
  name: string;
  clusterName: string;
  kind?: string;
}

function matches(name: string, term: string): boolean {
  return name.toLowerCase().includes(term);
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) {
      return {
        clusters: [] as ResultRow[],
        nodes: [] as ResultRow[],
        workloads: [] as ResultRow[],
        ai: [] as ResultRow[],
        namespaces: [] as ResultRow[],
      };
    }

    return {
      clusters: clusters
        .filter((c) => matches(c.name, term))
        .map((c) => ({ id: c.id, name: c.name, clusterName: c.region })),
      nodes: nodes
        .filter((n) => matches(n.name, term))
        .map((n) => ({ id: n.id, name: n.name, clusterName: n.clusterName })),
      workloads: workloads
        .filter((w) => matches(w.name, term))
        .map((w) => ({ id: w.id, name: w.name, clusterName: w.clusterName, kind: w.kind })),
      ai: [
        ...inferenceServices.map((s) => ({
          id: s.id,
          name: s.name,
          clusterName: s.clusterName,
          kind: 'InferenceService',
        })),
        ...trainingJobs.map((j) => ({
          id: j.id,
          name: j.name,
          clusterName: j.clusterName,
          kind: 'TrainingJob',
        })),
        ...notebooks.map((n) => ({
          id: n.id,
          name: n.name,
          clusterName: n.clusterName,
          kind: 'Notebook',
        })),
      ].filter((r) => matches(r.name, term)),
      namespaces: getNamespaces()
        .filter((ns) => matches(ns.name, term))
        .map((ns) => ({ id: ns.id, name: ns.name, clusterName: ns.clusterName })),
    };
  }, [term]);

  const totalMatches =
    results.clusters.length +
    results.nodes.length +
    results.workloads.length +
    results.ai.length +
    results.namespaces.length;

  const nameColumn: TableColumn<ResultRow> = {
    key: 'name',
    label: 'Name',
    flex: 1,
    minWidth: columnMinWidths.name,
    render: (value: string) => (
      <span className="text-[var(--color-text-default)] font-medium truncate block" title={value}>
        {value}
      </span>
    ),
  };

  const linkNameColumn: TableColumn<ResultRow> = {
    ...nameColumn,
    render: (value: string) => (
      <span className="text-[var(--color-action-primary)] font-medium truncate block" title={value}>
        {value}
      </span>
    ),
  };

  const clusterColumn: TableColumn<ResultRow> = {
    key: 'clusterName',
    label: 'Cluster',
    flex: 1,
    minWidth: columnMinWidths.name,
    render: (value: string) => (
      <span className="truncate block" title={value}>
        {value}
      </span>
    ),
  };

  const kindColumn: TableColumn<ResultRow> = {
    key: 'kind',
    label: 'Kind',
    flex: 1,
    minWidth: columnMinWidths.type,
    render: (value?: string) =>
      value ? (
        <Badge theme="gray" type="subtle" size="sm">
          {value}
        </Badge>
      ) : null,
  };

  const section = (
    title: string,
    rows: ResultRow[],
    columns: TableColumn<ResultRow>[],
    onRowClick?: (row: ResultRow) => void
  ) => {
    if (rows.length === 0) return null;
    return (
      <VStack gap={2}>
        <span className="text-label-lg text-[var(--color-text-default)]">
          {title} ({rows.length})
        </span>
        <Table<ResultRow>
          columns={columns}
          data={rows}
          rowKey="id"
          resizable={false}
          onRowClick={onRowClick}
          emptyMessage="No matches."
        />
      </VStack>
    );
  };

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      tabBar={<ContainerPlatformTabBar />}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Search' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={4}>
        <PageHeader
          title={q ? `Search results for "${q}"` : 'Search'}
          titleExtra={
            q ? (
              <Badge theme="gray" type="subtle" size="sm">
                {totalMatches} match{totalMatches === 1 ? '' : 'es'}
              </Badge>
            ) : undefined
          }
        />

        {!term && (
          <EmptyState
            title="Search the estate"
            description="Type a name in the sidebar search and press Enter to find clusters, nodes, workloads, AI workloads, and namespaces."
          />
        )}

        {term && totalMatches === 0 && (
          <EmptyState title="No matches" description={`Nothing in the estate matches "${q}".`} />
        )}

        {section('Clusters', results.clusters, [linkNameColumn, clusterColumn], (row) =>
          navigate(`/container-platform/clusters/${row.id}`)
        )}
        {section('Nodes', results.nodes, [linkNameColumn, clusterColumn], (row) =>
          navigate(`/container-platform/nodes/${row.id}`)
        )}
        {section('Workloads', results.workloads, [nameColumn, kindColumn, clusterColumn])}
        {section('AI Workloads', results.ai, [nameColumn, kindColumn, clusterColumn])}
        {section('Namespaces', results.namespaces, [nameColumn, clusterColumn])}
      </VStack>
    </PageShell>
  );
}
