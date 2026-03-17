import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { MonitoringToolbar, VStack } from '@/design-system';

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

function MonitoringToolbarGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[30m] [1h] [6h] [12h] [24h] | Period | Refresh`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">구성 요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Relative Time Buttons</strong>
              </Td>
              <Td>빠른 시간 범위 선택</Td>
            </tr>
            <tr>
              <Td>
                <strong>Custom Range Button</strong>
              </Td>
              <Td>특정 기간 선택</Td>
            </tr>
            <tr>
              <Td>
                <strong>Refresh Button</strong>
              </Td>
              <Td>데이터 새로고침</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Relative Time Buttons</SubSectionTitle>
          <Prose>
            <p>미리 정의된 시간 범위를 빠르게 선택할 수 있는 버튼 그룹이다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>라디오 버튼처럼 동작한다.</li>
              <li>한 번에 하나만 활성화된다.</li>
              <li>선택 즉시 그래프 데이터가 갱신된다.</li>
              <li>버튼은 [30m], [1h], [6h], [12h], [24h]으로 구성된다.</li>
              <li>기본값은 30m이다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Custom Range Button</SubSectionTitle>
          <Prose>
            <p>사용자가 특정 기간을 직접 선택할 수 있는 기능이다.</p>
          </Prose>
          <Prose>
            <p>
              <strong>동작:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>버튼 클릭</li>
              <li>Date Picker 표시</li>
              <li>기간 선택</li>
              <li>그래프 데이터 갱신</li>
            </ol>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
            <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[Period]
→
2026-03-01 ~ 2026-03-07  [Clear]`}</pre>
          </div>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Custom Range 선택 시 Relative Time 선택은 해제된다.</li>
              <li>Clear 클릭 시 기본 상대 시간으로 복귀한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Refresh Button</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Refresh는 현재 시간 범위를 변경하지 않는다.</li>
              <li>클릭 시 데이터 새로고침</li>
              <li>그래프 데이터 다시 로드</li>
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
            '자주 사용하는 시간 범위를 기본 버튼으로 제공한다.',
            '상대 시간 버튼을 라디오 그룹으로 구성한다.',
            'Custom Range 기능을 함께 제공한다.',
          ]}
          dontItems={[
            '너무 많은 시간 범위 버튼을 제공하지 않는다.',
            '상대 시간과 커스텀 기간을 동시에 활성화하지 않는다.',
            '새로고침 기능을 숨기지 않는다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Relative Time</SubSectionTitle>
          <Prose>
            <p>시간 단위는 다음 형식을 사용한다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">단위</Th>
                <Th>표기</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Minute</Td>
                <Td>m</Td>
              </tr>
              <tr>
                <Td>Hour</Td>
                <Td>h</Td>
              </tr>
              <tr>
                <Td>Day</Td>
                <Td>d</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Custom Range</SubSectionTitle>
          <Prose>
            <p>기간 표기는 로케일 기준을 따른다.</p>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
            <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`Mar 1 – Mar 7, 2026
2026-03-01 ~ 2026-03-07`}</pre>
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
}

export function MonitoringToolbarPage() {
  return (
    <ComponentPageTemplate
      title="Monitoring Toolbar"
      description="Monitoring Toolbar는 그래프 또는 시계열 데이터 기반 모니터링 화면에서 데이터 조회 시간 범위를 제어하기 위한 패턴이다. 최소한의 조작으로 원하는 시간 범위의 데이터를 빠르게 탐색할 수 있도록 한다."
      whenToUse={[
        '시계열 데이터 그래프',
        '모니터링 대시보드',
        '로그 조회 화면',
        '메트릭 분석 화면',
      ]}
      whenNotToUse={['비시계열 데이터 기간 필터 (→ Search input)']}
      preview={
        <ComponentPreview
          code={`<MonitoringToolbar
  onTimeRangeChange={(value) => {}}
  onCustomPeriodChange={(period) => {}}
  onRefresh={() => {}}
/>`}
        >
          <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <MonitoringToolbar
              onTimeRangeChange={() => {}}
              onCustomPeriodChange={() => {}}
              onRefresh={() => {}}
            />
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default (30m selected)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                기본값 30m이 선택된 상태. 라디오 버튼처럼 한 번에 하나만 활성화.
              </span>
            </VStack>
            <div className="flex items-center justify-end p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
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
      relatedLinks={[
        {
          label: 'Date Picker',
          path: '/design/components/datepicker',
          description: '기간 선택 컴포넌트',
        },
        {
          label: 'Loading',
          path: '/design/components/loading',
          description: '데이터 조회 상태 패턴',
        },
        {
          label: 'Chart Overview',
          path: '/design/charts/overview',
          description: '데이터 표시 가이드',
        },
      ]}
    />
  );
}
