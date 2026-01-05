import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  IconX,
  IconExternalLink,
  IconTerminal2,
  IconGripHorizontal,
  IconDownload,
} from '@tabler/icons-react';
import { Select, Button } from '@/design-system';

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
  /** Callback when open in new tab is clicked */
  onOpenInNewTab?: (tab: ShellTab) => void;
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
    <div className="flex items-center gap-1.5 ml-3">
      <span className={`size-2 rounded-full ${config.color}`} />
      <span className="text-[12px] text-[var(--color-text-default)]">
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
  onOpenInNewTab?: () => void;
}

function ShellTabButton({ tab, isActive, onClick, onClose, onOpenInNewTab }: ShellTabButtonProps) {
  return (
    <div
      className={`
        relative flex items-center gap-2 px-3 h-9 cursor-pointer transition-colors border-r border-[var(--color-border-subtle)]
        ${isActive 
          ? 'bg-[var(--color-surface-default)]' 
          : 'bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]'
        }
      `}
      onClick={onClick}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)]" />
      )}
      <IconTerminal2 size={14} className={isActive ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]'} stroke={1} />
      <span className={`flex-1 truncate text-[length:var(--tabbar-font-size)] leading-[var(--tabbar-line-height)] font-medium max-w-[140px] ${isActive ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]'}`}>
        {tab.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenInNewTab?.();
        }}
        className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
        title="Open in new tab"
      >
        <IconExternalLink size={12} stroke={1} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
        title="Close tab"
      >
        <IconX size={12} stroke={1} />
      </button>
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
  onOpenInNewTab,
  initialHeight = 350,
  minHeight = 300,
}: ShellPanelProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState('container-0');
  const [viewTime, setViewTime] = useState('last-15');
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId);
  
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

  // Don't render anything if no tabs or not expanded
  if (!isExpanded || tabs.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 right-0 z-40 bg-[var(--color-surface-default)] border-t border-l border-[var(--color-border-default)] shadow-lg flex flex-col"
      style={{
        height: `${height}px`,
        left: '200px',
        transition: isResizing ? 'none' : 'height 0.1s ease-out',
      }}
    >
      {/* Resize Handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center group hover:bg-[var(--color-surface-subtle)]"
        onMouseDown={handleMouseDown}
      >
        <IconGripHorizontal
          size={16}
          className="text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-muted)]"
        />
      </div>

      {/* Tab Bar - White tone */}
      <div className="flex items-center bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <ShellTabButton
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => onActiveTabChange(tab.id)}
              onClose={() => onCloseTab(tab.id)}
              onOpenInNewTab={() => onOpenInNewTab?.(tab)}
            />
          ))}
        </div>
      </div>

      {/* Content - Dark background for logs */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-5 bg-[#0d1117] text-slate-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full"
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

      {/* Bottom Status Bar - White tone */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
        <div className="flex items-center gap-1">
          {/* Container Select - Using Design System */}
          <Select
            size="sm"
            value={selectedContainer}
            onChange={setSelectedContainer}
            options={containerOptions}
            placeholder="Container"
            menuPlacement="top"
          />

          {/* Clear Button - Using Design System */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            aria-label="Download"
            className="inline-flex items-center justify-center size-[28px] rounded-[var(--button-radius)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] border border-[var(--color-border-strong)] hover:bg-[var(--button-secondary-hover-bg)] transition-colors"
          >
            <IconDownload size={14} stroke={1} />
          </button>

          {/* Connection Status */}
          {activeTab && (
            <ConnectionStatusIndicator status={activeTab.connectionStatus} />
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Time Select - Using Design System */}
          <Select
            size="sm"
            value={viewTime}
            onChange={setViewTime}
            options={viewTimeOptions}
            placeholder="View"
            menuPlacement="top"
          />
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
