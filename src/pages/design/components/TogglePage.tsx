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
      description="On/Off switch control for binary settings"
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
        <VStack gap={4}>
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Toggle vs Checkbox 선택 기준
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      조건
                    </th>
                    <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                      권장 컴포넌트
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      클릭 즉시 UI 상태 변경 (optimistic update). API 실패 시 롤백.
                    </td>
                    <td className="py-2 font-medium text-[var(--color-text-default)]">Toggle</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      폼 제출 시 반영되는 동의/선택
                    </td>
                    <td className="py-2 font-medium text-[var(--color-text-default)]">Checkbox</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      여러 항목 중 복수 선택
                    </td>
                    <td className="py-2 font-medium text-[var(--color-text-default)]">
                      CheckboxGroup
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                Toggle 옆에 설정 항목의 라벨을 표시합니다 (e.g. &quot;Auto scaling&quot;,
                &quot;Enable monitoring&quot;).
              </li>
              <li>
                Toggle은 On/Off 이진 선택에 사용합니다. Checkbox는 다중 항목 선택(체크리스트)에
                사용합니다.
              </li>
              <li>Toggle로 추가 옵션 영역을 열고 닫는 패턴 (conditional display)이 가능합니다.</li>
            </ul>
          </VStack>
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
        {
          label: 'Checkbox',
          path: '/design/components/checkbox',
          description: 'Selection control',
        },
        { label: 'Radio', path: '/design/components/radio', description: 'Single selection' },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Label combinations',
        },
      ]}
    />
  );
}
