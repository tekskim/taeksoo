import { useState, useMemo } from 'react';
import { Button } from '@shared/components/Button';
import { Pagination } from '@shared/components/Pagination';
import { Badge } from '@shared/components/Badge';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import {
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconSelector,
  IconX,
} from '@tabler/icons-react';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

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

const mockEventLogs: EventLog[] = [
  {
    id: 'log-001',
    eventId: '12345685',
    eventName: 'Sign-in',
    timestamp: '2025-12-12T18:37:40',
    displayTime: 'Dec 12, 2025 18:37:40',
    user: 'kevin.martin',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.107',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440000',
      timestamp: '2025-12-12T18:37:40Z',
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
    timestamp: '2025-12-12T18:38:55',
    displayTime: 'Dec 12, 2025 18:38:55',
    user: 'nina.smith',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.108',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440001',
      timestamp: '2025-12-12T18:38:55Z',
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
    timestamp: '2025-12-12T17:22:10',
    displayTime: 'Dec 12, 2025 17:22:10',
    user: 'alex.jones',
    target: 'alex.jones',
    result: 'success',
    ipAddress: '192.168.1.105',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440002',
      timestamp: '2025-12-12T17:22:10Z',
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
    timestamp: '2025-12-12T16:45:30',
    displayTime: 'Dec 12, 2025 16:45:30',
    user: 'sarah.lee',
    target: '-',
    result: 'failure',
    ipAddress: '192.168.1.110',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440003',
      timestamp: '2025-12-12T16:45:30Z',
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
    timestamp: '2025-12-12T15:30:00',
    displayTime: 'Dec 12, 2025 15:30:00',
    user: 'admin',
    target: 'john.doe',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440004',
      timestamp: '2025-12-12T15:30:00Z',
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
    timestamp: '2025-12-12T14:20:00',
    displayTime: 'Dec 12, 2025 14:20:00',
    user: 'admin',
    target: 'new.user',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440005',
      timestamp: '2025-12-12T14:20:00Z',
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
    timestamp: '2025-12-12T13:15:00',
    displayTime: 'Dec 12, 2025 13:15:00',
    user: 'mike.wilson',
    target: 'mike.wilson',
    result: 'success',
    ipAddress: '192.168.1.112',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440006',
      timestamp: '2025-12-12T13:15:00Z',
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
    timestamp: '2025-12-12T12:00:00',
    displayTime: 'Dec 12, 2025 12:00:00',
    user: 'emily.davis',
    target: '-',
    result: 'success',
    ipAddress: '192.168.1.115',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440007',
      timestamp: '2025-12-12T12:00:00Z',
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
    timestamp: '2025-12-12T11:30:00',
    displayTime: 'Dec 12, 2025 11:30:00',
    user: 'admin',
    target: 'role-storage-admin',
    result: 'success',
    ipAddress: '192.168.1.100',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440008',
      timestamp: '2025-12-12T11:30:00Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/admin',
      target_type: 'policy',
      target_id: 'policy-storage-full',
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
    timestamp: '2025-12-12T10:45:00',
    displayTime: 'Dec 12, 2025 10:45:00',
    user: 'chris.martin',
    target: 'chris.martin',
    result: 'success',
    ipAddress: '192.168.1.118',
    details: {
      event_id: '550e8400-e29b-41d4-a716-446655440009',
      timestamp: '2025-12-12T10:45:00Z',
      actor_tpn: 'tpn:kr:973hbqrxn6gv::user/chris.martin',
      target_type: 'access_key',
      target_id: 'ak-001',
      action: 'access_key.created',
      result: 'success',
      reason: null,
      detail: {
        username: 'chris.martin',
        provider: 'keycloak',
        client_ip: '192.168.1.118',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      org_id: '973hbqrxn6gv',
    },
  },
];

function EventDetailsConsole({ details }: { details: EventLog['details'] }) {
  const jsonString = JSON.stringify(details, null, 2);
  return (
    <div className="border-x border-b border-border rounded-b-md overflow-hidden">
      <div className="bg-[#1e293b] p-4 font-mono text-12 leading-18 leading-[18px] text-white overflow-x-auto">
        <pre className="whitespace-pre-wrap m-0">{jsonString}</pre>
      </div>
    </div>
  );
}

const filterKeys: FilterKey[] = [
  { key: 'eventName', label: 'Event', type: 'input', placeholder: 'Enter event name...' },
  { key: 'user', label: 'User', type: 'input', placeholder: 'Enter username...' },
  {
    key: 'result',
    label: 'Result',
    type: 'select',
    options: [
      { value: 'success', label: 'Success' },
      { value: 'failure', label: 'Failure' },
    ],
  },
];

type SortKey = 'eventName' | 'timestamp';
type SortDir = 'asc' | 'desc' | null;

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'eventName', label: 'Event', visible: true, locked: true },
  { key: 'timestamp', label: 'Time', visible: true },
  { key: 'user', label: 'User', visible: true },
  { key: 'target', label: 'Target', visible: true },
  { key: 'result', label: 'Result', visible: true },
  { key: 'ipAddress', label: 'IP address', visible: true },
];

export function IAMEventLogsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    let logs = mockEventLogs;
    if (appliedFilters.length > 0) {
      logs = logs.filter((log) =>
        appliedFilters.every((f) => {
          const val = String(
            (log as unknown as Record<string, unknown>)[f.key] ?? ''
          ).toLowerCase();
          return val.includes(String(f.value ?? '').toLowerCase());
        })
      );
    }
    if (sortKey && sortDir) {
      logs = [...logs].sort((a, b) => {
        const aVal = sortKey === 'timestamp' ? a.timestamp : a.eventName;
        const bVal = sortKey === 'timestamp' ? b.timestamp : b.eventName;
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return logs;
  }, [appliedFilters, sortKey, sortDir]);

  const itemsPerPage = 10;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') setSortDir('desc');
    else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <IconSelector size={14} className="text-text-subtle" />;
    return sortDir === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Event logs" />
      </div>

      <div className="flex items-center gap-2">
        <FilterSearchInput
          filterKeys={filterKeys}
          onFilterAdd={(f) => {
            setAppliedFilters((p) => [...p, f]);
            setCurrentPage(1);
          }}
          selectedFilters={appliedFilters}
          placeholder="Search logs by attributes"
          defaultFilterKey="eventName"
        />
        <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
          <IconDownload size={12} />
        </Button>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => {
                    setAppliedFilters((p) => p.filter((ff) => ff.id !== filter.id));
                    setCurrentPage(1);
                  }}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredLogs.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
      />

      <div className="w-full flex flex-col gap-1">
        {/* Table Header */}
        <div className="flex items-stretch min-h-9 bg-surface-muted border border-border rounded-md text-11 font-medium leading-16 text-text">
          <div
            className="flex-1 min-w-0 px-3 py-2 flex items-center gap-1 cursor-pointer select-none"
            onClick={() => toggleSort('eventName')}
          >
            Event <SortIcon col="eventName" />
          </div>
          <div
            className="flex-1 min-w-[140px] shrink-0 px-3 py-2 flex items-center gap-1 cursor-pointer select-none border-l border-border"
            onClick={() => toggleSort('timestamp')}
          >
            Time <SortIcon col="timestamp" />
          </div>
          <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-border">
            User
          </div>
          <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-border">
            Target
          </div>
          <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-border">
            Result
          </div>
          <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-border">
            IP address
          </div>
        </div>
        {/* Table Body */}
        {paginatedLogs.map((log) => {
          const isExpanded = expandedLogs.has(log.id);
          return (
            <div key={log.id}>
              <div
                className={`flex items-stretch min-h-9 border border-border bg-surface hover:bg-surface-muted transition-colors cursor-pointer text-12 leading-18 text-text ${isExpanded ? 'rounded-t-md border-b-0' : 'rounded-md'}`}
                onClick={() => toggleExpand(log.id)}
              >
                <div className="flex-1 min-w-0 px-3 py-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="p-0.5 rounded hover:bg-surface-muted transition-colors flex-shrink-0 bg-transparent border-none cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(log.id);
                    }}
                  >
                    {isExpanded ? (
                      <IconChevronDown size={16} stroke={1.5} />
                    ) : (
                      <IconChevronRight size={16} stroke={1.5} />
                    )}
                  </button>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="truncate">{log.eventName}</span>
                    <span className="text-text-subtle text-11 leading-16 truncate">
                      ID: {log.eventId}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-[140px] shrink-0 px-3 py-2 flex items-center border-l border-transparent whitespace-nowrap">
                  {log.displayTime}
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-transparent truncate">
                  {log.user}
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-transparent truncate">
                  {log.target}
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-transparent">
                  <Badge theme={log.result === 'success' ? 'blu' : 'red'} size="sm">
                    {log.result === 'success' ? 'Success' : 'Failure'}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0 px-3 py-2 flex items-center border-l border-transparent whitespace-nowrap">
                  {log.ipAddress}
                </div>
              </div>
              {isExpanded && <EventDetailsConsole details={log.details} />}
            </div>
          );
        })}
        {paginatedLogs.length === 0 && (
          <div className="flex items-center justify-center min-h-[200px] border border-border rounded-md bg-surface text-text-muted text-12 leading-18">
            No event logs found
          </div>
        )}
      </div>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
