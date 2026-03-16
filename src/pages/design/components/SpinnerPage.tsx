import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Loading, VStack } from '@/design-system';

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

function SpinnerGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Spinner Indicator</strong>
              </Td>
              <Td>회전하는 로딩 아이콘</Td>
            </tr>
            <tr>
              <Td>
                <strong>Container</strong>
              </Td>
              <Td>Spinner를 감싸는 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Optional Label</strong>
              </Td>
              <Td>로딩 상태 설명 텍스트</Td>
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
              <Th className="w-[180px]">유형</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Page Spinner</strong>
              </Td>
              <Td>전체 화면 로딩 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Button Spinner</strong>
              </Td>
              <Td>버튼 내부 작업 진행 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Loading 시작</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>작업 또는 데이터 요청이 시작되면 Spinner를 표시한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Loading 진행</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Spinner는 작업이 완료될 때까지 계속 표시된다.</li>
              <li>
                Spinner는 <strong>무한 회전 애니메이션</strong>을 사용한다.
              </li>
              <li>작업 진행률을 표시하지 않는다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Loading 완료</SubSectionTitle>
          <Prose>
            <p>작업이 완료되면 Spinner는 제거되고 다음 상태로 전환된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>실제 콘텐츠 표시</li>
              <li>성공 메시지</li>
              <li>오류 메시지</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) Loading 시간 정책</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>로딩 시간</Th>
                <Th>정책</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>{'< 300ms'}</Td>
                <Td>Spinner 표시하지 않음</Td>
              </tr>
              <tr>
                <Td>300ms – 3s</Td>
                <Td>Spinner 표시</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) 인터랙션 제한</SubSectionTitle>
          <Prose>
            <p>Spinner가 표시되는 동안 다음 정책을 따른다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>상태</Th>
                <Th>정책</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Button spinner</strong>
                </Td>
                <Td>해당 버튼 클릭 제한</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Page spinner</strong>
                </Td>
                <Td>전체 화면 인터랙션 제한</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>6) Optional Label</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>전체 화면 로딩이 이뤄질 경우 스피너 아래에 문구를 추가한다.</li>
              <li>
                문구: <span className="font-mono">Loading data…</span>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>7) Spinner와 Progress 구분</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>유형</Th>
                <Th>의미</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Spinner</strong>
                </Td>
                <Td>진행률 알 수 없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Progress bar</strong>
                </Td>
                <Td>진행률 알 수 있음</Td>
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
            '작업 진행 상태를 명확히 전달한다.',
            'Spinner 표시 시간을 최소화한다.',
            '필요한 경우 상태 메시지를 함께 제공한다.',
            '로딩 영역 범위를 명확히 한다.',
          ]}
          dontItems={[
            'Skeleton과 Spinner를 동시에 사용하지 않는다.',
            'Spinner를 너무 오래 표시하지 않는다.',
            '로딩 상태가 아닌 곳에서 Spinner를 사용하지 않는다.',
            '불필요하게 전체 화면 Spinner를 사용하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function SpinnerPage() {
  return (
    <ComponentPageTemplate
      title="Spinner"
      description="Spinner는 작업이 진행 중이거나 시스템이 응답을 기다리는 동안 로딩 상태를 표시하는 컴포넌트이다. 사용자가 시스템이 정상적으로 동작하고 있음을 인지하도록 하며, 작업이 완료될 때까지 기다려야 한다는 상태를 전달한다."
      whenToUse={[
        '작업 진행 상태를 표시해야 하는 경우',
        'UI 레이아웃을 미리 표시할 수 없는 경우',
        '전체 화면 로딩 상태',
        '사용자 액션 이후 처리 대기 상태',
      ]}
      whenNotToUse={[
        '콘텐츠 구조를 미리 보여줄 수 있는 경우 (→ Skeleton)',
        '짧은 로딩 (<300ms) (→ 표시하지 않음)',
        '진행률을 표시할 수 있는 작업 (→ Progress bar)',
      ]}
      preview={
        <ComponentPreview code={`<Loading variant="spinner" size="md" text="Loading" />`}>
          <div className="flex gap-8 items-end">
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
        </ComponentPreview>
      }
      usage={{
        code: `import { Loading } from '@/design-system';

// Page Spinner
<Loading variant="spinner" size="lg" text="Loading data…" />

// Button Spinner
<Loading variant="button" buttonLabel="Saving" />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Page Spinner</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                전체 화면 로딩 표시. 레이아웃을 예측할 수 없는 초기 로딩 시 사용.
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
                <Loading variant="spinner" size="lg" text="Loading data…" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Button Spinner</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                버튼 내부 작업 진행 표시. 제출 중인 버튼은 Spinner + disabled 상태로 표시하여 중복
                요청을 방지.
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
      guidelines={<SpinnerGuidelines />}
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
                <span className="font-mono">spinner size (sm)</span>
              </Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">spinner size (md)</span>
              </Td>
              <Td>22px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">spinner size (lg)</span>
              </Td>
              <Td>32px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">button min-width</span>
              </Td>
              <Td>80px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading', description: '상위 로딩 패턴' },
        { label: 'Skeleton', path: '/design/components/skeleton', description: '콘텐츠 로딩 표시' },
        {
          label: 'Progress Bar',
          path: '/design/components/progress-bar',
          description: '진행률 표시',
        },
        {
          label: 'Empty State',
          path: '/design/patterns/empty-states',
          description: '데이터 없음 상태',
        },
        { label: 'Modal', path: '/design/components/modal', description: '작업 진행 상태 표시' },
      ]}
    />
  );
}
