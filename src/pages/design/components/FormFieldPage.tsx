import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
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

function FormFieldPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <VStack gap={2}>
          <SubSectionTitle>FormField 구성 규칙</SubSectionTitle>
          <Prose>
            <p>
              모든 폼 입력 요소는 <strong>FormField</strong> 컴포넌트로 감싸서 일관된 라벨, 설명,
              에러 메시지 표시를 보장합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Label</strong>: 필드의 용도를 명확히 설명. 필수 필드는{' '}
                <span className="text-[var(--color-state-danger)]">*</span> 표시.
              </li>
              <li>
                <strong>Description</strong> (선택): 라벨만으로 불충분한 경우 추가 설명 제공. 라벨
                바로 아래 4px 간격.
              </li>
              <li>
                <strong>HelperText</strong> (선택): 입력 형식/제약 조건 안내. Input 아래 8px 간격.
              </li>
              <li>
                <strong>ErrorMessage</strong>: 검증 실패 시 HelperText 상단에 추가 표시. danger
                색상. HelperText는 항상 유지.
              </li>
            </ul>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>Description vs HelperText 구분</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[120px]">구분</Th>
                <Th>Description</Th>
                <Th>HelperText</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>용도</strong>
                </Td>
                <Td>필드의 목적·맥락을 설명 (&quot;왜 이 값을 입력하는가&quot;)</Td>
                <Td>입력 형식·제약 조건을 안내 (&quot;어떻게 입력해야 하는가&quot;)</Td>
              </tr>
              <tr>
                <Td>
                  <strong>위치</strong>
                </Td>
                <Td>Label 아래, Input 위 (4px gap)</Td>
                <Td>Input 아래 (8px gap)</Td>
              </tr>
              <tr>
                <Td>
                  <strong>타이포</strong>
                </Td>
                <Td>text-body-md (12px/18px)</Td>
                <Td>text-body-sm (11px/16px)</Td>
              </tr>
              <tr>
                <Td>
                  <strong>예시</strong>
                </Td>
                <Td>&quot;이 인스턴스의 루트 비밀번호를 설정합니다&quot;</Td>
                <Td>&quot;8자 이상, 대문자·숫자 포함&quot;</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>폼 레이아웃 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>단일 컬럼</strong>: Create/Edit 폼의 기본 레이아웃. 필드를 세로로 배치.
              </li>
              <li>
                <strong>그룹핑</strong>: 관련 필드를 SectionCard 또는 Disclosure로 묶어 구조화.
              </li>
              <li>
                <strong>spacing=&quot;loose&quot;</strong>: Label ↔ Control 간격을 12px로 넓힌다.
                다음 컨트롤을 FormField로 감쌀 때 반드시 사용:
                <ul className="list-disc pl-5 space-y-0.5 mt-1">
                  <li>Checkbox (단독)</li>
                  <li>Radio / CheckboxGroup</li>
                  <li>Toggle</li>
                </ul>
              </li>
              <li>
                <strong>필드 순서</strong>: 필수 필드를 먼저, 선택 필드를 나중에 배치합니다.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <VStack gap={2}>
          <SubSectionTitle>검증 타이밍</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[160px]">시점</Th>
                <Th>동작</Th>
                <Th>예시</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Blur (포커스 해제)</strong>
                </Td>
                <Td>
                  값을 수정한 적 있는(touched) 필드만 형식/필수 검증 실행. 미접촉 필드는 무시.
                </Td>
                <Td>이름 필드에 타이핑 후 포커스 떠날 때</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Submit (제출)</strong>
                </Td>
                <Td>전체 폼에 대한 Global Validation 실행</Td>
                <Td>Create/Save 버튼 클릭 시</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Tab 전환 (Soft)</strong>
                </Td>
                <Td>현재 탭의 필수 필드 검증 실행. 에러를 표시하되 탭 전환은 차단하지 않음.</Td>
                <Td>Multi Tab Create에서 다른 탭으로 이동할 때</Td>
              </tr>
              <tr>
                <Td>
                  <strong>타이핑 중</strong>
                </Td>
                <Td>검증하지 않음 (사용자 입력 방해 금지)</Td>
                <Td>—</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>에러 표시 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>표시 위치</strong>: ErrorMessage는 Input 하단, HelperText{' '}
                <strong>상단</strong>에 표시됩니다. HelperText는 숨기지 않고 항상 유지합니다.
              </li>
              <li>
                <strong>렌더링 순서</strong>: Input → ErrorMessage (danger) → HelperText (subtle).
                각 요소 간 8px 간격.
              </li>
              <li>
                <strong>ErrorMessage 스타일</strong>:{' '}
                <span className="font-mono">text-body-sm</span>,{' '}
                <span className="font-mono">text-[var(--color-state-danger)]</span> 색상,{' '}
                <span className="font-mono">role=&quot;alert&quot;</span>.
              </li>
              <li>
                <strong>HelperText 스타일</strong>: 에러 시에도{' '}
                <span className="font-mono">text-body-sm</span>,{' '}
                <span className="font-mono">text-[var(--color-text-subtle)]</span> 유지.
              </li>
              <li>
                <strong>Input 테두리</strong>: <span className="font-mono">error</span> prop으로
                테두리를 danger 색상으로 변경합니다.
              </li>
              <li>
                <strong>에러 해제</strong>: 사용자가 타이핑을 시작하면(onChange) 즉시 에러 상태를
                해제합니다. 재검증은 blur 시점에 수행.
              </li>
            </ul>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>Global Validation (Submit 시)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
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
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>에러 메시지 작성 규칙</SubSectionTitle>
          <Prose>
            <p>
              현재 예시는 영어이며, 향후 다국어(i18n) 지원 예정입니다. 에러 메시지 키는 번역 가능한
              형태로 관리합니다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>유형</Th>
                <Th>메시지 예시</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>필수 필드 미입력</Td>
                <Td>&quot;This field is required.&quot;</Td>
              </tr>
              <tr>
                <Td>형식 오류</Td>
                <Td>
                  &quot;Please enter a valid IP address.&quot; / &quot;Must be 2-64
                  characters.&quot;
                </Td>
              </tr>
              <tr>
                <Td>범위 초과</Td>
                <Td>&quot;Value must be between 1 and 100.&quot;</Td>
              </tr>
              <tr>
                <Td>중복</Td>
                <Td>&quot;This name is already in use.&quot;</Td>
              </tr>
              <tr>
                <Td>선택 미완료</Td>
                <Td>
                  &quot;Please select a region.&quot; / &quot;At least one item must be
                  selected.&quot;
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      </VStack>
    </VStack>
  );
}

export function FormFieldPage() {
  return (
    <ComponentPageTemplate
      title="Form field spacing"
      description="Standardized spacing for label + description + input combinations"
      whenToUse={[
        '입력 필드에 라벨, 설명, 도움말, 에러 메시지를 함께 제공할 때',
        '폼 컨트롤의 접근성(label-input 연결)을 보장할 때',
        'Input, Select, Checkbox, Radio, Toggle 등 모든 폼 컨트롤을 감쌀 때',
      ]}
      whenNotToUse={[
        '라벨 없이 인라인으로 입력 필드만 표시하는 경우 → Input 단독 사용',
        '버튼이나 링크 등 비-폼 요소에 라벨을 붙이는 경우',
      ]}
      preview={
        <ComponentPreview
          code={`<FormField label="Instance Name" helperText="2-64 characters">\n  <Input placeholder="e.g., web-server-01" fullWidth />\n</FormField>`}
        >
          <FormField label="Instance Name" helperText="2-64 characters">
            <Input placeholder="e.g., web-server-01" fullWidth />
          </FormField>
        </ComponentPreview>
      }
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
      guidelines={<FormFieldPageGuidelines />}
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
