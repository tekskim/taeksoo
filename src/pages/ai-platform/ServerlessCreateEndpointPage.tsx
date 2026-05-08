import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, TabBar, TopBar, Breadcrumb, Button, PageShell } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconBrandDocker,
  IconBrandGithub,
  IconSparkles,
  IconRocket,
  IconPhoto,
} from '@tabler/icons-react';

const ENDPOINT_ROUTES = [
  {
    id: 'vllm',
    title: 'vLLM',
    description: 'Deploy OpenAI-Compatible Blazing-Fast LLM Endpoint',
    path: '/ai-platform/serverless/create/vllm',
    icon: <IconSparkles size={22} stroke={1.5} className="text-[var(--color-text-default)]" />,
  },
  {
    id: 'axolotl',
    title: 'Axolotl',
    description: 'Serverless fine-tuning of open-source LLMs with Axolotl presets',
    path: '/ai-platform/serverless/create/axolotl',
    icon: <IconRocket size={22} stroke={1.5} className="text-[var(--color-text-default)]" />,
  },
  {
    id: 'comfyui',
    title: 'ComfyUI',
    description: 'Generate images with ComfyUI using FLUX1 defaults',
    path: '/ai-platform/serverless/create/comfyui',
    icon: <IconPhoto size={22} stroke={1.5} className="text-[var(--color-text-default)]" />,
  },
] as const;

export function ServerlessCreateEndpointPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Create endpoint');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
            <Breadcrumb
              items={[
                { label: 'Infrastructure' },
                { label: 'Serverless', href: '/ai-platform/serverless' },
                { label: 'Create endpoint' },
              ]}
            />
          }
          actions={
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={8} className="w-full">
        <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create endpoint</h1>

        <VStack gap={3} className="w-full">
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Source selection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col items-center justify-center gap-3 min-h-[180px] py-4 px-4 border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-default)]">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-surface-muted)] shrink-0"
                aria-hidden
              >
                <IconBrandDocker
                  size={44}
                  stroke={1.25}
                  className="text-[var(--color-text-default)]"
                />
              </div>
              <span className="text-heading-h6 text-[var(--color-text-default)] text-center font-medium">
                Import docker image
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)] text-center">
                Deploy any docker image from a container registry
              </p>
              <Button variant="primary" size="md" type="button">
                Select
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 min-h-[180px] py-4 px-4 border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-default)]">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-surface-muted)] shrink-0"
                aria-hidden
              >
                <IconBrandGithub
                  size={44}
                  stroke={1.25}
                  className="text-[var(--color-text-default)]"
                />
              </div>
              <span className="text-heading-h6 text-[var(--color-text-default)] text-center font-medium">
                Connect GitHub
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)] text-center">
                Link your GitHub account to deploy serverless endpoints directly from your
                repositories.
              </p>
              <Button variant="primary" size="md" type="button">
                Select
              </Button>
            </div>
          </div>
        </VStack>

        <VStack gap={3} className="w-full">
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">End point list</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {ENDPOINT_ROUTES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 p-4 min-h-[84px] text-left border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-default)] cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
              >
                <div
                  className="flex items-center justify-center size-9 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] shrink-0"
                  aria-hidden
                >
                  {item.icon}
                </div>
                <VStack gap={1} className="min-w-0 flex-1">
                  <span className="text-heading-h6 text-[var(--color-text-default)]">
                    {item.title}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">
                    {item.description}
                  </span>
                </VStack>
              </button>
            ))}
          </div>
        </VStack>
      </VStack>
    </PageShell>
  );
}

export default ServerlessCreateEndpointPage;
