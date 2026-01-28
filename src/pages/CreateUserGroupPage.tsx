import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  SectionCard,
  Table,
  Pagination,
  SelectionIndicator,
  InlineMessage,
  StatusIndicator,
  type TableColumn,
  fixedColumns,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconCheck,
  IconProgress,
  IconExternalLink,
  IconSearch,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'add-users';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  'add-users': SectionState;
}

interface User {
  id: string;
  username: string;
  userGroups: string;
  roles: string;
  lastSignIn: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'add-users': 'Add users to the group',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'add-users'];

/* ----------------------------------------
   Mock Data - Users
   ---------------------------------------- */

const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-2',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-3',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-4',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-5',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-6',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-7',
    username: 'thaki-kim',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    lastSignIn: '2025-09-12',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-8',
    username: 'admin-user',
    userGroups: 'admins (+1)',
    roles: 'full-access (+5)',
    lastSignIn: '2025-09-10',
    status: 'active',
    createdAt: '2025-09-10',
  },
  {
    id: 'user-9',
    username: 'dev-user',
    userGroups: 'developers (+3)',
    roles: 'write-access (+2)',
    lastSignIn: '2025-09-08',
    status: 'active',
    createdAt: '2025-09-08',
  },
  {
    id: 'user-10',
    username: 'viewer-user',
    userGroups: 'viewers',
    roles: 'read-only',
    lastSignIn: '2025-09-05',
    status: 'inactive',
    createdAt: '2025-09-05',
  },
  {
    id: 'user-11',
    username: 'test-user-1',
    userGroups: 'testers (+1)',
    roles: 'qa-role (+2)',
    lastSignIn: '2025-09-01',
    status: 'active',
    createdAt: '2025-09-01',
  },
  {
    id: 'user-12',
    username: 'test-user-2',
    userGroups: 'testers (+1)',
    roles: 'qa-role (+2)',
    lastSignIn: '2025-08-28',
    status: 'active',
    createdAt: '2025-08-28',
  },
  {
    id: 'user-13',
    username: 'ops-user',
    userGroups: 'ops-team (+2)',
    roles: 'infra-admin (+3)',
    lastSignIn: '2025-08-25',
    status: 'active',
    createdAt: '2025-08-25',
  },
  {
    id: 'user-14',
    username: 'support-user',
    userGroups: 'support (+1)',
    roles: 'support-role',
    lastSignIn: '2025-08-20',
    status: 'active',
    createdAt: '2025-08-20',
  },
  {
    id: 'user-15',
    username: 'manager-user',
    userGroups: 'managers (+2)',
    roles: 'manager-role (+4)',
    lastSignIn: '2025-08-15',
    status: 'active',
    createdAt: '2025-08-15',
  },
  {
    id: 'user-16',
    username: 'analyst-user',
    userGroups: 'analysts',
    roles: 'read-analytics',
    lastSignIn: '2025-08-10',
    status: 'active',
    createdAt: '2025-08-10',
  },
  {
    id: 'user-17',
    username: 'security-user',
    userGroups: 'security (+3)',
    roles: 'security-admin (+5)',
    lastSignIn: '2025-08-05',
    status: 'active',
    createdAt: '2025-08-05',
  },
  {
    id: 'user-18',
    username: 'finance-user',
    userGroups: 'finance (+1)',
    roles: 'finance-role (+2)',
    lastSignIn: '2025-08-01',
    status: 'inactive',
    createdAt: '2025-08-01',
  },
  {
    id: 'user-19',
    username: 'hr-user',
    userGroups: 'hr-team (+2)',
    roles: 'hr-role (+3)',
    lastSignIn: '2025-07-28',
    status: 'active',
    createdAt: '2025-07-28',
  },
  {
    id: 'user-20',
    username: 'legal-user',
    userGroups: 'legal',
    roles: 'legal-role',
    lastSignIn: '2025-07-25',
    status: 'active',
    createdAt: '2025-07-25',
  },
  {
    id: 'user-21',
    username: 'marketing-user',
    userGroups: 'marketing (+1)',
    roles: 'marketing-role (+2)',
    lastSignIn: '2025-07-20',
    status: 'active',
    createdAt: '2025-07-20',
  },
  {
    id: 'user-22',
    username: 'sales-user',
    userGroups: 'sales (+2)',
    roles: 'sales-role (+3)',
    lastSignIn: '2025-07-15',
    status: 'active',
    createdAt: '2025-07-15',
  },
  {
    id: 'user-23',
    username: 'customer-user',
    userGroups: 'customers',
    roles: 'customer-role',
    lastSignIn: '2025-07-10',
    status: 'active',
    createdAt: '2025-07-10',
  },
  {
    id: 'user-24',
    username: 'partner-user',
    userGroups: 'partners (+1)',
    roles: 'partner-role (+2)',
    lastSignIn: '2025-07-05',
    status: 'active',
    createdAt: '2025-07-05',
  },
  {
    id: 'user-25',
    username: 'vendor-user',
    userGroups: 'vendors',
    roles: 'vendor-role',
    lastSignIn: '2025-07-01',
    status: 'inactive',
    createdAt: '2025-07-01',
  },
];

/* ----------------------------------------
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSection Component
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header
        title={title}
        showDivider
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   SectionStatusIcon Component
   ---------------------------------------- */

function SectionStatusIcon({ status }: { status: SectionState }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress
          size={16}
          stroke={1.5}
          className="text-[var(--color-text-subtle)] animate-spin"
        />
      </div>
    );
  }

  if (status === 'writing') {
    return null;
  }

  return (
    <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
  );
}

/* ----------------------------------------
   SummarySidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: SectionStatus;
  onCancel: () => void;
  onCreate: () => void;
  isCreateEnabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateEnabled,
}: SummarySidebarProps) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card with Header and Status */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Header */}
            <h4 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Create user group
            </h4>

            {/* Section Status List */}
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-[12px] leading-5 text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-[11px] text-[var(--color-text-subtle)]">
                        Writing...
                      </span>
                    ) : (
                      <SectionStatusIcon status={sectionStatus[sectionKey]} />
                    )}
                  </div>
                );
              })}
            </div>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button
            variant={isCreateEnabled ? 'primary' : 'secondary'}
            onClick={onCreate}
            disabled={!isCreateEnabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  groupName: string;
  onGroupNameChange: (value: string) => void;
  groupNameError: string | null;
  onGroupNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  groupName,
  onGroupNameChange,
  groupNameError,
  onGroupNameErrorChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  const handleNext = () => {
    if (!groupName.trim()) {
      onGroupNameErrorChange('Group name is required.');
      return;
    }
    onNext();
  };

  const handleDone = () => {
    if (!groupName.trim()) {
      onGroupNameErrorChange('Group name is required.');
      return;
    }
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic Information"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Group Name */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Group name <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
              Enter a unique name for the user group. This will be used to identify the group across
              the system.
            </span>
            <Input
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => {
                onGroupNameChange(e.target.value);
                onGroupNameErrorChange(null);
              }}
              error={!!groupNameError}
              fullWidth
            />
            <div className="flex flex-col gap-1 mt-1">
              {groupNameError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {groupNameError}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                You can use letters, numbers, and special characters (-_.), and the length must be
                between 3-64 characters.
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Description
            </label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
              You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
              characters.
            </span>
          </div>

          {/* Divider + Next Button (only when not editing) */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   AddUsersSection Component
   ---------------------------------------- */

interface AddUsersSectionProps {
  selectedUsers: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
  usersError: string | null;
  onUsersErrorChange: (error: string | null) => void;
}

function AddUsersSection({
  selectedUsers,
  onSelectionChange,
  onNext,
  onSkip,
  isEditing,
  onEditCancel,
  onEditDone,
  usersError,
  onUsersErrorChange,
}: AddUsersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userGroups.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<User>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (_, row) => (
        <HStack gap={1.5} align="center">
          <span className="text-[12px] font-medium text-[var(--color-action-primary)]">
            {row.username}
          </span>
          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
        </HStack>
      ),
    },
    {
      key: 'userGroups',
      label: 'User groups',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'lastSignIn',
      label: 'Last Sign-in',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Add users to the group"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (selectedUsers.length === 0) {
                    onUsersErrorChange('Please select at least one user.');
                    return;
                  }
                  onEditDone();
                }}
              >
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={0} className="pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-[3px]">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                Users
              </span>
              <span className="text-[var(--color-state-danger)]">*</span>
            </div>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Select users to include in this group. All selected users will receive the group's
              assigned roles and policies.
            </span>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative w-[var(--search-input-width)]">
              <input
                type="text"
                placeholder="Search users by attributes"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 pl-3 pr-9 text-[12px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-action-primary)] focus:shadow-[0_0_0_1px_var(--color-action-primary)]"
              />
              <IconSearch
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] pointer-events-none"
              />
            </div>
          </div>

          {/* Pagination above table */}
          {totalPages > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <div className="h-4 w-px bg-[var(--color-border-default)]" />
              <span className="text-[11px] text-[var(--color-text-subtle)]">
                {filteredUsers.length} items
              </span>
            </div>
          )}

          {/* Table */}
          <div className="mt-3">
            <Table
              columns={columns}
              data={paginatedUsers}
              rowKey="id"
              selectable
              selectedKeys={selectedUsers}
              onSelectionChange={onSelectionChange}
            />
          </div>

          {/* Selection indicator */}
          <div className="mt-3">
            {usersError && selectedUsers.length === 0 ? (
              <InlineMessage variant="error">{usersError}</InlineMessage>
            ) : (
              <SelectionIndicator
                selectedItems={selectedUsers.map((userId) => {
                  const user = mockUsers.find((u) => u.id === userId);
                  return { id: userId, label: user?.username || userId };
                })}
                onRemove={(id) => {
                  onSelectionChange(selectedUsers.filter((uId) => uId !== id));
                }}
              />
            )}
          </div>
        </VStack>
        {/* Skip and Next Buttons (only when not editing) */}
        {!isEditing && (
          <>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" gap={2} className="pt-3">
              <Button variant="secondary" onClick={onSkip}>
                Skip
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedUsers.length === 0) {
                    onUsersErrorChange('Please select at least one user.');
                    return;
                  }
                  onNext();
                }}
              >
                Next
              </Button>
            </HStack>
          </>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main CreateUserGroupPage Component
   ---------------------------------------- */

export default function CreateUserGroupPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Create user group');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    'add-users': 'pre',
  });
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Form state - Basic Information
  const [groupName, setGroupName] = useState('');
  const [groupNameError, setGroupNameError] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Form state - Users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Check if all sections are done
  const allSectionsDone = Object.values(sectionStatus).every((s) => s === 'done');

  // Helper functions for editing
  const handleEdit = useCallback((section: SectionStep) => {
    setEditingSection(section);
    const sectionIndex = SECTION_ORDER.indexOf(section);

    setSectionStatus((prev) => {
      const newStatus = { ...prev };

      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((key, index) => {
        if (index < sectionIndex) {
          newStatus[key] = 'done';
        } else if (index === sectionIndex) {
          newStatus[key] = 'active';
        } else if (prev[key] === 'done' || prev[key] === 'active') {
          newStatus[key] = 'writing';
        }
      });

      return newStatus;
    });
  }, []);

  const handleEditCancel = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle section navigation
  const handleNext = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    setSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/iam/user-groups');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    console.log('Creating user group:', {
      groupName,
      description,
      selectedUsers,
    });
    navigate('/iam/user-groups');
  }, [navigate, groupName, description, selectedUsers]);

  // Get display values for done sections
  const getSelectedUsersDisplay = () => {
    if (selectedUsers.length === 0) return 'No users selected';
    const usernames = selectedUsers
      .map((id) => mockUsers.find((u) => u.id === id)?.username)
      .filter(Boolean);
    return usernames.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath="/iam/user-groups"
      />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'User groups', href: '/iam/user-groups' },
                { label: 'Create user group' },
              ]}
            />
          }
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">
            {/* Main content area */}
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create user group
                </h1>
              </div>
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInformationSection
                      groupName={groupName}
                      onGroupNameChange={setGroupName}
                      groupNameError={groupNameError}
                      onGroupNameErrorChange={setGroupNameError}
                      description={description}
                      onDescriptionChange={setDescription}
                      onNext={() => handleNext('basic-info')}
                      isEditing={editingSection === 'basic-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['basic-info']}
                      onEdit={() => handleEdit('basic-info')}
                    >
                      <SectionCard.DataRow
                        label="Group name"
                        value={groupName}
                        showDivider={false}
                      />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Add Users Section */}
                  {sectionStatus['add-users'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['add-users']} />
                  )}
                  {sectionStatus['add-users'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['add-users']} />
                  )}
                  {sectionStatus['add-users'] === 'active' && (
                    <AddUsersSection
                      selectedUsers={selectedUsers}
                      onSelectionChange={(ids) => {
                        setSelectedUsers(ids);
                        if (ids.length > 0) {
                          setUsersError(null);
                        }
                      }}
                      onNext={() => handleNext('add-users')}
                      onSkip={() => handleNext('add-users')}
                      isEditing={editingSection === 'add-users'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                      usersError={usersError}
                      onUsersErrorChange={setUsersError}
                    />
                  )}
                  {sectionStatus['add-users'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['add-users']}
                      onEdit={() => handleEdit('add-users')}
                    >
                      <SectionCard.DataRow
                        label="Selected users"
                        value={getSelectedUsersDisplay()}
                        showDivider={false}
                      />
                    </DoneSection>
                  )}
                </VStack>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateEnabled={allSectionsDone && !editingSection}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
