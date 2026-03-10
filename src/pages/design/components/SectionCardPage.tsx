import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import {
  Button,
  SectionCard,
  VStack,
  HStack,
  Input,
  Select,
  Tabs,
  TabList,
  Tab,
  Table,
  SearchInput,
} from '@/design-system';
import { IconEdit } from '@tabler/icons-react';

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

const sectionCardProps: PropDef[] = [
  {
    name: 'isActive',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Active state with blue border',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'SectionCard.Header + Content',
  },
];

const sectionCardHeaderProps: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Section title' },
  { name: 'actions', type: 'ReactNode', required: false, description: 'Action buttons' },
  {
    name: 'showDivider',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show divider',
  },
  { name: 'description', type: 'string', required: false, description: 'Description text' },
];

const sectionCardContentProps: PropDef[] = [
  {
    name: 'showDividers',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Auto-insert dividers between children',
  },
  {
    name: 'gap',
    type: 'number',
    required: false,
    description: 'Gap between children (multiplied by 4px). Overrides default gap-3 (12px)',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Content children (DataRow or custom)',
  },
];

const sectionCardDataRowProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: true, description: 'Row label' },
  { name: 'value', type: 'string', required: false, description: 'Row value text' },
  { name: 'children', type: 'ReactNode', required: false, description: 'Custom value content' },
  {
    name: 'isLink',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Render as link',
  },
  { name: 'linkHref', type: 'string', required: false, description: 'Link destination' },
];

function SectionCardGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">구분</Th>
              <Th>설명</Th>
              <Th className="w-[160px]">사용 맥락</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default Section Card</strong>
              </Td>
              <Td>기본 형태. 읽기 전용 정보 표시에 사용</Td>
              <Td>Detail 페이지</Td>
            </tr>
            <tr>
              <Td>
                <strong>Open Section Card</strong>
              </Td>
              <Td>Create 페이지의 활성화된 스텝에 사용. 파란색 2px 테두리, 입력 필드 포함</Td>
              <Td>Create/Edit 페이지</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Default vs Open Section Card 비교</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">항목</Th>
              <Th>Default Section Card</Th>
              <Th>Open Section Card</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Border</Td>
              <Td>
                <code>1px default</code>
              </Td>
              <Td>
                <code>2px primary (blue)</code>
              </Td>
            </tr>
            <tr>
              <Td>Header ↔ Content gap</Td>
              <Td>
                <code>gap-3 (12px)</code>
              </Td>
              <Td>
                <code>gap-3 (12px)</code>
              </Td>
            </tr>
            <tr>
              <Td>Header divider</Td>
              <Td>
                <code>showDivider=true</code>
              </Td>
              <Td>
                <code>showDivider=false</code> (Content 내부로 이동)
              </Td>
            </tr>
            <tr>
              <Td>Content dividers</Td>
              <Td>
                <code>showDividers=true</code> (자동)
              </Td>
              <Td>
                <code>showDividers=false</code> (수동 관리)
              </Td>
            </tr>
            <tr>
              <Td>필드 간격</Td>
              <Td>
                <code>gap-3 (12px)</code> + divider
              </Td>
              <Td>
                <code>py-6 (24px)</code> per field
              </Td>
            </tr>
            <tr>
              <Td>라벨 스타일</Td>
              <Td>
                <code>text-label-sm</code> (11px)
              </Td>
              <Td>
                <code>text-label-lg</code> (13px)
              </Td>
            </tr>
            <tr>
              <Td>Footer 간격</Td>
              <Td>—</Td>
              <Td>
                <code>pt-3 (12px)</code> Next 버튼
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`Section Card
├── 1. Header
│   ├── a. Title (섹션 타이틀)
│   └── b. Action Button (선택적, Edit 등)
├── 2. Content
│   └── DataRow (반복)
│       ├── Label
│       └── Value (text / link / custom children)`}</pre>
        </div>

        <SubSectionTitle>1. Header 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. Title</Td>
              <Td>섹션의 목적을 나타내는 타이틀. 14px medium</Td>
            </tr>
            <tr>
              <Td>b. Action Button</Td>
              <Td>Edit 등 선택적 액션 버튼. 우측 상단 배치</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. Content 영역 — DataRow</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Label</Td>
              <Td>필드명. 11px medium, 보조 텍스트 색상</Td>
            </tr>
            <tr>
              <Td>Value (text)</Td>
              <Td>일반 텍스트 값. 12px regular</Td>
            </tr>
            <tr>
              <Td>Value (link)</Td>
              <Td>
                <code>isLink</code> prop으로 클릭 가능한 링크 형태로 표시
              </Td>
            </tr>
            <tr>
              <Td>Value (custom)</Td>
              <Td>
                <code>value</code> prop 대신 <code>children</code>으로 StatusIndicator, Chip 등
                커스텀 콘텐츠 삽입 가능
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>border-radius</code>
              </Td>
              <Td>6px (md)</Td>
            </tr>
            <tr>
              <Td>
                <code>header.height</code>
              </Td>
              <Td>32px</Td>
            </tr>
            <tr>
              <Td>
                <code>title</code>
              </Td>
              <Td>14px medium</Td>
            </tr>
            <tr>
              <Td>
                <code>label</code>
              </Td>
              <Td>11px medium</Td>
            </tr>
            <tr>
              <Td>
                <code>value</code>
              </Td>
              <Td>12px regular</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <SubSectionTitle>Open Section Card 상태 전환</SubSectionTitle>
        <Prose>
          <p>
            Open Section Card는 Create 페이지의 위자드(Wizard) 흐름에서 활성 스텝과 완료된 스텝
            사이를 전환한다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Active State</strong>
              </Td>
              <Td>파란색 2px 테두리. 입력 필드가 활성화됨. Footer 영역에 Next 버튼 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Collapsed State (Completed)</strong>
              </Td>
              <Td>기본 테두리로 복귀. 입력한 값이 읽기 전용 DataRow로 요약 표시됨</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '섹션 간의 관계가 명확하도록 타이틀을 구체적으로 작성한다.',
            '콘텐츠 간 구분이 필요한 경우 수평·수직 구분선을 활용한다.',
            'Detail 페이지에서 복수의 Section Card를 나열할 때는 Multiple Sections (Detail Page Layout) 패턴을 사용한다.',
          ]}
          dontItems={[
            '단순한 페이지 계층 표현이나 레이아웃 구성 목적으로 SectionCard를 사용하지 않는다.',
            'DataRow의 Label을 생략하지 않는다. Label이 없으면 값의 의미를 파악하기 어렵다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Title</strong>: 섹션이 담고 있는 정보 그룹을 명확하게 나타내는 명사형으로
              작성한다. (예: "Basic information", "Flavor", "Network")
            </li>
            <li>
              <strong>Label</strong>: 필드명은 간결하게 작성하되, 약어는 피한다. 사용자가
              레이블만으로 값의 의미를 파악할 수 있어야 한다.
            </li>
            <li>
              <strong>Value (빈 값 처리)</strong>: 값이 없을 경우 빈 칸 대신 <code>—</code> (em
              dash)로 표시한다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function SectionCardPage() {
  return (
    <ComponentPageTemplate
      title="Section Card"
      description="관련 있는 콘텐츠를 하나의 그룹으로 묶어 표시하는 카드 컨테이너 컴포넌트다. Detail, Create 등 다양한 페이지에서 정보를 논리적 단위로 구조화하는 데 사용한다."
      whenToUse={[
        '관련 있는 필드나 정보를 하나의 논리적 섹션으로 묶어야 할 때',
        'Detail 페이지에서 리소스의 속성 정보를 그룹 단위로 표시할 때',
        'Create/Edit 페이지에서 입력 영역을 단계별 또는 주제별로 구분할 때 (Open Section Card 변형 사용)',
      ]}
      whenNotToUse={[
        '단순 텍스트 블록이나 단일 항목만 표시하는 경우',
        '탭, 테이블, 차트처럼 복잡한 UI 전체를 감싸야 하는 경우',
      ]}
      preview={
        <ComponentPreview
          code={`<SectionCard>
  <SectionCard.Header title="Basic information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Instance name" value="web-server-01" />
    <SectionCard.DataRow label="Availability zone" value="nova" />
  </SectionCard.Content>
</SectionCard>`}
        >
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              <SectionCard.DataRow label="Instance name" value="web-server-01" />
              <SectionCard.DataRow label="Availability zone" value="nova" />
              <SectionCard.DataRow label="Description" value="Production web server" />
            </SectionCard.Content>
          </SectionCard>
        </ComponentPreview>
      }
      usage={{
        code: `import { SectionCard } from '@/design-system';

<SectionCard>
  <SectionCard.Header title="Basic information" actions={<Button>Edit</Button>} />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="instance-01" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" label="Active" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>`,
      }}
      examples={
        <VStack gap={8}>
          {/* Default with actions */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default Section Card — With Action Button</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Header에 Edit 버튼이 포함된 기본 형태. Detail 페이지에서 사용.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SectionCard>
                <SectionCard.Header
                  title="Basic information"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Instance name" value="web-server-01" />
                  <SectionCard.DataRow label="Availability zone" value="nova" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </VStack>

          {/* With link values */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Link Values</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                <code>isLink</code> prop으로 클릭 가능한 링크 형태로 값 표시.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SectionCard>
                <SectionCard.Header title="Flavor" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Flavor name"
                    value="m1.large"
                    isLink
                    linkHref="/flavors"
                  />
                  <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </VStack>

          {/* Multiple sections */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Multiple Sections (Detail Page Layout)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Detail 페이지에서 복수의 Section Card를 나열하는 패턴.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={4}>
                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Instance name" value="tk-test" />
                    <SectionCard.DataRow label="Availability zone" value="nova" />
                    <SectionCard.DataRow label="Description" value="—" />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Flavor" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Flavor name"
                      value="web-server-10"
                      isLink
                      linkHref="/flavors"
                    />
                    <SectionCard.DataRow
                      label="Spec"
                      value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1"
                    />
                  </SectionCard.Content>
                </SectionCard>

                <SectionCard>
                  <SectionCard.Header title="Image" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Image"
                      value="web-server-10"
                      isLink
                      linkHref="/images"
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </div>
          </VStack>

          {/* Open Section Card — Active */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Open Section Card — Active State</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Create 페이지 위자드에서 활성화된 스텝. 파란색 2px 테두리, 입력 필드 활성화, Next
                버튼 표시.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SectionCard isActive>
                <SectionCard.Header title="Basic information" showDivider={false} />
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <VStack gap={2} className="py-6">
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Instance name{' '}
                        <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                      </label>
                      <Input placeholder="Enter instance name" fullWidth />
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        2-64 characters, alphanumeric and hyphens only
                      </span>
                    </VStack>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <VStack gap={2} className="py-6">
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Availability zone{' '}
                        <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                      </label>
                      <Select
                        options={[
                          { value: 'nova', label: 'nova' },
                          { value: 'az-2', label: 'az-2' },
                        ]}
                        placeholder="Select AZ"
                        fullWidth
                      />
                    </VStack>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary">Next</Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </VStack>

          {/* Open Section Card — Collapsed */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Open Section Card — Collapsed State (Completed)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                기본 테두리로 복귀. 입력한 값이 읽기 전용 DataRow로 요약 표시됨.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SectionCard>
                <SectionCard.Header
                  title="Basic information"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Instance name" value="web-server-01" />
                  <SectionCard.DataRow label="Availability zone" value="nova" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </VStack>

          {/* Field Block example */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Field Block Pattern (복합 콘텐츠)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Open Section Card 내부에서 탭, 테이블, 검색 등 복합 UI를 포함하는 필드 블록 패턴.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SectionCard isActive>
                <SectionCard.Header title="Source" showDivider={false} />
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <VStack gap={3}>
                        <VStack gap={1}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Start source <span className="text-[var(--color-state-danger)]">*</span>
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Select a template to launch the instance.
                          </span>
                        </VStack>
                        <div className="mt-1">
                          <Tabs value="image" onChange={() => {}} variant="underline" size="sm">
                            <TabList>
                              <Tab value="image">Image</Tab>
                              <Tab value="snapshot">Instance snapshot</Tab>
                              <Tab value="volume">Bootable volume</Tab>
                            </TabList>
                          </Tabs>
                        </div>
                        <SearchInput
                          placeholder="Search images by attributes"
                          value=""
                          onChange={() => {}}
                          size="sm"
                          className="w-[var(--search-input-width)]"
                        />
                        <Table
                          columns={[
                            { key: 'name', label: 'Name', flex: 2 },
                            { key: 'status', label: 'Status', flex: 1 },
                            { key: 'size', label: 'Size', flex: 1 },
                          ]}
                          data={[
                            { id: '1', name: 'ubuntu-24.04', status: 'Active', size: '2.4 GiB' },
                            { id: '2', name: 'rocky-9.3', status: 'Active', size: '1.8 GiB' },
                          ]}
                          rowKey="id"
                        />
                      </VStack>
                    </div>
                  </VStack>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<SectionCardGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>padding</code>
              </Td>
              <Td>16×12px</Td>
            </tr>
            <tr>
              <Td>
                <code>border-radius</code>
              </Td>
              <Td>6px (md)</Td>
            </tr>
            <tr>
              <Td>
                <code>header.height</code>
              </Td>
              <Td>32px</Td>
            </tr>
            <tr>
              <Td>
                <code>title</code>
              </Td>
              <Td>14px medium</Td>
            </tr>
            <tr>
              <Td>
                <code>label</code>
              </Td>
              <Td>11px medium</Td>
            </tr>
            <tr>
              <Td>
                <code>value</code>
              </Td>
              <Td>12px regular</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      apiReference={sectionCardProps}
      subComponentApis={[
        { name: 'SectionCard.Header', props: sectionCardHeaderProps },
        { name: 'SectionCard.Content', props: sectionCardContentProps },
        { name: 'SectionCard.DataRow', props: sectionCardDataRowProps },
      ]}
      relatedLinks={[
        {
          label: 'Detail Header',
          path: '/design/components/detail-header',
          description: '상세 페이지 헤더',
        },
        {
          label: 'Create Page',
          path: '/design/patterns/wizard',
          description: 'Create 페이지 위자드 패턴',
        },
      ]}
      notionPageId="30d9eddc34e6804ea054e30e637a09c3"
    />
  );
}
