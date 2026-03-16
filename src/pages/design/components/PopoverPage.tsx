import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
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

function PopoverPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>주요 사용처</strong>: BadgeList의 <span className="font-mono">+N</span>{' '}
              인디케이터, Detail 페이지의 Labels/Annotations 오버플로우 목록 표시.
            </li>
            <li>
              <strong>트리거</strong>: Hover (
              <span className="font-mono">trigger=&quot;hover&quot;</span>). delay 100ms, hideDelay
              100ms로 빠른 응답.
            </li>
            <li>
              <strong>콘텐츠 구조</strong>: 타이틀 (
              <span className="font-mono">text-body-xs font-medium</span>) + Badge 목록 (
              <span className="font-mono">flex-col gap-1</span>).
            </li>
            <li>
              <strong>크기</strong>: <span className="font-mono">min-w-[120px] max-w-[320px]</span>,
              패딩 12px.
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
        ]}
        dontItems={[
          'Popover를 범용 드롭다운/폼 컨테이너로 사용하지 않습니다.',
          '인터랙티브 콘텐츠(버튼, 입력 필드)를 Popover에 넣지 않습니다.',
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
      usage={{
        code: `import { BadgeList } from '@/design-system';\n\n// BadgeList가 Popover를 내부적으로 사용\n<BadgeList\n  items={labels}\n  maxVisible={2}\n  maxBadgeWidth="120px"\n  popoverTitle={\`All Labels (\${labels.length})\`}\n/>`,
      }}
      examples={
        <VStack gap={8}>
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
                delay={100}
                hideDelay={100}
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
          <span className="font-mono">padding: 12px</span> ·{' '}
          <span className="font-mono">radius: 8px</span> ·{' '}
          <span className="font-mono">border: 1px</span> ·{' '}
          <span className="font-mono">arrow: 6px</span>
        </div>
      }
      apiReference={popoverProps}
      keyboardInteractions={[
        { key: 'Enter / Space', description: '트리거 요소로 Popover 열기/닫기' },
        { key: 'Escape', description: 'Popover를 닫고 트리거 요소로 포커스 복원' },
        { key: 'Tab', description: 'Popover 내 포커스 가능 요소 간 이동' },
      ]}
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
