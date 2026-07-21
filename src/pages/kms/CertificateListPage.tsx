import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  FilterSearchInput,
  type AppliedFilter,
  ListToolbar,
  Pagination,
  Table,
  type TableColumn,
  BadgeList,
  MetricCard,
  ContextMenu,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { KmsStateBadge, formatDate } from './shared';
import {
  DUMMY_CERTIFICATES,
  canRevokeCertificate,
  hasCertificateOptionalAction,
  type CertificateDetail,
} from './models/certificate';
import {
  RevokeCertificateConfirmModal,
  RenewCertificateConfirmModal,
} from './CertificateActionModals';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
];

export default function CertificateListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [certificates, setCertificates] = useState<CertificateDetail[]>(DUMMY_CERTIFICATES);
  const [actionModal, setActionModal] = useState<{
    type: 'renew' | 'revoke';
    cert: CertificateDetail;
  } | null>(null);

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // ── Status summary ──────────────────────────────────────────────────────────
  const statusSummary = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0, revoked: 0 };
    certificates.forEach((c) => {
      counts[c.status] += 1;
    });
    return counts;
  }, [certificates]);

  // ── Filtering (name matches CN or SAN; status exact) ───────────────────────
  const filteredCertificates = useMemo(() => {
    return certificates.filter((certificate) => {
      for (const f of appliedFilters) {
        if (f.fieldId === 'name') {
          const nameQuery = f.value.toLowerCase();
          const matchesName =
            certificate.commonName.toLowerCase().includes(nameQuery) ||
            certificate.san.some((s) => s.toLowerCase().includes(nameQuery));
          if (!matchesName) return false;
        }
        if (f.fieldId === 'status' && certificate.status !== f.value) return false;
      }
      return true;
    });
  }, [appliedFilters, certificates]);

  // ── Row actions (Renew / Revoke) — 상세 페이지와 동일한 모달 재사용 ──────────
  const handleRevokeCertificate = (): void => {
    if (!actionModal) return;
    const { id } = actionModal.cert;
    setCertificates((previous) =>
      previous.map((certificate) =>
        certificate.id === id
          ? {
              ...certificate,
              status: 'revoked',
              optionalActions: certificate.optionalActions?.filter((action) => action !== 'revoke'),
            }
          : certificate
      )
    );
    setActionModal(null);
  };

  const handleRenewCertificate = (): void => {
    setActionModal(null);
  };

  const totalPages = Math.max(1, Math.ceil(filteredCertificates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedCertificates = filteredCertificates.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
  };

  // ── Table columns ───────────────────────────────────────────────────────────
  // TDS 컬럼 순서: Status → Name → [기타 속성] → Date → Action
  const columns: TableColumn<CertificateDetail>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: CertificateDetail) => <KmsStateBadge status={row.status} />,
    },
    {
      key: 'commonName',
      label: 'Common Name (CN)',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: any, row: CertificateDetail) => (
        <span className="text-body-md font-medium text-[var(--color-action-primary)] hover:underline truncate block min-w-0">
          {row.commonName}
        </span>
      ),
    },
    {
      key: 'san',
      label: 'SAN',
      flex: 1,
      minWidth: columnMinWidths.nameWide,
      render: (_: any, row: CertificateDetail) =>
        row.san.length > 0 ? (
          <BadgeList items={row.san} maxVisible={1} maxBadgeWidth="160px" theme="gry" size="sm" />
        ) : (
          <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'issuerCa',
      label: 'Issuer CA',
      flex: 1,
      minWidth: columnMinWidths.issuer,
      render: (_: any, row: CertificateDetail) => (
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate block min-w-0">
          {row.issuerCa || '-'}
        </span>
      ),
    },
    {
      key: 'daysRemaining',
      label: 'Days remaining',
      flex: 1,
      minWidth: columnMinWidths.expiresAt,
      render: (_: any, row: CertificateDetail) =>
        row.daysRemaining < 0 ? (
          <span className="text-body-sm font-medium text-[var(--color-state-danger)]">Expired</span>
        ) : (
          <span className="text-body-sm font-mono text-[var(--color-text-default)]">
            D-{row.daysRemaining}
          </span>
        ),
    },
    {
      key: 'issuedAt',
      label: 'Issued at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      render: (_: any, row: CertificateDetail) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {formatDate(row.issuedAt)}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      render: (_: any, row: CertificateDetail) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {formatDate(row.expiresAt)}
        </span>
      ),
    },
    {
      key: '_action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, row: CertificateDetail) => {
        // 상태/옵션에 따라 수행 가능한 액션만 노출. 클릭 시 상세 페이지와 동일한 모달 오픈.
        const items: ContextMenuItem[] = [
          ...(hasCertificateOptionalAction(row, 'renew')
            ? [
                {
                  id: 'renew',
                  label: 'Renew',
                  onClick: () => setActionModal({ type: 'renew', cert: row }),
                },
              ]
            : []),
          ...(canRevokeCertificate(row)
            ? [
                {
                  id: 'revoke',
                  label: 'Revoke',
                  onClick: () => setActionModal({ type: 'revoke', cert: row }),
                },
              ]
            : []),
        ];
        if (items.length === 0) {
          return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
        }
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={items} trigger="click" align="right">
              <button
                aria-label="Row actions"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-subtle)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell
      sidebar={<KmsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'KMS', href: '/kms/overview' }, { label: 'Certificates' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Certificates" />

        {/* Status summary */}
        <MetricCard.Group>
          <MetricCard title="Active" value={String(statusSummary.active)} accent="success" />
          <MetricCard title="Expiring" value={String(statusSummary.expiring)} />
          <MetricCard title="Expired" value={String(statusSummary.expired)} accent="error" />
          <MetricCard title="Revoked" value={String(statusSummary.revoked)} accent="error" />
        </MetricCard.Group>

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'name',
                    label: 'Name',
                    type: 'text',
                    placeholder: 'e.g. auth-service.kms.svc',
                  },
                  {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    options: STATUS_OPTIONS,
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search certificates by attributes"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredCertificates.length}
        />

        {/* Table */}
        <Table<CertificateDetail>
          columns={columns}
          data={pagedCertificates}
          rowKey="id"
          onRowClick={(row) => navigate(`/kms/certificates/${row.id}`)}
          emptyMessage={
            appliedFilters.length > 0
              ? 'No certificates match the current filter. Try adjusting your search or filter criteria.'
              : 'No certificates to display.'
          }
          resizable={false}
        />
      </VStack>

      {/* Renew confirmation modal — Cert 상세 페이지와 동일 */}
      {actionModal?.type === 'renew' && (
        <RenewCertificateConfirmModal
          isOpen
          commonName={actionModal.cert.commonName}
          onCancel={() => setActionModal(null)}
          onConfirm={handleRenewCertificate}
        />
      )}

      {/* Revoke confirmation modal — Cert 상세 페이지와 동일 */}
      {actionModal?.type === 'revoke' && (
        <RevokeCertificateConfirmModal
          isOpen
          commonName={actionModal.cert.commonName}
          onCancel={() => setActionModal(null)}
          onConfirm={handleRevokeCertificate}
        />
      )}
    </PageShell>
  );
}
