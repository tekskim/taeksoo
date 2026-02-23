import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function GlobalNotificationPanelPage() {
  return (
    <ComponentPageTemplate
      title="Global notification panel"
      description="Desktop-level panel that aggregates unread notifications from all apps"
      relatedLinks={[
        {
          label: 'Notification center',
          path: '/design/components/notification-center',
          description: 'App-level notifications',
        },
        { label: 'Toast', path: '/design/components/toast', description: 'Instant feedback' },
        { label: 'TopBar', path: '/design/components/topbar', description: 'Panel trigger' },
      ]}
    >
      <VStack gap={8}>
        {/* 1. 개요 */}
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    전역 알림 패널은 모든 앱의 <strong>&apos;안읽은(unread)&apos;</strong> 알림을
                    한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰입니다.
                  </li>
                  <li>
                    기록 저장소는 각 앱의 알림센터이며, 전역 패널은 안 읽음 상태의 알림을
                    미러링합니다.
                  </li>
                  <li>
                    빠른 인지, 정리(읽음 처리), 상세 내용 확인, 리소스 이동을 위한{' '}
                    <strong>진입점</strong>입니다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트/알림센터와의 관계
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          레이어
                        </th>
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          역할
                        </th>
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          기록
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          동작
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          토스트
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">즉시 인지</td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          노출 1~3초(최소 1초 보장), 호버 시 일시정지. 실패에는 View details
                          제공(읽음 아님).
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          전역 알림 패널
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          모든 앱의 &apos;안읽은&apos; 알림 목록(미러)
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          필터 없음, 최신순 정렬. 개별/전체 읽음 제공. 카드 클릭=리소스 이동+읽음.
                          패널 열려 있으면 토스트 억제.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          앱 알림센터
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          원본 기록/상세 확인
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">O</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          개별/전체 읽음 제공, 실패 상세(View details) 제공(읽음 아님), 3일 자동
                          삭제.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    전역 패널은 <strong>&quot;최근 안읽음 알림&quot;</strong>이 존재할 때만
                    표시합니다.
                  </li>
                  <li>안읽음 알림이 없는 앱은 표시되지 않습니다.</li>
                  <li>
                    앱 내부 알림센터에서 읽음 처리되거나 보관 기간(3일) 만료 시 전역 패널에서도
                    보이지 않습니다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  읽음 처리 기준 (패널 관점)
                </h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>알림 카드 본문 클릭</strong> → 리소스 이동 + 읽음
                  </li>
                  <li>
                    <strong>개별 &apos;읽음&apos; 버튼 클릭</strong> → 읽음
                  </li>
                  <li>
                    <strong>상단 &apos;전체 읽음&apos;</strong> → 현재 보이는 목록 범위 일괄 읽음
                  </li>
                  <li>토스트의 View details, 닫기(X), 자동 만료는 읽음 아님 → 패널에 남음</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 2. 구성 요소 */}
        <VStack gap={3}>
          <Label>2. 구성 요소</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                전역 알림 패널 아이콘
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                클릭 시 알림 패널 열림/닫힘.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">알림 패널</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                <li>외부 영역 클릭 시 패널 닫힘</li>
                <li>최대 높이 = 데스크탑 UI 높이, 초과 시 내부 스크롤</li>
                <li>알림은 앱별로 그룹화되어 노출</li>
                <li>가장 최근에 알림이 온 순서로 정렬 (위→아래)</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">앱별 헤더</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                <li>앱 아이콘 + 타이틀</li>
                <li>안 읽은 알림 개수 뱃지 형태로 표시</li>
                <li>
                  <strong>Show more</strong> — 알림 1개 이상일 때 노출, 클릭 시 전체 알림 열림
                </li>
                <li>
                  <strong>Show less</strong> — 전체 알림이 열렸을 때 노출, 클릭 시 최신 알림 1개만
                  노출
                </li>
                <li>
                  <strong>전체 읽음 처리 버튼</strong> — 호버 시 툴팁 &quot;Mark all as read&quot;,
                  클릭 시 모든 알림 읽음 + 제거
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">개별 알림</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                <li>알림센터의 알림과 동일한 구성</li>
                <li>읽음 처리 버튼 클릭 시 즉시 전역 패널에서 제거</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* 3. 가이드라인 */}
        <VStack gap={3}>
          <Label>3. 가이드라인</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">표시/동기화</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>전역 패널은 알림센터의 안읽음 목록을 미러링합니다.</li>
                  <li>
                    패널 오픈 중 새 알림은 <strong>실시간 상단 추가</strong>됩니다.
                  </li>
                  <li>알림센터에서 읽음/만료 → 패널에서 동기 제거됩니다.</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">상호작용</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          사용자 행동
                        </th>
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          결과
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          패널 반영
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          카드 본문 클릭
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          리소스 이동 + 읽음
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          해당 알림 제거 + 패널 닫힘
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          View details 클릭
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          알림 상세 영역 확장
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          안 읽음 상태 유지 (패널에 남음)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          개별 읽음 버튼
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">읽음 처리</td>
                        <td className="py-2 text-[var(--color-text-muted)]">목록에서 즉시 제거</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          전체 읽음
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          현재 보이는 목록 일괄 읽음
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">모든 알림 제거</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 4. 시나리오 예시 */}
        <VStack gap={3}>
          <Label>4. 시나리오 예시</Label>
          <VStack gap={4}>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  시나리오 A — &quot;토스트를 놓쳤지만, 패널에서 확인하고 바로 이동/정리&quot;
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                  상황: 인스턴스 삭제 성공 토스트가 자동 만료 (읽음 아님).
                </p>
                <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>전역 알림 패널을 연다 (필터 없음, 최신순).</li>
                  <li>방금 알림을 카드 본문 클릭 → 리소스 상세로 이동 (읽음).</li>
                  <li>패널을 다시 열면 해당 항목은 사라져 있음.</li>
                </ol>
                <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    정책 포인트: 본문 클릭 = 읽음, 패널은 모든 안읽음 미러라 읽음 항목은 제거.
                  </p>
                </div>
              </VStack>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  시나리오 B — &quot;폭주 상황: 패널 오픈 → 토스트 억제, 일괄/개별 읽음으로 빠르게
                  정리&quot;
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                  상황: 대량 작업으로 알림 다수 발생.
                </p>
                <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>전역 알림 패널을 연 상태로 작업을 계속한다.</li>
                  <li>새 알림은 토스트 없이 패널 상단에 실시간 추가된다.</li>
                  <li>
                    긴급한 1~2건은 개별 알림 클릭으로 바로 리소스 화면 열림 + 패널 닫힘 + 읽음.
                  </li>
                  <li>나머지는 &apos;전체 읽음 처리&apos;로 한 번에 정리한다.</li>
                </ol>
                <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    정책 포인트: 패널 오픈 중 토스트 억제, 전체 읽음 = 현재 보이는 목록 범위.
                  </p>
                </div>
              </VStack>
            </div>
          </VStack>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
