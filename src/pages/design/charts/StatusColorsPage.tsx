import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, VStack } from '@/design-system';

export function StatusColorsPage() {
  return (
    <ComponentPageTemplate
      title="Status colors"
      description="Shared color thresholds for usage-based charts including bar charts, half-doughnut, and doughnut charts"
      relatedLinks={[
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart guidelines',
        },
        {
          label: 'Progress Bar',
          path: '/design/charts/progress-bar',
          description: 'Uses status colors',
        },
        {
          label: 'Half-Doughnut chart',
          path: '/design/charts/half-doughnut',
          description: 'Uses status colors',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">색상 임계값 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>사용률 기반 차트에 공통으로 적용되는 색상 시스템입니다.</li>
                <li>
                  <strong>Safe</strong> (초록): 사용률 0~69%. 정상 범위.
                </li>
                <li>
                  <strong>Warning</strong> (주황): 사용률 70~89%. 주의 필요.
                </li>
                <li>
                  <strong>Danger</strong> (빨강): 사용률 90~100%. 위험/임계치 초과.
                </li>
                <li>
                  모든 사용률 차트(Bar, Doughnut, Half-Doughnut)에 동일한 임계값을 적용합니다.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Applies to</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info" size="sm">
              Bar chart
            </Badge>
            <Badge variant="info" size="sm">
              Half-Doughnut chart
            </Badge>
            <Badge variant="info" size="sm">
              Doughnut chart
            </Badge>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Compute</Label>
          <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  0% ~ 69%: Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  70% ~ 89%: Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                <span className="text-body-md text-[var(--color-text-default)]">90%+: Danger</span>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>{'thresholds={STATUS_THRESHOLDS.compute}'}</code>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {'{ warning: 70, danger: 90 }'}
              </span>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Compute Admin</Label>
          <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  0% ~ 69%: Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  70% ~ 99%: Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                <span className="text-body-md text-[var(--color-text-default)]">100%+: Danger</span>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>{'thresholds={STATUS_THRESHOLDS.computeAdmin}'}</code>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {'{ warning: 70, danger: 100 }'}
              </span>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Storage</Label>
          <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  0% ~ 84%: Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  85% ~ 94%: Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                <span className="text-body-md text-[var(--color-text-default)]">95%+: Danger</span>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>{'thresholds={STATUS_THRESHOLDS.storage}'}</code>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {'{ warning: 85, danger: 95 }'}
              </span>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Container</Label>
          <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  0% ~ 69%: Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  70% ~ 94%: Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                <span className="text-body-md text-[var(--color-text-default)]">95%+: Danger</span>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>{'thresholds={STATUS_THRESHOLDS.container}'}</code>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {'{ warning: 70, danger: 95 }'}
              </span>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Default</Label>
          <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-success)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  0% ~ 69%: Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-warning)]" />
                <span className="text-body-md text-[var(--color-text-default)]">
                  70% ~ 94%: Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-state-danger)]" />
                <span className="text-body-md text-[var(--color-text-default)]">95%+: Danger</span>
              </div>
            </div>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
              <code>{'thresholds={STATUS_THRESHOLDS.default}'}</code>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {'{ warning: 70, danger: 95 }'}
              </span>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Usage</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex flex-col gap-1">
            <div>
              <code>{"import { STATUS_THRESHOLDS } from '@/design-system';"}</code>
            </div>
            <div className="mt-1">
              <code>{'<ProgressBar thresholds={STATUS_THRESHOLDS.compute} ... />'}</code>
            </div>
            <div className="mt-2 text-[var(--color-text-muted)]">
              Available presets: <code>compute</code> · <code>computeAdmin</code> ·{' '}
              <code>storage</code> · <code>container</code> · <code>default</code>
            </div>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
