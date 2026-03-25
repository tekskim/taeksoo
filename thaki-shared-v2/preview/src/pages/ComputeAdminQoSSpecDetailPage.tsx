import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { ContextMenu } from '@shared/components/ContextMenu';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconTrash } from '@tabler/icons-react';

interface QoSSpecDetail {
  id: string;
  name: string;
  consumer: 'front-end' | 'back-end' | 'both';
  createdAt: string;
}

interface SpecKvRow extends Record<string, unknown> {
  key: string;
  value: string;
}

const mockQos: Record<string, QoSSpecDetail> = {
  'qos-001': {
    id: 'qos-001',
    name: 'db-tier-gold',
    consumer: 'front-end',
    createdAt: 'Mar 1, 2026 14:22:09',
  },
  'qos-002': {
    id: 'qos-002',
    name: 'burst-allow',
    consumer: 'back-end',
    createdAt: 'Mar 3, 2026 09:05:41',
  },
  'qos-003': {
    id: 'qos-003',
    name: 'archive-default',
    consumer: 'both',
    createdAt: 'Mar 10, 2026 16:48:12',
  },
};

const defaultQos: QoSSpecDetail = {
  id: 'unknown',
  name: 'Unknown QoS spec',
  consumer: 'front-end',
  createdAt: '-',
};

const specsById: Record<string, SpecKvRow[]> = {
  'qos-001': [
    { key: 'read_iops_sec', value: '5000' },
    { key: 'write_iops_sec', value: '5000' },
    { key: 'read_bytes_sec', value: '209715200' },
    { key: 'write_bytes_sec', value: '209715200' },
    { key: 'total_bytes_sec', value: '419430400' },
  ],
  'qos-002': [
    { key: 'read_iops_sec', value: '20000' },
    { key: 'write_iops_sec', value: '20000' },
    { key: 'burst_read_iops_sec', value: '40000' },
    { key: 'burst_write_iops_sec', value: '40000' },
  ],
  'qos-003': [
    { key: 'read_iops_sec', value: '500' },
    { key: 'write_iops_sec', value: '500' },
    { key: 'read_bytes_sec', value: '52428800' },
    { key: 'write_bytes_sec', value: '52428800' },
  ],
};

export function ComputeAdminQoSSpecDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const qos = useMemo(() => (id && mockQos[id] ? mockQos[id] : defaultQos), [id]);
  const dataKey = id && mockQos[id] ? id : 'qos-001';
  const specRows = specsById[dataKey] ?? [];

  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const specColumns: TableColumn[] = [
    { key: 'key', header: 'Key', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
  ];

  const consumerLabel =
    qos.consumer === 'both'
      ? 'Front-end & back-end'
      : qos.consumer === 'back-end'
        ? 'Back-end'
        : 'Front-end';

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: qos.name },
    { label: 'ID', value: qos.id, showCopyButton: true, copyText: qos.id },
    { label: 'Consumer', value: consumerLabel },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={qos.name}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => {}}>Disassociate from volume types</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Clone spec</ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Name" value={qos.name} />
                  <SectionCard.DataRow label="ID" value={qos.id} />
                  <SectionCard.DataRow label="Consumer" value={consumerLabel} />
                  <SectionCard.DataRow label="Created at" value={qos.createdAt} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
          <Tab id="specs" label="Specs">
            <div className="flex flex-col gap-4 pt-4">
              <Table<SpecKvRow>
                columns={specColumns}
                rows={specRows}
                sort={sort}
                order={order}
                onSortChange={(k, o) => {
                  setSort(k ?? '');
                  setOrder(o);
                }}
              >
                {specRows.map((row) => (
                  <Table.Tr key={row.key} rowData={row}>
                    <Table.Td rowData={row} column={specColumns[0]}>
                      {row.key}
                    </Table.Td>
                    <Table.Td rowData={row} column={specColumns[1]}>
                      {row.value}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
