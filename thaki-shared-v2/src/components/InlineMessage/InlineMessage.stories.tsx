import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import InlineMessage from './InlineMessage';

const meta: Meta<typeof InlineMessage> = {
  title: 'Feedback/Inline Message',
  component: InlineMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: '메시지 타입',
    },
    message: {
      control: 'text',
      description: '메시지 내용',
    },
    closable: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부',
    },
    expandable: {
      control: 'boolean',
      description: '확장/축소 기능 표시 여부',
    },
    timestamp: {
      control: 'text',
      description: '우측 보조 정보(예: 에러 발생 시각)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본 InlineMessage 컴포넌트 - 모든 타입
 */
export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span
          style={{
            width: '80px',
            textAlign: 'right',
            fontSize: '14px',
            color: 'var(--semantic-color-textMuted)',
            textTransform: 'lowercase',
          }}
        >
          success
        </span>
        <div style={{ flex: 1 }}>
          <InlineMessage
            type="success"
            message="Used for completed or normal operations."
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span
          style={{
            width: '80px',
            textAlign: 'right',
            fontSize: '14px',
            color: 'var(--semantic-color-textMuted)',
            textTransform: 'lowercase',
          }}
        >
          warning
        </span>
        <div style={{ flex: 1 }}>
          <InlineMessage
            type="warning"
            message="Used when attention is needed but not critical."
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span
          style={{
            width: '80px',
            textAlign: 'right',
            fontSize: '14px',
            color: 'var(--semantic-color-textMuted)',
            textTransform: 'lowercase',
          }}
        >
          error
        </span>
        <div style={{ flex: 1 }}>
          <InlineMessage
            type="error"
            message="Used for failed actions or system issues."
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span
          style={{
            width: '80px',
            textAlign: 'right',
            fontSize: '14px',
            color: 'var(--semantic-color-textMuted)',
            textTransform: 'lowercase',
          }}
        >
          info
        </span>
        <div style={{ flex: 1 }}>
          <InlineMessage
            type="info"
            message="Used for general or non-critical updates."
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * 개별 타입 예시
 */
export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <InlineMessage
        type="success"
        message="Used for completed or normal operations."
      />
      <InlineMessage
        type="info"
        message="Used for general or non-critical updates."
      />
      <InlineMessage
        type="warning"
        message="Used when attention is needed but not critical."
      />
      <InlineMessage
        type="error"
        message="Used for failed actions or system issues."
      />
    </div>
  ),
};

/**
 * 닫기 버튼이 있는 메시지
 */
export const WithCloseButton: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <button type="button" onClick={() => setVisible(true)}>
          메시지 다시 표시
        </button>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InlineMessage
          type="success"
          message="Operation completed successfully."
          closable
          onClose={() => setVisible(false)}
        />
        <InlineMessage
          type="info"
          message="Click the close button to hide this message."
          closable
          onClose={() => alert('Info message closed')}
        />
        <InlineMessage
          type="warning"
          message="Warning: This action cannot be undone."
          closable
          onClose={() => alert('Warning dismissed')}
        />
        <InlineMessage
          type="error"
          message="Error: Failed to save changes."
          closable
          onClose={() => alert('Error dismissed')}
        />
      </div>
    );
  },
};

/**
 * 확장 가능한 메시지 (긴 텍스트)
 */
export const Expandable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <InlineMessage
        type="warning"
        message="Make sure the filesystem inside the instance is unmounted before detaching. Detaching a volume while the instance is running may cause data corruption or data loss. Always verify that the volume is not in use before proceeding with this operation."
        expandable
      />
      <InlineMessage
        type="error"
        message="Failed to create instance. The selected flavor does not have enough resources available. Please choose a smaller flavor or contact your administrator to increase quota limits. Error code: INSUFFICIENT_RESOURCES (ERR_1234)"
        expandable
      />
    </div>
  ),
};

/**
 * 확장 가능 + 닫기 버튼
 */
export const ExpandableWithClose: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <button type="button" onClick={() => setVisible(true)}>
          메시지 다시 표시
        </button>
      );
    }

    return (
      <InlineMessage
        type="warning"
        message="Make sure the filesystem inside the instance is unmounted before detaching. Detaching a volume while the instance is running may cause data corruption or data loss. Always verify that the volume is not in use before proceeding with this operation. For more information, please refer to the documentation or contact support."
        expandable
        closable
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * Figma 기준: 에러 메시지 + 우측 시각 + 확장/축소
 */
export const ExpandableWithTimestamp: Story = {
  render: () => (
    <InlineMessage
      type="error"
      message="ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24."
      timestamp="Nov-11-2025 02:51 PM"
      expandable
    />
  ),
};

/**
 * 긴 텍스트 (expandable 없이)
 */
export const LongText: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '600px',
      }}
    >
      <InlineMessage
        type="info"
        message="This is a very long message that will wrap to multiple lines. The text should wrap naturally without any ellipsis since expandable is not enabled."
      />
      <InlineMessage
        type="warning"
        message="Make sure the filesystem inside the instance is unmounted before detaching. Detaching a volume while the instance is running may cause data corruption."
      />
    </div>
  ),
};

/**
 * 짧은 메시지
 */
export const ShortMessage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <InlineMessage type="success" message="Success!" />
      <InlineMessage type="error" message="Failed." closable />
    </div>
  ),
};
