import { useState } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  Drawer,
  FormField,
  Input,
  Select,
  Checkbox,
  BadgeList,
  ConfirmModal,
  Table,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
  ContextMenu,
  type ContextMenuItem,
} from '@/design-system';
import { AlertSidebar } from '@/components/AlertSidebar';
import { useTabs } from '@/contexts/TabContext';
import { PREDEFINED_ALERT_RULES } from '@/mocks/alertRules';
import { IconPlus, IconSend, IconX, IconDotsCircleHorizontal } from '@tabler/icons-react';

// ── Types & Mock Data ─────────────────────────────────────────────────────────

type DeliveryChannel = 'Slack' | 'Email';
type DeliverySeverity = 'Critical' | 'Warning';
type TestStatus = 'idle' | 'Pending' | 'Success' | 'Failed';

type DeliveryTarget = {
  id: string;
  channel: DeliveryChannel;
  /** 수신 대상 — 이메일 주소 또는 Slack 채널/Webhook (직접 입력, 정책 3-3) */
  recipient: string;
};

type DeliveryRule = {
  id: string;
  enabled: boolean;
  name: string;
  /** 매칭 조건: 사전 정의된 Alert Rule (복수 선택, 1건 이상) */
  matchedRules: string[];
  /** 매칭 조건: Severity (정책 3-3, 필수) */
  severity: DeliverySeverity;
  /** Acknowledge 시 알림을 끄는 시간 (분) */
  muteMinutes: number;
  targets: DeliveryTarget[];
};

const MOCK_RULES: DeliveryRule[] = [
  {
    id: 'drule-1',
    enabled: true,
    name: 'Ops Slack',
    matchedRules: ['HighCpuUsage Rule', 'DiskSpaceLow Rule', 'PodCrashLoop Rule'],
    severity: 'Critical',
    muteMinutes: 30,
    targets: [
      {
        id: 't1',
        channel: 'Slack',
        recipient: 'https://hooks.slack.com/services/T024BE7LD/B4QQ8KF9R',
      },
    ],
  },
  {
    id: 'drule-2',
    enabled: true,
    name: 'Ops Email',
    matchedRules: ['LogRateSpike Rule', 'MemoryPressure Rule'],
    severity: 'Warning',
    muteMinutes: 30,
    targets: [{ id: 't2', channel: 'Email', recipient: 'ops@thakicloud.net' }],
  },
  {
    id: 'drule-3',
    enabled: false,
    name: 'Cert Expiry → On-call',
    matchedRules: ['CertExpiry Rule'],
    severity: 'Warning',
    muteMinutes: 60,
    targets: [
      { id: 't3', channel: 'Email', recipient: 'oncall@thakicloud.net' },
      {
        id: 't4',
        channel: 'Slack',
        recipient: 'https://hooks.slack.com/services/T024BE7LD/B7XX2ON3C',
      },
    ],
  },
];

const MAX_RULE_NAME = 100;

// ── Badge / Pill helpers ───────────────────────────────────────────────────────

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${
        enabled
          ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]'
          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] border border-[var(--color-border-default)]'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-[var(--color-state-success)]' : 'bg-[var(--color-text-subtle)]'}`}
      />
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  );
}

// ── Routing Rule Form Drawer ──────────────────────────────────────────────────

let targetSeq = 100;
const newTargetId = () => `t-${targetSeq++}`;

type RuleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initial?: DeliveryRule | null;
  existingNames: string[];
  // Status는 폼에서 다루지 않는다 — 생성 시 Enabled, 이후 리스트 Action 메뉴에서 토글 (정책)
  onSave: (rule: Omit<DeliveryRule, 'id' | 'enabled'>) => void;
};

function RoutingRuleFormDrawer({ isOpen, onClose, initial, existingNames, onSave }: RuleFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [matchedRules, setMatchedRules] = useState<string[]>(initial?.matchedRules ?? []);
  const [severity, setSeverity] = useState<DeliverySeverity | ''>(initial?.severity ?? '');
  const [muteMinutes, setMuteMinutes] = useState<string>(String(initial?.muteMinutes ?? 30));
  const [targets, setTargets] = useState<DeliveryTarget[]>(
    initial?.targets?.length
      ? initial.targets
      : [{ id: newTargetId(), channel: 'Email', recipient: '' }]
  );
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});
  const [errors, setErrors] = useState<{
    name?: string;
    rules?: string;
    severity?: string;
    mute?: string;
    targets?: string;
  }>({});

  const toggleRule = (ruleName: string) =>
    setMatchedRules((prev) =>
      prev.includes(ruleName) ? prev.filter((r) => r !== ruleName) : [...prev, ruleName]
    );

  const updateTarget = (id: string, patch: Partial<DeliveryTarget>) =>
    setTargets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addTarget = () =>
    setTargets((prev) => [...prev, { id: newTargetId(), channel: 'Email', recipient: '' }]);
  const removeTarget = (id: string) =>
    setTargets((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev));

  // Test Send (정책 3-3): 실제 Alert 없이 설정된 채널/대상으로 검증. Rate limit 등은 mock 생략.
  const testSend = (id: string) => {
    setTestStatus((prev) => ({ ...prev, [id]: 'Pending' }));
    setTimeout(() => {
      const recipient = targets.find((t) => t.id === id)?.recipient ?? '';
      const ok =
        recipient.trim().length > 0 && (recipient.includes('@') || recipient.startsWith('http'));
      setTestStatus((prev) => ({ ...prev, [id]: ok ? 'Success' : 'Failed' }));
    }, 700);
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Rule Name is required.';
    else if (existingNames.filter((n) => n !== initial?.name).includes(name.trim()))
      next.name = 'A rule with this name already exists.';
    if (matchedRules.length === 0) next.rules = 'Select at least one Alert Rule.';
    if (!severity) next.severity = 'Severity is required.';
    const mute = Number(muteMinutes);
    if (muteMinutes === '' || Number.isNaN(mute) || mute < 0)
      next.mute = 'Mute time must be 0 or greater.';
    if (targets.every((t) => !t.recipient.trim()))
      next.targets = 'At least one address is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      matchedRules,
      severity: severity as DeliverySeverity,
      muteMinutes: Number(muteMinutes),
      targets: targets.filter((t) => t.recipient.trim()),
    });
    onClose();
  };

  const testBadge = (status: TestStatus) => {
    if (status === 'idle' || !status) return null;
    const map: Record<Exclude<TestStatus, 'idle'>, string> = {
      Pending: 'text-[var(--color-text-subtle)]',
      Success: 'text-[var(--color-state-success)]',
      Failed: 'text-[var(--color-state-danger)]',
    };
    return (
      <span className={`text-body-sm font-medium ${map[status as Exclude<TestStatus, 'idle'>]}`}>
        {status}
      </span>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Delivery Rule' : 'New Delivery Rule'}
      width={460}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Rule Name */}
        <FormField label="Rule Name" required error={!!errors.name} errorMessage={errors.name}>
          <Input
            placeholder="e.g. Critical → Ops Slack"
            value={name}
            onChange={(e) => {
              setName(e.target.value.slice(0, MAX_RULE_NAME));
              setErrors((p) => ({ ...p, name: undefined }));
            }}
            fullWidth
          />
        </FormField>

        {/* Rule (matched Alert Rules, multi-select) */}
        <FormField
          label="Rule"
          required
          errorMessage={errors.rules}
          helperText="Select one or more predefined Alert Rules to match."
        >
          {/* TDS Checkbox 목록 — 커스텀 pill 대신 표준 컴포넌트 사용 */}
          <VStack
            gap={2}
            className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]"
          >
            {PREDEFINED_ALERT_RULES.map((r) => (
              <Checkbox
                key={r.id}
                label={r.name}
                checked={matchedRules.includes(r.name)}
                onChange={() => {
                  toggleRule(r.name);
                  setErrors((p) => ({ ...p, rules: undefined }));
                }}
              />
            ))}
          </VStack>
        </FormField>

        {/* Severity — 정책 3-3: 필수 Dropdown (Warning/Critical) */}
        <FormField
          label="Severity"
          required
          error={!!errors.severity}
          errorMessage={errors.severity}
        >
          <Select
            options={[
              { value: 'Critical', label: 'Critical' },
              { value: 'Warning', label: 'Warning' },
            ]}
            value={severity}
            placeholder="Select severity"
            onChange={(v) => {
              setSeverity(v as DeliverySeverity);
              setErrors((p) => ({ ...p, severity: undefined }));
            }}
            fullWidth
          />
        </FormField>

        {/* Mute time */}
        <FormField
          label="Mute time (min)"
          required
          error={!!errors.mute}
          errorMessage={errors.mute}
          helperText="Duration (minutes) to suppress repeat notifications after Acknowledge."
        >
          <Input
            type="number"
            min={0}
            placeholder="30"
            value={muteMinutes}
            onChange={(e) => {
              setMuteMinutes(e.target.value);
              setErrors((p) => ({ ...p, mute: undefined }));
            }}
            fullWidth
          />
        </FormField>

        {/* Targets (repeatable) */}
        <FormField
          label="Targets"
          required
          errorMessage={errors.targets}
          helperText="Add at least one target. Choose a channel, then enter the address to deliver alerts to."
        >
          <VStack gap={3} className="w-full">
            {targets.map((t) => (
              <div
                key={t.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-3"
              >
                {/* Channel(Select)과 Target(Text input)을 분리된 라벨 필드로 표시 */}
                <HStack gap={2} align="start" justify="between" className="w-full">
                  <VStack gap={3} className="flex-1">
                    <FormField label="Channel">
                      <Select
                        options={[
                          { value: 'Email', label: 'Email' },
                          { value: 'Slack', label: 'Slack' },
                        ]}
                        value={t.channel}
                        onChange={(v) => updateTarget(t.id, { channel: v as DeliveryChannel })}
                        fullWidth
                      />
                    </FormField>
                    <FormField label="Address">
                      <Input
                        placeholder={
                          t.channel === 'Slack' ? 'Slack channel URL' : 'email@example.com'
                        }
                        value={t.recipient}
                        onChange={(e) => {
                          updateTarget(t.id, { recipient: e.target.value });
                          setErrors((p) => ({ ...p, targets: undefined }));
                        }}
                        fullWidth
                      />
                    </FormField>
                  </VStack>
                  <button
                    type="button"
                    onClick={() => removeTarget(t.id)}
                    disabled={targets.length <= 1}
                    title="Remove target"
                    className="mt-1.5 p-1 rounded-[var(--radius-md)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-subtle)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <IconX size={16} />
                  </button>
                </HStack>
                {/* 왼쪽 정렬, 전송 상태는 버튼 오른쪽에 표시 */}
                <HStack gap={2} align="center" justify="start" className="mt-2">
                  <button
                    type="button"
                    onClick={() => testSend(t.id)}
                    className="inline-flex items-center gap-1 text-body-sm font-medium text-[var(--color-action-primary)] hover:underline"
                  >
                    <IconSend size={13} /> Test Send
                  </button>
                  {testBadge(testStatus[t.id] ?? 'idle')}
                </HStack>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconPlus size={12} />}
              onClick={addTarget}
            >
              Add target
            </Button>
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AlertDeliverySettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rules, setRules] = useState<DeliveryRule[]>(MOCK_RULES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DeliveryRule | null>(null);
  // Delete는 즉시 실행하지 않고 ConfirmModal로 확인 후 진행 (다른 리소스 삭제 패턴과 동일)
  const [deleteTarget, setDeleteTarget] = useState<DeliveryRule | null>(null);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 240 : 40;

  const deleteRule = (id: string) => setRules((prev) => prev.filter((r) => r.id !== id));
  const openAdd = () => {
    setEditTarget(null);
    setDrawerOpen(true);
  };
  const openEdit = (rule: DeliveryRule) => {
    setEditTarget(rule);
    setDrawerOpen(true);
  };

  const handleSave = (data: Omit<DeliveryRule, 'id' | 'enabled'>) => {
    if (editTarget) {
      // 수정 시 Status는 건드리지 않는다 (Action 메뉴에서만 토글)
      setRules((prev) => prev.map((r) => (r.id === editTarget.id ? { ...r, ...data } : r)));
    } else {
      // 새 Rule의 첫 상태는 항상 Enabled
      setRules((prev) => [...prev, { ...data, enabled: true, id: `drule-${Date.now()}` }]);
    }
  };

  // Enable/Disable 즉시 토글 — 리스트 Action 메뉴 전용
  const toggleEnabled = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  // ── TDS Table columns (raw <table> 대신 TDS Table 사용) ──────────────────────
  const columns: TableColumn<DeliveryRule>[] = [
    {
      key: 'enabled',
      label: 'Status',
      width: fixedColumns.statusLabel,
      resizable: false,
      render: (_: any, row: DeliveryRule) => <StatusBadge enabled={row.enabled} />,
    },
    {
      key: 'name',
      label: 'Rule Name',
      width: '200px',
      resizable: false,
      render: (_: any, row: DeliveryRule) => (
        <span
          className={`text-body-md font-medium ${row.enabled ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}`}
        >
          {row.name}
        </span>
      ),
    },
    {
      key: 'matchedRules',
      label: 'Rule',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: any, row: DeliveryRule) => (
        // TDS BadgeList — maxVisible 초과분은 "+N" 배지 + Popover로 표시
        <BadgeList
          items={row.matchedRules}
          maxVisible={2}
          popoverTitle={`All rules (${row.matchedRules.length})`}
        />
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      width: fixedColumns.statusLabel,
      resizable: false,
      render: (_: any, row: DeliveryRule) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium ${
            row.severity === 'Critical'
              ? 'text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]'
              : 'text-[var(--color-state-warning)] bg-[var(--color-state-warning-bg)]'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: 'targets',
      label: 'Targets',
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: any, row: DeliveryRule) => {
        // 채널별 묶음 — "Slack: #a, #b" / "Email: x@y, z@y" 평문 표기 (아이콘·뱃지 없음)
        const byChannel: { channel: DeliveryChannel; recipients: string[] }[] = [];
        for (const t of row.targets) {
          const g = byChannel.find((b) => b.channel === t.channel);
          if (g) g.recipients.push(t.recipient);
          else byChannel.push({ channel: t.channel, recipients: [t.recipient] });
        }
        return (
          <VStack gap={1}>
            {byChannel.map((g) => (
              <span
                key={g.channel}
                className="text-body-sm text-[var(--color-text-subtle)] truncate"
              >
                {g.channel}: {g.recipients.join(', ')}
              </span>
            ))}
          </VStack>
        );
      },
    },
    {
      key: '_actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, row: DeliveryRule) => {
        const items: ContextMenuItem[] = [
          { id: 'edit', label: 'Edit', onClick: () => openEdit(row) },
          {
            id: 'toggle-enabled',
            label: row.enabled ? 'Disable' : 'Enable',
            onClick: () => toggleEnabled(row.id),
          },
          { id: 'delete', label: 'Delete', status: 'danger', onClick: () => setDeleteTarget(row) },
        ];
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
      sidebar={<AlertSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
                { label: 'prod-cluster-01', href: '/alerts/board' },
                { label: 'Delivery Settings' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader
          title="Delivery Settings"
          actions={
            <Button variant="primary" size="sm" onClick={openAdd}>
              New Rule
            </Button>
          }
        />

        <p className="text-body-md text-[var(--color-text-subtle)]">
          Alerts are delivered to all matching Enabled rules. There is no priority — every matched
          rule receives the notification.
        </p>

        {/* Rules table — TDS Table 컴포넌트 */}
        <Table<DeliveryRule>
          columns={columns}
          data={rules}
          rowKey="id"
          resizable={false}
          emptyMessage={'No delivery rules yet. Create one with "New Rule".'}
        />
      </VStack>

      <RoutingRuleFormDrawer
        key={editTarget?.id ?? 'new'}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editTarget}
        existingNames={rules.map((r) => r.name)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal — 리소스 삭제 공통 패턴 (ComputeAdminImagesPage 참조) */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete delivery rule"
        description="Removing the selected delivery rule is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Rule Name"
        infoValue={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) deleteRule(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </PageShell>
  );
}
