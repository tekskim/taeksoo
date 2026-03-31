import type { Meta, StoryObj } from '@storybook/react';
import { useOverlay } from '../../services/hooks';
import { Button } from '../Button';
import { Overlay } from './Overlay';
import { OverlayProps } from './Overlay.Template';

/** 모달 선언 시 OverlayProps 인터페이스를 import 하여 확장해 사용해주세요 */
interface TestOverlayProps extends OverlayProps {
  content: string;
  testNumber: number;
}

/**
 * @description 오버레이 컴포넌트 세팅
 *
 * 아래처럼 앱의 최상위에서 OverlayProvider와 Overlay.Container를 세팅해주세요.
 *
 * ```tsx
 * @example
 * import { OverlayProvider, Overlay, createOverlayStore } from '@thaki/shared';
 *
 * const overlayStore = createOverlayStore();
 *
 * const App = () => (
 *   <OverlayProvider overlayStore={overlayStore}>
 *     <YourApp />
 *     <Overlay.Container />
 *   </OverlayProvider>
 * );
 * ```
 *
 * 컴포넌트에서는 useOverlay 훅을 사용하여 오버레이를 호출합니다.
 *
 * ```tsx
 * @example
 * import { useOverlay } from '@thaki/shared';
 *
 * const MyComponent = () => {
 *   const { openOverlay } = useOverlay();
 *
 *   const handleClick = async () => {
 *     const result = await openOverlay({
 *       component: MyModal,
 *       props: { data: 'example' },
 *       options: { type: 'modal' },
 *     });
 *   };
 * };
 * ```
 */

// 테스트용 오버레이 컴포넌트
const TestOverlay = ({ content, testNumber, onConfirm, onCancel, ...props }: TestOverlayProps) => {
  return (
    /**
     * @example
     * 아래처럼 오버레이 컴포넌트는 Overlay.Template 컴포넌트를 사용하여 생성합니다.
     * 넣고 싶은 로직은 Overlay.Template의 children에 작성합니다.
     * onConfirm은 오버레이에서 확인 또는 성공 버튼을 눌렀을 경우 호출되는 함수입니다. 인자를 받아서 openOverlay 함수의 반환값으로 전달합니다.
     * onCancel은 오버레이에서 취소 버튼을 눌렀을 경우 호출되는 함수입니다. openOverlay 함수를 호출한 곳에서 취소로직 이후에 Promise.reject을 호출해 함수 실행을 중단하려면 rejectOnCancel 옵션을 true로 설정하세요.
     *
     * 오버레이 렌더링을 위한 세팅으로는 Overlay.Container 컴포넌트를 앱의 레이아웃 등에서 사용해주세요. (스토리북 기준 preview.tsx에 적용되어 있음)
     */
    <Overlay.Template {...props} onConfirm={() => onConfirm(true)} onCancel={onCancel}>
      <div>{content}</div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <div>testNumber: {testNumber}</div>
      </div>
    </Overlay.Template>
  );
};

const meta: Meta<typeof Overlay.Template> = {
  title: 'Overlay/Modal',
  component: Overlay.Template,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Overlay

Overlay는 모달, 드로어 등 화면 위에 표시되는 오버레이 UI를 관리하는 시스템입니다.

## 설정 방법

### 1. App 레벨에서 Provider 설정

\`\`\`tsx
import { OverlayProvider, Overlay, createOverlayStore } from '@thaki/shared';

const overlayStore = createOverlayStore();

const App = () => (
  <OverlayProvider overlayStore={overlayStore}>
    <YourApp />
    <Overlay.Container overlayStore={overlayStore} />
  </OverlayProvider>
);
\`\`\`

### 2. 컴포넌트에서 사용

\`\`\`tsx
import { useOverlay } from '@thaki/shared';

const MyComponent = () => {
  const { openOverlay } = useOverlay();

  const handleDelete = async () => {
    const confirmed = await openOverlay({
      component: DeleteModal,
      props: { itemName: 'User' },
      options: {
        type: 'modal',
        title: 'Delete User',
      },
    });

    if (confirmed) {
      // 삭제 로직
    }
  };
};
\`\`\`

## 스타일 옵션
### 타입 (Type)
- **modal**: 중앙에 표시되는 모달
- **drawer-horizontal**: 하단에서 올라오는 수평 드로어
- **drawer-vertical**: 우측에서 나오는 수직 드로어

## Props 옵션
### 기본 옵션
- **type**: 오버레이 타입 (기본값: 'drawer-horizontal')
- **title**: 오버레이 제목
- **description**: 오버레이 설명 텍스트
- **showDim**: 배경 딤 표시 여부 (기본값: true)
- **closeOnDimClick**: 딤 클릭 시 오버레이 닫기 여부 (기본값: true)

### 버튼 옵션
- **confirmUI**: 확인 버튼 텍스트/컴포넌트 (기본값: 'Save')
- **cancelUI**: 취소 버튼 텍스트/컴포넌트 (기본값: 'Cancel')
- **footer**: 커스텀 푸터 컴포넌트

### 고급 옵션
- **isGlobal**: 전역 포털 렌더링 여부 (기본값: false)
- **duration**: 오버레이 애니메이션 지속 시간(ms) (기본값: 300)
- **rejectOnCancel**: 취소 버튼 클릭 시 Promise를 실패시켜 함수 실행을 중단시키는 옵션

## 주요 기능
- **Promise 기반**: async/await로 오버레이 결과 처리
- **Hook 기반 관리**: useOverlay 훅으로 어디서든 오버레이 호출
- **컴포넌트 분리**: 재사용 가능한 오버레이 컴포넌트 구조
- **스크롤 잠금**: 오버레이 표시 시 배경 스크롤 방지

## 사용 가이드라인
### 언제 사용하나요?
- 사용자 확인이 필요한 중요한 액션
- 폼 입력이나 설정 변경이 필요한 경우
- 추가 정보나 상세 내용을 표시할 때

### 언제 사용하지 말아야 하나요?
- 단순한 정보 표시 (Toast 사용 권장)
- 자주 반복되는 간단한 액션
- 페이지 이동이 필요한 경우

## 접근성
- 키보드 네비게이션 지원 (Escape)
- 스크린 리더 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['modal', 'drawer-horizontal', 'drawer-vertical'],
      description: '오버레이 타입',
    },
    title: {
      control: 'text',
      description: '오버레이 제목',
    },
    description: {
      control: 'text',
      description: '오버레이 설명',
    },
    showDim: {
      control: 'boolean',
      description: '배경 딤 표시 여부',
    },
    closeOnDimClick: {
      control: 'boolean',
      description: '딤 클릭 시 닫기 여부',
    },
    confirmUI: {
      control: 'text',
      description: '확인 버튼 텍스트/컴포넌트',
    },
    cancelUI: {
      control: 'text',
      description: '취소 버튼 텍스트/컴포넌트',
    },
    isGlobal: {
      control: 'boolean',
      description: '전역 포털 렌더링 여부',
    },
    duration: {
      control: 'number',
      description: '오버레이 애니메이션 지속 시간(ms)',
    },
    rejectOnCancel: {
      control: 'boolean',
      description: '취소 버튼 클릭 시 Promise를 실패시켜 함수 실행을 중단시키는 옵션',
    },
  },
};

type Story = StoryObj<typeof meta>;

// Story wrapper component to use the hook
const StoryWrapper = ({
  args,
  content,
  testNumber,
}: {
  args: any;
  content: string;
  testNumber: number;
}) => {
  const { openOverlay } = useOverlay();

  const handleClick = async () => {
    const result = await openOverlay({
      component: TestOverlay,
      props: {
        content,
        testNumber,
      },
      options: args,
    });
    console.log('Overlay result:', result);
  };

  return <Button onClick={handleClick}>오버레이 열기</Button>;
};

const Modal: Story = {
  args: {
    type: 'modal',
    title: '모달 제목',
    description: '모달 설명입니다.',
    showDim: true,
    closeOnDimClick: true,
    confirmUI: '확인',
    cancelUI: '취소',
    isGlobal: false,
    duration: 300,
    rejectOnCancel: true, // <-- 취소 버튼 클릭 시 Promise를 아예 실패시켜 openOverlay를 호출한 함수의 실행을 중단시키는 옵션
  },
  render: (args) => <StoryWrapper args={args} content="모달 내용입니다." testNumber={0} />,
};

const Horizontal: Story = {
  args: {
    type: 'drawer-horizontal',
    title: '수평 드로어',
    description: '수평 드로어 설명입니다.',
    showDim: true,
    closeOnDimClick: true,
    confirmUI: '확인',
    cancelUI: '취소',
    isGlobal: false,
    duration: 300,
    rejectOnCancel: false,
  },
  parameters: {
    // Docs 탭에서 이 스토리는 숨기고, 개별 페이지(Canvas)에서만 보이도록 설정
    docs: { disable: true },
  },
  render: (args) => (
    <StoryWrapper
      args={{ ...args, type: 'drawer-horizontal' }}
      content="수평 드로어 내용입니다."
      testNumber={1}
    />
  ),
};

const Vertical: Story = {
  args: {
    type: 'drawer-vertical',
    title: '수직 드로어',
    description: '수직 드로어 설명입니다.',
    showDim: true,
    closeOnDimClick: true,
    confirmUI: '확인',
    cancelUI: '취소',
    isGlobal: false,
    duration: 300,
    rejectOnCancel: false,
  },
  parameters: {
    // Docs 탭에서 이 스토리는 숨기고, 개별 페이지(Canvas)에서만 보이도록 설정
    docs: { disable: true },
  },
  render: (args) => <StoryWrapper args={args} content="수직 드로어 내용입니다." testNumber={2} />,
};

export default meta;
export { Horizontal, Modal, Vertical };
