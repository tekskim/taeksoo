import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';

const SYSTEM_ERROR_GUIDELINES = `## Overview
인증, 권한, 라우팅, 서버 오류 등으로 인해 애플리케이션이 요청한 콘텐츠를 정상적으로 렌더링할 수 없을 때 표시되는 시스템 상태 메시지. 일반적으로 전체 페이지 단위로 표시된다.

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
| 401-B Session Timeout | 세션·토큰 만료 또는 장시간 비활성 | 세션 만료 모달 팝업 표시 | 모달 |
| 403 Forbidden | 인증은 되었으나 리소스에 대한 권한이 없는 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 404 Not Found | 요청한 페이지·리소스가 존재하지 않거나 이동·삭제된 경우 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 500 Internal Server Error | 유효한 요청 처리 중 서버 내부 오류 발생 | 에러 페이지 표시 | 앱 윈도우 내부 |
| 링크 만료 | 일회성 링크가 만료되었거나 이미 사용된 경우 | 에러 페이지 표시 | 브라우저 전체 화면 |

---

## Composition

### 401-A Unauthorized
| 요소 | 내용 |
| --- | --- |
| 처리 방식 | 로그인 페이지로 리다이렉션 (별도 UI 없음) |

### 401-B Session Timeout
| 요소 | 내용 |
| --- | --- |
| Title | (세션 만료 안내 문구) |
| Description | (세션 만료 설명 문구) |
| Primary Button | Sign in again |

### 403 Forbidden
| 요소 | 내용 |
| --- | --- |
| Title | Access denied |
| Description | You don't have permission to access this resource. Contact the administrator to request access. |
| Status code | 403 |
| Secondary Button | Go back |

### 404 Not Found
| 요소 | 내용 |
| --- | --- |
| Title | Page Not Found |
| Description | The requested page does not exist or no longer available. |
| Status code | 404 |
| Secondary Button | Go back |
| Primary Button | Go to Homepage |

### 500 Internal Server Error
| 요소 | 내용 |
| --- | --- |
| Title | Something went wrong |
| Description | An error occurred while processing your request. |
| Status code | 500 |
| Secondary Button | Go back |
| Primary Button | Go to Homepage |

### 링크 만료
| 요소 | 내용 |
| --- | --- |
| Title | Link expired |
| Description | This link is no longer valid because it has expired or has already been used. Please contact your administrator to request a new link. |

---

## Behavior
- Go back 버튼: 이전 페이지를 불러온다. 이전 페이지가 없을 경우 비활성화. (403, 404, 500 공통)
- Go to Homepage 버튼: 앱의 첫 페이지(Home)로 이동. (404, 500에만 제공)
- Sign in again 버튼: 로그인 페이지로 이동. (401-B)
- 401-A: 미인증 상태에서 인증 필수 페이지 접근 시 즉시 로그인 페이지로 리다이렉션.

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
      description="인증, 권한, 라우팅, 서버 오류 등으로 인해 애플리케이션이 요청한 콘텐츠를 정상적으로 렌더링할 수 없을 때 표시되는 시스템 상태 메시지. 일반적으로 전체 페이지 단위로 표시된다."
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
