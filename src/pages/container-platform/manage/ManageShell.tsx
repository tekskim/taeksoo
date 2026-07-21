import type { ReactNode } from 'react';
import { PageShell, TopBar, Breadcrumb } from '@/design-system';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClusterManageSidebar,
  CLUSTER_MANAGE_SIDEBAR_WIDTH,
  manageBasePath,
} from '../ClusterManageSidebar';
import { ContainerPlatformTabBar } from '../ContainerPlatformTabBar';
import { getClusterById } from '../containerPlatformMockData';
import type { Cluster } from '../containerPlatformTypes';

/* ----------------------------------------
   Shared shell for cluster-scope manage pages: swaps in the cluster manage
   sidebar and builds the Clusters > {cluster} > {section} breadcrumb so every
   manage screen keeps the same way back to the estate.
   ---------------------------------------- */

export function useManageCluster(): { clusterId: string; cluster: Cluster | undefined } {
  const { clusterId = '' } = useParams<{ clusterId: string }>();
  return { clusterId, cluster: getClusterById(clusterId) };
}

export function ManageShell({
  clusterId,
  crumb,
  children,
}: {
  clusterId: string;
  crumb?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const cluster = getClusterById(clusterId);
  const clusterLabel = cluster?.name ?? clusterId;

  const items = [
    { label: 'Clusters', onClick: () => navigate('/container-platform/clusters') },
    crumb
      ? { label: clusterLabel, onClick: () => navigate(manageBasePath(clusterId)) }
      : { label: clusterLabel },
    ...(crumb ? [{ label: crumb }] : []),
  ];

  return (
    <PageShell
      sidebar={<ClusterManageSidebar clusterId={clusterId} />}
      sidebarWidth={CLUSTER_MANAGE_SIDEBAR_WIDTH}
      tabBar={<ContainerPlatformTabBar />}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={items} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      {children}
    </PageShell>
  );
}
