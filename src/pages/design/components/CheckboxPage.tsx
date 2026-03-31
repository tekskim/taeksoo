import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import { Checkbox, CheckboxGroup, VStack } from '@/design-system';

const CHECKBOX_GUIDELINES = `## Overview

사용자가 하나 이상의 옵션을 선택하거나 해제할 수 있는 선택 컨트롤이다.
단일 선택(Single Checkbox)과 다중 선택(Checkbox Group) 두 가지 방식으로 사용되며, Table 내 행 선택에도 활용된다.

---

## Variants

| 구분 | 설명 |
| --- | --- |
| Single Checkbox | 단일 선택 컨트롤. 다른 선택 컨트롤과 독립적으로 사용 |
| Checkbox Group | 복수의 Checkbox를 묶어 관련 옵션을 나열하는 그룹 컨트롤 |

---

## Composition (구성 요소)

\`\`\`
┌──────────┐
│ Control  │ ── 6px gap ── Label
│ 16×16px  │     Description (optional)
└──────────┘
\`\`\`

| 요소 | 설명 | 제공 조건 |
| --- | --- | --- |
| Control (박스) | 선택 상태를 시각적으로 나타내는 16×16px 정사각형 영역. radius 4px | 항상 |
| Label | 체크박스의 목적을 설명하는 텍스트. 클릭 시 선택 상태 토글 가능 | 지정된 라벨이 있을 경우 항상 표시 |
| Description | 라벨 하단에 위치하는 보조 설명 텍스트 | 선택 (optional) |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| size | 16 × 16px |
| border-radius | 4px |
| gap (control ↔ label) | 6px |
| icon size (체크/대시) | 12px |

---

## States

| 상태 | 설명 |
| --- | --- |
| Unselected | 기본 상태. 아무것도 선택되지 않은 상태 |
| Selected (Checked) | 선택된 상태. 체크 아이콘 표시 |
| Indeterminate | Checkbox Group에서 일부 항목만 선택된 경우. 대시(–) 아이콘 표시 |
| Disabled | 비활성 상태. 사용자 인터랙션 불가 |
| Disabled + Checked | 비활성 상태이면서 선택된 상태 |
| Focused | 키보드 포커스 상태. 접근성 포커스 링 표시 |
| Hover | 마우스 오버 상태 |

---

## Behavior

### 선택 토글 정책
- Control 영역과 Label 텍스트 모두 클릭 영역으로 동작한다.
- 선택/해제는 클릭 또는 키보드 Space 키로 토글된다.

### Checkbox Group 전체 선택 정책
- 그룹 내 모든 항목이 선택 해제된 상태 → 상위 체크박스: Unselected
- 그룹 내 일부 항목만 선택된 상태 → 상위 체크박스: Indeterminate
- 그룹 내 모든 항목이 선택된 상태 → 상위 체크박스: Checked
- 상위 체크박스가 Checked 상태일 때 클릭 → 전체 해제 (Unselected)
- 상위 체크박스가 Unselected 또는 Indeterminate 상태일 때 클릭 → 전체 선택 (Checked)

### 레이아웃
- Checkbox Group의 기본 방향은 세로(vertical) 나열이다.
- 공간이 허용되는 경우 가로(horizontal) 배치를 선택할 수 있다.
- 각 옵션 간 간격은 일관되게 유지한다.

---

## Usage Guidelines

---

## Content Guidelines

- 라벨은 짧고 명확하게 작성하며, 선택 행위의 결과를 직접 설명한다.
- 부정문보다 긍정문으로 작성한다.
- Description은 라벨만으로 의미가 충분히 전달되지 않을 때에만 제공한다.
- Checkbox Group의 그룹 레이블은 명사형으로 작성한다.
- Indeterminate 상태의 상위 체크박스 라벨은 "전체 선택" 또는 이에 준하는 명확한 표현을 사용한다.

---

## Related

- Radio
- Toggle
- Select (Dropdown)
- Table
`;

export function CheckboxPage() {
  return (
    <ComponentPageTemplate
      title="Checkbox"
      description="사용자가 하나 이상의 옵션을 선택하거나 해제할 수 있는 선택 컨트롤. 단일 선택(Single Checkbox)과 다중 선택(Checkbox Group) 두 가지 방식으로 사용되며, Table 내 행 선택에도 활용된다."
      whenToUse={[
        'Single Checkbox: 약관 동의, 옵션 활성화 등 이진(yes/no) 선택이 필요할 때',
        'Checkbox Group: 여러 옵션 중 복수 선택이 가능한 경우',
      ]}
      whenNotToUse={[
        '하나의 옵션만 선택 가능한 경우 → Radio 사용',
        'On/Off의 즉각적인 상태 전환이 필요한 경우 → Toggle 사용',
        '5개 이상의 옵션을 나열하는 경우 → Select(Dropdown) 또는 Multi-select 사용 검토',
      ]}
      preview={
        <ComponentPreview code={`<Checkbox label="Label" defaultChecked />`}>
          <Checkbox label="Label" defaultChecked />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Layout</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Icon Only
                </span>
                <Checkbox defaultChecked />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Label
                </span>
                <Checkbox label="Label" defaultChecked />
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
                <Checkbox label="Label" checked={false} onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Selected
                </span>
                <Checkbox label="Label" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Indeterminate
                </span>
                <Checkbox label="Label" checked indeterminate onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Checkbox label="Label" disabled />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled + Checked
                </span>
                <Checkbox label="Label" checked disabled />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With description</Label>
            <Checkbox
              label="Email notifications"
              description="Receive email notifications for important updates"
              defaultChecked
            />
          </VStack>

          <VStack gap={3}>
            <Label>Checkbox group</Label>
            <div className="flex gap-8 items-start">
              <CheckboxGroup label="Select options" direction="vertical">
                <Checkbox label="Option 1" defaultChecked />
                <Checkbox label="Option 2" />
                <Checkbox label="Option 3" />
              </CheckboxGroup>
              <CheckboxGroup label="Horizontal layout" direction="horizontal">
                <Checkbox label="A" defaultChecked />
                <Checkbox label="B" />
                <Checkbox label="C" />
              </CheckboxGroup>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Group with Error</Label>
            <CheckboxGroup
              label="Required selection"
              description="Please select at least one option"
              error
              errorMessage="At least one option must be selected"
            >
              <Checkbox label="Option A" />
              <Checkbox label="Option B" />
            </CheckboxGroup>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={CHECKBOX_GUIDELINES} />
          <DosDonts
            doItems={[
              'Checkbox에 지정된 라벨이 있을 경우 라벨은 반드시 표시한다.',
              'Checkbox Group에는 명확한 그룹 레이블(legend)을 함께 제공한다.',
              '관련 있는 옵션끼리 하나의 Checkbox Group으로 묶는다.',
              'Indeterminate는 "전체 선택" 체크박스에 한정해 사용한다.',
            ]}
            dontItems={[
              '단독으로 On/Off 토글 목적으로 사용하지 않는다 → Toggle 사용.',
              '하나만 선택 가능한 옵션 그룹에 Checkbox를 사용하지 않는다 → Radio 사용.',
              '라벨 없이 Control만 단독으로 노출하지 않는다 (단, Table 내 행 선택 등 맥락이 명확한 경우 예외).',
              '선택지가 5개 이상인 경우 Checkbox 나열 대신 Select(Dropdown) 또는 Multi-select 사용을 검토한다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          size: 16×16px · radius: 4px · gap: 6px · icon: 12px
        </div>
      }
      relatedLinks={[
        { label: 'Radio', path: '/design/components/radio' },
        { label: 'Toggle', path: '/design/components/toggle' },
        { label: 'Select', path: '/design/components/select' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
