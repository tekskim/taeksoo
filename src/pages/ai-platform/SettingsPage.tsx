import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Table,
  type TableColumn,
  Drawer,
  FormField,
  Input,
  Textarea,
  Disclosure,
  PageShell,
  PageHeader,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconTrash } from '@tabler/icons-react';

interface Credential {
  id: string;
  name: string;
  registryUrl: string;
  createdAt: string;
}

const MOCK_CREDENTIALS: Credential[] = [
  { id: '1', name: 'Project A', registryUrl: 'Lable.com', createdAt: 'Nov-11-2025' },
  { id: '2', name: 'Project B', registryUrl: 'Lable.com', createdAt: 'Nov-11-2025' },
];

export function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [showEmpty, setShowEmpty] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sshKeys, setSshKeys] = useState(
    'ssh-rsa AAAAB3NzaC1yc2E... user@example.com\nssh-ed25519 AAAAC3NzaC1lZDI1NTE5... user@example.com'
  );

  // Drawer form state
  const [credName, setCredName] = useState('');
  const [registryUrl, setRegistryUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    updateActiveTabLabel('Account');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const credentials = showEmpty ? [] : MOCK_CREDENTIALS;

  const columns: TableColumn<Credential>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      minWidth: '200px',
    },
    {
      key: 'registryUrl',
      label: 'Registry URL',
      minWidth: '200px',
    },
    {
      key: 'createdAt',
      label: 'Created at',
      minWidth: '160px',
    },
    {
      key: 'action',
      label: 'Action',
      width: '72px',
      align: 'center' as const,
      render: () => (
        <button className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]">
          <IconTrash size={16} stroke={1.5} />
        </button>
      ),
    },
  ];

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setCredName('');
    setRegistryUrl('');
    setUsername('');
    setPassword('');
  };

  const handleSave = () => {
    handleDrawerClose();
    if (showEmpty) setShowEmpty(false);
  };

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
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
          breadcrumb={<Breadcrumb items={[{ label: 'Account' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <PageHeader
          title="Account"
          actions={
            <Button variant="secondary" size="md" leftIcon={<IconRefresh size={12} />}>
              Refresh
            </Button>
          }
        />

        {/* Container Registry Credentials */}
        <VStack gap={3}>
          <HStack justify="between" align="center">
            <h2 className="text-heading-h5 text-[var(--color-text-default)]">
              Container Registry Credentials
            </h2>
            <Button variant="primary" size="md" onClick={() => setIsDrawerOpen(true)}>
              Add credential
            </Button>
          </HStack>

          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
            <div className="px-4 py-3">
              <HStack justify="between" align="center">
                <span className="text-body-md text-[var(--color-text-default)]">
                  Container Registry Credentials
                </span>
                <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                  Refresh
                </Button>
              </HStack>
            </div>

            {credentials.length === 0 ? (
              <div className="px-4 pb-4">
                <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                  <Table columns={columns} data={[]} rowKey="id" />
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-body-lg text-[var(--color-text-default)]">
                      No credentials registered
                    </p>
                    <p className="text-body-md text-[var(--color-text-subtle)] mt-1">
                      Add credentials to use docker images from private registries.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4">
                <Table columns={columns} data={credentials} rowKey="id" />
              </div>
            )}
          </div>
        </VStack>

        {/* SSH Public Keys */}
        <Disclosure title="SSH public keys" defaultOpen={true}>
          <VStack gap={3}>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Add your SSH public keys to access workloads via SSH. Each key should be on a separate
              line.
            </p>
            <Textarea
              value={sshKeys}
              onChange={(e) => setSshKeys(e.target.value)}
              placeholder="(Label)"
              fullWidth
              rows={4}
            />
            <div>
              <Button variant="muted" size="sm">
                Update SSH keys
              </Button>
            </div>
          </VStack>
        </Disclosure>
      </VStack>

      {/* Add Credential Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        title="Add credential"
        width={376}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={handleDrawerClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <FormField
            label="Name"
            required
            helperText="Only alphanumeric, hyphens, and underscores allowed (1-100 chars)"
          >
            <Input
              value={credName}
              onChange={(e) => setCredName(e.target.value)}
              placeholder="Enter project name"
              fullWidth
            />
          </FormField>

          <FormField label="Registry URL" required>
            <Input
              value={registryUrl}
              onChange={(e) => setRegistryUrl(e.target.value)}
              placeholder="e.g., docker.io, ghcr.io, *.dkr.ecr.*.amazonaws.com"
              fullWidth
            />
          </FormField>

          <FormField label="Username" required>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter project name"
              fullWidth
            />
          </FormField>

          <FormField
            label="Password / Token"
            required
            helperText="Docker hub recommends using personal access tokens"
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              fullWidth
            />
          </FormField>
        </VStack>
      </Drawer>
    </PageShell>
  );
}

export default SettingsPage;
