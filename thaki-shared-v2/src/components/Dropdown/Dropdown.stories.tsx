/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown.Select> = {
  title: 'Form/Select',
  component: Dropdown.Select,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component: `
# Dropdown

Dropdown은 사용자가 옵션 목록에서 값을 선택할 수 있는 UI 컴포넌트입니다. Select와 ComboBox 두 가지 패턴을 제공합니다.

## 스타일 옵션

### 크기 (Size)
- **sm**: 작은 크기 (인라인 요소, 테이블 액션)
- **md**: 기본 크기 (일반적인 사용)
- **lg**: 큰 크기 (주요 폼 요소, 모바일 친화적)

### 패턴 (Pattern)
- **Select**: 기본 드롭다운 선택 컴포넌트
- **ComboBox**: 검색 가능한 드롭다운 컴포넌트

### 상태 (State)
- **기본 상태**: 정상적인 선택 가능 상태
- **비활성화 상태**: 현재 사용할 수 없는 상태
- **로딩 상태**: 데이터를 불러오는 중

## 주요 기능
- 스마트 포지셔닝: 화면 여백에 따라 자동으로 위치 조정
- Portal 기반 렌더링: z-index 문제 해결
- 키보드 네비게이션: 방향키, Enter, Esc 키 지원
- 웹 접근성: ARIA 속성 및 스크린 리더 지원

## 사용 가이드라인

### 언제 사용하나요?
- Select: 5-15개의 옵션에서 하나를 선택할 때
- ComboBox: 많은 옵션(15개 이상)에서 검색하여 선택할 때
- 폼 입력에서 미리 정의된 값 중에서 선택해야 할 때

### 언제 사용하지 말아야 하나요?
- 2-3개의 옵션 (RadioButton이나 Checkbox 사용 권장)
- 자유 입력이 필요한 경우 (Input 사용)
- 날짜/시간 선택 (DatePicker나 TimePicker 사용 권장)

### 사용 팁
- 옵션 개수: Select는 5-15개, ComboBox는 15개 이상 권장
- 옵션 순서: 알파벳순, 사용 빈도순, 논리적 순서로 정렬
- placeholder: 명확하고 도움이 되는 안내 텍스트 제공
- 로딩 상태: 데이터를 불러오는 동안 로딩 표시

## 접근성
- 키보드 네비게이션 지원 (방향키, Enter, Esc)
- 스크린 리더 지원
- ARIA 속성을 통한 상태 및 옵션 정보 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '선택되지 않았을 때 표시할 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '드롭다운 비활성화 여부',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태 표시 여부',
    },
    numbersOfOptionsInView: {
      control: { type: 'number', min: 1, max: 10 },
      description: '한 번에 표시할 최대 옵션 개수',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '드롭다운 크기',
    },
  },
};

type Story = StoryObj<typeof meta>;

const Default: Story = {
  args: {
    placeholder: '음료 선택',
    disabled: false,
    isLoading: false,
    numbersOfOptionsInView: 5,
    size: 'md',
  },
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string>('');

    return (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            marginTop: '10px',
            fontSize: '14px',
            color: 'gray',
            marginBottom: '20px',
          }}
        >
          선택된 값: {selectedValue ?? '-'}
        </div>

        <Dropdown.Select
          {...args}
          value={selectedValue}
          onSelect={(value) => setSelectedValue(String(value))}
        >
          <Dropdown.Option value="coffee" label="☕ 커피" onClick={(value) => console.log(value)} />
          <Dropdown.Option value="tea" label="🍵 차" disabled />
          <Dropdown.Option value="juice" label="🥤 주스" />
          <Dropdown.Option value="water" label="💧 물" />
          <Dropdown.Option value="beer" label="🍺 맥주" />
          <Dropdown.Option value="wine" label="🍷 와인" />
          <Dropdown.Option value="cocktail" label="🍹 칵테일" />
          <Dropdown.Option value="sake" label="🍶 사케" />
        </Dropdown.Select>
      </div>
    );
  },
};

const ComboBox: Story = {
  args: {
    placeholder: '음료 검색',
    disabled: false,
    isLoading: false,
    numbersOfOptionsInView: 5,
    size: 'md',
  },
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string>('water');

    return (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            marginTop: '10px',
            fontSize: '14px',
            color: 'gray',
            marginBottom: '20px',
          }}
        >
          선택된 값: {selectedValue ?? '-'}
        </div>

        <Dropdown.ComboBox
          {...args}
          value={selectedValue}
          onSelect={(value) => setSelectedValue(String(value))}
        >
          <Dropdown.Option value="coffee" label="☕ 커피" onClick={(value) => console.log(value)} />
          <Dropdown.Option value="tea" label="🍵 차" disabled />
          <Dropdown.Option value="juice" label="🥤 주스" />
          <Dropdown.Option value="water" label="💧 물" />
          <Dropdown.Option value="beer" label="🍺 맥주" />
          <Dropdown.Option value="wine" label="🍷 와인" />
          <Dropdown.Option value="cocktail" label="🍹 칵테일" />
          <Dropdown.Option value="sake" label="🍶 사케" />
        </Dropdown.ComboBox>
      </div>
    );
  },
};

export default meta;
export { ComboBox, Default };
