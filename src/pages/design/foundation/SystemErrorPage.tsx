import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';

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
| 401-B Session Timeout | 세션·토큰 만료 또는 장시간 비활성으로 인증 정보가 유효하지 않은 경우 | 세션 만료 모달 팝업 표시 | 모달 |
| 403 Forbidden | 인증은 되었으나 리소스에 대한 권한이 없는 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 404 Not Found | 요청한 페이지·리소스가 존재하지 않거나 이동·삭제된 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 5xx Server Error | 유효한 요청 처리 중 서버 내부 오류 발생 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 링크 만료 | 일회성 링크(초대·비밀번호 재설정·MFA 인증 등)가 만료되었거나 이미 사용된 경우 | 에러 페이지 표시 | 브라우저 전체 화면 |

---

## Composition (구성 요소)

### 401-A Unauthorized — 최초 로그인 필요
별도 에러 페이지 없이 로그인 페이지로 즉시 리다이렉션한다.

### 401-B Session Timeout — 세션 만료
| 요소 | 내용 |
| --- | --- |
| Title | (세션 만료 안내 문구) |
| Description | (세션 만료 설명 문구) |
| Primary Button | Sign in again |

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
- **Sign in again 버튼** (401-B)
  - 클릭 시 로그인 페이지로 이동한다.
- **401-A 리다이렉션**
  - 미인증 상태에서 인증 필수 페이지 접근 시 즉시 로그인 페이지로 리다이렉션한다.
  - 에러 페이지나 모달을 거치지 않는다.

---

## Related
- Modal
- Toast
- Form (Validation 에러)
`;

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
      guidelines={<NotionRenderer markdown={SYSTEM_ERROR_GUIDELINES} />}
      relatedLinks={[
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
      ]}
    />
  );
}
