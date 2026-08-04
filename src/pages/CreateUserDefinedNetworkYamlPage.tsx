import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  HStack,
  PageShell,
  TabBar,
  TopBar,
  VStack,
  YamlEditor,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Default YAML Template

   클러스터 단위로 만들려면 kind를 ClusterUserDefinedNetwork로 바꾸고
   namespace를 지운다. joinSubnets는 Layer2에서만 쓴다.
   ---------------------------------------- */

const DEFAULT_YAML = `apiVersion: k8s.ovn.org/v1
kind: UserDefinedNetwork
metadata:
  name: ''
  namespace: default
spec:
  topology: Layer3
  layer3:
    role: Primary
    mtu: 1400
    subnets:
      - ''
    #  For Layer2, rename this key to layer2 and add joinSubnets
    #  joinSubnets:
    #    - 100.65.0.0/16
    ipam:
      lifecycle: Persistent
`;

export function CreateUserDefinedNetworkYamlPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const isModified = yamlContent !== DEFAULT_YAML;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create network (YAML)');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const handleReadFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setYamlContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/container/user-defined-networks');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    console.log('Creating UserDefinedNetwork with YAML:', yamlContent);
    navigate('/container/user-defined-networks');
  }, [navigate, yamlContent]);

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
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
                { label: 'User Defined Networks', href: '/container/user-defined-networks' },
                { label: 'Create Network' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="h-full flex flex-col pt-4 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        <VStack gap={1} className="flex-shrink-0">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">
            Create UserDefinedNetwork
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            A user defined network gives a namespace its own address range. A primary network must
            be created before the first pod in that namespace.
          </p>
        </VStack>

        <YamlEditor value={yamlContent} onChange={setYamlContent} />

        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="secondary" size="md" onClick={handleReadFromFile}>
              Read from File
            </Button>
          </div>

          <HStack gap={3}>
            <Button variant="secondary" size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCreate}>
              {isModified ? 'Save' : 'Create'}
            </Button>
          </HStack>
        </div>
      </VStack>
    </PageShell>
  );
}

export default CreateUserDefinedNetworkYamlPage;
