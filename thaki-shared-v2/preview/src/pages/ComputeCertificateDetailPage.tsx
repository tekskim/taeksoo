import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EditCertificateDrawer } from '../drawers/compute/certificate/EditCertificateDrawer';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { DetailCard } from '@shared/components/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';

interface CertificateDetail {
  name: string;
  type: string;
  domain: string;
  expiration: string;
  createdAt: string;
}

const mockCertificates: Record<string, CertificateDetail> = {
  'cert-001': {
    name: 'wildcard-example-com',
    type: 'TLS',
    domain: '*.example.com',
    expiration: 'Mar 15, 2026 23:59:59',
    createdAt: 'Mar 15, 2025 10:00:00',
  },
  'cert-002': {
    name: 'api-internal',
    type: 'TLS',
    domain: 'api.internal.corp',
    expiration: 'Dec 1, 2025 23:59:59',
    createdAt: 'Dec 1, 2024 09:12:00',
  },
};

const defaultDetail: CertificateDetail = {
  name: 'Unknown certificate',
  type: '-',
  domain: '-',
  expiration: '-',
  createdAt: '-',
};

export function ComputeCertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const data =
    id && mockCertificates[id]
      ? mockCertificates[id]
      : { ...defaultDetail, name: id ? `Certificate ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Type', value: data.type },
    { label: 'Domain', value: data.domain },
    { label: 'Expiration', value: data.expiration },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Certificate ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Issuer', value: 'Thaki CA Intermediate' },
    { label: 'Serial', value: '7A:3F:91:2C:EE:01' },
    { label: 'Signature algorithm', value: 'sha256WithRSAEncryption' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconEdit size={12} stroke={1.5} /> Edit
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
        <ContextMenu.Item action={() => console.log('Renew', id)}>Renew</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Download PEM', id)}>
          Download PEM
        </ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Delete', id)} danger>
          <IconTrash size={12} stroke={1.5} /> Delete
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={data.name} actions={actions} infoFields={infoFields} />

      <Tabs
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        variant="line"
        size="sm"
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Certificate" fields={detailFields} />
        </Tab>
      </Tabs>

      <EditCertificateDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        certificateId={id}
        initialData={{ name: data.name, description: '' }}
      />
    </div>
  );
}
