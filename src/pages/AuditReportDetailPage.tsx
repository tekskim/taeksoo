import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  DetailHeader,
  SectionCard,
  InlineMessage,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDownload } from '@tabler/icons-react';
import {
  getReportById,
  REPORT_TYPE_LABEL,
  REPORT_STATUS_META,
  FORMAT_LABEL,
  formatAbsoluteTime,
} from './audit/mockData';

export default function AuditReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const report = getReportById(id ?? '');

  const shell = (children: React.ReactNode, crumbLabel: string) => (
    <PageShell
      sidebar={<AuditSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
                { label: 'prod-cluster-01', href: '/audit/reports' },
                { label: 'Reports', href: '/audit/reports' },
                { label: crumbLabel },
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

  if (!report) {
    return shell(
      <div className="flex h-[320px] items-center justify-center text-body-md text-[var(--color-text-subtle)]">
        Report not found.
      </div>,
      'Not found'
    );
  }

  const statusMeta = REPORT_STATUS_META[report.status];
  const downloadEnabled = report.status === 'completed';

  const rowCountDisplay =
    report.row_count?.toLocaleString() ?? (report.status === 'completed' ? '0' : '—');
  const completedDisplay = report.completed_at ? formatAbsoluteTime(report.completed_at) : '—';

  const periodDisplay =
    report.parameters.from && report.parameters.to
      ? `${report.parameters.from} → ${report.parameters.to}`
      : '—';
  const actionsDisplay = report.parameters.actions?.join(', ') ?? 'All';
  const tpnDisplay = report.parameters.tpn ?? '-';
  const trnDisplay = report.parameters.trn ?? '-';

  return shell(
    <VStack gap={4}>
      <DetailHeader>
        <DetailHeader.Title>{report.name}</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<IconDownload size={14} />}
            disabled={!downloadEnabled}
          >
            Download
          </Button>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Report ID" value={report.report_id} copyable />
          <DetailHeader.InfoCard label="Type" value={REPORT_TYPE_LABEL[report.report_type]} />
          <DetailHeader.InfoCard
            label="Status"
            value={statusMeta.label}
            status={statusMeta.indicator}
          />
          <DetailHeader.InfoCard label="Format" value={FORMAT_LABEL[report.format]} />
          <DetailHeader.InfoCard label="Requested By" value={report.requested_by} />
          <DetailHeader.InfoCard
            label="Requested At"
            value={formatAbsoluteTime(report.requested_at)}
          />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      {/* Result card */}
      <SectionCard>
        <SectionCard.Header title="Result" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Row Count" value={rowCountDisplay} />
          <SectionCard.DataRow label="Completed At" value={completedDisplay} />
          {report.status === 'failed' && (
            <SectionCard.DataRow label="Error">
              <InlineMessage variant="error">
                {report.error_message ?? 'Report generation failed.'}
              </InlineMessage>
            </SectionCard.DataRow>
          )}
        </SectionCard.Content>
      </SectionCard>

      {/* Parameters card (§3-5) */}
      <SectionCard>
        <SectionCard.Header title="Parameters" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Period" value={periodDisplay} />
          <SectionCard.DataRow label="Actions" value={actionsDisplay} />
          <SectionCard.DataRow label="Actor (TPN)" value={tpnDisplay} />
          <SectionCard.DataRow label="Target (TRN)" value={trnDisplay} />
          <SectionCard.DataRow label="Format" value={FORMAT_LABEL[report.format]} />
        </SectionCard.Content>
      </SectionCard>
    </VStack>,
    report.name
  );
}
