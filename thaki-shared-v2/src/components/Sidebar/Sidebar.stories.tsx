import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  HomeIcon,
  InstancesIcon,
  NetworksIcon,
  SettingIcon,
  StorageIcon,
} from '../Icon/svg';
import { Sidebar } from './Sidebar';
import { SidebarMenu } from './SidebarMenu';
import { SidebarMenuItem } from './SidebarMenuItem';
import type { SidebarSection } from './Sidebar.types';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const sampleSections: SidebarSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    path: '/',
  },
  {
    id: 'compute',
    label: 'Compute',
    children: [
      {
        id: 'instances',
        label: 'Instances',
        path: '/instances',
        icon: InstancesIcon,
      },
      {
        id: 'storage',
        label: 'Storage',
        path: '/storage',
        icon: StorageIcon,
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    children: [
      {
        id: 'networks',
        label: 'Networks',
        path: '/networks',
        icon: NetworksIcon,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingIcon,
    path: '/settings',
  },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [activePath, setActivePath] = useState('/');

    const handleNavigate = (path: string, options: { newTab: boolean }) => {
      console.log('Navigate to:', path, 'New tab:', options.newTab);
      if (!options.newTab) {
        setActivePath(path);
      }
    };

    const handleItemClick = (path: string, event?: React.MouseEvent) => {
      const shouldOpenNewTab =
        event && (event.ctrlKey || event.metaKey || event.button === 1);
      handleNavigate(path, { newTab: Boolean(shouldOpenNewTab) });
    };

    const isItemActive = (path: string) => path === activePath;

    return (
      <Sidebar onToggleSidebar={() => console.log('Toggle sidebar')}>
        <SidebarMenuItem
          path="/"
          label="Dashboard"
          icon={HomeIcon}
          isActive={isItemActive('/')}
          onClick={handleItemClick}
        />
        <SidebarMenu
          sections={sampleSections.filter(s => s.children)}
          defaultOpenSections={['compute', 'network']}
          onNavigate={handleNavigate}
          isItemActive={isItemActive}
        />
      </Sidebar>
    );
  },
};
