import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { DetailCard } from '@shared/components/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconEdit, IconTrash, IconChevronDown, IconPlus } from '@tabler/icons-react';
import { EditSecurityGroupDrawer } from '../drawers/compute/security-group/EditSecurityGroupDrawer';
import { CreateSecurityGroupRuleDrawer } from '../drawers/compute/security-group/CreateSecurityGroupRuleDrawer';
import { CreateAllowedAddressPairDrawer } from '../drawers/compute/security-group/CreateAllowedAddressPairDrawer';

interface SecurityGroupDetail {
  name: string;
  description: string;
  createdAt: string;
  rules: { id: string; direction: string; protocol: string; portRange: string; remote: string }[];
}

const mockSecurityGroups: Record<string, SecurityGroupDetail> = {
  'sg-001': {
    name: 'web-tier',
    description: 'HTTP/HTTPS access for web servers',
    createdAt: 'Jul 4, 2025 14:09:33',
    rules: [
      { id: 'rule-1', direction: 'Ingress', protocol: 'TCP', portRange: '80', remote: '0.0.0.0/0' },
      {
        id: 'rule-2',
        direction: 'Ingress',
        protocol: 'TCP',
        portRange: '443',
        remote: '0.0.0.0/0',
      },
      { id: 'rule-3', direction: 'Egress', protocol: 'Any', portRange: 'Any', remote: '0.0.0.0/0' },
    ],
  },
  'sg-002': {
    name: 'default',
    description: 'Default security group',
    createdAt: 'Jan 1, 2025 00:00:01',
    rules: [
      {
        id: 'rule-4',
        direction: 'Ingress',
        protocol: 'TCP',
        portRange: '22',
        remote: '10.0.0.0/8',
      },
      { id: 'rule-5', direction: 'Egress', protocol: 'Any', portRange: 'Any', remote: '::/0' },
    ],
  },
};

const defaultDetail: SecurityGroupDetail = {
  name: 'Unknown security group',
  description: '-',
  createdAt: '-',
  rules: [],
};

export function ComputeSecurityGroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editOpen, setEditOpen] = useState(false);
  const [createRuleOpen, setCreateRuleOpen] = useState(false);
  const [allowedPairOpen, setAllowedPairOpen] = useState(false);

  const data =
    id && mockSecurityGroups[id]
      ? mockSecurityGroups[id]
      : { ...defaultDetail, name: id ? `Security group ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Description', value: data.description },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Security group ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Project ID', value: 'proj-demo-001' },
  ];

  const ruleColumns: TableColumn[] = [
    { key: 'direction', header: 'Direction' },
    { key: 'protocol', header: 'Protocol' },
    { key: 'portRange', header: 'Port range' },
    { key: 'remote', header: 'Remote' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm" onClick={() => setEditOpen(true)}>
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
        <ContextMenu.Item action={() => setCreateRuleOpen(true)}>Manage rules</ContextMenu.Item>
        <ContextMenu.Item action={() => setAllowedPairOpen(true)}>
          Add allowed address pair
        </ContextMenu.Item>
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
          <DetailCard title="Basic information" fields={detailFields} />
        </Tab>
        <Tab id="rules" label="Rules">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-14 font-semibold text-text m-0">Rules</h3>
              <Button
                variant="secondary"
                appearance="outline"
                size="sm"
                onClick={() => setCreateRuleOpen(true)}
              >
                <IconPlus size={12} stroke={1.5} /> Add rule
              </Button>
            </div>
            <Table columns={ruleColumns} rows={data.rules}>
              {data.rules.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={ruleColumns[0]}>
                    {row.direction}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[1]}>
                    {row.protocol}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[2]}>
                    {row.portRange}
                  </Table.Td>
                  <Table.Td rowData={row} column={ruleColumns[3]}>
                    {row.remote}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
      </Tabs>

      <EditSecurityGroupDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        securityGroupId={id}
        initialName={data.name}
        initialDescription={data.description}
      />
      <CreateSecurityGroupRuleDrawer
        isOpen={createRuleOpen}
        onClose={() => setCreateRuleOpen(false)}
        securityGroupName={data.name}
      />
      <CreateAllowedAddressPairDrawer
        isOpen={allowedPairOpen}
        onClose={() => setAllowedPairOpen(false)}
        portName="demo-port-01"
      />
    </div>
  );
}
