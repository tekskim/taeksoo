import type { ReactNode } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Button, Tooltip, VStack } from '@/design-system';
import { IconTrash } from '@tabler/icons-react';

function StaticTooltip({
  content,
  position = 'top',
  children,
}: {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}) {
  const tooltip = (
    <div className="relative inline-flex items-center justify-center px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] bg-[var(--color-text-default)] text-[var(--color-surface-default)] text-[length:var(--tooltip-font-size)] rounded-[var(--tooltip-radius)] w-max max-w-[var(--tooltip-max-width)]">
      {content}
      {position === 'top' && (
        <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[var(--color-text-default)]" />
      )}
      {position === 'bottom' && (
        <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[var(--color-text-default)]" />
      )}
      {position === 'left' && (
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-[var(--color-text-default)]" />
      )}
      {position === 'right' && (
        <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[var(--color-text-default)]" />
      )}
    </div>
  );

  if (position === 'top')
    return (
      <div className="flex flex-col items-center gap-1.5">
        {tooltip}
        {children}
      </div>
    );
  if (position === 'bottom')
    return (
      <div className="flex flex-col items-center gap-1.5">
        {children}
        {tooltip}
      </div>
    );
  if (position === 'left')
    return (
      <div className="flex items-center gap-1.5">
        {tooltip}
        {children}
      </div>
    );
  return (
    <div className="flex items-center gap-1.5">
      {children}
      {tooltip}
    </div>
  );
}

const tooltipProps: PropDef[] = [
  { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip content' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Trigger element' },
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'top'",
    required: false,
    description: 'Tooltip position',
  },
  {
    name: 'delay',
    type: 'number',
    default: '200',
    required: false,
    description: 'Show delay (ms)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
];

export function TooltipPage() {
  return (
    <ComponentPageTemplate
      title="Tooltip"
      description="Contextual information on hover"
      preview={
        <ComponentPreview
          code={`<Tooltip content="Delete this item permanently">
  <Button variant="danger" size="sm" icon={<IconTrash size={12} />} aria-label="Delete" />
</Tooltip>`}
        >
          <Tooltip content="Delete this item permanently">
            <Button variant="danger" size="sm" icon={<IconTrash size={12} />} aria-label="Delete" />
          </Tooltip>
        </ComponentPreview>
      }
      usage={{
        code: `import { Tooltip, Button } from '@/design-system';\n\n<Tooltip content="Helpful hint text">\n  <Button variant="secondary" size="sm">Hover me</Button>\n</Tooltip>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Positions</span>
            <div className="flex gap-10 items-center justify-center py-6">
              <StaticTooltip content="Top tooltip" position="top">
                <Button variant="secondary" size="sm">
                  Top
                </Button>
              </StaticTooltip>
              <StaticTooltip content="Bottom tooltip" position="bottom">
                <Button variant="secondary" size="sm">
                  Bottom
                </Button>
              </StaticTooltip>
              <StaticTooltip content="Left tooltip" position="left">
                <Button variant="secondary" size="sm">
                  Left
                </Button>
              </StaticTooltip>
              <StaticTooltip content="Right tooltip" position="right">
                <Button variant="secondary" size="sm">
                  Right
                </Button>
              </StaticTooltip>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Tooltip vs Popover 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          기준
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          Tooltip
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Popover
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">콘텐츠</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          텍스트만 (1~2줄)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          인터랙티브 (폼, 버튼, 메뉴)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">트리거</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">Hover 전용</td>
                        <td className="py-2 text-[var(--color-text-muted)]">Click 또는 Hover</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">인터랙션</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          비인터랙티브 (읽기 전용)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          인터랙티브 (클릭, 입력 가능)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">접근성</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          <code>role=&quot;tooltip&quot;</code>
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          <code>aria-haspopup=&quot;dialog&quot;</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>아이콘 전용 버튼에는 반드시 Tooltip으로 기능 설명을 제공합니다.</li>
                  <li>
                    텍스트가 말줄임(truncate)된 경우 hover 시 전체 텍스트를 Tooltip으로 표시합니다.
                  </li>
                  <li>Tooltip 텍스트는 최대 2줄로 제한하며, maxWidth는 240px입니다.</li>
                  <li>이미 충분히 설명적인 요소에는 Tooltip을 추가하지 않습니다.</li>
                  <li>delay를 적절히 설정하여 불필요한 Tooltip 표시를 방지합니다 (기본 200ms).</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 6×4px</code> · <code>radius: 4px</code> · <code>font-size: 11px</code> ·{' '}
          <code>min-width: 60px</code> · <code>max-width: 240px</code> · <code>arrow: 4px</code>
        </div>
      }
      apiReference={tooltipProps}
      relatedLinks={[
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Interactive overlay',
        },
        {
          label: 'Button',
          path: '/design/components/button',
          description: 'Icon button with tooltip',
        },
        { label: 'Badge', path: '/design/components/badge', description: 'Status with tooltip' },
      ]}
    />
  );
}
