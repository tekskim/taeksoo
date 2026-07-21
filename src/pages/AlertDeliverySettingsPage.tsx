import { useState, useRef } from 'react';
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
  Toggle,
  Checkbox,
  BadgeList,
  ConfirmModal,
  Table,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
  ContextMenu,
  type ContextMenuItem,
  useToast,
  StatusIndicator,
  SearchInput,
  Pagination,
  SelectionIndicator,
  InlineMessage,
} from '@/design-system';
import { AlertSidebar } from '@/components/AlertSidebar';
import { useTabs } from '@/contexts/TabContext';
import { PREDEFINED_ALERT_RULES } from '@/mocks/alertRules';
import {
  IconCirclePlus,
  IconX,
  IconCheck,
  IconLoader2,
  IconRefresh,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';

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

// ── 채널 그룹형 입력 상태 (UI 전용; 저장 시 다시 DeliveryTarget[] 평면 배열로 변환) ──
const CHANNELS: DeliveryChannel[] = ['Email', 'Slack'];
type TargetRow = { id: string; recipient: string };
type ChannelState = { enabled: boolean; rows: TargetRow[] };

function initChannelState(targets?: DeliveryTarget[]): Record<DeliveryChannel, ChannelState> {
  const base: Record<DeliveryChannel, ChannelState> = {
    Email: { enabled: false, rows: [] },
    Slack: { enabled: false, rows: [] },
  };
  for (const t of targets ?? []) {
    base[t.channel].enabled = true;
    base[t.channel].rows.push({ id: newTargetId(), recipient: t.recipient });
  }
  // 각 채널은 최소 1행 유지
  for (const ch of CHANNELS) {
    if (base[ch].rows.length === 0) base[ch].rows = [{ id: newTargetId(), recipient: '' }];
  }
  // Notification Center가 기본 채널(항상 ON)이므로 Email·Slack은 기본 OFF(선택적 토글).
  return base;
}

const CHANNEL_PLACEHOLDER: Record<DeliveryChannel, string> = {
  Email: 'email@example.com',
  Slack: 'Slack channel URL',
};

/** Notification Center 수신 대상 — 시스템 내 User / User Group 선택(체크박스). */
type NCRecipients = { users: string[]; userGroups: string[] };

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
  /**
   * Notification Center(기본 채널) 수신 대상. 항상 적용되며 토글이 없다.
   * 선택된 User/User Group은 NC 알림을 받고, 각 User의 Email로도 기본 발송된다.
   */
  notificationCenter: NCRecipients;
  /** 선택 채널(Email/Slack)의 외부 직접 입력 대상 */
  targets: DeliveryTarget[];
  /**
   * 규칙 소유자(생성자) 이메일. 정책 0-2: 소유권 기반 접근 제어는 앱 레벨에서 처리한다.
   * Domain User는 본인 소유 규칙만 수정·삭제 가능 — 타인 규칙은 백엔드가 403을 반환한다.
   */
  owner: string;
};

// 현재 로그인 사용자(목업). Domain User 시나리오로 가정 — 본인 소유 규칙만 수정·삭제 가능.
const CURRENT_USER = 'taeksoo.kim@thakicloud.co.kr';

// ── Notification Center 수신 대상 mock (User / User Group) ──────────────────────
// 화면설계서 참고: 체크박스로 select 하는 리스트(table). User는 IAM Users, Group은 IAM User Groups.
// User 테이블은 Username + Email만 표시. User Group 테이블은 그룹명만 표시.
type RecipientUser = { id: string; username: string; email: string };
type RecipientGroup = { id: string; name: string };

const MOCK_USERS: RecipientUser[] = [
  { id: 'u-1', username: 'thaki-lee', email: 'thaki-lee@thakicloud.co.kr' },
  { id: 'u-2', username: 'thaki-park', email: 'thaki-park@thakicloud.co.kr' },
  { id: 'u-3', username: 'thaki-choi', email: 'thaki-choi@thakicloud.co.kr' },
  { id: 'u-4', username: 'thaki-jung', email: 'thaki-jung@thakicloud.co.kr' },
  { id: 'u-5', username: 'admin-user', email: 'admin@thakicloud.co.kr' },
  { id: 'u-6', username: 'ops-user', email: 'ops@thakicloud.co.kr' },
  { id: 'u-7', username: 'support-user', email: 'support@thakicloud.co.kr' },
  { id: 'u-8', username: 'security-user', email: 'security@thakicloud.co.kr' },
  { id: 'u-9', username: 'viewer-user', email: 'viewer@thakicloud.co.kr' },
  { id: 'u-10', username: 'analyst-user', email: 'analyst@thakicloud.co.kr' },
  { id: 'u-11', username: 'manager-user', email: 'manager@thakicloud.co.kr' },
  { id: 'u-12', username: 'finance-user', email: 'finance@thakicloud.co.kr' },
];

const MOCK_USER_GROUPS: RecipientGroup[] = [
  { id: 'g-1', name: 'dev-admin-group' },
  { id: 'g-2', name: 'ops-team' },
  { id: 'g-3', name: 'qa-team' },
  { id: 'g-4', name: 'developers' },
  { id: 'g-5', name: 'administrators' },
  { id: 'g-6', name: 'security' },
  { id: 'g-7', name: 'viewers' },
  { id: 'g-8', name: 'on-call' },
];

const userLabel = (id: string) => MOCK_USERS.find((u) => u.id === id)?.username ?? id;
const groupLabel = (id: string) => MOCK_USER_GROUPS.find((g) => g.id === id)?.name ?? id;

const MOCK_RULES: DeliveryRule[] = [
  {
    id: 'drule-1',
    enabled: true,
    name: 'Ops Slack',
    matchedRules: ['HighCpuUsage Rule', 'DiskSpaceLow Rule', 'PodCrashLoop Rule'],
    severity: 'Critical',
    muteMinutes: 30,
    owner: CURRENT_USER, // 내가 만든 규칙 → 수정·삭제 가능
    notificationCenter: { users: ['u-1', 'u-2'], userGroups: ['g-2'] },
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
    owner: 'kim@thakicloud.co.kr', // 타인 규칙 → 수정·삭제 시 403
    notificationCenter: { users: ['u-6'], userGroups: [] },
    targets: [{ id: 't2', channel: 'Email', recipient: 'ops@thakicloud.net' }],
  },
  {
    id: 'drule-3',
    enabled: false,
    name: 'Cert Expiry → On-call',
    matchedRules: ['CertExpiry Rule'],
    severity: 'Warning',
    muteMinutes: 60,
    owner: 'park@thakicloud.co.kr', // 타인 규칙 → 수정·삭제 시 403
    notificationCenter: { users: [], userGroups: ['g-8'] },
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

// 정책(Status 정의): TDS StatusIndicator label-only badge.
// Enabled→Success(Green), Disabled→Muted(Gray) — 둘 다 TDS 기본 status로 존재.
function StatusBadge({ enabled }: { enabled: boolean }) {
  return <StatusIndicator status={enabled ? 'enabled' : 'disabled'} layout="badge" hideIcon />;
}

// ── Notification Center Recipient 선택 테이블 ─────────────────────────────────
// 검색 + 페이지네이션 + 체크박스 Table + 선택 칩(SelectionIndicator). 화면설계서 참고.
function RecipientSelectTable<T extends { id: string }>({
  label,
  columns,
  data,
  searchOf,
  selected,
  onChange,
  labelOf,
  placeholder,
  error,
  errorMessage,
}: {
  label: string;
  columns: TableColumn<T>[];
  data: T[];
  searchOf: (row: T) => string;
  selected: string[];
  onChange: (ids: string[]) => void;
  labelOf: (id: string) => string;
  placeholder: string;
  error?: boolean;
  errorMessage?: string;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;
  const filtered = data.filter((r) => searchOf(r).toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  return (
    <VStack gap={2} className="w-full">
      <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
      <SearchInput
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        onClear={() => {
          setQuery('');
          setPage(1);
        }}
        size="sm"
        className="w-[var(--search-input-width)]"
      />
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        selectedCount={selected.length}
      />
      <Table<T>
        columns={columns}
        data={paged}
        rowKey="id"
        selectable
        selectedKeys={selected}
        onSelectionChange={onChange}
        resizable={false}
      />
      <SelectionIndicator
        selectedItems={selected.map((id) => ({ id, label: labelOf(id) }))}
        onRemove={(id) => onChange(selected.filter((s) => s !== id))}
        error={error}
        errorMessage={errorMessage}
      />
    </VStack>
  );
}

// User / User Group 선택 테이블 컬럼 (드로어 폭에 맞춘 컴팩트 구성)
// User 테이블: Username + Email 주소만 표시
const NC_USER_COLUMNS: TableColumn<RecipientUser>[] = [
  {
    key: 'username',
    label: 'Username',
    flex: 1,
    minWidth: columnMinWidths.username,
    render: (_: any, row: RecipientUser) => (
      <span className="text-label-md text-[var(--color-action-primary)] truncate">
        {row.username}
      </span>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    flex: 1,
    minWidth: columnMinWidths.name,
    render: (_: any, row: RecipientUser) => (
      <span className="text-body-sm text-[var(--color-text-subtle)] truncate">{row.email}</span>
    ),
  },
];

// User Group 테이블: 그룹명만 표시
const NC_GROUP_COLUMNS: TableColumn<RecipientGroup>[] = [
  {
    key: 'name',
    label: 'User group',
    flex: 1,
    minWidth: columnMinWidths.name,
    render: (_: any, row: RecipientGroup) => (
      <span className="text-label-md text-[var(--color-action-primary)] truncate">{row.name}</span>
    ),
  },
];

// ── Routing Rule Form Drawer ──────────────────────────────────────────────────

let targetSeq = 100;
const newTargetId = () => `t-${targetSeq++}`;

type RuleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initial?: DeliveryRule | null;
  existingNames: string[];
  // Status/owner는 폼에서 다루지 않는다 — 생성 시 Enabled+현재 사용자, 이후 리스트 Action 메뉴에서 토글 (정책)
  // 반환값 false면 저장 거부(예: 403) — 드로어를 닫지 않고 입력을 유지한다.
  onSave: (rule: Omit<DeliveryRule, 'id' | 'enabled' | 'owner'>) => boolean;
};

function RoutingRuleFormDrawer({ isOpen, onClose, initial, existingNames, onSave }: RuleFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [matchedRules, setMatchedRules] = useState<string[]>(initial?.matchedRules ?? []);
  const [severity, setSeverity] = useState<DeliverySeverity | ''>(initial?.severity ?? '');
  const [muteMinutes, setMuteMinutes] = useState<string>(String(initial?.muteMinutes ?? 30));
  // 채널 그룹형: Email/Slack 고정 섹션 + 채널별 enabled + 복수 Target 행
  const [channels, setChannels] = useState<Record<DeliveryChannel, ChannelState>>(() =>
    initChannelState(initial?.targets)
  );
  // Notification Center(기본 채널) 수신 대상 — User 체크박스 선택
  // (엔지니어링 모드 = System domain: IAM User groups 개념이 없어 User groups 선택 UI는 두지 않는다.)
  const [ncUsers, setNcUsers] = useState<string[]>(initial?.notificationCenter.users ?? []);
  // User groups는 이 화면에서 선택하지 않는다. 기존 규칙 데이터의 값은 저장 시 그대로 보존한다.
  const ncGroups = initial?.notificationCenter.userGroups ?? [];
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});
  // 한 번이라도 Test Send 한 행은 idle 라벨을 'Resend'로 표시 (값 수정 시 false로 리셋)
  const [tested, setTested] = useState<Record<string, boolean>>({});

  // Notification Center가 기본 채널(항상 ON)이므로 Email·Slack은 자유롭게 on/off 가능
  // (둘 다 off여도 최소 1채널 요건은 NC가 충족).
  const toggleChannel = (ch: DeliveryChannel) => {
    setChannels((prev) => ({ ...prev, [ch]: { ...prev[ch], enabled: !prev[ch].enabled } }));
    setErrors((p) => ({ ...p, targets: undefined }));
  };
  const updateRow = (ch: DeliveryChannel, id: string, recipient: string) => {
    // 값이 바뀌면 이전 Test Send 결과·이력은 무효 → idle/Test Send로 리셋 (타이머 정리)
    clearTestTimers(id);
    setTestStatus((prev) => ({ ...prev, [id]: 'idle' }));
    setTested((prev) => ({ ...prev, [id]: false }));
    setChannels((prev) => ({
      ...prev,
      [ch]: {
        ...prev[ch],
        rows: prev[ch].rows.map((r) => (r.id === id ? { ...r, recipient } : r)),
      },
    }));
    setErrors((p) => ({ ...p, targets: undefined }));
  };
  const addRow = (ch: DeliveryChannel) =>
    setChannels((prev) => ({
      ...prev,
      [ch]: { ...prev[ch], rows: [...prev[ch].rows, { id: newTargetId(), recipient: '' }] },
    }));
  const removeRow = (ch: DeliveryChannel, id: string) =>
    setChannels((prev) => ({
      ...prev,
      [ch]: {
        ...prev[ch],
        rows: prev[ch].rows.length > 1 ? prev[ch].rows.filter((r) => r.id !== id) : prev[ch].rows,
      },
    }));
  const [errors, setErrors] = useState<{
    name?: string;
    rules?: string;
    severity?: string;
    mute?: string;
    nc?: string;
    targets?: string;
  }>({});

  const toggleRule = (ruleName: string) =>
    setMatchedRules((prev) =>
      prev.includes(ruleName) ? prev.filter((r) => r !== ruleName) : [...prev, ruleName]
    );

  // Test Send 결과는 버튼 자체에 표시(Sending…→Sent/Failed). 결과는 2초 후 자동으로
  // Test Send로 복귀하고, 행 값 수정 시 즉시 리셋(updateRow). 타이머는 행 id별 추적.
  const testTimers = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});
  const clearTestTimers = (id: string) => {
    (testTimers.current[id] || []).forEach(clearTimeout);
    testTimers.current[id] = [];
  };
  // 화면 이탈 정책 (와이어프레임 ALERT-003):
  //  - 닫기 시 '미저장 변경'이 있으면 TDS 가이드라인에 따라 확인 모달을 띄운다(아래 isDirty).
  //  - 최종적으로 닫히면(또는 변경이 없어 바로 닫히면) FE의 Test Send 상태는 즉시 초기화한다.
  //  - 이미 나간 BE 발송 요청은 취소하지 않고 "유기(orphan)"한다 — test 발송이라 롤백 불필요.
  //  - 유기된 요청의 늦은 응답은 FE에서 받지 않는다 → genRef 세대 불일치로 무시한다.
  //  - 새 드로어는 새 세션(remount)으로 열려 필드가 초기화되고 requestId도 새로 시작한다.
  // genRef: 현재 드로어 세션의 세대. 닫을 때 +1 하여 이전 세션의 응답을 모두 유기 처리.
  const genRef = useRef(0);
  // reqSeqRef: 이 세션에서 발급한 Test Send 요청의 일련번호(요청별 requestId 소스).
  const reqSeqRef = useRef(0);

  // Test Send (정책 3-3): 각 Target 단위로 검증 발송. Rate limit 등은 mock 생략.
  const testSend = (recipient: string, id: string) => {
    clearTestTimers(id);
    const gen = genRef.current; // 이 요청이 속한 세션 세대를 캡처
    const requestId = `req-${gen}-${(reqSeqRef.current += 1)}`; // 세션별 고유 requestId
    void requestId; // mock: 실제 네트워크 대신 setTimeout으로 BE 응답을 시뮬레이션
    setTested((prev) => ({ ...prev, [id]: true }));
    setTestStatus((prev) => ({ ...prev, [id]: 'Pending' }));
    const t1 = setTimeout(() => {
      // 드로어가 닫혀 세대가 바뀌었으면(Cancel로 유기됨) 늦은 응답을 버린다.
      if (gen !== genRef.current) return;
      const ok =
        recipient.trim().length > 0 && (recipient.includes('@') || recipient.startsWith('http'));
      setTestStatus((prev) => ({ ...prev, [id]: ok ? 'Success' : 'Failed' }));
      const t2 = setTimeout(() => {
        if (gen !== genRef.current) return;
        setTestStatus((prev) => ({ ...prev, [id]: 'idle' }));
      }, 2000);
      testTimers.current[id] = [t2];
    }, 700);
    testTimers.current[id] = [t1];
  };

  // Cancel/저장 후 닫기 공통: 진행 중 요청을 유기하고 FE 상태만 초기화한다.
  // (BE 요청 자체는 취소하지 않는다 — 세대만 올려 이후 도착하는 늦은 응답을 무시.)
  const orphanInflightTests = () => {
    genRef.current += 1;
    setTestStatus({});
    setTested({});
  };
  // 미저장 변경 확인 (TDS 가이드라인): 초기 상태 대비 변경이 있으면 닫기 전에 확인 모달을 띄운다.
  // (Test Send 진행 여부는 '변경'으로 보지 않는다 — 규칙 데이터에 영향이 없으므로.)
  const buildSnapshot = (v: {
    name: string;
    matchedRules: string[];
    severity: DeliverySeverity | '';
    muteMinutes: string;
    ncUsers: string[];
    ncGroups: string[];
    channels: Record<DeliveryChannel, ChannelState>;
  }) =>
    JSON.stringify({
      name: v.name.trim(),
      rules: [...v.matchedRules].sort(),
      severity: v.severity,
      mute: v.muteMinutes.trim(),
      ncUsers: [...v.ncUsers].sort(),
      ncGroups: [...v.ncGroups].sort(),
      // Target 행의 id는 세션마다 새로 생성되므로 비교에서 제외하고 recipient만 본다.
      channels: CHANNELS.map((c) => ({
        enabled: v.channels[c].enabled,
        targets: v.channels[c].rows.map((r) => r.recipient.trim()),
      })),
    });
  // 초기 스냅샷: 마운트 시점(=드로어 오픈)의 초기값으로 한 번만 계산.
  const initialSnapshot = useRef(
    buildSnapshot({
      name: initial?.name ?? '',
      matchedRules: initial?.matchedRules ?? [],
      severity: initial?.severity ?? '',
      muteMinutes: String(initial?.muteMinutes ?? 30),
      ncUsers: initial?.notificationCenter.users ?? [],
      ncGroups: initial?.notificationCenter.userGroups ?? [],
      channels: initChannelState(initial?.targets),
    })
  ).current;
  const isDirty =
    buildSnapshot({ name, matchedRules, severity, muteMinutes, ncUsers, ncGroups, channels }) !==
    initialSnapshot;

  const [confirmClose, setConfirmClose] = useState(false);
  const requestClose = () => {
    // 미저장 변경이 있으면 확인 모달로 한 번 더 묻는다. 변경이 없으면 바로 닫는다.
    if (isDirty) {
      setConfirmClose(true);
      return;
    }
    orphanInflightTests();
    onClose();
  };
  // 확인 모달에서 최종적으로 '닫기'를 선택 → 진행 중 Test Send 유기 + 닫기.
  // (다음 오픈은 remount로 새 세션이 되어 필드·requestId가 초기화된다.)
  const discardAndClose = () => {
    setConfirmClose(false);
    orphanInflightTests();
    onClose();
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
    // Notification Center(기본 채널)는 최소 1명의 수신 대상(User)이 필요
    if (ncUsers.length === 0) next.nc = 'Select at least one user for the Notification Center.';
    // 켜진 Email/Slack 채널은 각각 최소 1개의 유효한 Target이 필요
    const enabledChannels = CHANNELS.filter((c) => channels[c].enabled);
    if (enabledChannels.some((c) => channels[c].rows.every((r) => !r.recipient.trim())))
      next.targets = 'Each enabled channel needs at least one target.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 채널 그룹 → 평면 DeliveryTarget[]로 변환 (켜진 채널의 비어있지 않은 행만)
  const collectTargets = (): DeliveryTarget[] =>
    CHANNELS.filter((c) => channels[c].enabled).flatMap((c) =>
      channels[c].rows
        .filter((r) => r.recipient.trim())
        .map((r) => ({ id: r.id, channel: c, recipient: r.recipient.trim() }))
    );

  const handleSave = () => {
    if (!validate()) return;
    const ok = onSave({
      name: name.trim(),
      matchedRules,
      severity: severity as DeliverySeverity,
      muteMinutes: Number(muteMinutes),
      notificationCenter: { users: ncUsers, userGroups: ncGroups },
      targets: collectTargets(),
    });
    // 저장이 거부되면(403 등) 드로어를 유지해 입력을 보존한다.
    if (ok) {
      orphanInflightTests();
      onClose();
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={requestClose}
        title={initial ? 'Edit Delivery Rule' : 'New Delivery Rule'}
        width={760}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={requestClose} className="flex-1">
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

          {/* Channel — Notification Center(기본, 토글 없음) + Email/Slack(선택 토글) */}
          <FormField label="Channel" required errorMessage={errors.targets}>
            <VStack gap={3} className="w-full">
              {/* Notification Center — 기본 채널: 토글 없이 항상 적용 */}
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-3">
                <HStack gap={2} align="center" justify="between" className="w-full">
                  <HStack gap={2} align="center">
                    <span className="text-body-md font-medium text-[var(--color-text-default)]">
                      Notification Center
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-body-sm font-medium text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)]">
                      Default · Always on
                    </span>
                  </HStack>
                </HStack>

                <VStack gap={3} className="mt-3 w-full">
                  {/* NC 채널의 수신 대상(Users) — 한 단계 들여쓰기 + 좌측 보더로
                    Notification Center 하위(target)임을 시각적으로 표시.
                    엔지니어링 모드(System domain)는 IAM User groups 개념이 없어 User groups 테이블을 두지 않는다. */}
                  <VStack
                    gap={4}
                    className="w-full pl-4 border-l-2 border-[var(--color-border-default)]"
                  >
                    <RecipientSelectTable<RecipientUser>
                      label="Users"
                      columns={NC_USER_COLUMNS}
                      data={MOCK_USERS}
                      searchOf={(r) => `${r.username} ${r.email}`}
                      selected={ncUsers}
                      onChange={(ids) => {
                        setNcUsers(ids);
                        setErrors((p) => ({ ...p, nc: undefined }));
                      }}
                      labelOf={userLabel}
                      placeholder="Search users by attributes"
                      error={!!errors.nc}
                      errorMessage={errors.nc}
                    />
                  </VStack>
                  {/* 선택 대상 안내 (정책): NC 수신 + 각 User Email 기본 발송 */}
                  <InlineMessage variant="info">
                    Selected users receive this alert in the Notification Center, and each selected
                    user is also emailed by default.
                  </InlineMessage>
                </VStack>
              </div>

              {/* Email / Slack — 선택 채널(토글 on/off). NC가 기본 채널이라 둘 다 off 가능 */}
              {CHANNELS.map((ch) => {
                const cs = channels[ch];
                const off = !cs.enabled;
                return (
                  <div
                    key={ch}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-3"
                  >
                    {/* 채널 헤더: 이름 + 사용 토글 */}
                    <HStack gap={2} align="center" justify="between" className="w-full">
                      <span className="text-body-md font-medium text-[var(--color-text-default)]">
                        {ch}
                      </span>
                      <Toggle
                        checked={cs.enabled}
                        onChange={() => toggleChannel(ch)}
                        aria-label={`${ch} 채널 사용`}
                      />
                    </HStack>

                    {/* 채널 off면 입력 영역(대상·Test Send·삭제·추가)을 숨김. on하면 표시 */}
                    {!off && (
                      <div className="mt-3">
                        <VStack gap={1.5} className="w-full">
                          {cs.rows.map((r) => (
                            <HStack key={r.id} gap={2} align="center" className="w-full">
                              <div className="flex-1">
                                <Input
                                  placeholder={CHANNEL_PLACEHOLDER[ch]}
                                  value={r.recipient}
                                  disabled={off}
                                  onChange={(e) => updateRow(ch, r.id, e.target.value)}
                                  fullWidth
                                />
                              </div>
                              {/* Test Send: 결과를 버튼에 표시(Sending…→Sent/Failed→2초후 복귀).
                              결과 상태에서 hover 시 "↻ Resend"로 전환해 재발송 의도를 안내 */}
                              {(() => {
                                const st = testStatus[r.id] ?? 'idle';
                                const empty = !r.recipient.trim();
                                const isResult = st === 'Success' || st === 'Failed';
                                if (isResult) {
                                  const resultCls =
                                    st === 'Success'
                                      ? '!text-[var(--color-state-success)] !border-[var(--color-state-success)]'
                                      : '!text-[var(--color-state-danger)] !border-[var(--color-state-danger)]';
                                  return (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      disabled={off}
                                      onClick={() => testSend(r.recipient, r.id)}
                                      className={`group shrink-0 min-w-[96px] ${resultCls} hover:!text-[var(--color-text-default)] hover:!border-[var(--color-border-strong)]`}
                                    >
                                      <span className="inline-flex items-center gap-1 group-hover:hidden">
                                        {st === 'Success' ? (
                                          <IconCheck size={12} />
                                        ) : (
                                          <IconX size={12} />
                                        )}
                                        {st === 'Success' ? 'Sent' : 'Failed'}
                                      </span>
                                      <span className="hidden items-center gap-1 group-hover:inline-flex">
                                        <IconRefresh size={12} /> Resend
                                      </span>
                                    </Button>
                                  );
                                }
                                const pending = st === 'Pending';
                                // 한 번 보낸 뒤(값 변경 없으면) idle 라벨은 Resend
                                const resend = !pending && tested[r.id];
                                return (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={
                                      pending ? (
                                        <IconLoader2 size={12} className="animate-spin" />
                                      ) : resend ? (
                                        <IconRefresh size={12} />
                                      ) : undefined
                                    }
                                    disabled={off || empty || pending}
                                    onClick={() => testSend(r.recipient, r.id)}
                                    className="shrink-0 min-w-[96px]"
                                  >
                                    {pending ? 'Sending…' : resend ? 'Resend' : 'Test Send'}
                                  </Button>
                                );
                              })()}
                              {/* 삭제: 테두리 없이 X만 (TDS Dynamic Form Field 패턴) */}
                              <button
                                type="button"
                                onClick={() => removeRow(ch, r.id)}
                                disabled={off || cs.rows.length <= 1}
                                aria-label="Remove target"
                                className="shrink-0 size-5 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <IconX size={16} stroke={1.5} />
                              </button>
                            </HStack>
                          ))}
                          {/* Add: TDS Dynamic Form Field "Add Variable" 스타일 (w-fit, 원형 +) */}
                          <div className="w-fit">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              disabled={off}
                              onClick={() => addRow(ch)}
                            >
                              {ch === 'Slack' ? 'Add Slack channel URL' : 'Add email address'}
                            </Button>
                          </div>
                        </VStack>
                      </div>
                    )}
                  </div>
                );
              })}
            </VStack>
          </FormField>
        </VStack>
      </Drawer>

      {/* 미저장 변경 확인 (TDS 가이드라인): 초기 상태 대비 변경이 있을 때만 표시.
          여기서 '닫기'를 선택하면 진행 중 Test Send는 유기되고 다음 오픈은 새 세션으로 시작. */}
      <ConfirmModal
        isOpen={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="Discard unsaved changes?"
        description="You have unsaved changes. If you close now, they will be lost."
        confirmText="Discard changes"
        cancelText="Keep editing"
        confirmVariant="danger"
        onConfirm={discardAndClose}
      />
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AlertDeliverySettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rules, setRules] = useState<DeliveryRule[]>(MOCK_RULES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 드로어를 열 때마다 +1 하여 key를 바꿔 새 세션으로 remount → 필드·Test Send 상태·requestId 초기화.
  const [drawerNonce, setDrawerNonce] = useState(0);
  const [editTarget, setEditTarget] = useState<DeliveryRule | null>(null);
  // Delete는 즉시 실행하지 않고 ConfirmModal로 확인 후 진행 (다른 리소스 삭제 패턴과 동일)
  const [deleteTarget, setDeleteTarget] = useState<DeliveryRule | null>(null);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const toast = useToast();

  const sidebarWidth = sidebarOpen ? 240 : 40;

  // 정책 0-2: 소유권 기반 접근 제어(앱 레벨). Domain User는 본인 소유 규칙만 수정·삭제 가능.
  // 사전 UI 차단 없이 항상 Edit/Delete를 노출하고, 실행 시점에 거부(403)를 토스트로 안내한다.
  const canMutate = (rule: DeliveryRule) => rule.owner === CURRENT_USER;
  const notifyForbidden = (action: 'edit' | 'delete') =>
    toast.error(`You can only ${action} delivery rules you created.`, {
      title: 'Permission denied',
      detail: { code: '403', content: 'This rule is owned by another user.' },
    });

  const deleteRule = (id: string) => setRules((prev) => prev.filter((r) => r.id !== id));
  const openAdd = () => {
    setEditTarget(null);
    setDrawerNonce((n) => n + 1);
    setDrawerOpen(true);
  };
  const openEdit = (rule: DeliveryRule) => {
    setEditTarget(rule);
    setDrawerNonce((n) => n + 1);
    setDrawerOpen(true);
  };

  const handleSave = (data: Omit<DeliveryRule, 'id' | 'enabled' | 'owner'>): boolean => {
    if (editTarget) {
      // 타인 소유 규칙 수정 시도 → 백엔드 403 시뮬레이션: 적용하지 않고 토스트 안내
      if (!canMutate(editTarget)) {
        notifyForbidden('edit');
        return false;
      }
      // 수정 시 Status/owner는 건드리지 않는다 (Action 메뉴에서만 토글)
      setRules((prev) => prev.map((r) => (r.id === editTarget.id ? { ...r, ...data } : r)));
    } else {
      // 새 Rule의 첫 상태는 항상 Enabled, 소유자는 현재 사용자
      setRules((prev) => [
        ...prev,
        { ...data, enabled: true, owner: CURRENT_USER, id: `drule-${Date.now()}` },
      ]);
    }
    return true;
  };

  // Enable/Disable 즉시 토글 — 리스트 Action 메뉴 전용. Status 변경도 '수정'이므로 소유권 검사.
  const toggleEnabled = (rule: DeliveryRule) => {
    if (!canMutate(rule)) {
      notifyForbidden('edit');
      return;
    }
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)));
  };

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
      // 정책 3-2: Channel(발송 수단)과 Target(수신 대상)을 별도 컬럼으로 구분
      key: 'channel',
      label: 'Channel',
      width: '150px',
      resizable: false,
      render: (_: any, row: DeliveryRule) => (
        <VStack gap={1}>
          {/* Notification Center는 기본 채널이라 항상 표시 */}
          <span className="text-body-sm text-[var(--color-text-default)]">Notification Center</span>
          {row.targets.map((t) => (
            <span key={t.id} className="text-body-sm text-[var(--color-text-subtle)]">
              {t.channel}
            </span>
          ))}
        </VStack>
      ),
    },
    {
      key: 'targets',
      label: 'Target',
      flex: 1,
      minWidth: columnMinWidths.node,
      render: (_: any, row: DeliveryRule) => {
        const ncCount =
          row.notificationCenter.users.length + row.notificationCenter.userGroups.length;
        return (
          <VStack gap={1}>
            <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
              {ncCount > 0 ? `${ncCount} recipient${ncCount > 1 ? 's' : ''} (users / groups)` : '-'}
            </span>
            {row.targets.map((t) => (
              <span key={t.id} className="text-body-sm text-[var(--color-text-subtle)] truncate">
                {t.recipient}
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
            onClick: () => toggleEnabled(row),
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
        key={`${editTarget?.id ?? 'new'}-${drawerNonce}`}
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
          if (deleteTarget) {
            // 타인 소유 규칙 삭제 시도 → 백엔드 403 시뮬레이션: 삭제하지 않고 토스트 안내
            if (!canMutate(deleteTarget)) {
              notifyForbidden('delete');
            } else {
              deleteRule(deleteTarget.id);
            }
          }
          setDeleteTarget(null);
        }}
      />
    </PageShell>
  );
}
