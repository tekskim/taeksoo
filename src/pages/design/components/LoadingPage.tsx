import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Loading, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={`p-3 border-t border-r last:border-r-0 border-[var(--color-border-subtle)] align-top ${className}`}
    >
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
];

function LoadingGuidelines() {
  return (
    <VStack gap={10}>
      {/* Overview */}
      <VStack gap={4}>
        <SectionTitle>Overview</SectionTitle>
        <Prose>
          <p>
            Loading은 시스템이 데이터를 가져오거나 처리하는 동안 사용자에게 진행 중 상태를 전달하기
            위한 UI 패턴이다. Loading 상태는 작업이 진행 중임, 시스템이 정상적으로 응답하고 있음,
            결과가 곧 표시될 예정임을 전달한다.
          </p>
        </Prose>
      </VStack>

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Loading indicator</strong>
              </Td>
              <Td>로딩 상태 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Loading message</strong> (optional)
              </Td>
              <Td>진행 상태 설명</Td>
            </tr>
            <tr>
              <Td>
                <strong>Background content</strong>
              </Td>
              <Td>로딩 대상 UI</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">Variant</Th>
              <Th>설명</Th>
              <Th>로딩 UI</Th>
              <Th className="w-[120px]">사용 위치</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Page Loading</strong>
              </Td>
              <Td>전체 페이지 로딩</Td>
              <Td>
                • 레이아웃을 알 수 없는 초기 로딩 → Spinner
                <br />• 레이아웃은 알 수 있지만, 개별 데이터 값 로딩 → Skeleton
              </Td>
              <Td>페이지 전체</Td>
            </tr>
            <tr>
              <Td>
                <strong>Section Loading</strong>
              </Td>
              <Td>특정 영역 로딩</Td>
              <Td>Skeleton</Td>
              <Td>카드 / 드로어</Td>
            </tr>
            <tr>
              <Td>
                <strong>Table Loading</strong>
              </Td>
              <Td>리스트 데이터 로딩</Td>
              <Td>Skeleton</Td>
              <Td>Table</Td>
            </tr>
            <tr>
              <Td>
                <strong>Inline Loading</strong>
              </Td>
              <Td>작은 작업 로딩</Td>
              <Td>Spinner</Td>
              <Td>버튼 / 필드</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Loading 시작</SubSectionTitle>
          <Prose>
            <p>다음 상황에서 Loading이 시작된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>데이터 요청 발생</li>
              <li>페이지 이동</li>
              <li>사용자 액션 실행</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Loading 종료</SubSectionTitle>
          <Prose>
            <p>다음 상태 중 하나로 전환된다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">상태</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Success</strong>
                </Td>
                <Td>정상 데이터 표시</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Empty</strong>
                </Td>
                <Td>데이터 없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Error</strong>
                </Td>
                <Td>오류 발생</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Loading 시간 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>API 응답이 200ms 이내에 완료되면 로딩 표시를 건너뛴다.</li>
              <li>10초 이상 소요 시 "This may take a moment..." 안내 메시지를 표시한다.</li>
              <li>10초 이상 소요되는 액션은 가능하면 ProgressBar로 표기한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 버튼 로딩</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>제출 중인 버튼은 Spinner + disabled 상태로 표시한다.</li>
              <li>버튼 로딩 중에 버튼은 중복 요청을 방지하기 위해 비활성화된다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) 생성·저장 후 리스트 복귀 (드로어 / 생성 화면)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Create·Save 등 주요 제출 액션: 백엔드 요청 중에는 버튼에 Inline Loading(Spinner +
                disabled)을 적용한다.
              </li>
              <li>
                요청 완료: 드로어를 닫거나 생성 화면을 종료한 뒤 리소스 테이블이 있는 리스트
                화면으로 이동(또는 복귀)하고 목록 데이터를 조회한다.
              </li>
              <li>
                요청 성공 시 성공 토스트가 노출되며, 아래 6) 테이블 신규 row 반영 정책을 따른다.
              </li>
              <li>요청 실패 시 실패 토스트가 노출되고 테이블에 신규 row가 추가되지 않는다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>6) 테이블 신규 row 반영</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                기본: 서버 응답으로 리소스(또는 작업)를 식별할 수 있는 최소 정보(예: id, 작업 id)를
                받은 뒤 테이블에 row를 추가한다.
              </li>
              <li>
                비동기 생성: 응답에 포함된 필드는 그대로 표기하고, 값이 없는 컬럼은 빈값과 동일하게
                두되 해당 셀 또는 행 영역에 영역 로딩(Skeleton)을 사용한다.
              </li>
              <li>
                비동기 작업이 최종 완료되면 완료 알림(알림센터·스낵바 등)과 함께 row에 완료된
                데이터를 모두 정상 표기한다.
              </li>
              <li>
                실패: 동기 응답 실패와 비동기 작업의 최종 실패 모두 해당 row를 제거한다. 비동기
                처리에서 일부 단계만 실패해도 온전한 리소스가 생성되지 않으면 전체 실패로 간주해
                동일하게 처리한다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>7) 진행 중 row와 정렬·검색·필터</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                정렬·필터: 진행 중인 row라도 값이 채워진 컬럼에는 동일 규칙을 적용한다. 아직 값이
                없는 컬럼은 빈값과 동일하게 처리한다.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '로딩 중임을 명확하게 표시한다.',
            '가능한 기존 레이아웃을 유지한다.',
            'Skeleton을 사용하여 레이아웃 안정성을 유지한다.',
          ]}
          dontItems={[
            '콘텐츠가 갑자기 사라지도록 하지 않는다.',
            '긴 로딩 동안 아무 표시도 하지 않는다.',
            'Loading indicator만 표시하고 문맥을 제거하지 않는다.',
          ]}
        />
      </VStack>

      {/* Related */}
      <VStack gap={4}>
        <SectionTitle>Related</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">이름</Th>
              <Th className="w-[120px]">유형</Th>
              <Th>이유</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Spinner</Td>
              <Td>Component</Td>
              <Td>로딩 표시</Td>
            </tr>
            <tr>
              <Td>Skeleton</Td>
              <Td>Component</Td>
              <Td>레이아웃 유지</Td>
            </tr>
            <tr>
              <Td>Progress bar</Td>
              <Td>Component</Td>
              <Td>진행률 표시</Td>
            </tr>
            <tr>
              <Td>Table</Td>
              <Td>Component</Td>
              <Td>리스트 로딩</Td>
            </tr>
            <tr>
              <Td>Empty State</Td>
              <Td>Pattern</Td>
              <Td>데이터 없음</Td>
            </tr>
            <tr>
              <Td>System Error</Td>
              <Td>Pattern</Td>
              <Td>오류 상태</Td>
            </tr>
            <tr>
              <Td>Toast</Td>
              <Td>Component</Td>
              <Td>접수·피드백 문구 (Behavior 5)</Td>
            </tr>
            <tr>
              <Td>Snackbar</Td>
              <Td>Component</Td>
              <Td>완료·상태 피드백 (Behavior 5–6)</Td>
            </tr>
            <tr>
              <Td>Global Notification Panel</Td>
              <Td>Pattern</Td>
              <Td>알림센터 연동 (Behavior 5–6)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>
    </VStack>
  );
}

export function LoadingPage() {
  return (
    <ComponentPageTemplate
      title="Loading"
      description="Loading은 시스템이 데이터를 가져오거나 처리하는 동안 사용자에게 진행 중 상태를 전달하기 위한 UI 패턴이다. 작업이 진행 중임, 시스템이 정상적으로 응답하고 있음, 결과가 곧 표시될 예정임을 전달한다."
      whenToUse={[
        '데이터 요청 중',
        '페이지 초기 로딩',
        '리스트 데이터 조회',
        '비동기 작업 처리 중',
      ]}
      whenNotToUse={[
        '작업이 매우 빠른 경우 (→ 로딩 표시 생략)',
        '사용자 작업 대기 상태 (→ Empty state)',
        '오류 발생 (→ Error state)',
      ]}
      preview={
        <ComponentPreview code={`<Loading variant="progress" text="Loading.." progress={68} />`}>
          <div className="flex gap-8 items-center">
            <Loading variant="progress" text="Loading.." progress={68} />
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Progress variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                진행률을 수치로 알 수 있는 경우 사용. 파일 업로드, 이미지 빌드, 마이그레이션 등.
              </span>
            </VStack>
            <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <Loading
                variant="progress"
                text="Loading.."
                description="Create an instance to start using compute resources."
                progress={68}
                statusText="Status: parsing"
              />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<LoadingGuidelines />}
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
              <Td>progress</Td>
              <Td>h-1 (4px)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      relatedLinks={[
        { label: 'Spinner', path: '/design/components/spinner', description: '로딩 표시' },
        {
          label: 'Skeleton',
          path: '/design/components/skeleton',
          description: '레이아웃 유지',
        },
        {
          label: 'Progress Bar',
          path: '/design/components/progress-bar',
          description: '진행률 표시',
        },
        { label: 'Table', path: '/design/components/table', description: '리스트 로딩' },
        {
          label: 'Empty States',
          path: '/design/patterns/empty-states',
          description: '데이터 없음',
        },
        { label: 'System Error', path: '/design/policies/system-error', description: '오류 상태' },
        { label: 'Toast', path: '/design/components/toast', description: '접수·피드백 문구' },
        { label: 'Snackbar', path: '/design/components/snackbar', description: '완료·상태 피드백' },
        {
          label: 'Global Notification Panel',
          path: '/design/components/global-notification-panel',
          description: '알림센터·글로벌 패널 연동',
        },
      ]}
    />
  );
}
