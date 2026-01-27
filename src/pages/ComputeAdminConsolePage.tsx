import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { IconDownload, IconTerminal2 } from '@tabler/icons-react';
import { Select, Button, TabBar, TopBar, Breadcrumb } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

/* ----------------------------------------
   Connection Status indicator
   ---------------------------------------- */

function ConnectionStatusIndicator({ status }: { status: ConnectionStatus }) {
  const statusConfig = {
    connected: {
      color: 'bg-emerald-500',
      label: 'Connected',
    },
    connecting: {
      color: 'bg-amber-500',
      label: 'Connecting',
    },
    disconnected: {
      color: 'bg-red-500',
      label: 'Disconnected',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5 ml-3">
      <span className={`size-2 rounded-full ${config.color}`} />
      <span className="text-[12px] text-[var(--color-text-default)]">{config.label}</span>
    </div>
  );
}

/* ----------------------------------------
   Console Page Component
   ---------------------------------------- */

export function ComputeAdminConsolePage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const [searchParams] = useSearchParams();
  const instanceName = searchParams.get('name') || instanceId || 'Console';
  const navigate = useNavigate();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [content, setContent] = useState('');
  const [selectedContainer, setSelectedContainer] = useState('container-0');
  const [viewTime, setViewTime] = useState('last-15');
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const contentRef = useRef<HTMLDivElement>(null);

  // Tab management
  const { tabs, activeTabId, selectTab, closeTab, addTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      selectTab(tabId);
      navigate(tab.path);
    }
  };

  // Handle tab close
  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
  };

  // Handle add new tab
  const handleAddTab = () => {
    const newTabId = `tab-${Date.now()}`;
    addTab({
      id: newTabId,
      label: 'New tab',
      path: '/',
      closable: true,
    });
    navigate('/');
  };

  // Container options for Select
  const containerOptions = [
    { value: 'container-0', label: 'container-0' },
    { value: 'container-1', label: 'container-1' },
    { value: 'container-2', label: 'container-2' },
  ];

  // View time options for Select
  const viewTimeOptions = [
    { value: 'last-15', label: 'Last 15 minutes' },
    { value: 'last-30', label: 'Last 30 minutes' },
    { value: 'last-1h', label: 'Last 1 hour' },
    { value: 'last-3h', label: 'Last 3 hours' },
    { value: 'last-6h', label: 'Last 6 hours' },
    { value: 'last-12h', label: 'Last 12 hours' },
    { value: 'last-24h', label: 'Last 24 hours' },
  ];

  // Simulate connection and logs
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
      setContent(generateSampleLogs(instanceName));
    }, 1000);

    return () => clearTimeout(timer);
  }, [instanceName]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  // Handle clear
  const handleClear = useCallback(() => {
    setContent('');
  }, []);

  // Handle download
  const handleDownload = useCallback(() => {
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${instanceName}-logs.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [content, instanceName]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

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
            activeTab={activeTabId || ''}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onTabAdd={handleAddTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={toggleSidebar}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Instances', href: '/compute-admin/instances' },
                  { label: instanceName },
                ]}
              />
            }
          />
        </div>

        {/* Console Content */}
        <div className="flex flex-col h-[calc(100vh-var(--tabbar-height)-var(--topbar-height))]">
          {/* Header - Same style as ShellPanel tab */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
            <IconTerminal2 size={14} className="text-[var(--color-text-muted)]" stroke={1} />
            <span className="text-[length:var(--tabbar-font-size)] leading-[var(--tabbar-line-height)] font-medium text-[var(--color-text-default)]">
              {instanceName}
            </span>
          </div>

          {/* Log Content - Dark background */}
          <div
            ref={contentRef}
            className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-5 bg-[#0d1117] text-slate-300 shell-scroll"
          >
            {content ? (
              <pre className="whitespace-pre-wrap break-all m-0">{content}</pre>
            ) : (
              <span className="text-slate-600">
                {connectionStatus === 'connecting' ? 'Connecting...' : 'No output'}
              </span>
            )}
          </div>

          {/* Bottom Status Bar - Same as ShellPanel */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
            <div className="flex items-center gap-1">
              {/* Container Select */}
              <Select
                value={selectedContainer}
                onChange={setSelectedContainer}
                options={containerOptions}
                placeholder="Container"
              />

              {/* Clear Button */}
              <Button size="sm" variant="secondary" onClick={handleClear}>
                Clear
              </Button>

              {/* Download Button - Custom style for 28x28 */}
              <button
                onClick={handleDownload}
                aria-label="Download"
                className="inline-flex items-center justify-center size-[28px] rounded-[var(--button-radius)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] border border-[var(--color-border-strong)] hover:bg-[var(--button-secondary-hover-bg)] transition-colors"
              >
                <IconDownload size={14} stroke={1} />
              </button>

              {/* Connection Status indicator */}
              <ConnectionStatusIndicator status={connectionStatus} />
            </div>

            <div className="flex items-center gap-3">
              {/* View Time Select */}
              <Select
                value={viewTime}
                onChange={setViewTime}
                options={viewTimeOptions}
                placeholder="View"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate sample log output
function generateSampleLogs(_instanceName: string): string {
  const now = new Date();
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const logs = [
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:11.570725    1 main.go:152] "Version" version="v"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:11.570824    1 main.go:153] "Running node-driver-registrar" mode=""`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:11.570828    1 main.go:174] "Attempting to open a gRPC connection" csiAddress="/csi/csi.sock"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:17.836012    1 main.go:182] "Calling CSI driver to discover driver name"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:17.837013    1 main.go:191] "CSI driver name" csiDriverName="driver.csi.io"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:17.837042    1 node_register.go:56] "Starting Registration Server" socketPath="/registration/driver.csi.io-reg.sock"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:17.837176    1 node_register.go:66] "Registration Server started" socketPath="/registration/driver.csi.io-reg.sock"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:17.837245    1 node_register.go:96] "Skipping HTTP server"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:18.515514    1 main.go:97] "Received GetInfo call" request="&InfoRequest{}"`,
    `${formatDate(now)} ${formatTime(now)}  I1029 02:06:18.529723    1 main.go:109] "Received NotifyRegistrationStatus call" status="&RegistrationStatus{PluginRegistered:true,Error:,}"`,
  ];

  return logs.join('\n');
}

export default ComputeAdminConsolePage;
