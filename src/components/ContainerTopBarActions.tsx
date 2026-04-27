import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from '@/design-system';
import { IconPencilCog, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';
import { ShellPanel, useShellPanel } from '@/components/ShellPanel';

interface ContainerTopBarActionsProps {
  onTerminalClick?: () => void;
  isTerminalActive?: boolean;
}

const btnClass = 'p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors';
const iconClass = 'text-[var(--color-text-muted)]';

function useMainSidebarWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const read = () => {
      const el = document.querySelector('main') as HTMLElement | null;
      if (el) setWidth(parseInt(el.style.left || '0', 10));
    };
    read();

    const el = document.querySelector('main');
    if (!el) return;

    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  return width;
}

export function ContainerTopBarActions({
  onTerminalClick,
  isTerminalActive,
}: ContainerTopBarActionsProps) {
  const ownShellPanel = useShellPanel();
  const useBuiltIn = !onTerminalClick;
  const sidebarWidth = useMainSidebarWidth();

  const handleTerminalClick = useCallback(() => {
    if (onTerminalClick) {
      onTerminalClick();
      return;
    }
    if (ownShellPanel.isExpanded) {
      ownShellPanel.setIsExpanded(false);
    } else {
      ownShellPanel.openConsole('kubectl-shell', 'Kubectl: ClusterName');
    }
  }, [onTerminalClick, ownShellPanel]);

  return (
    <>
      <Tooltip content="Cluster appearance" position="bottom">
        <button
          className={btnClass}
          onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
          aria-label="Cluster appearance"
        >
          <IconPencilCog size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Kubectl shell" position="bottom">
        <button className={btnClass} onClick={handleTerminalClick} aria-label="Kubectl shell">
          <IconTerminal2
            size={16}
            className={
              (useBuiltIn ? ownShellPanel.isExpanded : isTerminalActive)
                ? 'text-[var(--color-action-primary)]'
                : iconClass
            }
            stroke={1.5}
          />
        </button>
      </Tooltip>
      <Tooltip content="Download KubeConfig" position="bottom">
        <button className={btnClass} aria-label="Download KubeConfig">
          <IconFile size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Copy KubeConfig to clipboard" position="bottom">
        <button className={btnClass} aria-label="Copy KubeConfig to clipboard">
          <IconCopy size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Resource search" position="bottom">
        <button className={btnClass} aria-label="Resource search">
          <IconSearch size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>

      {useBuiltIn &&
        createPortal(
          <ShellPanel
            isExpanded={ownShellPanel.isExpanded}
            onExpandedChange={ownShellPanel.setIsExpanded}
            tabs={ownShellPanel.tabs}
            activeTabId={ownShellPanel.activeTabId}
            onActiveTabChange={ownShellPanel.setActiveTabId}
            onCloseTab={ownShellPanel.closeTab}
            onContentChange={ownShellPanel.updateContent}
            onClear={ownShellPanel.clearContent}
            initialHeight={350}
            minHeight={300}
            sidebarOpen={true}
            sidebarWidth={sidebarWidth}
          />,
          document.body
        )}
    </>
  );
}
