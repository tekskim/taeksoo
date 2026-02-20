import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  PageShell,
  PageHeader,
  FormField,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'password-policy';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
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
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={() => addNewTab('/iam/home', 'Home')}
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <PageHeader title="Login policies" />

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
                    <FormField required>
                      <FormField.Label>Length</FormField.Label>
                      <FormField.Description>
                        Defines the minimum length required for passwords.
                      </FormField.Description>
                      <FormField.Control>
                        <HStack
                          gap={3}
                          align="center"
                          className="max-w-[var(--slider-row-max-width)]"
                        >
                          <NumberInput
                            value={minLength}
                            onChange={(val) => {
                              if (val < maxLength) setMinLength(val);
                            }}
                            min={6}
                            max={maxLength - 1}
                            step={1}
                            width="xs"
                          />
                          <RangeSlider
                            value={[minLength, maxLength]}
                            onChange={([min, max]) => {
                              setMinLength(min);
                              setMaxLength(max);
                            }}
                            min={6}
                            max={128}
                            step={1}
                            className="flex-1"
                          />
                          <NumberInput
                            value={maxLength}
                            onChange={(val) => {
                              if (val > minLength) setMaxLength(val);
                            }}
                            min={minLength + 1}
                            max={128}
                            step={1}
                            width="xs"
                          />
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>
                        6 - 128 / Maximum length must be greater than or equal to the minimum
                        length.
                      </FormField.HelperText>
                    </FormField>

                    {/* Requirements */}
                    <FormField required>
                      <FormField.Label>Requirements</FormField.Label>
                      <FormField.Description>
                        Specifies the character types that must be included in the password.
                      </FormField.Description>
                      <FormField.Control className="mt-[var(--primitive-spacing-3)]">
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
                      </FormField.Control>
                    </FormField>

                    {/* Exclusion rules */}
                    <FormField required>
                      <FormField.Label>Exclusion rules</FormField.Label>
                      <FormField.Description>
                        Defines words or patterns that cannot be used in passwords.
                      </FormField.Description>
                      <FormField.Control className="mt-[var(--primitive-spacing-3)]">
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
                      </FormField.Control>
                    </FormField>

                    {/* Password expiration */}
                    <FormField required>
                      <FormField.Label>Password expiration</FormField.Label>
                      <FormField.Description>
                        Sets the validity period for passwords. After the specified duration, users
                        are required to create a new password.
                      </FormField.Description>
                      <FormField.Control>
                        <VStack gap={2}>
                          <Toggle
                            checked={passwordExpirationEnabled}
                            onChange={setPasswordExpirationEnabled}
                            label={passwordExpirationEnabled ? 'On' : 'Off'}
                          />
                          <HStack gap={2} align="center">
                            <NumberInput
                              value={passwordExpirationDays}
                              onChange={setPasswordExpirationDays}
                              min={1}
                              max={1095}
                              step={1}
                              width="xs"
                              disabled={!passwordExpirationEnabled}
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Days
                            </span>
                          </HStack>
                        </VStack>
                      </FormField.Control>
                      <FormField.HelperText>1 - 1095 Days</FormField.HelperText>
                    </FormField>

                    {/* Prevent password reuse */}
                    <FormField required>
                      <FormField.Label>Prevent password reuse</FormField.Label>
                      <FormField.Description>
                        Prevents users from reusing previously used passwords.
                      </FormField.Description>
                      <FormField.Control>
                        <VStack gap={2}>
                          <Toggle
                            checked={preventReuseEnabled}
                            onChange={setPreventReuseEnabled}
                            label={preventReuseEnabled ? 'On' : 'Off'}
                          />
                          <div className="flex items-center gap-[var(--primitive-spacing-6)] w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
                            <HStack className="gap-[var(--primitive-spacing-1-5)]" align="center">
                              <span className="text-label-lg text-[var(--color-text-default)]">
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
                                width="xs"
                                disabled={!preventReuseEnabled}
                              />
                            </HStack>
                            <HStack className="gap-[var(--primitive-spacing-1-5)]" align="center">
                              <span className="text-label-lg text-[var(--color-text-default)]">
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
                                width="xs"
                                disabled={!preventReuseEnabled}
                              />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                Days
                              </span>
                            </HStack>
                          </div>
                        </VStack>
                      </FormField.Control>
                      <FormField.HelperText>1 - 24 / 1 - 365 Days</FormField.HelperText>
                    </FormField>

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
                      <Button variant="secondary" size="sm" onClick={handleResetPasswordPolicy}>
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
                    <FormField required>
                      <FormField.Label>Lockout Type</FormField.Label>
                      <FormField.Description>
                        Choose how the account is locked after login failures.
                      </FormField.Description>
                      <FormField.Control>
                        <Select
                          value={lockoutType}
                          onChange={setLockoutType}
                          options={lockoutTypeOptions}
                          className="w-[400px]"
                          disabled={!lockoutEnabled}
                        />
                      </FormField.Control>
                    </FormField>

                    {/* Max login failures */}
                    <FormField required>
                      <FormField.Label>Max Login Failures</FormField.Label>
                      <FormField.Description>
                        The maximum number of failed login attempts allowed before the account is
                        locked.
                      </FormField.Description>
                      <FormField.Control>
                        <NumberInput
                          value={maxLoginFailures}
                          onChange={setMaxLoginFailures}
                          min={1}
                          max={100}
                          step={1}
                          width="sm"
                          disabled={!lockoutEnabled}
                        />
                      </FormField.Control>
                      <FormField.HelperText>1 - 100</FormField.HelperText>
                    </FormField>

                    {/* Maximum Temporary Lockouts - only for permanent_after_temporary */}
                    {lockoutType === 'permanent_after_temporary' && (
                      <FormField required>
                        <FormField.Label>Maximum Temporary Lockouts</FormField.Label>
                        <FormField.Description>
                          The total number of temporary lockouts allowed before the account is
                          permanently locked.
                        </FormField.Description>
                        <FormField.Control>
                          <NumberInput
                            value={maxTemporaryLockouts}
                            onChange={setMaxTemporaryLockouts}
                            min={1}
                            max={100}
                            step={1}
                            width="sm"
                            disabled={!lockoutEnabled}
                          />
                        </FormField.Control>
                        <FormField.HelperText>1 - 100</FormField.HelperText>
                      </FormField>
                    )}

                    {/* Only show these sections when lockout type has temporary behavior */}
                    {(lockoutType === 'temporary' ||
                      lockoutType === 'permanent_after_temporary') && (
                      <>
                        {/* Strategy to increase wait time */}
                        <FormField required>
                          <FormField.Label>Strategy to increase wait time</FormField.Label>
                          <FormField.Description>
                            Defines how the wait time increases after repeated failed login
                            attempts.
                          </FormField.Description>
                          <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                            <VStack gap={3}>
                              <HStack className="gap-[var(--primitive-spacing-1-5)]" align="center">
                                <Radio
                                  checked={waitTimeStrategy === 'linear'}
                                  onChange={() => setWaitTimeStrategy('linear')}
                                  disabled={!lockoutEnabled}
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
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
                              <HStack className="gap-[var(--primitive-spacing-1-5)]" align="center">
                                <Radio
                                  checked={waitTimeStrategy === 'multiple'}
                                  onChange={() => setWaitTimeStrategy('multiple')}
                                  disabled={!lockoutEnabled}
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
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
                          </FormField.Control>
                        </FormField>

                        {/* Wait increment */}
                        <FormField required>
                          <FormField.Label>Wait increment</FormField.Label>
                          <FormField.Description>
                            Amount of time added to the wait time for each additional failed login
                            attempt.
                          </FormField.Description>
                          <FormField.Control>
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
                              <span className="text-body-md text-[var(--color-text-default)]">
                                Minutes
                              </span>
                            </HStack>
                          </FormField.Control>
                        </FormField>

                        {/* Max wait time */}
                        <FormField required>
                          <FormField.Label>Max wait time</FormField.Label>
                          <FormField.Description>
                            The maximum time a user must wait before retrying, regardless of failure
                            count.
                          </FormField.Description>
                          <FormField.Control>
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
                              <span className="text-body-md text-[var(--color-text-default)]">
                                Minutes
                              </span>
                            </HStack>
                          </FormField.Control>
                        </FormField>

                        {/* Failure reset time */}
                        <FormField required>
                          <FormField.Label>Failure reset time</FormField.Label>
                          <FormField.Description>
                            Set the time limit within which the user must enter the email code.
                          </FormField.Description>
                          <FormField.Control>
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
                              <span className="text-body-md text-[var(--color-text-default)]">
                                Hours
                              </span>
                            </HStack>
                          </FormField.Control>
                        </FormField>
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
                      <Button variant="secondary" size="sm" onClick={handleResetLockoutPolicy}>
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
    </PageShell>
  );
}
