/* ----------------------------------------
   Link Expired Page
   - 계정 초대, 비밀번호 재설정, MFA 이메일 인증 등
   - 시간이 제한된 일회성 링크가 만료되었거나 이미 사용된 경우
   ---------------------------------------- */

export function LinkExpiredPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        {/* Hourglass */}
        <div className="mb-10 flex justify-center items-center">
          <svg
            width="96"
            height="96"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Top bar */}
            <path d="M5 2h14" stroke="var(--color-text-subtle)" strokeWidth="1" />

            {/* Bottom bar */}
            <path d="M5 22h14" stroke="var(--color-text-subtle)" strokeWidth="1" />

            {/* Top glass shape */}
            <path
              d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"
              stroke="var(--color-text-subtle)"
              strokeWidth="1"
              fill="none"
            />

            {/* Bottom glass shape */}
            <path
              d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"
              stroke="var(--color-text-subtle)"
              strokeWidth="1"
              fill="none"
            />

            {/* Sand pile at bottom - triangle with rounded top corners */}
            <path d="M8.5 21 Q9 19.5 12 17 Q15 19.5 15.5 21 Z" fill="var(--color-text-disabled)" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-heading-h3 text-[var(--color-text-default)] mb-3">Link expired</h1>

        {/* Description */}
        <p className="text-body-md text-[var(--color-text-subtle)] leading-relaxed">
          This link is no longer valid because it has expired or has already been used. Please
          contact your administrator to request a new link.
        </p>
      </div>
    </div>
  );
}

export default LinkExpiredPage;
