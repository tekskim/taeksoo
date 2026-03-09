import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function ErrorAlertGuidelines() {
  return (
    <VStack gap={10}>
      {/* Overview */}
      <VStack gap={4}>
        <SectionTitle>Overview</SectionTitle>
        <Prose>
          <p>
            사용자의 행동 결과, 시스템 상태 변화, 또는 오류 상황을 사용자에게 전달하기 위한{' '}
            <strong>제품 전반의 알림 체계와 메시지 분류 기준을 정의하는 Foundation 문서</strong>
            이다.
          </p>
          <p>이 문서는 다음 내용을 정의한다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>제품 내 알림 계층 구조</li>
            <li>메시지 유형 분류 기준</li>
            <li>메시지 전달에 사용되는 UI 컴포넌트</li>
          </ul>
          <p>
            각 컴포넌트의 상세 UX Writing 및 인터랙션 규칙은 <strong>Component 정책 문서</strong>
            에서 정의한다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Principles */}
      <VStack gap={6}>
        <SectionTitle>Principles</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) 알림은 사용자 행동에 필요한 정보만 전달한다</SubSectionTitle>
          <Prose>
            <p>알림은 사용자의 작업 흐름을 방해하지 않는 범위에서 필요한 정보만 제공해야 한다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>불필요한 알림 노출을 지양한다.</li>
              <li>동일한 이벤트에 대해 중복 알림을 발생시키지 않는다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) 알림은 중요도에 따라 계층적으로 전달한다</SubSectionTitle>
          <Prose>
            <p>
              알림은 <strong>사용자의 작업 흐름에 미치는 영향도와 긴급도</strong>에 따라 전달 방식이
              달라진다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[120px]">중요도</Th>
                <Th>특징</Th>
                <Th className="w-[180px]">컴포넌트</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>낮음(Low)</strong>
                </Td>
                <Td>
                  사용자의 행동에 대한 단순 피드백 또는 입력 과정에서 발생하는 안내 메시지. 사용자
                  흐름을 거의 방해하지 않으며 짧은 시간 동안 표시됨
                </Td>
                <Td>Validation, 토스트</Td>
              </tr>
              <tr>
                <Td>
                  <strong>중간(Medium)</strong>
                </Td>
                <Td>
                  사용자의 작업 진행에 영향을 줄 수 있는 상태 변화 또는 추가 행동이 필요한 상황.
                  사용자의 주의를 환기하지만 작업을 강제로 중단하지는 않음
                </Td>
                <Td>스낵바, 인라인 메세지</Td>
              </tr>
              <tr>
                <Td>
                  <strong>높음(High)</strong>
                </Td>
                <Td>
                  사용자의 작업 진행이 불가능하거나 즉각적인 사용자 결정 또는 조치가 필요한 상황.
                  현재 작업 흐름을 중단시키거나 반드시 인지해야 하는 상태
                </Td>
                <Td>모달, 에러 화면, 알림 센터</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) 알림은 맥락이 가장 가까운 위치에서 전달한다</SubSectionTitle>
          <Prose>
            <p>
              가능한 경우 <strong>사용자가 작업 중인 위치에서 가장 가까운 UI 요소</strong>로 알림을
              전달한다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th>상황</Th>
                <Th>전달 위치</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>입력 오류</Td>
                <Td>입력 필드 Validation</Td>
              </tr>
              <tr>
                <Td>액션 결과</Td>
                <Td>토스트</Td>
              </tr>
              <tr>
                <Td>중요 이벤트</Td>
                <Td>스낵바</Td>
              </tr>
              <tr>
                <Td>지속적인 상태 경고</Td>
                <Td>인라인 메세지</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 중요한 이벤트는 기록 가능한 채널을 사용한다</SubSectionTitle>
          <Prose>
            <p>
              사용자가 나중에 다시 확인해야 하는 이벤트는 <strong>기록 가능한 알림 채널</strong>을
              사용한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                모든 기록형 알림은 <strong>App Notification Center</strong>에 저장된다.
              </li>
              <li>
                <strong>Global Notification Panel</strong>은 저장된 알림을 표시하는 UI 레이어이다.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={6}>
        <SectionTitle>Usage Guidelines</SectionTitle>

        {/* 1) 알림 계층 구조 */}
        <VStack gap={3}>
          <SubSectionTitle>1) 알림 계층 구조</SubSectionTitle>
          <Prose>
            <p>
              알림은 <strong>어디에서 사용자에게 전달되는지</strong>에 따라 다음 세 단계로 구분한다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">계층</Th>
                <Th>특징</Th>
                <Th className="w-[120px]">주체</Th>
                <Th className="w-[200px]">컴포넌트</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>앱 내부 알림</strong>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>앱(Compute, Container 등)이 활성화 상태일 때 노출</li>
                    <li>앱 컨텍스트와 직접적으로 연결된 이벤트</li>
                    <li>
                      실제 알림 기록 저장소는 앱 내부의 <strong>Notification Center</strong>
                    </li>
                    <li>
                      내역이 남지 않고 휘발되는 메세지와 알림 센터에 기록이 남는 메세지가 구분 됨
                    </li>
                  </ul>
                </Td>
                <Td>개별 서비스 앱</Td>
                <Td>Validation, 인라인 메세지, 토스트, 스낵바, 알림 센터</Td>
              </tr>
              <tr>
                <Td>
                  <strong>데스크탑 UI 알림</strong>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>개별 앱이 비활성 상태일 때 데스크탑 UI에서 표시되는 알림</li>
                    <li>Snackbar로 즉시 알림 제공</li>
                    <li>Global notification panel에서 여러 앱의 알림을 통합해 표시</li>
                    <li>macOS 우측 알림 패널과 유사한 구조</li>
                  </ul>
                </Td>
                <Td>데스크탑 UI</Td>
                <Td>글로벌 알림 패널, 스낵바, 앱 아이콘 배지</Td>
              </tr>
              <tr>
                <Td>
                  <strong>실제 PC 알림</strong>
                  <br />
                  <span className="text-body-sm text-[var(--color-text-subtle)]">(향후 지원)</span>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      스위트가 최소화, 포커스 아웃 되었을 때 사용자의 컴퓨터에서 띄워주는 알림
                    </li>
                    <li>브라우저 또는 OS 알림 시스템 사용</li>
                    <li>치명적인 이벤트 전달 목적</li>
                  </ul>
                </Td>
                <Td>브라우저 API → 실제 운영체제</Td>
                <Td>Push 알림</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        {/* 2) 메세지 유형 */}
        <VStack gap={3}>
          <SubSectionTitle>2) 메세지 유형</SubSectionTitle>
          <Prose>
            <p>
              메시지는 <strong>어떤 상황에서 발생했는지</strong>에 따라 분류한다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[140px]">유형</Th>
                <Th>정의</Th>
                <Th className="w-[180px]">예시</Th>
                <Th className="w-[180px]">컴포넌트</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>필드 검증</strong>
                </Td>
                <Td>입력/선택 과정 중 발생하는 오류 응답 또는 가이드 메세지</Td>
                <Td>필수 입력, 형식 오류</Td>
                <Td>Validation</Td>
              </tr>
              <tr>
                <Td>
                  <strong>일시적 피드백</strong>
                </Td>
                <Td>사용자가 방금 수행한 액션에 대한 즉각적인 응답</Td>
                <Td>&quot;이름 변경 완료&quot;, &quot;설정 저장 성공&quot;</Td>
                <Td>토스트</Td>
              </tr>
              <tr>
                <Td>
                  <strong>시간차/지연 응답</strong>
                </Td>
                <Td>요청한 작업이 즉시 일어나지 않고, 시간이 걸릴 때 작업 완료 후 결과 알림</Td>
                <Td>리소스 생성 성공/실패</Td>
                <Td>토스트 또는 스낵바</Td>
              </tr>
              <tr>
                <Td>
                  <strong>상태 전이</strong>
                </Td>
                <Td>사용자의 의도 없이 시스템이 주도하는 상태 변화</Td>
                <Td>Active → Error 전환</Td>
                <Td>스낵바, 인라인 메세지</Td>
              </tr>
              <tr>
                <Td>
                  <strong>권한 피드백</strong>
                </Td>
                <Td>정책 또는 권한 위반으로 사용자의 진행을 막거나 제한하는 메세지</Td>
                <Td>&quot;권한이 부족합니다.&quot;</Td>
                <Td>토스트/스낵바, 모달</Td>
              </tr>
              <tr>
                <Td>
                  <strong>시스템/연결 오류</strong>
                </Td>
                <Td>네트워크 문제 등으로 서비스 진입이 불가한 상황임을 알림</Td>
                <Td>&quot;네트워크 연결 끊김&quot;</Td>
                <Td>에러 화면</Td>
              </tr>
              <tr>
                <Td>
                  <strong>위험 경고</strong>
                </Td>
                <Td>시스템에 문제가 발생해 사용자 개입이 필수적인 상황 알림</Td>
                <Td>비정상 로그인 감지, 인프라 장애</Td>
                <Td>인라인 메세지, 알림 센터, 이메일</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        {/* 3) 컴포넌트 유형 */}
        <VStack gap={3}>
          <SubSectionTitle>3) 컴포넌트 유형</SubSectionTitle>
          <Prose>
            <p>
              알림은 사용자에게 전달되는 <strong>UI 컴포넌트 형태</strong>에 따라 분류된다. 이
              분류는 <strong>메시지 표시 방식과 사용자 흐름 영향도</strong>를 기준으로 한다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[160px]">컴포넌트</Th>
                <Th>설명</Th>
                <Th className="w-[140px]">목적</Th>
                <Th className="w-[160px]">지속성</Th>
                <Th className="w-[80px]">기록</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Validation</strong>
                </Td>
                <Td>입력값 오류, 필드 설명 등 특정 요소 근처에서 텍스트나 라인으로 표시</Td>
                <Td>즉각 검증 / 맥락 경고</Td>
                <Td>조건 일치 시 사라짐</Td>
                <Td>없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>토스트(Toast)</strong>
                </Td>
                <Td>성공/실패 확인 등 액션에 대한 가벼운 피드백으로 화면 구석에 팝업으로 나타남</Td>
                <Td>단발성 피드백</Td>
                <Td>3~5초 후 휘발</Td>
                <Td>없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>스낵바(Snackbar)</strong>
                </Td>
                <Td>
                  사용자가 반드시 인지해야 하는 이벤트 알림으로, 버튼이 존재해 상호작용까지 가능
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-body-sm text-[var(--color-text-subtle)]">
                    <li>앱 활성 → 앱 내부에서 노출</li>
                    <li>앱 비활성 → 데스크탑 UI에서 노출</li>
                  </ul>
                </Td>
                <Td>이벤트 알림 / 즉각 조치</Td>
                <Td>자동 소멸 또는 사용자 처리 후 삭제</Td>
                <Td>조건부</Td>
              </tr>
              <tr>
                <Td>
                  <strong>인라인 메세지(Inline message)</strong>
                </Td>
                <Td>
                  서비스 점검, 용량 부족 등 지속적인 주의가 요구되어 화면 상단 또는 특정 세션 상단에
                  고정
                </Td>
                <Td>주의 상기</Td>
                <Td>조건 해소까지 유지</Td>
                <Td>조건부</Td>
              </tr>
              <tr>
                <Td>
                  <strong>모달(Modal)</strong>
                </Td>
                <Td>사용자의 액션을 즉시 멈추고 액션에 대한 결정을 요구</Td>
                <Td>사용자 결정 획득</Td>
                <Td>버튼 누를 때까지 유지</Td>
                <Td>없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>에러 화면</strong>
                </Td>
                <Td>네트워크 오류 등 화면 전체에 접근이 불가한 상황을 알림</Td>
                <Td>화면 접근 차단</Td>
                <Td>문제 해결 또는 화면 이탈</Td>
                <Td>없음</Td>
              </tr>
              <tr>
                <Td>
                  <strong>알림 센터(Notification Center)</strong>
                </Td>
                <Td>
                  개별 앱에서 발생한 기록형 알림이 저장되고 조회되는 공간. Snackbar로 표시되었던
                  기록형 이벤트의 실제 저장소
                </Td>
                <Td>알림 기록/조회</Td>
                <Td>사용자 필요에 따라 열림/닫힘</Td>
                <Td>저장소</Td>
              </tr>
              <tr>
                <Td>
                  <strong>글로벌 알림 패널(Global notification panel)</strong>
                </Td>
                <Td>
                  앱이 비활성 상태일 때 여러 앱의 알림을 통합 표시하는 패널. macOS Notification
                  Panel과 유사. App Notification Center의 데이터를 표시하는 UI 레이어
                </Td>
                <Td>통합 알림 표시</Td>
                <Td>사용자 필요에 따라 열림/닫힘</Td>
                <Td>UI 레이어</Td>
              </tr>
              <tr>
                <Td>
                  <strong>이메일(Email)</strong>
                </Td>
                <Td>스위트가 비활성화 상태일 때도 반드시 알려야 하는 이벤트</Td>
                <Td>오프라인 알림</Td>
                <Td>OS 정책에 따름</Td>
                <Td>OS 정책</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        {/* 4) 알림 기록 정책 */}
        <VStack gap={3}>
          <SubSectionTitle>4) 알림 기록 정책</SubSectionTitle>
          <Prose>
            <p>
              모든 알림이 Notification Center에 기록되는 것은 아니다. 사용자가{' '}
              <strong>나중에 다시 확인해야 하는 이벤트</strong>만 기록형 알림으로 관리한다. 기록
              여부는 <strong>이벤트 중요도와 사용자 영향도</strong>를 기준으로 결정한다.
            </p>
          </Prose>

          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[160px]">구분</Th>
                <Th>내용</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>기록되는 메세지 유형</strong>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>비동기 작업의 결과</li>
                    <li>시스템 상태 변화</li>
                    <li>권한 또는 정책 관련 이벤트</li>
                    <li>사용자 조치가 필요한 이벤트</li>
                    <li>서비스 운영 또는 보안 관련 이벤트</li>
                  </ul>
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>노출 방식</strong>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      기록형 알림은 일반적으로 <strong>Snackbar로 사용자에게 먼저 노출</strong>
                      된다.
                    </li>
                    <li>
                      앱 활성 상태 → <strong>앱 내부 Snackbar로 노출</strong>
                    </li>
                    <li>
                      앱 비활성 상태 → <strong>Desktop 레벨에서 Snackbar로 노출</strong>
                    </li>
                    <li>사용자의 선택에 따라 이메일로 발송된다.</li>
                  </ul>
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>기록되지 않는 알림</strong>
                </Td>
                <Td>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      사용자의 작업 흐름 중 <strong>즉각적인 피드백 역할만 하는 메시지</strong>는
                      기록하지 않는다.
                    </li>
                    <li>
                      예시: 설정 저장 완료, 이름 변경 완료, 입력 오류 메시지, 필드 가이드 메시지
                    </li>
                  </ul>
                </Td>
              </tr>
            </tbody>
          </TableWrapper>

          <Prose>
            <p className="text-label-md font-medium text-[var(--color-text-default)]">
              기록 데이터 흐름
            </p>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-4 font-mono text-body-sm text-[var(--color-text-default)] leading-relaxed whitespace-pre">
            {`Event 발생
  ↓
App Notification Center 기록
  ↓
Snackbar 노출

[앱 활성 상태]
  → App Snackbar 노출
  → Global Notification Panel 표시 없음

[앱 비활성 상태]
  → Desktop Snackbar 노출
  → Global Notification Panel에 누적`}
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
}

export function ErrorAlertPage() {
  return (
    <ComponentPageTemplate
      title="Error & Alert"
      description="사용자의 행동 결과, 시스템 상태 변화, 또는 오류 상황을 사용자에게 전달하기 위한 제품 전반의 알림 체계와 메시지 분류 기준을 정의하는 Foundation 문서."
      whenToUse={[
        '앱 내부 알림',
        '데스크탑 UI 전역 알림',
        '시스템 상태 메시지',
        '사용자 액션 피드백',
      ]}
      whenNotToUse={['마케팅 메시지', '고객 지원 메시지']}
      guidelines={<ErrorAlertGuidelines />}
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Input Field', path: '/design/components/input' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
        {
          label: 'Global Notification Panel',
          path: '/design/components/global-notification-panel',
        },
        { label: 'System Error', path: '/design/foundation/system-error' },
      ]}
      notionPageId="2a99eddc34e6805197f6c83b4890fdf9"
    />
  );
}
