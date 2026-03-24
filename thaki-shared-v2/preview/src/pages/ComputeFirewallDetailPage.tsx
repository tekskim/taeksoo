import { useParams, useSearchParams } from 'react-router-dom';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { DetailCard } from '@shared/components/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';

interface FirewallDetail {
  name: string;
  status: 'active' | 'error' | 'pending';
  policy: string;
  description: string;
  createdAt: string;
  rules: { id: string; direction: string; action: string; protocol: string; dest: string }[];
}

const mockFirewalls: Record<string, FirewallDetail> = {
  'fw-001': {
    name: 'edge-ingress-fw',
    status: 'active',
    policy: 'deny-by-default',
    description: 'Ingress policy for edge subnets',
    createdAt: 'Apr 8, 2025 12:44:02',
    rules: [
      { id: 'fr-1', direction: 'Ingress', action: 'Allow', protocol: 'TCP', dest: '443' },
      { id: 'fr-2', direction: 'Ingress', action: 'Allow', protocol: 'TCP', dest: '22' },
      { id: 'fr-3', direction: 'Egress', action: 'Allow', protocol: 'Any', dest: 'Any' },
    ],
  },
  'fw-002': {
    name: 'db-tier-fw',
    status: 'active',
    policy: 'allow-internal',
    description: 'Restrict DB tier to application subnets',
    createdAt: 'Mar 19, 2025 08:30:15',
    rules: [
      { id: 'fr-4', direction: 'Ingress', action: 'Allow', protocol: 'TCP', dest: '3306' },
      { id: 'fr-5', direction: 'Ingress', action: 'Deny', protocol: 'Any', dest: 'Any' },
    ],
  },
};

const defaultDetail: FirewallDetail = {
  name: 'Unknown firewall',
  status: 'pending',
  policy: '-',
  description: '-',
  createdAt: '-',
  rules: [],
};

const statusVariant: Record<FirewallDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputeFirewallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const data =
    id && mockFirewalls[id]
      ? mockFirewalls[id]
      : { ...defaultDetail, name: id ? `Firewall ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'Policy', value: data.policy },
    { label: 'Description', value: data.description },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Firewall ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Admin state', value: 'UP' },
  ];

  const ruleColumns: TableColumn[] = [
    { key: 'direction', header: 'Direction' },
    { key: 'action', header: 'Action' },
    { key: 'protocol', header: 'Protocol' },
    { key: 'dest', header: 'Destination' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconEdit size={12} stroke={1.5} /> Edit
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
        <ContextMenu.Item action={() => console.log('Clone', id)}>Clone</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Delete', id)} danger>
          <IconTrash size={12} stroke={1.5} /> Delete
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={data.name} actions={actions} infoFields={infoFields} />

      <Tabs
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        variant="line"
        size="sm"
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Firewall" fields={detailFields} />
        </Tab>
        <Tab id="rules" label="Rules">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text m-0">Rules</h3>
            <Table columns={ruleColumns} rows={data.rules}>
              {data.rules.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={ruleColumns[0]}>
                    {row.direction}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[1]}>
                    {row.action}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[2]}>
                    {row.protocol}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[3]}>
                    {row.dest}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
