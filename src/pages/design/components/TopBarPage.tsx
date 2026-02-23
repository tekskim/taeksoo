import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { TopBar, TopBarAction, Breadcrumb, VStack } from '@/design-system';
import { IconBell } from '@tabler/icons-react';

export function TopBarPage() {
  return (
    <ComponentPageTemplate
      title="TopBar"
      description="Application header with sidebar toggle, navigation, breadcrumb, and actions"
      relatedLinks={[
        {
          label: 'Breadcrumb',
          path: '/design/components/breadcrumb',
          description: 'Navigation path',
        },
        { label: 'TabBar', path: '/design/components/tabbar', description: 'Browser-style tabs' },
        { label: 'PageShell', path: '/design/patterns/layout', description: 'Page layout' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                구성 요소 배치 규칙
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>좌측</strong>: 사이드바 토글 버튼(사이드바 닫힘 시), 뒤로/앞으로
                  네비게이션, Breadcrumb.
                </li>
                <li>
                  <strong>우측</strong>: 액션 버튼 (설정, 알림, 유틸리티 등).
                </li>
                <li>
                  Breadcrumb은 현재 위치를 계층적으로 표시하며, 각 항목은 클릭하여 이동 가능합니다.
                </li>
                <li>사이드바가 열려 있으면 토글 버튼을 숨기고, 닫혀 있으면 표시합니다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>height: 36px</code> · <code>padding-x: 12px</code> ·{' '}
            <code>button-size: 28px</code> · <code>radius: 4px</code>
          </div>
        </VStack>

        {/* Basic */}
        <VStack gap={3}>
          <Label>Basic</Label>
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
            <TopBar
              showSidebarToggle
              onSidebarToggle={() => console.log('Toggle sidebar')}
              onBack={() => console.log('Go back')}
              onForward={() => console.log('Go forward')}
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
        </VStack>

        {/* With Badge */}
        <VStack gap={3}>
          <Label>With Notification Badge</Label>
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
            <TopBar
              showSidebarToggle
              onSidebarToggle={() => console.log('Toggle sidebar')}
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
      </VStack>
    </ComponentPageTemplate>
  );
}
