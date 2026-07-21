import { useState } from 'react';
import {
  VStack,
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
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { useParams, useNavigate } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import {
  installedOperatorsMock,
  dependentApplicationsByOperatorMock,
} from '@/pages/apps/appsMockData';
import type { InstalledApp } from '@/pages/apps/appsTypes';

/* ----------------------------------------
   Types (local — for table rows)
   ---------------------------------------- */

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledOperatorDetailPage() {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const { isStandalone } = useAppCatalogMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = isStandalone ? (sidebarOpen ? 200 : 0) : sidebarOpen ? 248 : 48;
  const basePath = isStandalone ? '/app-catalog' : '/container';
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const operator = installedOperatorsMock.find((op) => op.id === operatorId);
  const dependentApps: InstalledApp[] = dependentApplicationsByOperatorMock[operatorId ?? ''] ?? [];

  const appColumns: TableColumn<InstalledApp>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (_, row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'name',
      label: 'App name',
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
    {
      key: 'version',
      label: 'Version',
      minWidth: 100,
    },
  ];

  if (!operator) return null;

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
          showNavigation={!isStandalone}
          onBack={() => navigate(`${basePath}/installed-operators`)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={
                isStandalone
                  ? [
                      { label: 'Installed Operators', href: `${basePath}/installed-operators` },
                      { label: operator.displayName },
                    ]
                  : [
                      { label: 'Cluster1', href: '/container' },
                      { label: 'Installed operators', href: '/container/installed-operators' },
                      { label: operator.displayName },
                    ]
              }
            />
          }
          actions={isStandalone ? undefined : <ContainerTopBarActions />}
        />
      }
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>
            <div className="flex items-center gap-2">
              {operator.logoUrl && (
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border border-[var(--color-border-default)]">
                  <img src={operator.logoUrl} alt={operator.displayName} className="w-4 h-4" />
                </div>
              )}
              {operator.displayName}
            </div>
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
            <DetailHeader.InfoCard label="Version" value={operator.version} />
            <DetailHeader.InfoCard label="Namespace" value={operator.namespace} />
            <DetailHeader.InfoCard label="Installed at" value={operator.installedAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <VStack gap={0} className="pt-4">
          <Table<InstalledApp>
            columns={appColumns}
            data={dependentApps}
            rowKey="id"
            emptyMessage="No dependent apps found"
          />
        </VStack>
      </VStack>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete operator"
        description={
          operator.dependentApplicationCount > 0
            ? `This operator has ${operator.dependentApplicationCount} dependent app(s). Deleting it may break those applications. This action cannot be undone.`
            : 'This will remove the operator and all associated resources. This action cannot be undone.'
        }
        size="sm"
      >
        <InfoBox label="Operator" value={operator.displayName} />
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Delete operator', operator.id);
              setIsDeleteOpen(false);
              navigate(`${basePath}/installed-operators`);
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
