import { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
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
} from '@/design-system';
import { useParams, useNavigate } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash, IconCopy, IconDownload } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { installedAppsMock } from '@/pages/apps/appsMockData';

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledAppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const app = installedAppsMock.find((a) => a.id === appId);
  const valuesYaml = app?.valuesYaml ?? '';

  if (!app) return null;

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Installed apps', href: '/container/installed-apps' },
                { label: app.releaseName },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>{app.releaseName}</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={() => navigate(`/container/installed-apps/${appId}/edit`)}
            >
              Edit
            </Button>
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
                <Badge theme={getContainerStatusTheme(app.status)} type="subtle" size="sm">
                  {app.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="App name" value={app.releaseName} />
            <DetailHeader.InfoCard label="Chart name" value={app.name} />
            <DetailHeader.InfoCard label="Version" value={app.version} />
            <DetailHeader.InfoCard label="Namespace" value={app.namespace} />
            <DetailHeader.InfoCard label="Last deployed" value={app.lastDeployed} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* values.yaml — read-only */}
        <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
              values.yaml
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCopy size={12} />}
                onClick={() => navigator.clipboard.writeText(valuesYaml)}
              >
                Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconDownload size={12} />}
                onClick={() => {
                  const blob = new Blob([valuesYaml], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${app.releaseName}-values.yaml`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download
              </Button>
            </div>
          </div>

          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
            <OverlayScrollbarsComponent
              options={{ scrollbars: { autoHide: 'scroll', autoHideDelay: 800 } }}
              defer={false}
              className="bg-[var(--color-surface-default)] max-h-[560px]"
            >
              <table className="w-full border-collapse">
                <tbody>
                  {valuesYaml.split('\n').map((line, i) => (
                    <tr key={i} className="leading-[20px]">
                      <td className="px-3 py-0 text-right select-none text-body-sm text-[var(--color-text-disabled)] font-mono w-[1%] whitespace-nowrap align-top">
                        {i + 1}
                      </td>
                      <td className="px-3 py-0 text-body-sm text-[var(--color-text-default)] font-mono whitespace-pre">
                        {line || '\u00A0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </OverlayScrollbarsComponent>
          </div>
        </div>
      </VStack>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete App"
        description="This will remove the Helm release and all associated Kubernetes resources. This action cannot be undone."
        size="sm"
      >
        <InfoBox label="App / Namespace" value={`${app.releaseName} / ${app.namespace}`} />
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Delete', app.id);
              setIsDeleteOpen(false);
              navigate('/container/installed-apps');
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
