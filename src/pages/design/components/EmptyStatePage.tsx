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
      description="데이터가 없거나 에러가 발생했을 때 사용자에게 상태를 안내하고 다음 행동을 유도하는 컴포넌트입니다."
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
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                EmptyState vs ErrorState 선택 기준
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        컴포넌트
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        사용 상황
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        예시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        EmptyState
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        데이터가 아직 없거나 검색 결과가 없을 때
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        첫 리소스 생성 유도, 필터 결과 없음
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        ErrorState
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        API 실패, 네트워크 오류 등 시스템 에러 시
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        서버 500 에러, 네트워크 끊김
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                EmptyState variant 선택 기준
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        사용 조건
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        예시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        card
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        독립적인 영역에서 빈 상태를 표시할 때 (기본값)
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        테이블 대신 표시, 전체 페이지 빈 상태
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        inline
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        이미 카드/패널 안에 배치될 때 (중복 테두리 방지)
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        SectionCard 내부, Drawer 내부, Tab 패널 내부
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">작성 가이드</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>아이콘</strong>: <code>size={'{48}'}</code>, <code>stroke={'{1}'}</code>로
                  통일합니다. 리소스 타입에 맞는 아이콘을 사용하세요.
                </li>
                <li>
                  <strong>제목</strong>: 상태를 명확하게 전달합니다. &quot;No [리소스] found&quot;
                  패턴을 권장합니다.
                </li>
                <li>
                  <strong>설명</strong>: 다음 행동을 안내합니다. 1~2문장으로 간결하게 작성합니다.
                </li>
                <li>
                  <strong>액션 버튼</strong>: 빈 상태에서 벗어날 수 있는 주요 행동을 제공합니다.
                  생성/업로드 등.
                </li>
                <li>
                  <strong>ErrorState 액션</strong>: 주로 &quot;Retry&quot; 버튼을 제공합니다.{' '}
                  <code>variant=&quot;secondary&quot;</code> 를 기본으로 사용합니다.
                </li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">금지 패턴</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  커스텀 EmptyState를 인라인으로 직접 정의하지 마세요. 반드시 DS 컴포넌트를
                  사용합니다.
                </li>
                <li>
                  <code>variant=&quot;inline&quot;</code>을 독립 영역에서 사용하지 마세요. 카드/패널
                  내부 전용입니다.
                </li>
                <li>
                  ErrorState 아이콘에 <code>stroke={'{1.5}'}</code> 등 다른 값을 사용하지 마세요.{' '}
                  <code>stroke={'{1}'}</code>로 통일합니다.
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
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
        { label: 'Loading', path: '/design/components/loading', description: '로딩 상태 표시' },
        {
          label: 'InlineMessage',
          path: '/design/components/inline-message',
          description: '인라인 피드백 메시지',
        },
        { label: 'Button', path: '/design/components/button', description: '액션 버튼' },
      ]}
    />
  );
}
