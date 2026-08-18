/* ----------------------------------------
   Cluster detail — Overview tab (CorePlan D-34)

   Spec: 2-screens/1-cluster-detail-overview-v1.0.0.md
   Rules: [CCONT-01] reachable versions only · [CCONT-02] no update while busy
          [CCONT-03] show why an update cannot run · [CCONT-04] dedicated = no create

   Four areas, top to bottom: Update / Status / Inventory / Activity.
   The existing three tabs (Networking, Node configuration, Access token)
   are untouched — D-26 ② keeps the current IA and UI.
   ---------------------------------------- */

import { VStack, HStack, Badge, SectionCard } from '@/design-system';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export type ClusterUsage = 'General' | 'Metis' | 'Maxis';

export interface ClusterOverviewData {
  /** Current Kubernetes version, e.g. "v1.34.1" */
  version: string;
  /** Versions reachable from the current one ([CCONT-01]). Empty = already latest. */
  reachableVersions: string[];
  /** Update channel name. Whether CP really runs channels is an open GAP. */
  channel: string;
  /** Cluster lifecycle status — blocks updates while busy ([CCONT-02]). */
  status: string;
  usage?: ClusterUsage;
  controlPlaneHealthy: boolean;
  nodesReady: number;
  nodesTotal: number;
  /** Agent status is only meaningful once a usage is assigned (D-30). */
  agentHealthy?: boolean;
  inventory: {
    nodes: number;
    namespaces: number;
    workloads: number;
    persistentVolumeClaims: number;
  };
  ongoingActivity?: string;
  recentEvents: { at: string; message: string }[];
}

const USAGE_THEME: Record<ClusterUsage, 'blue' | 'yellow' | 'green'> = {
  General: 'blue',
  Metis: 'yellow',
  Maxis: 'green',
};

const BUSY_STATUSES = ['Provisioning', 'Updating', 'Deleting'];

interface Props {
  data: ClusterOverviewData;
  onAssignUsage: () => void;
  onEditChannel: () => void;
  onUpdate: () => void;
}

export function ClusterOverviewTab({ data, onAssignUsage, onEditChannel, onUpdate }: Props) {
  const navigate = useNavigate();

  const isBusy = BUSY_STATUSES.includes(data.status);
  const targetVersion = data.reachableVersions[data.reachableVersions.length - 1];
  const isLatest = data.reachableVersions.length === 0;

  // [CCONT-03] — never disable the button without saying why.
  const blockedReason = isBusy
    ? 'A cluster operation is in progress. Update is available once it completes.'
    : isLatest
      ? 'This cluster is on the latest available version.'
      : null;

  const inventoryItems = [
    { label: 'Nodes', value: data.inventory.nodes, to: '/container/nodes' },
    { label: 'Namespaces', value: data.inventory.namespaces, to: '/container/namespaces' },
    { label: 'Workloads', value: data.inventory.workloads, to: '/container/deployments' },
    {
      label: 'Persistent volume claims',
      value: data.inventory.persistentVolumeClaims,
      to: '/container/persistent-volume-claims',
    },
  ];

  return (
    <VStack gap={4} className="pt-4">
      {/* ---------- 1. Update — 보류 (CAPSIS-D-52) ----------
         버전을 올리려면 노드를 한 대씩 비웠다가 다시 넣어야 하는데 그
         노드 드레인이 범위 밖이라(CAPSIS-D-33 G3) 화면 하나로 끝나지
         않는다. 지금 클러스터 버전을 어떻게 올리고 있는지도 확인되지
         않았다. 정의는 화면 정의서에 남겨 두었다. ---------- */}

      {/* ---------- 2. Status ---------- */}
      <SectionCard>
        <SectionCard.Header title="Status" />
        <SectionCard.DataRow
          label="Control plane"
          value={
            <Badge theme={data.controlPlaneHealthy ? 'green' : 'red'} type="subtle" size="sm">
              {data.controlPlaneHealthy ? 'Healthy' : 'Degraded'}
            </Badge>
          }
        />
        <SectionCard.DataRow
          label="Nodes"
          value={
            <HStack gap={2} className="items-center">
              <Badge
                theme={data.nodesReady === data.nodesTotal ? 'green' : 'yellow'}
                type="subtle"
                size="sm"
              >
                {data.nodesReady}/{data.nodesTotal} Ready
              </Badge>
            </HStack>
          }
        />
        {data.usage && (
          <SectionCard.DataRow
            label="Agent"
            value={
              <Badge theme={data.agentHealthy ? 'green' : 'red'} type="subtle" size="sm">
                {data.agentHealthy ? 'Healthy' : 'Not reporting'}
              </Badge>
            }
          />
        )}
        {/* Usage는 탭 바깥 헤더로 옮겼다 — 배치안과 무관하게 상세에 있어야 하므로 */}
      </SectionCard>

      {/* ---------- 3. Inventory ---------- */}
      <SectionCard>
        <SectionCard.Header title="Inventory" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border-subtle)] border-t border-[var(--color-border-subtle)]">
          {inventoryItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className="flex flex-col items-start gap-1 bg-[var(--color-surface-default)] px-4 py-3 text-left hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <span className="text-heading-lg font-semibold text-[var(--color-text-default)] tabular-nums">
                {item.value}
              </span>
              <HStack gap={1} className="items-center">
                <span className="text-body-sm text-[var(--color-text-muted)]">{item.label}</span>
                <IconChevronRight
                  size={14}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              </HStack>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ---------- 4. Activity ---------- */}
      <SectionCard>
        <SectionCard.Header title="Activity" />
        <SectionCard.DataRow
          label="Ongoing"
          value={
            data.ongoingActivity ?? (
              <span className="text-[var(--color-text-muted)]">No ongoing activities.</span>
            )
          }
        />
        <div className="px-4 py-3 border-t border-[var(--color-border-subtle)]">
          <span className="block text-body-sm font-medium text-[var(--color-text-default)] mb-2">
            Recent events
          </span>
          {data.recentEvents.length === 0 ? (
            <span className="text-body-sm text-[var(--color-text-muted)]">No recent events.</span>
          ) : (
            <VStack gap={2}>
              {data.recentEvents.map((event, index) => (
                <HStack key={index} gap={3} className="items-baseline">
                  <span className="text-body-sm text-[var(--color-text-muted)] tabular-nums shrink-0 w-[64px]">
                    {event.at}
                  </span>
                  <span className="text-body-sm text-[var(--color-text-default)] truncate min-w-0">
                    {event.message}
                  </span>
                </HStack>
              ))}
              <button
                type="button"
                onClick={() => navigate('/container/events')}
                className="self-start text-body-sm text-[var(--color-action-primary)] hover:underline"
              >
                View all events
              </button>
            </VStack>
          )}
        </div>
      </SectionCard>
    </VStack>
  );
}
