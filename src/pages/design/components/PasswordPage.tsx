import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Password, VStack } from '@/design-system';

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

function PasswordPreview() {
  const [value, setValue] = useState('');
  return (
    <VStack gap={4} className="w-full max-w-[320px]">
      <Password
        placeholder="Enter password"
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
      description="Password input with show/hide toggle. Supports error state, helper text, and size variants."
      whenToUse={['사용자 비밀번호 입력이 필요할 때', '비밀번호 확인 입력 필드에 사용']}
      whenNotToUse={['일반 텍스트 입력 → Input 사용', '검색 입력 → SearchInput 사용']}
      preview={
        <ComponentPreview
          code={`<Password
  placeholder="Enter password"
  fullWidth
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
        >
          <PasswordPreview />
        </ComponentPreview>
      }
      props={passwordProps}
      usage={{
        code: `import { Password } from '@/design-system';

<Password
  placeholder="Enter password"
  error="Password must be at least 8 characters"
  fullWidth
/>`,
      }}
      relatedLinks={[
        { label: 'Input', path: '/design/components/input' },
        { label: 'FormField', path: '/design/patterns/form-field-pattern' },
      ]}
    />
  );
}
