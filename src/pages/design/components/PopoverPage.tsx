import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, Popover, VStack } from '@/design-system';

export function PopoverPage() {
  return (
    <ComponentPageTemplate
      title="Popover"
      description="Interactive overlay that can contain complex content"
      relatedLinks={[
        { label: 'Tooltip', path: '/design/components/tooltip', description: 'Hover-only info' },
        {
          label: 'Context menu',
          path: '/design/components/context-menu',
          description: 'Action menu',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: 'Complex forms' },
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
                  Popover vs Tooltip vs Drawer 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          조건
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          권장 컴포넌트
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          텍스트 설명만 필요, 비인터랙티브
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Tooltip
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          간단한 인터랙티브 콘텐츠 (폼 1~2개, 버튼)
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Popover
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          복잡한 폼 또는 상세 콘텐츠
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Drawer
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          확인/결정이 필요한 액션
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">Modal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>트리거</strong>: Click(기본) 또는 Hover. 인터랙티브 콘텐츠는 반드시
                    Click 트리거를 사용합니다.
                  </li>
                  <li>
                    <strong>닫기</strong>: 외부 클릭 또는 ESC 키로 닫힘.{' '}
                    <code>closeOnOutsideClick</code>, <code>closeOnEscape</code> 기본 true.
                  </li>
                  <li>
                    <strong>위치</strong>: 트리거 요소 기준으로 자동 배치. 뷰포트 밖으로 나가면 반대
                    방향으로 flip.
                  </li>
                  <li>
                    <strong>너비</strong>: 권장 너비 280px. 최대 viewport 너비의 50% 이내로
                    제한합니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 가이드라인 */}
        <VStack gap={3}>
          <Label>가이드라인</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Popover 내 콘텐츠는 간결하게 유지합니다 (필드 3개 이하).</li>
                <li>
                  인터랙티브 콘텐츠에는 <code>aria-haspopup=&quot;dialog&quot;</code>를 설정합니다.
                </li>
                <li>Hover 트리거 시 적절한 delay(200ms)를 설정하여 오작동을 방지합니다.</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">Don&apos;t</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Popover 안에 또 다른 Popover를 중첩하지 않습니다.</li>
                <li>복잡한 폼(필드 4개 이상)을 Popover에 넣지 않습니다 (Drawer 사용).</li>
                <li>Hover 트리거로 인터랙티브 콘텐츠를 제공하지 않습니다 (Click 사용).</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 12px</code> · <code>radius: 8px</code> · <code>border: 1px</code> ·{' '}
            <code>arrow: 6px</code>
          </div>
        </VStack>

        {/* Basic Usage */}
        <VStack gap={3}>
          <Label>Click trigger (default)</Label>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover
              content={
                <div className="p-3">
                  <p className="text-body-md">Click outside or press Escape to close</p>
                </div>
              }
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Click me
              </Button>
            </Popover>
          </div>
        </VStack>

        {/* Hover Trigger */}
        <VStack gap={3}>
          <Label>Hover trigger</Label>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover
              content={
                <div className="p-3">
                  <p className="text-body-md">Hover로 표시되는 비인터랙티브 정보 콘텐츠입니다.</p>
                </div>
              }
              trigger="hover"
            >
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </Popover>
          </div>
        </VStack>

        {/* Positions */}
        <VStack gap={3}>
          <Label>Positions</Label>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover
              content={<div className="p-3 text-body-md">Top popover</div>}
              position="top"
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Top
              </Button>
            </Popover>
            <Popover
              content={<div className="p-3 text-body-md">Bottom popover</div>}
              position="bottom"
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </Popover>
            <Popover
              content={<div className="p-3 text-body-md">Left popover</div>}
              position="left"
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Left
              </Button>
            </Popover>
            <Popover
              content={<div className="p-3 text-body-md">Right popover</div>}
              position="right"
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Right
              </Button>
            </Popover>
          </div>
        </VStack>

        {/* Interactive Content */}
        <VStack gap={3}>
          <Label>Interactive content</Label>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover
              content={
                <div className="p-3 w-[200px]">
                  <VStack gap={3}>
                    <p className="text-label-md">Quick actions</p>
                    <Button variant="secondary" size="sm" fullWidth>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" fullWidth>
                      Duplicate
                    </Button>
                    <Button variant="danger" size="sm" fullWidth>
                      Delete
                    </Button>
                  </VStack>
                </div>
              }
              trigger="click"
            >
              <Button variant="outline" size="sm">
                Menu popover
              </Button>
            </Popover>
          </div>
        </VStack>

        {/* Without Arrow */}
        <VStack gap={3}>
          <Label>Without arrow</Label>
          <div className="flex gap-4 items-center flex-wrap">
            <Popover
              content={<div className="p-3 text-body-md">No arrow variant</div>}
              trigger="click"
              showArrow={false}
            >
              <Button variant="outline" size="sm">
                No arrow
              </Button>
            </Popover>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
