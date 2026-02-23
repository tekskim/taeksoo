import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { InlineMessage, VStack } from '@/design-system';

export function InlineMessagePage() {
  return (
    <ComponentPageTemplate
      title="Inline message"
      description="Contextual feedback messages for different states"
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast', description: 'Temporary feedback' },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Form validation messages',
        },
        { label: 'Modal', path: '/design/components/modal', description: 'Confirmation dialogs' },
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
                  InlineMessage vs Toast 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          조건
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          권장 컴포넌트
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          특정 영역에 지속적으로 표시해야 하는 안내/경고
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          InlineMessage
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          사용자 액션에 대한 일시적 피드백
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">Toast</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Variant 사용 규칙
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>info</strong>: 일반 안내 사항, 추가 정보 제공 (파란색)
                  </li>
                  <li>
                    <strong>success</strong>: 성공 확인 메시지, 완료 알림 (초록색)
                  </li>
                  <li>
                    <strong>warning</strong>: 주의 사항, 잠재적 문제 경고 (주황색)
                  </li>
                  <li>
                    <strong>error</strong>: 오류 발생, 실패 알림, 필수 조건 미충족 (빨간색)
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">배치 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>관련 콘텐츠 바로 위 또는 아래에 배치합니다.</li>
                  <li>폼 상단에 전체 폼에 대한 안내/에러를 표시합니다.</li>
                  <li>SectionCard 내에서 해당 섹션에 대한 경고를 표시합니다.</li>
                  <li>
                    <strong>다중 메시지</strong>: 같은 위치에 여러 InlineMessage가 필요한 경우
                    VStack으로 8px 간격으로 스태킹합니다. 동일 variant가 중복되면 하나로 합칩니다.
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
            <code>padding: 12px</code> · <code>gap: 8px</code> · <code>radius: 6px</code> ·{' '}
            <code>icon: 16px</code> · <code>font: 12px</code>
          </div>
        </VStack>

        {/* Variants */}
        <VStack gap={3}>
          <Label>Variants</Label>
          <VStack gap={3}>
            <InlineMessage variant="success">
              Used for completed or normal operations.
            </InlineMessage>
            <InlineMessage variant="warning">
              Used when attention is needed but not critical.
            </InlineMessage>
            <InlineMessage variant="error">Used for failed actions or system issues.</InlineMessage>
            <InlineMessage variant="info">Used for general or non-critical updates.</InlineMessage>
          </VStack>
        </VStack>

        {/* Without Icon */}
        <VStack gap={3}>
          <Label>Without icon</Label>
          <InlineMessage variant="info" hideIcon>
            This message has no icon.
          </InlineMessage>
        </VStack>

        {/* Long Content */}
        <VStack gap={3}>
          <Label>Long content</Label>
          <InlineMessage variant="warning">
            This is a longer message that demonstrates how the component handles multi-line content.
            The text will wrap naturally and the icon stays aligned to the top.
          </InlineMessage>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
