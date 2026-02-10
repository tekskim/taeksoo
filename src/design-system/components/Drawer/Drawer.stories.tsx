import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Drawer 컴포넌트

화면 측면에서 슬라이드되어 나타나는 패널 컴포넌트입니다.

### 사용 시기
- 상세 정보 표시
- 설정/편집 폼
- 네비게이션 메뉴 (모바일)
- 필터 패널

### Modal vs Drawer
| | Modal | Drawer |
|---|---|---|
| **위치** | 화면 중앙 | 측면 (좌/우) |
| **크기** | 고정 또는 반응형 | 높이 100% |
| **사용 시점** | 중요한 결정 | 상세 정보, 폼 |
| **배경** | 어두운 오버레이 | 어두운 오버레이 |

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (Drawer 내에서만 Tab 이동)
- aria-modal, role="dialog" 자동 적용
- 닫기 버튼 제공

### 예시
\`\`\`tsx
import { Drawer } from '@thaki/tds';

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="설정"
  side="right"
  width={400}
  footer={
    <Button onClick={handleSave}>저장</Button>
  }
>
  <p>Drawer 내용</p>
</Drawer>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Drawer 열림 상태',
      table: {
        type: { summary: 'boolean' },
      },
    },
    title: {
      control: 'text',
      description: 'Drawer 헤더 제목',
      table: {
        type: { summary: 'string' },
      },
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Drawer 표시 위치',
      table: {
        type: { summary: '"left" | "right"' },
        defaultValue: { summary: '"right"' },
      },
    },
    width: {
      control: 'number',
      description: 'Drawer 너비 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '320' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: '헤더에 닫기 버튼 표시',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경 클릭시 닫기 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'ESC 키로 닫기 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    footer: {
      description: 'Drawer 하단 고정 영역 (버튼 등)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// Basic Drawer
export const Default: Story = {
  render: function DefaultDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
          <p className="text-body-md text-[var(--color-text-muted)]">
            This is the drawer content. You can put any content here.
          </p>
        </Drawer>
      </>
    );
  },
};

// Left Side Drawer
export const LeftSide: Story = {
  render: function LeftDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Navigation"
          side="left"
          width={280}
        >
          <nav className="flex flex-col gap-[var(--primitive-spacing-2)]">
            <a
              href="#"
              className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]"
            >
              Projects
            </a>
            <a
              href="#"
              className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]"
            >
              Settings
            </a>
          </nav>
        </Drawer>
      </>
    );
  },
};

// With Footer
export const WithFooter: Story = {
  render: function FooterDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer with Footer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Item"
          footer={
            <div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <Input label="Name" placeholder="Enter name" fullWidth />
            <Input label="Description" placeholder="Enter description" fullWidth />
          </div>
        </Drawer>
      </>
    );
  },
};

// Edit Form Example
export const EditForm: Story = {
  render: function EditFormDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Settings</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Instance Settings"
          width={400}
          footer={
            <div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
            <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
              <h3 className="text-label-lg text-[var(--color-text-default)]">General</h3>
              <Input label="Instance Name" defaultValue="my-instance-01" fullWidth />
              <Select
                label="Region"
                options={[
                  { value: 'us-east', label: 'US East' },
                  { value: 'us-west', label: 'US West' },
                  { value: 'eu-west', label: 'EU West' },
                ]}
                defaultValue="us-east"
                fullWidth
              />
            </div>

            <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
              <h3 className="text-label-lg text-[var(--color-text-default)]">Features</h3>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Auto-scaling</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Monitoring</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Backup</span>
                <Toggle />
              </div>
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

// Wide Drawer
export const WideDrawer: Story = {
  render: function WideDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Wide Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Detailed View" width={600}>
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <p className="text-body-md text-[var(--color-text-muted)]">
              This drawer is wider than the default to accommodate more content.
            </p>
            <div className="grid grid-cols-2 gap-[var(--primitive-spacing-4)]">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
              <Input label="Email" placeholder="john@example.com" />
              <Input label="Phone" placeholder="+1 234 567 890" />
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

// No Backdrop Close
export const NoBackdropClose: Story = {
  render: function NoBackdropDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Protected Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Form"
          closeOnBackdropClick={false}
          closeOnEscape={false}
          footer={
            <div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Discard
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>
          }
        >
          <p className="text-body-md text-[var(--color-text-muted)]">
            This drawer can only be closed by clicking the buttons. Clicking the backdrop or
            pressing ESC won't close it.
          </p>
        </Drawer>
      </>
    );
  },
};

// Without Title
export const NoTitle: Story = {
  render: function NoTitleDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-[var(--primitive-spacing-8)]">
            <h2 className="text-heading-h5 mb-[var(--primitive-spacing-2)]">Custom Header</h2>
            <p className="text-body-md text-[var(--color-text-muted)]">
              This drawer doesn't have a built-in title
            </p>
          </div>
        </Drawer>
      </>
    );
  },
};

// Scrollable Content
export const ScrollableContent: Story = {
  render: function ScrollableDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Scrollable Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Long Content"
          footer={
            <Button onClick={() => setIsOpen(false)} fullWidth>
              Close
            </Button>
          }
        >
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="p-[var(--primitive-spacing-4)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]"
              >
                <h3 className="text-label-lg">Item {i + 1}</h3>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  This is the description for item {i + 1}. It contains some text to demonstrate
                  scrollable content.
                </p>
              </div>
            ))}
          </div>
        </Drawer>
      </>
    );
  },
};
