import { useState, useMemo } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  SearchInput,
  Tabs,
  TabList,
  Tab,
  DropdownRoot,
  DropdownSelect,
  DropdownOption,
} from '@/design-system';
import { AuditSidebar } from '@/components/AuditSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDownload, IconChevronRight } from '@tabler/icons-react';

// ── Types & Mock Data ─────────────────────────────────────────────────────────

type AuditResult = 'Success' | 'Failure' | 'Denied';
type AuditCategory = 'IAM' | 'Container' | 'Storage' | 'KMS' | 'Network';

type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  category: AuditCategory;
  user: string;
  resource: string;
  result: AuditResult;
  ip: string;
  detail: string;
};

const MOCK_ENTRIES: AuditEntry[] = [
  {
    id: 'a-001',
    timestamp: '2026-06-05 09:14:28',
    action: 'User.Login',
    category: 'IAM',
    user: 'taeksoo.kim',
    resource: 'iam/authn',
    result: 'Success',
    ip: '192.168.1.42',
    detail: 'Login via LDAP. MFA verified.',
  },
  {
    id: 'a-002',
    timestamp: '2026-06-05 09:13:05',
    action: 'Role.Assign',
    category: 'IAM',
    user: 'admin',
    resource: 'role:cluster-admin → u-9123',
    result: 'Success',
    ip: '192.168.1.10',
    detail: 'Assigned cluster-admin role to user ID u-9123.',
  },
  {
    id: 'a-003',
    timestamp: '2026-06-05 09:12:44',
    action: 'Pod.Delete',
    category: 'Container',
    user: 'taeksoo.kim',
    resource: 'ns/production/pod/web-app',
    result: 'Success',
    ip: '192.168.1.42',
    detail: 'Pod deleted manually. Deployment re-created automatically.',
  },
  {
    id: 'a-004',
    timestamp: '2026-06-05 09:11:30',
    action: 'Volume.Create',
    category: 'Storage',
    user: 'jieun.park',
    resource: 'vol/pvc-data-worker-02',
    result: 'Success',
    ip: '10.0.1.55',
    detail: 'Created 50Gi RBD volume. Attached to node worker-02.',
  },
  {
    id: 'a-005',
    timestamp: '2026-06-05 09:10:12',
    action: 'Key.Rotate',
    category: 'KMS',
    user: 'system',
    resource: 'key/kms-3921',
    result: 'Success',
    ip: 'internal',
    detail: 'Automatic key rotation triggered (90-day policy).',
  },
  {
    id: 'a-006',
    timestamp: '2026-06-05 09:09:00',
    action: 'Namespace.AccessDenied',
    category: 'IAM',
    user: 'jieun.park',
    resource: 'ns/kube-system',
    result: 'Denied',
    ip: '10.0.1.55',
    detail: 'Access denied: user lacks cluster-level read permission.',
  },
  {
    id: 'a-007',
    timestamp: '2026-06-05 09:07:33',
    action: 'SecurityGroup.Update',
    category: 'Network',
    user: 'minho.lee',
    resource: 'sg/sg-api-gateway',
    result: 'Success',
    ip: '192.168.2.30',
    detail: 'Added inbound rule: TCP 8443 from 0.0.0.0/0.',
  },
  {
    id: 'a-008',
    timestamp: '2026-06-05 09:05:20',
    action: 'Certificate.Issue',
    category: 'KMS',
    user: 'system',
    resource: 'cert/api.thakicloud.net',
    result: 'Success',
    ip: 'internal',
    detail: "Certificate issued via Let's Encrypt. TTL=90d.",
  },
  {
    id: 'a-009',
    timestamp: '2026-06-05 09:03:11',
    action: 'User.Login',
    category: 'IAM',
    user: 'unknown',
    resource: 'iam/authn',
    result: 'Failure',
    ip: '203.0.113.45',
    detail: 'Login failed: invalid credentials. 5th consecutive failure.',
  },
  {
    id: 'a-010',
    timestamp: '2026-06-05 09:01:55',
    action: 'Volume.Snapshot.Delete',
    category: 'Storage',
    user: 'taeksoo.kim',
    resource: 'snap/snap-vol-001',
    result: 'Success',
    ip: '192.168.1.42',
    detail: 'Deleted stale snapshot older than 30 days.',
  },
  {
    id: 'a-011',
    timestamp: '2026-06-05 09:00:40',
    action: 'Deployment.Scale',
    category: 'Container',
    user: 'system',
    resource: 'ns/production/deploy/compute',
    result: 'Success',
    ip: 'internal',
    detail: 'HPA scaled replicas from 3 to 5 due to CPU pressure.',
  },
  {
    id: 'a-012',
    timestamp: '2026-06-05 08:59:22',
    action: 'Network.Policy.Create',
    category: 'Network',
    user: 'taeksoo.kim',
    resource: 'netpol/deny-egress-default',
    result: 'Success',
    ip: '192.168.1.42',
    detail: 'Created deny-all egress NetworkPolicy for namespace production.',
  },
  {
    id: 'a-013',
    timestamp: '2026-06-05 08:57:09',
    action: 'Secret.Access',
    category: 'KMS',
    user: 'compute-sa',
    resource: 'secret/db-password',
    result: 'Success',
    ip: 'internal',
    detail: 'Service account accessed secret (automated pipeline).',
  },
  {
    id: 'a-014',
    timestamp: '2026-06-05 08:55:01',
    action: 'User.PasswordReset',
    category: 'IAM',
    user: 'admin',
    resource: 'user/jieun.park',
    result: 'Success',
    ip: '192.168.1.10',
    detail: 'Admin-triggered password reset. Email sent.',
  },
  {
    id: 'a-015',
    timestamp: '2026-06-05 08:53:44',
    action: 'Firewall.Rule.Delete',
    category: 'Network',
    user: 'minho.lee',
    resource: 'fw/fw-prod-edge/rule-7',
    result: 'Denied',
    ip: '192.168.2.30',
    detail: 'Deletion denied: rule is referenced by active listener.',
  },
];

const CATEGORIES: ('All' | AuditCategory)[] = [
  'All',
  'IAM',
  'Container',
  'Storage',
  'KMS',
  'Network',
];
const TIME_RANGES = ['Last 1 hour', 'Last 6 hours', 'Last 24 hours', 'Last 7 days'];
const RESULT_FILTERS: ('All' | AuditResult)[] = ['All', 'Success', 'Failure', 'Denied'];

// ── Badge helpers ─────────────────────────────────────────────────────────────

function ResultBadge({ result }: { result: AuditResult }) {
  const styles: Record<AuditResult, string> = {
    Success: 'text-[var(--color-status-success)] bg-[var(--color-status-success-subtle)]',
    Failure: 'text-[var(--color-status-error)] bg-[var(--color-status-error-subtle)]',
    Denied: 'text-[var(--color-status-warning)] bg-[var(--color-status-warning-subtle)]',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[result]}`}
    >
      {result}
    </span>
  );
}

function CategoryBadge({ category }: { category: AuditCategory }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]">
      {category}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [category, setCategory] = useState<'All' | AuditCategory>('All');
  const [resultFilter, setResultFilter] = useState<'All' | AuditResult>('All');
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0]);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 240 : 40;

  const filtered = useMemo(() => {
    return MOCK_ENTRIES.filter((e) => {
      const matchCat = category === 'All' || e.category === category;
      const matchResult = resultFilter === 'All' || e.result === resultFilter;
      const matchSearch =
        !search ||
        e.action.toLowerCase().includes(search.toLowerCase()) ||
        e.user.toLowerCase().includes(search.toLowerCase()) ||
        e.resource.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchResult && matchSearch;
    });
  }, [category, resultFilter, search]);

  const resultCounts = {
    Success: MOCK_ENTRIES.filter((e) => e.result === 'Success').length,
    Failure: MOCK_ENTRIES.filter((e) => e.result === 'Failure').length,
    Denied: MOCK_ENTRIES.filter((e) => e.result === 'Denied').length,
  };

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
              items={[{ label: 'prod-cluster-01', href: '/audit/logs' }, { label: 'Audit Logs' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader
          title="Audit Logs"
          description="Track every user and system action across the cluster."
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />}>
              Export CSV
            </Button>
          }
        />

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(resultCounts) as [AuditResult, number][]).map(([result, count]) => (
            <div
              key={result}
              className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg px-4 py-3"
            >
              <p
                className={`text-2xl font-semibold ${
                  result === 'Success'
                    ? 'text-[var(--color-status-success)]'
                    : result === 'Failure'
                      ? 'text-[var(--color-status-error)]'
                      : 'text-[var(--color-status-warning)]'
                }`}
              >
                {count}
              </p>
              <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">{result}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <HStack gap={3} align="center" wrap>
          {/* Time range */}
          <DropdownRoot value={timeRange} onChange={(v) => setTimeRange(v)}>
            <DropdownSelect width="lg" />
            {TIME_RANGES.map((r) => (
              <DropdownOption key={r} value={r}>
                {r}
              </DropdownOption>
            ))}
          </DropdownRoot>

          {/* Result filter */}
          <DropdownRoot
            value={resultFilter}
            onChange={(v) => setResultFilter(v as 'All' | AuditResult)}
          >
            <DropdownSelect width="md" />
            {RESULT_FILTERS.map((r) => (
              <DropdownOption key={r} value={r}>
                {r === 'All' ? 'All Results' : r}
              </DropdownOption>
            ))}
          </DropdownRoot>

          {/* Category tabs */}
          <Tabs
            value={category}
            onChange={(v) => setCategory(v as 'All' | AuditCategory)}
            variant="boxed"
            size="sm"
          >
            <TabList>
              {CATEGORIES.map((c) => (
                <Tab key={c} value={c}>
                  {c}
                </Tab>
              ))}
            </TabList>
          </Tabs>

          <SearchInput
            placeholder="Search action, user, resource..."
            size="sm"
            className="w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </HStack>

        {/* Table */}
        <div className="w-full border border-[var(--color-border-default)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider w-[160px]">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider w-[80px]">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider w-[200px]">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider w-[130px]">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">
                  Resource
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider w-[90px]">
                  Result
                </th>
                <th className="px-4 py-3 w-[32px]" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-[var(--color-text-subtle)]"
                  >
                    No audit entries match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <>
                    <tr
                      key={entry.id}
                      className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-[var(--color-text-secondary)]">
                        {entry.timestamp}
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={entry.category} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-primary)]">
                        {entry.action}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--color-text-secondary)] truncate max-w-[240px]">
                        {entry.resource}
                      </td>
                      <td className="px-4 py-3">
                        <ResultBadge result={entry.result} />
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-subtle)]">
                        <IconChevronRight
                          size={14}
                          className={`transition-transform ${expandedRow === entry.id ? 'rotate-90' : ''}`}
                        />
                      </td>
                    </tr>
                    {expandedRow === entry.id && (
                      <tr
                        key={entry.id + '-detail'}
                        className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]"
                      >
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-[120px_1fr] gap-y-2 text-xs">
                            <span className="text-[var(--color-text-subtle)]">Entry ID</span>
                            <span className="font-mono text-[var(--color-text-primary)]">
                              {entry.id}
                            </span>
                            <span className="text-[var(--color-text-subtle)]">IP Address</span>
                            <span className="font-mono text-[var(--color-text-primary)]">
                              {entry.ip}
                            </span>
                            <span className="text-[var(--color-text-subtle)]">Detail</span>
                            <span className="text-[var(--color-text-secondary)]">
                              {entry.detail}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--color-text-subtle)]">
          {filtered.length} entries · {timeRange}
        </p>
      </VStack>
    </PageShell>
  );
}
