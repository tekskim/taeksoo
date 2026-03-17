import type { ReactNode } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Badge, BadgeList, Popover, VStack } from '@/design-system';

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

/* ── Static Popover (design preview, no interaction) ── */

function PopoverArrowTriangles({ position }: { position: 'top' | 'bottom' }) {
  if (position === 'bottom')
    return (
      <div className="relative inline-flex">
        <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[var(--color-border-default)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-surface-default)]" />
      </div>
    );
  return (
    <div className="relative inline-flex">
      <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[var(--color-border-default)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-surface-default)]" />
    </div>
  );
}

function PopoverShape({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] shadow-lg">
      {children}
    </div>
  );
}

function StaticPopover({
  content,
  position = 'top',
  children,
}: {
  content: ReactNode;
  position?: 'top' | 'bottom';
  children?: ReactNode;
}) {
  const arrow = (
    <div className={`flex justify-center ${position === 'top' ? '-mt-px' : '-mb-px'}`}>
      <PopoverArrowTriangles position={position} />
    </div>
  );

  const popover = (
    <div className="flex flex-col">
      {position === 'bottom' && arrow}
      <PopoverShape>{content}</PopoverShape>
      {position === 'top' && arrow}
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {position === 'top' && popover}
      {children}
      {position === 'bottom' && popover}
    </div>
  );
}

function PopoverPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>주요 사용처</strong>: BadgeList의 +N 인디케이터, Detail 페이지의
              Labels/Annotations 오버플로우 목록 표시.
            </li>
            <li>
              <strong>트리거</strong>: Hover (trigger=&quot;hover&quot;). delay 200ms, hideDelay
              150ms로 빠른 응답.
            </li>
            <li>
              <strong>콘텐츠 구조</strong>: 타이틀 (text-body-xs font-medium) + Badge 목록 (flex-col
              gap-1).
            </li>
            <li>
              <strong>크기</strong>: min-w-[120px] max-w-[320px], 패딩 12px.
            </li>
            <li>
              <strong>위치</strong>: 트리거 기준 자동 배치. 뷰포트 밖으로 나가면 반대 방향으로 flip.
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <DosDonts
        doItems={[
          'BadgeList 컴포넌트를 사용하면 Popover가 자동으로 포함됩니다.',
          '+N 인디케이터 hover 시 전체 목록을 보여주는 패턴으로 사용합니다.',
          'Popover 타이틀에 전체 개수를 표시합니다 (예: "All Labels (4)").',
          'Popover는 폼, 메뉴, 버튼 등 인터랙티브 콘텐츠를 지원합니다.',
        ]}
        dontItems={[
          'Popover를 범용 드롭다운/폼 컨테이너로 사용하지 않습니다.',
          'Popover 안에 또 다른 Popover를 중첩하지 않습니다.',
        ]}
      />
    </VStack>
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
      description="배열 데이터가 표시 가능한 수를 초과할 때, +N 인디케이터를 hover하면 전체 목록을 보여주는 오버레이"
      whenToUse={[
        'BadgeList의 +N 오버플로우 인디케이터에서 전체 목록을 hover로 표시할 때',
        'Detail 페이지의 Labels/Annotations 등 배열 값이 넘칠 때 전체 항목을 보여줄 때',
        '테이블 셀에서 잘린 배열 데이터의 전체 목록을 확인할 때',
      ]}
      whenNotToUse={[
        '텍스트 설명만 필요한 경우 → Tooltip 사용',
        '메뉴 아이템 목록을 표시하는 경우 → ContextMenu 사용',
        '복잡한 폼이나 상세 정보를 표시하는 경우 → Drawer 사용',
        '확인/결정이 필요한 액션인 경우 → Modal 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<BadgeList
  items={['app=nginx', 'env=production', 'team=backend', 'version=2.1']}
  maxVisible={2}
  maxBadgeWidth="120px"
  popoverTitle="All Labels (4)"
/>`}
        >
          <BadgeList
            items={['app=nginx', 'env=production', 'team=backend', 'version=2.1']}
            maxVisible={2}
            maxBadgeWidth="120px"
            popoverTitle="All Labels (4)"
          />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">STATIC PREVIEW</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                호버 없이 Popover 디자인을 확인할 수 있는 정적 미리보기.
              </span>
            </VStack>
            <div className="flex items-start gap-12 pt-4 pb-2">
              <StaticPopover
                position="top"
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All Labels (4)
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge theme="white" size="sm" className="w-fit">
                        app=nginx-ingress-controller
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        env=production
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        team=platform-engineering
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        version=2.1.0-rc1
                      </Badge>
                    </div>
                  </div>
                }
              />

              <StaticPopover
                position="bottom"
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All OSDs (4)
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge theme="white" size="sm" className="w-fit">
                        osd.4
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        osd.5
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        osd.6
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        osd.7
                      </Badge>
                    </div>
                  </div>
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                BASIC — 짧은 값 (OSDs, Status)
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                테이블 셀 안에서 배열 데이터를 여러 개의 Badge로 표시. maxBadgeWidth 불필요.
              </span>
            </VStack>
            <BadgeList
              items={['osd.4', 'osd.5', 'osd.6', 'osd.7']}
              maxVisible={2}
              popoverTitle="All OSDs (4)"
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                긴 값 (Labels, Tags)
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                긴 텍스트 뱃지는 maxBadgeWidth로 truncation. Popover에서 전체 텍스트 확인 가능.
              </span>
            </VStack>
            <BadgeList
              items={[
                'app=nginx-ingress-controller',
                'env=production',
                'team=platform-engineering',
                'version=2.1.0-rc1',
              ]}
              maxVisible={2}
              maxBadgeWidth="120px"
              popoverTitle="All Labels (4)"
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                Detail 페이지 Labels/Annotations
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                DetailHeader.InfoCard에서 Labels가 넘칠 때 +N hover로 전체 목록 표시.
              </span>
            </VStack>
            <div className="flex items-center gap-1 min-w-0">
              <Badge theme="white" size="sm">
                app=nginx
              </Badge>
              <Popover
                trigger="hover"
                position="bottom"
                delay={200}
                hideDelay={150}
                content={
                  <div className="p-3 min-w-[120px] max-w-[320px]">
                    <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                      All labels (3)
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge theme="white" size="sm" className="w-fit">
                        app=nginx
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        env=production
                      </Badge>
                      <Badge theme="white" size="sm" className="w-fit">
                        team=backend
                      </Badge>
                    </div>
                  </div>
                }
              >
                <span className="inline-flex shrink-0 items-center justify-center px-1.5 h-5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                  +2
                </span>
              </Popover>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<PopoverPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          padding: 12px · radius: 8px · border: 1px · arrow: 6px
        </div>
      }
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
