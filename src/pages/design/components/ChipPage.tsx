import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Chip, SelectionIndicator, VStack } from '@/design-system';

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

function ChipGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ label text  |  value text  ×  ]
   ①               ②          ③`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th className="w-[160px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[240px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>①</Td>
              <Td>
                <strong>Label</strong>
              </Td>
              <Td>Chip이 나타내는 key 또는 카테고리명</Td>
              <Td>선택적 (key=value 패턴에서만 표시)</Td>
            </tr>
            <tr>
              <Td>②</Td>
              <Td>
                <strong>Value</strong>
              </Td>
              <Td>선택된 값 또는 텍스트</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>③</Td>
              <Td>
                <strong>Remove button (×)</strong>
              </Td>
              <Td>Chip 제거 액션 트리거</Td>
              <Td>삭제 가능한 Chip에만 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>label과 value 사이에는 구분선(divider)을 표시하여 시각적으로 구분한다.</p>
        </Prose>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <span className="font-mono">padding</span>
              </Td>
              <Td>8 × 4px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">gap</span>
              </Td>
              <Td>6px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">border-radius</span>
              </Td>
              <Td>6px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">font-size</span>
              </Td>
              <Td>11px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th>설명</Th>
              <Th>사용 예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Value only</strong>
              </Td>
              <Td>Value 텍스트만 표시하는 기본형</Td>
              <Td>
                단일 값 필터, 태그 표시 (<span className="font-mono">Active ×</span>)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Label + Value</strong>
              </Td>
              <Td>Label(key)과 Value를 구분선으로 나누어 함께 표시</Td>
              <Td>
                key=value 쌍 표시 (<span className="font-mono">Name | a ×</span>,{' '}
                <span className="font-mono">Status | Running ×</span>)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">State</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>기본 표시 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Selected</strong>
              </Td>
              <Td>Radio/Checkbox 선택 결과를 표현하는 Chip (파란 테두리 강조)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>
                상호작용 불가 상태. 텍스트·아이콘 모두 비활성 처리되며 Remove button도 비활성화
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Focused</strong>
              </Td>
              <Td>키보드 포커스 시 포커스 링 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hovered</strong>
              </Td>
              <Td>Remove button에 마우스 오버 시 버튼 영역 강조</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>텍스트 길이 제한</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Chip 내 텍스트가 지정된 최대 너비를 초과할 경우 말줄임(
                <span className="font-mono">…</span>)으로 처리한다.
              </li>
              <li>
                말줄임 처리된 Chip에는 Tooltip을 제공하여 전체 텍스트를 확인할 수 있도록 한다.
              </li>
              <li>최대 너비는 컨텍스트(필터 바, 인풋 필드 내부 등)에 따라 별도로 정의한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>최대 개수 제어 (+N more)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                화면 또는 컨테이너 내에 표시 가능한 Chip 수를 초과하면{' '}
                <span className="font-mono">+N more</span> 형태로 접어서 표시한다.
              </li>
              <li>
                <span className="font-mono">+N more</span> Chip을 클릭하면 나머지 항목을 펼쳐서
                확인할 수 있다.
              </li>
              <li>축약 기준(N)은 레이아웃 컨텍스트에 따라 다르게 적용할 수 있다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>제거(Remove) 동작</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Remove button(×) 클릭 시 해당 Chip이 즉시 제거된다.</li>
              <li>
                제거 후 남은 Chip들은 재배치되며, 모든 Chip이 제거된 경우 Chip 영역을 제거한다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>키보드 인터랙션</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">키</Th>
                <Th>동작</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>
                </Td>
                <Td>Chip 간 포커스 이동</Td>
              </tr>
              <tr>
                <Td>
                  <kbd>Backspace</kbd> / <kbd>Delete</kbd>
                </Td>
                <Td>포커스된 Chip 제거 (Removable Variant에 한함)</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '선택된 값이나 필터 조건처럼 사용자가 능동적으로 추가한 항목을 표시할 때 사용한다.',
            '한 컨텍스트에서 동일한 Variant를 일관되게 사용한다.',
            '텍스트가 잘릴 수 있는 환경에서는 항상 Tooltip을 함께 제공한다.',
            '많은 수의 Chip이 예상되는 경우 처음부터 +N more 패턴을 고려하여 레이아웃을 설계한다.',
          ]}
          dontItems={[
            '상태 표시(Status) 용도로 Chip을 사용하지 않는다 → Badge 사용',
            'Chip 하나에 너무 긴 문장을 담지 않는다. Chip은 값 식별을 위한 짧은 레이블이 적합하다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>텍스트 길이</strong>: 가능한 한 짧고 명확하게 작성한다. 단어 1~3개 수준이
              적합하다.
            </li>
            <li>
              <strong>Key=Value 패턴</strong>: Label(key)은 카테고리를 명확히 나타내고, Value는
              구체적인 값을 표시한다. 예: <span className="font-mono">Status | Running</span>,{' '}
              <span className="font-mono">Name | a</span>
            </li>
            <li>
              <strong>대소문자</strong>: 시스템 식별자(Kubernetes label 등)는 원래 형식 그대로
              표시하고, UI 레이블은 Sentence case를 기본으로 한다.
            </li>
            <li>
              <strong>+N more 레이블</strong>: <span className="font-mono">+3 more</span>처럼 숫자와
              more를 함께 표기한다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function ChipPage() {
  return (
    <ComponentPageTemplate
      title="Chip"
      description="사용자가 선택하거나 입력한 값을 태그 형태로 표시하는 인터랙티브 UI 요소로, 선택적으로 제거 버튼(X)을 포함할 수 있다."
      whenToUse={[
        '사용자가 선택/입력한 값을 태그 형태로 시각화해야 할 때',
        'label(key=value) 등 메타데이터 쌍을 표시할 때',
        '적용된 필터 조건을 개별 제거 가능한 형태로 표시할 때',
        '멀티셀렉트(Multi-select) 결과를 입력 필드 내부 또는 인접 영역에 나열할 때',
      ]}
      whenNotToUse={[
        '단순한 상태 표시가 목적이고 사용자 인터랙션(제거·클릭)이 필요 없을 때 → Badge 사용',
        '내비게이션 탭이나 카테고리 전환 용도로 사용하는 경우 → Tabs 사용',
        '클릭 시 페이지 이동이 일어나는 경우 → Link 또는 Button 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Chip value="Active" onRemove={() => {}} />
<Chip label="Name" value="a" onRemove={() => {}} />
<Chip label="Status" value="Running" onRemove={() => {}} />`}
        >
          <div className="flex gap-2 flex-wrap">
            <Chip value="Active" onRemove={() => {}} />
            <Chip label="Name" value="a" onRemove={() => {}} />
            <Chip label="Status" value="Running" onRemove={() => {}} />
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Value only</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Value 텍스트만 표시하는 기본형. 단일 값 필터, 태그 표시에 사용.
              </span>
            </VStack>
            <div className="flex gap-2 flex-wrap p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Chip value="Active" onRemove={() => {}} />
              <Chip value="Running" onRemove={() => {}} />
              <Chip value="production" onRemove={() => {}} />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Label + Value</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Label(key)과 Value를 구분선으로 나누어 함께 표시. key=value 쌍에 사용.
              </span>
            </VStack>
            <div className="flex gap-2 flex-wrap p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Chip label="Name" value="a" onRemove={() => {}} />
              <Chip label="Status" value="Running" onRemove={() => {}} />
              <Chip label="Region" value="us-west-2" onRemove={() => {}} />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Selected Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Radio/Checkbox 선택 결과를 표현하는 Chip. 파란 테두리로 강조.
              </span>
            </VStack>
            <div className="flex gap-2 flex-wrap p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Chip value="default-sg" variant="selected" onRemove={() => {}} />
              <Chip value="custom-group" variant="selected" onRemove={() => {}} />
              <Chip value="production" variant="selected" onRemove={() => {}} />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>States</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Default, Selected, Disabled 상태 비교.
              </span>
            </VStack>
            <div className="flex gap-4 items-start p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <Chip label="Name" value="a" onRemove={() => {}} />
              </VStack>
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Selected</span>
                <Chip value="default-sg" variant="selected" onRemove={() => {}} />
              </VStack>
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Disabled</span>
                <Chip label="Name" value="a" disabled />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Truncation with Max Width</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                텍스트가 최대 너비를 초과하면 말줄임 처리. Tooltip으로 전체 텍스트 확인 가능.
              </span>
            </VStack>
            <div className="flex gap-2 flex-wrap p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Chip
                value="very-long-label-name-that-gets-truncated"
                maxWidth="120px"
                onRemove={() => {}}
              />
              <Chip
                label="Annotation"
                value="kubernetes.io/very-long-annotation-value"
                maxWidth="160px"
                onRemove={() => {}}
              />
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>SelectionIndicator</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                테이블/리스트에서 선택된 항목을 Chip으로 표시하는 전용 컴포넌트. 에러 상태 및 개별
                제거를 지원한다.
              </span>
            </VStack>
            <VStack
              gap={4}
              className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]"
            >
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Empty</span>
                <SelectionIndicator />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">With Selection</span>
                <SelectionIndicator
                  selectedItems={[
                    { id: '1', label: 'default-sg' },
                    { id: '2', label: 'web-server-sg' },
                    { id: '3', label: 'database-sg' },
                  ]}
                  onRemove={() => {}}
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Error State</span>
                <SelectionIndicator error errorMessage="Selection is required" />
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      }
      guidelines={<ChipGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <span className="font-mono">padding: 8 × 4px</span> ·{' '}
          <span className="font-mono">gap: 6px</span> ·{' '}
          <span className="font-mono">border-radius: 6px</span> ·{' '}
          <span className="font-mono">font-size: 11px</span>
        </div>
      }
      relatedLinks={[
        {
          label: 'Badge',
          path: '/design/components/badge',
          description: '단순 상태 표시가 목적이고 인터랙션이 필요 없을 때 사용',
        },
        {
          label: 'Select',
          path: '/design/components/select',
          description: '멀티셀렉트 결과를 Chip으로 표시',
        },
        {
          label: 'Tooltip',
          path: '/design/components/tooltip',
          description: '말줄임 처리된 Chip의 전체 텍스트 표시',
        },
        {
          label: 'Table',
          path: '/design/components/table',
          description: 'SelectionIndicator와 함께 사용하는 데이터 테이블',
        },
      ]}
    />
  );
}
