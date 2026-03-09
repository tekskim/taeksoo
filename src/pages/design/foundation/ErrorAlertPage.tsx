import { ComponentPageTemplate, Disclosure } from '@/design-system';
import { NotionRenderer } from '../_shared/NotionRenderer';

const ERROR_ALERT_GUIDELINES = `## Overview
사용자의 행동 결과, 시스템 상태 변화, 또는 오류 상황을 사용자에게 전달하기 위한 **제품 전반의 알림 체계와 메시지 분류 기준을 정의하는 Foundation 문서**이다.

이 문서는 다음 내용을 정의한다:
- 제품 내 알림 계층 구조
- 메시지 유형 분류 기준
- 메시지 전달에 사용되는 UI 컴포넌트

---

## Principles

### 1) 알림은 사용자 행동에 필요한 정보만 전달한다
- 불필요한 알림 노출을 지양한다.
- 동일한 이벤트에 대해 중복 알림을 발생시키지 않는다.

### 2) 알림은 중요도에 따라 계층적으로 전달한다

| 중요도 | 특징 | 컴포넌트 |
| --- | --- | --- |
| 낮음(Low) | 단순 피드백, 짧은 시간 표시 | Validation, 토스트 |
| 중간(Medium) | 추가 행동 필요, 주의 환기 | 스낵바, 인라인 메세지 |
| 높음(High) | 작업 진행 불가, 즉각 조치 필요 | 모달, 에러 화면, 알림 센터 |

### 3) 알림은 맥락이 가장 가까운 위치에서 전달한다
- 입력 오류 → 입력 필드 validation
- 액션 결과 → 토스트
- 중요 이벤트 → 스낵바
- 지속적인 상태 경고 → 인라인 메세지

### 4) 중요한 이벤트는 기록 가능한 채널을 사용한다
- 모든 기록형 알림은 App Notification Center에 저장된다.
- Global Notification Panel은 저장된 알림을 표시하는 UI 레이어이다.

---

## Usage Guidelines

### 1) 알림 계층 구조
1. **앱 내부 알림**: 앱이 활성화 상태일 때 노출. 컴포넌트: Validation, 인라인 메세지, 토스트, 스낵바, 알림 센터
2. **데스크탑UI 알림**: 앱이 비활성 상태일 때 데스크탑 UI에서 표시. 컴포넌트: 글로벌 알림 패널, 스낵바, 앱 아이콘 배지
3. **실제 PC 알림** (향후 지원): 브라우저 또는 OS 알림 시스템

### 2) 메세지 유형
1. 필드 검증 → Validation
2. 일시적 피드백 → 토스트
3. 시간차/지연 응답 → 토스트 또는 스낵바
4. 상태 전이 → 스낵바, 인라인 메세지
5. 권한 피드백 → 토스트/스낵바, 결정 필요시 모달
6. 시스템/연결 오류 → 에러 화면
7. 위험 경고 → 인라인 메세지, 알림 센터, 이메일

### 3) 컴포넌트 유형
1. **Validation**: 입력값 오류, 즉각 검증. 기록 없음.
2. **Toast**: 가벼운 피드백, 3~5초 후 휘발. 기록 없음.
3. **Snackbar**: 이벤트 알림, 자동 소멸 또는 사용자 처리. Notification Center에 기록.
4. **Inline Message**: 지속적인 주의, 조건 해소까지 유지. Notification Center에 기록 가능.
5. **Modal**: 사용자의 결정 요구, 버튼 누를 때까지 유지. 기록 없음.
6. **Confirm Modal**: 삭제/확인 등 사용자 결정 필요 시, 버튼 선택 시 종료. 기록 없음.
7. **에러 화면**: 화면 접근 차단, 시스템 문제 해결까지 유지. 기록 없음.
8. **알림 센터**: 기록형 알림의 저장소. 사용자 필요에 따라 열림/닫힘.
9. **글로벌 알림 패널**: 안읽은 알림 통합 표시. macOS Notification Panel 유사.

### 4) 알림 기록 정책
- 기록되는 유형: 비동기 작업 결과, 시스템 상태 변화, 권한/정책 이벤트, 조치 필요 이벤트
- 기록되지 않는 유형: 설정 저장 완료, 이름 변경 완료, 입력 오류 메시지 등

**흐름**

\`\`\`
[이벤트 발생] → 기록 대상 여부 판단
  ├─ Yes → [Notification Center 저장] → [글로벌 패널·알림 센터 표시]
  └─ No  → [일시 표시 (토스트 등)] → [휘발]
\`\`\`

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Toast | Component | 단발성 사용자 액션 피드백 전달 |
| Snackbar | Component | 기록형 이벤트 알림 전달 |
| Inline message | Component | 지속적인 시스템 상태 안내 |
| Modal | Component | 경고/에러 문구 톤·구조 |
| Notification center | Component | 알림 이벤트 기록 저장소 |
| Global notification panel | Component | 데스크탑 레벨 메세지 표시 패널 |
| Input field | Component | validation 정책 구체화 |
| System error | Foundation | 시스템 오류 상황의 UI 처리 화면 |
`;

const ERROR_ALERT_PREV_CONTENT = `## 목적
사용자의 행동 결과, 시스템 상태 변화, 오류 상황을 일관된 방식으로 전달하기 위하여 제품 전반의 알림 체계를 정의한다.

## 범위
- 앱 내부 알림 (Validation, Toast, Snackbar, Inline Message, Modal, 알림 센터)
- 데스크탑 UI 전역 알림 (글로벌 알림 패널, 앱 아이콘 배지)
- 시스템 상태 메시지 (에러 화면, System Error)

## 컴포넌트
| 컴포넌트 | 용도 |
| --- | --- |
| Validation | 입력 필드 오류 검증 |
| Toast | 단발성 피드백 |
| Snackbar | 이벤트 알림 (기록형) |
| Inline Message | 지속적 상태 안내 |
| Modal | 사용자 결정 필요 |
| 에러 화면 | 시스템 오류 차단 |
| 알림 센터 | 기록형 알림 저장소 |
| 글로벌 알림 패널 | 데스크탑 레벨 표시 |

## 핵심 개념 정의

### Validation Error
사용자 입력값이 유효하지 않을 때 발생. 입력 필드에 즉시 표시되며, Form 에러 메시지로 처리. 기록하지 않음.

### Operation Failure
비동기 작업(API 호출, 배포 등)이 실패했을 때 발생. Toast 또는 Snackbar로 알림. 기록 대상일 경우 Notification Center에 저장.

## UX Writing
- 전문적이고 중립적인 문체 사용
- 감정·사과·공감 표현 사용 금지
- 사용자가 취할 수 있는 다음 행동을 명확히 제시
`;

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
      guidelines={
        <>
          <NotionRenderer markdown={ERROR_ALERT_GUIDELINES} />
          <Disclosure className="mt-6">
            <Disclosure.Trigger>이전 내용</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <NotionRenderer markdown={ERROR_ALERT_PREV_CONTENT} />
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </>
      }
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
        { label: 'System Error', path: '/design/foundation/system-error' },
      ]}
    />
  );
}
