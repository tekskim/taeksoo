import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';

interface ServerGroup {
  id: string;
  name: string;
  policy: PolicyType;
  instances: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerGroups: ServerGroup[] = [
  { id: 'sg-001', name: 'server-1', policy: 'Anti-affinity', instances: 'tk-instance' },
  { id: 'sg-002', name: 'web-servers', policy: 'Anti-affinity', instances: 'web-01, web-02, web-03' },
  { id: 'sg-003', name: 'db-cluster', policy: 'Affinity', instances: 'db-primary, db-replica' },
  { id: 'sg-004', name: 'cache-group', policy: 'Soft-anti-affinity', instances: 'redis-01, redis-02' },
  { id: 'sg-005', name: 'app-servers', policy: 'Anti-affinity', instances: 'app-01, app-02, app-03, app-04' },
  { id: 'sg-006', name: 'monitoring', policy: 'Soft-affinity', instances: 'prometheus, grafana' },
  { id: 'sg-007', name: 'k8s-workers', policy: 'Anti-affinity', instances: 'worker-01, worker-02, worker-03' },
  { id: 'sg-008', name: 'k8s-masters', policy: 'Anti-affinity', instances: 'master-01, master-02, master-03' },
  { id: 'sg-009', name: 'storage-nodes', policy: 'Affinity', instances: 'storage-01, storage-02' },
  { id: 'sg-010', name: 'load-balancers', policy: 'Anti-affinity', instances: 'lb-01, lb-02' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ServerGroupsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServerGroups, setSelectedServerGroups] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serverGroups, setServerGroups] = useState(mockServerGroups);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serverGroupToDelete, setServerGroupToDelete] = useState<ServerGroup | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const pageSize = 10;

  // Handle delete server group
  const handleDeleteClick = (serverGroup: ServerGroup) => {
    setServerGroupToDelete(serverGroup);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serverGroupToDelete) {
      setServerGroups((prev) => prev.filter((sg) => sg.id !== serverGroupToDelete.id));
      setDeleteModalOpen(false);
      setServerGroupToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setServerGroupToDelete(null);
  };

  // Filter server groups by search
  const filteredServerGroups = useMemo(() => {
    if (!searchQuery) return serverGroups;
    
    return serverGroups.filter(
      (sg) =>
        sg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sg.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sg.instances.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [serverGroups, searchQuery]);

  const totalPages = Math.ceil(filteredServerGroups.length / pageSize);

  // Table columns
  const columns: TableColumn<ServerGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <a
          href={`/server-groups/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'policy',
      label: 'Policy',
      flex: 1,
      sortable: true,
    },
    {
      key: 'instances',
      label: 'Instances',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create Instance',
            onClick: () => console.log('Create instance in server group:', row.id),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteClick(row),
          },
        ];
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click">
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          showAddButton={true}
          showWindowControls={true}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Server Groups' },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />

        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Server Group
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Server Group
              </Button>
            </div>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find server group with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
                </ListToolbar.Actions>
              }
              bulkActions={
                <ListToolbar.Actions>
                  <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled={selectedServerGroups.length === 0}>
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredServerGroups.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                totalItems={filteredServerGroups.length}
                selectedCount={selectedServerGroups.length}
              />
            )}

            {/* Server Groups Table */}
            <Table<ServerGroup>
              columns={columns}
              data={filteredServerGroups}
              rowKey="id"
              selectable
              selectedKeys={selectedServerGroups}
              onSelectionChange={setSelectedServerGroups}
              emptyMessage="No server groups found"
            />
          </VStack>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Server Group"
        description="Are you sure you want to delete this server group? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Server group name"
        infoValue={serverGroupToDelete?.name}
      />
    </div>
  );
}

export default ServerGroupsPage;

