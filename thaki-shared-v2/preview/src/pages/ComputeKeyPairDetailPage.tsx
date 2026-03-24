import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import { EditKeyPairDrawer } from '../drawers/compute/misc/EditKeyPairDrawer';

interface KeyPairDetail {
  id: string;
  name: string;
  type: string;
  fingerprint: string;
  createdAt: string;
  userId: string;
  description?: string;
}

const mockMap: Record<string, KeyPairDetail> = {
  'kp-001': {
    id: 'kp-001',
    name: 'prod-deploy',
    type: 'RSA',
    fingerprint: 'SHA256:ab12cd34ef567890abcdef1234567890abcdef12',
    createdAt: 'Mar 10, 2025 11:22:33',
    userId: 'user-88421',
    description: 'Deployment automation key.',
  },
  'kp-002': {
    id: 'kp-002',
    name: 'dev-laptop',
    type: 'ED25519',
    fingerprint: 'SHA256:9f8e7d6c5b4a3210fedcba9876543210abcdef99',
    createdAt: 'Mar 8, 2025 09:15:00',
    userId: 'user-44102',
  },
};

const defaultDetail: KeyPairDetail = {
  id: '-',
  name: 'Unknown key pair',
  type: '-',
  fingerprint: '-',
  createdAt: '-',
  userId: '-',
  description: '',
};

export function ComputeKeyPairDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const kp = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: kp.name },
    { label: 'Type', value: kp.type },
    { label: 'Fingerprint', value: kp.fingerprint, showCopyButton: true, copyText: kp.fingerprint },
    { label: 'Created at', value: kp.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Key pair name', value: kp.name },
    { label: 'Key pair ID', value: kp.id },
    { label: 'Type', value: kp.type },
    { label: 'Fingerprint', value: kp.fingerprint },
    { label: 'Owner user ID', value: kp.userId },
    { label: 'Created at', value: kp.createdAt },
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
      <ContextMenu.Item action={() => setEditDrawerOpen(true)}>
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
      <DetailPageHeader title={kp.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Basic information" fields={detailFields} />
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditKeyPairDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        keyPairName={kp.name}
        initialDescription={kp.description ?? ''}
      />
    </div>
  );
}
