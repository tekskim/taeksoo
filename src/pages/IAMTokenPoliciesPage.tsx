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
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh } from '@tabler/icons-react';

/* ----------------------------------------
   Token Policies Page
   ---------------------------------------- */

export default function IAMTokenPoliciesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  // Token policy state
  const [accessTokenLifespan, setAccessTokenLifespan] = useState(10); // Minutes
  const [refreshTokenLifespan, setRefreshTokenLifespan] = useState(7); // Days

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Token Policies');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Tab bar tabs
  const tabBarTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable ?? true,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Token policies' },
  ];

  // Handle reset to default
  const handleResetToDefault = () => {
    setAccessTokenLifespan(10);
    setRefreshTokenLifespan(7);
  };

  // Handle reload
  const handleReload = () => {
    // In a real app, this would fetch from API
    handleResetToDefault();
  };

  // Handle save
  const handleSave = () => {
    // In a real app, this would save to API
    console.log('Saving token policies:', {
      accessTokenLifespan,
      refreshTokenLifespan,
    });
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-[28px]">
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Token Policies
                </h1>
              </HStack>

              {/* Tabs */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="general">General Policy</Tab>
                  </TabList>

                  {/* General Policy Tab */}
                  <TabPanel value="general">
                    <VStack gap={6} className="pt-6">
                      <SectionCard>
                        <SectionCard.Header title="General Policy" />
                        <SectionCard.Content gap={6}>
                          {/* Access Token Lifespan */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                                  Access token lifespan
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                                Defines how long an access token remains valid before it needs to be renewed.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={accessTokenLifespan}
                                  onChange={setAccessTokenLifespan}
                                  min={5}
                                  max={15}
                                  step={1}
                                  className="w-[200px]"
                                />
                                <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
                                  Minutes
                                </span>
                              </HStack>
                              <p className="text-[11px] leading-4 text-[var(--color-text-subtle)]">
                                5 - 15 Minutes
                              </p>
                            </VStack>
                          </VStack>

                          {/* Divider */}
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                          {/* Refresh Token Lifespan */}
                          <VStack gap={4}>
                            <VStack gap={2}>
                              <HStack className="gap-[3px]">
                                <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                                  Refresh token lifespan
                                </span>
                                <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                              </HStack>
                              <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                                Defines how long a user can stay signed in using a refresh token.
                              </p>
                            </VStack>
                            <VStack gap={2}>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  value={refreshTokenLifespan}
                                  onChange={setRefreshTokenLifespan}
                                  min={1}
                                  max={30}
                                  step={1}
                                  className="w-[200px]"
                                />
                                <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
                                  Days
                                </span>
                              </HStack>
                              <p className="text-[11px] leading-4 text-[var(--color-text-subtle)]">
                                1-30 Days
                              </p>
                            </VStack>
                          </VStack>

                          {/* Divider */}
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                          {/* Action Buttons */}
                          <HStack gap={2} justify="end" className="w-full">
                            <button
                              type="button"
                              onClick={handleResetToDefault}
                              className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-action-primary)] hover:underline"
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
          </div>
        </div>
      </main>
    </div>
  );
}

