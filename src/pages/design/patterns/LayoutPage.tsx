import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';
import { IconChevronLeft, IconMenu2 } from '@tabler/icons-react';

export function LayoutPage() {
  return (
    <ComponentPageTemplate
      title="Layout"
      description="Application layout structure with responsive sidebar"
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar', description: 'Top navigation bar' },
        { label: 'TabBar', path: '/design/components/tabbar', description: 'Browser-style tabs' },
        { label: 'Shell', path: '/design/components/shell', description: 'Terminal panel' },
        {
          label: 'Common patterns',
          path: '/design/patterns/common',
          description: 'Page layout patterns',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">레이아웃 구조</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  PageShell이 전체 페이지를 래핑하며, Sidebar + TabBar + TopBar + Content 영역으로
                  구성됩니다. 하단에는 Shell Panel(터미널)이 선택적으로 표시됩니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">사이드바 정책</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>펼침 상태</strong>: 너비 200px (<code>--layout-sidebar-width</code>).
                    메뉴 아이콘 + 라벨 표시.
                  </li>
                  <li>
                    <strong>접힘 상태</strong>: 사이드바가 완전히 숨겨집니다.
                  </li>
                  <li>사이드바 토글은 사이드바 하단 또는 TopBar에서 제공합니다.</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  콘텐츠 영역 정책
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>최소 너비</strong>: 콘텐츠 영역의 최소 너비를 보장하여 레이아웃이 깨지지
                    않도록 합니다.
                  </li>
                  <li>
                    <strong>패딩</strong>: 상단 16px (pt-4), 좌우 32px (px-8), 하단 80px (pb-20).
                  </li>
                  <li>
                    <strong>리스트 페이지</strong>: 최소 너비 1176px 적용.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        <VStack gap={4}>
          <Label>Layout specifications</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-12)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Breakpoint
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Width
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Sidebar
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Content Area
                  </th>
                  <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                    Features
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">
                    Desktop (Default)
                  </td>
                  <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1920px</td>
                  <td className="py-3 pr-4 text-[var(--color-text-default)]">
                    200px (collapsible)
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-text-muted)]">1720px max</td>
                  <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">
                    Laptop (Min)
                  </td>
                  <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1440px</td>
                  <td className="py-3 pr-4 text-[var(--color-text-default)]">
                    200px (collapsible)
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-text-muted)]">1240px max</td>
                  <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>

        <VStack gap={4}>
          <Label>Desktop Layout (1920px)</Label>
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)]">
            <div className="flex h-[200px]">
              <div className="w-[52px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                <div className="p-2 border-b border-[var(--color-border-subtle)]">
                  <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                    <span className="text-[6px] font-bold text-white">TDS</span>
                  </div>
                </div>
                <div className="flex-1 p-2 space-y-1">
                  <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                  <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                  <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                  <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                </div>
                <div className="p-2 border-t border-[var(--color-border-subtle)] flex justify-center">
                  <IconChevronLeft size={12} className="text-[var(--color-text-muted)]" />
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="h-4 w-32 bg-[var(--color-surface-default)] rounded" />
                <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-3">
                  <div className="space-y-2">
                    <div className="h-2 bg-[var(--color-border-subtle)] rounded w-3/4" />
                    <div className="h-2 bg-[var(--color-border-subtle)] rounded w-1/2" />
                    <div className="h-2 bg-[var(--color-border-subtle)] rounded w-2/3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <div className="w-[52px] py-2 text-center border-r border-[var(--color-border-default)]">
                <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">
                  200px
                </span>
              </div>
              <div className="flex-1 py-2 text-center">
                <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-muted)]">
                  Content Area (1720px max)
                </span>
              </div>
            </div>
          </div>
        </VStack>

        <VStack gap={4}>
          <Label>Laptop Layout (1440px)</Label>
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)] max-w-[600px]">
            <div className="flex h-[160px]">
              <div className="w-[42px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                <div className="p-1.5 border-b border-[var(--color-border-subtle)]">
                  <div className="w-5 h-5 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                    <span className="text-[5px] font-bold text-white">TDS</span>
                  </div>
                </div>
                <div className="flex-1 p-1.5 space-y-1">
                  <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                  <div className="h-1.5 bg-[var(--color-action-primary)] rounded opacity-50" />
                  <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                </div>
              </div>
              <div className="flex-1 p-3 flex flex-col gap-2">
                <div className="h-3 w-24 bg-[var(--color-surface-default)] rounded" />
                <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-2">
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-3/4" />
                    <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <div className="w-[42px] py-1.5 text-center border-r border-[var(--color-border-default)]">
                <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-action-primary)]">
                  200px
                </span>
              </div>
              <div className="flex-1 py-1.5 text-center">
                <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-text-muted)]">
                  Content (1240px max)
                </span>
              </div>
            </div>
          </div>
        </VStack>

        <VStack gap={4}>
          <Label>Sidebar states</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                <div className="w-[60px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] p-2">
                  <div className="space-y-2">
                    <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                    <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                    <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                  </div>
                </div>
                <div className="flex-1 p-3">
                  <div className="h-full bg-[var(--color-surface-default)] rounded" />
                </div>
              </div>
              <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">
                  Sidebar Expanded
                </span>
              </div>
            </div>
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                <div className="w-0 bg-[var(--color-surface-default)] overflow-hidden transition-all" />
                <div className="flex-1 p-3">
                  <div className="h-full bg-[var(--color-surface-default)] rounded flex items-start p-2">
                    <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center cursor-pointer">
                      <IconMenu2 size={12} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">
                  Sidebar Collapsed
                </span>
              </div>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Layout tokens</Label>
          <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
            {`/* Layout Variables */
--layout-max-width: 1920px;      /* Maximum viewport */
--layout-min-width: 1440px;      /* Minimum supported */
--layout-sidebar-width: 200px;            /* Fixed sidebar width */
--layout-sidebar-width-collapsed: 40px;  /* Collapsed state (icons only) */

/* Content Area */
--layout-content-padding: var(--spacing-8);  /* 32px */
--layout-content-max-width: calc(100% - var(--layout-sidebar-width));

/* Responsive behavior */
@media (max-width: 1440px) {
  /* Maintain same structure, content scales */
}`}
          </pre>
        </VStack>

        <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
          <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
            <strong>📐 Layout Guidelines:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Sidebar는 200px 고정, 숨김/표시 토글 가능</li>
              <li>1920px에서 1440px까지 반응형 지원</li>
              <li>1440px 미만은 모바일 레이아웃 (추후 확장)</li>
              <li>Content area는 sidebar 상태에 따라 자동 조절</li>
            </ul>
          </div>
        </div>
      </VStack>
    </ComponentPageTemplate>
  );
}
