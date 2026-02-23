import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, VStack } from '@/design-system';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';

export function BadgePage() {
  return (
    <ComponentPageTemplate
      title="Badge"
      description="Status indicators and labels with various styles"
      relatedLinks={[
        { label: 'Chip', path: '/design/components/chip', description: 'Interactive tags' },
        {
          label: 'Status indicator',
          path: '/design/components/status-indicator',
          description: 'Real-time status',
        },
        {
          label: 'PageHeader',
          path: '/design/components/detail-header',
          description: 'Badge in headers',
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
                  Badge vs Chip vs StatusIndicator 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          컴포넌트
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          사용 조건
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Badge
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          상태 라벨, 카운트 표시, 카테고리 분류 (비인터랙티브)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          Chip
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          사용자가 추가/제거 가능한 태그, 필터 값 (인터랙티브)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          StatusIndicator
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          리소스의 실시간 상태 (active, error, building 등)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Variant 매핑 규칙
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>info</strong> (파란색): 정보성, 중립적 레이블 (e.g. &quot;New&quot;,
                    &quot;v2.1&quot;, 개수 표시)
                  </li>
                  <li>
                    <strong>success</strong> (초록색): 긍정적 레이블 (e.g. &quot;Completed&quot;,
                    &quot;Approved&quot;)
                  </li>
                  <li>
                    <strong>warning</strong> (주황색): 주의 레이블 (e.g. &quot;Expiring soon&quot;,
                    &quot;Beta&quot;)
                  </li>
                  <li>
                    <strong>danger</strong> (빨간색): 오류/위험 레이블 (e.g. &quot;Failed&quot;,
                    &quot;Expired&quot;, &quot;Deprecated&quot;)
                  </li>
                </ul>
                <p className="text-body-sm text-[var(--color-text-subtle)] mt-2">
                  <strong>Badge vs StatusIndicator 구분</strong>: Badge는 정적 레이블·카운트
                  표시용(e.g. 버전, 개수, 카테고리)이고, StatusIndicator는 실시간 운영 상태
                  표시용(e.g. Running, Error, Building)입니다. &quot;Active&quot;,
                  &quot;Healthy&quot; 등 실시간 상태는 StatusIndicator를 사용하세요.
                </p>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Padding
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Font Size
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Line Height
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sm</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">6×2px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">md</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">8×4px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">lg</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12×4px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">14px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
            <code>radius: 4px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
          </div>
        </VStack>

        {/* Sizes */}
        <VStack gap={3}>
          <Label>Sizes</Label>
          <div className="flex gap-3 items-center">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </VStack>

        {/* Types */}
        <VStack gap={3}>
          <Label>Types</Label>
          <div className="flex gap-6">
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Subtle
              </span>
              <div className="flex gap-2">
                <Badge size="sm" type="subtle" theme="blue">
                  Blue
                </Badge>
                <Badge size="sm" type="subtle" theme="green">
                  Green
                </Badge>
                <Badge size="sm" type="subtle" theme="red">
                  Red
                </Badge>
                <Badge size="sm" type="subtle" theme="yellow">
                  Yellow
                </Badge>
                <Badge size="sm" type="subtle" theme="gray">
                  Gray
                </Badge>
                <Badge size="sm" type="subtle" theme="white">
                  White
                </Badge>
              </div>
            </VStack>
          </div>
        </VStack>

        {/* Layout (with icons) */}
        <VStack gap={3}>
          <Label>Layout (with Icons)</Label>
          <div className="flex gap-3 items-center">
            <Badge size="sm" theme="blue">
              Text only
            </Badge>
            <Badge size="sm" theme="blue" leftIcon={<IconCheck size={10} />}>
              Left icon
            </Badge>
            <Badge size="sm" theme="blue" rightIcon={<IconArrowRight size={10} />}>
              Right icon
            </Badge>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
