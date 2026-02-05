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
  Radio,
  SectionCard,
  Tooltip,
  Toggle,
  NumberInput,
  Chip,
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
  const [activeTab, setActiveTab] = useState('enforcement');
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
                  MFA policies
                </h1>
              </HStack>

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
                        <SectionCard.Header title="MFA enforcement" />
                        <SectionCard.Content gap={6}>
                          {/* Description */}
                          <p className="text-body-md leading-[16px] text-[var(--color-text-subtle)]">
                            Choose whether to make Multi-Factor Authentication (MFA) mandatory for
                            all users, or let them enable it voluntarily.
                          </p>

                          {/* Radio Options */}
                          <VStack gap={3}>
                            <HStack align="center" className="gap-[6px]">
                              <Radio
                                checked={mfaEnforcement === 'voluntary'}
                                onChange={() => setMfaEnforcement('voluntary')}
                                label="Voluntary"
                              />
                              <Tooltip content="Users can choose whether to enable MFA for their accounts.">
                                <IconInfoCircle
                                  size={16}
                                  stroke={1.5}
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

                          {/* Action Buttons */}
                          <HStack gap={2} justify="end" className="w-full">
                            <button
                              type="button"
                              onClick={handleResetToDefault}
                              className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline"
                            >
                              <IconRefresh size={12} stroke={1.5} />
                              Reset to default
                            </button>
                            <Button variant="secondary" size="sm" onClick={handleReload}>
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

                  {/* MFA Methods Tab */}
                  <TabPanel value="methods" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Method Sub-tabs */}
                      <div className="flex gap-2 p-[4px] h-[45px] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg w-fit">
                        <button
                          type="button"
                          onClick={() => setActiveMethodTab('otp')}
                          className={`flex items-center justify-center min-w-[200px] px-[24px] text-label-lg leading-5 text-center rounded-md transition-colors cursor-pointer ${
                            activeMethodTab === 'otp'
                              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                              : 'bg-transparent text-[var(--color-text-default)]'
                          }`}
                        >
                          OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveMethodTab('email')}
                          className={`flex items-center justify-center min-w-[200px] px-[24px] text-label-lg leading-5 text-center rounded-md transition-colors cursor-pointer ${
                            activeMethodTab === 'email'
                              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                              : 'bg-transparent text-[var(--color-text-default)]'
                          }`}
                        >
                          Email
                        </button>
                      </div>

                      {/* OTP Policy Card */}
                      {activeMethodTab === 'otp' && (
                        <SectionCard>
                          <SectionCard.Header title="OTP policy" />
                          <SectionCard.Content gap={6}>
                            {/* OTP Enable Toggle */}
                            <Toggle
                              checked={otpEnabled}
                              onChange={(e) => setOtpEnabled(e.target.checked)}
                              label={otpEnabled ? 'On' : 'Off'}
                            />

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)] -my-1" />

                            {/* Look Around Window */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <HStack gap={0.5}>
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    Look around window
                                  </span>
                                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  Allows for slight time differences between the server and the
                                  user's device to prevent login failures. 1 is recommended.
                                </p>
                              </VStack>
                              <VStack gap={2}>
                                <NumberInput
                                  value={lookAroundWindow}
                                  onChange={setLookAroundWindow}
                                  min={0}
                                  max={2}
                                  step={1}
                                  width="sm"
                                  disabled={!otpEnabled}
                                />
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  0 - 2
                                </p>
                              </VStack>
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Reusable Token */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Reusable token
                                </span>
                                <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                  For security, always keep this disabled. Enabling it may expose
                                  the system to replay attacks.
                                </p>
                              </VStack>
                              <Toggle
                                checked={reusableToken}
                                onChange={(e) => setReusableToken(e.target.checked)}
                                label={reusableToken ? 'On' : 'Off'}
                                disabled={!otpEnabled}
                              />
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Supported Applications */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                  Supported applications
                                </span>
                                <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                                  Recommended authenticator apps that support this policy.
                                </p>
                              </VStack>
                              <HStack className="gap-[6px]">
                                <Chip
                                  value="Google Auth"
                                  leftIcon={<IconDeviceMobile size={12} stroke={1.5} />}
                                />
                                <Chip
                                  value="MS Auth"
                                  leftIcon={<IconDeviceMobile size={12} stroke={1.5} />}
                                />
                              </HStack>
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Action Buttons */}
                            <HStack gap={2} justify="end" className="w-full">
                              <button
                                type="button"
                                onClick={handleMethodsResetToDefault}
                                className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline"
                              >
                                <IconRefresh size={12} stroke={1.5} />
                                Reset to default
                              </button>
                              <Button variant="secondary" size="sm" onClick={handleMethodsReload}>
                                Reload
                              </Button>
                              <Button variant="primary" size="sm" onClick={handleMethodsSave}>
                                Save
                              </Button>
                            </HStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}

                      {/* Email Policy Card */}
                      {activeMethodTab === 'email' && (
                        <SectionCard>
                          <SectionCard.Header title="Email policy" />
                          <SectionCard.Content gap={6}>
                            {/* Email Enable Toggle */}
                            <Toggle
                              checked={emailEnabled}
                              onChange={(e) => setEmailEnabled(e.target.checked)}
                              label={emailEnabled ? 'On' : 'Off'}
                            />

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Code Validity Period */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <HStack gap={0.5}>
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    Code validity period
                                  </span>
                                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  Set the time limit within which the user must enter the email
                                  code.
                                </p>
                              </VStack>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={codeValidityPeriod}
                                    onChange={setCodeValidityPeriod}
                                    min={1}
                                    max={600}
                                    step={1}
                                    width="sm"
                                    disabled={!emailEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Seconds
                                  </span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  1-600 Seconds
                                </p>
                              </VStack>
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Resend Cooldown */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <HStack gap={0.5}>
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    Resend cooldown
                                  </span>
                                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  The minimum time a user must wait before requesting a new
                                  authentication code.
                                </p>
                              </VStack>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={resendCooldown}
                                    onChange={setResendCooldown}
                                    min={1}
                                    max={120}
                                    step={1}
                                    width="sm"
                                    disabled={!emailEnabled}
                                  />
                                  <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                    Seconds
                                  </span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  1-120 Seconds
                                </p>
                              </VStack>
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Verification Attempts */}
                            <VStack gap={4}>
                              <VStack gap={2}>
                                <HStack gap={0.5}>
                                  <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                    Verification attempts
                                  </span>
                                  <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                                </HStack>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  Protect user accounts from unusual activities by limiting the
                                  number of verification attempts allowed within a time frame.
                                </p>
                              </VStack>
                              <VStack gap={2}>
                                <div className="flex items-center gap-6 px-4 py-2 border border-[var(--color-border-default)] rounded-md w-full bg-[var(--color-surface-default)]">
                                  <HStack align="center" className="gap-[6px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Time window
                                    </span>
                                    <NumberInput
                                      value={verificationTimeWindow}
                                      onChange={setVerificationTimeWindow}
                                      min={1}
                                      max={60}
                                      step={1}
                                      className="w-[80px]"
                                      disabled={!emailEnabled}
                                    />
                                    <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                      Minutes
                                    </span>
                                  </HStack>
                                  <HStack align="center" className="gap-[6px]">
                                    <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                                      Max attempts
                                    </span>
                                    <NumberInput
                                      value={verificationMaxAttempts}
                                      onChange={setVerificationMaxAttempts}
                                      min={1}
                                      max={10}
                                      step={1}
                                      className="w-[80px]"
                                      disabled={!emailEnabled}
                                    />
                                    <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                                      Times
                                    </span>
                                  </HStack>
                                </div>
                                <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                                  1-60 Minutes / 1-10 Times
                                </p>
                              </VStack>
                            </VStack>

                            {/* Divider */}
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                            {/* Action Buttons */}
                            <HStack gap={2} justify="end" className="w-full">
                              <button
                                type="button"
                                onClick={handleMethodsResetToDefault}
                                className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:underline"
                              >
                                <IconRefresh size={12} stroke={1.5} />
                                Reset to default
                              </button>
                              <Button variant="secondary" size="sm" onClick={handleMethodsReload}>
                                Reload
                              </Button>
                              <Button variant="primary" size="sm" onClick={handleMethodsSave}>
                                Save
                              </Button>
                            </HStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
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
