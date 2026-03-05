import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { EmptyState, ErrorState, Button, VStack } from '@/design-system';
import {
  IconDatabase,
  IconSearch,
  IconFolder,
  IconPlus,
  IconAlertTriangle,
  IconWifiOff,
  IconServerOff,
} from '@tabler/icons-react';

/* ----------------------------------------
   Props definitions
   ---------------------------------------- */

const emptyStateProps: PropDef[] = [
  { name: 'icon', type: 'ReactNode', required: false, description: '아이콘 (ReactNode)' },
  { name: 'title', type: 'string', required: true, description: '제목' },
  { name: 'description', type: 'string', required: false, description: '설명 텍스트' },
  { name: 'action', type: 'ReactNode', required: false, description: '액션 버튼 등' },
  {
    name: 'variant',
    type: "'card' | 'inline'",
    default: "'card'",
    required: false,
    description: '스타일 변형: card (테두리+배경), inline (패딩만)',
  },
  { name: 'className', type: 'string', required: false, description: '추가 CSS 클래스' },
];

const errorStateProps: PropDef[] = [
  { name: 'icon', type: 'ReactNode', required: false, description: '아이콘 (ReactNode)' },
  {
    name: 'title',
    type: 'string',
    default: "'Something went wrong'",
    required: false,
    description: '에러 제목',
  },
  { name: 'description', type: 'string', required: false, description: '에러 상세 메시지' },
  { name: 'action', type: 'ReactNode', required: false, description: '재시도/액션 버튼' },
  { name: 'className', type: 'string', required: false, description: '추가 CSS 클래스' },
];

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export function EmptyStatePage() {
  return (
    <ComponentPageTemplate
      title="EmptyState / ErrorState"
      description="데이터가 없을 때 사용자에게 현재 상태를 안내하고 다음 행동을 유도하는 패턴. 단순히 빈 화면을 노출하는 대신, 상황에 맞는 메시지와 액션을 제공하여 사용자가 막힘 없이 다음 단계로 진행할 수 있도록 돕는다."
      whenToUse={[
        '아직 데이터가 생성되지 않은 초기 상태일 때 (예: 첫 리소스 생성 유도)',
        '검색 또는 필터 조건에 해당하는 결과가 없을 때',
      ]}
      whenNotToUse={[
        '데이터 로딩 중인 상태 → Loading 컴포넌트 사용',
        '오류로 인해 데이터를 불러오지 못한 경우 → Inline Message 또는 Error 패턴 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<EmptyState
  icon={<IconDatabase size={48} stroke={1} />}
  title="No instances found"
  description="Create your first instance to get started."
  action={<Button variant="primary" size="md">Create Instance</Button>}
/>

<ErrorState
  icon={<IconAlertTriangle size={48} stroke={1} />}
  title="Something went wrong"
  description="An unexpected error occurred."
  action={<Button variant="secondary" size="md">Retry</Button>}
/>`}
        >
          <div className="flex flex-col gap-8 w-full max-w-lg">
            <EmptyState
              icon={<IconDatabase size={48} stroke={1} />}
              title="No instances found"
              description="Create your first instance to get started."
              action={
                <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
                  Create Instance
                </Button>
              }
            />
            <ErrorState
              icon={<IconAlertTriangle size={48} stroke={1} />}
              title="Something went wrong"
              description="An unexpected error occurred. Please try again later."
              action={
                <Button variant="secondary" size="md">
                  Retry
                </Button>
              }
            />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { EmptyState, ErrorState, Button } from '@/design-system';
import { IconDatabase, IconAlertTriangle, IconPlus } from '@tabler/icons-react';

// EmptyState — 카드 형태 (기본)
<EmptyState
  icon={<IconDatabase size={48} stroke={1} />}
  title="No instances found"
  description="Create your first instance to get started."
  action={
    <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
      Create Instance
    </Button>
  }
/>

// EmptyState — 인라인 형태
<EmptyState
  variant="inline"
  icon={<IconSearch size={48} stroke={1} />}
  title="No results found"
  description="Try adjusting your search or filter criteria."
/>

// ErrorState
<ErrorState
  icon={<IconAlertTriangle size={48} stroke={1} />}
  title="Something went wrong"
  description="An unexpected error occurred."
  action={<Button variant="secondary" size="md">Retry</Button>}
/>`,
      }}
      examples={
        <VStack gap={8}>
          {/* EmptyState examples */}
          <VStack gap={3}>
            <Label>EmptyState — Card variant (default)</Label>
            <EmptyState
              icon={<IconDatabase size={48} stroke={1} />}
              title="No instances found"
              description="Create your first instance to get started."
              action={
                <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
                  Create Instance
                </Button>
              }
            />
          </VStack>

          <VStack gap={3}>
            <Label>EmptyState — No search results</Label>
            <EmptyState
              icon={<IconSearch size={48} stroke={1} />}
              title="No results found"
              description="Try adjusting your search or filter criteria."
            />
          </VStack>

          <VStack gap={3}>
            <Label>EmptyState — Inline variant</Label>
            <div className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <EmptyState
                variant="inline"
                icon={<IconFolder size={48} stroke={1} />}
                title="No files uploaded"
                description="Drag and drop files here or click the upload button."
                action={
                  <Button variant="secondary" size="sm">
                    Upload File
                  </Button>
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>EmptyState — Without icon</Label>
            <EmptyState
              title="No data available"
              description="Data will appear here once it becomes available."
            />
          </VStack>

          <VStack gap={3}>
            <Label>EmptyState — Without action</Label>
            <EmptyState
              icon={<IconDatabase size={48} stroke={1} />}
              title="No volumes attached"
              description="This instance does not have any volumes attached."
            />
          </VStack>

          {/* ErrorState examples */}
          <VStack gap={3}>
            <Label>ErrorState — Default</Label>
            <div className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <ErrorState
                icon={<IconAlertTriangle size={48} stroke={1} />}
                title="Something went wrong"
                description="An unexpected error occurred. Please try again later."
                action={
                  <Button variant="secondary" size="md">
                    Retry
                  </Button>
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>ErrorState — Network error</Label>
            <div className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <ErrorState
                icon={<IconWifiOff size={48} stroke={1} />}
                title="Network Error"
                description="Unable to connect to the server. Please check your network connection."
                action={
                  <Button variant="primary" size="md">
                    Retry Connection
                  </Button>
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>ErrorState — Server error</Label>
            <div className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <ErrorState
                icon={<IconServerOff size={48} stroke={1} />}
                title="500 Internal Server Error"
                description="The server encountered an error. Our team has been notified."
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>ErrorState — Minimal</Label>
            <div className="border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <ErrorState
                title="Failed to load data"
                action={
                  <Button variant="secondary" size="sm">
                    Retry
                  </Button>
                }
              />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                1. Composition (구성 요소)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        필수/권장
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        아이콘
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">권장</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        리소스 타입을 시각적으로 전달. size 48, stroke 1로 통일
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        제목
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">필수</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        현재 상태를 명확하게 전달
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        설명
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">권장</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        다음 행동을 안내하는 보조 텍스트
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        액션 버튼
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">조건부</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        빈 상태에서 벗어날 수 있는 주요 행동이 있을 때 제공
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2. Behavior &amp; Flow
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">상태 전환 흐름</p>
              <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>데이터 로딩 완료 후 결과가 없을 때 EmptyState 표시</li>
                <li>사용자가 액션 버튼을 클릭하면 해당 생성/업로드 플로우로 이동</li>
                <li>필터·검색 결과 없음 시 inline variant로 간결하게 표시</li>
              </ol>
              <p className="text-body-md text-[var(--color-text-muted)] mt-2">엣지 케이스</p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>로딩 중 깜빡임 방지: 로딩이 완료된 후에만 EmptyState 노출</li>
                <li>
                  필터·검색 결과 없음: &quot;No results found&quot; 등 상황에 맞는 메시지 사용
                </li>
                <li>권한 없음 상태: EmptyState 대신 권한 요청 안내 메시지 사용</li>
                <li>
                  중첩 Empty State 방지: 상위에서 이미 빈 상태를 표시한 경우 하위에 중복 노출하지
                  않음
                </li>
              </ul>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                3. Usage Guidelines
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-state-success)] bg-[var(--color-state-success-bg)]">
                  <p className="text-label-md text-[var(--color-state-success)] mb-2">Do ✅</p>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>상황에 맞는 메시지 제공 (초기 상태 vs 검색 결과 없음 구분)</li>
                    <li>명확한 액션 버튼으로 다음 단계 유도</li>
                    <li>간결하게 작성 (1~2문장)</li>
                    <li>리소스 타입에 맞는 아이콘 사용</li>
                  </ul>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
                  <p className="text-label-md text-[var(--color-state-danger)] mb-2">
                    Don&apos;t ❌
                  </p>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>로딩 중에 EmptyState 노출 금지</li>
                    <li>여러 액션 버튼을 나열하지 않음 (1개 권장)</li>
                    <li>오류 상황에 EmptyState 사용 금지</li>
                    <li>아이콘 남용 금지 (리소스 타입과 무관한 아이콘 사용 지양)</li>
                  </ul>
                </div>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                4. Content Guidelines
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>제목</strong>: &quot;No [리소스] found&quot; 패턴 권장. 상태를 명확하게
                  전달.
                </li>
                <li>
                  <strong>설명</strong>: 다음 행동을 안내. 1~2문장으로 간결하게 작성.
                </li>
                <li>
                  <strong>액션 버튼 레이블</strong>: &quot;Create [리소스]&quot;, &quot;Upload&quot;
                  등 구체적인 행동 명시.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <VStack gap={1}>
            <div>
              <strong>EmptyState (card)</strong>: <code>bg: surface-default</code> ·{' '}
              <code>border: border-subtle</code> · <code>radius: radius-lg (8px)</code> ·{' '}
              <code>padding: 64px</code>
            </div>
            <div>
              <strong>EmptyState (inline)</strong>: <code>padding-y: 80px</code>
            </div>
            <div>
              <strong>공통</strong>: <code>icon: text-disabled</code> ·{' '}
              <code>title: heading-h5</code> · <code>description: body-lg, text-subtle</code> ·{' '}
              <code>gap: 16px</code> · <code>action-mt: 8px</code>
            </div>
            <div>
              <strong>ErrorState</strong>: <code>icon: state-danger, mb-16px</code> ·{' '}
              <code>title: heading-h5, mb-8px</code> ·{' '}
              <code>description: body-md, text-muted, mb-16px</code> · <code>padding-y: 80px</code>
            </div>
          </VStack>
        </div>
      }
      apiReference={emptyStateProps}
      subComponentApis={[{ title: 'ErrorState', props: errorStateProps }]}
      accessibility={
        <VStack gap={2}>
          <p className="text-body-md text-[var(--color-text-muted)]">
            EmptyState와 ErrorState는 정적인 안내 콘텐츠로, 특별한 ARIA 역할이 필요하지 않습니다.
          </p>
          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
            <li>아이콘은 장식적 요소이므로 스크린리더에서 무시됩니다.</li>
            <li>제목과 설명은 일반 텍스트로 노출되어 스크린리더가 자연스럽게 읽을 수 있습니다.</li>
            <li>액션 버튼은 키보드로 접근 가능하며, 명확한 라벨을 제공해야 합니다.</li>
            <li>
              동적으로 EmptyState/ErrorState가 나타나는 경우,{' '}
              <code>aria-live=&quot;polite&quot;</code> 영역 내에 배치하여 상태 변경을 알릴 수
              있습니다.
            </li>
          </ul>
        </VStack>
      }
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Button', path: '/design/components/button' },
      ]}
    />
  );
}
