import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, Badge, Tooltip, VStack } from '@/design-system';
import { IconTrash, IconStar, IconCopy } from '@tabler/icons-react';

export function TooltipPage() {
  return (
    <ComponentPageTemplate
      title="Tooltip"
      description="Contextual information on hover"
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
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
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

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 6×4px</code> · <code>radius: 4px</code> · <code>font-size: 11px</code> ·{' '}
            <code>min-width: 60px</code> · <code>max-width: 240px</code> · <code>arrow: 4px</code>
          </div>
        </VStack>

        {/* Positions */}
        <VStack gap={3}>
          <Label>Positions</Label>
          <div className="flex gap-6 items-center justify-center py-8">
            <Tooltip content="Top tooltip" position="top">
              <Button variant="secondary" size="sm">
                Top
              </Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" position="bottom">
              <Button variant="secondary" size="sm">
                Bottom
              </Button>
            </Tooltip>
            <Tooltip content="Left tooltip" position="left">
              <Button variant="secondary" size="sm">
                Left
              </Button>
            </Tooltip>
            <Tooltip content="Right tooltip" position="right">
              <Button variant="secondary" size="sm">
                Right
              </Button>
            </Tooltip>
          </div>
        </VStack>

        {/* Examples */}
        <VStack gap={3}>
          <Label>Use cases</Label>
          <div className="flex gap-4 items-center">
            <Tooltip content="Delete this item permanently">
              <Button
                variant="danger"
                size="sm"
                icon={<IconTrash size={12} />}
                aria-label="Delete"
              />
            </Tooltip>
            <Tooltip content="Add to favorites">
              <Button
                variant="ghost"
                size="sm"
                icon={<IconStar size={12} />}
                aria-label="Favorite"
              />
            </Tooltip>
            <Tooltip content="Copy to clipboard">
              <Button
                variant="secondary"
                size="sm"
                icon={<IconCopy size={12} />}
                aria-label="Copy"
              />
            </Tooltip>
            <Tooltip content="This action requires admin permissions" position="bottom">
              <Badge variant="warning" size="sm">
                Restricted
              </Badge>
            </Tooltip>
          </div>
        </VStack>

        {/* With Delay */}
        <VStack gap={3}>
          <Label>Custom delay</Label>
          <div className="flex gap-4 items-center">
            <Tooltip content="Instant (0ms)" delay={0}>
              <Button variant="outline" size="sm">
                0ms
              </Button>
            </Tooltip>
            <Tooltip content="Default (200ms)" delay={200}>
              <Button variant="outline" size="sm">
                200ms
              </Button>
            </Tooltip>
            <Tooltip content="Slow (500ms)" delay={500}>
              <Button variant="outline" size="sm">
                500ms
              </Button>
            </Tooltip>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
