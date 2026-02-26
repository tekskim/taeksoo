import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Badge,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Radio,
  SectionCard,
  Tooltip,
  Toggle,
  NumberInput,
  PageShell,
  PageHeader,
  FormField,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconInfoCircle, IconDeviceMobile } from '@tabler/icons-react';

/* ----------------------------------------
   MFA policies Page
   ---------------------------------------- */

export default function IAMMFAPoliciesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'enforcement';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [mfaEnforcement, setMfaEnforcement] = useState<'voluntary' | 'required'>('voluntary');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // MFA Methods state
  const [activeMethodTab, setActiveMethodTab] = useState<'otp' | 'email'>('otp');
  const [otpEnabled, setOtpEnabled] = useState(true);
  const [lookAroundWindow, setLookAroundWindow] = useState(1);
  const [reusableToken, setReusableToken] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [codeValidityPeriod, setCodeValidityPeriod] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [verificationTimeWindow, setVerificationTimeWindow] = useState(10);
  const [verificationMaxAttempts, setVerificationMaxAttempts] = useState(5);

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('MFA policies');
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
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'MFA policies' }];

  // Handle reset to default
  const handleResetToDefault = () => {
    setMfaEnforcement('voluntary');
  };

  // Handle reload
  const handleReload = () => {
    // In a real app, this would fetch from API
    setMfaEnforcement('voluntary');
  };

  // Handle save
  const handleSave = () => {
    // In a real app, this would save to API
    console.log('Saving MFA enforcement:', mfaEnforcement);
  };

  // Handle methods reset to default
  const handleMethodsResetToDefault = () => {
    if (activeMethodTab === 'otp') {
      setOtpEnabled(true);
      setLookAroundWindow(1);
      setReusableToken(false);
    } else {
      setEmailEnabled(true);
      setCodeValidityPeriod(300);
      setResendCooldown(60);
      setVerificationTimeWindow(10);
      setVerificationMaxAttempts(5);
    }
  };

  // Handle methods reload
  const handleMethodsReload = () => {
    // In a real app, this would fetch from API
    handleMethodsResetToDefault();
  };

  // Handle methods save
  const handleMethodsSave = () => {
    // In a real app, this would save to API
    if (activeMethodTab === 'otp') {
      console.log('Saving OTP policy:', { otpEnabled, lookAroundWindow, reusableToken });
    } else {
      console.log('Saving Email policy:', {
        emailEnabled,
        codeValidityPeriod,
        resendCooldown,
        verificationTimeWindow,
        verificationMaxAttempts,
      });
    }
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
        <PageHeader title="MFA policies" />

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="enforcement">MFA enforcement</Tab>
              <Tab value="methods">MFA methods</Tab>
            </TabList>

            {/* MFA Enforcement Tab */}
            <TabPanel value="enforcement" className="pt-0">
              <VStack gap={4} className="pt-4">
                <SectionCard>
                  <SectionCard.Header title="MFA enforcement" showDivider={false} />
                  <SectionCard.Content showDividers={false}>
                    <VStack gap={0}>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      <VStack gap={3} className="py-6">
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          Choose whether to make Multi-Factor Authentication (MFA) mandatory for all
                          users, or let them enable it voluntarily.
                        </p>
                        <VStack className="gap-[var(--radio-group-item-gap)]">
                          <HStack align="center" className="gap-[var(--primitive-spacing-1-5)]">
                            <Radio
                              checked={mfaEnforcement === 'voluntary'}
                              onChange={() => setMfaEnforcement('voluntary')}
                              label="Voluntary"
                            />
                            <Tooltip content="Users can choose whether to enable MFA for their accounts.">
                              <IconInfoCircle
                                size={14}
                                className="text-[var(--color-text-subtle)]"
                              />
                            </Tooltip>
                          </HStack>
                          <Radio
                            checked={mfaEnforcement === 'required'}
                            onChange={() => setMfaEnforcement('required')}
                            label="Required for all users"
                          />
                        </VStack>
                      </VStack>

                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      <HStack gap={2} justify="end" className="w-full pt-3">
                        <button
                          type="button"
                          onClick={handleResetToDefault}
                          className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline mr-4"
                        >
                          <IconRefresh size={12} stroke={1.5} />
                          Reset to default
                        </button>
                        <Button variant="secondary" size="md" onClick={handleReload}>
                          Reload
                        </Button>
                        <Button variant="primary" size="md" onClick={handleSave}>
                          Save
                        </Button>
                      </HStack>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* MFA Methods Tab */}
            <TabPanel value="methods" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Method Sub-tabs */}
                <Tabs
                  value={activeMethodTab}
                  onChange={(v) => setActiveMethodTab(v as 'otp' | 'email')}
                  variant="boxed"
                  size="sm"
                >
                  <TabList>
                    <Tab value="otp">OTP</Tab>
                    <Tab value="email">Email</Tab>
                  </TabList>
                </Tabs>

                {/* OTP Policy Card */}
                {activeMethodTab === 'otp' && (
                  <SectionCard>
                    <SectionCard.Header title="OTP policy" showDivider={false} />
                    <SectionCard.Content showDividers={false}>
                      <VStack gap={0}>
                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* OTP Enable Toggle */}
                        <div className="py-6">
                          <Toggle
                            checked={otpEnabled}
                            onChange={(e) => setOtpEnabled(e.target.checked)}
                            label={otpEnabled ? 'On' : 'Off'}
                          />
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Look Around Window */}
                        <div className="py-6">
                          <FormField required>
                            <FormField.Label>Look around window</FormField.Label>
                            <FormField.Description>
                              Allows for slight time differences between the server and the user's
                              device to prevent login failures. 1 is recommended.
                            </FormField.Description>
                            <FormField.Control>
                              <NumberInput
                                value={lookAroundWindow}
                                onChange={setLookAroundWindow}
                                min={0}
                                max={2}
                                step={1}
                                width="xs"
                                disabled={!otpEnabled}
                              />
                            </FormField.Control>
                            <FormField.HelperText>0 - 2</FormField.HelperText>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Reusable Token */}
                        <div className="py-6">
                          <FormField>
                            <FormField.Label>Reusable token</FormField.Label>
                            <FormField.Description>
                              For security, always keep this disabled. Enabling it may expose the
                              system to replay attacks.
                            </FormField.Description>
                            <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                              <Toggle
                                checked={reusableToken}
                                onChange={(e) => setReusableToken(e.target.checked)}
                                label={reusableToken ? 'On' : 'Off'}
                                disabled={!otpEnabled}
                              />
                            </FormField.Control>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Supported Applications */}
                        <div className="py-6">
                          <FormField>
                            <FormField.Label>Supported applications</FormField.Label>
                            <FormField.Description>
                              Recommended authenticator apps that support this policy.
                            </FormField.Description>
                            <FormField.Control>
                              <HStack className="gap-[var(--primitive-spacing-1-5)]">
                                <Badge
                                  theme="white"
                                  size="sm"
                                  leftIcon={<IconDeviceMobile size={12} stroke={1.5} />}
                                >
                                  Google auth
                                </Badge>
                                <Badge
                                  theme="white"
                                  size="sm"
                                  leftIcon={<IconDeviceMobile size={12} stroke={1.5} />}
                                >
                                  MS Auth
                                </Badge>
                              </HStack>
                            </FormField.Control>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Action Buttons */}
                        <HStack gap={2} justify="end" className="w-full pt-3">
                          <button
                            type="button"
                            onClick={handleMethodsResetToDefault}
                            className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline mr-4"
                          >
                            <IconRefresh size={12} stroke={1.5} />
                            Reset to default
                          </button>
                          <Button variant="secondary" size="md" onClick={handleMethodsReload}>
                            Reload
                          </Button>
                          <Button variant="primary" size="md" onClick={handleMethodsSave}>
                            Save
                          </Button>
                        </HStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                )}

                {/* Email Policy Card */}
                {activeMethodTab === 'email' && (
                  <SectionCard>
                    <SectionCard.Header title="Email policy" showDivider={false} />
                    <SectionCard.Content showDividers={false}>
                      <VStack gap={0}>
                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Email Enable Toggle */}
                        <div className="py-6">
                          <Toggle
                            checked={emailEnabled}
                            onChange={(e) => setEmailEnabled(e.target.checked)}
                            label={emailEnabled ? 'On' : 'Off'}
                          />
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Code Validity Period */}
                        <div className="py-6">
                          <FormField required>
                            <FormField.Label>Code validity period</FormField.Label>
                            <FormField.Description>
                              Set the time limit within which the user must enter the email code.
                            </FormField.Description>
                            <FormField.Control>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={codeValidityPeriod}
                                  onChange={setCodeValidityPeriod}
                                  min={1}
                                  max={600}
                                  step={1}
                                  width="xs"
                                  disabled={!emailEnabled}
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  Seconds
                                </span>
                              </HStack>
                            </FormField.Control>
                            <FormField.HelperText>1-600 Seconds</FormField.HelperText>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Resend Cooldown */}
                        <div className="py-6">
                          <FormField required>
                            <FormField.Label>Resend cooldown</FormField.Label>
                            <FormField.Description>
                              The minimum time a user must wait before requesting a new
                              authentication code.
                            </FormField.Description>
                            <FormField.Control>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={resendCooldown}
                                  onChange={setResendCooldown}
                                  min={1}
                                  max={120}
                                  step={1}
                                  width="xs"
                                  disabled={!emailEnabled}
                                />
                                <span className="text-body-md text-[var(--color-text-default)]">
                                  Seconds
                                </span>
                              </HStack>
                            </FormField.Control>
                            <FormField.HelperText>1-120 Seconds</FormField.HelperText>
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Verification Attempts */}
                        <div className="py-6">
                          <VStack gap={6}>
                            <VStack gap={1}>
                              <span className="text-heading-h6 text-[var(--color-text-default)]">
                                Verification attempts{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </span>
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                Protect user accounts from unusual activities by limiting the number
                                of verification attempts allowed within a time frame.
                              </p>
                            </VStack>

                            <VStack gap={6}>
                              <FormField required>
                                <FormField.Label>Time window</FormField.Label>
                                <FormField.Control>
                                  <HStack gap={2} align="center">
                                    <NumberInput
                                      value={verificationTimeWindow}
                                      onChange={setVerificationTimeWindow}
                                      min={1}
                                      max={60}
                                      step={1}
                                      width="xs"
                                      disabled={!emailEnabled}
                                    />
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      Minutes
                                    </span>
                                  </HStack>
                                </FormField.Control>
                                <FormField.HelperText>1-60 Minutes</FormField.HelperText>
                              </FormField>

                              <FormField required>
                                <FormField.Label>Max attempts</FormField.Label>
                                <FormField.Control>
                                  <HStack gap={2} align="center">
                                    <NumberInput
                                      value={verificationMaxAttempts}
                                      onChange={setVerificationMaxAttempts}
                                      min={1}
                                      max={10}
                                      step={1}
                                      width="xs"
                                      disabled={!emailEnabled}
                                    />
                                    <span className="text-body-md text-[var(--color-text-default)]">
                                      Times
                                    </span>
                                  </HStack>
                                </FormField.Control>
                                <FormField.HelperText>1-10 Times</FormField.HelperText>
                              </FormField>
                            </VStack>
                          </VStack>
                        </div>

                        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                        {/* Action Buttons */}
                        <HStack gap={2} justify="end" className="w-full pt-3">
                          <button
                            type="button"
                            onClick={handleMethodsResetToDefault}
                            className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline mr-4"
                          >
                            <IconRefresh size={12} stroke={1.5} />
                            Reset to default
                          </button>
                          <Button variant="secondary" size="md" onClick={handleMethodsReload}>
                            Reload
                          </Button>
                          <Button variant="primary" size="md" onClick={handleMethodsSave}>
                            Save
                          </Button>
                        </HStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                )}
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
