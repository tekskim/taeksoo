import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button } from '../Button';
import Layout from '../Layout';
import Portal from './Portal';

// Portal을 테스트하기 위한 래퍼 컴포넌트
const PortalDemo = ({ direction, matchWidth, position }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Layout.Container padding="lg">
      <Button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '포탈 닫기' : '포탈 열기'}
      </Button>

      {isOpen && (
        <Portal
          triggerRef={triggerRef}
          direction={direction}
          matchWidth={matchWidth}
          position={position}
        >
          <div
            style={{
              background: 'var(--semantic-color-surface)',
              border: '1px solid var(--semantic-color-border)',
              borderRadius: 'var(--semantic-control-radius)',
              padding: 'var(--semantic-space-md)',
              boxShadow: 'var(--semantic-shadow-dropdown)',
              minWidth: '200px',
            }}
          >
            <p>이것은 포탈로 렌더링된 내용입니다.</p>
            <p>트리거 버튼 아래에 정확하게 위치합니다.</p>
          </div>
        </Portal>
      )}
    </Layout.Container>
  );
};

const meta: Meta<typeof Portal> = {
  title: 'Overlay/Popover',
  component: Portal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Portal

Portal은 DOM 트리에서 분리된 위치에 컨텐츠를 렌더링하는 컴포넌트입니다.

## 스타일 옵션
### 방향 (Direction)
- **below**: 아래쪽으로 렌더링 (기본값)
- **above**: 위쪽으로 렌더링
- **자동 조정**: 화면 경계에 따른 스마트 포지셔닝

### 크기
- **matchWidth**: 트리거 요소와 동일한 너비
- **자유 크기**: 컨텐츠 크기에 따른 자동 조정
- **커스텀 위치**: position 객체로 세밀한 조정

## 주요 기능
- **DOM 분리 렌더링**: document.body에 직접 렌더링
- **z-index 문제 해결**: 부모 컨테이너 제약에서 자유
- **실시간 위치 추적**: 스크롤/리사이즈 시 자동 재계산
- **성능 최적화**: ResizeObserver 및 이벤트 최적화

## 사용 가이드라인
### 언제 사용하나요?
- 드롭다운, 툴팁, 모달 등 오버레이 UI
- 부모 컨테이너의 overflow 제약을 벗어나야 할 때
- z-index 스택 문제를 해결해야 할 때

### 언제 사용하지 말아야 하나요?
- 단순한 인라인 컨텐츠
- 부모-자식 관계가 중요한 경우
- SEO가 중요한 컨텐츠

### 사용 팁
- 트리거 요소의 ref를 정확히 전달
- 적절한 gap 값으로 간격 조정
- matchWidth로 일관된 너비 유지
- position 객체로 세밀한 위치 조정

## 접근성
- **포커스 관리**: 자동 포커스 이동 지원
- **키보드 지원**: Esc 키로 닫기 지원
- **스크린 리더**: 적절한 ARIA 속성 전달
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['above', 'below'],
      description: '포탈이 열릴 방향',
    },
    matchWidth: {
      control: 'boolean',
      description: '포탈의 너비를 트리거 요소에 맞출지 여부',
    },
    position: {
      control: 'object',
      description: '포탈의 위치 조정 옵션 (top, bottom, left, right)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <PortalDemo {...args} />,
  args: {
    direction: 'bottom',
    matchWidth: true,
  },
};

// 모든 방향 테스트
export const AllDirections: Story = {
  render: () => (
    <Layout.Container padding="lg">
      <Layout.VStack gap="lg">
        <Layout.HStack gap="lg" justify="center">
          <PortalDemo direction="top-start" matchWidth={false} />
          <PortalDemo direction="top" matchWidth={false} />
          <PortalDemo direction="top-end" matchWidth={false} />
        </Layout.HStack>

        <Layout.HStack gap="lg" justify="between">
          <Layout.VStack gap="md">
            <PortalDemo direction="left-top" matchWidth={false} />
            <PortalDemo direction="left" matchWidth={false} />
            <PortalDemo direction="left-bottom" matchWidth={false} />
          </Layout.VStack>

          <div style={{ padding: 'var(--semantic-space-xl)' }}>중앙 영역</div>

          <Layout.VStack gap="md">
            <PortalDemo direction="right-top" matchWidth={false} />
            <PortalDemo direction="right" matchWidth={false} />
            <PortalDemo direction="right-bottom" matchWidth={false} />
          </Layout.VStack>
        </Layout.HStack>

        <Layout.HStack gap="lg" justify="center">
          <PortalDemo direction="bottom-start" matchWidth={false} />
          <PortalDemo direction="bottom" matchWidth={false} />
          <PortalDemo direction="bottom-end" matchWidth={false} />
        </Layout.HStack>
      </Layout.VStack>
    </Layout.Container>
  ),
};

// 위치 오프셋 테스트
export const WithPositionOffset: Story = {
  render: () => (
    <Layout.Container padding="lg">
      <Layout.HStack gap="lg" justify="center">
        <PortalDemo direction="bottom" matchWidth={false} position={{ top: 10 }} />
        <PortalDemo direction="bottom" matchWidth={false} position={{ left: 20 }} />
        <PortalDemo direction="bottom" matchWidth={false} position={{ top: 10, left: 20 }} />
      </Layout.HStack>
    </Layout.Container>
  ),
};

// 너비 매칭 테스트
export const WidthMatching: Story = {
  render: () => (
    <Layout.Container padding="lg">
      <Layout.VStack gap="md">
        <div>
          <h3>matchWidth: true (기본값)</h3>
          <PortalDemo direction="bottom" matchWidth={true} />
        </div>
        <div>
          <h3>matchWidth: false</h3>
          <PortalDemo direction="bottom" matchWidth={false} />
        </div>
      </Layout.VStack>
    </Layout.Container>
  ),
};
