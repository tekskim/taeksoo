import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { Toggle, VStack } from '@/design-system';

const TOGGLE_GUIDELINES = `## Overview

이진(Binary) 설정을 즉시 전환하는 On/Off 스위치 컨트롤이다.
클릭 시 즉각적으로 UI 상태가 변경되며, 별도의 폼 제출 없이 설정이 반영된다.

---

## Variants

| 구분 | 설명 |
| --- | --- |
| Default | 일반 설정 항목에 사용하는 기본 Toggle. 라벨을 우측에 표시 |
| Without Label | 라벨 없이 Toggle 단독으로 표시. 테이블 셀 등 공간이 제한된 경우에 사용 |
| Mini (Chart Controls) | 차트 컨트롤 등 밀도가 높은 UI에 사용하는 소형 Toggle. size: 24×12px, thumb: 8×8px |

---

## Composition

\`\`\`
 Off:  ┌─────────────────┐      Label
       │ ●               │  ←── Track 36×20px
       └─────────────────┘        Thumb 16×16px (좌측)

 On:   ┌─────────────────┐      Label
       │               ● │  ←── Track 36×20px
       └─────────────────┘        Thumb 16×16px (우측)

       [Track] ← 8px → [Label]
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Track | Toggle의 배경 영역. On/Off 상태에 따라 색상 변경 |
| Thumb | Track 위를 슬라이딩하는 원형 핸들 |
| Label | 설정 항목명 표시. Track 우측에 위치 |
| Description (optional) | Label 하단에 부가 설명을 표시 |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| Track 크기 | 36×20px |
| Thumb 크기 | 16×16px |
| Padding (thumb 여백) | 4px |
| Border radius | pill |
| Track–Label 간격 | 8px |

---

## States

| 상태 | 설명 |
| --- | --- |
| Off | 기본 비활성 상태. Thumb이 Track 좌측에 위치 |
| On | 활성 상태. Thumb이 Track 우측으로 이동, Track 색상 변경 |
| Disabled Off | 비활성화된 Off 상태. 조작 불가, 흐리게 표시 |
| Disabled On | 비활성화된 On 상태. 조작 불가, 흐리게 표시 |
| Focused | 키보드 포커스 상태. Track 외곽에 Focus ring 표시 |
| Hover | 마우스 오버 시 커서 변경 및 Track 색상 미세 변화 |

---

## Behavior

### 상태 전환 정책 (Optimistic Update)
- Toggle 클릭 시 즉시 UI 상태를 변경한다 (Optimistic update).
- 백엔드 API 호출은 상태 변경 직후 비동기로 실행한다.
- API 호출 실패 시 Toggle 상태를 이전 값으로 롤백하고 에러 피드백을 제공한다.
- API 응답 대기 중에는 Toggle을 비활성화(Disabled)하여 중복 조작을 방지한다.

### Conditional Display
- Toggle이 On 상태일 때 연관된 추가 옵션 영역이 펼쳐지는 패턴을 지원한다.
- 영역 전환 시 즉각적인 표시/숨김 또는 부드러운 확장 애니메이션을 적용한다.

### 키보드 인터랙션

| 키 | 동작 |
| --- | --- |
| Space | Toggle On/Off 전환 |
| Tab | 다음 포커스 요소로 이동 |
| Shift + Tab | 이전 포커스 요소로 이동 |

---

## Usage Guidelines

### Do ✅
- Toggle 우측에 항상 설정 항목의 라벨을 표시한다.
- 이진(On/Off) 상태를 즉시 반영하는 단일 설정에 사용한다.
- Disabled 상태 사용 시, 조작 불가 이유를 Tooltip 또는 인접 텍스트로 안내한다.

### Don't ❌
- 폼 제출이 필요한 선택 항목에 Toggle을 사용하지 않는다 → Checkbox 사용.
- 3개 이상의 선택지를 Toggle로 표현하지 않는다.
- On/Off 외의 중간 상태(Indeterminate)를 Toggle로 표현하지 않는다.

---

## Content Guidelines

- 라벨은 설정의 대상 또는 기능을 명확히 나타내는 명사 또는 명사구로 작성한다.
  - ✅ "Auto scaling", "Enable monitoring", "Bootable"
  - ❌ "켜기/끄기", "활성화 여부"
- Description은 설정의 영향 범위나 주의 사항을 1–2문장 이내로 간결하게 작성한다.
- On/Off 상태를 라벨 텍스트로 변경하지 않는다. 상태는 Toggle의 시각적 표현으로 전달한다.

---

## Related

- Checkbox
- Radio
- Select
`;

const toggleProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Toggle label' },
  { name: 'description', type: 'ReactNode', required: false, description: 'Description text' },
  { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
  {
    name: 'defaultChecked',
    type: 'boolean',
    required: false,
    description: 'Default state (uncontrolled)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    required: false,
    description: 'Change handler',
  },
];

export function TogglePage() {
  return (
    <ComponentPageTemplate
      title="Toggle"
      description="이진(Binary) 설정을 즉시 전환하는 On/Off 스위치 컨트롤. 클릭 시 즉각적으로 UI 상태가 변경되며, 별도의 폼 제출 없이 설정이 반영된다."
      whenToUse={[
        '클릭 즉시 리소스 상태를 변경해야 할 때 (e.g. Lock/Unlock)',
        '앱 내 리소스의 단일 설정을 On/Off로 제어할 때',
        'Conditional display: Toggle 상태에 따라 추가 옵션 영역을 열고 닫는 등 UI 레이아웃 변경이 필요할 때',
      ]}
      whenNotToUse={[
        '폼 제출 시 반영되는 동의/선택 → Checkbox 사용',
        '여러 항목 중 복수 선택 (체크리스트) → Checkbox Group 사용',
        '상호 배타적인 3개 이상의 옵션 선택 → Radio 또는 Select 사용',
      ]}
      keyboardInteractions={[
        { key: 'Space', description: 'Toggle On/Off state' },
        { key: 'Tab', description: 'Move focus to next element' },
        { key: 'Shift + Tab', description: 'Move focus to previous element' },
      ]}
      preview={
        <ComponentPreview code={`<Toggle label="Auto-scaling" defaultChecked />`}>
          <Toggle label="Auto-scaling" defaultChecked />
        </ComponentPreview>
      }
      usage={{
        code: `import { Toggle } from '@/design-system';\n\n<Toggle label="Enable dark mode" defaultChecked />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Layout</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Without Label
                </span>
                <Toggle defaultChecked />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Label
                </span>
                <Toggle label="Bootable" defaultChecked />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Off
                </span>
                <Toggle label="Setting" checked={false} onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  On
                </span>
                <Toggle label="Setting" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled Off
                </span>
                <Toggle label="Setting" disabled />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled On
                </span>
                <Toggle label="Setting" defaultChecked disabled />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Interactive examples</Label>
            <div className="flex flex-col gap-3">
              <Toggle label="Enable dark mode" defaultChecked />
              <Toggle label="Receive notifications" />
              <Toggle label="Auto-backup enabled" defaultChecked />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With description</Label>
            <Toggle
              label="Auto-scaling"
              description="Automatically scale instances based on demand"
              defaultChecked
            />
          </VStack>

          <VStack gap={3}>
            <Label>Mini Toggle (Chart Controls)</Label>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] mb-2">
              <code>size: 24×12px</code> · <code>thumb: 8×8px</code> · <code>border: 1px</code> ·{' '}
              <code>radius: 6px</code>
            </div>
            <div className="flex gap-8 items-center">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Off
                </span>
                <span className="toggleSwitch" />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  On
                </span>
                <span className="toggleSwitch toggleSwitchActive" />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Usage Example
                </span>
                <div className="flex items-center gap-2 text-body-sm text-[var(--color-text-default)]">
                  <span>CPU</span>
                  <span className="toggleSwitch toggleSwitchActive" />
                  <span className="text-[var(--color-border-default)]">|</span>
                  <span>Memory</span>
                  <span className="toggleSwitch" />
                </div>
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<NotionRenderer markdown={TOGGLE_GUIDELINES} />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>track: 36×20px</code> · <code>thumb: 16×16px</code> · <code>padding: 4px</code> ·{' '}
          <code>radius: pill</code> · <code>gap: 8px</code>
        </div>
      }
      apiReference={toggleProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Space: Toggle 상태 전환</li>
          <li>Tab: 포커스 이동</li>
          <li>role=&quot;switch&quot; + aria-checked 자동 적용</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Checkbox', path: '/design/components/checkbox' },
        { label: 'Radio', path: '/design/components/radio' },
        { label: 'Select', path: '/design/components/select' },
      ]}
    />
  );
}
