import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const CHART_OVERVIEW_GUIDELINES = `
## Overview

Chart는 시스템 리소스 상태, 사용량, 구성 비율, 변화 추이를 직관적으로 시각화하여 빠르게 상태를 인지하고 데이터를 탐색할 수 있도록 하는 데이터 시각화 패턴이다.

- 시스템 리소스 상태 표시
- 사용량 시각화
- 구성 비율 표시
- 변화 추이 확인

Chart는 읽기 전용(Read-only) 시각화 요소이며 사용자가 데이터를 직접 수정하거나 조작하지 않는다.

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

### Time-series Chart (Line chart)
- 시간 흐름에 따른 데이터 변화를 표현한다.
- X축은 시간 축, 데이터 변화 추세(trend) 확인 목적
- 차트 종류: Line chart

### Non-time-series Chart (Gauge bar, Doughnut, Pie)
- 특정 시점의 데이터 상태 또는 구성 비율을 표현한다.
- 시간 축 없음, 현재 상태 중심
- 차트 종류: Gauge bar chart, Doughnut chart (Half doughnut chart), Pie chart

---

## Behavior

### 1) User flow
1. 데이터 로딩: 페이지 진입 시 차트 데이터 요청 → Chart skeleton 표시 → 데이터 로딩 완료 시 chart 렌더링
2. 데이터 확인: Hover 시 Tooltip 표시 → Tooltip에 상세 값 표시
3. 데이터 탐색: (Time-series Chart의 경우) 탐색 기간을 설정 → 차트 데이터 재요청 → 차트 업데이트

### 2) 상태 표시

| 상태 | 기준 | 색상 |
| --- | --- | --- |
| Safe | 0–69% | 초록색 |
| Warning | 70–89% | 주황색 |
| Danger | 90% 이상 | 붉은색 |

### 3) Empty / Error 상태
- 데이터가 없는 경우: "No data available"
- 데이터 조회 실패 시: "Failed to load data"

### 4) Chart 선택 기준

| 데이터 특성 | 권장 차트 |
| --- | --- |
| 시간 변화 데이터 | Line Chart |
| 단일 리소스 사용률 | (Half) Doughnut Chart, Gauge Bar Chart |
| 데이터 구성 비율 | Pie Chart |

### 5) Tooltip 정책
- 모든 차트는 hover 시 tooltip을 제공한다.
- 구성 요소: 데이터 라벨, 값, 퍼센트(선택)

### 6) Data density 규칙

| 데이터 개수 | 권장 시각화 |
| --- | --- |
| 1 metric | (Half) Doughnut Chart |
| 2–10 metric | Gauge Bar Chart |
| 2–5 category | Pie Chart |
| 시간 기반 metric | Line Chart |

---

## Content Guidelines

### 1) 반올림 규칙
- 모든 반올림은 round half-up을 사용한다.

### 2) 숫자와 단위 표기
- 숫자와 단위 사이에는 공백 1칸을 둔다.
- 퍼센트(%)는 공백 없이 표기한다.

### 3) Trailing zero
- 의미를 추가하지 않는 소수점 .0은 제거한다. (2.0 GiB → 2 GiB)

### 4) 숫자 표시 규칙

| 값 범위 | 표시 정책 | 예시 |
| --- | --- | --- |
| < 10 | 소수 1자리까지 표시 | 9.7 |
| 10 ~ 100 | 소수 1자리까지 표시 | 12.3 |
| >= 100 | 정수 | 125 |

### 5) 천 단위 구분
- 로케일 기준 포맷. 없을 시 콤마 사용.

### 6) 자동 단위 변환

| 입력 단위 | 표시 단위 | 예시 |
| --- | --- | --- |
| B | KiB/MiB/GiB/TiB/PiB | 1,536 B → 1.5 KiB |
| B/s | KiB/s → MiB/s → GiB/s | 1,048,576 B/s → 1 MiB/s |
| ops/s | K/M/B 축약 가능 | 15,320 ops/s → 15.3K ops/s |
| p/s | p/s | - |
| ns | ns/μs/ms/s | 1,200 ns → 1.2 μs |
| ms | ms/s | 1,200 ms → 1.2 s |

### 7) Y-axis
- 하나의 차트(Y축)는 단일 단위만 사용한다.
- Y-axis tick 개수는 5로 고정한다.

### 8) X-axis
- Time-series Chart의 X축은 시간 단위를 사용한다.
- 같은 차트 내에서는 동일한 시간 단위를 유지한다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Line Chart | Component | 시계열 데이터 차트 |
| Usage Chart | Component | 사용률 차트 |
| Pie Chart | Component | 구성 비율 차트 |
| Tooltip | Component | 데이터 설명 |
| UX writing Guide | Guide | 차트 라벨 및 메시지 작성 |
`;

export function ChartOverviewPage() {
  return (
    <ComponentPageTemplate
      title="Chart overview"
      description="시스템 리소스 상태, 사용량, 구성 비율, 변화 추이를 직관적으로 시각화하여 빠르게 상태를 인지하고 데이터를 탐색할 수 있도록 하는 데이터 시각화 패턴. ECharts (echarts-for-react) 기반."
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
        <>
          <NotionRenderer markdown={CHART_OVERVIEW_GUIDELINES} />
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
        </>
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
      relatedLinks={[{ label: 'Tooltip', path: '/design/components/tooltip' }]}
    />
  );
}
