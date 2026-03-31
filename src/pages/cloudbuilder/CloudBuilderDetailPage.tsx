import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Button,
  CopyButton,
  DetailHeader,
  Modal,
  ProgressBar,
  StatusIndicator,
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
import { IconBell, IconBan, IconPower } from '@tabler/icons-react';
import { Sidebar } from '@/components/Sidebar';
import { FigmaCaptureWrapper } from '@/components/FigmaCaptureWrapper';
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

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function seededDateTime(seed: string) {
  const base = stableInt(seed);
  const yyyy = 2025;
  const mm = (base % 12) + 1;
  const dd = (base % 28) + 1;
  const hh = base % 24;
  const min = (base >>> 8) % 60 || 0;
  const sec = (base >>> 16) % 60 || 0;
  return `${MONTH_ABBR[mm - 1]} ${pad2(dd)}, ${yyyy} ${pad2(hh)}:${pad2(min)}:${pad2(sec)}`;
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
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  const [isFigmaCapture] = useState(
    () => new URLSearchParams(window.location.search).get('figma') === 'true'
  );

  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const id = params.id ?? '';

  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);
  const { row, columns } = useMemo(
    () => (id ? findRowWithColumns(config, id) : { row: null, columns: config.columns }),
    [config, id]
  );

  useEffect(() => {
    const name = row?.name ?? row?.hostname;
    if (name) updateActiveTabLabel(String(name));
  }, [row, updateActiveTabLabel]);

  const isNetworkAgent = slug === 'network-agents';
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = isNetworkAgent ? 'basic-information' : 'details';
  const activeDetailTab = searchParams.get('tab') || defaultTab;
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [serviceStatus, setServiceStatus] = useState<string>(row?.serviceStatus ?? 'Enabled');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<'Enabled' | 'Disabled'>('Disabled');
  const [disableReason, setDisableReason] = useState('');

  useEffect(() => {
    setServiceStatus(row?.serviceStatus ?? 'Enabled');
    setStatusModalOpen(false);
    setNextStatus('Disabled');
    setDisableReason('');
    const currentTab = searchParams.get('tab');
    if (!currentTab) {
      setSearchParams({ tab: isNetworkAgent ? 'basic-information' : 'details' }, { replace: true });
    }
  }, [slug, id, row?.serviceStatus, isNetworkAgent]);

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
      { key: 'formFactor', label: 'Form factor', sortable: true, width: '120px' },
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
    if (isFigmaCapture) {
      return (
        <FigmaCaptureWrapper {...shellProps} contentClassName="pt-4 px-8 pb-6">
          <div className="text-[var(--color-text-subtle)]">This page has no detail view.</div>
        </FigmaCaptureWrapper>
      );
    }
    return (
      <PageShell {...shellProps} contentClassName="pt-4 px-8 pb-6">
        <div className="text-[var(--color-text-subtle)]">This page has no detail view.</div>
      </PageShell>
    );
  }

  const pageContent = (
    <VStack gap={6} className="min-w-[1176px]">
      {isNetworkAgent ? (
        <DetailHeader
          id="tds-DetailHeader"
          data-figma-name="[TDS] DetailPageHeader"
          aria-label="[TDS] DetailPageHeader"
        >
          <DetailHeader.Title
            data-figma-name="[TDS] DetailPageHeader.Title"
            aria-label="[TDS] DetailPageHeader.Title"
          >
            {row?.name ?? `Network Agent #${id}`}
          </DetailHeader.Title>
          <DetailHeader.Actions
            data-figma-name="[TDS] DetailPageHeader.Actions"
            aria-label="[TDS] DetailPageHeader.Actions"
          >
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                serviceStatus === 'Disabled' ? <IconPower size={12} /> : <IconBan size={12} />
              }
              data-figma-name="[TDS] Button-EnableDisable"
              aria-label="[TDS] Button-EnableDisable"
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
          <DetailHeader.InfoGrid
            className="flex-wrap"
            data-figma-name="[TDS] DetailPageHeader.InfoGrid"
            aria-label="[TDS] DetailPageHeader.InfoGrid"
          >
            <DetailHeader.InfoCard
              label="Service State"
              data-figma-name="[TDS] DetailPageHeader.InfoField-ServiceState"
              aria-label="[TDS] DetailPageHeader.InfoField-ServiceState"
              value={row?.serviceState ?? 'Up'}
              status={(row?.serviceState ?? 'Up') === 'Up' ? 'active' : 'error'}
            />
            <DetailHeader.InfoCard
              label="Service Status"
              data-figma-name="[TDS] DetailPageHeader.InfoField-ServiceStatus"
              aria-label="[TDS] DetailPageHeader.InfoField-ServiceStatus"
              value={
                <Badge
                  theme={(serviceStatus || 'Enabled') === 'Enabled' ? 'green' : 'neutral'}
                  type="subtle"
                  size="sm"
                >
                  {serviceStatus || 'Enabled'}
                </Badge>
              }
            />
            <DetailHeader.InfoCard
              label="ID"
              value={row?.id ?? id}
              copyable
              data-figma-name="[TDS] DetailPageHeader.InfoField-ID"
              aria-label="[TDS] DetailPageHeader.InfoField-ID"
            />
            <DetailHeader.InfoCard
              label="Created at"
              value={networkAgentMeta?.createdAt ?? '-'}
              data-figma-name="[TDS] DetailPageHeader.InfoField-CreatedAt"
              aria-label="[TDS] DetailPageHeader.InfoField-CreatedAt"
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>
      ) : (
        <DetailHeader
          id="tds-DetailHeader"
          data-figma-name="[TDS] DetailPageHeader"
          aria-label="[TDS] DetailPageHeader"
        >
          <DetailHeader.Title
            data-figma-name="[TDS] DetailPageHeader.Title"
            aria-label="[TDS] DetailPageHeader.Title"
          >
            {(row as any)?.serial ?? (row as any)?.name ?? `${config.title} #${id}`}
          </DetailHeader.Title>
          <DetailHeader.InfoGrid
            data-figma-name="[TDS] DetailPageHeader.InfoGrid"
            aria-label="[TDS] DetailPageHeader.InfoGrid"
          >
            <DetailHeader.InfoCard
              label={isServer ? 'Serial' : 'ID'}
              value={isServer ? (serverDerived?.serverId ?? row?.id ?? id) : (row?.id ?? id)}
              copyable
              data-figma-name="[TDS] DetailPageHeader.InfoField-ID"
              aria-label="[TDS] DetailPageHeader.InfoField-ID"
            />
            {isServer && (
              <DetailHeader.InfoCard
                label="Role"
                data-figma-name="[TDS] DetailPageHeader.InfoField-Role"
                aria-label="[TDS] DetailPageHeader.InfoField-Role"
                value={renderStatusBadge(columns, 'role', String((row as any)?.role ?? '-') || '-')}
              />
            )}
            {isServer && (
              <DetailHeader.InfoCard
                label="Power"
                data-figma-name="[TDS] DetailPageHeader.InfoField-PowerState"
                aria-label="[TDS] DetailPageHeader.InfoField-PowerState"
                value={renderPowerStateBadge(serverDerived?.bmc.powerState ?? '-')}
              />
            )}
            {isServer && (
              <DetailHeader.InfoCard
                label="Status"
                data-figma-name="[TDS] DetailPageHeader.InfoField-Status"
                aria-label="[TDS] DetailPageHeader.InfoField-Status"
                value={renderStatusBadge(
                  columns,
                  'status',
                  String((row as any)?.status ?? '-') || '-'
                )}
              />
            )}
            {isServer && (
              <DetailHeader.InfoCard
                label="Domain"
                data-figma-name="[TDS] DetailPageHeader.InfoField-Domain"
                aria-label="[TDS] DetailPageHeader.InfoField-Domain"
                value={String((row as any)?.domain ?? '-')}
              />
            )}
          </DetailHeader.InfoGrid>
        </DetailHeader>
      )}

      {isNetworkAgent ? (
        <>
          <Tabs
            id="tds-Tabs"
            data-figma-name="[TDS] Tabs"
            aria-label="[TDS] Tabs"
            value={activeDetailTab}
            onChange={(v) => setActiveDetailTab(v as any)}
            variant="underline"
            size="sm"
          >
            <TabList data-figma-name="[TDS] Tabs.List" aria-label="[TDS] Tabs.List">
              <Tab
                value="basic-information"
                data-figma-name="[TDS] Tabs.Tab-BasicInfo"
                aria-label="[TDS] Tabs.Tab-BasicInfo"
              >
                Basic information
              </Tab>
              <Tab
                value="configuration"
                data-figma-name="[TDS] Tabs.Tab-Configuration"
                aria-label="[TDS] Tabs.Tab-Configuration"
              >
                Configuration
              </Tab>
            </TabList>

            <TabPanel
              value="basic-information"
              className="pt-4"
              data-figma-name="[TDS] Tabs.Panel-BasicInfo"
              aria-label="[TDS] Tabs.Panel-BasicInfo"
            >
              <SectionCard
                id="tds-SectionCard-BasicInfo"
                data-figma-name="[TDS] DetailCard-BasicInfo"
                aria-label="[TDS] DetailCard-BasicInfo"
              >
                <SectionCard.Header
                  title="Basic information"
                  data-figma-name="[TDS] DetailCard.Header-BasicInfo"
                  aria-label="[TDS] DetailCard.Header-BasicInfo"
                />
                <SectionCard.Content
                  data-figma-name="[TDS] DetailCard.Content-BasicInfo"
                  aria-label="[TDS] DetailCard.Content-BasicInfo"
                >
                  <SectionCard.DataRow
                    label="Type"
                    value={row?.type ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-Type"
                    aria-label="[TDS] DetailCard.Field-Type"
                  />
                  <SectionCard.DataRow
                    label="Host"
                    value={row?.host ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-Host"
                    aria-label="[TDS] DetailCard.Field-Host"
                  />
                  <SectionCard.DataRow
                    label="Availability zone"
                    value={row?.availabilityZone ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-AvailabilityZone"
                    aria-label="[TDS] DetailCard.Field-AvailabilityZone"
                  />
                  <SectionCard.DataRow
                    label="Topic"
                    value={networkAgentMeta?.topic ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-Topic"
                    aria-label="[TDS] DetailCard.Field-Topic"
                  />
                  <SectionCard.DataRow
                    label="Resources synced"
                    value={networkAgentMeta?.resourcesSynced ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-ResourcesSynced"
                    aria-label="[TDS] DetailCard.Field-ResourcesSynced"
                  />
                  <SectionCard.DataRow
                    label="Heartbeat timestamp"
                    value={networkAgentMeta?.heartbeatTimestamp ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-HeartbeatTimestamp"
                    aria-label="[TDS] DetailCard.Field-HeartbeatTimestamp"
                  />
                  <SectionCard.DataRow
                    label="Started at"
                    value={networkAgentMeta?.startedAt ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-StartedAt"
                    aria-label="[TDS] DetailCard.Field-StartedAt"
                  />
                  <SectionCard.DataRow
                    label="Description"
                    value={networkAgentMeta?.description ?? '-'}
                    data-figma-name="[TDS] DetailCard.Field-Description"
                    aria-label="[TDS] DetailCard.Field-Description"
                  />
                </SectionCard.Content>
              </SectionCard>
            </TabPanel>

            <TabPanel
              value="configuration"
              className="pt-4"
              data-figma-name="[TDS] Tabs.Panel-Configuration"
              aria-label="[TDS] Tabs.Panel-Configuration"
            >
              <SectionCard
                id="tds-SectionCard-Config"
                data-figma-name="[TDS] DetailCard-Config"
                aria-label="[TDS] DetailCard-Config"
              >
                <SectionCard.Header
                  title="Configuration"
                  actions={
                    <CopyButton
                      value={networkAgentMeta?.configurationText ?? ''}
                      size="sm"
                      label="Copy"
                      successLabel="Copied"
                    />
                  }
                  data-figma-name="[TDS] DetailCard.Header-Config"
                  aria-label="[TDS] DetailCard.Header-Config"
                />
                <SectionCard.Content
                  gap={3}
                  data-figma-name="[TDS] DetailCard.Content-Config"
                  aria-label="[TDS] DetailCard.Content-Config"
                >
                  <pre className="max-h-[420px] overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3 text-[12px] leading-5 text-[var(--color-text-default)]">
                    {networkAgentMeta?.configurationText ?? ''}
                  </pre>
                </SectionCard.Content>
              </SectionCard>
            </TabPanel>
          </Tabs>

          <Modal
            isOpen={statusModalOpen}
            onClose={() => {
              setStatusModalOpen(false);
              setDisableReason('');
            }}
            title={
              nextStatus === 'Disabled'
                ? `Disable ${config.title.replace(/s$/, '').toLowerCase()}`
                : `Enable ${config.title.replace(/s$/, '').toLowerCase()}`
            }
            description={
              nextStatus === 'Disabled'
                ? `Change this ${config.title.replace(/s$/, '').toLowerCase()} status to Disabled?`
                : `Change this ${config.title.replace(/s$/, '').toLowerCase()} status to Enabled?`
            }
            data-figma-name="[TDS] ResourceActionModal"
            aria-label="[TDS] ResourceActionModal"
          >
            <>
              {nextStatus === 'Disabled' && !!config.statusAction?.requireDisableReason ? (
                <div className="flex flex-col gap-2">
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    Reason <span className="text-[var(--color-state-danger)]">*</span>
                  </span>
                  <Textarea
                    placeholder="Enter a reason for disabling"
                    value={disableReason}
                    onChange={(e) => setDisableReason(e.target.value)}
                    fullWidth
                  />
                </div>
              ) : null}

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setStatusModalOpen(false);
                    setDisableReason('');
                  }}
                  className="flex-1"
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
                  className="flex-1"
                >
                  {nextStatus === 'Disabled' ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </>
          </Modal>
        </>
      ) : row ? (
        <Tabs
          id="tds-Tabs"
          data-figma-name="[TDS] Tabs"
          aria-label="[TDS] Tabs"
          value={activeDetailTab}
          onChange={(v) => setActiveDetailTab(v as any)}
          variant="underline"
          size="sm"
        >
          <TabList data-figma-name="[TDS] Tabs.List" aria-label="[TDS] Tabs.List">
            <Tab
              value="details"
              data-figma-name="[TDS] Tabs.Tab-Details"
              aria-label="[TDS] Tabs.Tab-Details"
            >
              Details
            </Tab>
          </TabList>

          <TabPanel
            value="details"
            className="pt-4"
            data-figma-name="[TDS] Tabs.Panel-Details"
            aria-label="[TDS] Tabs.Panel-Details"
          >
            {isServer ? (
              <VStack gap={6}>
                <SectionCard
                  id="tds-SectionCard-BasicInfo"
                  data-figma-name="[TDS] DetailCard-BasicInfo"
                  aria-label="[TDS] DetailCard-BasicInfo"
                >
                  <SectionCard.Header
                    title="Basic Information"
                    data-figma-name="[TDS] DetailCard.Header-BasicInfo"
                    aria-label="[TDS] DetailCard.Header-BasicInfo"
                  />
                  <SectionCard.Content
                    data-figma-name="[TDS] DetailCard.Content-BasicInfo"
                    aria-label="[TDS] DetailCard.Content-BasicInfo"
                  >
                    <SectionCard.DataRow
                      label="Product name"
                      value={serverDerived?.productName ?? 'ThinkSystem SR646 V3'}
                      showDivider={false}
                    />
                    <SectionCard.DataRow
                      label="Manufacturer"
                      value={serverDerived?.manufacturer ?? 'Lenovo'}
                    />
                    <SectionCard.DataRow
                      label="BIOS version"
                      value={serverDerived?.biosVersion ?? 'KAE194D'}
                    />
                    <SectionCard.DataRow
                      label="BMC IP"
                      value={String((row as any)?.bmcIp ?? '10.0.0.151')}
                    />
                    <SectionCard.DataRow
                      label="Location"
                      value={serverDerived?.location ?? 'Rack1-1 / Rack1-1 / U40'}
                    />
                    <SectionCard.DataRow
                      label="Created at"
                      value={serverDerived?.createdAt ?? 'Oct 06, 2025 09:05:45'}
                    />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard
                  id="tds-SectionCard-Hardware"
                  data-figma-name="[TDS] DetailCard-Hardware"
                  aria-label="[TDS] DetailCard-Hardware"
                >
                  <SectionCard.Header
                    title="Hardware"
                    data-figma-name="[TDS] DetailCard.Header-Hardware"
                    aria-label="[TDS] DetailCard.Header-Hardware"
                  />
                  <SectionCard.Content
                    data-figma-name="[TDS] DetailCard.Content-Hardware"
                    aria-label="[TDS] DetailCard.Content-Hardware"
                  >
                    <SectionCard.DataRow
                      label="CPU"
                      value={serverDerived?.cpu ?? 'AMD EPYC 9124 16-Core Processor (2 sockets)'}
                      showDivider={false}
                    />
                    <SectionCard.DataRow label="Memory" value={serverDerived?.memory ?? '32 GB'} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            ) : (
              <SectionCard
                id="tds-SectionCard-Details"
                data-figma-name="[TDS] DetailCard-Details"
                aria-label="[TDS] DetailCard-Details"
              >
                <SectionCard.Header
                  title="Details"
                  data-figma-name="[TDS] DetailCard.Header-Details"
                  aria-label="[TDS] DetailCard.Header-Details"
                />
                <SectionCard.Content
                  data-figma-name="[TDS] DetailCard.Content-Details"
                  aria-label="[TDS] DetailCard.Content-Details"
                >
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
        </Tabs>
      ) : (
        <SectionCard
          id="tds-SectionCard-Empty"
          data-figma-name="[TDS] DetailCard-Empty"
          aria-label="[TDS] DetailCard-Empty"
        >
          <SectionCard.Header
            title="Details"
            data-figma-name="[TDS] DetailCard.Header-Empty"
            aria-label="[TDS] DetailCard.Header-Empty"
          />
          <SectionCard.Content
            data-figma-name="[TDS] DetailCard.Content-Empty"
            aria-label="[TDS] DetailCard.Content-Empty"
          >
            <div className="py-10 text-center text-body-md text-[var(--color-text-subtle)]">
              데이터를 찾을 수 없습니다.
            </div>
          </SectionCard.Content>
        </SectionCard>
      )}
    </VStack>
  );

  if (isFigmaCapture) {
    return (
      <FigmaCaptureWrapper
        {...shellProps}
        contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
      >
        {pageContent}
      </FigmaCaptureWrapper>
    );
  }

  return (
    <PageShell {...shellProps} contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
      {pageContent}
    </PageShell>
  );
}

export default CloudBuilderDetailPage;
