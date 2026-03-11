import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, StatusIndicator, Tooltip, VStack } from '@/design-system';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const STATUS_GUIDELINES = `## Overview
리소스나 시스템의 현재 상태를 시각적으로 전달하는 컴포넌트다. 기본적으로 서버에서 응답받은 실제 상태값을 White Badge 형태로 표시한다.

---

## Variants

### 1. Default
서버 응답값을 그대로 표시하는 기본 형식이다. 특수 상태로 정의되지 않은 모든 상태값은 Default로 표시된다.

| 속성 | 값 |
| --- | --- |
| 배경색 | White |
| 텍스트 색상 | 기본 검은색 |
| 아이콘 | 없음 |
| 표시 형식 | Label Only |
| 테이블 내 최대 너비 | 80px (truncate + Tooltip) |

### 2. Defined
사전에 정의된 특수 상태에 한해 아이콘·컬러·레이블 텍스트를 코딩하여 표시한다.

| 타입 | 색상 | 사용 상황 예시 |
| --- | --- | --- |
| Active | Green | active |
| Error | Red | error |
| Processing | Blue | building, deleting, pending |
| Warning | Orange | degraded, down, maintenance |
| Muted | Gray | suspended, paused, draft, in-use |

### 표시 형식 (Display Type)

| 형식 | 구성 | 사용 상황 |
| --- | --- | --- |
| Icon + Label | 아이콘 + 텍스트 레이블 | Defined 상태의 기본 형식 |
| Icon Only | 아이콘만 표시 | 테이블 Status 컬럼 등 공간이 제한적인 경우 |
| Label Only | 텍스트 레이블만 표시 | Container 앱의 Default 상태 기본 형식. 테이블 내 최대 너비 80px, 초과 시 truncate + Tooltip |

---

## Composition (구성 요소)

\`\`\`
+------------------------------------------+
| [Icon?] Label                             |
+------------------------------------------+
\`\`\`

| 요소 | 설명 | 필수 여부 |
| --- | --- | --- |
| Icon | 상태 타입을 시각적으로 나타내는 아이콘 | Defined만 해당 |
| Label | 상태명을 텍스트로 표시 | 필수 (Icon Only 제외) |
| Container | Icon과 Label을 감싸는 Pill 형태의 래퍼 | 필수 |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| Padding | 6×4px |
| Gap | 4px |
| Border Radius | pill (16px) |
| Font Size | 11px |
| Icon Size | 14px |

### 시맨틱 컬러 토큰 (Defined 상태 전용)

| 타입 | Background Token |
| --- | --- |
| Active | --status-success-bg |
| Error | --status-danger-bg |
| Processing | --status-info-bg |
| Warning | --status-warning-bg |
| Muted | --status-muted-bg |

---

## Behavior

### 1) 상태 업데이트
- 상태는 서버의 실제 리소스 상태를 반영하며, 폴링 또는 실시간 이벤트를 통해 자동 업데이트된다.
- 상태 전환 시 별도의 애니메이션 없이 즉시 교체된다.

### 2) Defined 상태 렌더링 규칙
- Action 타입(building, deleting, pending 등)의 아이콘은 스피너 형태로 회전하여 진행 중임을 시각적으로 표현한다.
- 레이블 텍스트는 줄바꿈 없이 한 줄로 유지한다.

### 3) Layout 형식

| Layout | 설명 | 사용 시점 |
| --- | --- | --- |
| default | Icon + Label (pill) | 일반적인 상태 표시. 테이블, DetailHeader 등 |
| icon-only | 아이콘만 표시 | 테이블 컬럼 너비가 좁은 경우 |
| badge | Icon + Label (square, radius-sm) | 카드나 태그 스타일로 상태를 표시할 때 |

### 4) 반응형 대응
- 테이블 Status 컬럼 등 공간이 제한적인 경우 Display Type을 Icon Only로 전환할 수 있다.
- Icon Only 사용 시 설계 시점에서 명시적으로 선택한다.

### 5) 접근성
- Icon Only 형식 사용 시 \`aria-label\` 또는 \`title\` 속성으로 상태명을 제공해야 한다.
- 색상만으로 상태를 전달하지 않고 아이콘과 레이블을 함께 사용한다.

---

## Content Guidelines

### 레이블 작성 원칙

| 구분 | 원칙 |
| --- | --- |
| Default | 서버 응답 상태값을 가공 없이 그대로 표시한다. |
| Defined | 별도 기획 문서에서 정의한 레이블 텍스트를 사용한다. |

### 전체 Defined 상태 매핑

| 시맨틱 타입 | status 값 | 기본 레이블 | 설명 |
| --- | --- | --- | --- |
| Active (Green) | active | Active | 정상 동작 중 |
| Error (Red) | error | Error | 오류 발생 |
| Processing (Blue) | building | Building... | 생성 중 (스피너) |
| Processing (Blue) | deleting | Deleting... | 삭제 중 |
| Processing (Blue) | pending | Pending | 대기 중 |
| Warning (Orange) | verify-resized | Verify Resized | 리사이즈 확인 필요 |
| Warning (Orange) | degraded | Degraded | 성능 저하 |
| Warning (Orange) | no-monitor | No Monitor | 모니터 없음 |
| Warning (Orange) | down | Down | 다운 상태 |
| Warning (Orange) | maintenance | Maintenance | 유지보수 중 |
| Muted (Gray) | suspended | Suspended | 일시 중지 |
| Muted (Gray) | shelved | Shelved Offloaded | 보관됨 (오프로드) |
| Muted (Gray) | shelved-offloaded | Shelved Offloaded | 보관됨 (오프로드) |
| Muted (Gray) | mounted | Mounted | 마운트됨 |
| Muted (Gray) | shutoff | Shutoff | 종료됨 |
| Muted (Gray) | paused | Paused | 일시 정지 |
| Muted (Gray) | draft | Draft | 초안 |
| Muted (Gray) | deactivated | Deactivated | 비활성화 |
| Muted (Gray) | in-use | In-use | 사용 중 |

### 특수 상태 정의 문서 관리 원칙

| 항목 | 규칙 |
| --- | --- |
| 정의 범위 | Active, Error, Processing, Warning, Muted 5가지 시맨틱 타입별로 매핑된 status 값 목록 |
| 레이블 | API 응답값과 UI 표시 레이블이 다를 경우 기획 문서에서 명시 |
| 추가/변경 | 신규 status 추가 시 문서 업데이트 후 개발 반영 |

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Badge | Component | 카테고리/태그 분류와 역할 분리 |
| Table | Component | Status 컬럼 사용 |
| Detail Header | Component | InfoCard 상태 표시 |
`;

const statusIndicatorProps: PropDef[] = [
  {
    name: 'status',
    type: "'active' | 'error' | 'building' | 'deleting' | 'suspended' | 'shutoff' | 'paused' | 'pending' | 'draft' | 'degraded' | 'down' | 'maintenance' | ...",
    required: true,
    description: '상태 타입. Defined 목록에 없으면 Default(White Badge)로 렌더링',
  },
  {
    name: 'layout',
    type: "'default' | 'icon-only' | 'badge'",
    default: "'default'",
    required: false,
    description:
      '표시 형식. default: Icon + Label (pill), icon-only: 아이콘만 (공간 제한 시), badge: Icon + Label (square)',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Icon Only 레이아웃 전용 크기',
  },
  {
    name: 'label',
    type: 'string',
    required: false,
    description: '커스텀 레이블. 기획 문서에서 정의한 텍스트로 대체 시 사용',
  },
];

export function StatusIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="Status indicator"
      description="리소스나 시스템의 현재 상태를 시각적으로 전달하는 컴포넌트. 기본적으로 서버에서 응답받은 실제 상태값을 White Badge 형태로 표시한다."
      whenToUse={[
        '테이블의 Status 컬럼에서 리소스의 현재 상태를 표시할 때',
        'Detail Header의 InfoCard에서 리소스 상태를 표시할 때',
        '상태가 복수의 의미 단계(정상·경고·오류 등)로 구분될 때',
      ]}
      whenNotToUse={[
        '단순한 카테고리 분류나 태그 목적에는 Badge를 사용한다.',
        '사용자의 액션을 유도하는 목적에는 사용하지 않는다.',
        '상태가 아닌 수량·숫자 정보 표시에는 사용하지 않는다.',
      ]}
      preview={
        <ComponentPreview
          code={`// Defined — Icon + Label (사전 정의된 특수 상태)
<StatusIndicator status="active" />
<StatusIndicator status="error" />
<StatusIndicator status="building" />`}
        >
          <div className="flex gap-3 items-center">
            <StatusIndicator status="active" />
            <StatusIndicator status="error" />
            <StatusIndicator status="building" />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { StatusIndicator } from '@/design-system';

// Defined — Icon + Label (기본 형식)
<StatusIndicator status="active" />
<StatusIndicator status="error" />

// Defined — Icon Only (공간 제한 시)
<StatusIndicator status="active" layout="icon-only" />

// Defined — Custom label (기획 문서에서 정의한 레이블)
<StatusIndicator status="active" label="Running" />`,
      }}
      examples={
        <VStack gap={8}>
          {/* ── Variant: Default (Label Only / White Badge) ── */}
          <VStack gap={3}>
            <Label>Default — Label Only (White Badge)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              특수 상태로 정의되지 않은 모든 상태값은 서버 응답값을 그대로 White Badge로 표시한다.
              아이콘 없음.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge theme="white" size="sm">
                Available
              </Badge>
              <Badge theme="white" size="sm">
                Reserved
              </Badge>
              <Badge theme="white" size="sm">
                Creating
              </Badge>
              <Badge theme="white" size="sm">
                Attaching
              </Badge>
              <Badge theme="white" size="sm">
                Detaching
              </Badge>
              <Badge theme="white" size="sm">
                Migrating
              </Badge>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ── Variant: Defined (Icon + Label) ── */}
          <VStack gap={3}>
            <Label>Defined — Active (Success / Green)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="active" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Error (Danger / Red)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="error" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Processing (Blue)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Action 타입 아이콘은 스피너 형태로 회전하여 진행 중임을 시각적으로 표현한다.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="building" />
              <StatusIndicator status="deleting" />
              <StatusIndicator status="pending" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Warning (Orange)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="degraded" />
              <StatusIndicator status="down" />
              <StatusIndicator status="maintenance" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Muted (Gray)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="suspended" />
              <StatusIndicator status="paused" />
              <StatusIndicator status="draft" />
              <StatusIndicator status="in-use" />
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ── Display Type: Icon Only ── */}
          <VStack gap={3}>
            <Label>Display Type — Icon Only</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              공간이 제한적인 경우 설계 시점에서 명시적으로 선택. Tooltip으로 상태명을 제공해야
              한다.
            </p>
            <VStack gap={4}>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Active</span>
                <div className="flex flex-wrap gap-4 items-start">
                  <VStack gap={1} align="center">
                    <Tooltip content="active">
                      <StatusIndicator status="active" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">active</span>
                  </VStack>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Error</span>
                <div className="flex flex-wrap gap-4 items-start">
                  <VStack gap={1} align="center">
                    <Tooltip content="error">
                      <StatusIndicator status="error" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">error</span>
                  </VStack>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Processing</span>
                <div className="flex flex-wrap gap-4 items-start">
                  <VStack gap={1} align="center">
                    <Tooltip content="building">
                      <StatusIndicator status="building" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">building</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="deleting">
                      <StatusIndicator status="deleting" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">deleting</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="pending">
                      <StatusIndicator status="pending" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">pending</span>
                  </VStack>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Warning</span>
                <div className="flex flex-wrap gap-4 items-start">
                  <VStack gap={1} align="center">
                    <Tooltip content="degraded">
                      <StatusIndicator status="degraded" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">degraded</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="down">
                      <StatusIndicator status="down" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">down</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="maintenance">
                      <StatusIndicator status="maintenance" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">
                      maintenance
                    </span>
                  </VStack>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Muted</span>
                <div className="flex flex-wrap gap-4 items-start">
                  <VStack gap={1} align="center">
                    <Tooltip content="suspended">
                      <StatusIndicator status="suspended" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">suspended</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="paused">
                      <StatusIndicator status="paused" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">paused</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="draft">
                      <StatusIndicator status="draft" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">draft</span>
                  </VStack>
                  <VStack gap={1} align="center">
                    <Tooltip content="in-use">
                      <StatusIndicator status="in-use" layout="icon-only" />
                    </Tooltip>
                    <span className="text-body-xs text-[var(--color-text-subtle)]">in-use</span>
                  </VStack>
                </div>
              </VStack>
            </VStack>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ── Semantic Color Tokens ── */}
          <VStack gap={3}>
            <Label>Semantic Color Tokens</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Defined 상태 전용. Default 상태는 White 배경 + 기본 텍스트 색상을 사용한다.
            </p>
            <div className="grid grid-cols-5 gap-3">
              {[
                {
                  token: '--status-success-bg',
                  label: 'Active',
                  bg: 'bg-[var(--status-success-bg)]',
                },
                { token: '--status-danger-bg', label: 'Error', bg: 'bg-[var(--status-danger-bg)]' },
                {
                  token: '--status-info-bg',
                  label: 'Processing',
                  bg: 'bg-[var(--status-info-bg)]',
                },
                {
                  token: '--status-warning-bg',
                  label: 'Warning',
                  bg: 'bg-[var(--status-warning-bg)]',
                },
                { token: '--status-muted-bg', label: 'Muted', bg: 'bg-[var(--status-muted-bg)]' },
              ].map(({ token, label: lbl, bg }) => (
                <VStack key={token} gap={1} align="center">
                  <span className={`w-8 h-8 rounded-full ${bg}`} />
                  <span className="text-body-xs text-[var(--color-text-default)]">{lbl}</span>
                  <code className="text-body-xs text-[var(--color-text-subtle)]">{token}</code>
                </VStack>
              ))}
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={STATUS_GUIDELINES} />
          <DosDonts
            doItems={[
              '테이블의 Status 컬럼에서 리소스 상태를 표시한다.',
              'Detail Header의 InfoCard에서 리소스 상태를 표시한다.',
              '하나의 리소스에는 하나의 Status만 표시한다.',
              'Status 컬럼은 중앙 정렬한다.',
              '특수 상태는 기획 문서에 정의된 범위 내에서만 사용한다.',
            ]}
            dontItems={[
              '특수 상태로 정의되지 않은 상태값에 임의로 아이콘이나 컬러를 적용하지 않는다.',
              '시맨틱 타입을 의미와 맞지 않게 사용하지 않는다.',
              'Default 상태에 임의로 색상이나 아이콘을 추가하지 않는다.',
              '상태가 아닌 수량·숫자 정보 표시에는 사용하지 않는다.',
            ]}
          />
        </VStack>
      }
      apiReference={statusIndicatorProps}
      keyboardInteractions={[
        {
          key: 'N/A',
          description: 'StatusIndicator는 정보 표시 전용이므로 별도의 키보드 인터랙션이 없습니다.',
        },
      ]}
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Table', path: '/design/components/table' },
        { label: 'Detail Header', path: '/design/patterns/detail-header' },
      ]}
    />
  );
}
