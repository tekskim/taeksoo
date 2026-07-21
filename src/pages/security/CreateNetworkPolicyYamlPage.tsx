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
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';

const DEFAULT_YAML = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ''
  namespace: default
  labels:
    {}
    #  key: string
  annotations:
    {}
    #  key: string
spec:
  podSelector:
    matchLabels:
      {}
      #  key: string
#  policyTypes:
#    - Ingress
#    - Egress
#  ingress:
#    - from:
#        - ipBlock:
#            cidr: 0.0.0.0/0
#            except:
#              - 10.0.0.0/8
#        - namespaceSelector:
#            matchLabels:
#              project: myproject
#        - podSelector:
#            matchLabels:
#              role: frontend
#      ports:
#        - protocol: TCP
#          port: 80
#  egress:
#    - to:
#        - ipBlock:
#            cidr: 0.0.0.0/0
#      ports:
#        - protocol: TCP
#          port: 443`;

export function SecurityCreateNetworkPolicyYamlPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const isModified = yamlContent !== DEFAULT_YAML;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateActiveTabLabel('Create Network Policy (YAML)');
  }, [updateActiveTabLabel]);

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
    e.target.value = '';
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/security/network-policies');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    navigate('/security/network-policies');
  }, [navigate]);

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Security', href: '/security' },
                { label: 'Network Policies', href: '/security/network-policies' },
                { label: 'Create Network Policy' },
              ]}
            />
          }
        />
      }
      contentClassName="h-full flex flex-col pt-4 px-8 pb-6 min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        <VStack gap={1} className="flex-shrink-0">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">
            Create Network Policy
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Network Policy defines how groups of pods are allowed to communicate with each other and
            with external endpoints, providing fine-grained control over network traffic within the
            cluster.
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

export default SecurityCreateNetworkPolicyYamlPage;
