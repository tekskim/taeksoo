import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconDownload, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';
import { Tooltip } from '@/design-system';
import containerIcon from '@/assets/appIcon/container.png';

interface SecurityGroup {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  description: string;
  ingressRules: number;
  egressRules: number;
  createdAt: string;
  origin?: 'container';
}

const mockSecurityGroups: SecurityGroup[] = [
  {
    id: 'sg-a1b2c3d4',
    name: 'default',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Default security group',
    ingressRules: 3,
    egressRules: 1,
    createdAt: 'Dec 25, 2025',
    origin: 'container',
  },
  {
    id: 'sg-e5f6g7h8',
    name: 'web-servers',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Security group for web servers',
    ingressRules: 5,
    egressRules: 2,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-i9j0k1l2',
    name: 'db-servers',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Security group for database servers',
    ingressRules: 4,
    egressRules: 3,
    createdAt: 'Dec 25, 2025',
    origin: 'container',
  },
  {
    id: 'sg-m3n4o5p6',
    name: 'monitoring',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Monitoring access group',
    ingressRules: 6,
    egressRules: 2,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-q7r8s9t0',
    name: 'cache-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Cache server access group',
    ingressRules: 2,
    egressRules: 1,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-u1v2w3x4',
    name: 'app-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Application server security group',
    ingressRules: 8,
    egressRules: 4,
    createdAt: 'Dec 25, 2025',
    origin: 'container',
  },
  {
    id: 'sg-y5z6a7b8',
    name: 'lb-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Load balancer security group',
    ingressRules: 5,
    egressRules: 5,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-c9d0e1f2',
    name: 'vpn-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'VPN access group',
    ingressRules: 10,
    egressRules: 5,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-g3h4i5j6',
    name: 'admin-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Admin access group',
    ingressRules: 15,
    egressRules: 8,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-k7l8m9n0',
    name: 'test-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Test environment security group',
    ingressRules: 1,
    egressRules: 1,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-o1p2q3r4',
    name: 'staging-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Staging environment group',
    ingressRules: 5,
    egressRules: 5,
    createdAt: 'Dec 25, 2025',
  },
  {
    id: 'sg-s5t6u7v8',
    name: 'prod-sg',
    tenant: 'tenant',
    tenantId: '12345678',
    description: 'Production security group',
    ingressRules: 12,
    egressRules: 6,
    createdAt: 'Dec 25, 2025',
  },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'tenant', label: 'Tenant', type: 'text' },
];

export function SecurityGroupsPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [securityGroups, setSecurityGroups] = useState(mockSecurityGroups);
  const rowsPerPage = 10;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecurityGroup | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  useEffect(() => {
    updateActiveTabLabel('Security Groups');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const getContextMenuItems = (sg: SecurityGroup): ContextMenuItem[] => [
    { id: 'create-rule', label: 'Create rule', onClick: () => {} },
    { id: 'edit', label: 'Edit', onClick: () => {} },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => {
        setGroupToDelete(sg);
        setDeleteModalOpen(true);
      },
    },
  ];

  const filteredGroups = useMemo(() => {
    if (appliedFilters.length === 0) return securityGroups;
    return securityGroups.filter((sg) =>
      appliedFilters.every((filter) => {
        const value = String(sg[filter.fieldId as keyof SecurityGroup] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      })
    );
  }, [securityGroups, appliedFilters]);

  const totalPages = Math.ceil(filteredGroups.length / rowsPerPage);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredGroups.slice(start, start + rowsPerPage);
  }, [filteredGroups, currentPage, rowsPerPage]);

  const handleDelete = () => {
    if (groupToDelete) {
      setSecurityGroups((prev) => prev.filter((sg) => sg.id !== groupToDelete.id));
      setSelectedGroups((prev) => prev.filter((x) => x !== groupToDelete.id));
    }
    setDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  const handleBulkDelete = () => {
    setSecurityGroups((prev) => prev.filter((sg) => !selectedGroups.includes(sg.id)));
    setIsBulkDeleteOpen(false);
    setSelectedGroups([]);
  };

  const columns: TableColumn<SecurityGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0 w-full">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <Link
              to={`/security/security-groups/${row.id}`}
              className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
            <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
              <span className="truncate" title={row.id}>
                ID:{row.id.slice(0, 8)}
              </span>
              <InlineCopyId value={row.id} />
            </span>
          </div>
          {row.origin === 'container' && (
            <Tooltip
              content="This security group was created via the Container cluster."
              position="top"
            >
              <div className="size-6 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)]">
                <img src={containerIcon} alt="Container" className="w-4 h-4" />
              </div>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-body-md text-[var(--color-text-default)]">{row.tenant}</span>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.tenantId}>
              ID: {row.tenantId}
            </span>
            <InlineCopyId value={row.tenantId} />
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: 160,
      sortable: true,
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)]">{value || '-'}</span>
      ),
    },
    {
      key: 'ingressRules',
      label: 'Ingress Rules',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      key: 'egressRules',
      label: 'Egress Rules',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Security', href: '/security' }, { label: 'Security Groups' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="Security Groups"
          actions={
            <Button variant="primary" size="md">
              Create Security Group
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search security groups by attributes"
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
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} />}
                disabled={selectedGroups.length === 0}
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredGroups.length}
          selectedCount={selectedGroups.length}
          onPageChange={setCurrentPage}
          showSettings
        />

        <Table<SecurityGroup>
          columns={columns}
          data={paginatedGroups}
          rowKey="id"
          selectable
          selectedKeys={selectedGroups}
          onSelectionChange={setSelectedGroups}
          emptyMessage="No security groups found"
        />
      </VStack>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setGroupToDelete(null);
        }}
        title="Delete security group"
        description="Removing the selected security group is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected security groups"
        description="Removing the selected security groups is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedGroups.length} security group(s)`}
      />
    </PageShell>
  );
}

export default SecurityGroupsPage;
