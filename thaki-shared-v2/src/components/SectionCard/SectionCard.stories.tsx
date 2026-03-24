import type { Meta, StoryObj } from '@storybook/react';
import SectionCard, { SectionCardText } from './SectionCard';
import { Button } from '../Button';
import Layout from '../Layout';
import { StatusIndicator } from '../StatusIndicator';
import { Badge } from '../Badge';

const meta: Meta<typeof SectionCard> = {
  title: 'Layout/Section Card',
  component: SectionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## SectionCard

A compound component for displaying structured key-value information in detail pages.

### Two Usage Modes

**1. Compound API (recommended for new code):**
\`\`\`tsx
<SectionCard>
  <SectionCard.Header title="Basic Information" actions={<Button size="sm">Edit</Button>} />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="my-instance" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator variant="active" layout="iconOnly" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>
\`\`\`

**2. Flat fields API (backward compatible):**
\`\`\`tsx
<SectionCard title="Basic Information" fields={[
  { label: 'Name', value: 'my-instance' },
  { label: 'Status', type: 'component', value: '', component: <StatusIndicator /> },
]} />
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

export const CompoundAPI: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Basic Information" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="worker-node-01" />
        <SectionCard.DataRow label="Instance ID" value="vm-001" />
        <SectionCard.DataRow label="Availability zone" value="nova" />
        <SectionCard.DataRow label="Description" value="Production worker node" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const WithActions: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header
        title="Basic Information"
        actions={
          <Button variant="secondary" appearance="outline" size="sm">
            Edit
          </Button>
        }
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="worker-node-01" />
        <SectionCard.DataRow label="Status">
          <StatusIndicator variant="active" label="Active" layout="leftIcon" />
        </SectionCard.DataRow>
        <SectionCard.DataRow label="Created at" value="Sep 12, 2025" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Network" />
      <SectionCard.Content>
        <SectionCard.DataRow
          label="Network"
          value="net-01"
          isLink
          linkHref="/compute/networks/net-01"
        />
        <SectionCard.DataRow
          label="Subnet"
          value="subnet-01"
          isLink
          linkHref="/compute/subnets/subnet-01"
        />
        <SectionCard.DataRow label="Fixed IP" value="10.0.0.5" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const ActiveState: Story = {
  render: () => (
    <SectionCard isActive>
      <SectionCard.Header
        title="Step 1: Basic Information"
        statusIcon={
          <Badge theme="blu" size="sm">
            1
          </Badge>
        }
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="Instance name" value="my-server" />
        <SectionCard.DataRow label="Availability zone" value="nova" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header
        title="Authentication"
        description="SSH key pair and security settings"
        showDivider={false}
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="Key pair" value="default-key" />
        <SectionCard.DataRow label="Security groups" value="default, web-servers" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const NoDividers: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Configuration" />
      <SectionCard.Content showDividers={false} gap={2}>
        <SectionCard.DataRow label="vCPU" value="4" />
        <SectionCard.DataRow label="RAM" value="8 GiB" />
        <SectionCard.DataRow label="Disk" value="100 GiB" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Labels" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Environment">
          <Badge theme="gre" size="sm">
            production
          </Badge>
        </SectionCard.DataRow>
        <SectionCard.DataRow label="Team">
          <Badge theme="blu" size="sm">
            platform
          </Badge>
        </SectionCard.DataRow>
        <SectionCard.DataRow label="Multi-line info">
          <Layout.VStack gap="xs">
            <SectionCardText>Primary value</SectionCardText>
            <SectionCardText color="secondary">Secondary detail</SectionCardText>
          </Layout.VStack>
        </SectionCard.DataRow>
      </SectionCard.Content>
    </SectionCard>
  ),
};

export const FlatFieldsAPI: Story = {
  name: 'Flat Fields API (backward compat)',
  render: () => (
    <SectionCard
      title="Basic Information"
      fields={[
        { label: 'Name', value: 'worker-node-01' },
        { label: 'Instance ID', value: 'vm-001' },
        { label: 'Status', value: 'Active' },
        { label: 'Created at', value: 'Sep 12, 2025' },
      ]}
      actions={
        <Button variant="secondary" appearance="outline" size="sm">
          Edit
        </Button>
      }
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <SectionCard
      title="Basic Information"
      fields={[
        { label: 'Name', value: '' },
        { label: 'Status', value: '' },
        { label: 'Created at', value: '' },
      ]}
      isLoading
    />
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <SectionCard>
        <SectionCard.Header
          title="Basic Information"
          actions={
            <Button variant="secondary" appearance="outline" size="sm">
              Edit
            </Button>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Name" value="db-server-01" />
          <SectionCard.DataRow label="Status">
            <StatusIndicator variant="active" label="Active" layout="leftIcon" />
          </SectionCard.DataRow>
          <SectionCard.DataRow label="Availability zone" value="nova" />
        </SectionCard.Content>
      </SectionCard>

      <SectionCard>
        <SectionCard.Header title="Flavor" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Flavor name" value="Large" isLink linkHref="#" />
          <SectionCard.DataRow label="Spec" value="vCPU: 8 / RAM: 16 GiB / Disk: 200 GiB" />
        </SectionCard.Content>
      </SectionCard>

      <SectionCard>
        <SectionCard.Header title="Source" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Image" value="ubuntu-22.04-server" isLink linkHref="#" />
        </SectionCard.Content>
      </SectionCard>
    </Layout.VStack>
  ),
};
