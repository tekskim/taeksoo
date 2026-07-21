import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  ListToolbar,
  FilterSearchInput,
  type AppliedFilter,
  Pagination,
  Table,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
  Drawer,
  FormField,
  Input,
  Select,
  Chip,
  StatusIndicator,
  ContextMenu,
  type ContextMenuItem,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import { LabelWithTip } from '@/components/LabelWithTip';
import { useTabs } from '@/contexts/TabContext';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import type { Report, ReportType, ReportFormat } from './audit/types';
import {
  REPORTS,
  REPORT_TYPE_LABEL,
  REPORT_STATUS_META,
  FORMAT_LABEL,
  CURRENT_USER,
  STATS,
  formatAbsoluteTime,
} from './audit/mockData';

const PAGE_SIZE = 10;
const NAME_MAX = 255;
// 목업 고정 타임스탬프 (정책 §3-3: 생성은 비동기로 pending 상태로 진입)
const FIXED_REQUESTED_AT = '2026-06-16 10:00:00';

// Scope — Actions 후보: by_action 키에서 login 제외 (정책 §3-3)
const ACTION_CANDIDATES = Object.keys(STATS.by_action)
  .filter((a) => a !== 'login')
  .sort();

const REPORT_TYPE_OPTIONS = (Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((value) => ({
  value,
  label: REPORT_TYPE_LABEL[value],
}));
const FORMAT_OPTIONS = (Object.keys(FORMAT_LABEL) as ReportFormat[]).map((value) => ({
  value,
  label: FORMAT_LABEL[value],
}));

export default function AuditReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Create Report 드로어 상태
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fName, setFName] = useState('');
  const [fType, setFType] = useState<ReportType | ''>('');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');
  const [fActions, setFActions] = useState<string[]>([]);
  const [fTpn, setFTpn] = useState('');
  const [fTrn, setFTrn] = useState('');
  const [fFormat, setFFormat] = useState<ReportFormat | ''>('');

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // 필터 (develop AuditReportPage: status=select, type/requested_by=input) + 최신순 정렬 (§3-2)
  const sorted = useMemo(() => {
    const get = (fieldId: string) => appliedFilters.find((f) => f.fieldId === fieldId)?.value;
    const status = get('status');
    const type = get('report_type')?.toLowerCase();
    const requester = get('requested_by')?.toLowerCase();
    return [...reports]
      .filter((r) => {
        if (status && r.status !== status) return false;
        if (
          type &&
          !REPORT_TYPE_LABEL[r.report_type].toLowerCase().includes(type) &&
          !r.report_type.toLowerCase().includes(type)
        )
          return false;
        if (requester && !r.requested_by.toLowerCase().includes(requester)) return false;
        return true;
      })
      .sort((a, b) => b.requested_at.localeCompare(a.requested_at));
  }, [reports, appliedFilters]);

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── 이름 중복 검사 (정책 §3-1-1: 필수·대소문자 무시 중복 불가) ──────────────
  const nameTrimmed = fName.trim();
  const nameDuplicate = useMemo(
    () => !!nameTrimmed && reports.some((r) => r.name.toLowerCase() === nameTrimmed.toLowerCase()),
    [nameTrimmed, reports]
  );
  const nameError = !nameTrimmed
    ? null
    : nameDuplicate
      ? 'A report with this name already exists.'
      : nameTrimmed.length > NAME_MAX
        ? `Name must be ${NAME_MAX} characters or fewer.`
        : null;

  const canCreate = !!nameTrimmed && !nameError && !!fType && !!fFrom && !!fTo && !!fFormat;

  const resetForm = () => {
    setFName('');
    setFType('');
    setFFrom('');
    setFTo('');
    setFActions([]);
    setFTpn('');
    setFTrn('');
    setFFormat('');
  };

  const openCreate = () => {
    resetForm();
    setDrawerOpen(true);
  };
  const closeCreate = () => {
    setDrawerOpen(false);
    resetForm();
  };

  const toggleAction = (action: string) => {
    setFActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  };

  const handleCreate = () => {
    if (!canCreate || !fType || !fFormat) return;
    const newReport: Report = {
      report_id: `rpt-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: nameTrimmed,
      report_type: fType,
      status: 'pending',
      format: fFormat,
      parameters: {
        from: fFrom,
        to: fTo,
        actions: fActions.length ? fActions : undefined,
        tpn: fTpn.trim() || undefined,
        trn: fTrn.trim() || undefined,
      },
      row_count: null,
      error_message: null,
      requested_by: CURRENT_USER,
      requested_at: FIXED_REQUESTED_AT,
      completed_at: null,
    };
    setReports((prev) => [newReport, ...prev]);
    setPage(1);
    closeCreate();
  };

  const columns: TableColumn<Report>[] = [
    {
      key: 'status',
      label: 'Status',
      headerRender: () => (
        <LabelWithTip
          label="Status"
          tip="Report generation state — Pending / Processing / Completed / Failed."
        />
      ),
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: Report) => {
        const meta = REPORT_STATUS_META[row.status];
        return (
          <StatusIndicator status={meta.indicator} label={meta.label} layout="badge" hideIcon />
        );
      },
    },
    {
      key: 'name',
      label: 'Name',
      headerRender: () => (
        <LabelWithTip label="Name" tip="Report name — required and must be unique." />
      ),
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: unknown, row: Report) => (
        <span className="block truncate text-body-md font-medium text-[var(--color-action-primary)] hover:underline">
          {row.name}
        </span>
      ),
    },
    {
      key: 'report_type',
      label: 'Type',
      headerRender: () => (
        <LabelWithTip
          label="Type"
          tip="Report type — what the report aggregates (e.g., Audit Summary, Compliance Summary, Failed Events)."
        />
      ),
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: unknown, row: Report) => (
        <span className="block truncate text-body-sm text-[var(--color-text-subtle)]">
          {REPORT_TYPE_LABEL[row.report_type]}
        </span>
      ),
    },
    {
      key: 'format',
      label: 'Format',
      headerRender: () => (
        <LabelWithTip label="Format" tip="Output file format — PDF / Excel / CSV / JSON." />
      ),
      width: 90,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: Report) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {row.format.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'period',
      label: 'Period',
      headerRender: () => (
        <LabelWithTip label="Period" tip="Date range the report aggregates over (from – to)." />
      ),
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: unknown, row: Report) => (
        <span className="block truncate text-body-sm text-[var(--color-text-subtle)]">
          {row.parameters.from && row.parameters.to
            ? `${row.parameters.from.slice(0, 10)} – ${row.parameters.to.slice(0, 10)}`
            : '-'}
        </span>
      ),
    },
    {
      key: 'requested_by',
      label: 'Requested By',
      headerRender: () => (
        <LabelWithTip label="Requested By" tip="User who requested the report." />
      ),
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: unknown, row: Report) => (
        <span className="block truncate text-body-sm text-[var(--color-text-default)]">
          {row.requested_by}
        </span>
      ),
    },
    {
      key: 'requested_at',
      label: 'Created',
      headerRender: () => <LabelWithTip label="Created" tip="When the report was requested." />,
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      render: (_: unknown, row: Report) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {formatAbsoluteTime(row.requested_at)}
        </span>
      ),
    },
    {
      key: '_action',
      label: '',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: unknown, row: Report) => {
        const items: ContextMenuItem[] = [
          {
            id: 'detail',
            label: 'View details',
            onClick: () => navigate(`/audit/reports/${row.report_id}`),
          },
          {
            id: 'download',
            label: 'Download',
            disabled: row.status !== 'completed',
            onClick: () => {
              /* 목업 — 다운로드 동작 생략 */
            },
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={items} trigger="click" align="right">
              <button
                aria-label="Report actions"
                className="rounded-md p-1.5 transition-colors hover:bg-[var(--color-surface-muted)]"
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
              items={[{ label: 'prod-cluster-01', href: '/audit/reports' }, { label: 'Reports' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader
          title="Reports"
          description="Generate and download compliance reports from audit data."
          actions={
            <Button variant="primary" onClick={openCreate}>
              Create Report
            </Button>
          }
        />

        {/* 필터 검색 (develop AuditReportPage: Status·Type·Requested by) */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                      { value: 'pending', label: 'Pending' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'failed', label: 'Failed' },
                    ],
                  },
                  {
                    id: 'report_type',
                    label: 'Type',
                    type: 'text',
                    placeholder: 'e.g. Compliance',
                  },
                  {
                    id: 'requested_by',
                    label: 'Requested by',
                    type: 'text',
                    placeholder: 'e.g. taeksoo.kim',
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Filter by status, type, requester…"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        {/* Pagination — table 상단 좌측 */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={sorted.length}
        />

        <Table<Report>
          columns={columns}
          data={paged}
          rowKey="report_id"
          onRowClick={(row) => navigate(`/audit/reports/${row.report_id}`)}
          resizable={false}
          emptyMessage={
            appliedFilters.length
              ? 'No reports match the current filters.'
              : 'No reports to display.'
          }
        />
      </VStack>

      {/* Create Report Drawer (정책 §3-3) */}
      <Drawer
        isOpen={drawerOpen}
        onClose={closeCreate}
        title="Create Report"
        description="Generate a compliance report. Generation runs asynchronously."
        width={420}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={closeCreate} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!canCreate}
              className="flex-1"
            >
              Create
            </Button>
          </HStack>
        }
      >
        <VStack gap={5}>
          <FormField
            label={
              <LabelWithTip
                label="Name"
                tip="Report name — required and must be unique (1–255 characters)."
              />
            }
            required
            errorMessage={nameError ?? undefined}
          >
            <Input
              value={fName}
              onChange={(e) => setFName(e.target.value.slice(0, NAME_MAX))}
              placeholder="e.g. June Compliance Summary"
              error={!!nameError}
              fullWidth
            />
          </FormField>

          <FormField
            label={
              <LabelWithTip
                label="Report Type"
                tip="What the report aggregates — one of 7 types (e.g., Audit Summary, Compliance Summary, Failed Events)."
              />
            }
            required
          >
            <Select
              value={fType}
              onChange={(v) => setFType(v as ReportType)}
              options={REPORT_TYPE_OPTIONS}
              placeholder="Select a report type"
              width="full"
            />
          </FormField>

          <FormField
            label={<LabelWithTip label="Period" tip="Date range the report covers (From / To)." />}
            required
          >
            <HStack gap={2} className="w-full">
              <Input
                type="date"
                value={fFrom}
                onChange={(e) => setFFrom(e.target.value)}
                fullWidth
              />
              <Input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} fullWidth />
            </HStack>
          </FormField>

          <FormField
            label={
              <LabelWithTip
                label="Scope — Actions (optional)"
                tip="Optional: limit the report to specific action types."
              />
            }
          >
            <HStack gap={1.5} className="flex-wrap">
              {ACTION_CANDIDATES.map((action) => {
                const selected = fActions.includes(action);
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(action)}
                    className="focus:outline-none"
                  >
                    <Chip value={action} variant={selected ? 'selected' : 'default'} />
                  </button>
                );
              })}
            </HStack>
          </FormField>

          <FormField
            label={
              <LabelWithTip
                label="Scope — Actor (TPN) (optional)"
                tip="Optional: limit to a specific actor — TPN is the actor type:id path (e.g., user:taeksoo.kim)."
              />
            }
          >
            <Input
              value={fTpn}
              onChange={(e) => setFTpn(e.target.value)}
              placeholder="e.g. user:taeksoo.kim"
              fullWidth
            />
          </FormField>

          <FormField
            label={
              <LabelWithTip
                label="Scope — Target (TRN) (optional)"
                tip="Optional: limit to a specific target resource — TRN is the target type:id path (e.g., instance:vm-7781)."
              />
            }
          >
            <Input
              value={fTrn}
              onChange={(e) => setFTrn(e.target.value)}
              placeholder="e.g. instance:vm-7781"
              fullWidth
            />
          </FormField>

          <FormField
            label={
              <LabelWithTip label="Format" tip="Output file format — PDF / Excel / CSV / JSON." />
            }
            required
          >
            <Select
              value={fFormat}
              onChange={(v) => setFFormat(v as ReportFormat)}
              options={FORMAT_OPTIONS}
              placeholder="Select a format"
              width="full"
            />
          </FormField>
        </VStack>
      </Drawer>
    </PageShell>
  );
}
