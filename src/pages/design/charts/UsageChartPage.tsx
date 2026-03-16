import { type ReactNode, useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { Label } from '../../design-system-sections/HelperComponents';
import {
  QuotaBarDemo,
  DoughnutChartDemo,
  HalfDoughnutChartDemo,
} from '../../design-system-sections/ChartComponents';
import { ProgressBar, VStack } from '@/design-system';

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

function getCSSVar(name: string, fallback: string) {
  if (typeof window !== 'undefined') {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  }
  return fallback;
}

function statusColor(pct: number) {
  if (pct >= 95) return getCSSVar('--color-state-danger', '#dc2626');
  if (pct >= 70) return getCSSVar('--color-state-warning', '#ea580c');
  return getCSSVar('--color-state-success', '#22c55e');
}

function GaugeHoverTooltip({
  used,
  max,
  unit,
  children,
}: {
  used: number;
  max: number;
  unit?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const available = max - used;
  const pct = Math.round((used / max) * 100);
  const color = statusColor(pct);
  const suffix = unit ? ` ${unit}` : '';
  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 w-fit whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)]">
              Used:{' '}
              <span className="font-medium">
                {used}
                {suffix} ({pct}%)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full shrink-0 bg-[var(--color-border-subtle)]" />
            <span className="text-body-sm leading-[14px] text-[var(--color-text-default)]">
              Available:{' '}
              <span className="font-medium">
                {available}
                {suffix} ({100 - pct}%)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageChartGuidelines() {
  return (
    <VStack gap={10}>
      {/* Component selection table */}
      <VStack gap={4}>
        <SectionTitle>Component Selection</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">컴포넌트</Th>
              <Th>적합한 상황</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Gauge Bar Chart</strong>
              </Td>
              <Td>
                표시할 리소스가 <strong>2개 이상</strong>이거나, 리스트/대시보드 형태로 나열할 때
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Donut Chart</strong>
              </Td>
              <Td>
                표시할 리소스가 <strong>1개</strong>이고, 사용량을 강조하여 단독으로 표현할 때.
                레이아웃에 따라 <strong>Full(원형)</strong> 또는 <strong>Half(반원형)</strong>{' '}
                variant를 선택한다.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 1. Gauge Bar Chart */}
      <VStack gap={4}>
        <SectionTitle>1. Gauge Bar Chart</SectionTitle>
        <Prose>
          <p>
            사용량과 한도를 시각화하는 수평형 막대 인디케이터다. 복수의 리소스를 리스트 형태로
            나열하여 비교할 때 사용한다.
          </p>
        </Prose>

        <SubSectionTitle>Variants</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>수치 레이블만 표시 (예: 30 MB (30%)). 공간이 제한적인 컨텍스트에서 사용</Td>
            </tr>
            <tr>
              <Td>
                <strong>Quota</strong>
              </Td>
              <Td>Label과 Value(사용량/총량)를 함께 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Range</strong>
              </Td>
              <Td>최소값~최대값 범위가 있고, 그 안에서 현재값의 위치를 추가로 표시할 때 사용</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Composition</SubSectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[Label]        [Value]
[██████░░░░░░░░]`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[160px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>a. Track</strong>
              </Td>
              <Td>전체 너비의 배경 Bar. 미사용 또는 잔여 영역을 나타냄</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>b. Fill</strong>
              </Td>
              <Td>현재 값에 비례한 채워진 Bar. Variant에 따라 색상 정책이 다름</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>c. Label</strong>
              </Td>
              <Td>리소스 또는 지표 이름</Td>
              <Td>Variant에 따라 선택</Td>
            </tr>
            <tr>
              <Td>
                <strong>d. Value</strong>
              </Td>
              <Td>절대값 / 상대값(사용량/총량) / 퍼센트(%) 형식의 값 중 선택적으로 표시</Td>
              <Td>항상</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>height</Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>border-radius</Td>
              <Td>pill (full round)</Td>
            </tr>
            <tr>
              <Td>색상</Td>
              <Td>Status color token 참조</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 2. Donut Chart */}
      <VStack gap={4}>
        <SectionTitle>2. Donut Chart</SectionTitle>
        <Prose>
          <p>
            도넛 그래프 형태로 단일 리소스의 사용량을 표현한다. 나타내는 요소는 Full과 Half 모두
            동일하며, 레이아웃과 디자인 맥락에 따라 variant를 선택한다.
          </p>
        </Prose>

        <SubSectionTitle>Variants</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[100px]">Variant</Th>
              <Th className="w-[100px]">형태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Full</strong>
              </Td>
              <Td>원형</Td>
              <Td>일반적인 도넛 차트 형태. 넓은 영역이 확보될 때 사용</Td>
            </tr>
            <tr>
              <Td>
                <strong>Half</strong>
              </Td>
              <Td>반원형</Td>
              <Td>세로 공간이 제한적인 레이아웃에 사용. 수치와 범례는 동일하게 제공</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Composition</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[120px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>a. 그래프 타이틀</strong>
              </Td>
              <Td>차트 상단에 표시되는 리소스 또는 지표 이름 (예: Capacity used)</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>b. 도넛 그래프</strong>
              </Td>
              <Td>사용량 비율만큼 Fill 색상으로 채워짐. 나머지는 Available 색상으로 표시</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>c. 중앙 퍼센트 수치</strong>
              </Td>
              <Td>도넛 내부에 표시되는 사용률 (예: 89%). 상태 색상과 연동</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>d. 사용량 / 전체 용량 텍스트</strong>
              </Td>
              <Td>그래프 하단에 표시 (예: 167.49/189.9TiB). 소수점 둘째 자리까지 표시 (반올림)</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>e. 범례</strong>
              </Td>
              <Td>Used / Available 항목의 색상과 실제 수치(value, percent) 표시</Td>
              <Td>항상</Td>
            </tr>
            <tr>
              <Td>
                <strong>f. 툴팁</strong>
              </Td>
              <Td>호버 시 노출. 포함 정보: 데이터 종류(Used / Available), value, percent</Td>
              <Td>호버 시</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>상태 기반 색상 전환</SubSectionTitle>
          <Prose>
            <p>
              사용률(%)에 따라 Fill 색상이 자동으로 변경된다. Gauge Bar Chart와 Donut Chart에 동일한
              임계값이 적용된다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>상태</Th>
                <Th>기준 (사용률)</Th>
                <Th>색상</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Safe</strong>
                </Td>
                <Td>0 ~ 69%</Td>
                <Td>Green</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Warning</strong>
                </Td>
                <Td>70 ~ 94%</Td>
                <Td>Orange</Td>
              </tr>
              <tr>
                <Td>
                  <strong>Danger</strong>
                </Td>
                <Td>95% 이상</Td>
                <Td>Red</Td>
              </tr>
            </tbody>
          </TableWrapper>
          <Prose>
            <p>
              임계값은 서비스 도메인에 따라 조정될 수 있으며, 변경 시{' '}
              <strong>Status color token</strong>과 함께 관리한다.
            </p>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>툴팁</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>차트 위에 마우스를 호버하면 툴팁이 노출된다.</li>
              <li>포함 정보: 데이터 종류(Used / Available), value, percent</li>
              <li>
                예: <span className="font-mono">Used: 167.49TiB (89%)</span> /{' '}
                <span className="font-mono">Available: 22.41TiB (11%)</span>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>애니메이션</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>두 컴포넌트 모두 초기 렌더링 시 Fill 값은 애니메이션 없이 즉시 반영한다.</li>
              <li>실시간 데이터 갱신 시에도 Fill 값은 즉시 업데이트된다.</li>
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
            '데이터 성격에 맞는 Variant를 선택한다. 범위 기반 현재값은 Range, 할당량 대비 사용량은 Quota를 사용한다.',
            '동일한 컨텍스트 내 여러 Gauge Bar는 Track 너비를 통일하여 시각적 비교를 용이하게 한다.',
            'Value는 차트와 항상 함께 표시하여 색상만으로 정보를 전달하지 않는다.',
            'Donut Chart는 단일 리소스를 강조할 때만 사용하고, 복수 리소스 비교에는 Gauge Bar Chart를 사용한다.',
            'Donut Chart의 하단 수치 텍스트는 소수점 둘째 자리까지 반올림하여 표시한다.',
            '100%를 초과할 경우 100%일 때와 동일하게 Fill에 표시한다. 초과 시에는 별도의 오버플로우 처리를 적용한다.',
          ]}
          dontItems={[
            '단순 진행률 표시 목적으로 Gauge Bar Chart를 사용하지 않는다. → Progress Bar 사용',
            'Gauge Bar Chart와 Donut Chart를 동일 컨텍스트에 혼용하지 않는다.',
            'Donut Chart에서 3개 이상의 데이터 세그먼트를 표시하지 않는다. Used / Available 2개 세그먼트로 유지한다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function UsageChartPage() {
  return (
    <ComponentPageTemplate
      title="Usage Chart"
      description="전체 용량 대비 현재 사용량을 시각화하는 컴포넌트 그룹이다. 사용률에 따라 상태 기반 색상(Status Color)이 자동 적용된다. 레이아웃 맥락과 표시할 리소스의 수에 따라 Gauge Bar Chart와 Donut Chart 중 적합한 형태를 선택하여 사용한다."
      whenToUse={[
        '리소스 할당량(Quota), 리소스 현황 등을 시각화할 때 (예: vCPU 5/10, Capacity 167.49/189.9 TiB)',
        '사용률에 따른 상태를 색상(Status Color)으로 즉시 인지시켜야 할 때',
      ]}
      whenNotToUse={[
        '단순한 진행 상태(Progress)를 나타낼 때 → Progress Bar 사용',
        '여러 카테고리의 구성 비율을 비교할 때 → Pie Chart 사용',
        '여러 카테고리의 값을 비교할 때 → Bar Chart 사용',
        '전체 대비 비율 맥락이 없는 단독 지표 → Badge 또는 Tag로 대체',
      ]}
      preview={
        <div className="flex gap-8 items-start flex-wrap">
          <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
            <GaugeHoverTooltip used={2} max={10}>
              <ProgressBar variant="quota" label="Instance" value={2} max={10} />
            </GaugeHoverTooltip>
            <GaugeHoverTooltip used={8} max={10}>
              <ProgressBar variant="quota" label="vCPU" value={8} max={10} />
            </GaugeHoverTooltip>
          </div>
          <DoughnutChartDemo title="Capacity Used" value={88} color="#ea580c" />
          <HalfDoughnutChartDemo
            value={35}
            label="Safe"
            status="success"
            used={66.5}
            total={189.9}
            unit="TiB"
          />
        </div>
      }
      examples={
        <VStack gap={8}>
          {/* Gauge Bar Chart Examples */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Gauge Bar Chart — Quota Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Label과 Value(사용량/총량)를 함께 표시. 복수 리소스 비교에 적합.
              </span>
            </VStack>
            <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <GaugeHoverTooltip used={2} max={10}>
                <ProgressBar variant="quota" label="Instance" value={2} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={5} max={10}>
                <ProgressBar variant="quota" label="vCPU" value={5} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={7} max={10}>
                <ProgressBar variant="quota" label="RAM" value={7} max={10} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={10} max={10}>
                <ProgressBar variant="quota" label="Disk" value={10} max={10} />
              </GaugeHoverTooltip>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Gauge Bar Chart — Default Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                수치 레이블만 표시. 공간이 제한적인 컨텍스트에서 사용.
              </span>
            </VStack>
            <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]">
              <GaugeHoverTooltip used={30} max={100} unit="MB">
                <ProgressBar label="30 MB (30%)" value={30} max={100} showValue={false} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={75} max={100} unit="MB">
                <ProgressBar label="60 MB (75%)" value={75} max={100} showValue={false} />
              </GaugeHoverTooltip>
              <GaugeHoverTooltip used={100} max={100} unit="MB">
                <ProgressBar label="100 MB (100%)" value={100} max={100} showValue={false} />
              </GaugeHoverTooltip>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Gauge Bar Chart — Dashboard Variant</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                리소스 그룹 타이틀과 함께 항목별 이름, 사용량/총량, 퍼센트를 모두 표시. 대시보드
                전용.
              </span>
            </VStack>
            <div className="w-[288px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl">
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wide mb-4">
                COMPUTE QUOTA
              </div>
              <div className="space-y-[22px]">
                <GaugeHoverTooltip used={4} max={8} unit="vCPU">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="vCPU" used={4} total={8} unit="vCPU" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={22} max={32} unit="GiB">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="RAM" used={22} total={32} unit="GiB" />
                  </div>
                </GaugeHoverTooltip>
                <GaugeHoverTooltip used={6} max={8} unit="GPU">
                  <div className="pointer-events-none">
                    <QuotaBarDemo label="GPU" used={6} total={8} unit="GPU" />
                  </div>
                </GaugeHoverTooltip>
              </div>
            </div>
          </VStack>

          {/* Donut Chart Examples */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Donut Chart — Full (원형)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                넓은 영역이 확보될 때 사용. 단일 리소스의 사용량을 강조.
              </span>
            </VStack>
            <div className="flex gap-6 flex-wrap">
              <DoughnutChartDemo title="Capacity Used" value={35} color="#22c55e" />
              <DoughnutChartDemo title="OSD onode Hits Ratio" value={88} color="#ea580c" />
              <DoughnutChartDemo title="Memory Usage" value={98.3} color="#ef4444" />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Donut Chart — Half (반원형)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                세로 공간이 제한적인 레이아웃에 사용. 수치와 범례는 Full variant와 동일.
              </span>
            </VStack>
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
      guidelines={<UsageChartGuidelines />}
      relatedLinks={[
        {
          label: 'Status Colors',
          path: '/design/charts/status-colors',
          description: '상태 기반 색상 토큰',
        },
        {
          label: 'Progress Bar',
          path: '/design/components/progress-bar',
          description: '단순 진행률 표시',
        },
        { label: 'Tooltip', path: '/design/components/tooltip', description: '데이터 설명' },
      ]}
    />
  );
}
