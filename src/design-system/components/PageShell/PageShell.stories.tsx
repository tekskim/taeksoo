import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageShell } from './PageShell';

const meta: Meta<typeof PageShell> = {
  title: 'Layout/PageShell',
  component: PageShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
페이지 셸 레이아웃 컴포넌트. Sidebar + TabBar + TopBar + Content 영역을 래핑합니다.

모든 페이지에서 반복되는 \`fixed inset-0\` + Sidebar + main 구조를 추상화합니다.
사이드바 상태는 페이지에서 관리하고, \`sidebarWidth\`를 계산하여 전달합니다.

**사용 예시:**
\`\`\`tsx
const [sidebarOpen, setSidebarOpen] = useState(true);
const sidebarWidth = sidebarOpen ? 240 : 40;

<PageShell
  sidebar={<ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
  sidebarWidth={sidebarWidth}
  tabBar={<TabBar ... />}
  topBar={<TopBar showSidebarToggle={!sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} ... />}
  bottomPanel={<ShellPanel ... sidebarOpen={sidebarOpen} sidebarWidth={sidebarWidth} />}
  bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
>
  <VStack gap={3}>
    <PageHeader title="Pods" actions={...} />
    <ListToolbar ... />
    <Table ... />
  </VStack>
</PageShell>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageShell>;

// 기본 예시 (사이드바 모킹)
function DefaultExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;

  return (
    <PageShell
      sidebar={
        <div
          className="fixed top-0 bottom-0 left-0 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-default)] transition-[width] duration-200 flex flex-col items-center pt-4"
          style={{ width: `${sidebarWidth}px` }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
          >
            {sidebarOpen ? '← Close' : '→'}
          </button>
          {sidebarOpen && (
            <nav className="mt-4 w-full px-2">
              <div className="px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-md)]">
                Pods
              </div>
              <div className="px-3 py-2 text-body-md text-[var(--color-text-muted)]">
                Deployments
              </div>
              <div className="px-3 py-2 text-body-md text-[var(--color-text-muted)]">Services</div>
            </nav>
          )}
        </div>
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <div className="h-8 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center px-4">
          <span className="text-body-sm text-[var(--color-text-muted)]">Tab Bar Area</span>
        </div>
      }
      topBar={
        <div className="h-10 border-b border-[var(--color-border-default)] flex items-center px-4">
          <span className="text-body-md text-[var(--color-text-default)]">Top Bar Area</span>
        </div>
      }
    >
      <div className="p-8">
        <h1 className="text-heading-h5 text-[var(--color-text-default)] mb-4">Page Content Area</h1>
        <p className="text-body-md text-[var(--color-text-muted)]">
          This is where the page content goes. The PageShell handles the outer layout including
          sidebar, tab bar, top bar, and content area.
        </p>
      </div>
    </PageShell>
  );
}

export const Default: Story = {
  render: () => <DefaultExample />,
};
