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
  PageShell,
  PageHeader,
  FormField,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh } from '@tabler/icons-react';

/* ----------------------------------------
   Token policies Page
   ---------------------------------------- */

export default function IAMTokenPoliciesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'general';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Token policy state
  const [accessTokenLifespan, setAccessTokenLifespan] = useState(10); // Minutes
  const [refreshTokenLifespan, setRefreshTokenLifespan] = useState(7); // Days

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Token policies');
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
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Token policies' }];

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
        <PageHeader title="Token policies" />

        {/* Tabs */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="general">General policy</Tab>
            </TabList>

            {/* General Policy Tab */}
            <TabPanel value="general" className="pt-0">
              <VStack gap={4} className="pt-4">
                <SectionCard>
                  <SectionCard.Header title="General policy" />
                  <SectionCard.Content gap={6}>
                    {/* Access Token Lifespan */}
                    <FormField required>
                      <FormField.Label>Access token lifespan</FormField.Label>
                      <FormField.Description>
                        Defines how long an access token remains valid before it needs to be
                        renewed.
                      </FormField.Description>
                      <FormField.Control>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={accessTokenLifespan}
                            onChange={setAccessTokenLifespan}
                            min={5}
                            max={15}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            Minutes
                          </span>
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>5 - 15 Minutes</FormField.HelperText>
                    </FormField>

                    {/* Refresh Token Lifespan */}
                    <FormField required>
                      <FormField.Label>Refresh token lifespan</FormField.Label>
                      <FormField.Description>
                        Defines how long a user can stay signed in using a refresh token.
                      </FormField.Description>
                      <FormField.Control>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={refreshTokenLifespan}
                            onChange={setRefreshTokenLifespan}
                            min={1}
                            max={30}
                            step={1}
                            width="sm"
                          />
                          <span className="text-body-md text-[var(--color-text-default)]">
                            Days
                          </span>
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>1-30 Days</FormField.HelperText>
                    </FormField>

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
