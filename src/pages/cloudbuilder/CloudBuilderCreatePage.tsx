import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  Input,
  Select,
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
import { IconBell } from '@tabler/icons-react';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
} from './consoleListConfig';

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

const ROLE_OPTIONS = [
  { value: 'controller', label: 'controller' },
  ...Array.from({ length: 24 }, (_, idx) => ({
    value: `compute${idx + 1}`,
    label: `compute${idx + 1}`,
  })),
  { value: 'master1', label: 'master1' },
  { value: 'master2', label: 'master2' },
  { value: 'master3', label: 'master3' },
  ...Array.from({ length: 24 }, (_, idx) => ({
    value: `worker${idx + 1}`,
    label: `worker${idx + 1}`,
  })),
  { value: 'ceph-mon', label: 'ceph-mon' },
  { value: 'ceph-mgr', label: 'ceph-mgr' },
  { value: 'ceph-mds', label: 'ceph-mds' },
  { value: 'ceph-osd', label: 'ceph-osd' },
];

const DOMAIN_OPTIONS = [
  { value: 'thaki-prod', label: 'thaki-prod' },
  { value: 'thaki-stage', label: 'thaki-stage' },
  { value: 'thaki-dev', label: 'thaki-dev' },
  { value: 'thaki-lab', label: 'thaki-lab' },
];

interface SummarySidebarProps {
  bmcComplete: boolean;
  basicInfoComplete: boolean;
  allocationComplete: boolean;
  onCancel: () => void;
  onRegister: () => void;
  isRegisterDisabled: boolean;
}

function SummarySidebar({
  bmcComplete,
  basicInfoComplete,
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
                <WizardSectionStatusIcon status={basicInfoComplete ? 'done' : 'active'} size="sm" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  Basic information
                </span>
              </HStack>
              <HStack gap={2} align="center">
                <WizardSectionStatusIcon
                  status={allocationComplete ? 'done' : 'active'}
                  size="sm"
                />
                <span className="text-body-md text-[var(--color-text-default)]">Allocation</span>
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
  const [macPrimary, setMacPrimary] = useState('');
  const [nicPrimaryName, setNicPrimaryName] = useState('');
  const [location, setLocation] = useState('');

  const [providerNetwork, setProviderNetwork] = useState('');
  const [role, setRole] = useState('');
  const [domain, setDomain] = useState('');

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
    if (!bmcHost.trim()) errs.bmcHost = 'Please enter a BMC host address.';
    if (!bmcUsername.trim()) errs.bmcUsername = 'Please enter a BMC username.';
    if (!bmcPassword.trim()) errs.bmcPassword = 'Please enter a BMC password.';
    if (!serial.trim()) errs.serial = 'Please enter a serial number.';
    if (!macPrimary.trim()) errs.mac = 'Please enter a MAC address.';
    else if (!isValidMac(macPrimary)) errs.mac = 'Invalid MAC format. Example: 00:1A:2B:3C:4D:5E';
    if (!nicPrimaryName.trim()) errs.nic = 'Please enter a NIC name.';
    if (!location.trim()) errs.location = 'Please enter a location.';
    if (!providerNetwork.trim()) errs.providerNetwork = 'Please enter a provider network.';
    else if (!isValidProviderNetwork(providerNetwork))
      errs.providerNetwork = 'Invalid format. Example: VLAN 120 / 10.0.20.12/24';
    if (!role) errs.role = 'Please select a role.';
    if (!domain) errs.domain = 'Please select a domain.';
    return errs;
  }, [
    bmcHost,
    bmcUsername,
    bmcPassword,
    serial,
    macPrimary,
    nicPrimaryName,
    location,
    providerNetwork,
    role,
    domain,
  ]);

  const bmcComplete =
    bmcHost.trim().length > 0 && bmcUsername.trim().length > 0 && bmcPassword.trim().length > 0;

  const basicInfoComplete =
    serial.trim().length > 0 &&
    macPrimary.trim().length > 0 &&
    isValidMac(macPrimary) &&
    nicPrimaryName.trim().length > 0 &&
    location.trim().length > 0;

  const allocationComplete =
    providerNetwork.trim().length > 0 &&
    isValidProviderNetwork(providerNetwork) &&
    role.length > 0 &&
    domain.length > 0;

  const canSubmit = bmcComplete && basicInfoComplete && allocationComplete;

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
              <SectionCard.Header title="BMC connection" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label="Host"
                    required
                    helperText="BMC/IPMI endpoint address"
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
                    <Input
                      type="password"
                      value={bmcPassword}
                      onChange={(e) => setBmcPassword(e.target.value)}
                      placeholder="Enter BMC password"
                      error={hasAttemptedSubmit && !!errors.bmcPassword}
                      fullWidth
                    />
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Basic information */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label="Serial number"
                    required
                    error={hasAttemptedSubmit && !!errors.serial}
                    errorMessage={hasAttemptedSubmit ? errors.serial : undefined}
                  >
                    <Input
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="e.g. SN1234"
                      error={hasAttemptedSubmit && !!errors.serial}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="MAC (Primary)"
                    required
                    helperText="Asset identification key"
                    error={hasAttemptedSubmit && !!errors.mac}
                    errorMessage={hasAttemptedSubmit ? errors.mac : undefined}
                  >
                    <Input
                      value={macPrimary}
                      onChange={(e) => setMacPrimary(e.target.value)}
                      placeholder="e.g. 00:1A:2B:3C:4D:5E"
                      error={hasAttemptedSubmit && !!errors.mac}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="NIC (primary name)"
                    required
                    error={hasAttemptedSubmit && !!errors.nic}
                    errorMessage={hasAttemptedSubmit ? errors.nic : undefined}
                  >
                    <Input
                      value={nicPrimaryName}
                      onChange={(e) => setNicPrimaryName(e.target.value)}
                      placeholder="e.g. eno1"
                      error={hasAttemptedSubmit && !!errors.nic}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Location"
                    required
                    helperText="Maps to placement: { rack, rack_offset_u }"
                    error={hasAttemptedSubmit && !!errors.location}
                    errorMessage={hasAttemptedSubmit ? errors.location : undefined}
                  >
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. R1-U18"
                      error={hasAttemptedSubmit && !!errors.location}
                      fullWidth
                    />
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Allocation */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Allocation" />
              <SectionCard.Content>
                <VStack gap={6}>
                  <FormField
                    label="Provider network"
                    required
                    helperText="Format: VLAN ID + IP or IP/CIDR"
                    error={hasAttemptedSubmit && !!errors.providerNetwork}
                    errorMessage={hasAttemptedSubmit ? errors.providerNetwork : undefined}
                  >
                    <Input
                      value={providerNetwork}
                      onChange={(e) => setProviderNetwork(e.target.value)}
                      placeholder="e.g. VLAN 120 / 10.0.20.12/24"
                      error={hasAttemptedSubmit && !!errors.providerNetwork}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Role"
                    required
                    error={hasAttemptedSubmit && !!errors.role}
                    errorMessage={hasAttemptedSubmit ? errors.role : undefined}
                  >
                    <Select
                      value={role}
                      onChange={setRole}
                      placeholder="Select role"
                      options={ROLE_OPTIONS}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Domain"
                    required
                    helperText="Select a domain from the thaki suite"
                    error={hasAttemptedSubmit && !!errors.domain}
                    errorMessage={hasAttemptedSubmit ? errors.domain : undefined}
                  >
                    <Select
                      value={domain}
                      onChange={setDomain}
                      placeholder="Select domain"
                      options={DOMAIN_OPTIONS}
                      fullWidth
                    />
                  </FormField>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>

          <SummarySidebar
            bmcComplete={bmcComplete}
            basicInfoComplete={basicInfoComplete}
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
