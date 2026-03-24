import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconLock } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { EditSystemAdminDrawer } from '../drawers/iam/EditSystemAdminDrawer';
import { AdminLockSettingDrawer } from '../drawers/iam/AdminLockSettingDrawer';
import { ResetPasswordDrawer } from '../drawers/iam/ResetPasswordDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

interface SystemAdmin {
  id: string;
  username: string;
  status: 'active' | 'inactive' | 'pending';
  locked: boolean;
  lastSignIn: string;
  mfa: string;
  createdAt: string;
  [key: string]: unknown;
}

const statusMap: Record<string, StatusVariant> = {
  active: 'active',
  inactive: 'shutoff',
  pending: 'building',
};

const mockSystemAdmins: SystemAdmin[] = [
  {
    id: 'admin-001',
    username: 'thaki-kim',
    status: 'active',
    locked: true,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 12, 2025 08:15:22',
  },
  {
    id: 'admin-002',
    username: 'alex-jones',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 15, 2025 10:42:38',
  },
  {
    id: 'admin-003',
    username: 'sarah-lee',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 10, 2025',
    mfa: 'Email',
    createdAt: 'Jul 20, 2025 14:28:15',
  },
  {
    id: 'admin-004',
    username: 'john-doe',
    status: 'inactive',
    locked: true,
    lastSignIn: 'Aug 25, 2025',
    mfa: '-',
    createdAt: 'Jun 10, 2025 09:55:42',
  },
  {
    id: 'admin-005',
    username: 'jane-smith',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 1, 2025 16:18:33',
  },
  {
    id: 'admin-006',
    username: 'mike-wilson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 8, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 25, 2025 11:32:47',
  },
  {
    id: 'admin-007',
    username: 'emily-davis',
    status: 'pending',
    locked: false,
    lastSignIn: '-',
    mfa: '-',
    createdAt: 'Sep 10, 2025 13:45:21',
  },
  {
    id: 'admin-008',
    username: 'chris-martin',
    status: 'active',
    locked: true,
    lastSignIn: 'Sep 5, 2025',
    mfa: 'Email',
    createdAt: 'Jul 5, 2025 10:22:55',
  },
  {
    id: 'admin-009',
    username: 'lisa-anderson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP',
    createdAt: 'Jun 1, 2025 15:48:12',
  },
  {
    id: 'admin-010',
    username: 'david-brown',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP / Email',
    createdAt: 'May 15, 2025 08:35:39',
  },
];

const filterKeys: FilterKey[] = [
  { id: 'username', label: 'Username', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  {
    id: 'mfa',
    label: 'MFA',
    type: 'text',
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'username', label: 'Username', visible: true, locked: true },
  { key: 'locked', label: 'Locked', visible: true },
  { key: 'lastSignIn', label: 'Last sign-in', visible: true },
  { key: 'mfa', label: 'MFA', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function IAMSystemAdministratorsPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editAdminOpen, setEditAdminOpen] = useState(false);
  const [editAdminUser, setEditAdminUser] = useState('');
  const [lockSettingOpen, setLockSettingOpen] = useState(false);
  const [lockSettingUser, setLockSettingUser] = useState('');
  const [lockSettingLocked, setLockSettingLocked] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState('');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const handleFilterAdd = (filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => {
      const exists = prev.findIndex((f) => f.id === filter.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = filter;
        return next;
      }
      return [...prev, filter];
    });
    setCurrentPage(1);
  };

  const filteredAdmins = useMemo(() => {
    if (appliedFilters.length === 0) return mockSystemAdmins;
    return mockSystemAdmins.filter((a) =>
      appliedFilters.every((f) => {
        if (f.id === 'username')
          return a.username.toLowerCase().includes(String(f.value).toLowerCase());
        if (f.id === 'status') return a.status === f.value;
        if (f.id === 'mfa') return a.mfa.toLowerCase().includes(String(f.value).toLowerCase());
        return true;
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'locked', header: 'Locked', width: 60, align: 'center' },
    { key: 'lastSignIn', header: 'Last sign-in', sortable: true },
    { key: 'mfa', header: 'MFA' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="System administrators" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/iam/system-administrators/create')}
        >
          Create account
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <FilterSearchInput
          filterKeys={filterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search accounts by attributes"
          defaultFilterKey="username"
        />
        <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
          <IconDownload size={12} />
        </Button>
      </div>

      <Pagination
        totalCount={filteredAdmins.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
      />

      <Table<SystemAdmin> columns={columns} rows={paginatedAdmins} stickyLastColumn>
        {paginatedAdmins.map((admin) => (
          <Table.Tr key={admin.id} rowData={admin}>
            <Table.Td rowData={admin} column={columns[0]}>
              <StatusIndicator variant={statusMap[admin.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={admin} column={columns[1]}>
              <Link
                to={`/iam/system-administrators/${admin.username}`}
                className="text-primary font-medium hover:underline"
              >
                {admin.username}
              </Link>
            </Table.Td>
            <Table.Td rowData={admin} column={columns[2]}>
              <div className="flex items-center justify-center w-full">
                {admin.locked && <IconLock size={16} stroke={1.5} className="text-text" />}
              </div>
            </Table.Td>
            <Table.Td rowData={admin} column={columns[3]}>
              {admin.lastSignIn}
            </Table.Td>
            <Table.Td rowData={admin} column={columns[4]}>
              {admin.mfa}
            </Table.Td>
            <Table.Td rowData={admin} column={columns[5]}>
              {admin.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={admin} column={columns[6]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
                )}
              >
                <ContextMenu.Item action={() => {}}>View details</ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setEditAdminUser(admin.username);
                    setEditAdminOpen(true);
                  }}
                >
                  Edit account
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setResetPasswordUser(admin.username);
                    setResetPasswordOpen(true);
                  }}
                >
                  Reset password
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setLockSettingUser(admin.username);
                    setLockSettingLocked(admin.locked);
                    setLockSettingOpen(true);
                  }}
                >
                  {admin.locked ? 'Unlock account' : 'Lock account'}
                </ContextMenu.Item>
                <ContextMenu.Item action={() => {}} danger>
                  Delete account
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
      <EditSystemAdminDrawer
        isOpen={editAdminOpen}
        onClose={() => setEditAdminOpen(false)}
        userName={editAdminUser}
      />
      <AdminLockSettingDrawer
        isOpen={lockSettingOpen}
        onClose={() => setLockSettingOpen(false)}
        userName={lockSettingUser}
        initialLocked={lockSettingLocked}
      />
      <ResetPasswordDrawer
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userName={resetPasswordUser}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
