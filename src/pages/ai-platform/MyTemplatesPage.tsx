import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  SearchInput,
  Pagination,
  Badge,
  EmptyState,
  ConfirmModal,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconPlus, IconInfoCircle, IconLock, IconTemplate } from '@tabler/icons-react';

const ITEMS_PER_PAGE = 6;

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  visibility: 'private' | 'public';
  category: string;
  baseImage: string;
  ports: string;
  minCpu: string;
  minMemory: string;
  deployments: number;
  lastDeployed: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-001',
    name: 'pytorch-ml-training',
    description: 'PyTorch GPU-enabled template for AI/ML workloads',
    visibility: 'private',
    category: 'AI/ML',
    baseImage: 'nvidia/cuda:12.1-devel',
    ports: '8888, 6006',
    minCpu: '4 cores',
    minMemory: '16 GB',
    deployments: 3,
    lastDeployed: '2025.09.26',
    createdAt: '2025.09.20',
    updatedAt: '2025.09.26',
  },
  {
    id: 'tpl-002',
    name: 'nginx-webserver',
    description: 'Standard Nginx web server template',
    visibility: 'public',
    category: 'Web services',
    baseImage: 'nginx:1.25',
    ports: '80, 443',
    minCpu: '1 core',
    minMemory: '512 MB',
    deployments: 12,
    lastDeployed: '2025.10.01',
    createdAt: '2025.08.15',
    updatedAt: '2025.10.01',
  },
  {
    id: 'tpl-003',
    name: 'jupyter-notebook',
    description: 'Jupyter Lab with GPU support',
    visibility: 'private',
    category: 'Development',
    baseImage: 'jupyter/scipy-notebook:latest',
    ports: '8888',
    minCpu: '2 cores',
    minMemory: '8 GB',
    deployments: 7,
    lastDeployed: '2025.09.30',
    createdAt: '2025.07.10',
    updatedAt: '2025.09.30',
  },
  {
    id: 'tpl-004',
    name: 'fastapi-service',
    description: 'FastAPI microservice template',
    visibility: 'public',
    category: 'Web services',
    baseImage: 'python:3.12-slim',
    ports: '8000',
    minCpu: '2 cores',
    minMemory: '4 GB',
    deployments: 5,
    lastDeployed: '2025.09.28',
    createdAt: '2025.08.01',
    updatedAt: '2025.09.28',
  },
  {
    id: 'tpl-005',
    name: 'stable-diffusion',
    description: 'Stable Diffusion inference server',
    visibility: 'private',
    category: 'AI/ML',
    baseImage: 'ghcr.io/thakicloud/sd-webui:latest',
    ports: '7860',
    minCpu: '8 cores',
    minMemory: '32 GB',
    deployments: 2,
    lastDeployed: '2025.09.25',
    createdAt: '2025.09.01',
    updatedAt: '2025.09.25',
  },
  {
    id: 'tpl-006',
    name: 'redis-cache',
    description: 'Redis cache template',
    visibility: 'public',
    category: 'Development',
    baseImage: 'redis:7.2-alpine',
    ports: '6379',
    minCpu: '1 core',
    minMemory: '2 GB',
    deployments: 8,
    lastDeployed: '2025.09.29',
    createdAt: '2025.06.15',
    updatedAt: '2025.09.29',
  },
];

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <VStack gap={1}>
      <span className="text-body-sm text-[var(--color-text-subtle)]">{label}</span>
      <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
    </VStack>
  );
}

function MetadataDivider() {
  return <span className="w-px h-[10px] shrink-0 bg-[var(--color-border-strong)]" aria-hidden />;
}

function TemplateCard({
  template,
  onDelete,
  onNavigateDetail,
  onNavigateEdit,
  onNavigateDeploy,
}: {
  template: TemplateItem;
  onDelete: (t: TemplateItem) => void;
  onNavigateDetail: (id: string) => void;
  onNavigateEdit: (id: string) => void;
  onNavigateDeploy: () => void;
}) {
  const depPadded = String(template.deployments).padStart(2, '0');

  return (
    <div
      className="flex flex-col gap-[var(--spacing-5)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 py-3 min-h-[292px] cursor-pointer hover:border-[var(--color-border-strong)] transition-colors"
      data-figma-name="[TDS] Template card"
      onClick={() => onNavigateDetail(template.id)}
    >
      <VStack gap={2} align="start" className="min-w-0 w-full">
        <span className="text-heading-h5 text-[var(--color-text-default)]">{template.name}</span>
        <HStack gap={1.5} className="flex-wrap">
          {template.visibility === 'private' ? (
            <Badge theme="green" type="subtle" size="sm" leftIcon={<IconLock size={12} />}>
              Private
            </Badge>
          ) : (
            <Badge theme="gray" type="subtle" size="sm">
              Public
            </Badge>
          )}
          <Badge theme="yellow" type="subtle" size="sm">
            {template.category}
          </Badge>
        </HStack>
      </VStack>

      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-[var(--spacing-5)]">
          <SpecCell label="Base image" value={template.baseImage} />
          <SpecCell label="Ports" value={template.ports} />
          <SpecCell label="Minimum CPU cores" value={template.minCpu} />
          <SpecCell label="Minimum memory" value={template.minMemory} />
        </div>
      </div>

      <HStack gap={2} align="center" className="flex-wrap min-w-0">
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          Deployments {depPadded}
        </span>
        <MetadataDivider />
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          Last deployed {template.lastDeployed}
        </span>
        <MetadataDivider />
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          Created at {template.createdAt}
        </span>
        <MetadataDivider />
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          Updated at {template.updatedAt}
        </span>
      </HStack>

      <HStack gap={1} justify="end" className="mt-auto flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          icon={<IconInfoCircle size={12} />}
          aria-label={`Details for ${template.name}`}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onNavigateDetail(template.id);
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onNavigateEdit(template.id);
          }}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete(template);
          }}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onNavigateDeploy();
          }}
        >
          Deploy
        </Button>
      </HStack>
    </div>
  );
}

export function MyTemplatesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [templates, setTemplates] = useState<TemplateItem[]>(() => [...MOCK_TEMPLATES]);

  useEffect(() => {
    updateActiveTabLabel('My templates');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => t.name.toLowerCase().includes(q));
  }, [templates, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));

  const paginatedTemplates = useMemo(
    () => filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredTemplates, currentPage]
  );

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);

  const handleDeleteRequest = useCallback((t: TemplateItem) => {
    setDeleteTarget(t);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      setTemplates((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const goDetail = useCallback(
    (id: string) => {
      navigate(`/ai-platform/my-templates/${id}`);
    },
    [navigate]
  );

  const goEdit = useCallback(
    (id: string) => {
      navigate(`/ai-platform/my-templates/${id}/edit`);
    },
    [navigate]
  );

  const goDeploy = useCallback(() => {
    navigate('/ai-platform/workloads/deploy');
  }, [navigate]);

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
          breadcrumb={
            <Breadcrumb items={[{ label: 'Infrastructure' }, { label: 'My templates' }]} />
          }
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="My templates"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/ai-platform/my-templates/create')}
            >
              Create template
            </Button>
          }
        />

        <SearchInput
          size="sm"
          placeholder="Find templates with filters"
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          className="w-[280px]"
          aria-label="Search templates by name"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTemplates.length}
          selectedCount={0}
        />

        {filteredTemplates.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconTemplate size={48} stroke={1} />}
            title="No templates found"
            description="Try a different search or create a new template."
            action={
              <Button
                variant="primary"
                size="md"
                leftIcon={<IconPlus size={12} />}
                onClick={() => navigate('/ai-platform/my-templates/create')}
              >
                Create template
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-3 gap-4 w-full">
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onDelete={handleDeleteRequest}
                onNavigateDetail={goDetail}
                onNavigateEdit={goEdit}
                onNavigateDeploy={goDeploy}
              />
            ))}
          </div>
        )}
      </VStack>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete template"
        description="This action is permanent and cannot be undone."
        infoLabel="Template name"
        infoValue={deleteTarget?.name ?? ''}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default MyTemplatesPage;
