import type { Meta, StoryObj } from '@storybook/react';
import { RefreshButton } from './RefreshButton';

const meta: Meta<typeof RefreshButton> = {
  title: 'Form/RefreshButton',
  component: RefreshButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# RefreshButton

RefreshButton은 데이터를 새로고침하는 특수한 버튼 컴포넌트입니다. 자동 새로고침과 수동 새로고침을 모두 지원하며, TanStack Query와 완벽하게 연동됩니다.

## 스타일 옵션

### 크기 (Size)
- **sm**: 작은 크기 (테이블 액션, 인라인 요소)
- **md**: 기본 크기 (일반적인 사용)
- **lg**: 큰 크기 (주요 새로고침 버튼, 모바일 친화적)

### 외관 (Appearance)
- **ghost**: 투명한 배경 (기본값, 가장 일반적)
- **outline**: 테두리만 있는 스타일
- **solid**: 배경이 채워진 스타일

### 상태 (State)
- **기본 상태**: 정상적인 새로고침 가능 상태
- **로딩 상태**: 새로고침 진행 중 (회전 애니메이션)
- **카운트다운 상태**: 자동 새로고침까지 남은 시간 표시

## 주요 기능
- 자동 새로고침: 설정된 duration 후 자동으로 새로고침 실행
- 수동 새로고침: 사용자가 버튼을 클릭하여 즉시 새로고침 실행
- TanStack Query 연동: useQuery의 refetch 함수와 완벽 호환
- 웹 접근성: 키보드 네비게이션 및 스크린 리더 지원

## 사용 가이드라인

### 언제 사용하나요?
- 데이터 새로고침이 필요한 테이블, 리스트, 차트
- 실시간 데이터를 주기적으로 업데이트해야 하는 경우
- TanStack Query의 refetch 함수와 함께 사용할 때
- 대시보드나 모니터링 화면에서 실시간 데이터 표시

### 언제 사용하지 말아야 하나요?
- 일반적인 브라우저 새로고침으로 충분한 경우
- 폼 제출이나 데이터 입력 후 제출하는 경우
- 페이지 이동이나 모달 열기 같은 네비게이션 액션
- 새로고침이 아닌 다른 액션을 수행하는 경우

### 사용 팁
- duration은 5-30초 사이의 적절한 간격으로 설정하세요 (기본 10초)
- TanStack Query 연동 시 refetch 함수를 onRefresh에 전달하세요
- 새로고침 중에는 버튼 비활성화를 고려하세요
- 모바일에서는 터치 친화적인 크기 설정을 하세요 (최소 44px)

## 접근성
- 키보드 네비게이션 지원 (Tab, Enter, Space)
- 스크린 리더 지원
- 포커스 표시기 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: 'number',
      description: '자동 새로고침 간격 (밀리초, 기본값: 10000)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼 외관',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onRefresh: {
      description: '새로고침 실행 시 호출되는 함수 (필수)',
      action: 'refreshed',
    },
    onClick: {
      description: '버튼 클릭 시 호출되는 함수 (선택)',
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    duration: 5000,
    size: 'md',
    appearance: 'ghost',
    onRefresh: () => console.log('refreshed'),
    onClick: () => console.log('clicked'),
  },
};
