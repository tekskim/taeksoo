import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { Button } from '@shared/components/Button';
import { CreateAllowedAddressPairDrawer } from '../drawers/compute/security-group/CreateAllowedAddressPairDrawer';
import { CreateSecurityGroupRuleDrawer } from '../drawers/compute/security-group/CreateSecurityGroupRuleDrawer';
import { EditSecurityGroupDrawer } from '../drawers/compute/security-group/EditSecurityGroupDrawer';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { ActionModal } from '@shared/components/ActionModal';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconCirclePlus, IconEdit, IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';

interface SecurityGroupDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

type RuleProtocol =
  | 'Custom ICMP'
  | 'TCP'
  | 'UDP'
  | 'Any'
  | 'ICMP'
  | 'SSH'
  | 'HTTP'
  | 'HTTPS'
  | 'RDP';

interface SecurityGroupRule {
  id: string;
  direction: 'Ingress' | 'Egress';
  protocol: RuleProtocol;
  portRange: string;
  remote: string;
  icmpTypeCode: string;
}

const mockSecurityGroupsMap: Record<string, SecurityGroupDetail> = {
  'sg-001': {
    id: 'sg-001',
    name: 'sg-01',
    description: 'Web server access group',
    createdAt: 'Jan 15, 2024 09:23:41',
  },
  'sg-002': {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    createdAt: 'Jan 10, 2024 14:07:22',
  },
  'sg-003': {
    id: 'sg-003',
    name: 'db-sg',
    description: 'Database access group',
    createdAt: 'Feb 1, 2024 11:45:33',
  },
  'sg-004': {
    id: 'sg-004',
    name: 'app-sg',
    description: 'Application server security group',
    createdAt: 'Feb 15, 2024 16:52:08',
  },
  'sg-005': {
    id: 'sg-005',
    name: 'lb-sg',
    description: 'Load balancer security group',
    createdAt: 'Mar 1, 2024 08:30:15',
  },
  'sg-006': {
    id: 'sg-006',
    name: 'cache-sg',
    description: 'Cache server access group',
    createdAt: 'Mar 10, 2024 13:19:44',
  },
  'sg-007': {
    id: 'sg-007',
    name: 'monitor-sg',
    description: 'Monitoring access group',
    createdAt: 'Apr 1, 2024 10:41:27',
  },
  'sg-008': {
    id: 'sg-008',
    name: 'vpn-sg',
    description: 'VPN access group',
    createdAt: 'Apr 15, 2024 17:03:56',
  },
  'sg-009': {
    id: 'sg-009',
    name: 'admin-sg',
    description: 'Admin access group',
    createdAt: 'May 1, 2024 12:28:19',
  },
  'sg-010': {
    id: 'sg-010',
    name: 'test-sg',
    description: 'Test environment security group',
    createdAt: 'May 10, 2024 15:55:02',
  },
};

const defaultSecurityGroupDetail: SecurityGroupDetail = {
  id: 'unknown',
  name: 'Unknown Security group',
  description: '-',
  createdAt: '-',
};

const mockRules: SecurityGroupRule[] = Array.from({ length: 115 }, (_, i) => ({
  id: `rule-${String(i + 1).padStart(3, '0')}`,
  direction: i % 3 === 0 ? 'Egress' : 'Ingress',
  protocol: ['Custom ICMP', 'TCP', 'UDP', 'ICMP', 'SSH', 'HTTP', 'HTTPS'][i % 7] as RuleProtocol,
  portRange: i % 3 === 0 ? '1-65535' : 'Any',
  remote: `IP : 0.0.0.0/0`,
  icmpTypeCode: '8/8',
}));

const ACTION_COL_WIDTH = 72;

const RuleMenuTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md hover:bg-surface-muted border-none bg-transparent inline-flex"
    aria-label="Row actions"
  >
    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

export function ComputeSecurityGroupDetailPage() {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [createRuleOpen, setCreateRuleOpen] = useState(false);
  const [allowedPairOpen, setAllowedPairOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const securityGroup = useMemo(
    () =>
      id ? (mockSecurityGroupsMap[id] ?? defaultSecurityGroupDetail) : defaultSecurityGroupDetail,
    [id]
  );

  const [selectedRules, setSelectedRules] = useState<(string | number)[]>([]);
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleCurrentPage, setRuleCurrentPage] = useState(1);
  const rulesPerPage = 10;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [headerDeleteModalOpen, setHeaderDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<SecurityGroupRule | null>(null);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSort = useCallback((k: string | null, o: SortOrder) => {
    setSort(k ?? '');
    setOrder(o);
  }, []);

  const filteredRules = useMemo(() => {
    if (!ruleSearchTerm) return mockRules;
    const query = ruleSearchTerm.toLowerCase();
    return mockRules.filter(
      (rule) =>
        rule.direction.toLowerCase().includes(query) ||
        rule.protocol.toLowerCase().includes(query) ||
        rule.remote.toLowerCase().includes(query)
    );
  }, [ruleSearchTerm]);

  const paginatedRules = filteredRules.slice(
    (ruleCurrentPage - 1) * rulesPerPage,
    ruleCurrentPage * rulesPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'ID',
      value: securityGroup.id,
      showCopyButton: true,
      copyText: securityGroup.id,
    },
    { label: 'Description', value: securityGroup.description },
    { label: 'Origin', value: 'Container' },
    { label: 'Created at', value: securityGroup.createdAt },
  ];

  const ruleColumns: TableColumn[] = useMemo(
    () => [
      { key: 'direction', header: 'Direction' },
      { key: 'protocol', header: 'Protocol' },
      { key: 'portRange', header: 'Port range' },
      { key: 'remote', header: 'Remote' },
      { key: 'icmpTypeCode', header: 'ICMP Type/Code' },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={securityGroup.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setCreateRuleOpen(true)}
            >
              <IconCirclePlus size={12} stroke={1.5} /> Create rule
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setHeaderDeleteModalOpen(true)}
            >
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="rules" label="Rules">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-16 font-semibold text-text m-0">Rules</h3>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setCreateRuleOpen(true)}
                >
                  <IconCirclePlus size={12} stroke={1.5} /> Create rule
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="search"
                  placeholder="Search rules by attributes"
                  value={ruleSearchTerm}
                  onChange={(e) => setRuleSearchTerm(e.target.value)}
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                />
                <div className="w-px h-4 bg-border" />
                <Button
                  variant="muted"
                  appearance="ghost"
                  size="sm"
                  disabled={selectedRules.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>
              <Pagination
                totalCount={filteredRules.length}
                size={rulesPerPage}
                currentAt={ruleCurrentPage}
                onPageChange={setRuleCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedRules.length}
              />
              <SelectableTable<SecurityGroupRule>
                columns={ruleColumns}
                rows={paginatedRules}
                selectionType="checkbox"
                selectedRows={selectedRules}
                onRowSelectionChange={setSelectedRules}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSort}
                stickyLastColumn
              >
                {paginatedRules.map((row) => (
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
                    <Table.Td rowData={row} column={ruleColumns[4]}>
                      {row.icmpTypeCode}
                    </Table.Td>
                    <Table.Td rowData={row} column={ruleColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <RuleMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item
                          action={() => {
                            setRuleToDelete(row);
                            setDeleteModalOpen(true);
                          }}
                          danger
                        >
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>
        </Tabs>
      </div>

      <ActionModal
        appeared={headerDeleteModalOpen}
        actionConfig={{
          title: 'Delete security group',
          subtitle: `Are you sure you want to delete "${securityGroup.name}"? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Security group] Delete confirmed');
          setHeaderDeleteModalOpen(false);
          navigate('/compute/security-groups');
        }}
        onCancel={() => setHeaderDeleteModalOpen(false)}
      />

      {deleteModalOpen && (
        <ActionModal
          appeared={deleteModalOpen}
          onConfirm={() => {
            setDeleteModalOpen(false);
            setRuleToDelete(null);
          }}
          onCancel={() => {
            setDeleteModalOpen(false);
            setRuleToDelete(null);
          }}
          actionConfig={{
            title: 'Delete rule',
            subtitle: 'Removing the selected instances is permanent and cannot be undone.',
            actionButtonText: 'Delete',
            actionButtonVariant: 'error',
            cancelButtonText: 'Cancel',
          }}
        />
      )}

      <EditSecurityGroupDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        securityGroupId={id}
        initialName={securityGroup.name}
        initialDescription={securityGroup.description}
      />
      <CreateSecurityGroupRuleDrawer
        isOpen={createRuleOpen}
        onClose={() => setCreateRuleOpen(false)}
        securityGroupName={securityGroup.name}
      />
      <CreateAllowedAddressPairDrawer
        isOpen={allowedPairOpen}
        onClose={() => setAllowedPairOpen(false)}
        portName="demo-port-01"
      />
    </div>
  );
}
