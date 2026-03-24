import { useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';

interface FlavorDetail {
  id: string;
  name: string;
  vCpu: string;
  ram: string;
  rootDisk: string;
  isPublic: boolean;
  createdAt: string;
  ephemeralDisk: string;
  swap: string;
  rxtxFactor: string;
}

const mockMap: Record<string, FlavorDetail> = {
  'flv-001': {
    id: 'flv-001',
    name: 'm1.small',
    vCpu: '1',
    ram: '2 GiB',
    rootDisk: '20 GiB',
    isPublic: true,
    createdAt: 'Jan 10, 2025 08:00:00',
    ephemeralDisk: '0 GiB',
    swap: '0 GiB',
    rxtxFactor: '1.0',
  },
  'flv-003': {
    id: 'flv-003',
    name: 'c1.xlarge',
    vCpu: '8',
    ram: '16 GiB',
    rootDisk: '80 GiB',
    isPublic: true,
    createdAt: 'Jan 12, 2025 11:22:33',
    ephemeralDisk: '0 GiB',
    swap: '0 GiB',
    rxtxFactor: '1.0',
  },
};

const defaultDetail: FlavorDetail = {
  id: '-',
  name: 'Unknown flavor',
  vCpu: '-',
  ram: '-',
  rootDisk: '-',
  isPublic: false,
  createdAt: '-',
  ephemeralDisk: '-',
  swap: '-',
  rxtxFactor: '-',
};

export function ComputeFlavorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const f = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: f.name },
    { label: 'vCPU', value: f.vCpu },
    { label: 'RAM', value: f.ram },
    { label: 'Root disk', value: f.rootDisk },
    { label: 'Is public', value: f.isPublic ? 'Yes' : 'No' },
    { label: 'Created at', value: f.createdAt },
  ];

  const specFields: DetailCardField[] = [
    { label: 'vCPU', value: f.vCpu },
    { label: 'RAM', value: f.ram },
    { label: 'Root disk', value: f.rootDisk },
    { label: 'Ephemeral disk', value: f.ephemeralDisk },
    { label: 'Swap', value: f.swap },
    { label: 'RX/TX factor', value: f.rxtxFactor },
  ];

  const metaFields: DetailCardField[] = [
    { label: 'Flavor ID', value: f.id },
    { label: 'Visibility', value: f.isPublic ? 'Public' : 'Private' },
    { label: 'Created at', value: f.createdAt },
  ];

  const actions = (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
          Actions <IconChevronDown size={12} stroke={1.5} />
        </Button>
      )}
    >
      <ContextMenu.Item action={() => {}}>
        <span className="inline-flex items-center gap-1">
          <IconEdit size={12} stroke={1.5} /> Edit
        </span>
      </ContextMenu.Item>
      <ContextMenu.Item action={() => {}} danger>
        <span className="inline-flex items-center gap-1">
          <IconTrash size={12} stroke={1.5} /> Delete
        </span>
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={f.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Specs" fields={specFields} />
              <DetailCard title="Basic information" fields={metaFields} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
