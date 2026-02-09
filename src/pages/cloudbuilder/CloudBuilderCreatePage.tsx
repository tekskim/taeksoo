import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ConfirmModal,
  DetailHeader,
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
  const [mgmtIp, setMgmtIp] = useState('');
  const [nicPrimaryName, setNicPrimaryName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [role, setRole] = useState('');
  const [frontierNet, setFrontierNet] = useState('');
  const [notes, setNotes] = useState('');

  const pageTitle = isDiscovery ? 'Register discovery' : `Create ${config.title}`;

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
          <div className="text-body-md text-[var(--color-text-subtle)]">
            <span className="text-[var(--color-text-subtle)]">Discovery</span>
            <span className="mx-1">{'>'}</span>
            <span className="text-[var(--color-text-subtle)]">Register discovery</span>
          </div>
          <DetailHeader.Title>{pageTitle}</DetailHeader.Title>
          <Button as={Link} to={`/cloudbuilder/${slug}`} variant="link">
            Back{' '}
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
                  Endpoint{' '}
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
                        // UI only: simulate fetching discovered values setDiscoverySerial('SN2001');
                        setDiscoveryMacPrimary('00:1A:2B:3C:4D:5E');
                        setDiscoveryLocation('R1-U18');
                        setDiscoveryMgmtIp('10.0.0.12');
                      }}
                    >
                      Fetch{' '}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[var(--color-border-subtle)]" />

              <div className="px-6 py-5">
                <div className="text-body-lg font-semibold text-[var(--color-text-default)]">
                  Basic{' '}
                </div>

                <div className="mt-4 grid grid-cols-12 gap-y-5 gap-x-6">
                  <div className="col-span-4">
                    <div className="text-label-md text-[var(--color-text-default)]">
                      Serial <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      현장 휴면 식별용 시리얼{' '}
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
                      MAC (Primary) <span className="ml-1 text-[var(--color-state-danger)]">*</span>
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
                      Location <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                    </div>
                    <div className="mt-1 text-body-sm text-[var(--color-text-subtle)]">
                      랙/유닛 등 물리 위치{' '}
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
                    <div className="text-label-md text-[var(--color-text-default)]">Notes </div>
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
                    Cancel{' '}
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
            <SectionCard>
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content gap={4}>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6">
                    <Input
                      label="Serial"
                      placeholder="e.g. SN1001"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="MAC (Primary)"
                      placeholder="e.g. 00:11:22:33:44:55"
                      value={macPrimary}
                      onChange={(e) => setMacPrimary(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="Location"
                      placeholder="e.g. R1-U10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="Mgmt IP"
                      placeholder="e.g. 10.0.1.10"
                      value={mgmtIp}
                      onChange={(e) => setMgmtIp(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="NIC (Primary Name)"
                      placeholder="e.g. eno1"
                      value={nicPrimaryName}
                      onChange={(e) => setNicPrimaryName(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      label="Purpose"
                      placeholder="e.g. Hypervisor"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6">
                    <Select
                      label="Role"
                      placeholder="Select role"
                      value={role}
                      onChange={setRole}
                      fullWidth
                      options={[
                        { value: 'controller', label: 'controller' },
                        { value: 'compute', label: 'compute' },
                        { value: 'master', label: 'master' },
                        { value: 'worker', label: 'worker' },
                        { value: 'ceph-mon', label: 'ceph-mon' },
                        { value: 'ceph-mgr', label: 'ceph-mgr' },
                        { value: 'ceph-mds', label: 'ceph-mds' },
                        { value: 'ceph-osd', label: 'ceph-osd' },
                      ]}
                    />
                  </div>
                  <div className="col-span-6">
                    <Select
                      label="Frontier NET"
                      placeholder="Select status"
                      value={frontierNet}
                      onChange={setFrontierNet}
                      fullWidth
                      options={[
                        { value: 'OK', label: 'OK' },
                        { value: 'Missing', label: 'Missing' },
                        { value: 'Invalid', label: 'Invalid' },
                      ]}
                    />
                  </div>
                </div>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Notes" />
              <SectionCard.Content gap={3}>
                <Textarea
                  label="Description"
                  placeholder="Optional notes (UI only)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </SectionCard.Content>
            </SectionCard>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => navigate(`/cloudbuilder/${slug}`)}>
                Cancel{' '}
              </Button>
              <Button size="md" onClick={() => setConfirmOpen(true)}>
                Create
              </Button>
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
          // UI-only: go back to list navigate(`/cloudbuilder/${slug}`);
        }}
      />
    </PageShell>
  );
}
