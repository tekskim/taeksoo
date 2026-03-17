import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { InlineMessage, VStack } from '@/design-system';

const INLINE_MESSAGE_GUIDELINES = `## Overview
사용자에게 지속적인 주의가 필요한 상태/공지를 전달하기 위한 고정형 메시지 컴포넌트이다. "서비스 점검, 용량 부족"처럼 즉시 사라지면 안 되는 정보를 화면 상단 또는 특정 섹션 상단에 고정하여 노출한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Container | 고정 노출되는 메시지 영역 |
| Status indicator | info/success/warning/error를 표현하는 시각 요소 |
| Content | 메시지 본문 텍스트(Title 없음) |
| Timestamp (optional) | 메시지 발생 시각 표기 |
| Expand/Collapse Control | 접기/펼치기 토글 컨트롤 |

---

## Variants

| Severity | 의미 | 예시 |
| --- | --- | --- |
| info | 참고/안내(작업 가능) | "New policy will apply from…" |
| success | 완료/정상(지속 노출 필요 시에만) | "All systems operational" |
| warning | 주의/제한(조치 권장) | "Storage is almost full" |
| error | 문제/장애(영향 큼) | "Service outage detected" |

- success는 "지속 노출이 필요한 성공 상태"에만 사용. 단발 성공 피드백에는 사용하지 않는다(→ Toast).
- error는 사용자의 작업 가능 여부에 영향을 주는 상황에서 사용.

---

## Behavior

### 1) 위치 정책
- 관련 콘텐츠 바로 위 또는 아래에 배치한다.

### 2) 지속성 정책
- 자동으로 사라지지 않는다.
- 상태가 해소되거나 지정된 조건이 만족하면 자동 제거된다.

### 3) 접기/펼치기
- 기본 상태는 Collapsed(접힘)이다.
- Collapsed 상태에서도 Severity, 메시지 앞부분 1줄, Timestamp는 항상 노출한다.
- 사용자가 펼친 상태는 현재 세션 동안 유지, 새로고침/재진입 시 초기화.

### 4) Timestamp 표기 규칙
- InlineMessage는 영속적 메시지이므로 타임존 포함 상세 형식을 사용한다. (cf. Snackbar는 휘발성 알림용 간결 형식)
- 운영 이벤트/장애/점검처럼 "언제부터"가 중요한 메시지에만 사용.
- KO: YYYY-MM-DD HH:mm:ss (UTC+N)
- EN: Mth DD, YYYY HH:mm:ss (UTC+N)

### 5) 여러 메시지 표기 규칙
- 같은 위치에 여러 InlineMessage가 필요한 경우 VStack으로 8px 간격으로 스태킹.
- Severity 우선: error > warning > info > success
- 동일 severity 내 최신 우선.

---

## Content Guidelines

- Title 없이 "한 문단 구조"로 작성한다.
- Info: "[상태/문제] + [원인 또는 영향] + [필요 시 조치 또는 추가 정보]"
- Error: 가능한 문제의 원인을 포함한다.
- Timestamp: KO \`YYYY-MM-DD HH:mm:ss (UTC+N)\` / EN \`Mth DD, YYYY HH:mm:ss (UTC+N)\`

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Snackbar | Component | 상태 발생 시점 알림과 역할 분리 |
| Toast | Component | 단발 피드백과 구분 |
| Validation | Component | 입력 오류 메시지와 구분 |
| Notification Center | Component | 기록형 이벤트와 역할 분리 |
| UX Writing Guide | Foundation | 문장 톤/날짜 표기 규칙 |
| Error&Alert Overview | Foundation | 메시지 유형 및 컴포넌트 종합 정책 |
`;

export function InlineMessagePage() {
  return (
    <ComponentPageTemplate
      title="Inline message"
      description="사용자에게 지속적인 주의가 필요한 상태/공지를 전달하기 위한 고정형 메시지 컴포넌트. '서비스 점검, 용량 부족'처럼 즉시 사라지면 안 되는 정보를 화면 상단 또는 특정 섹션 상단에 고정하여 노출한다."
      whenToUse={[
        '서비스 점검/장애/성능 저하 등 운영 상태 공지',
        '용량/쿼터 부족, 비용 한도 임박 등 지속적 주의가 필요한 상태',
        '특정 섹션 컨텍스트에서만 의미가 있는 지속 경고(해당 섹션 상단 고정)',
      ]}
      whenNotToUse={[
        '단발성 액션 피드백(→ Toast)',
        '비동기 작업 결과/이벤트(→ Snackbar + Notification Center 기록 정책)',
        '입력 오류/필드 가이드(→ Validation)',
        '사용자의 즉각적인 결정이 필요한 경고(→ Modal)',
      ]}
      preview={
        <ComponentPreview
          code={`<InlineMessage variant="success">Operation completed successfully.</InlineMessage>
<InlineMessage variant="warning">Please review before proceeding.</InlineMessage>`}
        >
          <VStack gap={3}>
            <InlineMessage variant="success">Operation completed successfully.</InlineMessage>
            <InlineMessage variant="warning">Please review before proceeding.</InlineMessage>
          </VStack>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Variants</Label>
            <VStack gap={3}>
              <InlineMessage variant="success">
                Used for completed or normal operations.
              </InlineMessage>
              <InlineMessage variant="warning">
                Used when attention is needed but not critical.
              </InlineMessage>
              <InlineMessage variant="error">
                Used for failed actions or system issues.
              </InlineMessage>
              <InlineMessage variant="info">
                Used for general or non-critical updates.
              </InlineMessage>
            </VStack>
          </VStack>
          <VStack gap={3}>
            <Label>Long content</Label>
            <InlineMessage variant="warning">
              This is a longer message that demonstrates how the component handles multi-line
              content. The text will wrap naturally and the icon stays aligned to the top. When the
              message exceeds the available width, it breaks into a second row while maintaining
              consistent padding and icon alignment across all lines.
            </InlineMessage>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={INLINE_MESSAGE_GUIDELINES} />
          <DosDonts
            doItems={[
              '상태 또는 지정된 조건이 해소되면 즉시 제거되도록 한다.',
              'Section 메시지는 해당 섹션 컨텍스트를 벗어나면 노출하지 않는다.',
              'severity는 의미에 맞게만 사용하고 남발하지 않는다.',
            ]}
            dontItems={[
              '단발 피드백(성공/실패)을 Inline Message로 처리하지 않는다.',
              '동일 이슈를 여러 위치에 중복 고정하지 않는다.',
              'timestamp를 모든 메시지에 강제하여 노이즈를 만들지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          padding: 12px · gap: 8px · radius: 6px · icon: 16px · font: 12px
        </div>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
      ]}
    />
  );
}
