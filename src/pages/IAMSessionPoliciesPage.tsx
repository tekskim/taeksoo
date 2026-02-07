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
  PageShell,
  PageHeader,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh } from '@tabler/icons-react';

/* ----------------------------------------
   Session policies Page
   ---------------------------------------- */

export default function IAMSessionPoliciesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Session policy state
  const [sessionIdleTimeout, setSessionIdleTimeout] = useState(30); // Minutes
  const [sessionMaxLifespan, setSessionMaxLifespan] = useState(8); // Hours
  const [loginTimeout, setLoginTimeout] = useState(30); // Minutes
  const [loginActionTimeout, setLoginActionTimeout] = useState(5); // Minutes

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Session policies');
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
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Session policies' }];

  // Handle reset to default
  const handleResetToDefault = () => {
    setSessionIdleTimeout(30);
    setSessionMaxLifespan(8);
    setLoginTimeout(30);
    setLoginActionTimeout(5);
  };

  // Handle reload
  const handleReload = () => {
    // In a real app, this would fetch from API
    handleResetToDefault();
  };

  // Handle save
  const handleSave = () => {
    // In a real app, this would save to API
    console.log('Saving session policies:', {
      sessionIdleTimeout,
      sessionMaxLifespan,
      loginTimeout,
      loginActionTimeout,
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
        {/* Page Header */}
        <PageHeader title="Session policies" />

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="general">General policy</Tab>
            </TabList>

            {/* General Policy Tab */}
            <TabPanel value="general" className="pt-4">
              <VStack gap={4}>
                <SectionCard>
                  <SectionCard.Header title="General policy" />
                  <SectionCard.Content gap={6}>
                    {/* Session Idle Timeout */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <HStack className="gap-[3px]">
                          <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                            Session idle timeout
                          </span>
                          <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                        </HStack>
                        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                          Defines how long a user session can remain idle before expiring.
                        </p>
                      </VStack>
                      <VStack gap={2}>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={sessionIdleTimeout}
                            onChange={setSessionIdleTimeout}
                            min={15}
                            max={60}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                            Minutes
                          </span>
                        </HStack>
                        <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                          15 - 60 Minutes
                        </p>
                      </VStack>
                    </VStack>

                    {/* Session Max Lifespan */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <HStack className="gap-[3px]">
                          <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                            Session max lifespan
                          </span>
                          <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                        </HStack>
                        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                          Defines the absolute maximum duration a session can remain active,
                          regardless of user activity.
                        </p>
                      </VStack>
                      <VStack gap={2}>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={sessionMaxLifespan}
                            onChange={setSessionMaxLifespan}
                            min={1}
                            max={24}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                            Hours
                          </span>
                        </HStack>
                        <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                          1-24 Hours
                        </p>
                      </VStack>
                    </VStack>

                    {/* Login Timeout */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <HStack className="gap-[3px]">
                          <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                            Login timeout
                          </span>
                          <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                        </HStack>
                        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                          Defines the maximum time allowed for a login request to complete.
                        </p>
                      </VStack>
                      <VStack gap={2}>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={loginTimeout}
                            onChange={setLoginTimeout}
                            min={1}
                            max={60}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                            Minutes
                          </span>
                        </HStack>
                        <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                          1 - 60 Minutes
                        </p>
                      </VStack>
                    </VStack>

                    {/* Login Action Timeout */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <HStack className="gap-[3px]">
                          <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                            Login action timeout
                          </span>
                          <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                        </HStack>
                        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                          Defines how long additional authentication steps during login remain
                          valid.
                        </p>
                      </VStack>
                      <VStack gap={2}>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={loginActionTimeout}
                            onChange={setLoginActionTimeout}
                            min={1}
                            max={10}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                            Minutes
                          </span>
                        </HStack>
                        <p className="text-body-sm leading-4 text-[var(--color-text-subtle)]">
                          1 - 10 Minutes
                        </p>
                      </VStack>
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
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
