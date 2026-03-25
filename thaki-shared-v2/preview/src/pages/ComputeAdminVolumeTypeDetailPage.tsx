import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import { ContextMenu } from '@shared/components/ContextMenu';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconExternalLink, IconTrash } from '@tabler/icons-react';

interface VolumeTypeDetail {
  id: string;
  name: string;
  description: string;
  encrypted: boolean;
  public: boolean;
  createdAt: string;
}

interface ExtraSpecRow extends Record<string, unknown> {
  key: string;
  value: string;
}

interface QosSpecLinkRow extends Record<string, unknown> {
  id: string;
  name: string;
  consumer: string;
}

const mockVolumeTypes: Record<string, VolumeTypeDetail> = {
  'vtype-001': {
    id: 'a1b2c3d4-1111-2222-3333-444455556666',
    name: 'ssd-high-iops',
    description: 'NVMe-backed SSD with QoS guarantees for production databases.',
    encrypted: true,
    public: true,
    createdAt: 'Jan 8, 2026 11:02:44',
  },
  'vtype-002': {
    id: 'b2c3d4e5-2222-3333-4444-555566667777',
    name: 'standard-hdd',
    description: 'Cost-optimized magnetic storage for archival workloads.',
    encrypted: false,
    public: true,
    createdAt: 'Feb 2, 2026 09:18:33',
  },
};

const defaultVolumeType: VolumeTypeDetail = {
  id: 'unknown',
  name: 'Unknown volume type',
  description: '-',
  encrypted: false,
  public: false,
  createdAt: '-',
};

const extraSpecsByType: Record<string, ExtraSpecRow[]> = {
  'vtype-001': [
    { key: 'volume_backend_name', value: 'ssd_nvme_ceph' },
    { key: 'replication', value: '3' },
    { key: 'driver_handles_share_servers', value: 'False' },
    { key: 'thin_provisioning_support', value: 'True' },
  ],
  'vtype-002': [
    { key: 'volume_backend_name', value: 'hdd_sata_pool' },
    { key: 'replication', value: '2' },
  ],
};

const qosByType: Record<string, QosSpecLinkRow[]> = {
  'vtype-001': [
    { id: 'qos-001', name: 'db-tier-gold', consumer: 'front-end' },
    { id: 'qos-002', name: 'burst-allow', consumer: 'back-end' },
  ],
  'vtype-002': [{ id: 'qos-003', name: 'archive-default', consumer: 'front-end' }],
};

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1';

export function ComputeAdminVolumeTypeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const vt = useMemo(
    () => (id && mockVolumeTypes[id] ? mockVolumeTypes[id] : defaultVolumeType),
    [id]
  );

  const dataKey = id && mockVolumeTypes[id] ? id : 'vtype-001';
  const extraSpecs = extraSpecsByType[dataKey] ?? [];
  const qosRows = qosByType[dataKey] ?? [];

  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const specColumns: TableColumn[] = [
    { key: 'key', header: 'Key', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
  ];

  const qosColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'consumer', header: 'Consumer', sortable: true },
  ];

  const encryptionBadge = vt.encrypted ? (
    <Badge theme="gre" size="sm" type="subtle">
      Encrypted
    </Badge>
  ) : (
    <Badge theme="gry" size="sm" type="subtle">
      Not encrypted
    </Badge>
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: vt.name },
    { label: 'ID', value: vt.id, showCopyButton: true, copyText: vt.id },
    { label: 'Description', value: vt.description },
    { label: 'Encryption', value: encryptionBadge },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={vt.name}
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
              <ContextMenu.Item action={() => {}}>Set as default</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Manage access</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>View volumes using this type</ContextMenu.Item>
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
                  <SectionCard.DataRow label="Name" value={vt.name} />
                  <SectionCard.DataRow label="ID" value={vt.id} />
                  <SectionCard.DataRow label="Description" value={vt.description} />
                  <SectionCard.DataRow label="Public" value={vt.public ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Created at" value={vt.createdAt} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Extra specs" />
                <SectionCard.Content className="p-0">
                  <Table<ExtraSpecRow>
                    columns={specColumns}
                    rows={extraSpecs}
                    sort={sort}
                    order={order}
                    onSortChange={(k, o) => {
                      setSort(k ?? '');
                      setOrder(o);
                    }}
                  >
                    {extraSpecs.map((row) => (
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
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
          <Tab id="qos" label="QoS specs">
            <div className="flex flex-col gap-4 pt-4">
              <Table<QosSpecLinkRow>
                columns={qosColumns}
                rows={qosRows}
                sort={sort}
                order={order}
                onSortChange={(k, o) => {
                  setSort(k ?? '');
                  setOrder(o);
                }}
              >
                {qosRows.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={qosColumns[0]}>
                      <Link to={`/compute-admin/qos-specs/${row.id}`} className={linkClass}>
                        {row.name}
                        <IconExternalLink size={12} className="text-primary shrink-0" />
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={qosColumns[1]}>
                      {row.consumer}
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
