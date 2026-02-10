import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button';
import { Input } from '../Input';
import { FormField } from '../FormField';
import { VStack, HStack } from '../../layouts';
import { IconSettings, IconUser, IconLogout, IconInfoCircle } from '@tabler/icons-react';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Popover는 Tooltip의 확장형으로, 인터랙티브한 콘텐츠를 표시하는 오버레이 컴포넌트입니다.

**Tooltip과의 차이점:**
- **Tooltip**: 텍스트만, 비인터랙티브, hover 전용
- **Popover**: 인터랙티브 콘텐츠 (폼, 메뉴, 버튼), click/hover 지원

**디자인 토큰:**
- Background: \`var(--color-surface-default)\`
- Border: \`var(--color-border-default)\`, 1px
- Radius: \`var(--primitive-radius-lg)\` (8px)
- Shadow: \`shadow-lg\`
- Arrow: double-triangle border technique (7px outer / 6px inner)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position relative to the trigger element',
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click'],
      description: 'How to trigger the popover (click or hover)',
    },
    showArrow: {
      control: 'boolean',
      description: 'Show the arrow indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the popover',
    },
    delay: {
      control: 'number',
      description: 'Delay before showing (ms) - hover trigger only',
    },
    hideDelay: {
      control: 'number',
      description: 'Delay before hiding (ms) - hover trigger only',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// Basic click trigger
export const Default: Story = {
  args: {
    content: (
      <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">
          This is a popover with interactive content.
        </p>
      </div>
    ),
    children: <Button variant="secondary">Click me</Button>,
    trigger: 'click',
    position: 'bottom',
  },
};

// Hover trigger
export const HoverTrigger: Story = {
  args: {
    content: (
      <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-sm text-[var(--color-text-muted)]">Hover to see more information</p>
      </div>
    ),
    children: <Button variant="ghost">Hover me</Button>,
    trigger: 'hover',
    position: 'top',
  },
};

// Interactive content with menu
export const WithMenu: Story = {
  render: () => (
    <Popover
      trigger="click"
      position="bottom"
      content={
        <VStack gap={1} className="p-[var(--primitive-spacing-2)] min-w-[160px]">
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconUser size={16} />
            Profile
          </button>
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconSettings size={16} />
            Settings
          </button>
          <div className="w-full h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]" />
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconLogout size={16} />
            Logout
          </button>
        </VStack>
      }
    >
      <Button variant="secondary">User Menu</Button>
    </Popover>
  ),
};

// Different positions
export const Positions: Story = {
  render: () => (
    <HStack gap={4}>
      {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
        <Popover
          key={position}
          trigger="click"
          position={position}
          content={
            <div className="p-[var(--primitive-spacing-3)]">
              <p className="text-body-md text-[var(--color-text-default)]">Position: {position}</p>
            </div>
          }
        >
          <Button variant="outline">{position}</Button>
        </Popover>
      ))}
    </HStack>
  ),
};

// Without arrow
export const NoArrow: Story = {
  args: {
    content: (
      <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">Popover without arrow</p>
      </div>
    ),
    children: <Button variant="secondary">No Arrow</Button>,
    showArrow: false,
    trigger: 'click',
  },
};

// Form content
export const WithForm: Story = {
  render: () => (
    <Popover
      trigger="click"
      position="bottom"
      content={
        <VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <div>
            <label className="text-label-sm text-[var(--color-text-muted)] block mb-[var(--primitive-spacing-1)]">
              Display Name
            </label>
            <input
              type="text"
              className="w-full px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-default)]"
              placeholder="Enter name"
            />
          </div>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>
      }
    >
      <Button variant="primary">Open Form</Button>
    </Popover>
  ),
};

// Controlled state
export const Controlled: Story = {
  render: function ControlledPopover() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <HStack gap={4}>
        <Popover
          trigger="click"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          content={
            <div className="p-[var(--primitive-spacing-4)]">
              <p className="text-body-md text-[var(--color-text-default)]">
                Controlled popover state: {isOpen ? 'Open' : 'Closed'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-[var(--primitive-spacing-2)]"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          <Button variant="secondary">Controlled</Button>
        </Popover>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          Toggle: {isOpen ? 'Open' : 'Closed'}
        </Button>
      </HStack>
    );
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    content: (
      <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-md">This won't show</p>
      </div>
    ),
    children: (
      <Button variant="secondary" disabled>
        Disabled
      </Button>
    ),
    disabled: true,
    trigger: 'click',
  },
};

// With FormField content
export const WithFormField: Story = {
  render: () => (
    <Popover
      trigger="click"
      position="bottom"
      content={
        <VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <FormField label="Display Name" helperText="2-64 characters">
            <Input placeholder="Enter name" fullWidth />
          </FormField>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>
      }
    >
      <Button variant="primary">Open Form</Button>
    </Popover>
  ),
};

// Info Popover (icon trigger)
export const InfoPopover: Story = {
  render: () => (
    <HStack gap={2} align="center">
      <span className="text-body-md text-[var(--color-text-default)]">Instance Type</span>
      <Popover
        trigger="hover"
        position="top"
        content={
          <div className="p-3 max-w-[240px]">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              인스턴스 타입은 생성 후 변경할 수 없습니다. 신중하게 선택해 주세요.
            </p>
          </div>
        }
      >
        <button className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]">
          <IconInfoCircle size={14} />
        </button>
      </Popover>
    </HStack>
  ),
};
