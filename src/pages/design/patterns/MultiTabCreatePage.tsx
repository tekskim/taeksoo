import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

export function MultiTabCreatePage() {
  return (
    <ComponentPageTemplate
      title="Multi Tab Create"
      description="Tab-based resource creation pattern allowing free navigation across categorized setting groups"
      guidelines={
        <VStack gap={8}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">1. 개요</h4>
                <VStack gap={2}>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    하나의 리소스를 생성하기 위한 여러 설정 카드를 <strong>탭에 나누어 배치</strong>
                    함으로써, 사용자가 순서에 구애받지 않고 탭을 자유롭게 이동하며 정보를 입력할 수
                    있게 하는 UX 패턴입니다.
                  </p>
                </VStack>
                <VStack gap={2}>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">레이아웃</h4>
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    Multi-tab create 페이지는 <strong>Two columns layout</strong>으로 구성됩니다.
                    왼쪽에는 Page title, Tab, Card가 배치되고 오른쪽에는 Summary card(Floating
                    card)가 배치됩니다.
                  </p>
                </VStack>
                <VStack gap={2}>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    이 패턴은 사용자가 길고 복잡한 리소스 구성을 하는 경우(예: Kubernetes 배포)
                    생성에 사용을 권장합니다.
                  </p>
                  <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                    <li>
                      한 페이지에 <strong>필드 20개 또는 카드 10개 중 하나라도 초과</strong>하는
                      경우
                    </li>
                    <li>심층적인 상호 작용이 필요하여 별도의 페이지가 유용한 경우</li>
                  </ul>
                </VStack>
              </VStack>
            </VStack>
          </div>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">2. 구성 요소</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                      구성 요소
                    </th>
                    <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ① Page title
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      페이지 최상단에 페이지 목적을 명시합니다. (예: Create Deployment). h2
                      heading을 사용합니다.
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ② Tab
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      하나의 생성 프로세스 내에서 주요 설정 그룹을 구분합니다. 각 탭은 독립적인 구성
                      카드 집합을 가지며, 사용자는 자유롭게 이동 가능합니다.
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ③ Card
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      각 탭 내에서 관련 항목을 묶는 카드형 블록 단위입니다. 각 카드는 접힘/펼침이
                      가능합니다.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ④ Floating card
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      우측에 고정된 정보 카드로, 현재 탭과 입력 진행 상태를 요약합니다.
                      Configuration, Quota, 버튼 포함.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              3. General Guidelines
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                  <li>
                    탭 기반의 정보 구획 구조를 사용하며, 각 탭의 목적이 명확히 구분되도록
                    구성합니다.
                  </li>
                  <li>입력값은 탭 간 이동 시에도 항상 유지되어야 합니다.</li>
                  <li>
                    각 탭은 <strong>단계(step)가 아니라 주제(category) 단위</strong>로 그룹화합니다.
                  </li>
                  <li>탭 제목은 사용자가 직관적으로 이해할 수 있는 언어로 작성합니다.</li>
                  <li>Summary 패널은 모든 탭에서 동일한 상태를 유지합니다.</li>
                  <li>
                    모든 필수 입력값에는 <span className="text-[var(--color-state-danger)]">*</span>{' '}
                    표시를 적용합니다.
                  </li>
                  <li>탭 전환 시 Soft Validation을 수행하여 오류 있는 섹션을 미리 표시합니다.</li>
                  <li>하나의 섹션에는 최대 5~7개의 필드만 배치하여 인지 부하를 줄입니다.</li>
                  <li>
                    생성 버튼은 Summary 패널 하단에 고정 배치하며, 클릭 시 전체 탭에 대한 Global
                    Validation을 수행합니다.
                  </li>
                  <li>
                    탭 전환, 섹션 확장 등의 인터랙션에는 자연스러운 전환 애니메이션(200~300ms)을
                    적용합니다.
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                  Don&apos;t
                </h4>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                  <li>탭을 순차적인 단계(wizard step)처럼 표현하지 않습니다.</li>
                  <li>탭 이동 시 입력값이 초기화되거나 섹션이 자동으로 닫히지 않도록 합니다.</li>
                  <li>Summary 패널의 구성을 탭마다 다르게 변경하지 않습니다.</li>
                  <li>오류 메시지를 여러 개의 모달로 중첩 표시하지 않습니다.</li>
                  <li>
                    Add/Remove 액션 시 입력 필드의 위치나 순서를 갑작스럽게 변경하지 않습니다.
                  </li>
                  <li>
                    탭 전환 시 페이지 전체가 새로고침되거나 입력 상태가 손실되지 않도록 합니다.
                  </li>
                </ul>
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              4. Accessibility Guidelines
            </h4>
            <VStack gap={4}>
              <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">General</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    각 구성요소에 대해 대체 텍스트(alt text) 및 ARIA region 역할(role, landmark)을
                    적절히 정의합니다.
                  </li>
                  <li>애플리케이션의 언어 환경에 맞추어 ARIA label을 작성합니다.</li>
                  <li>불필요한 마크업이나 중복된 역할(role)을 추가하지 않습니다.</li>
                  <li>
                    모든 콘텐츠는 키보드로 접근할 수 있어야 하며, 탐색 순서는 논리적이고 예측
                    가능해야 합니다.
                  </li>
                  <li>시각적 순서와 포커스 이동 순서를 일치시킵니다.</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
                <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                  Component-specific
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    탭, 폼 입력 필드, 버튼 등 모든 상호작용 요소는 키보드로 접근 가능한 순서로
                    구성합니다.
                  </li>
                  <li>
                    Tab 키 및 방향키(Arrow 키)로 모든 입력 필드와 버튼을 탐색할 수 있어야 합니다.
                  </li>
                  <li>
                    각 탭 및 섹션 영역은 <code>ARIA role=&quot;region&quot;</code>을 활용해 스크린
                    리더에서 인식될 수 있도록 합니다.
                  </li>
                  <li>
                    폼 구성요소는 라벨(label)과 필드(input)가 programmatically 연결되어야 하며,{' '}
                    <code>aria-describedby</code> 속성을 사용해 오류 메시지나 도움말을 제공합니다.
                  </li>
                  <li>
                    버튼과 토글 요소는 활성화 상태를 명확히 알리기 위해 <code>aria-pressed</code>{' '}
                    또는 <code>aria-disabled</code> 속성을 사용합니다.
                  </li>
                  <li>
                    Summary 패널의 진행 상태나 검증 결과는 시각적 정보 외에도 스크린 리더를 통한
                    대체 정보로 전달합니다.
                  </li>
                  <li>
                    모든 툴팁과 헬퍼 텍스트는 Hover 또는 Focus 상태에서 스크린 리더가 읽을 수 있도록{' '}
                    <code>aria-label</code> 또는 <code>aria-describedby</code>를 설정합니다.
                  </li>
                </ul>
              </div>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Wizard',
          path: '/design/patterns/wizard',
          description: 'Sequential step-based creation',
        },
        { label: 'Tabs', path: '/design/components/tabs', description: 'Tab navigation component' },
        {
          label: 'Floating card',
          path: '/design/components/floating-card',
          description: 'Summary sidebar',
        },
        {
          label: 'Common patterns',
          path: '/design/patterns/common',
          description: 'Pattern selection guide',
        },
      ]}
    />
  );
}
