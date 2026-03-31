import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  Input,
  SectionCard,
  FormField,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  WizardSectionStatusIcon,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconEye, IconEyeOff } from '@tabler/icons-react';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
} from './consoleListConfig';

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

interface SummarySidebarProps {
  bmcComplete: boolean;
  discoveredComplete: boolean;
  allocationComplete: boolean;
  onCancel: () => void;
  onRegister: () => void;
  isRegisterDisabled: boolean;
}

function SummarySidebar({
  bmcComplete,
  discoveredComplete,
  allocationComplete,
  onCancel,
  onRegister,
  isRegisterDisabled,
}: SummarySidebarProps) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <h5 className="text-heading-h6 text-[var(--color-text-default)]">Summary</h5>
            <VStack gap={2}>
              <HStack gap={2} align="center">
                <WizardSectionStatusIcon status={bmcComplete ? 'done' : 'active'} size="sm" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  BMC connection
                </span>
              </HStack>
              <HStack gap={2} align="center">
                <WizardSectionStatusIcon
                  status={discoveredComplete ? 'done' : 'active'}
                  size="sm"
                />
                <span className="text-body-md text-[var(--color-text-default)]">
                  Discovered information
                </span>
              </HStack>
              <HStack gap={2} align="center">
                <WizardSectionStatusIcon
                  status={allocationComplete ? 'done' : 'active'}
                  size="sm"
                />
                <span className="text-body-md text-[var(--color-text-default)]">
                  Basic information
                </span>
              </HStack>
            </VStack>
          </VStack>
        </div>

        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onRegister}
            disabled={isRegisterDisabled}
            className="flex-1"
          >
            Register
          </Button>
        </HStack>
      </div>
    </div>
  );
}

export function CloudBuilderCreatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'severs0.7';
  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);

  const [bmcHost, setBmcHost] = useState('');
  const [bmcUsername, setBmcUsername] = useState('');
  const [bmcPassword, setBmcPassword] = useState('');

  const [serial, setSerial] = useState('');
  const [productModel, setProductModel] = useState('');
  const [vendor, setVendor] = useState('');
  const [biosVersion, setBiosVersion] = useState('');
  const [cpu, setCpu] = useState('');
  const [memory, setMemory] = useState('');
  const [fetched, setFetched] = useState(false);

  const [providerNetwork, setProviderNetwork] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleFetch = () => {
    setSerial('SN-2025-00483');
    setProductModel('PowerEdge R750');
    setVendor('Dell Inc.');
    setBiosVersion('2.18.1');
    setCpu('2x Intel Xeon Gold 6338 (64C/128T)');
    setMemory('512 GB DDR4-3200');
    setFetched(true);
  };

  const isValidMac = (v: string) => /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(v.trim());

  const isValidProviderNetwork = (v: string) => {
    const s = v.trim();
    const m = /^VLAN\s+(\d{1,4})\s*\/\s*(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?$/.exec(s);
    if (!m) return false;
    const vlan = Number(m[1]);
    if (!Number.isFinite(vlan) || vlan < 1 || vlan > 4094) return false;
    const ip = m[2];
    const parts = ip.split('.').map((x) => Number(x));
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255))
      return false;
    const cidr = m[3] ? Number(m[3]) : null;
    if (cidr !== null && (!Number.isFinite(cidr) || cidr < 0 || cidr > 32)) return false;
    return true;
  };

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!bmcHost.trim()) errs.bmcHost = 'Please enter a BMC endpoint.';
    if (!bmcUsername.trim()) errs.bmcUsername = 'Please enter a BMC username.';
    if (!bmcPassword.trim()) errs.bmcPassword = 'Please enter a BMC password.';
    if (!providerNetwork.trim()) errs.providerNetwork = 'Please enter a provider network.';
    else if (!isValidProviderNetwork(providerNetwork))
      errs.providerNetwork = 'Invalid format. Example: VLAN 120 / 10.0.20.12/24';
    return errs;
  }, [bmcHost, bmcUsername, bmcPassword, providerNetwork]);

  const bmcComplete =
    bmcHost.trim().length > 0 && bmcUsername.trim().length > 0 && bmcPassword.trim().length > 0;

  const discoveredComplete = fetched;

  const allocationComplete =
    providerNetwork.trim().length > 0 && isValidProviderNetwork(providerNetwork);

  const canSubmit = bmcComplete && discoveredComplete && allocationComplete;

  const handleCancel = () => navigate(`/cloudbuilder/${slug}`);
  const handleRegister = () => {
    setHasAttemptedSubmit(true);
    if (!canSubmit) return;
    navigate(`/cloudbuilder/${slug}`);
  };

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/project' },
    { label: config.title, href: `/cloudbuilder/${slug}` },
    { label: 'Register server' },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarOpen ? 200 : 0}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">Register server</h1>

        <HStack gap={6} align="start" className="w-full">
          <VStack gap={4} className="flex-1">
            {/* BMC connection */}
            <SectionCard className="pb-4">
              <SectionCard.Header
                title="BMC connection"
                description="Enter the BMC (Redfish) endpoint and credentials, then click fetch to auto-discover server information."
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label="Endpoint"
                    required
                    error={hasAttemptedSubmit && !!errors.bmcHost}
                    errorMessage={hasAttemptedSubmit ? errors.bmcHost : undefined}
                  >
                    <Input
                      value={bmcHost}
                      onChange={(e) => setBmcHost(e.target.value)}
                      placeholder="e.g. 192.168.1.100"
                      error={hasAttemptedSubmit && !!errors.bmcHost}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Username"
                    required
                    error={hasAttemptedSubmit && !!errors.bmcUsername}
                    errorMessage={hasAttemptedSubmit ? errors.bmcUsername : undefined}
                  >
                    <Input
                      value={bmcUsername}
                      onChange={(e) => setBmcUsername(e.target.value)}
                      placeholder="e.g. admin"
                      error={hasAttemptedSubmit && !!errors.bmcUsername}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Password"
                    required
                    error={hasAttemptedSubmit && !!errors.bmcPassword}
                    errorMessage={hasAttemptedSubmit ? errors.bmcPassword : undefined}
                  >
                    <div className="relative w-full">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={bmcPassword}
                        onChange={(e) => setBmcPassword(e.target.value)}
                        placeholder="Enter BMC password"
                        error={hasAttemptedSubmit && !!errors.bmcPassword}
                        fullWidth
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <IconEyeOff size={14} className="text-[var(--color-text-subtle)]" />
                        ) : (
                          <IconEye size={14} className="text-[var(--color-text-subtle)]" />
                        )}
                      </button>
                    </div>
                  </FormField>

                  <HStack justify="end" className="w-full">
                    <Button variant="primary" size="md" onClick={handleFetch}>
                      Fetch
                    </Button>
                  </HStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Discovered information */}
            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Discovered information"
                description="Click fetch to auto-discover server hardware information."
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField label="Serial number">
                    <Input
                      value={serial}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>

                  <FormField label="Product model">
                    <Input
                      value={productModel}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>

                  <FormField label="Vendor">
                    <Input
                      value={vendor}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>

                  <FormField label="BIOS version">
                    <Input
                      value={biosVersion}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>

                  <FormField label="CPU">
                    <Input
                      value={cpu}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>

                  <FormField label="Memory">
                    <Input
                      value={memory}
                      placeholder="Auto-populated after fetch"
                      disabled
                      fullWidth
                    />
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Basic information */}
            <SectionCard className="pb-4">
              <SectionCard.Header
                title="Basic information"
                description="Provide additional details for the server inventory."
              />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label="Provider network"
                    helperText="Building, rack and unit position"
                    error={hasAttemptedSubmit && !!errors.providerNetwork}
                    errorMessage={hasAttemptedSubmit ? errors.providerNetwork : undefined}
                  >
                    <Input
                      value={providerNetwork}
                      onChange={(e) => setProviderNetwork(e.target.value)}
                      placeholder="e.g. DC-1 / Rack-1 / U18"
                      error={hasAttemptedSubmit && !!errors.providerNetwork}
                      fullWidth
                    />
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <SummarySidebar
            bmcComplete={bmcComplete}
            discoveredComplete={discoveredComplete}
            allocationComplete={allocationComplete}
            onCancel={handleCancel}
            onRegister={handleRegister}
            isRegisterDisabled={!canSubmit}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}
