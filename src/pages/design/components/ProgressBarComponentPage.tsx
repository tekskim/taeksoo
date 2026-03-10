import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import { ProgressBar, VStack } from '@/design-system';

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

function ProgressBarGuidelines() {
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
              <Th className="w-[160px]">제공 조건</Th>
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
              <Td>현재 진행률에 비례한 채워진 Bar. Primary 색상 사용</Td>
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
              <Td>진행률 수치 표시. 퍼센트(%) 또는 현재값/전체값 형식</Td>
              <Td>Labeled variant</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>height</Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>border-radius</Td>
              <Td>pill (full round)</Td>
            </tr>
            <tr>
              <Td>Fill 색상</Td>
              <Td>action-primary (#2563eb)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Progress 시작</SubSectionTitle>
          <Prose>
            <p>작업이 시작되면 Progress Bar가 표시된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Progress Bar 초기값 = 0%</li>
              <li>작업 진행에 따라 Indicator 업데이트</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Progress 업데이트</SubSectionTitle>
          <Prose>
            <p>작업 진행률에 따라 Progress Indicator가 업데이트된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                값 범위: <strong>0–100%</strong>
              </li>
              <li>
                진행률은 <strong>단조 증가(monotonic)</strong>해야 한다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Progress 완료</SubSectionTitle>
          <Prose>
            <p>작업이 완료되면 Progress Bar는 100% 상태가 된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Progress Bar 제거</li>
              <li>성공 상태 표시 또는 결과 화면 표시</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 최소 표시 시간</SubSectionTitle>
          <Prose>
            <p>Progress Bar는 너무 짧게 표시되지 않도록 최소 표시 시간을 유지한다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>작업 시간</Th>
                <Th>정책</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>{'< 300ms'}</Td>
                <Td>표시하지 않음</Td>
              </tr>
              <tr>
                <Td>300ms – 1s</Td>
                <Td>표시 가능</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) Progress Label</SubSectionTitle>
          <Prose>
            <p>
              작업 설명 텍스트는 <strong>동사 기반 문장</strong>으로 작성한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uploading file...</li>
              <li>Processing data...</li>
              <li>Preparing download...</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>6) Percent 표시 규칙</SubSectionTitle>
          <Prose>
            <p>
              진행률은 <strong>정수</strong>로 표시한다.
            </p>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '진행률이 계산 가능한 작업에 사용한다.',
            '진행률을 정확하게 반영한다.',
            '작업 설명 텍스트를 제공한다.',
            '완료 상태를 명확히 표시한다.',
            '진행률을 알 수 없을 때는 Indeterminate 모드를 사용한다.',
          ]}
          dontItems={[
            '진행률을 임의로 조작하지 않는다.',
            'Spinner 대신 Progress Bar를 사용하지 않는다.',
            '너무 많은 Progress Bar를 동시에 표시하지 않는다.',
            '진행률이 감소하는 동작을 만들지 않는다.',
            '위험도(Safe / Warning / Danger) 맥락에서 사용하지 않는다. → Usage Chart 사용',
            '리소스 할당량(Quota) 표시 목적으로 사용하지 않는다. → Usage Chart 사용',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function ProgressBarComponentPage() {
  return (
    <ComponentPageTemplate
      title="Progress Bar"
      description="작업의 진행 상태를 수평형 막대로 시각화하는 컴포넌트다. 전체 작업량 대비 현재까지 완료된 진행률을 표현한다."
      whenToUse={[
        '파일 업로드, 데이터 로딩, 설치 등 작업의 완료율을 표시할 때',
        '전체 단계 중 현재 진행 위치를 사용자에게 인지시켜야 할 때',
        '완료까지 남은 시간이나 진행 정도를 지속적으로 피드백해야 할 때',
      ]}
      whenNotToUse={[
        '진행률을 계산할 수 없는 작업 (→ Spinner)',
        '콘텐츠 로딩 (→ Skeleton)',
        '리소스 할당량 대비 사용량(Quota)을 표현할 때 (→ Usage Chart)',
      ]}
      preview={
        <div className="w-[320px] flex flex-col gap-6 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
          <VStack gap={2}>
            <div className="flex justify-between">
              <span className="text-label-sm text-[var(--color-text-default)]">Uploading...</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">65%</span>
            </div>
            <ProgressBar value={65} max={100} showValue={false} />
          </VStack>
          <ProgressBar value={40} max={100} showValue={false} />
        </div>
      }
      usage={{
        code: `import { ProgressBar } from '@/design-system';

// Default — Bar only
<ProgressBar value={40} max={100} />

// Labeled — with label and value
<ProgressBar label="Uploading..." value={65} max={100} />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                진행률(%)만 Fill로 표현. 레이블·수치 없이 Bar만 단독으로 표시.
              </span>
            </VStack>
            <div className="w-[320px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <ProgressBar value={0} max={100} showValue={false} />
              <ProgressBar value={25} max={100} showValue={false} />
              <ProgressBar value={50} max={100} showValue={false} />
              <ProgressBar value={75} max={100} showValue={false} />
              <ProgressBar value={100} max={100} showValue={false} />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Labeled Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Bar 상단에 작업명(Label)과 진행률 수치(Value)를 함께 표시.
              </span>
            </VStack>
            <div className="w-[320px] flex flex-col gap-6 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={2}>
                <div className="flex justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">
                    Installing packages...
                  </span>
                  <span className="text-body-sm text-[var(--color-text-muted)]">30%</span>
                </div>
                <ProgressBar value={30} max={100} showValue={false} />
              </VStack>
              <VStack gap={2}>
                <div className="flex justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">
                    Uploading file
                  </span>
                  <span className="text-body-sm text-[var(--color-text-muted)]">3/10 files</span>
                </div>
                <ProgressBar value={30} max={100} showValue={false} />
              </VStack>
              <VStack gap={2}>
                <div className="flex justify-between">
                  <span className="text-label-sm text-[var(--color-text-default)]">Complete</span>
                  <span className="text-body-sm text-[var(--color-text-muted)]">100%</span>
                </div>
                <ProgressBar value={100} max={100} showValue={false} />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<ProgressBarGuidelines />}
      accessibility={
        <Prose>
          <p>
            ProgressBar는 <code>role="progressbar"</code>를 사용하며, <code>aria-valuenow</code>,{' '}
            <code>aria-valuemin</code>, <code>aria-valuemax</code>를 통해 현재 진행률을 전달한다.
            라벨이 있는 경우 <code>aria-label</code> 또는 <code>aria-labelledby</code>로 진행 상태를
            설명한다.
            <code>prefers-reduced-motion</code> 미디어 쿼리를 지원하여 모션 민감 사용자에게
            애니메이션을 비활성화한다.
          </p>
        </Prose>
      }
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading', description: '상위 로딩 패턴' },
        {
          label: 'Usage Chart',
          path: '/design/charts/usage-chart',
          description: 'Gauge Bar Chart / Donut Chart',
        },
        { label: 'Toast', path: '/design/components/toast', description: '작업 완료 알림' },
        { label: 'Snackbar', path: '/design/components/snackbar', description: '작업 결과 알림' },
      ]}
    />
  );
}
