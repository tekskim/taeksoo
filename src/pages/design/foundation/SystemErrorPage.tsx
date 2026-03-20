import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Button, HStack, VStack } from '@/design-system';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';

const SYSTEM_ERROR_GUIDELINES = `## Overview
인증, 권한, 라우팅, 서버 오류 등으로 인해 애플리케이션이 요청한 콘텐츠를 정상적으로 렌더링할 수 없을 때 표시되는 시스템 상태를 알리는 메세지입니다. 일반적으로 **전체 페이지 단위로 표시됩니다.**

### 공통 원칙 (Tone & UX Writing)
- 전문적이고 중립적인 문체 사용
- 감정·사과·공감 표현 사용 금지
- 추측성 원인 설명 금지
- 사용자가 취할 수 있는 다음 행동을 명확히 제시

---

## Variants

| Variant | 상황 | 처리 방식 | 표시 위치 |
| --- | --- | --- | --- |
| 401-A Unauthorized | 미인증 상태에서 인증 필수 페이지에 최초 접근 | 로그인 페이지로 리다이렉션 | — |
| 401-B Session Timeout | 세션·토큰 만료 또는 장시간 비활성으로 인증 정보가 유효하지 않은 경우 | 로그아웃 처리 후 로그인 페이지로 리다이렉션 | — |
| 403 Forbidden | 인증은 되었으나 리소스에 대한 권한이 없는 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 404 Not Found | 요청한 페이지·리소스가 존재하지 않거나 이동·삭제된 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 5xx Server Error | 유효한 요청 처리 중 서버 내부 오류 발생 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 링크 만료 | 일회성 링크(초대·비밀번호 재설정·MFA 인증 등)가 만료되었거나 이미 사용된 경우 | 에러 페이지 표시 | 브라우저 전체 화면 |

---

## Composition (구성 요소)

### 401-A Unauthorized — 최초 로그인 필요
별도 에러 페이지 없이 로그인 페이지로 즉시 리다이렉션한다.

### 401-B Session Timeout — 세션 만료
401-A와 동일하게 별도 에러 페이지 없이 로그아웃 처리 후 로그인 페이지로 즉시 리다이렉션한다.

### 403 Forbidden
| 요소 | 내용 |
| --- | --- |
| 1. Title | Access denied |
| 2. Description | You don't have permission to access this resource. Contact the administrator to request access. |
| 3. Status code | 403 |
| 4. Secondary Button | Go back |

### 404 Not Found
| 요소 | 내용 |
| --- | --- |
| 1. Title | Page Not Found |
| 2. Description | The requested page does not exist or no longer available. |
| 3. Status code | 404 |
| 4. Secondary Button | Go back |
| 5. Primary Button | Go to Homepage |

### 5xx Server Error
| 요소 | 내용 |
| --- | --- |
| 1. Title | Something went wrong |
| 2. Description | An error occurred while processing your request. |
| 3. Status code | 500 및 기타 모든 5xx 에러 코드 |
| 4. Secondary Button | Go back |
| 5. Primary Button | Go to Homepage |

### 링크 만료
| 요소 | 내용 |
| --- | --- |
| Title | Link expired |
| Description | This link is no longer valid because it has expired or has already been used. Please contact your administrator to request a new link. |

---

## Behavior
- **Go back 버튼**
  - 클릭 시 이전 페이지를 불러온다.
  - 이전 페이지가 없을 경우 버튼을 비활성화한다.
  - 403, 404, 500에 공통 적용된다.
- **Go to Homepage 버튼**
  - 클릭 시 앱의 첫 페이지(Home)로 이동한다.
  - 404, 500에만 제공된다.
- **401-A / 401-B 리다이렉션**
  - 미인증 상태(401-A) 또는 세션 만료(401-B) 시 즉시 로그아웃 처리 후 로그인 페이지로 리다이렉션한다.
  - 에러 페이지나 모달을 거치지 않는다.

---

## Related
- Modal
- Toast
- Form (Validation 에러)
`;

interface ErrorConfig {
  statusCode?: string;
  title: string;
  description: string;
  showGoBack: boolean;
  showGoHome: boolean;
}

const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  '403': {
    statusCode: '403',
    title: 'Access Denied',
    description:
      "You don't have permission to access this resource. Contact the administrator to request access.",
    showGoBack: true,
    showGoHome: false,
  },
  '404': {
    statusCode: '404',
    title: 'Page Not Found',
    description: 'The requested page does not exist or is no longer available.',
    showGoBack: true,
    showGoHome: true,
  },
  '500': {
    statusCode: '500',
    title: 'Something Went Wrong',
    description: 'An error occurred while processing your request.',
    showGoBack: true,
    showGoHome: true,
  },
  'link-expired': {
    title: 'Link Expired',
    description:
      'This link is no longer valid because it has expired or has already been used. Please contact your administrator to request a new link.',
    showGoBack: false,
    showGoHome: false,
  },
};

function ErrorPreviewCard({ config }: { config: ErrorConfig }) {
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] py-12 flex items-center justify-center">
      <div className="text-center px-6">
        {config.statusCode && (
          <div className="mb-4">
            <span className="text-[64px] font-black text-[#4B5563] leading-[80px] h-[80px] inline-block">
              {config.statusCode}
            </span>
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-[18px] font-semibold leading-[26px] text-gray-800 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-500 text-[13px] leading-[20px] max-w-md mx-auto">
            {config.description}
          </p>
        </div>
        <HStack gap={2} justify="center">
          {config.showGoBack && (
            <Button variant="secondary" size="sm" leftIcon={<IconArrowLeft size={12} />}>
              Go Back
            </Button>
          )}
          {config.showGoHome && (
            <Button variant="primary" size="sm" leftIcon={<IconHome size={12} />}>
              Go to Homepage
            </Button>
          )}
        </HStack>
      </div>
    </div>
  );
}

function SystemErrorExamples() {
  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">403 Forbidden</h4>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Full-page error when the user lacks permission to access a resource. Only a "Go Back"
          button is provided.
        </p>
        <ErrorPreviewCard config={ERROR_CONFIGS['403']} />
      </VStack>

      <VStack gap={3}>
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">404 Not Found</h4>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Full-page error when the requested page or resource does not exist.
        </p>
        <ErrorPreviewCard config={ERROR_CONFIGS['404']} />
      </VStack>

      <VStack gap={3}>
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">500 Server Error</h4>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Full-page error when an internal server error occurs while processing the request.
        </p>
        <ErrorPreviewCard config={ERROR_CONFIGS['500']} />
      </VStack>

      <VStack gap={3}>
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">Link Expired</h4>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Displayed in a full browser window when a one-time link (invite, password reset, MFA) has
          expired or already been used. No action buttons.
        </p>
        <ErrorPreviewCard config={ERROR_CONFIGS['link-expired']} />
      </VStack>
    </VStack>
  );
}

export function SystemErrorPage() {
  return (
    <ComponentPageTemplate
      title="System Error"
      description="인증, 권한, 라우팅, 서버 오류 등으로 인해 애플리케이션이 요청한 콘텐츠를 정상적으로 렌더링할 수 없을 때 표시되는 시스템 상태를 알리는 메세지입니다. 일반적으로 전체 페이지 단위로 표시됩니다."
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
      examples={<SystemErrorExamples />}
      guidelines={<NotionRenderer markdown={SYSTEM_ERROR_GUIDELINES} />}
      relatedLinks={[
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
      ]}
    />
  );
}
