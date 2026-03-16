import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';

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
import { ComponentPreview } from '../_shared/ComponentPreview';
import {
  VStack,
  HStack,
  SectionCard,
  FormField,
  Input,
  Select,
  Button,
  Badge,
} from '@/design-system';
import { IconCirclePlus, IconX } from '@tabler/icons-react';

const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'production', label: 'production' },
  { value: 'staging', label: 'staging' },
];

const TYPE_OPTIONS = [
  { value: 'ClusterIP', label: 'ClusterIP' },
  { value: 'NodePort', label: 'NodePort' },
  { value: 'LoadBalancer', label: 'LoadBalancer' },
];

function LabelsSection() {
  const [labels, setLabels] = useState([{ key: 'app', value: 'my-service' }]);

  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Labels & Annotations" />
      <SectionCard.Content>
        <VStack gap={6}>
          <FormField label="Labels">
            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={1.5}>
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Key
                    </span>
                    <span className="block text-label-sm text-[var(--color-text-default)]">
                      Value
                    </span>
                    <div />
                  </div>
                )}
                {labels.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
                    <Input
                      placeholder="key"
                      value={row.key}
                      onChange={(e) => {
                        const next = [...labels];
                        next[i] = { ...next[i], key: e.target.value };
                        setLabels(next);
                      }}
                      fullWidth
                    />
                    <Input
                      placeholder="value"
                      value={row.value}
                      onChange={(e) => {
                        const next = [...labels];
                        next[i] = { ...next[i], value: e.target.value };
                        setLabels(next);
                      }}
                      fullWidth
                    />
                    <button
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      onClick={() => setLabels(labels.filter((_, idx) => idx !== i))}
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={() => setLabels([...labels, { key: '', value: '' }])}
                  >
                    Add Label
                  </Button>
                </div>
              </VStack>
            </div>
          </FormField>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

function OpenFormPreview() {
  return (
    <VStack gap={4} className="w-full">
      <SectionCard className="pb-4">
        <SectionCard.Header title="Basic information" />
        <SectionCard.Content>
          <VStack gap={6}>
            <FormField
              label="Name"
              required
              helperText="2-64 characters, lowercase letters and hyphens only"
            >
              <Input placeholder="Enter resource name" fullWidth />
            </FormField>
            <FormField label="Namespace" required>
              <Select options={NAMESPACE_OPTIONS} placeholder="Select namespace" fullWidth />
            </FormField>
            <FormField label="Type" required helperText="Determines how the resource is exposed">
              <Select options={TYPE_OPTIONS} placeholder="Select type" fullWidth />
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <SectionCard className="pb-4">
        <SectionCard.Header title="Configuration" />
        <SectionCard.Content>
          <VStack gap={6}>
            <FormField label="Port" required>
              <Input placeholder="e.g. 8080" fullWidth />
            </FormField>
            <FormField label="Target Port" required>
              <Input placeholder="e.g. 80" fullWidth />
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <LabelsSection />
    </VStack>
  );
}

function OpenFormGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>When to use</SectionTitle>
        <Prose>
          <p>
            <strong>Use Open Form when:</strong> Fields are independent (no step-to-step
            dependencies), users benefit from seeing the full form at once, or the resource has
            5-20+ fields across 3-6 logical sections.
          </p>
          <p>
            <strong>Use Wizard instead when:</strong> Later sections depend on earlier choices
            (e.g., flavor options depend on selected image), or a summary/review step is needed
            before submission.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <SectionTitle>Spacing tokens</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Element</Th>
              <Th>Value</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Between SectionCards</strong>
              </Td>
              <Td>16px (gap-4)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Header divider → content</strong>
              </Td>
              <Td>16px (SectionCard gap-4)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Between form fields</strong>
              </Td>
              <Td>24px (gap-6)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Label → input</strong>
              </Td>
              <Td>8px (gap-2)</Td>
            </tr>
            <tr>
              <Td>
                <strong>SectionCard bottom padding</strong>
              </Td>
              <Td>16px (pb-4)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Content area padding</strong>
              </Td>
              <Td>pt-3 px-8 pb-20 (page level)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <SectionTitle>Implementation checklist</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1 text-[var(--color-text-default)]">
            <li>
              Wrap all SectionCards in <span className="font-mono">VStack gap={'{4}'}</span>
            </li>
            <li>
              Add <span className="font-mono">className=&quot;pb-4&quot;</span> to every{' '}
              <span className="font-mono">SectionCard</span> (16px bottom padding for Open Form
              only)
            </li>
            <li>
              Use <span className="font-mono">VStack gap={'{6}'}</span> inside Content for field
              spacing
            </li>
            <li>
              Do NOT use <span className="font-mono">isActive</span> on SectionCards
            </li>
            <li>Use FormField for all form inputs (label + control + helper text)</li>
            <li>Optional: Add SummarySidebar on the right with sticky positioning</li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <SectionTitle>Multi Tab Create</SectionTitle>
        <Prose>
          <p>
            Tab-based resource creation pattern allowing free navigation across categorized setting
            groups
          </p>
        </Prose>

        <SubSectionTitle>개요</SubSectionTitle>
        <VStack gap={4}>
          <VStack gap={2}>
            <SubSectionTitle>정의</SubSectionTitle>
            <Prose>
              <p>
                하나의 리소스를 생성하기 위한 여러 설정 카드를 <strong>탭에 나누어 배치</strong>
                함으로써, 사용자가 순서에 구애받지 않고 탭을 자유롭게 이동하며 정보를 입력할 수 있게
                하는 UX 패턴입니다.
              </p>
            </Prose>
          </VStack>
          <VStack gap={2}>
            <SubSectionTitle>레이아웃</SubSectionTitle>
            <Prose>
              <p>
                Multi-tab create 페이지는 <strong>Two columns layout</strong>으로 구성됩니다.
                왼쪽에는 Page title, Tab, Card가 배치되고 오른쪽에는 Summary card(Floating card)가
                배치됩니다.
              </p>
            </Prose>
          </VStack>
          <VStack gap={2}>
            <SubSectionTitle>적용 기준</SubSectionTitle>
            <Prose>
              <p>
                이 패턴은 사용자가 길고 복잡한 리소스 구성을 하는 경우(예: Kubernetes 배포) 생성에
                사용을 권장합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  한 페이지에 <strong>필드 20개 또는 카드 10개 중 하나라도 초과</strong>하는 경우
                </li>
                <li>심층적인 상호 작용이 필요하여 별도의 페이지가 유용한 경우</li>
              </ul>
            </Prose>
          </VStack>
        </VStack>

        <SubSectionTitle>구성 요소</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">구성 요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>① Page title</strong>
              </Td>
              <Td>
                페이지 최상단에 페이지 목적을 명시합니다. (예: Create Deployment). h2 heading을
                사용합니다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>② Tab</strong>
              </Td>
              <Td>
                하나의 생성 프로세스 내에서 주요 설정 그룹을 구분합니다. 각 탭은 독립적인 구성 카드
                집합을 가지며, 사용자는 자유롭게 이동 가능합니다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>③ Card</strong>
              </Td>
              <Td>
                각 탭 내에서 관련 항목을 묶는 카드형 블록 단위입니다. 각 카드는 접힘/펼침이
                가능합니다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>④ Floating card</strong>
              </Td>
              <Td>
                우측에 고정된 정보 카드로, 현재 탭과 입력 진행 상태를 요약합니다. Configuration,
                Quota, 버튼 포함.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Multi Tab Create — General Guidelines</SubSectionTitle>
        <DosDonts
          doItems={[
            '탭 기반의 정보 구획 구조를 사용하며, 각 탭의 목적이 명확히 구분되도록 구성합니다.',
            '입력값은 탭 간 이동 시에도 항상 유지되어야 합니다.',
            '각 탭은 단계(step)가 아니라 주제(category) 단위로 그룹화합니다.',
            '탭 제목은 사용자가 직관적으로 이해할 수 있는 언어로 작성합니다.',
            'Summary 패널은 모든 탭에서 동일한 상태를 유지합니다.',
            '모든 필수 입력값에는 * 표시를 적용합니다.',
            '탭 전환 시 Soft Validation을 수행하여 오류 있는 섹션을 미리 표시합니다.',
            '하나의 섹션에는 최대 5~7개의 필드만 배치하여 인지 부하를 줄입니다.',
            '생성 버튼은 Summary 패널 하단에 고정 배치하며, 클릭 시 전체 탭에 대한 Global Validation을 수행합니다.',
            '탭 전환, 섹션 확장 등의 인터랙션에는 자연스러운 전환 애니메이션(200~300ms)을 적용합니다.',
          ]}
          dontItems={[
            '탭을 순차적인 단계(wizard step)처럼 표현하지 않습니다.',
            '탭 이동 시 입력값이 초기화되거나 섹션이 자동으로 닫히지 않도록 합니다.',
            'Summary 패널의 구성을 탭마다 다르게 변경하지 않습니다.',
            '오류 메시지를 여러 개의 모달로 중첩 표시하지 않습니다.',
            'Add/Remove 액션 시 입력 필드의 위치나 순서를 갑작스럽게 변경하지 않습니다.',
            '탭 전환 시 페이지 전체가 새로고침되거나 입력 상태가 손실되지 않도록 합니다.',
          ]}
        />

        <SubSectionTitle>Multi Tab Create — Accessibility Guidelines</SubSectionTitle>
        <VStack gap={4}>
          <VStack gap={2}>
            <SubSectionTitle>General</SubSectionTitle>
            <Prose>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  각 구성요소에 대해 대체 텍스트(alt text) 및 ARIA region 역할(role, landmark)을
                  적절히 정의합니다.
                </li>
                <li>애플리케이션의 언어 환경에 맞추어 ARIA label을 작성합니다.</li>
                <li>불필요한 마크업이나 중복된 역할(role)을 추가하지 않습니다.</li>
                <li>
                  모든 콘텐츠는 키보드로 접근할 수 있어야 하며, 탐색 순서는 논리적이고 예측 가능해야
                  합니다.
                </li>
                <li>시각적 순서와 포커스 이동 순서를 일치시킵니다.</li>
              </ul>
            </Prose>
          </VStack>
          <VStack gap={2}>
            <SubSectionTitle>Component-specific</SubSectionTitle>
            <Prose>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  탭, 폼 입력 필드, 버튼 등 모든 상호작용 요소는 키보드로 접근 가능한 순서로
                  구성합니다.
                </li>
                <li>
                  Tab 키 및 방향키(Arrow 키)로 모든 입력 필드와 버튼을 탐색할 수 있어야 합니다.
                </li>
                <li>
                  각 탭 및 섹션 영역은{' '}
                  <span className="font-mono">ARIA role=&quot;region&quot;</span>을 활용해 스크린
                  리더에서 인식될 수 있도록 합니다.
                </li>
                <li>
                  폼 구성요소는 라벨(label)과 필드(input)가 programmatically 연결되어야 하며,{' '}
                  <span className="font-mono">aria-describedby</span> 속성을 사용해 오류 메시지나
                  도움말을 제공합니다.
                </li>
                <li>
                  버튼과 토글 요소는 활성화 상태를 명확히 알리기 위해{' '}
                  <span className="font-mono">aria-pressed</span> 또는{' '}
                  <span className="font-mono">aria-disabled</span> 속성을 사용합니다.
                </li>
                <li>
                  Summary 패널의 진행 상태나 검증 결과는 시각적 정보 외에도 스크린 리더를 통한 대체
                  정보로 전달합니다.
                </li>
                <li>
                  모든 툴팁과 헬퍼 텍스트는 Hover 또는 Focus 상태에서 스크린 리더가 읽을 수 있도록{' '}
                  <span className="font-mono">aria-label</span> 또는{' '}
                  <span className="font-mono">aria-describedby</span>를 설정합니다.
                </li>
              </ul>
            </Prose>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}

const previewCode = `<VStack gap={4} className="flex-1">
  {/* Section 1 — pb-4 overrides default 12px → 16px for Open Form */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Basic information" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Name" required helperText="...">
          <Input placeholder="Enter resource name" fullWidth />
        </FormField>
        <FormField label="Namespace" required>
          <Select options={namespaces} placeholder="Select namespace" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>

  {/* Section 2 */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Configuration" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Port" required>
          <Input placeholder="e.g. 8080" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>

  {/* Section 3 */}
  <SectionCard className="pb-4">
    <SectionCard.Header title="Labels & Annotations" />
    <SectionCard.Content>
      <VStack gap={6}>
        <FormField label="Labels">
          <Input placeholder="e.g. app=my-service" fullWidth />
        </FormField>
      </VStack>
    </SectionCard.Content>
  </SectionCard>
</VStack>`;

export function OpenFormPage() {
  return (
    <ComponentPageTemplate
      title="Create Page (Multi tab)"
      description="All-sections-visible create page pattern used by Container (Kubernetes) pages. Every section is expanded and scrollable — no wizard steps or progressive disclosure."
      preview={
        <ComponentPreview code={previewCode}>
          <OpenFormPreview />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <HStack gap={2} align="center">
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Pattern Structure
                </h4>
                <Badge variant="info" size="sm">
                  Layout
                </Badge>
              </HStack>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                All SectionCards are rendered simultaneously in a vertical stack. The user scrolls
                through the form and fills in all fields before submitting. An optional summary
                sidebar can be placed on the right.
              </p>
            </VStack>

            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-mono leading-relaxed">
                {`PageShell
└── VStack gap={6}
    ├── Page Header (h1 + description)
    └── HStack gap={6} align="start"
        ├── VStack gap={4} className="flex-1"   ← SectionCards
        │   ├── SectionCard (Basic information)
        │   ├── SectionCard (Configuration)
        │   ├── SectionCard (Labels & Annotations)
        │   └── ... more sections
        └── SummarySidebar (optional, sticky)`}
              </pre>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <VStack gap={1}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Comparison with Wizard
              </h4>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Choose between Open Form and Wizard based on the complexity and dependencies of the
                form.
              </p>
            </VStack>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Aspect
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Open Form
                    </th>
                    <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                      Wizard
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Section visibility
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      All sections visible at once
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      One active section at a time
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Navigation
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Scroll / Tabs</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Next / Edit buttons</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Section states
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">None (always open)</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Pre / Active / Done</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      SectionCard isActive
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Not used</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Used (blue border)</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Best for
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      Independent fields, Kubernetes resources
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      Dependent steps, Infrastructure resources
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Used by
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">Container</td>
                    <td className="py-2 text-[var(--color-text-muted)]">Compute, Storage, IAM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<OpenFormGuidelines />}
      relatedLinks={[
        {
          label: 'Create Page (Wizard)',
          path: '/design/patterns/wizard',
          description: 'Step-by-step wizard pattern with section states',
        },
        {
          label: 'Section card',
          path: '/design/patterns/section-card',
          description: 'Container component for form sections',
        },
        {
          label: 'Dynamic Form Fields',
          path: '/design/patterns/dynamic-form-fields',
          description: 'Repeatable row and group patterns',
        },
      ]}
    />
  );
}
