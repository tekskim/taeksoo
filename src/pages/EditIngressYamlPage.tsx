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
   Mock Ingress YAML Data
   ---------------------------------------- */

const getMockIngressYaml = (ingressId: string) => `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/issuer: thakicloud
    cert-manager.io/issuer-kind: Issuer
    field.cattle.io/publicEndpoints: >-
      [{"addresses":["172.16.0.237"],"port":443,"protocol":"HTTPS","serviceName":"cattle-system:thakicloud","ingressName":"cattle-system:thakicloud","hostname":"thakicloud-tech.thakicloud.net","path":"/","allNodes":false}]
    meta.helm.sh/release-name: thakicloud
    meta.helm.sh/release-namespace: cattle-system
    nginx.ingress.kubernetes.io/proxy-connect-timeout: '30'
    nginx.ingress.kubernetes.io/proxy-read-timeout: '1800'
    nginx.ingress.kubernetes.io/proxy-send-timeout: '1800'
  creationTimestamp: '2025-10-14T07:13:48Z'
  generation: 1
  labels:
    app: thakicloud
    app.kubernetes.io/managed-by: Helm
    chart: thakicloud-2.12.2
    heritage: Helm
    release: thakicloud
  managedFields:
    - apiVersion: networking.k8s.io/v1
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            .: {}
            f:cert-manager.io/issuer: {}
            f:cert-manager.io/issuer-kind: {}
            f:meta.helm.sh/release-name: {}
            f:meta.helm.sh/release-namespace: {}
            f:nginx.ingress.kubernetes.io/proxy-connect-timeout: {}
            f:nginx.ingress.kubernetes.io/proxy-read-timeout: {}
            f:nginx.ingress.kubernetes.io/proxy-send-timeout: {}
          f:labels:
            .: {}
            f:app: {}
            f:app.kubernetes.io/managed-by: {}
            f:chart: {}
            f:heritage: {}
            f:release: {}
        f:spec:
          f:rules: {}
          f:tls: {}
      manager: helm
      operation: Update
      time: '2025-10-14T07:13:48Z'
    - apiVersion: networking.k8s.io/v1
      fieldsType: FieldsV1
      fieldsV1:
        f:status:
          f:loadBalancer:
            f:ingress: {}
      manager: nginx-ingress-controller
      operation: Update
      subresource: status
      time: '2025-10-14T07:14:02Z'
  name: thakicloud
  namespace: cattle-system
  resourceVersion: '4123'
  uid: c1234567-89ab-cdef-0123-456789abcdef
spec:
  ingressClassName: nginx
  rules:
    - host: thakicloud-tech.thakicloud.net
      http:
        paths:
          - backend:
              service:
                name: thakicloud
                port:
                  number: 443
            path: /
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - thakicloud-tech.thakicloud.net
      secretName: thakicloud-tls
status:
  loadBalancer:
    ingress:
      - ip: 172.16.0.237`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditIngressYamlPage() {
  const navigate = useNavigate();
  const { ingressId } = useParams<{ ingressId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const [ingressName, setIngressName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load ingress data
  useEffect(() => {
    if (ingressId) {
      // TODO: Fetch actual ingress data from API
      setYamlContent(getMockIngressYaml(ingressId));
      setIngressName('thakicloud');
    }
  }, [ingressId]);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    if (ingressName) {
      updateActiveTabLabel(`Edit ingress: ${ingressName}`);
    }
  }, [ingressName, updateActiveTabLabel]);

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

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual ingress update via API
    console.log('Saving ingress with YAML:', yamlContent);
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
                { label: 'Edit Ingress' },
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
        <VStack gap={1} className="flex-shrink-0">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">
            ingress: {ingressName}
          </h1>
          <InlineMessage variant="warning">
            This ingress is managed by a Helm app; changes made here will likely be overwritten the
            next time Helm runs.
          </InlineMessage>
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

export default EditIngressYamlPage;
