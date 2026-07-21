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
   ---------------------------------------- */

const DEFAULT_YAML = `apiVersion: v1
kind: Service
metadata:
  name: ''
  annotations:
    {}
    #  key: string
  labels:
    {}
    #  key: string
  namespace: default
spec:
  selector:
    #  key: string
  ports:
    - name: ''
      protocol: TCP
#    - appProtocol: string
#      name: string
#      nodePort: int
#      port: int
#      protocol: string
#      targetPort: string
  sessionAffinity: None
  type: ClusterIP
#  allocateLoadBalancerNodePorts: boolean
#  clusterIP: string
#  clusterIPs:
#    - string
#  externalIPs:
#    - string
#  externalName: string
#  externalTrafficPolicy: string
#  healthCheckNodePort: int
#  internalTrafficPolicy: string
#  ipFamilies:
#    - string
#  ipFamilyPolicy: string
#  loadBalancerClass: string
#  loadBalancerIP: string
#  loadBalancerSourceRanges:
#    - string
#  publishNotReadyAddresses: boolean
#  sessionAffinityConfig:
#    clientIP:
#      timeoutSeconds: int
#  trafficDistribution: string
__clone: true`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateServiceYamlPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const isModified = yamlContent !== DEFAULT_YAML;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create service (YAML)');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Handle read from file
  const handleReadFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setYamlContent(content);
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/container/services');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    // TODO: Implement actual service creation via API
    console.log('Creating service with YAML:', yamlContent);
    navigate('/container/services');
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
                { label: 'Services', href: '/container/services' },
                { label: 'Create Service' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="h-full flex flex-col pt-4 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        {/* Header */}
        <VStack gap={1} className="flex-shrink-0">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create service</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Services allow you to define a logical set of Pods that can be accessed with a single IP
            address and port.
          </p>
        </VStack>

        {/* YAML Editor */}
        <YamlEditor value={yamlContent} onChange={setYamlContent} />

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between">
          {/* Left side - Read from File */}
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

          {/* Right side - Cancel & Create */}
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

export default CreateServiceYamlPage;
