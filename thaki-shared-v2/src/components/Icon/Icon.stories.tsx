import { IconHome, IconShare } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react';
import { RTLProvider } from '../../services';
import { Icon } from './Icon';
import type { IconProps, IconWeight } from './types';

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
#### 사용 정책
- **라이브러리**: Tabler Icons (\`@tabler/icons-react\`)를 사용합니다.
- **Stroke**: 기본 \`stroke={1.5}\` (weight="regular").
- **Canonical 명칭**: \`ExternalLinkIcon\`, \`CreateIcon\`, \`NetworksIcon\`를 사용합니다.
- **금지 패턴**: \`<Icon><SearchIcon /></Icon>\` 같은 중첩 사용 금지, hex color 직접 지정 금지.
- **접근성**: 아이콘만 사용하는 버튼에는 반드시 \`aria-label\`을 지정합니다.

        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const s = {
  page: {
    padding: 32,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 40,
  },
  section: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--semantic-color-text)',
    borderBottom: '1px solid var(--semantic-color-border)',
    paddingBottom: 8,
  },
  row: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end' as const,
  },
  cell: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: 6,
    minWidth: 64,
  },
  label: {
    fontSize: 11,
    color: 'var(--semantic-color-textMuted)',
    textAlign: 'center' as const,
  },
};

const VARIANTS: Array<{ name: IconProps['variant']; dark?: boolean }> = [
  { name: 'primary' },
  { name: 'secondary' },
  { name: 'success' },
  { name: 'warning' },
  { name: 'error' },
  { name: 'info' },
  { name: 'muted' },
  { name: 'inverse', dark: true },
];

const SIZES: Array<IconProps['size']> = ['xs', 'sm', 'md', 'lg', 'xl', 48];
const WEIGHTS: IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

export const Default: Story = {
  render: () => (
    <div style={s.page}>
      {/* Variant */}
      <div style={s.section}>
        <div style={s.title}>Variant</div>
        <div style={s.row}>
          {VARIANTS.map(({ name, dark }) => (
            <div
              key={String(name)}
              style={{
                ...s.cell,
                ...(dark && {
                  backgroundColor: 'var(--semantic-color-text)',
                  padding: '8px 12px',
                  borderRadius: 8,
                }),
              }}
            >
              <Icon variant={name} size="lg">
                <IconHome />
              </Icon>
              <div
                style={{
                  ...s.label,
                  ...(dark && { color: 'var(--semantic-color-textInverse)' }),
                }}
              >
                {String(name)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={s.section}>
        <div style={s.title}>Size</div>
        <div style={s.row}>
          {SIZES.map((size) => (
            <div key={String(size)} style={s.cell}>
              <Icon size={size}>
                <IconHome />
              </Icon>
              <div style={s.label}>{typeof size === 'number' ? `${size}px` : size}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div style={s.section}>
        <div style={s.title}>Weight</div>
        <div style={s.row}>
          {WEIGHTS.map((weight) => (
            <div key={weight} style={s.cell}>
              <Icon variant="primary" weight={weight} size="xl">
                <IconHome />
              </Icon>
              <div style={s.label}>{weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RTL */}
      <div style={s.section}>
        <div style={s.title}>RTL</div>
        <div style={{ display: 'flex', gap: 48 }}>
          <RTLProvider initialRTL={false}>
            <div style={s.cell}>
              <Icon variant="primary" size="lg">
                <IconShare />
              </Icon>
              <div style={s.label}>LTR</div>
            </div>
          </RTLProvider>
          <RTLProvider initialRTL>
            <div style={s.cell}>
              <Icon variant="primary" size="lg">
                <IconShare />
              </Icon>
              <div style={s.label}>RTL (mirrored)</div>
            </div>
          </RTLProvider>
        </div>
      </div>
    </div>
  ),
};
