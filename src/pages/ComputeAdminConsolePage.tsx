import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { TabBar, TopBar, Breadcrumb, PageShell, Button } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';

export function ComputeAdminConsolePage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const [searchParams] = useSearchParams();
  const instanceName = searchParams.get('name') || instanceId || 'Console';
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState('');
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();

  const { tabs, activeTabId, selectTab, closeTab, addTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      selectTab(tabId);
      navigate(tab.path);
    }
  };

  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
  };

  const handleAddTab = () => {
    const newTabId = `tab-${Date.now()}`;
    addTab({ id: newTabId, label: 'New tab', path: '/compute-admin', closable: true });
    navigate('/compute-admin');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnected(true);
      setContent(generateQemuConsoleOutput(instanceName));
    }, 800);
    return () => clearTimeout(timer);
  }, [instanceName]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={<ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId || ''}
          onTabChange={handleTabChange}
          onTabClose={handleTabClose}
          onTabAdd={handleAddTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={toggleSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Instances', href: '/compute-admin/instances' },
                { label: instanceName },
              ]}
            />
          }
        />
      }
      contentClassName="flex flex-col h-[calc(100vh-var(--tabbar-height)-var(--topbar-height))]"
    >
      {/* QEMU Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
        <span className="text-[length:var(--tabbar-font-size)] leading-[var(--tabbar-line-height)] font-medium text-[var(--color-text-default)]">
          {connected
            ? `Connected to QEMU (${instanceId || 'instance-00000000'})`
            : 'Connecting to QEMU...'}
        </span>
        <Button size="sm" variant="secondary">
          Send Ctrl+Alt+Del
        </Button>
      </div>

      {/* VNC Console Area */}
      <div className="flex-1 bg-black p-0 overflow-hidden font-mono text-[14px] leading-[1.3]">
        {content ? (
          <pre className="whitespace-pre m-0 p-4 text-[#aaaaaa]">{content}</pre>
        ) : (
          <div className="flex items-center justify-center h-full text-[#555555]">
            Connecting...
          </div>
        )}
      </div>
    </PageShell>
  );
}

function generateQemuConsoleOutput(instanceName: string): string {
  const hostname = instanceName.toLowerCase().replace(/\s+/g, '-');
  return [
    '!! WARNING !!',
    'This is a private computer system.',
    'Access is restricted and must be explicitly authorized by the system administrator.',
    'Unauthorized access or use,',
    '  is prohibited,',
    'and may lead to criminal and/or civil penalties.',
    `${hostname} login: [ 937.156623] audit: backlog limit exceeded`,
    '',
    `${hostname} login:`,
    `${hostname} login:`,
    `${hostname} login:`,
  ].join('\n');
}

export default ComputeAdminConsolePage;
