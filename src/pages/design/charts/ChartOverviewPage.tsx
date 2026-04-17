import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';

const GUIDELINES_MARKDOWN = `
## Overview

Chart는 시스템 리소스 상태, 사용량, 구성 비율, 변화 추이를 **직관적으로 시각화하여 빠르게 상태를 인지하고 데이터를 탐색할 수 있도록 하는 데이터 시각화 패턴**이다.

Chart는 다음 목적을 위해 사용된다.

- 시스템 상태를 빠르게 인지
- 데이터 변화 추이를 확인
- 리소스 사용량 비교
- 데이터 구성 비율 이해

Chart는 **읽기 전용(Read-only) 시각화 요소**이며 사용자가 데이터를 직접 수정하거나 조작하지 않는다.

각 차트의 상세 구성, 인터랙션, UX writing 정책은 **개별 Chart 컴포넌트 문서에서 정의한다.**

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Chart Title | 차트의 목적과 데이터 의미를 설명 |
| Chart Area | 실제 데이터가 시각화되는 영역 |
| Axis | 데이터 기준 축 (시간 또는 값) |
| Legend | 데이터 항목 설명 |
| Tooltip | Hover 시 상세 정보 제공 |
| Chart Controls | 기간 변경 또는 필터 조작 |
| Empty State | 데이터가 없을 때 표시 |
| Loading State | 데이터 로딩 중 표시 |
| Error State | 데이터 로딩 실패 시 표시 |

---

## Variants

Chart는 데이터 특성에 따라 다음 두 유형으로 구분된다.

### Time-series Chart

- 시간 흐름에 따른 데이터 변화를 표현한다.
- 특징
  - X축은 시간 축
  - 데이터 변화 추세(trend) 확인 목적
  - 모니터링 데이터에 사용
- 차트 종류: Line chart

### Non-time-series Chart

- 특정 시점의 데이터 상태 또는 구성 비율을 표현한다.
- 특징
  - 시간 축 없음
  - 현재 상태 중심
  - 비교 또는 구성 분석 목적
- 차트 종류: Gauge bar chart, Doughnut chart (Half doughnut chart), Pie chart

---

## Behavior

### 1) User flow

Chart 패턴은 다음과 같은 사용자 흐름을 따른다.

1. **데이터 로딩:** 페이지 진입 시 차트 데이터 요청
   - Chart skeleton 표시
   - 데이터 로딩 완료 시 chart 렌더링
2. **데이터 확인:** 데이터를 시각적으로 확인
   - Hover 시 Tooltip 표시
   - Tooltip에 상세 값 표시
3. **데이터 탐색:** (Time-series Chart의 경우) 탐색 기간을 설정
   - 차트 데이터 재요청
   - 차트 업데이트

### 2) 상태 표시

데이터 상태에 따라 차트에 따라 색상이 변경된다.

| 상태 | 기준 | 색상 |
| --- | --- | --- |
| Safe | 0–69% | 초록색 |
| Warning | 70–89% | 주황색 |
| Danger | 90% 이상 | 붉은색 |

### 3) Empty 상태

- 데이터가 없는 경우 차트 대신 Empty State를 표시한다.
- 문구: No data available

### 4) Error 상태

- 데이터 조회 실패 시 Error State를 표시한다.
- 문구: Failed to load data

### 5) Chart 선택 기준

| 데이터 특성 | 권장 차트 |
| --- | --- |
| 시간 변화 데이터 | Line Chart |
| 단일 리소스 사용률 | (Half) Doughnut Chart, Gauge Bar Chart |
| 데이터 구성 비율 | Pie Chart |

### 6) Tooltip 정책

- 모든 차트는 hover 시 tooltip을 제공한다.
- 구성 요소
  - 데이터 라벨
  - 값
  - 퍼센트(선택)

### 7) Data density 규칙

Data density는 **하나의 차트에 표시할 수 있는 데이터 개수의 권장 범위**를 의미한다. 데이터 특성에 따라 차트 유형을 선택해야 한다.

| 데이터 개수 | 권장 시각화 |
| --- | --- |
| 1 metric | (Half) Doughnut Chart |
| 2–10 metric | Gauge Bar Chart |
| 2–5 category | Pie Chart |
| 시간 기반 metric | Line Chart |

---

## Content Guidelines

### 1) 반올림 규칙

- 모든 반올림은 **round half-up**을 사용한다.
- 예시
  - 12.25 → 12.3
  - 12.24 → 12.2

### 2) 숫자와 단위 표기

- 숫자와 단위 사이에는 공백 1칸을 둔다.
- 퍼센트(%)는 공백 없이 표기한다.
- 예시
  - 1.2 GiB/s
  - 72.4%

### 3) Trailing zero

- 의미를 추가하지 않는 소수점 .0은 제거한다.
- 예시
  - 2.0 GiB → 2 GiB
  - 1.0K → 1K

### 4) 숫자 표시 규칙

| 값 범위 | 표시 정책 | 예시 |
| --- | --- | --- |
| < 10 | 소수 1자리까지 표시, trailing zero 제거 가능 | 9.7 / 9 |
| 10 ~ 100 | 소수 1자리까지 표시, trailing zero 제거 가능 | 12.3 / 12 |
| >= 100 | 정수 | 125 |

### 5) 천 단위 구분

- 숫자는 사용자 로케일 기준으로 포맷한다.
- 로케일 정보가 없을 경우 콤마를 사용한다.

### 6) 자동 단위 변환

차트 값은 값 크기에 따라 적절한 단위로 자동 변환된다.

| 입력 단위 | 표시 단위 | 예시 |
| --- | --- | --- |
| B | KiB / MiB / GiB / TiB / PiB | 1,536 B → 1.5 KiB |
| B/s | KiB/s / MiB/s / GiB/s | 1,048,576 B/s → 1 MiB/s |
| ops/s | ops/s, K/M/B 축약 가능 | 15,320 ops/s → 15.3K ops/s |
| p/s | p/s, K/M/B 축약 가능 | 15,320 p/s → 15.3K p/s |
| ns | ns / μs / ms / s | 1,200 ns → 1.2 μs |
| ms | ms / s | 1,200 ms → 1.2 s |

### 7) Y-axis

- 하나의 차트(Y축)는 **단일 단위만 사용**한다.
- 범위 내 max 기준으로 단위를 결정한 뒤 고정한다.
- 축 라벨은 UX Writing Guide의 숫자 표기 규칙을 따른다.
- Y-axis tick 개수는 5로 고정한다.

### 8) X-axis

- Time-series Chart의 X축은 시간 단위를 사용한다.
- 시간 포맷은 화면 목적과 범위에 따라 개별 차트 컴포넌트 문서에서 정의한다.
- 같은 차트 내에서는 동일한 시간 단위를 유지한다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Line Chart | Component | 시계열 데이터 차트 |
| Usage Chart (Gauge Bar Chart / Donut Chart) | Component | 사용률 차트 |
| Pie Chart | Component | 구성 비율 차트 |
| Tooltip | Component | 데이터 설명 |
| UX writing Guide | Foundation | 숫자 및 단위 표기 규칙 |
`;

export function ChartOverviewPage() {
  return (
    <ComponentPageTemplate
      title="Chart overview"
      description="시스템 리소스 상태, 사용량, 구성 비율, 변화 추이를 직관적으로 시각화하여 빠르게 상태를 인지하고 데이터를 탐색할 수 있도록 하는 데이터 시각화 패턴이다. 읽기 전용 시각화이며, 각 차트의 상세 구성·인터랙션·UX writing 정책은 개별 Chart 컴포넌트 문서에서 정의한다."
      whenToUse={[
        '시스템 리소스 사용량 표시',
        '시간에 따른 데이터 변화 확인',
        '리소스 구성 비율 표시',
        '여러 리소스의 사용량 비교',
      ]}
      whenNotToUse={[
        '상태 표시만 필요한 경우 (→ Status indicator)',
        '데이터가 매우 적은 경우 (→ Text/Badge)',
        '데이터 상세 정보를 나열해야 하는 경우 (→ Table)',
      ]}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={GUIDELINES_MARKDOWN} />
          <DosDonts
            doItems={[
              '데이터 특성에 맞는 차트 유형을 선택한다.',
              '동일한 데이터는 동일한 차트 유형으로 표시한다.',
              '차트 제목을 통해 데이터 의미를 명확히 전달한다.',
              'Tooltip을 통해 상세 데이터를 제공한다.',
            ]}
            dontItems={[
              '너무 많은 데이터를 하나의 차트에 표시하지 않는다.',
              '의미 없는 색상 사용을 피한다.',
              '차트에 과도한 라벨을 표시하지 않는다.',
              '서로 다른 단위를 동일 차트에 혼합하지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label-sm font-semibold text-[var(--color-text-default)]">
              Chart Libraries
            </span>
          </div>
          <div className="text-body-sm text-[var(--color-text-muted)] flex flex-col gap-2">
            <div>
              <span className="text-[var(--color-text-subtle)]">Bar chart:</span>{' '}
              <span className="font-mono px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                ProgressBar
              </span>{' '}
              - TDS 자체 컴포넌트 (CSS 기반)
            </div>
            <div>
              <span className="text-[var(--color-text-subtle)]">Area / Pie / Doughnut:</span>{' '}
              <span className="font-mono px-1.5 py-0.5 bg-[var(--color-surface-default)] rounded text-[var(--color-action-primary)]">
                echarts-for-react
              </span>{' '}
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
      }
      relatedLinks={[
        { label: 'Line Chart', path: '/design/charts/area-chart' },
        { label: 'Usage Chart', path: '/design/charts/usage-chart' },
        { label: 'Pie Chart', path: '/design/charts/pie-chart' },
        { label: 'Tooltip', path: '/design/components/tooltip' },
        { label: 'UX Writing Guide', path: '/design/policies/ux-writing' },
      ]}
    />
  );
}
