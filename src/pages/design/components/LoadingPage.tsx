import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Loading, ProgressBar, VStack } from '@/design-system';

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

const loadingProps: PropDef[] = [
  {
    name: 'variant',
    type: "'spinner' | 'progress' | 'button'",
    default: "'spinner'",
    required: false,
    description: 'Loading variant',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Size',
  },
  {
    name: 'text',
    type: 'string',
    default: "'Loading'",
    required: false,
    description: 'Loading text',
  },
  {
    name: 'description',
    type: 'string',
    required: false,
    description: 'Description (progress variant)',
  },
  {
    name: 'progress',
    type: 'number',
    default: '0',
    required: false,
    description: 'Progress 0-100',
  },
  {
    name: 'statusText',
    type: 'string',
    required: false,
    description: 'Status text (progress variant)',
  },
  {
    name: 'buttonLabel',
    type: 'string',
    default: "'Loading'",
    required: false,
    description: 'Button label (button variant)',
  },
];

function LoadingGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>진행률(%)만 Fill로 표현. 레이블·수치 없이 Bar만 단독으로 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Labeled</strong>
              </Td>
              <Td>Bar 상단 또는 좌측에 작업명(Label)과 진행률 수치(Value)를 함께 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[Label]                              [Value]
[████████████████░░░░░░░░░░░░░░░░░░]`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[140px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>a. Track</strong>
              </Td>
              <Td>전체 너비의 배경 Bar. 미완료 영역을 나타냄</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>b. Fill</strong>
              </Td>
              <Td>현재 진행률에 비례한 채워진 Bar. 기본 색상은 Black</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>c. Label</strong>
              </Td>
              <Td>진행 중인 작업의 이름 또는 설명 텍스트</Td>
              <Td>Labeled variant</Td>
            </tr>
            <tr>
              <Td>
                <strong>d. Value</strong>
              </Td>
              <Td>
                진행률 수치 표시. <code>퍼센트(%)</code> 또는 <code>현재값/전체값</code> 형식
              </Td>
              <Td>Labeled variant</Td>
            </tr>
          </tbody>
        </TableWrapper>

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
                <code>height</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>border-radius</code>
              </Td>
              <Td>pill (full round)</Td>
            </tr>
            <tr>
              <Td>
                <code>Fill 기본 색상</code>
              </Td>
              <Td>Black</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>Fill 진행 방식</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fill은 진행률(0~100%)에 비례하여 왼쪽에서 오른쪽으로 채워진다.</li>
              <li>진행률이 업데이트될 때마다 Fill 너비가 즉시 반영된다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>진행률 불확정 상태 (Indeterminate)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>전체 작업량을 알 수 없는 경우 Indeterminate 모드를 사용한다.</li>
              <li>Fill이 Track 위를 좌→우로 반복 이동하는 애니메이션으로 표현한다.</li>
              <li>수치(Value)는 표시하지 않는다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '진행률을 알 수 있는 경우 되도록 수치(퍼센트 또는 현재값/전체값)를 함께 표시한다.',
            '작업이 완료되면 Success 상태로 명확히 전환하여 사용자에게 완료를 인지시킨다.',
            '진행률을 알 수 없을 때는 Indeterminate 모드를 사용한다.',
          ]}
          dontItems={[
            '위험도(Safe / Warning / Danger) 맥락에서 Progress Bar를 사용하지 않는다. → Usage Chart 사용',
            'Progress Bar를 리소스 할당량(Quota) 표시 목적으로 사용하지 않는다. → Usage Chart 사용',
            '진행률이 역방향(감소)으로 표현되어야 하는 경우에는 사용하지 않는다.',
            '동일한 영역에 여러 개의 Progress Bar를 중첩하여 사용하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function LoadingPage() {
  return (
    <ComponentPageTemplate
      title="Progress Bar (Loading)"
      description="작업의 진행 상태를 수평형 막대로 시각화하는 컴포넌트다. 전체 작업량 대비 현재까지 완료된 진행률을 표현한다."
      whenToUse={[
        '파일 업로드, 데이터 로딩, 설치 등 작업의 완료율을 표시할 때',
        '전체 단계 중 현재 진행 위치를 사용자에게 인지시켜야 할 때',
        '완료까지 남은 시간이나 진행 정도를 지속적으로 피드백해야 할 때',
      ]}
      whenNotToUse={[
        '리소스 할당량 대비 사용량(Quota)을 표현할 때 → Usage Chart (Gauge Bar Chart) 사용',
        '사용률에 따라 Safe / Warning / Danger 상태 색상이 필요할 때 → Usage Chart (Gauge Bar Chart) 사용',
        '진행률을 알 수 없는 불확정 로딩 상태 → Spinner 또는 Skeleton 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Loading variant="progress" text="Uploading..." progress={68} />
<ProgressBar label="Installing" value={45} max={100} showValue />`}
        >
          <VStack gap={6} className="w-full max-w-[400px]">
            <Loading
              variant="progress"
              text="Uploading..."
              progress={68}
              statusText="Status: parsing"
            />
            <ProgressBar label="Installing" value={45} max={100} showValue />
          </VStack>
        </ComponentPreview>
      }
      usage={{
        code: `import { Loading, ProgressBar } from '@/design-system';

// Labeled progress with status
<Loading variant="progress" text="Uploading" progress={50} />

// Simple progress bar
<ProgressBar value={45} max={100} label="Installing" showValue />

// Spinner (indeterminate)
<Loading variant="spinner" text="Loading" />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default Progress Bar</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                진행률(%)만 Fill로 표현. 레이블·수치 없이 Bar만 단독으로 표시.
              </span>
            </VStack>
            <div className="w-full max-w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={4}>
                <ProgressBar value={30} max={100} showValue={false} />
                <ProgressBar value={68} max={100} showValue={false} />
                <ProgressBar value={100} max={100} showValue={false} />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Labeled Progress Bar</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Bar 상단에 작업명(Label)과 진행률 수치(Value)를 함께 표시.
              </span>
            </VStack>
            <div className="w-full max-w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={4}>
                <ProgressBar label="Uploading files" value={30} max={100} showValue />
                <ProgressBar label="Installing packages" value={68} max={100} showValue />
                <ProgressBar label="Build complete" value={100} max={100} showValue />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Progress with Status Text</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Loading 컴포넌트의 progress variant. 작업명, 설명, 진행률, 상태 텍스트를 모두 표시.
              </span>
            </VStack>
            <div className="w-full max-w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Loading
                variant="progress"
                text="Building image..."
                description="Create an instance to start using compute resources."
                progress={68}
                statusText="Status: parsing"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Spinner (Indeterminate)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                진행률을 알 수 없는 불확정 로딩 상태. 수치를 표시하지 않음.
              </span>
            </VStack>
            <div className="flex gap-8 items-end p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Small</span>
                <Loading variant="spinner" size="sm" text="Loading" />
              </VStack>
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Medium</span>
                <Loading variant="spinner" size="md" text="Loading" />
              </VStack>
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Large</span>
                <Loading variant="spinner" size="lg" text="Loading" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Button Loading State</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                제출 중인 버튼은 Spinner + disabled 상태로 표시.
              </span>
            </VStack>
            <div className="flex gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Loading variant="button" buttonLabel="Loading" />
              <Loading variant="button" buttonLabel="Saving" />
              <Loading variant="button" buttonLabel="Processing" />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<LoadingGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <code>height: 4px</code> · <code>border-radius: pill (full round)</code> ·{' '}
          <code>Fill 기본 색상: Black</code> · <code>spinner: 16/22/32px</code>
        </div>
      }
      apiReference={loadingProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Loading spinner uses aria-hidden for decorative icon. Progress variant exposes progress
          value via aria-valuenow. Button variant is disabled and not focusable.
        </p>
      }
      relatedLinks={[
        {
          label: 'Gauge Bar Chart',
          path: '/design/charts/progress-bar',
          description: 'Usage Chart — 리소스 할당량 대비 사용량(Quota) 시각화',
        },
        {
          label: 'Spinner',
          path: '/design/components/loading',
          description: '진행률을 알 수 없는 불확정 로딩',
        },
        {
          label: 'Skeleton',
          path: '/design/components/skeleton',
          description: '레이아웃을 미리 알 수 있는 로딩 상태',
        },
        { label: 'Badge', path: '/design/components/badge', description: '단독 지표 표시' },
      ]}
      notionPageId="31b9eddc34e68032a221eebd2ea18568"
    />
  );
}
