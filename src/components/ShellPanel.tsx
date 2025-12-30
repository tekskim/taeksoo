import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  IconX,
  IconExternalLink,
  IconTerminal2,
  IconGripHorizontal,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface ShellTab {
  id: string;
  title: string;
  content: string;
  connectionStatus: ConnectionStatus;
  instanceId?: string;
  container?: string;
}

export interface ShellPanelProps {
  /** Whether the shell panel is expanded */
  isExpanded: boolean;
  /** Callback when panel expand state changes */
  onExpandedChange: (expanded: boolean) => void;
  /** Active tabs */
  tabs: ShellTab[];
  /** Active tab id */
  activeTabId: string | null;
  /** Callback when active tab changes */
  onActiveTabChange: (tabId: string) => void;
  /** Callback to close a tab */
  onCloseTab: (tabId: string) => void;
  /** Callback to add new tab */
  onAddTab?: () => void;
  /** Callback when content changes */
  onContentChange?: (tabId: string, content: string) => void;
  /** Callback when clear button is clicked */
  onClear?: (tabId: string) => void;
  /** Initial height of the panel */
  initialHeight?: number;
  /** Minimum height of the panel */
  minHeight?: number;
}

/* ----------------------------------------
   Connection Status Indicator
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
    <div className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${config.color}`} />
      <span className="text-[12px] text-slate-300">
        {config.label}
      </span>
    </div>
  );
}

/* ----------------------------------------
   Shell Tab Button
   ---------------------------------------- */

interface ShellTabButtonProps {
  tab: ShellTab;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

function ShellTabButton({ tab, isActive, onClick, onClose }: ShellTabButtonProps) {
  return (
    <div
      className={`
        flex items-center gap-2 px-3 h-9 cursor-pointer transition-colors border-r border-slate-700
        ${isActive 
          ? 'bg-slate-800' 
          : 'bg-slate-900 hover:bg-slate-800/50'
        }
      `}
      onClick={onClick}
    >
      <IconTerminal2 size={14} className="text-slate-400" stroke={1.5} />
      <span className="text-[13px] text-slate-200 truncate max-w-[140px]">
        {tab.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Open in new window
          if (tab.instanceId) {
            window.open(`/console/${tab.instanceId}`, '_blank');
          }
        }}
        className="p-0.5 rounded hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-300"
        title="Open in new window"
      >
        <IconExternalLink size={12} stroke={1.5} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="p-0.5 rounded hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-300"
        title="Close tab"
      >
        <IconX size={12} stroke={1.5} />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Bottom Bar (Collapsed State)
   ---------------------------------------- */

interface BottomBarProps {
  tabCount: number;
  onExpand: () => void;
}

function BottomBar({ tabCount, onExpand }: BottomBarProps) {
  return (
    <div
      className="fixed bottom-0 right-0 z-40 h-8 bg-slate-900 border-t border-l border-slate-700 flex items-center px-3 cursor-pointer hover:bg-slate-800 transition-colors"
      style={{ left: '200px' }}
      onClick={onExpand}
    >
      <div className="flex items-center gap-2">
        <IconChevronUp size={14} className="text-slate-400" />
        <IconTerminal2 size={14} className="text-slate-400" />
        <span className="text-[12px] font-medium text-slate-300">
          Console
        </span>
        {tabCount > 0 && (
          <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {tabCount}
          </span>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Container Select Dropdown
   ---------------------------------------- */

interface ContainerSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function ContainerSelect({ value, options, onChange }: ContainerSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-slate-800 border border-slate-600 rounded px-3 py-1 pr-7 text-[12px] text-slate-200 cursor-pointer hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            Container: {opt}
          </option>
        ))}
      </select>
      <IconChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

/* ----------------------------------------
   View Time Select Dropdown
   ---------------------------------------- */

interface ViewTimeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function ViewTimeSelect({ value, onChange }: ViewTimeSelectProps) {
  const options = [
    'Last 15 minutes',
    'Last 30 minutes',
    'Last 1 hour',
    'Last 3 hours',
    'Last 6 hours',
    'Last 12 hours',
    'Last 24 hours',
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-slate-800 border border-slate-600 rounded px-3 py-1 pr-7 text-[12px] text-slate-200 cursor-pointer hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            View: {opt}
          </option>
        ))}
      </select>
      <IconChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

/* ----------------------------------------
   Shell Panel Component
   ---------------------------------------- */

export function ShellPanel({
  isExpanded,
  onExpandedChange,
  tabs,
  activeTabId,
  onActiveTabChange,
  onCloseTab,
  onContentChange,
  onClear,
  initialHeight = 350,
  minHeight = 300,
}: ShellPanelProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState('container-0');
  const [viewTime, setViewTime] = useState('Last 15 minutes');
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId);
  
  // Mock container options
  const containerOptions = ['container-0', 'container-1', 'container-2'];

  // Calculate max height (content area height - 100px)
  const getMaxHeight = useCallback(() => {
    if (typeof window === 'undefined') return 600;
    const mainContent = document.querySelector('main');
    if (mainContent) {
      return mainContent.clientHeight - 100;
    }
    return window.innerHeight - 200;
  }, []);

  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const maxHeight = getMaxHeight();
      const newHeight = window.innerHeight - e.clientY;
      setHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minHeight, getMaxHeight]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (contentRef.current && activeTab) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [activeTab?.content]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (activeTabId) {
      onContentChange?.(activeTabId, '');
      onClear?.(activeTabId);
    }
  }, [activeTabId, onContentChange, onClear]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (activeTab?.content) {
      const blob = new Blob([activeTab.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab.title}-logs.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [activeTab]);

  // Show bottom bar when collapsed
  if (!isExpanded) {
    return <BottomBar tabCount={tabs.length} onExpand={() => onExpandedChange(true)} />;
  }

  return (
    <div
      className="fixed bottom-0 right-0 z-40 bg-slate-900 border-t border-l border-slate-700 shadow-2xl flex flex-col"
      style={{
        height: `${height}px`,
        left: '200px',
        transition: isResizing ? 'none' : 'height 0.1s ease-out',
      }}
    >
      {/* Resize Handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center group hover:bg-slate-800"
        onMouseDown={handleMouseDown}
      >
        <IconGripHorizontal
          size={16}
          className="text-slate-600 group-hover:text-slate-400"
        />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center bg-slate-900 border-b border-slate-700">
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <ShellTabButton
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => onActiveTabChange(tab.id)}
              onClose={() => onCloseTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-6 bg-[#0d1117] text-slate-300"
      >
        {activeTab ? (
          activeTab.content ? (
            <pre className="whitespace-pre-wrap break-all m-0">{activeTab.content}</pre>
          ) : (
            <span className="text-slate-600">No output</span>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600">
            No console selected
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-700 bg-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Container Select */}
          <ContainerSelect
            value={selectedContainer}
            options={containerOptions}
            onChange={setSelectedContainer}
          />

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="px-3 py-1 rounded border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors text-[12px] text-slate-200"
          >
            Clear
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200"
            title="Download logs"
          >
            <IconDownload size={14} stroke={1.5} />
          </button>

          {/* Connection Status */}
          {activeTab && (
            <ConnectionStatusIndicator status={activeTab.connectionStatus} />
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Time Select */}
          <ViewTimeSelect value={viewTime} onChange={setViewTime} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Hook for managing shell tabs
   ---------------------------------------- */

export interface UseShellPanelOptions {
  initialExpanded?: boolean;
}

export function useShellPanel(options: UseShellPanelOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(options.initialExpanded ?? false);
  const [tabs, setTabs] = useState<ShellTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openConsole = useCallback((instanceId: string, instanceName: string) => {
    // Check if tab already exists
    const existingTab = tabs.find(t => t.instanceId === instanceId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setIsExpanded(true);
      return;
    }

    // Create new tab
    const newTab: ShellTab = {
      id: `console-${instanceId}-${Date.now()}`,
      title: instanceName,
      content: '',
      connectionStatus: 'connecting',
      instanceId,
      container: 'container-0',
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setIsExpanded(true);

    // Simulate connection and logs
    setTimeout(() => {
      const sampleLogs = generateSampleLogs(instanceName);
      setTabs(prev => prev.map(t => 
        t.id === newTab.id 
          ? { ...t, connectionStatus: 'connected' as ConnectionStatus, content: sampleLogs }
          : t
      ));
    }, 1000);
  }, [tabs]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      
      // If closing active tab, switch to another
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
        setIsExpanded(false);
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  const updateContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, content } : t
    ));
  }, []);

  const clearContent = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, content: '' } : t
    ));
  }, []);

  return {
    isExpanded,
    setIsExpanded,
    tabs,
    activeTabId,
    setActiveTabId,
    openConsole,
    closeTab,
    updateContent,
    clearContent,
  };
}

// Generate sample log output similar to the screenshot
function generateSampleLogs(instanceName: string): string {
  const now = new Date();
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
  };
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

export default ShellPanel;
