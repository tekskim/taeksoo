import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  BadgeList,
  EmptyState,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { KmsStateBadge, formatDate, AuditLogSection } from './shared';
import {
  getCertificateById,
  canRevokeCertificate,
  hasCertificateOptionalAction,
  type CertificateDetail,
} from './models/certificate';
import {
  RevokeCertificateConfirmModal,
  RenewCertificateConfirmModal,
} from './CertificateActionModals';

function renderSanList(items: string[]) {
  if (items.length === 0) {
    return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
  }
  return <BadgeList items={items} maxVisible={3} theme="gry" size="sm" />;
}

/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */

export default function CertificateDetailPage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [certificate, setCertificate] = useState<CertificateDetail | undefined>(() =>
    getCertificateById(certificateId)
  );
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);
  const [isRenewConfirmOpen, setIsRenewConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  useEffect(() => {
    setCertificate(getCertificateById(certificateId));
    setIsRevokeConfirmOpen(false);
    setIsRenewConfirmOpen(false);
  }, [certificateId]);

  const breadcrumbBase = [
    { label: 'KMS', href: '/kms/overview' },
    { label: 'Certificates', href: '/kms/certificates' },
  ];

  const shell = (children: React.ReactNode) => (
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
              items={[
                ...breadcrumbBase,
                { label: certificate?.commonName ?? 'Certificate details' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      {children}
    </PageShell>
  );

  if (!certificate) {
    return shell(
      <EmptyState
        title="Certificate not found"
        description="The selected certificate may have been removed or is unavailable."
      />
    );
  }

  const showRevokeAction = canRevokeCertificate(certificate);
  const showRenewAction = hasCertificateOptionalAction(certificate, 'renew');

  /* Certificate information → DetailHeader InfoGrid (TDS detail-header 패턴)
     Common Name은 타이틀로 표시되므로 카드에서 제외 */
  const summaryFields: { label: string; value: React.ReactNode }[] = [
    { label: 'Status', value: <KmsStateBadge status={certificate.status} /> },
    { label: 'SAN', value: renderSanList(certificate.san) },
    {
      label: 'Serial number',
      value: <span className="font-mono">{certificate.serialNumber || '-'}</span>,
    },
    { label: 'Issuer CA', value: certificate.issuerCa || '-' },
    { label: 'Signature algorithm', value: certificate.signatureAlgorithm || '-' },
    { label: 'Public key algorithm', value: certificate.publicKeyAlgorithm || '-' },
    { label: 'Issued at', value: certificate.issuedAt ? formatDate(certificate.issuedAt) : '-' },
    { label: 'Expires at', value: certificate.expiresAt ? formatDate(certificate.expiresAt) : '-' },
    {
      label: 'Days remaining',
      value: certificate.daysRemaining < 0 ? 'Expired' : `D-${certificate.daysRemaining}`,
    },
  ];

  const handleRevokeCertificate = (_reasonCode: string, _reason: string): void => {
    setCertificate((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        status: 'revoked',
        optionalActions: previous.optionalActions?.filter((action) => action !== 'revoke'),
      };
    });
    setIsRevokeConfirmOpen(false);
  };

  const handleRenewCertificate = (_reason: string): void => {
    setIsRenewConfirmOpen(false);
  };

  return shell(
    <>
      <VStack gap={4}>
        {/* Detail header */}
        <DetailHeader>
          <DetailHeader.Title>{certificate.commonName}</DetailHeader.Title>
          {(showRenewAction || showRevokeAction) && (
            <DetailHeader.Actions>
              {showRenewAction && (
                <Button variant="secondary" size="sm" onClick={() => setIsRenewConfirmOpen(true)}>
                  Renew
                </Button>
              )}
              {showRevokeAction && (
                <Button variant="secondary" size="sm" onClick={() => setIsRevokeConfirmOpen(true)}>
                  Revoke
                </Button>
              )}
            </DetailHeader.Actions>
          )}
          <DetailHeader.InfoGrid>
            {summaryFields.map(({ label, value }) => (
              <DetailHeader.InfoCard key={label} label={label} value={value} />
            ))}
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* 섹션 → DetailHeader 하단 탭 (TDS detail-page 패턴) */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="audit">Audit Logs</Tab>
          </TabList>

          <TabPanel value="audit" className="pt-0">
            <VStack gap={4} className="pt-4">
              <AuditLogSection resourceId={certificate.id} />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      {/* Revoke confirmation modal (CRL reason code) */}
      {isRevokeConfirmOpen && (
        <RevokeCertificateConfirmModal
          isOpen={isRevokeConfirmOpen}
          commonName={certificate.commonName}
          onCancel={() => setIsRevokeConfirmOpen(false)}
          onConfirm={handleRevokeCertificate}
        />
      )}

      {/* Renew confirmation modal */}
      {isRenewConfirmOpen && (
        <RenewCertificateConfirmModal
          isOpen={isRenewConfirmOpen}
          commonName={certificate.commonName}
          onCancel={() => setIsRenewConfirmOpen(false)}
          onConfirm={handleRenewCertificate}
        />
      )}
    </>
  );
}
