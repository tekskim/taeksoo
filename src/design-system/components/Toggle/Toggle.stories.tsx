import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '토글 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// Basic
export const Default: Story = {
  args: {
    label: 'Toggle label',
  },
};

// Checked
export const Checked: Story = {
  args: {
    label: 'Enabled',
    defaultChecked: true,
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Switch between light and dark theme',
  },
};

// Without Label
export const WithoutLabel: Story = {
  args: {},
};

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

// Controlled
export const Controlled: Story = {
  render: function ControlledToggle() {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Toggle
          label="Notifications"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          Status: <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
        </p>
      </div>
    );
  },
};

// Settings Example
export const SettingsExample: Story = {
  render: function SettingsExample() {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    const handleChange = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[320px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
        <h3 className="text-[14px] font-semibold">Settings</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Push notifications</span>
            <Toggle
              checked={settings.notifications}
              onChange={() => handleChange('notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Dark mode</span>
            <Toggle
              checked={settings.darkMode}
              onChange={() => handleChange('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Auto-save</span>
            <Toggle
              checked={settings.autoSave}
              onChange={() => handleChange('autoSave')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Analytics</span>
            <Toggle
              checked={settings.analytics}
              onChange={() => handleChange('analytics')}
            />
          </div>
        </div>
      </div>
    );
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Default (off)" />
      <Toggle label="Default (on)" defaultChecked />
      <Toggle label="Disabled (off)" disabled />
      <Toggle label="Disabled (on)" disabled defaultChecked />
      <Toggle
        label="With description"
        description="This is a helpful description text."
      />
    </div>
  ),
};
