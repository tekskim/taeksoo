import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  NumberInput,
  Checkbox,
  Toggle,
  RangeSlider,
  Tooltip,
  Select,
  Radio,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconInfoCircle } from '@tabler/icons-react';

// Lockout type options
const lockoutTypeOptions = [
  { value: 'temporary', label: 'Lockout temporarily' },
  { value: 'permanent', label: 'Lockout permanently' },
  { value: 'permanent_after_temporary', label: 'Lockout permanently after Temporary lockout' },
];

/* ----------------------------------------
   Login policies Page
   ---------------------------------------- */

export default function IAMLoginPoliciesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('password-policy');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Password policy state
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(64);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [excludeUsername, setExcludeUsername] = useState(true);
  const [excludeEmail, setExcludeEmail] = useState(true);
  const [passwordExpirationEnabled, setPasswordExpirationEnabled] = useState(true);
  const [passwordExpirationDays, setPasswordExpirationDays] = useState(30);
  const [preventReuseEnabled, setPreventReuseEnabled] = useState(true);
  const [reuseHistoryCount, setReuseHistoryCount] = useState(3);
  const [reusePeriodDays, setReusePeriodDays] = useState(30);

  // Account lockout policy state
  const [lockoutEnabled, setLockoutEnabled] = useState(true);
  const [lockoutType, setLockoutType] = useState('permanent_after_temporary');
  const [maxLoginFailures, setMaxLoginFailures] = useState(5);
  const [maxTemporaryLockouts, setMaxTemporaryLockouts] = useState(3);
  const [waitTimeStrategy, setWaitTimeStrategy] = useState<'linear' | 'multiple'>('linear');
  const [waitIncrement, setWaitIncrement] = useState(10);
  const [maxWaitTime, setMaxWaitTime] = useState(60);
  const [failureResetTime, setFailureResetTime] = useState(12);

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Login policies');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Tab Bar tabs
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable ?? true,
  }));

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Login policies' }];

  // Handle reset to default for password policy
  const handleResetPasswordPolicy = () => {
    setMinLength(8);
    setMaxLength(64);
    setRequireUppercase(true);
    setRequireLowercase(true);
    setRequireNumber(true);
    setRequireSpecial(true);
    setExcludeUsername(true);
    setExcludeEmail(true);
    setPasswordExpirationEnabled(true);
    setPasswordExpirationDays(30);
    setPreventReuseEnabled(true);
    setReuseHistoryCount(3);
    setReusePeriodDays(30);
  };

  // Handle reset to default for account lockout policy
  const handleResetLockoutPolicy = () => {
    setLockoutEnabled(true);
    setLockoutType('permanent_after_temporary');
    setMaxLoginFailures(5);
    setMaxTemporaryLockouts(3);
    setWaitTimeStrategy('linear');
    setWaitIncrement(10);
    setMaxWaitTime(60);
    setFailureResetTime(12);
  };

  // Handle save
  const handleSave = () => {
    console.log('Saving login policies:', {
      passwordPolicy: {
        minLength,
        maxLength,
        requireUppercase,
        requireLowercase,
        requireNumber,
        requireSpecial,
        excludeUsername,
        excludeEmail,
        passwordExpirationEnabled,
        passwordExpirationDays,
        preventReuseEnabled,
        reuseHistoryCount,
        reusePeriodDays,
      },
      accountLockoutPolicy: {
        lockoutEnabled,
        lockoutType,
        maxLoginFailures,
        maxTemporaryLockouts,
        waitTimeStrategy,
        waitIncrement,
        maxWaitTime,
        failureResetTime,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={() => addNewTab('/iam/home', 'Home')}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-[28px]">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Login policies
                </h1>
              </HStack>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="password-policy">Password policy</Tab>
                    <Tab value="lockout-policy">Account lockout policy</Tab>
                  </TabList>

                  {/* Password Policy Tab */}
                  <TabPanel value="password-policy" className="pt-4">
                    <VStack gap={4}>
                      <SectionCard>
                        <SectionCard.Header title="Password policy" />
                        <SectionCard.Content gap={6}>
                          {/* Length */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Length
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                Defines the minimum length required for passwords.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <div className="flex items-center gap-2 w-1/2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2">
                                <NumberInput
                                  value={minLength}
                                  onChange={(val) => {
                                    // Min value must be less than max value
                                    if (val < maxLength) {
                                      setMinLength(val);
                                    }
                                  }}
                                  min={6}
                                  max={maxLength - 1}
                                  step={1}
                                  className="w-[80px]"
                                />
                                <div className="flex-1">
                                  <RangeSlider
                                    value={[minLength, maxLength]}
                                    onChange={([min, max]) => {
                                      setMinLength(min);
                                      setMaxLength(max);
                                    }}
                                    min={6}
                                    max={128}
                                    step={1}
                                  />
                                </div>
                                <NumberInput
                                  value={maxLength}
                                  onChange={(val) => {
                                    // Max value must be greater than min value
                                    if (val > minLength) {
                                      setMaxLength(val);
                                    }
                                  }}
                                  min={minLength + 1}
                                  max={128}
                                  step={1}
                                  className="w-[80px]"
                                />
                              </div>
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                6 - 128 / Maximum length must be greater than or equal to the
                                minimum length.
                              </p>
                            </VStack>
                          </VStack>

                          {/* Requirements */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Requirements
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                Specifies the character types that must be included in the password.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <Checkbox
                                checked={requireUppercase}
                                onChange={(e) => setRequireUppercase(e.target.checked)}
                                label="Require at least one uppercase letter from the Latin alphabet (A-Z)"
                              />
                              <Checkbox
                                checked={requireLowercase}
                                onChange={(e) => setRequireLowercase(e.target.checked)}
                                label="Require at least one lowercase letter from the Latin alphabet (a-z)"
                              />
                              <Checkbox
                                checked={requireNumber}
                                onChange={(e) => setRequireNumber(e.target.checked)}
                                label="Require at least one number"
                              />
                              <Checkbox
                                checked={requireSpecial}
                                onChange={(e) => setRequireSpecial(e.target.checked)}
                                label={`Require at least one special character ( ! @ # $ % ^ & * ( ) _ + - = [ ] { } | ' )`}
                              />
                            </VStack>
                          </VStack>

                          {/* Exclusion rules */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Exclusion rules
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                Defines words or patterns that cannot be used in passwords.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <Checkbox
                                checked={excludeUsername}
                                onChange={(e) => setExcludeUsername(e.target.checked)}
                                label="Exclude passwords containing the username"
                              />
                              <Checkbox
                                checked={excludeEmail}
                                onChange={(e) => setExcludeEmail(e.target.checked)}
                                label="Exclude passwords containing the email address"
                              />
                            </VStack>
                          </VStack>

                          {/* Password expiration */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Password expiration
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                Sets the validity period for passwords. After the specified
                                duration, users are required to create a new password.
                              </p>
                            </VStack>
                            <Toggle
                              checked={passwordExpirationEnabled}
                              onChange={setPasswordExpirationEnabled}
                              label={passwordExpirationEnabled ? 'On' : 'Off'}
                            />
                            <VStack gap={2}>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={passwordExpirationDays}
                                  onChange={setPasswordExpirationDays}
                                  min={1}
                                  max={1095}
                                  step={1}
                                  width="sm"
                                  disabled={!passwordExpirationEnabled}
                                />
                                <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                  Days
                                </span>
                              </HStack>
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                1 - 1095 Days
                              </p>
                            </VStack>
                          </VStack>

                          {/* Prevent password reuse */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Prevent password reuse
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                Prevents users from reusing previously used passwords.
                              </p>
                            </VStack>
                            <Toggle
                              checked={preventReuseEnabled}
                              onChange={setPreventReuseEnabled}
                              label={preventReuseEnabled ? 'On' : 'Off'}
                            />
                            <VStack gap={2}>
                              <div className="flex items-center gap-6 w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2">
                                <HStack className="gap-[6px]" align="center">
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    By resent history
                                  </span>
                                  <Tooltip content="Prevents reusing the last 'N' passwords.">
                                    <IconInfoCircle
                                      size={16}
                                      stroke={1.5}
                                      className="text-[var(--color-text-subtle)]"
                                    />
                                  </Tooltip>
                                  <NumberInput
                                    value={reuseHistoryCount}
                                    onChange={setReuseHistoryCount}
                                    min={1}
                                    max={24}
                                    step={1}
                                    className="w-[80px]"
                                    disabled={!preventReuseEnabled}
                                  />
                                </HStack>
                                <HStack className="gap-[6px]" align="center">
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    By recent period
                                  </span>
                                  <Tooltip content="Prevents reusing any password used within the last 'N' days.">
                                    <IconInfoCircle
                                      size={16}
                                      stroke={1.5}
                                      className="text-[var(--color-text-subtle)]"
                                    />
                                  </Tooltip>
                                  <NumberInput
                                    value={reusePeriodDays}
                                    onChange={setReusePeriodDays}
                                    min={1}
                                    max={365}
                                    step={1}
                                    className="w-[80px]"
                                    disabled={!preventReuseEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Days
                                  </span>
                                </HStack>
                              </div>
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                1 - 24 / 1 - 365 Days
                              </p>
                            </VStack>
                          </VStack>

                          {/* Action Buttons */}
                          <HStack gap={2} justify="end" className="w-full">
                            <button
                              type="button"
                              onClick={handleResetPasswordPolicy}
                              className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline"
                            >
                              <IconRefresh size={12} stroke={1.5} />
                              Reset to default
                            </button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleResetPasswordPolicy}
                            >
                              Reload
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleSave}>
                              Save
                            </Button>
                          </HStack>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Account Lockout Policy Tab */}
                  <TabPanel value="lockout-policy" className="pt-4">
                    <VStack gap={4}>
                      <SectionCard>
                        <SectionCard.Header title="Account lockout policy" />
                        <SectionCard.Content gap={6}>
                          {/* Enable Toggle */}
                          <Toggle
                            checked={lockoutEnabled}
                            onChange={(e) => setLockoutEnabled(e.target.checked)}
                            label={lockoutEnabled ? 'On' : 'Off'}
                          />

                          {/* Lockout Type */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Lockout Type
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                Choose how the account is locked after login failures.
                              </p>
                            </VStack>
                            <Select
                              value={lockoutType}
                              onChange={setLockoutType}
                              options={lockoutTypeOptions}
                              className="w-[400px]"
                              disabled={!lockoutEnabled}
                            />
                          </VStack>

                          {/* Max login failures */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Max Login Failures
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                The maximum number of failed login attempts allowed before the
                                account is locked.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <NumberInput
                                value={maxLoginFailures}
                                onChange={setMaxLoginFailures}
                                min={1}
                                max={100}
                                step={1}
                                width="sm"
                                disabled={!lockoutEnabled}
                              />
                              <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                1 - 100
                              </p>
                            </VStack>
                          </VStack>

                          {/* Maximum Temporary Lockouts - only for permanent_after_temporary */}
                          {lockoutType === 'permanent_after_temporary' && (
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <HStack className="gap-[3px]">
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    Maximum Temporary Lockouts
                                  </span>
                                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  The total number of temporary lockouts allowed before the account
                                  is permanently locked.
                                </p>
                              </VStack>
                              <VStack gap={2}>
                                <NumberInput
                                  value={maxTemporaryLockouts}
                                  onChange={setMaxTemporaryLockouts}
                                  min={1}
                                  max={100}
                                  step={1}
                                  width="sm"
                                  disabled={!lockoutEnabled}
                                />
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  1 - 100
                                </p>
                              </VStack>
                            </VStack>
                          )}

                          {/* Only show these sections when lockout type has temporary behavior */}
                          {(lockoutType === 'temporary' ||
                            lockoutType === 'permanent_after_temporary') && (
                            <>
                              {/* Strategy to increase wait time */}
                              <VStack gap={4}>
                                <VStack gap={2}>
                                  <HStack className="gap-[3px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Strategy to increase wait time
                                    </span>
                                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                  </HStack>
                                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                    Defines how the wait time increases after repeated failed login
                                    attempts.
                                  </p>
                                </VStack>
                                <VStack gap={3}>
                                  <HStack className="gap-[6px]" align="center">
                                    <Radio
                                      checked={waitTimeStrategy === 'linear'}
                                      onChange={() => setWaitTimeStrategy('linear')}
                                      disabled={!lockoutEnabled}
                                    />
                                    <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                      Linear
                                    </span>
                                    <Tooltip content="Wait time increases only when failures are multiples of factor">
                                      <IconInfoCircle
                                        size={16}
                                        stroke={1.5}
                                        className="text-[var(--color-text-subtle)]"
                                      />
                                    </Tooltip>
                                  </HStack>
                                  <HStack className="gap-[6px]" align="center">
                                    <Radio
                                      checked={waitTimeStrategy === 'multiple'}
                                      onChange={() => setWaitTimeStrategy('multiple')}
                                      disabled={!lockoutEnabled}
                                    />
                                    <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                      Multiple
                                    </span>
                                    <Tooltip content="Wait time increases after every failure starting from factor">
                                      <IconInfoCircle
                                        size={16}
                                        stroke={1.5}
                                        className="text-[var(--color-text-subtle)]"
                                      />
                                    </Tooltip>
                                  </HStack>
                                </VStack>
                              </VStack>

                              {/* Wait increment */}
                              <VStack gap={4}>
                                <VStack gap={2}>
                                  <HStack className="gap-[3px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Wait increment
                                    </span>
                                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                  </HStack>
                                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                    Amount of time added to the wait time for each additional failed
                                    login attempt.
                                  </p>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={waitIncrement}
                                    onChange={setWaitIncrement}
                                    min={1}
                                    max={60}
                                    step={1}
                                    width="sm"
                                    disabled={!lockoutEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Minutes
                                  </span>
                                </HStack>
                              </VStack>

                              {/* Max wait time */}
                              <VStack gap={4}>
                                <VStack gap={2}>
                                  <HStack className="gap-[3px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Max wait time
                                    </span>
                                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                  </HStack>
                                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                    The maximum time a user must wait before retrying, regardless of
                                    failure count.
                                  </p>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={maxWaitTime}
                                    onChange={setMaxWaitTime}
                                    min={1}
                                    max={1440}
                                    step={1}
                                    width="sm"
                                    disabled={!lockoutEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Minutes
                                  </span>
                                </HStack>
                              </VStack>

                              {/* Failure reset time */}
                              <VStack gap={4}>
                                <VStack gap={2}>
                                  <HStack className="gap-[3px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Failure reset time
                                    </span>
                                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                  </HStack>
                                  <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                    Set the time limit within which the user must enter the email
                                    code.
                                  </p>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={failureResetTime}
                                    onChange={setFailureResetTime}
                                    min={1}
                                    max={72}
                                    step={1}
                                    width="sm"
                                    disabled={!lockoutEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Hours
                                  </span>
                                </HStack>
                              </VStack>
                            </>
                          )}

                          {/* Action Buttons */}
                          <HStack gap={2} justify="end" className="w-full">
                            <button
                              type="button"
                              onClick={handleResetLockoutPolicy}
                              className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline"
                            >
                              <IconRefresh size={12} stroke={1.5} />
                              Reset to default
                            </button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleResetLockoutPolicy}
                            >
                              Reload
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleSave}>
                              Save
                            </Button>
                          </HStack>
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
