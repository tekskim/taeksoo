import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function ScrollbarPage() {
  return (
    <ComponentPageTemplate
      title="Scrollbar"
      description="Custom scrollbar styles for various containers"
      relatedLinks={[
        {
          label: 'Drawer',
          path: '/design/components/drawer',
          description: 'Side panel with scrollable content',
        },
        {
          label: 'Layout',
          path: '/design/patterns/layout',
          description: 'Application layout structure',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>커스텀 스크롤바는 CSS 유틸리티 클래스로 적용합니다.</li>
                <li>
                  <strong>기본 동작</strong>: hover 시 스크롤바가 나타나고, 비활성 시 숨겨집니다.
                </li>
                <li>
                  <strong>너비</strong>: 기본 6px (<code>drawer-scroll</code>). 모달에서는 4px (
                  <code>modal-scroll</code>).
                </li>
                <li>가로 스크롤이 필요한 테이블에서도 동일한 스크롤바 스타일을 적용합니다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>width: 6px</code> · <code>radius: full</code> · <code>track: transparent</code> ·{' '}
            <code>thumb: border-default</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Available classes</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                sidebar-scroll
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Main sidebar navigation. Width: 6px, stable gutter.
              </div>
            </div>
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                drawer-scroll
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Drawer/Panel content. Width: 6px.
              </div>
            </div>
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                settings-scroll
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Settings page content. Width: 6px.
              </div>
            </div>
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                legend-scroll
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Chart legend area. Width: 6px.
              </div>
            </div>
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                shell-scroll
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Terminal/Shell output. Width: 6px, dark thumb (#475569).
              </div>
            </div>
            <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                table-scroll-container
              </div>
              <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                Table horizontal scroll. Height: 6px, auto overflow-x.
              </div>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Live examples</Label>
          <div className="flex gap-6 items-start">
            <div className="flex flex-col gap-2 w-[200px]">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                sidebar-scroll (6px)
              </span>
              <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden sidebar-scroll bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                <div className="space-y-2 w-full">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] py-1"
                    >
                      Menu Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[200px]">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                shell-scroll (dark)
              </span>
              <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden shell-scroll bg-[#1e293b] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                <div className="space-y-1 font-mono w-full">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="text-[length:var(--font-size-11)] text-[#94a3b8]">
                      $ command --option {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Horizontal scroll (table-scroll-container)</Label>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Table horizontal scrollbar (height: 6px)
              </span>
              <div
                className="w-full max-w-[500px] table-scroll-container bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]"
                style={{ overflowX: 'auto' }}
              >
                <div className="flex gap-4 p-3" style={{ width: '800px' }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[120px] h-[60px] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center text-[length:var(--font-size-11)] text-[var(--color-text-default)]"
                    >
                      Column {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
              {`// Horizontal scrollbar for tables
<div className="table-scroll-container" style={{ overflowX: 'auto' }}>
  <div style={{ minWidth: '800px' }}>
    {/* table content wider than container */}
  </div>
</div>

// CSS
.table-scroll-container::-webkit-scrollbar { height: 6px; }
.table-scroll-container { scrollbar-width: thin; }`}
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Usage</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono whitespace-pre-wrap">
            {`// Add class to scrollable container
<div className="overflow-y-auto sidebar-scroll">
  {/* scrollable content */}
</div>

// CSS supports both Webkit and Firefox
.sidebar-scroll::-webkit-scrollbar { width: 6px; }
.sidebar-scroll { scrollbar-width: thin; }`}
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
