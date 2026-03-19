import type { Meta, StoryObj } from '@storybook/react';
import Layout from './Layout';
import { Input } from '../Input';
import { GridIcon, CheckCircleIcon } from '../Icon';

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '레이아웃 구성을 위한 핵심 컴포넌트들입니다. Container, Stack, Grid 등을 조합하여 유연한 레이아웃을 구성하세요.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories for each Layout component ---

export const Overview: Story = {
  render: () => (
    <Layout.Container maxWidth="lg" style={{ padding: '2rem' }}>
      <Layout.VStack gap="lg">
        <Layout.Block
          title="Layout System Overview"
          icon={<GridIcon variant="brand" size="md" />}
          padding="lg"
        >
          <p>
            This layout system provides a set of flexible and composable
            components to build modern and consistent user interfaces.
          </p>
        </Layout.Block>
        <Layout.HStack gap="lg" align="start">
          <Layout.Block title="Container" flex={1}>
            <p>
              <code>Layout.Container</code> sets the max-width and centers the
              content. It is the outermost shell for your page or a large
              section.
            </p>
          </Layout.Block>
          <Layout.Block title="Block" flex={1}>
            <p>
              <code>Layout.Block</code> is used to group related content. It can
              have a title, subtitle, and different visual variants.
            </p>
          </Layout.Block>
        </Layout.HStack>
        <Layout.Block title="Stacks (HStack/VStack)">
          <Layout.VStack gap="md">
            <p>
              <code>Layout.HStack</code> and <code>Layout.VStack</code> are used
              for arranging items in a horizontal or vertical line with
              consistent spacing.
            </p>
            <Layout.HStack gap="md" align="center">
              <Layout.Block padding="md">Item 1</Layout.Block>
              <Layout.Block padding="md">Item 2</Layout.Block>
              <Layout.Block padding="md">Item 3</Layout.Block>
            </Layout.HStack>
          </Layout.VStack>
        </Layout.Block>
        <Layout.Block title="Grid">
          <p>
            <code>Layout.Grid.Container</code> and <code>Layout.Grid.Item</code>{' '}
            create a grid layout. The container sets the number of columns, and
            items can span multiple columns.
          </p>
          <Layout.Grid.Container
            columns={3}
            gap="md"
            style={{ marginTop: '1rem' }}
          >
            <Layout.Grid.Item>
              <Layout.Block padding="md">Column 1</Layout.Block>
            </Layout.Grid.Item>
            <Layout.Grid.Item>
              <Layout.Block padding="md">Column 2</Layout.Block>
            </Layout.Grid.Item>
            <Layout.Grid.Item>
              <Layout.Block padding="md">Column 3</Layout.Block>
            </Layout.Grid.Item>
            <Layout.Grid.Item colSpan={2}>
              <Layout.Block padding="md">Spans 2 columns</Layout.Block>
            </Layout.Grid.Item>
            <Layout.Grid.Item>
              <Layout.Block padding="md">Column 3</Layout.Block>
            </Layout.Grid.Item>
          </Layout.Grid.Container>
        </Layout.Block>
        <Layout.Block title="Divider">
          <p>
            <code>Layout.Divider</code> visually separates content, either
            horizontally or vertically.
          </p>
          <Layout.VStack gap="md" style={{ marginTop: '1rem' }}>
            <div>Content above</div>
            <Layout.Divider />
            <div>Content below</div>
          </Layout.VStack>
        </Layout.Block>
      </Layout.VStack>
    </Layout.Container>
  ),
};

export const Container: Story = {
  name: 'Container',
  args: {
    maxWidth: 'md',
    children: (
      <Layout.Block padding="lg" style={{ minHeight: '200px' }}>
        This content is inside a container.
      </Layout.Block>
    ),
  },
  render: args => (
    <div
      style={{
        background: 'var(--semantic-color-surfaceMuted)',
        padding: '2rem',
      }}
    >
      <Layout.Container {...args} />
    </div>
  ),
};

export const Block: Story = {
  name: 'Block',
  args: {
    title: 'Section Title',
    subtitle: 'A little more information about this section.',
    icon: <CheckCircleIcon variant="success" size="md" />,
    variant: 'default',
    padding: 'lg',
    borderRadius: 'md',
    children: 'This is the main content of the block.',
  },
  render: args => <Layout.Block {...args} />,
};

export const HStack: Story = {
  name: 'HStack',
  args: {
    gap: 'lg',
    align: 'center',
    justify: 'between',
    children: (
      <>
        <Layout.Block padding="md">Item 1</Layout.Block>
        <Layout.Block padding="md">Item 2</Layout.Block>
        <Layout.Block padding="md">Item 3</Layout.Block>
      </>
    ),
  },
  render: args => (
    <Layout.HStack
      {...args}
      style={{
        border: '1px dashed var(--semantic-color-border)',
        padding: '1rem',
      }}
    />
  ),
};

export const VStack: Story = {
  name: 'VStack',
  args: {
    gap: 'md',
    align: 'stretch',
    children: (
      <>
        <Input
          name="sample"
          placeholder="Full width item"
          onChange={() => {}}
        />
        <Layout.Block padding="md">Item 2</Layout.Block>
        <Layout.Block padding="md">Item 3</Layout.Block>
      </>
    ),
  },
  render: args => (
    <Layout.VStack
      {...args}
      style={{
        border: '1px dashed var(--semantic-color-border)',
        padding: '1rem',
      }}
    />
  ),
};

export const Grid: Story = {
  name: 'Grid',
  args: {
    columns: 12,
    gap: 'md',
    item1Span: 4,
    item2Span: 8,
  },
  argTypes: {
    item1Span: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    item2Span: { control: { type: 'range', min: 1, max: 12, step: 1 } },
  },
  render: ({ columns, gap, item1Span, item2Span, ...args }) => (
    <Layout.Grid.Container {...args} columns={columns} gap={gap}>
      <Layout.Grid.Item colSpan={item1Span}>
        <Layout.Block
          padding="md"
          style={{ background: 'var(--semantic-color-infoLight)' }}
        >
          Item 1 (span={item1Span})
        </Layout.Block>
      </Layout.Grid.Item>
      <Layout.Grid.Item colSpan={item2Span}>
        <Layout.Block
          padding="md"
          style={{ background: 'var(--semantic-color-warningLight)' }}
        >
          Item 2 (span={item2Span})
        </Layout.Block>
      </Layout.Grid.Item>
      <Layout.Grid.Item colSpan={3}>
        <Layout.Block padding="md">Col 3</Layout.Block>
      </Layout.Grid.Item>
      <Layout.Grid.Item colSpan={3}>
        <Layout.Block padding="md">Col 3</Layout.Block>
      </Layout.Grid.Item>
      <Layout.Grid.Item colSpan={3}>
        <Layout.Block padding="md">Col 3</Layout.Block>
      </Layout.Grid.Item>
      <Layout.Grid.Item colSpan={3}>
        <Layout.Block padding="md">Col 3</Layout.Block>
      </Layout.Grid.Item>
    </Layout.Grid.Container>
  ),
};

export const Divider: Story = {
  name: 'Divider',
  args: {
    direction: 'horizontal',
    spacing: 'lg',
  },
  render: args => (
    <Layout.Block padding="lg">
      <Layout.VStack gap="md">
        <span>Top Content</span>
        <Layout.Divider {...args} />
        <span>Bottom Content</span>
      </Layout.VStack>
      <Layout.HStack gap="md" style={{ marginTop: '2rem', height: '40px' }}>
        <span>Left Content</span>
        <Layout.Divider direction="vertical" />
        <span>Right Content</span>
      </Layout.HStack>
    </Layout.Block>
  ),
};
