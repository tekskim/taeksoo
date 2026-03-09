import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { HalfDoughnutChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

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

function HalfDoughnutChartPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={3}>
        <SectionTitle>Variants (Half variant)</SectionTitle>
        <Prose>
          <p>
            Donut Chart의 반원형 variant. 세로 공간이 제한적일 때 사용하며, 구성 요소와 동작은 Full
            variant와 동일하다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <Prose>
          <p>
            그래프 타이틀, 도넛 그래프(반원형), 중앙 퍼센트 수치, 사용량/전체 용량 텍스트, 범례,
            툴팁 — Full variant와 동일.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>Behavior - 상태 기반 색상 전환</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Status</Th>
              <Th>Utilization</Th>
              <Th>Color</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Safe</strong>
              </Td>
              <Td>0 – 69%</Td>
              <Td>Green</Td>
            </tr>
            <tr>
              <Td>
                <strong>Warning</strong>
              </Td>
              <Td>70 – 94%</Td>
              <Td>Orange</Td>
            </tr>
            <tr>
              <Td>
                <strong>Danger</strong>
              </Td>
              <Td>95%+</Td>
              <Td>Red</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            툴팁: 호버 시 Used/Available, 값, 퍼센트 표시. 애니메이션: 초기 로드 시 fill 즉시
            렌더링, 실시간 데이터 업데이트 즉시 반영.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '단일 리소스에만 사용한다. 복수 리소스는 Gauge Bar Chart 사용.',
            '소수점 둘째 자리까지 표시한다.',
          ]}
          dontItems={['3개 이상의 세그먼트를 표시하지 않는다. Used / Available만 유지한다.']}
        />
      </VStack>
    </VStack>
  );
}

export function HalfDoughnutChartPage() {
  return (
    <ComponentPageTemplate
      title="Half-Doughnut chart"
      description="반원형 도넛 그래프로 단일 리소스의 사용량을 표현한다. 세로 공간이 제한적인 레이아웃에서 사용하며, 수치와 범례는 Full variant와 동일하게 제공된다."
      whenToUse={[
        '세로 공간이 제한적인 레이아웃에서 단일 리소스 사용량을 표현할 때',
        '사용률에 따른 상태를 색상으로 즉시 인지시켜야 할 때',
      ]}
      whenNotToUse={[
        '넓은 영역이 확보되는 경우 → Full(원형) variant 사용',
        '표시할 리소스가 2개 이상인 경우 → Gauge Bar Chart 사용',
      ]}
      preview={
        <HalfDoughnutChartDemo
          value={35}
          label="Safe"
          status="success"
          used={66.5}
          total={189.9}
          unit="TiB"
        />
      }
      guidelines={<HalfDoughnutChartPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>arc-width: 14px</code> · <code>start-angle: 200°</code> ·{' '}
          <code>end-angle: -20°</code>
        </div>
      }
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Status variants</span>
            <div className="flex items-center gap-8 flex-wrap">
              <HalfDoughnutChartDemo
                value={35}
                label="Safe"
                status="success"
                used={66.5}
                total={189.9}
                unit="TiB"
              />
              <HalfDoughnutChartDemo
                value={75}
                label="Warning"
                status="warning"
                used={142.4}
                total={189.9}
                unit="TiB"
              />
              <HalfDoughnutChartDemo
                value={95}
                label="Danger"
                status="error"
                used={180.4}
                total={189.9}
                unit="TiB"
              />
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Status Colors', path: '/design/foundation/color' },
        { label: 'Tooltip', path: '/design/components/tooltip' },
      ]}
    />
  );
}
