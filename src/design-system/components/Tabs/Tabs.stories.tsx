import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { useState } from 'react';
import { Badge } from '../Badge';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'boxed'],
      description: '탭 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '탭 크기',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Basic Underline Tabs
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Features</Tab>
        <Tab value="tab3">Settings</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">Overview content goes here.</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Features content goes here.</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">Settings content goes here.</div>
      </TabPanel>
    </Tabs>
  ),
};

// Boxed Tabs
export const Boxed: Story = {
  render: () => (
    <Tabs defaultValue="tab1" variant="boxed">
      <TabList>
        <Tab value="tab1">Day</Tab>
        <Tab value="tab2">Week</Tab>
        <Tab value="tab3">Month</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">Daily view content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Weekly view content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">Monthly view content</div>
      </TabPanel>
    </Tabs>
  ),
};

// Controlled Tabs
export const Controlled: Story = {
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="tab1">First</Tab>
            <Tab value="tab2">Second</Tab>
            <Tab value="tab3">Third</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">First tab content</div>
          </TabPanel>
          <TabPanel value="tab2">
            <div className="p-4">Second tab content</div>
          </TabPanel>
          <TabPanel value="tab3">
            <div className="p-4">Third tab content</div>
          </TabPanel>
        </Tabs>
        <p className="text-sm text-[var(--color-text-muted)]">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>
    );
  },
};

// With Disabled Tab
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Active</Tab>
        <Tab value="tab2">Also Active</Tab>
        <Tab value="tab3" disabled>Disabled</Tab>
      </TabList>
      <TabPanel value="tab1">
        <div className="p-4">First tab content</div>
      </TabPanel>
      <TabPanel value="tab2">
        <div className="p-4">Second tab content</div>
      </TabPanel>
      <TabPanel value="tab3">
        <div className="p-4">This tab is disabled</div>
      </TabPanel>
    </Tabs>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium mb-2">Small (sm)</p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">Small tab content</div>
          </TabPanel>
        </Tabs>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Medium (md)</p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">
            <div className="p-4">Medium tab content</div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  ),
};

// With Badges
export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="all">
      <TabList>
        <Tab value="all">
          <span className="flex items-center gap-2">
            All <Badge size="sm" theme="gray" type="subtle">128</Badge>
          </span>
        </Tab>
        <Tab value="active">
          <span className="flex items-center gap-2">
            Active <Badge size="sm" theme="green" type="subtle">42</Badge>
          </span>
        </Tab>
        <Tab value="pending">
          <span className="flex items-center gap-2">
            Pending <Badge size="sm" theme="yellow" type="subtle">15</Badge>
          </span>
        </Tab>
        <Tab value="error">
          <span className="flex items-center gap-2">
            Error <Badge size="sm" theme="red" type="subtle">3</Badge>
          </span>
        </Tab>
      </TabList>
      <TabPanel value="all">
        <div className="p-4">All items (128)</div>
      </TabPanel>
      <TabPanel value="active">
        <div className="p-4">Active items (42)</div>
      </TabPanel>
      <TabPanel value="pending">
        <div className="p-4">Pending items (15)</div>
      </TabPanel>
      <TabPanel value="error">
        <div className="p-4">Error items (3)</div>
      </TabPanel>
    </Tabs>
  ),
};

// Real-world Example: Settings Page
export const SettingsPage: Story = {
  render: () => (
    <div className="w-[600px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      <Tabs defaultValue="profile">
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="profile">
          <div className="py-4">
            <h3 className="font-medium mb-2">Profile Settings</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Update your name, email, and profile picture.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="security">
          <div className="py-4">
            <h3 className="font-medium mb-2">Security Settings</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Manage your password and two-factor authentication.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="notifications">
          <div className="py-4">
            <h3 className="font-medium mb-2">Notification Preferences</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Configure how and when you receive notifications.
            </p>
          </div>
        </TabPanel>
        <TabPanel value="billing">
          <div className="py-4">
            <h3 className="font-medium mb-2">Billing Information</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Manage your subscription and payment methods.
            </p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  ),
};

// Boxed Toggle Example
export const BoxedToggle: Story = {
  render: () => (
    <div className="w-[300px]">
      <Tabs defaultValue="list" variant="boxed">
        <TabList>
          <Tab value="list">List</Tab>
          <Tab value="grid">Grid</Tab>
          <Tab value="calendar">Calendar</Tab>
        </TabList>
        <TabPanel value="list">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            List view content
          </div>
        </TabPanel>
        <TabPanel value="grid">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            Grid view content
          </div>
        </TabPanel>
        <TabPanel value="calendar">
          <div className="p-4 text-center text-[var(--color-text-muted)]">
            Calendar view content
          </div>
        </TabPanel>
      </Tabs>
    </div>
  ),
};
