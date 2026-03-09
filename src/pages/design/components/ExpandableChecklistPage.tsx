import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const EXPANDABLE_CHECKLIST_GUIDELINES = `## Overview
여러 개의 항목을 그룹 단위로 접고 펼칠 수 있으며, 각 항목의 선택 상태와 상태 레이블을 함께 표시하는 컴포넌트

---

## Variants

| 타입 | 설명 | 사용 조건 |
| --- | --- | --- |
| Default | 모든 항목이 항상 펼쳐진 상태로 표시되는 기본형. 접기/펼치기 토글이 없다. | 항목 수가 적거나 모든 항목을 항상 노출해야 할 때 |
| Expandable | 항목을 그룹 단위로 접거나 펼칠 수 있는 형태. 토글 아이콘으로 하위 항목의 노출 여부를 제어한다. | 항목이 많거나 그룹 단위로 탐색·선택해야 할 때 |

---

## Composition

### 컨테이너 구성 (공통)

| # | 요소 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| 1 | 컨테이너 타이틀 | 필수 | 목록 전체의 목적을 나타내는 헤더 텍스트 |
| 2 | 컨테이너 서브타이틀 | 선택 | 최대 선택 개수 등 제약 조건 안내 (예: "Select up to 15 nodes") |

### 항목(Item) 구성 (공통)

| # | 요소 | 필수 여부 | 위치 | 설명 |
| --- | --- | --- | --- | --- |
| 3 | 체크박스 | 필수 | 항목 좌측 | 항목 선택을 위한 인터랙티브 요소 |
| 4 | Title | 필수 | 체크박스 우측 | 항목의 이름 |
| 5 | 뱃지 | 선택 | Title 오른쪽 | 항목의 현재 상태를 나타내는 레이블 |
| 6 | 설명 | 선택 | Title 아래 | 항목에 대한 부연 설명 텍스트 |

### Expandable 타입 전용

| # | 요소 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| 7 | 토글 아이콘 | 필수 | 그룹을 접거나 펼치는 트리거 (▶ / ▼) |
| 8 | 하위 항목 | 필수 | 그룹 항목 하위에 들여쓰기로 표시되는 자식 항목 |

---

## States

| 상태 | 설명 | 적용 대상 |
| --- | --- | --- |
| Default | 선택되지 않은 기본 상태 | 공통 |
| Checked | 항목이 선택된 상태 | 공통 |
| Disabled | 선택 불가 상태 (최대 선택 개수 초과 시) | 공통 |
| Expanded | 그룹이 펼쳐져 하위 항목이 노출된 상태 | Expandable |
| Collapsed | 그룹이 접혀 하위 항목이 숨겨진 상태 | Expandable |

---

## Behavior

### 선택 정책
- 최대 선택 개수를 지정할 수 있으며, 컨테이너 서브타이틀에 명시한다.
- 최대 개수 초과 시 미선택 항목 Disabled. 이미 선택된 항목은 해제 전까지 유지.
- 선택 해제 시 Disabled 항목 다시 활성화.

### 접기/펼치기 (Expandable 전용)
- 토글 아이콘 클릭 시 하위 항목 접힘/펼침.
- 접기/펼치기는 선택 상태에 영향을 주지 않음.
- 그룹과 하위 항목의 선택은 독립적으로 동작.

### 외부 연동
- 선택·해제는 연동된 차트·뷰에 실시간으로 반영된다.

---

## Content Guidelines
- 컨테이너 타이틀: 대상 리소스 유형을 명사형으로 작성한다.
- 항목 Title: 리소스의 고유 식별자 또는 이름을 그대로 사용한다.
- 항목 설명: Title만으로 충분하면 생략. 사용 시 한 줄 이내.
- 뱃지 레이블: 시스템 상태 값을 기본으로 반영한다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Checkbox | Component | 단일 또는 단순 다중 선택 |
| Badge | Component | 항목 상태 레이블 |
| Filter | Component | 필터 선택 UI |
`;

export function ExpandableChecklistPage() {
  return (
    <ComponentPageTemplate
      title="Expandable Checklist"
      description="여러 개의 항목을 그룹 단위로 접고 펼칠 수 있으며, 각 항목의 선택 상태와 상태 레이블을 함께 표시하는 컴포넌트."
      whenToUse={[
        '복수의 리소스를 선택하여 콘텐츠(예: 모니터링 차트)에 반영해야 할 때',
        '선택 가능한 항목이 그룹(계층) 구조를 가지며, 각 항목의 상태(예: Completed, Running 등)를 함께 노출해야 할 때',
      ]}
      whenNotToUse={['항목 수가 적고 계층 구조가 없는 경우 → Checkbox 사용']}
      guidelines={
        <>
          <NotionRenderer markdown={EXPANDABLE_CHECKLIST_GUIDELINES} />
          <DosDonts
            doItems={[
              '최대 선택 개수가 있는 경우 컨테이너 서브타이틀에 명시한다.',
              '뱃지는 시스템이 자동으로 결정하는 상태 값에 한해 사용한다.',
              '항목 수가 많아 스크롤이 필요한 경우 컨테이너 높이를 고정하여 스크롤 영역을 명확히 한다.',
              '그룹 구조가 있는 경우 Expandable 타입을 사용한다.',
            ]}
            dontItems={[
              '최대 선택 개수 초과 시 기존 선택된 항목을 자동으로 해제하지 않는다.',
              '뱃지 색상을 임의로 지정하지 않는다.',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Checkbox', path: '/design/components/checkbox' },
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Filter', path: '/design/components/filter-search-input' },
      ]}
    />
  );
}
