import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { VStack, Button } from '@/design-system';
import { Table, StatusIndicator } from '@/design-system';
import { TableDemo } from '../../design-system-sections/TableDemo';
import { Link } from 'react-router-dom';
import { IconExternalLink } from '@tabler/icons-react';

const TABLE_GUIDELINES = `## Overview

Table은 여러 개의 데이터 항목을 **행(Row)과 열(Column) 구조로 정렬하여 표시하는 데이터 표시 컴포넌트**이다.
클라우드 콘솔에서 Table은 주로 **리소스 목록, 로그 데이터, 정책 목록 등 대량 데이터를 탐색하고 관리하는 UI**로 사용된다.

Table은 데이터 조회뿐 아니라 다음과 같은 사용자 작업을 지원한다.
- 리소스 검색
- 필터링
- 정렬
- 선택
- 보조 액션 실행

Table은 일반적으로 다음 패턴과 함께 사용된다.
- Search Input (Search & Filter)
- Pagination
- Context Menu
- Buttons

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Table header | 컬럼 이름 표시. 스크롤 시 화면 상단에 고정(sticky) |
| Table body | 데이터 행 |
| Row | 데이터 단위 |
| Column | 데이터 속성 |
| Selection checkbox | 행 선택 |
| Row actions | 행 단위 보조 액션 |

---

## States

| State | 설명 |
| --- | --- |
| Default | 기본 상태 |
| Hover | 행 hover |
| Selected | 선택됨 |
| Loading | 데이터 로딩 |
| Empty | 데이터 없음 |

---

## Behavior

### 1) Columns
- 데이터 속성을 나타냄
- 컬럼명은 명확해야 한다
- 컬럼을 기준으로 정렬이 가능할 수 있다.
  - 정렬 불가: Boolean 컬럼, 아이콘 컬럼, IP 또는 MAC 주소 컬럼처럼 정렬 기준이 모호한 컬럼들 → 정렬 기준값을 가질 수 없는 컬럼
    - 아이콘 → 이미지, 그림으로 표시되기 때문에 정렬 기준을 잡을 수 없음
    - IP, MAC주소 → 192.168.0.1, 8.8.8.8 이렇게 배열이 다를 때 기준을 잡을 수 없음
    - 디스크립션 → 문자열이므로 가나다/ABC 순으로 정렬 가능.
  - 정렬 가능: 정렬 불가한 컬럼을 제외한 나머지

### 2) Sticky Header
- 데이터가 스크롤 가능한 경우 Header는 sticky를 기본으로 한다.
- Table header는 Table 영역 내부에 고정된다.
- Search / Toolbar 영역과는 별도 레이어로 유지한다.

### 3) Column Types

| 유형 | 설명 |
| --- | --- |
| Text | 문자열 |
| Status | 상태 표시, 아이콘 또는 뱃지 |
| Date | 날짜 |
| Number | 숫자 또는 숫자+단위 |
| Action | 행 액션 버튼 |

- 컬럼 순서는 보통 Checkbox → Status → Name → [기타 속성] → Date → Action 으로 구성된다

### 4) Row
- 하나의 데이터 항목
- 로우는 클릭 가능할 수 있다
- 로우는 확장이 가능할 수 있다.
  - 확장 가능한 Row에는 Expand toggle 버튼이 Name 컬럼에 포함되어 이름 앞에 표시된다.

| 요소 | 설명 |
| --- | --- |
| Expand icon | Row 확장 |
| Collapse icon | Row 축소 |

  - Expanded 영역은 해당 Row 바로 아래에 표시된다.
- 로우는 하나 또는 여러개를 선택 가능할 수 있다
  - 선택 시 Action 버튼 활성화
  - 전체 선택/선택 해제 가능

### 5) Sorting
- 컬럼의 정렬 아이콘 클릭 시 오름차순 → 내림차순 → 정렬 해제 순서로 스위칭된다.
- 정렬 상태에 따라 헤더에 정렬 아이콘이 변경된다.

### 6) Empty State
- 데이터가 없는 경우 Empty state를 표기한다.
- 생성된 아이템이 없을 때:
  - \`KO\` {리소스} 목록 없음
  - \`EN\` No {resource} found
- 검색 조건에 맞는 아이템이 없을 때:
  - \`KO\` (타이틀)검색결과 없음 / (서브타이틀)검색 조건에 맞는 데이터를 찾을 수 없습니다.
  - \`EN\` (title) No Result / (subtitle) No {resources} match your current filters.

### 7) Text Truncation
- 테이블 셀 텍스트는 기본적으로 single line truncate를 사용한다.
- 테이블 셀의 텍스트가 컬럼 너비를 초과하는 경우 말줄임(truncate) 처리한다.
- 말줄임 처리된 텍스트는 hover 시 전체 값을 Tooltip으로 표시한다.

---

## Usage Guidelines

- 데이터가 5행 이상인 리스트에서 Table을 사용한다. 5행 미만이면 SectionCard DataRow를 고려한다.
- 정렬 가능한 컬럼은 \`sortable\`을 활성화하고, 기본 정렬 기준(예: 생성일 내림차순)을 설정한다.
- 다중 선택이 필요한 경우 \`selectable\`을 사용하고, ListToolbar의 Bulk Actions와 연동한다.
- 컬럼 정렬: 텍스트/이름은 왼쪽, 숫자/날짜는 오른쪽, 상태/액션은 중앙 정렬한다.
- 배열 데이터(Labels, Tags 등)를 뱃지로 표시할 때는 반드시 \`BadgeList\` 컴포넌트를 사용한다.
- 빈 상태는 \`emptyMessage\` 또는 \`EmptyState\` 컴포넌트로 안내한다.

---

## Content Guidelines

### 1) Column - 숫자, 단위

**공통 규칙**

| 항목 | 규칙 |
| --- | --- |
| 반올림 | 모든 반올림은 round half-up을 사용한다. |
| 숫자-단위 공백 | 숫자와 단위 사이에는 공백 1칸을 둔다. 예: 123.4 ms, 1.2 GiB/s. 예외: 퍼센트(%)는 공백 없이 표기. 예: 12.3% |
| trailing zero | 의미를 추가하지 않는 소수점 .0은 제거한다. (2.0 GiB → 2 GiB) |

**숫자 표기**

| 값 범위 | 표시 정책 | 예시 |
| --- | --- | --- |
| < 10 | 소수 1자리까지 표시, trailing zero 제거 가능 | 9.7 또는 9 |
| 10 ~ 100 | 소수 1자리까지 표시, trailing zero 제거 가능 | 12.3 또는 12 |
| >= 100 | 정수 | 125 |
| 천 단위 구분 | 로케일 기준 포맷. 없을 시 콤마 적용 | 12,345 |

**단위 자동 변환 표기**

| 입력 단위 | 표시 단위 | 표시 정책 | 예시 |
| --- | --- | --- | --- |
| B | KiB/MiB/GiB/TiB/PiB | 값 크기에 따라 자동 변환, 소수 1자리 | 1,536 B → 1.5 KiB |
| B/s | KiB/s → MiB/s → GiB/s | 값 크기에 따라 자동 변환, 소수 1자리 | 1,048,576 B/s → 1 MiB/s |
| ops/s | ops/s (축약 가능) | 큰 수는 K/M/B 축약 적용, 소수 1자리 | 15,320 ops/s → 15.3K ops/s |
| p/s | p/s (축약 가능) | K/M/B 축약 적용, 소수 1자리 | 15,320 p/s → 15.3K p/s |
| ns | ns/μs/ms/s | 값 크기에 따라 자동 변환, 소수 1자리 | 1,200 ns → 1.2 μs |
| ms | ms/s | <1000 ms는 ms, ≥1000 ms는 s, 소수 1자리 | 1,200 ms → 1.2 s |

### 2) 날짜 표기
- 기본 시간은 사용자의 로컬 시간을 기준으로 표시한다.
- 오전/오후 구분 없이 24시간 표기법을 적용한다.
- 10 미만의 숫자 앞에는 "0"을 붙인다. (9시(❌) → 09시 (⭕️))

| | 한국어 표기 | 영어 표기 |
| --- | --- | --- |
| 일자(축약형) | 테이블, 리소스 요약 정보 등 UTC표기나 시 단위가 의사결정에 큰 영향을 주지 않는 화면에서 사용됩니다. YYYY-MM-DD | 테이블, 리소스 요약 정보 등 UTC표기나 시 단위가 의사결정에 큰 영향을 주지 않는 화면에서 사용됩니다. Mth DD, YYYY |

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Search Input | Pattern | 데이터 검색 |
| Pagination | Component | 페이지 이동 |
| Context Menu | Component | 행 액션 |
| Status | Component | 상태 표시 |
`;

const sampleData = [
  { id: '1', name: 'worker-node-01', status: 'Running' },
  { id: '2', name: 'web-server-01', status: 'Running' },
  { id: '3', name: 'db-master', status: 'Stopped' },
];

const previewColumns = [
  {
    key: 'status',
    label: 'Status',
    width: '60px',
    align: 'center' as const,
    render: (v: string) => (
      <StatusIndicator status={v === 'Running' ? 'active' : 'error'} layout="icon-only" size="sm" />
    ),
  },
  { key: 'name', label: 'Name', flex: 1 },
  { key: 'id', label: 'ID', flex: 1 },
];

export function TablePage() {
  return (
    <ComponentPageTemplate
      title="Table"
      description="여러 개의 데이터 항목을 행(Row)과 열(Column) 구조로 정렬하여 표시하는 데이터 표시 컴포넌트. 리소스 목록, 로그 데이터, 정책 목록 등 대량 데이터를 탐색하고 관리하는 UI로 사용된다. 정렬, 선택, 컬럼 리사이즈, 고정 헤더, 텍스트 말줄임, 수평 스크롤을 지원한다."
      headerActions={
        <Link to="/table-style-guide">
          <Button variant="outline" size="sm" rightIcon={<IconExternalLink size={12} />}>
            Table Style Guide
          </Button>
        </Link>
      }
      whenToUse={['리소스 목록 표시', '설정 목록 표시', '로그 또는 이벤트 조회', '데이터 관리 UI']}
      whenNotToUse={['데이터 구조가 단순할 경우 (→ List)']}
      preview={
        <ComponentPreview
          code={`<Table
  columns={[
    { key: 'status', label: 'Status', width: '60px', align: 'center', render: (v) => <StatusIndicator status={v === 'Running' ? 'active' : 'error'} layout="icon-only" size="sm" /> },
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'id', label: 'ID', flex: 1 },
  ]}
  data={sampleData}
  rowKey="id"
/>`}
        >
          <Table columns={previewColumns} data={sampleData} rowKey="id" />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <TableDemo />
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={TABLE_GUIDELINES} />
          <DosDonts
            doItems={[
              '중요한 정보를 왼쪽 컬럼에 배치한다',
              '정렬 가능한 컬럼 제공',
              'Batch action 제공',
            ]}
            dontItems={['너무 많은 컬럼 사용', '의미 없는 컬럼 표시', '텍스트 과다 표시']}
          />
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Filter search Input',
          path: '/design/components/filter-search-input',
          description: '데이터 검색',
        },
        {
          label: 'Pagination',
          path: '/design/components/pagination',
          description: '페이지 이동',
        },
        {
          label: 'Context menu',
          path: '/design/components/context-menu',
          description: '행 액션',
        },
        {
          label: 'Status indicator',
          path: '/design/components/status-indicator',
          description: '상태 표시',
        },
      ]}
    />
  );
}
