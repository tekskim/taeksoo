import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Disclosure } from '@/design-system';

const LIST_SELECTOR_GUIDELINES = `## Overview

사용자가 리소스 목록에서 하나 이상의 항목을 검색하고 선택하기 위한 UI 패턴이다. 주로 카드, 드로어 또는 설정 패널 내부에서 사용된다.

---

## Components

\`\`\`
+----------------------------------------------------------+
| [Tab 1] [Tab 2] ...              [Create] [Search input] |
|----------------------------------------------------------|
| Selection area: [Chip] [Chip] ...                         |
|----------------------------------------------------------|
| Table                                        Pagination   |
| (리소스 목록)                              Item count    |
+----------------------------------------------------------+
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Tab | 리소스를 유형별로 분류해서 조회 |
| Create button | 새로운 리소스 생성 |
| Search input | 리소스 검색 및 필터링 |
| Pagination | 리스트 페이지 이동 |
| Item count | 데이터 규모 표시 |
| Table | 리소스 목록 표시 |
| Selection area | 선택된 리소스 표시 |

---

## Variants

| Variant | 설명 |
| --- | --- |
| Single select | 하나의 항목만 선택 가능 |
| Multi select | 여러 항목 선택 가능 |
| Create enabled | 새 리소스 생성 버튼 포함 |

---

## Behavior

### 1) 선택
- 단일 또는 다중 선택이 가능하다. (단일: Radio, 다중: Checkbox)
- 선택된 항목은 Selection area에 Chip 형태로 표시된다.

### 2) 선택 해제

| 동작 | 결과 |
| --- | --- |
| Chip ✕ 클릭 | 선택 해제 |
| Row 선택 해제 | Chip 제거 |

### 3) 페이지 이동
- Pagination을 통해 페이지를 이동할 수 있다.
- 페이지 이동 시 선택 상태는 유지된다.

### 4) 생성 버튼
- 기본적으로 제외되는 기능이다.
- 선택 시 새 리소스 생성이 필요한 경우가 많을 때 추가.
- 클릭 시 새 탭에서 화면 이동, 기존 화면은 선택 사항 유지.

### 5) 행 개수
- 단독으로 존재하는 리스트: 10개 고정
- 한 카드/드로어에 List Selector가 2개 이상이거나 입력값이 많을 때: 5개 고정

---

## Usage Guidelines

### Do ✅
- 검색 기능을 제공한다.
- 선택된 항목을 명확하게 표시한다.
- Chip을 통해 선택 상태를 쉽게 제거할 수 있도록 한다.

### Don't ❌
- 선택 결과를 숨기지 않는다.
- 선택 상태를 Table과 분리하여 표시하지 않는다.
- Create 기능을 필수 요소로 만들지 않는다.

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Search Input | Component | 목록 검색 |
| Table | Component | 데이터 표시 |
| Pagination | Component | 페이지 탐색 |
| Chip | Component | 선택 항목 표시 |
| Drawer | Component | 패턴 사용 위치 |
`;

const LIST_SELECTOR_PREV_VERSION = `## 리스트 화면

1. Tab — 리소스 유형별 분류
2. Create button — 새 리소스 생성
3. Search input — 검색 및 필터링
4. Pagination — 페이지 이동
5. Item count — 데이터 규모 표시
6. Table — 리소스 목록
7. Selection area — 선택된 리소스 표시 (Chip)
8. 선택 영역 (Radio/Checkbox)
9. 행 액션 (Context Menu 등)

---

## 생성/편집 화면 리스트

1. Tab — 리소스 유형별 분류
2. Create button — 새 리소스 생성 (선택)
3. Search input — 검색 및 필터링
4. Pagination — 페이지 이동
5. Item count — 데이터 규모 표시
6. Table — 리소스 목록
7. Selection area — 선택된 리소스 Chip 표시
8. 확인/취소 버튼

---

## 인터랙션

### 선택
- 단일 선택: Radio, 다중 선택: Checkbox
- 선택된 항목은 Chip 형태로 Selection area에 표시

### 선택 해제
- Chip ✕ 클릭 또는 행 선택 해제 시 Chip 제거

### 페이지 이동
- Pagination 이동 시 선택 상태 유지

### 생성 버튼
- 새 탭에서 생성 화면 이동, 기존 선택 유지

### 행 개수
- 단독 리스트: 10개 고정
- 카드/드로어 내 2개 이상 또는 입력값 많을 때: 5개 고정
`;

export function ListSelectorPage() {
  return (
    <ComponentPageTemplate
      title="List Selector"
      description="사용자가 리소스 목록에서 하나 이상의 항목을 검색하고 선택하기 위한 UI 패턴. 주로 카드, 드로어 또는 설정 패널 내부에서 사용된다."
      whenToUse={[
        '다른 리소스를 참조하여 설정해야 하는 경우',
        '리소스를 선택하여 연결해야 하는 경우',
        '여러 리소스 중 일부를 선택해야 하는 경우',
      ]}
      whenNotToUse={[
        '리소스 관리 화면 (→ List page)',
        '속성 정보까지 확인 필요없이 단일 정보로 가능한 선택 (→ Select)',
        '간단한 옵션 선택 (→ Radio/Checkbox)',
      ]}
      guidelines={
        <>
          <NotionRenderer markdown={LIST_SELECTOR_GUIDELINES} />
          <Disclosure className="mt-6">
            <Disclosure.Trigger>이전 버전</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <NotionRenderer markdown={LIST_SELECTOR_PREV_VERSION} />
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </>
      }
      relatedLinks={[
        { label: 'Search Input', path: '/design/components/filter-search-input' },
        { label: 'Table', path: '/design/components/table' },
        { label: 'Pagination', path: '/design/components/pagination' },
        { label: 'Chip', path: '/design/components/chip' },
        { label: 'Drawer', path: '/design/components/drawer' },
      ]}
    />
  );
}
