import type { Meta, StoryObj } from '@storybook/react';
import React, { createContext, useContext, useState } from 'react';
import { FrameProvider } from '../../services/providers/FrameProvider';
import type { TabInfo } from '../../types';
import AppHeaderTab from './AppHeaderTab';

const meta: Meta<typeof AppHeaderTab> = {
  title: 'Navigation/AppHeaderTab',
  component: AppHeaderTab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AppHeaderTab combines a home button and tab bar for application navigation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppHeaderTab>;

/**
 * Mock Tab Provider
 */

interface MockTabContextValue {
  tabs: TabInfo[];
  activeTabId: string;
  switchTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  addTab: (route: unknown) => string;
  switchTabToPath: (path: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  activeTab: TabInfo | null;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

const MockTabContext = createContext<MockTabContextValue | null>(null);

const MockTabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tabs, setTabs] = useState<TabInfo[]>([
    {
      id: '1',
      title: 'Home',
      virtualPath: '/home',
      componentName: 'HomePage',
      params: {},
      query: {},
    },
    {
      id: '2',
      title: 'Instances',
      virtualPath: '/instances',
      componentName: 'InstancesPage',
      params: {},
      query: {},
    },
    {
      id: '3',
      title: 'Networks',
      virtualPath: '/networks',
      componentName: 'NetworksPage',
      params: {},
      query: {},
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const value: MockTabContextValue = {
    tabs,
    activeTabId,
    activeTab: tabs.find(tab => tab.id === activeTabId) || null,
    switchTab: setActiveTabId,
    closeTab: (id: string) => {
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (activeTabId === id && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      }
    },
    addTab: () => {
      const id = String(Date.now());
      const newTab = {
        id,
        title: 'New Tab',
        virtualPath: '/new',
        componentName: 'NewPage',
        params: {},
        query: {},
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(id);
      return id;
    },
    switchTabToPath: (path: string) => {
      const tab = tabs.find(t => t.virtualPath === path);
      if (tab) setActiveTabId(tab.id);
    },
    reorderTabs: (fromIndex: number, toIndex: number) => {
      const newTabs = [...tabs];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      setTabs(newTabs);
    },
    canGoBack: false,
    canGoForward: false,
    goBack: () => {},
    goForward: () => {},
  };

  return (
    <MockTabContext.Provider value={value}>{children}</MockTabContext.Provider>
  );
};

const useMockTabManager = () => {
  const context = useContext(MockTabContext);
  if (!context)
    throw new Error('useMockTabManager must be used within MockTabProvider');
  return context;
};

/**
 * Stories
 */

export const Default: Story = {
  render: () => (
    <FrameProvider frameId="storybook-frame">
      <MockTabProvider>
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            background: 'var(--semantic-color-surfaceMuted)',
          }}
        >
          <AppHeaderTab
            useTabManager={useMockTabManager}
            defaultNewTabRoute={{
              path: '/new',
              component: 'NewPage',
              title: 'New Tab',
              domain: 'app',
            }}
            appId="suite_compute"
          />
        </div>
      </MockTabProvider>
    </FrameProvider>
  ),
};
