import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Input, Textarea, NumberInput, SearchInput, VStack, HStack } from '@/design-system';
import { IconSearch, IconMail } from '@tabler/icons-react';

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

function InputPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <VStack gap={2}>
          <SubSectionTitle>Input 유형 선택 기준</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">유형</Th>
                <Th>사용 조건</Th>
                <Th>예시</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Input</strong>
                </Td>
                <Td>한 줄 텍스트 입력 (이름, IP, URL 등)</Td>
                <Td>Instance Name, IP Address</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Textarea</strong>
                </Td>
                <Td>여러 줄 텍스트 입력 (설명, 메모 등)</Td>
                <Td>Description, Notes</Td>
              </tr>
              <tr>
                <Td>
                  <strong>NumberInput</strong>
                </Td>
                <Td>숫자만 입력 (증감 버튼 포함)</Td>
                <Td>vCPU, Replica count, Port</Td>
              </tr>
              <tr>
                <Td>
                  <strong>SearchInput</strong>
                </Td>
                <Td>검색 전용 입력 (아이콘 포함, 300ms debounce 필터링)</Td>
                <Td>리스트 필터, 리소스 검색</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>Validation 정책</SubSectionTitle>
          <Prose>
            <p>
              상세 검증 정책(타이밍, 에러 표시·해제 규칙, 메시지 작성 규칙)은{' '}
              <strong>Form field spacing</strong> 섹션의 Validation States를 참조하세요.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>필수 필드</strong>: 라벨 옆에{' '}
                <span className="text-[var(--color-state-danger)]">*</span> 표시.
              </li>
              <li>
                <strong>에러 표시</strong>: Input 테두리를 danger 색상으로 변경하고 하단에
                ErrorMessage 표시. HelperText는 항상 유지.
              </li>
            </ul>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>Placeholder 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                입력 형식 예시를 표시합니다: <code>e.g. 192.168.0.1</code>,{' '}
                <code>e.g. my-instance</code>
              </li>
              <li>
                라벨을 반복하지 않습니다: 라벨이 &quot;Name&quot;이면 placeholder는
                &quot;Name&quot;이 아닌 <code>Enter instance name</code>
              </li>
              <li>필수/선택 여부를 placeholder에 표시하지 않습니다 (라벨의 * 표시로 충분).</li>
            </ul>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>Size 선택 기준</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>sm (28px)</strong>: Toolbar, 테이블 인라인 편집, Drawer 내부 등 밀집된 영역.
              </li>
              <li>
                <strong>md (32px)</strong>: 일반 폼 필드. Create/Edit 페이지의 기본 크기.
              </li>
              <li>
                <strong>lg (40px)</strong>: 로그인, 단독 입력 화면 등 강조가 필요한 경우.
              </li>
            </ul>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>readOnly vs disabled 구분</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>readOnly</strong>: 값을 표시하되 복사가 가능해야 하는 경우 (e.g. 자동 생성된
                ID, API endpoint). 포커스 가능, 텍스트 선택/복사 가능.
              </li>
              <li>
                <strong>disabled</strong>: 현재 맥락에서 입력이 불가능한 경우 (e.g. 다른 필드에
                의존, 권한 부족). 포커스 불가, Tooltip으로 비활성 이유를 안내.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <DosDonts
        doItems={[
          '모든 Input은 FormField로 감싸서 라벨, 도움말, 에러를 일관되게 제공합니다.',
          '입력 형식이 특정한 경우 helperText로 형식을 안내합니다.',
          '관련 있는 필드는 그룹으로 묶어 시각적 연관성을 제공합니다.',
          '비밀번호 등 민감 정보는 type="password"를 사용합니다.',
        ]}
        dontItems={[
          'placeholder를 라벨 대용으로 사용하지 않습니다 (입력 시 사라짐).',
          '타이핑 중에 실시간 에러를 표시하지 않습니다 (blur 시 검증).',
          'disabled 상태의 이유를 설명 없이 비활성화하지 않습니다.',
          '숫자만 입력받는 필드에 일반 Input을 사용하지 않습니다 (NumberInput 사용).',
        ]}
      />
    </VStack>
  );
}

const inputProps: PropDef[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Input size',
  },
  {
    name: 'variant',
    type: "'default' | 'search' | 'code'",
    default: "'default'",
    required: false,
    description: 'Input variant',
  },
  {
    name: 'width',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full' | number",
    default: "'md'",
    required: false,
    description: 'Input width',
  },
  {
    name: 'error',
    type: 'string | boolean',
    required: false,
    description: 'Error state or message',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Full width input',
  },
  { name: 'leftElement', type: 'ReactNode', required: false, description: 'Left element (icon)' },
  {
    name: 'rightElement',
    type: 'ReactNode',
    required: false,
    description: 'Right element (icon/button)',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Required field',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
];

export function InputPage() {
  return (
    <ComponentPageTemplate
      title="Input"
      description="Text fields, textarea, number input, and search"
      preview={
        <ComponentPreview code={`<Input placeholder="Enter text..." width="md" />`}>
          <Input placeholder="Enter text..." width="md" />
        </ComponentPreview>
      }
      usage={{
        code: `import { Input } from '@/design-system';\n\n<Input placeholder="Enter text..." width="md" />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Text Input - Status</Label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Placeholder
                </span>
                <Input placeholder="Input placeholder" className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Value
                </span>
                <Input defaultValue="Input value" className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Focus
                </span>
                <Input
                  defaultValue="Input focus"
                  className="w-full border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Read-only
                </span>
                <Input defaultValue="Input read-only" readOnly className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Input defaultValue="Input disabled" disabled className="w-full" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Error
                </span>
                <Input defaultValue="Input error" error="Error message" className="w-full" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Text Input - Sizes (Height)</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  SM (28px)
                </span>
                <Input size="sm" placeholder="Input placeholder" width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  MD (32px)
                </span>
                <Input size="md" placeholder="Input placeholder" width="md" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Text Input - Width</Label>
            <div className="flex flex-wrap gap-4 items-end">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  XS (80px)
                </span>
                <Input placeholder="XS" width="xs" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  SM (160px)
                </span>
                <Input placeholder="Small" width="sm" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  MD (240px)
                </span>
                <Input placeholder="Medium" width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  LG (360px)
                </span>
                <Input placeholder="Large" width="lg" />
              </VStack>
            </div>
            <VStack gap={1} className="w-1/2">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Half (50%)
              </span>
              <Input placeholder="Half width" width="half" />
            </VStack>
            <VStack gap={1} className="w-full">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Full (100%)
              </span>
              <Input placeholder="Full width" width="full" />
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Labels & Validation</Label>
            <div className="flex flex-wrap gap-4 items-start">
              <Input label="Label" placeholder="Enter text..." width="md" />
              <Input
                label="With helper"
                placeholder="Email"
                helperText="We'll never share your email"
                width="md"
              />
              <Input
                label="With error"
                placeholder="Username"
                error="Username is required"
                width="md"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With icons</Label>
            <div className="flex gap-4">
              <Input placeholder="Search..." leftElement={<IconSearch size={14} />} width="md" />
              <Input
                placeholder="Email"
                rightElement={<IconMail size={14} stroke={1.5} />}
                width="md"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With suffix (outside)</Label>
            <div className="flex gap-4 items-end">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Text suffix
                </span>
                <HStack gap={2} align="center">
                  <Input placeholder="0" width="sm" />
                  <span className="text-body-md text-[var(--color-text-default)]">Seconds</span>
                </HStack>
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Unit suffix
                </span>
                <HStack gap={2} align="center">
                  <Input placeholder="100" width="sm" />
                  <span className="text-body-md text-[var(--color-text-default)]">GiB</span>
                </HStack>
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Percentage
                </span>
                <HStack gap={2} align="center">
                  <Input placeholder="50" width="sm" />
                  <span className="text-body-md text-[var(--color-text-default)]">%</span>
                </HStack>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With suffix (inside)</Label>
            <div className="flex gap-4 items-end">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Text suffix
                </span>
                <Input
                  placeholder="0"
                  aria-describedby="suffix-seconds"
                  rightElement={
                    <span
                      id="suffix-seconds"
                      className="text-body-sm text-[var(--color-text-muted)]"
                    >
                      Seconds
                    </span>
                  }
                  className="w-[160px]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Unit suffix
                </span>
                <Input
                  placeholder="100"
                  aria-describedby="suffix-gib"
                  rightElement={
                    <span id="suffix-gib" className="text-body-sm text-[var(--color-text-muted)]">
                      GiB
                    </span>
                  }
                  className="w-[120px]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Percentage
                </span>
                <Input
                  placeholder="50"
                  aria-describedby="suffix-percent"
                  rightElement={
                    <span
                      id="suffix-percent"
                      className="text-body-sm text-[var(--color-text-muted)]"
                    >
                      %
                    </span>
                  }
                  className="w-[120px]"
                />
              </VStack>
            </div>
            <div className="text-body-xs text-[var(--color-text-subtle)] mt-1 p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>aria-describedby</code>로 suffix를 연결하면 스크린 리더가 &quot;100 GiB&quot;로
              읽습니다.
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Textarea</Label>
            <div className="flex gap-4">
              <Textarea placeholder="Input placeholder" className="w-[var(--search-input-width)]" />
              <Textarea
                defaultValue="Input value with multiple lines of text content"
                className="w-[var(--search-input-width)]"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Textarea - Code Variant</Label>
            <Textarea
              variant="code"
              placeholder="input user data"
              defaultValue={`input user data\n\n`}
              className="w-[var(--search-input-width)]"
            />
          </VStack>

          <VStack gap={3}>
            <Label>Number Input - States</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Default
                </span>
                <NumberInput defaultValue={1} width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Min/Max
                </span>
                <NumberInput defaultValue={5} min={0} max={10} width="md" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <NumberInput defaultValue={1} disabled width="md" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Number Input - Width</Label>
            <div className="flex flex-wrap gap-4 items-end">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  XS (80px)
                </span>
                <NumberInput defaultValue={1} width="xs" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  SM (160px)
                </span>
                <NumberInput defaultValue={1} width="sm" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Label, Helper & Suffix</Label>
            <VStack gap={2} className="max-w-[400px]">
              <VStack gap={1}>
                <span className="text-label-lg font-medium text-[var(--color-text-default)]">
                  Minimum Ready
                </span>
                <span className="text-body-sm text-[var(--color-text-muted)]">
                  The minimum time a pod must remain in a ready state before it is considered
                  available.
                </span>
              </VStack>
              <HStack gap={2} align="center">
                <NumberInput defaultValue={0} min={0} className="w-full" />
                <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                  Seconds
                </span>
              </HStack>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Search input</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  SM (28px)
                </span>
                <SearchInput
                  size="sm"
                  placeholder="Search placeholder"
                  className="w-[var(--search-input-width)]"
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Search Input - Status</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Placeholder
                </span>
                <SearchInput
                  placeholder="Search placeholder"
                  className="w-[var(--search-input-width)]"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Value
                </span>
                <SearchInput
                  defaultValue="Search value"
                  className="w-[var(--search-input-width)]"
                />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<InputPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 28/32px</code> · <code>padding: 10×8px</code> · <code>radius: 6px</code> ·{' '}
          <code>font: 11-12px</code> · <code>border: 1px → 2px focus</code>
        </div>
      }
      apiReference={inputProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Tab: Move focus to input</li>
          <li>Use aria-describedby for suffix/helper text</li>
          <li>Error state: role=&quot;alert&quot; for error messages</li>
        </ul>
      }
      relatedLinks={[
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label and input combinations',
        },
        {
          label: 'Filter Search Input',
          path: '/design/components/filter-search-input',
          description: 'Search with filters',
        },
        {
          label: 'Select',
          path: '/design/components/select',
          description: 'Dropdown select component',
        },
      ]}
    />
  );
}
