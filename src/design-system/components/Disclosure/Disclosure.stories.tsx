import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disclosure } from './Disclosure';

/**
 * # Disclosure
 *
 * 콘텐츠를 접거나 펼칠 수 있는 아코디언 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 긴 콘텐츠를 접어서 공간을 절약할 때
 * - FAQ나 도움말 섹션
 * - 설정 옵션을 그룹화할 때
 * - 추가 정보를 선택적으로 표시할 때
 *
 * ## 구성 요소
 * - **Disclosure**: 컨테이너 (Context Provider)
 * - **Disclosure.Trigger**: 클릭 가능한 트리거 버튼
 * - **Disclosure.Panel**: 접히는 콘텐츠 영역
 *
 * ## 제어 방식
 * - **Uncontrolled**: `defaultOpen` prop 사용
 * - **Controlled**: `open` + `onChange` props 사용
 *
 * ## 접근성
 * - `aria-expanded`로 열림/닫힘 상태 전달
 * - `aria-controls`로 트리거와 패널 연결
 * - `role="region"`으로 패널 영역 표시
 * - 키보드로 조작 가능 (Enter/Space)
 */
const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '콘텐츠를 접거나 펼칠 수 있는 아코디언 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: '기본 열림 상태 (비제어)',
    },
    open: {
      control: 'boolean',
      description: '열림 상태 (제어)',
    },
    onChange: {
      action: 'changed',
      description: '상태 변경 콜백',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  render: () => (
    <Disclosure>
      <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
          This is the hidden content that appears when you click the trigger. It can contain any
          content you want.
        </div>
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const DefaultOpen: Story = {
  name: 'Default Open',
  render: () => (
    <Disclosure defaultOpen>
      <Disclosure.Trigger>Already expanded</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
          This disclosure starts in the open state.
        </div>
      </Disclosure.Panel>
    </Disclosure>
  ),
};

/* ----------------------------------------
   Controlled Example
   ---------------------------------------- */

export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-1)] text-body-md bg-[var(--color-action-primary)] text-[var(--color-on-primary)] rounded-[var(--primitive-radius-md)]"
          >
            {isOpen ? 'Close' : 'Open'} from outside
          </button>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            State: {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <Disclosure open={isOpen} onChange={setIsOpen}>
          <Disclosure.Trigger>Controlled disclosure</Disclosure.Trigger>
          <Disclosure.Panel>
            <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
              This disclosure is controlled by external state.
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    );
  },
};

/* ----------------------------------------
   Multiple Disclosures
   ---------------------------------------- */

export const Multiple: Story = {
  name: 'Multiple Disclosures',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 1: Getting Started</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Learn how to get started with our product. This section covers installation, setup, and
            basic configuration.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 2: Advanced Features</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Explore advanced features and customization options. This includes API integrations and
            plugins.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-3)]">
        <Disclosure.Trigger>Section 3: Troubleshooting</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Common issues and their solutions. Contact support if you need additional help.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  ),
};

/* ----------------------------------------
   FAQ Example
   ---------------------------------------- */

export const FAQ: Story = {
  name: 'Use Case - FAQ',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
      <h3 className="text-heading-h4 mb-[var(--primitive-spacing-2)]">
        Frequently Asked Questions
      </h3>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>What is your return policy?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            We offer a 30-day return policy for all unused items in their original packaging. Please
            contact our support team to initiate a return.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>How long does shipping take?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Standard shipping takes 5-7 business days. Express shipping is available for 2-3
            business day delivery at an additional cost.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure className="border-b border-[var(--color-border-default)] pb-3">
        <Disclosure.Trigger>Do you offer international shipping?</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-muted)]">
            Yes, we ship to over 50 countries worldwide. International shipping rates and delivery
            times vary by location.
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  ),
};

/* ----------------------------------------
   Settings Panel Example
   ---------------------------------------- */

export const SettingsPanel: Story = {
  name: 'Use Case - Settings Panel',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full bg-[var(--color-surface-subtle)] p-[var(--primitive-spacing-4)] rounded-[var(--primitive-radius-lg)]">
      <Disclosure defaultOpen>
        <Disclosure.Trigger>General Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" />
              Dark mode
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Auto-save
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Privacy Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" defaultChecked />
              Share usage data
            </label>
            <label className="flex items-center gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)]">
              <input type="checkbox" />
              Allow third-party cookies
            </label>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Trigger>Advanced Settings</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-muted)]">
            <p>Developer mode: Disabled</p>
            <p>API Version: v2.1.0</p>
            <p>Cache: Enabled</p>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  ),
};

/* ----------------------------------------
   Nested Disclosures
   ---------------------------------------- */

export const Nested: Story = {
  name: 'Nested Disclosures',
  render: () => (
    <Disclosure className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]">
      <Disclosure.Trigger>Parent Section</Disclosure.Trigger>
      <Disclosure.Panel>
        <div className="pt-[var(--primitive-spacing-3)] pl-[var(--primitive-spacing-5)] flex flex-col gap-[var(--primitive-spacing-2)]">
          <p className="text-body-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
            This section contains nested disclosures.
          </p>

          <Disclosure className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]">
            <Disclosure.Trigger>Child Section A</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]">
                Content for child section A
              </div>
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-2)] bg-[var(--color-surface-subtle)]">
            <Disclosure.Trigger>Child Section B</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-[var(--primitive-spacing-2)] pl-[var(--primitive-spacing-5)] text-body-md text-[var(--color-text-subtle)]">
                Content for child section B
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  ),
};
