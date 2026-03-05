import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';
import { DocSection } from '../_shared/DocSection';
import { WizardPatternSection } from '../../design-system-sections/WizardPatternSection';

export function WizardPage() {
  return (
    <ComponentPageTemplate
      title="Wizard (Create Flow)"
      description="사용자가 리소스를 생성하기 위해 단계별 입력을 수행하는 UX 패턴이다. 여러 개의 필수 입력이 존재하거나 입력 간 종속성이 있는 경우, 단일 폼 대신 단계형(step-based) 입력 구조를 사용하여 사용자의 인지 부담을 줄이고 입력 오류를 최소화한다. 페이지는 Two columns layout으로 구성되며, 왼쪽에는 Page title · Card가, 오른쪽에는 Floating card가 배치된다."
      whenToUse={[
        '필수 입력 필드가 많은 경우',
        '입력 간 종속성이 존재하는 경우',
        '리소스 생성 과정이 논리적인 단계로 나뉘는 경우',
        '사용자가 설정 내용을 단계적으로 검토해야 하는 경우',
      ]}
      whenNotToUse={[
        '입력 필드가 적고 단순한 리소스 생성에는 Single-page Create를 사용',
        'Kubernetes 배포처럼 길고 복잡한 리소스 구성이 요구되는 경우에는 Multi-tab Create를 사용',
      ]}
      examples={<WizardPatternSection />}
      guidelines={
        <VStack gap={6}>
          <DocSection title="Composition (구성 요소)">
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Element
                    </th>
                    <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-muted)]">
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4">① Page title</td>
                    <td className="py-2">
                      페이지 최상단에 페이지 목적을 명시 (예: Create Instance), h2 heading
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4">② Card</td>
                    <td className="py-2">
                      리소스 생성을 위한 단계별 입력 핵심 단위. 하나의 논리적 입력 그룹을 하나의
                      Step으로 정의하며, Step은 하나의 Card로 표현. 단계명(h3), 상태 표시, 버튼,
                      Form fields 포함
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">③ Floating card</td>
                    <td className="py-2">
                      생성 진행 상태를 요약하여 표시하는 영역. 정보 표시 역할만 수행 (네비게이션
                      기능 X). Summary, Quota, 버튼 포함
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection title="Card 상세 정책">
            <VStack gap={4}>
              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)]">구성 요소</h5>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>Header 영역</strong>: 단계명, 상태 표시, Edit 버튼
                  </li>
                  <li>
                    <strong>Body 영역</strong>: 입력 필드 그룹, 필수 표기, validation
                  </li>
                  <li>
                    <strong>Footer 영역</strong>: Next/Skip 버튼 or Cancel/Done 버튼
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)]">동작 정책</h5>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>순차적 진행</li>
                  <li>상태 시각화</li>
                  <li>입력값 보존</li>
                  <li>명확한 액션</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                  유형 정책 (6가지 카드 상태)
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          상태
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          시각
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          설명
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">1. 미작성 카드</td>
                        <td className="py-2 pr-4">접힌 상태</td>
                        <td className="py-2">아직 진입하지 않은 상태</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">2. 입력 중 카드</td>
                        <td className="py-2 pr-4">접힌 상태</td>
                        <td className="py-2">
                          일부 입력 후 다른 단계로 이동한 상태, &quot;작성 중(Writing)&quot; 표시
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">3. 시작 카드</td>
                        <td className="py-2 pr-4">열림 상태</td>
                        <td className="py-2">해당 단계에서 값을 입력하는 상태, Next/Skip 버튼</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">4. 수정 카드</td>
                        <td className="py-2 pr-4">열림 상태</td>
                        <td className="py-2">완료된 단계를 다시 수정, Cancel/Done 버튼</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">5. 완료 카드</td>
                        <td className="py-2 pr-4">접힌 상태</td>
                        <td className="py-2">
                          필수 입력 모두 충족, Summary 표시, Edit 버튼. 예외: Skip→Not configured,
                          Template 선택→이름만 표시
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">6. 자동 입력 카드</td>
                        <td className="py-2 pr-4">접힌 상태</td>
                        <td className="py-2">Auto-filled 표시, Summary 노출, Edit 버튼</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </DocSection>

          <DocSection title="Floating Card 상세 정책">
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Summary</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>전체 단계 리스트, 각 단계별 상태 아이콘</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">쿼터 정보(선택)</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>잔여 수량 표시, 게이지 바 표기 규칙</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">액션 영역</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>Cancel 버튼</strong>: 확인 모달
                </li>
                <li>
                  <strong>Create 버튼</strong>: 모든 카드 완료+쿼터 미초과 시 활성화
                </li>
              </ul>
            </VStack>
          </DocSection>

          <DocSection title="Behavior &amp; Flow">
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">기본 정책</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>순차적 진행</li>
                <li>입력값 보존</li>
                <li>200~300ms 전환 애니메이션</li>
                <li>Floating card sticky</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                Next/Skip 버튼 동작 규칙
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>Next</strong>: validation→성공 시 완료→다음 열림 / 실패 시 오류 표시
                </li>
                <li>
                  <strong>Skip</strong>: 입력값 초기화→Not configured
                </li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                이전 단계 수정(Edit) 시 이동 규칙
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>D단계 진행 중 A단계 Edit→D 닫힘→A 수정→A 완료→D 복귀</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">
                종속성 변경으로 인한 단계 리셋
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  A 수정으로 B,C 영향→영향 받은 가장 앞 단계만 자동 열림, 이후 단계 닫힌 상태 유지
                </li>
              </ul>
            </VStack>
          </DocSection>

          <DocSection title="Usage Guidelines">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Do ✅</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>단계 수 최소 유지</li>
                <li>논리적 그룹 기준</li>
                <li>필수 입력 많을 때 단계형</li>
                <li>종속성 있는 설정 동일/인접 단계 배치</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Don&apos;t ❌</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>과도한 필드 배치 금지</li>
                <li>순서 임의 건너뛰기 금지</li>
                <li>Floating card 네비게이션 사용 금지</li>
              </ul>
            </VStack>
          </DocSection>
        </VStack>
      }
      relatedLinks={[
        { label: 'Multi-tab Create', path: '/design/patterns/multi-tab-create' },
        { label: 'Card', path: '/design/components/card' },
        { label: 'Floating Card', path: '/design/components/floating-card' },
      ]}
    />
  );
}
