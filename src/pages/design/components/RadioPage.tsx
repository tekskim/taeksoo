import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { Radio, RadioGroup, VStack } from '@/design-system';

const RADIO_GUIDELINES = `## Overview

상호 배타적인 옵션 중 하나를 선택하는 단일 선택 컨트롤이다.
사용자는 그룹 내에서 반드시 하나의 옵션만 선택할 수 있으며, 선택 상태는 항상 명확하게 표시된다.

---

## Variants

| 구분 | 설명 |
| --- | --- |
| Icon Only | 라벨 없이 Radio 버튼만 단독으로 표시. 공간이 제한적이거나 외부 레이블로 의미가 명확할 때 사용 |
| With Label | Radio 버튼과 인라인 텍스트 라벨을 함께 표시. 일반적인 사용 형태 |

---

## Composition

### 1. Radio (단일)

| 요소 | 설명 |
| --- | --- |
| Control | 원형 선택 컨트롤. 크기 16×16px, 테두리 2px |
| Dot | 선택 상태를 나타내는 내부 원형 마커. 지름 6px |
| Label | 선택지를 설명하는 인라인 텍스트. Control과의 간격 6px |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| Control 크기 | 16×16px |
| Dot 지름 | 6px |
| Border 두께 | 2px |
| Control–Label 간격 | 6px |

### 2. Radio Group

| 요소 | 설명 |
| --- | --- |
| Group Label | 그룹 전체를 설명하는 제목 텍스트. 필드셋의 레전드 역할 |
| Description | 그룹 또는 개별 옵션에 대한 부가 설명 (선택적) |
| Radio Items | 개별 Radio 버튼의 목록 |
| Error Message | 유효성 검사 실패 시 표시되는 오류 안내 텍스트 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Unselected | 기본 상태. 선택되지 않은 Radio |
| Selected | 선택된 상태. 내부 Dot이 표시됨 |
| Disabled | 비활성 상태. 클릭·포커스 불가 |
| Disabled + Selected | 비활성이지만 선택된 상태로 고정 |
| Focus | 키보드 또는 포인터 포커스 상태. 포커스 링 표시 |
| Error | 그룹 유효성 검사 실패 상태 |

---

## Behavior

### 선택 정책
- 그룹 내에서 하나의 옵션만 선택 가능하다.
- 다른 옵션을 클릭하면 기존 선택이 즉시 해제되고 새 옵션이 선택된다.
- 이미 선택된 Radio를 다시 클릭해도 선택 해제되지 않는다.
- 기본값(default selection) 설정을 권장한다.

### 키보드 인터랙션

| 키 | 동작 |
| --- | --- |
| Tab | 그룹 전체로 포커스 이동 |
| Shift + Tab | 이전 포커스 영역으로 이동 |
| ↑ / ← | 이전 옵션으로 포커스 및 선택 이동 |
| ↓ / → | 다음 옵션으로 포커스 및 선택 이동 |

### 레이아웃 정책
- 수직(Vertical) 배치를 기본으로 사용한다.
- 수평(Horizontal) 배치는 옵션이 3개 이하이고, 각 라벨이 짧을 때 제한적으로 사용한다.

---

## Usage Guidelines

### Do ✅
- 옵션을 2–5개 범위 안에서 사용한다.
- 그룹에 반드시 Group Label을 제공하여 선택의 맥락을 명확히 한다.
- 기본값을 설정하여 사용자가 선택 없이 진행하는 상황을 방지한다.
- 수직 배치를 기본으로 사용하고, 옵션이 3개 이하·라벨이 짧을 때만 수평 배치를 고려한다.

### Don't ❌
- 단일 Radio를 단독으로 사용하지 않는다. 반드시 2개 이상의 그룹으로 구성한다.
- Checkbox를 대체하는 용도로 사용하지 않는다.
- 옵션 수가 6개 이상인 경우 Radio Group 대신 Select를 사용한다.
- 선택이 선택 사항(optional)인 경우 기본값 없이 Radio 사용을 고려하지 않는다 → Checkbox 사용.

---

## Content Guidelines

**라벨 작성 기준**
- 라벨은 명사 또는 명사구로 간결하게 작성한다.
- 옵션 간 문체와 형식을 일관되게 유지한다.
- 부가 설명이 필요한 경우 Description을 별도로 제공한다.

**Group Label 작성 기준**
- 그룹 전체를 대표하는 짧은 명사 또는 명사구로 작성한다.
- 예: 배포 방식, 알림 수신 설정, 플랜 선택

**Error Message 작성 기준**
- 무엇이 잘못되었는지와 어떻게 해결해야 하는지를 함께 안내한다.
- 예: 옵션을 선택해 주세요.

---

## Related

- Select
- Checkbox
- Toggle
`;

const radioProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Radio label' },
  {
    name: 'description',
    type: 'ReactNode',
    required: false,
    description: 'Description below label',
  },
  { name: 'value', type: 'string', required: true, description: 'Radio value' },
  { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    required: false,
    description: 'Change handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: false,
    description: 'Alternative to label prop',
  },
];

export function RadioPage() {
  return (
    <ComponentPageTemplate
      title="Radio"
      description="상호 배타적인 옵션 중 하나를 선택하는 단일 선택 컨트롤. 사용자는 그룹 내에서 반드시 하나의 옵션만 선택할 수 있으며, 선택 상태는 항상 명확하게 표시된다."
      whenToUse={[
        '옵션이 2–5개이고, 모든 선택지를 한눈에 비교할 필요가 있을 때',
        '선택지 중 하나가 반드시 선택된 상태여야 할 때',
        '사용자가 옵션을 나란히 비교하며 결정해야 할 때',
      ]}
      whenNotToUse={[
        '옵션이 6개 이상인 경우 → Select 사용',
        '여러 항목을 동시에 선택할 수 있는 경우 → Checkbox 사용',
        '즉시 On/Off를 전환하는 경우 → Toggle 사용',
        '선택이 선택 사항(optional)인 경우 → 기본값 없이 Checkbox 고려',
      ]}
      keyboardInteractions={[
        { key: 'Tab', description: 'Move focus to the radio group (first selected or first item)' },
        { key: 'Shift + Tab', description: 'Move focus to previous focus area' },
        { key: '↑ / ←', description: 'Move focus and selection to previous option' },
        { key: '↓ / →', description: 'Move focus and selection to next option' },
      ]}
      preview={
        <ComponentPreview
          code={`<RadioGroup label="Select one" defaultValue="option1">\n  <Radio label="Option 1" value="option1" />\n  <Radio label="Option 2" value="option2" />\n</RadioGroup>`}
        >
          <RadioGroup label="Select one" defaultValue="option1" direction="vertical">
            <Radio label="Option 1" value="option1" />
            <Radio label="Option 2" value="option2" />
          </RadioGroup>
        </ComponentPreview>
      }
      usage={{
        code: `import { Radio, RadioGroup } from '@/design-system';\n\n<RadioGroup label="Select one" defaultValue="option1">\n  <Radio label="Option 1" value="option1" />\n  <Radio label="Option 2" value="option2" />\n</RadioGroup>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Layout</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Icon Only
                </span>
                <Radio value="icon" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Label
                </span>
                <Radio label="Label" value="label" checked onChange={() => {}} />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Unselected
                </span>
                <Radio label="Label" value="unselected" checked={false} onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Selected
                </span>
                <Radio label="Label" value="selected" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Radio label="Label" value="disabled" disabled />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled + Selected
                </span>
                <Radio
                  label="Label"
                  value="disabled-selected"
                  checked
                  disabled
                  onChange={() => {}}
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Radio group</Label>
            <div className="flex gap-8 items-start">
              <RadioGroup label="Select one option" defaultValue="option1" direction="vertical">
                <Radio label="Option 1" value="option1" />
                <Radio label="Option 2" value="option2" />
                <Radio label="Option 3" value="option3" />
              </RadioGroup>
              <RadioGroup label="Horizontal layout" defaultValue="a" direction="horizontal">
                <Radio label="A" value="a" />
                <Radio label="B" value="b" />
                <Radio label="C" value="c" />
              </RadioGroup>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Group with Error</Label>
            <RadioGroup
              label="Required selection"
              description="Please select one option"
              error
              errorMessage="You must select an option"
            >
              <Radio label="Option A" value="a" />
              <Radio label="Option B" value="b" />
            </RadioGroup>
          </VStack>
        </VStack>
      }
      guidelines={<NotionRenderer markdown={RADIO_GUIDELINES} />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>size: 16×16px</code> · <code>dot: 6px</code> · <code>border: 2px</code> ·{' '}
          <code>gap: 6px</code>
        </div>
      }
      apiReference={radioProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Arrow keys: Navigate between options in group</li>
          <li>Space: Select focused option</li>
          <li>Tab: Move focus</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Select', path: '/design/components/select' },
        { label: 'Checkbox', path: '/design/components/checkbox' },
        { label: 'Toggle', path: '/design/components/toggle' },
      ]}
    />
  );
}
