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
  Password,
  Radio,
  RadioGroup,
  SectionCard,
  FormField,
  PageShell,
  WizardSummary,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useIsV2 } from '@/hooks/useIsV2';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'configuration' | 'domain-admin';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  configuration: SectionState;
  'domain-admin': SectionState;
}

const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  configuration: 'Storage',
  'domain-admin': 'Domain administrator',
};

const SECTION_ORDER: SectionStep[] = ['basic-info', 'configuration', 'domain-admin'];

const STORAGE_TYPE_OPTIONS = [
  { value: 'thaki-storage', label: 'Thaki storage' },
  { value: 'local-storage', label: 'Local storage' },
];

const PASSWORD_OPTIONS = [
  { value: 'temporary', label: 'Issue a temporary password (email sent automatically)' },
  { value: 'manual', label: 'Set password manually (no email sent)' },
];

/* ----------------------------------------
   PreSection Component
   ---------------------------------------- */

function PreSection({ title }: { title: string }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

function WritingSection({ title }: { title: string }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] px-4 py-3">
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

function DoneSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
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
   SummarySidebar Component
   ---------------------------------------- */

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateEnabled,
}: {
  sectionStatus: SectionStatus;
  onCancel: () => void;
  onCreate: () => void;
  isCreateEnabled: boolean;
}) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-4">
        <WizardSummary
          items={SECTION_ORDER.map((key) => ({
            key,
            label: SECTION_LABELS[key],
            status: sectionStatus[key],
          }))}
        />
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
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInfoSectionProps {
  domainName: string;
  onDomainNameChange: (value: string) => void;
  domainNameError: string | null;
  onDomainNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  descriptionError: string | null;
  onDescriptionErrorChange: (error: string | null) => void;
  onNext: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  domainName,
  onDomainNameChange,
  domainNameError,
  onDomainNameErrorChange,
  description,
  onDescriptionChange,
  descriptionError,
  onDescriptionErrorChange,
  onNext,
  isActive,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const validate = () => {
    let hasError = false;
    if (!domainName.trim()) {
      onDomainNameErrorChange('Please enter a domain name.');
      hasError = true;
    } else if (domainName.trim().length < 3 || domainName.trim().length > 64) {
      onDomainNameErrorChange('Name must be between 3-64 characters.');
      hasError = true;
    }
    if (description.length > 255) {
      onDescriptionErrorChange('Description must be 255 characters or less.');
      hasError = true;
    }
    return !hasError;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  const handleDone = () => {
    if (!validate()) return;
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <div className="py-6">
            <FormField required error={!!domainNameError}>
              <FormField.Label>Domain name</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter domain name"
                  value={domainName}
                  onChange={(e) => {
                    onDomainNameChange(e.target.value);
                    onDomainNameErrorChange(null);
                  }}
                  error={!!domainNameError}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{domainNameError}</FormField.ErrorMessage>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (-_.), and the length must be
                between 3-64 characters.
              </FormField.HelperText>
            </FormField>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <div className="py-6">
            <FormField error={!!descriptionError}>
              <FormField.Label>Description</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => {
                    onDescriptionChange(e.target.value);
                    onDescriptionErrorChange(null);
                  }}
                  error={!!descriptionError}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{descriptionError}</FormField.ErrorMessage>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
                characters.
              </FormField.HelperText>
            </FormField>
          </div>

          {isActive && !isEditing && (
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
   ConfigurationSection Component
   ---------------------------------------- */

interface ConfigSectionProps {
  storageType: string;
  onStorageTypeChange: (value: string) => void;
  storageTypeError: string | null;
  onStorageTypeErrorChange: (error: string | null) => void;
  onNext: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function ConfigurationSection({
  storageType,
  onStorageTypeChange,
  storageTypeError,
  onStorageTypeErrorChange,
  onNext,
  isActive,
  isEditing,
  onEditCancel,
  onEditDone,
}: ConfigSectionProps) {
  const validate = () => {
    if (!storageType) {
      onStorageTypeErrorChange('Please select a storage type.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  const handleDone = () => {
    if (!validate()) return;
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Storage"
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <div className="py-6">
            <FormField required error={!!storageTypeError} spacing="loose">
              <FormField.Label>Storage type</FormField.Label>
              <FormField.Description>
                Choose how storage works for this domain. This cannot be changed after the domain is
                created.
              </FormField.Description>
              <FormField.Control>
                <RadioGroup
                  value={storageType}
                  onChange={(val) => {
                    onStorageTypeChange(val);
                    onStorageTypeErrorChange(null);
                  }}
                >
                  {STORAGE_TYPE_OPTIONS.map((opt) => (
                    <Radio key={opt.value} value={opt.value} label={opt.label} />
                  ))}
                </RadioGroup>
              </FormField.Control>
              <FormField.ErrorMessage>{storageTypeError}</FormField.ErrorMessage>
            </FormField>
          </div>

          {isActive && !isEditing && (
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
   DomainAdminSection Component
   ---------------------------------------- */

interface DomainAdminSectionProps {
  username: string;
  onUsernameChange: (value: string) => void;
  usernameError: string | null;
  onUsernameErrorChange: (error: string | null) => void;
  passwordMode: string;
  onPasswordModeChange: (value: string) => void;
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
  onNext: () => void;
  onCancel: () => void;
  isActive: boolean;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function DomainAdminSection({
  username,
  onUsernameChange,
  usernameError,
  onUsernameErrorChange,
  passwordMode,
  onPasswordModeChange,
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
  onNext,
  onCancel,
  isActive,
  isEditing,
  onEditCancel,
  onEditDone,
}: DomainAdminSectionProps) {
  const validate = () => {
    let hasError = false;
    if (!username.trim()) {
      onUsernameErrorChange('Please enter a username.');
      hasError = true;
    } else if (username.trim().length < 3 || username.trim().length > 64) {
      onUsernameErrorChange('Username must be between 3-64 characters.');
      hasError = true;
    }
    if (passwordMode === 'manual') {
      if (!password) {
        onPasswordErrorChange('Please enter a password.');
        hasError = true;
      } else if (password.length < 8) {
        onPasswordErrorChange('Password must be at least 8 characters.');
        hasError = true;
      }
      if (!confirmPassword) {
        onConfirmPasswordErrorChange('Please confirm the password.');
        hasError = true;
      } else if (password !== confirmPassword) {
        onConfirmPasswordErrorChange('Passwords do not match.');
        hasError = true;
      }
    }
    if (!email.trim()) {
      onEmailErrorChange('Please enter an email address.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      onEmailErrorChange('Please enter a valid email address.');
      hasError = true;
    }
    return !hasError;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  const handleDone = () => {
    if (!validate()) return;
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Domain administrator"
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
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Username */}
          <div className="py-6">
            <FormField required error={!!usernameError}>
              <FormField.Label>Username</FormField.Label>
              <FormField.Description>
                {
                  "This is the user's unique identifier for signing in. It cannot be changed once created."
                }
              </FormField.Description>
              <FormField.Control>
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
              </FormField.Control>
              <FormField.ErrorMessage>{usernameError}</FormField.ErrorMessage>
              <FormField.HelperText>
                You can use letters, numbers, and special characters (-_.), and the length must be
                between 3-64 characters.
              </FormField.HelperText>
            </FormField>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Password */}
          <div className="py-6">
            <VStack gap={4}>
              <FormField required spacing="loose">
                <FormField.Label>Password</FormField.Label>
                <FormField.Description>
                  Choose how to set the initial password for the user account.
                </FormField.Description>
                <FormField.Control>
                  <RadioGroup
                    value={passwordMode}
                    onChange={(val) => {
                      onPasswordModeChange(val);
                      onPasswordErrorChange(null);
                      onConfirmPasswordErrorChange(null);
                    }}
                  >
                    {PASSWORD_OPTIONS.map((opt) => (
                      <Radio key={opt.value} value={opt.value} label={opt.label} />
                    ))}
                  </RadioGroup>
                </FormField.Control>
              </FormField>

              {passwordMode === 'manual' && (
                <div className="flex items-center gap-6 w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-4 py-2">
                  <HStack gap={1.5} align="center" className="shrink-0">
                    <span className="text-label-lg text-[var(--color-text-default)] whitespace-nowrap">
                      Password
                    </span>
                    <Password
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        onPasswordChange(e.target.value);
                        onPasswordErrorChange(null);
                      }}
                      error={!!passwordError}
                      className="w-[252px]"
                    />
                  </HStack>
                  <HStack gap={1.5} align="center" className="shrink-0">
                    <span className="text-label-lg text-[var(--color-text-default)] whitespace-nowrap">
                      Confirm password
                    </span>
                    <Password
                      placeholder="Enter password again"
                      value={confirmPassword}
                      onChange={(e) => {
                        onConfirmPasswordChange(e.target.value);
                        onConfirmPasswordErrorChange(null);
                      }}
                      error={!!confirmPasswordError}
                      className="w-[252px]"
                    />
                  </HStack>
                </div>
              )}

              {passwordError && passwordMode === 'manual' && (
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  {passwordError}
                </span>
              )}
              {confirmPasswordError && passwordMode === 'manual' && (
                <span className="text-body-sm text-[var(--color-state-danger)]">
                  {confirmPasswordError}
                </span>
              )}
            </VStack>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Email address */}
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
                  error={!!emailError}
                  fullWidth
                />
              </FormField.Control>
              <FormField.ErrorMessage>{emailError}</FormField.ErrorMessage>
            </FormField>
          </div>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Display name */}
          <div className="py-6">
            <FormField>
              <FormField.Label>Display name</FormField.Label>
              <FormField.Control>
                <Input
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => onDisplayNameChange(e.target.value)}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                Must be between 2-64 characters. If left blank, the username will be shown instead.
              </FormField.HelperText>
            </FormField>
          </div>

          {isActive && !isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" gap={2} className="pt-3">
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Done
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
   Main CreateDomainPage Component
   ---------------------------------------- */

export default function CreateDomainPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create domain');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    configuration: isV2 ? 'active' : 'pre',
    'domain-admin': isV2 ? 'active' : 'pre',
  });
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Form state - Basic Information
  const [domainName, setDomainName] = useState('');
  const [domainNameError, setDomainNameError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Form state - Configuration
  const [storageType, setStorageType] = useState('');
  const [storageTypeError, setStorageTypeError] = useState<string | null>(null);

  // Form state - Domain Administrator
  const [adminUsername, setAdminUsername] = useState('');
  const [adminUsernameError, setAdminUsernameError] = useState<string | null>(null);
  const [passwordMode, setPasswordMode] = useState('temporary');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminConfirmPasswordError, setAdminConfirmPasswordError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminEmailError, setAdminEmailError] = useState<string | null>(null);
  const [adminDisplayName, setAdminDisplayName] = useState('');

  const allSectionsDone = Object.values(sectionStatus).every((s) => s === 'done');

  const handleEdit = useCallback(
    (section: SectionStep) => {
      if (isV2) return;
      setEditingSection(section);
      const sectionIndex = SECTION_ORDER.indexOf(section);

      setSectionStatus((prev) => {
        const newStatus = { ...prev };
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
    },
    [isV2]
  );

  const handleEditCancel = useCallback(() => {
    if (isV2 || !editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }
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
  }, [editingSection, isV2]);

  const handleEditDone = useCallback(() => {
    if (isV2 || !editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }
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
  }, [editingSection, isV2]);

  const handleNext = useCallback(
    (currentSection: SectionStep) => {
      if (isV2) return;
      const currentIndex = SECTION_ORDER.indexOf(currentSection);
      const nextSection = SECTION_ORDER[currentIndex + 1];

      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
        ...(nextSection && { [nextSection]: 'active' }),
      }));
    },
    [isV2]
  );

  const handleCancel = useCallback(() => {
    navigate('/iam/domains');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    console.log('Creating domain:', {
      domainName,
      description,
      storageType,
      adminUsername,
      passwordMode,
      adminEmail,
      adminDisplayName,
    });
    navigate('/iam/domains');
  }, [
    navigate,
    domainName,
    description,
    storageType,
    adminUsername,
    passwordMode,
    adminEmail,
    adminDisplayName,
  ]);

  const getStorageTypeDisplay = () => {
    const opt = STORAGE_TYPE_OPTIONS.find((o) => o.value === storageType);
    return opt?.label || '-';
  };

  const getPasswordModeDisplay = () => {
    if (passwordMode === 'manual') return adminPassword || '-';
    return 'Auto-generated password';
  };

  return (
    <PageShell
      sidebar={
        <IAMSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath="/iam/domains"
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Domains', href: '/iam/domains' }, { label: 'Create domain' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3} className="min-w-[1176px]">
        <div className="flex items-center justify-between h-8">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create domain</h1>
        </div>

        <HStack gap={6} align="start" className="w-full">
          <VStack gap={4} className="flex-1">
            {/* Basic Information */}
            {!isV2 && sectionStatus['basic-info'] === 'pre' && (
              <PreSection title={SECTION_LABELS['basic-info']} />
            )}
            {!isV2 && sectionStatus['basic-info'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['basic-info']} />
            )}
            {(isV2 || sectionStatus['basic-info'] === 'active') && (
              <BasicInformationSection
                domainName={domainName}
                onDomainNameChange={setDomainName}
                domainNameError={domainNameError}
                onDomainNameErrorChange={setDomainNameError}
                description={description}
                onDescriptionChange={setDescription}
                descriptionError={descriptionError}
                onDescriptionErrorChange={setDescriptionError}
                onNext={() => handleNext('basic-info')}
                isActive={!isV2}
                isEditing={editingSection === 'basic-info'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {!isV2 && sectionStatus['basic-info'] === 'done' && (
              <DoneSection
                title={SECTION_LABELS['basic-info']}
                onEdit={() => handleEdit('basic-info')}
              >
                <SectionCard.DataRow
                  label="Domain name"
                  value={domainName || '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="Description" value={description || '-'} />
              </DoneSection>
            )}

            {/* Configuration */}
            {!isV2 && sectionStatus.configuration === 'pre' && (
              <PreSection title={SECTION_LABELS.configuration} />
            )}
            {!isV2 && sectionStatus.configuration === 'writing' && (
              <WritingSection title={SECTION_LABELS.configuration} />
            )}
            {(isV2 || sectionStatus.configuration === 'active') && (
              <ConfigurationSection
                storageType={storageType}
                onStorageTypeChange={setStorageType}
                storageTypeError={storageTypeError}
                onStorageTypeErrorChange={setStorageTypeError}
                onNext={() => handleNext('configuration')}
                isActive={!isV2}
                isEditing={editingSection === 'configuration'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {!isV2 && sectionStatus.configuration === 'done' && (
              <DoneSection
                title={SECTION_LABELS.configuration}
                onEdit={() => handleEdit('configuration')}
              >
                <SectionCard.DataRow
                  label="Storage type"
                  value={getStorageTypeDisplay()}
                  showDivider={false}
                />
              </DoneSection>
            )}

            {/* Domain Administrator */}
            {!isV2 && sectionStatus['domain-admin'] === 'pre' && (
              <PreSection title={SECTION_LABELS['domain-admin']} />
            )}
            {!isV2 && sectionStatus['domain-admin'] === 'writing' && (
              <WritingSection title={SECTION_LABELS['domain-admin']} />
            )}
            {(isV2 || sectionStatus['domain-admin'] === 'active') && (
              <DomainAdminSection
                username={adminUsername}
                onUsernameChange={setAdminUsername}
                usernameError={adminUsernameError}
                onUsernameErrorChange={setAdminUsernameError}
                passwordMode={passwordMode}
                onPasswordModeChange={setPasswordMode}
                password={adminPassword}
                onPasswordChange={setAdminPassword}
                passwordError={adminPasswordError}
                onPasswordErrorChange={setAdminPasswordError}
                confirmPassword={adminConfirmPassword}
                onConfirmPasswordChange={setAdminConfirmPassword}
                confirmPasswordError={adminConfirmPasswordError}
                onConfirmPasswordErrorChange={setAdminConfirmPasswordError}
                email={adminEmail}
                onEmailChange={setAdminEmail}
                emailError={adminEmailError}
                onEmailErrorChange={setAdminEmailError}
                displayName={adminDisplayName}
                onDisplayNameChange={setAdminDisplayName}
                onNext={() => handleNext('domain-admin')}
                onCancel={handleCancel}
                isActive={!isV2}
                isEditing={editingSection === 'domain-admin'}
                onEditCancel={handleEditCancel}
                onEditDone={handleEditDone}
              />
            )}
            {!isV2 && sectionStatus['domain-admin'] === 'done' && (
              <DoneSection
                title={SECTION_LABELS['domain-admin']}
                onEdit={() => handleEdit('domain-admin')}
              >
                <SectionCard.DataRow
                  label="Username"
                  value={adminUsername || '-'}
                  showDivider={false}
                />
                <SectionCard.DataRow label="Password" value={getPasswordModeDisplay()} />
                <SectionCard.DataRow label="Email address" value={adminEmail || '-'} />
                <SectionCard.DataRow label="Display name" value={adminDisplayName || '-'} />
              </DoneSection>
            )}
          </VStack>

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
