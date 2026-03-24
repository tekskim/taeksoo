import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import { EditServerGroupDrawer } from '../drawers/compute/misc/EditServerGroupDrawer';
import type { TableColumn } from '@shared/components/Table/Table.types';

type ServerGroupPolicy = 'affinity' | 'anti-affinity' | 'soft-affinity' | 'soft-anti-affinity';

interface ServerGroupDetail {
  id: string;
  name: string;
  policy: ServerGroupPolicy;
  membersCount: number;
  createdAt: string;
  description: string;
}

interface MemberRow {
  id: string;
  instanceName: string;
  instanceId: string;
  availabilityZone: string;
  [key: string]: unknown;
}

const mockMap: Record<string, ServerGroupDetail> = {
  'sg-001': {
    id: 'sg-001',
    name: 'web-tier',
    policy: 'anti-affinity',
    membersCount: 6,
    createdAt: 'Mar 6, 2025 10:15:20',
    description: 'Spread web instances across hosts for HA.',
  },
  'sg-002': {
    id: 'sg-002',
    name: 'db-replicas',
    policy: 'affinity',
    membersCount: 3,
    createdAt: 'Mar 4, 2025 14:22:11',
    description: 'Keep replica VMs on the same host when possible.',
  },
};

const defaultDetail: ServerGroupDetail = {
  id: '-',
  name: 'Unknown server group',
  policy: 'affinity',
  membersCount: 0,
  createdAt: '-',
  description: '-',
};

const policyLabel: Record<ServerGroupPolicy, string> = {
  affinity: 'Affinity',
  'anti-affinity': 'Anti-affinity',
  'soft-affinity': 'Soft affinity',
  'soft-anti-affinity': 'Soft anti-affinity',
};

const mockMembers: MemberRow[] = [
  { id: 'm-1', instanceName: 'web-server-01', instanceId: 'vm-007', availabilityZone: 'keystone' },
  { id: 'm-2', instanceName: 'web-server-02', instanceId: 'vm-008', availabilityZone: 'keystone' },
  { id: 'm-3', instanceName: 'worker-node-01', instanceId: 'vm-001', availabilityZone: 'keystone' },
];

const memberColumns: TableColumn[] = [
  { key: 'instanceName', header: 'Instance name' },
  { key: 'instanceId', header: 'Instance ID' },
  { key: 'availabilityZone', header: 'Availability zone' },
];

export function ComputeServerGroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const g = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: g.name },
    { label: 'Policy', value: policyLabel[g.policy] },
    { label: 'Members count', value: String(g.membersCount) },
    { label: 'Created at', value: g.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Server group ID', value: g.id },
    { label: 'Name', value: g.name },
    { label: 'Policy', value: policyLabel[g.policy] },
    { label: 'Description', value: g.description },
    { label: 'Created at', value: g.createdAt },
  ];

  const actions = (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
          Actions <IconChevronDown size={12} stroke={1.5} />
        </Button>
      )}
    >
      <ContextMenu.Item action={() => setEditDrawerOpen(true)}>
        <span className="inline-flex items-center gap-1">
          <IconEdit size={12} stroke={1.5} /> Edit
        </span>
      </ContextMenu.Item>
      <ContextMenu.Item action={() => {}} danger>
        <span className="inline-flex items-center gap-1">
          <IconTrash size={12} stroke={1.5} /> Delete
        </span>
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={g.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Basic information" fields={detailFields} />
            </div>
          </Tab>
          <Tab id="members" label="Members">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-14 font-semibold leading-5 text-text m-0">Members</h2>
              <Table columns={memberColumns} rows={mockMembers}>
                {mockMembers.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={memberColumns[0]}>
                      <Link
                        to={`/compute/instances/${row.instanceId}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {row.instanceName}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[1]}>
                      {row.instanceId}
                    </Table.Td>
                    <Table.Td rowData={row} column={memberColumns[2]}>
                      {row.availabilityZone}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditServerGroupDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        serverGroupId={g.id}
        initialData={{ name: g.name, description: g.description }}
      />
    </div>
  );
}
