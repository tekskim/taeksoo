import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

export function ShellPage() {
  return (
    <ComponentPageTemplate
      title="Shell"
      description="웹 기반의 가상 터미널(Shell) 환경으로, 앱 내 리소스를 제어하기 위해 사용한다. 로컬 터미널과 최대한 유사한 사용 경험을 제공하되, 웹 환경에 최적화된 조건을 포함한다."
      whenToUse={[
        '앱 내 특정 리소스(컨테이너 등)에 직접 접근하여 명령을 실행해야 할 때',
        '클러스터 운영 명령(kubectl)을 웹 환경에서 실행해야 할 때',
        '리소스의 로그를 실시간으로 확인해야 할 때 (View Log)',
      ]}
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1. Variants</h4>
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
                        Shell
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        기본 Shell — 명령 입력 및 실행
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        View Log
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        읽기 전용 모드 — 로그 출력만 표시
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2. Composition (구성 요소)
              </h4>
              <VStack gap={4}>
                <div>
                  <p className="text-label-md text-[var(--color-text-default)] mb-2">헤더 영역</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                            요소
                          </th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            탭 resourceName
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            현재 연결된 리소스 이름 표시
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            새 탭으로 보기 ↗
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            분할 패널에서 개별 탭으로 전환
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            세션 종료 ❌
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            현재 Shell 세션 종료
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <p className="text-label-md text-[var(--color-text-default)] mb-2">
                    메인 터미널 영역
                  </p>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>Monospace 폰트, 터미널 컬러 스킴</li>
                    <li>스크롤 가능</li>
                    <li>View Log: 입력 불가 (출력만 표시)</li>
                  </ul>
                </div>

                <div>
                  <p className="text-label-md text-[var(--color-text-default)] mb-2">하단 영역</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                            요소
                          </th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            Select box
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            접속 대상 리소스 선택
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            Clear
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            Shell 초기화 (세션 유지)
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            Download
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            View Log 한정 — 로그 다운로드
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            연결 상태
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            Connected / Connecting / Disconnected
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                            Duration
                          </td>
                          <td className="py-2 text-[var(--color-text-muted)]">
                            View Log 한정 — 로그 범위 선택
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </VStack>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3. Behavior</h4>
              <p className="text-label-md text-[var(--color-text-default)] mb-2">
                Shell 윈도우 정책
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        View
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        정책
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        분할 패널
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        높이 300px ~ (콘텐츠-100px), 너비 최대. 페이지 이동 시 유지.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">탭</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        Full size. 페이지 이동 시 Shell 종료.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-label-md text-[var(--color-text-default)] mb-2">세션 정책</p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1 mb-4">
                <li>선택된 리소스 컨텍스트에 종속. 하나의 리소스당 하나의 Shell 세션</li>
                <li>세션 단위 히스토리 유지. 세션 종료 시 히스토리 폐기</li>
                <li>네트워크 단절 시 자동 재연결 시도</li>
                <li>단절 후 일정 시간(기본 300초) 초과 시 세션 만료</li>
                <li>Action: 리소스 선택 후 Shell 열기 / Cluster Utility: TopBar Kubectl Shell</li>
                <li>각 세션은 독립적인 입력/출력 스트림 유지</li>
              </ul>

              <p className="text-label-md text-[var(--color-text-default)] mb-2">입력 정책</p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                키보드 중심 인터랙션. 마우스 선택 및 복사 허용.
              </p>
            </VStack>
          </div>
        </VStack>
      }
      relatedLinks={[{ label: 'TopBar', path: '/design/components/topbar' }]}
    />
  );
}
