import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { PieChartDemo, chartColors } from '../../design-system-sections/ChartComponents';
import { Label } from '../../design-system-sections/HelperComponents';
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

function PieChartGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Chart Title</strong>
              </Td>
              <Td>차트 목적 설명</Td>
            </tr>
            <tr>
              <Td>
                <strong>Chart Area</strong>
              </Td>
              <Td>원형 그래프 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Slice</strong>
              </Td>
              <Td>데이터 항목 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Legend</strong>
              </Td>
              <Td>데이터 항목 설명</Td>
            </tr>
            <tr>
              <Td>
                <strong>Tooltip</strong>
              </Td>
              <Td>Hover 시 상세 데이터 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Data Label</strong>
              </Td>
              <Td>데이터 항목 이름</Td>
            </tr>
            <tr>
              <Td>
                <strong>Empty State</strong>
              </Td>
              <Td>데이터가 없는 경우 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Loading State</strong>
              </Td>
              <Td>데이터 로딩 상태 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Error State</strong>
              </Td>
              <Td>데이터 조회 실패 상태 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Data Loading</SubSectionTitle>
          <Prose>
            <p>페이지 진입 시 차트 데이터 요청이 발생한다.</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Chart skeleton 표시</li>
              <li>데이터 로딩 완료 시 차트 렌더링</li>
            </ol>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Hover Interaction</SubSectionTitle>
          <Prose>
            <p>사용자가 Slice 영역을 hover하면 해당 데이터 정보를 확인할 수 있다.</p>
            <p>
              <strong>동작:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>해당 Slice 강조 표시</li>
              <li>Tooltip 표시</li>
            </ol>
            <p>
              <strong>Tooltip 정보:</strong> category label, value, percentage
            </p>
            <p>
              <strong>정책:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tooltip은 hover 위치 기준 시점 데이터 표시</li>
              <li>Multi-series일 경우 모든 series 값 표시</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Data Sorting</SubSectionTitle>
          <Prose>
            <p>Pie Chart의 데이터는 다음 기준으로 정렬한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                기본 정렬: <strong>값 기준 내림차순</strong>
              </li>
              <li>
                가장 큰 항목이 <strong>12시 방향부터 시작</strong>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) Data Density</SubSectionTitle>
          <Prose>
            <p>Pie Chart는 데이터 항목 수가 제한되어야 한다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">항목 수</Th>
                <Th>정책</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>1</Td>
                <Td>Pie Chart 사용 불가</Td>
              </tr>
              <tr>
                <Td>2–5</Td>
                <Td>권장</Td>
              </tr>
              <tr>
                <Td>6–7</Td>
                <Td>가능</Td>
              </tr>
              <tr>
                <Td>8 이상</Td>
                <Td>Others 그룹화 권장</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) Label 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Slice 내부 또는 외부에 표시한다.</li>
              <li>Slice 크기가 작을 경우 Label 생략 가능하다.</li>
              <li>Tooltip을 통해 상세 정보 제공한다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '구성 비율을 보여줄 때 사용한다.',
            '데이터 항목 수를 제한하여 가독성을 유지한다.',
            '가장 큰 데이터가 먼저 보이도록 정렬한다.',
            'Tooltip으로 정확한 값을 제공한다.',
          ]}
          dontItems={[
            '항목 수가 많은 데이터를 Pie Chart로 표시하지 않는다.',
            '시간 흐름 데이터를 Pie Chart로 표시하지 않는다.',
            '너무 작은 Slice가 많이 생기도록 설계하지 않는다.',
            '서로 다른 단위를 동일 차트에 혼합하지 않는다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) 반올림 규칙</SubSectionTitle>
          <Prose>
            <p>
              모든 반올림은 <strong>round half-up</strong>을 사용한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>12.25 → 12.3</li>
              <li>12.24 → 12.2</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) 숫자와 단위 표기</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>숫자와 단위 사이에는 공백 1칸을 둔다.</li>
              <li>퍼센트(%)는 공백 없이 표기한다.</li>
              <li>예: 1.2 GiB/s, 72.4%</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Trailing Zero</SubSectionTitle>
          <Prose>
            <p>의미를 추가하지 않는 소수점 .0은 제거한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>2.0 GiB → 2 GiB</li>
              <li>1.0K → 1K</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 숫자 표시 규칙</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>값 범위</Th>
                <Th>표시 정책</Th>
                <Th>예시</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>{'< 10'}</Td>
                <Td>소수 1자리까지 표시, trailing zero 제거 가능</Td>
                <Td>9.7 / 9</Td>
              </tr>
              <tr>
                <Td>10 ~ 100</Td>
                <Td>소수 1자리까지 표시, trailing zero 제거 가능</Td>
                <Td>12.3 / 12</Td>
              </tr>
              <tr>
                <Td>{'>= 100'}</Td>
                <Td>정수</Td>
                <Td>125</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) 천 단위 구분</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>숫자는 사용자 로케일 기준으로 포맷한다.</li>
              <li>로케일 정보가 없을 경우 콤마를 사용한다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>
    </VStack>
  );
}

const PIE_PRIMARY = [
  { name: 'cyan400', hex: chartColors.cyan400 },
  { name: 'emerald400', hex: chartColors.emerald400 },
  { name: 'amber400', hex: chartColors.amber400 },
  { name: 'violet400', hex: chartColors.violet400 },
  { name: 'fuchsia400', hex: chartColors.fuchsia400 },
];

const PIE_EXTENDED = [
  { name: 'pink400', hex: chartColors.pink400 },
  { name: 'red400', hex: chartColors.red400 },
  { name: 'blue400', hex: chartColors.blue400 },
  { name: 'teal400', hex: chartColors.teal400 },
  { name: 'orange400', hex: chartColors.orange400 },
  { name: 'indigo400', hex: chartColors.indigo400 },
];

function PieColorRow({ index, name, hex }: { index: number; name: string; hex: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-body-sm text-[var(--color-text-subtle)] w-5 text-right tabular-nums">
        {index}
      </span>
      <span
        className="inline-block w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <span className="text-body-md text-[var(--color-text-default)]">{name}</span>
      <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">{hex}</span>
    </div>
  );
}

function PieChartColorTokens() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">
          Primary 5-color palette
        </span>
        <VStack gap={0}>
          {PIE_PRIMARY.map((c, i) => (
            <PieColorRow key={c.name} index={i + 1} name={c.name} hex={c.hex} />
          ))}
        </VStack>
      </VStack>

      <VStack gap={2}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">Extended palette</span>
        <VStack gap={0}>
          {PIE_EXTENDED.map((c, i) => (
            <PieColorRow key={c.name} index={i + 6} name={c.name} hex={c.hex} />
          ))}
        </VStack>
      </VStack>

      <div className="px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-subtle)] text-body-sm text-[var(--color-text-muted)]">
        <span className="text-[var(--color-text-default)] font-medium">CSS tokens:</span>{' '}
        <span className="font-mono">--chart-color-1</span> …{' '}
        <span className="font-mono">--chart-color-10</span>
        {' · '}
        <span className="text-[var(--color-text-default)] font-medium">Import:</span>{' '}
        <span className="font-mono">chartColors</span>,{' '}
        <span className="font-mono">primaryChartColors</span>,{' '}
        <span className="font-mono">extendedChartColors</span> from{' '}
        <span className="font-mono">ChartComponents</span>
      </div>
    </VStack>
  );
}

export function PieChartPage() {
  return (
    <ComponentPageTemplate
      title="Pie Chart"
      description="Pie Chart는 하나의 카테고리 내에서 여러 데이터 항목의 구성 비율을 시각적으로 표현하는 차트 컴포넌트이다. 데이터의 전체 대비 비율 관계를 빠르게 이해할 수 있도록 설계되며, 특정 시점의 상태를 표현하는 Non-time-series Chart에 해당한다."
      whenToUse={[
        '하나의 카테고리 내에서 데이터 구성 비율을 보여줘야 하는 경우',
        '전체 대비 상대적인 비중을 빠르게 이해해야 하는 경우',
        '데이터 항목 간 비율 비교가 중요한 경우',
      ]}
      whenNotToUse={[
        '현재 상태만 표시 (→ Doughnut Chart)',
        '여러 리소스 상태 표시 (→ Gauge Bar Chart)',
        '시간 변화 데이터 (→ Line Chart)',
      ]}
      preview={
        <PieChartDemo
          title="OSD Objectstore Types"
          data={[
            { name: 'bluestore', value: 70 },
            { name: 'filestore', value: 20 },
            { name: 'seastore', value: 10 },
          ]}
        />
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Basic (2–5 items, recommended)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                권장 항목 수. 가장 큰 항목이 12시 방향부터 시작하며 값 기준 내림차순 정렬.
              </span>
            </VStack>
            <PieChartDemo
              title="OSD Objectstore Types"
              data={[
                { name: 'bluestore', value: 70 },
                { name: 'filestore', value: 20 },
                { name: 'seastore', value: 10 },
              ]}
            />
          </VStack>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Many Items (8+, Others grouping recommended)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                항목이 8개 이상일 경우 Others 그룹화를 권장한다.
              </span>
            </VStack>
            <PieChartDemo
              title="OSD Types Summary"
              data={[
                { name: 'hdd', value: 15 },
                { name: 'nvme', value: 25 },
                { name: 'ssd', value: 30 },
                { name: 'hybrid', value: 10 },
                { name: 'sata', value: 5 },
                { name: 'sas', value: 5 },
                { name: 'pcie', value: 4 },
                { name: 'u.2', value: 3 },
                { name: 'm.2', value: 3 },
              ]}
            />
          </VStack>
        </VStack>
      }
      guidelines={<PieChartGuidelines />}
      tokens={<PieChartColorTokens />}
      relatedLinks={[
        { label: 'Chart Overview', path: '/design/charts/overview', description: '상위 차트 패턴' },
        { label: 'Usage Chart', path: '/design/charts/usage-chart', description: '사용률 차트' },
        { label: 'Line Chart', path: '/design/charts/area-chart', description: '시계열 데이터' },
        { label: 'Tooltip', path: '/design/components/tooltip', description: '데이터 설명' },
      ]}
    />
  );
}
