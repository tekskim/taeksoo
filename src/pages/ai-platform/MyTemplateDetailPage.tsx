import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  DetailHeader,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconEdit, IconTrash, IconRocket } from '@tabler/icons-react';

const MOCK_TEMPLATE_DETAIL = {
  id: 'tpl-001',
  name: 'lively-sunset-6041',
  description: 'PyTorch GPU-enabled template for AI/ML workloads',
  basic: {
    templateName: 'python-mh2ste6b',
    description: 'No description available',
    visibility: 'public',
    category: 'Web services',
    created: 'October 24, 2025 at 03:07 PM',
    updated: 'October 24, 2025 at 03:07 PM',
    deployCount: '3 times',
    lastDeployed: 'October 24, 2025 at 03:07 PM',
  },
  container: {
    baseImage: 'ghcr.io/thakicloud/prompt-optimizer:latest',
    startupCommand: 'No commands configured',
    exposedPorts: '80',
    envVars: 'No environment variables configured',
  },
  resources: {
    minMemory: '5 GB',
    containerDisk: '5 GB',
    volumeDisk: 'Not in use',
    gpuRequirements: 'GPU not required',
  },
  deployments: '1',
  lastDeployed: '2025.09.26',
  createdAt: '2025.09.26',
  updatedAt: '2025.09.26',
};

type TemplateDetail = typeof MOCK_TEMPLATE_DETAIL;

const TEMPLATE_DETAILS: Record<string, TemplateDetail> = {
  'tpl-001': MOCK_TEMPLATE_DETAIL,
};

function getTemplateDetail(id: string | undefined): TemplateDetail {
  if (id && TEMPLATE_DETAILS[id]) {
    return TEMPLATE_DETAILS[id];
  }
  if (!id) {
    return MOCK_TEMPLATE_DETAIL;
  }
  return {
    ...MOCK_TEMPLATE_DETAIL,
    id,
    name: id,
  };
}

export function MyTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [detailTab, setDetailTab] = useState('details');

  const detail = useMemo(() => getTemplateDetail(id), [id]);

  useEffect(() => {
    updateActiveTabLabel(detail.name);
  }, [detail.name, updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Infrastructure' },
                { label: 'My templates', href: '/ai-platform/my-templates' },
                { label: detail.name },
              ]}
            />
          }
          actions={
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={6} className="pb-20">
        <DetailHeader>
          <DetailHeader.Title className="mb-1">{detail.name}</DetailHeader.Title>
          <p className="text-body-md text-[var(--color-text-subtle)] mb-3">{detail.description}</p>
          <DetailHeader.Actions>
            <HStack gap={1} className="flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconRocket size={12} />}
                onClick={() => navigate('/ai-platform/workloads/deploy')}
              >
                Deploy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconEdit size={12} />}
                onClick={() => navigate(`/ai-platform/my-templates/${id ?? detail.id}/edit`)}
              >
                Edit pod
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                Delete
              </Button>
            </HStack>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Deployments" value={detail.deployments} />
            <DetailHeader.InfoCard label="Last deployed" value={detail.lastDeployed} />
            <DetailHeader.InfoCard label="Created at" value={detail.createdAt} />
            <DetailHeader.InfoCard label="Updated at" value={detail.updatedAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={detailTab} onChange={setDetailTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
          </TabList>

          <TabPanel value="details" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Template name" value={detail.basic.templateName} />
                  <SectionCard.DataRow label="Description" value={detail.basic.description} />
                  <SectionCard.DataRow label="Visibility" value={detail.basic.visibility} />
                  <SectionCard.DataRow label="Category" value={detail.basic.category} />
                  <SectionCard.DataRow label="Created" value={detail.basic.created} />
                  <SectionCard.DataRow label="Updated" value={detail.basic.updated} />
                  <SectionCard.DataRow label="Deploy count" value={detail.basic.deployCount} />
                  <SectionCard.DataRow label="Last deployed" value={detail.basic.lastDeployed} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Container configuration" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Base image" value={detail.container.baseImage} />
                  <SectionCard.DataRow
                    label="Startup command"
                    value={detail.container.startupCommand}
                  />
                  <SectionCard.DataRow
                    label="Exposed ports"
                    value={detail.container.exposedPorts}
                  />
                  <SectionCard.DataRow
                    label="Environment variables"
                    value={detail.container.envVars}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Resource requirements" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Minimum memory" value={detail.resources.minMemory} />
                  <SectionCard.DataRow
                    label="Container disk size"
                    value={detail.resources.containerDisk}
                  />
                  <SectionCard.DataRow
                    label="Volume disk size"
                    value={detail.resources.volumeDisk}
                  />
                  <SectionCard.DataRow
                    label="GPU requirements"
                    value={detail.resources.gpuRequirements}
                  />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default MyTemplateDetailPage;
