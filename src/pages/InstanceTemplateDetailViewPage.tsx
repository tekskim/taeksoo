import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  Chip,
  ConfirmModal,
  PageShell,
  DetailHeader,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconEdit, IconTrash, IconCopyCheck, IconStar, IconStarFilled } from '@tabler/icons-react';

interface InstanceTemplateDetail {
  id: string;
  name: string;
  description: string;
  visibility: string;
  image: string;
  os: string;
  flavor: string;
  spec: string;
  networks: string[];
  securityGroups: string[];
  ports: string[];
  favorite: boolean;
  createdAt: string;
  availabilityZone: string;
  userData: string;
  tags: { key: string; value: string }[];
}

const mockTemplatesMap: Record<string, InstanceTemplateDetail> = {
  'tpl-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'hj-small',
    description: '-',
    visibility: 'Private',
    image: 'Ubuntu 22.04 LTS',
    os: 'ubuntu-22.04',
    flavor: 'm1.medium',
    spec: 'vCPU : 8 / RAM : 16 GiB / Disk : 10 GiB',
    networks: ['in-net', 'ext-net', 'mgmt-net', 'data-net'],
    securityGroups: ['default', 'ssh-access', 'web-access'],
    ports: ['port-01', 'port-02'],
    favorite: true,
    createdAt: 'Jul 25, 2026 10:32:16',
    availabilityZone: 'nova',
    userData: 'Provided at creation',
    tags: [{ key: 'Team', value: 'dev' }],
  },
  'tpl-002': {
    id: 'a3f2c8e91b5d4a7689012def34567890',
    name: 'My-web-template',
    description: '-',
    visibility: 'Private',
    image: 'ubuntu 22.04',
    os: 'ubuntu-22.04',
    flavor: 'th.medium',
    spec: 'vCPU : 2 / RAM : 4 GiB / Disk : 40 GiB',
    networks: ['public-net', 'internal-net'],
    securityGroups: ['default', 'web-access'],
    ports: ['port-web-80', 'port-web-443'],
    favorite: false,
    createdAt: 'Jul 24, 2026 03:19:59',
    availabilityZone: 'nova',
    userData: '-',
    tags: [],
  },
  'tpl-003': {
    id: 'b9e4d7c3a1f6285094837def12345678',
    name: 'db-template',
    description: 'Database server template',
    visibility: 'Private',
    image: 'CentOS 8',
    os: 'centos-8',
    flavor: 'm1.xlarge',
    spec: 'vCPU : 32 / RAM : 64 GiB / Disk : 200 GiB',
    networks: ['db-net'],
    securityGroups: ['default', 'db-access'],
    ports: [],
    favorite: false,
    createdAt: 'Jul 23, 2026 20:06:42',
    availabilityZone: 'nova',
    userData: 'Provided at creation',
    tags: [
      { key: 'Team', value: 'dev' },
      { key: 'env', value: 'production' },
    ],
  },
};

export function InstanceTemplateDetailViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const template = id ? mockTemplatesMap[id] : undefined;

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  useEffect(() => {
    if (template) updateActiveTabLabel(template.name);
  }, [template, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const [activeTab, setActiveTab] = useState('details');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!template) {
    return (
      <PageShell
        sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
        sidebarWidth={sidebarWidth}
      >
        <VStack gap={4} className="pt-8">
          <p className="text-body-md text-[var(--color-text-muted)]">Template not found.</p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/compute/instance-templates')}
          >
            Back to templates
          </Button>
        </VStack>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showWindowControls
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation
          onBack={() => navigate('/compute/instance-templates')}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Instance Templates', href: '/compute/instance-templates' },
                { label: template.name },
              ]}
            />
          }
        />
      }
    >
      <VStack gap={4}>
        <DetailHeader>
          <DetailHeader.Title>
            <span className="inline-flex items-center gap-2">
              {template.favorite ? (
                <IconStarFilled size={16} className="text-[var(--primitive-color-yellow400)]" />
              ) : (
                <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
              )}
              {template.name}
            </span>
          </DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} />}
              onClick={() => navigate(`/compute/instance-templates/${template.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconCopyCheck size={12} />}
              onClick={() => console.log('Duplicate template')}
            >
              Duplicate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="ID" value={template.id} copyable />
            <DetailHeader.InfoCard label="Visibility" value="Private" />
            <DetailHeader.InfoCard label="Created at" value={template.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
          </TabList>

          <TabPanel value="details" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* 1. Template information */}
              <SectionCard>
                <SectionCard.Header title="Template infomation" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Instance template name" value={template.name} />
                  <SectionCard.DataRow label="Description" value={template.description} />
                  <SectionCard.DataRow label="Visibility" value={template.visibility} />
                </SectionCard.Content>
              </SectionCard>

              {/* 2. Basic Information */}
              <SectionCard>
                <SectionCard.Header title="Basic Infomation" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="AZ (Availability Zone)"
                    value={template.availabilityZone}
                  />
                </SectionCard.Content>
              </SectionCard>

              {/* 3. Source */}
              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image" value={template.image} isLink />
                  <SectionCard.DataRow label="OS" value={template.os} />
                </SectionCard.Content>
              </SectionCard>

              {/* 4. Flavor */}
              <SectionCard>
                <SectionCard.Header title="Flavor" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Flavor" value={template.flavor} isLink />
                  <SectionCard.DataRow label="Spec" value={template.spec} />
                </SectionCard.Content>
              </SectionCard>

              {/* 5. Network */}
              <SectionCard>
                <SectionCard.Header title="Network" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Networks">
                    <VStack gap={1}>
                      {template.networks.length > 0 ? (
                        template.networks.map((net) => (
                          <span
                            key={net}
                            className="text-label-md text-[var(--color-action-primary)]"
                          >
                            {net}
                          </span>
                        ))
                      ) : (
                        <span className="text-body-md text-[var(--color-text-default)]">-</span>
                      )}
                    </VStack>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Security groups">
                    <VStack gap={1}>
                      {template.securityGroups.length > 0 ? (
                        template.securityGroups.map((sg) => (
                          <span
                            key={sg}
                            className="text-label-md text-[var(--color-action-primary)]"
                          >
                            {sg}
                          </span>
                        ))
                      ) : (
                        <span className="text-body-md text-[var(--color-text-default)]">-</span>
                      )}
                    </VStack>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Ports">
                    <VStack gap={1}>
                      {template.ports.length > 0 ? (
                        template.ports.map((port) => (
                          <span
                            key={port}
                            className="text-label-md text-[var(--color-action-primary)]"
                          >
                            {port}
                          </span>
                        ))
                      ) : (
                        <span className="text-body-md text-[var(--color-text-default)]">-</span>
                      )}
                    </VStack>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* 6. Advanced */}
              <SectionCard>
                <SectionCard.Header title="Advanced" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Tags">
                    {template.tags.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {template.tags.map((tag) => (
                          <Chip key={`${tag.key}-${tag.value}`} label={tag.key} value={tag.value} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-body-md text-[var(--color-text-default)]">-</span>
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="User Data" value={template.userData || '-'} />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          navigate('/compute/instance-templates');
        }}
        title="Delete template"
        description="Removing the selected template is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Template name"
        infoValue={template.name}
      />
    </PageShell>
  );
}

export default InstanceTemplateDetailViewPage;
