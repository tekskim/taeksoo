import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Breadcrumb, VStack } from '@/design-system';

export function BreadcrumbPage() {
  return (
    <ComponentPageTemplate
      title="Breadcrumb"
      description="Navigation path indicator with clickable links"
      relatedLinks={[
        {
          label: 'TopBar',
          path: '/design/components/topbar',
          description: 'Header with breadcrumb',
        },
        { label: 'PageShell', path: '/design/patterns/layout', description: 'Page layout pattern' },
        {
          label: 'Detail Page',
          path: '/design/patterns/common',
          description: 'Detail page pattern',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>TopBar 내에 배치하여 현재 페이지의 계층 경로를 표시합니다.</li>
                <li>
                  마지막 항목(현재 페이지)은 <strong>비활성 텍스트</strong>로 표시하고, 이전 항목은
                  클릭 가능한 링크로 제공합니다.
                </li>
                <li>
                  첫 번째 항목은 앱/클러스터 이름으로, 클릭 시 해당 앱의 홈 페이지로 이동합니다.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>gap: 4px</code> · <code>font-size: 11px</code> · <code>line-height: 16px</code> ·{' '}
            <code>font-weight: medium</code>
          </div>
        </VStack>

        {/* Basic Usage */}
        <VStack gap={3}>
          <Label>Basic usage</Label>
          <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
            <Breadcrumb
              items={[
                { label: 'Home', onClick: () => {} },
                { label: 'Compute', onClick: () => {} },
                { label: 'Instances', onClick: () => {} },
                { label: 'web-large' },
              ]}
            />
          </div>
        </VStack>

        {/* Long Path */}
        <VStack gap={3}>
          <Label>Long path</Label>
          <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
            <Breadcrumb
              items={[
                { label: 'Home', onClick: () => {} },
                { label: 'Instance snapshots', onClick: () => {} },
                { label: 'Instance snapshots', onClick: () => {} },
                { label: 'Instance snapshots', onClick: () => {} },
                { label: 'web-large' },
              ]}
            />
          </div>
        </VStack>

        {/* States */}
        <VStack gap={3}>
          <Label>States</Label>
          <div className="grid grid-cols-3 gap-4 text-[length:var(--font-size-10)]">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[var(--color-text-subtle)]">Default</span>
              <span className="text-[var(--breadcrumb-text-color)] font-medium">Home</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[var(--color-text-subtle)]">Hover</span>
              <span className="text-[var(--breadcrumb-text-hover)] font-medium">Home</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[var(--color-text-subtle)]">Current</span>
              <span className="text-[var(--breadcrumb-text-current)] font-medium">web-large</span>
            </div>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
