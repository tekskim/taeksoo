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
  Pagination,
  StatusIndicator,
  SelectionIndicator,
  SearchInput,
  FormField,
  Tooltip,
  PageShell,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconCircle,
  IconCircleCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'default-domain';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  'default-domain': SectionState;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'default-domain': 'Default domain',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'default-domain'];

/* ----------------------------------------
   Mock Data - Domains
   ---------------------------------------- */

const mockDomains: Domain[] = [
  { id: 'domain-1', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-2', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-3', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-4', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-5', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-6', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-7', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-8', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-9', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-10', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-11', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-12', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-13', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-14', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-15', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-16', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-17', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-18', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-19', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-20', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-21', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-22', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-23', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-24', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
  { id: 'domain-25', name: 'domain', description: '-', createdAt: 'Sep 12, 2025' },
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
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
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
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
        <span className="text-body-sm text-[var(--color-text-subtle)]">Writing...</span>
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
      <div
        className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }

  if (status === 'writing') {
    return (
      <div
        className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-text-muted)] animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }

  return (
    <div
      className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]"
      style={{ borderStyle: 'dashed' }}
    />
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
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Create account</h4>

            {/* Section Status List */}
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
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
          <Button variant="secondary" onClick={onCancel}>
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
          <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span
          className={`text-body-sm ${hasMinLength ? 'text-[var(--color-state-success)]' : 'text-white'}`}
        >
          8-64 characters long
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasUppercase ? (
          <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span
          className={`text-body-sm ${hasUppercase ? 'text-[var(--color-state-success)]' : 'text-white'}`}
        >
          At least one uppercase letter (A-Z)
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasLowercase ? (
          <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span
          className={`text-body-sm ${hasLowercase ? 'text-[var(--color-state-success)]' : 'text-white'}`}
        >
          At least one lowercase letter (a-z)
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasNumber ? (
          <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span
          className={`text-body-sm ${hasNumber ? 'text-[var(--color-state-success)]' : 'text-white'}`}
        >
          At least one number
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasSpecialChar ? (
          <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCircle size={16} className="text-white/50" />
        )}
        <span
          className={`text-body-sm ${hasSpecialChar ? 'text-[var(--color-state-success)]' : 'text-white'}`}
        >
          At least one special character
        </span>
      </div>
    </div>
  );

  // Check if passwords match
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // Confirm password tooltip content
  const confirmPasswordTooltip = (
    <div className="flex items-center gap-2 p-1">
      {passwordsMatch ? (
        <IconCircleCheck size={16} className="text-[var(--color-state-success)]" />
      ) : (
        <IconCircle size={16} className="text-white/50" />
      )}
      <span
        className={`text-body-sm ${passwordsMatch ? 'text-[var(--color-state-success)]' : 'text-white'}`}
      >
        Passwords match.
      </span>
    </div>
  );

  return (
    <div className="py-6">
      <FormField required>
        <FormField.Label>Temporary Password</FormField.Label>
        <FormField.Description>
          The temporary password will be valid for 7 days. The account holder must sign in and
          change the password within this period.
        </FormField.Description>
        <FormField.Control>
          <VStack gap={2}>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Radio
                value="temporary"
                checked={passwordOption === 'temporary'}
                onChange={() => onPasswordOptionChange('temporary')}
              />
              <span className="text-body-md text-[var(--color-text-default)]">
                Auto-generated password
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Radio
                value="manual"
                checked={passwordOption === 'manual'}
                onChange={() => onPasswordOptionChange('manual')}
              />
              <span className="text-body-md text-[var(--color-text-default)]">Manually</span>
            </label>
          </VStack>
        </FormField.Control>
      </FormField>

      {/* Password inputs - shown when manual is selected */}
      {passwordOption === 'manual' && (
        <div className="mt-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-2">
          <HStack gap={6} align="center">
            {/* Password */}
            <FormField required error={!!passwordError}>
              <FormField.Label>Password</FormField.Label>
              <FormField.Control>
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
              </FormField.Control>
              {passwordError && <FormField.ErrorMessage>{passwordError}</FormField.ErrorMessage>}
            </FormField>

            {/* Confirm Password */}
            <FormField required error={!!confirmPasswordError}>
              <FormField.Label>Confirm password</FormField.Label>
              <FormField.Control>
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
              </FormField.Control>
              {confirmPasswordError && (
                <FormField.ErrorMessage>{confirmPasswordError}</FormField.ErrorMessage>
              )}
            </FormField>
          </HStack>
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
        title="Basic information"
        showDivider={false}
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
      <SectionCard.Content showDividers={false}>
        <VStack gap={0}>
          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Username */}
          <div className="py-6">
            <FormField required error={!!usernameError}>
              <FormField.Label>Username</FormField.Label>
              <FormField.Description>
                This is the account's unique identifier for signing in. It cannot be changed once
                created.
              </FormField.Description>
              <FormField.Control>
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    onUsernameChange(e.target.value);
                    onUsernameErrorChange(null);
                  }}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (-_.), and the length must be
                between 3-64 characters.
              </FormField.HelperText>
              {usernameError && <FormField.ErrorMessage>{usernameError}</FormField.ErrorMessage>}
            </FormField>
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
          <div className="py-6">
            <FormField required error={!!emailError}>
              <FormField.Label>Email address</FormField.Label>
              <FormField.Description>
                The email address used for user invitations and notifications.
              </FormField.Description>
              <FormField.Control>
                <Input
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => {
                    onEmailChange(e.target.value);
                    onEmailErrorChange(null);
                  }}
                  fullWidth
                />
              </FormField.Control>
              {emailError && <FormField.ErrorMessage>{emailError}</FormField.ErrorMessage>}
            </FormField>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Display Name */}
          <div className="py-6">
            <FormField>
              <FormField.Label>Display name</FormField.Label>
              <FormField.Description>
                This is the user's display name. If left blank, the username will be shown instead.
              </FormField.Description>
              <FormField.Control>
                <Input
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => onDisplayNameChange(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
            </FormField>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Status */}
          <div className="py-6">
            <FormField>
              <FormField.Label>Status</FormField.Label>
              <FormField.Description>
                Select the user's status. If 'Disabled', the user will be prevented from signing in.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} align="center">
                  <Toggle checked={status} onChange={onStatusChange} />
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {status ? 'Enabled' : 'Disabled'}
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>
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
   DefaultDomainSection Component
   ---------------------------------------- */

interface DefaultDomainSectionProps {
  selectedDomain: string | null;
  onSelectionChange: (id: string | null) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
  domainError: string | null;
  onDomainErrorChange: (error: string | null) => void;
}

function DefaultDomainSection({
  selectedDomain,
  onSelectionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
  domainError,
  onDomainErrorChange,
}: DefaultDomainSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDomains = mockDomains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (domainId: string) => {
    onSelectionChange(domainId);
    onDomainErrorChange(null);
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Default domain"
        showDivider={false}
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
                  if (!selectedDomain) {
                    onDomainErrorChange('Please select a domain.');
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
      <SectionCard.Content showDividers={false}>
        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        <VStack gap={0} className="py-6">
          <FormField required error={!!domainError && !selectedDomain}>
            <FormField.Label>Domains</FormField.Label>
            <FormField.Description>
              Defines which domain is opened first when the administrator signs in. The selected
              domain is used as the initial workspace.
            </FormField.Description>
            <FormField.Control>
              {/* Search */}
              <div className="mt-4">
                <SearchInput
                  placeholder="Search domains by attributes"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  onClear={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
              </div>

              {/* Pagination above table */}
              {totalPages > 0 && (
                <div className="mt-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredDomains.length}
                  />
                </div>
              )}

              {/* Custom Table with radio selection */}
              <VStack gap={2} className="mt-3">
                <div className="flex flex-col gap-[var(--table-row-gap)]">
                  {/* Table Header */}
                  <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] rounded-[var(--table-row-radius)] border border-[var(--color-border-default)]">
                    {/* Radio column header */}
                    <div className="shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]" />
                    {/* Status column header */}
                    <div className="flex items-center justify-center w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Status
                    </div>
                    {/* Name column header */}
                    <div className="flex items-center flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Name
                    </div>
                    {/* Description column header */}
                    <div className="flex items-center flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Description
                    </div>
                    {/* Created at column header */}
                    <div className="flex items-center w-[120px] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                      Created at
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)]">
                    {paginatedDomains.map((domain) => (
                      <div
                        key={domain.id}
                        onClick={() => handleRowClick(domain.id)}
                        className={`flex items-center h-[var(--table-row-height)] rounded-[var(--table-row-radius)] border overflow-hidden cursor-pointer transition-all hover:bg-[var(--table-row-hover-bg)] ${
                          selectedDomain === domain.id
                            ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]'
                            : 'border-[var(--color-border-default)] bg-[var(--color-surface-default)]'
                        }`}
                      >
                        {/* Radio column */}
                        <div className="shrink-0 w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center justify-center">
                          <Radio
                            value={domain.id}
                            checked={selectedDomain === domain.id}
                            onChange={() => handleRowClick(domain.id)}
                          />
                        </div>
                        {/* Status column */}
                        <div className="w-[80px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] flex items-center justify-center border-l border-transparent">
                          <StatusIndicator status="active" layout="icon-only" size="md" />
                        </div>
                        {/* Name column */}
                        <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] border-l border-transparent">
                          {domain.name}
                        </div>
                        {/* Description column */}
                        <div className="flex-1 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] border-l border-transparent">
                          {domain.description}
                        </div>
                        {/* Created at column */}
                        <div className="w-[120px] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] border-l border-transparent">
                          {domain.createdAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <SelectionIndicator
                  selectedItems={
                    selectedDomain
                      ? [
                          {
                            id: selectedDomain,
                            label:
                              mockDomains.find((d) => d.id === selectedDomain)?.name ||
                              selectedDomain,
                          },
                        ]
                      : []
                  }
                  onRemove={() => onSelectionChange(null)}
                  error={!!domainError && !selectedDomain}
                  errorMessage={domainError || undefined}
                />
              </VStack>
            </FormField.Control>
          </FormField>
        </VStack>
        {/* Next Button (only when not editing) */}
        {!isEditing && (
          <>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" className="pt-3">
              <Button
                variant="primary"
                onClick={() => {
                  if (!selectedDomain) {
                    onDomainErrorChange('Please select a domain.');
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
   Main CreateSystemAdministratorPage Component
   ---------------------------------------- */

export default function CreateSystemAdministratorPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Create account');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    'default-domain': 'pre',
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

  // Form state - Default Domain
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

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
    navigate('/iam/system-administrators');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    console.log('Creating system administrator:', {
      username,
      passwordOption,
      email,
      displayName,
      status,
      selectedDomain,
    });
    navigate('/iam/system-administrators');
  }, [navigate, username, passwordOption, email, displayName, status, selectedDomain]);

  // Get display values for done sections
  const getPasswordOptionDisplay = () => {
    return passwordOption === 'temporary' ? 'Auto-generated password' : 'Manually';
  };

  const getSelectedDomainDisplay = () => {
    if (!selectedDomain) return 'No domain selected';
    const domain = mockDomains.find((d) => d.id === selectedDomain);
    return domain?.name || selectedDomain;
  };

  return (
    <PageShell
      sidebar={
        <IAMSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath="/iam/system-administrators"
        />
      }
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'System administrators', href: '/iam/system-administrators' },
                { label: 'Create account' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      {/* Main content area */}
      <VStack gap={3} className="min-w-[1176px]">
        {/* Page Title */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create account</h1>
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

            {/* Default Domain Section */}
            {sectionStatus['default-domain'] === 'pre' && (
              <PreSection title={SECTION_LABELS['default-domain']} />
            )}
            {sectionStatus['default-domain'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['default-domain']} />
            )}
            {sectionStatus['default-domain'] === 'active' && (
              <DefaultDomainSection
                selectedDomain={selectedDomain}
                onSelectionChange={(id) => {
                  setSelectedDomain(id);
                  if (id) {
                    setDomainError(null);
                  }
                }}
                onNext={() => handleNext('default-domain')}
                isEditing={editingSection === 'default-domain'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
                domainError={domainError}
                onDomainErrorChange={setDomainError}
              />
            )}
            {sectionStatus['default-domain'] === 'done' && (
              <DoneSection
                title={SECTION_LABELS['default-domain']}
                onEdit={() => handleEdit('default-domain')}
              >
                <SectionCard.DataRow
                  label="Selected domain"
                  value={getSelectedDomainDisplay()}
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
    </PageShell>
  );
}
