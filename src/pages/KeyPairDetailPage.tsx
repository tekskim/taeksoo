import { useState } from 'react';
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
import {
  IconTrash,
  IconEdit,
  IconBell,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';

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

const mockKeyPairDetail: KeyPairDetail = {
  id: 'kp-001',
  name: 'tk-keypair',
  userId: '514aa9f6265d4fb397b4345000b2ee9f',
  fingerprint: '/v2/images/93c91160-75f8-40e4-899f-372539fb98a6/file',
  publicKey: 'ffc34736c70569953d58a15a52b8a3bd',
  createdAt: '2025-07-25 09:12:20',
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
    <div className="flex flex-col gap-3 w-full">
      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
            {value}
          </span>
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
    </div>
  );
}

/* ----------------------------------------
   Key Pair Detail Page
   ---------------------------------------- */

export function KeyPairDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // In a real app, you would fetch the key pair data based on the ID
  const keyPair = mockKeyPairDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Key Pairs', href: '/key-pairs' },
    { label: keyPair.name },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
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
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px] max-w-[1320px]">
            {/* Detail Header */}
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
                <DetailHeader.InfoCard label="Created At" value={keyPair.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Tabs Content */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="details">Details</Tab>
                </TabList>

                {/* Details Tab */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header 
                        title="Basic Information" 
                        actions={
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconEdit size={12} />}
                          >
                            Edit
                          </Button>
                        }
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Key Pair Name" value={keyPair.name} />
                        <CopyableDataRow label="User ID" value={keyPair.userId} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Key Identity */}
                    <SectionCard>
                      <SectionCard.Header title="Key Identity" />
                      <SectionCard.Content>
                        <CopyableDataRow label="Fingerprint" value={keyPair.fingerprint} />
                        <CopyableDataRow label="Public Key" value={keyPair.publicKey} />
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
