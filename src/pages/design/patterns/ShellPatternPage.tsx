import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack, Select, Button } from '@/design-system';
import { IconTerminal2, IconExternalLink, IconX } from '@tabler/icons-react';

const SAMPLE_LOGS = [
  'I1029 02:06:11.570725    1 main.go:152] "Version" version="v1.2.3"',
  'I1029 02:06:11.570824    1 main.go:153] "Running node-driver-registrar" mode="csi"',
  'I1029 02:06:11.570828    1 main.go:174] "Attempting to open a gRPC connection" csiAddress="/csi/csi.sock"',
  'I1029 02:06:17.836012    1 main.go:182] "Calling CSI driver to discover driver name"',
  'I1029 02:06:17.837013    1 main.go:191] "CSI driver name" csiDriverName="driver.csi.io"',
  'I1029 02:06:17.837042    1 node_register.go:56] "Starting Registration Server" socketPath="/registration/driver.csi.io-reg.sock"',
  'I1029 02:06:17.837176    1 node_register.go:66] "Registration Server started" socketPath="/registration/driver.csi.io-reg.sock"',
  'I1029 02:06:17.837245    1 node_register.go:96] "Skipping HTTP server"',
  'I1029 02:06:18.515514    1 main.go:97] "Received GetInfo call" request="&InfoRequest{}"',
  'I1029 02:06:18.529723    1 main.go:109] "Received NotifyRegistrationStatus call" status="&RegistrationStatus{PluginRegistered:true,Error:,}"',
  'I1029 02:06:19.123456    1 kubelet.go:201] "Container runtime initialized" runtime="containerd://1.6.20"',
  'I1029 02:06:19.234567    1 kubelet.go:210] "Pod sandbox created" podSandboxID="abc123def456"',
  'I1029 02:06:20.345678    1 container.go:89] "Pulling image" image="nginx:1.25-alpine"',
  'I1029 02:06:25.456789    1 container.go:102] "Successfully pulled image" image="nginx:1.25-alpine" duration="5.111s"',
  'I1029 02:06:25.567890    1 container.go:115] "Creating container" containerName="web-server"',
  'I1029 02:06:26.678901    1 container.go:128] "Container created" containerID="container-xyz789"',
  'I1029 02:06:26.789012    1 container.go:141] "Starting container" containerID="container-xyz789"',
  'I1029 02:06:27.890123    1 container.go:154] "Container started successfully" containerID="container-xyz789"',
];

function ShellPreview() {
  return (
    <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
      {/* Header / Tab Bar */}
      <div className="flex items-center bg-[var(--color-surface-subtle)]">
        <div className="flex items-center">
          {/* Active Tab */}
          <div className="relative flex items-center gap-2 px-3 h-9 bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)]">
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)]" />
            <IconTerminal2 size={14} className="text-[var(--color-text-default)]" stroke={1.5} />
            <span className="text-body-sm font-medium text-[var(--color-text-default)] max-w-[140px] truncate">
              nginx-pod-7d4f8b
            </span>
            <button className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <IconExternalLink size={12} stroke={1.5} />
            </button>
            <button className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <IconX size={12} stroke={1} />
            </button>
          </div>
          {/* Inactive Tab */}
          <div className="flex items-center gap-2 px-3 h-9 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-subtle)]">
            <IconTerminal2 size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
            <span className="text-body-sm font-medium text-[var(--color-text-muted)] max-w-[140px] truncate">
              redis-cache-01
            </span>
            <button className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <IconExternalLink size={12} stroke={1.5} />
            </button>
            <button className="p-0.5 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
              <IconX size={12} stroke={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="h-[280px] overflow-auto p-4 font-mono text-body-md leading-5 bg-[#0d1117] text-slate-300">
        <pre className="whitespace-pre-wrap break-all m-0">{SAMPLE_LOGS.join('\n')}</pre>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
        <div className="flex items-center gap-1">
          <Select
            value="container-0"
            onChange={() => {}}
            options={[
              { value: 'container-0', label: 'Container: container-0' },
              { value: 'container-1', label: 'Container: container-1' },
            ]}
            placeholder="Container"
            size="sm"
          />
          <Button size="sm" variant="secondary">
            Clear
          </Button>
          <div className="flex items-center gap-1.5 ml-3">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-body-md text-[var(--color-text-default)]">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShellPatternPage() {
  return (
    <ComponentPageTemplate
      title="Shell"
      description="웹 기반의 가상 터미널(Shell) 환경으로, 앱 내 리소스를 제어하기 위해 사용한다. 로컬 터미널과 최대한 유사한 사용 경험을 제공하되, 웹 환경에 최적화된 조건을 포함한다."
      whenToUse={[
        '앱 내 특정 리소스(컨테이너 등)에 직접 접근하여 명령을 실행해야 할 때',
        '클러스터 운영 명령(kubectl)을 웹 환경에서 실행해야 할 때',
        '리소스의 로그를 실시간으로 확인해야 할 때 (View Log)',
      ]}
      preview={
        <ComponentPreview
          code={`<ShellPanel
  isExpanded={shellPanel.isExpanded}
  onExpandedChange={shellPanel.setIsExpanded}
  tabs={shellPanel.tabs}
  activeTabId={shellPanel.activeTabId}
  onActiveTabChange={shellPanel.setActiveTabId}
  onCloseTab={shellPanel.closeTab}
  onContentChange={shellPanel.updateContent}
  onClear={shellPanel.clearContent}
  onOpenInNewTab={handleOpenInNewTab}
  initialHeight={350}
  minHeight={300}
  sidebarOpen={sidebarOpen}
  sidebarWidth={sidebarWidth}
/>`}
        >
          <ShellPreview />
        </ComponentPreview>
      }
      guidelines={
        <VStack gap={10} align="stretch">
          {/* Variants */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Variants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[180px]">
                      구분
                    </th>
                    <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">Shell</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      컨테이너 내부에 접근하여 명령 실행이 가능한 기본 Shell
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-2 text-[var(--color-text-default)]">
                      View Log (Container)
                    </td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">
                      명령 입력 없이 로그 출력 결과만 표시하는 읽기 전용 모드
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Composition */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">
              Composition (구성 요소)
            </h3>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1. 헤더 영역</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[200px]">
                        요소
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        a. 탭 (resourceName)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        현재 연결된 리소스명 표시. 세션을 연 원래 리소스로 고정되며, 터널링·포트
                        포워딩 등으로 다른 리소스에 접속해도 첫 번째 리소스 이름을 유지
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        b. 새 탭으로 보기 (↗)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        현재 Shell을 앱 내 개별 탭으로 분리하여 실행
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">
                        c. 세션 종료 (❌)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        현재 Shell 세션 종료
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2. 메인 터미널 영역
              </h4>
              <p className="text-body-md text-[var(--color-text-muted)]">
                텍스트 입력 및 출력 환경
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Monospace 폰트 사용</li>
                <li>표준 터미널 컬러 스킴 지원</li>
                <li>스크롤 가능 (명령 이력 유지)</li>
              </ul>
              <div className="p-3 bg-[var(--color-state-warning-bg)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]">
                <p className="text-body-md text-[var(--color-text-muted)]">
                  ⚠️ Log Viewer (View Log) 기능의 경우 GUI 스타일만 동일하며 메인 터미널 영역의
                  입력은 불가, 데이터 출력 결과만 보여줌.
                </p>
              </div>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                3. 하단 영역 (optional)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-md border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[160px]">
                        요소
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                        설명
                      </th>
                      <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[140px]">
                        제공 조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">a. Select box</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        접속 대상 리소스 선택 (Container 서비스의 경우 접속 대상 Container 선택)
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">항상</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">b. Clear</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        Shell 초기화. 세션은 유지됨
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">항상</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">c. Download</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        리소스 생성 후 전체 기간의 로그 다운로드
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">View Log 한정</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">d. 연결 상태</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        <span>🟢 Connected: 세션이 정상적으로 연결된 상태</span>
                        <br />
                        <span>🟡 Connecting: 연결 시도 중이거나 재연결 중인 상태</span>
                        <br />
                        <span>🔴 Disconnected: 네트워크 단절 등으로 연결이 끊긴 상태</span>
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">항상</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="px-3 py-2 text-[var(--color-text-default)]">e. Duration</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">
                        로그 View 범위 선택
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">View Log 한정</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </VStack>

          {/* Behavior */}
          <VStack gap={6} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Behavior</h3>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Shell 윈도우 정책
              </h4>

              <VStack gap={4} align="stretch">
                <VStack gap={2} align="stretch">
                  <p className="text-body-md font-medium text-[var(--color-text-default)]">
                    1. 분할 패널 View — Shell 실행 시 기본 보기 방식
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-md border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[160px]">
                            속성
                          </th>
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            값
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">
                            높이 (최소값)
                          </td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">300px</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">
                            높이 (최대값)
                          </td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            콘텐츠 영역 높이 - 100px
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">높이 조절</td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            헤더 영역 테두리의 Resize Handle로 조절 가능
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">너비</td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            사이드 내비게이션 바 이후 영역부터 최대 너비로 고정
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">
                            페이지 이동 시
                          </td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            Shell 및 분할 패널은 하단에 그대로 유지
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>

                <VStack gap={2} align="stretch">
                  <p className="text-body-md font-medium text-[var(--color-text-default)]">
                    2. 탭 View — 분할 패널 상태에서 새 탭으로 보기 클릭 시 전환
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-md border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium w-[160px]">
                            속성
                          </th>
                          <th className="text-left px-3 py-2 text-label-sm text-[var(--color-text-subtle)] font-medium">
                            값
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">크기</td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            사이드 메뉴, 탭바 영역을 초과하지 않는 범위에서 Full size
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-[var(--color-text-default)]">
                            페이지 이동 시
                          </td>
                          <td className="px-3 py-2 text-[var(--color-text-muted)]">
                            해당 페이지로 이동하며 Shell 종료
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>
              </VStack>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">세션 정책</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Shell은 선택된 리소스 컨텍스트에 종속</li>
                <li>같은 윈도우에서는 하나의 리소스에 대해 하나의 Shell만 실행 가능</li>
                <li>각 세션은 독립적인 입력/출력 스트림 유지</li>
                <li>세션 단위 히스토리 유지, 세션 종료 시 히스토리 폐기</li>
                <li>네트워크 단절 시 자동 재연결 시도</li>
                <li>네트워크 단절 후 300초 초과 시 세션 만료 처리</li>
              </ul>
            </VStack>

            <VStack gap={3} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">입력 정책</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>키보드 중심 인터랙션</li>
                <li>마우스 선택·복사 허용</li>
              </ul>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[{ label: 'App Window', path: '/design/policies/app-window' }]}
    />
  );
}
