import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DocSection } from '../_shared/DocSection';
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
  FormField,
} from '@/design-system';
import { IconEdit } from '@tabler/icons-react';

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

export function SectionCardPage() {
  return (
    <ComponentPageTemplate
      title="Section card"
      description="Container component for grouping related content in detail views"
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
        code: `import { SectionCard } from '@/design-system';\n\n<SectionCard>\n  <SectionCard.Header title="Basic information" actions={<Button>Edit</Button>} />\n  <SectionCard.Content>\n    <SectionCard.DataRow label="Name" value="instance-01" />\n    <SectionCard.DataRow label="Status">\n      <StatusIndicator status="active" label="Active" />\n    </SectionCard.DataRow>\n  </SectionCard.Content>\n</SectionCard>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              With Action Buttons
            </span>
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
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With Link Values</span>
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
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Multiple Sections (Detail Page Layout)
            </span>
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
                  <SectionCard.DataRow label="Description" value="-" />
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
          </VStack>
        </VStack>
      }
      children={
        <DocSection
          id="open-section"
          title="Open Section Card"
          description="위자드(Create 페이지)에서 활성화된 섹션에 사용하는 패턴입니다. 일반 SectionCard와 간격 설정이 다릅니다."
        >
          <VStack gap={8}>
            {/* Spacing comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 pr-4">
                      항목
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 pr-4">
                      Default SectionCard
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2">
                      Open Section Card
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-default)]">
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">Border</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">1px default</code>
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">2px primary (blue)</code>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">Header ↔ Content gap</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">gap-3 (12px)</code>
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">gap-3 (12px)</code>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">Header divider</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">showDivider=true</code>
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">showDivider=false</code> (Content 내부로 이동)
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">Content dividers</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">showDividers=true</code> (자동)
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">showDividers=false</code> (수동 관리)
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">필드 간격</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">gap-3 (12px) + divider</code>
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">py-6 (24px)</code> per field
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-label-sm">라벨 스타일</td>
                    <td className="py-2 pr-4">
                      <code className="text-body-xs">text-label-sm (11px)</code>
                    </td>
                    <td className="py-2">
                      <code className="text-body-xs">text-label-lg (13px)</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-label-sm">Footer 간격</td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2">
                      <code className="text-body-xs">pt-3 (12px)</code> Next 버튼
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Live example */}
            <VStack gap={3}>
              <span className="text-label-md text-[var(--color-text-default)]">Active State</span>
              <ComponentPreview
                code={`<SectionCard isActive>
  <SectionCard.Header title="Basic information" showDivider={false} />
  <SectionCard.Content showDividers={false}>
    <VStack gap={0}>
      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

      <VStack gap={2} className="py-6">
        <label className="text-label-lg text-[var(--color-text-default)]">
          Instance name <span className="ml-1 text-[var(--color-state-danger)]">*</span>
        </label>
        <Input placeholder="Enter instance name" fullWidth />
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          2-64 characters, alphanumeric and hyphens only
        </span>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

      <VStack gap={2} className="py-6">
        <label className="text-label-lg text-[var(--color-text-default)]">
          Availability zone <span className="ml-1 text-[var(--color-state-danger)]">*</span>
        </label>
        <Select options={[...]} placeholder="Select AZ" fullWidth />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

      <HStack justify="end" className="pt-3">
        <Button variant="primary">Next</Button>
      </HStack>
    </VStack>
  </SectionCard.Content>
</SectionCard>`}
              >
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
              </ComponentPreview>
            </VStack>

            {/* Collapsed (done) state */}
            <VStack gap={3}>
              <span className="text-label-md text-[var(--color-text-default)]">
                Collapsed State (Completed)
              </span>
              <ComponentPreview
                code={`<SectionCard>
  <SectionCard.Header
    title="Basic information"
    actions={<Button variant="ghost" size="sm">Edit</Button>}
  />
  <SectionCard.Content>
    <SectionCard.DataRow label="Instance name" value="web-server-01" />
    <SectionCard.DataRow label="Availability zone" value="nova" />
  </SectionCard.Content>
</SectionCard>`}
              >
                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Instance name" value="web-server-01" />
                    <SectionCard.DataRow label="Availability zone" value="nova" />
                  </SectionCard.Content>
                </SectionCard>
              </ComponentPreview>
            </VStack>

            {/* Spacing diagram */}
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">간격 구조</h4>
                <pre className="text-body-xs text-[var(--color-text-muted)] font-[var(--font-family-mono)] leading-relaxed whitespace-pre">
                  {`헤더 타이틀 (28px)
 ↕ 12px (SectionCard gap-3)
디바이더 ─────────────────
 ↕ 24px (py-6)
폼 필드 1
 ↕ 24px (py-6)
디바이더 ─────────────────
 ↕ 24px (py-6)
폼 필드 2
 ↕ 24px (py-6)
디바이더 ─────────────────
 ↕ 12px (pt-3)
Next 버튼`}
                </pre>
              </VStack>
            </div>
          </VStack>

          {/* Field Block Pattern */}
          <VStack gap={3}>
            <span className="text-heading-h5 text-[var(--color-text-default)]">
              Field Block 패턴
            </span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              Open Section Card 내부에서 <strong>라벨 + 설명 + 복합 콘텐츠</strong> (탭, 테이블,
              검색, 페이지네이션 등)를 묶는 패턴입니다. 단일 Input/Select를 감싸는 FormField와 달리
              복잡한 UI 구조를 포함할 때 사용합니다.
            </span>
          </VStack>

          {/* Field Block vs FormField comparison */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Field Block vs FormField
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                        구분
                      </th>
                      <th className="text-left py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                        FormField
                      </th>
                      <th className="text-left py-2 text-label-sm text-[var(--color-text-muted)]">
                        Field Block
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-default)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">라벨 크기</td>
                      <td className="py-2 pr-4">
                        <code>text-label-sm</code> (11px)
                      </td>
                      <td className="py-2">
                        <code>text-label-lg</code> (13px)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">라벨 ↔ 콘텐츠 간격</td>
                      <td className="py-2 pr-4">8px (input-label-gap)</td>
                      <td className="py-2">
                        <strong>12px</strong> (gap-3)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">라벨 ↔ 탭 간격</td>
                      <td className="py-2 pr-4">—</td>
                      <td className="py-2">
                        <strong>16px</strong> (gap-3 + mt-1)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">콘텐츠 유형</td>
                      <td className="py-2 pr-4">단일 Input / Select / Toggle</td>
                      <td className="py-2">탭, 테이블, 검색, 필터, 동적 행 등 복합 UI</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">래퍼</td>
                      <td className="py-2 pr-4">
                        <code>{'<FormField>'}</code>
                      </td>
                      <td className="py-2">
                        <code>{'<VStack gap={3}>'}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          {/* Field Block spacing diagram */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">간격 구조</h4>
              <pre className="text-body-xs text-[var(--color-text-muted)] font-[var(--font-family-mono)] leading-relaxed whitespace-pre">
                {`VStack gap={3} (12px)
 ├─ VStack gap={1} (4px)     ← Label/Description 그룹
 │   ├─ span.text-label-lg   ← 라벨 (13px, medium)
 │   └─ span.text-body-md    ← 설명 (12px, optional)
 │
 ├─ Tabs (mt-1 → 12+4=16px)  ← 탭은 4px 추가 마진
 ├─ SearchInput               ← 12px gap
 └─ Table                     ← 12px gap`}
              </pre>
            </VStack>
          </div>

          {/* Field Block live example */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Field Block Example
            </span>
            <ComponentPreview
              code={`<SectionCard isActive>
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

          {/* 탭: mt-1로 16px 간격 확보 */}
          <div className="mt-1">
            <Tabs variant="underline" size="sm">...</Tabs>
          </div>
          <SearchInput ... />
          <Table ... />
        </VStack>
      </div>
    </VStack>
  </SectionCard.Content>
</SectionCard>`}
            >
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
                            Select a template to launch the instance. You can start from an OS
                            image, a snapshot, or an existing volume.
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
                            { key: 'name', title: 'Name', flex: 2 },
                            { key: 'status', title: 'Status', flex: 1 },
                            { key: 'size', title: 'Size', flex: 1 },
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
            </ComponentPreview>
          </VStack>

          {/* FormField comparison example */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              FormField (비교용)
            </span>
            <ComponentPreview
              code={`{/* FormField: 단일 Input 필드용 */}
<FormField label="Instance name" helperText="2-64 characters" required>
  <Input placeholder="Enter instance name" fullWidth />
</FormField>`}
            >
              <div className="w-full max-w-[400px]">
                <FormField label="Instance name" helperText="2-64 characters" required>
                  <Input placeholder="Enter instance name" fullWidth />
                </FormField>
              </div>
            </ComponentPreview>
          </VStack>
        </DocSection>
      }
      guidelines={
        <VStack gap={4}>
          <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
          <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>Detail Page에서 관련 정보를 그룹화하는 카드 컨테이너입니다.</li>
              <li>
                <strong>Header</strong>: 섹션 타이틀과 선택적 액션 버튼(Edit 등)을 포함합니다.
              </li>
              <li>
                <strong>DataRow</strong>: label-value 형태로 정보를 표시합니다. <code>isLink</code>
                로 클릭 가능한 링크를 제공합니다.
              </li>
              <li>
                <strong>복잡한 값</strong>: value prop 대신 <code>children</code>으로
                StatusIndicator, Chip 등 커스텀 콘텐츠를 표시합니다.
              </li>
              <li>
                하나의 SectionCard에는 <strong>최대 10개의 DataRow</strong>를 권장합니다. 초과 시
                SectionCard를 분리하세요.
              </li>
            </ul>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> ·{' '}
          <code>header.height: 32px</code> · <code>title: 14px medium</code> ·{' '}
          <code>label: 11px medium</code> · <code>value: 12px</code>
        </div>
      }
      apiReference={sectionCardProps}
      subComponentApis={[
        { name: 'SectionCard.Header', props: sectionCardHeaderProps },
        { name: 'SectionCard.Content', props: sectionCardContentProps },
        { name: 'SectionCard.DataRow', props: sectionCardDataRowProps },
      ]}
      relatedLinks={[
        {
          label: 'Detail header',
          path: '/design/components/detail-header',
          description: 'Page header for detail views',
        },
        {
          label: 'Disclosure',
          path: '/design/components/disclosure',
          description: 'Expandable sections',
        },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Form field with label',
        },
      ]}
    />
  );
}
