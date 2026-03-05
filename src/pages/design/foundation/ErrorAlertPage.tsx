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

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

export function ErrorAlertPage() {
  return (
    <ComponentPageTemplate
      title="Error & Alert"
      description="사용자의 행동 결과, 시스템 상태 변화, 또는 오류 상황을 사용자에게 전달하기 위한 제품 전반의 알림 체계와 메시지 분류 기준을 정의하는 Foundation 문서이다."
      whenToUse={[
        '앱 내부 알림',
        '데스크탑 UI 전역 알림',
        '시스템 상태 메시지',
        '사용자 액션 피드백',
      ]}
      whenNotToUse={['마케팅 메시지', '고객 지원 메시지']}
      guidelines={
        <VStack gap={6}>
          {/* 1. Principles */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">Principles</h3>
            <VStack gap={4}>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  1. 필요한 정보만 전달
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  불필요하거나 중복된 알림을 피한다.
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-2">
                  2. 계층적 전달 (중요도별)
                </h4>
                <TableWrapper>
                  <thead>
                    <tr>
                      <Th className="w-[100px]">중요도</Th>
                      <Th>특성</Th>
                      <Th>컴포넌트</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td>Low</Td>
                      <Td>단순 피드백, 최소한의 방해</Td>
                      <Td>Validation, Toast</Td>
                    </tr>
                    <tr>
                      <Td>Medium</Td>
                      <Td>작업 진행에 영향 가능, 주의 필요</Td>
                      <Td>Snackbar, Inline Message</Td>
                    </tr>
                    <tr>
                      <Td>High</Td>
                      <Td>진행 차단, 즉시 결정 필요</Td>
                      <Td>Modal, Error 화면, Notification Center</Td>
                    </tr>
                  </tbody>
                </TableWrapper>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  3. 맥락 가까운 위치에서 전달
                </h4>
                <ul className="text-body-md text-[var(--color-text-muted)] list-disc pl-5 space-y-1">
                  <li>입력 오류 → 필드 검증</li>
                  <li>액션 결과 → Toast</li>
                  <li>중요 이벤트 → Snackbar</li>
                  <li>지속적 경고 → Inline Message</li>
                </ul>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  4. 기록 가능한 채널 사용
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  기록되는 모든 알림은 App Notification Center에 저장된다. Global Notification
                  Panel은 표시 레이어이다.
                </p>
              </div>
            </VStack>
          </div>

          {/* 2. 알림 계층 구조 */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">
              알림 계층 구조
            </h3>
            <VStack gap={3}>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  1. 앱 내부 알림
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  앱이 활성화된 상태. 컴포넌트: Validation, Inline Message, Toast, Snackbar,
                  Notification Center
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  2. 데스크탑 UI 알림
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  앱이 비활성화된 상태. 컴포넌트: Global Notification Panel, Snackbar, App icon
                  badge
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  3. 실제 PC 알림
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Suite가 최소화되거나 포커스를 잃었을 때. 브라우저/OS 알림 시스템 사용.
                </p>
              </div>
            </VStack>
          </div>

          {/* 3. 메시지 유형 */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">메시지 유형</h3>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[120px]">유형</Th>
                  <Th>정의</Th>
                  <Th>예</Th>
                  <Th>컴포넌트</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>필드 검증</Td>
                  <Td>입력 중 오류/가이드</Td>
                  <Td>필수 필드, 형식 오류</Td>
                  <Td>Validation</Td>
                </tr>
                <tr>
                  <Td>일시적 피드백</Td>
                  <Td>액션에 대한 즉각적 응답</Td>
                  <Td>&quot;이름 변경됨&quot;, &quot;설정 저장됨&quot;</Td>
                  <Td>Toast</Td>
                </tr>
                <tr>
                  <Td>시간차/지연 응답</Td>
                  <Td>비동기 작업 결과</Td>
                  <Td>리소스 생성 성공/실패</Td>
                  <Td>Toast 또는 Snackbar</Td>
                </tr>
                <tr>
                  <Td>상태 전이</Td>
                  <Td>시스템 주도 상태 변화</Td>
                  <Td>Active → Error</Td>
                  <Td>Snackbar, Inline Message</Td>
                </tr>
                <tr>
                  <Td>권한 피드백</Td>
                  <Td>정책/권한 위반</Td>
                  <Td>&quot;권한이 부족합니다&quot;</Td>
                  <Td>Toast/Snackbar, 결정 시 Modal</Td>
                </tr>
                <tr>
                  <Td>시스템/연결 오류</Td>
                  <Td>서비스 연결 불가</Td>
                  <Td>&quot;네트워크 연결 끊김&quot;</Td>
                  <Td>Error 화면</Td>
                </tr>
                <tr>
                  <Td>위험 경고</Td>
                  <Td>개입이 필요한 시스템 이슈</Td>
                  <Td>비정상 로그인, 인프라 장애</Td>
                  <Td>Inline Message, Notification Center, Email</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </div>

          {/* 4. 컴포넌트 유형 */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">컴포넌트 유형</h3>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[180px]">컴포넌트</Th>
                  <Th>목적</Th>
                  <Th>지속성</Th>
                  <Th>기록</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>1. Validation</Td>
                  <Td>입력 필드 근처 텍스트/라인</Td>
                  <Td>휘발성</Td>
                  <Td>없음</Td>
                </tr>
                <tr>
                  <Td>2. Toast</Td>
                  <Td>액션 피드백용 경량 팝업</Td>
                  <Td>3–5초 후 사라짐</Td>
                  <Td>없음</Td>
                </tr>
                <tr>
                  <Td>3. Snackbar</Td>
                  <Td>액션 버튼이 있는 이벤트 알림</Td>
                  <Td>자동 닫힘 또는 사용자 닫기</Td>
                  <Td>가능</Td>
                </tr>
                <tr>
                  <Td>4. Inline Message</Td>
                  <Td>화면/섹션 상단 지속 배너</Td>
                  <Td>조건 해소까지 유지</Td>
                  <Td>가능</Td>
                </tr>
                <tr>
                  <Td>5. Modal</Td>
                  <Td>사용자 액션 중단, 결정 필요</Td>
                  <Td>버튼 클릭까지 유지</Td>
                  <Td>없음</Td>
                </tr>
                <tr>
                  <Td>6. Error 화면</Td>
                  <Td>전체 화면 접근 차단</Td>
                  <Td>시스템 복구까지 유지</Td>
                  <Td>없음</Td>
                </tr>
                <tr>
                  <Td>7. Notification Center</Td>
                  <Td>앱 내 기록 가능 알림 저장소</Td>
                  <Td>—</Td>
                  <Td>—</Td>
                </tr>
                <tr>
                  <Td>8. Global notification panel</Td>
                  <Td>데스크탑 수준 통합 표시 (macOS 알림 패널 유사)</Td>
                  <Td>—</Td>
                  <Td>App Notification Center 데이터 표시</Td>
                </tr>
                <tr>
                  <Td>9. Email</Td>
                  <Td>중요 알림 이메일 발송</Td>
                  <Td>—</Td>
                  <Td>기록됨</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </div>

          {/* 5. 알림 기록 정책 */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">
              알림 기록 정책
            </h3>
            <VStack gap={3}>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자가 나중에 검토할 필요가 있는 이벤트만 기록된다.
              </p>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  기록되는 메시지 유형
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  비동기 결과, 시스템 상태 변화, 권한 이벤트, 필수 사용자 액션, 보안 이벤트
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  특징
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  기록 데이터 흐름: Event → App Notification Center → Snackbar (앱 활성 시 in-app,
                  비활성 시 desktop)
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  기록되지 않는 알림
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  일시적 피드백 (설정 저장됨, 이름 변경됨, 입력 오류)
                </p>
              </div>
            </VStack>
          </div>
        </VStack>
      }
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'System Error', path: '/design/foundation/system-error' },
      ]}
    />
  );
}
