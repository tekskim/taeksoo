import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { IconChevronDown, IconEdit, IconTrash } from '@tabler/icons-react';

interface FirewallRuleDetail {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  protocol: string;
  sourceIp: string;
  destinationIp: string;
  action: 'allow' | 'deny' | 'reject';
  description: string;
  policyId: string;
  policyName: string;
  tenant: string;
  tenantId: string;
  sourcePort: string;
  destinationPort: string;
  ipVersion: 'IPv4' | 'IPv6';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  position: number;
  shared: boolean;
}

const mockRules: Record<string, FirewallRuleDetail> = {
  'fwr-101': {
    id: 'fwr-101',
    name: 'allow-https',
    status: 'active',
    protocol: 'tcp',
    sourceIp: '0.0.0.0/0',
    destinationIp: '10.0.1.0/24',
    action: 'allow',
    description: 'Allow HTTPS from anywhere to web tier.',
    policyId: 'fpol-001',
    policyName: 'ingress-web-tier',
    tenant: 'engineering',
    tenantId: 'tenant-eng-01',
    sourcePort: 'any',
    destinationPort: '443',
    ipVersion: 'IPv4',
    enabled: true,
    createdAt: 'Feb 12, 2026 10:18:22',
    updatedAt: 'Mar 1, 2026 06:12:08',
    position: 1,
    shared: false,
  },
  'fwr-201': {
    id: 'fwr-201',
    name: 'reject-rdp-wan',
    status: 'active',
    protocol: 'tcp',
    sourceIp: '203.0.113.0/24',
    destinationIp: '10.20.0.0/16',
    action: 'reject',
    description: 'Block RDP paths from untrusted WAN ranges.',
    policyId: 'fpol-002',
    policyName: 'shared-default-deny',
    tenant: 'admin',
    tenantId: 'tenant-admin',
    sourcePort: '3389',
    destinationPort: '3389',
    ipVersion: 'IPv4',
    enabled: true,
    createdAt: 'Jan 22, 2026 15:40:11',
    updatedAt: 'Jan 22, 2026 15:40:11',
    position: 1,
    shared: true,
  },
};

const defaultRule: FirewallRuleDetail = {
  id: 'unknown',
  name: 'Unknown rule',
  status: 'inactive',
  protocol: '-',
  sourceIp: '-',
  destinationIp: '-',
  action: 'deny',
  description: '-',
  policyId: '',
  policyName: '-',
  tenant: '-',
  tenantId: '',
  sourcePort: '-',
  destinationPort: '-',
  ipVersion: 'IPv4',
  enabled: false,
  createdAt: '-',
  updatedAt: '-',
  position: 0,
  shared: false,
};

const ruleStatusVariant: Record<FirewallRuleDetail['status'], StatusVariant> = {
  active: 'active',
  inactive: 'shutoff',
};

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminFirewallRuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const rule = useMemo(() => (id && mockRules[id] ? mockRules[id] : defaultRule), [id]);

  const statusLabel = rule.status.charAt(0).toUpperCase() + rule.status.slice(1);
  const actionLabel = rule.action.charAt(0).toUpperCase() + rule.action.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusLabel,
      accessory: <StatusIndicator variant={ruleStatusVariant[rule.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: rule.id, showCopyButton: true, copyText: rule.id },
    { label: 'Name', value: rule.name },
    { label: 'Protocol', value: rule.protocol },
    { label: 'Source IP', value: rule.sourceIp },
    { label: 'Destination IP', value: rule.destinationIp },
    { label: 'Action', value: actionLabel },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={rule.name}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => {}}>Move up</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Move down</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Duplicate rule</ContextMenu.Item>
              <ContextMenu.Item action={() => {}} danger>
                Disable rule
              </ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Rule identity" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={rule.name} />
                  <SectionCard.DataRow label="ID">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 text-text">{rule.id}</span>
                      {rule.id !== 'unknown' && <CopyButton text={rule.id} />}
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Description" value={rule.description} />
                  <SectionCard.DataRow label="Position" value={String(rule.position)} />
                  <SectionCard.DataRow label="Enabled" value={rule.enabled ? 'Yes' : 'No'} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Match criteria" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="IP version" value={rule.ipVersion} />
                  <SectionCard.DataRow label="Protocol" value={rule.protocol} />
                  <SectionCard.DataRow label="Source IP" value={rule.sourceIp} />
                  <SectionCard.DataRow label="Destination IP" value={rule.destinationIp} />
                  <SectionCard.DataRow label="Source port" value={rule.sourcePort} />
                  <SectionCard.DataRow label="Destination port" value={rule.destinationPort} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Action & scope" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Action" value={actionLabel} />
                  <SectionCard.DataRow label="Shared" value={rule.shared ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Firewall policy">
                    <Link
                      to={`/compute-admin/firewall-policies/${rule.policyId}`}
                      className={linkClass}
                    >
                      {rule.policyName}
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Tenant">
                    {rule.tenant === '-' ? (
                      '-'
                    ) : (
                      <Link to={`/compute-admin/tenants/${rule.tenantId}`} className={linkClass}>
                        {rule.tenant}
                      </Link>
                    )}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Audit" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Created at" value={rule.createdAt} />
                  <SectionCard.DataRow label="Updated at" value={rule.updatedAt} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
