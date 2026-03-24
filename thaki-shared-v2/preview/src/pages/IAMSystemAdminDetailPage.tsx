import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconLock,
  IconReload,
  IconRefresh,
  IconCircleX,
} from '@tabler/icons-react';
import { EditSystemAdminDrawer } from '../drawers/iam/EditSystemAdminDrawer';
import { AdminLockSettingDrawer } from '../drawers/iam/AdminLockSettingDrawer';
import { ResetPasswordDrawer } from '../drawers/iam/ResetPasswordDrawer';

interface SystemAdminDetail {
  username: string;
  displayName: string;
  email: string;
  status: 'online' | 'offline';
  defaultDomain: string;
  createdAt: string;
  locked: boolean;
}

interface MFAMethod {
  id: string;
  method: string;
  lastUsed: string;
  createdAt: string;
  [key: string]: unknown;
}
interface Session {
  id: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
  [key: string]: unknown;
}

const mockAdminsMap: Record<string, SystemAdminDetail> = {
  'thaki-kim': {
    username: 'thaki-kim',
    displayName: 'Thaki Kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    defaultDomain: 'domain',
    createdAt: 'Sep 12, 2025 08:15:22',
    locked: true,
  },
  'alex-jones': {
    username: 'alex-jones',
    displayName: 'Alex Jones',
    email: 'alex.jones@example.com',
    status: 'online',
    defaultDomain: 'production',
    createdAt: 'Aug 15, 2025 10:42:38',
    locked: false,
  },
  'sarah-lee': {
    username: 'sarah-lee',
    displayName: 'Sarah Lee',
    email: 'sarah.lee@example.com',
    status: 'online',
    defaultDomain: 'domain',
    createdAt: 'Jul 20, 2025 14:28:15',
    locked: false,
  },
  'john-doe': {
    username: 'john-doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'offline',
    defaultDomain: 'development',
    createdAt: 'Jun 10, 2025 09:55:42',
    locked: true,
  },
  'jane-smith': {
    username: 'jane-smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'online',
    defaultDomain: 'domain',
    createdAt: 'Sep 1, 2025 16:18:33',
    locked: false,
  },
};
const defaultAdmin: SystemAdminDetail = {
  username: 'Unknown',
  displayName: '-',
  email: '-',
  status: 'offline',
  defaultDomain: '-',
  createdAt: '-',
  locked: false,
};

const mockMFAMethods: MFAMethod[] = [
  { id: 'mfa-001', method: 'OTP', lastUsed: 'Sep 12, 2025', createdAt: 'Sep 12, 2025 15:43:35' },
];

const mockSessions: Session[] = [
  {
    id: 'sess-001',
    started: 'Sep 12, 2025',
    lastAccess: 'Sep 12, 2025',
    ipAddress: '192.168.1.100',
    device: 'Chrome / Windows',
  },
  {
    id: 'sess-002',
    started: 'Sep 11, 2025',
    lastAccess: 'Sep 11, 2025',
    ipAddress: '192.168.1.101',
    device: 'Firefox / macOS',
  },
  {
    id: 'sess-003',
    started: 'Sep 10, 2025',
    lastAccess: 'Sep 10, 2025',
    ipAddress: '192.168.1.102',
    device: 'Safari / iOS',
  },
];

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={toggle}
    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
    aria-label="Actions"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const sessionFilterKeys: FilterKey[] = [
  { key: 'ipAddress', label: 'IP Address', type: 'input', placeholder: 'Enter IP...' },
  { key: 'device', label: 'Device', type: 'input', placeholder: 'Enter device...' },
];

export function IAMSystemAdminDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'security-credentials';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [sessionFilters, setSessionFilters] = useState<FilterKeyWithValue[]>([]);
  const [sessionPage, setSessionPage] = useState(1);
  const [editAdminOpen, setEditAdminOpen] = useState(false);
  const [lockSettingOpen, setLockSettingOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const admin = username ? mockAdminsMap[username] || defaultAdmin : defaultAdmin;
  const statusVariant: StatusVariant = admin.status === 'online' ? 'active' : 'shutoff';

  const applyFilter = <T extends Record<string, unknown>>(
    data: T[],
    filters: FilterKeyWithValue[]
  ): T[] => {
    if (filters.length === 0) return data;
    return data.filter((item) =>
      filters.every((f) =>
        String(item[f.key] ?? '')
          .toLowerCase()
          .includes(String(f.value ?? '').toLowerCase())
      )
    );
  };

  const itemsPerPage = 10;
  const filteredSessions = applyFilter(mockSessions, sessionFilters);
  const paginatedSessions = filteredSessions.slice(
    (sessionPage - 1) * itemsPerPage,
    sessionPage * itemsPerPage
  );

  const infoFields = [
    {
      label: 'Status',
      value: admin.status === 'online' ? 'Online' : 'Offline',
      accessory: <StatusIndicator variant={statusVariant} layout="iconOnly" />,
    },
    { label: 'Display name', value: admin.displayName },
    { label: 'Email address', value: admin.email },
    { label: 'Default domain', value: admin.defaultDomain },
    { label: 'Created at', value: admin.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        appearance="outline"
        size="sm"
        onClick={() => setEditAdminOpen(true)}
      >
        <IconEdit size={12} stroke={1.5} /> Edit
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <Button
        variant="secondary"
        appearance="outline"
        size="sm"
        onClick={() => setLockSettingOpen(true)}
      >
        <IconLock size={12} /> Lock setting
      </Button>
      <ContextMenu.Root
        direction="bottom-end"
        gap={4}
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.Item action={() => setResetPasswordOpen(true)}>
          Reset password
        </ContextMenu.Item>
        <ContextMenu.Item action={() => {}}>Reset MFA</ContextMenu.Item>
        <ContextMenu.Item action={() => {}}>View activity logs</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  const mfaColumns: TableColumn[] = [
    { key: 'method', header: 'MFA method' },
    { key: 'lastUsed', header: 'Last used' },
    { key: 'createdAt', header: 'Created at' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const sessionColumns: TableColumn[] = [
    { key: 'started', header: 'Started' },
    { key: 'lastAccess', header: 'Last access' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'device', header: 'Device' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={admin.username} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="security-credentials" label="Security credentials">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard
                title="Password"
                actions={
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconReload size={12} /> Reset password
                  </Button>
                }
                fields={[
                  { label: 'Last updated at', value: '2025.09.12 15:43:35 (Updated by admin)' },
                ]}
              />
              <DetailCard title={`MFA (${mockMFAMethods.length})`} fields={[]} />
              <div className="mt-1">
                <Table columns={mfaColumns} rows={mockMFAMethods}>
                  {mockMFAMethods.map((row) => (
                    <Table.Tr key={row.id} rowData={row}>
                      <Table.Td rowData={row} column={mfaColumns[0]}>
                        {row.method}
                      </Table.Td>
                      <Table.Td rowData={row} column={mfaColumns[1]}>
                        {row.lastUsed}
                      </Table.Td>
                      <Table.Td rowData={row} column={mfaColumns[2]}>
                        {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                      </Table.Td>
                      <Table.Td rowData={row} column={mfaColumns[3]} preventClickPropagation>
                        <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                          <ContextMenu.Item action={() => {}} danger>
                            Remove MFA
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table>
              </div>
            </div>
          </Tab>

          <Tab id="sessions" label="Sessions">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-24 text-text m-0">Sessions</h2>
              <div className="flex items-center gap-2">
                <FilterSearchInput
                  filterKeys={sessionFilterKeys}
                  onFilterAdd={(f) => {
                    setSessionFilters((p) => [...p, f]);
                    setSessionPage(1);
                  }}
                  selectedFilters={sessionFilters}
                  placeholder="Search sessions by attributes"
                  defaultFilterKey="ipAddress"
                />
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <Button variant="secondary" appearance="outline" size="sm" aria-label="Refresh">
                    <IconRefresh size={12} stroke={1.5} />
                  </Button>
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconCircleX size={12} /> Terminate all sessions
                  </Button>
                </div>
              </div>
              <Pagination
                totalCount={filteredSessions.length}
                size={itemsPerPage}
                currentAt={sessionPage}
                onPageChange={setSessionPage}
                totalCountLabel="items"
              />
              <Table columns={sessionColumns} rows={paginatedSessions}>
                {paginatedSessions.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={sessionColumns[0]}>
                      {row.started}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[1]}>
                      {row.lastAccess}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[2]}>
                      {row.ipAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[3]}>
                      {row.device}
                    </Table.Td>
                    <Table.Td rowData={row} column={sessionColumns[4]} preventClickPropagation>
                      <ContextMenu.Root direction="bottom-end" gap={4} trigger={ActionTrigger}>
                        <ContextMenu.Item action={() => {}} danger>
                          Terminate session
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditSystemAdminDrawer
        isOpen={editAdminOpen}
        onClose={() => setEditAdminOpen(false)}
        userName={admin.username}
      />
      <AdminLockSettingDrawer
        isOpen={lockSettingOpen}
        onClose={() => setLockSettingOpen(false)}
        userName={admin.username}
        initialLocked={admin.locked}
      />
      <ResetPasswordDrawer
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userName={admin.username}
      />
    </div>
  );
}
