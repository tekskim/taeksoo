import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function ToastPage() {
  return (
    <ComponentPageTemplate
      title="Toast"
      description="Instant feedback notification for user actions, displayed briefly at the top-right corner"
      relatedLinks={[
        {
          label: 'Notification center',
          path: '/design/components/notification-center',
          description: 'Notification history',
        },
        {
          label: 'Global notification panel',
          path: '/design/components/global-notification-panel',
          description: 'Desktop-level panel',
        },
        {
          label: 'Inline message',
          path: '/design/components/inline-message',
          description: 'Inline feedback',
        },
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
                    사용자가 수행한 액션에 대한 <strong>즉각적인 피드백</strong>을 제공하는 알림
                    컴포넌트입니다.
                  </li>
                  <li>화면 우측 상단 고정 영역에 잠깐 노출됩니다.</li>
                  <li>
                    상세 확인/기록은 앱 내부 알림센터가 담당하며, 전역 알림 패널은 안읽은 알림
                    목록을 모아 보여주는 보조 뷰입니다.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">레이아웃</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          상태
                        </th>
                        <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                          토스트 표시 위치
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예외
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          앱 활성 상태
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          해당 앱 UI의 우측 상단 토스트 영역 (최상단 레이어)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          앱 내부 알림센터가 열려 있을 경우 → 토스트 미표시, 알림센터 + 전역 패널에
                          기록
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-medium text-[var(--color-text-default)]">
                          앱 비활성 / 닫힘
                        </td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">
                          데스크탑 UI 공통 토스트 영역 (우측 상단)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          전역 패널이 열려 있는 경우 → 토스트 미표시, 알림센터 + 전역 패널에 기록
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">표시 규칙</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    항상 동시에 <strong>1개만</strong> 노출됩니다.
                  </li>
                  <li>
                    새 토스트 도착 시, 현재 토스트의 최소 1초가 지났다면 교체 (아직 1초 미만이면 1초
                    채운 뒤 교체).
                  </li>
                  <li>
                    호버 중 / 상세 정보(View details)가 열려있는 중에는 교체 금지 (대기열에 쌓았다가
                    순차 노출).
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    0.7버전에서는 <strong>사용자 액션에 대한 피드백만</strong> 토스트 메세지에
                    해당합니다.
                  </li>
                  <li>
                    토스트 메세지는 얼럿(Alert)이 아닌 <strong>노티(Notification)</strong>입니다.
                  </li>
                  <li>
                    노티 유형: <strong>요청</strong>(비동기 착수 알림), <strong>성공</strong>,{' '}
                    <strong>실패</strong>
                  </li>
                  <li>시스템 장애/보안 이벤트 등은 이후 버전에서 진행합니다.</li>
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
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">유형 아이콘</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                토스트 유형(요청/성공/실패)에 맞는 아이콘을 표시합니다.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">메세지 내용</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                어떤 리소스에 대해 어떤 액션이 어떻게 되었는지 단일 문장으로 구성합니다.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                파티션 정보 (선택)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                앱에 파티션(compute의 tenant, container의 cluster/namespace 등)이 존재할 경우 어떤
                파티션에서 일어난 액션인지 표시합니다.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                닫기(x) 버튼
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                클릭 시 토스트가 즉시 닫힙니다. 단순 UI 닫음이며{' '}
                <strong>읽음 처리가 아닙니다</strong> (알림센터/전역 패널에는 안읽음으로 유지).
              </p>
            </div>
          </div>
        </VStack>

        {/* 3. 가이드라인 */}
        <VStack gap={3}>
          <Label>3. 가이드라인</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트 메세지 발생 유형
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-state-info)]" />
                      <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                        요청
                      </span>
                    </div>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      비동기 액션에서만 선택적으로 발생. 실시간으로 즉시 완료되지 않을 때
                      요청되었음을 알림.
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-state-success)]" />
                      <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                        성공
                      </span>
                    </div>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      사용자의 요청이 정상적으로 처리되었음을 알림. (예: 인스턴스 생성 성공)
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-state-danger)]" />
                      <span className="text-body-sm font-medium text-[var(--color-text-default)]">
                        실패
                      </span>
                    </div>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      사용자의 요청이 처리되지 못했거나 오류가 발생했음을 알림. (예: 볼륨 연결 실패)
                    </p>
                  </div>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">동시 표시 규칙</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    한 번에 <strong>1개만</strong> 노출.
                  </li>
                  <li>호버/핀 고정 중에는 새 토스트를 대기열에 쌓음.</li>
                  <li>고정 해제 후 도착 순서대로(발생 시간 순) 노출.</li>
                  <li>
                    각 토스트는 <strong>최소 1초</strong> 보장 후 다음으로 넘어감.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트 표시 시간
                </h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    최소 노출 <strong>1초</strong>, 최대 <strong>3초</strong>.
                  </li>
                  <li>새 토스트가 와도 현재 토스트의 최소 1초는 보장.</li>
                  <li>호버 시 일시정지(고정), 호버 해제 시 남은 시간 재개.</li>
                  <li>상세 정보 확장(View details) 시: 자동 닫힘 없음, 사용자 닫기 시 종료.</li>
                </ul>
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
                  시나리오 1 — &quot;성공 알림을 즉시 따라가서 확인&quot;
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                  상황: 사용자가 인스턴스 1개를 삭제한다.
                </p>
                <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>삭제 실행 직후, 우측 상단에 성공 토스트가 뜬다 (최소 1초, 최대 3초).</li>
                  <li>사용자는 토스트 본문을 클릭한다.</li>
                  <li>앱이 해당 인스턴스 리스트 화면으로 이동해 결과를 확인한다.</li>
                  <li>이후 전역 알림 패널을 열어보면 방금 건이 없다 (읽은 알림이기 때문).</li>
                </ol>
                <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    토스트: 즉시 닫힘 / 전역 패널: 목록에서 제거(읽음) / 알림센터: 읽음 처리
                    기록(3일 보관)
                  </p>
                </div>
              </VStack>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  시나리오 2 — &quot;실패 원인을 토스트에서 펼쳐보고, 나중에 처리&quot;
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1">
                  상황: IAM 권한 변경이 실패했다.
                </p>
                <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>실패 토스트가 뜬다 (최소 1초 보장).</li>
                  <li>
                    사용자는 토스트의 View details를 눌러 오류 코드/메시지를 인라인 확장해 원인을
                    확인한다.
                  </li>
                  <li>다른 UI를 조작해야 해서 토스트를 그대로 둔다 (핀 고정).</li>
                  <li>View details를 닫거나 X로 닫아 토스트를 치운다.</li>
                  <li>
                    나중에 전역 알림 패널에서 같은 실패 알림을 읽음 처리하거나, 알림 클릭으로 리소스
                    화면으로 이동해 재시도.
                  </li>
                </ol>
                <div className="mt-2 p-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    토스트: View details 확장 중 고정, 닫기 전 자동 종료 없음 / 전역 패널: 안읽음
                    유지 / 알림센터: 안읽음으로 추적 가능
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
