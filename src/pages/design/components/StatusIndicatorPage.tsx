import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, StatusIndicator, Tooltip, VStack } from '@/design-system';
import { NotionRenderer } from '../_shared/NotionRenderer';

const STATUS_INDICATOR_GUIDELINES = `## Overview

리소스나 시스템의 현재 상태를 시각적으로 전달하는 컴포넌트다.
기본적으로 서버에서 응답받은 실제 상태값을 White Badge 형태로 표시하며,

### When to use

- 테이블의 Status 컬럼에서 리소스의 현재 상태를 표시할 때
- Detail Header의 InfoCard에서 리소스 상태를 표시할 때
- 상태가 복수의 의미 단계(정상·경고·오류 등)로 구분될 때

### When not to use

- 단순한 카테고리 분류나 태그 목적에는 Badge를 사용한다.
- 사용자의 액션을 유도하는 목적에는 사용하지 않는다.
- 상태가 아닌 수량·숫자 정보 표시에는 사용하지 않는다.

---

## Variants

Status는 표시 방식에 따라 **Default**와 **Defined** 두 가지로 구분된다.

### 1. Default

서버 응답값을 그대로 표시하는 기본 형식이다.
특수 상태로 정의되지 않은 모든 상태값은 Default로 표시된다.

| 속성 | 값 |
| --- | --- |
| 배경색 | White |
| 텍스트 색상 | 기본 검은색 |
| 아이콘 | 없음 |
| 레이블 | 서버 응답 상태값 그대로 표시 |

### 2. Defined

사전에 정의된 특수 상태에 한해 아이콘·컬러·레이블 텍스트를 코딩하여 표시한다.
어떤 상태를 특수 상태로 취급할지는 리소스별 별도 기획 문서에서 정의한다.

특수 상태는 시맨틱 의미에 따라 아래 5가지 타입으로 코딩된다.

| 타입 | 색상 | 사용 상황 예시 |
| --- | --- | --- |
| Active (Success) | Green | active |
| Error (Danger) | Red | error |
| Processing | Blue | building · deleting · pending |
| Warning | Orange | degraded · down · maintenance |
| Muted | Gray | suspended · paused · draft · in-use |

### 표시 형식 (Display Type)

| 형식 | 구성 | 사용 상황 |
| --- | --- | --- |
| Icon + Label | 아이콘 + 텍스트 레이블 | Defined 상태의 기본 형식 |
| Icon Only | 아이콘만 표시 | 공간이 제한적인 경우. 설계 시점에서 명시적으로 선택 |
| Label Only | 텍스트 레이블만 표시 | Default 상태의 기본 형식 |

---

## Composition (구성 요소)

| 요소 | 설명 | 필수 여부 |
| --- | --- | --- |
| Icon | 상태 타입을 시각적으로 나타내는 아이콘. 원형 배경 위에 표시 | Defined만 해당 |
| Label | 상태명을 텍스트로 표시 | 필수 (Icon Only 형식 제외) |
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
| Active | \`--status-success-bg\` |
| Error | \`--status-danger-bg\` |
| Action | \`--status-info-bg\` |
| Warning | \`--status-warning-bg\` |
| Muted | \`--status-muted-bg\` |

Default 상태는 별도 시맨틱 토큰 없이 White 배경 + 기본 텍스트 색상을 사용한다.

---

## Behavior

- **상태 업데이트**: 상태는 서버의 실제 리소스 상태를 반영하며, 폴링(polling) 또는 실시간 이벤트를 통해 자동으로 업데이트된다. 상태 전환 시 별도의 애니메이션 없이 즉시 교체된다. 서버 응답값이 특수 상태 정의 목록에 존재하면 Defined로, 그렇지 않으면 Default로 렌더링한다.
- **Defined 상태 렌더링 규칙**: 서버 응답값과 특수 상태 정의 목록을 대조하여 일치하는 경우에만 Defined로 처리한다. 특수 상태로 정의된 경우 레이블 텍스트도 정의된 값으로 대체할 수 있다. Action 타입(building, deleting, pending 등)의 아이콘은 스피너 형태로 회전하여 진행 중임을 시각적으로 표현한다.
- **반응형 대응**: 레이블 텍스트는 줄바꿈 없이 한 줄로 유지한다. Icon Only 형식은 설계 시점에서 명시적으로 선택해야 하며, 자동 전환되지 않는다.
- **접근성**: Icon Only 형식을 사용할 경우 스크린 리더를 위해 \`aria-label\` 또는 \`title\` 속성으로 상태명을 제공해야 한다. 색상만으로 상태를 구별하지 않도록 Defined 상태에는 아이콘을 함께 사용한다. (WCAG 1.4.1 준수)

---

## Usage Guidelines

### Do ✅

- 테이블의 Status 컬럼에서 사용하며, 컬럼은 **중앙 정렬**한다.
- Detail Header의 Info Card에서 리소스 상태 표시 시 사용한다.
- 특수 상태 정의는 반드시 리소스별 별도 기획 문서를 통해 관리한다.
- 하나의 리소스에는 하나의 Status만 표시한다.
- 같은 화면 내에서 동일한 상태값은 항상 동일한 형식으로 표시한다.

### Don't ❌

- 특수 상태로 정의되지 않은 상태값에 임의로 아이콘이나 컬러를 적용하지 않는다.
- 특수 상태의 시맨틱 타입(색상·아이콘)을 의미와 맞지 않게 사용하지 않는다. (예: 오류 상황에 Muted 사용 금지)
- 배경색과 아이콘 색상을 시맨틱 토큰 외의 값으로 커스터마이징하지 않는다.
- Default 상태에 임의로 색상이나 아이콘을 추가하지 않는다.

---

## Content Guidelines

### 레이블 작성 원칙

- **Default**: 서버 응답 상태값을 가공 없이 그대로 표시한다.
- **Defined**: 별도 기획 문서에서 정의한 레이블 텍스트를 사용한다. 서버 응답값과 다를 수 있으며, 이 경우 기획 문서에 매핑 관계를 명시한다.
- 레이블 텍스트는 모두 소문자로 작성한다.
- 명사 또는 형용사 형태로 작성하며, 동사형·문장형 표현은 사용하지 않는다.

### 특수 상태 정의 문서 관리 원칙

특수 상태 여부와 그에 따른 타입·레이블은 컴포넌트에서 직접 정의하지 않는다.
리소스별 별도 기획 문서에서 아래 항목을 명시하여 관리한다.

| 항목 | 설명 |
| --- | --- |
| 서버 응답값 | 서버에서 실제로 내려오는 상태 문자열 |
| 표시 레이블 | 화면에 표시할 텍스트 (서버 응답값과 다를 경우 명시) |
| 타입 | Active / Error / Action / Warning / Muted 중 하나 |
| 비고 | 상태의 의미 및 조건 설명 |`;

const statusIndicatorProps: PropDef[] = [
  {
    name: 'status',
    type: "'active' | 'error' | 'building' | 'deleting' | 'suspended' | 'shutoff' | 'paused' | 'pending' | 'draft' | 'degraded' | 'down' | 'maintenance' | ...",
    required: true,
    description: '상태 타입. Defined 목록에 없으면 Default(White Badge)로 렌더링',
  },
  {
    name: 'layout',
    type: "'icon-only' | 'default' | 'badge'",
    default: "'icon-only'",
    required: false,
    description:
      '표시 형식. icon-only: 아이콘만, default: Icon + Label (pill), badge: Icon + Label (square)',
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
      description="리소스나 시스템의 현재 상태를 시각적으로 전달하는 컴포넌트. 서버 응답값을 White Badge(Default)로 표시하며, 사전 정의된 특수 상태는 아이콘·컬러와 함께 Defined로 표시한다."
      preview={
        <ComponentPreview
          code={`// Defined — Icon + Label (사전 정의된 특수 상태)
<StatusIndicator status="active" layout="default" />
<StatusIndicator status="error" layout="default" />
<StatusIndicator status="building" layout="default" />`}
        >
          <div className="flex gap-3 items-center">
            <StatusIndicator status="active" layout="default" />
            <StatusIndicator status="error" layout="default" />
            <StatusIndicator status="building" layout="default" />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { StatusIndicator } from '@/design-system';

// Defined — Icon + Label (기본 형식)
<StatusIndicator status="active" layout="default" />
<StatusIndicator status="error" layout="default" />

// Defined — Icon Only (공간 제한 시)
<StatusIndicator status="active" layout="icon-only" />

// Defined — Custom label (기획 문서에서 정의한 레이블)
<StatusIndicator status="active" layout="default" label="Running" />`,
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
              <StatusIndicator status="active" layout="default" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Error (Danger / Red)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="error" layout="default" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Processing (Blue)</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Action 타입 아이콘은 스피너 형태로 회전하여 진행 중임을 시각적으로 표현한다.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="building" layout="default" />
              <StatusIndicator status="deleting" layout="default" />
              <StatusIndicator status="pending" layout="default" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Warning (Orange)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="degraded" layout="default" />
              <StatusIndicator status="down" layout="default" />
              <StatusIndicator status="maintenance" layout="default" />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Defined — Muted (Gray)</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <StatusIndicator status="suspended" layout="default" />
              <StatusIndicator status="paused" layout="default" />
              <StatusIndicator status="draft" layout="default" />
              <StatusIndicator status="in-use" layout="default" />
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
      guidelines={<NotionRenderer markdown={STATUS_INDICATOR_GUIDELINES} />}
      apiReference={statusIndicatorProps}
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge', description: 'Static labels' },
        { label: 'Table', path: '/design/components/table', description: 'Status column' },
        {
          label: 'Detail Header',
          path: '/design/components/detail-header',
          description: 'InfoCard status',
        },
      ]}
    />
  );
}
