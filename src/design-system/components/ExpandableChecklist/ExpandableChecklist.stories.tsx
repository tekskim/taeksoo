import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpandableChecklist, type ChecklistItem } from './ExpandableChecklist';

const meta: Meta<typeof ExpandableChecklist> = {
  title: 'Components/ExpandableChecklist',
  component: ExpandableChecklist,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Expandable checklist with a parent header checkbox and collapsible child items. Supports indeterminate state, badges, and description text.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExpandableChecklist>;

const defaultItems: ChecklistItem[] = [
  { id: '1', label: 'Option A', badge: { text: 'green', theme: 'green', type: 'subtle' } },
  { id: '2', label: 'Option B', badge: { text: 'green', theme: 'green', type: 'subtle' } },
  { id: '3', label: 'Option C', badge: { text: 'green', theme: 'green', type: 'subtle' } },
  { id: '4', label: 'Option D' },
  { id: '5', label: 'Option E' },
];

function ControlledExample() {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);

  return (
    <div className="w-[280px]">
      <ExpandableChecklist
        label="Option"
        description="Description"
        badge={{ text: 'green', theme: 'green', type: 'subtle' }}
        items={items}
        onChange={setItems}
        defaultExpanded
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledExample />,
};

function CollapsedExample() {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);

  return (
    <div className="w-[280px]">
      <ExpandableChecklist
        label="Option"
        description="Description"
        badge={{ text: 'green', theme: 'green', type: 'subtle' }}
        items={items}
        onChange={setItems}
      />
    </div>
  );
}

export const Collapsed: Story = {
  render: () => <CollapsedExample />,
};

function WithoutBadgesExample() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', label: 'Read access' },
    { id: '2', label: 'Write access' },
    { id: '3', label: 'Admin access' },
  ]);

  return (
    <div className="w-[280px]">
      <ExpandableChecklist
        label="Permissions"
        description="Select user permissions"
        items={items}
        onChange={setItems}
        defaultExpanded
      />
    </div>
  );
}

export const WithoutBadges: Story = {
  render: () => <WithoutBadgesExample />,
};

function PartiallyCheckedExample() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      label: 'Option A',
      checked: true,
      badge: { text: 'active', theme: 'green', type: 'subtle' },
    },
    {
      id: '2',
      label: 'Option B',
      checked: false,
      badge: { text: 'pending', theme: 'yellow', type: 'subtle' },
    },
    {
      id: '3',
      label: 'Option C',
      checked: true,
      badge: { text: 'active', theme: 'green', type: 'subtle' },
    },
  ]);

  return (
    <div className="w-[280px]">
      <ExpandableChecklist
        label="Services"
        description="Manage services"
        badge={{ text: '2/3', theme: 'blue', type: 'subtle' }}
        items={items}
        onChange={setItems}
        defaultExpanded
      />
    </div>
  );
}

export const PartiallyChecked: Story = {
  render: () => <PartiallyCheckedExample />,
};
