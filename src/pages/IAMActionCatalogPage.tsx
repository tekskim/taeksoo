import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  Badge,
  TopBar,
  Breadcrumb,
  TabBar,
  ListToolbar,
  PageShell,
  PageHeader,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDownload } from '@tabler/icons-react';

interface ActionEntry {
  id: string;
  service: string;
  action: string;
  accessLevel: 'Read' | 'Write' | 'List' | 'Admin';
  description: string;
  resourceType: string;
}

const mockActions: ActionEntry[] = [
  {
    id: 'act-001',
    service: 'iam',
    action: 'iam:CreateUser',
    accessLevel: 'Write',
    description: 'Grants permission to create a new IAM user.',
    resourceType: 'user',
  },
  {
    id: 'act-002',
    service: 'iam',
    action: 'iam:DeleteUser',
    accessLevel: 'Write',
    description: 'Grants permission to delete an IAM user.',
    resourceType: 'user',
  },
  {
    id: 'act-003',
    service: 'iam',
    action: 'iam:ListUsers',
    accessLevel: 'List',
    description: 'Grants permission to list all IAM users.',
    resourceType: 'user',
  },
  {
    id: 'act-004',
    service: 'iam',
    action: 'iam:GetUser',
    accessLevel: 'Read',
    description: 'Grants permission to retrieve information about an IAM user.',
    resourceType: 'user',
  },
  {
    id: 'act-005',
    service: 'iam',
    action: 'iam:UpdateUser',
    accessLevel: 'Write',
    description: 'Grants permission to update an IAM user.',
    resourceType: 'user',
  },
  {
    id: 'act-006',
    service: 'iam',
    action: 'iam:CreateRole',
    accessLevel: 'Write',
    description: 'Grants permission to create a new IAM role.',
    resourceType: 'role',
  },
  {
    id: 'act-007',
    service: 'iam',
    action: 'iam:DeleteRole',
    accessLevel: 'Write',
    description: 'Grants permission to delete an IAM role.',
    resourceType: 'role',
  },
  {
    id: 'act-008',
    service: 'iam',
    action: 'iam:ListRoles',
    accessLevel: 'List',
    description: 'Grants permission to list all IAM roles.',
    resourceType: 'role',
  },
  {
    id: 'act-009',
    service: 'iam',
    action: 'iam:AttachPolicy',
    accessLevel: 'Admin',
    description: 'Grants permission to attach a managed policy to an entity.',
    resourceType: 'policy',
  },
  {
    id: 'act-010',
    service: 'iam',
    action: 'iam:DetachPolicy',
    accessLevel: 'Admin',
    description: 'Grants permission to detach a managed policy from an entity.',
    resourceType: 'policy',
  },
  {
    id: 'act-011',
    service: 'iam',
    action: 'iam:CreatePolicy',
    accessLevel: 'Write',
    description: 'Grants permission to create a new managed policy.',
    resourceType: 'policy',
  },
  {
    id: 'act-012',
    service: 'iam',
    action: 'iam:DeletePolicy',
    accessLevel: 'Write',
    description: 'Grants permission to delete a managed policy.',
    resourceType: 'policy',
  },
  {
    id: 'act-013',
    service: 'iam',
    action: 'iam:ListPolicies',
    accessLevel: 'List',
    description: 'Grants permission to list all managed policies.',
    resourceType: 'policy',
  },
  {
    id: 'act-014',
    service: 'iam',
    action: 'iam:GetPolicy',
    accessLevel: 'Read',
    description: 'Grants permission to retrieve information about a managed policy.',
    resourceType: 'policy',
  },
  {
    id: 'act-015',
    service: 'compute',
    action: 'compute:CreateInstance',
    accessLevel: 'Write',
    description: 'Grants permission to create a compute instance.',
    resourceType: 'instance',
  },
  {
    id: 'act-016',
    service: 'compute',
    action: 'compute:DeleteInstance',
    accessLevel: 'Write',
    description: 'Grants permission to delete a compute instance.',
    resourceType: 'instance',
  },
  {
    id: 'act-017',
    service: 'compute',
    action: 'compute:ListInstances',
    accessLevel: 'List',
    description: 'Grants permission to list all compute instances.',
    resourceType: 'instance',
  },
  {
    id: 'act-018',
    service: 'compute',
    action: 'compute:StartInstance',
    accessLevel: 'Write',
    description: 'Grants permission to start a compute instance.',
    resourceType: 'instance',
  },
  {
    id: 'act-019',
    service: 'storage',
    action: 'storage:CreateVolume',
    accessLevel: 'Write',
    description: 'Grants permission to create a storage volume.',
    resourceType: 'volume',
  },
  {
    id: 'act-020',
    service: 'storage',
    action: 'storage:DeleteVolume',
    accessLevel: 'Write',
    description: 'Grants permission to delete a storage volume.',
    resourceType: 'volume',
  },
];

const PAGE_SIZE = 10;

const filterFields: FilterField[] = [
  { id: 'action', label: 'Action', type: 'text', placeholder: 'e.g. iam:CreateUser' },
  {
    id: 'service',
    label: 'Service',
    type: 'select',
    options: [
      { value: 'iam', label: 'IAM' },
      { value: 'compute', label: 'Compute' },
      { value: 'storage', label: 'Storage' },
    ],
  },
  {
    id: 'accessLevel',
    label: 'Access level',
    type: 'select',
    options: [
      { value: 'Read', label: 'Read' },
      { value: 'Write', label: 'Write' },
      { value: 'List', label: 'List' },
      { value: 'Admin', label: 'Admin' },
    ],
  },
];

const accessLevelVariant = (level: string) => {
  switch (level) {
    case 'Read':
      return 'info' as const;
    case 'Write':
      return 'warning' as const;
    case 'List':
      return 'success' as const;
    case 'Admin':
      return 'danger' as const;
    default:
      return 'info' as const;
  }
};

export default function IAMActionCatalogPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Action catalog' }];

  const filteredActions = useMemo(() => {
    if (appliedFilters.length === 0) return mockActions;
    return mockActions.filter((a) =>
      appliedFilters.every((f) => {
        const val = f.value.toLowerCase();
        switch (f.field) {
          case 'action':
            return a.action.toLowerCase().includes(val);
          case 'service':
            return a.service === f.value;
          case 'accessLevel':
            return a.accessLevel === f.value;
          default:
            return true;
        }
      })
    );
  }, [appliedFilters]);

  const totalPages = Math.ceil(filteredActions.length / PAGE_SIZE);
  const paginatedData = filteredActions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const columns: TableColumn<ActionEntry>[] = [
    {
      key: 'action',
      title: 'Action',
      sortable: true,
      minWidth: '200px',
      render: (row) => (
        <span className="text-body-md font-medium text-[var(--color-text-default)]">
          {row.action}
        </span>
      ),
    },
    {
      key: 'service',
      title: 'Service',
      sortable: true,
      minWidth: '100px',
      render: (row) => <Badge theme="white">{row.service}</Badge>,
    },
    {
      key: 'accessLevel',
      title: 'Access level',
      sortable: true,
      minWidth: '100px',
      render: (row) => (
        <Badge variant={accessLevelVariant(row.accessLevel)}>{row.accessLevel}</Badge>
      ),
    },
    {
      key: 'resourceType',
      title: 'Resource type',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'description',
      title: 'Description',
      minWidth: '280px',
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Action catalog" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search actions by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredActions.length}
          onPageChange={setCurrentPage}
        />

        <Table<ActionEntry>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          emptyMessage="No actions found"
        />
      </VStack>
    </PageShell>
  );
}
