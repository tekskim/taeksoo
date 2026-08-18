import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from '@/design-system';
import {
  IconPencilCog,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconFileImport,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ShellPanel, useShellPanel } from '@/components/ShellPanel';
import { ResourceTypeSearchDrawer } from '@/components/ResourceTypeSearchDrawer';
import { getActiveCpCluster } from '@/pages/containerActiveCluster';
import { useContainerMode } from '@/contexts/ContainerModeContext';

/* 리소스 종류 → 목록 화면 경로.
   드로어에서 종류를 고르면 그 목록으로 이동한다. */
const RESOURCE_ROUTES: Record<string, string> = {
  clusters: '/container/cluster-management',
  namespaces: '/container/namespaces',
  nodes: '/container/nodes',
  events: '/container/events',
  deployments: '/container/deployments',
  statefulsets: '/container/statefulsets',
  daemonsets: '/container/daemonsets',
  jobs: '/container/jobs',
  cronjobs: '/container/cronjobs',
  pods: '/container/pods',
  services: '/container/services',
  ingresses: '/container/ingresses',
  hpa: '/container/hpa',
  pv: '/container/persistent-volumes',
  pvc: '/container/persistent-volume-claims',
  storageclasses: '/container/storage-classes',
  configmaps: '/container/configmaps',
  secrets: '/container/secrets',
  limitranges: '/container/limit-ranges',
  resourcequotas: '/container/resource-quotas',
  networkpolicies: '/container/network-policies',
  pdb: '/container/pdb',
};

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
  const navigate = useNavigate();
  const { isPlatform } = useContainerMode();
  const [searchOpen, setSearchOpen] = useState(false);

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
      {/* Quick create — Import YAML (CorePlan D-34).
          Container Platform mode only: D-26 keeps the Aegis/Metis mode screens
          unchanged. Hidden on dedicated clusters too, since D-28 ② says a
          dedicated cluster shows no creation entry point ([CCONT-04] [CCONT-05]). */}
      {isPlatform && !getActiveCpCluster().dedicated && (
        <Tooltip content="Import YAML" position="bottom">
          <button
            className={btnClass}
            onClick={() => navigate('/container/import-yaml')}
            aria-label="Import YAML"
          >
            <IconFileImport size={16} className={iconClass} stroke={1.5} />
          </button>
        </Tooltip>
      )}

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
      {/* Resource type search — 드로어는 이미 있었는데 상단바 버튼에 연결되지
          않아 데모 페이지에서만 열렸다. 종류를 고르면 그 목록으로 이동한다. */}
      <Tooltip content="Resource type search" position="bottom">
        <button
          className={btnClass}
          onClick={() => setSearchOpen(true)}
          aria-label="Resource type search"
        >
          <IconSearch size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>

      <ResourceTypeSearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(_categoryId, resourceId) => {
          const path = RESOURCE_ROUTES[resourceId];
          if (path) {
            setSearchOpen(false);
            navigate(path);
          }
        }}
      />

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
