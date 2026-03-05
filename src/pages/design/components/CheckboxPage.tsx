import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Checkbox, CheckboxGroup, VStack } from '@/design-system';

const checkboxProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Checkbox label' },
  {
    name: 'description',
    type: 'ReactNode',
    required: false,
    description: 'Description below label',
  },
  { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Partially selected state',
  },
  { name: 'error', type: 'boolean', default: 'false', required: false, description: 'Error state' },
  { name: 'errorMessage', type: 'string', required: false, description: 'Error message text' },
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
];

export function CheckboxPage() {
  return (
    <ComponentPageTemplate
      title="Checkbox"
      description="사용자가 하나 이상의 옵션을 선택하거나 해제할 수 있는 선택 컨트롤이다. 단일 선택(Single Checkbox)과 다중 선택(Checkbox Group) 두 가지 방식으로 사용되며, Table 내 행 선택에도 활용된다."
      whenToUse={[
        'Single Checkbox: 약관 동의, 옵션 활성화 등 이진(yes/no) 선택이 필요할 때',
        'Checkbox Group: 여러 옵션 중 복수 선택이 가능한 경우',
      ]}
      whenNotToUse={[
        '하나의 옵션만 선택 가능한 경우 → Radio 사용',
        'On/Off의 즉각적인 상태 전환이 필요한 경우 → Toggle 사용',
        '5개 이상의 옵션을 나열하는 경우 → Select(Dropdown) 또는 Multi-select 사용 검토',
      ]}
      keyboardInteractions={[
        { key: 'Space', description: 'Toggle checkbox checked/unchecked state' },
        { key: 'Tab', description: 'Move focus to next focusable element' },
      ]}
      preview={
        <ComponentPreview code={`<Checkbox label="Label" defaultChecked />`}>
          <Checkbox label="Label" defaultChecked />
        </ComponentPreview>
      }
      usage={{
        code: `import { Checkbox } from '@/design-system';\n\n<Checkbox label="Label" defaultChecked />`,
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
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Single Checkbox</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        단일 이진 선택 (약관 동의, 옵션 활성화 등)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Checkbox Group</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        복수 선택 (수직/수평 배치)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Composition</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Control + Label + Description(optional) 구조. 라벨 클릭으로도 체크 상태를 변경할 수
                있어야 한다.
              </p>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Elements</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Control</td>
                      <td className="py-2 text-[var(--color-text-muted)]">체크박스 박스 영역</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Label</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택 항목 설명 (필수)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Description</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        라벨 하단 보조 설명 (선택)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Design Tokens</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Token
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">size</td>
                      <td className="py-2 text-[var(--color-text-muted)]">16×16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">radius</td>
                      <td className="py-2 text-[var(--color-text-muted)]">4px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">gap</td>
                      <td className="py-2 text-[var(--color-text-muted)]">6px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">icon</td>
                      <td className="py-2 text-[var(--color-text-muted)]">12px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        State
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Unselected</td>
                      <td className="py-2 text-[var(--color-text-muted)]">미선택</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Selected</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택됨 (체크)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Indeterminate</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        일부 선택 (전체 선택 체크박스)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Disabled</td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        Disabled + Checked
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화 + 선택됨</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Focused</td>
                      <td className="py-2 text-[var(--color-text-muted)]">포커스 링</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Hover</td>
                      <td className="py-2 text-[var(--color-text-muted)]">호버 배경</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                선택 토글: 클릭 또는 Space로 체크/해제. Checkbox Group 전체 선택 시 &quot;전체
                선택&quot; 체크박스는 indeterminate로 일부 선택 상태를 표시한다.
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                레이아웃: 수직(vertical) 또는 수평(horizontal) 배치. 옵션이 많으면 수직 배치를
                권장한다.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                  <h5 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do ✅</h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>
                      라벨은 반드시 제공하며, 라벨 클릭으로도 체크 상태를 변경할 수 있게 한다.
                    </li>
                    <li>단일 체크박스는 약관 동의, 옵션 활성화 등 이진(yes/no) 선택에 사용한다.</li>
                    <li>
                      Checkbox Group은 &quot;전체 선택&quot; 시 indeterminate 상태를 표시한다.
                    </li>
                    <li>FormField와 함께 사용할 때는 spacing=&quot;loose&quot;를 적용한다.</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                  <h5 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                    Don&apos;t ❌
                  </h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>하나의 옵션만 선택 가능한 경우 Checkbox 대신 Radio를 사용한다.</li>
                    <li>On/Off 즉시 전환이 필요한 경우 Toggle을 사용한다.</li>
                    <li>5개 이상의 옵션을 나열할 때는 Select 또는 Multi-select 검토한다.</li>
                    <li>라벨 없이 체크박스만 노출하지 않는다 (Table 행 선택 제외).</li>
                  </ul>
                </div>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Content Guidelines
              </h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">라벨 작성</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>라벨은 선택 항목을 명확히 설명한다 (예: &quot;이메일 알림 받기&quot;).</li>
                <li>
                  긍정형 표현을 사용한다 (&quot;이메일 알림 받기&quot; vs &quot;이메일 알림 받지
                  않기&quot;).
                </li>
                <li>긴 설명은 description에 배치한다.</li>
                <li>약관 동의의 경우 &quot;동의합니다&quot; 형태로 명확히 작성한다.</li>
                <li>Checkbox Group 라벨은 그룹 전체를 대표하는 질문 형태로 작성한다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 6px</code> ·{' '}
          <code>icon: 12px</code>
        </div>
      }
      apiReference={checkboxProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Space: Toggle checked state</li>
          <li>Tab: Move focus</li>
          <li>Label must be associated for keyboard access</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Radio', path: '/design/components/radio', description: '단일 선택' },
        { label: 'Toggle', path: '/design/components/toggle', description: 'On/Off 스위치' },
        { label: 'Select', path: '/design/components/select', description: '드롭다운 단일 선택' },
        {
          label: 'Table',
          path: '/design/components/table',
          description: '행 선택 (Checkbox 내장)',
        },
      ]}
    />
  );
}
