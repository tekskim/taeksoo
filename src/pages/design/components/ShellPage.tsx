import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function ShellPage() {
  return (
    <ComponentPageTemplate
      title="Shell"
      description="Web-based virtual terminal environment for controlling app resources"
      relatedLinks={[
        {
          label: 'Layout',
          path: '/design/patterns/layout',
          description: 'Page layout with bottom panel',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">핵심 컨셉</h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  앱 내 리소스를 제어하기 위한 <strong>웹 기반의 가상 터미널(Shell) 환경</strong>
                  으로, 로컬 터미널과 최대한 유사한 사용 경험을 제공하되, 웹 환경 최적화 조건을
                  포함합니다.
                </p>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  서비스별 역할 (Container)
                </h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>컨테이너 내부 접근 (kubectl 실행)</li>
                  <li>클러스터/네임스페이스/파드 단위의 운영 명령 실행</li>
                  <li>View Log — kubectl get pod 명령의 출력 결과 표시 (명령줄 입력은 불가)</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">디자인 목표</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                      친숙함
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      Bash/Zsh 기반 CLI 사용 경험을 최대한 유지
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                      안전성
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      웹 환경에서의 오작동, 권한 남용 방지
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                    <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-1">
                      맥락성
                    </p>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
                      현재 선택된 리소스(Context)가 쉽게 인지되도록 설계
                    </p>
                  </div>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>2. 진입 및 실행 정책</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                    항목
                  </th>
                  <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                    정책
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    Shell 실행 방법
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    <strong>Action</strong>: 앱 내 특정 리소스 선택 후 Shell 열기 액션 /
                    <strong> Cluster Utility</strong>: Top Navigation Bar의 Kubectl Shell 열기
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    세션 범위
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    선택된 리소스 컨텍스트에 종속. 같은 윈도우에서 하나의 리소스에 대해 하나의
                    Shell만 실행 가능. 각 세션은 독립적인 입력/출력 스트림 유지.
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    명령 이력 관리
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    세션 단위 히스토리 유지. 세션 종료 시 히스토리 폐기.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    세션 유지 정책
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    네트워크 단절 시 자동 재연결 시도. 단절 후 일정 시간(default: 300초) 초과 시
                    세션 만료 처리.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>3. 화면 구성 요소</Label>
          <VStack gap={4}>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">헤더 영역</h4>
              <ol className="list-decimal pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>현재 연결 정보 표시</strong> — resourceName을 탭에 표시. 헤더의 세션
                  타이틀은 &apos;세션을 연 원래 리소스&apos;로 고정 (터널링/포트 포워딩으로 다른
                  리소스에 접속해도 첫 번째 리소스 이름 유지).
                </li>
                <li>
                  <strong>새 탭으로 보기 기능</strong> — 분할 패널에서 개별 탭으로 전환.
                </li>
                <li>
                  <strong>세션 종료 버튼</strong> — 현재 Shell 세션 종료.
                </li>
              </ol>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                메인 터미널 영역
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>텍스트 입력 및 출력 환경</li>
                <li>Monospace 폰트 사용</li>
                <li>표준 터미널 컬러 스킴 지원</li>
                <li>스크롤 가능 (명령 이력 유지)</li>
              </ul>
              <div className="mt-2 p-2 bg-[var(--color-state-warning-bg)] rounded-[var(--radius-sm)]">
                <p className="text-body-sm text-[var(--color-state-warning)]">
                  Log Viewer (View Log) 기능의 경우 GUI 스타일만 동일하며, 메인 터미널 영역의 입력은
                  불가. 데이터 출력 결과만 표시.
                </p>
              </div>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-2">
                하단 영역 (Option)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                    Select box
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    접속 대상 리소스 선택 (Container 서비스의 경우 접속 대상 Container 선택)
                  </p>
                </div>
                <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                    Clear
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    Shell 초기화 (세션은 유지)
                  </p>
                </div>
                <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                    Download
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    리소스 생성 후 전체 기간의 로그 다운로드 (View Log 기능 한정)
                  </p>
                </div>
                <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                    연결 상태 표시
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-state-success)]">Connected</span> /
                    <span className="text-[var(--color-state-warning)]"> Connecting</span> /
                    <span className="text-[var(--color-state-danger)]"> Disconnected</span>
                  </p>
                </div>
                <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)]">
                  <p className="text-body-sm font-medium text-[var(--color-text-default)] mb-0.5">
                    Duration
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    로그 View 범위 선택 기능 (View Log 기능 한정)
                  </p>
                </div>
              </div>
            </div>
          </VStack>
        </VStack>

        <VStack gap={3}>
          <Label>4. UI 작동 방식</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                분할 패널 View (기본)
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>Shell 실행 시 기본 보기 방식</li>
                <li>높이: 최소 300px ~ (콘텐츠 영역 높이 - 100px), default 300px</li>
                <li>헤더 영역의 Resize Handle로 높이 조절 가능</li>
                <li>너비: 사이드 내비게이션 바 이후부터 최대 너비로 고정</li>
                <li>
                  다른 메뉴 클릭 시 Shell 및 분할 패널은 <strong>하단에 그대로 유지</strong>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                탭 View (새 탭으로 보기)
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>분할 패널에서 새 탭으로 보기 클릭 시 앱 내 개별 탭으로 실행</li>
                <li>크기: 사이드 메뉴, 탭바 영역을 초과하지 않는 범위에서 Full size</li>
                <li>
                  다른 메뉴 클릭 시 해당 페이지로 이동하며 <strong>Shell 종료</strong>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              <strong>입력 정책:</strong> 키보드 중심 인터랙션. 마우스 선택 및 복사 허용.
            </p>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
