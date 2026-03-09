import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { HalfDoughnutChartDemo } from '../../design-system-sections/ChartComponents';
import { VStack } from '@/design-system';

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
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Variants (Half variant)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Donut Chart의 반원형 variant. 세로 공간이 제한적일 때 사용하며, 구성 요소와 동작은
                Full variant와 동일하다.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                그래프 타이틀, 도넛 그래프(반원형), 중앙 퍼센트 수치, 사용량/전체 용량 텍스트, 범례,
                툴팁 — Full variant와 동일.
              </p>
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
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <DosDonts
                doItems={[
                  '단일 리소스에만 사용한다. 복수 리소스는 Gauge Bar Chart 사용.',
                  '소수점 둘째 자리까지 표시한다.',
                ]}
                dontItems={['3개 이상의 세그먼트를 표시하지 않는다. Used / Available만 유지한다.']}
              />
            </VStack>
          </div>
        </VStack>
      }
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
