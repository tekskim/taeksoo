import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { DoughnutChartDemo } from '../../design-system-sections/ChartComponents';
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

function DoughnutChartPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={3}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Variant</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Full (원형)</strong>
              </Td>
              <Td>넓은 영역에서 사용하는 전체 원형 도넛</Td>
            </tr>
            <tr>
              <Td>
                <strong>Half (반원형)</strong>
              </Td>
              <Td>세로 공간이 제한적일 때 사용하는 반원형 도넛</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={3}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Element</Th>
              <Th>Description</Th>
              <Th>Condition</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>그래프 타이틀</Td>
              <Td>차트 상단의 리소스/메트릭 이름 (예: Capacity used)</Td>
              <Td>Always</Td>
            </tr>
            <tr>
              <Td>도넛 그래프</Td>
              <Td>사용량에 비례한 fill 색상, 나머지는 Available 색상으로 표시</Td>
              <Td>Always</Td>
            </tr>
            <tr>
              <Td>중앙 퍼센트 수치</Td>
              <Td>링 내부에 사용률 퍼센트 표시, 상태 색상과 동기화</Td>
              <Td>Always</Td>
            </tr>
            <tr>
              <Td>사용량/전체 용량 텍스트</Td>
              <Td>그래프 하단 (예: 167.49/189.9 TiB). 소수점 둘째 자리까지 표시</Td>
              <Td>Always</Td>
            </tr>
            <tr>
              <Td>범례</Td>
              <Td>Used / Available 항목, 색상 점, 값, 퍼센트</Td>
              <Td>Always</Td>
            </tr>
            <tr>
              <Td>툴팁</Td>
              <Td>호버 시: 데이터 유형(Used/Available), 값, 퍼센트</Td>
              <Td>On hover</Td>
            </tr>
          </tbody>
        </TableWrapper>
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

export function DoughnutChartPage() {
  return (
    <ComponentPageTemplate
      title="Doughnut chart"
      description="도넛 그래프 형태로 단일 리소스의 사용량을 표현한다. 사용률에 따라 상태 기반 색상(Status Color)이 자동 적용되며, 넓은 영역이 확보될 때 사용하는 원형(Full) variant이다."
      whenToUse={[
        '표시할 리소스가 1개이고, 사용량을 강조하여 단독으로 표현할 때',
        '넓은 영역이 확보되는 레이아웃에서 사용량을 시각적으로 강조할 때',
      ]}
      whenNotToUse={[
        '세로 공간이 제한적인 레이아웃 → Half(반원형) variant 사용',
        '표시할 리소스가 2개 이상인 경우 → Gauge Bar Chart 사용',
      ]}
      preview={<DoughnutChartDemo title="OSD onode Hits Ratio" value={98.3} color="#ef4444" />}
      guidelines={<DoughnutChartPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>inner-radius: 68%</code> · <code>outer-radius: 80%</code> ·{' '}
          <code>thickness: 12%</code> · <code>border-radius: 6px</code>
        </div>
      }
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Example</span>
            <div className="flex gap-6 flex-wrap">
              <DoughnutChartDemo title="OSD onode Hits Ratio" value={98.3} color="#ef4444" />
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
