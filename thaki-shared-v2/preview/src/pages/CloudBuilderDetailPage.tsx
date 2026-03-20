import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Textarea } from '@shared/components/Textarea';
import { ProgressBar } from '@shared/components/ProgressBar';
import { ActionModal } from '@shared/components/ActionModal';
import { CopyButton } from '@shared/components/CopyButton';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconBan, IconPower } from '@tabler/icons-react';
import {
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
  type BadgeTone,
  CLOUD_BUILDER_SLUGS,
} from '../data/consoleListConfig';

type RowData = Record<string, string> & { id: string };

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

function toneToBadgeTheme(tone: BadgeTone): 'gre' | 'gry' | 'blu' | 'ylw' | 'red' {
  switch (tone) {
    case 'success':
      return 'gre';
    case 'warning':
      return 'ylw';
    case 'danger':
      return 'red';
    case 'blue':
      return 'blu';
    case 'neutral':
    default:
      return 'gry';
  }
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

function findRowWithColumns(config: ReturnType<typeof getCloudBuilderListConfig>, id: string) {
  const inBase = config.rows?.find((r) => r.id === id);
  if (inBase) return { row: inBase, columns: config.columns };
  const inTab = config.tabs?.find((t) => t.rows?.some((r) => r.id === id));
  const inTabRow = inTab?.rows?.find((r) => r.id === id);
  if (inTab && inTabRow) return { row: inTabRow, columns: inTab.columns };
  return { row: null, columns: config.columns };
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
  [key: string]: unknown;
};

export function CloudBuilderDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const id = params.id ?? '';

  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);
  const { row, columns } = useMemo(
    () => (id ? findRowWithColumns(config, id) : { row: null, columns: config.columns }),
    [config, id]
  );

  const isNetworkAgent = slug === 'network-agents';
  const isServer = slug === 'servers' || slug === 'severs0.7';
  const hasDetail = slug !== 'services' && slug !== 'compute-services';

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
  }, [slug, id, row?.serviceStatus]);

  const networkAgentMeta = useMemo(() => {
    if (!isNetworkAgent) return null;
    const seed = `${slug}:${id}:${row?.name ?? ''}`;
    return {
      createdAt: seededDateTime(`agent-created:${seed}`),
      startedAt: seededDateTime(`agent-started:${seed}`),
      heartbeatTimestamp: seededDateTime(`agent-heartbeat:${seed}`),
      topic: row?.name?.includes('dhcp') ? 'dhcp_agent' : 'neutron_agent',
      resourcesSynced:
        stableInt(`agent-resources:${seed}`) % 2 === 0 ? '-' : String((stableInt(seed) % 1000) + 1),
      description: '-',
      configurationText: JSON.stringify(makeNetworkAgentConfiguration(seed), null, 2),
    };
  }, [isNetworkAgent, slug, id, row?.name]);

  const serverDerived = useMemo(() => {
    if (!isServer) return null;
    const seed = `server:${slug}:${id}:${(row as any)?.serial ?? ''}:${(row as any)?.macPrimary ?? ''}`;
    const h = stableInt(seed);
    const idCode = stableInt(`server-id:${seed}`)
      .toString(36)
      .toUpperCase()
      .padStart(7, '0')
      .slice(0, 7);
    const domains = ['thaki-prod', 'thaki-stage', 'thaki-dev', 'thaki-lab'] as const;
    const serial = String((row as any)?.serial ?? '-');
    return {
      serverId: `J${idCode}`,
      type: 'Ironic Baremetal',
      providerNetwork:
        String((row as any)?.frontierNet ?? '') ||
        `VLAN ${100 + (h % 3000)} / 10.0.${(h % 50) + 1}.${(h % 200) + 10}`,
      domain: domains[h % domains.length]!,
      createdAt: seededDateTime(`server-created:${seed}`),
      updatedAt: String((row as any)?.updatedAt ?? seededDateTime(`server-updated:${seed}`)),
      bmc: {
        hostname: serial !== '-' ? `hostname-${serial.toLowerCase()}` : `hostname-${id}`,
        machineType: '7D9C',
        powerState: h % 2 === 0 ? 'on' : 'off',
        bmcIp: `10.0.0.${(h % 240) + 10}`,
        managerEthernetInterface: '/redfish/v1/Managers/1/EthernetInterfaces/1',
      },
    };
  }, [id, isServer, row, slug]);

  const serverInfoJsonText = useMemo(() => {
    const sid = serverDerived?.serverId ?? 'J902C1W8';
    return JSON.stringify(
      {
        schema_version: '1.0',
        generated_at: null,
        servers: {
          [sid]: {
            serial_number: sid,
            role: 'compute',
            hostname: 'hostname01',
            bmc: {
              bmc_ip: null,
              manager_ethernet_interface: '/redfish/v1/Managers/1/EthernetInterfaces/1',
            },
          },
        },
      },
      null,
      2
    );
  }, [serverDerived?.serverId]);

  const diskRows: DiskRow[] = useMemo(() => {
    if (!isServer) return [];
    const seed = `${slug}:${id}:${serverDerived?.serverId ?? ''}`;
    const base = stableInt(`disk:${seed}`);
    const vendors = ['Intel', 'ATA', 'Samsung', 'Micron'] as const;
    const products = ['SSDSC2KB240GZL', 'MZ7L3480HEJD-00A07', 'PM9A3', 'P4510'] as const;
    const capacities = ['240 GB', '240 GB', '480 GB', '480 GB'] as const;
    return [0, 1, 2, 3].map((bay, idx) => ({
      id: `bay-${bay}`,
      location: `Bay ${bay}`,
      manufacturer: vendors[(base + idx) % vendors.length]!,
      product: products[(base + idx) % products.length]!,
      status: 'Normal' as const,
      capacity: capacities[idx]!,
      interface: 'SATA',
      media: 'SSD',
      formFactor: '2.5"',
      miscellaneous: '100% Remaining Life',
    }));
  }, [id, isServer, serverDerived?.serverId, slug]);

  const diskColumns: TableColumn[] = [
    { key: 'location', header: 'Location', sortable: true, width: 140 },
    { key: 'manufacturer', header: 'Manufacturer', sortable: true, width: 160 },
    { key: 'product', header: 'Product', sortable: true },
    { key: 'status', header: 'Status', sortable: true, width: 140 },
    { key: 'capacity', header: 'Capacity', sortable: true, width: 120 },
    { key: 'interface', header: 'Interface', sortable: true, width: 110 },
    { key: 'media', header: 'Media', sortable: true, width: 90 },
    { key: 'formFactor', header: 'Form factor', sortable: true, width: 120 },
    { key: 'miscellaneous', header: 'Miscellaneous', width: 180 },
  ];

  if (!hasDetail) {
    return <div className="text-text-muted">This page has no detail view.</div>;
  }

  const renderBadge = (key: string, value: string) => {
    const col = columns.find((c) => c.key === key);
    const tone = col?.kind === 'badge' ? (col.badgeTones?.[value] ?? 'neutral') : 'neutral';
    return (
      <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
        {value}
      </Badge>
    );
  };

  if (isNetworkAgent) {
    const infoFields: DetailPageHeaderInfoField[] = [
      {
        label: 'Service State',
        value: row?.serviceState ?? 'Up',
        accessory: (
          <StatusIndicator
            variant={(row?.serviceState ?? 'Up') === 'Up' ? 'active' : 'error'}
            layout="iconOnly"
          />
        ),
      },
      {
        label: 'Service Status',
        value: (
          <Badge theme={serviceStatus === 'Enabled' ? 'gre' : 'gry'} type="subtle" size="sm">
            {serviceStatus}
          </Badge>
        ),
      },
      { label: 'ID', value: row?.id ?? id, showCopyButton: true, copyText: row?.id ?? id },
      { label: 'Created at', value: networkAgentMeta?.createdAt ?? '-' },
    ];

    const basicInfoFields: DetailCardField[] = [
      { label: 'Type', value: row?.type ?? '-' },
      { label: 'Host', value: row?.host ?? '-' },
      { label: 'Availability zone', value: row?.availabilityZone ?? '-' },
      { label: 'Topic', value: networkAgentMeta?.topic ?? '-' },
      { label: 'Resources synced', value: networkAgentMeta?.resourcesSynced ?? '-' },
      { label: 'Heartbeat timestamp', value: networkAgentMeta?.heartbeatTimestamp ?? '-' },
      { label: 'Started at', value: networkAgentMeta?.startedAt ?? '-' },
      { label: 'Description', value: networkAgentMeta?.description ?? '-' },
    ];

    return (
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          title={row?.name ?? `Network Agent #${id}`}
          actions={
            <Button
              appearance="outline"
              variant="secondary"
              size="sm"
              onClick={() => {
                setDisableReason('');
                setNextStatus(serviceStatus === 'Disabled' ? 'Enabled' : 'Disabled');
                setStatusModalOpen(true);
              }}
            >
              {serviceStatus === 'Disabled' ? (
                <>
                  <IconPower size={12} /> Enable
                </>
              ) : (
                <>
                  <IconBan size={12} /> Disable
                </>
              )}
            </Button>
          }
          infoFields={infoFields}
        />

        <Tabs
          size="sm"
          variant="line"
          activeTabId={activeDetailTab}
          onChange={setActiveDetailTab}
          contentClassName="pt-6"
        >
          <Tab id="basic-information" label="Basic information">
            <DetailCard title="Basic information" fields={basicInfoFields} />
          </Tab>
          <Tab id="configuration" label="Configuration">
            <DetailCard
              title="Configuration"
              fields={[
                {
                  label: 'JSON',
                  value: '',
                  type: 'component',
                  component: (
                    <pre className="w-full max-h-[420px] overflow-auto rounded-lg border border-border bg-surface-subtle p-3 text-12 leading-5 text-text">
                      {networkAgentMeta?.configurationText ?? ''}
                    </pre>
                  ),
                },
              ]}
              actions={<CopyButton text={networkAgentMeta?.configurationText ?? ''} />}
            />
          </Tab>
        </Tabs>

        {statusModalOpen && (
          <ActionModal
            appeared={statusModalOpen}
            onConfirm={() => {
              setServiceStatus(nextStatus);
              setStatusModalOpen(false);
              setDisableReason('');
            }}
            onCancel={() => {
              setStatusModalOpen(false);
              setDisableReason('');
            }}
            actionConfig={{
              title: nextStatus === 'Disabled' ? `Disable network agent` : `Enable network agent`,
              subtitle:
                nextStatus === 'Disabled'
                  ? 'Change this agent status to Disabled?'
                  : 'Change this agent status to Enabled?',
              actionButtonText: nextStatus === 'Disabled' ? 'Disable' : 'Enable',
              actionButtonVariant: 'primary',
            }}
            confirmDisabled={
              nextStatus === 'Disabled' &&
              !!config.statusAction?.requireDisableReason &&
              !disableReason.trim()
            }
          >
            {nextStatus === 'Disabled' && !!config.statusAction?.requireDisableReason && (
              <div className="flex flex-col gap-2">
                <span className="text-12 font-medium text-text">
                  Reason <span className="text-error">*</span>
                </span>
                <Textarea
                  placeholder="Enter a reason for disabling"
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                />
              </div>
            )}
          </ActionModal>
        )}
      </div>
    );
  }

  if (!row) {
    return (
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          title={`${config.title} #${id}`}
          infoFields={[{ label: 'ID', value: id, showCopyButton: true, copyText: id }]}
        />
        <DetailCard title="Details" fields={[{ label: 'Status', value: 'Data not found' }]} />
      </div>
    );
  }

  if (isServer) {
    const infoFields: DetailPageHeaderInfoField[] = [
      {
        label: 'ID',
        value: serverDerived?.serverId ?? row.id ?? id,
        showCopyButton: true,
        copyText: serverDerived?.serverId ?? row.id ?? id,
      },
      {
        label: 'Observed health',
        value: renderBadge('observedHealth', (row as any)?.observedHealth ?? '-'),
      },
      {
        label: 'Provision status',
        value: renderBadge('provisionStatus', (row as any)?.provisionStatus ?? '-'),
      },
      { label: 'Role', value: renderBadge('role', (row as any)?.role ?? '-') },
      {
        label: 'Power state',
        value: (
          <Badge
            theme={serverDerived?.bmc.powerState === 'on' ? 'gre' : 'gry'}
            type="subtle"
            size="sm"
          >
            {serverDerived?.bmc.powerState ?? '-'}
          </Badge>
        ),
      },
    ];

    const basicFields: DetailCardField[] = [
      { label: 'Type', value: serverDerived?.type ?? '-' },
      { label: 'MAC (Primary)', value: (row as any)?.macPrimary ?? '-' },
      { label: 'NIC (primary name)', value: (row as any)?.nicPrimaryName ?? '-' },
      { label: 'Location', value: (row as any)?.location ?? '-' },
      { label: 'Provider network', value: serverDerived?.providerNetwork ?? '-' },
      { label: 'Mgmt IP', value: (row as any)?.mgmtIp ?? '-' },
      { label: 'Created at', value: serverDerived?.createdAt ?? '-' },
      { label: 'Updated at', value: serverDerived?.updatedAt ?? '-' },
      { label: 'Domain', value: serverDerived?.domain ?? '-' },
    ];

    const bmcFields: DetailCardField[] = [
      { label: 'Hostname', value: serverDerived?.bmc.hostname ?? '-' },
      { label: 'Machine type', value: serverDerived?.bmc.machineType ?? '-' },
      { label: 'Power state', value: serverDerived?.bmc.powerState ?? '-' },
      { label: 'BMC IP', value: serverDerived?.bmc.bmcIp ?? '-' },
      {
        label: 'Manager ethernet interface',
        value: serverDerived?.bmc.managerEthernetInterface ?? '-',
      },
    ];

    return (
      <div className="flex flex-col gap-6">
        <DetailPageHeader title={(row as any)?.serial ?? `Server #${id}`} infoFields={infoFields} />

        <Tabs
          size="sm"
          variant="line"
          activeTabId={activeDetailTab}
          onChange={setActiveDetailTab}
          contentClassName="pt-6"
        >
          <Tab id="details" label="Details">
            <DetailCard title="Basic info" fields={basicFields} />
          </Tab>
          <Tab id="disk" label="Disk">
            <div className="flex flex-col gap-4">
              <DetailCard
                title="Storage detail"
                fields={[
                  {
                    label: 'Controller 1',
                    value: 'ThinkSystem RAID 9350-8i 2GB Flash PCIe 12Gb Adapter (PCI Slot 1)',
                    type: 'component',
                    component: (
                      <div>
                        <div className="text-13 font-medium text-text mb-3">
                          Controller 1: ThinkSystem RAID 9350-8i 2GB Flash PCIe 12Gb Adapter (PCI
                          Slot 1)
                        </div>
                        <Table<DiskRow> columns={diskColumns} rows={diskRows}>
                          {diskRows.map((disk) => (
                            <Table.Tr key={disk.id} rowData={disk}>
                              <Table.Td rowData={disk} column={diskColumns[0]}>
                                {disk.location}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[1]}>
                                {disk.manufacturer}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[2]}>
                                {disk.product}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[3]}>
                                <div className="flex items-center gap-2">
                                  <StatusIndicator
                                    variant={
                                      disk.status === 'Normal'
                                        ? 'active'
                                        : disk.status === 'Warning'
                                          ? 'degraded'
                                          : 'error'
                                    }
                                    layout="iconOnly"
                                  />
                                  <span className="text-12 text-text">{disk.status}</span>
                                </div>
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[4]}>
                                {disk.capacity}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[5]}>
                                {disk.interface}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[6]}>
                                {disk.media}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[7]}>
                                {disk.formFactor}
                              </Table.Td>
                              <Table.Td rowData={disk} column={diskColumns[8]}>
                                {disk.miscellaneous}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </Tab>
          <Tab id="bmc-info" label="BMC info">
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 lg:col-span-4">
                <DetailCard title="BMC" fields={bmcFields} />
              </div>
              <div className="col-span-12 lg:col-span-8">
                <DetailCard
                  title="server_info.json"
                  fields={[
                    {
                      label: 'JSON',
                      value: '',
                      type: 'component',
                      component: (
                        <pre className="w-full max-h-[520px] overflow-auto rounded-lg border border-border bg-surface-subtle p-3 text-12 leading-5 text-text">
                          {serverInfoJsonText}
                        </pre>
                      ),
                    },
                  ]}
                  actions={<CopyButton text={serverInfoJsonText} />}
                />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }

  // Generic detail (discovery, switch, etc.)
  const genericFields: DetailCardField[] = columns.map((column) => {
    const value = String((row as any)?.[column.key] ?? '-') || '-';

    if (column.key === 'storageCapacityGiB') {
      const used = Number((row as any).storageUsedGiB ?? 0);
      const total = Number((row as any).storageTotalGiB ?? 0);
      return {
        label: column.label,
        value: '',
        type: 'component' as const,
        component: (
          <ProgressBar
            value={isFinite(used) ? used : 0}
            max={isFinite(total) ? total : 0}
            showValue="absolute"
          />
        ),
      };
    }

    if (column.kind === 'badge') {
      const tone = column.badgeTones?.[value] ?? 'neutral';
      return {
        label: column.label,
        value: '',
        type: 'component' as const,
        component: (
          <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
            {value}
          </Badge>
        ),
      };
    }

    return { label: column.label, value };
  });

  const genericInfoFields: DetailPageHeaderInfoField[] = [
    { label: 'ID', value: row.id ?? id, showCopyButton: true, copyText: row.id ?? id },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader
        title={(row as any)?.serial ?? (row as any)?.name ?? `${config.title} #${id}`}
        infoFields={genericInfoFields}
      />

      <Tabs
        size="sm"
        variant="line"
        activeTabId={activeDetailTab}
        onChange={setActiveDetailTab}
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Details" fields={genericFields} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default CloudBuilderDetailPage;
