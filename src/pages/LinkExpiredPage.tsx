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
        <div className="mb-6 flex justify-center items-center">
          <svg
            width="48"
            height="57"
            viewBox="0 0 64 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hourglassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-text-disabled)" />
                <stop offset="100%" stopColor="var(--color-text-subtle)" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M64 4H58L57.998 14C57.998 24.81 51.4005 34.0781 42.0127 38C51.4005 41.9219 57.998 51.19 57.998 62L58 72H64V76H0V72H6L5.99805 62C5.99805 51.1903 12.5951 41.9221 21.9824 38C12.5951 34.0779 5.99805 24.8097 5.99805 14L6 4H0V0H64V4ZM31.998 40C19.8478 40 9.99805 49.8497 9.99805 62L10 72H15L29.4893 55.4404C31.0829 53.6191 33.9171 53.6191 35.5107 55.4404L50 72H54L53.998 62L53.9912 61.4326C53.6903 49.5446 43.9586 40 31.998 40ZM9.99805 14C9.99805 26.1503 19.8478 36 31.998 36C43.9586 36 53.6903 26.4554 53.9912 14.5674L53.998 14L54 4H10L9.99805 14Z"
              fill="url(#hourglassGradient)"
            />
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
