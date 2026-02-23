import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function ChartOverviewPage() {
  return (
    <ComponentPageTemplate
      title="Chart overview"
      description="Chart component guidelines for visualizing system resources and usage status"
      relatedLinks={[
        {
          label: 'Status colors',
          path: '/design/charts/status-colors',
          description: 'Color thresholds for charts',
        },
        {
          label: 'Progress Bar',
          path: '/design/charts/progress-bar',
          description: 'Quota bar chart',
        },
        {
          label: 'Area chart',
          path: '/design/charts/area-chart',
          description: 'Time series visualization',
        },
        {
          label: 'Pie chart',
          path: '/design/charts/pie-chart',
          description: 'Part-to-whole relationships',
        },
        {
          label: 'Half-Doughnut chart',
          path: '/design/charts/half-doughnut',
          description: 'Gauge-style metric',
        },
        { label: 'Doughnut chart', path: '/design/charts/doughnut', description: 'Ring chart' },
      ]}
    >
      <VStack gap={8}>
        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label-sm font-semibold text-[var(--color-text-default)]">
              Chart Libraries
            </span>
          </div>
          <div className="text-body-sm text-[var(--color-text-muted)] flex flex-col gap-2">
            <div>
              <span className="text-[var(--color-text-subtle)]">Bar chart:</span>{' '}
              <code className="px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                ProgressBar
              </code>{' '}
              - TDS 자체 컴포넌트 (CSS 기반)
            </div>
            <div>
              <span className="text-[var(--color-text-subtle)]">Area / Pie / Doughnut:</span>{' '}
              <code className="px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                echarts-for-react
              </code>{' '}
              - Apache ECharts wrapper for React{' '}
              <a
                href="https://echarts.apache.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-action-primary)] hover:underline"
              >
                Docs →
              </a>
            </div>
          </div>
        </div>

        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={3}>
              <p className="text-body-md text-[var(--color-text-muted)]">
                Chart는 시스템 리소스 및 사용 현황을 <strong>직관적으로 파악</strong>할 수 있도록
                시각화하는 컴포넌트입니다. 데스크탑 UI 환경에서{' '}
                <strong>빠른 상태 인지 + 상세 정보 탐색</strong>을 동시에 지원하는 것을 목표로
                합니다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>
                  Chart는 <strong>읽기 전용 시각화 컴포넌트</strong>입니다.
                </li>
                <li>
                  모든 Chart는 <strong>동일한 색상 규칙, 툴팁 정책, 단위 표기 규칙</strong>을
                  따릅니다.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>2. 공통 규칙</Label>
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">색상 상태 규칙</h4>
              <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                Bar, Half doughnut chart에 공통으로 적용되는 색상 규칙
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                        상태
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        기준
                      </th>
                      <th className="text-left font-medium text-[var(--color-text-subtle)] w-[120px]">
                        색상
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Safe
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        0~69% (낮은 사용량)
                      </td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[var(--color-state-success)]" />
                          <span className="text-[var(--color-state-success)]">초록색</span>
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Warning
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        70~89% (임계 접근)
                      </td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[var(--color-state-warning)]" />
                          <span className="text-[var(--color-state-warning)]">주황색</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Danger
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        90% 이상 (임계 초과)
                      </td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[var(--color-state-danger)]" />
                          <span className="text-[var(--color-state-danger)]">붉은색</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                서비스별 세부 임계값은 아래 <strong>Status Colors</strong> 섹션의 애플리케이션별
                정의를 참조하세요.
              </p>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">텍스트 표시 규칙</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                  <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">퍼센트</h4>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    소수점 없이 <strong>정수로 표시</strong> (반올림)
                  </p>
                </div>
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                  <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                    실제 사용량 / 전체 사용량
                  </h4>
                  <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                    <li>
                      표시 방법:{' '}
                      <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1 py-0.5 rounded-[var(--radius-sm)]">
                        실제 사용량 / 전체 사용량 단위
                      </code>
                    </li>
                    <li>
                      소수점 <strong>둘째자리</strong>까지 표시 (반올림)
                    </li>
                  </ul>
                </div>
              </div>
            </VStack>
          </VStack>
        </VStack>

        <VStack gap={3}>
          <Label>3. 차트 유형별 정책</Label>
          <VStack gap={4}>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={3}>
                <div>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                    (Half) Doughnut chart
                  </h4>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    정책은 동일하고 모양만 디자인적 조화에 따라 선택합니다.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      목적
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      전체 용량 대비 현재 사용량을 한눈에 인지. 표시해야 할 리소스가{' '}
                      <strong>1개</strong>일 때 사용.
                    </p>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      호버 정책
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      호버 시 툴팁 노출 → 데이터 종류, value, percent
                    </p>
                  </div>
                </div>
              </VStack>
            </div>

            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={3}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Bar chart</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      목적
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      전체 용량 대비 현재 사용량을 표시해야 할 리소스가 <strong>많을 때</strong>{' '}
                      사용.
                    </p>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      호버 정책
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      호버 시 툴팁 노출 → 데이터 라벨, 데이터 종류, value, percent
                    </p>
                  </div>
                </div>
              </VStack>
            </div>

            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={3}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Line chart</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      목적
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      시간 흐름에 따라 <strong>변화 추이 파악</strong>이 필요할 때 사용.
                    </p>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      호버 정책
                    </p>
                    <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                      <li>해당 시간 보조선 표시</li>
                      <li>해당 시점 데이터 포인트 강조</li>
                      <li>툴팁 노출 → 모든 데이터 라벨, value</li>
                      <li>x, y축 위에서는 툴팁 노출하지 않음</li>
                    </ul>
                  </div>
                </div>
              </VStack>
            </div>

            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={3}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Pie chart</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      목적
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      1개의 카테고리 내에서 <strong>2개 이상의 데이터 구성 비율</strong>을 확인할 때
                      사용.
                    </p>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1.5">
                      호버 정책
                    </p>
                    <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                      <li>해당 영역 하이라이트 처리</li>
                      <li>툴팁 노출 → 해당 데이터 라벨, value, percent</li>
                    </ul>
                  </div>
                </div>
              </VStack>
            </div>
          </VStack>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
