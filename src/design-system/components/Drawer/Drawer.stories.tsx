import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: '서랍 위치',
    },
    width: {
      control: 'number',
      description: '서랍 너비 (px)',
    },
    showCloseButton: {
      control: 'boolean',
      description: '닫기 버튼 표시',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경 클릭시 닫기',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'ESC 키로 닫기',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// Basic Drawer
export const Default: Story = {
  render: function DefaultDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Drawer Title"
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            This is the drawer content. You can put any content here.
          </p>
        </Drawer>
      </>
    );
  },
};

// Left Side Drawer
export const LeftSide: Story = {
  render: function LeftDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Navigation"
          side="left"
          width={280}
        >
          <nav className="flex flex-col gap-2">
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">Dashboard</a>
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">Projects</a>
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">Settings</a>
          </nav>
        </Drawer>
      </>
    );
  },
};

// With Footer
export const WithFooter: Story = {
  render: function FooterDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer with Footer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Item"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Save Changes
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <Input label="Name" placeholder="Enter name" fullWidth />
            <Input label="Description" placeholder="Enter description" fullWidth />
          </div>
        </Drawer>
      </>
    );
  },
};

// Edit Form Example
export const EditForm: Story = {
  render: function EditFormDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Settings</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Instance Settings"
          width={400}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">General</h3>
              <Input label="Instance Name" defaultValue="my-instance-01" fullWidth />
              <Select
                label="Region"
                options={[
                  { value: 'us-east', label: 'US East' },
                  { value: 'us-west', label: 'US West' },
                  { value: 'eu-west', label: 'EU West' },
                ]}
                defaultValue="us-east"
                fullWidth
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">Features</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-scaling</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monitoring</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <Toggle />
              </div>
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

// Wide Drawer
export const WideDrawer: Story = {
  render: function WideDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Wide Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Detailed View"
          width={600}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              This drawer is wider than the default to accommodate more content.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
              <Input label="Email" placeholder="john@example.com" />
              <Input label="Phone" placeholder="+1 234 567 890" />
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

// No Backdrop Close
export const NoBackdropClose: Story = {
  render: function NoBackdropDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Protected Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Form"
          closeOnBackdropClick={false}
          closeOnEscape={false}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Discard
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            This drawer can only be closed by clicking the buttons.
            Clicking the backdrop or pressing ESC won't close it.
          </p>
        </Drawer>
      </>
    );
  },
};

// Without Title
export const NoTitle: Story = {
  render: function NoTitleDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold mb-2">Custom Header</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              This drawer doesn't have a built-in title
            </p>
          </div>
        </Drawer>
      </>
    );
  },
};

// Scrollable Content
export const ScrollableContent: Story = {
  render: function ScrollableDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Scrollable Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Long Content"
          footer={
            <Button onClick={() => setIsOpen(false)} fullWidth>Close</Button>
          }
        >
          <div className="flex flex-col gap-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="p-4 border border-[var(--color-border-default)] rounded">
                <h3 className="font-medium">Item {i + 1}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  This is the description for item {i + 1}. It contains some text to demonstrate scrollable content.
                </p>
              </div>
            ))}
          </div>
        </Drawer>
      </>
    );
  },
};
