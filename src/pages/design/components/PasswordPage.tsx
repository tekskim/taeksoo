import { useState, useRef, useEffect } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Password, VStack } from '@/design-system';
import { Label } from '../../design-system-sections/HelperComponents';

const passwordProps: PropDef[] = [
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    required: false,
    description: 'Input size',
  },
  { name: 'label', type: 'string', required: false, description: 'Label text' },
  { name: 'helperText', type: 'string', required: false, description: 'Helper text below input' },
  {
    name: 'error',
    type: 'boolean | string',
    default: 'false',
    required: false,
    description: 'Error state or error message',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Full width mode',
  },
  {
    name: 'showToggle',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show password visibility toggle',
  },
  { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
];

function PasswordVisibleDemo() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const toggle = ref.current?.parentElement?.querySelector('button');
    if (toggle) toggle.click();
  }, []);
  return <Password ref={ref} defaultValue="mypassword123" fullWidth />;
}

function PasswordPreview() {
  const [value, setValue] = useState('');
  const [filledValue, setFilledValue] = useState('mypassword123');
  return (
    <VStack gap={4} className="w-full max-w-[320px]">
      <Password
        placeholder="Enter password"
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Password
        placeholder="Enter password"
        fullWidth
        value={filledValue}
        onChange={(e) => setFilledValue(e.target.value)}
      />
      <Password placeholder="With error" fullWidth error="Password must be at least 8 characters" />
      <Password placeholder="Disabled" fullWidth disabled />
    </VStack>
  );
}

export function PasswordPage() {
  return (
    <ComponentPageTemplate
      title="Password"
      description="Input 기반 비밀번호 입력 컴포넌트. 우측 토글 버튼으로 비밀번호 표시/숨김을 전환합니다. Focus 시 inset 보더 링이 적용되며, visible 상태에서는 평문 텍스트와 EyeOff 아이콘이 표시됩니다."
      whenToUse={['사용자 비밀번호 입력이 필요할 때', '비밀번호 확인 입력 필드에 사용']}
      whenNotToUse={['일반 텍스트 입력 → Input 사용', '검색 입력 → SearchInput 사용']}
      preview={
        <ComponentPreview
          code={`// Default
<Password placeholder="Enter password" fullWidth />

// With value
<Password value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />

// Error
<Password error="Password must be at least 8 characters" fullWidth />

// Disabled
<Password placeholder="Enter password" disabled fullWidth />`}
        >
          <PasswordPreview />
        </ComponentPreview>
      }
      props={passwordProps}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="grid grid-cols-2 gap-4 max-w-[640px]">
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <Password placeholder="Enter password" fullWidth />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">With value</span>
                <Password defaultValue="mypassword123" fullWidth />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">
                  Visible (password shown)
                </span>
                <PasswordVisibleDemo />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Error</span>
                <Password
                  placeholder="Enter password"
                  fullWidth
                  error="Password must be at least 8 characters"
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Disabled</span>
                <Password placeholder="Enter password" fullWidth disabled />
              </VStack>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Sizes</Label>
            <VStack gap={3} className="max-w-[320px]">
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">sm (28px)</span>
                <Password placeholder="Small password" size="sm" fullWidth />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">md (32px)</span>
                <Password placeholder="Medium password" size="md" fullWidth />
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Input', path: '/design/components/input' },
        { label: 'FormField', path: '/design/patterns/form-field-pattern' },
      ]}
    />
  );
}
