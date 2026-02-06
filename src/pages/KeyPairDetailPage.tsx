import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconEdit, IconBell, IconCopy, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface KeyPairDetail {
  id: string;
  name: string;
  userId: string;
  fingerprint: string;
  publicKey: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Key pair data map by ID - synced with KeyPairsPage mock data
const mockKeyPairsMap: Record<string, KeyPairDetail> = {
  'kp-001': {
    id: 'kp-001',
    name: 'tk-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDk...',
    createdAt: 'Sep 10, 2025',
  },
  'kp-002': {
    id: 'kp-002',
    name: 'dev-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDl...',
    createdAt: 'Sep 8, 2025',
  },
  'kp-003': {
    id: 'kp-003',
    name: 'prod-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDm...',
    createdAt: 'Sep 5, 2025',
  },
  'kp-004': {
    id: 'kp-004',
    name: 'staging-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'ff:ee:dd:cc:bb:aa:99:88:77:66:55:44:33:22:11:00',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDn...',
    createdAt: 'Aug 30, 2025',
  },
  'kp-005': {
    id: 'kp-005',
    name: 'test-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDo...',
    createdAt: 'Aug 25, 2025',
  },
  'kp-006': {
    id: 'kp-006',
    name: 'backup-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'ab:cd:ef:01:23:45:67:89:ab:cd:ef:01:23:45:67:89',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDp...',
    createdAt: 'Aug 20, 2025',
  },
  'kp-007': {
    id: 'kp-007',
    name: 'jenkins-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '98:76:54:32:10:fe:dc:ba:98:76:54:32:10:fe:dc:ba',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDq...',
    createdAt: 'Aug 15, 2025',
  },
  'kp-008': {
    id: 'kp-008',
    name: 'ansible-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '01:02:03:04:05:06:07:08:09:0a:0b:0c:0d:0e:0f:10',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDr...',
    createdAt: 'Aug 10, 2025',
  },
  'kp-009': {
    id: 'kp-009',
    name: 'terraform-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'f0:e1:d2:c3:b4:a5:96:87:78:69:5a:4b:3c:2d:1e:0f',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDs...',
    createdAt: 'Aug 5, 2025',
  },
  'kp-010': {
    id: 'kp-010',
    name: 'github-deploy-key',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDt...',
    createdAt: 'Aug 1, 2025',
  },
};

const defaultKeyPairDetail: KeyPairDetail = {
  id: 'unknown',
  name: 'Unknown Key pair',
  userId: '-',
  fingerprint: '-',
  publicKey: '-',
  createdAt: '-',
};

/* ----------------------------------------
   Copyable Value Component
   ---------------------------------------- */

interface CopyableValueProps {
  label: string;
  value: string;
}

function CopyableDataRow({ label, value }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-body-md leading-4 text-[var(--color-text-default)]">{value}</span>
        <button
          onClick={handleCopy}
          className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors shrink-0"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <IconCheck size={16} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={12} className="text-[var(--color-action-primary)]" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Key pair Detail Page
   ---------------------------------------- */

export function KeyPairDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');

  // Get key pair data based on URL ID
  const keyPair = id ? mockKeyPairsMap[id] || defaultKeyPairDetail : defaultKeyPairDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to key pair name
  useEffect(() => {
    if (keyPair.name) {
      updateActiveTabLabel(keyPair.name);
    }
  }, [keyPair.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Key pairs', href: '/compute/key-pairs' },
    { label: keyPair.name },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Detail header */}
              <DetailHeader>
                <DetailHeader.Title>{keyPair.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} stroke={1.5} />}
                  >
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Created at" value={keyPair.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs Content */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="details">Details</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic information */}
                      <SectionCard>
                        <SectionCard.Header
                          title="Basic information"
                          actions={
                            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                              Edit
                            </Button>
                          }
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Key pair Name" value={keyPair.name} />
                          <CopyableDataRow label="User ID" value={keyPair.userId} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Key Identity */}
                      <SectionCard>
                        <SectionCard.Header title="Key identity" />
                        <SectionCard.Content>
                          <CopyableDataRow label="Fingerprint" value={keyPair.fingerprint} />
                          <CopyableDataRow label="Public key" value={keyPair.publicKey} />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default KeyPairDetailPage;
