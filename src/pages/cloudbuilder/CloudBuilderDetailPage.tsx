import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  DetailHeader,
  Modal,
  ProgressBar,
  StatusIndicator,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Textarea,
  SectionCard,
  VStack,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  type TableColumn,
} from '@/design-system';
import { IconCopy, IconBell, IconBan } from '@tabler/icons-react';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import {
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
  CLOUD_BUILDER_SLUGS,
} from './consoleListConfig';

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

function findRowWithColumns(config: ReturnType<typeof getCloudBuilderListConfig>, id: string) {
  const inBase = config.rows?.find((r) => r.id === id);
  if (inBase) return { row: inBase, columns: config.columns };

  const inTab = config.tabs?.find((t) => t.rows?.some((r) => r.id === id));
  const inTabRow = inTab?.rows?.find((r) => r.id === id);
  if (inTab && inTabRow) return { row: inTabRow, columns: inTab.columns };

  return { row: null, columns: config.columns };
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

function toneToBadgeTheme(tone: 'success' | 'neutral' | 'blue' | 'warning' | 'danger') {
  switch (tone) {
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'danger':
      return 'red';
    case 'blue':
      return 'blue';
    case 'neutral':
    default:
      return 'gray';
  }
}

function renderStatusBadge(
  columns: Array<{
    key: string;
    kind?: string;
    badgeTones?: Record<string, 'success' | 'neutral' | 'blue' | 'warning' | 'danger'>;
  }>,
  key: string,
  value: string
) {
  const col = columns.find((c) => c.key === key);
  const tone = col?.kind === 'badge' ? (col.badgeTones?.[value] ?? 'neutral') : 'neutral';
  return (
    <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
      {value}
    </Badge>
  );
}

function renderPowerStateBadge(value: string) {
  const v = (value || '-').toLowerCase();
  const theme = v === 'on' ? 'green' : 'gray';
  return (
    <Badge theme={theme} type="subtle" size="sm">
      {value || '-'}
    </Badge>
  );
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
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const id = params.id ?? '';

  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);
  const { row, columns } = useMemo(
    () => (id ? findRowWithColumns(config, id) : { row: null, columns: config.columns }),
    [config, id]
  );

  const isNetworkAgent = slug === 'network-agents';
  const [activeDetailTab, setActiveDetailTab] = useState<
    'details' | 'disk' | 'configuration' | 'bmc-info'
  >('details');

  const [serviceStatus, setServiceStatus] = useState<string>(row?.serviceStatus ?? 'Enabled');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<'Enabled' | 'Disabled'>('Disabled');
  const [disableReason, setDisableReason] = useState('');

  useEffect(() => {
    setServiceStatus(row?.serviceStatus ?? 'Enabled');
    setStatusModalOpen(false);
    setNextStatus('Disabled');
    setDisableReason('');
    setActiveDetailTab('details');
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

  const hasDetail = slug !== 'services' && slug !== 'compute-services';

  const isServer = slug === 'servers' || slug === 'severs0.7';

  const serverDerived = useMemo(() => {
    if (!isServer) return null;
    const seed = `server:${slug}:${id}:${(row as any)?.serial ?? ''}:${(row as any)?.macPrimary ?? ''}`;
    const h = stableInt(seed);

    const idCode = stableInt(`server-id:${seed}`)
      .toString(36)
      .toUpperCase()
      .padStart(7, '0')
      .slice(0, 7);
    const serverId = `J${idCode}`;

    const providerVlan = 100 + (h % 3000);
    const providerIp = `10.0.${(h % 50) + 1}.${(h % 200) + 10}`;
    const derivedProviderNetwork = `VLAN ${providerVlan} / ${providerIp}`;
    const providerNetwork = String((row as any)?.frontierNet ?? '') || derivedProviderNetwork;

    const domains = ['thaki-prod', 'thaki-stage', 'thaki-dev', 'thaki-lab'] as const;
    const domain = domains[h % domains.length]!;

    const serial = String((row as any)?.serial ?? '-');
    const hostname =
      serial && serial !== '-' ? `hostname-${serial.toLowerCase()}` : `hostname-${id}`;

    const powerState = h % 2 === 0 ? 'on' : 'off';
    const bmcIp = `10.0.0.${(h % 240) + 10}`;
    const machineType = '7D9C';
    const managerEthernetInterface = '/redfish/v1/Managers/1/EthernetInterfaces/1';

    const createdAt = seededDateTime(`server-created:${seed}`);
    const updatedAt = String((row as any)?.updatedAt ?? seededDateTime(`server-updated:${seed}`));

    const type = 'Ironic Baremetal';

    return {
      serverId,
      type,
      providerNetwork,
      domain,
      createdAt,
      updatedAt,
      bmc: { hostname, machineType, powerState, bmcIp, managerEthernetInterface },
    };
  }, [id, isServer, row, slug]);

  const serverInfoJsonText = useMemo(() => {
    const sid = serverDerived?.serverId ?? 'J902C1W8';
    return `{
  "schema_version": "1.0",
  "generated_at": null,

  "raid_policies": {
    "compute": [
      { "name": "R1_Bay0_1", "raid_type": "RAID1", "drives": ["Disk.0", "Disk.1"] }
    ],
    "ceph": [
      { "name": "R1_Bay0_1", "raid_type": "RAID1", "drives": ["Disk.0", "Disk.1"] }
    ],
    "mgmt": [
      { "name": "R1_Bay0_1", "raid_type": "RAID1", "drives": ["Disk.0", "Disk.1"] },
      { "name": "R1_Bay2_3", "raid_type": "RAID1", "drives": ["Disk.2", "Disk.3"] }
    ]
  },

  "servers": {
    "${sid}": {
      "serial_number": "${sid}",
      "role": "compute",
      "hostname": "hostname01",
      "location": { "building": "Rack1-1" },
      "placement": { "rack": "Rack1-1", "rack_offset_u": 40 },

      "bmc": {
        "bmc_ip": null,
        "manager_ethernet_interface": "/redfish/v1/Managers/1/EthernetInterfaces/1"
      },

      "product": { "product_name": null, "model": null },

      "network": {
        "bmc": { "mac": null, "ipv4": null },
        "host_nics": [],
        "host_nics_admin": []
      },

      "storage": {
        "controllers": [],
        "volumes": [],
        "disks": []
      },

      "firmware": {
        "inventory": [],
        "last_update": {
          "requested_at": null,
          "image_uri": null,
          "task_monitor": null,
          "result": null
        }
      },

      "health": { "power_state": null, "state": null, "health": null },

      "timestamps": {
        "last_collected_at": null,
        "last_pushed_at": null,
        "last_raid_config_at": null,
        "last_report_at": null
      }
    }
  }
}`;
  }, [serverDerived?.serverId]);

  type DiskRow = {
    id: string;
    location: string;
    manufacturer: string;
    product: string;
    status: 'Normal' | 'Warning' | 'Failed';
    capacity: string;
    interface: string;
    media: string;
    formFactor: string;
    miscellaneous: string;
  };

  const diskRows: DiskRow[] = useMemo(() => {
    if (!isServer) return [];
    const seed = `${slug}:${id}:${serverDerived?.serverId ?? ''}`;
    const base = stableInt(`disk:${seed}`);
    const vendors = ['Intel', 'ATA', 'Samsung', 'Micron'] as const;
    const products = ['SSDSC2KB240GZL', 'MZ7L3480HEJD-00A07', 'PM9A3', 'P4510'] as const;
    const capacities = ['240 GB', '240 GB', '480 GB', '480 GB'] as const;
    const bays = [0, 1, 2, 3];

    return bays.map((bay, idx) => {
      const v = vendors[(base + idx) % vendors.length]!;
      const p = products[(base + idx) % products.length]!;
      const cap = capacities[idx]!;
      return {
        id: `bay-${bay}`,
        location: `Bay ${bay}`,
        manufacturer: v,
        product: p,
        status: 'Normal' as const,
        capacity: cap,
        interface: 'SATA',
        media: 'SSD',
        formFactor: '2.5"',
        miscellaneous: '100% Remaining Life',
      };
    });
  }, [id, isServer, serverDerived?.serverId, slug]);

  const diskColumns: TableColumn<DiskRow>[] = useMemo(
    () => [
      { key: 'location', label: 'Location', sortable: true, width: '140px' },
      { key: 'manufacturer', label: 'Manufacturer', sortable: true, width: '160px' },
      { key: 'product', label: 'Product', sortable: true, flex: 1 },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        width: '140px',
        render: (_: string, r: DiskRow) => (
          <div className="flex items-center gap-2">
            <StatusIndicator
              status={
                r.status === 'Normal' ? 'active' : r.status === 'Warning' ? 'maintenance' : 'error'
              }
              layout="icon-only"
              size="sm"
            />
            <span className="text-[12px] text-[var(--color-text-default)]">{r.status}</span>
          </div>
        ),
      },
      { key: 'capacity', label: 'Capacity', sortable: true, width: '120px' },
      { key: 'interface', label: 'Interface', sortable: true, width: '110px' },
      { key: 'media', label: 'Media', sortable: true, width: '90px' },
      { key: 'formFactor', label: 'Form Factor', sortable: true, width: '120px' },
      { key: 'miscellaneous', label: 'Miscellaneous', sortable: false, width: '180px' },
    ],
    []
  );

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/project' },
    { label: config.title, href: `/cloudbuilder/${slug}` },
    { label: row?.name ?? (row as any)?.serial ?? id },
  ];

  const shellProps = {
    sidebar: <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />,
    sidebarWidth: sidebarOpen ? 200 : 0,
    tabBar: (
      <TabBar
        tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
        activeTab={activeTabId}
        onTabChange={selectTab}
        onTabClose={closeTab}
        onTabAdd={addNewTab}
        onTabReorder={moveTab}
        showAddButton={true}
        showWindowControls={true}
        onWindowClose={() => navigate('/')}
      />
    ),
    topBar: (
      <TopBar
        showSidebarToggle={!sidebarOpen}
        onSidebarToggle={openSidebar}
        showNavigation={true}
        onBack={() => window.history.back()}
        onForward={() => window.history.forward()}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        actions={
          <TopBarAction
            icon={<IconBell size={16} stroke={1.5} />}
            aria-label="Notifications"
            badge={true}
          />
        }
      />
    ),
  };

  if (!hasDetail) {
    return (
      <PageShell {...shellProps} contentClassName="pt-4 px-8 pb-6">
        <div className="text-[var(--color-text-subtle)]">This page has no detail view.</div>
      </PageShell>
    );
  }

  return (
    <PageShell {...shellProps} contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
      <VStack gap={4} className="min-w-[1176px]">
        {isNetworkAgent ? (
          <DetailHeader>
            <DetailHeader.Title>{row?.name ?? `Network Agent #${id}`}</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconBan size={12} />}
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
              <DetailHeader.InfoCard
                label="Service Status"
                value={serviceStatus || 'Enabled'}
                status={(serviceStatus || 'Enabled') === 'Enabled' ? 'active' : 'deactivated'}
              />
              <DetailHeader.InfoCard
                label="Service State"
                value={row?.serviceState ?? 'Up'}
                status={(row?.serviceState ?? 'Up') === 'Up' ? 'active' : 'down'}
              />
              <DetailHeader.InfoCard label="ID" value={row?.id ?? id} copyable />
              <DetailHeader.InfoCard
                label="Created At"
                value={networkAgentMeta?.createdAt ?? '-'}
              />
            </DetailHeader.InfoGrid>
          </DetailHeader>
        ) : (
          <DetailHeader>
            <DetailHeader.Title>
              {(row as any)?.serial ?? (row as any)?.name ?? `${config.title} #${id}`}
            </DetailHeader.Title>
            <DetailHeader.InfoGrid>
              <DetailHeader.InfoCard
                label="ID"
                value={isServer ? (serverDerived?.serverId ?? row?.id ?? id) : (row?.id ?? id)}
                copyable
              />
              {isServer ? (
                <>
                  <DetailHeader.InfoCard
                    label="Observed Health"
                    value={renderStatusBadge(
                      columns,
                      'observedHealth',
                      String((row as any)?.observedHealth ?? '-') || '-'
                    )}
                  />
                  <DetailHeader.InfoCard
                    label="Provision Status"
                    value={renderStatusBadge(
                      columns,
                      'provisionStatus',
                      String((row as any)?.provisionStatus ?? '-') || '-'
                    )}
                  />
                  <DetailHeader.InfoCard
                    label="Role"
                    value={renderStatusBadge(
                      columns,
                      'role',
                      String((row as any)?.role ?? '-') || '-'
                    )}
                  />
                  <DetailHeader.InfoCard
                    label="Power State"
                    value={renderPowerStateBadge(serverDerived?.bmc.powerState ?? '-')}
                  />
                </>
              ) : null}
            </DetailHeader.InfoGrid>
          </DetailHeader>
        )}

        {isNetworkAgent ? (
          <>
            <SectionCard>
              <SectionCard.Header title="Basic Information" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Type" value={row?.type ?? '-'} />
                <SectionCard.DataRow label="Host" value={row?.host ?? '-'} />
                <SectionCard.DataRow
                  label="Availability Zone"
                  value={row?.availabilityZone ?? '-'}
                />
                <SectionCard.DataRow label="Topic" value={networkAgentMeta?.topic ?? '-'} />
                <SectionCard.DataRow
                  label="Resources Synced"
                  value={networkAgentMeta?.resourcesSynced ?? '-'}
                />
                <SectionCard.DataRow
                  label="Heartbeat Timestamp"
                  value={networkAgentMeta?.heartbeatTimestamp ?? '-'}
                />
                <SectionCard.DataRow
                  label="Started At"
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
                <pre className="max-h-[420px] overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3 text-[12px] leading-5 text-[var(--color-text-default)]">
                  {networkAgentMeta?.configurationText ?? ''}
                </pre>
              </SectionCard.Content>
            </SectionCard>

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
        ) : row ? (
          <Tabs
            value={activeDetailTab}
            onChange={(v) => setActiveDetailTab(v as any)}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="details">Details</Tab>
              {isServer ? <Tab value="disk">Disk</Tab> : null}
              {isServer ? <Tab value="bmc-info">BMC INFO</Tab> : null}
              {isNetworkAgent ? <Tab value="configuration">Configuration</Tab> : null}
            </TabList>

            <TabPanel value="details" className="pt-4">
              {isServer ? (
                <VStack gap={6}>
                  <SectionCard>
                    <SectionCard.Header title="Basic Info" />
                    <SectionCard.Content>
                      <SectionCard.DataRow
                        label="Type"
                        value={serverDerived?.type ?? '-'}
                        showDivider={false}
                      />
                      <SectionCard.DataRow
                        label="MAC (Primary)"
                        value={String((row as any)?.macPrimary ?? '-') || '-'}
                      />
                      <SectionCard.DataRow
                        label="NIC (Primary Name)"
                        value={String((row as any)?.nicPrimaryName ?? '-') || '-'}
                      />
                      <SectionCard.DataRow
                        label="Location"
                        value={String((row as any)?.location ?? '-') || '-'}
                      />
                      <SectionCard.DataRow
                        label="Provider Network"
                        value={serverDerived?.providerNetwork ?? '-'}
                      />
                      <SectionCard.DataRow
                        label="Mgmt IP"
                        value={String((row as any)?.mgmtIp ?? '-') || '-'}
                      />
                      <SectionCard.DataRow
                        label="Created At"
                        value={serverDerived?.createdAt ?? '-'}
                      />
                      <SectionCard.DataRow
                        label="Updated At"
                        value={serverDerived?.updatedAt ?? '-'}
                      />
                      <SectionCard.DataRow label="Domain" value={serverDerived?.domain ?? '-'} />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>
              ) : (
                <SectionCard>
                  <SectionCard.Header title="Details" />
                  <SectionCard.Content>
                    {columns.map((column, idx) => {
                      const value = String((row as any)?.[column.key] ?? '-') || '-';
                      const showDivider = idx > 0;

                      if (column.key === 'storageCapacityGiB') {
                        const used = Number((row as any).storageUsedGiB ?? 0);
                        const total = Number((row as any).storageTotalGiB ?? 0);
                        const safeUsed = Number.isFinite(used) ? used : 0;
                        const safeTotal = Number.isFinite(total) ? total : 0;
                        return (
                          <SectionCard.DataRow
                            key={column.key}
                            label={column.label}
                            showDivider={showDivider}
                          >
                            <div className="flex flex-col gap-2 w-full max-w-[520px]">
                              <ProgressBar value={safeUsed} max={safeTotal} showValue={false} />
                              <div className="text-[12px] text-[var(--color-text-default)]">
                                {safeUsed.toFixed(2)} / {safeTotal.toFixed(2)}
                              </div>
                            </div>
                          </SectionCard.DataRow>
                        );
                      }

                      if (column.kind === 'badge') {
                        const tone = column.badgeTones?.[value] ?? 'neutral';
                        return (
                          <SectionCard.DataRow
                            key={column.key}
                            label={column.label}
                            showDivider={showDivider}
                          >
                            <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
                              {value}
                            </Badge>
                          </SectionCard.DataRow>
                        );
                      }

                      return (
                        <SectionCard.DataRow
                          key={column.key}
                          label={column.label}
                          value={value}
                          showDivider={showDivider}
                        />
                      );
                    })}
                  </SectionCard.Content>
                </SectionCard>
              )}
            </TabPanel>

            {isServer ? (
              <TabPanel value="disk" className="pt-4">
                <VStack gap={6}>
                  <SectionCard>
                    <SectionCard.Header title="Storage Detail" />
                    <SectionCard.Content gap={3}>
                      <div className="text-[13px] font-medium text-[var(--color-text-default)]">
                        Controller 1: ThinkSystem RAID 9350-8i 2GB Flash PCIe 12Gb Adapter (PCI Slot
                        1)
                      </div>
                      <Table<DiskRow>
                        columns={diskColumns}
                        data={diskRows}
                        rowKey="id"
                        emptyMessage="No disks found"
                      />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>
              </TabPanel>
            ) : null}

            {isServer ? (
              <TabPanel value="bmc-info" className="pt-4">
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-12 lg:col-span-4">
                    <SectionCard>
                      <SectionCard.Header title="BMC" />
                      <SectionCard.Content>
                        <SectionCard.DataRow
                          label="Hostname"
                          value={serverDerived?.bmc.hostname ?? '-'}
                          showDivider={false}
                        />
                        <SectionCard.DataRow
                          label="Machine Type"
                          value={serverDerived?.bmc.machineType ?? '-'}
                        />
                        <SectionCard.DataRow
                          label="Power State"
                          value={serverDerived?.bmc.powerState ?? '-'}
                        />
                        <SectionCard.DataRow
                          label="BMC IP"
                          value={serverDerived?.bmc.bmcIp ?? '-'}
                        />
                        <SectionCard.DataRow
                          label="Manager Ethernet Interface"
                          value={serverDerived?.bmc.managerEthernetInterface ?? '-'}
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </div>
                  <div className="col-span-12 lg:col-span-8">
                    <SectionCard>
                      <SectionCard.Header
                        title="server_info.json"
                        actions={
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconCopy size={12} stroke={1.5} />}
                            onClick={() => {
                              navigator.clipboard.writeText(serverInfoJsonText);
                            }}
                          >
                            Copy
                          </Button>
                        }
                      />
                      <SectionCard.Content gap={3}>
                        <pre className="max-h-[520px] overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3 text-[12px] leading-5 text-[var(--color-text-default)]">
                          {serverInfoJsonText}
                        </pre>
                      </SectionCard.Content>
                    </SectionCard>
                  </div>
                </div>
              </TabPanel>
            ) : null}

            {isNetworkAgent ? (
              <TabPanel value="configuration" className="pt-4">
                <VStack gap={6}>
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
                      <pre className="max-h-[420px] overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3 text-[12px] leading-5 text-[var(--color-text-default)]">
                        {networkAgentMeta?.configurationText ?? ''}
                      </pre>
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>
              </TabPanel>
            ) : null}
          </Tabs>
        ) : (
          <SectionCard>
            <SectionCard.Header title="Details" />
            <SectionCard.Content>
              <div className="py-10 text-center text-body-md text-[var(--color-text-subtle)]">
                데이터를 찾을 수 없습니다.
              </div>
            </SectionCard.Content>
          </SectionCard>
        )}
      </VStack>
    </PageShell>
  );
}

export default CloudBuilderDetailPage;
