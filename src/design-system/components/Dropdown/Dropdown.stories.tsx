import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown.Root> = {
  title: 'Components/Dropdown',
  component: Dropdown.Root,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown.Root>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Select placeholder="Select an option" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
        <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
        <Dropdown.Option value="grape">Grape</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Dropdown.Root defaultValue="banana">
      <Dropdown.Select placeholder="Select a fruit" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
        <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('cherry');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Dropdown.Root value={value} onChange={setValue}>
          <Dropdown.Select placeholder="Select a fruit" width="md">
            <Dropdown.Option value="apple">Apple</Dropdown.Option>
            <Dropdown.Option value="banana">Banana</Dropdown.Option>
            <Dropdown.Option value="cherry">Cherry</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Select placeholder="Select an option" width="md">
        <Dropdown.Option value="available">Available</Dropdown.Option>
        <Dropdown.Option value="disabled1" disabled>
          Disabled Option 1
        </Dropdown.Option>
        <Dropdown.Option value="another">Another Option</Dropdown.Option>
        <Dropdown.Option value="disabled2" disabled>
          Disabled Option 2
        </Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Dropdown.Root disabled defaultValue="apple">
      <Dropdown.Select placeholder="Select a fruit" width="md">
        <Dropdown.Option value="apple">Apple</Dropdown.Option>
        <Dropdown.Option value="banana">Banana</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

/* ----------------------------------------
   Size Variants
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Small
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" size="sm" width="sm">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Medium (default)
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" size="md" width="md">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
    </div>
  ),
};

export const Widths: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Small (160px)
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="sm">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Medium (240px)
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="md">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Large (320px)
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" width="lg">
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
      <div className="w-full max-w-md">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Full Width
        </h3>
        <Dropdown.Root>
          <Dropdown.Select placeholder="Select" fullWidth>
            <Dropdown.Option value="a">Option A</Dropdown.Option>
            <Dropdown.Option value="b">Option B</Dropdown.Option>
          </Dropdown.Select>
        </Dropdown.Root>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   With Groups and Dividers
   ---------------------------------------- */

export const WithGroups: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Select placeholder="Select a region" width="lg">
        <Dropdown.Group label="Asia Pacific">
          <Dropdown.Option value="ap-northeast-1">Tokyo (ap-northeast-1)</Dropdown.Option>
          <Dropdown.Option value="ap-northeast-2">Seoul (ap-northeast-2)</Dropdown.Option>
          <Dropdown.Option value="ap-southeast-1">Singapore (ap-southeast-1)</Dropdown.Option>
        </Dropdown.Group>
        <Dropdown.Divider />
        <Dropdown.Group label="United States">
          <Dropdown.Option value="us-east-1">N. Virginia (us-east-1)</Dropdown.Option>
          <Dropdown.Option value="us-west-2">Oregon (us-west-2)</Dropdown.Option>
        </Dropdown.Group>
        <Dropdown.Divider />
        <Dropdown.Group label="Europe">
          <Dropdown.Option value="eu-west-1">Ireland (eu-west-1)</Dropdown.Option>
          <Dropdown.Option value="eu-central-1">Frankfurt (eu-central-1)</Dropdown.Option>
        </Dropdown.Group>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

export const WithDividers: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Select placeholder="Select action" width="md">
        <Dropdown.Option value="edit">Edit</Dropdown.Option>
        <Dropdown.Option value="duplicate">Duplicate</Dropdown.Option>
        <Dropdown.Divider />
        <Dropdown.Option value="archive">Archive</Dropdown.Option>
        <Dropdown.Option value="move">Move</Dropdown.Option>
        <Dropdown.Divider />
        <Dropdown.Option value="delete">Delete</Dropdown.Option>
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

/* ----------------------------------------
   Error State
   ---------------------------------------- */

export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
      <Dropdown.Root>
        <Dropdown.Select placeholder="Select a value" width="md" error>
          <Dropdown.Option value="a">Option A</Dropdown.Option>
          <Dropdown.Option value="b">Option B</Dropdown.Option>
        </Dropdown.Select>
      </Dropdown.Root>
      <p className="text-body-sm text-[var(--color-state-danger)]">This field is required</p>
    </div>
  ),
};

/* ----------------------------------------
   Long List
   ---------------------------------------- */

export const LongList: Story = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Select placeholder="Select a country" width="lg">
        {[
          'United States',
          'Canada',
          'United Kingdom',
          'Germany',
          'France',
          'Italy',
          'Spain',
          'Japan',
          'South Korea',
          'China',
          'Australia',
          'Brazil',
          'India',
          'Mexico',
          'Russia',
        ].map((country) => (
          <Dropdown.Option key={country} value={country.toLowerCase().replace(' ', '-')}>
            {country}
          </Dropdown.Option>
        ))}
      </Dropdown.Select>
    </Dropdown.Root>
  ),
};

/* ----------------------------------------
   thaki-ui Compatibility Example
   ---------------------------------------- */

export const ThakiUIStyle: Story = {
  name: 'thaki-ui Style (Compound Pattern)',
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <h3 className="text-heading-h6 text-[var(--color-text-default)]">
          thaki-ui Compound Component Pattern
        </h3>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          This follows the thaki-ui Dropdown pattern with Dropdown.Root, Dropdown.Select, and
          Dropdown.Option components.
        </p>

        <Dropdown.Root value={value} onChange={setValue}>
          <Dropdown.Select placeholder="Select instance type" width="lg">
            <Dropdown.Group label="General Purpose">
              <Dropdown.Option value="m5.large">m5.large (2 vCPU, 8 GB)</Dropdown.Option>
              <Dropdown.Option value="m5.xlarge">m5.xlarge (4 vCPU, 16 GB)</Dropdown.Option>
              <Dropdown.Option value="m5.2xlarge">m5.2xlarge (8 vCPU, 32 GB)</Dropdown.Option>
            </Dropdown.Group>
            <Dropdown.Divider />
            <Dropdown.Group label="Compute Optimized">
              <Dropdown.Option value="c5.large">c5.large (2 vCPU, 4 GB)</Dropdown.Option>
              <Dropdown.Option value="c5.xlarge">c5.xlarge (4 vCPU, 8 GB)</Dropdown.Option>
            </Dropdown.Group>
            <Dropdown.Divider />
            <Dropdown.Group label="Memory Optimized">
              <Dropdown.Option value="r5.large">r5.large (2 vCPU, 16 GB)</Dropdown.Option>
              <Dropdown.Option value="r5.xlarge">r5.xlarge (4 vCPU, 32 GB)</Dropdown.Option>
            </Dropdown.Group>
          </Dropdown.Select>
        </Dropdown.Root>

        {value && (
          <p className="text-body-sm text-[var(--color-text-muted)]">
            Selected: <code className="text-body-sm">{value}</code>
          </p>
        )}
      </div>
    );
  },
};
