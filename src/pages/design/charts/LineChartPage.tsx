import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { AreaChartDemo, chartColors } from '../../design-system-sections/ChartComponents';
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

function LineChartGuidelines() {
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
              <Td>차트 목적을 설명</Td>
            </tr>
            <tr>
              <Td>
                <strong>Chart Area</strong>
              </Td>
              <Td>그래프가 표시되는 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>X-axis</strong>
              </Td>
              <Td>시간 축</Td>
            </tr>
            <tr>
              <Td>
                <strong>Y-axis</strong>
              </Td>
              <Td>값(value) 축</Td>
            </tr>
            <tr>
              <Td>
                <strong>Line</strong>
              </Td>
              <Td>데이터 변화 추이를 나타내는 선</Td>
            </tr>
            <tr>
              <Td>
                <strong>Data Point</strong>
              </Td>
              <Td>각 시점의 데이터 포인트</Td>
            </tr>
            <tr>
              <Td>
                <strong>Grid / Guide Line</strong>
              </Td>
              <Td>데이터 판독을 돕는 보조선</Td>
            </tr>
            <tr>
              <Td>
                <strong>Tooltip</strong>
              </Td>
              <Td>Hover 시 상세 데이터 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Legend</strong>
              </Td>
              <Td>데이터 series 설명</Td>
            </tr>
            <tr>
              <Td>
                <strong>Monitoring Toolbar</strong>
              </Td>
              <Td>기간 선택 또는 데이터 범위 설정</Td>
            </tr>
            <tr>
              <Td>
                <strong>Actions</strong>
              </Td>
              <Td>차트 탐색</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <Prose>
          <p>Line Chart는 데이터 series 수에 따라 다음 두 유형으로 구분된다.</p>
        </Prose>

        <VStack gap={3}>
          <SubSectionTitle>1) Single-series Line Chart</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>하나의 데이터 시리즈를 표시한다.</li>
              <li>단일 라인 표시</li>
              <li>Legend 생략 가능</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Multi-series Line Chart</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>여러 데이터 시리즈를 동시에 표시한다.</li>
              <li>색상으로 series 구분</li>
              <li>Legend 제공 필수</li>
            </ul>
          </Prose>
        </VStack>
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
            <p>사용자가 차트 위를 hover하면 해당 시점의 데이터 정보를 확인할 수 있다.</p>
            <p>
              <strong>동작:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Hover 위치에 Vertical guide line 표시</li>
              <li>해당 시점의 Data point 강조</li>
              <li>Tooltip 표시</li>
            </ol>
            <p>
              <strong>Tooltip 정보:</strong> timestamp, series label, value
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
          <SubSectionTitle>3) X-axis</SubSectionTitle>
          <Prose>
            <p>X-axis는 시간 축을 사용한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>동일 차트 내에서는 동일한 시간 단위 유지</li>
              <li>시간 포맷은 Chart 범위에 따라 결정</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) Y-axis</SubSectionTitle>
          <Prose>
            <p>Y-axis는 값(Value)을 표시한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>단일 단위만 사용</li>
              <li>Tick 개수는 5개 고정</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) Monitoring Toolbar</SubSectionTitle>
          <Prose>
            <p>Line Chart는 데이터 탐색을 위해 기간 설정 기능을 제공한다.</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>기간 변경 시 데이터 재요청</li>
              <li>차트 업데이트</li>
            </ol>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>6) Zoom 인터랙션</SubSectionTitle>
          <Prose>
            <p>차트 영역을 마우스 스크롤을 이용해 시간 범위를 확대/축소할 수 있다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                여러 Line 차트가 함께 있는 모니터링 화면에서는 Zoom 동작이 동기화되어 시간 범위가
                동일하게 변경된다.
              </li>
              <li>Zoom은 마우스 커서 위치를 중심으로 동작한다.</li>
            </ul>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>최소 범위</Th>
                <Th>최대 범위</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>1 minute</Td>
                <Td>7 days</Td>
              </tr>
            </tbody>
          </TableWrapper>
          <Prose>
            <p>
              <strong>Zoom 활성화 시:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>자동 데이터 갱신이 중단된다.</li>
              <li>차트 시간 범위 고정</li>
              <li>새로운 데이터가 들어와도 차트 업데이트하지 않음</li>
              <li>Zoom이 리셋되었을 때 다시 데이터 갱신</li>
              <li>
                <strong>Latest</strong> (Reset zoom) 버튼이 노출된다. 클릭 시 Zoom 리셋 및 데이터
                갱신 시작.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>7) Legend 인터랙션</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>여러 series가 존재하는 경우 Legend를 통해 표시 여부를 제어한다.</li>
              <li>Legend에서 series를 클릭하면 해당 데이터 표시를 on/off할 수 있다.</li>
              <li>View all / Hide all 토글을 통해 모든 series 표시를 on/off할 수 있다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>8) Expand Chart</SubSectionTitle>
          <Prose>
            <p>차트 확대 버튼 클릭 시 확장된 차트 모달이 열린다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>모달이 열렸을 때는 화면에서 설정된 모니터링 툴바 입력값을 유지한다.</li>
              <li>모달 안에서 변경 시 화면에서는 영향 없음.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>9) Download CSV</SubSectionTitle>
          <Prose>
            <p>클릭 시 차트 데이터가 CSV 파일로 다운로드된다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Multi-series 차트의 경우 CSV에는 모든 series가 포함된다.</li>
              <li>
                파일명: <code>{'{chart-title}_{time-range}.csv'}</code>
              </li>
              <li>포함 데이터: timestamp, series label, value</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>10) View Details</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>클릭 시 View details 드로어가 열린다.</li>
              <li>차트 데이터를 테이블 형태로 확인할 수 있다.</li>
              <li>Close 버튼 클릭 시 드로어가 닫힌다.</li>
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
            '시간 변화 데이터에 Line Chart 사용',
            '동일 단위 데이터만 하나의 차트에 표시',
            'Series 개수를 제한하여 가독성 유지',
            'Tooltip으로 정확한 값 제공',
          ]}
          dontItems={[
            '서로 다른 단위를 동일 차트에 혼합',
            '데이터 포인트를 과도하게 표시',
            '의미 없는 색상 사용',
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

        <VStack gap={3}>
          <SubSectionTitle>6) 자동 단위 변환</SubSectionTitle>
          <Prose>
            <p>차트 값은 값 크기에 따라 적절한 단위로 자동 변환된다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>입력 단위</Th>
                <Th>표시 단위</Th>
                <Th>예시</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>B</Td>
                <Td>KiB / MiB / GiB / TiB / PiB</Td>
                <Td>1,536 B → 1.5 KiB</Td>
              </tr>
              <tr>
                <Td>B/s</Td>
                <Td>KiB/s / MiB/s / GiB/s</Td>
                <Td>1,048,576 B/s → 1 MiB/s</Td>
              </tr>
              <tr>
                <Td>ops/s</Td>
                <Td>ops/s, K/M/B 축약 가능</Td>
                <Td>15,320 ops/s → 15.3K ops/s</Td>
              </tr>
              <tr>
                <Td>p/s</Td>
                <Td>p/s, K/M/B 축약 가능</Td>
                <Td>15,320 p/s → 15.3K p/s</Td>
              </tr>
              <tr>
                <Td>ns</Td>
                <Td>ns / μs / ms / s</Td>
                <Td>1,200 ns → 1.2 μs</Td>
              </tr>
              <tr>
                <Td>ms</Td>
                <Td>ms / s</Td>
                <Td>1,200 ms → 1.2 s</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>7) Y-axis</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                하나의 차트(Y축)는 <strong>단일 단위만 사용</strong>한다.
              </li>
              <li>범위 내 max 기준으로 단위를 결정한 뒤 고정한다.</li>
              <li>축 라벨은 UX Writing Guide의 숫자 표기 규칙을 따른다.</li>
              <li>Y-axis tick 개수는 5로 고정한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>8) X-axis</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Time-series Chart의 X축은 시간 단위를 사용한다.</li>
              <li>시간 포맷은 화면 목적과 범위에 따라 개별 차트 컴포넌트 문서에서 정의한다.</li>
              <li>같은 차트 내에서는 동일한 시간 단위를 유지한다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>
    </VStack>
  );
}

const PRIMARY_COLORS = [
  { name: 'cyan400', hex: chartColors.cyan400 },
  { name: 'emerald400', hex: chartColors.emerald400 },
  { name: 'amber400', hex: chartColors.amber400 },
  { name: 'violet400', hex: chartColors.violet400 },
  { name: 'fuchsia400', hex: chartColors.fuchsia400 },
];

const EXTENDED_COLORS = [
  { name: 'pink400', hex: chartColors.pink400 },
  { name: 'red400', hex: chartColors.red400 },
  { name: 'blue400', hex: chartColors.blue400 },
  { name: 'teal400', hex: chartColors.teal400 },
  { name: 'orange400', hex: chartColors.orange400 },
  { name: 'indigo400', hex: chartColors.indigo400 },
];

function ColorRow({ index, name, hex }: { index: number; name: string; hex: string }) {
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
      <code className="text-body-sm text-[var(--color-text-subtle)]">{hex}</code>
    </div>
  );
}

function ChartColorTokens() {
  return (
    <VStack gap={6}>
      <pre className="px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-text-default)] overflow-x-auto border border-[var(--color-border-subtle)]">
        {`fill-opacity: 0.1  line-width: 1px  smooth: true  symbol-size: 6px`}
      </pre>

      <VStack gap={2}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">
          Primary 5-color palette
        </span>
        <VStack gap={0}>
          {PRIMARY_COLORS.map((c, i) => (
            <ColorRow key={c.name} index={i + 1} name={c.name} hex={c.hex} />
          ))}
        </VStack>
      </VStack>

      <VStack gap={2}>
        <span className="text-heading-h6 text-[var(--color-text-default)]">Extended palette</span>
        <VStack gap={0}>
          {EXTENDED_COLORS.map((c, i) => (
            <ColorRow key={c.name} index={i + 6} name={c.name} hex={c.hex} />
          ))}
        </VStack>
      </VStack>

      <div className="px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-subtle)] text-body-sm text-[var(--color-text-muted)]">
        <span className="text-[var(--color-text-default)] font-medium">CSS tokens:</span>{' '}
        <code>--chart-color-1</code> … <code>--chart-color-10</code>
        {' · '}
        <span className="text-[var(--color-text-default)] font-medium">Import:</span>{' '}
        <code>chartColors</code>, <code>primaryChartColors</code>, <code>extendedChartColors</code>{' '}
        from <code>ChartComponents</code>
      </div>
    </VStack>
  );
}

export function LineChartPage() {
  return (
    <ComponentPageTemplate
      title="Line Chart"
      description="Line Chart는 시간 흐름에 따른 데이터 변화 추이를 시각적으로 표현하는 시계열(Time-series) 차트 컴포넌트이다. 주로 시스템 모니터링 데이터, 트래픽, 리소스 사용량 변화 등 연속적인 데이터 패턴(trend)을 확인하는 목적에 사용된다."
      whenToUse={[
        '시간 흐름에 따른 데이터 변화를 확인해야 하는 경우',
        '모니터링 데이터 시각화',
        '트래픽 변화 추이 확인',
        '리소스 사용량 변화 분석',
      ]}
      whenNotToUse={[
        '현재 상태만 표시 (→ Doughnut Chart)',
        '여러 리소스 상태 표시 (→ Gauge Bar Chart)',
        '데이터 구성 비율 표시 (→ Pie Chart)',
      ]}
      preview={<AreaChartDemo variant="basic" />}
      usage={{
        code: `import { LineChart } from '@/design-system';

<LineChart
  title="CPU Usage"
  series={[
    { name: 'CPU', data: cpuData, color: chartColors.cyan400 },
  ]}
  xAxisData={timestamps}
  yAxisLabel="Usage (%)"
/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Single-series Line Chart</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                하나의 데이터 시리즈를 표시. Legend 생략 가능.
              </span>
            </VStack>
            <AreaChartDemo variant="basic" />
          </VStack>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Multi-series Line Chart (Stacked)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                여러 데이터 시리즈를 동시에 표시. 색상으로 series 구분, Legend 필수.
              </span>
            </VStack>
            <AreaChartDemo variant="stacked" />
          </VStack>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>No Data</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                데이터가 없는 경우 "No data available" 표시.
              </span>
            </VStack>
            <AreaChartDemo variant="nodata" />
          </VStack>
        </VStack>
      }
      guidelines={<LineChartGuidelines />}
      tokens={<ChartColorTokens />}
      relatedLinks={[
        { label: 'Chart Overview', path: '/design/charts/overview', description: '상위 차트 패턴' },
        { label: 'Usage Chart', path: '/design/charts/usage-chart', description: '사용률 차트' },
        { label: 'Pie Chart', path: '/design/charts/pie-chart', description: '구성 비율 차트' },
        { label: 'Tooltip', path: '/design/components/tooltip', description: '데이터 설명' },
        {
          label: 'Monitoring Toolbar',
          path: '/design/components/monitoring-toolbar',
          description: '시간 범위 제어',
        },
      ]}
    />
  );
}
