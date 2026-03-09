import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { MonitoringToolbar, VStack } from '@/design-system';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4 className={`text-heading-h5 text-[var(--color-text-default)] ${className}`}>{children}</h4>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function MonitoringToolbarGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={3}>
        <SectionTitle>1. 개요</SectionTitle>
        <VStack gap={2}>
          <SubSectionTitle>정의</SubSectionTitle>
          <Prose>
            <p>
              그래프의 데이터 조회 범위를 제어하는 버튼 그룹입니다. 최소한의 클릭으로 원하는
              시간대의 데이터를 빠르게 탐색하는 것이 목표입니다.
            </p>
          </Prose>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>위치</SubSectionTitle>
          <Prose>
            <p>
              그래프 조합으로 이뤄진 화면의 <strong>상단 영역</strong>에 배치됩니다. (모니터링 화면
              상단 등)
            </p>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>2. 구성 요소</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <SubSectionTitle className="mb-2">상대 시간 버튼</SubSectionTitle>
            <Prose>
              <ol className="list-decimal pl-4 space-y-1">
                <li>
                  기본값은 <strong>30m</strong>로 선택 (
                  <code>defaultTimeRange: &apos;30m&apos;</code>)
                </li>
                <li>라디오 버튼처럼 동작 — 한 번에 하나만 활성화</li>
                <li>클릭 즉시 데이터가 해당 기간으로 필터링</li>
              </ol>
            </Prose>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <SubSectionTitle className="mb-2">커스텀 기간 버튼</SubSectionTitle>
            <Prose>
              <ol className="list-decimal pl-4 space-y-1">
                <li>클릭 시 데이트 피커 노출</li>
                <li>기간 선택 완료 시 상대 시간 버튼 선택 해지</li>
                <li>
                  기간 선택 후 기간과 <strong>Clear</strong> 버튼 노출
                </li>
                <li>Clear 클릭 시 커스텀 기간 해지 → 1h(상대 시간) 재선택</li>
                <li>Clear 외 영역 클릭 시 데이트 피커 재노출 (기간 재설정 가능)</li>
              </ol>
            </Prose>
          </div>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <SubSectionTitle className="mb-2">새로 고침 버튼</SubSectionTitle>
            <Prose>
              <ol className="list-decimal pl-4 space-y-1">
                <li>클릭 시 데이터가 새로고침됩니다.</li>
              </ol>
            </Prose>
          </div>
        </div>
      </VStack>
    </VStack>
  );
}

const monitoringToolbarProps: PropDef[] = [
  {
    name: 'timeRangeOptions',
    type: 'TimeRangeOption[]',
    default: '30m, 1h, 6h, 12h, 24h',
    required: false,
    description: 'Time range options',
  },
  {
    name: 'timeRange',
    type: 'TimeRangeValue',
    required: false,
    description: 'Controlled time range value',
  },
  {
    name: 'defaultTimeRange',
    type: 'TimeRangeValue',
    default: "'30m'",
    required: false,
    description: 'Default time range (uncontrolled)',
  },
  {
    name: 'onTimeRangeChange',
    type: '(value) => void',
    required: false,
    description: 'Time range change callback',
  },
  {
    name: 'customPeriod',
    type: 'CustomPeriod | null',
    required: false,
    description: 'Custom date range',
  },
  {
    name: 'onCustomPeriodChange',
    type: '(period) => void',
    required: false,
    description: 'Custom period change callback',
  },
  { name: 'onRefresh', type: '() => void', required: false, description: 'Refresh click callback' },
  {
    name: 'showRefresh',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show refresh button',
  },
  {
    name: 'maxDate',
    type: 'Date',
    default: 'new Date()',
    required: false,
    description: 'Maximum selectable date',
  },
];

export function MonitoringToolbarPage() {
  return (
    <ComponentPageTemplate
      title="Monitoring toolbar"
      description="Time range selection and refresh controls for monitoring dashboards"
      preview={
        <ComponentPreview
          code={`<MonitoringToolbar
  onTimeRangeChange={(value) => {}}
  onCustomPeriodChange={(period) => {}}
  onRefresh={() => {}}
/>`}
        >
          <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <MonitoringToolbar
              onTimeRangeChange={() => {}}
              onCustomPeriodChange={() => {}}
              onRefresh={() => {}}
            />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { MonitoringToolbar } from '@/design-system';\n\n<MonitoringToolbar\n  onTimeRangeChange={(value) => setTimeRange(value)}\n  onCustomPeriodChange={(period) => setCustomPeriod(period)}\n  onRefresh={refetchData}\n/>`,
      }}
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Default</span>
            <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
              <MonitoringToolbar
                onTimeRangeChange={() => {}}
                onCustomPeriodChange={() => {}}
                onRefresh={() => {}}
              />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<MonitoringToolbarGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>segment-padding: 4px 12px</code> · <code>border-radius: 8px</code> ·{' '}
          <code>font-size: 11px</code> · <code>gap: 4px</code>
        </div>
      }
      apiReference={monitoringToolbarProps}
      relatedLinks={[
        {
          label: 'DatePicker',
          path: '/design/components/datepicker',
          description: 'Date range selection',
        },
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart component guidelines',
        },
      ]}
    />
  );
}
