/* ----------------------------------------
   Import YAML (CorePlan D-34)

   Spec: 2-screens/2-import-yaml-v1.0.0.md
   Rules: [CCONT-04] dedicated clusters expose no create entry point
          [CCONT-05] General / unassigned clusters only
          [CCONT-06] `---` separated definitions in one run, reported per resource

   Paste YAML or drop a file. Several definitions at once, so you do not have
   to pick a resource kind first the way the per-kind list screens make you.
   ---------------------------------------- */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  Button,
  FormField,
  HStack,
  InlineMessage,
  PageShell,
  Select,
  TabBar,
  TopBar,
  VStack,
  YamlEditor,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { getActiveCpCluster } from '@/pages/containerActiveCluster';
import { IconCheck, IconX, IconUpload } from '@tabler/icons-react';

const PLACEHOLDER = `# Paste one or more resource definitions.
# Separate each definition with ---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: example
spec:
  replicas: 1
`;

interface ImportResult {
  kind: string;
  name: string;
  namespace: string;
  ok: boolean;
  reason?: string;
}

/** Very small reader — enough for a mockup. Real parsing happens server-side. */
function parseDefinitions(yaml: string, fallbackNamespace: string): ImportResult[] {
  return yaml
    .split(/^---\s*$/m)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0 && !chunk.split('\n').every((l) => l.startsWith('#')))
    .map((chunk) => {
      const kind = /^kind:\s*(\S+)/m.exec(chunk)?.[1] ?? '';
      const name = /^\s{2}name:\s*(\S+)/m.exec(chunk)?.[1] ?? '';
      const namespace = /^\s{2}namespace:\s*(\S+)/m.exec(chunk)?.[1] ?? fallbackNamespace;

      if (!kind)
        return {
          kind: '(unknown)',
          name: name || '-',
          namespace,
          ok: false,
          reason: 'Missing required field: kind.',
        };
      if (!name)
        return { kind, name: '-', namespace, ok: false, reason: `${kind} requires metadata.name.` };
      return { kind, name, namespace, ok: true };
    });
}

export function ImportYamlPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [yamlContent, setYamlContent] = useState(PLACEHOLDER);
  const [namespace, setNamespace] = useState('default');
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tabs, activeTabId, closeTab, selectTab, moveTab, addNewTab } = useTabs();

  // [CCONT-04] [CCONT-05] — dedicated clusters have no create entry point at all.
  const activeCluster = getActiveCpCluster();
  const isDedicated = activeCluster.dedicated;

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => setYamlContent(String(reader.result ?? ''));
    reader.readAsText(file);
  }, []);

  const handleCreate = () => setResults(parseDefinitions(yamlContent, namespace));

  const succeeded = results?.filter((r) => r.ok) ?? [];
  const failed = results?.filter((r) => !r.ok) ?? [];

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Container', href: '/container/dashboard' },
                { label: 'Import YAML' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={4} className="max-w-[1100px]">
        <VStack gap={1}>
          <h1 className="text-heading-xl font-semibold text-[var(--color-text-default)]">
            Import YAML
          </h1>
          <span className="text-body-md text-[var(--color-text-muted)]">
            Drag and drop YAML or JSON files into the editor, or paste definitions and separate each
            one with <code className="font-mono">---</code>.
          </span>
        </VStack>

        {isDedicated ? (
          /* Belt and braces: the entry point is hidden for dedicated clusters,
             but a pasted URL should not create resources either ([CCONT-04]). */
          <InlineMessage variant="warning">
            <b>{activeCluster.name}</b> is a dedicated cluster. Resource creation is disabled — view
            and operate only. Editing is available through Edit YAML on each resource.
          </InlineMessage>
        ) : (
          <>
            <FormField label="Namespace" required>
              <Select
                value={namespace}
                onChange={setNamespace}
                options={[
                  { value: 'default', label: 'default' },
                  { value: 'kube-system', label: 'kube-system' },
                  { value: 'tkai-metis', label: 'tkai-metis' },
                ]}
              />
            </FormField>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) readFile(file);
              }}
              className={
                isDragging
                  ? 'rounded-md ring-2 ring-[var(--color-action-primary)] ring-offset-2'
                  : 'rounded-md'
              }
            >
              <YamlEditor
                value={yamlContent}
                onChange={(next: string) => {
                  setYamlContent(next);
                  setResults(null);
                }}
              />
            </div>

            <HStack gap={2} className="items-center">
              <Button variant="primary" onClick={handleCreate} disabled={!yamlContent.trim()}>
                Create
              </Button>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                variant="tertiary"
                leftIcon={<IconUpload size={16} stroke={1.5} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".yaml,.yml,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readFile(file);
                }}
              />
            </HStack>

            {/* [CCONT-06] — report per resource, not one lump verdict. */}
            {results && (
              <VStack gap={3} className="pt-2">
                {failed.length === 0 ? (
                  <InlineMessage variant="success">
                    {succeeded.length} resource{succeeded.length === 1 ? '' : 's'} created.
                  </InlineMessage>
                ) : succeeded.length === 0 ? (
                  <InlineMessage variant="error">
                    Nothing was created. Fix the definitions below and try again.
                  </InlineMessage>
                ) : (
                  <InlineMessage variant="warning">
                    {succeeded.length} created, {failed.length} failed. The editor keeps your input
                    so you can fix what did not go through.
                  </InlineMessage>
                )}

                <VStack
                  gap={0}
                  className="border border-[var(--color-border-subtle)] rounded-md overflow-hidden"
                >
                  {results.map((result, index) => (
                    <HStack
                      key={`${result.kind}-${result.name}-${index}`}
                      gap={3}
                      className="items-center px-4 py-2.5 border-b last:border-b-0 border-[var(--color-border-subtle)] bg-[var(--color-surface-default)]"
                    >
                      {result.ok ? (
                        <IconCheck
                          size={16}
                          stroke={2}
                          className="text-[var(--color-status-success)] shrink-0"
                        />
                      ) : (
                        <IconX
                          size={16}
                          stroke={2}
                          className="text-[var(--color-status-error)] shrink-0"
                        />
                      )}
                      <Badge theme="gray" type="subtle" size="sm">
                        {result.kind}
                      </Badge>
                      <span className="text-body-sm font-medium text-[var(--color-text-default)] truncate min-w-0">
                        {result.name}
                      </span>
                      <span className="text-body-sm text-[var(--color-text-muted)] shrink-0">
                        {result.namespace}
                      </span>
                      {result.reason && (
                        <span className="text-body-sm text-[var(--color-status-error)] truncate min-w-0 ml-auto">
                          {result.reason}
                        </span>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            )}
          </>
        )}
      </VStack>
    </PageShell>
  );
}

export default ImportYamlPage;
