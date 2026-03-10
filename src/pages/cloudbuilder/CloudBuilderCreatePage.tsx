import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ConfirmModal,
  DetailHeader,
  InlineMessage,
  Input,
  SectionCard,
  Select,
  Textarea,
  VStack,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
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

export function CloudBuilderCreatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Discovery create form (UI only)
  const isDiscovery = slug === 'discovery';
  const [endpoint, setEndpoint] = useState('');
  const [discoverySerial, setDiscoverySerial] = useState('SN2001');
  const [discoveryMacPrimary, setDiscoveryMacPrimary] = useState('00:1A:2B:3C:4D:5E');
  const [discoveryLocation, setDiscoveryLocation] = useState('R1-U18');
  const [discoveryMgmtIp, setDiscoveryMgmtIp] = useState('10.0.0.12');
  const [discoveryMemo, setDiscoveryMemo] = useState('');

  // Servers create form (UI only)
  const isServerLike = slug === 'servers' || slug === 'severs0.7';
  const [serial, setSerial] = useState('');
  const [macPrimary, setMacPrimary] = useState('');
  const [location, setLocation] = useState('');
  const [nicPrimaryName, setNicPrimaryName] = useState('');
  const [role, setRole] = useState('');
  const [providerNetwork, setProviderNetwork] = useState('');
  const [observedHealth, setObservedHealth] = useState('');
  const [provisionStatus, setProvisionStatus] = useState('');
  const [domain, setDomain] = useState('');
  const [openSection, setOpenSection] = useState<'basic' | 'status' | 'domain'>('basic');

  const pageTitle = isDiscovery ? 'Register discovery' : `Create ${config.title}`;

  const isValidMac = (v: string) => /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(v.trim());

  const isValidProviderNetwork = (v: string) => {
    const s = v.trim();
    const m = /^VLAN\s+(\d{1,4})\s*\/\s*(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?$/.exec(s);
    if (!m) return false;
    const vlan = Number(m[1]);
    if (!Number.isFinite(vlan) || vlan < 1 || vlan > 4094) return false;
    const ip = m[2];
    const parts = ip.split('.').map((x) => Number(x));
    if (parts.length !== 4) return false;
    if (parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return false;
    const cidr = m[3] ? Number(m[3]) : null;
    if (cidr !== null && (!Number.isFinite(cidr) || cidr < 0 || cidr > 32)) return false;
    return true;
  };

  const serverFormErrors = useMemo(() => {
    if (!isServerLike) return {};
    const errs: Record<string, string> = {};
    if (!serial.trim()) errs.serial = 'Serial Number는 필수입니다.';
    if (!macPrimary.trim()) errs.macPrimary = 'MAC (Primary)는 필수입니다.';
    else if (!isValidMac(macPrimary))
      errs.macPrimary = 'MAC 형식이 올바르지 않습니다. 예) 00:1A:2B:3C:4D:5E';
    if (!nicPrimaryName.trim()) errs.nicPrimaryName = 'NIC (Primary Name)은 필수입니다.';
    if (!location.trim()) errs.location = 'Location은 필수입니다.';
    if (!providerNetwork.trim()) errs.providerNetwork = 'Provider Network는 필수입니다.';
    else if (!isValidProviderNetwork(providerNetwork)) {
      errs.providerNetwork =
        '형식이 올바르지 않습니다. 예) VLAN 120 / 10.0.20.12 또는 VLAN 120 / 10.0.20.12/24';
    }
    if (!observedHealth) errs.observedHealth = 'Observed Health를 선택하세요.';
    if (observedHealth && observedHealth !== 'Running')
      errs.observedHealth = 'Running일 때만 다음 단계 진행이 가능합니다.';
    if (!provisionStatus) errs.provisionStatus = 'Provision Status를 선택하세요.';
    if (!role) errs.role = 'Role을 선택하세요.';
    if (!domain) errs.domain = 'Domain을 선택하세요.';
    return errs;
  }, [
    domain,
    isServerLike,
    location,
    macPrimary,
    nicPrimaryName,
    observedHealth,
    providerNetwork,
    provisionStatus,
    role,
    serial,
  ]);

  const canSubmitServerForm = isServerLike && Object.values(serverFormErrors).every((v) => !v);

  const sectionValid = useMemo(() => {
    if (!isServerLike) return { basic: true, status: true, domain: true };
    const e = serverFormErrors as Record<string, string>;
    const basicOk =
      !e.serial && !e.macPrimary && !e.location && !e.nicPrimaryName && !e.providerNetwork;
    const statusOk = !e.observedHealth && !e.provisionStatus && !e.role;
    const domainOk = !e.domain;
    return { basic: basicOk, status: statusOk, domain: domainOk };
  }, [isServerLike, serverFormErrors]);

  const FieldDivider = () => <div className="h-px w-full bg-[var(--color-border-subtle)]" />;

  const breadcrumbItems = [
    { label: 'Proj-1', href: '/project' },
    { label: config.title, href: `/cloudbuilder/${slug}` },
    { label: 'Create' },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          onSidebarToggle={() => setSidebarOpen(true)}
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
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6} className="min-w-[1176px]">
        <DetailHeader>
          <DetailHeader.Title>{pageTitle}</DetailHeader.Title>
          <Button as={Link} to={`/cloudbuilder/${slug}`} variant="link">
            Back
          </Button>
          {isDiscovery && (
            <div className="text-body-md text-[var(--color-text-subtle)]">
              입력값은 저장되지 않으며, UI/필드 구성만 반영합니다.
            </div>
          )}
        </DetailHeader>

        {isDiscovery ? (
          <>
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
              <div className="px-6 py-5">
                <div className="text-body-lg font-semibold text-[var(--color-text-default)]">
                  Endpoint
                </div>
                <div className="mt-1 text-body-md text-[var(--color-text-subtle)]">
                  엔드포인트를 입력하고 불러오기를 누르면 Serial/MAC/IP/Location을 채웁니다. (데모)
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-9">
                    <Input
                      placeholder="e.g. http://discovery-agent.local:8080"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-3">
                    <Button
                      fullWidth
                      onClick={() => {
                        setDiscoverySerial('SN2001');
                        setDiscoveryMacPrimary('00:1A:2B:3C:4D:5E');
                        setDiscoveryLocation('R1-U18');
                        setDiscoveryMgmtIp('10.0.0.12');
                      }}
                    >
                      Fetch
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[var(--color-border-subtle)]" />

              <div className="px-6 py-5">
                <div className="text-body-lg font-semibold text-[var(--color-text-default)]">
                  Basic
                </div>

                <div className="mt-4 grid grid-cols-12 gap-y-5 gap-x-6">
                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">
                      Serial <span className="text-[var(--color-state-danger)]">*</span>
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      현장 휴면 식별용 시리얼
                    </div>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={discoverySerial}
                      onChange={(e) => setDiscoverySerial(e.target.value)}
                      fullWidth
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">
                      MAC (Primary) <span className="text-[var(--color-state-danger)]">*</span>
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      대표 MAC(자산 식별 키)
                    </div>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={discoveryMacPrimary}
                      onChange={(e) => setDiscoveryMacPrimary(e.target.value)}
                      fullWidth
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">
                      Location <span className="text-[var(--color-state-danger)]">*</span>
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      랙/유닛 등 물리 위치
                    </div>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={discoveryLocation}
                      onChange={(e) => setDiscoveryLocation(e.target.value)}
                      fullWidth
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">
                      Mgmt IP (Optional)
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      관리 IP(있으면 입력)
                    </div>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={discoveryMgmtIp}
                      onChange={(e) => setDiscoveryMgmtIp(e.target.value)}
                      helperText="IP 형식 점검만 수행"
                      fullWidth
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">Notes</div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      메모(선택)
                    </div>
                  </div>
                  <div className="col-span-8">
                    <Textarea
                      placeholder={'예: "탐지 출처: LLDP"'}
                      value={discoveryMemo}
                      onChange={(e) => setDiscoveryMemo(e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <Button variant="secondary" onClick={() => navigate(`/cloudbuilder/${slug}`)}>
                    Cancel
                  </Button>
                  <Button size="md" onClick={() => setConfirmOpen(true)}>
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : isServerLike ? (
          <>
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 lg:col-span-8">
                <VStack gap={4}>
                  <SectionCard
                    className={
                      openSection === 'basic'
                        ? 'border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                        : ''
                    }
                  >
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => setOpenSection('basic')}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="text-heading-h6 text-[var(--color-text-default)]">
                          Basic Information
                        </div>
                      </button>

                      {openSection === 'basic' ? (
                        <div className="pt-4">
                          <div className="py-4">
                            <Input
                              label="Serial Number"
                              placeholder="e.g. SN1234"
                              value={serial}
                              onChange={(e) => setSerial(e.target.value)}
                              required
                              error={submitted ? (serverFormErrors as any).serial : undefined}
                              fullWidth
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Input
                              label="MAC (Primary)"
                              placeholder="e.g. 00:1A:2B:3C:4D:5E"
                              value={macPrimary}
                              onChange={(e) => setMacPrimary(e.target.value)}
                              required
                              error={submitted ? (serverFormErrors as any).macPrimary : undefined}
                              fullWidth
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Input
                              label="NIC (Primary Name)"
                              placeholder="e.g. eno1"
                              value={nicPrimaryName}
                              onChange={(e) => setNicPrimaryName(e.target.value)}
                              required
                              error={
                                submitted ? (serverFormErrors as any).nicPrimaryName : undefined
                              }
                              fullWidth
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Input
                              label="Location"
                              placeholder="e.g. R1-U18"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              required
                              helperText={'placement: { rack, rack_offset_u } 로 매핑'}
                              error={submitted ? (serverFormErrors as any).location : undefined}
                              fullWidth
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Input
                              label="Provider Network"
                              placeholder="e.g. VLAN 120 / 10.0.20.12 또는 VLAN 120 / 10.0.20.12/24"
                              value={providerNetwork}
                              onChange={(e) => setProviderNetwork(e.target.value)}
                              required
                              helperText={
                                '유효성 검사 불가: 형식만 검증합니다. (VLAN ID + IP 또는 IP/CIDR)'
                              }
                              error={
                                submitted ? (serverFormErrors as any).providerNetwork : undefined
                              }
                              fullWidth
                            />
                          </div>

                          <div className="flex items-center justify-end pt-4">
                            <Button
                              onClick={() => {
                                setSubmitted(true);
                                if (!sectionValid.basic) return;
                                setOpenSection('status');
                              }}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </SectionCard>

                  <SectionCard
                    className={
                      openSection === 'status'
                        ? 'border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                        : ''
                    }
                  >
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => setOpenSection('status')}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="text-heading-h6 text-[var(--color-text-default)]">
                          Status
                        </div>
                      </button>

                      {openSection === 'status' ? (
                        <div className="pt-4">
                          <div className="py-4">
                            <Select
                              label="Observed Health"
                              placeholder="Select observed health"
                              value={observedHealth}
                              onChange={setObservedHealth}
                              required
                              helperText="Running일 때만 다음 단계 진행 가능"
                              error={
                                submitted ? (serverFormErrors as any).observedHealth : undefined
                              }
                              fullWidth
                              options={[
                                { value: 'Running', label: 'Running' },
                                { value: 'Not Running', label: 'Not Running' },
                              ]}
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Select
                              label="Provision Status"
                              placeholder="Select provision status"
                              value={provisionStatus}
                              onChange={setProvisionStatus}
                              required
                              error={
                                submitted ? (serverFormErrors as any).provisionStatus : undefined
                              }
                              fullWidth
                              options={[
                                { value: 'Registered', label: 'Registered' },
                                { value: 'Provisioning', label: 'Provisioning' },
                                { value: 'Done', label: 'Done' },
                              ]}
                            />
                          </div>
                          <FieldDivider />
                          <div className="py-4">
                            <Select
                              label="Role"
                              placeholder="Select role"
                              value={role}
                              onChange={setRole}
                              required
                              error={submitted ? (serverFormErrors as any).role : undefined}
                              fullWidth
                              options={[
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
                              ]}
                            />
                          </div>

                          {observedHealth && observedHealth !== 'Running' ? (
                            <div className="pt-2">
                              <InlineMessage variant="warning">
                                Observed Health가 Running일 때만 다음 단계 진행이 가능합니다.
                              </InlineMessage>
                            </div>
                          ) : null}

                          <div className="flex items-center justify-end pt-4">
                            <Button
                              onClick={() => {
                                setSubmitted(true);
                                if (!sectionValid.status) return;
                                if (observedHealth !== 'Running') return;
                                setOpenSection('domain');
                              }}
                              disabled={observedHealth !== 'Running'}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </SectionCard>

                  <SectionCard
                    className={
                      openSection === 'domain'
                        ? 'border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                        : ''
                    }
                  >
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => setOpenSection('domain')}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="text-heading-h6 text-[var(--color-text-default)]">
                          Domain
                        </div>
                      </button>

                      {openSection === 'domain' ? (
                        <div className="pt-4">
                          <div className="py-4">
                            <Select
                              label="Domain"
                              placeholder="Select domain"
                              value={domain}
                              onChange={setDomain}
                              required
                              error={submitted ? (serverFormErrors as any).domain : undefined}
                              helperText="thaki suite 내 도메인을 선택값으로 불러옴 (UI mock)"
                              fullWidth
                              options={[
                                { value: 'thaki-prod', label: 'thaki-prod' },
                                { value: 'thaki-stage', label: 'thaki-stage' },
                                { value: 'thaki-dev', label: 'thaki-dev' },
                                { value: 'thaki-lab', label: 'thaki-lab' },
                              ]}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </SectionCard>
                </VStack>
              </div>

              <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-4">
                <SectionCard className="bg-[var(--color-surface-subtle)] border-[var(--color-border-subtle)]">
                  <SectionCard.Header title="Summary" />
                  <SectionCard.Content gap={2}>
                    {[
                      { key: 'basic', label: 'Basic Information', done: sectionValid.basic },
                      { key: 'status', label: 'Status', done: sectionValid.status },
                      { key: 'domain', label: 'Domain', done: sectionValid.domain },
                    ].map((it) => (
                      <div key={it.key} className="flex items-center justify-between py-1">
                        <button
                          type="button"
                          onClick={() => setOpenSection(it.key as any)}
                          className="text-body-md text-[var(--color-text-default)] hover:underline text-left"
                        >
                          {it.label}
                        </button>
                        <span
                          className={[
                            'inline-flex items-center justify-center',
                            'w-5 h-5 rounded-full border',
                            it.done
                              ? 'bg-[var(--color-action-primary)] border-[var(--color-action-primary)] text-white'
                              : 'bg-transparent border-[var(--color-border-default)] text-transparent',
                          ].join(' ')}
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      </div>
                    ))}
                  </SectionCard.Content>

                  <div className="pt-4 flex items-center gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/cloudbuilder/${slug}`)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setSubmitted(true);
                        if (!canSubmitServerForm) return;
                        setConfirmOpen(true);
                      }}
                      disabled={!canSubmitServerForm}
                      className="flex-1"
                    >
                      Create
                    </Button>
                  </div>
                </SectionCard>
              </div>
            </div>
          </>
        ) : (
          <div className="text-[var(--color-text-subtle)]">
            Create form for this resource is not configured yet.
          </div>
        )}
      </VStack>

      <ConfirmModal
        open={confirmOpen}
        title={`Create ${config.title}`}
        description="This is UI-only. No actual resource will be created."
        confirmText="OK"
        cancelText="Cancel"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          navigate(`/cloudbuilder/${slug}`);
        }}
      />
    </PageShell>
  );
}
