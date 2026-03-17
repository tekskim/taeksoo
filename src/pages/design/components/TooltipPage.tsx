import type { ReactNode } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { Button, Tooltip, VStack } from '@/design-system';
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
| Position — Top | 트리거 요소 상단에 표시 |
| Position — Bottom | 트리거 요소 하단에 표시 |
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

### 선택 기준 — Tooltip vs Popover

| 기준 | Tooltip | Popover |
| --- | --- | --- |
| 콘텐츠 | 텍스트만 (1~2줄) | 인터랙티브 (폼, 버튼, 메뉴 등) |
| 트리거 | Hover 및 키보드 포커스 | Click 또는 Hover |
| 인터랙션 | 비인터랙티브 (읽기 전용) | 인터랙티브 (클릭, 입력 가능) |
| 접근성 역할 | role="tooltip" | aria-haspopup="dialog" |

---

## Content Guidelines

- 텍스트는 짧고 명확하게 작성한다. 문장보다는 명사구 또는 간결한 동사구 형태를 권장한다.
  - 예) 설정 저장, 전체 화면으로 보기, 클립보드에 복사
- 트리거 요소에 이미 표시된 텍스트를 그대로 반복하지 않는다.
- 문장 끝에 마침표를 붙이지 않는다.
- 아이콘 버튼의 경우 아이콘의 기술적 명칭을 사용하지 말고, 맥락에 맞는 설명으로 재작성한다.

`;

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

export function TooltipPage() {
  return (
    <ComponentPageTemplate
      title="Tooltip"
      description="특정 UI 요소에 마우스를 올리거나 키보드 포커스가 이동했을 때 나타나는 짧은 설명 레이블. 사용자가 요소의 기능이나 의미를 빠르게 파악할 수 있도록 보조 정보를 제공하며, 인터랙션 없이 읽기 전용으로만 동작한다."
      whenToUse={[
        '아이콘 전용 버튼처럼 레이블이 없는 UI 요소의 기능을 설명해야 할 때',
        '말줄임(truncate) 처리된 텍스트의 전체 내용을 hover 시 보여줄 때',
        '보조적인 힌트 정보가 있어 레이아웃에 항상 표시하기 어려울 때',
      ]}
      whenNotToUse={[
        '전달해야 하는 내용이 인터랙션(버튼, 링크, 폼 등)을 포함할 때 → Popover 사용',
        '2줄을 초과하는 긴 설명이 필요할 때 → Popover 또는 별도 안내 문구 사용',
        '이미 레이블이나 설명 텍스트가 충분히 제공된 요소에 중복 정보를 추가할 때',
        '비활성화(disabled) 상태의 버튼에 Tooltip을 붙여야 할 때 → 비활성 이유를 UI 내에 직접 안내하는 방식 권장',
      ]}
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
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          padding: 6×4px · radius: 4px · font-size: 11px · min-width: 60px · max-width: 240px ·
          arrow: 4px
        </div>
      }
      relatedLinks={[
        { label: 'Popover', path: '/design/components/popover' },
        { label: 'Button', path: '/design/components/button' },
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Select', path: '/design/components/select' },
      ]}
    />
  );
}
