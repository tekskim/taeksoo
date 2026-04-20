import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
   Mock YAML Content (would be fetched from API)
   ---------------------------------------- */

const getMockYamlContent = (pdbName: string) => `apiVersion: v1
kind: PodDisruptionBudget
metadata:
  name: '${pdbName}'
  annotations:
    field.cattle.io/containerDefaultResourceLimit: '{}'
    #  key: string
  labels:
    {}
    #  key: string
spec:
#  finalizers:
#    - string
__clone: true`;

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditPodDisruptionBudgetYamlPage() {
  const navigate = useNavigate();
  const { pdbName } = useParams<{ pdbName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Load YAML content based on podDisruptionBudget ID
  useEffect(() => {
    if (pdbName) {
      // TODO: Fetch actual YAML from API
      setYamlContent(getMockYamlContent(pdbName));
    }
  }, [pdbName]);

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Edit ${pdbName || 'pod disruption budget'} (YAML)`);
  }, [updateActiveTabLabel, pdbName]);

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
    navigate(`/container/pdb/${pdbName}`);
  }, [navigate, pdbName]);

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual podDisruptionBudget update via API
    console.log('Saving podDisruptionBudget YAML:', yamlContent);
    navigate(`/container/pdb/${pdbName}`);
  }, [navigate, pdbName, yamlContent]);

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
                { label: 'Pod Disruption Budgets', href: '/container/pdb' },
                { label: 'Edit PDB' },
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
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">
            PodDisruptionBudget: {pdbName}
          </h1>
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

export default EditPodDisruptionBudgetYamlPage;
