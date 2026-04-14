import type { ReactNode } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { Badge, BadgeList, Button, Popover, Tooltip, VStack } from '@/design-system';
import { IconTrash } from '@tabler/icons-react';

const TOOLTIP_GUIDELINES = `## Overview

특정 UI 요소에 마우스를 올리거나 키보드 포커스가 이동했을 때 나타나는 짧은 설명 레이블. 사용자가 요소의 기능이나 의미를 빠르게 파악할 수 있도록 보조 정보를 제공하며, 인터랙션 없이 읽기 전용으로만 동작한다.

---

## Composition (구성 요소)

| 요소 | 설명 |
| --- | --- |
| Container | Tooltip의 배경 영역. 텍스트를 감싸는 박스 |
| Text | 보조 설명 문구. 최대 2줄, maxWidth 240px 이내 |
| Arrow | 트리거 요소를 가리키는 방향 표시 화살표 (4px) |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| padding | 6px 4px |
| border-radius | 4px |
| font-size | 11px |
| min-width | 60px |
| max-width | 240px |
| arrow size | 4px |

---

## Variants

| 구분 | 설명 |
| --- | --- |
| Default | 일반 텍스트 Tooltip. 기본 위치는 트리거 상단(top) |
| Badge Tooltip | +N 인디케이터 hover 시 Badge 목록을 표시하는 변형 |
| Position — Top | 트리거 요소 상단 중앙에 표시 |
| Position — Top Start | 트리거 요소 상단, 화살표가 왼쪽에 위치 |
| Position — Top End | 트리거 요소 상단, 화살표가 오른쪽에 위치 |
| Position — Bottom | 트리거 요소 하단 중앙에 표시 |
| Position — Bottom Start | 트리거 요소 하단, 화살표가 왼쪽에 위치 |
| Position — Bottom End | 트리거 요소 하단, 화살표가 오른쪽에 위치 |
| Position — Left | 트리거 요소 왼쪽에 표시 |
| Position — Right | 트리거 요소 오른쪽에 표시 |

> 화면 가장자리에 가까울 경우 자동으로 반대 방향으로 위치가 전환된다.

---

## States

| 상태 | 설명 |
| --- | --- |
| Hidden (기본) | Tooltip 표시하지 않음 |
| Visible | 트리거(hover) 또는 키보드 포커스 시 Tooltip 표시 |

---

## Behavior

### 표시 / 숨김 정책
- 트리거: 트리거 요소에 마우스를 올리거나(hover) 키보드 포커스가 이동하면 표시된다.
- 표시 지연(delay): 기본 200ms 딜레이 후 표시. 의도치 않은 노출을 방지한다.
- 숨김 조건: 마우스가 트리거 영역을 벗어나거나, 키보드 포커스가 이탈하거나, Escape 키를 누르면 즉시 사라진다.
- Hover 유지: Tooltip이 표시된 상태에서 마우스를 Tooltip 위로 이동해도 Tooltip은 닫히지 않는다.

### 위치 전환 정책
- 지정된 방향(top / bottom / left / right)에 공간이 충분하지 않을 경우, 반대 방향으로 자동 전환된다.
- Tooltip은 뷰포트 바깥으로 벗어나지 않도록 위치를 자동 보정한다.

### 크기 정책

| 속성 | 값 |
| --- | --- |
| min-width | 60px |
| max-width | 240px |
| 텍스트 최대 줄 수 | 2줄 |

---

## Usage Guidelines

### 선택 기준 — Default Tooltip vs Badge Tooltip

| 기준 | Default Tooltip | Badge Tooltip |
| --- | --- | --- |
| 콘텐츠 | 텍스트만 (1~2줄) | Badge 목록 (오버플로우 항목) |
| 트리거 | Hover 및 키보드 포커스 | +N 인디케이터 Hover |
| 인터랙션 | 비인터랙티브 (읽기 전용) | 비인터랙티브 (읽기 전용) |
| 접근성 역할 | role="tooltip" | aria-haspopup="dialog" |

---

## Content Guidelines

- 텍스트는 짧고 명확하게 작성한다. 문장보다는 명사구 또는 간결한 동사구 형태를 권장한다.
  - 예) 설정 저장, 전체 화면으로 보기, 클립보드에 복사
- 트리거 요소에 이미 표시된 텍스트를 그대로 반복하지 않는다.
- 문장 끝에 마침표를 붙이지 않는다.
- 아이콘 버튼의 경우 아이콘의 기술적 명칭을 사용하지 말고, 맥락에 맞는 설명으로 재작성한다.

`;

type TooltipDir =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

const ARROW_CLASS: Record<TooltipDir, string> = {
  top: 'absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[var(--color-text-default)]',
  'top-start':
    'absolute -bottom-[3px] left-[10px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[var(--color-text-default)]',
  'top-end':
    'absolute -bottom-[3px] right-[10px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[var(--color-text-default)]',
  bottom:
    'absolute -top-[3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[var(--color-text-default)]',
  'bottom-start':
    'absolute -top-[3px] left-[10px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[var(--color-text-default)]',
  'bottom-end':
    'absolute -top-[3px] right-[10px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[var(--color-text-default)]',
  left: 'absolute -right-[3px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-[var(--color-text-default)]',
  right:
    'absolute -left-[3px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[var(--color-text-default)]',
};

function TooltipShape({ content, direction }: { content: string; direction: TooltipDir }) {
  return (
    <div className="relative inline-flex items-center justify-center px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] bg-[var(--color-text-default)] text-[var(--color-surface-default)] text-[length:var(--tooltip-font-size)] rounded-[var(--tooltip-radius)] w-max max-w-[var(--tooltip-max-width)]">
      {content}
      <div className={ARROW_CLASS[direction]} />
    </div>
  );
}

function StaticTooltip({
  content,
  position = 'top',
  children,
}: {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}) {
  const tooltip = <TooltipShape content={content} direction={position} />;

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

/* ── Static Badge Tooltip (design preview, no interaction) ── */

function BadgeTooltipArrowTriangles({ position }: { position: 'top' | 'bottom' }) {
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

function BadgeTooltipShape({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-lg">
      {children}
    </div>
  );
}

function StaticBadgeTooltip({
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
      <BadgeTooltipArrowTriangles position={position} />
    </div>
  );

  const overlay = (
    <div className="flex flex-col">
      {position === 'bottom' && arrow}
      <BadgeTooltipShape>{content}</BadgeTooltipShape>
      {position === 'top' && arrow}
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {position === 'top' && overlay}
      {children}
      {position === 'bottom' && overlay}
    </div>
  );
}

function BadgeTooltipExamples() {
  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <VStack gap={1}>
          <span className="text-label-md text-[var(--color-text-default)]">STATIC PREVIEW</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            호버 없이 Badge tooltip 디자인을 확인할 수 있는 정적 미리보기.
          </span>
        </VStack>
        <div className="flex items-start gap-12 pt-4 pb-2">
          <StaticBadgeTooltip
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

          <StaticBadgeTooltip
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
            긴 텍스트 뱃지는 maxBadgeWidth로 truncation. Badge tooltip에서 전체 텍스트 확인 가능.
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
  );
}

export function TooltipPage() {
  return (
    <ComponentPageTemplate
      title="Tooltip"
      description="특정 UI 요소에 마우스를 올리거나 키보드 포커스가 이동했을 때 나타나는 짧은 설명 레이블. 사용자가 요소의 기능이나 의미를 빠르게 파악할 수 있도록 보조 정보를 제공하며, 인터랙션 없이 읽기 전용으로만 동작한다."
      whenToUse={[
        '아이콘 전용 버튼처럼 레이블이 없는 UI 요소의 기능을 설명해야 할 때',
        '말줄임(truncate) 처리된 텍스트의 전체 내용을 hover 시 보여줄 때',
        '보조적인 힌트 정보가 있어 레이아웃에 항상 표시하기 어려울 때',
        'Badge tooltip: BadgeList의 +N 오버플로우 인디케이터에서 전체 목록을 hover로 표시할 때',
        'Badge tooltip: Detail 페이지의 Labels/Annotations 등 배열 값이 넘칠 때 전체 항목을 보여줄 때',
      ]}
      whenNotToUse={[
        '메뉴 아이템 목록을 표시하는 경우 → ContextMenu 사용',
        '복잡한 폼이나 상세 정보를 표시하는 경우 → Drawer 사용',
        '확인/결정이 필요한 액션인 경우 → Modal 사용',
        '이미 레이블이나 설명 텍스트가 충분히 제공된 요소에 중복 Tooltip을 추가하지 않음',
      ]}
      preview={
        <VStack gap={8}>
          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">Default Tooltip</span>
            <ComponentPreview
              code={`<Tooltip content="Delete this item permanently">
  <Button variant="danger" size="sm" icon={<IconTrash size={12} />} aria-label="Delete" />
</Tooltip>`}
            >
              <Tooltip content="Delete this item permanently">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<IconTrash size={12} />}
                  aria-label="Delete"
                />
              </Tooltip>
            </ComponentPreview>
          </VStack>
          <VStack gap={2}>
            <span className="text-label-md text-[var(--color-text-default)]">Badge Tooltip</span>
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
          </VStack>
        </VStack>
      }
      examples={
        <VStack gap={12}>
          {/* ── Default Tooltip ── */}
          <VStack gap={8}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Default</h3>
            <VStack gap={3}>
              <span className="text-label-md text-[var(--color-text-default)]">Directions</span>
              <div className="grid grid-cols-3 gap-y-10 gap-x-4 items-center justify-items-center py-8 px-4">
                <div className="justify-self-start">
                  <TooltipShape content="Tooltip" direction="top-start" />
                </div>
                <div>
                  <TooltipShape content="Tooltip" direction="top" />
                </div>
                <div className="justify-self-end">
                  <TooltipShape content="Tooltip" direction="top-end" />
                </div>

                <div className="justify-self-start">
                  <TooltipShape content="Tooltip" direction="left" />
                </div>
                <div />
                <div className="justify-self-end">
                  <TooltipShape content="Tooltip" direction="right" />
                </div>

                <div className="justify-self-start">
                  <TooltipShape content="Tooltip" direction="bottom-start" />
                </div>
                <div>
                  <TooltipShape content="Tooltip" direction="bottom" />
                </div>
                <div className="justify-self-end">
                  <TooltipShape content="Tooltip" direction="bottom-end" />
                </div>
              </div>
            </VStack>

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

          {/* ── Badge Tooltip ── */}
          <VStack gap={8}>
            <VStack gap={2}>
              <h3 className="text-heading-h4 text-[var(--color-text-default)]">Badge Tooltip</h3>
              <span className="text-body-md text-[var(--color-text-muted)]">
                배열 데이터가 표시 가능한 수를 초과할 때, +N 인디케이터를 hover하면 전체 목록을
                보여주는 오버레이 변형.
              </span>
            </VStack>

            <BadgeTooltipExamples />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={10}>
          <VStack gap={6}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Default Tooltip</h3>
            <NotionRenderer markdown={TOOLTIP_GUIDELINES} />
            <DosDonts
              doItems={[
                '아이콘 전용 버튼에는 반드시 Tooltip으로 기능 설명을 제공한다.',
                '말줄임(truncate) 처리된 텍스트에 hover 시 전체 텍스트를 Tooltip으로 표시한다.',
                'Tooltip 텍스트는 핵심만 담아 간결하게 작성한다. (최대 2줄)',
                '표시 지연(delay)을 적절히 설정하여 불필요한 노출을 방지한다. (기본 200ms)',
                '기본 위치를 top으로 하되, 화면 가장자리에서는 자동 반전을 허용한다.',
              ]}
              dontItems={[
                'Tooltip 안에 링크, 버튼 등 인터랙티브 요소를 포함하지 않는다.',
                '이미 충분히 설명된 요소에 중복 Tooltip을 추가하지 않는다.',
                '사용자가 반드시 확인해야 하는 필수 정보를 Tooltip에만 담지 않는다.',
                '비활성화(disabled) 버튼에 Tooltip을 붙이지 않는다.',
              ]}
            />
          </VStack>

          <VStack gap={6}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Badge Tooltip</h3>
            <DosDonts
              doItems={[
                'BadgeList 컴포넌트를 사용하면 Badge tooltip이 자동으로 포함됩니다.',
                '+N 인디케이터 hover 시 전체 목록을 보여주는 패턴으로 사용합니다.',
                'Badge tooltip 타이틀에 전체 개수를 표시합니다 (예: "All Labels (4)").',
              ]}
              dontItems={['Badge tooltip 안에 또 다른 Badge tooltip을 중첩하지 않습니다.']}
            />
          </VStack>
        </VStack>
      }
      tokens={
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-md text-[var(--color-text-default)]">Default Tooltip</span>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              padding: 6×4px · radius: 4px · font-size: 11px · min-width: 60px · max-width: 240px ·
              arrow: 4px
            </div>
          </VStack>
          <VStack gap={1}>
            <span className="text-label-md text-[var(--color-text-default)]">Badge Tooltip</span>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
              padding: 12px · radius: 8px · border: 1px · arrow: 6px
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Button', path: '/design/components/button' },
        { label: 'Badge', path: '/design/components/badge' },
        {
          label: 'Context Menu',
          path: '/design/components/context-menu',
          description: 'Action menu',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: 'Complex forms' },
      ]}
    />
  );
}
