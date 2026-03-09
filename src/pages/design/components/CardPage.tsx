import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { VStack } from '@/design-system';

const CARD_GUIDELINES = `## Overview

Card는 단일 항목(리소스, 서비스, 앱 등)의 핵심 정보를 시각적으로 묶어 표현하는 컴포넌트다.
항목을 탐색하고 선택하는 진입점으로 사용된다.

---

## Composition

\`\`\`
+----------------------------------------------+
| [a] 아이콘  [b] 타이틀            [e] 수치   |
|         [c] 디스크립션           [f] 상태   |
| [d] 태그                                  |
| [g] 디테일 (key-value 격자)                |
| [h] 메타데이터              [i] 버튼       |
+----------------------------------------------+
\`\`\`

| 요소 | 설명 | 제공 조건 |
| --- | --- | --- |
| a. 아이콘 | 항목의 시각적 식별자 | 선택 |
| b. 타이틀 | 항목을 대표하는 이름. 상세 페이지로 이동하는 링크로 동작 가능 | 필수 |
| c. 디스크립션 | 항목의 목적·기능을 요약한 짧은 설명 | 선택 |
| d. 태그 | 항목에 연결된 키워드 태그 | 선택 |
| e. 수치 | 항목의 주요 수치 정보. 헤더 우측 상단 배치 | 선택 |
| f. 상태 | 항목의 현재 상태. 헤더 우측 하단 배치 | 선택 |
| g. 디테일 | key-value 쌍을 격자로 나열한 속성 정보 영역. 최대 4개 권장 | 선택 |
| h. 메타데이터 | 날짜, 작성자 등 보조 정보. 하단 좌측 배치 | 선택 |
| i. 버튼 | 항목에 대한 액션 버튼. 하단 우측 배치. CTA 버튼은 최우측에 정렬 | 선택 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Default | 기본 표시 상태 |
| Hover | 마우스 오버 시 카드 전체에 배경색 변화 또는 Elevation 상승으로 인터랙션 가능함을 표시 |
| Selected | 체크박스 또는 카드 전체 클릭으로 선택된 상태. 색상·외곽선으로 명확하게 구분 |
| Disabled | 비활성화 상태. 선택·클릭 불가. 낮은 명도의 텍스트와 배경색 적용 |
| Loading | 데이터 로딩 중 상태. 콘텐츠 영역을 Skeleton 컴포넌트로 대체 |
| Empty | 표시할 항목이 없는 상태 |

---

## Behavior

### 카드 클릭 동작
- 카드 내 인터랙티브 요소(링크, 버튼, 체크박스)가 없는 경우, 카드 전체 영역을 클릭 타깃으로 사용하여 접근성과 사용성을 높인다.
- 타이틀이 링크로 제공될 경우, 카드 전체 클릭과 타이틀 링크 클릭은 동일한 동작(상세 페이지 이동)을 수행한다.
- 카드 내 독립적인 액션(버튼, 링크)이 있는 경우, 해당 요소만 개별 클릭 타깃으로 동작한다.

---

## Usage Guidelines

---

## Content Guidelines

- **타이틀**: 항목을 고유하게 식별할 수 있는 이름을 사용한다. 대상이 특정 리소스인 경우 리소스 이름을 그대로 표시한다.
- **디스크립션**: 항목의 목적과 기능을 한두 문장으로 요약한다. 사용자가 "이 항목이 나에게 필요한가"를 판단할 수 있을 만큼의 정보를 제공한다.
- **디테일 레이블**: 필드명은 간결하게 작성하되, 약어는 피한다. 사용자가 레이블만으로 값의 의미를 파악할 수 있어야 한다.
- **일반 작성 원칙**: 문장 첫 글자만 대문자(Sentence case)를 사용하며, 고유명사는 예외로 한다. Please, 느낌표(!) 등 불필요한 표현을 피한다. 능동태를 기본으로 사용한다.

---

## Related

- Section Card
- Tag
- Grid (Layout)
`;

export function CardPage() {
  return (
    <ComponentPageTemplate
      title="Card"
      description="Card는 단일 항목(리소스, 서비스, 앱 등)의 핵심 정보를 시각적으로 묶어 표현하는 컴포넌트. 항목을 탐색하고 선택하는 진입점으로 사용된다."
      whenToUse={[
        '동일한 유형의 항목을 격자 형태로 나열하여 한눈에 비교·탐색해야 할 때',
        '항목의 핵심 속성과 상태를 빠르게 파악해야 할 때',
        '이미지·아이콘 등 시각 요소를 포함하여 항목의 성격을 직관적으로 전달해야 할 때',
        'MCP 서버, 플러그인, 앱 등 설치 항목을 탐색하는 마켓플레이스형 화면',
      ]}
      whenNotToUse={[
        '열(Column) 기반의 정렬·필터가 중요한 데이터 집합 → Table 사용',
        '항목 수가 매우 많고 밀도 높은 비교가 필요한 경우 → Table 사용',
        '단일 항목의 상세 정보를 페이지 최상단에 요약 표시할 때 → Detail Header 사용',
      ]}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={CARD_GUIDELINES} />
          <DosDonts
            doItems={[
              '카드 하나에는 하나의 항목만 표현한다.',
              '디테일 영역에는 항목을 식별하는 데 꼭 필요한 속성만 노출한다. 전체 정보는 상세 페이지에서 제공한다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>border-radius: 8px</code> · <code>padding: 16px</code> · <code>gap: 16px</code>
        </div>
      }
      relatedLinks={[
        { label: 'Section Card', path: '/design/components/section-card' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Chip', path: '/design/components/chip' },
      ]}
    />
  );
}
