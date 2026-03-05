import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

export function CardPage() {
  return (
    <ComponentPageTemplate
      title="Card"
      description="카드(Card)는 단일 항목(리소스, 콘텐츠, 서비스 등)에 대한 핵심 정보를 시각적으로 묶어 표현하는 컨테이너 컴포넌트다. 여러 카드를 격자(Grid) 형태로 나열하여 항목 간 비교·탐색을 돕는 컬렉션 뷰로 주로 사용된다."
      whenToUse={[
        '동일한 유형의 항목(리소스, 서비스, 멤버 등)을 격자 형태로 나열하여 한눈에 비교해야 할 때',
        '항목별로 반복 가능한(Repeatable) 핵심 속성 정보를 빠르게 훑어봐야 할 때',
        '이미지·아이콘 등 시각 요소를 포함하여 항목의 성격을 직관적으로 전달해야 할 때',
        '항목을 클릭하면 상세 페이지(Detail view)로 이동하는 진입점 역할이 필요할 때',
        'MCP 서버, 플러그인, 앱 등 설치 항목을 탐색하는 마켓플레이스형 화면',
      ]}
      whenNotToUse={[
        '열(Column) 기반의 정렬·필터·정렬이 중요한 데이터 집합 → Table 사용',
        '항목 수가 매우 많고 밀도 높은 비교가 필요한 경우 → Table 사용',
        '단일 항목의 상세 정보를 구조화하여 보여줄 때 → Detail Header 사용',
      ]}
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={6}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Default
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        텍스트·메타데이터 중심. 아이콘 또는 썸네일 선택 포함.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Media Card
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        상단 또는 좌측에 이미지/미리보기 영역 강조. 시각적 중요도가 높은 콘텐츠용.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                카드 그리드 레이아웃: 여러 카드를 격자 형태로 배치하여 컬렉션 뷰를 구성한다.
              </p>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                구조: [썸네일/아이콘] → [타이틀] → [카테고리 배지] → [설명 텍스트] → [태그 목록] →
                [태그 오버플로우 +N] → [메타 정보]
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        제공 조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        썸네일/아이콘
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        타이틀
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        필수 — 항목명, 상세 페이지 링크 역할 가능
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        카테고리 배지
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택 — 항목 분류 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        설명 텍스트
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택 — 2–3줄 이내, truncation 적용
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        태그 목록
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택 — 키워드 태그, 오버플로우 처리
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        태그 오버플로우 +N
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        조건부 — 숨겨진 태그 개수 표시
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        메타 정보
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택 — 날짜, 작성자, 상태 등
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-2">
                <strong>Design principle</strong>: 한 카드 = 한 항목. 동일 유형 항목에 반복 가능한
                속성만 노출하여 빠른 스캔을 지원한다.
              </p>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Default
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Hover
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        마우스 오버 시 시각적 피드백
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Selected
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택된 카드 강조</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Disabled
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성, 클릭 불가</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Loading
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">Skeleton 등 로딩 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Empty
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">빈 상태 메시지 + CTA</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Error
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        오류 메시지 + 복구 액션
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)]">
                카드 클릭 동작
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>카드 전체 또는 타이틀 클릭 시 상세 페이지로 이동</li>
                <li>클릭 영역은 명확하게, hover 시 커서 변경</li>
                <li>새 탭/현재 탭 열기 정책은 일관되게 유지</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                선택(Selection)
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>벌크 액션이 필요할 때만 선택 모드 제공</li>
                <li>체크박스 또는 카드 영역 클릭으로 선택</li>
                <li>선택 시 시각적 구분(테두리, 배경) 적용</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                태그 오버플로우
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>태그가 많을 경우 +N 인디케이터로 요약, Popover로 전체 표시</li>
                <li>BadgeList 컴포넌트 활용</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                반응형 대응
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>화면 크기에 따라 그리드 열 개수 조정 (예: 1–4열)</li>
                <li>작은 화면에서는 카드당 정보 밀도 조절</li>
                <li>스크롤·페이지네이션 정책 명확히</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                로딩 상태 전환
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>초기 로딩 시 Skeleton 표시</li>
                <li>로딩 완료 후 자연스러운 전환</li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)]">Do ✅</p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>한 카드 = 한 항목(리소스)</li>
                <li>동일 유형 항목에 반복 가능한 속성만 노출</li>
                <li>설명 텍스트 2–3줄 이내, truncation 적용</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Don&apos;t ❌
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>카드 플립 등 복잡한 인터랙션 금지</li>
                <li>카드 컬렉션을 페이지 레이아웃으로 사용하지 않음</li>
                <li>과도한 속성으로 카드 과부하 금지</li>
                <li>개별 카드 내부에 전역 액션 배치 금지</li>
                <li>카드는 빠른 참조용, 전체 콘텐츠 아님</li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Content Guidelines
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>타이틀</strong>: 고유 식별 가능한 이름 사용. 리소스명은 해당 리소스 이름
                  표시
                </li>
                <li>
                  <strong>설명 텍스트</strong>: 목적·기능을 1–2문장으로 요약, 마침표 사용
                </li>
                <li>
                  <strong>빈 상태 메시지</strong>: 명확한 제목(예: &quot;리소스를 찾을 수
                  없음&quot;)과 CTA 제공
                </li>
                <li>
                  <strong>오류 상태 메시지</strong>: 오류를 명확히 설명하고 복구 액션 제공
                </li>
                <li>
                  <strong>일반</strong>: Sentence case 사용. &quot;Please&quot;, &quot;Thank
                  you&quot;, &quot;!&quot; 지양
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>border-radius: 8px</code> · <code>padding: 16px</code> · <code>gap: 16px</code>
        </div>
      }
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Skeleton', path: '/design/components/loading' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
