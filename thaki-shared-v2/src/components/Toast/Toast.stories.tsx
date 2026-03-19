import type { Meta, StoryObj } from '@storybook/react';

import { ComputeAppIcon } from '../AppIcon';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Overlay/Notification Center',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `토스트는 작업 성공/실패와 같은 피드백을 간결하게 전달하는 알림 카드입니다.

## 주요 특징

- **간결한 디자인**: 16x16 아이콘 + 메시지 + 닫기 버튼
- **확장 가능한 설명**: 상세 설명이 있을 때 토글 버튼으로 확장/축소 가능
- **접근성 지원**: ARIA 속성을 통한 스크린 리더 지원
- **타입별 스타일링**: positive(초록)/negative(주황) 타입에 따른 시각적 구분
- **타임스탬프**: 선택적으로 타임스탬프 표시 (hh:mm 형식)
- **리소스 이름**: 선택적으로 프로젝트명 등 리소스 이름 배지 표시

## 사용 시나리오

- API 요청 성공/실패 피드백
- 사용자 액션 결과 알림
- 시스템 상태 변경 알림
- 오류 메시지 표시 (상세 에러 정보는 description으로 표시)

## 접근성 고려사항

- \`role="status"\` (positive) 또는 \`role="alert"\` (negative) 설정
- \`aria-live\` 속성으로 스크린 리더에 동적 콘텐츠 변경 알림
- 확장 버튼에 \`aria-expanded\` 속성으로 상태 전달`,
      },
    },
  },
  argTypes: {
    type: {
      description: '토스트 타입 (성공/실패)',
      control: 'select',
      options: ['positive', 'negative'],
    },
    message: {
      description: '토스트 메시지',
      control: 'text',
    },
    description: {
      description: '상세 설명 (확장 가능한 영역에 표시, 선택사항)',
      control: 'text',
    },
    timestamp: {
      description: '타임스탬프 (hh:mm 형식, 선택사항)',
      control: 'text',
    },
    resourceName: {
      description: '리소스 이름 (프로젝트명 등, 배지 형태로 표시)',
      control: 'text',
    },
  },
  args: {
    message: 'Instance "web-server-01" created successfully.',
    handleDismiss: () => {
      console.log('Toast dismissed');
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Positive: Story = {
  args: {
    type: 'positive',
    message: 'Instance "web-server-01" created successfully.',
  },
  parameters: {
    docs: {
      description: {
        story: '성공적인 작업 완료를 나타내는 positive 타입의 토스트입니다.',
      },
    },
  },
};

export const Negative: Story = {
  args: {
    type: 'negative',
    message: 'Failed to create instance "web-server-01".',
  },
  parameters: {
    docs: {
      description: {
        story: '작업 실패나 오류를 나타내는 negative 타입의 토스트입니다.',
      },
    },
  },
};

export const WithTimestamp: Story = {
  args: {
    type: 'positive',
    message: 'Instance "web-server-01" created successfully.',
    timestamp: Date.now(),
  },
  parameters: {
    docs: {
      description: {
        story: '타임스탬프가 포함된 토스트입니다.',
      },
    },
  },
};

export const WithResourceName: Story = {
  args: {
    type: 'positive',
    message: 'Instance "web-server-01" created successfully.',
    resourceName: 'Proj1',
  },
  parameters: {
    docs: {
      description: {
        story:
          '리소스 이름(프로젝트명)이 포함된 토스트입니다. 메시지 아래에 배지 형태로 표시됩니다.',
      },
    },
  },
};

export const WithAppIcon: Story = {
  args: {
    type: 'positive',
    message: 'Instance "web-server-01" created successfully.',
    timestamp: Date.now(),
    appIcon: <ComputeAppIcon size={16} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          '타임스탬프 및 앱 아이콘이 포함된 토스트입니다. 각 앱(Compute, Container, IAM 등)에서 자신의 아이콘을 주입할 수 있습니다.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    type: 'negative',
    message:
      'Failed to create instance "web-server-01" due to insufficient quota. Please contact your administrator to increase the quota or delete unused resources.',
  },
  parameters: {
    docs: {
      description: {
        story: '긴 메시지를 포함한 토스트의 레이아웃을 확인할 수 있습니다.',
      },
    },
  },
};

export const MinimalContent: Story = {
  args: {
    type: 'positive',
    message: 'Operation completed.',
  },
  parameters: {
    docs: {
      description: {
        story: '최소한의 내용으로 구성된 토스트입니다.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    type: 'negative',
    message: 'Failed to create instance "web-server-01".',
    description:
      'Error: Insufficient quota. The requested operation would exceed your CPU quota of 10 vCPUs. Please delete unused resources or contact your administrator to request a quota increase.',
  },
  parameters: {
    docs: {
      description: {
        story:
          '상세 설명이 포함된 토스트입니다. 메시지 오른쪽의 "View Detail" 버튼을 클릭하면 추가 설명을 확인할 수 있습니다.',
      },
    },
  },
};

export const WithDescriptionAndTimestamp: Story = {
  args: {
    type: 'negative',
    message: 'Instance operation failed.',
    description:
      'The instance could not be started due to a hypervisor error. Error code: HYPERVISOR_UNAVAILABLE. Please try again later or contact support.',
    timestamp: Date.now(),
    appIcon: <ComputeAppIcon size={16} />,
  },
  parameters: {
    docs: {
      description: {
        story: '상세 설명, 타임스탬프, 앱 아이콘이 모두 포함된 토스트입니다.',
      },
    },
  },
};

export const FullFeatured: Story = {
  args: {
    type: 'positive',
    message: 'Instance "web-server-01" created successfully.',
    resourceName: 'Production',
    description:
      'The instance has been created with 4 vCPUs, 8GB RAM, and 100GB storage. It will be available shortly.',
    timestamp: Date.now(),
    appIcon: <ComputeAppIcon size={16} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          '리소스 이름, 상세 설명, 타임스탬프, 앱 아이콘이 모두 포함된 토스트입니다.',
      },
    },
  },
};
