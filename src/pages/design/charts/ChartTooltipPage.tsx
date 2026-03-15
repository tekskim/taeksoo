import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { VStack } from '@/design-system';
import { chartColors } from '@/pages/design-system-sections/ChartComponents';

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

function ChartTooltipPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={3}>
        <SubSectionTitle>Tooltip 타입별 사용 기준</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>타입</Th>
              <Th>trigger</Th>
              <Th>사용 차트</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Axis</strong>
              </Td>
              <Td>axis</Td>
              <Td>Area, Bar, Line chart</Td>
            </tr>
            <tr>
              <Td>
                <strong>Item</strong>
              </Td>
              <Td>item</Td>
              <Td>Pie, Doughnut chart</Td>
            </tr>
            <tr>
              <Td>
                <strong>Gauge</strong>
              </Td>
              <Td>Custom (mouseMove)</Td>
              <Td>Half-Doughnut chart</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <SubSectionTitle>공통 스타일 규칙</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              배경색: <code>#ffffff</code>, 테두리: <code>#e2e8f0</code> (border-subtle)
            </li>
            <li>
              텍스트: <code>#1e293b</code> (slate800), 크기: <code>11px</code>
            </li>
            <li>
              폰트: <code>Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif</code>
            </li>
            <li>
              색상 도트: <code>8×8px</code> rounded-full, 시리즈 색상 매칭
            </li>
            <li>
              값 텍스트: <code>font-weight: 500</code> (medium)
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            'hover 시 정확한 수치(값, 단위, 퍼센트)를 표시합니다.',
            '시리즈 색상과 도트 색상을 일치시킵니다.',
            'Gauge 차트는 cursor 근처에 tooltip을 배치합니다.',
          ]}
          dontItems={[
            'tooltip에 과도한 정보(5개 이상 시리즈)를 표시하지 않습니다.',
            '하드코딩된 색상 대신 chartColors 팔레트를 사용합니다.',
            'tooltip 폰트 크기를 11px 이외로 변경하지 않습니다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

function AxisTooltipDemo() {
  return (
    <div
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-sm p-2 text-[var(--color-text-default)]"
      style={{ fontSize: 11, width: 'fit-content' }}
    >
      <div>14:30:00</div>
      <div className="mt-1 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: chartColors.cyan400 }}
          />
          <span>CPU Usage</span>
          <span className="font-medium ml-auto pl-4">42%</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: chartColors.emerald400 }}
          />
          <span>Memory</span>
          <span className="font-medium ml-auto pl-4">67%</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: chartColors.amber400 }}
          />
          <span>Disk I/O</span>
          <span className="font-medium ml-auto pl-4">28%</span>
        </div>
      </div>
    </div>
  );
}

function PieTooltipDemo() {
  return (
    <div
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] shadow-sm text-[var(--color-text-default)]"
      style={{
        fontSize: 11,
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '8px 12px',
        width: 'fit-content',
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: chartColors.cyan400 }}
        />
        <span>Compute</span>
      </div>
      <div className="font-medium" style={{ marginLeft: 14 }}>
        45 (38%)
      </div>
    </div>
  );
}

function GaugeTooltipDemo() {
  return (
    <div className="backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 w-fit">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-state-success)' }}
        />
        <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
          Used: <span className="font-medium">66.5TiB (35%)</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-border-subtle)]" />
        <span className="text-body-sm leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
          Available: <span className="font-medium">123.4TiB (65%)</span>
        </span>
      </div>
    </div>
  );
}

export function ChartTooltipPage() {
  return (
    <ComponentPageTemplate
      title="Chart tooltip"
      description="Tooltip styles for chart and graph components"
      preview={
        <div className="flex items-center justify-center py-4">
          <AxisTooltipDemo />
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Axis tooltip (Area / Bar / Line)
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Triggered on axis hover. Shows time header with series items containing colored dots,
              names, and values.
            </span>
            <div className="flex gap-6 items-start">
              <AxisTooltipDemo />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Item tooltip (Pie / Doughnut)
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Triggered on item hover. Shows single item with colored dot, name, value, and
              percentage.
            </span>
            <div className="flex gap-6 items-start">
              <PieTooltipDemo />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Gauge tooltip (Half-Doughnut / Gauge bar chart)
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Custom DOM tooltip with backdrop blur. Follows cursor position. Shows used/available
              breakdown.
            </span>
            <div className="flex gap-6 items-start">
              <GaugeTooltipDemo />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<ChartTooltipPageGuidelines />}
      tokens={
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Property
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Axis / Item
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Gauge
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Background</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">#ffffff</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">
                    surface-default + backdrop-blur 40px
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Border</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">#e2e8f0</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">border-default</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Radius</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                    4px (axis) / 6px (item)
                  </td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">6px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Padding</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                    8px (axis) / 8×12px (item)
                  </td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">8×6px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Font size</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">body-sm (11px)</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Shadow</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                    default (ECharts)
                  </td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">
                    0 0 4px rgba(0,0,0,0.1)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[var(--color-text-default)]">Dot size</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                    8×8px rounded-full
                  </td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">
                    8×8px rounded-full
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      }
      relatedLinks={[
        {
          label: 'Chart overview',
          path: '/design/charts/overview',
          description: 'Chart guidelines',
        },
        {
          label: 'Status colors',
          path: '/design/charts/status-colors',
          description: 'Color thresholds',
        },
        {
          label: 'Tooltip',
          path: '/design/components/tooltip',
          description: 'UI tooltip component',
        },
      ]}
    />
  );
}
