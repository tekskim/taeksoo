import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { ContextMenu } from './index';

const meta: Meta<typeof ContextMenu> = {
  title: 'Overlay/Context Menu',
  component: ContextMenu.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ContextMenu

ContextMenu는 트리거 기반 팝업 메뉴를 제공하는 컴포넌트입니다.

## 스타일 옵션
### 방향 (Direction)
- **bottom**: 아래쪽으로 열림 (기본값)
- **top**: 위쪽으로 열림
- **left/right**: 좌우로 열림
- **start/end**: 정렬 옵션 조합 가능

### 상태
- **기본**: 일반적인 컨텍스트 메뉴
- **서브메뉴**: 중첩된 메뉴 구조 지원
- **비활성화**: disabled 상태 지원

## 주요 기능
- **Portal 렌더링**: z-index 문제 해결 및 overflow 제약 해제
- **키보드 네비게이션**: 방향키, Enter, Esc 키 지원
- **자동 위치 조정**: 화면 경계에 따른 스마트 포지셔닝
- **중첩 메뉴**: 무제한 서브메뉴 구조 지원

## 사용 가이드라인
### 언제 사용하나요?
- 사용자 계정 메뉴, 설정 메뉴
- 컨텍스트 메뉴, 액션 메뉴
- 복잡한 옵션이 필요한 드롭다운

### 언제 사용하지 말아야 하나요?
- 단순한 선택 목록 (Dropdown 사용)
- 항상 보여져야 하는 메뉴
- 모바일에서 복잡한 중첩 구조

### 사용 팁
- 메뉴 항목은 7개 이하로 제한
- 위험한 액션에는 danger 속성 사용
- 서브메뉴는 2단계까지만 권장
- 명확한 라벨과 아이콘 사용

## 접근성
- **키보드 지원**: Tab, 방향키, Enter, Esc
- **스크린 리더**: role="menu", aria-label 지원
- **포커스 관리**: 자동 포커스 및 순환 네비게이션
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Bottom 방향
export const Default: Story = {
  render: () => (
    <ContextMenu.Root
      direction="top"
      subContextMenuDirection="right-top"
      gap={8}
      trigger={({ toggle }) => <Button onClick={toggle}>사용자 메뉴</Button>}
    >
      <ContextMenu.Item action={() => console.log('프로필 보기')}>프로필 보기</ContextMenu.Item>
      <ContextMenu.SubItems label={'설정'} subContextMenuDirection="right-top">
        <ContextMenu.Item action={() => console.log('계정 설정')} preventCloseAfterAction>
          계정 설정
        </ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('알림 설정')}>알림 설정</ContextMenu.Item>
        <ContextMenu.SubItems label={'고급 설정'}>
          <ContextMenu.Item action={() => console.log('계정 삭제')} danger>
            계정 삭제
          </ContextMenu.Item>
          <ContextMenu.Item action={() => console.log('관리자 전용')} disabled>
            관리자 전용
          </ContextMenu.Item>
          <ContextMenu.Item action={() => console.log('데이터 내보내기')}>
            데이터 내보내기
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.Item action={() => console.log('도움말')}>도움말</ContextMenu.Item>
      </ContextMenu.SubItems>
    </ContextMenu.Root>
  ),
};

// 8방향 테스트
export const AllDirections: Story = {
  args: {
    direction: 'bottom',
    gap: 8,
  },
  render: (args) => (
    <div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <ContextMenu.Root
          direction="left"
          gap={args.gap}
          trigger={({ toggle }) => <Button onClick={toggle}>Left</Button>}
        >
          <div style={{ padding: '12px', minWidth: '150px' }}>Left 방향</div>
        </ContextMenu.Root>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ContextMenu.Root
            direction="top-start"
            gap={args.gap}
            trigger={({ toggle }) => <Button onClick={toggle}>Top-Start</Button>}
          >
            <div style={{ padding: '12px', minWidth: '150px' }}>Top-Start 방향</div>
          </ContextMenu.Root>

          <ContextMenu.Root
            direction="top"
            gap={args.gap}
            trigger={({ toggle }) => <Button onClick={toggle}>Top</Button>}
          >
            <div style={{ padding: '12px', minWidth: '150px' }}>Top 방향</div>
          </ContextMenu.Root>

          <ContextMenu.Root
            direction="top-end"
            gap={args.gap}
            trigger={({ toggle }) => <Button onClick={toggle}>Top-End</Button>}
          >
            <div style={{ padding: '12px', minWidth: '150px' }}>Top-End 방향</div>
          </ContextMenu.Root>
        </div>

        <ContextMenu.Root
          direction="right"
          gap={args.gap}
          trigger={({ toggle }) => <Button onClick={toggle}>Right</Button>}
        >
          <div style={{ padding: '12px', minWidth: '150px' }}>Right 방향</div>
        </ContextMenu.Root>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <ContextMenu.Root
          direction="bottom-start"
          gap={args.gap}
          trigger={({ toggle }) => <Button onClick={toggle}>Bottom-Start</Button>}
        >
          <div style={{ padding: '12px', minWidth: '150px' }}>Bottom-Start 방향</div>
        </ContextMenu.Root>

        <ContextMenu.Root
          direction="bottom"
          gap={args.gap}
          trigger={({ toggle }) => <Button onClick={toggle}>Bottom</Button>}
        >
          <div style={{ padding: '12px', minWidth: '150px' }}>Bottom 방향</div>
        </ContextMenu.Root>

        <ContextMenu.Root
          direction="bottom-end"
          gap={args.gap}
          trigger={({ toggle }) => <Button onClick={toggle}>Bottom-End</Button>}
        >
          <div style={{ padding: '12px', minWidth: '150px' }}>Bottom-End 방향</div>
        </ContextMenu.Root>
      </div>
    </div>
  ),
};
