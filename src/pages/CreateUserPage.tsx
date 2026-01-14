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
  Radio,
  Toggle,
  Table,
  Checkbox,
  Pagination,
  Tooltip,
  SelectionIndicator,
  InlineMessage,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconCheck,
  IconProgress,
  IconEye,
  IconEyeOff,
  IconCircle,
  IconCircleCheck,
  IconExternalLink,
  IconSearch,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'user-group';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  'user-group': SectionState;
}

interface UserGroup {
  id: string;
  name: string;
  type: string;
  roles: string;
  userCount: number;
  createdAt: string;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'user-group': 'Add user to the group',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'user-group'];

/* ----------------------------------------
   Mock Data - User Groups
   ---------------------------------------- */

const mockUserGroups: UserGroup[] = [
  { id: 'group-1', name: 'Users', type: 'Built-in', roles: 'ReadCompute (+3)', userCount: 130, createdAt: '2025-09-12' },
  { id: 'group-2', name: 'Admins', type: 'Built-in', roles: 'ReadCompute (+3)', userCount: 130, createdAt: '2025-09-12' },
  { id: 'group-3', name: 'Members', type: 'Built-in', roles: 'ReadCompute (+3)', userCount: 130, createdAt: '2025-09-12' },
  { id: 'group-4', name: 'test', type: 'Built-in', roles: 'ReadCompute (+3)', userCount: 130, createdAt: '2025-09-12' },
  { id: 'group-5', name: 'MemberGroup', type: 'Built-in', roles: 'ReadCompute (+3)', userCount: 130, createdAt: '2025-09-12' },
  { id: 'group-6', name: 'Developers', type: 'Custom', roles: 'FullAccess (+2)', userCount: 45, createdAt: '2025-08-15' },
  { id: 'group-7', name: 'Viewers', type: 'Custom', roles: 'ReadOnly', userCount: 200, createdAt: '2025-07-22' },
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
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
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
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
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
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }

  if (status === 'writing') {
    return null;
  }

  return <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />;
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

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateEnabled }: SummarySidebarProps) {
  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card with Header and Status */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Header */}
            <h4 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Create user
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
                      <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
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
   PasswordSection Component
   ---------------------------------------- */

interface PasswordSectionProps {
  passwordOption: 'temporary' | 'manual';
  onPasswordOptionChange: (value: 'temporary' | 'manual') => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordError: string | null;
  onPasswordErrorChange: (error: string | null) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  confirmPasswordError: string | null;
  onConfirmPasswordErrorChange: (error: string | null) => void;
}

function PasswordSection({
  passwordOption,
  onPasswordOptionChange,
  password,
  onPasswordChange,
  passwordError,
  onPasswordErrorChange,
  confirmPassword,
  onConfirmPasswordChange,
  confirmPasswordError,
  onConfirmPasswordErrorChange,
}: PasswordSectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation checks
  const hasMinLength = password.length >= 8 && password.length <= 64;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Password requirements tooltip content
  const passwordRequirementsTooltip = (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-2">
        {hasMinLength ? (
          <IconCircleCheck size={16} className="text-[#22c55e]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span className={`text-[11px] ${hasMinLength ? 'text-[#22c55e]' : 'text-white'}`}>
          8-64 characters long
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasUppercase ? (
          <IconCircleCheck size={16} className="text-[#22c55e]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span className={`text-[11px] ${hasUppercase ? 'text-[#22c55e]' : 'text-white'}`}>
          At least one uppercase letter (A-Z)
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasLowercase ? (
          <IconCircleCheck size={16} className="text-[#22c55e]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span className={`text-[11px] ${hasLowercase ? 'text-[#22c55e]' : 'text-white'}`}>
          At least one lowercase letter (a-z)
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasNumber ? (
          <IconCircleCheck size={16} className="text-[#22c55e]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span className={`text-[11px] ${hasNumber ? 'text-[#22c55e]' : 'text-white'}`}>
          At least one number
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasSpecialChar ? (
          <IconCircleCheck size={16} className="text-[#22c55e]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span className={`text-[11px] ${hasSpecialChar ? 'text-[#22c55e]' : 'text-white'}`}>
          At least one special character
        </span>
      </div>
    </div>
  );

  // Check if passwords match
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // Confirm password tooltip content
  const confirmPasswordTooltip = (
    <div className="flex items-center gap-2 p-1">
      {passwordsMatch ? (
        <IconCircleCheck size={16} className="text-[#22c55e]" />
      ) : (
        <IconCircle size={16} className="text-white/50" />
      )}
      <span className={`text-[11px] ${passwordsMatch ? 'text-[#22c55e]' : 'text-white'}`}>
        Passwords match.
      </span>
    </div>
  );

  return (
    <div className="flex flex-col py-6">
      <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
        Password <span className="text-[var(--color-state-danger)]">*</span>
      </label>
      <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
        Choose how to set the initial password for the user account.
      </span>
      <VStack gap={3}>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Radio
            value="temporary"
            checked={passwordOption === 'temporary'}
            onChange={() => onPasswordOptionChange('temporary')}
          />
          <span className="text-[12px] text-[var(--color-text-default)]">
            Issue a temporary password (email sent automatically)
          </span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Radio
            value="manual"
            checked={passwordOption === 'manual'}
            onChange={() => onPasswordOptionChange('manual')}
          />
          <span className="text-[12px] text-[var(--color-text-default)]">
            Set password manually (no email sent)
          </span>
        </label>
      </VStack>

      {/* Password inputs - shown when manual is selected */}
      {passwordOption === 'manual' && (
        <div className="mt-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-2">
          <HStack gap={6} align="center">
            {/* Password */}
            <HStack gap={1.5} align="center">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] whitespace-nowrap">
                Password
              </span>
              <Tooltip content={passwordRequirementsTooltip} position="bottom">
                <div className="relative w-[252px]">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      onPasswordChange(e.target.value);
                      onPasswordErrorChange(null);
                    }}
                    error={!!passwordError}
                    fullWidth
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </Tooltip>
            </HStack>

            {/* Confirm Password */}
            <HStack gap={1.5} align="center">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] whitespace-nowrap">
                Confirm password
              </span>
              <Tooltip content={confirmPasswordTooltip} position="bottom">
                <div className="relative w-[252px]">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onChange={(e) => {
                      onConfirmPasswordChange(e.target.value);
                      onConfirmPasswordErrorChange(null);
                    }}
                    error={!!confirmPasswordError}
                    fullWidth
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </Tooltip>
            </HStack>
          </HStack>
          {/* Error messages */}
          {(passwordError || confirmPasswordError) && (
            <div className="mt-1">
              {passwordError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px] mr-4">
                  {passwordError}
                </span>
              )}
              {confirmPasswordError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {confirmPasswordError}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  username: string;
  onUsernameChange: (value: string) => void;
  usernameError: string | null;
  onUsernameErrorChange: (error: string | null) => void;
  passwordOption: 'temporary' | 'manual';
  onPasswordOptionChange: (value: 'temporary' | 'manual') => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordError: string | null;
  onPasswordErrorChange: (error: string | null) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  confirmPasswordError: string | null;
  onConfirmPasswordErrorChange: (error: string | null) => void;
  email: string;
  onEmailChange: (value: string) => void;
  emailError: string | null;
  onEmailErrorChange: (error: string | null) => void;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  status: boolean;
  onStatusChange: (value: boolean) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  username,
  onUsernameChange,
  usernameError,
  onUsernameErrorChange,
  passwordOption,
  onPasswordOptionChange,
  password,
  onPasswordChange,
  passwordError,
  onPasswordErrorChange,
  confirmPassword,
  onConfirmPasswordChange,
  confirmPasswordError,
  onConfirmPasswordErrorChange,
  email,
  onEmailChange,
  emailError,
  onEmailErrorChange,
  displayName,
  onDisplayNameChange,
  status,
  onStatusChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  const handleNext = () => {
    let hasError = false;

    if (!username.trim()) {
      onUsernameErrorChange('Username is required.');
      hasError = true;
    }

    // Password validation when manual is selected
    if (passwordOption === 'manual') {
      if (!password.trim()) {
        onPasswordErrorChange('Password is required.');
        hasError = true;
      } else if (password.length < 8) {
        onPasswordErrorChange('Password must be at least 8 characters.');
        hasError = true;
      }

      if (!confirmPassword.trim()) {
        onConfirmPasswordErrorChange('Please confirm your password.');
        hasError = true;
      } else if (password !== confirmPassword) {
        onConfirmPasswordErrorChange('Passwords do not match.');
        hasError = true;
      }
    }

    if (!email.trim()) {
      onEmailErrorChange('Email address is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onEmailErrorChange('Please enter a valid email address.');
      hasError = true;
    }

    if (hasError) return;
    onNext();
  };

  const handleDone = () => {
    let hasError = false;

    if (!username.trim()) {
      onUsernameErrorChange('Username is required.');
      hasError = true;
    }

    // Password validation when manual is selected
    if (passwordOption === 'manual') {
      if (!password.trim()) {
        onPasswordErrorChange('Password is required.');
        hasError = true;
      } else if (password.length < 8) {
        onPasswordErrorChange('Password must be at least 8 characters.');
        hasError = true;
      }

      if (!confirmPassword.trim()) {
        onConfirmPasswordErrorChange('Please confirm your password.');
        hasError = true;
      } else if (password !== confirmPassword) {
        onConfirmPasswordErrorChange('Passwords do not match.');
        hasError = true;
      }
    }

    if (!email.trim()) {
      onEmailErrorChange('Email address is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onEmailErrorChange('Please enter a valid email address.');
      hasError = true;
    }

    if (hasError) return;
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
          {/* Username */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Username <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
              This is the user's unique identifier for signing in. It cannot be changed once created.
            </span>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                onUsernameChange(e.target.value);
                onUsernameErrorChange(null);
              }}
              error={!!usernameError}
              fullWidth
            />
            <div className="flex flex-col gap-1 mt-1">
              {usernameError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {usernameError}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                You can use letters, numbers, and special characters (-_.), and the length must be between
                3-64 characters.
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Password */}
          <PasswordSection
            passwordOption={passwordOption}
            onPasswordOptionChange={onPasswordOptionChange}
            password={password}
            onPasswordChange={onPasswordChange}
            passwordError={passwordError}
            onPasswordErrorChange={onPasswordErrorChange}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={onConfirmPasswordChange}
            confirmPasswordError={confirmPasswordError}
            onConfirmPasswordErrorChange={onConfirmPasswordErrorChange}
          />

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Email Address */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Email address <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
              The email address used for user invitations and notifications.
            </span>
            <Input
              placeholder="user@example.com"
              value={email}
              onChange={(e) => {
                onEmailChange(e.target.value);
                onEmailErrorChange(null);
              }}
              error={!!emailError}
              fullWidth
            />
            {emailError && (
              <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px] mt-1">
                {emailError}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Display Name */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Display name
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
              This is the user's display name. If left blank, the username will be shown instead.
            </span>
            <Input
              placeholder="Enter display name"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              fullWidth
            />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Status */}
          <div className="flex flex-col py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">Status</label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4 mb-2">
              Select the user's status. If 'Disabled', the user will be prevented from signing in.
            </span>
            <HStack gap={2} align="center">
              <Toggle checked={status} onChange={onStatusChange} />
              <span className="text-[12px] text-[var(--color-text-default)]">
                {status ? 'Enabled' : 'Disabled'}
              </span>
            </HStack>
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
   UserGroupSection Component
   ---------------------------------------- */

interface UserGroupSectionProps {
  selectedGroups: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
  userGroupError: string | null;
  onUserGroupErrorChange: (error: string | null) => void;
}

function UserGroupSection({
  selectedGroups,
  onSelectionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
  userGroupError,
  onUserGroupErrorChange,
}: UserGroupSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredGroups = mockUserGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<UserGroup>[] = [
    {
      key: 'name',
      label: 'User group name',
      sortable: true,
      render: (_, row) => (
        <HStack gap={1.5} align="center">
          <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.name}</span>
          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
        </HStack>
      ),
    },
    {
      key: 'type',
      label: 'Type',
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
      key: 'userCount',
      label: 'User count',
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
        title="Add user to the group"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => {
                if (selectedGroups.length === 0) {
                  onUserGroupErrorChange('Please select at least one user group.');
                  return;
                }
                onEditDone();
              }}>
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
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">User groups</span>
              <span className="text-[var(--color-state-danger)]">*</span>
            </div>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Select the user groups this user will belong to. Users will automatically inherit the permissions assigned to their groups.
            </span>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative" style={{ width: '280px' }}>
              <input
                type="text"
                placeholder="Search user groups by attributes"
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
                {filteredGroups.length} items
              </span>
            </div>
          )}

          {/* Table */}
          <div className="mt-3">
            <Table
              columns={columns}
              data={paginatedGroups}
              rowKey="id"
              selectable
              selectedKeys={selectedGroups}
              onSelectionChange={onSelectionChange}
            />
          </div>

          {/* Selection indicator */}
          <div className="mt-3">
            {userGroupError && selectedGroups.length === 0 ? (
              <InlineMessage variant="error">
                {userGroupError}
              </InlineMessage>
            ) : (
              <SelectionIndicator
                selectedItems={selectedGroups.map((groupId) => {
                  const group = mockUserGroups.find((g) => g.id === groupId);
                  return { id: groupId, label: group?.name || groupId };
                })}
                onRemove={(id) => {
                  onSelectionChange(selectedGroups.filter((gId) => gId !== id));
                }}
              />
            )}
          </div>

        </VStack>
        {/* Next Button (only when not editing) */}
        {!isEditing && (
          <>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" className="pt-3">
              <Button variant="primary" onClick={() => {
                if (selectedGroups.length === 0) {
                  onUserGroupErrorChange('Please select at least one user group.');
                  return;
                }
                onNext();
              }}>
                Done
              </Button>
            </HStack>
          </>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main CreateUserPage Component
   ---------------------------------------- */

export default function CreateUserPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Create user');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    'user-group': 'pre',
  });
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Form state - Basic Information
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordOption, setPasswordOption] = useState<'temporary' | 'manual'>('temporary');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState(true);

  // Form state - User Groups
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [userGroupError, setUserGroupError] = useState<string | null>(null);

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
    navigate('/iam/users');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    console.log('Creating user:', {
      username,
      passwordOption,
      email,
      displayName,
      status,
      selectedGroups,
    });
    navigate('/iam/users');
  }, [navigate, username, passwordOption, email, displayName, status, selectedGroups]);

  // Get display values for done sections
  const getPasswordOptionDisplay = () => {
    return passwordOption === 'temporary'
      ? 'Temporary password (email sent)'
      : 'Manual password (no email)';
  };

  const getSelectedGroupsDisplay = () => {
    if (selectedGroups.length === 0) return 'No groups selected';
    const groupNames = selectedGroups
      .map((id) => mockUserGroups.find((g) => g.id === id)?.name)
      .filter(Boolean);
    return groupNames.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath="/iam/users"
      />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
                { label: 'Users', href: '/iam/users' },
                { label: 'Create user' },
              ]}
            />
          }
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">

            {/* Main content area */}
            <VStack gap={6} className="min-w-[1176px]">
              {/* Page Title */}
              <h1 className="text-[18px] font-semibold leading-7 text-[var(--color-text-default)]">
                Create user
              </h1>
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
                      username={username}
                      onUsernameChange={setUsername}
                      usernameError={usernameError}
                      onUsernameErrorChange={setUsernameError}
                      passwordOption={passwordOption}
                      onPasswordOptionChange={setPasswordOption}
                      password={password}
                      onPasswordChange={setPassword}
                      passwordError={passwordError}
                      onPasswordErrorChange={setPasswordError}
                      confirmPassword={confirmPassword}
                      onConfirmPasswordChange={setConfirmPassword}
                      confirmPasswordError={confirmPasswordError}
                      onConfirmPasswordErrorChange={setConfirmPasswordError}
                      email={email}
                      onEmailChange={setEmail}
                      emailError={emailError}
                      onEmailErrorChange={setEmailError}
                      displayName={displayName}
                      onDisplayNameChange={setDisplayName}
                      status={status}
                      onStatusChange={setStatus}
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
                      <SectionCard.DataRow label="Username" value={username} showDivider={false} />
                      <SectionCard.DataRow label="Password" value={getPasswordOptionDisplay()} />
                      <SectionCard.DataRow label="Email" value={email} />
                      <SectionCard.DataRow label="Display name" value={displayName || '-'} />
                      <SectionCard.DataRow label="Status" value={status ? 'Enabled' : 'Disabled'} />
                    </DoneSection>
                  )}

                  {/* User Group Section */}
                  {sectionStatus['user-group'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['user-group']} />
                  )}
                  {sectionStatus['user-group'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['user-group']} />
                  )}
                  {sectionStatus['user-group'] === 'active' && (
                    <UserGroupSection
                      selectedGroups={selectedGroups}
                      onSelectionChange={(ids) => {
                        setSelectedGroups(ids);
                        if (ids.length > 0) {
                          setUserGroupError(null);
                        }
                      }}
                      onNext={() => handleNext('user-group')}
                      isEditing={editingSection === 'user-group'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                      userGroupError={userGroupError}
                      onUserGroupErrorChange={setUserGroupError}
                    />
                  )}
                  {sectionStatus['user-group'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['user-group']}
                      onEdit={() => handleEdit('user-group')}
                    >
                      <SectionCard.DataRow
                        label="Selected groups"
                        value={getSelectedGroupsDisplay()}
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
