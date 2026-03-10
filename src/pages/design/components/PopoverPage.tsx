import type { ReactNode } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Badge, Button, HStack, Popover, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function PopoverPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <VStack gap={2}>
          <SubSectionTitle>Popover vs Tooltip vs Drawer 선택 기준</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>조건</Th>
                <Th>권장 컴포넌트</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>텍스트 설명만 필요, 비인터랙티브</Td>
                <Td>
                  <strong>Tooltip</strong>
                </Td>
              </tr>
              <tr>
                <Td>간단한 인터랙티브 콘텐츠 (폼 1~2개, 버튼)</Td>
                <Td>
                  <strong>Popover</strong>
                </Td>
              </tr>
              <tr>
                <Td>복잡한 폼 또는 상세 콘텐츠</Td>
                <Td>
                  <strong>Drawer</strong>
                </Td>
              </tr>
              <tr>
                <Td>확인/결정이 필요한 액션</Td>
                <Td>
                  <strong>Modal</strong>
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={4}>
          <SectionTitle>Usage Guidelines</SectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>트리거</strong>: Click(기본) 또는 Hover. 인터랙티브 콘텐츠는 반드시 Click
                트리거를 사용합니다.
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
                <strong>너비</strong>: 권장 너비 280px. 최대 viewport 너비의 50% 이내로 제한합니다.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <DosDonts
        doItems={[
          'Popover 내 콘텐츠는 간결하게 유지합니다 (필드 3개 이하).',
          '인터랙티브 콘텐츠에는 aria-haspopup="dialog"를 설정합니다.',
          'Hover 트리거 시 적절한 delay(200ms)를 설정하여 오작동을 방지합니다.',
        ]}
        dontItems={[
          'Popover 안에 또 다른 Popover를 중첩하지 않습니다.',
          '복잡한 폼(필드 4개 이상)을 Popover에 넣지 않습니다 (Drawer 사용).',
          'Hover 트리거로 인터랙티브 콘텐츠를 제공하지 않습니다 (Click 사용).',
        ]}
      />
    </VStack>
  );
}

function StaticPopover({
  content,
  position = 'bottom',
  showArrow = true,
  children,
}: {
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showArrow?: boolean;
  children: ReactNode;
}) {
  const popoverBox = (
    <div className="relative bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] shadow-lg">
      {content}
      {showArrow && position === 'top' && (
        <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[var(--color-border-default)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-surface-default)]" />
        </div>
      )}
      {showArrow && position === 'bottom' && (
        <div className="absolute -top-[7px] left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[var(--color-border-default)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-surface-default)]" />
        </div>
      )}
      {showArrow && position === 'left' && (
        <div className="absolute -right-[7px] top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-[var(--color-border-default)]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--color-surface-default)]" />
        </div>
      )}
      {showArrow && position === 'right' && (
        <div className="absolute -left-[7px] top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[var(--color-border-default)]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[var(--color-surface-default)]" />
        </div>
      )}
    </div>
  );

  if (position === 'top')
    return (
      <div className="flex flex-col items-center gap-2">
        {popoverBox}
        {children}
      </div>
    );
  if (position === 'bottom')
    return (
      <div className="flex flex-col items-center gap-2">
        {children}
        {popoverBox}
      </div>
    );
  if (position === 'left')
    return (
      <div className="flex items-center gap-2">
        {popoverBox}
        {children}
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      {children}
      {popoverBox}
    </div>
  );
}

const popoverProps: PropDef[] = [
  { name: 'content', type: 'ReactNode', required: true, description: 'Popover content' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Trigger element' },
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'bottom'",
    required: false,
    description: 'Position',
  },
  {
    name: 'trigger',
    type: "'click' | 'hover'",
    default: "'click'",
    required: false,
    description: 'Trigger type',
  },
  {
    name: 'delay',
    type: 'number',
    default: '200',
    required: false,
    description: 'Show delay (hover)',
  },
  {
    name: 'hideDelay',
    type: 'number',
    default: '150',
    required: false,
    description: 'Hide delay (hover)',
  },
  {
    name: 'showArrow',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show arrow',
  },
  { name: 'isOpen', type: 'boolean', required: false, description: 'Controlled open state' },
  {
    name: 'onOpenChange',
    type: '(isOpen: boolean) => void',
    required: false,
    description: 'Open state handler',
  },
  {
    name: 'closeOnOutsideClick',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Close on outside click',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Close on Escape',
  },
];

export function PopoverPage() {
  return (
    <ComponentPageTemplate
      title="Popover"
      description="Interactive overlay that can contain complex content"
      whenToUse={[
        '버튼 클릭 시 폼, 메뉴, 설정 등 인터랙티브 콘텐츠를 표시할 때',
        '컨텍스트에 따라 추가 정보를 제공하면서 사용자 인터랙션(입력, 선택)이 필요할 때',
        '메인 콘텐츠를 가리지 않으면서 보조 콘텐츠를 트리거 요소 근처에 표시할 때',
      ]}
      whenNotToUse={[
        '텍스트만 표시하고 인터랙션이 필요 없는 경우 → Tooltip 사용',
        '전체 화면을 차단하고 중요한 확인이 필요한 경우 → Modal 사용',
        '메뉴 아이템 목록만 표시하는 경우 → ContextMenu 사용',
        '긴 폼이나 상세 정보를 표시하는 경우 → Drawer 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Popover
  content={
    <div className="p-3">
      <VStack gap={2}>
        <p className="text-body-md">Popover content</p>
        <HStack gap={1.5}>
          <Badge theme="blue" type="subtle" size="sm">Info</Badge>
          <Badge theme="green" type="subtle" size="sm">Active</Badge>
          <Badge theme="gray" type="subtle" size="sm">v2.1</Badge>
        </HStack>
      </VStack>
    </div>
  }
  trigger="click"
>
  <Button variant="outline" size="sm">Click me</Button>
</Popover>`}
        >
          <Popover
            content={
              <div className="p-3">
                <VStack gap={2}>
                  <p className="text-body-md text-[var(--color-text-default)]">Popover content</p>
                  <HStack gap={1.5}>
                    <Badge theme="blue" type="subtle" size="sm">
                      Info
                    </Badge>
                    <Badge theme="green" type="subtle" size="sm">
                      Active
                    </Badge>
                    <Badge theme="gray" type="subtle" size="sm">
                      v2.1
                    </Badge>
                  </HStack>
                </VStack>
              </div>
            }
            trigger="click"
          >
            <Button variant="outline" size="sm">
              Click me
            </Button>
          </Popover>
        </ComponentPreview>
      }
      usage={{
        code: `import { Popover, Button } from '@/design-system';\n\n<Popover\n  content={<div className="p-3">Interactive content</div>}\n  trigger="click"\n  position="bottom"\n>\n  <Button variant="outline" size="sm">Open Popover</Button>\n</Popover>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Hover trigger</span>
            <div className="flex gap-4 items-start flex-wrap py-2">
              <StaticPopover
                content={
                  <div className="p-3">
                    <p className="text-body-md">Hover로 표시되는 비인터랙티브 정보 콘텐츠입니다.</p>
                  </div>
                }
                position="bottom"
              >
                <Button variant="outline" size="sm">
                  Hover me
                </Button>
              </StaticPopover>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Positions</span>
            <div className="flex gap-10 items-center justify-center py-4 flex-wrap">
              <StaticPopover
                content={<div className="p-3 text-body-md">Top popover</div>}
                position="top"
              >
                <Button variant="outline" size="sm">
                  Top
                </Button>
              </StaticPopover>
              <StaticPopover
                content={<div className="p-3 text-body-md">Bottom popover</div>}
                position="bottom"
              >
                <Button variant="outline" size="sm">
                  Bottom
                </Button>
              </StaticPopover>
              <StaticPopover
                content={<div className="p-3 text-body-md">Left popover</div>}
                position="left"
              >
                <Button variant="outline" size="sm">
                  Left
                </Button>
              </StaticPopover>
              <StaticPopover
                content={<div className="p-3 text-body-md">Right popover</div>}
                position="right"
              >
                <Button variant="outline" size="sm">
                  Right
                </Button>
              </StaticPopover>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<PopoverPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 12px</code> · <code>radius: 8px</code> · <code>border: 1px</code> ·{' '}
          <code>arrow: 6px</code>
        </div>
      }
      apiReference={popoverProps}
      relatedLinks={[
        { label: 'Tooltip', path: '/design/components/tooltip', description: 'Hover-only info' },
        {
          label: 'Context menu',
          path: '/design/components/context-menu',
          description: 'Action menu',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: 'Complex forms' },
      ]}
    />
  );
}
