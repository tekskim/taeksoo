/* ----------------------------------------
   Cluster detail — Overview tab (CorePlan D-34)

   Spec: 2-screens/1-cluster-detail-overview-v1.0.0.md
   Rules: [CCONT-01] reachable versions only · [CCONT-02] no update while busy
          [CCONT-03] show why an update cannot run · [CCONT-04] dedicated = no create

   Four areas, top to bottom: Update / Status / Inventory / Activity.
   The existing three tabs (Networking, Node configuration, Access token)
   are untouched — D-26 ② keeps the current IA and UI.
   ---------------------------------------- */

import {
  VStack,
  HStack,
  Badge,
  Button,
  SectionCard,
  InlineMessage,
  Tooltip,
} from '@/design-system';
import { IconChevronRight, IconPencil } from '@tabler/icons-react';
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
      {/* ---------- 1. Update ---------- */}
      <SectionCard>
        <SectionCard.Header title="Update" />
        <VStack gap={4} className="px-4 pb-4">
          <HStack gap={8} className="items-start flex-wrap">
            <VStack gap={1}>
              <span className="text-body-sm text-[var(--color-text-muted)]">Current version</span>
              <span className="text-body-md font-medium text-[var(--color-text-default)]">
                {data.version}
              </span>
            </VStack>
            <VStack gap={1}>
              <span className="text-body-sm text-[var(--color-text-muted)]">Update channel</span>
              <HStack gap={1} className="items-center">
                <span className="text-body-md font-medium text-[var(--color-text-default)]">
                  {data.channel}
                </span>
                <Tooltip content="Change channel" position="top">
                  <button
                    type="button"
                    onClick={onEditChannel}
                    aria-label="Change update channel"
                    className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
                  >
                    <IconPencil size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  </button>
                </Tooltip>
              </HStack>
            </VStack>
          </HStack>

          {/* Version path — current and target as points on a line ([CCONT-01]) */}
          {!isLatest && (
            <div className="pt-1">
              <div className="flex items-center gap-0 max-w-[520px]">
                <VStack gap={2} className="items-center shrink-0">
                  <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                    {data.version}
                  </span>
                  <span className="size-3 rounded-full bg-[var(--color-action-primary)]" />
                </VStack>
                <div className="flex-1 h-0.5 bg-[var(--color-border-default)] mt-[26px] mx-2" />
                <VStack gap={2} className="items-center shrink-0">
                  <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                    {targetVersion}
                  </span>
                  <span className="size-3 rounded-full border-2 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]" />
                </VStack>
              </div>
              <span className="block text-body-sm text-[var(--color-text-muted)] mt-2">
                {data.reachableVersions.length === 1
                  ? '1 version available on this channel.'
                  : `${data.reachableVersions.length} versions available on this channel.`}
              </span>
            </div>
          )}

          {blockedReason && <InlineMessage variant="info">{blockedReason}</InlineMessage>}

          <HStack>
            <Button variant="primary" size="sm" disabled={!!blockedReason} onClick={onUpdate}>
              Update cluster
            </Button>
          </HStack>
        </VStack>
      </SectionCard>

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
        <SectionCard.DataRow
          label="Usage"
          value={
            data.usage ? (
              <Badge theme={USAGE_THEME[data.usage]} type="subtle" size="sm">
                {data.usage}
              </Badge>
            ) : (
              <HStack gap={2} className="items-center">
                <Badge theme="gray" type="subtle" size="sm">
                  Unassigned
                </Badge>
                <Button variant="tertiary" size="sm" onClick={onAssignUsage}>
                  Assign usage
                </Button>
              </HStack>
            )
          }
        />
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
