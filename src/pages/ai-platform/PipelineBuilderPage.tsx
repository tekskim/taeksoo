import { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  HStack,
  PageShell,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Input,
  Select,
  Disclosure,
  SearchInput,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import {
  IconChevronDown,
  IconChevronRight,
  IconPlayerPlay,
  IconDatabase,
  IconGitBranch,
  IconFolder,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconRefresh,
  IconLayoutGrid,
  IconPlus,
  IconX,
  IconLayoutSidebar,
  IconTrash,
} from '@tabler/icons-react';

/* ——— types ——— */

interface BlockCategory {
  id: string;
  label: string;
  icon: 'storage' | 'play';
  color: 'blue' | 'yellow';
  items: BlockItem[];
}

interface BlockItem {
  id: string;
  label: string;
  description: string;
  icon: 'branch' | 'storage' | 'play';
}

interface PipelineTab {
  id: string;
  label: string;
}

interface PropertyField {
  id: string;
  label: string;
  description: string;
  type: 'input' | 'select';
  placeholder?: string;
  value?: string;
  options?: { value: string; label: string }[];
}

interface PropertySection {
  id: string;
  title: string;
  fields: PropertyField[];
}

interface SelectedNode {
  id: string;
  title: string;
  subtitle: string;
  sections: PropertySection[];
}

/* ——— mock data ——— */

const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: 'data',
    label: 'Data',
    icon: 'storage',
    color: 'blue',
    items: [
      { id: 'load-csv', label: 'Load CSV', description: 'Load data from CSV file', icon: 'branch' },
      {
        id: 'load-dataset',
        label: 'Load Dataset',
        description: 'Load datasets from storage',
        icon: 'storage',
      },
    ],
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: 'play',
    color: 'yellow',
    items: [
      {
        id: 'transform',
        label: 'Transform',
        description: 'Apply data transformations',
        icon: 'play',
      },
      { id: 'filter', label: 'Filter', description: 'Filter rows by condition', icon: 'play' },
    ],
  },
];

const MOCK_SELECTED_NODE: SelectedNode = {
  id: 'load-dataset-1',
  title: 'LOAD-DATASET-1',
  subtitle: 'DATASET',
  sections: [
    {
      id: 'source',
      title: 'Expandable Section',
      fields: [
        {
          id: 'source-path',
          label: 'Lable',
          description: 'Description',
          type: 'input',
          placeholder: 'Input placeholder',
        },
        {
          id: 'source-format',
          label: 'Lable',
          description: 'Description',
          type: 'select',
          value: '1units',
          options: [
            { value: '1units', label: '1units' },
            { value: '2units', label: '2units' },
            { value: '4units', label: '4units' },
          ],
        },
      ],
    },
    {
      id: 'options',
      title: 'Expandable Section',
      fields: [
        {
          id: 'opt-path',
          label: 'Lable',
          description: 'Description',
          type: 'input',
          placeholder: 'Input placeholder',
        },
        {
          id: 'opt-format',
          label: 'Lable',
          description: 'Description',
          type: 'select',
          value: '1units',
          options: [
            { value: '1units', label: '1units' },
            { value: '2units', label: '2units' },
            { value: '4units', label: '4units' },
          ],
        },
      ],
    },
  ],
};

const INITIAL_TABS: PipelineTab[] = [
  { id: 'tab-1', label: 'Lable' },
  { id: 'tab-2', label: 'Lable' },
];

/* ——— icon helpers ——— */

function BlockIcon({ type, size = 16 }: { type: 'storage' | 'play' | 'branch'; size?: number }) {
  switch (type) {
    case 'storage':
      return <IconDatabase size={size} stroke={1.5} className="text-[var(--color-text-muted)]" />;
    case 'play':
      return <IconPlayerPlay size={size} stroke={1.5} className="text-[var(--color-text-muted)]" />;
    case 'branch':
      return <IconGitBranch size={size} stroke={1.5} className="text-[var(--color-text-muted)]" />;
  }
}

/* ——— Block Library Panel ——— */

function BlockLibraryPanel({
  categories,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
}: {
  categories: BlockCategory[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onToggleSidebar: () => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.id, true]))
  );

  const toggleCategory = (id: string) =>
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  return (
    <div className="flex flex-col gap-3 bg-white border-t border-b border-l border-[var(--color-border-default)] rounded-tl-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] pt-3 pb-4 px-4 w-[312px] shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-heading-h5 text-[var(--color-text-default)]">Block library</span>
          <button
            className="flex items-center justify-center w-6 h-6 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <IconLayoutSidebar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
        <span className="text-body-md text-[var(--color-text-subtle)]">Click or drag to add</span>
      </div>

      <SearchInput
        placeholder="Find blocks"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="sm"
        className="w-full"
      />

      <div className="flex flex-col gap-3">
        {filteredCategories.map((cat) => {
          const isExpanded = expandedCategories[cat.id] ?? true;
          const headerBg = cat.color === 'blue' ? 'bg-[#eef4fe]' : 'bg-[#fefbe9]';

          return (
            <div key={cat.id} className="flex flex-col">
              <button
                className={`flex items-center justify-between w-full px-2 py-2.5 rounded-t-[var(--radius-md)] border border-[var(--color-border-default)] ${headerBg} ${!isExpanded ? 'rounded-b-[var(--radius-md)]' : ''}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <HStack gap={1} align="center">
                  {isExpanded ? (
                    <IconChevronDown
                      size={12}
                      stroke={2}
                      className="text-[var(--color-text-default)]"
                    />
                  ) : (
                    <IconChevronRight
                      size={12}
                      stroke={2}
                      className="text-[var(--color-text-default)]"
                    />
                  )}
                  <BlockIcon type={cat.icon} size={16} />
                  <span className="text-body-md text-[var(--color-text-default)]">{cat.label}</span>
                </HStack>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  {cat.items.length}
                </span>
              </button>

              {isExpanded &&
                cat.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-0.5 px-7 py-2 border-l border-r border-b border-[var(--color-border-default)] cursor-pointer hover:bg-[var(--color-surface-hover)] ${
                      idx === cat.items.length - 1 ? 'rounded-b-[var(--radius-md)]' : ''
                    }`}
                  >
                    <HStack gap={1} align="center">
                      <BlockIcon type={item.icon} size={16} />
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {item.label}
                      </span>
                    </HStack>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      {item.description}
                    </span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Editor Toolbar ——— */

function EditorToolbar({ onRun }: { onRun: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-1 border-b border-[var(--color-border-default)] bg-white h-9 shrink-0">
      <HStack gap={3} align="center">
        <button
          className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded"
          aria-label="Open folder"
        >
          <IconFolder size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        <button className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded" aria-label="Save">
          <IconDeviceFloppy size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        <button
          className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded"
          aria-label="Download"
        >
          <IconDownload size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        <div className="w-px h-3 bg-[var(--color-border-default)]" />
        <button
          className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded"
          aria-label="New file"
        >
          <IconFile size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        <button className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded" aria-label="Reset">
          <IconRefresh size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        <button
          className="p-0.5 hover:bg-[var(--color-surface-hover)] rounded"
          aria-label="Grid view"
        >
          <IconLayoutGrid size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      </HStack>

      <HStack gap={3} align="center">
        <span className="text-label-md text-[var(--color-text-default)]">0B · 0C</span>
        <div className="w-px h-3 bg-[var(--color-border-default)]" />
        <Button variant="primary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
          Run
        </Button>
      </HStack>
    </div>
  );
}

/* ——— Editor Tab Bar ——— */

function EditorTabBar({
  editorTabs,
  activeEditorTab,
  onTabChange,
  onTabClose,
  onTabAdd,
  onToggleProperties,
}: {
  editorTabs: PipelineTab[];
  activeEditorTab: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabAdd: () => void;
  onToggleProperties: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] shrink-0">
      <div className="flex items-center">
        <button
          className="flex items-center justify-center w-8 h-8 hover:bg-[var(--color-surface-hover)]"
          aria-label="Toggle block library"
        >
          <IconLayoutSidebar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
        {editorTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-3 min-w-[160px] max-w-[160px] pl-3 pr-2 py-2 cursor-pointer border-r border-[var(--color-border-default)] ${
              activeEditorTab === tab.id
                ? 'bg-white'
                : 'bg-transparent hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="flex-1 min-w-0 truncate text-label-md text-[var(--color-text-default)]">
              {tab.label}
            </span>
            <button
              className="flex items-center justify-center w-4 h-4 rounded hover:bg-[var(--color-surface-muted)]"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              aria-label={`Close ${tab.label}`}
            >
              <IconX size={10} stroke={2} className="text-[var(--color-text-subtle)]" />
            </button>
          </div>
        ))}
        <button
          className="flex items-center justify-center w-8 h-8 hover:bg-[var(--color-surface-hover)]"
          onClick={onTabAdd}
          aria-label="New tab"
        >
          <IconPlus size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </button>
      </div>
      <button
        className="flex items-center justify-center w-8 h-8 hover:bg-[var(--color-surface-hover)]"
        onClick={onToggleProperties}
        aria-label="Toggle properties panel"
      >
        <IconLayoutSidebar
          size={16}
          stroke={1.5}
          className="text-[var(--color-text-muted)] rotate-180"
        />
      </button>
    </div>
  );
}

/* ——— Editor Canvas ——— */

function EditorCanvas() {
  return <div className="flex-1 bg-[var(--color-surface-subtle)] min-h-0" />;
}

/* ——— Properties Panel ——— */

function PropertiesPanel({ node, onDelete }: { node: SelectedNode; onDelete: () => void }) {
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(node.sections.map((s) => [s.id, true]))
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const toggleSection = (id: string) =>
    setSectionExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const getFieldValue = (field: PropertyField) => fieldValues[field.id] ?? field.value ?? '';

  const setFieldValue = (fieldId: string, value: string) =>
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));

  return (
    <div className="flex flex-col gap-3 bg-white border-t border-b border-r border-[var(--color-border-default)] rounded-tr-[var(--radius-lg)] rounded-br-[var(--radius-lg)] pt-3 pb-4 px-4 w-[376px] shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <span className="text-heading-h5 text-[var(--color-text-default)]">{node.title}</span>
        <span className="text-body-md text-[var(--color-text-subtle)]">{node.subtitle}</span>
      </div>

      {node.sections.map((section) => (
        <div
          key={section.id}
          className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] bg-white"
        >
          <Disclosure
            title={section.title}
            defaultOpen={sectionExpanded[section.id] ?? true}
            onChange={() => toggleSection(section.id)}
          >
            <VStack gap={6} className="px-4 pb-3">
              {section.fields.map((field) => (
                <VStack key={field.id} gap={2}>
                  <span className="text-heading-h6 text-[var(--color-text-default)]">
                    {field.label}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    {field.description}
                  </span>
                  {field.type === 'input' ? (
                    <Input
                      placeholder={field.placeholder}
                      value={getFieldValue(field)}
                      onChange={(e) => setFieldValue(field.id, e.target.value)}
                      fullWidth
                    />
                  ) : (
                    <Select
                      options={field.options ?? []}
                      value={getFieldValue(field)}
                      onChange={(v) => setFieldValue(field.id, v)}
                      fullWidth
                    />
                  )}
                </VStack>
              ))}
            </VStack>
          </Disclosure>
        </div>
      ))}

      <div>
        <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />} onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ——— Main Page ——— */

export function PipelineBuilderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Pipeline builder');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [blockLibraryOpen, setBlockLibraryOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode] = useState<SelectedNode | null>(MOCK_SELECTED_NODE);

  const [editorTabs, setEditorTabs] = useState<PipelineTab[]>(INITIAL_TABS);
  const [activeEditorTab, setActiveEditorTab] = useState(INITIAL_TABS[0].id);

  const handleEditorTabClose = (id: string) => {
    setEditorTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeEditorTab === id) {
      setActiveEditorTab(editorTabs[0]?.id ?? '');
    }
  };

  const handleEditorTabAdd = () => {
    const newId = `tab-${Date.now()}`;
    setEditorTabs((prev) => [...prev, { id: newId, label: 'Untitled' }]);
    setActiveEditorTab(newId);
  };

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
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
          breadcrumb={<Breadcrumb items={[{ label: 'MLOps' }, { label: 'Pipeline builder' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="p-0"
    >
      <div className="flex flex-col h-full">
        {/* Page Title Row */}
        <div className="flex items-center justify-between px-8 pt-4 pb-3">
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Pipeline builder</h1>
        </div>

        {/* Three-Panel Layout */}
        <div className="flex flex-1 min-h-0 px-8 pb-4">
          {/* Left: Block Library */}
          {blockLibraryOpen && (
            <BlockLibraryPanel
              categories={BLOCK_CATEGORIES}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onToggleSidebar={() => setBlockLibraryOpen(false)}
            />
          )}

          {/* Center: Editor */}
          <div className="flex flex-col flex-1 min-w-0 border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
            <EditorTabBar
              editorTabs={editorTabs}
              activeEditorTab={activeEditorTab}
              onTabChange={setActiveEditorTab}
              onTabClose={handleEditorTabClose}
              onTabAdd={handleEditorTabAdd}
              onToggleProperties={() => setPropertiesOpen(!propertiesOpen)}
            />
            <EditorToolbar onRun={() => {}} />
            <EditorCanvas />
          </div>

          {/* Right: Properties */}
          {propertiesOpen && selectedNode && (
            <PropertiesPanel node={selectedNode} onDelete={() => {}} />
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default PipelineBuilderPage;
