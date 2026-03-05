import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DoughnutChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

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
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium">Full (원형)</td>
                      <td className="py-2">넓은 영역에서 사용하는 전체 원형 도넛</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Half (반원형)</td>
                      <td className="py-2">세로 공간이 제한적일 때 사용하는 반원형 도넛</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Element
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Description
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        Condition
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">그래프 타이틀</td>
                      <td className="py-2 pr-4">
                        차트 상단의 리소스/메트릭 이름 (예: Capacity used)
                      </td>
                      <td className="py-2">Always</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">도넛 그래프</td>
                      <td className="py-2 pr-4">
                        사용량에 비례한 fill 색상, 나머지는 Available 색상으로 표시
                      </td>
                      <td className="py-2">Always</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">중앙 퍼센트 수치</td>
                      <td className="py-2 pr-4">
                        링 내부에 사용률 퍼센트 표시, 상태 색상과 동기화
                      </td>
                      <td className="py-2">Always</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">사용량/전체 용량 텍스트</td>
                      <td className="py-2 pr-4">
                        그래프 하단 (예: 167.49/189.9 TiB). 소수점 둘째 자리까지 표시
                      </td>
                      <td className="py-2">Always</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">범례</td>
                      <td className="py-2 pr-4">Used / Available 항목, 색상 점, 값, 퍼센트</td>
                      <td className="py-2">Always</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">툴팁</td>
                      <td className="py-2 pr-4">
                        호버 시: 데이터 유형(Used/Available), 값, 퍼센트
                      </td>
                      <td className="py-2">On hover</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Behavior - 상태 기반 색상 전환
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Status
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Utilization
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        Color
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Safe</td>
                      <td className="py-2 pr-4">0 – 69%</td>
                      <td className="py-2">Green</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Warning</td>
                      <td className="py-2 pr-4">70 – 94%</td>
                      <td className="py-2">Orange</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Danger</td>
                      <td className="py-2 pr-4">95%+</td>
                      <td className="py-2">Red</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                툴팁: 호버 시 Used/Available, 값, 퍼센트 표시. 애니메이션: 초기 로드 시 fill 즉시
                렌더링, 실시간 데이터 업데이트 즉시 반영.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Usage Guidelines - Do ✅
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>단일 리소스에만 사용한다. 복수 리소스는 Gauge Bar Chart 사용.</li>
                  <li>소수점 둘째 자리까지 표시한다.</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">Don&apos;t ❌</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>3개 이상의 세그먼트를 표시하지 않는다. Used / Available만 유지한다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>
      }
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
