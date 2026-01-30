import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { Button, DetailHeader, Modal, Textarea, SectionCard, VStack } from '@/design-system';
import { IconCopy } from '@tabler/icons-react';
import {
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
  CLOUD_BUILDER_SLUGS,
} from './consoleListConfig';

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

function findRowById(config: ReturnType<typeof getCloudBuilderListConfig>, id: string) {
  const inBase = config.rows?.find((r) => r.id === id);
  if (inBase) return inBase;
  const inTabs = config.tabs?.flatMap((t) => t.rows)?.find((r) => r.id === id);
  return inTabs;
}

function stableInt(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function seededDateTime(seed: string) {
  const base = stableInt(seed);
  const yyyy = 2025;
  const mm = (base % 12) + 1;
  const dd = (base % 28) + 1;
  const hh = base % 24;
  const min = (base >>> 8) % 60 || 0;
  const sec = (base >>> 16) % 60 || 0;
  return `${yyyy}-${pad2(mm)}-${pad2(dd)} ${pad2(hh)}:${pad2(min)}:${pad2(sec)}`;
}

function makeNetworkAgentConfiguration(seed: string) {
  const h = stableInt(`agent-config:${seed}`);
  return {
    dhcp_driver: 'neutron.agent.linux.dhcp.Dnsmasq',
    dhcp_lease_duration: 86400,
    log_agent_heartbeats: false,
    networks: 40 + (h % 30),
    ports: 500 + (h % 200),
    subnets: 40 + (h % 40),
  };
}

export function CloudBuilderDetailPage() {
  const params = useParams();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const id = params.id ?? '';

  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);
  const row = useMemo(() => (id ? findRowById(config, id) : null), [config, id]);

  const isNetworkAgent = slug === 'network-agents';

  // Enable/Disable (UI only) - shown in DetailHeader
  // All hooks must be called before any early returns
  const [serviceStatus, setServiceStatus] = useState<string>(row?.serviceStatus ?? 'Enabled');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<'Enabled' | 'Disabled'>('Disabled');
  const [disableReason, setDisableReason] = useState('');

  useEffect(() => {
    // Reset when navigating to different detail id/slug
    setServiceStatus(row?.serviceStatus ?? 'Enabled');
    setStatusModalOpen(false);
    setNextStatus('Disabled');
    setDisableReason('');
  }, [slug, id, row?.serviceStatus]);

  const networkAgentMeta = useMemo(() => {
    if (!isNetworkAgent) return null;
    const seed = `${slug}:${id}:${row?.name ?? ''}`;
    const createdAt = seededDateTime(`agent-created:${seed}`);
    const startedAt = seededDateTime(`agent-started:${seed}`);
    const heartbeatTimestamp = seededDateTime(`agent-heartbeat:${seed}`);
    const topic = row?.name?.includes('dhcp') ? 'dhcp_agent' : 'neutron_agent';
    const resourcesSynced =
      stableInt(`agent-resources:${seed}`) % 2 === 0 ? '-' : String((stableInt(seed) % 1000) + 1);
    const description = '-';
    const configurationText = JSON.stringify(makeNetworkAgentConfiguration(seed), null, 2);
    return {
      createdAt,
      startedAt,
      heartbeatTimestamp,
      topic,
      resourcesSynced,
      description,
      configurationText,
    };
  }, [isNetworkAgent, slug, id, row?.name]);

  // builder와 동일하게 services / compute-services는 디테일 제공하지 않음
  const hasDetail = slug !== 'services' && slug !== 'compute-services';
  if (!hasDetail) {
    return (
      <AppLayout>
        <div className="pt-4 px-8 pb-6">
          <div className="text-[var(--color-text-subtle)]">This page has no detail view.</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
        <VStack gap={6} className="min-w-[1176px]">
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">{config.title}</h1>
          </div>

          {isNetworkAgent ? (
            <DetailHeader>
              <DetailHeader.Title>{row?.name ?? `Network Agent #${id}`}</DetailHeader.Title>
              <DetailHeader.Actions>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const current = serviceStatus || 'Enabled';
                    const to = current === 'Disabled' ? 'Enabled' : 'Disabled';
                    setDisableReason('');
                    setNextStatus(to);
                    setStatusModalOpen(true);
                  }}
                >
                  {serviceStatus === 'Disabled' ? 'Enable' : 'Disable'}
                </Button>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid className="flex-wrap">
                <DetailHeader.InfoCard label="ID" value={row?.id ?? id} copyable />
                <DetailHeader.InfoCard
                  label="Service status"
                  value={serviceStatus || 'Enabled'}
                  status={(serviceStatus || 'Enabled') === 'Enabled' ? 'active' : 'deactivated'}
                />
                <DetailHeader.InfoCard
                  label="Service state"
                  value={row?.serviceState ?? 'Up'}
                  status={(row?.serviceState ?? 'Up') === 'Up' ? 'active' : 'down'}
                />
                <DetailHeader.InfoCard
                  label="Created at"
                  value={networkAgentMeta?.createdAt ?? '-'}
                />
              </DetailHeader.InfoGrid>
            </DetailHeader>
          ) : (
            <DetailHeader>
              <DetailHeader.Title>
                {row?.name ?? row?.serial ?? `${config.title} #${id}`}
              </DetailHeader.Title>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="ID" value={row?.id ?? id} copyable />
              </DetailHeader.InfoGrid>
            </DetailHeader>
          )}

          {isNetworkAgent ? (
            <>
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Type" value={row?.type ?? '-'} />
                  <SectionCard.DataRow label="Host" value={row?.host ?? '-'} />
                  <SectionCard.DataRow
                    label="Availability zone"
                    value={row?.availabilityZone ?? '-'}
                  />
                  <SectionCard.DataRow label="Topic" value={networkAgentMeta?.topic ?? '-'} />
                  <SectionCard.DataRow
                    label="Resources synced"
                    value={networkAgentMeta?.resourcesSynced ?? '-'}
                  />
                  <SectionCard.DataRow
                    label="Heartbeat timestamp"
                    value={networkAgentMeta?.heartbeatTimestamp ?? '-'}
                  />
                  <SectionCard.DataRow
                    label="Started at"
                    value={networkAgentMeta?.startedAt ?? '-'}
                  />
                  <SectionCard.DataRow
                    label="Description"
                    value={networkAgentMeta?.description ?? '-'}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header
                  title="Configuration"
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCopy size={12} stroke={1.5} />}
                      onClick={() => {
                        const text = networkAgentMeta?.configurationText ?? '';
                        if (!text) return;
                        navigator.clipboard.writeText(text);
                      }}
                    >
                      Copy
                    </Button>
                  }
                />
                <SectionCard.Content gap={3}>
                  <pre className="max-h-[420px] overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3 text-body-md leading-5 text-[var(--color-text-default)]">
                    {networkAgentMeta?.configurationText ?? ''}
                  </pre>
                </SectionCard.Content>
              </SectionCard>

              {/* Enable/Disable Modal (UI only) */}
              <Modal
                isOpen={statusModalOpen}
                onClose={() => {
                  setStatusModalOpen(false);
                  setDisableReason('');
                }}
                title={nextStatus === 'Disabled' ? 'Disable service' : 'Enable service'}
                description={
                  nextStatus === 'Disabled'
                    ? 'Change this service status to Disabled?'
                    : 'Change this service status to Enabled?'
                }
                className="w-[720px] max-w-[calc(100vw-32px)]"
              >
                <div className="flex flex-col">
                  {nextStatus === 'Disabled' && !!config.statusAction?.requireDisableReason ? (
                    <div className="py-4">
                      <div className="grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-12 md:col-span-4 text-body-lg text-[var(--color-text-default)]">
                          <span>Reason</span>{' '}
                          <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                          <Textarea
                            placeholder="Enter a reason for disabling"
                            value={disableReason}
                            onChange={(e) => setDisableReason(e.target.value)}
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--color-border-subtle)]">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setStatusModalOpen(false);
                        setDisableReason('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      disabled={
                        nextStatus === 'Disabled' &&
                        !!config.statusAction?.requireDisableReason &&
                        !disableReason.trim()
                      }
                      onClick={() => {
                        // UI only: update local status to reflect the change
                        setServiceStatus(nextStatus);
                        setStatusModalOpen(false);
                        setDisableReason('');
                      }}
                    >
                      {nextStatus === 'Disabled' ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          ) : (
            <SectionCard>
              <SectionCard.Header title="Details" />
              <SectionCard.Content>
                {row ? (
                  Object.entries(row)
                    .filter(([k]) => k !== 'id')
                    .map(([k, v]) => (
                      <SectionCard.DataRow key={k} label={k} value={String(v ?? '-') || '-'} />
                    ))
                ) : (
                  <div className="py-10 text-center text-body-md text-[var(--color-text-subtle)]">
                    데이터를 찾을 수 없습니다.
                  </div>
                )}
              </SectionCard.Content>
            </SectionCard>
          )}
        </VStack>
      </div>
    </AppLayout>
  );
}

export default CloudBuilderDetailPage;
