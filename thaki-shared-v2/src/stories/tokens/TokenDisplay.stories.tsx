import type { Meta, StoryObj } from '@storybook/react';
import { TokenDisplay } from './TokenDisplay';

const meta: Meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '프로젝트에서 사용하는 모든 디자인 토큰을 시각적으로 확인할 수 있습니다. 각 스토리별로 특정 타입의 토큰만 필터링하여 볼 수 있으며, 상단 툴바에서 테마를 변경하면 실시간으로 토큰 값이 업데이트됩니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllTokens: Story = {
  name: '전체 디자인 토큰',
  render: () => <TokenDisplay title="Design Tokens" />,
  parameters: {
    docs: {
      description: {
        story:
          '프로젝트에서 사용 가능한 모든 디자인 토큰을 시각적으로 확인할 수 있습니다. 상단 툴바에서 테마를 변경하면 실시간으로 토큰 값이 업데이트됩니다. Component 토큰은 이름과 값에 따라 자동으로 적절한 미리보기가 제공됩니다.',
      },
    },
  },
};

export const ColorTokens: Story = {
  name: '색상 토큰',
  render: () => <TokenDisplay title="Color Tokens" filterType="color" />,
  parameters: {
    docs: {
      description: {
        story:
          '색상 관련 토큰만 표시합니다. Component 토큰 중 색상 값을 가진 것들도 함께 표시됩니다. 테마 변경 시 색상 값의 변화를 확인할 수 있습니다.',
      },
    },
  },
};

export const FontTokens: Story = {
  name: '폰트 토큰',
  render: () => <TokenDisplay title="Font Tokens" filterType="font" />,
  parameters: {
    docs: {
      description: {
        story:
          '폰트 관련 토큰만 표시합니다. 폰트 패밀리, 크기, 굵기, 줄 간격 등을 확인할 수 있습니다.',
      },
    },
  },
};

export const SpacingTokens: Story = {
  name: '간격 토큰',
  render: () => <TokenDisplay title="Spacing Tokens" filterType="space" />,
  parameters: {
    docs: {
      description: {
        story:
          '간격(여백) 관련 토큰만 표시합니다. Component 토큰 중 padding, margin이 포함된 것들도 함께 표시됩니다. 각 토큰의 실제 크기를 시각적으로 확인할 수 있습니다.',
      },
    },
  },
};

export const RadiusTokens: Story = {
  name: '둥근모서리 토큰',
  render: () => <TokenDisplay title="Radius Tokens" filterType="radius" />,
  parameters: {
    docs: {
      description: {
        story:
          '둥근 모서리(border-radius) 관련 토큰만 표시합니다. Component 토큰 중 radius가 포함된 것들도 함께 표시됩니다. 각 토큰의 라운드 정도를 시각적으로 확인할 수 있습니다.',
      },
    },
  },
}; 