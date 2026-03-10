import { useState, useEffect } from 'react';
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
  SearchInput,
  Badge,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  PageShell,
  PageHeader,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';

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
    timestamp: '2025-12-12T18:37:40.000Z',
    displayTime: 'Dec 12, 25 18:37:40',
    user: 'kevin.martin',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.107',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440000',
      timestamp: '2025-12-01T09:30:00.000Z',
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
    timestamp: '2025-12-12T18:38:55.000Z',
    displayTime: 'Dec 12, 25 18:38:55',
    user: 'nina.smith',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.108',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440001',
      timestamp: '2025-12-12T18:38:55.000Z',
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
    timestamp: '2025-12-12T17:22:10.000Z',
    displayTime: 'Dec 12, 25 17:22:10',
    user: 'alex.jones',
    target: 'alex.jones',
    result: 'success',
    ipAddress: '192.168.1.105',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440002',
      timestamp: '2025-12-12T17:22:10.000Z',
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
    timestamp: '2025-12-12T16:45:30.000Z',
    displayTime: 'Dec 12, 25 16:45:30',
    user: 'sarah.lee',
    target: '-',
    result: 'failure',
    ipAddress: '192.168.1.110',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440003',
      timestamp: '2025-12-12T16:45:30.000Z',
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
    timestamp: '2025-12-12T15:30:00.000Z',
    displayTime: 'Dec 12, 25 15:30:00',
    user: 'admin',
    target: 'john.doe',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440004',
      timestamp: '2025-12-12T15:30:00.000Z',
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
    timestamp: '2025-12-12T14:20:00.000Z',
    displayTime: 'Dec 12, 25 14:20:00',
    user: 'admin',
    target: 'new.user',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440005',
      timestamp: '2025-12-12T14:20:00.000Z',
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
    timestamp: '2025-12-12T13:15:00.000Z',
    displayTime: 'Dec 12, 25 13:15:00',
    user: 'mike.wilson',
    target: 'mike.wilson',
    result: 'success',
    ipAddress: '192.168.1.112',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440006',
      timestamp: '2025-12-12T13:15:00.000Z',
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
    timestamp: '2025-12-12T12:00:00.000Z',
    displayTime: 'Dec 12, 25 12:00:00',
    user: 'emily.davis',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.115',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440007',
      timestamp: '2025-12-12T12:00:00.000Z',
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
    timestamp: '2025-12-12T11:30:00.000Z',
    displayTime: 'Dec 12, 25 11:30:00',
    user: 'admin',
    target: 'role-storage-admin',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440008',
      timestamp: '2025-12-12T11:30:00.000Z',
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
    timestamp: '2025-12-12T10:45:00.000Z',
    displayTime: 'Dec 12, 25 10:45:00',
    user: 'chris.martin',
    target: 'chris.martin',
    result: 'success',
    ipAddress: '192.168.1.118',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440009',
      timestamp: '2025-12-12T10:45:00.000Z',
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

/* ----------------------------------------
   Event Details Component (Console View)
   ---------------------------------------- */
function EventDetailsConsole({ details }: { details: EventLog['details'] }) {
  const jsonString = JSON.stringify(details, null, 2);

  return (
    <div className="border-x border-b border-[var(--color-border-default)] rounded-b-md overflow-hidden">
      <div className="bg-[var(--color-surface-contrast)] p-4 font-mono text-body-md leading-[18px] text-white overflow-x-auto">
        <pre className="whitespace-pre-wrap">{jsonString}</pre>
      </div>
    </div>
  );
}

/* ----------------------------------------
   IAM Event Logs Page
   ---------------------------------------- */
export default function IAMEventLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Event logs');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter logs by search query
  const filteredLogs = mockEventLogs.filter(
    (log) =>
      log.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery) ||
      log.eventId.includes(searchQuery)
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
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

  // Toggle expanded log
  const toggleExpanded = (logId: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Event logs' }]} />
          }
        />
      }
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Event logs" />

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          {/* Action Bar */}
          <HStack gap={2} align="center">
            {/* Search */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search logs by attributes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
              />
            </HStack>
          </HStack>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            totalItems={filteredLogs.length}
          />

          {/* Custom Table */}
          <div className="w-full flex flex-col gap-1">
            {/* Table Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              {[
                { key: 'eventName', label: 'Event', sortable: true },
                { key: 'timestamp', label: 'Time', sortable: true },
                { key: 'user', label: 'User', sortable: true },
                { key: 'target', label: 'Target', sortable: true },
                { key: 'result', label: 'Result', sortable: false },
                { key: 'ipAddress', label: 'IP address', sortable: true },
              ].map((col, idx) => (
                <div
                  key={col.key}
                  className={`flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] flex items-center ${col.sortable ? 'cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors' : ''} ${idx > 0 ? 'border-l border-[var(--color-border-default)]' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap truncate">{col.label}</span>
                    {col.sortable && (
                      <span className="flex-shrink-0">{renderSortIcon(col.key)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {paginatedLogs.map((log) => {
              const isExpanded = expandedLogs.has(log.id);
              return (
                <div key={log.id} className="w-full">
                  {/* Main Row */}
                  <div
                    className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] transition-colors hover:bg-[var(--table-row-hover-bg)] cursor-pointer ${isExpanded ? 'rounded-t-md border-b-0' : 'rounded-md'}`}
                    onClick={() => toggleExpanded(log.id)}
                  >
                    {/* Event Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="p-0.5 rounded hover:bg-[var(--color-surface-subtle)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(log.id);
                        }}
                      >
                        {isExpanded ? (
                          <IconChevronDown
                            size={16}
                            stroke={1.5}
                            className="text-[var(--color-text-default)]"
                          />
                        ) : (
                          <IconChevronRight
                            size={16}
                            stroke={1.5}
                            className="text-[var(--color-text-default)]"
                          />
                        )}
                      </button>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-body-md text-[var(--color-text-default)]">
                          {log.eventName}
                        </span>
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          ID: {log.eventId}
                        </span>
                      </div>
                    </div>

                    {/* Time Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center border-l border-transparent">
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {log.displayTime}
                      </span>
                    </div>

                    {/* User Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center border-l border-transparent">
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {log.user}
                      </span>
                    </div>

                    {/* Target Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center border-l border-transparent">
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {log.target}
                      </span>
                    </div>

                    {/* Result Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center border-l border-transparent">
                      <Badge variant={log.result === 'success' ? 'info' : 'error'} size="sm">
                        {log.result === 'success' ? 'Success' : 'Failure'}
                      </Badge>
                    </div>

                    {/* IP Address Cell */}
                    <div className="flex-1 px-3 py-2 flex items-center border-l border-transparent">
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {log.ipAddress}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && <EventDetailsConsole details={log.details} />}
                </div>
              );
            })}
          </div>
        </VStack>
      </VStack>
    </PageShell>
  );
}
