import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Toggle, VStack } from '@/design-system';

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
      description="이진(Binary) 설정을 즉시 전환하는 On/Off 스위치 컨트롤이다. 클릭 시 즉각적으로 UI 상태가 변경되며, 별도의 폼 제출 없이 설정이 반영된다."
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
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        구분
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Default
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        라벨과 함께 사용하는 기본 형태
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Without Label
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        라벨 없이 트랙만 표시 (컨텍스트가 명확할 때)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Mini Chart Controls
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        차트 컨트롤 등 컴팩트한 UI에서 사용 (24×12px)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Track
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">슬라이드 배경 트랙</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Thumb
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">드래그 가능한 핸들</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Label
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        설정 대상을 설명하는 라벨
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Description
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        설정 영향 또는 주의사항 (선택)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Design Tokens
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Track</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">36×20px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Thumb</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">16×16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Padding</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">4px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Radius</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">pill</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Track-Label gap</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">8px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Off
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성 상태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">On</td>
                      <td className="py-2 text-[var(--color-text-muted)]">활성 상태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Disabled Off
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성 + 비활성화</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Disabled On
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">활성 + 비활성화</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Focused
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">키보드 포커스 시</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Hover
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">마우스 오버 시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium">
                상태 전환 정책 (Optimistic Update)
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  클릭 시 <strong>즉시 UI 상태를 업데이트</strong>한다 (Optimistic Update).
                </li>
                <li>상태 변경 직후 백엔드 API 호출을 비동기로 실행한다.</li>
                <li>
                  API 실패 시 <strong>Toggle을 이전 값으로 롤백</strong>하고 에러 피드백을 제공한다.
                </li>
                <li>
                  API 응답 대기 중에는 <strong>Toggle을 비활성화</strong>하여 중복 액션을 방지한다.
                </li>
              </ul>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium mt-4">
                Conditional Display
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  Toggle로 관련 옵션 영역의 표시/숨김을 제어할 수 있다 (expand/collapse 패턴).
                </li>
                <li>상태 변경 시 즉시 show/hide 또는 부드러운 확장 애니메이션을 적용한다.</li>
              </ul>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        키
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        동작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Space
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">On/Off 상태 전환</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Tab
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        다음 요소로 포커스 이동
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Shift+Tab
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        이전 요소로 포커스 이동
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Usage Guidelines
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] font-medium">Do ✅</p>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    Toggle 옆에 항상 라벨을 표시한다 (e.g. &quot;Auto scaling&quot;, &quot;Enable
                    monitoring&quot;).
                  </li>
                  <li>클릭 즉시 반영되는 이진(On/Off) 설정에 사용한다.</li>
                  <li>Disabled 상태 사용 시 Tooltip 또는 인접 텍스트로 사유를 설명한다.</li>
                </ul>
                <p className="text-body-sm text-[var(--color-text-muted)] font-medium mt-2">
                  Don&apos;t ❌
                </p>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>폼 제출 시 반영되는 선택에는 Toggle을 사용하지 않는다 → Checkbox 사용.</li>
                  <li>3개 이상의 옵션을 Toggle으로 표현하지 않는다.</li>
                  <li>중간(indeterminate) 상태를 Toggle으로 표현하지 않는다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Content Guidelines
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>라벨</strong>: 설정 대상을 명확히 설명하는 명사 또는 명사구로 작성한다.
                </li>
                <li>
                  Good: &quot;Auto scaling&quot;, &quot;Enable monitoring&quot;,
                  &quot;Bootable&quot;
                </li>
                <li>Bad: &quot;Turn on/off&quot;, &quot;Activation status&quot;</li>
                <li>
                  <strong>Description</strong>: 설정의 영향 또는 주의사항을 1–2문장으로 유지한다.
                </li>
                <li>
                  On/Off 상태에 따라 라벨 텍스트를 변경하지 않는다. Toggle의 시각적 상태가 이를
                  전달한다.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
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
