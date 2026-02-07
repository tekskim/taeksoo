import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Breadcrumb, HStack, VStack, TabBar, TopBar, PageShell } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

/* ----------------------------------------
   Mock YAML Content (would be fetched from API)
   ---------------------------------------- */

const getMockYamlContent = (statefulSetName: string) => `apiVersion: v1
kind: StatefulSet
metadata:
  name: '${statefulSetName}'
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
   YAML Editor with Line Numbers
   ---------------------------------------- */

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
}

function YamlEditor({ value, onChange, onCopy }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = lines.length;

  // Sync scroll between line numbers and textarea
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="flex-1 flex min-h-0 border border-[var(--color-border-default)] rounded-[4px] bg-[var(--color-base-white)] overflow-hidden relative">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="font-mono text-body-md leading-[18px] text-[var(--color-text-subtle)]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full py-2 px-2.5 pr-12 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto yaml-editor-scroll"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Copy Button - Absolute positioned */}
      <div className="absolute top-2 right-4">
        <button
          onClick={onCopy}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[6px] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Copy to clipboard"
        >
          <IconCopy size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function EditStatefulSetYamlPage() {
  const navigate = useNavigate();
  const { statefulSetName } = useParams<{ statefulSetName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Load YAML content based on statefulset ID
  useEffect(() => {
    if (statefulSetName) {
      // TODO: Fetch actual YAML from API
      setYamlContent(getMockYamlContent(statefulSetName));
    }
  }, [statefulSetName]);

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel(`Edit ${statefulSetName || 'StatefulSet'} (YAML)`);
  }, [updateActiveTabLabel, statefulSetName]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [yamlContent]);

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
    navigate(`/container/statefulsets/${statefulSetName}`);
  }, [navigate, statefulSetName]);

  // Handle save
  const handleSave = useCallback(() => {
    // TODO: Implement actual statefulset update via API
    console.log('Saving statefulset YAML:', yamlContent);
    navigate(`/container/statefulsets/${statefulSetName}`);
  }, [navigate, statefulSetName, yamlContent]);

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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'StatefulSets', href: '/container/statefulsets' },
                {
                  label: statefulSetName || 'StatefulSet',
                  href: `/container/statefulsets/${statefulSetName}`,
                },
                { label: 'Edit YAML' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-6 flex flex-col min-h-0"
    >
      <VStack gap={6} className="flex-1 min-h-0">
        {/* Header */}
        <VStack gap={2} className="flex-shrink-0">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">
            StatefulSet: {statefulSetName}
          </h1>
        </VStack>

        {/* YAML Editor */}
        <YamlEditor value={yamlContent} onChange={setYamlContent} onCopy={handleCopy} />

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

export default EditStatefulSetYamlPage;
