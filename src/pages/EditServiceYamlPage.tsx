import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  HStack,
  InlineMessage,
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
   Mock Service YAML Data
   ---------------------------------------- */

const getMockServiceYaml = (serviceId: string) => `apiVersion: v1
kind: Service
metadata:
  annotations:
    meta.helm.sh/release-name: thakicloud-provisioning-capi
    meta.helm.sh/release-namespace: cattle-provisioning-capi-system
    need-a-cert.cattle.io/secret-name: capi-webhook-service-cert
  creationTimestamp: '2025-10-14T07:16:59Z'
  labels:
    app.kubernetes.io/managed-by: Helm
    cluster.x-k8s.io/provider: cluster-api
  managedFields:
    - apiVersion: v1
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            .: {}
            f:meta.helm.sh/release-name: {}
            f:meta.helm.sh/release-namespace: {}
            f:need-a-cert.cattle.io/secret-name: {}
          f:labels:
            .: {}
            f:app.kubernetes.io/managed-by: {}
            f:cluster.x-k8s.io/provider: {}
        f:spec:
          f:internalTrafficPolicy: {}
          f:ports:
            .: {}
            k:{"port":443,"protocol":"TCP"}:
              .: {}
              f:port: {}
              f:protocol: {}
              f:targetPort: {}
          f:selector: {}
          f:sessionAffinity: {}
          f:type: {}
      manager: helm
      operation: Update
      time: '2025-10-14T07:16:59Z'
  name: capi-webhook-service
  namespace: cattle-provisioning-capi-system
  resourceVersion: '3705'
  uid: b0efbe1f-8af8-4c43-8985-dbeff5014190
spec:
  clusterIP: 10.43.136.100
  clusterIPs:
    - 10.43.136.100
  internalTrafficPolicy: Cluster
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  ports:
    - port: 443
      protocol: TCP
      targetPort: webhook-server
  selector:
    cluster.x-k8s.io/provider: cluster-api
    control-plane: capi-controller-manager
  sessionAffinity: None
  type: ClusterIP`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditServiceYamlPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const [serviceName, setServiceName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load service data
  useEffect(() => {
    if (serviceId) {
      // TODO: Fetch actual service data from API
      setYamlContent(getMockServiceYaml(serviceId));
      setServiceName('capi-webhook-service');
    }
  }, [serviceId]);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    if (serviceName) {
      updateActiveTabLabel(`Edit service: ${serviceName}`);
    }
  }, [serviceName, updateActiveTabLabel]);

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

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual service update via API
    console.log('Saving service with YAML:', yamlContent);
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
                { label: 'Edit Service' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="h-full flex flex-col pt-3 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        {/* Header */}
        <VStack gap={2} className="flex-shrink-0">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">
            service: {serviceName}
          </h1>
          <InlineMessage variant="warning">
            This service is managed by a Helm app; changes made here will likely be overwritten the
            next time Helm runs.
          </InlineMessage>
        </VStack>

        {/* YAML Editor */}
        <YamlEditor value={yamlContent} onChange={setYamlContent} />

        {/* Footer */}
        <div className="flex-shrink-0 h-[61px] flex items-center justify-between border-t border-[var(--color-border-strong)]">
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

          {/* Right side - Cancel & Save */}
          <HStack gap={3}>
            <Button variant="secondary" size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              Save
            </Button>
          </HStack>
        </div>
      </VStack>
    </PageShell>
  );
}

export default EditServiceYamlPage;
