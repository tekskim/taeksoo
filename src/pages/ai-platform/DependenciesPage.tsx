import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  Table,
  SearchInput,
  Pagination,
  Drawer,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconTrash } from '@tabler/icons-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_IMAGES = [
  {
    id: '1',
    name: 'ai-platform-stage-backend-admin',
    packages: 12,
    high: 7,
    medium: 3,
    low: 2,
    none: 0,
  },
  {
    id: '2',
    name: 'ai-platform-stage-backend-admin',
    packages: 12,
    high: 7,
    medium: 3,
    low: 2,
    none: 0,
  },
  {
    id: '3',
    name: 'ai-platform-stage-backend-admin',
    packages: 12,
    high: 7,
    medium: 3,
    low: 2,
    none: 0,
  },
  {
    id: '4',
    name: 'ai-platform-stage-backend-admin',
    packages: 12,
    high: 7,
    medium: 3,
    low: 2,
    none: 0,
  },
];

const MOCK_PACKAGES = [
  {
    id: '1',
    name: 'github.com/aws/...',
    riskLevel: 'Low',
    version: '1.154.12',
    license: 'BSD-3-Clause',
    spdxId: 'Apache-2.0',
    language: '-',
  },
  {
    id: '2',
    name: 'github.com/aws/...',
    riskLevel: 'High',
    version: 'v11.2-0.20180830...',
    license: 'BSD-3-Clause',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '3',
    name: 'github.com/aws/...',
    riskLevel: 'Medium',
    version: 'v11.2-0.20180830...',
    license: 'BSD-3-Clause',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '4',
    name: 'github.com/aws/...',
    riskLevel: 'None',
    version: 'v11.2-0.20180830...',
    license: 'BSD-3-Clause',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '5',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '6',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '7',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '8',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '9',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
  {
    id: '10',
    name: 'github.com/aws/...',
    riskLevel: 'Unknown',
    version: 'v11.2-0.20180830...',
    license: 'Unknown',
    spdxId: 'MIT',
    language: '-',
  },
];

const RISK_COLORS: Record<string, string> = {
  High: 'var(--color-state-danger)',
  Medium: '#f59e0b',
  Low: 'var(--color-action-primary)',
  None: 'var(--color-state-success)',
  Unknown: 'var(--color-text-subtle)',
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export function DependenciesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<(typeof MOCK_IMAGES)[0] | null>(null);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Dependencies');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const columns = [
    {
      key: 'name',
      header: 'Name',
      minWidth: 220,
      render: (_: unknown, row: (typeof MOCK_IMAGES)[0]) => (
        <span
          className="text-[var(--color-action-primary)] cursor-pointer"
          onClick={() => {
            setSelectedImage(row);
            setDrawerOpen(true);
          }}
        >
          {row.name}
        </span>
      ),
    },
    { key: 'packages', header: 'Packages', minWidth: 100 },
    { key: 'high', header: 'High', minWidth: 80 },
    { key: 'medium', header: 'Medium', minWidth: 80 },
    { key: 'low', header: 'Low', minWidth: 80 },
    { key: 'none', header: 'None', minWidth: 80 },
  ];

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
          breadcrumb={<Breadcrumb items={[{ label: 'Operations' }, { label: 'Dependencies' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="Dependencies"
          actions={
            <HStack gap={2} align="center">
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Nov 11, 2025, 2:51 PM
              </span>
              <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                Refresh
              </Button>
            </HStack>
          }
        />
        <span className="text-body-md text-[var(--color-text-subtle)]">
          View OCI Attestation-verified package composition (SBOM) and license risk levels for
          cluster services.
        </span>

        {/* Summary Cards */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'Total packages', value: '100', color: 'var(--color-text-default)' },
            { label: 'High', value: '0', color: 'var(--color-state-danger)' },
            { label: 'Medium', value: '0', color: '#f59e0b' },
            { label: 'Low', value: '5', color: 'var(--color-action-primary)' },
            { label: 'None', value: '5', color: 'var(--color-state-success)' },
            { label: 'Unknown', value: '5', color: 'var(--color-text-default)' },
          ].map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)]"
            >
              <span className="text-body-sm text-[var(--color-text-subtle)]">{card.label}</span>
              <span className="text-heading-h5" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <HStack gap={2} align="center">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find groups with filter"
            size="sm"
            className="w-[280px]"
          />
          <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </HStack>

        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={4} />
        <Table columns={columns} data={MOCK_IMAGES} rowKey="id" />
      </VStack>

      {/* Detail Drawer */}
      <ImageDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        image={selectedImage}
      />
    </PageShell>
  );
}

// ─── Image Detail Drawer ─────────────────────────────────────────────────────

function ImageDetailDrawer({
  isOpen,
  onClose,
  image,
}: {
  isOpen: boolean;
  onClose: () => void;
  image: (typeof MOCK_IMAGES)[0] | null;
}) {
  const [pkgSearch, setPkgSearch] = useState('');

  const pkgColumns = [
    { key: 'name', header: 'Package name', minWidth: 140 },
    {
      key: 'riskLevel',
      header: 'Risk level',
      minWidth: 100,
      render: (_: unknown, row: (typeof MOCK_PACKAGES)[0]) => (
        <span style={{ color: RISK_COLORS[row.riskLevel] || 'inherit' }}>{row.riskLevel}</span>
      ),
    },
    { key: 'version', header: 'Version', minWidth: 140 },
    { key: 'license', header: 'License', minWidth: 120 },
    { key: 'spdxId', header: 'SPDX ID', minWidth: 100 },
    { key: 'language', header: 'Language', minWidth: 80 },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Image Details"
      width={680}
      footer={
        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      }
    >
      <VStack gap={4}>
        {/* Image Name */}
        <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
          <span className="text-body-xs text-[var(--color-text-subtle)]">Image</span>
          <p className="text-body-md text-[var(--color-text-default)]">{image?.name || '-'}</p>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'High', value: '0', color: 'var(--color-state-danger)' },
            { label: 'Medium', value: '0', color: '#f59e0b' },
            { label: 'Low', value: '5', color: 'var(--color-action-primary)' },
            { label: 'None', value: '5', color: 'var(--color-state-success)' },
            { label: 'Unknown', value: '5', color: 'var(--color-text-default)' },
          ].map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-1 p-2 rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]"
            >
              <span className="text-body-xs text-[var(--color-text-subtle)]">{card.label}</span>
              <span className="text-heading-h6" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Search + Pagination */}
        <SearchInput
          value={pkgSearch}
          onChange={(e) => setPkgSearch(e.target.value)}
          placeholder="Find packages"
          size="sm"
          className="w-full"
        />
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} totalItems={24} />

        {/* Package Table */}
        <Table columns={pkgColumns} data={MOCK_PACKAGES} rowKey="id" />
      </VStack>
    </Drawer>
  );
}

export default DependenciesPage;
