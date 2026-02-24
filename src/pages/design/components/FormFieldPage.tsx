import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import {
  Input,
  Select,
  NumberInput,
  FormField,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Toggle,
  HStack,
  VStack,
} from '@/design-system';

const formFieldProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Label text (simple API)' },
  {
    name: 'description',
    type: 'ReactNode',
    required: false,
    description: 'Description below label',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    required: false,
    description: 'Helper text below input',
  },
  { name: 'errorMessage', type: 'ReactNode', required: false, description: 'Error message' },
  { name: 'error', type: 'boolean', required: false, description: 'Error state' },
  { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state' },
  { name: 'required', type: 'boolean', required: false, description: 'Required field indicator' },
  {
    name: 'labelSize',
    type: "'sm' | 'md'",
    default: "'md'",
    required: false,
    description: 'Label size',
  },
  {
    name: 'spacing',
    type: "'default' | 'loose'",
    default: "'default'",
    required: false,
    description: 'Sub-component spacing',
  },
  { name: 'children', type: 'ReactNode', required: true, description: 'Form input element' },
];

export function FormFieldPage() {
  return (
    <ComponentPageTemplate
      title="Form field spacing"
      description="Standardized spacing for label + description + input combinations"
      preview={
        <ComponentPreview
          code={`<FormField label="Instance Name" helperText="2-64 characters">\n  <Input placeholder="e.g., web-server-01" fullWidth />\n</FormField>`}
        >
          <FormField label="Instance Name" helperText="2-64 characters">
            <Input placeholder="e.g., web-server-01" fullWidth />
          </FormField>
        </ComponentPreview>
      }
      usage={{
        code: `import { FormField, Input } from '@/design-system';\n\n<FormField label="Instance Name" helperText="2-64 characters">\n  <Input placeholder="e.g., web-server-01" fullWidth />\n</FormField>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Standard Pattern (Label → Input → Helper)</Label>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Input</span>
                <Input
                  label="Field label"
                  placeholder="Enter value"
                  helperText="Helper text below input"
                  width="md"
                />
              </VStack>
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Select</span>
                <Select
                  label="Field label"
                  options={[
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                  ]}
                  placeholder="Select option"
                  helperText="Helper text below select"
                  width="md"
                />
              </VStack>
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">NumberInput</span>
                <NumberInput
                  label="Field label"
                  defaultValue={0}
                  helperText="Helper text below stepper"
                  width="md"
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Description (Label → Description → Input)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Use FormField compound component for label → description → input order
            </p>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Input</span>
                <FormField>
                  <FormField.Label>Field Label</FormField.Label>
                  <FormField.Description>Description appears before input</FormField.Description>
                  <FormField.Control>
                    <Input placeholder="Enter value" width="md" />
                  </FormField.Control>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Select</span>
                <FormField>
                  <FormField.Label>Field Label</FormField.Label>
                  <FormField.Description>Description appears before select</FormField.Description>
                  <FormField.Control>
                    <Select
                      options={[
                        { value: '1', label: 'Option 1' },
                        { value: '2', label: 'Option 2' },
                      ]}
                      placeholder="Select option"
                      width="md"
                    />
                  </FormField.Control>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[240px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">NumberInput</span>
                <FormField>
                  <FormField.Label>Field Label</FormField.Label>
                  <FormField.Description>Description appears before stepper</FormField.Description>
                  <FormField.Control>
                    <NumberInput defaultValue={0} width="md" />
                  </FormField.Control>
                </FormField>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Both (Label → Description → Input → Helper)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Description explains the field purpose, Helper provides input format guidance
            </p>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[280px]">
                <FormField>
                  <FormField.Label>Instance Name</FormField.Label>
                  <FormField.Description>
                    Choose a unique name for your instance
                  </FormField.Description>
                  <FormField.Control>
                    <Input placeholder="e.g., web-server-01" fullWidth />
                  </FormField.Control>
                  <FormField.HelperText>
                    2-64 characters, letters, numbers, -_.
                  </FormField.HelperText>
                </FormField>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>RadioGroup (Label ↔ Options: 12px, Label ↔ Description: 4px)</Label>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Without Description
                </span>
                <RadioGroup
                  label="Select option"
                  options={[
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                  ]}
                />
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  With Description
                </span>
                <RadioGroup
                  label="Select option"
                  description="Choose one of the available options"
                  options={[
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                  ]}
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>CheckboxGroup (Label ↔ Options: 12px, Label ↔ Description: 4px)</Label>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Without Description
                </span>
                <CheckboxGroup label="Select options">
                  <Checkbox label="Option 1" />
                  <Checkbox label="Option 2" />
                </CheckboxGroup>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  With Description
                </span>
                <CheckboxGroup label="Select options" description="You can select multiple options">
                  <Checkbox label="Option 1" />
                  <Checkbox label="Option 2" />
                </CheckboxGroup>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Toggle (Label ↔ Toggle: 12px, Label ↔ Description: 4px)</Label>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Without Description
                </span>
                <FormField>
                  <FormField.Label>DHCP</FormField.Label>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <Toggle label="On" />
                  </FormField.Control>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  With Description
                </span>
                <FormField>
                  <FormField.Label>Admin state</FormField.Label>
                  <FormField.Description>
                    Set the administrative state of the resource
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <HStack gap={2} align="center">
                      <Toggle />
                      <span className="text-body-md text-[var(--color-text-default)]">Up</span>
                    </HStack>
                  </FormField.Control>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  With Description + Progressive Disclosure
                </span>
                <FormField>
                  <FormField.Label>Gateway</FormField.Label>
                  <FormField.Description>
                    Enable or disable the gateway for this subnet.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <VStack gap={3}>
                      <Toggle defaultChecked label="On" />
                      <Input placeholder="e.g. 192.168.0.1" fullWidth />
                    </VStack>
                  </FormField.Control>
                  <FormField.HelperText>
                    Gateway must be an IP address within the subnet range.
                  </FormField.HelperText>
                </FormField>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Progressive Disclosure (Radio 선택 시 입력 필드 표시)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Radio 선택에 따라 하위 입력 필드가 나타나는 패턴. 입력 필드는
              pl-[calc(var(--radio-size)+var(--radio-gap))]로 라벨 텍스트에 정렬합니다.
            </p>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[320px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Connection limit
                </span>
                <FormField>
                  <FormField.Label>Connection limit</FormField.Label>
                  <FormField.Description>
                    Maximum number of concurrent connections.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <VStack className="gap-[var(--radio-group-item-gap)]" align="start">
                      <Radio label="Unlimited" checked={false} onChange={() => {}} />
                      <Radio label="Limited" checked onChange={() => {}} />
                      <div className="pl-[calc(var(--radio-size)+var(--radio-gap))]">
                        <NumberInput defaultValue={1000} min={1} width="sm" />
                      </div>
                    </VStack>
                  </FormField.Control>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[320px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">MAC address</span>
                <FormField>
                  <FormField.Label>MAC address</FormField.Label>
                  <FormField.Description>
                    Choose auto-allocate or enter manually.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <VStack className="gap-[var(--radio-group-item-gap)]" align="start">
                      <Radio label="Auto-allocate" checked={false} onChange={() => {}} />
                      <Radio label="Manual" checked onChange={() => {}} />
                      <div className="pl-[calc(var(--radio-size)+var(--radio-gap))] w-full">
                        <Input placeholder="e.g. fa:16:3e:d7:f2:6c" fullWidth />
                      </div>
                    </VStack>
                  </FormField.Control>
                </FormField>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Validation States (Error + HelperText 동시 표시)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              검증 실패 시 ErrorMessage가 Input 하단, HelperText 상단에 추가로 표시됩니다.
              HelperText는 숨겨지지 않고 항상 유지됩니다.
            </p>
            <div className="flex flex-wrap gap-6 items-start">
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Error only</span>
                <FormField error>
                  <FormField.Label>
                    Instance Name <span className="text-[var(--color-state-danger)]">*</span>
                  </FormField.Label>
                  <FormField.Control>
                    <Input placeholder="e.g., web-server-01" fullWidth error />
                  </FormField.Control>
                  <FormField.ErrorMessage>This field is required.</FormField.ErrorMessage>
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Error + HelperText
                </span>
                <FormField
                  label="Instance Name"
                  helperText="2-64 characters, letters, numbers, -_."
                  errorMessage="This field is required."
                  error
                  required
                >
                  <Input placeholder="e.g., web-server-01" fullWidth />
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Description + Error + HelperText
                </span>
                <FormField
                  label="Password"
                  description="Set the root password for this instance"
                  helperText="Min 8 characters with uppercase, number."
                  errorMessage="Password must be at least 8 characters."
                  error
                  required
                >
                  <Input type="password" placeholder="Enter password" fullWidth />
                </FormField>
              </VStack>
              <VStack gap={1.5} className="max-w-[280px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Select with Error
                </span>
                <Select
                  label="Region"
                  error="Please select a region."
                  options={[
                    { value: '1', label: 'Seoul' },
                    { value: '2', label: 'Tokyo' },
                  ]}
                  placeholder="Select region"
                  fullWidth
                  required
                />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  FormField 구성 규칙
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  모든 폼 입력 요소는 <strong>FormField</strong> 컴포넌트로 감싸서 일관된 라벨,
                  설명, 에러 메시지 표시를 보장합니다.
                </p>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>Label</strong>: 필드의 용도를 명확히 설명. 필수 필드는{' '}
                    <span className="text-[var(--color-state-danger)]">*</span> 표시.
                  </li>
                  <li>
                    <strong>Description</strong> (선택): 라벨만으로 불충분한 경우 추가 설명 제공.
                    라벨 바로 아래 4px 간격.
                  </li>
                  <li>
                    <strong>HelperText</strong> (선택): 입력 형식/제약 조건 안내. Input 아래 8px
                    간격.
                  </li>
                  <li>
                    <strong>ErrorMessage</strong>: 검증 실패 시 HelperText 상단에 추가 표시. danger
                    색상. HelperText는 항상 유지.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Description vs HelperText 구분
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                          구분
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          Description
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          HelperText
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          용도
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          필드의 목적·맥락을 설명 (&quot;왜 이 값을 입력하는가&quot;)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          입력 형식·제약 조건을 안내 (&quot;어떻게 입력해야 하는가&quot;)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          위치
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          Label 아래, Input 위 (4px gap)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Input 아래 (8px gap)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          타이포
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          text-body-md (12px/18px)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          text-body-sm (11px/16px)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          예시
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          &quot;이 인스턴스의 루트 비밀번호를 설정합니다&quot;
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;8자 이상, 대문자·숫자 포함&quot;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  폼 레이아웃 정책
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>단일 컬럼</strong>: Create/Edit 폼의 기본 레이아웃. 필드를 세로로 배치.
                  </li>
                  <li>
                    <strong>그룹핑</strong>: 관련 필드를 SectionCard 또는 Disclosure로 묶어 구조화.
                  </li>
                  <li>
                    <strong>spacing=&quot;loose&quot;</strong>: 복잡한 필드(탭, 테이블 포함)에는
                    spacing=&quot;loose&quot;로 12px 간격을 적용.
                  </li>
                  <li>
                    <strong>필드 순서</strong>: 필수 필드를 먼저, 선택 필드를 나중에 배치합니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">검증 타이밍</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[160px]">
                          시점
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          동작
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Blur (포커스 해제)
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          값을 수정한 적 있는(touched) 필드만 형식/필수 검증 실행. 미접촉 필드는
                          무시.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          이름 필드에 타이핑 후 포커스 떠날 때
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Submit (제출)
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          전체 폼에 대한 Global Validation 실행
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Create/Save 버튼 클릭 시
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Tab 전환 (Soft)
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          현재 탭의 필수 필드 검증 실행. 에러를 표시하되 탭 전환은 차단하지 않음.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Multi Tab Create에서 다른 탭으로 이동할 때
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          타이핑 중
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          검증하지 않음 (사용자 입력 방해 금지)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">에러 표시 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>표시 위치</strong>: ErrorMessage는 Input 하단, HelperText{' '}
                    <strong>상단</strong>에 표시됩니다. HelperText는 숨기지 않고 항상 유지합니다.
                  </li>
                  <li>
                    <strong>렌더링 순서</strong>: Input → ErrorMessage (danger) → HelperText
                    (subtle). 각 요소 간 8px 간격.
                  </li>
                  <li>
                    <strong>ErrorMessage 스타일</strong>: <code>text-body-sm</code>,{' '}
                    <code>text-[var(--color-state-danger)]</code> 색상,{' '}
                    <code>role=&quot;alert&quot;</code>.
                  </li>
                  <li>
                    <strong>HelperText 스타일</strong>: 에러 시에도 <code>text-body-sm</code>,{' '}
                    <code>text-[var(--color-text-subtle)]</code> 유지.
                  </li>
                  <li>
                    <strong>Input 테두리</strong>: <code>error</code> prop으로 테두리를 danger
                    색상으로 변경합니다.
                  </li>
                  <li>
                    <strong>에러 해제</strong>: 사용자가 타이핑을 시작하면(onChange) 즉시 에러
                    상태를 해제합니다. 재검증은 blur 시점에 수행.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Global Validation (Submit 시)
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>모든 필수 필드와 형식 검증을 한 번에 수행합니다.</li>
                  <li>
                    첫 번째 오류 필드로 <strong>자동 스크롤</strong>하고 해당 필드에{' '}
                    <strong>포커스</strong>를 설정합니다.
                  </li>
                  <li>Multi Tab Create의 경우, 오류가 있는 탭으로 자동 이동합니다.</li>
                  <li>
                    Floating card의 Configuration 섹션에 오류가 있는 섹션을 시각적으로 표시합니다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  에러 메시지 작성 규칙
                </h4>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  현재 예시는 영어이며, 향후 다국어(i18n) 지원 예정입니다. 에러 메시지 키는 번역
                  가능한 형태로 관리합니다.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          유형
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          메시지 예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">
                          필수 필드 미입력
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;This field is required.&quot;
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">형식 오류</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;Please enter a valid IP address.&quot; / &quot;Must be 2-64
                          characters.&quot;
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">범위 초과</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;Value must be between 1 and 100.&quot;
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">중복</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;This name is already in use.&quot;
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">선택 미완료</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          &quot;Please select a region.&quot; / &quot;At least one item must be
                          selected.&quot;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <strong>Spacing:</strong>
          <br />
          • Input/Select/NumberInput: Label ↔ Input: 8px, Input ↔ HelperText: 8px
          <br />
          • FormField: Label ↔ Input: 8px, Label ↔ Description: 4px, Description ↔ Input: 8px, Input
          ↔ ErrorMessage: 8px, ErrorMessage ↔ HelperText: 8px, Input ↔ HelperText: 8px
          <br />
          • Radio/CheckboxGroup: Label ↔ Options: 12px, Label ↔ Description: 4px, Description ↔
          Options: 12px
          <br />
          • Toggle: Label ↔ Toggle: 12px, Label ↔ Description: 4px, Description ↔ Toggle: 12px
          <br />
          <br />
          <strong>Typography:</strong>
          <br />
          • Description (라벨 하단): text-body-md (12px/18px)
          <br />• HelperText (Input 하단): text-body-sm (11px/16px)
        </div>
      }
      apiReference={formFieldProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Label associated with input via htmlFor/id</li>
          <li>Error messages: role=&quot;alert&quot;</li>
          <li>Required fields: aria-required</li>
        </ul>
      }
      relatedLinks={[
        {
          label: 'Input',
          path: '/design/components/input',
          description: 'Text fields and form inputs',
        },
        {
          label: 'Select',
          path: '/design/components/select',
          description: 'Dropdown select component',
        },
        {
          label: 'Checkbox',
          path: '/design/components/checkbox',
          description: 'Selection control',
        },
      ]}
    />
  );
}
