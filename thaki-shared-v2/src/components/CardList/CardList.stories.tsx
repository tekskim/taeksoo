/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { CardList } from './index';

const meta: Meta<typeof CardList> = {
  title: 'Data Display/CardList',
  component: CardList,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component: `
# CardList

CardList는 카드 UI 컴포넌트를 반복적으로 렌더링하는 컨테이너 컴포넌트입니다. 로딩, 빈 데이터, 에러 상태를 자동으로 처리하여 일관된 사용자 경험을 제공합니다.

## 스타일 옵션

### 크기 (Size)
- **기본**: 자동 크기 조정 (컨텐츠에 따라)
- **고정**: numbersOfSkeleton으로 스켈레톤 개수 제어

### 상태 (State)
- **로딩 상태**: 데이터를 불러오는 중 (스켈레톤 표시)
- **빈 데이터 상태**: 데이터가 없을 때 (emptyUI 표시)
- **에러 상태**: 데이터 로딩 실패 시 (errorUI 표시)
- **정상 상태**: 데이터가 있을 때 (카드 리스트 표시)

## 주요 기능
- 자동 상태 관리: 로딩, 빈 데이터, 에러 상태를 자동으로 처리
- 스켈레톤 UI: 로딩 중 사용자에게 시각적 피드백 제공
- 유연한 렌더링: children 함수를 통한 커스텀 카드 렌더링
- 에러 처리: 전역 및 지역 에러 상태를 별도로 처리

## 사용 가이드라인

### 언제 사용하나요?
- 카드 형태의 데이터를 리스트로 표시할 때
- 로딩 상태와 빈 데이터 처리가 필요한 경우
- API 데이터를 카드 형태로 렌더링할 때
- 일관된 로딩/에러 UI가 필요한 경우

### 언제 사용하지 말아야 하나요?
- 단순한 텍스트 리스트 (ul, ol 태그 사용)
- 테이블 형태의 데이터 (Table 컴포넌트 사용)
- 단일 카드만 필요한 경우 (Card 컴포넌트 사용)
- 복잡한 그리드 레이아웃이 필요한 경우 (복잡한 레이아웃을 자동으로 잡아주지 않습니다. className을 주입하여 개발자의 스타일 설정이 필요합니다.)

### 사용 팁
- numbersOfSkeleton으로 로딩 시 표시할 스켈레톤 개수 설정
- errorUI와 emptyUI를 명확하게 구분하여 사용자에게 적절한 메시지 제공
- children 함수에서 key prop을 반드시 설정하세요
- 로딩 상태일 때는 스켈레톤 UI를, 데이터가 없을 때는 emptyUI를 표시

## 접근성
- 스크린 리더 지원
- 키보드 네비게이션 지원
- 로딩 상태에 대한 적절한 접근성 정보 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
};

type Story = StoryObj<typeof meta>;

/**
 * @example
 * 예시 데이터입니다.
 */
const TEST_LIST = [
  { id: '1', name: 'Alice Kim', age: 20 },
  { id: '2', name: 'Brian Park', age: 21 },
  { id: '3', name: 'Cathy Lee', age: 22 },
  { id: '4', name: 'David Choi', age: 24 },
  { id: '5', name: 'Eunji Han', age: 25 },
];

/**
 * @example
 * 예시 카드 컴포넌트
 */
const Card = ({ item }: { item: (typeof TEST_LIST)[number] }) => {
  return (
    <div
      key={item.id}
      style={{
        borderRadius: '12px',
        border: '1px solid var(--semantic-color-border)',
        background: 'var(--semantic-color-surface)',
        boxShadow: 'var(--semantic-shadow-card)',
        padding: '20px 24px',
        color: 'var(--semantic-color-text)',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        boxSizing: 'border-box',
      }}
    >
      {item.name} {item.age}
    </div>
  );
};

/**
 * @example
 * 스켈레톤 컴포넌트 예시입니다.
 */
const Skeleton = () => {
  return (
    <div
      style={{
        width: '150px',
        height: '70px',
        background:
          'linear-gradient(90deg, var(--semantic-color-surfaceSubtle) 25%, var(--semantic-color-surfaceMuted) 50%, var(--semantic-color-surfaceSubtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
        borderRadius: '12px',
        border: '1px solid var(--semantic-color-border)',
      }}
    >
      <style>
        {`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </div>
  );
};

/**
 * @example
 * 일반적인 사용 예시입니다.
 */
const Default: Story = {
  render: args => {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CardList
          {...args}
          list={TEST_LIST}
          errorUI={
            <div style={{ color: 'var(--semantic-color-error)' }}>
              카드 리스트 전역 에러가 발생했습니다.
            </div>
          }
          emptyUI={
            <div style={{ color: 'var(--semantic-color-info)' }}>
              데이터가 없습니다.
            </div>
          }
          skeletonUI={<Skeleton />}
        >
          {(item, _index) => {
            return <Card key={item.id} item={item} />;
          }}
        </CardList>
      </main>
    );
  },
  args: {
    isLoading: false,
    numbersOfSkeleton: 5,
  },
};

/**
 * @example
 * 아래의 예시처럼 스켈레톤 요소를 주입하는게 아니라 클래스네임이나 스타일로 설정할 수 있습니다.
 * 스켈레톤 요소를 주입하지 않으면서, 데이터 페칭 시의 리스트 사용 예시입니다.
 */
const CardListWithSkeletonStyle: Story = {
  render: _args => {
    const [list, setList] = useState<typeof TEST_LIST | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    /**
     * @example
     * 실제 환경에서 데이터 페칭 시도 이후 3초가 지나고 리스트 상태를 업데이트해 카드리스트를 사용하는 환경에 대한 예시입니다.
     */
    useEffect(() => {
      setIsLoading(true);

      setTimeout(() => {
        setList(TEST_LIST);
        setIsLoading(false);
      }, 3000);
    }, []);

    return (
      <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CardList
          list={list} // <-- skeletonUI를 주입하지 않고 스켈레톤을 표시하려면 리스트의 원소는 object 타입이어야 합니다.
          isLoading={isLoading}
          errorUI={
            <div style={{ color: 'var(--semantic-color-error)' }}>
              카드 리스트 전역 에러가 발생했습니다.
            </div>
          }
          emptyUI={
            <div style={{ color: 'var(--semantic-color-info)' }}>
              데이터가 없습니다.
            </div>
          }
          numbersOfSkeleton={5}
          // skeletonUI={<Skeleton />} <-- 이렇게 주입 안해도 아래처럼 isLoading 같은 플래그값으로 스켈레톤 스타일 설정 가능합니다.
        >
          {(item, _index) => {
            return (
              <div
                key={item.id}
                style={{
                  ...(isLoading
                    ? {
                        width: '150px',
                        height: '70px',
                        background:
                          'linear-gradient(90deg, var(--semantic-color-surfaceSubtle) 25%, var(--semantic-color-surfaceMuted) 50%, var(--semantic-color-surfaceSubtle) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s infinite',
                        borderRadius: '12px',
                        border: '1px solid var(--semantic-color-border)',
                        textIndent: '-9999px',
                      }
                    : {
                        borderRadius: '12px',
                        border: '1px solid var(--semantic-color-border)',
                        background: 'var(--semantic-color-surface)',
                        boxShadow: 'var(--semantic-shadow-card)',
                        padding: '20px 24px',
                        color: 'var(--semantic-color-text)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        boxSizing: 'border-box',
                      }),
                }}
              >
                {`${item.name} ${item.age}`}
                {/**
                 * 로딩일 때 스켈레톤이 보여질 경우, 보여질 데이터가 중첩 객체 내부에 있다면, 아래 예시처럼 옵셔널 체이닝 사용 필요
                 * @example
                 * {`${item.profile?.gender} ${item.profile?.birthday}`}
                 */}
                <style>
                  {`
                    @keyframes loading {
                      0% { background-position: 200% 0; }
                      100% { background-position: -200% 0; }
                    }
                  `}
                </style>
              </div>
            );
          }}
        </CardList>
      </main>
    );
  },
  args: {},
};

export default meta;
export { CardListWithSkeletonStyle, Default };
