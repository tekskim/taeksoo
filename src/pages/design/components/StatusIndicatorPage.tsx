import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, HStack, StatusIndicator, VStack } from '@/design-system';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconComputeAdmin from '@/assets/appIcon/computeadmin.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconStorage from '@/assets/appIcon/storage.png';
import AppIconStorageAdmin from '@/assets/appIcon/storageadmin.png';
import AppIconIAM from '@/assets/appIcon/iam.png';

const APP_STATUS_LINKS = [
  { label: 'Compute', icon: AppIconCompute, path: '/design/status/compute' },
  { label: 'Compute Admin', icon: AppIconComputeAdmin, path: '/design/status/compute-admin' },
  { label: 'Container', icon: AppIconContainer, path: '/design/status/container' },
  { label: 'Storage', icon: AppIconStorage, path: '/design/status/storage' },
  { label: 'Storage Admin', icon: AppIconStorageAdmin, path: '/design/status/storage-admin' },
  { label: 'IAM', icon: AppIconIAM, path: '/design/status/iam' },
];

const STATUS_GUIDELINES = `## Overview

리소스나 시스템의 현재 상태를 카드, 표, 목록 또는 헤더에서 시각적으로 간결하게 전달하는 컴포넌트다.

---

## Variants

Status의 두 Variant는 공통으로 \`displayType\`, \`icon\`, \`color\`, \`label\` 변수를 사용한다. **Default**는 이 변수들이 고정된 프리셋이고, **Defined**는 별도 정책 문서(리소스 상태 정의)에서 직접 정의한다.

### 1. Default

특수 상태로 정의되지 않은 모든 상태값에 적용되는 프리셋 형식이다. 아래 변수가 자동 적용된다.

| 변수 | 고정 값 | 비고 |
| --- | --- | --- |
| \`displayType\` | \`label-only\` | - |
| \`icon\` | 없음 | - |
| \`color\` | \`white\` | - |
| \`label\` | API 응답 상태값 그대로 표시 | 가공 없이 그대로 사용 |

### 2. Defined

사전에 정의된 특수 상태에 한해 **아이콘·컬러·레이블 텍스트**를 코딩하여 표시한다. 어떤 상태를 특수 상태로 취급할지는 **별도 정책 문서**(리소스 상태 정의)에서 정의한다.

특수 상태는 아래 **4개 변수**로 정의한다.

| 변수 | 설명 | 값 / 비고 |
| --- | --- | --- |
| \`displayType\` | 표시 형식. 미지정 시 Label이 기본 | \`icon-only\` / \`label-only\` |
| \`icon\` | TDS Icons에서 사용할 아이콘. \`displayType\`이 \`label-only\`이면 미사용 | 리소스 상태 정의 문서에서 정함 |
| \`color\` | 컬러. TDS Semantic Colors 기준을 따른다. | \`green\` / \`red\` / \`blue\` / \`orange\` / \`gray\` / \`white\` |
| \`label\` | 레이블 텍스트. \`displayType\`이 \`icon-only\`이면 미표시 | 리소스 상태 정의 문서에서 정함 |

---

## Composition (구성 요소)

\`\`\`
[ label text ]   ← label-only
[ 🟢 icon ]      ← icon-only
\`\`\`

| 요소 | 설명 | 필수 여부 |
| --- | --- | --- |
| Icon | 상태를 시각적으로 나타내는 아이콘. TDS Icons 기준. \`displayType\`이 \`icon-only\`일 때만 표시 | \`icon-only\`인 경우만 |
| Label | 상태명을 텍스트로 표시 | \`label-only\`인 경우만 |
| Container | Icon과 Label을 감싸는 Pill 형태의 래퍼 | 필수 |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| Padding | 6×4px |
| Gap | 4px |
| Border Radius | pill (16px) |
| Font Size | 11px |
| Icon Size | 14px |

### 컬러별 시맨틱 토큰

TDS Semantic Colors 기준을 따른다.

| 컬러 | Token | 적용 Variant |
| --- | --- | --- |
| White | White | Default |
| Green | Green 400 | Defined |
| Red | Red 400 | Defined |
| Blue | Blue 400 | Defined |
| Orange | Orange 400 | Defined |
| Gray | Slate 500 | Defined |

---

## Behavior

### 상태 업데이트
- 상태는 실제 리소스 상태를 반영하며, 폴링(polling) 또는 실시간 이벤트를 통해 자동으로 업데이트된다.

### Defined 상태 렌더링 규칙
- 리소스 상태가 특수 상태 정의 목록의 조건에 부합하면 Defined로, 그렇지 않으면 Default로 렌더링한다.
- 특수 상태로 정의된 경우 레이블 텍스트는 별도 정의된 값으로 대체할 수 있다.

### 반응형 대응
- 레이블 텍스트는 줄바꿈 없이 한 줄로 유지한다.

### 접근성
- Icon Only 형식을 사용할 경우 스크린 리더를 위해 \`aria-label\` 또는 \`title\` 속성으로 상태명을 제공해야 한다.

---

## Content Guidelines

### 레이블 작성 원칙

- **Default**: API 응답 상태값을 가공 없이 그대로 표시한다.
- **Defined**: 리소스 상태 정의 문서에서 정의한 레이블 텍스트를 사용한다. 표기는 **Sentence case**를 적용한다. API 응답값과 다를 수 있으며, 이 경우 리소스 상태 정의 문서에 매핑 관계를 명시한다.
- 명사 또는 형용사 형태로 작성하며, 동사형·문장형 표현은 사용하지 않는다.

### 특수 상태 정의 문서 관리 권고 사항

Defined 상태의 변수(displayType, icon, color, label)는 리소스 상태 정의 문서에서 아래 항목을 명시하여 관리한다.

| 항목 | 설명 |
| --- | --- |
| displayType | 미지정 시 Label 기본. \`icon-only\` 지정 시 명시 |
| color | \`green\` / \`red\` / \`blue\` / \`orange\` / \`gray\` / \`white\` |
| label (status) | 화면에 표시할 텍스트. Sentence case 적용. API 응답값과 다를 경우 명시 |
| icon | 사용할 TDS Icons 아이콘 이름 (\`label-only\`이면 생략) |
| 조건 | API 응답값 등 특수 상태를 정의하기 위한 조건 |
| 설명 | 해당 상태값이 의미하는 실제 상태 |
| 비고 | 상태에 따라 가능한 액션 등 부가 정보 |

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Badge | Component | 카테고리/태그 분류와 역할 분리 |
| Table | Component | Status 컬럼 사용 |
| Detail Header | Component | InfoCard 상태 표시 |
`;

export function StatusIndicatorPage() {
  return (
    <ComponentPageTemplate
      title="Status indicator"
      description="리소스나 시스템의 현재 상태를 카드, 표, 목록 또는 헤더에서 시각적으로 간결하게 전달하는 컴포넌트."
      whenToUse={[
        '테이블의 Status 컬럼에서 리소스의 현재 상태를 표시할 때',
        'Detail Header의 InfoCard에서 리소스 상태를 표시할 때',
      ]}
      whenNotToUse={[
        '사용자의 액션을 유도하는 목적에는 사용하지 않는다.',
        '상태가 아닌 수량·숫자 정보 표시에는 사용하지 않는다.',
      ]}
      preview={
        <ComponentPreview
          code={`// Default — Label Only (White Badge)
<Badge theme="white" size="sm">Available</Badge>

// Defined — Icon Only
<StatusIndicator status="active" layout="icon-only" />
<StatusIndicator status="error" layout="icon-only" />
<StatusIndicator status="building" layout="icon-only" />`}
        >
          <div className="flex gap-3 items-center">
            <Badge theme="white" size="sm">
              Available
            </Badge>
            <StatusIndicator status="active" layout="icon-only" />
            <StatusIndicator status="error" layout="icon-only" />
            <StatusIndicator status="building" layout="icon-only" />
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          {/* ── Variant 1: Default (Label Only / White Badge) ── */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default — Label Only (White Badge)</Label>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                특수 상태로 정의되지 않은 모든 상태값은 서버 응답값을 그대로 White Badge로 표시한다.
                displayType은 label-only로 고정되며, 아이콘 없음.
              </p>
            </VStack>
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

          {/* ── Variant 2: Defined — Icon Only ── */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Defined — Icon Only</Label>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                별도 정책 문서에서 정의한 특수 상태. displayType이 icon-only인 경우 아이콘만
                표시하며, 호버 시 Tooltip으로 상태명을 제공한다. 각 앱별 상태 정의는 하단
                &quot;리소스 상태 정의&quot; 링크를 참고한다.
              </p>
            </VStack>
            <HStack gap={4} align="center">
              <StatusIndicator status="active" layout="icon-only" />
              <VStack gap={0.5}>
                <span className="text-body-sm text-[var(--color-text-default)]">
                  Background:{' '}
                  <code className="font-mono text-body-xs bg-[var(--color-surface-muted)] px-1 py-0.5 rounded-[var(--radius-sm)]">
                    24 × 24px
                  </code>
                </span>
                <span className="text-body-sm text-[var(--color-text-default)]">
                  Icon:{' '}
                  <code className="font-mono text-body-xs bg-[var(--color-surface-muted)] px-1 py-0.5 rounded-[var(--radius-sm)]">
                    14 × 14px
                  </code>
                </span>
              </VStack>
            </HStack>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ── Semantic Color Tokens ── */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Semantic Color Tokens</Label>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                컬러별 시맨틱 토큰. Default는 White, Defined는 정책 문서에서 지정한 컬러를 사용한다.
              </p>
            </VStack>
            <div className="grid grid-cols-6 gap-3">
              {[
                { label: 'White', bg: 'bg-white border border-[var(--color-border-default)]' },
                { label: 'Green', bg: 'bg-[var(--status-success-bg)]' },
                { label: 'Red', bg: 'bg-[var(--status-danger-bg)]' },
                { label: 'Blue', bg: 'bg-[var(--status-info-bg)]' },
                { label: 'Orange', bg: 'bg-[var(--status-warning-bg)]' },
                { label: 'Gray', bg: 'bg-[var(--status-muted-bg)]' },
              ].map(({ label: lbl, bg }) => (
                <VStack key={lbl} gap={1} align="center">
                  <span className={`w-8 h-8 rounded-full ${bg}`} />
                  <span className="text-body-xs text-[var(--color-text-default)]">{lbl}</span>
                </VStack>
              ))}
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* ── Per-App Status Definitions ── */}
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>리소스 상태 정의 (per App)</Label>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                각 앱별로 Defined 상태의 변수(displayType, icon, color, label)를 정의한 문서.
              </p>
            </VStack>
            <HStack gap={2} className="flex-wrap">
              {APP_STATUS_LINKS.map(({ label: lbl, icon, path }) => (
                <a
                  key={lbl}
                  href={path}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-hover)] transition-colors text-body-md text-[var(--color-text-default)]"
                >
                  <img src={icon} alt="" className="size-5 object-contain" />
                  <span>{lbl}</span>
                </a>
              ))}
            </HStack>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={STATUS_GUIDELINES} />
          <DosDonts
            doItems={[
              '테이블의 Status 컬럼에서 사용하며, 컬럼은 중앙 정렬한다.',
              'Detail Header의 Info Card에서 리소스 상태 표시 시 사용한다.',
              '특수 상태 정의는 반드시 별도 정책 문서(리소스 상태 정의)를 통해 관리한다.',
              '하나의 리소스에는 하나의 Status만 표시한다.',
              '같은 화면 내에서 동일한 상태값은 항상 동일한 형식으로 표시한다.',
            ]}
            dontItems={[
              '특수 상태로 정의되지 않은 상태값에 임의로 아이콘이나 컬러를 적용하지 않는다.',
              '컬러의 시맨틱 의미와 맞지 않는 상태에 적용하지 않는다. (예: 오류 상황에 Gray 사용 금지)',
              '배경색과 아이콘 색상을 시맨틱 토큰 외의 값으로 커스터마이징하지 않는다.',
              'Default 상태에 임의로 색상이나 아이콘을 추가하지 않는다.',
            ]}
          />
        </VStack>
      }
      relatedLinks={[
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Table', path: '/design/components/table' },
        { label: 'Detail Header', path: '/design/patterns/detail-header' },
        {
          label: 'Semantic Colors',
          path: '/design/foundation/semantic-colors',
          description: '컬러 토큰 기준',
        },
      ]}
    />
  );
}
