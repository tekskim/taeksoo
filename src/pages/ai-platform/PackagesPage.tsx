import { useState, useEffect } from 'react';
import { VStack, HStack, TabBar, TopBar, Breadcrumb, Button, Badge } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconRefresh,
  IconStar,
  IconPackage,
  IconLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Thaki Image Card Component
   ---------------------------------------- */

interface ThakiImageCardProps {
  name: string;
  versionsCount: number;
  tags: string[];
  deployOptions: string[];
  onDeploy?: (option: string) => void;
}

function ThakiImageCard({
  name,
  versionsCount,
  tags,
  deployOptions,
  onDeploy,
}: ThakiImageCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-4 flex flex-col gap-3">
      {/* Header */}
      <HStack gap={3} align="start">
        <IconStar
          size={20}
          className="text-[var(--color-action-primary)] shrink-0 mt-0.5"
          stroke={1.5}
        />
        <VStack gap={1} className="flex-1 min-w-0">
          <span className="text-[14px] font-semibold text-[var(--color-text-default)]">{name}</span>
          <span className="text-[12px] text-[var(--color-text-subtle)]">
            {versionsCount} versions available
          </span>
        </VStack>
      </HStack>

      {/* Tags */}
      <HStack gap={2} className="flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[11px] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] rounded"
          >
            {tag}
          </span>
        ))}
      </HStack>

      {/* Deploy Options */}
      <HStack gap={2} className="flex-wrap">
        {deployOptions.map((option) => (
          <Button
            key={option}
            variant="secondary"
            size="sm"
            leftIcon={<IconLink size={12} stroke={1.5} />}
            onClick={() => onDeploy?.(option)}
          >
            {option}
          </Button>
        ))}
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Common Image Card Component
   ---------------------------------------- */

interface CommonImageCardProps {
  name: string;
  onDeploy?: () => void;
}

function CommonImageCard({ name, onDeploy }: CommonImageCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-4 flex flex-col gap-3">
      {/* Header */}
      <HStack gap={3} align="start">
        <IconPackage
          size={20}
          className="text-[var(--color-text-muted)] shrink-0 mt-0.5"
          stroke={1.5}
        />
        <VStack gap={1} className="flex-1 min-w-0">
          <span className="text-[14px] font-semibold text-[var(--color-text-default)]">{name}</span>
          <span className="text-[11px] px-2 py-0.5 bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] rounded w-fit">
            Common Image
          </span>
        </VStack>
      </HStack>

      {/* Deploy Button */}
      <HStack justify="end">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconLink size={12} stroke={1.5} />}
          onClick={onDeploy}
        >
          배포
        </Button>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Section Header Component
   ---------------------------------------- */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  count: number;
}

function SectionHeader({ icon, title, count }: SectionHeaderProps) {
  return (
    <HStack gap={2} align="center">
      {icon}
      <span className="text-[16px] font-semibold text-[var(--color-text-default)]">{title}</span>
      <Badge variant="info" size="sm">
        {count}
      </Badge>
    </HStack>
  );
}

/* ----------------------------------------
   Packages Page
   ---------------------------------------- */

// Sample Thaki images data
const thakiImages: ThakiImageCardProps[] = [
  {
    name: 'codeserver',
    versionsCount: 2,
    tags: ['cpu', 'gpu'],
    deployOptions: ['cpu', 'gpu'],
  },
  {
    name: 'sandbox',
    versionsCount: 2,
    tags: ['cpu', 'gpu'],
    deployOptions: ['cpu', 'gpu'],
  },
  {
    name: 'vllm',
    versionsCount: 2,
    tags: ['amd64/cpu', 'amd64/gpu'],
    deployOptions: ['amd64/cpu', 'amd64/gpu'],
  },
  {
    name: 'vllm-kotaemon',
    versionsCount: 3,
    tags: ['amd64/cpu', 'amd64/gpu', 'arm64/cpu'],
    deployOptions: ['amd64/cpu', 'amd64/gpu', 'arm64/cpu'],
  },
  {
    name: 'vllm-openwebui',
    versionsCount: 3,
    tags: ['amd64/cpu', 'amd64/gpu', 'arm64/cpu'],
    deployOptions: ['amd64/cpu', 'amd64/gpu', 'arm64/cpu'],
  },
];

// Sample common images data
const commonImages: CommonImageCardProps[] = [
  { name: 'nginx:latest' },
  { name: 'alpine:latest' },
  { name: 'ubuntu:latest' },
  { name: 'python:3.11' },
  { name: 'node:20' },
  { name: 'postgres:16' },
  { name: 'redis:latest' },
  { name: 'mysql:8' },
  { name: 'mongo:latest' },
];

export function PackagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Packages');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'AI Platform' }, { label: 'Hub' }, { label: 'Packages' }]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)] min-h-full">
            <VStack gap={6}>
              {/* Header */}
              <HStack justify="between" align="start">
                <VStack gap={1}>
                  <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                    Packages Hub
                  </h1>
                  <p className="text-[14px] text-[var(--color-text-subtle)]">
                    AI Container Image Package Management
                  </p>
                </VStack>
                <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                  Refresh
                </Button>
              </HStack>

              {/* Thaki Images Section */}
              <VStack gap={4}>
                <SectionHeader
                  icon={
                    <IconStar
                      size={20}
                      className="text-[var(--color-action-primary)]"
                      stroke={1.5}
                    />
                  }
                  title="Thaki Images"
                  count={thakiImages.length}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {thakiImages.map((image) => (
                    <ThakiImageCard
                      key={image.name}
                      {...image}
                      onDeploy={(option) => console.log('Deploy', image.name, option)}
                    />
                  ))}
                </div>
              </VStack>

              {/* Common Images Section */}
              <VStack gap={4}>
                <SectionHeader
                  icon={
                    <IconPackage
                      size={20}
                      className="text-[var(--color-text-muted)]"
                      stroke={1.5}
                    />
                  }
                  title="Common Images"
                  count={commonImages.length}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {commonImages.map((image) => (
                    <CommonImageCard
                      key={image.name}
                      {...image}
                      onDeploy={() => console.log('Deploy', image.name)}
                    />
                  ))}
                </div>
              </VStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PackagesPage;
