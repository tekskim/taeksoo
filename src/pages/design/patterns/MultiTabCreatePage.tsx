import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

export function MultiTabCreatePage() {
  return (
    <ComponentPageTemplate
      title="Multi Tab Create"
      description="여러 설정 카드를 탭에 나누어 배치함으로써, 사용자가 순서에 구애받지 않고 탭을 자유롭게 이동하며 하나의 리소스를 생성할 수 있게 하는 UX 패턴이다. 페이지는 Two columns layout으로 구성되며, 왼쪽에는 Page title · Tab · Card가, 오른쪽에는 Summary card가 배치된다."
      whenToUse={[
        '한 페이지에 20개 이상의 필드 또는 10개 이상의 카드가 필요한 경우',
        'Kubernetes 배포처럼 길고 복잡한 리소스 구성이 요구되는 경우',
        '심층적인 상호작용이 필요하여 별도 페이지가 유용한 경우',
      ]}
      whenNotToUse={[
        '입력 필드가 적고 단순한 리소스 생성에는 Single-page Create를 사용한다',
        '단계가 순서대로 진행되어야 하는 경우에는 Wizard(Step-by-step) 패턴을 사용한다',
      ]}
      guidelines={
        <VStack gap={6}>
          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              1. Composition (구성 요소)
            </h4>
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
                      페이지 최상단에 페이지 목적을 명시 (예: Create Deployment), h2 heading
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ② Tab
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      하나의 생성 프로세스 내에서 주요 설정 그룹을 구분 (예: Deployment / Pod /
                      Container). 각 탭은 독립적인 구성 카드 집합, 탭 간 이동 시 입력값 유지
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ③ Card
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      각 탭 내에서 관련 항목을 묶는 카드형 블록 단위. 접힘/펼침 가능, 상단 제목(h3).
                      Form fields, 선택형 UI, 버튼 포함
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      ④ Floating card
                    </td>
                    <td className="py-2.5 text-[var(--color-text-muted)]">
                      우측 고정 Summary 카드, Configuration(탭 구성 상태)과 Quota(자원 사용량) 표시.
                      생성/취소 버튼 하단 고정, 생성 시 Global Validation + 오류 섹션 자동 스크롤
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              2. Behavior &amp; Flow
            </h4>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
              <VStack gap={4}>
                <VStack gap={2}>
                  <h5 className="text-heading-h7 text-[var(--color-text-muted)]">사용자 흐름</h5>
                  <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>탭 선택 → 원하는 설정 그룹으로 이동</li>
                    <li>
                      카드 입력 → 각 탭 내 카드를 펼쳐 폼 필드 입력 (탭 간 이동 시 입력값 유지)
                    </li>
                    <li>Summary 확인 → 우측 Floating card에서 구성 상태 및 Quota 사용량 확인</li>
                    <li>
                      생성 버튼 → Global Validation 수행, 오류 시 첫 번째 오류 섹션으로 자동 스크롤
                    </li>
                  </ol>
                </VStack>
                <VStack gap={2}>
                  <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                    Validation 정책
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                            유형
                          </th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                            트리거
                          </th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                            동작
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[var(--color-text-muted)]">
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4">Soft Validation</td>
                          <td className="py-2 pr-4">탭 전환 시</td>
                          <td className="py-2">시각적 인디케이터 표시</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">Global Validation</td>
                          <td className="py-2 pr-4">생성 버튼 클릭 시</td>
                          <td className="py-2">전체 검증 + 자동 스크롤</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>
                <VStack gap={2}>
                  <h5 className="text-heading-h7 text-[var(--color-text-muted)]">엣지 케이스</h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>탭 전환 시 미입력 필수값 → 오류 배지 표시</li>
                    <li>Quota 초과 → 경고 메시지 + 버튼 비활성</li>
                    <li>Add/Remove 중 탭 이동 → 변경사항 유지</li>
                    <li>생성 실패 → 입력값 유지 + 오류 메시지만 표시</li>
                  </ul>
                </VStack>
                <VStack gap={2}>
                  <h5 className="text-heading-h7 text-[var(--color-text-muted)]">인터랙션</h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>200~300ms 전환 애니메이션</li>
                    <li>Floating card sticky</li>
                  </ul>
                </VStack>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              3. Usage Guidelines
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                  <li>탭은 주제 단위로 그룹화합니다.</li>
                  <li>직관적인 탭 제목을 사용합니다.</li>
                  <li>탭 간 입력값을 유지합니다.</li>
                  <li>Summary 패널은 동일한 상태를 유지합니다.</li>
                  <li>필수 필드에 * 표시와 오류 메시지를 적용합니다.</li>
                  <li>카드당 5~7개 필드 최대로 배치합니다.</li>
                  <li>생성 버튼은 Summary 하단에 고정합니다.</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                  Don&apos;t
                </h4>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                  <li>탭을 wizard step처럼 표현하지 않습니다.</li>
                  <li>탭 이동 시 입력값 초기화 또는 섹션 자동 닫힘을 허용하지 않습니다.</li>
                  <li>Summary 패널 구성을 탭마다 변경하지 않습니다.</li>
                  <li>오류 메시지를 모달로 중첩 표시하지 않습니다.</li>
                  <li>Add/Remove 시 위치/순서를 갑작스럽게 변경하지 않습니다.</li>
                  <li>탭 전환 시 전체 새로고침 또는 상태 손실을 허용하지 않습니다.</li>
                </ul>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Wizard Create', path: '/design/patterns/wizard' },
        { label: 'Tab', path: '/design/components/tabs' },
        { label: 'Card', path: '/design/components/card' },
        { label: 'Floating Card', path: '/design/components/floating-card' },
      ]}
    />
  );
}
