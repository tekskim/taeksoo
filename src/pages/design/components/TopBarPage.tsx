import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { TopBar, TopBarAction, Breadcrumb, VStack } from '@/design-system';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function TopBarGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={2}>
        <SectionTitle>구성 요소 배치 규칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>좌측</strong>: 사이드바 토글 버튼(사이드바 닫힘 시), 뒤로/앞으로 네비게이션,
              Breadcrumb.
            </li>
            <li>
              <strong>우측</strong>: 액션 버튼 (설정, 알림, 유틸리티 등).
            </li>
            <li>
              Breadcrumb은 현재 위치를 계층적으로 표시하며, 각 항목은 클릭하여 이동 가능합니다.
            </li>
            <li>사이드바가 열려 있으면 토글 버튼을 숨기고, 닫혀 있으면 표시합니다.</li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

const topBarProps: PropDef[] = [
  { name: 'breadcrumb', type: 'ReactNode', required: false, description: 'Breadcrumb content' },
  { name: 'actions', type: 'ReactNode', required: false, description: 'Right-side actions' },
  {
    name: 'showSidebarToggle',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show sidebar toggle',
  },
  {
    name: 'showNavigation',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show nav buttons',
  },
  {
    name: 'onSidebarToggle',
    type: '() => void',
    required: false,
    description: 'Sidebar toggle handler',
  },
  { name: 'onBack', type: '() => void', required: false, description: 'Back navigation handler' },
  {
    name: 'onForward',
    type: '() => void',
    required: false,
    description: 'Forward navigation handler',
  },
];

export function TopBarPage() {
  return (
    <ComponentPageTemplate
      title="TopBar"
      description="Application header with sidebar toggle, navigation, breadcrumb, and actions"
      preview={
        <ComponentPreview
          code={`<TopBar
  showSidebarToggle
  onSidebarToggle={() => {}}
  breadcrumb={<Breadcrumb items={[{ label: 'Home' }, { label: 'Settings' }]} />}
  actions={<></>}
/>`}
        >
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
            <TopBar
              showSidebarToggle
              onSidebarToggle={() => {}}
              onBack={() => {}}
              onForward={() => {}}
              breadcrumb={
                <Breadcrumb
                  items={[
                    { label: 'Home', onClick: () => {} },
                    { label: 'Entry page', onClick: () => {} },
                    { label: 'Settings' },
                  ]}
                />
              }
              actions={<></>}
            />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { TopBar, Breadcrumb } from '@/design-system';\n\n<TopBar\n  showSidebarToggle={!sidebarOpen}\n  onSidebarToggle={toggleSidebar}\n  breadcrumb={<Breadcrumb items={[{ label: 'Projects', href: '/projects' }, { label: 'My project' }]} />}\n  actions={<TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />}\n/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              With Notification Badge
            </span>
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
              <TopBar
                showSidebarToggle
                onSidebarToggle={() => {}}
                canGoBack={true}
                canGoForward={false}
                breadcrumb={
                  <Breadcrumb
                    items={[{ label: 'Projects', onClick: () => {} }, { label: 'My project' }]}
                  />
                }
                actions={
                  <TopBarAction
                    icon={<IconBell size={16} stroke={1.5} />}
                    aria-label="Notifications"
                    badge
                  />
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Container App (Home)
            </span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Minimal breadcrumb with utility action buttons. No back/forward navigation. Button
              size: 28px, icon size: 16px, gap: 4px.
            </p>
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
              <TopBar
                showSidebarToggle
                onSidebarToggle={() => {}}
                breadcrumb={<Breadcrumb items={[{ label: 'Home' }]} />}
                actions={
                  <>
                    <TopBarAction
                      icon={<IconTerminal2 size={16} stroke={1.5} />}
                      aria-label="Terminal"
                    />
                    <TopBarAction icon={<IconFile size={16} stroke={1.5} />} aria-label="Files" />
                    <TopBarAction icon={<IconCopy size={16} stroke={1.5} />} aria-label="Copy" />
                    <TopBarAction
                      icon={<IconSearch size={16} stroke={1.5} />}
                      aria-label="Search"
                    />
                    <TopBarAction
                      icon={<IconBell size={16} stroke={1.5} />}
                      aria-label="Notifications"
                      badge
                    />
                  </>
                }
              />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<TopBarGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 36px</code> · <code>padding-x: 12px</code> · <code>button-size: 28px</code>{' '}
          · <code>radius: 4px</code>
        </div>
      }
      apiReference={topBarProps}
      relatedLinks={[
        {
          label: 'Breadcrumb',
          path: '/design/components/breadcrumb',
          description: 'Navigation path',
        },
        { label: 'TabBar', path: '/design/components/tabbar', description: 'Browser-style tabs' },
        { label: 'PageShell', path: '/design/patterns/layout', description: 'Page layout' },
      ]}
    />
  );
}
