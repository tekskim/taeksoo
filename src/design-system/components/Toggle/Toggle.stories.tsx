import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Toggle 컴포넌트

ON/OFF 두 가지 상태를 전환하는 스위치 컴포넌트입니다.

### 사용 시기
- 설정 켜기/끄기
- 기능 활성화/비활성화
- 즉시 적용되는 설정 변경

### Checkbox vs Toggle
| | Checkbox | Toggle |
|---|---|---|
| **사용 시점** | 폼 제출 시 적용 | 즉시 적용 |
| **다중 선택** | 가능 | 단일 설정 |
| **시각적 피드백** | 체크 마크 | 슬라이드 애니메이션 |

### 접근성
- \`role="switch"\` 적용
- 키보드(Space)로 토글 가능
- 스크린리더에 ON/OFF 상태 전달

### 예시
\`\`\`tsx
import { Toggle } from '@thaki/tds';

// 기본 사용
<Toggle label="알림 켜기" />

// Controlled
<Toggle 
  checked={enabled} 
  onChange={(e) => setEnabled(e.target.checked)}
  label="다크 모드"
/>

// 설명 포함
<Toggle 
  label="자동 저장"
  description="변경사항을 자동으로 저장합니다"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '토글 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: '라벨 아래 설명 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    checked: {
      control: 'boolean',
      description: '토글 상태 (controlled)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: '초기 토글 상태 (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '토글 크기',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// Basic
export const Default: Story = {
  args: {
    label: 'Toggle label',
  },
};

// Checked
export const Checked: Story = {
  args: {
    label: 'Enabled',
    defaultChecked: true,
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Switch between light and dark theme',
  },
};

// Without Label
export const WithoutLabel: Story = {
  args: {},
};

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

// Controlled
export const Controlled: Story = {
  render: function ControlledToggle() {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Toggle
          label="Notifications"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          Status: <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
        </p>
      </div>
    );
  },
};

// Settings Example
export const SettingsExample: Story = {
  render: function SettingsExample() {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    const handleChange = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[320px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
        <h3 className="text-[14px] font-semibold">Settings</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Push notifications</span>
            <Toggle
              checked={settings.notifications}
              onChange={() => handleChange('notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Dark mode</span>
            <Toggle
              checked={settings.darkMode}
              onChange={() => handleChange('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Auto-save</span>
            <Toggle
              checked={settings.autoSave}
              onChange={() => handleChange('autoSave')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[12px]">Analytics</span>
            <Toggle
              checked={settings.analytics}
              onChange={() => handleChange('analytics')}
            />
          </div>
        </div>
      </div>
    );
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Default (off)" />
      <Toggle label="Default (on)" defaultChecked />
      <Toggle label="Disabled (off)" disabled />
      <Toggle label="Disabled (on)" disabled defaultChecked />
      <Toggle
        label="With description"
        description="This is a helpful description text."
      />
    </div>
  ),
};
