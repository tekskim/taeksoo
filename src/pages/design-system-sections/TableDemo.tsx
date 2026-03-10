import { useState } from 'react';
import {
  Table,
  StatusIndicator,
  Tooltip,
  VStack,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Label } from './HelperComponents';
import {
  IconLock,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconRouter,
  IconCube,
  IconTerminal2,
} from '@tabler/icons-react';
import { IconAction } from '@/design-system/components/Icons';

interface InstanceData {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Building';
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  image: string;
  imageId: string;
  flavor: string;
  flavorId: string;
  attachedTo: string | null;
  attachedToId: string | null;
  attachedType: 'instance' | 'router' | null;
  fingerprint: string;
  vCPU: number;
  ram: string;
  disk: string;
}

interface KeyPairData {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

const sampleTableData: InstanceData[] = [
  {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'Running',
    locked: true,
    fixedIp: '10.20.30.40',
    floatingIp: '20.30.40.50',
    image: 'CentOS 7',
    imageId: 'img-001',
    flavor: 'Medium',
    flavorId: 'flv-001',
    attachedTo: 'web-server-1',
    attachedToId: 'inst-001',
    attachedType: 'instance',
    fingerprint: '02:c1:ff:54:df:d9:69:0e',
    vCPU: 4,
    ram: '8GB',
    disk: '100GB',
  },
  {
    id: 'vm-002',
    name: 'web-server-01',
    status: 'Running',
    locked: false,
    fixedIp: '10.20.30.41',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'Large',
    flavorId: 'flv-002',
    attachedTo: 'main-router',
    attachedToId: 'router-001',
    attachedType: 'router',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18',
    vCPU: 8,
    ram: '16GB',
    disk: '200GB',
  },
  {
    id: 'vm-003',
    name: 'db-master',
    status: 'Running',
    locked: true,
    fixedIp: '10.20.30.42',
    floatingIp: '20.30.40.52',
    image: 'Rocky Linux 9',
    imageId: 'img-003',
    flavor: 'XLarge',
    flavorId: 'flv-003',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    fingerprint: '11:22:33:44:55:66:77:88',
    vCPU: 16,
    ram: '32GB',
    disk: '500GB',
  },
  {
    id: 'vm-004',
    name: 'api-gateway',
    status: 'Stopped',
    locked: false,
    fixedIp: '10.20.30.43',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'Small',
    flavorId: 'flv-004',
    attachedTo: 'log-server',
    attachedToId: 'inst-003',
    attachedType: 'instance',
    fingerprint: 'ff:ee:dd:cc:bb:aa:99:88',
    vCPU: 2,
    ram: '4GB',
    disk: '50GB',
  },
  {
    id: 'vm-005',
    name: 'redis-cache',
    status: 'Running',
    locked: false,
    fixedIp: '10.20.30.44',
    floatingIp: '20.30.40.54',
    image: 'Debian 12',
    imageId: 'img-004',
    flavor: 'Medium',
    flavorId: 'flv-001',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    fingerprint: '12:34:56:78:9a:bc:de:f0',
    vCPU: 4,
    ram: '8GB',
    disk: '100GB',
  },
  {
    id: 'vm-006',
    name: 'ml-worker',
    status: 'Building',
    locked: false,
    fixedIp: '-',
    floatingIp: '-',
    image: 'Ubuntu 22.04',
    imageId: 'img-002',
    flavor: 'GPU Large',
    flavorId: 'flv-005',
    attachedTo: 'gpu-server-1',
    attachedToId: 'inst-005',
    attachedType: 'instance',
    fingerprint: 'ab:cd:ef:01:23:45:67:89',
    vCPU: 8,
    ram: '64GB',
    disk: '1TB',
  },
];

const sampleKeyPairData: KeyPairData[] = [
  {
    id: 'kp-001',
    name: 'tk-keypair',
    fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb',
    createdAt: 'Sep 10, 2025',
  },
  {
    id: 'kp-002',
    name: 'dev-keypair',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90',
    createdAt: 'Sep 8, 2025',
  },
  {
    id: 'kp-003',
    name: 'prod-keypair',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
    createdAt: 'Sep 5, 2025',
  },
];

export function TableDemo() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const basicColumns = [
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: fixedColumns.status,
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      flex: 1,
      minWidth: '140px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: fixedColumns.locked,
      align: 'center' as const,
      render: (value: boolean) =>
        value ? (
          <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        ) : null,
    },
    { key: 'fixedIp', label: 'Fixed IP', sortable: true, flex: 1, minWidth: '100px' },
    {
      key: 'image',
      label: 'Image',
      sortable: true,
      flex: 1,
      minWidth: '120px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.imageId}
          </span>
        </div>
      ),
    },
    {
      key: 'flavor',
      label: 'Flavor',
      sortable: true,
      flex: 1,
      minWidth: '100px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.flavorId}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center' as const,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconTerminal2 size={16} stroke={1.5} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
            <IconAction size={16} stroke={1} />
          </button>
        </div>
      ),
    },
  ];

  const attachedToColumns = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
            {value}
          </span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      render: (_: string | null, row: InstanceData) =>
        row.attachedTo && row.attachedToId ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-col gap-0.5 min-w-0">
              <button
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              >
                <span className="truncate">{row.attachedTo}</span>
                <IconExternalLink
                  size={12}
                  className="flex-shrink-0 text-[var(--color-action-primary)]"
                />
              </button>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedToId}
              </span>
            </div>
            <Tooltip
              content={row.attachedType === 'router' ? 'Router' : 'Instance'}
              position="top"
              delay={0}
            >
              <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1">
                {row.attachedType === 'router' ? (
                  <IconRouter size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
  ];

  const copyColumns = [
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
            {row.fingerprint}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(row.id, row.fingerprint);
            }}
            className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors flex-shrink-0 cursor-pointer"
            title={copiedId === row.id ? 'Copied!' : 'Copy fingerprint'}
          >
            {copiedId === row.id ? (
              <IconCheck size={12} className="text-[var(--color-state-success)]" />
            ) : (
              <IconCopy size={12} className="text-[var(--color-action-primary)]" />
            )}
          </button>
        </div>
      ),
    },
    { key: 'createdAt', label: 'Created at', width: columnMinWidths.createdAt },
  ];

  const noCopyColumns = [
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    {
      key: 'fingerprint',
      label: 'Fingerprint',
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
          {row.fingerprint}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Created at', width: columnMinWidths.createdAt },
  ];

  const compactColumns = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
          size="sm"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      width: columnMinWidths.name,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">
          {value}
        </span>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'image', label: 'Image', flex: 1 },
    { key: 'flavor', label: 'Flavor', flex: 1 },
  ];

  const emptyColumns = [
    { key: 'status', label: 'Status', width: fixedColumns.status, align: 'center' as const },
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1 },
    { key: 'image', label: 'Image', flex: 1 },
  ];

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <Label>Design Tokens & Features</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>cell-padding: 12×10px</code> · <code>header-padding: 12×8px</code> ·{' '}
          <code>radius: 8px</code> · <code>font: 12px</code>
          <br />
          <span className="text-[var(--color-text-muted)]">Features:</span>{' '}
          <code>overflow-x: auto</code> · <code>text-overflow: ellipsis</code> ·{' '}
          <code>title tooltip on hover</code>
        </div>
      </VStack>

      <VStack gap={3}>
        <Label>Basic Table with Sorting</Label>
        <Table columns={basicColumns} data={sampleTableData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click column headers to sort. Status shows icon-only, Name/Image/Flavor show ID below
          name.
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>Selectable table</Label>
        <Table
          columns={basicColumns}
          data={sampleTableData}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>External Link with Resource Icon</Label>
        <Table columns={attachedToColumns} data={sampleTableData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Attached to column shows resource type icon (Instance/Router), clickable link opens in new
          window
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>Cell with Copy Button</Label>
        <Table columns={copyColumns} data={sampleKeyPairData} rowKey="id" />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click copy icon to copy fingerprint. Icon changes to checkmark for 2 seconds after
          copying.
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>40PX</Label>
        <Table columns={noCopyColumns} data={sampleKeyPairData} rowKey="id" rowHeight="40px" />
      </VStack>

      <VStack gap={3}>
        <Label>Sticky Header (scroll to see effect)</Label>
        <div className="overflow-hidden rounded-[var(--radius-md)]">
          <Table
            columns={compactColumns}
            data={sampleTableData.slice(0, 5)}
            rowKey="id"
            maxHeight="180px"
            stickyHeader
          />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Scroll vertically to see sticky header effect
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>Horizontal Scroll & Text Truncation (max-width: 500px)</Label>
        <div className="max-w-[500px] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] p-2 overflow-hidden">
          <Table columns={compactColumns} data={sampleTableData.slice(0, 3)} rowKey="id" />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          • Horizontal scroll: Shift + Mouse wheel or trackpad swipe
          <br />
          • Long text is truncated with ellipsis (...)
          <br />• Hover over truncated text to see full content via tooltip
        </p>
      </VStack>

      <VStack gap={3}>
        <Label>Empty state</Label>
        <Table columns={emptyColumns} data={[]} rowKey="id" emptyMessage="No instances found" />
      </VStack>
    </VStack>
  );
}
