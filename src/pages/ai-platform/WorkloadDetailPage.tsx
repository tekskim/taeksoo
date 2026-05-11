import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  CopyButton,
} from '@/design-system';
import type { StatusType } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import {
  IconLock,
  IconPlug,
  IconEdit,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react';

interface ResourceSnapshot {
  uptime: string;
  gpu: string;
  vcpu: string;
  memory: string;
  containerDisk: string;
}

interface WorkloadDetail {
  id: string;
  name: string;
  label: string;
  status: StatusType;
  cost: string;
  basic: {
    type: string;
    dockerImage: string;
    port: string;
    cpuRequest: string;
    cpuLimit: string;
    memoryRequest: string;
    memoryLimit: string;
    transportType: string;
  };
  podDetails: ResourceSnapshot;
  maxRuntime: ResourceSnapshot;
  containerImageDigest: string;
  podVolume: {
    size: string;
    mountPath: string;
  };
}

const WORKLOAD_DETAILS: Record<string, WorkloadDetail> = {
  'wl-001': {
    id: 'wl-001',
    name: 'llama3-70b-inference',
    label: 'prod-gpu-a100',
    status: 'active',
    cost: '$ 0.1/hr',
    basic: {
      type: 'STDIO',
      dockerImage: 'Streamable HTTP (2025-06-18)',
      port: 'http://pending-deployment.local/',
      cpuRequest: '2/2|1|2|2',
      cpuLimit: '1.0.0',
      memoryRequest: '1.0.0',
      memoryLimit: '1.0.0',
      transportType: 'Streamable HTTP (2025-06-18)',
    },
    podDetails: {
      uptime: '2d 14h 22m',
      gpu: 'NVIDIA A100 80GB × 1',
      vcpu: '8',
      memory: '64 GiB',
      containerDisk: '120 GiB',
    },
    maxRuntime: {
      uptime: '168h',
      gpu: '720h',
      vcpu: '168h',
      memory: '168h',
      containerDisk: '168h',
    },
    containerImageDigest: 'sha256:7c9f8e2a1b0d4e6f3a5c8b9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b',
    podVolume: {
      size: '500 GiB',
      mountPath: '/data/models',
    },
  },
  'wl-002': {
    id: 'wl-002',
    name: 'qwen3-finetune-v2',
    label: 'train-gpu-h100',
    status: 'active',
    cost: '$ 2.5/hr',
    basic: {
      type: 'STDIO',
      dockerImage: 'vllm/vllm-openai:v0.6.3',
      port: 'http://qwen3-train.platform.local:8000/',
      cpuRequest: '4',
      cpuLimit: '16',
      memoryRequest: '32Gi',
      memoryLimit: '256Gi',
      transportType: 'HTTP',
    },
    podDetails: {
      uptime: '5d 2h 8m',
      gpu: 'NVIDIA H100 80GB × 2',
      vcpu: '32',
      memory: '192 GiB',
      containerDisk: '200 GiB',
    },
    maxRuntime: {
      uptime: '336h',
      gpu: '336h',
      vcpu: '336h',
      memory: '336h',
      containerDisk: '336h',
    },
    containerImageDigest:
      'sha256:0f1e2d3c4b5a697887766554433221100fedcba9876543210fedcba9876543210',
    podVolume: {
      size: '2 TiB',
      mountPath: '/workspace/checkpoints',
    },
  },
  'wl-004': {
    id: 'wl-004',
    name: 'stable-diffusion-xl',
    label: 'gpu-render-01',
    status: 'error',
    cost: '$ 1.2/hr',
    basic: {
      type: 'STDIO',
      dockerImage: 'runpod/pytorch:2.2-cuda12.1',
      port: 'http://sdxl-render.platform.local/',
      cpuRequest: '2',
      cpuLimit: '8',
      memoryRequest: '16Gi',
      memoryLimit: '64Gi',
      transportType: 'WebSocket',
    },
    podDetails: {
      uptime: '0h',
      gpu: 'NVIDIA A100 40GB × 1',
      vcpu: '8',
      memory: '48 GiB',
      containerDisk: '80 GiB',
    },
    maxRuntime: {
      uptime: '72h',
      gpu: '72h',
      vcpu: '72h',
      memory: '72h',
      containerDisk: '72h',
    },
    containerImageDigest: 'sha256:deadbeef0123456789abcdef0123456789abcdef0123456789abcdef012345',
    podVolume: {
      size: '200 GiB',
      mountPath: '/outputs',
    },
  },
};

const DEFAULT_DETAIL: WorkloadDetail = WORKLOAD_DETAILS['wl-001'];

function statusLabel(status: StatusType): string {
  switch (status) {
    case 'active':
    case 'enabled':
      return 'Running';
    case 'error':
      return 'Failed';
    case 'paused':
    case 'shutoff':
      return 'Stopped';
    case 'building':
      return 'Creating';
    default:
      return 'Unknown';
  }
}

function getWorkloadDetail(id: string | undefined): WorkloadDetail {
  if (id && WORKLOAD_DETAILS[id]) {
    return WORKLOAD_DETAILS[id];
  }
  if (!id) {
    return DEFAULT_DETAIL;
  }
  return {
    ...DEFAULT_DETAIL,
    id,
    name: `workload-${id}`,
    label: id,
  };
}

function ResourceRows({ data }: { data: ResourceSnapshot }) {
  return (
    <>
      <SectionCard.DataRow label="Uptime" value={data.uptime} />
      <SectionCard.DataRow label="GPU" value={data.gpu} />
      <SectionCard.DataRow label="vCPU" value={data.vcpu} />
      <SectionCard.DataRow label="Memory" value={data.memory} />
      <SectionCard.DataRow label="Container disk" value={data.containerDisk} />
    </>
  );
}

export function WorkloadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [detailTab, setDetailTab] = useState('details');

  const detail = useMemo(() => getWorkloadDetail(id), [id]);

  useEffect(() => {
    updateActiveTabLabel(detail.name);
  }, [detail.name, updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Workloads', href: '/ai-platform/workloads' },
                { label: detail.name },
              ]}
            />
          }
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>{detail.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <HStack gap={1} className="flex-wrap">
              <Button variant="secondary" size="sm" leftIcon={<IconLock size={12} />}>
                Lock pod
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconPlug size={12} />}>
                Connect
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                Edit pod
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
                Stop
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                Restart
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                Delete
              </Button>
            </HStack>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={statusLabel(detail.status)}
              status={detail.status}
            />
            <DetailHeader.InfoCard label="ID" value={detail.label} copyable />
            <DetailHeader.InfoCard label="Cost" value={detail.cost} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={detailTab} onChange={setDetailTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="telemetry">Telemetry</Tab>
            <Tab value="logs">Logs</Tab>
            <Tab value="terminal">Terminal</Tab>
          </TabList>

          <TabPanel value="details" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Type" value={detail.basic.type} />
                  <SectionCard.DataRow label="Docker image" value={detail.basic.dockerImage} />
                  <SectionCard.DataRow label="Port" value={detail.basic.port} />
                  <SectionCard.DataRow label="CPU request" value={detail.basic.cpuRequest} />
                  <SectionCard.DataRow label="CPU limit" value={detail.basic.cpuLimit} />
                  <SectionCard.DataRow label="Memory request" value={detail.basic.memoryRequest} />
                  <SectionCard.DataRow label="Memory limit" value={detail.basic.memoryLimit} />
                  <SectionCard.DataRow label="Transport type" value={detail.basic.transportType} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Pod details" />
                <SectionCard.Content>
                  <ResourceRows data={detail.podDetails} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Max runtime" />
                <SectionCard.Content>
                  <ResourceRows data={detail.maxRuntime} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Container" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image">
                    <HStack gap={1} align="center" className="min-w-0 w-full">
                      <span
                        className="text-body-md text-[var(--color-text-default)] truncate min-w-0 [font-family:var(--font-mono)]"
                        title={detail.containerImageDigest}
                      >
                        {detail.containerImageDigest}
                      </span>
                      <CopyButton
                        value={detail.containerImageDigest}
                        size="sm"
                        variant="ghost"
                        iconOnly
                        tooltip="Copy image digest"
                        className="shrink-0"
                      />
                    </HStack>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Pod volume" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Size" value={detail.podVolume.size} />
                  <SectionCard.DataRow label="Mount path" value={detail.podVolume.mountPath} />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="telemetry" className="pt-0">
            <p className="text-body-md text-[var(--color-text-subtle)] pt-4">
              Telemetry charts and metrics will appear here.
            </p>
          </TabPanel>

          <TabPanel value="logs" className="pt-0">
            <p className="text-body-md text-[var(--color-text-subtle)] pt-4">
              Pod logs will appear here.
            </p>
          </TabPanel>

          <TabPanel value="terminal" className="pt-0">
            <p className="text-body-md text-[var(--color-text-subtle)] pt-4">
              Terminal session will appear here.
            </p>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default WorkloadDetailPage;
