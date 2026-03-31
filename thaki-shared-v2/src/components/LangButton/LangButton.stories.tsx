import type { Meta, StoryObj } from '@storybook/react';
import LangButton from './LangButton';

const meta = {
  title: 'Form/LangButton',
  component: LangButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onLanguageChange: { action: 'language changed' },
  },
} satisfies Meta<typeof LangButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 언어 선택 버튼
 */
export const Default: Story = {
  args: {
    onLanguageChange: (lang) => {
      console.log('Language changed to:', lang);
    },
  },
};

/**
 * 다크 배경에서의 언어 선택 버튼
 */
export const OnDarkBackground: Story = {
  args: {
    onLanguageChange: (lang) => {
      console.log('Language changed to:', lang);
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '2rem',
          backgroundColor: 'color-mix(in srgb, var(--semantic-color-text) 70%, transparent)',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
