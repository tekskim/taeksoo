import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditKeyPairDrawer } from '../drawers/compute/misc/EditKeyPairDrawer';
import { Tabs, Tab } from '@shared/components/Tabs';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface KeyPairDetail {
  id: string;
  name: string;
  userId: string;
  fingerprint: string;
  publicKey: string;
  createdAt: string;
  description?: string;
}

const mockKeyPairsMap: Record<string, KeyPairDetail> = {
  'kp-001': {
    id: 'kp-001',
    name: 'tk-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDk...',
    createdAt: 'Sep 10, 2025 09:23:41',
  },
  'kp-002': {
    id: 'kp-002',
    name: 'dev-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDl...',
    createdAt: 'Sep 8, 2025 14:07:22',
  },
  'kp-003': {
    id: 'kp-003',
    name: 'prod-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDm...',
    createdAt: 'Sep 5, 2025 11:45:33',
  },
  'kp-004': {
    id: 'kp-004',
    name: 'staging-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'ff:ee:dd:cc:bb:aa:99:88:77:66:55:44:33:22:11:00',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDn...',
    createdAt: 'Aug 30, 2025 16:52:08',
  },
  'kp-005': {
    id: 'kp-005',
    name: 'test-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDo...',
    createdAt: 'Aug 25, 2025 08:30:15',
  },
  'kp-006': {
    id: 'kp-006',
    name: 'backup-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'ab:cd:ef:01:23:45:67:89:ab:cd:ef:01:23:45:67:89',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDp...',
    createdAt: 'Aug 20, 2025 13:19:44',
  },
  'kp-007': {
    id: 'kp-007',
    name: 'jenkins-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '98:76:54:32:10:fe:dc:ba:98:76:54:32:10:fe:dc:ba',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDq...',
    createdAt: 'Aug 15, 2025 10:41:27',
  },
  'kp-008': {
    id: 'kp-008',
    name: 'ansible-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: '01:02:03:04:05:06:07:08:09:0a:0b:0c:0d:0e:0f:10',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDr...',
    createdAt: 'Aug 10, 2025 17:03:56',
  },
  'kp-009': {
    id: 'kp-009',
    name: 'terraform-keypair',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'f0:e1:d2:c3:b4:a5:96:87:78:69:5a:4b:3c:2d:1e:0f',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDs...',
    createdAt: 'Aug 5, 2025 12:28:19',
  },
  'kp-010': {
    id: 'kp-010',
    name: 'github-deploy-key',
    userId: '514aa9f6265d4fb397b4345000b2ee9f',
    fingerprint: 'aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99',
    publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDt...',
    createdAt: 'Aug 1, 2025 15:55:02',
  },
};

const defaultKeyPairDetail: KeyPairDetail = {
  id: 'unknown',
  name: 'Unknown Key pair',
  userId: '-',
  fingerprint: '-',
  publicKey: '-',
  createdAt: '-',
};

export function ComputeKeyPairDetailPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const keyPair = useMemo(
    () => (id ? mockKeyPairsMap[id] || defaultKeyPairDetail : defaultKeyPairDetail),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Created at', value: keyPair.createdAt },
  ];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={keyPair.name}
        actions={
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditDrawerOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
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
                  <SectionCard.DataRow label="Key pair Name" value={keyPair.name} />
                  <SectionCard.DataRow label="User ID">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text">{keyPair.userId}</span>
                      <CopyButton text={keyPair.userId} />
                    </div>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Key identity" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Fingerprint">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text">{keyPair.fingerprint}</span>
                      <CopyButton text={keyPair.fingerprint} />
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Public key">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">
                        {keyPair.publicKey}
                      </span>
                      <CopyButton text={keyPair.publicKey} />
                    </div>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditKeyPairDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        keyPairName={keyPair.name}
        initialDescription={keyPair.description ?? ''}
      />
    </div>
  );
}
