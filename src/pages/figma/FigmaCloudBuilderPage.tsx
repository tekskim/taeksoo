import React from 'react';
import {
  Badge,
  Button,
  DetailHeader,
  ListToolbar,
  PageHeader,
  Pagination,
  SearchInput,
  SectionCard,
  StatusIndicator,
  Table,
  Tabs,
  TabList,
  Tab,
  Tooltip,
  VStack,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import {
  IconPlus,
  IconDownload,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconEdit,
} from '@tabler/icons-react';

/* ──────────────────────────────────────────
   Layout Helpers (from FigmaComponentsPage)
   ────────────────────────────────────────── */

const CategoryHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-heading-h3 text-[var(--color-text-default)] pb-3 border-b-2 border-[var(--color-border-strong)] mb-6 mt-20 first:mt-0">
    {children}
  </h2>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-heading-h4 text-[var(--color-text-default)] pb-2 border-b border-[var(--color-border-default)] mb-6 mt-12 first:mt-0">
    {children}
  </h3>
);

const FigmaFrame = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="inline-flex flex-col items-start gap-1" data-figma-name={name} aria-label={name}>
    <span className="text-[10px] font-mono text-[var(--color-text-disabled)] leading-tight whitespace-nowrap select-all">
      {name}
    </span>
    {children}
  </div>
);

/* ──────────────────────────────────────────
   Sample Data
   ────────────────────────────────────────── */

const sampleRows = Array.from({ length: 10 }, (_, i) => ({
  id: `25d21d${String(60 + i).padStart(2, '0')}`,
  name:
    i % 4 === 0
      ? 'neutron-dhcp-agent'
      : i % 4 === 1
        ? 'neutron-metadata-agent'
        : i % 4 === 2
          ? 'ovn-controller-agent'
          : 'ovn-gateway-agent',
  type:
    i % 4 === 0
      ? 'DHCP agent'
      : i % 4 === 1
        ? 'OVN Metadata agent'
        : i % 4 === 2
          ? 'OVN Controller agent'
          : 'OVN Controller Gateway agent',
  host: i % 3 === 0 ? 'bdv2kr1-ctrl01' : `bdv2kr1-gcompute${String((i % 24) + 1).padStart(2, '0')}`,
  availabilityZone: i % 5 === 0 ? '-' : 'nova',
  serviceStatus: i % 4 < 2 ? 'Enabled' : 'Disabled',
  serviceState: i % 4 === 0 || i % 4 === 2 ? 'Up' : 'Down',
  lastUpdated: i % 6 === 0 ? 'a minute ago' : 'a few minutes ago',
}));

type RowType = (typeof sampleRows)[number];

const listColumns: TableColumn<RowType>[] = [
  {
    key: 'serviceStatus',
    label: 'Service status',
    sortable: true,
    width: fixedColumns.status,
    align: 'center',
    render: (value) => {
      const status = String(value) === 'Enabled' ? 'enabled' : 'disabled';
      return (
        <Tooltip content={String(value)}>
          <StatusIndicator status={status as never} layout="icon-only" />
        </Tooltip>
      );
    },
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    minWidth: columnMinWidths.name,
    render: (value, row) => (
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-label-md text-[var(--color-action-primary)] truncate">
          {String(value)}
        </span>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'host', label: 'Host', sortable: true },
  { key: 'availabilityZone', label: 'Availability zone', sortable: true },
  {
    key: 'serviceState',
    label: 'Service state',
    sortable: true,
    render: (value) => {
      const tone = String(value) === 'Up' ? 'green' : 'red';
      return (
        <Badge theme={tone} type="subtle" size="sm">
          {String(value)}
        </Badge>
      );
    },
  },
  { key: 'lastUpdated', label: 'Last updated', sortable: true },
  {
    key: 'actions',
    label: 'Action',
    width: fixedColumns.actions,
    align: 'center',
    render: () => (
      <button
        type="button"
        aria-label="Row actions"
        className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
      >
        <IconDotsCircleHorizontal
          size={16}
          stroke={1.5}
          className="text-[var(--color-text-muted)]"
        />
      </button>
    ),
  },
];

const detailColumns: TableColumn<Record<string, string>>[] = [
  { key: 'network', label: 'Network', sortable: true },
  { key: 'subnet', label: 'Subnet', sortable: true },
  { key: 'cidr', label: 'CIDR', sortable: true },
  { key: 'ip', label: 'IP Address', sortable: true },
];

const detailRows = [
  {
    id: '1',
    network: 'provider-net',
    subnet: 'provider-subnet',
    cidr: '10.0.1.0/24',
    ip: '10.0.1.5',
  },
  {
    id: '2',
    network: 'internal-net',
    subnet: 'internal-subnet',
    cidr: '192.168.0.0/16',
    ip: '192.168.1.10',
  },
  { id: '3', network: 'mgmt-net', subnet: 'mgmt-subnet', cidr: '172.16.0.0/12', ip: '172.16.0.5' },
];

/* ──────────────────────────────────────────
   Page Component
   ────────────────────────────────────────── */

export function FigmaCloudBuilderPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* ━━━ List Page Pattern ━━━ */}
      <section>
        <CategoryHeader>List Page Pattern</CategoryHeader>

        <div className="flex flex-col gap-8">
          {/* PageHeader */}
          <FigmaFrame name="PageHeader">
            <PageHeader
              title="Network agents"
              titleExtra={
                <Badge variant="info" size="sm">
                  115
                </Badge>
              }
              actions={
                <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
                  Create Agent
                </Button>
              }
            />
          </FigmaFrame>

          {/* PageHeader (no actions) */}
          <FigmaFrame name="PageHeader/no-actions">
            <PageHeader title="Network agents" />
          </FigmaFrame>

          {/* Tabs */}
          <FigmaFrame name="Tabs">
            <Tabs value="agents" onChange={() => {}} variant="underline" size="sm">
              <TabList>
                <Tab value="agents">Agents</Tab>
                <Tab value="services">Services</Tab>
                <Tab value="policies">Policies</Tab>
              </TabList>
            </Tabs>
          </FigmaFrame>

          {/* ListToolbar */}
          <FigmaFrame name="ListToolbar">
            <div className="w-[900px]">
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <div className="w-[var(--search-input-width)]">
                      <SearchInput
                        placeholder="Search neutron agents by attributes"
                        value=""
                        onChange={() => {}}
                        size="sm"
                        fullWidth
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </ListToolbar.Actions>
                }
              />
            </div>
          </FigmaFrame>

          {/* ListToolbar with bulk actions */}
          <FigmaFrame name="ListToolbar/with-bulk">
            <div className="w-[900px]">
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <div className="w-[var(--search-input-width)]">
                      <SearchInput
                        placeholder="Search by attributes"
                        value=""
                        onChange={() => {}}
                        size="sm"
                        fullWidth
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </ListToolbar.Actions>
                }
                bulkActions={
                  <ListToolbar.Actions>
                    <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
              />
            </div>
          </FigmaFrame>

          {/* Pagination */}
          <FigmaFrame name="Pagination">
            <Pagination
              currentPage={1}
              totalPages={12}
              onPageChange={() => {}}
              showSettings
              onSettingsClick={() => {}}
              totalItems={115}
              selectedCount={0}
            />
          </FigmaFrame>

          {/* Table */}
          <FigmaFrame name="Table">
            <div className="w-[1100px]">
              <Table<RowType>
                columns={listColumns}
                data={sampleRows.slice(0, 5)}
                rowKey="id"
                emptyMessage="No data found"
              />
            </div>
          </FigmaFrame>

          {/* Table (selectable) */}
          <FigmaFrame name="Table/selectable">
            <div className="w-[1100px]">
              <Table<RowType>
                columns={listColumns}
                data={sampleRows.slice(0, 5)}
                rowKey="id"
                selectable
                selectedKeys={['25d21d61']}
                onSelectionChange={() => {}}
                emptyMessage="No data found"
              />
            </div>
          </FigmaFrame>

          {/* Full List Page Assembled */}
          <SectionTitle>Full List Page (assembled)</SectionTitle>
          <FigmaFrame name="ListPage/full">
            <div className="w-[1100px] bg-[var(--color-surface-default)] p-8">
              <VStack gap={3} className="w-full">
                <PageHeader title="Network agents" />
                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <div className="w-[var(--search-input-width)]">
                        <SearchInput
                          placeholder="Search neutron agents by attributes"
                          value=""
                          onChange={() => {}}
                          size="sm"
                          fullWidth
                        />
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<IconDownload size={12} />}
                        aria-label="Download"
                      />
                    </ListToolbar.Actions>
                  }
                />
                <Pagination
                  currentPage={1}
                  totalPages={12}
                  onPageChange={() => {}}
                  totalItems={115}
                />
                <Table<RowType>
                  columns={listColumns}
                  data={sampleRows.slice(0, 8)}
                  rowKey="id"
                  emptyMessage="No data found"
                />
              </VStack>
            </div>
          </FigmaFrame>
        </div>
      </section>

      {/* ━━━ Detail Page Pattern ━━━ */}
      <section>
        <CategoryHeader>Detail Page Pattern</CategoryHeader>

        <div className="flex flex-col gap-8">
          {/* DetailHeader */}
          <FigmaFrame name="DetailHeader">
            <div className="w-[1100px]">
              <DetailHeader>
                <DetailHeader.Title>neutron-dhcp-agent</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                    More actions
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                  <DetailHeader.InfoCard label="ID" value="25d21d60" copyable />
                  <DetailHeader.InfoCard label="Host" value="bdv2kr1-ctrl01" />
                  <DetailHeader.InfoCard label="Type" value="DHCP agent" />
                  <DetailHeader.InfoCard label="AZ" value="nova" />
                  <DetailHeader.InfoCard label="Last updated" value="2026-03-13 09:30" />
                </DetailHeader.InfoGrid>
              </DetailHeader>
            </div>
          </FigmaFrame>

          {/* SectionCard */}
          <FigmaFrame name="SectionCard">
            <div className="w-[1100px]">
              <SectionCard>
                <SectionCard.Header
                  title="Basic information"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value="neutron-dhcp-agent" />
                  <SectionCard.DataRow label="Type" value="DHCP agent" />
                  <SectionCard.DataRow label="Host" value="bdv2kr1-ctrl01" />
                  <SectionCard.DataRow label="Availability zone" value="nova" />
                  <SectionCard.DataRow label="Service state">
                    <Badge theme="green" type="subtle" size="sm">
                      Up
                    </Badge>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </FigmaFrame>

          {/* SectionCard with Table */}
          <FigmaFrame name="SectionCard/with-table">
            <div className="w-[1100px]">
              <SectionCard>
                <SectionCard.Header title="Networks" />
                <SectionCard.Content>
                  <Table<Record<string, string>>
                    columns={detailColumns}
                    data={detailRows}
                    rowKey="id"
                    emptyMessage="No networks"
                  />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </FigmaFrame>

          {/* Full Detail Page Assembled */}
          <SectionTitle>Full Detail Page (assembled)</SectionTitle>
          <FigmaFrame name="DetailPage/full">
            <div className="w-[1100px] bg-[var(--color-surface-default)] p-8">
              <VStack gap={4}>
                <DetailHeader>
                  <DetailHeader.Title>neutron-dhcp-agent</DetailHeader.Title>
                  <DetailHeader.Actions>
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                      More actions
                    </Button>
                  </DetailHeader.Actions>
                  <DetailHeader.InfoGrid>
                    <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                    <DetailHeader.InfoCard label="ID" value="25d21d60" copyable />
                    <DetailHeader.InfoCard label="Host" value="bdv2kr1-ctrl01" />
                    <DetailHeader.InfoCard label="Type" value="DHCP agent" />
                    <DetailHeader.InfoCard label="AZ" value="nova" />
                    <DetailHeader.InfoCard label="Last updated" value="2026-03-13 09:30" />
                  </DetailHeader.InfoGrid>
                </DetailHeader>

                <Tabs value="details" onChange={() => {}} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="networks">Networks</Tab>
                  </TabList>
                </Tabs>

                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Name" value="neutron-dhcp-agent" />
                    <SectionCard.DataRow label="Type" value="DHCP agent" />
                    <SectionCard.DataRow label="Host" value="bdv2kr1-ctrl01" />
                    <SectionCard.DataRow label="Availability zone" value="nova" />
                    <SectionCard.DataRow label="Service state">
                      <Badge theme="green" type="subtle" size="sm">
                        Up
                      </Badge>
                    </SectionCard.DataRow>
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Configuration" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Admin state" value="Up" />
                    <SectionCard.DataRow label="Heartbeat timestamp" value="2026-03-13 09:30:12" />
                    <SectionCard.DataRow label="Description" value="DHCP agent on ctrl01" />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </div>
          </FigmaFrame>
        </div>
      </section>
    </div>
  );
}

export default FigmaCloudBuilderPage;
