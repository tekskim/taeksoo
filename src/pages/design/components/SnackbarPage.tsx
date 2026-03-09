import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Disclosure } from '@/design-system';

const SNACKBAR_GUIDELINES = `## Overview
Snackbar는 사용자가 수행한 액션의 결과 또는 비동기 작업의 상태를 즉시 인지할 수 있도록 제공하는 기록형 알림 컴포넌트이다.
Snackbar는 화면 상단 또는 우측 상단의 고정 영역에 노출되며, 사용자의 현재 작업 흐름을 크게 방해하지 않으면서도 중요한 결과를 전달한다.
Snackbar는 단순한 일시적 피드백이 아니라, 알림센터에 기록되는 Notification 계열 컴포넌트이다.

---

## Composition

\`\`\`
+----------------------------------------------------------------------------------+
| [Type Icon] Message Content                          [Partition Info] [Timestamp] |
|             (Optional partition info)                     [App Icon] [View ▼] [X] |
|             <--------------- Click Area -------------->                         |
+----------------------------------------------------------------------------------+
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Type Icon | 알림 유형에 맞는 아이콘 |
| Message Content | 리소스와 액션 결과를 설명하는 본문 |
| Partition Info (optional) | 테넌트, 클러스터 등 상위 분류 정보 |
| Timestamp | 메시지 발생 시각 |
| App Icon (optional) | 알림이 발생한 앱 아이콘 |
| View Details Button (optional) | 실패 알림의 상세 정보 확장/축소 |
| Close Button | 스낵바 UI 닫기 |
| Click Area | 리소스 상세/리스트 화면 이동 영역 |

### Type Icon
- 요청/성공/실패 유형에 따라 아이콘을 다르게 사용한다.

### Message Content
- 어떤 리소스에 대해 어떤 액션이 어떤 결과가 되었는지를 단일 문장으로 전달한다.

### Partition Info
- 앱 내에서 상위 분류 개념이 존재하는 경우에만 표시 (예: tenant, cluster, namespace)

### Timestamp
- 당일: \`hh:mm:ss\`
- 과거: EN: \`MMM DD\` / KO: \`MM월 DD일\`

### App Icon
- 데스크탑 UI에서 노출될 때만 표시. 앱 내부에서는 표시하지 않는다.

### View Details Button
- Failure 유형에서만 제공. 클릭 시 상세 정보 영역 확장/축소. 확장 상태에서는 Pinned.

### Close Button
- Snackbar UI만 닫음. 읽음 처리와 별개, 알림센터/전역 패널에는 안읽음 유지.

### Click Area
- 닫기/상세보기 버튼 제외한 나머지 영역. 클릭 시 리소스 상세/리스트 화면으로 이동.

---

## Variants

| 유형 | 설명 |
| --- | --- |
| App Snackbar | 앱이 활성 상태일 때 앱 내부에서 노출 |
| Desktop Snackbar | 앱이 비활성 상태일 때 데스크탑 UI에서 노출 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Visible | 화면에 노출 중 |
| Hovered | 포인터가 올라간 상태 |
| Pinned | 상세 정보 확장 또는 유지형 상태로 고정 |
| Queued | 표시 대기 상태 |
| Closed | UI에서 닫힌 상태 |

---

## Behavior

### 1) 노출 위치 규칙
- 앱이 활성 상태일 때: 해당 앱 UI의 우측 상단에 표시. 알림센터 열려 있으면 Snackbar 노출되지 않음.
- 앱이 비활성 상태일 때: 데스크탑 UI 우측 상단에 표시. 전역 패널 열려 있으면 노출되지 않음.

### 2) 동시 노출 규칙
| 유형 | 동시 노출 규칙 |
| --- | --- |
| Auto-dismiss Snackbar | 1개 |
| Persistent Snackbar | 최대 3개 |

- 최신 알림이 위에 표시. 최대 개수 초과 시 대기열에 저장.

### 3) 표시 시간 규칙
- Auto-dismiss: 1~3초. Hover 시 일시정지, 해제 시 남은 시간 재개.

### 4) Persistent Snackbar
- 자동 종료되지 않음. 본문 클릭, Close 버튼, 후속 액션 버튼, 상세보기 확인 후 닫기로 종료.

### 5) 사용자 액션별 동작

| 행동 | 이동 | Snackbar 종료 | 읽음 처리 |
| --- | --- | --- | --- |
| 본문 클릭 | 리소스 화면 | 종료 | ✔ |
| Close | 없음 | 종료 | ✖ |
| 자동 종료 | 없음 | 종료 | ✖ |
| View details | 상세 확장 | 유지 | ✖ |

### 6) 기록 및 읽음 처리 규칙
- Snackbar는 항상 알림센터에 기록된다.
- 본문 클릭으로 대상 화면 이동한 경우만 읽음 처리.
- 닫기, 자동 만료, View details는 읽음 처리로 간주하지 않는다.

### 7) 상세 정보(View details)
- 실패 유형에서 오류코드 등 상세 메세지가 있을 때만 제공.
- 상세 열려 있는 동안 Snackbar 고정.

---

## Usage Guidelines

### Do ✅
- 기록이 필요한 결과성 알림에 사용한다.
- 실패 또는 후속 조치가 필요한 알림은 유지형으로 제공한다.
- 사용자가 액션을 취해야 하는 알림은 자동 종료하지 않는다.

### Don't ❌
- 모든 Snackbar에 동일한 자동 종료 규칙을 적용하지 않는다.
- 사용자가 아직 내용을 확인하지 못한 유지형 알림을 강제로 교체하지 않는다.

---

## Content Guidelines

### 1) 메시지 구조
- "리소스 + 액션 + 결과" 중심의 단일 문장으로 작성한다.
- 예: 인스턴스 "{instance name}" 생성에 실패했습니다.

### 2) Timestamp
- 상대 시간이 아니라 발생 시각을 사용한다. 로케일 정책을 따른다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Toast | Component | 기록되지 않는 단발성 피드백과 구분 |
| Inline Message | Component | 지속 경고와 구분 |
| Modal | Component | 사용자 결정이 필요한 경우 대체 |
| App Notification Center | Component | 실제 기록 저장 및 상세 확인 |
| Global Notification Panel | Pattern | 안읽은 알림 집합 표시 |
| UX Writing Guide | Foundation | 알림 문구 작성 규칙 |
| Error & Alert | Foundation | 알림 계층 및 메시지 유형 정책 |
`;

const SNACKBAR_PREV_VERSION = `## 개요

| 항목 | 내용 |
| --- | --- |
| 목적 | 액션 결과 또는 비동기 작업 상태의 기록형 알림 |
| 위치 | 앱/데스크탑 우측 상단 |
| 기록 | 알림센터에 항상 기록 |

## 구성요소
1. Type Icon — 알림 유형별 아이콘
2. Message Content — 리소스 + 액션 + 결과
3. Partition Info — 테넌트, 클러스터 등 (선택)
4. Timestamp — 발생 시각 (당일/과거 포맷)
5. App Icon — 데스크탑 UI 전용 (선택)
6. View Details — 실패 시 상세 확장 (선택)
7. Close Button — UI 닫기
8. Click Area — 리소스 화면 이동

## 가이드라인
1. 기록이 필요한 결과성 알림에 사용
2. 실패/후속 조치 필요 시 유지형으로 제공
3. 본문 클릭 시에만 읽음 처리
`;

export function SnackbarPage() {
  return (
    <ComponentPageTemplate
      title="Snackbar"
      description="사용자가 수행한 액션의 결과 또는 비동기 작업의 상태를 즉시 인지할 수 있도록 제공하는 기록형 알림 컴포넌트. 알림센터에 기록되는 Notification 계열 컴포넌트."
      whenToUse={[
        '결과를 알림센터에 기록으로 남겨야 하는 경우',
        '실패 원인에 대한 추가 정보 또는 후속 액션이 필요한 경우',
      ]}
      whenNotToUse={[
        '단발성이고 기록이 필요 없는 가벼운 피드백 (→ Toast)',
        '입력값 오류 또는 필드 단위 검증 (→ Validation)',
        '사용자의 결정이 반드시 필요한 경우 (→ Modal)',
      ]}
      guidelines={
        <>
          <NotionRenderer markdown={SNACKBAR_GUIDELINES} />
          <Disclosure className="mt-6">
            <Disclosure.Trigger>이전 버전</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <NotionRenderer markdown={SNACKBAR_PREV_VERSION} />
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </>
      }
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
        {
          label: 'Global Notification Panel',
          path: '/design/components/global-notification-panel',
        },
        { label: 'UX Writing Guide', path: '/design/foundation/ux-writing' },
        { label: 'Error & Alert', path: '/design/foundation/error-alert' },
      ]}
    />
  );
}
