import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component: `
## 컬러 토큰

TDS에서 사용하는 시맨틱 컬러 토큰입니다.  
CSS 변수로 정의되어 있어 다크 모드 자동 지원됩니다.

### 사용법
\`\`\`css
/* CSS에서 */
.element {
  color: var(--color-text-default);
  background: var(--color-surface-default);
}
\`\`\`

\`\`\`tsx
/* Tailwind에서 */
<div className="text-[var(--color-text-default)] bg-[var(--color-surface-default)]">
  ...
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ColorSwatch = ({ 
  name, 
  variable, 
  description 
}: { 
  name: string; 
  variable: string; 
  description?: string;
}) => (
  <div className="flex items-center gap-4 py-2">
    <div 
      className="w-12 h-12 rounded-lg border border-[var(--color-border-default)] shrink-0"
      style={{ background: `var(${variable})` }}
    />
    <div className="flex-1">
      <div className="font-mono text-sm">{variable}</div>
      <div className="text-xs text-[var(--color-text-muted)]">{name}</div>
      {description && (
        <div className="text-xs text-[var(--color-text-subtle)] mt-0.5">{description}</div>
      )}
    </div>
  </div>
);

const ColorSection = ({ 
  title, 
  colors 
}: { 
  title: string; 
  colors: Array<{ name: string; variable: string; description?: string }>;
}) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold mb-4 pb-2 border-b border-[var(--color-border-default)]">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {colors.map((color) => (
        <ColorSwatch key={color.variable} {...color} />
      ))}
    </div>
  </div>
);

export const TextColors: Story = {
  render: () => (
    <ColorSection
      title="Text Colors"
      colors={[
        { name: 'Default', variable: '--color-text-default', description: '기본 텍스트' },
        { name: 'Muted', variable: '--color-text-muted', description: '보조 텍스트' },
        { name: 'Subtle', variable: '--color-text-subtle', description: '약한 텍스트' },
        { name: 'Disabled', variable: '--color-text-disabled', description: '비활성 텍스트' },
        { name: 'Inverse', variable: '--color-text-inverse', description: '반전 텍스트' },
      ]}
    />
  ),
};

export const SurfaceColors: Story = {
  render: () => (
    <ColorSection
      title="Surface Colors"
      colors={[
        { name: 'Default', variable: '--color-surface-default', description: '기본 배경' },
        { name: 'Subtle', variable: '--color-surface-subtle', description: '약한 배경' },
        { name: 'Muted', variable: '--color-surface-muted', description: '보조 배경' },
        { name: 'Overlay', variable: '--color-surface-overlay', description: '오버레이 배경' },
      ]}
    />
  ),
};

export const BorderColors: Story = {
  render: () => (
    <ColorSection
      title="Border Colors"
      colors={[
        { name: 'Default', variable: '--color-border-default', description: '기본 테두리' },
        { name: 'Subtle', variable: '--color-border-subtle', description: '약한 테두리' },
        { name: 'Strong', variable: '--color-border-strong', description: '강한 테두리' },
        { name: 'Focus', variable: '--color-border-focus', description: '포커스 링' },
      ]}
    />
  ),
};

export const StateColors: Story = {
  render: () => (
    <ColorSection
      title="State Colors"
      colors={[
        { name: 'Info', variable: '--color-state-info', description: '정보 (파란색)' },
        { name: 'Success', variable: '--color-state-success', description: '성공 (초록색)' },
        { name: 'Warning', variable: '--color-state-warning', description: '경고 (노란색)' },
        { name: 'Danger', variable: '--color-state-danger', description: '위험/에러 (빨간색)' },
      ]}
    />
  ),
};

export const ActionColors: Story = {
  render: () => (
    <ColorSection
      title="Action Colors"
      colors={[
        { name: 'Primary', variable: '--color-action-primary', description: '주요 액션 색상' },
        { name: 'Primary Hover', variable: '--color-action-primary-hover', description: '호버 시' },
      ]}
    />
  ),
};

export const AllColors: Story = {
  name: 'All Colors',
  render: () => (
    <div className="max-w-3xl">
      <ColorSection
        title="Text Colors"
        colors={[
          { name: 'Default', variable: '--color-text-default' },
          { name: 'Muted', variable: '--color-text-muted' },
          { name: 'Subtle', variable: '--color-text-subtle' },
          { name: 'Disabled', variable: '--color-text-disabled' },
        ]}
      />
      <ColorSection
        title="Surface Colors"
        colors={[
          { name: 'Default', variable: '--color-surface-default' },
          { name: 'Subtle', variable: '--color-surface-subtle' },
          { name: 'Muted', variable: '--color-surface-muted' },
        ]}
      />
      <ColorSection
        title="Border Colors"
        colors={[
          { name: 'Default', variable: '--color-border-default' },
          { name: 'Subtle', variable: '--color-border-subtle' },
          { name: 'Strong', variable: '--color-border-strong' },
        ]}
      />
      <ColorSection
        title="State Colors"
        colors={[
          { name: 'Info', variable: '--color-state-info' },
          { name: 'Success', variable: '--color-state-success' },
          { name: 'Warning', variable: '--color-state-warning' },
          { name: 'Danger', variable: '--color-state-danger' },
        ]}
      />
    </div>
  ),
};
