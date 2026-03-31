import { useMemo, type ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { ProgressBar } from '@shared/components/ProgressBar';
import { ContextMenu } from '@shared/components/ContextMenu';
import { InlineMessage } from '@shared/components/InlineMessage';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ClusterDetail {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  containerNetwork: string;
  createdAt: string;
  networking: {
    externalNetwork: string;
    tenantNetwork: string;
    subnet: string;
  };
  nodeConfiguration: {
    nodeType: string;
  };
  controlPlanes: {
    image: string;
    flavor: string;
    nodeCount: number;
    etcd: string;
  };
  nodes: {
    image: string;
    flavor: string;
    nodeCount: number;
  };
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusterDetails: Record<string, ClusterDetail> = {
  'cluster-001': {
    id: 'cluster-001',
    name: 'Cluster1',
    status: 'Raw',
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Nov 11, 2025 08:30:18',
    networking: {
      externalNetwork: 'extnet-01',
      tenantNetwork: 'net-01',
      subnet: 'subnet-01 (10.62.1.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (10GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 1,
    },
  },
  'cluster-002': {
    id: 'cluster-002',
    name: 'ClusterName',
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 6, 2025 21:25:53',
    networking: {
      externalNetwork: 'extnet-02',
      tenantNetwork: 'net-02',
      subnet: 'subnet-02 (10.62.2.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.small (2vCPU, 4.00 GiB RAM, 20.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (20GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.medium (4vCPU, 8.00 GiB RAM, 40.00 GiB Disk)',
      nodeCount: 5,
    },
  },
  'cluster-003': {
    id: 'cluster-003',
    name: 'Cluster3',
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 5, 2025 14:12:36',
    networking: {
      externalNetwork: 'extnet-03',
      tenantNetwork: 'net-03',
      subnet: 'subnet-03 (10.62.3.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.small (2vCPU, 4.00 GiB RAM, 20.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (20GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.small (2vCPU, 4.00 GiB RAM, 20.00 GiB Disk)',
      nodeCount: 3,
    },
  },
};

const defaultClusterData: ClusterDetail = {
  id: 'cluster-001',
  name: 'tk-test',
  status: 'OK',
  kubernetesVersion: 'v1.34',
  containerNetwork: 'Kube OVN',
  createdAt: 'Jul 25, 2025 10:32:16',
  networking: {
    externalNetwork: 'extnet-01',
    tenantNetwork: 'net-01',
    subnet: 'subnet-01 (10.62.1.0/28)',
  },
  nodeConfiguration: {
    nodeType: 'Instance',
  },
  controlPlanes: {
    image: 'ubuntu-24.04-tk-base',
    flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
    nodeCount: 3,
    etcd: 'External (10GiB)',
  },
  nodes: {
    image: 'ubuntu-24.04-tk-base',
    flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
    nodeCount: 1,
  },
};

/* ----------------------------------------
   UI helpers (div-based cards)
   ---------------------------------------- */

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
        <h3 className="text-16 font-semibold leading-6 text-text m-0">{title}</h3>
      </div>
      <div className="divide-y divide-border-subtle">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-11 font-medium text-text-muted shrink-0">{label}</span>
      <span className="text-12 text-text text-right min-w-0 break-words">{value}</span>
    </div>
  );
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerClusterDetailPage() {
  const navigate = useNavigate();
  const { clusterId } = useParams<{ clusterId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'networking';
  const setActiveTabId = (tab: string) => setSearchParams({ tab }, { replace: true });

  const cluster = clusterId ? mockClusterDetails[clusterId] : null;
  const clusterData = cluster ?? defaultClusterData;

  const infoFields: DetailPageHeaderInfoField[] = useMemo(
    () => [
      {
        label: 'Status',
        value: (
          <Badge theme="white" size="sm">
            {clusterData.status}
          </Badge>
        ),
        ...(clusterData.status === 'Provisioning' && {
          accessory: (
            <span className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Control plane initializing
              </span>
              <ProgressBar value={65} max={100} size="sm" showValue={false} />
            </span>
          ),
        }),
      },
      { label: 'Kubernetes version', value: clusterData.kubernetesVersion },
      { label: 'Container network', value: clusterData.containerNetwork },
      { label: 'Created at', value: clusterData.createdAt },
    ],
    [clusterData]
  );

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={clusterData.name}
        actions={
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                type="button"
                onClick={toggle}
              >
                More actions
                <IconChevronDown size={16} stroke={1.5} />
              </Button>
            )}
          >
            <ContextMenu.Item action={() => console.log('Kubectl Shell')}>
              Kubectl shell
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Download KubeConfig')}>
              Download KubeConfig
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Copy KubeConfig')}>
              Copy KubeConfig to clipboard
            </ContextMenu.Item>
            <ContextMenu.Item
              action={() => navigate(`/container/cluster-management/${clusterData.id}/edit`)}
            >
              Edit cluster
            </ContextMenu.Item>
            <ContextMenu.Item action={() => console.log('Delete')} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        }
        infoFields={infoFields}
      />

      {clusterData.status === 'Provisioning' && (
        <InlineMessage variant="info">
          Cluster provisioning is in progress. Some features may be unavailable until the process is
          complete.
        </InlineMessage>
      )}

      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} variant="line" size="sm">
        <Tab id="networking" label="Networking">
          <div className="pt-4">
            <DetailCard title="Networking">
              <DataRow label="External network" value={clusterData.networking.externalNetwork} />
              <DataRow label="Tenant network" value={clusterData.networking.tenantNetwork} />
              <DataRow label="Subnet" value={clusterData.networking.subnet} />
            </DetailCard>
          </div>
        </Tab>

        <Tab id="node-config" label="Node configuration">
          <div className="flex flex-col gap-6 pt-4">
            <DetailCard title="Node configuration">
              <DataRow label="Node type" value={clusterData.nodeConfiguration.nodeType} />
            </DetailCard>

            <DetailCard title="Control planes">
              <DataRow label="Image" value={clusterData.controlPlanes.image} />
              <DataRow label="Flavor" value={clusterData.controlPlanes.flavor} />
              <DataRow label="Node count" value={clusterData.controlPlanes.nodeCount.toString()} />
              <DataRow label="etcd" value={clusterData.controlPlanes.etcd} />
            </DetailCard>

            <DetailCard title="Nodes">
              <DataRow label="Image" value={clusterData.nodes.image} />
              <DataRow label="Flavor" value={clusterData.nodes.flavor} />
              <DataRow label="Node count" value={clusterData.nodes.nodeCount.toString()} />
            </DetailCard>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
