import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  DetailHeader,
  PageShell,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconTrash, IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ResourceTypeAssociation {
  resourceType: string;
  prefix: string;
}

interface MetadataDefinitionDetail {
  id: string;
  name: string;
  displayName: string;
  namespace: string;
  description: string;
  isPublic: boolean;
  isProtected: boolean;
  createdAt: string;
  resourceTypes: ResourceTypeAssociation[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockMetadataMap: Record<string, MetadataDefinitionDetail> = Object.fromEntries(
  Array.from({ length: 115 }, (_, i) => {
    const id = `metadata-${String(i + 1).padStart(4, '0')}`;
    return [
      id,
      {
        id,
        name: `metadata${i > 0 ? i : ''}`,
        displayName: i === 0 ? 'Guest Memory Backing' : `Metadata Definition ${i + 1}`,
        namespace:
          i === 0
            ? 'OS::Compute::GuestMemoryBacking'
            : `OS::${['Compute', 'Glance', 'Cinder', 'Nova'][i % 4]}::${['Instance', 'Image', 'Volume', 'Flavor'][i % 4]}`,
        description:
          i === 0
            ? "This provides the preferred backing option for guest RAM. Guest's memory can be backed by hugepages to limit TLB lookups. See also: https://wiki.openstack.org/wiki/VirtDriverGuestCPUMemoryPlacement"
            : i % 3 === 0
              ? 'These properties allow modifying the shutdown behavior of the compute service.'
              : 'Custom metadata definition for resources',
        isPublic: i % 3 !== 1,
        isProtected: i % 4 === 0,
        createdAt: 'Dec 28 2025',
        resourceTypes:
          i === 0
            ? [
                { resourceType: 'OS::Cinder::Volume', prefix: 'hw_' },
                { resourceType: 'OS::Nova::Flavor', prefix: 'hw:' },
                { resourceType: 'OS::Glance::Image', prefix: 'hw_' },
              ]
            : i % 2 === 0
              ? [
                  { resourceType: 'OS::Glance::Image', prefix: 'img_' },
                  { resourceType: 'OS::Nova::Instance', prefix: 'instance_' },
                ]
              : [{ resourceType: 'OS::Glance::Image', prefix: 'img_' }],
      },
    ];
  })
);

const defaultMetadataDetail: MetadataDefinitionDetail = {
  id: 'unknown',
  name: 'Unknown',
  displayName: 'Unknown Metadata',
  namespace: '-',
  description: '-',
  isPublic: false,
  isProtected: false,
  createdAt: '-',
  resourceTypes: [],
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminMetadataDefinitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get metadata data based on URL ID
  const metadata = id ? mockMetadataMap[id] || defaultMetadataDetail : defaultMetadataDetail;

  // Update tab label to metadata name
  useEffect(() => {
    if (metadata.displayName) {
      updateActiveTabLabel(metadata.displayName);
    }
  }, [metadata.displayName, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Compute Admin', href: '/compute-admin' },
                { label: 'Metadata Definitions', href: '/compute-admin/metadata-definition' },
                { label: metadata.displayName },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={8} className="min-w-[1176px]">
        {/* Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{metadata.displayName}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Namespace" value={metadata.namespace} />
            <DetailHeader.InfoCard label="Description" value={metadata.description} />
            <DetailHeader.InfoCard label="Public" value={metadata.isPublic ? 'On' : 'Off'} />
            <DetailHeader.InfoCard label="Protected" value={metadata.isProtected ? 'Yes' : 'No'} />
            <DetailHeader.InfoCard label="Created at" value={metadata.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="contents">Contents</Tab>
            </TabList>

            {/* Details Tab */}
            <TabPanel value="details" className="pt-6">
              <VStack gap={6}>
                {/* Basic Information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Display name" value={metadata.displayName} />
                    <SectionCard.DataRow label="Description" value={metadata.description} />
                    <SectionCard.DataRow label="Public" value={metadata.isPublic ? 'On' : 'Off'} />
                    <SectionCard.DataRow
                      label="Protected"
                      value={metadata.isProtected ? 'Yes' : 'No'}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Associated Resource Types */}
                <SectionCard>
                  <SectionCard.Header title="Associated resource types" />
                  <SectionCard.Content>
                    {metadata.resourceTypes.length > 0 ? (
                      metadata.resourceTypes.map((rt, index) => (
                        <SectionCard.DataRow
                          key={index}
                          label="Resource type / prefix"
                          value={`${rt.resourceType} / ${rt.prefix}`}
                        />
                      ))
                    ) : (
                      <SectionCard.DataRow
                        label="Resource type / prefix"
                        value="No resource types associated"
                      />
                    )}
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Contents Tab */}
            <TabPanel value="contents" className="pt-6">
              <div className="bg-[var(--primitive-color-blue-gray800)] rounded-lg p-6 font-mono text-[13px] leading-6 overflow-x-auto">
                <pre className="text-[var(--primitive-color-blue-gray200)]">
                  <span className="text-[#94a3b8]">{'{'}</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "namespace"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"${metadata.namespace}"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "display_name"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"${metadata.displayName}"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "description"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"${metadata.description}"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "visibility"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"${metadata.isPublic ? 'public' : 'private'}"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "protected"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#7dd3fc]">{metadata.isProtected ? 'true' : 'false'}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "owner"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"admin"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "created_at"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"2025-05-13T02:48:18Z"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "resource_type_associations"`}</span>
                  <span className="text-[#94a3b8]">: [</span>
                  {metadata.resourceTypes.map((rt, index) => (
                    <span key={index}>
                      {'\n'}
                      <span className="text-[#94a3b8]">{`    {`}</span>
                      {'\n'}
                      <span className="text-[#7dd3fc]">{`      "name"`}</span>
                      <span className="text-[#94a3b8]">: </span>
                      <span className="text-[#fde68a]">{`"${rt.resourceType}"`}</span>
                      <span className="text-[#94a3b8]">,</span>
                      {'\n'}
                      <span className="text-[#7dd3fc]">{`      "prefix"`}</span>
                      <span className="text-[#94a3b8]">: </span>
                      <span className="text-[#fde68a]">{`"${rt.prefix}"`}</span>
                      <span className="text-[#94a3b8]">,</span>
                      {'\n'}
                      <span className="text-[#7dd3fc]">{`      "properties_target"`}</span>
                      <span className="text-[#94a3b8]">: </span>
                      <span className="text-[#fde68a]">{`"image"`}</span>
                      <span className="text-[#94a3b8]">,</span>
                      {'\n'}
                      <span className="text-[#7dd3fc]">{`      "created_at"`}</span>
                      <span className="text-[#94a3b8]">: </span>
                      <span className="text-[#fde68a]">{`"2025-05-13T02:48:18Z"`}</span>
                      {'\n'}
                      <span className="text-[#94a3b8]">
                        {`    }`}
                        {index < metadata.resourceTypes.length - 1 ? ',' : ''}
                      </span>
                    </span>
                  ))}
                  {'\n'}
                  <span className="text-[#94a3b8]">{`  ],`}</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "properties"`}</span>
                  <span className="text-[#94a3b8]">{`: {`}</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`    "mem_page_size"`}</span>
                  <span className="text-[#94a3b8]">{`: {`}</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`      "type"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"string"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`      "title"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"Size of memory page"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`      "description"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"Page size to be used for Guest memory backing. Value can be specified as <number><unit> (i.e.: 2MB, 1GB) or 'any', 'small', 'large'. If this property is set in Image metadata then only 'any' and 'large' values are accepted in Flavor metadata by Nova API."`}</span>
                  {'\n'}
                  <span className="text-[#94a3b8]">{`    }`}</span>
                  {'\n'}
                  <span className="text-[#94a3b8]">{`  },`}</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "self"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"/v2/metadefs/namespaces/${metadata.namespace}"`}</span>
                  <span className="text-[#94a3b8]">,</span>
                  {'\n'}
                  <span className="text-[#7dd3fc]">{`  "schema"`}</span>
                  <span className="text-[#94a3b8]">: </span>
                  <span className="text-[#fde68a]">{`"/v2/schemas/metadefs/namespace"`}</span>
                  {'\n'}
                  <span className="text-[#94a3b8]">{'}'}</span>
                </pre>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
