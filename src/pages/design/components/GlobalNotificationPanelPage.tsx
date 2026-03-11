import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const GLOBAL_NOTIFICATION_PANEL_GUIDELINES = `## Overview
전역 알림 패널은 모든 앱의 '안읽은(Unread)' 기록형 알림을 한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰이다.
알림의 저장소가 아니라 unread 상태의 알림을 모아 보여주는 보조 인터페이스이다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Panel Icon | 패널 열기/닫기 |
| Panel | 알림 목록 컨테이너 |
| App Header | 앱별 그룹 헤더 |
| Show more / Show less | 알림 목록 확장 |
| Mark all as read | 전체 읽음 처리 |
| Notification Item | 개별 알림 카드 |
| Unread Badge | 안읽은 알림 수 표시 |

### Panel Icon
- 전역 패널 열기/닫기 트리거
- Unread badge와 함께 표시

### Panel
- 모든 앱의 안읽은 알림을 앱별 그룹으로 표시
- 데스크탑 레벨 고정 위치

### App Header
- 알림이 존재하는 앱만 노출
- 앱 아이콘, 앱 이름, Show more/less 버튼, Mark all as read 버튼

### Show more / Show less
- 알림이 1개 이상일 때 표시
- Show more 클릭 시 해당 앱 알림 전체 표시
- Show less 클릭 시 최신 알림 1개만 노출

### Mark all as read
- 해당 앱의 모든 알림 읽음 처리
- 클릭 시 패널에서 즉시 제거

### Notification Item
- 알림센터의 개별 알림과 동일한 구조

| 구성요소 | 설명 |
| --- | --- |
| Type icon | 알림 유형 (success/error/warning/info) |
| Message | 알림 메시지 |
| Timestamp | 발생 시각 |
| Partition info | 프로젝트/네임스페이스 등 |
| Read button | 읽음 처리 |
| View details | 상세 메시지 확장 |

---

## Behavior

### 1) Snackbar suppression rule

| 조건 | 스낵바 동작 |
| --- | --- |
| 알림센터 열림 | 노출 안 됨 |
| 글로벌 패널 열림 | 노출 안 됨 |

### 2) 알림 센터 실시간 동기화

| 이벤트 | 패널 동작 |
| --- | --- |
| 새 알림 발생 | 패널 상단 추가 |
| 알림 읽음 처리 | 패널에서 제거 |
| 알림 만료 | 패널에서 제거 |

### 3) 인터랙션 규칙
- 카드 본문 클릭 → 리소스 화면 이동 + 읽음 처리 + 패널 닫힘
- 개별 읽음 버튼 → 해당 알림 읽음 + 패널에서 제거
- 전체 읽음 버튼 → 현재 표시 알림 읽음 + 패널에서 제거
- View details 버튼 → 상세 메시지 확장, 읽음 처리 안됨

### 4) Real-time Behavior
- 패널이 열린 상태에서 새 알림은 상단에 실시간 추가
- Snackbar는 표시되지 않는다

### 5) 표시 규칙
- 안읽은 알림이 하나 이상 존재할 때만 표시
- 읽음 처리 또는 보관 기간(30일) 만료 시 제거

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Snackbar | Component | 기록형 알림 |
| Toast | Component | 단발성 피드백 |
| Notification Center | Component | 알림 원본 저장소 |
| Error & Alert | Foundation | 알림 유형 정의 |
| Desktop UI | Pattern | 전역 패널 위치 |
`;

export function GlobalNotificationPanelPage() {
  return (
    <ComponentPageTemplate
      title="Global notification panel"
      description="전역 알림 패널은 모든 앱의 '안읽은(Unread)' 기록형 알림을 한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰. 알림의 저장소가 아니라 unread 상태의 알림을 모아 보여주는 보조 인터페이스."
      whenToUse={[
        '여러 앱에서 발생한 안읽은 알림을 한곳에서 확인해야 하는 경우',
        '사용자가 현재 어떤 앱을 보고 있는지와 관계없이 새로운 알림을 빠르게 확인해야 하는 경우',
        'Snackbar를 놓친 경우',
      ]}
      whenNotToUse={[
        '단순 UI 피드백 (→ Toast)',
        '지속 경고 메시지 (→ Inline)',
        '사용자 확인이 필요한 작업 (→ Modal)',
        '특정 앱의 알림 기록을 상세히 확인 (→ Notification Center)',
      ]}
      guidelines={
        <>
          <NotionRenderer markdown={GLOBAL_NOTIFICATION_PANEL_GUIDELINES} />
          <DosDonts
            doItems={[
              '안읽은 알림을 빠르게 확인할 수 있도록 사용한다',
              '알림을 앱별로 그룹화한다',
              '최신 알림을 상단에 표시한다',
            ]}
            dontItems={[
              '전역 패널을 알림 저장소로 사용하지 않는다',
              'Toast를 전역 패널에 표시하지 않는다',
              '읽은 알림을 표시하지 않는다',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
        { label: 'Desktop UI', path: '/design/patterns/desktop-grid' },
      ]}
    />
  );
}
