import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';

const ERROR_BOUNDARY_GUIDELINES = `## Overview

Error Boundary는 앱의 **어느 영역이든 감쌀 수 있으며, 예상치 못한 오류를 격리**하는 컴포넌트이다. 오류 발생 시 사전 정의된 Fallback UI를 렌더링하여 나머지 애플리케이션이 정상적으로 동작하도록 유지한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① 감시 영역 (Boundary Wrapper) | 오류 발생 여부를 감시하는 보호 범위. 화면에 표시되지 않으며 Page / Section / Widget 단위로 지정한다. 오류 발생 시 해당 영역을 격리하고 나머지 앱이 정상 동작하도록 유지한다. |
| ② Fallback UI | 오류 감지 시 렌더링하는 대체 UI. Page Level에서는 범용 오류 화면을, Section/Widget Level에서는 ErrorState 컴포넌트를 사용한다. |

---

## Variants

| Variant | 적용 대상 | Fallback UI |
| --- | --- | --- |
| Page Level | 페이지 전체 | Error Boundary 범용 오류 화면 |
| Section Level | SectionCard, 특정 콘텐츠 영역 | ErrorState 컴포넌트 + Retry 버튼 |
| Widget Level | 차트, 테이블 등 독립 위젯 | 컴팩트 에러 메시지 + Retry 버튼 |

- Page Level Error Boundary는 System Error의 Unexpected Error variant에 해당한다.

---

## States

| 상태 | 설명 |
| --- | --- |
| Error | 오류 감지. Fallback UI 표시. 해당 영역 격리 |

---

## Behavior

### 1) 오류 감지
- 감싼 영역에서 예상치 못한 오류가 발생하면 즉시 감지한다.
- 감지된 오류는 오류 추적 시스템으로 자동 전달되어 확인·추적할 수 있도록 한다.

### 2) Fallback UI 표시
- Page Level: Error Boundary가 정의하는 범용 오류 화면을 표시한다.
- Section/Widget Level: ErrorState 컴포넌트 또는 인라인 에러 메시지를 표시한다.

### 3) 재시도(Retry)
- Section Level 이하 Fallback UI에 Retry 버튼을 제공하여 해당 영역만 다시 표시할 수 있도록 한다.
- Retry 클릭 시 오류가 발생한 영역을 초기 상태로 되돌리고 다시 표시한다.

### 4) 오류 전파 방지
- 동일 영역에 여러 Error Boundary가 적용된 경우, 오류가 발생한 지점에서 가장 가까운 레이어가 먼저 처리한다.

---

## Related

| 이름 | 유형 | 비고 |
| --- | --- | --- |
| System Error | Pattern | Fallback UI가 아닌 명시적 에러, HTTP 에러 |
| Error & Alert | Foundation | Fallback UI가 아닌 명시적 에러 |
`;

export function ErrorBoundaryPage() {
  return (
    <ComponentPageTemplate
      title="Error Boundary"
      description="앱의 어느 영역이든 감쌀 수 있으며, 예상치 못한 오류를 격리하는 컴포넌트. 오류 발생 시 사전 정의된 Fallback UI를 렌더링하여 나머지 애플리케이션이 정상적으로 동작하도록 유지한다."
      whenToUse={[
        '개별 페이지 영역, 위젯, 외부 라이브러리 컴포넌트를 감쌀 때',
        '특정 영역의 렌더링 실패가 전체 앱에 영향을 미쳐서는 안 될 때',
        '서드파티 컴포넌트처럼 오류 가능성이 높은 영역을 격리할 때',
      ]}
      whenNotToUse={[
        '버튼 클릭, 폼 제출 등 사용자 액션의 직접적 결과로 발생한 오류 → Toast 또는 Inline Error 메시지 사용',
        '특정 영역의 데이터가 없을 경우 → Empty State 사용',
        '서버·API 오류 응답(401, 403, 404 등)으로 인한 전체 페이지 표시 불가 → System Error 패턴 사용',
      ]}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={ERROR_BOUNDARY_GUIDELINES} />
          <DosDonts
            doItems={[
              '페이지 최상위에 Page Level Error Boundary를 항상 적용한다.',
              '독립적으로 동작하는 위젯, 차트, 외부 컴포넌트에 별도 Error Boundary를 추가한다.',
              'Retry 기능을 제공하여 사용자가 직접 복구할 수 있도록 한다.',
            ]}
            dontItems={[
              'Fallback UI에 오류 원인을 기술적으로 노출하지 않는다.',
              '개별 버튼, 아이콘, 텍스트 등 단순 UI 요소에는 적용하지 않는다.',
              '사용자 액션의 직접적 결과로 발생한 오류에는 사용하지 않는다. → Toast 또는 Inline Error 사용',
            ]}
          />
        </VStack>
      }
      relatedLinks={[
        { label: 'System Error', path: '/design/policies/system-error' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
      ]}
    />
  );
}
