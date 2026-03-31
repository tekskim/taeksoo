import type { Meta, StoryObj } from '@storybook/react';
import { Dim } from './index';

const meta: Meta<typeof Dim> = {
  title: 'Overlay/Dim',
  component: Dim,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component: `
# Dim

Dim은 화면(또는 컨테이너) 위에 깔리는 반투명 레이어입니다. Overlay(Modal/Drawer)와 함께 사용하여 배경과의 레이어 구분과 포커싱을 돕습니다.

## 스타일 옵션
### 크기/포지션
- **cssOptions**: CSS 속성을 그대로 주입해 원하는 영역을 덮도록 제어합니다. (예: fixed 전체 화면, absolute 컨테이너 채우기, 웬만하면 블러 및 투명도 제어해주세요)

## 주요 기능
- **가시성 토글**:
  -
  -
- **전파 차단**: 배경 클릭을 막고 상호작용을 Dim에서 처리(onClick)할 수 있습니다.

## 사용 가이드라인
### 언제 사용하나요?
- 모달, 드로어 등 오버레이가 열렸을 때 배경을 흐리게 처리할 때
- 사용자의 시선을 특정 영역에 집중시키고 싶을 때

### 언제 사용하지 말아야 하나요?
- 단순한 구분만 필요한 경우(Section 구분은 Surface/Block 사용 권장)
- 클릭 차단이 필요 없는 상황에서 상호작용을 막아 혼란을 줄 수 있는 경우

## 접근성
- role="presentation"과 aria-hidden을 통해 시멘틱을 최소화합니다.
- 오버레이(Modal/Drawer)와 함께 키보드 포커스 트랩 및 ESC 동작을 구현하세요.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    appeared: {
      control: 'boolean',
      description: 'Dim 표시 여부',
    },
    cssOptions: {
      control: 'object',
      description: '적용할 인라인 CSS. 위치/크기 제어 용도',
    },
    onClick: {
      description: 'Dim 클릭 시 호출되는 핸들러(예: 오버레이 닫기)',
    },
  },
};

type Story = StoryObj<typeof meta>;

const Default: Story = {
  args: {
    cssOptions: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
    },
  },
  render: (args) => {
    return <Dim {...args} appeared />;
  },
};

const InContainer: Story = {
  args: {
    cssOptions: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  render: (args) => {
    return (
      <div
        style={{
          position: 'relative',
          width: 360,
          height: 220,
          border: '1px solid var(--semantic-color-border)',
          borderRadius: 'var(--semantic-radius-card)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 16 }}>앱 프레임 내부를 덮는 Dim</div>
        <Dim {...args} appeared />
      </div>
    );
  },
};

export default meta;
export { Default, InContainer };
