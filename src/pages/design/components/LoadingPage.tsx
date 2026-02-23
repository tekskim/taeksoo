import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Loading, VStack } from '@/design-system';

export function LoadingPage() {
  return (
    <ComponentPageTemplate
      title="Loading"
      description="Loading indicators for various states"
      relatedLinks={[
        {
          label: 'Progress Bar',
          path: '/design/charts/progress-bar',
          description: 'Determinate progress',
        },
        { label: 'Button', path: '/design/components/button', description: 'Button loading state' },
        {
          label: 'EmptyState',
          path: '/design/components/empty-state',
          description: 'Empty content state',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Spinner vs Skeleton 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          유형
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
                          Spinner
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          레이아웃을 예측할 수 없거나, 단일 영역 로딩 시
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          버튼 로딩, 데이터 제출 중
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Skeleton
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          최종 레이아웃을 미리 알 수 있는 경우
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          테이블 행, 카드 목록, 상세 페이지
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          ProgressBar
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          진행률을 수치로 알 수 있는 경우 (determinate)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          파일 업로드, 이미지 빌드, 마이그레이션
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">로딩 표시 정책</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>지연 표시</strong>: API 응답이 200ms 이내에 완료되면 로딩 표시를
                    건너뜁니다 (깜빡임 방지).
                  </li>
                  <li>
                    <strong>전체 페이지</strong>: 페이지 전체 데이터 로딩 시 Skeleton을 사용합니다.
                  </li>
                  <li>
                    <strong>부분 영역</strong>: 특정 섹션만 로딩 시 해당 영역에만 Spinner를
                    표시합니다.
                  </li>
                  <li>
                    <strong>버튼 로딩</strong>: 제출 중인 버튼은 Spinner + disabled 상태로
                    표시합니다.
                  </li>
                  <li>
                    <strong>장시간 로딩</strong>: 10초 이상 소요 시 &quot;This may take a
                    moment...&quot; 등 안내 메시지를 표시하고, 가능하면 ProgressBar로 전환합니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>spinner: 16/22/32px</code> · <code>progress: h-1</code> ·{' '}
            <code>button: min-w-80px</code>
          </div>
        </VStack>

        {/* Spinner Variant */}
        <VStack gap={3}>
          <Label>Spinner variant</Label>
          <div className="flex gap-8 items-end p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Small
              </span>
              <Loading variant="spinner" size="sm" text="Loading" />
            </VStack>
            <VStack gap={2} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Medium
              </span>
              <Loading variant="spinner" size="md" text="Loading" />
            </VStack>
            <VStack gap={2} align="center">
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Large
              </span>
              <Loading variant="spinner" size="lg" text="Loading" />
            </VStack>
          </div>
        </VStack>

        {/* Progress Variant */}
        <VStack gap={3}>
          <Label>Progress variant</Label>
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

        {/* Button Variant */}
        <VStack gap={3}>
          <Label>Button Variant (Disabled Loading State)</Label>
          <div className="flex gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <Loading variant="button" buttonLabel="Loading" />
            <Loading variant="button" buttonLabel="Saving" />
            <Loading variant="button" buttonLabel="Processing" />
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
