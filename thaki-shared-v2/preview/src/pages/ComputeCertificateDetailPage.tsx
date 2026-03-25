import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditCertificateDrawer } from '../drawers/compute/certificate/EditCertificateDrawer';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconTrash, IconDownload, IconEdit } from '@tabler/icons-react';
import { ActionModal } from '@shared/components/ActionModal';

type CertificateStatus = 'valid' | 'expired' | 'revoked' | 'pending';

interface ServerCertificateDetail {
  id: string;
  name: string;
  status: CertificateStatus;
  certificateType: 'server';
  type: string;
  domain: string;
  expiresAt: string;
  createdAt: string;
  description: string;
  classification: string;
  issuer: string;
  san: string;
  signatureType: string;
  validFrom: string;
  validTo: string;
}

interface CACertificateDetail {
  id: string;
  name: string;
  status: CertificateStatus;
  certificateType: 'ca';
  expiresAt: string;
  createdAt: string;
  description: string;
  classification: string;
  authority: string;
  issuer: string;
  signatureType: string;
  validFrom: string;
  validTo: string;
}

type CertificateDetail = ServerCertificateDetail | CACertificateDetail;

type ListenerStatus = 'active' | 'down' | 'error';

interface Listener {
  id: string;
  name: string;
  status: ListenerStatus;
  protocol: string;
  port: number;
  loadBalancer: { name: string; id: string };
  adminState: 'Up' | 'Down';
}

const mockServerCertificate: ServerCertificateDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'server-cert-1',
  status: 'valid',
  certificateType: 'server',
  type: 'Wildcard',
  domain: '.domain.com',
  expiresAt: 'Sep 25, 2025 23:59:59',
  createdAt: 'Jul 25, 2025 10:32:16',
  description: '-',
  classification: 'Server Certificate',
  issuer: "Let's Encrypt Authority X3",
  san: 'www.domain.com, api.domain.com',
  signatureType: 'SHA256withRSA',
  validFrom: 'Feb 10, 2025',
  validTo: 'Feb 10, 2026',
};

const mockCACertificate: CACertificateDetail = {
  id: '8395e0285f92542f04171b0cde3deef0',
  name: 'root-ca',
  status: 'valid',
  certificateType: 'ca',
  expiresAt: 'Sep 25, 2025 23:59:59',
  createdAt: 'Jul 25, 2025 10:32:16',
  description: '-',
  classification: 'CA Certificate',
  authority: 'Sectigo Root CA',
  issuer: 'Sectigo Root CA',
  signatureType: 'SHA256withRSA',
  validFrom: 'Feb 10, 2025',
  validTo: 'Feb 10, 2026',
};

const mockCertificates: Record<string, CertificateDetail> = {
  'cert-001': mockServerCertificate,
  'cert-002': { ...mockServerCertificate, id: 'cert-002', name: 'api-cert' },
  'cert-003': { ...mockServerCertificate, id: 'cert-003', name: 'web-cert' },
  'cert-004': { ...mockCACertificate, id: 'cert-004', name: 'intermediate-ca' },
  'cert-005': { ...mockCACertificate, id: 'cert-005', name: 'private-ca' },
  'cert-006': { ...mockCACertificate, id: 'cert-006', name: 'root-ca' },
};

const mockListeners: Listener[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `listener-http-80`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as ListenerStatus,
  protocol: ['HTTP', 'HTTPS', 'TCP', 'UDP'][i % 4],
  port: [80, 443, 8080, 3000][i % 4],
  loadBalancer: { name: 'web-lb-01', id: `29fg234${String(i).padStart(2, '0')}` },
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

const listenerStatusMap: Record<ListenerStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const certificateStatusVariant: Record<CertificateStatus, StatusVariant> = {
  valid: 'active',
  expired: 'error',
  revoked: 'shutoff',
  pending: 'building',
};

const STATUS_COL_WIDTH = 60;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

function isServerCertificate(cert: CertificateDetail): cert is ServerCertificateDetail {
  return cert.certificateType === 'server';
}

export function ComputeCertificateDetailPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const certificate = useMemo(
    () => (id && mockCertificates[id] ? mockCertificates[id] : mockServerCertificate),
    [id]
  );

  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const listenersPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSort = useCallback((k: string | null, o: SortOrder) => {
    setSort(k ?? '');
    setOrder(o);
  }, []);

  const filteredListeners = useMemo(() => {
    if (!listenerSearchTerm) return mockListeners;
    const query = listenerSearchTerm.toLowerCase();
    return mockListeners.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.protocol.toLowerCase().includes(query) ||
        l.loadBalancer.name.toLowerCase().includes(query)
    );
  }, [listenerSearchTerm]);

  const paginatedListeners = filteredListeners.slice(
    (listenerCurrentPage - 1) * listenersPerPage,
    listenerCurrentPage * listenersPerPage
  );

  const statusLabel = certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusLabel,
      accessory: (
        <StatusIndicator variant={certificateStatusVariant[certificate.status]} layout="iconOnly" />
      ),
    },
    { label: 'ID', value: certificate.id, showCopyButton: true, copyText: certificate.id },
    ...(isServerCertificate(certificate)
      ? [{ label: 'Type', value: certificate.type } satisfies DetailPageHeaderInfoField]
      : []),
    { label: 'Expires at', value: certificate.expiresAt },
    { label: 'Created at', value: certificate.createdAt },
  ];

  const listenerColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'protocol', header: 'Protocol', sortable: true },
      { key: 'port', header: 'Port', sortable: true },
      { key: 'loadBalancer', header: 'Load balancer', sortable: true },
      { key: 'adminState', header: 'Admin state' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={certificate.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconDownload size={12} stroke={1.5} /> Download
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditDrawerOpen(true)}
            >
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
            >
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Certificate name" value={certificate.name} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                {isServerCertificate(certificate) ? (
                  <>
                    <SectionCard.Header title="Certificate metadata" />
                    <SectionCard.Content>
                      <SectionCard.DataRow
                        label="Classification"
                        value={certificate.classification}
                      />
                      <SectionCard.DataRow label="Issuer" value={certificate.issuer} />
                      <SectionCard.DataRow label="Type" value={certificate.type} />
                      <SectionCard.DataRow label="CN" value={certificate.domain} />
                      <SectionCard.DataRow label="SAN" value={certificate.san} />
                      <SectionCard.DataRow
                        label="Signature type"
                        value={certificate.signatureType}
                      />
                      <SectionCard.DataRow
                        label="Valid from / To"
                        value={`${certificate.validFrom} ~ ${certificate.validTo}`}
                      />
                    </SectionCard.Content>
                  </>
                ) : (
                  <>
                    <SectionCard.Header title="Certificate metadata" />
                    <SectionCard.Content>
                      <SectionCard.DataRow
                        label="Classification"
                        value={certificate.classification}
                      />
                      <SectionCard.DataRow label="Authority" value={certificate.authority} />
                      <SectionCard.DataRow label="Issuer" value={certificate.issuer} />
                      <SectionCard.DataRow
                        label="Signature type"
                        value={certificate.signatureType}
                      />
                      <SectionCard.DataRow
                        label="Valid from / To"
                        value={`${certificate.validFrom} ~ ${certificate.validTo}`}
                      />
                    </SectionCard.Content>
                  </>
                )}
              </SectionCard>
            </div>
          </Tab>

          <Tab id="listeners" label="Listeners">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-16 font-semibold text-text m-0">Listener</h3>
              </div>
              <input
                type="search"
                value={listenerSearchTerm}
                onChange={(e) => {
                  setListenerSearchTerm(e.target.value);
                  setListenerCurrentPage(1);
                }}
                placeholder="Search listener by attributes"
                className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
              />
              <Pagination
                totalCount={filteredListeners.length}
                size={listenersPerPage}
                currentAt={listenerCurrentPage}
                onPageChange={setListenerCurrentPage}
                totalCountLabel="items"
              />
              <Table<Listener>
                columns={listenerColumns}
                rows={paginatedListeners}
                sort={sort}
                order={order}
                onSortChange={handleSort}
              >
                {paginatedListeners.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={listenerColumns[0]}>
                      <StatusIndicator variant={listenerStatusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/listeners/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[2]}>
                      {row.protocol}
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[3]}>
                      {row.port}
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[4]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/load-balancers/${row.loadBalancer.id}`}
                          className={linkClass}
                        >
                          {row.loadBalancer.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.loadBalancer.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[5]}>
                      <Badge
                        theme={row.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {row.adminState}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditCertificateDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        certificateId={certificate.id}
        initialData={{ name: certificate.name, description: certificate.description }}
      />

      <ActionModal
        appeared={deleteModalOpen}
        actionConfig={{
          title: 'Delete certificate',
          subtitle: `Are you sure you want to delete "${certificate.name}"? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Certificate] Delete confirmed');
          setDeleteModalOpen(false);
          navigate('/compute/certificates');
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
