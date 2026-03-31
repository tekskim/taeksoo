import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import Layout from '../Layout';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Tooltip

Tooltip은 마우스 호버나 키보드 포커스 시 추가 정보를 제공하는 컴포넌트입니다.

## 주요 기능
- **자동 위치 조정**: 화면 경계에 따른 스마트 포지셔닝
- **Portal 렌더링**: z-index 문제 해결 및 overflow 제약 해제
- **접근성 지원**: ARIA 속성 및 키보드 네비게이션
- **12방향 화살표**: top/bottom/left/right 계열 방향 모두 전용 화살표를 지원

## 사용 가이드라인
### 언제 사용하나요?
- 아이콘이나 버튼의 기능 설명
- 폼 필드의 도움말 정보
- 축약된 텍스트의 전체 내용 표시
- 복잡한 UI 요소의 사용법 안내

### 언제 사용하지 말아야 하나요?
- 항상 보여야 하는 필수 정보
- 긴 문서나 복잡한 내용 (Modal 사용 권장)
- 터치 디바이스에서 복잡한 상호작용
- 빠른 사용자 액션을 방해하는 경우

## 접근성
- **키보드 지원**: Tab 키로 포커스 이동 시 자동 표시
- **스크린 리더**: aria-describedby, role="tooltip" 지원
- **포커스 관리**: tabIndex={0}으로 키보드 접근성 보장
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: '툴팁에 표시할 내용',
    },
    direction: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom',
      ],
      description: '툴팁이 표시될 방향 (Portal Direction 타입)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: '이것은 툴팁 내용입니다',
    direction: 'top',
  },
  render: (args) => (
    <Tooltip content={args.content} direction={args.direction}>
      <Button variant="primary">마우스를 올려보세요</Button>
    </Tooltip>
  ),
};

// 12가지 방향 전체 테스트
export const AllDirections: Story = {
  render: () => (
    <Layout.Container padding="lg">
      <Layout.VStack gap="lg">
        <Layout.HStack gap="lg" justify="center">
          <Tooltip content="Top Start" direction="top-start">
            <Button variant="secondary">top-start</Button>
          </Tooltip>
          <Tooltip content="Top Center" direction="top">
            <Button variant="secondary">top</Button>
          </Tooltip>
          <Tooltip content="Top End" direction="top-end">
            <Button variant="secondary">top-end</Button>
          </Tooltip>
        </Layout.HStack>

        <Layout.HStack gap="lg" justify="between">
          <Layout.VStack gap="md">
            <Tooltip content="Left Top" direction="left-top">
              <Button variant="secondary">left-top</Button>
            </Tooltip>
            <Tooltip content="Left Center" direction="left">
              <Button variant="secondary">left</Button>
            </Tooltip>
            <Tooltip content="Left Bottom" direction="left-bottom">
              <Button variant="secondary">left-bottom</Button>
            </Tooltip>
          </Layout.VStack>

          <div style={{ padding: 'var(--semantic-space-lg)' }}>중앙 영역</div>

          <Layout.VStack gap="md">
            <Tooltip content="Right Top" direction="right-top">
              <Button variant="secondary">right-top</Button>
            </Tooltip>
            <Tooltip content="Right Center" direction="right">
              <Button variant="secondary">right</Button>
            </Tooltip>
            <Tooltip content="Right Bottom" direction="right-bottom">
              <Button variant="secondary">right-bottom</Button>
            </Tooltip>
          </Layout.VStack>
        </Layout.HStack>

        <Layout.HStack gap="lg" justify="center">
          <Tooltip content="Bottom Start" direction="bottom-start">
            <Button variant="secondary">bottom-start</Button>
          </Tooltip>
          <Tooltip content="Bottom Center" direction="bottom">
            <Button variant="secondary">bottom</Button>
          </Tooltip>
          <Tooltip content="Bottom End" direction="bottom-end">
            <Button variant="secondary">bottom-end</Button>
          </Tooltip>
        </Layout.HStack>
      </Layout.VStack>
    </Layout.Container>
  ),
};
