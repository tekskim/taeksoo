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

const DEFAULT_YAML = `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ''
  annotations:
    {}
    #  key: string
  labels:
    {}
    #  key: string
  namespace: local
spec:
  ingressClassName: traefik
  rules:
    - vKey: 2406568955
#    - host: string
#      http:
#        paths:
#          - backend:
#              resource:
#                apiGroup: string
#                kind: string
#                name: string
#              service:
#                name: string
#                port:
#                  name: string
#                  number: int
#            path: string
#            pathType: string
  tls:
    - hosts:
        - ''
        - bar
#    - hosts:
#        - string
#      secretName: string
  backend:
    {}
#  defaultBackend:
#    resource:
#      apiGroup: string
#      kind: string
#      name: string
#    service:
#      name: string
#      port:
#        name: string
#        number: int
__clone: true
cacheObject:
  useNestedBackendField: true
  showPathType: true`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateIngressYamlPage() {
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
    updateActiveTabLabel('Create ingress (YAML)');
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
    navigate('/container/ingresses');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    // TODO: Implement actual ingress creation via API
    console.log('Creating ingress with YAML:', yamlContent);
    navigate('/container/ingresses');
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
                { label: 'Ingresses', href: '/container/ingresses' },
                { label: 'Create Ingress' },
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
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create ingress</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Ingresses route incoming traffic from the internet to Services within the cluster based
            on the hostname and path specified in the request. You can expose multiple Services on
            the same external IP address and port.
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

export default CreateIngressYamlPage;
