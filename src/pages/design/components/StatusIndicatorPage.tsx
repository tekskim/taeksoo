import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { StatusIndicator, Tooltip, VStack } from '@/design-system';

export function StatusIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="Status indicator"
      description="Server/instance status indicators with predefined states"
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge', description: 'Static labels' },
        { label: 'Table', path: '/design/components/table', description: 'Status column' },
        {
          label: 'Detail Header',
          path: '/design/components/detail-header',
          description: 'InfoCard status',
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
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">상태 매핑 규칙</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          Status
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          색상
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          사용 조건
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          active
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-state-success)]">초록</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          정상 동작 중 (Running, Active, Healthy, Connected)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          error
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-state-danger)]">빨강</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          오류/실패 (Error, Failed, Crashed, Disconnected)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          building
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-state-info)]">파랑</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          진행 중 (Building, Creating, Deploying, Migrating)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          muted
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-subtle)]">회색</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          비활성/대기 (Stopped, Paused, Shutoff, Unknown)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  위 4개는 <strong>기본 카테고리</strong>입니다. 실제 구현에서는 19개의 세분화된
                  status 값 (<code>deleting</code>, <code>suspended</code>, <code>shelved</code>,{' '}
                  <code>pending</code>, <code>maintenance</code>, <code>degraded</code> 등)을
                  지원하며, 각 값은 위 4개 카테고리의 색상 중 하나로 매핑됩니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    테이블의 Status 컬럼에서 사용하며, 컬럼은 <strong>중앙 정렬</strong>
                    합니다.
                  </li>
                  <li>DetailHeader의 InfoCard에서 리소스 상태를 표시합니다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 6×4px</code> · <code>gap: 4px</code> · <code>radius: pill (16px)</code> ·{' '}
            <code>font-size: 11px</code> · <code>icon: 14px</code>
          </div>
        </VStack>

        {/* All status Types by Category */}
        <VStack gap={3}>
          <Label>Active</Label>
          <div className="flex flex-wrap gap-3 items-center">
            <Tooltip content="active">
              <StatusIndicator status="active" />
            </Tooltip>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Error</Label>
          <div className="flex flex-wrap gap-3 items-center">
            <Tooltip content="error">
              <StatusIndicator status="error" />
            </Tooltip>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Action (Blue)</Label>
          <div className="flex flex-wrap gap-3 items-center">
            <Tooltip content="building">
              <StatusIndicator status="building" />
            </Tooltip>
            <Tooltip content="deleting">
              <StatusIndicator status="deleting" />
            </Tooltip>
            <Tooltip content="pending">
              <StatusIndicator status="pending" />
            </Tooltip>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Warning (Orange)</Label>
          <div className="flex flex-wrap gap-3 items-center">
            <Tooltip content="verify-resized">
              <StatusIndicator status="verify-resized" />
            </Tooltip>
            <Tooltip content="degraded">
              <StatusIndicator status="degraded" />
            </Tooltip>
            <Tooltip content="no-monitor">
              <StatusIndicator status="no-monitor" />
            </Tooltip>
            <Tooltip content="down">
              <StatusIndicator status="down" />
            </Tooltip>
            <Tooltip content="maintenance">
              <StatusIndicator status="maintenance" />
            </Tooltip>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Muted (Gray)</Label>
          <div className="flex flex-wrap gap-3 items-center">
            <Tooltip content="suspended">
              <StatusIndicator status="suspended" />
            </Tooltip>
            <Tooltip content="shelved-offloaded">
              <StatusIndicator status="shelved-offloaded" />
            </Tooltip>
            <Tooltip content="mounted">
              <StatusIndicator status="mounted" />
            </Tooltip>
            <Tooltip content="shutoff">
              <StatusIndicator status="shutoff" />
            </Tooltip>
            <Tooltip content="paused">
              <StatusIndicator status="paused" />
            </Tooltip>
            <Tooltip content="draft">
              <StatusIndicator status="draft" />
            </Tooltip>
            <Tooltip content="deactivated">
              <StatusIndicator status="deactivated" />
            </Tooltip>
            <Tooltip content="in-use">
              <StatusIndicator status="in-use" />
            </Tooltip>
          </div>
        </VStack>

        {/* Layout Variants - Icon Only */}
        <VStack gap={3}>
          <Label>Icon Only - All status Types</Label>
          <VStack gap={4}>
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Active
              </span>
              <div className="flex flex-wrap gap-4 items-start">
                <VStack gap={1} align="center">
                  <StatusIndicator status="active" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    active
                  </span>
                </VStack>
              </div>
            </VStack>
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Error
              </span>
              <div className="flex flex-wrap gap-4 items-start">
                <VStack gap={1} align="center">
                  <StatusIndicator status="error" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    error
                  </span>
                </VStack>
              </div>
            </VStack>
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Action
              </span>
              <div className="flex flex-wrap gap-4 items-start">
                <VStack gap={1} align="center">
                  <StatusIndicator status="building" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    building
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="deleting" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    deleting
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="pending" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    pending
                  </span>
                </VStack>
              </div>
            </VStack>
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Warning
              </span>
              <div className="flex flex-wrap gap-4 items-start">
                <VStack gap={1} align="center">
                  <StatusIndicator status="verify-resized" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    verify-resized
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="degraded" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    degraded
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="no-monitor" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    no-monitor
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="down" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    down
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="maintenance" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    maintenance
                  </span>
                </VStack>
              </div>
            </VStack>
            <VStack gap={2}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                Muted
              </span>
              <div className="flex flex-wrap gap-4 items-start">
                <VStack gap={1} align="center">
                  <StatusIndicator status="suspended" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    suspended
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="shelved-offloaded" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    shelved
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="mounted" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    mounted
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="shutoff" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    shutoff
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="paused" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    paused
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="draft" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    draft
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="deactivated" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    deactivated
                  </span>
                </VStack>
                <VStack gap={1} align="center">
                  <StatusIndicator status="in-use" layout="icon-only" />
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    in-use
                  </span>
                </VStack>
              </div>
            </VStack>
          </VStack>
        </VStack>

        {/* Custom Labels */}
        <VStack gap={3}>
          <Label>Custom labels</Label>
          <div className="flex gap-3 items-center">
            <StatusIndicator status="active" label="Running" />
            <StatusIndicator status="error" label="Failed" />
            <StatusIndicator status="building" label="Deploying..." />
          </div>
        </VStack>

        {/* Color Reference */}
        <VStack gap={3}>
          <Label>Semantic Color Tokens</Label>
          <div className="grid grid-cols-5 gap-2 text-[length:var(--font-size-10)]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[var(--status-success-bg)]" />
              <span className="text-[var(--color-text-subtle)]">--status-success-bg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[var(--status-danger-bg)]" />
              <span className="text-[var(--color-text-subtle)]">--status-danger-bg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[var(--status-info-bg)]" />
              <span className="text-[var(--color-text-subtle)]">--status-info-bg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[var(--status-warning-bg)]" />
              <span className="text-[var(--color-text-subtle)]">--status-warning-bg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[var(--status-muted-bg)]" />
              <span className="text-[var(--color-text-subtle)]">--status-muted-bg</span>
            </div>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
