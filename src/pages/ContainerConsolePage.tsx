import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { IconTerminal2, IconCircleFilled } from '@tabler/icons-react';
import { Select, Button, TabBar, TopBar, Breadcrumb } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';

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
      color: 'text-[var(--color-state-success)]',
      bgColor: 'bg-[var(--color-state-success)]',
      label: 'Connected',
    },
    connecting: {
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      label: 'Connecting',
    },
    disconnected: {
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      label: 'Disconnected',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2.5 px-3">
      <IconCircleFilled size={16} className={config.color} />
      <span className={`text-[12px] font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

/* ----------------------------------------
   Container Console Page Component
   ---------------------------------------- */

export function ContainerConsolePage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const [searchParams] = useSearchParams();
  const instanceName = searchParams.get('name') || instanceId || 'kubectl';
  const navigate = useNavigate();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    '# Run kubectl commands inside here',
    '# e.g. kubectl get all',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedContainer, setSelectedContainer] = useState('container-0');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tab management
  const { tabs, activeTabId, selectTab, closeTab, addTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format with terminal icon for console tabs
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
    icon: tab.path.includes('/console') ? <IconTerminal2 size={16} stroke={1.5} /> : undefined,
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
    addNewTab();
  };

  // Container options for Select
  const containerOptions = [
    { value: 'container-0', label: 'Container: container-0' },
    { value: 'container-1', label: 'Container: container-1' },
    { value: 'container-2', label: 'Container: container-2' },
  ];

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => clearTimeout(timer);
  }, [instanceName]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input on click
  const handleConsoleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle command input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && currentInput.trim()) {
        // Add command to history
        setCommandHistory((prev) => [...prev, `> ${currentInput}`]);

        // Simulate command response
        setTimeout(() => {
          setCommandHistory((prev) => [...prev, `Executing: ${currentInput}...`, '']);
        }, 100);

        setCurrentInput('');
      }
    },
    [currentInput]
  );

  // Handle clear
  const handleClear = useCallback(() => {
    setCommandHistory(['# Run kubectl commands inside here', '# e.g. kubectl get all']);
    setCurrentInput('');
  }, []);

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 260 : 60;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Container Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
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
            onTabMove={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar with Breadcrumb Navigation */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'clusterName', href: '/container' },
                  { label: `Kubectl: ${instanceName}` },
                ]}
              />
            }
          />
        </div>

        {/* Console Content - Full height */}
        <div className="flex flex-col flex-1">
          {/* Console Area - Dark background with monospace font */}
          <div
            ref={contentRef}
            onClick={handleConsoleClick}
            className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-[18px] bg-[var(--color-surface-contrast)] text-white cursor-text shell-scroll"
          >
            {/* Command History */}
            {commandHistory.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap break-all">
                {line}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center">
              <span className="text-white">&gt; </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[12px] leading-[18px]"
                autoFocus
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="flex items-center gap-2.5 px-2 py-1 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
            {/* Container Select */}
            <Select
              value={selectedContainer}
              onChange={setSelectedContainer}
              options={containerOptions}
              placeholder="Container"
            />

            {/* Clear Button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleClear}
              className="!text-[var(--color-action-primary)]"
            >
              Clear
            </Button>

            {/* Connection Status indicator */}
            <ConnectionStatusIndicator status={connectionStatus} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContainerConsolePage;
