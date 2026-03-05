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

export function SystemErrorPage() {
  return (
    <ComponentPageTemplate
      title="System Error"
      description="인증, 권한, 라우팅, 서버 오류 등으로 인해 애플리케이션이 요청한 콘텐츠를 정상적으로 렌더링할 수 없을 때 표시되는 시스템 상태를 알리는 메시지이다. 일반적으로 전체 페이지 단위로 표시된다."
      whenToUse={[
        '인증되지 않은 사용자가 인증이 필요한 페이지에 접근한 경우',
        '인증은 되었으나 해당 리소스에 대한 권한이 없는 경우',
        '요청한 페이지나 리소스가 존재하지 않거나 삭제·이동된 경우',
        '서버 내부 오류로 요청을 처리할 수 없는 경우',
        '제한 시간이 있는 일회성 링크가 만료되었거나 이미 사용된 경우',
      ]}
      whenNotToUse={[
        '일부 영역만 실패한 경우 (전체 페이지가 아닌 인라인 에러 또는 Toast 사용 권장)',
        '사용자의 입력 오류로 인한 Validation 실패 (Form 에러 메시지 사용 권장)',
      ]}
      guidelines={
        <VStack gap={6}>
          {/* 1. 공통 원칙 (Tone & UX Writing) */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">
              공통 원칙 (Tone &amp; UX Writing)
            </h3>
            <ul className="text-body-md text-[var(--color-text-muted)] list-disc pl-5 space-y-1">
              <li>전문적이고 중립적인 문체 사용</li>
              <li>감정·사과·공감 표현 사용 금지</li>
              <li>추측성 원인 설명 금지</li>
              <li>사용자가 취할 수 있는 다음 행동을 명확히 제시</li>
            </ul>
          </div>

          {/* 2. Variants */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">Variants</h3>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[180px]">Variant</Th>
                  <Th>상황</Th>
                  <Th>처리 방식</Th>
                  <Th className="w-[140px]">표시 위치</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>401-A Unauthorized</Td>
                  <Td>미인증 상태에서 인증 필수 페이지에 최초 접근</Td>
                  <Td>로그인 페이지로 리다이렉션</Td>
                  <Td>—</Td>
                </tr>
                <tr>
                  <Td>401-B Session Timeout</Td>
                  <Td>세션·토큰 만료 또는 장시간 비활성으로 인증 정보가 유효하지 않은 경우</Td>
                  <Td>세션 만료 모달 팝업 표시</Td>
                  <Td>모달</Td>
                </tr>
                <tr>
                  <Td>403 Forbidden</Td>
                  <Td>인증은 되었으나 리소스에 대한 권한이 없는 경우</Td>
                  <Td>에러 페이지 표시</Td>
                  <Td>앱 윈도우 내부</Td>
                </tr>
                <tr>
                  <Td>404 Not Found</Td>
                  <Td>요청한 페이지·리소스가 존재하지 않거나 이동·삭제된 경우</Td>
                  <Td>에러 페이지 표시</Td>
                  <Td>앱 윈도우 내부</Td>
                </tr>
                <tr>
                  <Td>500 Internal Server Error</Td>
                  <Td>유효한 요청 처리 중 서버 내부 오류 발생</Td>
                  <Td>에러 페이지 표시</Td>
                  <Td>앱 윈도우 내부</Td>
                </tr>
                <tr>
                  <Td>링크 만료</Td>
                  <Td>일회성 링크가 만료되었거나 이미 사용된 경우</Td>
                  <Td>에러 페이지 표시</Td>
                  <Td>브라우저 전체 화면</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </div>

          {/* 3. Composition (구성 요소) */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">
              Composition (구성 요소)
            </h3>
            <VStack gap={3}>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  401-A Unauthorized
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  별도 에러 페이지 없이 로그인 페이지로 즉시 리다이렉션
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  401-B Session Timeout
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Title, Description, Primary Button (Sign in again)
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  403 Forbidden
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Title (Access denied), Description, Status code (403), Secondary Button (Go back)
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  404 Not Found
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Title (Page Not Found), Description, Status code (404), Secondary Button (Go
                  back), Primary Button (Go to Homepage)
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  500 Internal Server Error
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Title (Something went wrong), Description, Status code (500), Secondary Button (Go
                  back), Primary Button (Go to Homepage)
                </p>
              </div>
              <div>
                <h4 className="text-label-md text-[var(--color-text-default)] font-medium mb-1">
                  링크 만료
                </h4>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  Title (Link expired), Description (This link is no longer valid...)
                </p>
              </div>
            </VStack>
          </div>

          {/* 4. Behavior */}
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-3">Behavior</h3>
            <ul className="text-body-md text-[var(--color-text-muted)] list-disc pl-5 space-y-1">
              <li>
                <strong className="text-[var(--color-text-default)]">Go back</strong> 버튼: 이전
                페이지를 불러옴, 이전 페이지 없으면 비활성화 (403, 404, 500 공통)
              </li>
              <li>
                <strong className="text-[var(--color-text-default)]">Go to Homepage</strong> 버튼:
                앱의 첫 페이지로 이동 (404, 500에만)
              </li>
              <li>
                <strong className="text-[var(--color-text-default)]">Sign in again</strong> 버튼:
                로그인 페이지로 이동 (401-B)
              </li>
              <li>
                <strong className="text-[var(--color-text-default)]">401-A 리다이렉션</strong>: 즉시
                로그인 페이지로 리다이렉션, 에러 페이지/모달 없음
              </li>
            </ul>
          </div>
        </VStack>
      }
      relatedLinks={[
        { label: 'Error & Alert', path: '/design/foundation/error-alert' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Toast', path: '/design/components/toast' },
      ]}
    />
  );
}
