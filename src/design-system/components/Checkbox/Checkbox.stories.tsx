import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    indeterminate: {
      control: 'boolean',
      description: '부분 선택 상태',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Basic
export const Default: Story = {
  args: {
    label: 'Checkbox label',
  },
};

// Checked
export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    defaultChecked: true,
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive weekly updates about new features and promotions.',
  },
};

// Indeterminate
export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

// Error State
export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: true,
    errorMessage: 'You must agree to continue',
  },
};

// Controlled
export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          Checked: <strong>{checked ? 'Yes' : 'No'}</strong>
        </p>
      </div>
    );
  },
};

// Select All Pattern
export const SelectAllPattern: Story = {
  render: function SelectAllExample() {
    const [items, setItems] = useState([
      { id: '1', label: 'Item 1', checked: true },
      { id: '2', label: 'Item 2', checked: false },
      { id: '3', label: 'Item 3', checked: true },
    ]);

    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked) && !allChecked;

    const handleSelectAll = () => {
      setItems(items.map((item) => ({ ...item, checked: !allChecked })));
    };

    const handleItemChange = (id: string) => {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    };

    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={handleSelectAll}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.checked}
              onChange={() => handleItemChange(item.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Error" error errorMessage="This field is required" />
      <Checkbox
        label="With description"
        description="This is a helpful description text."
      />
    </div>
  ),
};

// Checkbox Group
export const GroupExample: Story = {
  render: function CheckboxGroupExample() {
    const [selected, setSelected] = useState<string[]>(['react']);

    const options = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ];

    const handleChange = (value: string) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Select frameworks:</p>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: <strong>{selected.join(', ') || 'None'}</strong>
        </p>
      </div>
    );
  },
};
