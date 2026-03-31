import React, { memo } from 'react';
import { TAB_DRAG_MIME } from '../../services/drag/constants';
import { useFrame } from '../../services/providers/FrameProvider';
import type { SwitchTabOptions } from '../../services/providers/TabProvider/TabProvider';
import { cn } from '../../services/utils/cn';
import type { TabInfo } from '../../types';
import { TabBar } from '../TabBar';
import { appHeaderContainerStyles } from './AppLayout.styles';

/**
 * Types
 */

type TabDragPayload = {
  tab: {
    id: string;
    title: string;
    virtualPath: string;
    componentName?: string;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  };
  source: {
    frameId: string;
    appId: string;
  };
};

interface TabManagerHook<T = string> {
  tabs: TabInfo<T>[];
  activeTabId: string;
  activeTab: TabInfo<T> | null;
  switchTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  addTab: (
    route: {
      path: string;
      component: unknown;
      title: string;
      [key: string]: unknown;
    },
    params?: Record<string, unknown>,
    query?: Record<string, unknown>
  ) => string;
  switchTabToPath: (path: string, options?: SwitchTabOptions) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

interface DefaultRoute {
  path: string;
  component: string;
  title: string;
  domain: string;
  [key: string]: unknown;
}

interface BaseAppHeaderTabProps {
  /** Tab manager hook from domain-specific provider */
  useTabManager: () => unknown;
  /** Default route to open when adding a new tab */
  defaultNewTabRoute: DefaultRoute;
  /** Optional custom className */
  className?: string;
  /** Application id (e.g., 'suite_compute') - used for drag payload */
  appId: string;
}

type AppHeaderTabProps = BaseAppHeaderTabProps;

/**
 * Components
 */

const AppHeaderTab = ({
  useTabManager,
  defaultNewTabRoute,
  className,
  appId,
}: AppHeaderTabProps): React.ReactElement => {
  const tabManager = useTabManager() as TabManagerHook;
  const { tabs, activeTabId, switchTab, closeTab, addTab, reorderTabs } = tabManager;
  const { frameId } = useFrame();
  const tabMapById = new Map<string, TabInfo>();
  tabs.forEach((t) => tabMapById.set(t.id, t));
  const isSingleTab = tabs.length === 1;

  const handleTabClick = (tabId: string): void => {
    switchTab(tabId);
  };

  const handleTabClose = (tabId: string): void => {
    closeTab(tabId);
  };

  const handleAddTab = (): void => {
    addTab(defaultNewTabRoute);
  };

  const handleTabReorder = (fromIndex: number, toIndex: number): void => {
    reorderTabs(fromIndex, toIndex);
  };

  const handleTabDragStart = (tabId: string, e: React.DragEvent): void => {
    if (isSingleTab) {
      // 단일 탭일 때는 창 드래그로 동작해야 하므로 페이로드 설정하지 않음
      return;
    }

    const tab = tabMapById.get(tabId);

    if (!tab) {
      return;
    }

    try {
      const payload: TabDragPayload = {
        tab: {
          id: tab.id,
          title: tab.title,
          virtualPath: tab.virtualPath,
          componentName: tab.componentName as string | undefined,
          params: tab.params,
          query: tab.query,
        },
        source: { frameId, appId },
      };
      e.dataTransfer.setData(TAB_DRAG_MIME, JSON.stringify(payload));
      e.dataTransfer.effectAllowed = 'copyMove';
    } catch {
      // ignore
    }
  };

  return (
    <div className={cn(appHeaderContainerStyles, className)}>
      <TabBar
        tabs={tabs.map((tab) => ({
          id: tab.id,
          title: tab.title,
          draggable: true,
        }))}
        activeTab={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onAddTab={handleAddTab}
        onTabReorder={handleTabReorder}
        onTabDragStart={handleTabDragStart}
        enableWindowDragPassthrough={isSingleTab}
      />
    </div>
  );
};

AppHeaderTab.displayName = 'AppHeaderTab';

/**
 * Exports
 */

export type { AppHeaderTabProps, DefaultRoute, TabManagerHook };
export default memo(AppHeaderTab);
