import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TabBar from './TabBar';
import type { TabItem } from './types';

const meta: Meta<typeof TabBar> = {
  title: 'Navigation/TabBar',
  component: TabBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A tabbed interface component with drag and drop reordering support.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabBar>;

const TabBarWithState = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'instances', title: 'Instances', draggable: true },
    { id: 'networks', title: 'Networks', draggable: true },
    { id: 'storage', title: 'Storage', draggable: true },
    { id: 'security', title: 'Security Groups', draggable: true },
  ]);

  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string): void => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleAddTab = (): void => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: TabItem = {
      id: newTabId,
      title: `New Tab ${tabs.length + 1}`,
      draggable: true,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };

  const handleTabReorder = (fromIndex: number, toIndex: number): void => {
    const newTabs = [...tabs];
    const [movedTab] = newTabs.splice(fromIndex, 1);
    newTabs.splice(toIndex, 0, movedTab);
    setTabs(newTabs);
  };

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabClick={handleTabClick}
      onTabClose={handleTabClose}
      onAddTab={handleAddTab}
      onTabReorder={handleTabReorder}
    />
  );
};

export const Default: Story = {
  render: TabBarWithState,
  parameters: {
    docs: {
      description: {
        story:
          'Default TabBar with multiple tabs. You can click tabs to switch between them, close tabs, add new tabs, and drag tabs to reorder them.',
      },
    },
  },
};
