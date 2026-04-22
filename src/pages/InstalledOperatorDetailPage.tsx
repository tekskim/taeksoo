/**
 * Installed Operator Detail — FR-026 (상세)
 *
 * 탭 구성:
 *   - Resources:    Operator가 생성한 Kubernetes 리소스 목록 (Deployment, CRD 등)
 *   - CR Instances: 이 Operator에 의존하는 CR Instance 목록 (정책서 §4-5 — 삭제 차단 근거)
 *
 * v1.0: 조회 + 삭제만 제공. 업그레이드는 v1.0 이후.
 */
import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  DetailHeader,
  Badge,
  Button,
  Modal,
  InfoBox,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconAlertTriangle, IconPackage } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { installedOperatorsMock, crInstancesMock } from '@/pages/apps/appsMockData';
import type { CRInstance } from '@/pages/apps/appsTypes';

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */

interface OperatorResource {
  id: string;
  kind: string;
  name: string;
  namespace?: string;
}

/* ────────────────────────────────────────────────────────────
   Logo helper
   ──────────────────────────────────────────────────────────── */

function OperatorLogo({ logoUrl, name }: { logoUrl?: string; name: string }) {
  const [error, setError] = useState(false);
  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-6 h-6 object-contain"
        onError={() => setError(true)}
      />
    );
  }
  return <IconPackage size={20} stroke={1.5} className="text-[var(--color-text-subtle)]" />;
}

/* ────────────────────────────────────────────────────────────
   InstalledOperatorDetailPage
   ──────────────────────────────────────────────────────────── */

export default function InstalledOperatorDetailPage() {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const { isStandalone } = useAppCatalogMode();

  const [activeTab, setActiveTab] = useState('resources');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // demo URL params: ?showDeleteModal=true, ?demoCrEmpty=true (캡처용)
  const demoShowDelete = searchParams.get('showDeleteModal') === 'true';
  const demoCrEmpty = searchParams.get('demoCrEmpty') === 'true';

  useEffect(() => {
    if (demoShowDelete) setIsDeleteOpen(true);
  }, [demoShowDelete]);

  const operator = installedOperatorsMock.find((op) => op.id === operatorId);
  const allCrInstances = crInstancesMock[operatorId ?? ''] ?? [];
  const crInstances = demoCrEmpty ? [] : allCrInstances;
  const hasCrInstances = crInstances.length > 0;

  const resourceColumns: TableColumn<OperatorResource>[] = [
    {
      key: 'kind',
      label: 'Kind',
      flex: 1,
      minWidth: columnMinWidths.type,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      render: (value) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
  ];

  const crColumns: TableColumn<CRInstance>[] = [
    {
      key: 'status',
      label: 'Status',
      minWidth: '120px',
      render: (_value, row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'kind',
      label: 'Kind',
      flex: 1,
      minWidth: columnMinWidths.type,
    },
    {
      key: 'name',
      label: 'Instance name',
      flex: 2,
      minWidth: columnMinWidths.name,
      render: (value) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
    },
  ];

  if (!operator) {
    return null;
  }

  const resources: OperatorResource[] = (operator.resources ?? []).map((r, i) => ({
    id: `res-${i}`,
    kind: r.kind,
    name: r.name,
    namespace: r.namespace,
  }));

  return (
    <PageShell
      sidebar={
        isStandalone ? (
          <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        ) : (
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        )
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'App Catalog', href: '/container/appcatalog/catalog' },
                { label: 'Installed Operators', href: '/container/appcatalog/installed-operators' },
                { label: operator.displayName },
              ]}
            />
          }
        />
      }
    >
      <VStack gap={4}>
        {/* Detail header */}
        <DetailHeader>
          <DetailHeader.Title>
            <HStack gap={2} align="center">
              <OperatorLogo logoUrl={operator.logoUrl} name={operator.displayName} />
              <span>{operator.displayName}</span>
            </HStack>
          </DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme={getContainerStatusTheme(operator.status)} type="subtle" size="sm">
                  {operator.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="Operator" value={operator.name} />
            <DetailHeader.InfoCard label="Version" value={`v${operator.version}`} />
            <DetailHeader.InfoCard label="Last deployed" value={operator.installedAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="resources">Resources</Tab>
            <Tab value="cr-instances">CR Instances</Tab>
          </TabList>

          <TabPanel value="resources" className="pt-0">
            <VStack gap={0} className="pt-4">
              <Table
                columns={resourceColumns}
                data={resources}
                rowKey="id"
                emptyMessage="No resources found"
              />
            </VStack>
          </TabPanel>

          <TabPanel value="cr-instances" className="pt-0">
            <VStack gap={3} className="pt-4">
              <Table
                columns={crColumns}
                data={crInstances}
                rowKey="id"
                emptyMessage="No CR Instances found"
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      {/* Delete modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Operator"
        size="sm"
        description="This will permanently remove the Operator and all Kubernetes resources it manages. The Operator cannot be deleted while active CR Instances still exist."
      >
        <InfoBox.Group>
          <InfoBox label="Operator" value={operator.displayName} />

          {hasCrInstances && (
            <InfoBox label="CR Instances">
              <ul className="flex flex-col gap-1 pl-1">
                {crInstances.map((cr) => (
                  <li
                    key={cr.id}
                    className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-text-default)] shrink-0" />
                    <span>{cr.name}</span>
                  </li>
                ))}
              </ul>
            </InfoBox>
          )}
        </InfoBox.Group>

        {hasCrInstances && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[var(--color-feedback-danger-subtle,#fef2f2)] border border-[var(--color-feedback-danger,#ef4444)] rounded-[var(--radius-md)] text-body-sm text-[var(--color-text-default)]">
            <IconAlertTriangle
              size={16}
              stroke={1.5}
              className="text-[var(--color-feedback-danger,#ef4444)] mt-0.5 shrink-0"
            />
            <span>
              <strong>{crInstances.length} CR Instance(s)</strong> are currently running. Delete all
              CR Instances first, then retry.
            </span>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={hasCrInstances}
            onClick={() => {
              navigate('/container/appcatalog/installed-operators');
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
