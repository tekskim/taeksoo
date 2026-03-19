import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Layout from '../Layout';
import { Typography } from '../Typography';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Data Display/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Pagination

Pagination은 대량의 데이터를 여러 페이지로 나누어 표시하는 컴포넌트입니다. 사용자가 페이지를 쉽게 탐색할 수 있도록 이전/다음 버튼과 페이지 번호를 제공합니다.

## 스타일 옵션

### 크기 (Size)
- **기본**: 표준 크기 (일반적인 사용)
- **컴팩트**: 작은 크기 (공간이 제한된 경우)

### 상태 (State)
- **기본 상태**: 정상적인 페이지 탐색 가능 상태
- **비활성화 상태**: 이전/다음 버튼이 비활성화된 상태
- **현재 페이지**: 현재 선택된 페이지 강조 표시

## 주요 기능
- 페이지 번호 표시: 현재 페이지와 주변 페이지 번호 표시
- 이전/다음 버튼: 페이지 간 빠른 이동 지원
- 키보드 네비게이션: 방향키로 페이지 이동 가능

## 사용 가이드라인

### 언제 사용하나요?
- 대량의 데이터를 페이지별로 나누어 표시할 때
- 테이블, 리스트, 카드 목록 등의 페이지네이션
- 검색 결과나 필터링된 데이터의 페이지 탐색
- 사용자가 특정 페이지로 직접 이동해야 할 때

### 언제 사용하지 말아야 하나요?
- 데이터가 적어서 페이지네이션이 불필요한 경우
- 무한 스크롤이 더 적합한 경우
- 단일 페이지로 충분한 콘텐츠인 경우
- 모바일에서 터치 스크롤이 더 자연스러운 경우

### 사용 팁
- totalCount와 size를 정확히 계산하여 전달하세요
- currentAt은 1부터 시작하는 페이지 번호입니다
- onPageChange 콜백에서 페이지 변경 로직을 처리하세요
- 페이지 크기는 사용자 경험을 고려하여 적절히 설정하세요
- 서버사이드 페이지네이션 사용 시, useQuery와 함께 사용하세요

## 접근성
- 키보드 네비게이션 지원 (Tab, Enter, 방향키)
- 스크린 리더 지원
- 현재 페이지에 대한 명확한 표시
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    totalCount: {
      control: 'number',
      description: '전체 항목 수',
    },
    size: {
      control: 'number',
      description: '페이지당 항목 수',
    },
    currentAt: {
      control: 'number',
      description: '현재 페이지 (1부터 시작)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalCount: 100,
    size: 10,
    currentAt: 1,
    onPageChange: () => {},
  },

  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentPage, setCurrentPage] = useState(3);

    const totalCount = 250;
    const pageSize = 20;

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">
          현재 페이지: {currentPage} / {Math.ceil(totalCount / pageSize)}
        </Typography.Text>

        <Pagination
          totalCount={totalCount}
          size={pageSize}
          currentAt={currentPage}
          onPageChange={setCurrentPage}
        />
      </Layout.VStack>
    );
  },
};
