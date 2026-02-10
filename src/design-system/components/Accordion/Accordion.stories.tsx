import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion.Root> = {
  title: 'Components/Accordion',
  component: Accordion.Root,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion.Root>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>What is a design system?</Accordion.Trigger>
          <Accordion.Panel>
            A design system is a collection of reusable components, guided by clear standards, that
            can be assembled together to build any number of applications.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Why use a design system?</Accordion.Trigger>
          <Accordion.Panel>
            Design systems help teams build better products faster by providing a shared language
            and reusable components that ensure consistency across all touchpoints.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>How do I get started?</Accordion.Trigger>
          <Accordion.Panel>
            Start by installing the package and importing the components you need. Check out our
            documentation for detailed examples and usage guidelines.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const DefaultExpanded: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root defaultExpanded={['item-1']}>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1 (Initially Expanded)</Accordion.Trigger>
          <Accordion.Panel>
            This section is expanded by default. Click to collapse it.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content for section 2.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Section 3</Accordion.Trigger>
          <Accordion.Panel>Content for section 3.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   Multiple Open
   ---------------------------------------- */

export const AllowMultiple: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root allowMultiple defaultExpanded={['item-1', 'item-2']}>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>
            Multiple sections can be open at the same time with allowMultiple prop.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>This section is also open by default.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Section 3</Accordion.Trigger>
          <Accordion.Panel>Click to expand this section without closing others.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   Variants
   ---------------------------------------- */

export const Bordered: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root variant="bordered">
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Bordered Section 1</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 1.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Bordered Section 2</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 2.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Bordered Section 3</Accordion.Trigger>
          <Accordion.Panel>Content for bordered accordion section 3.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const Separated: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root variant="separated">
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Separated Section 1</Accordion.Trigger>
          <Accordion.Panel>Each section has its own border and spacing.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Separated Section 2</Accordion.Trigger>
          <Accordion.Panel>Good for when sections need visual separation.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Separated Section 3</Accordion.Trigger>
          <Accordion.Panel>Each item is individually styled.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   Icon Position
   ---------------------------------------- */

export const IconLeft: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger iconPosition="left">Icon on the left</Accordion.Trigger>
          <Accordion.Panel>The chevron icon is positioned on the left side.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger iconPosition="left">Another section</Accordion.Trigger>
          <Accordion.Panel>Content goes here.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const HideIcon: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger hideIcon>No icon visible</Accordion.Trigger>
          <Accordion.Panel>This accordion has no chevron icon.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger hideIcon>Another section</Accordion.Trigger>
          <Accordion.Panel>Content goes here.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   Controlled
   ---------------------------------------- */

export const Controlled: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['item-1']);

    return (
      <div className="w-[400px] flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="flex gap-[var(--primitive-spacing-2)]">
          <button
            className="px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-subtle)]"
            onClick={() => setExpanded(['item-1', 'item-2', 'item-3'])}
          >
            Expand All
          </button>
          <button
            className="px-3 py-1.5 text-body-sm bg-[var(--color-surface-muted)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-subtle)]"
            onClick={() => setExpanded([])}
          >
            Collapse All
          </button>
        </div>

        <Accordion.Root expanded={expanded} onChange={setExpanded} allowMultiple>
          <Accordion.Item id="item-1">
            <Accordion.Trigger>Controlled Section 1</Accordion.Trigger>
            <Accordion.Panel>This accordion is controlled externally.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="item-2">
            <Accordion.Trigger>Controlled Section 2</Accordion.Trigger>
            <Accordion.Panel>Use the buttons above to control all sections.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="item-3">
            <Accordion.Trigger>Controlled Section 3</Accordion.Trigger>
            <Accordion.Panel>Or click individual sections to toggle them.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>

        <p className="text-body-sm text-[var(--color-text-muted)]">
          Expanded: {expanded.length > 0 ? expanded.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

/* ----------------------------------------
   Disabled Items
   ---------------------------------------- */

export const DisabledItems: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Enabled Section</Accordion.Trigger>
          <Accordion.Panel>This section can be expanded and collapsed.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2" disabled>
          <Accordion.Trigger>Disabled Section</Accordion.Trigger>
          <Accordion.Panel>This section cannot be interacted with.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-3">
          <Accordion.Trigger>Another Enabled Section</Accordion.Trigger>
          <Accordion.Panel>Content for this section.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   FAQ Example
   ---------------------------------------- */

export const FAQExample: Story = {
  render: () => (
    <div className="w-[500px]">
      <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-4)]">
        Frequently Asked Questions
      </h2>
      <Accordion.Root variant="separated">
        <Accordion.Item id="faq-1">
          <Accordion.Trigger>How do I reset my password?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              Click on the "Forgot Password" link on the login page. Enter your email address and
              we'll send you instructions to reset your password.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-2">
          <Accordion.Trigger>What payment methods do you accept?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and
              bank transfers for enterprise customers.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-3">
          <Accordion.Trigger>How can I contact support?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              You can reach our support team via email at support@example.com or through the live
              chat feature available in your dashboard 24/7.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq-4">
          <Accordion.Trigger>Is there a free trial available?</Accordion.Trigger>
          <Accordion.Panel>
            <p className="text-[var(--color-text-muted)]">
              Yes! We offer a 14-day free trial with full access to all features. No credit card
              required to start.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

/* ----------------------------------------
   Settings Example
   ---------------------------------------- */

export const SettingsExample: Story = {
  render: () => (
    <div className="w-[400px]">
      <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-[var(--primitive-spacing-3)]">
        Settings
      </h3>
      <Accordion.Root variant="bordered" allowMultiple>
        <Accordion.Item id="general">
          <Accordion.Trigger>General</Accordion.Trigger>
          <Accordion.Panel>
            <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Language</span>
                <span className="text-body-md text-[var(--color-text-muted)]">English</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Timezone</span>
                <span className="text-body-md text-[var(--color-text-muted)]">UTC+9</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="notifications">
          <Accordion.Trigger>Notifications</Accordion.Trigger>
          <Accordion.Panel>
            <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Email</span>
                <span className="text-body-md text-[var(--color-state-success)]">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Push</span>
                <span className="text-body-md text-[var(--color-text-muted)]">Disabled</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="security">
          <Accordion.Trigger>Security</Accordion.Trigger>
          <Accordion.Panel>
            <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
              <div className="flex justify-between items-center">
                <span className="text-body-md">Two-factor auth</span>
                <span className="text-body-md text-[var(--color-state-success)]">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md">Session timeout</span>
                <span className="text-body-md text-[var(--color-text-muted)]">30 minutes</span>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};
