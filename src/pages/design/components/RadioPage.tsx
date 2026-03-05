import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Radio, RadioGroup, VStack } from '@/design-system';

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
      description="상호 배타적인 옵션 중 하나를 선택하는 단일 선택 컨트롤이다. 사용자는 그룹 내에서 반드시 하나의 옵션만 선택할 수 있으며, 선택 상태는 항상 명확하게 표시된다."
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
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Icon Only</td>
                      <td className="py-2 text-[var(--color-text-muted)]">라벨 없이 컨트롤만</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">With Label</td>
                      <td className="py-2 text-[var(--color-text-muted)]">라벨과 함께 표시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Composition</h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Radio (단일)</h5>
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
                      <td className="py-2 text-[var(--color-text-muted)]">원형 라디오 버튼</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Dot</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택 시 내부 원</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Label</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택 항목 설명 (선택)</td>
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
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Control</td>
                      <td className="py-2 text-[var(--color-text-muted)]">16×16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Dot</td>
                      <td className="py-2 text-[var(--color-text-muted)]">6px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Border</td>
                      <td className="py-2 text-[var(--color-text-muted)]">2px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">gap</td>
                      <td className="py-2 text-[var(--color-text-muted)]">6px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Radio Group</h5>
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
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Group Label</td>
                      <td className="py-2 text-[var(--color-text-muted)]">그룹 전체 질문/제목</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Description</td>
                      <td className="py-2 text-[var(--color-text-muted)]">그룹 설명 (선택)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Radio Items</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택 가능한 Radio 목록
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Error Message</td>
                      <td className="py-2 text-[var(--color-text-muted)]">에러 시 표시</td>
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
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택됨 (내부 Dot 표시)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Disabled</td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        Disabled + Selected
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화 + 선택됨</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Focus</td>
                      <td className="py-2 text-[var(--color-text-muted)]">포커스 링</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Error</td>
                      <td className="py-2 text-[var(--color-text-muted)]">에러 상태 (그룹 레벨)</td>
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
                선택 정책: 그룹 내 하나만 선택 가능. 다른 옵션 선택 시 기존 선택이 해제된다.
              </p>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">키보드 인터랙션</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        키
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        동작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Tab</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        그룹 진입 (첫 선택 또는 첫 항목)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Shift + Tab</td>
                      <td className="py-2 text-[var(--color-text-muted)]">이전 포커스 영역으로</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">↑ / ←</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        이전 옵션으로 이동 및 선택
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">↓ / →</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        다음 옵션으로 이동 및 선택
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                레이아웃 정책: 수직(vertical) 배치를 기본으로 사용한다. 옵션이 2~3개일 때
                수평(horizontal) 배치도 가능하다.
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
                    <li>옵션이 2~5개이고 한눈에 비교할 필요가 있을 때 사용한다.</li>
                    <li>반드시 하나의 옵션이 선택된 상태로 기본값을 설정한다.</li>
                    <li>라벨은 간결하게 작성하고, 부가 설명은 description에 배치한다.</li>
                    <li>수직 배치를 기본으로 사용한다.</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                  <h5 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                    Don&apos;t ❌
                  </h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>옵션이 6개 이상인 경우 Radio 대신 Select를 사용한다.</li>
                    <li>여러 항목을 동시에 선택할 수 있는 경우 Checkbox를 사용한다.</li>
                    <li>선택이 optional인 경우 기본값 없이 Checkbox를 고려한다.</li>
                    <li>On/Off 즉시 전환이 필요한 경우 Toggle을 사용한다.</li>
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
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">라벨 작성 기준</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>각 Radio 라벨은 선택지를 명확히 구분한다.</li>
                <li>동일한 문법 구조로 작성하여 스캔하기 쉽게 한다.</li>
              </ul>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                Group Label 작성 기준
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>그룹 전체를 대표하는 질문 또는 제목 형태로 작성한다.</li>
                <li>예: &quot;배포 방식을 선택하세요&quot;, &quot;리전&quot;</li>
              </ul>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                Error Message 작성 기준
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>필수 선택인데 미선택 시 구체적인 안내를 제공한다.</li>
                <li>예: &quot;옵션을 하나 선택해 주세요&quot;</li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
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
        {
          label: 'Select',
          path: '/design/components/select',
          description: '4개 이상 드롭다운 선택',
        },
        { label: 'Checkbox', path: '/design/components/checkbox', description: '다중 선택' },
        { label: 'Toggle', path: '/design/components/toggle', description: 'On/Off 스위치' },
      ]}
    />
  );
}
