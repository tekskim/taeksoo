import { useMemo, useSearchParams } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconEdit, IconLinkOff, IconUnlink } from '@tabler/icons-react';

type FloatingIPStatus = 'active' | 'down' | 'error';

interface FloatingIPDetail {
  id: string;
  floatingIp: string;
  status: FloatingIPStatus;
  createdAt: string;
  description: string;
  network: { name: string; id: string } | null;
  resourceType: string | null;
  resource: { name: string; id: string } | null;
  fixedIp: string | null;
  router: { name: string; id: string } | null;
  fqdn: string | null;
}

const mockFloatingIPsMap: Record<string, FloatingIPDetail> = {
  'fip-001': {
    id: 'fip-001',
    floatingIp: '172.24.4.228',
    status: 'active',
    createdAt: 'Oct 1, 2025 10:20:28',
    description: '-',
    network: null,
    resourceType: 'Instance',
    resource: { name: 'web-01', id: 'inst-001' },
    fixedIp: '10.7.65.39',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'web-01.thakicloud.com',
  },
  'fip-002': {
    id: 'fip-002',
    floatingIp: '172.24.4.229',
    status: 'active',
    createdAt: 'Oct 2, 2025 17:33:45',
    description: '-',
    network: null,
    resourceType: 'Instance',
    resource: { name: 'app-server', id: 'inst-002' },
    fixedIp: '10.7.65.40',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'app-server.thakicloud.com',
  },
  'fip-003': {
    id: 'fip-003',
    floatingIp: '172.24.4.230',
    status: 'down',
    createdAt: 'Oct 3, 2025 00:46:02',
    description: 'Unassociated',
    network: null,
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-004': {
    id: 'fip-004',
    floatingIp: '172.24.4.231',
    status: 'active',
    createdAt: 'Sep 28, 2025 07:11:07',
    description: '-',
    network: null,
    resourceType: 'Instance',
    resource: { name: 'db-server', id: 'inst-003' },
    fixedIp: '10.7.65.41',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'db-server.thakicloud.com',
  },
  'fip-005': {
    id: 'fip-005',
    floatingIp: '172.24.4.232',
    status: 'active',
    createdAt: 'Sep 25, 2025 10:32:16',
    description: '-',
    network: null,
    resourceType: 'Load balancer',
    resource: { name: 'load-balancer', id: 'lb-001' },
    fixedIp: '10.7.65.42',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'lb.thakicloud.com',
  },
  'fip-006': {
    id: 'fip-006',
    floatingIp: '172.24.4.233',
    status: 'error',
    createdAt: 'Sep 20, 2025 23:27:51',
    description: 'Error state',
    network: null,
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-007': {
    id: 'fip-007',
    floatingIp: '172.24.4.234',
    status: 'active',
    createdAt: 'Sep 15, 2025 12:22:26',
    description: '-',
    network: null,
    resourceType: 'Instance',
    resource: { name: 'monitoring', id: 'inst-004' },
    fixedIp: '10.7.65.43',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: 'monitoring.thakicloud.com',
  },
  'fip-008': {
    id: 'fip-008',
    floatingIp: '172.24.4.235',
    status: 'active',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: '-',
    network: null,
    resourceType: 'VPN Gateway',
    resource: { name: 'vpn-gateway', id: 'vpn-001' },
    fixedIp: '10.7.65.44',
    router: { name: 'vpn-router', id: 'router-002' },
    fqdn: 'vpn.thakicloud.com',
  },
  'fip-009': {
    id: 'fip-009',
    floatingIp: '172.24.4.236',
    status: 'down',
    createdAt: 'Sep 5, 2025 14:12:36',
    description: 'Unassociated',
    network: null,
    resourceType: null,
    resource: null,
    fixedIp: '-',
    router: { name: 'main-router', id: 'router-001' },
    fqdn: '-',
  },
  'fip-010': {
    id: 'fip-010',
    floatingIp: '172.24.4.237',
    status: 'active',
    createdAt: 'Sep 1, 2025 10:20:28',
    description: '-',
    network: null,
    resourceType: 'Instance',
    resource: { name: 'backup-server', id: 'inst-005' },
    fixedIp: '10.7.65.45',
    router: { name: 'backup-router', id: 'router-003' },
    fqdn: 'backup.thakicloud.com',
  },
};

const defaultFloatingIPDetail: FloatingIPDetail = {
  id: 'unknown',
  floatingIp: 'Unknown',
  status: 'active',
  createdAt: '-',
  description: '-',
  network: null,
  resourceType: null,
  resource: null,
  fixedIp: '-',
  router: { name: '-', id: '' },
  fqdn: '-',
};

const floatingIPStatusVariant: Record<FloatingIPStatus, StatusVariant> = {
  active: 'active',
  down: 'shutoff',
  error: 'error',
};

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

export function ComputeFloatingIPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const floatingIP = useMemo(
    () => (id ? (mockFloatingIPsMap[id] ?? defaultFloatingIPDetail) : defaultFloatingIPDetail),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: 'Available',
      accessory: (
        <StatusIndicator variant={floatingIPStatusVariant[floatingIP.status]} layout="iconOnly" />
      ),
    },
    { label: 'ID', value: floatingIP.id, showCopyButton: true, copyText: floatingIP.id },
    { label: 'Created at', value: floatingIP.createdAt },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={floatingIP.floatingIp}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconLinkOff size={12} stroke={1.5} /> Disassociate
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconUnlink size={12} stroke={1.5} /> Release
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Floating IP" value={floatingIP.floatingIp} />
                  <SectionCard.DataRow label="Description" value={floatingIP.description} />
                  <SectionCard.DataRow
                    label="External network"
                    value={
                      floatingIP.network ? (
                        <Link
                          to={`/compute/networks/${floatingIP.network.id}`}
                          className={linkClass}
                        >
                          {floatingIP.network.name}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Association" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Resource"
                    value={
                      floatingIP.resource ? (
                        <Link
                          to={`/compute/instances/${floatingIP.resource.id}`}
                          className={linkClass}
                        >
                          {floatingIP.resource.name}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <SectionCard.DataRow label="Fixed IP" value={floatingIP.fixedIp || '-'} />
                  <SectionCard.DataRow
                    label="Router"
                    value={
                      floatingIP.router && floatingIP.router.id ? (
                        <Link to={`/compute/routers/${floatingIP.router.id}`} className={linkClass}>
                          {floatingIP.router.name}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
