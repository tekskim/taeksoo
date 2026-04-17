import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';

const CONTEXT_SELECTOR_GUIDELINES = `## Overview

Context Selector는 **TopBar 또는 Sidebar에서 현재 활성 컨텍스트(도메인, 프로젝트 등)를 표시하고 사용자가 전환할 수 있도록 하는 컴팩트 드롭다운 컴포넌트**이다. 일반 Form Select와 달리 네비게이션 및 Desktop 상단 영역에서 사용되며, 사용 위치에 따라 Domain Selector와 Project Selector 두 가지 variant를 제공한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① Label | 현재 선택된 컨텍스트 값을 표시하는 텍스트 |
| ② Chevron Icon | 드롭다운 열림/닫힘 상태를 나타내는 아이콘 |
| ③ Dropdown Panel | 선택 가능한 옵션 목록 |
| ④ Search Input (조건부) | 옵션 수가 많을 때 Dropdown Panel 상단에 표시되는 검색 필드. 입력값으로 목록을 즉시 필터링한다. 검색 결과가 없으면 Empty State를 표시한다. |

---

## Variants

| Variant | 기능 | 적용 위치 | 사용 예 |
| --- | --- | --- | --- |
| Domain Selector | 현재 활성 도메인을 표시하고 전환한다. | TopBar | 조직/도메인 전환 |
| Project Selector | 현재 활성 프로젝트를 표시하고 전환한다. | Sidebar | 도메인 내 프로젝트 전환 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Default | 현재 컨텍스트를 표시하는 기본 상태 |
| Hover | 마우스를 올렸을 때 배경색이 강조된다. |
| Open | Dropdown Panel이 열린 상태. |
| Loading | 컨텍스트 변경 진행 중. Label 영역에 Spinner를 표시한다. |
| Disabled | 컨텍스트 전환이 비활성화된 상태. |

---

## Behavior

### 1) 드롭다운 열기/닫기
- 컴포넌트 클릭 시 Dropdown Panel이 열린다.
- Dropdown Panel 외부 클릭 또는 Escape 키로 닫힌다.
- 항목 선택 시 현재 컨텍스트가 즉시 변경되고 Dropdown이 닫힌다.

### 2) 컨텍스트 변경 처리
- 선택된 값이 변경되면 해당 컨텍스트의 데이터를 리로드한다.
- 변경 중 로딩 상태가 있다면 Label 영역에 Spinner를 표시한다.

### 3) 접근성
- 키보드(Arrow, Enter, Escape)로 드롭다운을 조작할 수 있어야 한다.

### 4) Label 텍스트가 길어지는 경우
- Label 영역은 최대 너비가 고정되어 있으므로, 컨텍스트 이름이 길어지는 경우 말줄임표(…)로 잘라 표시한다.
- 트리거 버튼을 가리키면 Tooltip으로 전체 이름을 표시한다.

### 5) 검색 및 결과 없음 처리
- 옵션 수가 많아 스크롤이 필요한 경우 Dropdown Panel 상단에 Search Input을 표시한다.
- 입력값에 따라 목록을 즉시 필터링한다.
- 검색 결과가 없으면 목록 영역에 "No results found" Empty State를 표시한다.

---

## Related

| 이름 | 유형 | 비고 |
| --- | --- | --- |
| TopBar | Component | Domain Selector variant 사용 위치 |
| Side Navigation Bar (Menu) | Component | Project Selector variant 사용 위치 |
`;

export function ContextSelectorPage() {
  return (
    <ComponentPageTemplate
      title="Context Selector"
      description="TopBar 또는 Sidebar에서 현재 활성 컨텍스트(도메인, 프로젝트 등)를 표시하고 사용자가 전환할 수 있도록 하는 컴팩트 드롭다운 컴포넌트. 일반 Form Select와 달리 네비게이션 및 Desktop 상단 영역에서 사용된다."
      whenToUse={[
        'TopBar에서 활성 도메인을 표시하고 전환할 때 (Domain Selector)',
        'Sidebar에서 활성 프로젝트를 표시하고 전환할 때 (Project Selector)',
        'Desktop 상단 영역에서 글로벌 컨텍스트를 제어해야 할 때',
      ]}
      whenNotToUse={[
        '폼 내 데이터 입력용 선택 → Form Select 컴포넌트 사용',
        '3개 이하의 선택지를 전환 → Tabs 컴포넌트 사용',
        '단순 On/Off 전환 → Toggle 컴포넌트 사용',
      ]}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={CONTEXT_SELECTOR_GUIDELINES} />
          <DosDonts
            doItems={[
              'Shell 영역(TopBar, Sidebar)에서만 사용한다.',
              '현재 활성 컨텍스트를 Label에 항상 표시한다.',
              'Domain Selector는 TopBar에, Project Selector는 Sidebar에서만 사용한다.',
            ]}
            dontItems={[
              'Form 내 선택 필드에 Context Selector를 사용하지 않는다.',
              '드롭다운 옵션이 1개 이하인 경우 사용하지 않는다.',
              'Domain Selector와 Project Selector를 지정된 위치 외에서 혼용하지 않는다.',
            ]}
          />
        </VStack>
      }
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar' },
        { label: 'Side Navigation Bar (Menu)', path: '/design/components/menu' },
        { label: 'Project Selector', path: '/design/components/project-selector' },
      ]}
    />
  );
}
