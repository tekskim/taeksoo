import { useState, useEffect, useMemo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';
import {
  Button,
  Pagination,
  FilterSearchInput,
  ListToolbar,
  Badge,
  TopBar,
  Breadcrumb,
  VStack,
  TabBar,
  PageShell,
  PageHeader,
  Table,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { InlineCopyId } from '@/components/InlineCopyId';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface EventLog {
  id: string;
  eventId: string;
  eventName: string;
  timestamp: string;
  displayTime: string;
  user: string;
  target: string;
  result: 'success' | 'failure';
  ipAddress: string;
  details: {
    event_id: string;
    timestamp: string;
    actor_tpn: string;
    target_type: string;
    target_id: string;
    action: string;
    result: string;
    reason: string | null;
    detail: {
      username: string;
      provider: string;
      client_ip: string;
      user_agent: string;
    };
    org_id: string;
  };
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */
const mockEventLogs: EventLog[] = [
  {
    id: 'log-001',
    eventId: '12345685',
    eventName: 'Sign-in',
    timestamp: '2026-12-12T18:37:40.000Z',
    displayTime: 'Dec 12, 2026 18:37:40',
    user: 'kevin.martin',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.107',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440000',
      timestamp: '2026-12-01T09:30:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/kevin.martin',
      target_type: 'auth',
      target_id: 'session-abc123',
      action: 'auth.login.succeeded',
      result: 'success',
      reason: null,
      detail: {
        username: 'kevin.martin',
        provider: 'keycloak',
        client_ip: '192.168.1.107',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-002',
    eventId: '12345686',
    eventName: 'Sign-in',
    timestamp: '2026-12-12T18:38:55.000Z',
    displayTime: 'Dec 12, 2026 18:38:55',
    user: 'nina.smith',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.108',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440001',
      timestamp: '2026-12-12T18:38:55.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/nina.smith',
      target_type: 'auth',
      target_id: 'session-def456',
      action: 'auth.login.succeeded',
      result: 'success',
      reason: null,
      detail: {
        username: 'nina.smith',
        provider: 'keycloak',
        client_ip: '192.168.1.108',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-003',
    eventId: '12345687',
    eventName: 'Password change',
    timestamp: '2026-12-12T17:22:10.000Z',
    displayTime: 'Dec 12, 2026 17:22:10',
    user: 'alex.jones',
    target: 'alex.jones',
    result: 'success',
    ipAddress: '192.168.1.105',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440002',
      timestamp: '2026-12-12T17:22:10.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/alex.jones',
      target_type: 'user',
      target_id: 'user-alex.jones',
      action: 'user.password.changed',
      result: 'success',
      reason: null,
      detail: {
        username: 'alex.jones',
        provider: 'keycloak',
        client_ip: '192.168.1.105',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-004',
    eventId: '12345688',
    eventName: 'Sign-in',
    timestamp: '2026-12-12T16:45:30.000Z',
    displayTime: 'Dec 12, 2026 16:45:30',
    user: 'sarah.lee',
    target: '-',
    result: 'failure',
    ipAddress: '192.168.1.110',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440003',
      timestamp: '2026-12-12T16:45:30.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/sarah.lee',
      target_type: 'auth',
      target_id: 'session-ghi789',
      action: 'auth.login.failed',
      result: 'failure',
      reason: 'Invalid password',
      detail: {
        username: 'sarah.lee',
        provider: 'keycloak',
        client_ip: '192.168.1.110',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-005',
    eventId: '12345689',
    eventName: 'Role assignment',
    timestamp: '2026-12-12T15:30:00.000Z',
    displayTime: 'Dec 12, 2026 15:30:00',
    user: 'admin',
    target: 'john.doe',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440004',
      timestamp: '2026-12-12T15:30:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/admin',
      target_type: 'role',
      target_id: 'role-compute-admin',
      action: 'role.assigned',
      result: 'success',
      reason: null,
      detail: {
        username: 'admin',
        provider: 'keycloak',
        client_ip: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-006',
    eventId: '12345690',
    eventName: 'User created',
    timestamp: '2026-12-12T14:20:00.000Z',
    displayTime: 'Dec 12, 2026 14:20:00',
    user: 'admin',
    target: 'new.user',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440005',
      timestamp: '2026-12-12T14:20:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/admin',
      target_type: 'user',
      target_id: 'user-new.user',
      action: 'user.created',
      result: 'success',
      reason: null,
      detail: {
        username: 'admin',
        provider: 'keycloak',
        client_ip: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-007',
    eventId: '12345691',
    eventName: 'MFA enabled',
    timestamp: '2026-12-12T13:15:00.000Z',
    displayTime: 'Dec 12, 2026 13:15:00',
    user: 'mike.wilson',
    target: 'mike.wilson',
    result: 'success',
    ipAddress: '192.168.1.112',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440006',
      timestamp: '2026-12-12T13:15:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/mike.wilson',
      target_type: 'mfa',
      target_id: 'mfa-otp',
      action: 'mfa.enabled',
      result: 'success',
      reason: null,
      detail: {
        username: 'mike.wilson',
        provider: 'keycloak',
        client_ip: '192.168.1.112',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-008',
    eventId: '12345692',
    eventName: 'Sign-out',
    timestamp: '2026-12-12T12:00:00.000Z',
    displayTime: 'Dec 12, 2026 12:00:00',
    user: 'emily.davis',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.115',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440007',
      timestamp: '2026-12-12T12:00:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/emily.davis',
      target_type: 'auth',
      target_id: 'session-jkl012',
      action: 'auth.logout.succeeded',
      result: 'success',
      reason: null,
      detail: {
        username: 'emily.davis',
        provider: 'keycloak',
        client_ip: '192.168.1.115',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-009',
    eventId: '12345693',
    eventName: 'Policy attached',
    timestamp: '2026-12-12T11:30:00.000Z',
    displayTime: 'Dec 12, 2026 11:30:00',
    user: 'admin',
    target: 'role-storage-admin',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440008',
      timestamp: '2026-12-12T11:30:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/admin',
      target_type: 'policy',
      target_id: 'policy-storage-full-access',
      action: 'policy.attached',
      result: 'success',
      reason: null,
      detail: {
        username: 'admin',
        provider: 'keycloak',
        client_ip: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
  {
    id: 'log-010',
    eventId: '12345694',
    eventName: 'Access key created',
    timestamp: '2026-12-12T10:45:00.000Z',
    displayTime: 'Dec 12, 2026 10:45:00',
    user: 'chris.martin',
    target: 'chris.martin',
    result: 'success',
    ipAddress: '192.168.1.118',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440009',
      timestamp: '2026-12-12T10:45:00.000Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/chris.martin',
      target_type: 'access_key',
      target_id: 'AKIA112AK3IALQI2',
      action: 'access_key.created',
      result: 'success',
      reason: null,
      detail: {
        username: 'chris.martin',
        provider: 'keycloak',
        client_ip: '192.168.1.118',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
];

const eventLogFilterFields: FilterField[] = [
  { id: 'eventName', label: 'Event', type: 'text' },
  { id: 'eventId', label: 'Event ID', type: 'text' },
  { id: 'user', label: 'User', type: 'text' },
  { id: 'target', label: 'Target', type: 'text' },
  {
    id: 'result',
    label: 'Result',
    type: 'select',
    options: [
      { value: 'success', label: 'Success' },
      { value: 'failure', label: 'Failure' },
    ],
  },
  { id: 'ipAddress', label: 'IP address', type: 'text' },
];

/* ----------------------------------------
   Event Details Component (Console View)
   ---------------------------------------- */
function EventDetailsConsole({ event }: { event: EventLog }) {
  const jsonString = JSON.stringify(event.details, null, 2);

  return (
    <div className="border-x border-b border-[var(--color-border-default)] rounded-b-md overflow-hidden">
      <OverlayScrollbarsComponent
        options={{
          overflow: { x: 'scroll', y: 'hidden' },
          scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
        }}
        defer={false}
        className="bg-[var(--color-surface-contrast)] p-4 font-mono text-body-md leading-[18px] text-[var(--color-text-on-primary)]"
      >
        <pre className="whitespace-pre-wrap">{jsonString}</pre>
      </OverlayScrollbarsComponent>
    </div>
  );
}

/* ----------------------------------------
   IAM Event Logs Page
   ---------------------------------------- */
export default function IAMEventLogsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Event logs');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (appliedFilters.length === 0) return mockEventLogs;
    return mockEventLogs.filter((log) =>
      appliedFilters.every((f) => {
        if (f.fieldId === 'result') return log.result === f.value;
        const val = log[f.fieldId as keyof EventLog];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(f.value.toLowerCase());
        }
        return true;
      })
    );
  }, [appliedFilters]);

  // Sort
  const sortedLogs = useMemo(() => {
    if (!sortKey) return filteredLogs;
    return [...filteredLogs].sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortKey] ?? '');
      const bVal = String((b as Record<string, unknown>)[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredLogs, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sort handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sort icon renderer
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />;
    }
    if (sortDirection === 'asc') {
      return <IconChevronUp size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
    }
    return <IconChevronDown size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
  };

  const toggleExpansion = (logId: string) => {
    setExpandedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) next.delete(logId);
      else next.add(logId);
      return next;
    });
  };

  const sortHeaderButton = (label: string, columnKey: string) => (
    <button
      type="button"
      className="flex items-center gap-1 w-full min-w-0 cursor-pointer select-none text-left hover:text-[var(--color-action-primary)] transition-colors"
      onClick={() => handleSort(columnKey)}
    >
      <span className="whitespace-nowrap truncate" title={label}>
        {label}
      </span>
      <span className="flex-shrink-0">{renderSortIcon(columnKey)}</span>
    </button>
  );

  const columns: TableColumn<EventLog>[] = [
    {
      key: 'eventName',
      label: 'Event',
      flex: 1.2,
      minWidth: '200px',
      sortable: false,
      headerRender: () => sortHeaderButton('Event', 'eventName'),
      render: (_value, log) => {
        const isExpanded = expandedLogIds.has(log.id);
        return (
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              className="p-0.5 rounded hover:bg-[var(--color-surface-subtle)] transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              aria-expanded={isExpanded}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion(log.id);
              }}
            >
              {isExpanded ? (
                <IconChevronDown
                  size={12}
                  strokeWidth={2}
                  className="text-[var(--color-text-default)]"
                />
              ) : (
                <IconChevronRight
                  size={12}
                  strokeWidth={2}
                  className="text-[var(--color-text-default)]"
                />
              )}
            </button>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-body-md text-[var(--color-text-default)]">{log.eventName}</span>
              <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
                <span className="truncate" title={log.eventId}>
                  ID : {log.eventId.slice(0, 8)}
                </span>
                <InlineCopyId value={log.eventId} />
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'timestamp',
      label: 'Time',
      flex: 1,
      sortable: false,
      headerRender: () => (
        <button
          type="button"
          className="flex items-center gap-1 w-full min-w-0 cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors"
          onClick={() => handleSort('timestamp')}
        >
          <span className="whitespace-nowrap truncate" title="Time">
            Time
          </span>
          <span className="flex-shrink-0">{renderSortIcon('timestamp')}</span>
        </button>
      ),
      render: (_value, log) => log.displayTime,
    },
    {
      key: 'user',
      label: 'User',
      flex: 1,
      sortable: false,
      headerRender: () => sortHeaderButton('User', 'user'),
    },
    {
      key: 'target',
      label: 'Target',
      flex: 1,
      sortable: false,
      headerRender: () => sortHeaderButton('Target', 'target'),
    },
    {
      key: 'result',
      label: 'Result',
      flex: 0.9,
      sortable: false,
      render: (_value, log) => (
        <Badge variant={log.result === 'success' ? 'success' : 'error'} size="sm">
          {log.result === 'success' ? 'Success' : 'Failure'}
        </Badge>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP address',
      flex: 1,
      sortable: false,
      headerRender: () => sortHeaderButton('IP address', 'ipAddress'),
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Event Logs' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Event logs" />

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={eventLogFilterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search event logs by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  hideAppliedFilters
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                />
              </ListToolbar.Actions>
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            totalItems={sortedLogs.length}
          />

          <Table<EventLog>
            resizable={false}
            columns={columns}
            data={paginatedLogs}
            rowKey="id"
            emptyMessage="No event logs found"
            loading={loading}
            onRowClick={(row) => toggleExpansion(row.id)}
            expandedContent={(row) => {
              if (!expandedLogIds.has(row.id)) return null;
              return <EventDetailsConsole event={row} />;
            }}
          />
        </VStack>
      </VStack>
    </PageShell>
  );
}
